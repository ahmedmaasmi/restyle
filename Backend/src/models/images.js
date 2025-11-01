// Model for the 'images' table
// Columns: id, item_id, image_url

module.exports = {
  columns: [
    { name: 'id', type: 'uuid' },
    { name: 'item_id', type: 'uuid' },
    { name: 'image_url', type: 'text' }
  ]
};
