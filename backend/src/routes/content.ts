import { Router } from 'express'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

const router = Router()
const prisma = new PrismaClient()

// JWT 인증 미들웨어
const authenticateToken = (req: any, res: any, next: any) => {
  console.log('authenticateToken 실행')
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    console.log('토큰이 없음')
    return res.sendStatus(401)
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err: any, user: any) => {
    if (err) {
      console.log('토큰 검증 실패:', err.message)
      return res.sendStatus(403)
    }
    console.log('토큰 검증 성공:', user)
    req.user = user
    next()
  })
}

// 관리자 권한 확인 미들웨어
const requireAdmin = async (req: any, res: any, next: any) => {
  try {
    // JWT 토큰에서 userId 또는 id 필드 확인
    const userId = req.user.userId || req.user.id
    console.log('requireAdmin 실행, 사용자 ID:', userId)
    console.log('전체 user 객체:', req.user)
    
    if (!userId) {
      console.log('사용자 ID가 없음')
      return res.status(401).json({ message: '사용자 정보가 없습니다.' })
    }
    
    const user = await prisma.user.findUnique({
      where: { id: userId }
    })
    
    console.log('사용자 조회 결과:', user ? { id: user.id, role: user.role } : null)
    
    if (!user || user.role !== 'admin') {
      console.log('관리자 권한 없음')
      return res.status(403).json({ message: '관리자 권한이 필요합니다.' })
    }
    
    console.log('관리자 권한 확인됨')
    next()
  } catch (error) {
    console.error('requireAdmin 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
}


// === 모집 공고 관련 API ===

// 현재 활성 모집 공고 조회 (공개)
router.get('/recruit/active', async (req, res) => {
  try {
    const activeNotice = await prisma.recruitNotice.findFirst({
      where: { 
        isOpen: true,
        endAt: { gte: new Date() }
      },
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(activeNotice)
  } catch (error) {
    console.error('활성 모집 공고 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 지난 모집 공고 조회 (공개)
router.get('/recruit/past', async (req, res) => {
  try {
    const notices = await prisma.recruitNotice.findMany({
      where: { 
        OR: [
          { isOpen: false },
          { endAt: { lt: new Date() } }
        ]
      },
      orderBy: { createdAt: 'desc' },
      take: 10 // 최근 10개만
    })
    
    res.json(notices)
  } catch (error) {
    console.error('지난 모집 공고 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 모든 모집 공고 조회 (관리자용)
router.get('/recruit/all', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const notices = await prisma.recruitNotice.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(notices)
  } catch (error) {
    console.error('모집 공고 목록 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 모집 공고 생성 (관리자용)
router.post('/recruit', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      title, 
      bodyMd, 
      startAt, 
      endAt, 
      isOpen, 
      externalFormUrl,
      targetAudience,
      recruitCount,
      recruitMethod,
      shortDescription
    } = req.body
    
    if (!title || !bodyMd || !startAt || !endAt) {
      return res.status(400).json({ message: '필수 필드가 누락되었습니다.' })
    }
    
    const notice = await prisma.recruitNotice.create({
      data: {
        title,
        bodyMd,
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        isOpen: isOpen || false,
        externalFormUrl,
        targetAudience,
        recruitCount,
        recruitMethod,
        shortDescription
      }
    })
    
    res.json(notice)
  } catch (error) {
    console.error('모집 공고 생성 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 모집 공고 수정 (관리자용)
router.put('/recruit/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { 
      title, 
      bodyMd, 
      startAt, 
      endAt, 
      isOpen, 
      externalFormUrl,
      targetAudience,
      recruitCount,
      recruitMethod,
      shortDescription
    } = req.body
    
    const notice = await prisma.recruitNotice.update({
      where: { id },
      data: {
        title,
        bodyMd,
        startAt: startAt ? new Date(startAt) : undefined,
        endAt: endAt ? new Date(endAt) : undefined,
        isOpen,
        externalFormUrl,
        targetAudience,
        recruitCount,
        recruitMethod,
        shortDescription
      }
    })
    
    res.json(notice)
  } catch (error) {
    console.error('모집 공고 수정 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 모집 공고 삭제 (관리자용)
router.delete('/recruit/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.recruitNotice.delete({
      where: { id }
    })
    
    res.json({ message: '모집 공고가 삭제되었습니다.' })
  } catch (error) {
    console.error('모집 공고 삭제 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

export default router
