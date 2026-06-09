const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const path = require('path');
const fs = require('fs');

async function main() {
  console.log('Reading data...');
  const dataPath = path.join(__dirname, '../asoiaf_data.json');
  const rawData = fs.readFileSync(dataPath);
  const characters = JSON.parse(rawData);

  console.log(`Seeding ${characters.length} characters into the database...`);

  await prisma.character.createMany({
    data: characters,
    skipDuplicates: true, 
  });

  console.log('Seeding complete. Database is populated.');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });