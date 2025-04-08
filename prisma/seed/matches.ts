import { PrismaClient, Team } from '@prisma/client';

export const createMatches = async (prisma: PrismaClient, teams: Team[], activities: { id: string }[], numberOfMatchesPerTeam: number) => {

  const matchesCreated: Set<string> = new Set();

  for (const team1 of teams) {
    for (let i = 0; i < numberOfMatchesPerTeam; i++) {
      let team2 = teams[Math.floor(Math.random() * teams.length)];

      while (team1 === team2 || matchesCreated.has(`${team1.id}-${team2.id}`) || matchesCreated.has(`${team2.id}-${team1.id}`)) {
        team2 = teams[Math.floor(Math.random() * teams.length)];
      }

      const activity = activities[Math.floor(Math.random() * activities.length)];

      const team1Score = Math.random() < 0.5 ? 3 : 0;
      const team2Score = Math.random() < 0.5 ? 3 : 0;

      await prisma.match.create({
        data: {
          team1Id: team1.id,
          team2Id: team2.id,
          activityId: activity.id,
          team1Score: (team1Score === team2Score) ? 1 : team1Score,
          team2Score: (team1Score === team2Score) ? 1 : team2Score,
          startedAt: new Date(),
        }
      });

      matchesCreated.add(`${team1.id}-${team2.id}`);
      matchesCreated.add(`${team2.id}-${team1.id}`);
    }
  }
};
