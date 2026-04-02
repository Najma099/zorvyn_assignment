import { prisma } from '..';
import { FinancialRecordSchema } from '../../routes/financial-records/schema';

async function createRecord(userId: number, data: FinancialRecordSchema['CreateFinancialRecord']) {
    return prisma.financeRecord.create({
        data: {
        ...data,
        userId
    }});
}

//Viewing records
async function getRecords(params: {
    userId: number;
    skip ?: number;
    take ?: number;
}) {
    const rows = await prisma.financeRecord.findMany({
        where: {
            userId: params.userId,
            deletedAt: null,
        },
        orderBy: {
            date: 'desc',
        },
        skip: params.skip,
        take: params.take,
    });
    return rows.map( row => ({
        ...row, amount: row.amount / 100 
    }));
}

//Updating records
async function updateRecord(
    id: number,
    userId: number,
    data: FinancialRecordSchema['CreateFinancialRecord'],
) {
    return prisma.financeRecord.update({
        where: {
            id,
            userId,
            deletedAt: null,
        },
        data,
    });
}

//Deleting records
async function deleteRecord(id: number, userId: number) {
    return prisma.financeRecord.update({
        where: {
            id,
            userId,
            deletedAt: null,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

async function getRecordById(id: number, userId: number) {
    const row = await prisma.financeRecord.findFirst({
        where: {
            id,
            userId,
            deletedAt: null,
        },
    });
    if (!row) return null;
    return { ...row, amount: row.amount / 100 };
}

async function filterRecords(userId: number, filters: FinancialRecordSchema['financialRecordFilter']) {
    const { fromDate, toDate, recordType, category } = filters;

    const rows = await prisma.financeRecord.findMany({
        where: {
            userId,
            deletedAt: null,
            ...(recordType && { recordType }),
            ...(category && { category }),
            ...(fromDate || toDate) && {
                date: {
                    ...(fromDate && { gte: fromDate }),
                    ...(toDate && { lte: toDate }),
                },
            },
        },
        orderBy: {
            date: 'desc',
        },
    });
    return rows.map(row => ({ ...row, amount: row.amount / 100 }));
}


export default {
    createRecord,
    getRecords,
    updateRecord,
    deleteRecord,
    getRecordById,
    filterRecords
};
