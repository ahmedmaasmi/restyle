const { supabase } = require('../db');

// Get all notifications
exports.getNotifications = async (req, res) => {
  const { data, error } = await supabase.from('notifications').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a notification
exports.addNotification = async (req, res) => {
  const { id, user_id, type, content, is_read, created_at } = req.body;
  const { data, error } = await supabase.from('notifications').insert([{ id, user_id, type, content, is_read, created_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Mark notification as read (update is_read)
exports.markAsRead = async (req, res) => {
  const { id } = req.body;
  const { data, error } = await supabase.from('notifications').update({ is_read: true }).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
