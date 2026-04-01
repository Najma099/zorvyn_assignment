import { asyncHandler } from '../../core/async-handler';
import { Router } from 'express';
import { validator } from '../../middlewares/validator.middleware';
import schema from './schema';
import { PublicRequest } from '../../types/app-requests';
import UserRepo from '../../database/repositories/user.repo';
import { AuthFailureError, BadRequestError } from '../../core/api-error';
import crypto from 'crypto';
import KeystoreRepo from '../../database/repositories/keystore.repo';
import { createTokens, isPasswordCorrect } from '../../core/auth-utils';
import { getUserData } from '../../core/utils';
import { SuccessResponse } from '../../core/api-response';
import { ValidationSource } from '../../helpers/validator';
import { setCookies } from '../../core/cookie-utils';
const router = Router();

router.post(
    '/',
    validator(schema.signin, ValidationSource.BODY),
    asyncHandler(async (req: PublicRequest, res) => {
        const user = await UserRepo.findAuthByEmail(req.body.email);

        if (!user) throw new BadRequestError('User not registered.');

        const isValid = await isPasswordCorrect(
            req.body.password,
            user.password,
        );

        if (!isValid) throw new AuthFailureError('Authentication failure.');

        if (user.status !== 'ACTIVE') {
            throw new AuthFailureError('User is inactive');
        }
        const accessTokenKey = crypto.randomBytes(64).toString('hex');
        const refreshTokenKey = crypto.randomBytes(64).toString('hex');

        await KeystoreRepo.create(user.id, accessTokenKey, refreshTokenKey);
        const tokens = await createTokens(
            user,
            accessTokenKey,
            refreshTokenKey,
        );
        const userData = getUserData(user);

        setCookies(res, tokens);

        new SuccessResponse('Login success.', {
            user: userData,
            tokens: tokens,
        }).send(res);
    }),
);

export default router;
