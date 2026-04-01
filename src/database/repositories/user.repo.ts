import { AuthUser } from '../../types/user';
import { prisma } from '..';

async function findByEmail(email: string) {
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user || user.deletedAt) return null;

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

async function findAuthByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

async function create(
    userData: { name: string; email: string; password: string },
    accessTokenKey: string,
    refreshTokenKey: string,
) {
    // Create user and role relation in a transaction
    const result = await prisma.$transaction(async (tx: typeof prisma) => {
        // Create user
        const user = await tx.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                password: userData.password,
            },
        });

        // Create keystore
        const keystore = await tx.keystore.create({
            data: {
                clientId: user.id,
                primaryKey: accessTokenKey,
                secondaryKey: refreshTokenKey,
            },
        });

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                status: user.status,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            },
            keystore,
        };
    });

    return result;
}

async function findById(id: number): Promise<AuthUser | null> {
    const user = await prisma.user.findFirst({
        where: {
            id,
            status: 'ACTIVE',
            deletedAt: null,
        },
    });

    if (!user || user.deletedAt) return null;

    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
}

async function checkById(id: number) {
    return prisma.user.findUnique({
        where: { id },
    });
}

async function checkByEmail(email: string) {
    return prisma.user.findUnique({
        where: { email },
    });
}

export default {
    findByEmail,
    create,
    findById,
    checkById,
    checkByEmail,
    findAuthByEmail,
};
