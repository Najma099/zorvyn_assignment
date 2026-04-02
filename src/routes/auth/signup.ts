import { Router } from 'express';
import { validator } from '../../middlewares/validator.middleware';
import schema from './schema';
import { asyncHandler } from '../../core/async-handler';
import UserRepo from '../../database/repositories/user.repo';
import { BadRequestError } from '../../core/api-error';
import crypto from 'crypto';
import { createTokens } from '../../core/auth-utils';
import { getUserData } from './../../core/utils';
import { SuccessResponse } from '../../core/api-response';
import { ValidationSource } from '../../helpers/validator';
import bcryptjs from 'bcryptjs';
import { setCookies } from '../../core/cookie-utils';

const router = Router();

router.post(
    '/',
    validator(schema.signup, ValidationSource.BODY),
    asyncHandler(async (req, res) => {
        const user = await UserRepo.findByEmail(req.body.email);
        if (user) throw new BadRequestError('User already registered.');

        // Hash password
        const hashedPassword = await bcryptjs.hash(req.body.password, 12);

        const accessTokenKey = crypto.randomBytes(64).toString('hex');
        const refreshTokenKey = crypto.randomBytes(64).toString('hex');

        const { user: createdUser, keystore } = await UserRepo.create(
            {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword,
            },
            accessTokenKey,
            refreshTokenKey,
        );

        const tokens = await createTokens(
            createdUser,
            keystore.primaryKey,
            keystore.secondaryKey,
        );

        const userData = getUserData(createdUser);

        // Set cookie for browser
        setCookies(res, tokens);

        new SuccessResponse('Signup successful.', {
            user: userData,
            tokens: tokens,
        }).send(res);
    }),
);

export default router;
