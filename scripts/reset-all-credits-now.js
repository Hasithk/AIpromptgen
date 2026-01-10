// Emergency Credit Reset Script
// Resets all users' credits immediately and sets up for Feb 1st reset

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAllCreditsNow() {
  try {
    console.log('🔄 Starting emergency credit reset...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        plan: true,
        credits: true
      }
    });

    console.log(`📊 Found ${users.length} users to reset\n`);

    if (users.length === 0) {
      console.log('❌ No users found.');
      return;
    }

    // Define monthly credits by plan
    const monthlyCredits = {
      free: 50,
      pro: 500,
      elite: 9999
    };

    // Set reset date to January 1, 2026
    // This ensures they won't get reset again this month when they log in
    const resetDate = new Date('2026-01-01T00:00:00Z');
    const now = new Date();

    if (users.length === 0) {
      console.log('ℹ️  No users found. This is normal if no one has signed up yet.');
      console.log('   Users will get proper credits when they sign up via Google OAuth.\n');
      return;
    }

    console.log(`📅 Reset date set to: ${resetDate.toISOString()}`);
    console.log(`📅 Current date: ${now.toISOString()}`);
    console.log(`📅 Next reset will be: February 1, 2026\n`);
    console.log('─'.repeat(80));

    let successCount = 0;
    let errorCount = 0;

    // Reset each user
    for (const user of users) {
      const creditsToSet = monthlyCredits[user.plan] || 50;
      
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: creditsToSet,
            monthlyCreditsUsed: 0,
            lastCreditResetDate: resetDate
          }
        });

        console.log(`✅ ${user.email}`);
        console.log(`   Plan: ${user.plan.toUpperCase()} | Old Credits: ${user.credits} → New Credits: ${creditsToSet}`);
        console.log('');
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to reset ${user.email}:`, error.message);
        errorCount++;
      }
    }

    console.log('─'.repeat(80));
    console.log(`\n✨ Credit Reset Complete!`);
    console.log(`   ✅ Success: ${successCount} users`);
    console.log(`   ❌ Failed: ${errorCount} users`);
    console.log(`\n📋 Summary:`);
    console.log(`   - All users now have fresh credits for January 2026`);
    console.log(`   - Reset date set to Jan 1, 2026`);
    console.log(`   - Next automatic reset: Feb 1, 2026 (on login or via cron)`);
    console.log(`\n🎯 What's Next:`);
    console.log(`   1. Restart your dev server (if running)`);
    console.log(`   2. Sign out and sign back in`);
    console.log(`   3. Your credits should now show the reset amount!`);

  } catch (error) {
    console.error('❌ Error during credit reset:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the reset
resetAllCreditsNow();
