// Model for the 'addresses' table
// Columns: id, user_id, full_name, phone_number, street_address, city, postal_code, created_at

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'user_id', type: 'uuid' },
    { name: 'full_name', type: 'text' },
    { name: 'phone_number', type: 'text' },
    { name: 'street_address', type: 'text' },
    { name: 'city', type: 'text' },
    { name: 'postal_code', type: 'text' },
    { name: 'created_at', type: 'timestamp' }
  ]
};
