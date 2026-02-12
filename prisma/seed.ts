import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  const adminEmail = 'singhabhinav748@gmail.com';
  const hashed = await bcrypt.hash('jaishreeram@astrobyab', 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      passwordHash: hashed,
      emailVerified: new Date(),
    },
    create: {
      email: adminEmail,
      name: 'Acharya AB',
      role: 'ADMIN',
      emailVerified: new Date(),
      passwordHash: hashed,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
