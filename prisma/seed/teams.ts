import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export const createTeams = async (prisma: PrismaClient, numberOfTeams: number) => {
  const teams = [];

  for (let i = 0; i < numberOfTeams; i++) {
    const password = await bcrypt.hash(faker.internet.password(), 10);
    const leader = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.person.fullName(),
        password: password,
      },
    });

    const team = await prisma.team.create({
      data: {
        name: faker.company.name(),
        leader: { connect: { id: leader.id } },
      },
    });

    teams.push(team);
    }
  return teams;
};
