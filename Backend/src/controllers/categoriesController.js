const { supabase } = require('../db');

// Get all categories
exports.getCategories = async (req, res) => {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a category
exports.addCategory = async (req, res) => {
  const { id, name } = req.body;
  const { data, error } = await supabase.from('categories').insert([{ id, name }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update a category name
exports.updateCategory = async (req, res) => {
  const { id, name } = req.body;
  const { data, error } = await supabase.from('categories').update({ name }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};