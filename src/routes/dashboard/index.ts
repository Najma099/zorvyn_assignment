import express from 'express';
import { asyncHandler } from '../../core/async-handler';
import { authorize } from '../../middlewares/authorize.middleware';
import { validator } from '../../middlewares/validator.middleware';
import { ValidationSource } from '../../helpers/validator';
import { ProtectedRequest } from '../../types/app-requests';
import { SuccessResponse } from '../../core/api-response';
import { RoleCode } from '@prisma/client';
import DashboardRepo from '../../database/repositories/dashboard.repo';
import authMiddleware from '../../middlewares/auth.middleware';
import { RecordType, Category } from '@prisma/client';

import schema from './schema';

const router = express.Router();

router.use(authMiddleware);

router.get(
    '/total-income',
    authorize(RoleCode.VIEWER, RoleCode.ANALYST, RoleCode.ADMIN),
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const data = await DashboardRepo.totalIncome();
        new SuccessResponse('Total income', data).send(res);
    }),
);

router.get(
    '/total-expense',
    authorize(RoleCode.VIEWER, RoleCode.ANALYST, RoleCode.ADMIN),
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const data = await DashboardRepo.totalExpenses();
        new SuccessResponse('Total expenses', data).send(res);
    }),
);

router.get(
    '/balance',
    authorize(RoleCode.VIEWER, RoleCode.ANALYST, RoleCode.ADMIN),
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const data = await DashboardRepo.netBalance();
        new SuccessResponse('Net balance', data).send(res);
    }),
);

router.get(
    '/category',
    authorize( RoleCode.ANALYST, RoleCode.ADMIN),
    validator(schema.categorySummaryParams, ValidationSource.QUERY), 
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const data = await DashboardRepo.categorySummary(
            {
                type: _req.query.type as RecordType | undefined,
                category: _req.query.category as Category | undefined,
            }
        );
        new SuccessResponse('Category summary', data).send(res);
    }),
);

router.get(
    '/recent',
    authorize(RoleCode.VIEWER, RoleCode.ANALYST, RoleCode.ADMIN),
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const limit = _req.query.limit ? Number(_req.query.limit) : 5;
        const data = await DashboardRepo.recentActivity(limit);
        new SuccessResponse('Recent activity', data).send(res);
    }),
);

router.get(
    '/monthly-trends',
    authorize(RoleCode.ANALYST, RoleCode.ADMIN),
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const data = await DashboardRepo.monthlyTrends();
        new SuccessResponse('Monthly trends', data).send(res);
    }),
);

router.get(
    '/weekly-trends',
    authorize(RoleCode.ANALYST, RoleCode.ADMIN),
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const data = await DashboardRepo.weeklyTrends();
        new SuccessResponse('Weekly trends', data).send(res);
    }),
);

router.get(
    '/highest-expense', 
    authorize(RoleCode.ANALYST, RoleCode.ADMIN),
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const data = await DashboardRepo.highestExpense();
        new SuccessResponse('Highest expense', data).send(res);
    }),
);

router.get(
    '/avg-spending',
    authorize(RoleCode.ANALYST, RoleCode.ADMIN),
    asyncHandler(async (_req: ProtectedRequest, res) => {
        const data = await DashboardRepo.averageSpending();
        new SuccessResponse('Average spending', data).send(res);
    }),
);

export default router;