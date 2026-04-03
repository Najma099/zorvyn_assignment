import { RecordType, Category } from '@prisma/client';
import z from 'zod';

export const CATEGORY_RECORD_TYPE_MAP = {
    FOOD: RecordType.EXPENSE,
    RENT: RecordType.EXPENSE,
    TRAVEL: RecordType.EXPENSE,
    SALARY: RecordType.INCOME,
};

const createFinancialRecord = z.object({
    amount: z.number().transform(val => Math.round(val * 100)),
    category: z.enum(Category),
    notes: z.string(),
    date: z.string().transform((val) => new Date(val)),
    recordType: z.enum(RecordType)
}).refine( data => {
    return CATEGORY_RECORD_TYPE_MAP[data.category] === data.recordType;
},{
    message: 'Category does not match record type',
    path: ['category'],
});

const updateFinancialRecord = createFinancialRecord.partial();

const financialRecordFilter = z.object({
    fromDate : z.coerce.date().optional(),
    toDate : z.coerce.date().optional(),
    recordType: z.enum(RecordType).optional(),
    category: z.enum(Category).optional(),
    skip: z.coerce.number().min(0).default(0),
    take: z.coerce.number().min(1).max(100).default(10),
}).refine( data => {

    if(data.fromDate && data.toDate) {
        return data.fromDate <= data.toDate;
    }

    return true;
}, 
{ message: 'fromDate must be before toDate' })
.refine(data => {
    if (data.category && data.recordType) {
        return CATEGORY_RECORD_TYPE_MAP[data.category] === data.recordType;
    }
    return true;
},{
    message: 'Category does not match record type',
    path: ['category'],
});

const paginationParams = z.object({
    skip: z.coerce.number().int().min(0).default(0),
    take: z.coerce.number().int().min(1).max(100).default(10),
});

export type FinancialRecordSchema = {
    CreateFinancialRecord: z.infer<typeof createFinancialRecord>;
    UpdateFinancialRecord: z.infer<typeof updateFinancialRecord>;
    financialRecordFilter: z.infer<typeof financialRecordFilter>;
    PaginationParams: z.infer<typeof paginationParams>;
};

const recordId = z.object({
    id: z.coerce.number().int().positive(),
});

export default {
    createFinancialRecord,
    updateFinancialRecord,
    recordId,
    financialRecordFilter,
    paginationParams
};