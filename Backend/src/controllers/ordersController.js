const { supabase } = require('../db');

// Get all orders
exports.getOrders = async (req, res) => {
  const { data, error } = await supabase.from('orders').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a new order
exports.addOrder = async (req, res) => {
  const { id, buyer_id, seller_id, item_id, total_price, status, create_at } = req.body;
  const { data, error } = await supabase.from('orders').insert([{ id, buyer_id, seller_id, item_id, total_price, status, create_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  const { id, status } = req.body;
  const { data, error } = await supabase.from('orders').update({ status }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
