import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { db, messaging } from '../config/firebase';

const router = Router();

// Submit overtime request
router.post('/apply', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;
  const otData = req.body;

  try {
    const otRecord = {
      ...otData,
      employeeId: uid,
      status: 'Pending',
    };

    if (!db) {
      return res.status(201).json({
        message: 'Overtime request submitted successfully (Mocked)',
        data: otRecord,
      });
    }

    const docRef = await db.collection('overtime').add(otRecord);
    res.status(201).json({ id: docRef.id, ...otRecord });
  } catch (error) {
    console.error('Failed to submit overtime:', error);
    res.status(500).json({ error: 'Failed to submit overtime' });
  }
});

// Get overtime history
router.get('/history', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;

  try {
    if (!db) {
      return res.status(200).json([
        {
          id: '1',
          date: '2026-05-15',
          duration: '2 hrs',
          reason: 'Support release deployment tasks',
          status: 'Approved',
        },
      ]);
    }

    const snapshot = await db.collection('overtime').where('employeeId', '==', uid).get();
    const history = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(history);
  } catch (error) {
    console.error('Failed to get overtime history:', error);
    res.status(500).json({ error: 'Failed to retrieve overtime history' });
  }
});

// Update overtime status & send FCM notification
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, pushToken } = req.body;

  try {
    if (!db) {
      return res.status(200).json({ message: `Overtime status set to ${status} (Mocked)` });
    }

    await db.collection('overtime').doc(id).update({ status });

    if (pushToken && messaging) {
      const message = {
        notification: {
          title: 'Overtime Status Updated',
          body: `Your overtime request has been ${status.toUpperCase()}.`,
        },
        token: pushToken,
      };

      await messaging.send(message);
    }

    res.status(200).json({ message: 'Overtime status updated successfully' });
  } catch (error) {
    console.error('Failed to update status:', error);
    res.status(500).json({ error: 'Failed to update overtime status' });
  }
});

export default router;
