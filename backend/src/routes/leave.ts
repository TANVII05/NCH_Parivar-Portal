import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { db, messaging } from '../config/firebase';

const router = Router();

// Submit leave request
router.post('/apply', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;
  const leaveData = req.body;

  try {
    const leaveRecord = {
      ...leaveData,
      employeeId: uid,
      appliedDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
    };

    if (!db) {
      return res.status(201).json({
        message: 'Leave request submitted successfully (Mocked)',
        data: leaveRecord,
      });
    }

    const docRef = await db.collection('leaves').add(leaveRecord);
    res.status(201).json({ id: docRef.id, ...leaveRecord });
  } catch (error) {
    console.error('Failed to submit leave:', error);
    res.status(500).json({ error: 'Failed to submit leave' });
  }
});

// Get leave history
router.get('/history', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;

  try {
    if (!db) {
      return res.status(200).json([
        {
          id: '1',
          appliedDate: '2026-05-10',
          type: 'Casual Leave',
          startDate: '2026-05-25',
          endDate: '2026-05-26',
          days: 2,
          status: 'Approved',
        },
      ]);
    }

    const snapshot = await db.collection('leaves').where('employeeId', '==', uid).get();
    const history = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(history);
  } catch (error) {
    console.error('Failed to get leave history:', error);
    res.status(500).json({ error: 'Failed to retrieve leave history' });
  }
});

// Update leave status (HR approval/rejection) & send FCM Push Notification
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, pushToken } = req.body; // Approved / Rejected

  try {
    if (!db) {
      return res.status(200).json({ message: `Leave status set to ${status} (Mocked)` });
    }

    await db.collection('leaves').doc(id).update({ status });

    // Send FCM push notification if pushToken is provided
    if (pushToken && messaging) {
      const message = {
        notification: {
          title: 'Leave Request Status Updated',
          body: `Your leave request has been ${status.toUpperCase()}.`,
        },
        token: pushToken,
      };

      await messaging.send(message);
      console.log('Push notification sent successfully');
    }

    res.status(200).json({ message: 'Leave status updated successfully' });
  } catch (error) {
    console.error('Failed to update status:', error);
    res.status(500).json({ error: 'Failed to update leave status' });
  }
});

export default router;
