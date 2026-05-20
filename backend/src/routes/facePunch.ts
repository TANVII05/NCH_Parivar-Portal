import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';

const router = Router();

// Submit Face Punch record
router.post('/punch', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;
  const punchData = req.body;

  try {
    const punchRecord = {
      ...punchData,
      employeeId: uid,
      timestamp: new Date().toISOString(),
    };

    if (!db) {
      return res.status(201).json({
        message: 'Face punch recorded successfully (Mocked)',
        data: punchRecord,
      });
    }

    const docRef = await db.collection('face-punches').add(punchRecord);
    res.status(201).json({ id: docRef.id, ...punchRecord });
  } catch (error) {
    console.error('Failed to record face punch:', error);
    res.status(500).json({ error: 'Failed to record face punch' });
  }
});

export default router;
