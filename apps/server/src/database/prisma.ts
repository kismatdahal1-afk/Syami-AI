import { PrismaClient } from '@prisma/client';

declare global {
  var prisma: PrismaClient | undefined;
}

const isProduction = process.env.NODE_ENV === 'production';

export const prisma: PrismaClient =
  global.prisma ??
  new PrismaClient({
    log: isProduction ? ['error'] : ['query', 'info', 'warn', 'error'],
  });

if (!isProduction) {
  global.prisma = prisma;
}
