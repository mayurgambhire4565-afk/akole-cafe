import bcrypt from 'bcrypt';
import prisma from './database/prisma';
import { generateReferralCode } from './utils/jwt';

async function createUser() {
  const email = 'tejas@gmail.com';
  const name = 'Tejas';
  const password = '1234567890';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists in DB:', existing);
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword, isVerified: true, isActive: true },
    });
    console.log('User password updated successfully!');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const referralCode = generateReferralCode(name);
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      isVerified: true,
      isActive: true,
      referralCode,
      cart: { create: {} },
    },
  });
  console.log('User created successfully:', user);
}
createUser()
  .catch(console.error)
  .finally(() => prisma.$disconnect());