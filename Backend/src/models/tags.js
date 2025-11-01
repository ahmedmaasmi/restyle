// Model for the 'tags' table
// Columns: id [integer, PK, auto-increment], name [character varying, unique]

module.exports = {
  columns: [
    { name: 'id', type: 'integer', primary: true, autoIncrement: true },
    { name: 'name', type: 'text', unique: true }
  ]
};
