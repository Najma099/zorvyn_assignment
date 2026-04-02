import { prisma } from '..';
import { RecordType} from '@prisma/client';
import { TrendRow, TrendResult } from '../../types/records';
import { DashboardSchema } from '../../routes/dashboard/schema'; 

async function totalExpenses(): Promise<number> {
    const result = await prisma.financeRecord.aggregate({
        where: {
            recordType: RecordType.EXPENSE,
            deletedAt: null,
        },
        _sum: {
            amount: true,
        },
    });

    return (result._sum.amount ?? 0)/100;
}

async function totalIncome(): Promise<number> {
    const result = await prisma.financeRecord.aggregate({
        where: {
            recordType: RecordType.INCOME,
            deletedAt: null,
        },
        _sum: {
            amount: true,
        },
    });

    return (result._sum.amount ?? 0)/100;
}

async function netBalance() {
    const [income, expense] = await Promise.all([
        totalIncome(),
        totalExpenses(),
    ]);

    const balance = income - expense;

    return {
        income,
        expense,
        balance,
        isDeficit: balance < 0,
    };
}

async function categorySummary( params:
    DashboardSchema['CategorySummaryParams']
) {
    const { type, category } = params;
    if(category) {
        const result = await prisma.financeRecord.aggregate({
            where: {
                category,
                ...(type && { recordType: type}),
                deletedAt: null,
            },
            _sum: {
                amount: true,
            }
        });
        return {
            category,
            total: (result._sum.amount ?? 0) / 100,
        };
    }

    const rows = await prisma.financeRecord.groupBy({
        by: ['category'],
        where: {
            ...(type && { recordType: type }),
            deletedAt: null,
        },
        _sum: { 
            amount: true 
        },
        orderBy: { 
            _sum: { 
                amount: 'desc'
            } 
        },
    });

    return rows.map(row => ({
        category: row.category,
        total: (row._sum.amount ?? 0) / 100,
    }));
}

async function recentActivity(limit = 5) {
    const rows = await prisma.financeRecord.findMany({
        where: { 
             deletedAt: null 
        },
        orderBy: { 
            date: 'desc' 
        },
        take: limit,
    });

    return rows.map(row => ({
        ...row,
        amount: row.amount / 100,
    }));
}

async function monthlyTrends() {
    const rows = await prisma.$queryRaw<TrendRow[]>`
        SELECT
            DATE_TRUNC('month',date) AS BUCKET,
            "recordType",
            SUM(amount) AS total
        FROM "FinanceRecord"
        WHERE "deletedAt" is NULL
        GROUP BY bucket, "recordType"
        ORDER BY bucket ASC;
    `;
    return formatTrends(rows, 'month');
}

async function weeklyTrends() {
    const rows = await prisma.$queryRaw<TrendRow[]>`
        SELECT 
            DATE_TRUNC('week', date) AS bucket,
            "recordType",
            SUM(amount) AS total
        FROM "FinanceRecord"
        WHERE "deletedAt" IS NULL
        GROUP BY bucket, "recordType"
        ORDER BY bucket ASC;
    `;

    return formatTrends(rows, 'week');
}

function formatTrends(rows: TrendRow[], type: 'month' | 'week'): TrendResult {
    const result: TrendResult = {};

    for (const row of rows) {
        const label =
            type === 'month'
                ? new Date(row.bucket).toLocaleString('default', {
                      month: 'short',
                      year: 'numeric',
                  })
                : new Date(row.bucket).toISOString().split('T')[0];

        if (!result[label]) {
            result[label] = { income: 0, expense: 0 };
        }

        const value = Number(row.total) / 100;

        if (row.recordType === RecordType.INCOME) {
            result[label].income = value;
        } else {
            result[label].expense = value;
        }
    }
    return result;
}

async function highestExpense() {
    const row = await prisma.financeRecord.findFirst({
        where: {
            recordType: RecordType.EXPENSE,
            deletedAt: null,
        },
        orderBy: {
            amount: 'desc',
        },
    });

    if (!row) return null;
    return { ...row, amount: row.amount / 100 };
}

async function averageSpending() {
    const result = await prisma.financeRecord.aggregate({
        where: {
            recordType: RecordType.EXPENSE,
            deletedAt: null,
        },
        _avg: {
            amount: true,
        },
        _count: {
            amount: true,
        },
    });

    return {
        average: (result._avg.amount ?? 0) / 100,
        totalRecords: result._count.amount,
    };
}

export default {
    totalExpenses,
    totalIncome,
    netBalance,
    categorySummary,
    recentActivity,
    monthlyTrends,
    weeklyTrends,
    highestExpense,
    averageSpending
}