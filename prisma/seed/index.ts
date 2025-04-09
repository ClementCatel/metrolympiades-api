// prisma/seed/index.ts
import { PrismaClient } from '@prisma/client';
import { createActivities } from './activities';
import { createMatches } from './matches';
import { createTeams } from './teams';

const prisma = new PrismaClient();

async function main() {

  const activities = await createActivities(prisma);
  const teams = await createTeams(prisma, 25);
  await createMatches(prisma, teams, activities, 6);

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
