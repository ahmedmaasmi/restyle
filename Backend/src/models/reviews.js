// Model for the 'reviews' table
// Columns: id, reviewer_id, reviewed_id, order_id, rating, comment, created_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'reviewer_id', type: 'uuid' },
    { name: 'reviewed_id', type: 'uuid' },
    { name: 'order_id', type: 'uuid' },
    { name: 'rating', type: 'integer' },
    { name: 'comment', type: 'text' },
    { name: 'created_at', type: 'timestamp' }
  ]
};
