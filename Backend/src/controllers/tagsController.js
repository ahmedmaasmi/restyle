const { supabase } = require('../db');

// Get all tags
exports.getTags = async (req, res) => {
  const { data, error } = await supabase.from('tags').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a tag
exports.addTag = async (req, res) => {
  const { name } = req.body;
  const { data, error } = await supabase.from('tags').insert([{ name }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update a tag's name
exports.updateTag = async (req, res) => {
  const { id, name } = req.body;
  const { data, error } = await supabase.from('tags').update({ name }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
