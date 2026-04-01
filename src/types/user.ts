import { RoleCode, StatusCode } from '@prisma/client';

export interface AuthUser {
    id: number;
    name: string;
    email: string;
    role: RoleCode;
    status: StatusCode;
    createdAt: Date;
    updatedAt: Date;
}
