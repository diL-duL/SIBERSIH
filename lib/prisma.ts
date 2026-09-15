import { PrismaClient } from '../app/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

const createPrismaClient = () => {
  const pool = new Pool({
    connectionString,
    max: process.env.NODE_ENV === 'production' ? 2 : 5,
    idleTimeoutMillis: 60000,
    connectionTimeoutMillis: 20000,
  });
  pool.on('error', (err) => {
    console.error('PG Pool Unexpected Idle Client Error:', err);
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
