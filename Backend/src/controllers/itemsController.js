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