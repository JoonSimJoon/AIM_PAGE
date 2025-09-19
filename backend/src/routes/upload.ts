import express from 'express';
import { generatePresignedUrl, generateS3Key, copyS3Object } from '../utils/s3';

const router = express.Router();

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

// 업로드 URL 생성
router.post('/url', authenticateToken, async (req: any, res) => {
  try {
    const { target, postId, mime, ext } = req.body;
    
    if (!mime || !ext) {
      return res.status(400).json({ error: 'Missing mime type or extension' });
    }

    const userId = req.user.userId;
    const cleanExt = ext.replace('.', '');
    
    // S3 키 결정
    const key = generateS3Key(userId, target, postId, cleanExt);
    const isTemp = key.includes('/temp/');
    
    const url = await generatePresignedUrl(key, mime, isTemp);

    res.json({ url, key });
  } catch (error) {
    console.error('Upload URL generation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// S3 객체 복사 (임시 -> 영구)
router.post('/copy', authenticateToken, async (req, res) => {
  try {
    const { fromKey, toKey } = req.body;
    
    if (!fromKey || !toKey) {
      return res.status(400).json({ error: 'Missing source or destination key' });
    }

    await copyS3Object(fromKey, toKey);
    res.json({ success: true });
  } catch (error) {
    console.error('S3 copy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
