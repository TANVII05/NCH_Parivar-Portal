import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';

const router = Router();

// Submit loan request
router.post('/apply', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;
  const loanData = req.body;

  try {
    const loanRecord = {
      ...loanData,
      employeeId: uid,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    if (!db) {
      return res.status(201).json({
        message: 'Loan request submitted successfully (Mocked)',
        data: loanRecord,
      });
    }

    const docRef = await db.collection('loans').add(loanRecord);
    res.status(201).json({ id: docRef.id, ...loanRecord });
  } catch (error) {
    console.error('Failed to submit loan request:', error);
    res.status(500).json({ error: 'Failed to submit loan request' });
  }
});

export default router;
