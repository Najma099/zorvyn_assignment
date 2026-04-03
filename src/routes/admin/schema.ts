import z from 'zod';
import { RoleCode, StatusCode } from '@prisma/client';

const updateUserRole = z.object({
    role: z.enum(RoleCode),
});

const updateUserStatus = z.object({
    status: z.enum(StatusCode),
});

const userId = z.object({
    id: z.coerce.number().int().positive(),
});

export type UserSchema = {
    UpdateUserRole: z.infer<typeof updateUserRole>;
    UpdateUserStatus: z.infer<typeof updateUserStatus>;
    UserId: z.infer<typeof userId>;
};

export default { 
    updateUserRole,
    updateUserStatus, 
    userId 
};