import { SuccessMsgResponse } from '../../core/api-response';
import { asyncHandler } from '../../core/async-handler';
import KeystoreRepo from '../../database/repositories/keystore.repo';
import { Router } from 'express';
import { ProtectedRequest } from '../../types/app-requests';
import { clearCookies } from '../../core/cookie-utils';
import authMiddleware from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.delete(
    '/',
    asyncHandler(async (req: ProtectedRequest, res) => {
        await KeystoreRepo.remove(req.keystore.id);
        // remove cookies
        clearCookies(res);
        new SuccessMsgResponse('Logout Success').send(res);
    }),
);

export default router;
