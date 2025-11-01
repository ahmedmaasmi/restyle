// Model for the 'admins' table
// Columns: id, user_id, role, created_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'user_id', type: 'uuid' },
    { name: 'role', type: 'text' },
    { name: 'created_at', type: 'timestamp' }
  ]
};
