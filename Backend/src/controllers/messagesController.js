const { supabase } = require('../db');

// Get all messages
exports.getMessages = async (req, res) => {
  const { data, error } = await supabase.from('messages').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Send a new message
exports.addMessage = async (req, res) => {
  const { id, sender_id, receiver_id, item_id, content, created_at } = req.body;
  const { data, error } = await supabase.from('messages').insert([{ id, sender_id, receiver_id, item_id, content, created_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Optionally, could add filtering here for messages between users or by item
