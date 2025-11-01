// Model for the 'messages' table
// Columns: id, sender_id, receiver_id, item_id, content, created_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'sender_id', type: 'uuid' },
    { name: 'receiver_id', type: 'uuid' },
    { name: 'item_id', type: 'uuid' },
    { name: 'content', type: 'text' },
    { name: 'created_at', type: 'timestamp' }
  ]
};
