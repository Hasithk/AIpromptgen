// Test Prisma connection
const { getBlogAutomationStatus } = require('./lib/prisma');

async function test() {
  try {
    console.log('Testing Prisma connection...');
    const status = await getBlogAutomationStatus();
    console.log('Success! Status:', status);
  } catch (error) {
    console.error('Error:', error);
  }
}

test();
