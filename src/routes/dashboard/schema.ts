import { RecordType, Category } from '@prisma/client';
import z from 'zod';

const categorySummaryParams = z.object({
    type: z.enum(RecordType).optional(),
    category: z.enum(Category).optional(),
});

export type DashboardSchema = {
    CategorySummaryParams: z.infer<typeof categorySummaryParams>; 
}

export default {
    categorySummaryParams, 
}