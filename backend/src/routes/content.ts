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

// 테스트용 공개 API - 모든 모집 공고 조회
router.get('/recruit/all-public', async (req, res) => {
  try {
    console.log('공개 API로 모든 모집 공고 조회')
    const notices = await prisma.recruitNotice.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    console.log('조회된 모집 공고 수:', notices.length)
    res.json(notices)
  } catch (error) {
    console.error('모집 공고 조회 오류:', error)
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

// 소개 내용 조회 (관리자용)
router.get('/about', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const aboutContents = await prisma.aboutContent.findMany({
      orderBy: { createdAt: 'desc' }
    })
    
    res.json(aboutContents)
  } catch (error) {
    console.error('소개 내용 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 소개 내용 생성 (관리자용)
router.post('/about', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, content } = req.body
    
    const aboutContent = await prisma.aboutContent.create({
      data: {
        title,
        content
      }
    })
    
    res.json(aboutContent)
  } catch (error) {
    console.error('소개 내용 생성 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 소개 내용 수정 (관리자용)
router.put('/about/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { title, content } = req.body
    
    const aboutContent = await prisma.aboutContent.update({
      where: { id },
      data: {
        title,
        content
      }
    })
    
    res.json(aboutContent)
  } catch (error) {
    console.error('소개 내용 수정 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 소개 내용 삭제 (관리자용)
router.delete('/about/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.aboutContent.delete({
      where: { id }
    })
    
    res.json({ message: '소개 내용이 삭제되었습니다.' })
  } catch (error) {
    console.error('소개 내용 삭제 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 소개 섹션 조회 (공개)
router.get('/about/sections', async (req, res) => {
  try {
    const sections = await prisma.aboutSection.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    res.json(sections)
  } catch (error) {
    console.error('소개 섹션 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 소개 섹션 관리 (관리자용)
router.get('/about/sections/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const sections = await prisma.aboutSection.findMany({
      orderBy: { order: 'asc' }
    })
    
    res.json(sections)
  } catch (error) {
    console.error('소개 섹션 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 소개 섹션 생성/수정 (관리자용)
router.post('/about/sections', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type, title, content, order } = req.body
    
    const section = await prisma.aboutSection.create({
      data: {
        type,
        title,
        content,
        order: order || 0
      }
    })
    
    res.json(section)
  } catch (error) {
    console.error('소개 섹션 생성 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.put('/about/sections/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { type, title, content, order } = req.body
    
    const section = await prisma.aboutSection.update({
      where: { id },
      data: {
        type,
        title,
        content,
        order: order || 0
      }
    })
    
    res.json(section)
  } catch (error) {
    console.error('소개 섹션 수정 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.delete('/about/sections/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.aboutSection.delete({
      where: { id }
    })
    
    res.json({ message: '소개 섹션이 삭제되었습니다.' })
  } catch (error) {
    console.error('소개 섹션 삭제 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 활동 관리 API
router.get('/about/activities', async (req, res) => {
  try {
    const activities = await prisma.aboutActivity.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    res.json(activities)
  } catch (error) {
    console.error('활동 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.get('/about/activities/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const activities = await prisma.aboutActivity.findMany({
      orderBy: { order: 'asc' }
    })
    
    res.json(activities)
  } catch (error) {
    console.error('활동 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.post('/about/activities', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { title, description, icon, color, order } = req.body
    
    const activity = await prisma.aboutActivity.create({
      data: {
        title,
        description,
        icon,
        color,
        order: order || 0
      }
    })
    
    res.json(activity)
  } catch (error) {
    console.error('활동 생성 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.put('/about/activities/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, icon, color, order } = req.body
    
    const activity = await prisma.aboutActivity.update({
      where: { id },
      data: {
        title,
        description,
        icon,
        color,
        order: order || 0
      }
    })
    
    res.json(activity)
  } catch (error) {
    console.error('활동 수정 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.delete('/about/activities/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.aboutActivity.delete({
      where: { id }
    })
    
    res.json({ message: '활동이 삭제되었습니다.' })
  } catch (error) {
    console.error('활동 삭제 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 연혁 관리 API
router.get('/about/history', async (req, res) => {
  try {
    const history = await prisma.aboutHistory.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    res.json(history)
  } catch (error) {
    console.error('연혁 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.get('/about/history/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const history = await prisma.aboutHistory.findMany({
      orderBy: { order: 'asc' }
    })
    
    res.json(history)
  } catch (error) {
    console.error('연혁 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.post('/about/history', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { year, title, description, order } = req.body
    
    const historyItem = await prisma.aboutHistory.create({
      data: {
        year,
        title,
        description,
        order: order || 0
      }
    })
    
    res.json(historyItem)
  } catch (error) {
    console.error('연혁 생성 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.put('/about/history/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { year, title, description, order } = req.body
    
    const historyItem = await prisma.aboutHistory.update({
      where: { id },
      data: {
        year,
        title,
        description,
        order: order || 0
      }
    })
    
    res.json(historyItem)
  } catch (error) {
    console.error('연혁 수정 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.delete('/about/history/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.aboutHistory.delete({
      where: { id }
    })
    
    res.json({ message: '연혁이 삭제되었습니다.' })
  } catch (error) {
    console.error('연혁 삭제 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

// 연락처 관리 API
router.get('/about/contact', async (req, res) => {
  try {
    const contacts = await prisma.aboutContact.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' }
    })
    
    res.json(contacts)
  } catch (error) {
    console.error('연락처 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.get('/about/contact/admin', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const contacts = await prisma.aboutContact.findMany({
      orderBy: { order: 'asc' }
    })
    
    res.json(contacts)
  } catch (error) {
    console.error('연락처 조회 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.post('/about/contact', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { type, label, value, order } = req.body
    
    const contact = await prisma.aboutContact.create({
      data: {
        type,
        label,
        value,
        order: order || 0
      }
    })
    
    res.json(contact)
  } catch (error) {
    console.error('연락처 생성 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.put('/about/contact/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { type, label, value, order } = req.body
    
    const contact = await prisma.aboutContact.update({
      where: { id },
      data: {
        type,
        label,
        value,
        order: order || 0
      }
    })
    
    res.json(contact)
  } catch (error) {
    console.error('연락처 수정 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

router.delete('/about/contact/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    
    await prisma.aboutContact.delete({
      where: { id }
    })
    
    res.json({ message: '연락처가 삭제되었습니다.' })
  } catch (error) {
    console.error('연락처 삭제 오류:', error)
    res.status(500).json({ message: '서버 오류가 발생했습니다.' })
  }
})

export default router
