import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: Role.ADMIN,
    },
  });

  const lemonJuice = await prisma.ingredient.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Lemon juice',
      description: 'Fresh squeezed lemon juice',
      withAlcohol: false,
      userId: admin.id,
    },
  });

  const rum = await prisma.ingredient.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'White Rum',
      description: 'Traditional clear rum',
      withAlcohol: true,
      userId: admin.id,
    },
  });

  console.log('Database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });