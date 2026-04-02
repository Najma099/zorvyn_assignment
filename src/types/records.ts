import { RecordType } from '@prisma/client';

export type TrendRow = {
    bucket: Date;
    recordType: RecordType;
    total: bigint; 
}

export type TrendResult = Record<
    string,
    { income: number; expense: number }
>;
