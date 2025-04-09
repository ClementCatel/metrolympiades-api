import { PrismaClient, Team } from '@prisma/client';
import { faker } from '@faker-js/faker';

export const createMatches = async (prisma: PrismaClient, teams: Team[], activities: { id: string }[], numberOfMatchesPerTeam: number) => {

  const matchesCreated: Set<string> = new Set();

  for (const team1 of teams) {
    for (let i = 0; i < numberOfMatchesPerTeam; i++) {
      let team2 = teams[Math.floor(Math.random() * teams.length)];

      while (team1 === team2 || matchesCreated.has(`${team1.id}-${team2.id}`) || matchesCreated.has(`${team2.id}-${team1.id}`)) {
        team2 = teams[Math.floor(Math.random() * teams.length)];
      }

      const activity = activities[Math.floor(Math.random() * activities.length)];

      const team1Score = faker.number.int(10);
      const team2Score = faker.number.int(10);

      await prisma.match.create({
        data: {
          team1Id: team1.id,
          team2Id: team2.id,
          activityId: activity.id,
          team1Score,
          team2Score,
          startedAt: new Date(),
        }
      });

      matchesCreated.add(`${team1.id}-${team2.id}`);
      matchesCreated.add(`${team2.id}-${team1.id}`);
    }
  }
};
