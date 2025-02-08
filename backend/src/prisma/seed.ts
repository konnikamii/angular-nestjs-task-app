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
          { title: 'Task 3', description: 'Task 3 description', completed: true, due_date: addDays(new Date(), 12) },
          { title: 'Task 4', description: 'Task 4 description', completed: true, due_date: null },
          { title: 'Task 5', description: 'Task 5 description', completed: false, due_date: addDays(new Date(), 4) },
          { title: 'Task 6', description: 'Task 6 description', completed: false, due_date: addDays(new Date(), 8) },
          { title: 'Task 7', description: 'Task 7 description', completed: false, due_date: addDays(new Date(), 2) },
          { title: 'Task 8', description: 'Task 8 description', completed: false, due_date: addDays(new Date(), 1) },
          { title: 'Task 9', description: 'Task 9 description', completed: false, due_date: addDays(new Date(), 5) },
          { title: 'Task 10', description: 'Task 10 description', completed: false, due_date: addDays(new Date(), 6) },
          { title: 'Task 11', description: 'Task 11 description', completed: false, due_date: addDays(new Date(), 7) },
          { title: 'Task 12', description: 'Task 12 description', completed: false, due_date: addDays(new Date(), 9) },
          { title: 'Task 13', description: 'Task 13 description', completed: false, due_date: addDays(new Date(), 10) },
          { title: 'Task 14', description: 'Task 14 description', completed: false, due_date: addDays(new Date(), 11) },
          { title: 'Task 15', description: 'Task 15 description', completed: false, due_date: addDays(new Date(), 12) },
          { title: 'Task 16', description: 'Task 16 description', completed: false, due_date: addDays(new Date(), 13) },
          { title: 'Task 17', description: 'Task 17 description', completed: false, due_date: addDays(new Date(), 14) },
          { title: 'Task 18', description: 'Task 18 description', completed: false, due_date: addDays(new Date(), 15) },
          { title: 'Task 19', description: 'Task 19 description', completed: false, due_date: addDays(new Date(), 16) },
          { title: 'Task 20', description: 'Task 20 description', completed: false, due_date: addDays(new Date(), 17) },
          { title: 'Task 21', description: 'Task 21 description', completed: false, due_date: addDays(new Date(), 18) },
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