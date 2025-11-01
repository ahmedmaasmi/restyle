const { supabase } = require('../db');

// Get all item_tags
exports.getItemTags = async (req, res) => {
  const { data, error } = await supabase.from('item_tags').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a link between item and tag
exports.addItemTag = async (req, res) => {
  const { item_id, tag_id } = req.body;
  const { data, error } = await supabase.from('item_tags').insert([{ item_id, tag_id }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Remove a link between item and tag
exports.deleteItemTag = async (req, res) => {
  const { item_id, tag_id } = req.body;
  const { data, error } = await supabase.from('item_tags').delete().eq('item_id', item_id).eq('tag_id', tag_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
