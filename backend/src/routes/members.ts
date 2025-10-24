import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { db } from '../utils/db';

const router = express.Router();

// 이메일 도메인 검증 함수
const validateEmailDomain = (email: string): boolean => {
  // 테스트/운영자 계정 예외 처리
  const allowedTestEmails = [
    'aim2024@aim.com',
    'test@example.com',
    'admin@aim.com'
  ];
  
  if (allowedTestEmails.includes(email.toLowerCase())) {
    return true;
  }
  
  // 일반 사용자는 @kookmin.ac.kr 도메인만 허용
  return email.toLowerCase().endsWith('@kookmin.ac.kr');
};

// 관리자 인증 미들웨어
const authenticateAdmin = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// 공개 멤버 목록 조회
router.get('/', async (req, res) => {
  try {
    const members = await db.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        profile: {
          select: {
            displayName: true,
            position: true,
            department: true,
            year: true,
            generation: true,
            bio: true,
            oneLiner: true,
            avatarKey: true,
            links: true,
            isPublic: true
          }
        }
      },
      where: {
        profile: {
          isPublic: true
        }
      }
    });

    res.json(members);
  } catch (error) {
    console.error('Error fetching members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== 인증된 사용자 전용 API (본인 프로필) =====
// 주의: 이 라우트들은 /:id 보다 앞에 정의되어야 합니다!

// 본인 프로필 조회 (인증된 사용자)
router.get('/me', async (req: any, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    console.log('Decoded token userId:', decoded.userId);
    
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    console.log('Found user:', user ? user.id : 'null');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const profile = await db.memberProfile.findUnique({
      where: { userId: user.id },
      select: {
        id: true,
        displayName: true,
        studentId: true,
        position: true,
        department: true,
        year: true,
        generation: true,
        bio: true,
        isPublic: true
      }
    });

    res.json({ ...user, profile });
  } catch (error) {
    console.error('Error fetching own profile:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

// 본인 프로필 수정 (인증된 사용자)
router.put('/me', async (req: any, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const userId = decoded.userId;

    const {
      displayName,
      studentId,
      position,
      department,
      year,
      generation,
      bio,
      isPublic
    } = req.body;

    // 프로필이 없으면 생성, 있으면 업데이트
    const profile = await db.memberProfile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: displayName || '',
        studentId,
        position,
        department,
        year,
        generation: generation ? parseInt(generation) : null,
        bio,
        isPublic: isPublic ?? true
      },
      update: {
        displayName: displayName || '',
        studentId,
        position,
        department,
        year,
        generation: generation ? parseInt(generation) : null,
        bio,
        isPublic: isPublic ?? true
      }
    });

    res.json(profile);
  } catch (error) {
    console.error('Error updating own profile:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 본인 비밀번호 변경 (인증된 사용자)
router.put('/me/password', async (req: any, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
    const userId = decoded.userId;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    // 현재 사용자 조회
    const user = await db.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.password) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 현재 비밀번호 확인
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
    }

    // 새 비밀번호 해시
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 비밀번호 업데이트
    await db.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 특정 멤버 프로필 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const member = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        role: true,
        profile: {
          select: {
            displayName: true,
            position: true,
            department: true,
            year: true,
            generation: true,
            bio: true,
            oneLiner: true,
            avatarKey: true,
            links: true,
            isPublic: true
          }
        },
        posts: {
          where: {
            status: 'published'
          },
          select: {
            id: true,
            title: true,
            createdAt: true,
            tags: {
              include: {
                tag: true
              }
            }
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!member || !member.profile?.isPublic) {
      return res.status(404).json({ error: 'Member not found or profile not public' });
    }

    res.json(member);
  } catch (error) {
    console.error('Error fetching member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// ===== 관리자 전용 API =====

// 모든 멤버 조회 (관리자용)
router.get('/admin/all', authenticateAdmin, async (req, res) => {
  try {
    const members = await db.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        profile: {
          select: {
            id: true,
            displayName: true,
            studentId: true,
            position: true,
            department: true,
            year: true,
            generation: true,
            bio: true,
            isPublic: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(members);
  } catch (error) {
    console.error('Error fetching all members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 멤버 프로필 업데이트 (관리자용)
router.put('/admin/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const { 
      name, 
      email, 
      role,
      displayName, 
      studentId, 
      position, 
      department, 
      year,
      generation,
      bio, 
      isPublic 
    } = req.body;

    // 이메일이 변경되는 경우 도메인 검증
    if (email && !validateEmailDomain(email)) {
      return res.status(400).json({ 
        error: '국민대학교 이메일(@kookmin.ac.kr)을 사용해주세요.' 
      });
    }

    // 사용자 정보 업데이트
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        ...(name && { name }),
        ...(email && { email }),
        ...(role && { role }),
        updatedAt: new Date()
      }
    });

    // 프로필 정보 업데이트 (upsert 사용)
    const updatedProfile = await db.memberProfile.upsert({
      where: { userId },
      create: {
        userId,
        displayName: displayName || name,
        studentId,
        position,
        department,
        year,
        generation: generation ? parseInt(generation) : null,
        bio,
        isPublic: isPublic !== undefined ? isPublic : true
      },
      update: {
        ...(displayName && { displayName }),
        ...(studentId !== undefined && { studentId }),
        ...(position !== undefined && { position }),
        ...(department !== undefined && { department }),
        ...(year !== undefined && { year }),
        ...(generation !== undefined && { generation: generation ? parseInt(generation) : null }),
        ...(bio !== undefined && { bio }),
        ...(isPublic !== undefined && { isPublic })
      }
    });

    res.json({
      user: updatedUser,
      profile: updatedProfile
    });
  } catch (error) {
    console.error('Error updating member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 새 멤버 생성 (관리자용)
router.post('/admin', authenticateAdmin, async (req, res) => {
  try {
    const { 
      name, 
      email, 
      role = 'member',
      displayName, 
      studentId, 
      position, 
      department, 
      year,
      generation,
      bio, 
      isPublic = true 
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // 이메일 도메인 검증
    if (!validateEmailDomain(email)) {
      return res.status(400).json({ 
        error: '국민대학교 이메일(@kookmin.ac.kr)을 사용해주세요.' 
      });
    }

    // 이메일 앞부분을 초기 비밀번호로 사용
    const initialPassword = email.split('@')[0];
    const hashedPassword = await bcrypt.hash(initialPassword, 12);

    // 사용자 생성
    const newUser = await db.user.create({
      data: {
        name,
        email,
        role,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    // 프로필 생성
    const newProfile = await db.memberProfile.create({
      data: {
        userId: newUser.id,
        displayName: displayName || name,
        studentId,
        position,
        department,
        year,
        generation: generation ? parseInt(generation) : null,
        bio,
        isPublic
      }
    });

    res.status(201).json({
      user: newUser,
      profile: newProfile
    });
  } catch (error) {
    console.error('Error creating member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 멤버 삭제 (관리자용)
router.delete('/admin/:userId', authenticateAdmin, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = (req as any).user?.id;

    if (currentUserId === userId) {
      return res.status(403).json({ 
        error: 'Cannot delete your own account',
        message: '자신의 계정은 삭제할 수 없습니다.'
      });
    }
    // 삭제하려는 사용자 정보 조회
    const userToDelete = await db.user.findUnique({
      where: { id: userId },
      select: { email: true, role: true }
    });

    if (!userToDelete) {
      return res.status(404).json({ error: 'User not found' });
    }

    // 슈퍼계정 삭제 방지
    const superAccounts = [
      'aim2024@kookmin.ac.kr',
    ];

    if (superAccounts.includes(userToDelete.email)) {
      return res.status(403).json({ 
        error: 'Cannot delete super admin account',
        message: '슈퍼관리자 계정은 삭제할 수 없습니다.'
      });
    }

    // 프로필 먼저 삭제
    await db.memberProfile.deleteMany({
      where: { userId }
    });

    // 사용자 삭제
    await db.user.delete({
      where: { id: userId }
    });

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('Error deleting member:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
