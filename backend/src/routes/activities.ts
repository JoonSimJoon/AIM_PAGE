import express from 'express';
import { db } from '../utils/db';

const router = express.Router();

// 활동 목록 조회 (공개)
router.get('/', async (req, res) => {
  try {
    const activities = await db.activity.findMany({
      orderBy: {
        date: 'desc'
      }
    });

    res.json(activities);
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 특정 활동 조회
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await db.activity.findUnique({
      where: { id }
    });

    if (!activity) {
      return res.status(404).json({ error: 'Activity not found' });
    }

    res.json(activity);
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
