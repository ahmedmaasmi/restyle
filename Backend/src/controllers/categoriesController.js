import supabase from '../db/index.js';

export const getCategories = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('categories')   // your table name
      .select('*');

    if (error) throw error;

    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching categories:', err.message);
    res.status(500).json({ error: err.message });
  }
};