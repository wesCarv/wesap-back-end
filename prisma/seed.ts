import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const roundsOfHashing = 10;

async function main() {
  const wesleyPassword = await bcrypt.hash('wes123456', roundsOfHashing);
  const nicolaiPassword = await bcrypt.hash('nico123456', roundsOfHashing);

  const user1 = await prisma.user.upsert({
    where: { email: 'wesley@email.com' },
    update: { password: wesleyPassword },
    create: {
      email: 'wesley@email.com',
      name: 'Wesley Carvalho',
      password: wesleyPassword,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'nicolai@email.com' },
    update: { password: nicolaiPassword },
    create: {
      email: 'nicolai@email.com',
      name: 'Nicolai Hygino',
      password: nicolaiPassword,
    },
  });

  const message1 = await prisma.message.upsert({
    where: { id: 1 },
    update: { userId: user1.id },
    create: {
      about: 'this is a simple message',
      userId: user1.id,
    },
  });

  const message2 = await prisma.message.upsert({
    where: { id: 2 },
    update: { userId: user2.id },
    create: {
      about: 'this is another simple message',
      userId: user2.id,
    },
  });

  console.log({ user1, user2, message1, message2 });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
