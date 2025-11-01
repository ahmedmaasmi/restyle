// Model for the 'payments' table
// Columns: id, order_id, payment_method, payment_status, transaction_id, created_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'order_id', type: 'uuid' },
    { name: 'payment_method', type: 'text' },
    { name: 'payment_status', type: 'text' },
    { name: 'transaction_id', type: 'text' },
    { name: 'created_at', type: 'timestamp' }
  ]
};
