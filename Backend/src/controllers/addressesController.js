const { supabase } = require('../db');

// Get all addresses
exports.getAddresses = async (req, res) => {
  const { data, error } = await supabase.from('addresses').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add an address
exports.addAddress = async (req, res) => {
  const { id, user_id, full_name, phone_number, street_address, city, postal_code, created_at } = req.body;
  const { data, error } = await supabase.from('addresses').insert([{ id, user_id, full_name, phone_number, street_address, city, postal_code, created_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update an address
exports.updateAddress = async (req, res) => {
  const { id, full_name, phone_number, street_address, city, postal_code } = req.body;
  const updateData = { full_name, phone_number, street_address, city, postal_code };
  Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);
  const { data, error } = await supabase.from('addresses').update(updateData).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
