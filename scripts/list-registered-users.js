// Script to list all registered users
// Run with: node scripts/list-registered-users.js

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listRegisteredUsers() {
  try {
    console.log('📊 Fetching registered users...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        credits: true,
        plan: true,
        createdAt: true,
        subscriptionStatus: true,
        _count: {
          select: {
            promptHistory: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`✅ Total Registered Users: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('No users found in the database.');
      return;
    }

    // Group by plan
    const byPlan = users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {});

    console.log('📈 Users by Plan:');
    Object.entries(byPlan).forEach(([plan, count]) => {
      console.log(`   ${plan}: ${count}`);
    });
    console.log('');

    // Display all emails
    console.log('📧 Registered Email Addresses:');
    console.log('─'.repeat(80));
    
    users.forEach((user, index) => {
      const prompts = user._count?.promptHistory || 0;
      const registeredDate = new Date(user.createdAt).toLocaleDateString();
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   Name: ${user.name || 'N/A'} | Plan: ${user.plan} | Credits: ${user.credits} | Prompts: ${prompts} | Registered: ${registeredDate}`);
      console.log('');
    });

    console.log('─'.repeat(80));
    
    // Export to simple list
    console.log('\n📋 Simple Email List (copy-paste ready):');
    console.log('─'.repeat(80));
    users.forEach(user => console.log(user.email));
    console.log('─'.repeat(80));

    // Statistics
    const totalCredits = users.reduce((sum, u) => sum + u.credits, 0);
    const totalPrompts = users.reduce((sum, u) => sum + (u._count?.promptHistory || 0), 0);
    
    console.log('\n📊 Summary Statistics:');
    console.log(`   Total Users: ${users.length}`);
    console.log(`   Total Credits Remaining: ${totalCredits}`);
    console.log(`   Total Prompts Generated: ${totalPrompts}`);
    console.log(`   Average Credits per User: ${Math.round(totalCredits / users.length)}`);
    
  } catch (error) {
    console.error('❌ Error fetching users:', error.message);
    
    if (error.code === 'P2021') {
      console.log('\n💡 The database table does not exist yet.');
      console.log('   Run: npx prisma migrate dev');
    } else if (error.message.includes('does not exist')) {
      console.log('\n💡 Some fields might not exist in your database yet.');
      console.log('   This is normal if you haven\'t run the migration.');
      console.log('   The basic user list should still work.');
      
      // Try simpler query
      try {
        const simpleUsers = await prisma.user.findMany({
          select: {
            email: true,
            name: true,
            createdAt: true
          }
        });
        
        console.log('\n📧 Basic Email List:');
        simpleUsers.forEach((user, i) => {
          console.log(`${i + 1}. ${user.email} (${user.name || 'N/A'})`);
        });
      } catch (err) {
        console.error('Could not fetch basic user list either:', err.message);
      }
    }
  } finally {
    await prisma.$disconnect();
  }
}

listRegisteredUsers();
