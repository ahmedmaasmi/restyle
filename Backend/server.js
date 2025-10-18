import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './src/db/index.js';  // ✅ FIXED path
import { getItems } from './src/controllers/itemsController.js'; // ✅ Add .js if using ES modules
import { getCategories } from './src/controllers/categoriesController.js'; 
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Example route to test connection
app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

app.use('/items', getItems);
app.use('/categories', getCategories); // ✅ FIXED to use categories route

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
