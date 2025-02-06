import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2'

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

const prisma = new PrismaClient();
const hashedPassword = argon.hash('qwerty123');
async function main() {
  // Create some users 
  const user1 = await prisma.user.create({
    data: {
      email: 'user1@example.com',
      username: 'username1',
      password: await hashedPassword,
      Task: {
        create: [
          { title: 'Task 1', description: 'Task 1 description', completed: true, due_date: addDays(new Date(), 3) },
          { title: 'Task 2', description: 'Task 2 description', completed: false, due_date: null },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      username: 'username2',
      password: await hashedPassword,
      Task: {
        create: [
          { title: 'Task 3', description: 'Task 3 description', completed: true, due_date: addDays(new Date(), 12) },
          { title: 'Task 4', description: 'Task 4 description', completed: true, due_date: null }, 
          { title: 'Task 5', description: 'Task 5 description', completed: false, due_date: addDays(new Date(), 4) }, 
        ],
      },
    },
  });

  console.log({ user1, user2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    (async () => {
      await prisma.$disconnect();
    })().catch(() => { });
  });