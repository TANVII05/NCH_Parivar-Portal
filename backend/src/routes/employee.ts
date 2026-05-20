import { Router, Response } from 'express';
import { verifyToken, AuthenticatedRequest } from '../middleware/auth';
import { db } from '../config/firebase';

const router = Router();

// Get employee profile
router.get('/profile', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;

  try {
    if (!db) {
      // Mocked employee profile response
      return res.status(200).json({
        id: uid,
        name: 'Tanvi Patel',
        email: req.user?.email || 'tanvi.patel@nchgroup.com',
        branch: 'Core Team',
        department: 'Engineering',
        designation: 'Software Engineer',
        shiftTiming: '09:00 AM to 06:00 PM',
        lunchTiming: '01:00 PM to 01:30 PM',
        employeeId: 'NCH-4821',
        joiningDate: '2024-06-15',
      });
    }

    const doc = await db.collection('employees').doc(uid!).get();
    if (!doc.exists) {
      return res.status(404).json({ error: 'Employee profile not found' });
    }

    res.status(200).json(doc.data());
  } catch (error) {
    console.error('Failed to get profile:', error);
    res.status(500).json({ error: 'Failed to retrieve profile data' });
  }
});

// Update employee profile (e.g. settings/push tokens)
router.patch('/profile', verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  const uid = req.user?.uid;
  const updates = req.body;

  try {
    if (!db) {
      return res.status(200).json({ message: 'Profile updated in mocked DB successfully' });
    }

    await db.collection('employees').doc(uid!).set(updates, { merge: true });
    res.status(200).json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Failed to update profile:', error);
    res.status(500).json({ error: 'Failed to update profile data' });
  }
});

export default router;
