// Model for the 'wallets' table
// Columns: user_id, balance, updated_at

module.exports = {
  columns: [
    { name: 'user_id', type: 'uuid' },
    { name: 'balance', type: 'numeric' },
    { name: 'updated_at', type: 'timestamp' }
  ]
};
