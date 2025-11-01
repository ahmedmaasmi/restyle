const { supabase } = require('../db');

// Get all admins
exports.getAdmins = async (req, res) => {
  const { data, error } = await supabase.from('admins').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add an admin
exports.addAdmin = async (req, res) => {
  const { id, user_id, role, created_at } = req.body;
  const { data, error } = await supabase.from('admins').insert([{ id, user_id, role, created_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update an admin's role
exports.updateAdminRole = async (req, res) => {
  const { id, role } = req.body;
  const { data, error } = await supabase.from('admins').update({ role }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
