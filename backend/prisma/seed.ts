import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('demo1234', 12);

  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@scrum.signal' },
    update: {},
    create: {
      name: 'Demo Engineer',
      email: 'demo@scrum.signal',
      password,
    },
  });

  const pmUser = await prisma.user.upsert({
    where: { email: 'pm@scrum.signal' },
    update: {},
    create: {
      name: 'Demo PM',
      email: 'pm@scrum.signal',
      password,
    },
  });

  const org = await prisma.organization.upsert({
    where: { slug: 'signal-lab' },
    update: {},
    create: {
      name: 'Signal Lab',
      slug: 'signal-lab',
      plan: 'pro',
      members: {
        create: [
          { userId: demoUser.id, role: 'owner' },
          { userId: pmUser.id, role: 'admin' },
        ],
      },
    },
  });

  await prisma.user.update({
    where: { id: demoUser.id },
    data: { currentOrgId: org.id },
  });
  await prisma.user.update({
    where: { id: pmUser.id },
    data: { currentOrgId: org.id },
  });

  // Ensure memberships exist if org already did
  await prisma.member.upsert({
    where: { userId_orgId: { userId: demoUser.id, orgId: org.id } },
    update: {},
    create: { userId: demoUser.id, orgId: org.id, role: 'owner' },
  });
  await prisma.member.upsert({
    where: { userId_orgId: { userId: pmUser.id, orgId: org.id } },
    update: {},
    create: { userId: pmUser.id, orgId: org.id, role: 'admin' },
  });

  const start = new Date();
  start.setDate(start.getDate() - 5);
  const end = new Date();
  end.setDate(end.getDate() + 9);

  let sprint = await prisma.sprint.findFirst({
    where: { orgId: org.id, name: 'Sprint 24 — Signal Pipeline' },
  });

  if (!sprint) {
    sprint = await prisma.sprint.create({
      data: {
        name: 'Sprint 24 — Signal Pipeline',
        orgId: org.id,
        startDate: start,
        endDate: end,
        backlogItems: {
          create: [
            {
              title: 'Standup ingest API',
              description: 'Accept standup text and persist summary',
              storyPoints: 5,
              priority: 'high',
              status: 'done',
              completed: true,
              assignee: 'Demo Engineer',
            },
            {
              title: 'Blocker extraction',
              description: 'Regex + Gemini typed blockers',
              storyPoints: 8,
              priority: 'high',
              status: 'in-progress',
              completed: false,
              assignee: 'Demo Engineer',
            },
            {
              title: 'Dashboard health cards',
              storyPoints: 3,
              priority: 'medium',
              status: 'todo',
              completed: false,
              assignee: 'Demo PM',
            },
          ],
        },
      },
    });
  }

  const existingStandups = await prisma.standup.count({ where: { orgId: org.id } });
  if (existingStandups === 0) {
    const standup1 = await prisma.standup.create({
      data: {
        userId: demoUser.id,
        orgId: org.id,
        sprintId: sprint.id,
        summary:
          'Finished standup ingest. Today working on blocker extraction. Blocked waiting on API credentials from platform team.',
      },
    });

    await prisma.blocker.create({
      data: {
        standupId: standup1.id,
        orgId: org.id,
        type: 'dependency',
        severity: 'high',
        description: 'Waiting on API credentials from platform team',
        status: 'active',
      },
    });

    await prisma.standup.create({
      data: {
        userId: pmUser.id,
        orgId: org.id,
        sprintId: sprint.id,
        summary:
          'Reviewed burndown with eng. Planning risk check on open blockers. No personal blockers.',
      },
    });

    await prisma.standup.create({
      data: {
        userId: demoUser.id,
        orgId: org.id,
        sprintId: sprint.id,
        summary:
          'Merged RAG ask endpoint. Still blocked on credentials — build is failing in staging environment.',
        blockers: {
          create: {
            orgId: org.id,
            type: 'technical',
            severity: 'critical',
            description: 'Staging build failing due to missing credentials',
            status: 'active',
          },
        },
      },
    });
  }

  console.log('Seed complete');
  console.log('  Demo login: demo@scrum.signal / demo1234');
  console.log('  PM login:    pm@scrum.signal / demo1234');
  console.log(`  Org: ${org.name} (${org.slug})`);
  console.log(`  Sprint: ${sprint.name}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
