# Database Schema Design

## Overview

The schema is built on PostgreSQL using Prisma ORM. This document walks through the key design decisions and the reasoning behind them.

---

## User Table

The user model is intentionally kept simple — just what's needed for authentication, authorization, and identity. No bloat.

Passwords are stored as bcrypt hashes, never plaintext. The hashing happens at the service layer before the record is created.

Instead of permanently removing users, we set a `deletedAt` timestamp (soft delete). This preserves audit history and prevents accidental data loss. All queries filter `deletedAt: null` to exclude deleted users.

Roles and statuses are enums rather than free strings to prevent invalid values at the database level:

```prisma
enum RoleCode {
  VIEWER    // read-only access to dashboard
  ANALYST   // read access + insights and filtering
  ADMIN     // full access including record and user management
}

enum StatusCode {
  ACTIVE    // can login and use the system
  INACTIVE  // blocked from login
}
```

The default role is `VIEWER` — the least privileged — so new users never accidentally get elevated access. Email is indexed since it is the primary lookup field during login.

---

## Keystore Table

This is the most important piece of the auth system. It enables true multi-session management — a user can be logged in from multiple devices simultaneously, and logging out from one session does not affect the others.

**How it works:** On every login, two random keys are generated — a `primaryKey` and a `secondaryKey`. The primary key is embedded into the access token payload, the secondary key into the refresh token. These keys are stored in the keystore, not the tokens themselves.

When a refresh token request comes in we pull the primary key out of the token, look it up in the keystore, and if it does not exist the session has been invalidated. If it exists, we verify the token signature and allow the request.

**Why not just store the tokens?** If the database is compromised, storing raw tokens means all sessions are instantly exposed. By storing only key references and keeping the signing separate, tokens cannot be tampered with or replayed even if someone reads the keystore.

When a user is deleted, all their keystore entries are automatically removed via `onDelete: Cascade`.

The indexes are designed around the exact queries we run:

```prisma
@@index([clientId])                              // fetch all sessions for a user
@@index([clientId, primaryKey, status])          // validate active session on each request
@@index([clientId, primaryKey, secondaryKey])    // token rotation on refresh
```

---

## FinanceRecord Table

**The most important decision here is storing amounts in paise, not rupees.**

Storing money as a float causes floating point precision errors in JavaScript:
```
0.1 + 0.2 === 0.30000000000000004
168.99 - 100.01 === 68.97999999999999
```

So instead, we store everything as integers in paise (1 rupee = 100 paise):
```
Input:  168.99 rupees  →  stored as  16899  paise
Output: 16899  paise   →  returned as 168.99 rupees
```

All arithmetic — SUM, subtraction, comparison — happens on integers in the database. We only divide by 100 at the very last step when returning data. This guarantees precision across every financial operation.

We use `Int` rather than Prisma's `Decimal` type because `Decimal` maps to a JavaScript object that requires explicit conversion and still risks precision loss downstream. `Int` gives us a plain JavaScript number and integer arithmetic is always exact.

Categories are not freely assignable to any record type. A cross-field validation rule enforces that the category matches the record type — `SALARY` can only be `INCOME`, and `FOOD`, `RENT`, `TRAVEL` can only be `EXPENSE`. This mapping is defined in the application and validated via Zod before anything touches the database.

Like users, records are never hard deleted. The `deletedAt` timestamp is set on deletion and all queries filter it out. Preserving financial history for audit purposes is especially important in a finance system.

The indexes are designed around the actual dashboard query patterns:

```prisma
@@index([createdBy, recordType])                  // income or expense totals
@@index([createdBy, category])                    // category summary
@@index([createdBy, date])                        // recent activity, trends
@@index([createdBy, recordType, category, date])  // combined filter queries
```

The composite index on all four fields is specifically for the `/filter` endpoint which allows filtering by record type, category, and date range simultaneously.

---

## Key Tradeoffs

| Decision | Alternative | Reason |
|---|---|---|
| Paise as `Int` | `Decimal(10,2)` | No precision loss, native JS number, no conversion overhead |
| Keystore for sessions | Store tokens in DB | Tokens cannot be tampered with even if DB is compromised |
| Soft delete | Hard delete | Preserves audit trail, critical for financial data |
| Enums for roles and categories | String fields | Invalid values rejected at the database level |
| Separate keystore per session | Single token per user | Independent session revocation without affecting other sessions |