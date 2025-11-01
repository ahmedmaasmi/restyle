const { supabase } = require('../db');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create anon key client for login operations
const supabaseAnon = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Register a new user
exports.register = async (req, res) => {
  try {
    console.log('Registration request received:', { email: req.body.email, hasPassword: !!req.body.password, full_name: req.body.full_name });
    const { email, password, full_name, username } = req.body;

    if (!email || !password) {
      console.error('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Creating user in Supabase Auth using signUp API...');
    console.log('Using Supabase URL:', process.env.SUPABASE_URL);
    console.log('Using Anon Key:', process.env.SUPABASE_ANON_KEY ? 'Set' : 'Not set');
    
    // Create user in Supabase Auth using regular signUp API
    const { data: authData, error: authError } = await supabaseAnon.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: full_name || '',
          username: username || '',
        }
      }
    });

    if (authError) {
      console.error('Supabase Auth error:', authError);
      return res.status(400).json({ error: authError.message });
    }

    if (!authData || !authData.user) {
      console.error('No user data returned from Supabase Auth');
      return res.status(400).json({ error: 'Failed to create user in Supabase Auth' });
    }

    const userId = authData.user.id;
    console.log('User created in Supabase Auth, ID:', userId);

    // Store user in users table
    // The users table has integer ID, so we'll let it auto-generate
    // We'll store the auth UUID in auth_user_id column (you may need to add this column)
    console.log('Inserting user into users table...');
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([{
        // Don't set id - let database auto-generate as integer
        // Store auth UUID separately if auth_user_id column exists
        email: email,
        full_name: full_name || '',
        username: username || email.split('@')[0],
        password_hash: '', // Password is handled by Supabase Auth
        avatar_url: `https://api.dicebear.com/6.x/identicon/svg?seed=${email}`,
        bio: '',
        rating: 5,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (userError) {
      console.error('Error inserting user into users table:', userError);
      // Note: We can't easily delete the auth user without admin API
      // The user will need to be cleaned up manually or via Supabase dashboard
      console.warn('User created in Supabase Auth but failed to insert in users table. User ID:', userId);
      return res.status(400).json({ error: userError.message });
    }

    console.log('User inserted into users table successfully');

    // Check if session was returned from signup
    // If no session, email confirmation is required
    const sessionData = authData.session;
    
    if (!sessionData) {
      console.log('No session from signup - email confirmation required');
      // User created successfully but needs to verify email
      return res.status(201).json({
        user: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          username: userData.username,
          avatar_url: userData.avatar_url,
          rating: userData.rating,
          isAdmin: false,
          adminRole: null,
        },
        session: null,
        message: 'User created successfully. Please check your email to confirm your account.',
        requiresVerification: true,
      });
    }

    console.log('Registration successful, returning response');
    res.status(201).json({
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        username: userData.username,
        avatar_url: userData.avatar_url,
        rating: userData.rating,
        isAdmin: false, // New registrations are not admins
        adminRole: null,
      },
      session: {
        access_token: sessionData.access_token,
        refresh_token: sessionData.refresh_token,
        expires_at: sessionData.expires_at,
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    console.log('=== LOGIN REQUEST RECEIVED ===');
    const { email, password } = req.body;
    console.log('Login attempt for email:', email);
    console.log('Has password:', !!password);

    if (!email || !password) {
      console.error('Missing email or password in login request');
      return res.status(400).json({ error: 'Email and password are required' });
    }

    console.log('Attempting to sign in with Supabase Auth...');
    // Sign in with Supabase Auth (using anon client)
    const { data, error } = await supabaseAnon.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Supabase Auth sign-in error:', {
        message: error.message,
        status: error.status,
        code: error.code,
        name: error.name
      });
      return res.status(401).json({ 
        error: error.message,
        code: error.code,
        details: 'Check if email is confirmed and credentials are correct'
      });
    }

    if (!data || !data.user) {
      console.error('No user data returned from Supabase Auth');
      return res.status(401).json({ error: 'Authentication failed - no user data' });
    }

    if (!data.session) {
      console.error('No session returned from Supabase Auth');
      return res.status(401).json({ error: 'Authentication failed - no session created' });
    }

    console.log('Supabase Auth sign-in successful. User ID:', data.user.id);
    console.log('User email:', data.user.email);
    console.log('User email confirmed:', data.user.email_confirmed_at ? 'Yes' : 'No');

    // Get user from users table by email (since id is integer and auth.id is UUID)
    console.log('Looking up user in users table by email:', email);
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, email, full_name, username, avatar_url, bio, rating, created_at')
      .eq('email', email)
      .single();

    if (userError) {
      console.error('Error looking up user in users table:', {
        message: userError.message,
        code: userError.code,
        details: userError.details,
        hint: userError.hint
      });
      return res.status(404).json({ 
        error: 'User profile not found',
        details: userError.message 
      });
    }

    if (!userData) {
      console.error('No user data found in users table for email:', email);
      return res.status(404).json({ error: 'User profile not found in database' });
    }

    console.log('User found in users table. User ID:', userData.id);

    // Check if user is admin - admins table uses auth user_id (UUID)
    console.log('Checking admin status for auth user ID:', data.user.id);
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id, role')
      .eq('user_id', data.user.id) // Use auth user ID (UUID) for admin lookup
      .single();

    const isAdmin = adminData && !adminError;
    console.log('Admin check result:', { isAdmin, adminData, adminError: adminError?.message });

    console.log('Login successful. Returning user data and session.');
    res.json({
      user: {
        id: userData.id,
        email: userData.email,
        full_name: userData.full_name,
        username: userData.username,
        avatar_url: userData.avatar_url,
        bio: userData.bio,
        rating: userData.rating,
        isAdmin: isAdmin,
        adminRole: adminData?.role || null,
      },
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      }
    });
  } catch (error) {
    console.error('=== LOGIN EXCEPTION ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    res.status(500).json({ 
      error: error.message || 'Internal server error',
      details: 'An unexpected error occurred during login'
    });
  }
};

// Logout user
exports.logout = async (req, res) => {
  try {
    // For Supabase, logout is typically handled client-side by clearing the session
    // Since we're doing it server-side, we just need to verify the token is valid
    // The token will expire naturally, or we can invalidate it if needed
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token is valid (optional - just to confirm it's a valid session)
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser(token);

    if (userError || !user) {
      // Token is already invalid, but we'll still return success for logout
      return res.json({ message: 'Logged out successfully' });
    }

    // Note: Supabase doesn't have a direct server-side logout endpoint
    // The token will expire based on its expiration time
    // Client should clear the token from storage
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'No authorization token provided' });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the token and get user using anon client with token
    const { data: { user }, error: userError } = await supabaseAnon.auth.getUser(token);

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Get user from users table by email (since id is integer and auth.id is UUID)
    const { data: userData, error: dbError } = await supabase
      .from('users')
      .select('id, email, full_name, username, avatar_url, bio, rating, created_at')
      .eq('email', user.email)
      .single();

    if (dbError || !userData) {
      return res.status(404).json({ error: 'User profile not found' });
    }

    // Check if user is admin - admins table uses auth user_id (UUID)
    const { data: adminData, error: adminError } = await supabase
      .from('admins')
      .select('id, role')
      .eq('user_id', user.id) // Use auth user ID (UUID) for admin lookup
      .single();

    const isAdmin = adminData && !adminError;

    res.json({
      id: userData.id,
      email: userData.email,
      full_name: userData.full_name,
      username: userData.username,
      avatar_url: userData.avatar_url,
      bio: userData.bio,
      rating: userData.rating,
      isAdmin: isAdmin,
      adminRole: adminData?.role || null,
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Refresh token
exports.refreshToken = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    const { data, error } = await supabaseAnon.auth.refreshSession({
      refresh_token,
    });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    res.json({
      session: {
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
        expires_at: data.session.expires_at,
      }
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

