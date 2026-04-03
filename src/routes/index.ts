import { Router } from 'express';

import healthRoutes from './health/index.js';
import authRoutes from './auth';
import recordsRoute from './financial-records'
import dashboardRoutes from './dashboard';
import adminRoute from './admin'
const router = Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/records',recordsRoute);
router.use('/dashboard', dashboardRoutes);
router.use('/admin', adminRoute);

export default router;
