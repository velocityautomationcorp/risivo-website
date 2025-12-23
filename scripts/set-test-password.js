/**
 * Set Test User Password Script
 * ===============================
 * This script generates a proper bcrypt hash for the test user password
 * and provides the SQL command to update the database.
 * 
 * Usage:
 * 1. Run: node scripts/set-test-password.js
 * 2. Copy the generated SQL UPDATE command
 * 3. Run it in Supabase SQL Editor
 */

const bcrypt = require('bcryptjs');

// Configuration
const TEST_EMAIL = 'jpfrancois2021@gmail.com';
const TEST_PASSWORD = 'risivo2025';
const SALT_ROUNDS = 10;

console.log('='.repeat(60));
console.log('PASSWORD HASH GENERATOR FOR RISIVO UPDATES PLATFORM');
console.log('='.repeat(60));
console.log('');
console.log(`Email: ${TEST_EMAIL}`);
console.log(`Password: ${TEST_PASSWORD}`);
console.log('');
console.log('Generating bcrypt hash...');
console.log('');

// Generate password hash
const passwordHash = bcrypt.hashSync(TEST_PASSWORD, SALT_ROUNDS);

console.log('✅ Hash generated successfully!');
console.log('');
console.log('='.repeat(60));
console.log('STEP 1: COPY THIS SQL COMMAND');
console.log('='.repeat(60));
console.log('');
console.log(`-- Set password for ${TEST_EMAIL}`);
console.log(`UPDATE waitlist_users`);
console.log(`SET`);
console.log(`  password_hash = '${passwordHash}',`);
console.log(`  is_active = true`);
console.log(`WHERE email = '${TEST_EMAIL}';`);
console.log('');
console.log('='.repeat(60));
console.log('STEP 2: RUN IN SUPABASE');
console.log('='.repeat(60));
console.log('');
console.log('1. Go to: https://supabase.com/dashboard');
console.log('2. Select project: sldpdgdkrakfzwtroglx');
console.log('3. Click "SQL Editor"');
console.log('4. Paste the SQL command above');
console.log('5. Click "Run"');
console.log('');
console.log('='.repeat(60));
console.log('STEP 3: VERIFY');
console.log('='.repeat(60));
console.log('');
console.log('-- Check if password is set:');
console.log(`SELECT`);
console.log(`  id,`);
console.log(`  email,`);
console.log(`  first_name,`);
console.log(`  last_name,`);
console.log(`  password_hash IS NOT NULL as has_password,`);
console.log(`  is_active`);
console.log(`FROM waitlist_users`);
console.log(`WHERE email = '${TEST_EMAIL}';`);
console.log('');
console.log('Expected result:');
console.log('  has_password: true');
console.log('  is_active: true');
console.log('');
console.log('='.repeat(60));
console.log('STEP 4: TEST LOGIN');
console.log('='.repeat(60));
console.log('');
console.log('After running the SQL:');
console.log('1. Go to: https://risivo.com/updates/login');
console.log(`2. Email: ${TEST_EMAIL}`);
console.log(`3. Password: ${TEST_PASSWORD}`);
console.log('4. Click "Login to Updates Platform"');
console.log('');
console.log('✅ You should be redirected to /updates/dashboard');
console.log('');
console.log('='.repeat(60));
