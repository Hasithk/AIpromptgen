// Simple script to list registered user emails
// Run with: node scripts/list-users-simple.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('📊 Fetching registered users...\n');
    
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        credits: true,
        plan: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Total Registered Users: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found in the database.');
      console.log('   Users will appear here after they sign up via Google OAuth.');
      return;
    }

    // Statistics
    const byPlan = users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {});

    console.log('📈 Users by Plan:');
    Object.entries(byPlan).forEach(([plan, count]) => {
      console.log(`   ${plan}: ${count} users`);
    });
    console.log('');

    // Detailed list
    console.log('📧 Registered Users:');
    console.log('═'.repeat(100));
    users.forEach((user, index) => {
      const registeredDate = new Date(user.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.name || 'Not set'} | Plan: ${user.plan.toUpperCase()} | Credits: ${user.credits} | Joined: ${registeredDate}`);
      console.log('');
    });
    console.log('═'.repeat(100));
    
    // Simple email list
    console.log('\n📋 Email List (Copy-Paste Ready):');
    console.log('─'.repeat(100));
    users.forEach((user, i) => console.log(`${i + 1}. ${user.email}`));
    console.log('─'.repeat(100));

    // CSV format
    console.log('\n📄 CSV Format:');
    console.log('─'.repeat(100));
    console.log('Email,Name,Plan,Credits,Registered Date');
    users.forEach(user => {
      const date = new Date(user.createdAt).toISOString().split('T')[0];
      console.log(`${user.email},${user.name || 'N/A'},${user.plan},${user.credits},${date}`);
    });
    console.log('─'.repeat(100));

    // Summary
    const totalCredits = users.reduce((sum, u) => sum + (u.credits || 0), 0);
    console.log('\n📊 Summary:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Credits: ${totalCredits}`);
    console.log(`   Average Credits/User: ${users.length > 0 ? Math.round(totalCredits / users.length) : 0}`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    
    if (error.code === 'P2021' || error.message.includes('does not exist')) {
      console.log('\n💡 Database table does not exist.');
      console.log('   Run: npx prisma db push');
      console.log('   Or: npx prisma migrate dev');
    }
  } finally {
    await prisma.$disconnect();
  }
}

listUsers();
