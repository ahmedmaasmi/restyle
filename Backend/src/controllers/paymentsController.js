const { supabase } = require('../db');

// Get all payments
exports.getPayments = async (req, res) => {
  const { data, error } = await supabase.from('payments').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a payment
exports.addPayment = async (req, res) => {
  const { id, order_id, payment_method, payment_status, transaction_id, created_at } = req.body;
  const { data, error } = await supabase.from('payments').insert([{ id, order_id, payment_method, payment_status, transaction_id, created_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update a payment's status
exports.updatePayment = async (req, res) => {
  const { id, payment_status } = req.body;
  const { data, error } = await supabase.from('payments').update({ payment_status }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
