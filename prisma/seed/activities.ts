import { PrismaClient } from '@prisma/client';

export const createActivities = async (prisma: PrismaClient) => {
  const activityNames = ['Football', 'Basketball', 'Volleyball', 'Tennis', 'Badminton'];
  const activities = [];

  for (const activityName of activityNames) {
    const activity = await prisma.activity.create({
      data: { name: activityName }
    });
    activities.push(activity);
  }

  return activities;
};
