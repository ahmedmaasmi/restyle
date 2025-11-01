// Model for the 'items' table
// Columns: id, user_id, category_id, title, description, price, condition, brand, size, status, create_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'user_id', type: 'uuid' },
    { name: 'category_id', type: 'uuid' },
    { name: 'title', type: 'text' },
    { name: 'description', type: 'text' },
    { name: 'price', type: 'numeric' },
    { name: 'condition', type: 'text' },
    { name: 'brand', type: 'text' },
    { name: 'size', type: 'text' },
    { name: 'status', type: 'text' },
    { name: 'create_at', type: 'timestamp' }
  ]
};
