import { asyncHandler } from '../../core/async-handler';
import { authorize } from '../../middlewares/authorize.middleware';
import { RoleCode } from '@prisma/client';
import RecordsRepo from '../../database/repositories/records.repo';
import { ProtectedRequest } from '../../types/app-requests';
import { SuccessResponse } from '../../core/api-response';
import { Router } from 'express';
import { validator } from '../../middlewares/validator.middleware';
import { FinancialRecordSchema } from '../../routes/financial-records/schema';
import { ValidationSource } from '../../helpers/validator';
import schema from './schema';
import { BadRequestError } from '../../core/api-error';

const router = Router();

const checkById = async (id: number, userId: number) => {
    const record = await RecordsRepo.getRecordById(id, userId);
    if (!record) 
        throw new BadRequestError('Record does not exists.');
}
router.post(
    '/',
    authorize(RoleCode.ADMIN),
    validator(schema.createFinancialRecord),
    asyncHandler(async (req: ProtectedRequest, res) => {
        console.log(req.body);
        const record = await RecordsRepo.createRecord(req.user.id, req.body);
        new SuccessResponse('Record created', record).send(res);
    }),
);


router.get(
    '/',
    authorize(RoleCode.ADMIN, RoleCode.ANALYST, RoleCode.VIEWER),
    validator(schema.paginationParams, ValidationSource.QUERY),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const { skip, take } = req.query as unknown as FinancialRecordSchema['PaginationParams'];
        const records = await RecordsRepo.getRecords({
            userId: req.user.id,
            skip: Number(skip),
            take:  Number(take)
        });
        new SuccessResponse('Records fetched', records).send(res);
    }),
);


router.put(
    '/:id',
    authorize(RoleCode.ADMIN),
    validator(schema.recordId, ValidationSource.PARAM),
    validator(schema.updateFinancialRecord),
    asyncHandler(async (req: ProtectedRequest, res) => {
        await checkById(Number(req.params.id), req.user.id);

        const updated = await RecordsRepo.updateRecord(
            Number(req.params.id),
            req.user.id,
            req.body
        );
        new SuccessResponse('Record updated', updated).send(res);
    }),
);


router.delete(
    '/:id',
    authorize(RoleCode.ADMIN),
    validator(schema.recordId, ValidationSource.PARAM),
    asyncHandler(async (req: ProtectedRequest, res) => {
        await checkById(Number(req.params.id), req.user.id);

        await RecordsRepo.deleteRecord(
            Number(req.params.id),
            req.user.id,
        );
        new SuccessResponse('Record deleted', null).send(res);
    }),
);

export default router;