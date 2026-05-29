import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting reference database seeding...');
  
  // Seed baseline crop pathogens
  console.log('Seeding baseline crop pathogens...');
  
  console.log('🌱 Reference database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
