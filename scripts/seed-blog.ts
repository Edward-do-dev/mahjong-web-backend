import { PrismaClient } from '@prisma/client';
import { seedBlogPage } from '../prisma/seeds/blog.seed';

const prisma = new PrismaClient();

seedBlogPage(prisma)
  .catch((error) => {
    console.error('Failed to seed Blog:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
