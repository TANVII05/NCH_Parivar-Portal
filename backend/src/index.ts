import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import employeeRoutes from './routes/employee';
import leaveRoutes from './routes/leave';
import overtimeRoutes from './routes/overtime';
import loanRoutes from './routes/loan';
import exitRoutes from './routes/exit';
import facePunchRoutes from './routes/facePunch';
import authRoutes from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/employees', employeeRoutes);
app.use('/api/leaves', leaveRoutes);
app.use('/api/overtime', overtimeRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/exits', exitRoutes);
app.use('/api/face-punch', facePunchRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
