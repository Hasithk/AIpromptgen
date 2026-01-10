// Create/Reset user with credits
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createOrResetUser() {
  try {
    const email = 'lookinternationallk@gmail.com'; // Your email from screenshot
    const resetDate = new Date('2026-01-01T00:00:00Z');
    
    console.log('🔄 Creating/Resetting user account...\n');
    
    const user = await prisma.user.upsert({
      where: { email: email },
      create: {
        email: email,
        name: 'Look International',
        credits: 50,
        monthlyCreditsUsed: 0,
        lastCreditResetDate: resetDate,
        plan: 'free'
      },
      update: {
        credits: 50,
        monthlyCreditsUsed: 0,
        lastCreditResetDate: resetDate
      }
    });

    console.log('✅ User account ready!');
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Credits: ${user.credits}`);
    console.log(`   Plan: ${user.plan}`);
    console.log(`   Reset Date: ${user.lastCreditResetDate}`);
    console.log(`\n🎯 Next Steps:`);
    console.log(`   1. Sign out from your app`);
    console.log(`   2. Sign in again with Google`);
    console.log(`   3. Credits should show: 50`);
    console.log(`   4. Next reset: February 1, 2026`);

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

createOrResetUser();
