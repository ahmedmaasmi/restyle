const { supabase } = require('../db');

// Get all images
exports.getImages = async (req, res) => {
  const { data, error } = await supabase.from('images').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add an image
exports.addImage = async (req, res) => {
  const { id, item_id, image_url } = req.body;
  const { data, error } = await supabase.from('images').insert([{ id, item_id, image_url }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update an image URL
exports.updateImage = async (req, res) => {
  const { id, image_url } = req.body;
  const { data, error } = await supabase.from('images').update({ image_url }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
