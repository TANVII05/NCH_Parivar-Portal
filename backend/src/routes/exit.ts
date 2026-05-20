import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';

const router = Router();

// Submit exit/resignation request
router.post('/apply', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;
  const exitData = req.body;

  try {
    const exitRecord = {
      ...exitData,
      employeeId: uid,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    if (!db) {
      return res.status(201).json({
        message: 'Exit/Resignation request submitted successfully (Mocked)',
        data: exitRecord,
      });
    }

    const docRef = await db.collection('exits').add(exitRecord);
    res.status(201).json({ id: docRef.id, ...exitRecord });
  } catch (error) {
    console.error('Failed to submit exit form:', error);
    res.status(500).json({ error: 'Failed to submit resignation request' });
  }
});

export default router;
