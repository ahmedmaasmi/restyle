// Model for the 'users' table
// Columns: id, full_name, username, email, password_hash, avatar_url, bio, rating, created_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'full_name', type: 'text' },
    { name: 'username', type: 'text' },
    { name: 'email', type: 'text' },
    { name: 'password_hash', type: 'text' },
    { name: 'avatar_url', type: 'text' },
    { name: 'bio', type: 'text' },
    { name: 'rating', type: 'integer' },
    { name: 'created_at', type: 'timestamp' }
  ]
};
