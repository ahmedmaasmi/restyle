import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import supabase from './src/db/index.js';
import itemsRouter from './src/routes/items.js';
import categoriesRouter from './src/routes/categories.js';
import favoritesRouter from './src/routes/favorites.js';
import walletsRouter from './src/routes/wallets.js';
import messagesRouter from './src/routes/messages.js';
import adminsRouter from './src/routes/admins.js';
import ordersRouter from './src/routes/orders.js';
import reviewsRouter from './src/routes/reviews.js';
import usersRouter from './src/routes/users.js';
import addressesRouter from './src/routes/addresses.js';
import paymentsRouter from './src/routes/payments.js';
import notificationsRouter from './src/routes/notifications.js';
import imagesRouter from './src/routes/images.js';
import tagsRouter from './src/routes/tags.js';
import itemTagsRouter from './src/routes/item_tags.js';
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

app.use('/items', itemsRouter);
app.use('/categories', categoriesRouter);
app.use('/favorites', favoritesRouter);
app.use('/wallets', walletsRouter);
app.use('/messages', messagesRouter);
app.use('/admins', adminsRouter);
app.use('/orders', ordersRouter);
app.use('/reviews', reviewsRouter);
app.use('/users', usersRouter);
app.use('/addresses', addressesRouter);
app.use('/payments', paymentsRouter);
app.use('/notifications', notificationsRouter);
app.use('/images', imagesRouter);
app.use('/tags', tagsRouter);
app.use('/item_tags', itemTagsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
