import { Keystore } from '@prisma/client';
import { prisma } from '..';

async function create(
    clientId: number,
    primaryKey: string,
    secondaryKey: string,
): Promise<Keystore> {
    const keystore = await prisma.keystore.create({
        data: {
            clientId,
            primaryKey,
            secondaryKey,
        },
    });

    return keystore;
}

async function remove(id: number): Promise<void> {
    await prisma.keystore.delete({
        where: { id },
    });
}

async function findForKey(
    clientId: number,
    key: string,
): Promise<Keystore | null> {
    const keystore = await prisma.keystore.findFirst({
        where: {
            clientId,
            primaryKey: key,
            status: true,
        },
    });

    return keystore;
}

async function find(
    clientId: number,
    primaryKey: string,
    secondaryKey: string,
): Promise<Keystore | null> {
    const keystore = await prisma.keystore.findFirst({
        where: {
            clientId,
            primaryKey,
            secondaryKey,
        },
    });

    return keystore;
}

export default {
    create,
    remove,
    findForKey,
    find,
};
