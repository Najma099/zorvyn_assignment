import {Router } from "express";
import authMiddleware from '../../middlewares/auth.middleware';
import recordsCurdRoute from './records.crud';
import filterRoute from './query';
const router = Router();

router.use('/', authMiddleware, recordsCurdRoute);
router.use('/filter', authMiddleware, filterRoute)

export default router;