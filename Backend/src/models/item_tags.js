// Model for the 'item_tags' table
// Columns: item_id [integer, PK, FK], tag_id [integer, PK, FK]

module.exports = {
  columns: [
    { name: 'item_id', type: 'integer', primary: true, foreignKey: { table: 'items', column: 'id' } },
    { name: 'tag_id', type: 'integer', primary: true, foreignKey: { table: 'tags', column: 'id' } }
  ]
};
