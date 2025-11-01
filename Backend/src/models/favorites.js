// Model for the 'favorites' table
// Columns: user_id, item_id

module.exports = {
  columns: [
    { name: 'user_id', type: 'uuid' },
    { name: 'item_id', type: 'uuid' }
  ]
};
