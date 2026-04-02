import { Router } from "express";
import { validator } from '../../middlewares/validator.middleware';
import { ValidationSource } from '../../helpers/validator';
import { authorize } from '../../middlewares/authorize.middleware';
import { asyncHandler } from '../../core/async-handler';
import { ProtectedRequest } from '../../types/app-requests';
import { SuccessResponse } from '../../core/api-response';
import { RoleCode } from '@prisma/client';
import RecordsRepo from '../../database/repositories/records.repo';
import { FinancialRecordSchema } from '../../routes/financial-records/schema';
import schema from './schema';

const router = Router();

router.get(
    '/',
    authorize(RoleCode.ADMIN),
    validator(schema.financialRecordFilter, ValidationSource.QUERY),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const data = await RecordsRepo.filterRecords(
            req.user.id, 
            req.query as unknown as FinancialRecordSchema['financialRecordFilter']  
        );
        new SuccessResponse('Filtered records', data).send(res);
    }),
);

export default router;