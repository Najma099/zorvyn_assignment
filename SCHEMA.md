# Database Schema

Built with **Prisma ORM** on **PostgreSQL**. Designed for multi-session auth, soft deletes, and fast analytics queries.

---

## Table of Contents

- [User](#-user)
- [Keystore](#-keystore)
- [FinanceRecord](#-financerecord)
- [Enums](#-enums)
- [Index Strategy](#-index-strategy)
- [Design Assumptions](#-design-assumptions)

---

## ◆ User

Stores core identity, credentials, and role assignment.

| Field | Type | Notes |
|---|---|---|
| `id` | Int | Auto-increment primary key |
| `name` | String | Display name |
| `email` | String | Unique, indexed for fast login lookup |
| `password` | String | bcrypt hash — never plain text |
| `role` | RoleCode | Defaults to `VIEWER` on signup |
| `status` | StatusCode | Defaults to `ACTIVE`; toggle without deleting |
| `deletedAt` | DateTime? | Null = active; timestamp = soft deleted |

Each user can have multiple active sessions via the `Keystore` relation.

---

## ◈ Keystore

Manages JWT session keys for revocable multi-session auth. No actual tokens are stored — only the keys embedded inside them.

| Field | Type | Notes |
|---|---|---|
| `clientId` | Int | FK to User; cascades on delete |
| `primaryKey` | String | Embedded in the access token; checked on every request |
| `secondaryKey` | String | Embedded in the refresh token; used only during renewal |
| `status` | Boolean | `false` = session revoked instantly |
| `expiresAt` | DateTime? | Optional hard expiry for the session |

**How revocation works:** Setting `status = false` on a row immediately blocks any request using the associated tokens — no token blacklist needed.

---

## ◎ FinanceRecord

Stores income and expense entries with soft delete support and analytics-optimized indexes.

| Field | Type | Notes |
|---|---|---|
| `recordType` | RecordType | `INCOME` or `EXPENSE` |
| `amount` | Int | Stored in **paise**; API responses convert to rupees |
| `category` | Category | FOOD, RENT, SALARY, TRAVEL |
| `notes` | String? | Optional free-text context |
| `date` | DateTime | Defaults to now; supports backdating |
| `createdBy` | Int? | Nullable FK to User — record survives if user is deleted |
| `deletedAt` | DateTime? | Soft delete; excluded from queries but retained for history |

---

## ▸ Enums

**RoleCode** — Controls what a user can do across the organization.

| Value | Access |
|---|---|
| `VIEWER` | Read records + dashboard |
| `ANALYST` | Read records + dashboard |
| `ADMIN` | Full access — create, update, delete, manage users |

**StatusCode** — `ACTIVE` (can authenticate) · `INACTIVE` (blocked)

**RecordType** — `INCOME` · `EXPENSE`

**Category** — `FOOD` · `RENT` · `SALARY` · `TRAVEL`

> Categories can be extended in the enum as new types are needed.

---

## ⚡ Index Strategy

Indexes are chosen to cover the most frequent query patterns — token validation, filtered listings, and analytics aggregations.

| Index | Purpose |
|---|---|
| `User(email)` | Fast lookup during login |
| `Keystore(clientId, primaryKey, status)` | Access token validation on every request |
| `Keystore(clientId, primaryKey, secondaryKey)` | Refresh token validation |
| `FinanceRecord(createdBy, recordType)` | Filter by INCOME / EXPENSE |
| `FinanceRecord(createdBy, category)` | Filter by category |
| `FinanceRecord(createdBy, date)` | Date-range queries for trends |
| `FinanceRecord(createdBy, recordType, category, date)` | Composite for complex dashboard analytics |

---

## ⌬ Design Assumptions

- **Single organization** — No tenant isolation; all records share a workspace.
- **Organization-wide roles** — Permissions are global, not scoped per record.
- **Multi-session** — A user can be signed in on multiple devices; each gets its own keystore row.
- **Soft deletes everywhere** — Users and records are never hard-deleted, preserving history and referential integrity.
- **Paise as source of truth** — All monetary values stored as integers in paise; rupee conversion happens at the API layer only.