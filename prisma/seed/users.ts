import { PrismaClient, Team } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export const createUsers = async (prisma: PrismaClient, teams: Team[], numbersOfMembers: number) => {
  const password = await bcrypt.hash(faker.internet.password(), 10);

  for (const team of teams) {
    const members = await Promise.all(
      Array.from({ length: numbersOfMembers }, async () => {
        return prisma.user.create({
          data: {
            email: faker.internet.email(),
            username: faker.person.fullName(),
            password: password,
            team: {
              connect: { id: team.id },
            },
          },
        });
      })
    );

  }

  const specialUserPassword = await bcrypt.hash('password123', 10);

  const specialUser = await prisma.user.create({
    data: {
      email: 'test.user@example.com',
      username: 'Special User',
      password: specialUserPassword,
      team: {
        connect: { id: teams[0].id },
      },
    },
  });
};
