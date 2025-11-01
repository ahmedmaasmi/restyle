const { supabase } = require('../db');

// Get all favorites
exports.getFavorites = async (req, res) => {
  const { data, error } = await supabase.from('favorites').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a favorite
exports.addFavorite = async (req, res) => {
  const { user_id, item_id } = req.body;
  const { data, error } = await supabase.from('favorites').insert([{ user_id, item_id }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Remove a favorite
exports.removeFavorite = async (req, res) => {
  const { user_id, item_id } = req.body;
  const { data, error } = await supabase.from('favorites').delete().eq('user_id', user_id).eq('item_id', item_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
