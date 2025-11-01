const { supabase } = require('../db');

// Get all users
exports.getUsers = async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Get user by ID
exports.getUserById = async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase.from('users').select('*').eq('id', id).single();
  if (error) return res.status(500).json({ error: error.message });
  if (!data) return res.status(404).json({ error: 'User not found' });
  res.json(data);
};

// Add a user (registration)
exports.addUser = async (req, res) => {
  const { id, full_name, username, email, password_hash, avatar_url, bio, rating, created_at } = req.body;
  const { data, error } = await supabase.from('users').insert([{ id, full_name, username, email, password_hash, avatar_url, bio, rating, created_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update user profile
exports.updateUser = async (req, res) => {
  const { id, full_name, username, avatar_url, bio } = req.body;
  const updateData = { full_name, username, avatar_url, bio };
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
  const { data, error } = await supabase.from('users').update(updateData).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
