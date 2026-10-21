import { PrismaClient } from '@prisma/client';
import { seedOpenPlayDubaiPage } from '../prisma/seeds/open-play-dubai.seed';

const prisma = new PrismaClient();

seedOpenPlayDubaiPage(prisma)
  .catch((error) => {
    console.error('Failed to seed Open Play Dubai:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
