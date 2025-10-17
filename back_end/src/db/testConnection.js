import supabase from './index.js';

async function testConnection() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) console.error('❌ Supabase connection failed:', error.message);
  else console.log('✅ Supabase connected successfully. Example user:', data);
}

testConnection();
