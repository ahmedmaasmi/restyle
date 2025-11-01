// Model for the 'orders' table
// Columns: id, buyer_id, seller_id, item_id, total_price, status, create_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'buyer_id', type: 'uuid' },
    { name: 'seller_id', type: 'uuid' },
    { name: 'item_id', type: 'uuid' },
    { name: 'total_price', type: 'numeric' },
    { name: 'status', type: 'text' },
    { name: 'create_at', type: 'timestamp' }
  ]
};
