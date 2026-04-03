import { prisma } from '..';
import { FinancialRecordSchema } from '../../routes/financial-records/schema';


async function createRecord(userId: number, data: FinancialRecordSchema['CreateFinancialRecord']) {
    return prisma.financeRecord.create({
        data: {
        ...data,
        createdBy: userId
    }});
}

//Viewing records
async function getRecords(params: {
    skip ?: number;
    take ?: number;
}) {
    const rows = await prisma.financeRecord.findMany({
        where: {
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
    data: FinancialRecordSchema['CreateFinancialRecord'],
) {
    return prisma.financeRecord.update({
        where: {
            id,
            deletedAt: null,
        },
        data,
    });
}

//Deleting records
async function deleteRecord(id: number) {
    return prisma.financeRecord.update({
        where: {
            id,
            deletedAt: null,
        },
        data: {
            deletedAt: new Date(),
        },
    });
}

async function getRecordById(id: number) {
    const row = await prisma.financeRecord.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!row) return null;
    return { ...row, amount: row.amount / 100 };
}

async function filterRecords( filters: FinancialRecordSchema['financialRecordFilter']) {
    const { fromDate, toDate, recordType, category } = filters;

    const rows = await prisma.financeRecord.findMany({
        where: {
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
