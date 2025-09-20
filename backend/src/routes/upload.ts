import express from 'express';
import multer from 'multer';
import { localStorage } from '../utils/storage';

const router = express.Router();

// Multer 설정 (메모리 스토리지)
const upload = multer({ storage: multer.memoryStorage() });

// JWT 미들웨어 (간단한 버전)
const authenticateToken = (req: any, res: any, next: any) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// 파일 업로드 (로컬 스토리지)
router.post('/file', authenticateToken, upload.single('file'), async (req: any, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { target = 'post' } = req.body;
    const userId = req.user.userId;
    
    // 파일 키 생성
    const key = localStorage.generateUploadUrl(
      target as 'avatar' | 'post' | 'activity',
      userId,
      req.file.originalname
    );
    
    // 파일 저장
    await localStorage.saveFile(key, req.file.buffer);
    
    // 파일 URL 생성
    const url = localStorage.getFileUrl(key);

    res.json({ 
      success: true, 
      key, 
      url,
      filename: req.file.originalname,
      size: req.file.size,
      mimetype: req.file.mimetype
    });
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 파일 삭제
router.delete('/:key', authenticateToken, async (req: any, res) => {
  try {
    const { key } = req.params;
    const decodedKey = decodeURIComponent(key);
    
    const deleted = await localStorage.deleteFile(decodedKey);
    
    if (deleted) {
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'File not found' });
    }
  } catch (error) {
    console.error('File deletion error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
