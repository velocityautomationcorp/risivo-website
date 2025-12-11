// Database client for Risivo Marketing Website
// Connects to shared Supabase PostgreSQL database with CRM
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

// Create PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// Create Prisma adapter (required for Prisma 7)
const adapter = new PrismaPg(pool)

// Global Prisma instance to prevent multiple connections in development
const globalForPrisma = global as unknown as { prisma: PrismaClient }

// Create Prisma client with adapter and logging
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error'],
  })

// Prevent multiple instances in development (hot reload)
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export pool for cleanup if needed
export { pool }
