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





Let's start with Schema first:


// User Table we decided to keep the structure easy and simple id, emaal, n passowrd we r stroing hashed password n also using deltedAt for soft delete , a user can have multiple keystore value, suppose he is lloging in via multiple session
model User {
  id       Int     @id @default(autoincrement())
  name     String
  email    String  @unique
  password String
  status   StatusCode @default(ACTIVE)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")
  deletedAt DateTime?

  role      RoleCode @default(VIEWER)
  keystores Keystore[]
  createdRecords FinanceRecord[]

  @@index([email])
}

enum RoleCode {
  VIEWER
  ANALYST
  ADMIN
}

enum StatusCode {
  ACTIVE
  INACTIVE
}

// Keystore Table for JWT token management this is very esstential for multiple sesson management so that user can loged out from one session without effecting  the other what we r trying to do where is whereever a new session is created for user we create two pair of key primary key n secondary key n then embed those key into access token n refresh token --> when a request is done from refresh token we bring out the primary key n see if primary key exists in our db if not it means the session is already deleted if teh primary key exits we very the token n allow the request if its valid .... there by aciving our goal of session management, n also not storing the token into the db to protect it from tamper

model Keystore {
  id           Int     @id @default(autoincrement())
  clientId     Int     @map("client_id")
  primaryKey   String  @map("primary_key")
  secondaryKey String  @map("secondary_key")
  status       Boolean @default(true)

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @default(now()) @updatedAt @map("updated_at")
  expiresAt DateTime?

  client User @relation(fields: [clientId], references: [id], onDelete: Cascade)

  @@index([clientId])
  @@index([clientId, primaryKey, status])
  @@index([clientId, primaryKey, secondaryKey])
  @@map("keystores")
}

//we decided to store the amount is paisa rather in rupees to make care of the decimal value while receiving the data we receive it in rupess but store it in paisa for precision we r doing operation 
model FinanceRecord {
  id         Int      @id @default(autoincrement())
  recordType RecordType
  amount     Int
  notes      String?
  category   Category
  createdBy     Int?
  user  User?     @relation(fields: [createdBy], references: [id])

  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
  deletedAt DateTime?
  date      DateTime @default(now())

  @@index([createdBy])
  @@index([createdBy, recordType])
  @@index([createdBy, category])
  @@index([createdBy, date])
  @@index([createdBy, recordType, category, date])
}

enum RecordType {
  INCOME
  EXPENSE
}

enum Category {
  FOOD
  RENT
  SALARY
  TRAVEL
}