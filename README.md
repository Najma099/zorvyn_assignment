- Add FinanceRecord model with Int amount (paise) for precision
- Implement records CRUD with soft delete (createRecord, getRecords, updateRecord, deleteRecord)
- Implement dashboard analytics (totalIncome, totalExpenses, netBalance, categorySummary, recentActivity, monthlyTrends, weeklyTrends, highestExpense, averageSpending)
- Add paise/rupee conversion consistently across all repo functions
- Add Zod validation schemas for all routes with proper coercion
- Add pagination (skip/take) with bounds validation on record listing
- Add date range, category, and type filtering on records
- Add role-based authorization (VIEWER, ANALYST, ADMIN)
- Add rate limiting (global 100/15min, auth 10/15min)
- Add Swagger documentation for all dashboard and records endpoints
- Fix BigInt handling from raw SQL SUM queries
- Add composite indexes for query performance




