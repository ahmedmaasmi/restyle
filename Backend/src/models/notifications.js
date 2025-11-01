// Model for the 'notifications' table
// Columns: id, user_id, type, content, is_read, created_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'user_id', type: 'uuid' },
    { name: 'type', type: 'text' },
    { name: 'content', type: 'text' },
    { name: 'is_read', type: 'boolean' },
    { name: 'created_at', type: 'timestamp' }
  ]
};
