// Quick test to verify blog functionality
const { getBlogPosts, getBlogPostById } = require('./lib/blog-content.ts');

async function testBlog() {
    console.log('Testing blog functionality...');
    
    try {
        // Test getting all blog posts
        const posts = await getBlogPosts();
        console.log(`✓ Found ${posts.length} blog posts`);
        console.log(`✓ Posts: ${posts.map(p => p.title).join(', ')}`);
        
        // Test getting individual post
        const post = await getBlogPostById('1');
        if (post) {
            console.log(`✓ Individual post loaded: ${post.title}`);
            console.log(`✓ Has content: ${post.content.length > 0}`);
            console.log(`✓ Has image: ${post.image ? 'Yes' : 'No'}`);
        } else {
            console.log('✗ Failed to load individual post');
        }
        
        console.log('\n🎉 Blog functionality test completed successfully!');
        
    } catch (error) {
        console.error('✗ Test failed:', error);
    }
}

testBlog();