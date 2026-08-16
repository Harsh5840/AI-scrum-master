import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const hoursAgo = (h: number) => new Date(Date.now() - h * 60 * 60 * 1000);

async function upsertUser(email: string, name: string, password: string) {
  return prisma.user.upsert({
    where: { email },
    update: { name, password },
    create: { email, name, password },
  });
}

async function main() {
  const password = await bcrypt.hash('demo1234', 12);

  const engineer = await upsertUser('demo@scrum.signal', 'Avery Lin', password);
  const pm = await upsertUser('pm@scrum.signal', 'Sam Rivera', password);
  const frontend = await upsertUser('maya@scrum.signal', 'Maya Chen', password);
  const platform = await upsertUser('jordan@scrum.signal', 'Jordan Hale', password);

  const org = await prisma.organization.upsert({
    where: { slug: 'signal-lab' },
    update: { name: 'Signal Lab' },
    create: {
      name: 'Signal Lab',
      slug: 'signal-lab',
      plan: 'pro',
    },
  });

  const members = [
    { userId: engineer.id, role: 'owner' },
    { userId: pm.id, role: 'admin' },
    { userId: frontend.id, role: 'member' },
    { userId: platform.id, role: 'member' },
  ];

  for (const m of members) {
    await prisma.member.upsert({
      where: { userId_orgId: { userId: m.userId, orgId: org.id } },
      update: { role: m.role },
      create: { userId: m.userId, orgId: org.id, role: m.role },
    });
    await prisma.user.update({
      where: { id: m.userId },
      data: { currentOrgId: org.id },
    });
  }

  await prisma.blocker.deleteMany({ where: { orgId: org.id } });
  await prisma.standup.deleteMany({ where: { orgId: org.id } });
  await prisma.backlogItem.deleteMany({
    where: { sprint: { orgId: org.id } },
  });
  await prisma.sprint.deleteMany({ where: { orgId: org.id } });

  const start = new Date();
  start.setDate(start.getDate() - 4);
  const end = new Date();
  end.setDate(end.getDate() + 10);

  const sprint = await prisma.sprint.create({
    data: {
      name: 'Window — checkout reliability',
      orgId: org.id,
      startDate: start,
      endDate: end,
    },
  });

  const s1 = await prisma.standup.create({
    data: {
      userId: engineer.id,
      orgId: org.id,
      sprintId: sprint.id,
      createdAt: hoursAgo(46),
      summary:
        'Yesterday: Finished standup ingest. Today: Blocker extraction. Blockers: Blocked waiting on API credentials from platform team.',
    },
  });

  const s2 = await prisma.standup.create({
    data: {
      userId: frontend.id,
      orgId: org.id,
      sprintId: sprint.id,
      createdAt: hoursAgo(28),
      summary:
        'Yesterday: Checkout empty-state polish. Today: Payment error copy. Blockers: Stuck waiting on brand tokens from design — buttons still use the old green.',
    },
  });

  const s3 = await prisma.standup.create({
    data: {
      userId: platform.id,
      orgId: org.id,
      sprintId: sprint.id,
      createdAt: hoursAgo(22),
      summary:
        'Yesterday: Rotated staging secrets. Today: Webhook replay. Blockers: Stripe webhook signing secret is missing in staging — payments fail the signature check.',
    },
  });

  const s4 = await prisma.standup.create({
    data: {
      userId: engineer.id,
      orgId: org.id,
      sprintId: sprint.id,
      createdAt: hoursAgo(8),
      summary:
        'Yesterday: Merged RAG ask endpoint. Today: Inbox list. Blockers: Staging build is failing due to missing credentials — still blocked on platform.',
    },
  });

  const s5 = await prisma.standup.create({
    data: {
      userId: pm.id,
      orgId: org.id,
      sprintId: sprint.id,
      createdAt: hoursAgo(6),
      summary:
        'Yesterday: Risk review with eng. Today: Triage inbox. No personal blockers. Watching staging credentials and Stripe webhook.',
    },
  });

  const s6 = await prisma.standup.create({
    data: {
      userId: frontend.id,
      orgId: org.id,
      sprintId: sprint.id,
      createdAt: hoursAgo(3),
      summary:
        'Yesterday: Flaky Playwright suite. Today: Quarantine the search spec. Blockers: CI e2e is flaky on docs search — not blocking checkout.',
    },
  });

  await prisma.blocker.createMany({
    data: [
      {
        standupId: s1.id,
        orgId: org.id,
        type: 'dependency',
        severity: 'high',
        description: 'Waiting on API credentials from platform team',
        status: 'active',
        detectedAt: hoursAgo(46),
      },
      {
        standupId: s4.id,
        orgId: org.id,
        type: 'technical',
        severity: 'critical',
        description: 'Staging build failing due to missing credentials',
        status: 'active',
        detectedAt: hoursAgo(8),
      },
      {
        standupId: s3.id,
        orgId: org.id,
        type: 'external',
        severity: 'high',
        description: 'Stripe webhook signing secret missing in staging',
        status: 'active',
        detectedAt: hoursAgo(22),
      },
      {
        standupId: s2.id,
        orgId: org.id,
        type: 'dependency',
        severity: 'medium',
        description: 'Waiting on brand tokens from design',
        status: 'active',
        detectedAt: hoursAgo(28),
      },
      {
        standupId: s6.id,
        orgId: org.id,
        type: 'technical',
        severity: 'low',
        description: 'CI e2e flaky on docs search',
        status: 'active',
        detectedAt: hoursAgo(3),
      },
      {
        standupId: s5.id,
        orgId: org.id,
        type: 'resource',
        severity: 'medium',
        description: 'Need help reviewing weekend on-call handoff notes',
        status: 'resolved',
        detectedAt: hoursAgo(30),
        resolvedAt: hoursAgo(12),
      },
    ],
  });

  console.log('Seed complete — Signal Lab risk inbox');
  console.log('  PM (interview):     pm@scrum.signal / demo1234');
  console.log('  Engineer:           demo@scrum.signal / demo1234');
  console.log('  Frontend:           maya@scrum.signal / demo1234');
  console.log('  Platform:           jordan@scrum.signal / demo1234');
  console.log(`  Org: ${org.name} · ${sprint.name}`);
  console.log('  Open inbox: staging credentials (critical), Stripe webhook (high), API creds (high)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
