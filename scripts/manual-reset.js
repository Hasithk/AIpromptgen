// Manual credit reset script
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function manualReset() {
  try {
    console.log('🔄 Starting manual credit reset...\n');
    
    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Find users needing reset
    const usersNeedingReset = await prisma.user.findMany({
      where: {
        lastCreditResetDate: {
          lt: firstOfMonth
        }
      },
      select: {
        id: true,
        email: true,
        plan: true,
        credits: true,
        lastCreditResetDate: true
      }
    });

    console.log(`📊 Found ${usersNeedingReset.length} users needing reset\n`);

    if (usersNeedingReset.length === 0) {
      console.log('✅ No users need reset. All credits are up to date!');
      return;
    }

    const monthlyCredits = {
      free: 50,
      pro: 500,
      elite: 9999
    };

    console.log('═'.repeat(100));

    let successCount = 0;
    let errorCount = 0;

    for (const user of usersNeedingReset) {
      const creditsToSet = monthlyCredits[user.plan] || 50;
      
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            credits: creditsToSet,
            monthlyCreditsUsed: 0,
            lastCreditResetDate: now
          }
        });

        console.log(`✅ ${user.email}`);
        console.log(`   Old Credits: ${user.credits} → New Credits: ${creditsToSet}`);
        console.log(`   Plan: ${user.plan.toUpperCase()}`);
        console.log(`   Reset Date: ${now.toISOString()}\n`);
        
        successCount++;
      } catch (error) {
        console.error(`❌ Failed to reset ${user.email}:`, error.message);
        errorCount++;
      }
    }

    console.log('═'.repeat(100));
    console.log(`\n📊 Reset Complete:`);
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`\n🎉 All users now have their monthly credits!`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

manualReset();
