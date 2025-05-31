// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Criar User admin
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Admin User',
    },
  });

  // 2. Criar Enterprise com adminUserId
  const enterprise = await prisma.enterprise.create({
    data: {
      name: 'Empresa Exemplo',
      adminUserId: adminUser.id,
    },
  });

  // 3. Criar outro usuário
  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: 'user123',
      name: 'Normal User',
    },
  });

  // 4. Criar Team com admin e user
  const team = await prisma.team.create({
    data: {
      name: 'Equipe Alpha',
      liderId: adminUser.id,
      enterpriseId: enterprise.id,
      users: {
        connect: [{ id: adminUser.id }, { id: user.id }],
      },
    },
  });

  // 5. Criar Feedback
  await prisma.feedback.create({
    data: {
      userId: user.id,
    },
  });
}

main()
  .then(async () => {
    console.log('Seed concluído com sucesso!');
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
