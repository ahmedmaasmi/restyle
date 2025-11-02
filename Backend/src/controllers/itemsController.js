const { supabase } = require('../db');

// Get all items
exports.getItems = async (req, res) => {
  const { data, error } = await supabase.from('items').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add an item
exports.addItem = async (req, res) => {
  const { id, user_id, category_id, title, description, price, condition, brand, size, status, create_at } = req.body;
  const { data, error } = await supabase.from('items').insert([{ id, user_id, category_id, title, description, price, condition, brand, size, status, create_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update an item
exports.updateItem = async (req, res) => {
  const { id, title, description, price, condition, brand, size, status } = req.body;
  const updateData = { title, description, price, condition, brand, size, status };
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
  const { data, error } = await supabase.from('items').update(updateData).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Bulk insert items
exports.bulkInsertItems = async (req, res) => {
  const { items } = req.body;
  if (!items || !Array.isArray(items)) {
    return res.status(400).json({ error: 'Items array is required' });
  }

  try {
    const { data, error } = await supabase.from('items').insert(items).select();
    if (error) return res.status(500).json({ error: error.message });
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Bulk insert items for accounts
exports.bulkInsertItemsForAccounts = async (req, res) => {
  const { itemsPerUser = 5 } = req.body;
  
  try {
    // Get all users
    const { data: users, error: usersError } = await supabase
      .from('users')
      .select('id');

    if (usersError) {
      return res.status(500).json({ error: `Failed to fetch users: ${usersError.message}` });
    }

    if (!users || users.length === 0) {
      return res.status(404).json({ error: 'No users found in the database' });
    }

    // Get all categories
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id');

    if (categoriesError) {
      return res.status(500).json({ error: `Failed to fetch categories: ${categoriesError.message}` });
    }

    if (!categories || categories.length === 0) {
      return res.status(404).json({ error: 'No categories found. Please create at least one category first.' });
    }

    // Generate items for each user
    const allItems = [];
    const itemTypes = [
      'Vintage Denim Jacket', 'Classic Leather Boots', 'Designer Handbag', 'Silk Scarf',
      'Oversized Sunglasses', 'Statement Jewelry', 'Tailored Blazer', 'Wool Winter Coat',
      'Casual Sneakers', 'Formal Dress', 'Trendy Backpack', 'Wristwatch', 'Hoodie',
      'Jeans', 'T-Shirt', 'Skirt', 'Shorts', 'Sweater', 'Cardigan', 'Button-Up Shirt'
    ];
    const brands = [
      'Zara', 'H&M', 'Nike', 'Adidas', 'Levi\'s', 'Gucci', 'Prada', 'Chanel',
      'Versace', 'Tommy Hilfiger', 'Calvin Klein', 'Ralph Lauren', 'Uniqlo',
      'Forever 21', 'Urban Outfitters', 'American Eagle', 'Gap', 'Old Navy',
      'Banana Republic', 'J.Crew'
    ];
    const conditions = ['new', 'like_new', 'good', 'fair', 'poor'];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const statuses = ['active', 'pending', 'sold'];
    const descriptions = [
      'Beautiful piece in excellent condition. Barely worn.',
      'Great find! Perfect for any occasion.',
      'Stylish and comfortable. One of a kind.',
      'Well-maintained and ready to wear.',
      'Unique item with lots of character.'
    ];

    for (const user of users) {
      for (let i = 0; i < itemsPerUser; i++) {
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const randomTitle = itemTypes[Math.floor(Math.random() * itemTypes.length)];
        const randomBrand = brands[Math.floor(Math.random() * brands.length)];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const randomSize = sizes[Math.floor(Math.random() * sizes.length)];
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
        const randomPrice = parseFloat((Math.random() * 500 + 10).toFixed(2));

        allItems.push({
          user_id: user.id,
          category_id: randomCategory.id,
          title: `${randomBrand} ${randomTitle}`,
          description: randomDescription,
          price: randomPrice,
          condition: randomCondition,
          brand: randomBrand,
          size: randomSize,
          status: randomStatus,
          create_at: new Date().toISOString()
        });
      }
    }
    const batchSize = 100;
    let totalInserted = 0;
    const insertedData = [];

    for (let i = 0; i < allItems.length; i += batchSize) {
      const batch = allItems.slice(i, i + batchSize);
      const { data: batchData, error: batchError } = await supabase.from('items').insert(batch).select();
      
      if (batchError) {
        return res.status(500).json({ error: `Failed to insert batch: ${batchError.message}` });
      }
      
      totalInserted += batchData.length;
      insertedData.push(...batchData);
    }

    res.status(201).json({
      message: `Successfully created ${totalInserted} items for ${users.length} users`,
      itemsCreated: totalInserted,
      usersProcessed: users.length,
      itemsPerUser: itemsPerUser,
      data: insertedData
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};