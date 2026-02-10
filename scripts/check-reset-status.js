// Check credit reset status for all users
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkResetStatus() {
  try {
    console.log('🔍 Checking credit reset status...\n');
    
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        credits: true,
        monthlyCreditsUsed: true,
        lastCreditResetDate: true,
        plan: true,
        createdAt: true
      },
      orderBy: {
        email: 'asc'
      }
    });

    console.log(`Found ${users.length} users\n`);
    console.log('═'.repeat(100));

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    console.log(`📅 Current Date: ${now.toISOString()}`);
    console.log(`📅 First of Current Month: ${firstOfMonth.toISOString()}\n`);
    console.log('═'.repeat(100));

    users.forEach((user, index) => {
      const lastReset = user.lastCreditResetDate ? new Date(user.lastCreditResetDate) : null;
      const needsReset = !lastReset || lastReset < firstOfMonth;
      
      console.log(`\n${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Plan: ${user.plan.toUpperCase()}`);
      console.log(`   Current Credits: ${user.credits}`);
      console.log(`   Monthly Used: ${user.monthlyCreditsUsed}`);
      console.log(`   Last Reset Date: ${lastReset ? lastReset.toISOString() : 'NEVER'}`);
      console.log(`   Created At: ${user.createdAt.toISOString()}`);
      console.log(`   ⚠️  Needs Reset? ${needsReset ? 'YES - OVERDUE!' : 'No (already reset this month)'}`);
      
      if (needsReset) {
        const monthlyCredits = {
          free: 50,
          pro: 500,
          elite: 9999
        };
        const expectedCredits = monthlyCredits[user.plan] || 50;
        console.log(`   💡 Should have: ${expectedCredits} credits`);
      }
    });

    console.log('\n' + '═'.repeat(100));
    
    const usersNeedingReset = users.filter(u => {
      const lastReset = u.lastCreditResetDate ? new Date(u.lastCreditResetDate) : null;
      return !lastReset || lastReset < firstOfMonth;
    });

    console.log(`\n📊 Summary:`);
    console.log(`   Total Users: ${users.length}`);
    console.log(`   ⚠️  Users Needing Reset: ${usersNeedingReset.length}`);
    console.log(`   ✅ Users Already Reset: ${users.length - usersNeedingReset.length}`);

    if (usersNeedingReset.length > 0) {
      console.log(`\n⚠️  ACTION REQUIRED: ${usersNeedingReset.length} user(s) need credit reset!`);
      console.log(`   Run: node scripts/manual-reset.js`);
      console.log(`   Or: POST http://localhost:3000/api/admin/credits/reset (resetAll: true)`);
    } else {
      console.log(`\n✅ All users have been reset for the current month!`);
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkResetStatus();
