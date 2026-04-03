import { Router} from "express";
import { validator } from '../../middlewares/validator.middleware';
import { ValidationSource } from '../../helpers/validator';
import { RoleCode } from '@prisma/client';
import { asyncHandler } from '../../core/async-handler';
import { authorize } from '../../middlewares/authorize.middleware';
import { ProtectedRequest } from '../../types/app-requests';
import { SuccessResponse } from '../../core/api-response';
import authMiddleware from '../../middlewares/auth.middleware';
import AdminRepo from '../../database/repositories/admin.repo'
import schema from './schema';

const router = Router();

router.use(authMiddleware);

router.patch(
    '/:id/role',
    authorize(RoleCode.ADMIN),
    validator(schema.userId, ValidationSource.PARAM),
    validator(schema.updateUserRole),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const updated = await AdminRepo.updateRole(
            Number(req.params.id),
            req.body.role,
        );
        new SuccessResponse('User role updated', updated).send(res);
    }),
)

router.patch(
    '/:id/status',
    authorize(RoleCode.ADMIN),
    validator(schema.userId, ValidationSource.PARAM),
    validator(schema.updateUserStatus),
    asyncHandler(async (req: ProtectedRequest, res) => {
        const updated = await AdminRepo.updateStatus(
            Number(req.params.id),
            req.body.status,
        );
        new SuccessResponse('User status updated', updated).send(res);
    }),
);

export default router;