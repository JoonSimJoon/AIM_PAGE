import express from 'express';
import { db } from '../utils/db';

const router = express.Router();

// JWT 미들웨어
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

// 공개 스터디 글 목록 조회
router.get('/posts', async (req, res) => {
  try {
    const posts = await db.studyPost.findMany({
      where: {
        status: 'published'
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                displayName: true,
                avatarKey: true
              }
            }
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    res.json(posts);
  } catch (error) {
    console.error('Error fetching study posts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 특정 스터디 글 조회
router.get('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const post = await db.studyPost.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profile: {
              select: {
                displayName: true,
                avatarKey: true
              }
            }
          }
        },
        tags: {
          include: {
            tag: true
          }
        }
      }
    });

    if (!post) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    console.error('Error fetching study post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 스터디 글 생성 (인증 필요)
router.post('/posts', authenticateToken, async (req: any, res) => {
  try {
    const { title, contentMd, coverKey, tags, studyId } = req.body;
    const userId = req.user.userId;

    if (!title || !contentMd) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    const post = await db.studyPost.create({
      data: {
        title,
        contentMd,
        coverKey,
        authorId: userId,
        studyId: studyId || 'default', // 기본 스터디 ID
        status: 'draft'
      }
    });

    // 태그 연결
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await db.tag.upsert({
          where: { name: tagName },
          create: { name: tagName },
          update: {}
        });

        await db.studyPostTag.create({
          data: {
            postId: post.id,
            tagId: tag.id
          }
        });
      }
    }

    res.json(post);
  } catch (error) {
    console.error('Error creating study post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 스터디 글 수정
router.put('/posts/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const { title, contentMd, coverKey, status } = req.body;
    const userId = req.user.userId;

    // 권한 확인
    const existingPost = await db.studyPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const updatedPost = await db.studyPost.update({
      where: { id },
      data: {
        title,
        contentMd,
        coverKey,
        status,
        updatedAt: new Date()
      }
    });

    res.json(updatedPost);
  } catch (error) {
    console.error('Error updating study post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 스터디 글 삭제
router.delete('/posts/:id', authenticateToken, async (req: any, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // 권한 확인
    const existingPost = await db.studyPost.findUnique({
      where: { id }
    });

    if (!existingPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    if (existingPost.authorId !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await db.studyPost.delete({
      where: { id }
    });

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting study post:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
