import { RoleCode, StatusCode } from '@prisma/client';
import { BadRequestError } from '../../core/api-error';
import { prisma } from '..';

async function updateRole(id: number, role: RoleCode) {
    let user = await prisma.user.findUnique({
        where: {
            id,
            deletedAt: null
        }
    });
    if (!user) throw new BadRequestError('User does not exist.');;

    return prisma.user.update({
        where: {
            id
        },
        data: {
           role 
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        }
    });
}

async function updateStatus(id: number, status: StatusCode) {
    const user = await prisma.user.findUnique({
        where: {
            id,
            deletedAt: null
        },
    });

    if (!user) throw new BadRequestError('User does not exist.');
    return prisma.user.update({
        where: {
            id
        },
        data: {
           status
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
            createdAt: true,
            updatedAt: true,
        }
    })
}

export default {
    updateRole,
    updateStatus
}