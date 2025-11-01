const { supabase } = require('../db');

// Get all reviews
exports.getReviews = async (req, res) => {
  const { data, error } = await supabase.from('reviews').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};

// Add a review
exports.addReview = async (req, res) => {
  const { id, reviewer_id, reviewed_id, order_id, rating, comment, created_at } = req.body;
  const { data, error } = await supabase.from('reviews').insert([{ id, reviewer_id, reviewed_id, order_id, rating, comment, created_at }]);
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
};

// Update a review's comment or rating
exports.updateReview = async (req, res) => {
  const { id, rating, comment } = req.body;
  const updateData = {};
  if (rating !== undefined) updateData.rating = rating;
  if (comment !== undefined) updateData.comment = comment;
  const { data, error } = await supabase.from('reviews').update(updateData).eq('id', id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
};
