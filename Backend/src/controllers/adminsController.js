const { supabase } = require('../db');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Create service role client for admin auth operations
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Get all admins with user details
exports.getAdmins = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('admins')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add an admin (promote user to admin)
exports.addAdmin = async (req, res) => {
  try {
    const { email, user_id, role = 'admin' } = req.body;

    let usersTableId = user_id;

    // If email is provided, look up the user in users table by email
    if (email && !user_id) {
      try {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id, email')
          .eq('email', email)
          .single();
        
        if (userError || !userData) {
          return res.status(404).json({ error: 'User not found with that email' });
        }

        usersTableId = userData.id;
        console.log('Found user in users table. ID:', usersTableId);
      } catch (error) {
        return res.status(500).json({ error: 'Failed to look up user: ' + error.message });
      }
    }

    if (!usersTableId) {
      return res.status(400).json({ error: 'Either email or user_id (from users table) is required' });
    }

    // Check if user is already an admin (using users table ID)
    const { data: existingAdmin, error: checkError } = await supabase
      .from('admins')
      .select('*')
      .eq('user_id', usersTableId) // Use users table ID
      .maybeSingle();

    if (existingAdmin) {
      return res.status(400).json({ error: 'User is already an admin' });
    }

    // Insert admin record using users table ID
    const { data, error } = await supabase
      .from('admins')
      .insert([{ 
        user_id: usersTableId, // Store users table ID
        role: role,
        created_at: new Date().toISOString()
      }])
      .select()
      .single();

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    console.log('Admin added successfully. User ID from users table:', usersTableId);
    res.status(201).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an admin's role
exports.updateAdminRole = async (req, res) => {
  try {
    const { id, role } = req.body;
    
    if (!id || !role) {
      return res.status(400).json({ error: 'Admin id and role are required' });
    }

    const { data, error } = await supabase
      .from('admins')
      .update({ role })
      .eq('id', id)
      .select()
      .single();

    if (error) return res.status(500).json({ error: error.message });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove admin (demote admin to regular user)
exports.removeAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Admin id is required' });
    }

    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('id', id);

    if (error) return res.status(500).json({ error: error.message });
    
    res.json({ message: 'Admin removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
