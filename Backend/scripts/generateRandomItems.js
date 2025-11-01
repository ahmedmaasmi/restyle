const { supabase } = require('../src/db');

// Sample data arrays for generating random items
const itemTypes = [
  'Vintage Denim Jacket',
  'Classic Leather Boots',
  'Designer Handbag',
  'Silk Scarf',
  'Oversized Sunglasses',
  'Statement Jewelry',
  'Tailored Blazer',
  'Wool Winter Coat',
  'Casual Sneakers',
  'Formal Dress',
  'Trendy Backpack',
  'Wristwatch',
  'Hoodie',
  'Jeans',
  'T-Shirt',
  'Skirt',
  'Shorts',
  'Sweater',
  'Cardigan',
  'Button-Up Shirt'
];

const brands = [
  'Zara',
  'H&M',
  'Nike',
  'Adidas',
  'Levi\'s',
  'Gucci',
  'Prada',
  'Chanel',
  'Versace',
  'Tommy Hilfiger',
  'Calvin Klein',
  'Ralph Lauren',
  'Uniqlo',
  'Forever 21',
  'Urban Outfitters',
  'American Eagle',
  'Gap',
  'Old Navy',
  'Banana Republic',
  'J.Crew'
];

const conditions = ['new', 'like_new', 'good', 'fair', 'poor'];
const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const statuses = ['active', 'pending', 'sold'];

const descriptions = [
  'Beautiful piece in excellent condition. Barely worn.',
  'Great find! Perfect for any occasion.',
  'Stylish and comfortable. One of a kind.',
  'Well-maintained and ready to wear.',
  'Unique item with lots of character.',
  'High quality material and craftsmanship.',
  'Fashion-forward piece that stands out.',
  'Classic design that never goes out of style.',
  'Great addition to any wardrobe.',
  'Perfect condition, looks brand new.'
];

// Generate a random item
function generateRandomItem(userId, categoryId) {
  const randomTitle = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  const randomBrand = brands[Math.floor(Math.random() * brands.length)];
  const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
  const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
  const randomPrice = (Math.random() * 500 + 10).toFixed(2); // Price between $10 and $510

  // Don't include id - let database auto-generate it
  return {
    user_id: userId,
    category_id: categoryId,
    title: `${randomBrand} ${randomTitle}`,
    description: randomDescription,
    price: parseFloat(randomPrice),
    condition: randomCondition,
    brand: randomBrand,
    size: randomSize,
    status: randomStatus,
    create_at: new Date().toISOString()
  };
}

// Main function to generate and insert items
async function generateItemsForAllAccounts(itemsPerUser = 5) {
  try {
    console.log('🚀 Starting bulk item generation...\n');

    // Get all users
    console.log('📋 Fetching all users...');
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id');

    if (usersError) {
      throw new Error(`Failed to fetch users: ${usersError.message}`);
    }

    if (!users || users.length === 0) {
      console.log('❌ No users found in the database.');
      return;
    }

    console.log(`✅ Found ${users.length} users\n`);

    // Get all categories
    console.log('📋 Fetching categories...');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id');

    if (categoriesError) {
      throw new Error(`Failed to fetch categories: ${categoriesError.message}`);
    }

    if (!categories || categories.length === 0) {
      console.log('❌ No categories found. Please create at least one category first.');
      return;
    }

    console.log(`✅ Found ${categories.length} categories\n`);

    // Generate items for each user
    console.log(`🔄 Generating ${itemsPerUser} items per user...`);
    const allItems = [];

    for (const user of users) {
      for (let i = 0; i < itemsPerUser; i++) {
        // Randomly select a category for each item
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const item = generateRandomItem(user.id, randomCategory.id);
        allItems.push(item);
      }
    }

    console.log(`✅ Generated ${allItems.length} items\n`);

    // Insert items in batches (Supabase has a limit on batch size)
    const batchSize = 100;
    let insertedCount = 0;

    console.log('💾 Inserting items into database...');
    for (let i = 0; i < allItems.length; i += batchSize) {
      const batch = allItems.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('items')
        .insert(batch)
        .select();

      if (error) {
        console.error(`❌ Error inserting batch ${Math.floor(i / batchSize) + 1}:`, error.message);
      } else {
        insertedCount += data.length;
        console.log(`  ✓ Inserted batch ${Math.floor(i / batchSize) + 1}: ${data.length} items`);
      }
    }

    console.log('\n🎉 Successfully completed!');
    console.log(`📊 Summary:`);
    console.log(`   - Users processed: ${users.length}`);
    console.log(`   - Items generated: ${allItems.length}`);
    console.log(`   - Items inserted: ${insertedCount}`);
    console.log(`   - Items per user: ${itemsPerUser}\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

// Run the script
const itemsPerUser = parseInt(process.argv[2]) || 5;
console.log(`⚙️  Configuration: ${itemsPerUser} items per user\n`);

generateItemsForAllAccounts(itemsPerUser)
  .then(() => {
    console.log('✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });

