import express from 'express';
import { db } from '../utils/db';

const router = express.Router();

// 공개 멤버 목록 조회
router.get('/', async (req, res) => {
  try {
    const members = await db.user.findMany({
      select: {
        id: true,
        name: true,
        profile: {
          select: {
            displayName: true,
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

// 특정 멤버 프로필 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const member = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        profile: {
          select: {
            displayName: true,
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

export default router;
