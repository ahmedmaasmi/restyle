const { supabase } = require('../db');

// Get all wallets
exports.getWallets = async (req, res) => {
  const { data, error } = await supabase.from('wallets').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a wallet
exports.addWallet = async (req, res) => {
  const { user_id, balance, updated_at } = req.body;
  const { data, error } = await supabase.from('wallets').insert([{ user_id, balance, updated_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update a wallet balance
exports.updateWallet = async (req, res) => {
  const { user_id, balance, updated_at } = req.body;
  const { data, error } = await supabase.from('wallets').update({ balance, updated_at }).eq('user_id', user_id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
