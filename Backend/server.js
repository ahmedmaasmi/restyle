const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { supabase } = require('./src/db/index.js');
const itemsRouter = require('./src/routes/items.js');
const categoriesRouter = require('./src/routes/categories.js');
const favoritesRouter = require('./src/routes/favorites.js');
const walletsRouter = require('./src/routes/wallets.js');
const messagesRouter = require('./src/routes/messages.js');
const adminsRouter = require('./src/routes/admins.js');
const ordersRouter = require('./src/routes/orders.js');
const reviewsRouter = require('./src/routes/reviews.js');
const usersRouter = require('./src/routes/users.js');
const addressesRouter = require('./src/routes/addresses.js');
const paymentsRouter = require('./src/routes/payments.js');
const notificationsRouter = require('./src/routes/notifications.js');
const imagesRouter = require('./src/routes/images.js');
const tagsRouter = require('./src/routes/tags.js');
const itemTagsRouter = require('./src/routes/item_tags.js');
const authRouter = require('./src/routes/auth.js');
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  if (req.method === 'POST' && (req.path === '/auth/register' || req.path === '/auth/login')) {
    console.log(`${req.path} request body:`, { 
      email: req.body.email, 
      hasPassword: !!req.body.password,
      hasFullName: !!req.body.full_name
    });
  }
  next();
});

// Example route to test connection
app.get('/users', async (req, res) => {
  const { data, error } = await supabase.from('users').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Auth routes
app.use('/auth', authRouter);

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
