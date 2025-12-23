/**
 * Script to delete test users from the database
 * 
 * Run this script with:
 * npx ts-node scripts/delete-test-users.ts
 * 
 * Or you can run the SQL directly in Supabase Dashboard:
 * Go to https://supabase.com/dashboard/project/sldpdgdkrakfzwtroglx/sql
 */

import { createClient } from '@supabase/supabase-js';

// Test users to delete
const TEST_EMAILS = [
  'jp@risivo.com',
  'jp@buzgrowth.digital',
  'jpfrancois2021@gmail.com',
  'jpfrancois070879@gmail.com'
];

async function deleteTestUsers() {
  // Get environment variables
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    console.log('\nSet them like this:');
    console.log('export SUPABASE_URL="https://sldpdgdkrakfzwtroglx.supabase.co"');
    console.log('export SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"');
    process.exit(1);
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  console.log('🗑️  Deleting test users...\n');
  console.log('Emails to delete:');
  TEST_EMAILS.forEach(email => console.log(`  - ${email}`));
  console.log('');

  // Delete from user_sessions first (foreign key constraint)
  console.log('1. Deleting user sessions...');
  for (const email of TEST_EMAILS) {
    // First get the user ID
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', email.toLowerCase())
      .single();

    if (user) {
      const { error } = await supabase
        .from('user_sessions')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.log(`   ⚠️  Error deleting sessions for ${email}: ${error.message}`);
      } else {
        console.log(`   ✅ Deleted sessions for ${email}`);
      }
    }
  }

  // Delete from users table
  console.log('\n2. Deleting from users table...');
  for (const email of TEST_EMAILS) {
    const { error, count } = await supabase
      .from('users')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      console.log(`   ⚠️  Error deleting ${email}: ${error.message}`);
    } else {
      console.log(`   ✅ Deleted ${email} from users`);
    }
  }

  // Delete from waitlist_users table
  console.log('\n3. Deleting from waitlist_users table...');
  for (const email of TEST_EMAILS) {
    const { error } = await supabase
      .from('waitlist_users')
      .delete()
      .eq('email', email.toLowerCase());

    if (error) {
      console.log(`   ⚠️  Error deleting ${email}: ${error.message}`);
    } else {
      console.log(`   ✅ Deleted ${email} from waitlist_users`);
    }
  }

  console.log('\n✅ Done! Test users have been deleted.');
}

deleteTestUsers().catch(console.error);
