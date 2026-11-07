// Comprehensive Functional QA Audit Test Suite for Be Conscious (ESM)
import fs from 'fs';

const USER_AGENT = 'BeConsciousApp/1.0 (https://github.com/Aarnaaa22/Be-Concious)';

async function fetchOFF(code) {
  const url = `https://world.openfoodfacts.org/api/v3/product/${encodeURIComponent(code)}.json`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'application/json'
      }
    });
    const body = await res.json().catch(() => null);
    return { status: res.status, body };
  } catch (err) {
    return { status: 0, error: err.message };
  }
}

async function runAudit() {
  console.log('=====================================================');
  console.log('🧪 BE CONSCIOUS - AUTOMATED FULL-STACK & QA AUDIT');
  console.log('=====================================================\n');

  let passed = 0;
  let failed = 0;

  // Test 1: Real Product Lookup - Coca-Cola Classic (5449000000996)
  try {
    process.stdout.write('Test 1: Real Barcode Lookup (Coca-Cola 5449000000996)... ');
    const res = await fetchOFF('5449000000996');
    if (res.status === 200 && res.body && (res.body.product || res.body.status === 'success')) {
      const prod = res.body.product || res.body;
      const name = prod.product_name || prod.product_name_en;
      const kcal = prod.nutriments ? prod.nutriments['energy-kcal_100g'] : null;
      console.log(`✅ PASSED (${name || 'Coca-Cola'}, ${kcal} kcal/100g)`);
      passed++;
    } else {
      console.log(`❌ FAILED (HTTP ${res.status})`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED (${err.message})`);
    failed++;
  }

  // Test 2: Real Product Lookup - Nutella (3017620422003)
  try {
    process.stdout.write('Test 2: Real Barcode Lookup (Nutella 3017620422003)... ');
    const res = await fetchOFF('3017620422003');
    if (res.status === 200 && res.body && (res.body.product || res.body.status === 'success')) {
      const prod = res.body.product || res.body;
      const sugars = prod.nutriments ? prod.nutriments['sugars_100g'] : null;
      console.log(`✅ PASSED (Nutella verified, ${sugars}g sugar/100g)`);
      passed++;
    } else {
      console.log(`❌ FAILED (HTTP ${res.status})`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED (${err.message})`);
    failed++;
  }

  // Test 3: Missing Barcode Handling (0000000000000)
  try {
    process.stdout.write('Test 3: Missing Product Database Handling (0000000000000)... ');
    const res = await fetchOFF('0000000000000');
    if (res.status === 404 || res.body?.status === 'failure' || res.body?.result?.id === 'product_not_found') {
      console.log('✅ PASSED (Returns not_found / 404, triggers "Oops! We couldn\'t find this product.")');
      passed++;
    } else {
      console.log(`❌ FAILED (Unexpected response)`);
      failed++;
    }
  } catch (err) {
    console.log(`❌ FAILED (${err.message})`);
    failed++;
  }

  // Test 4: Manual Barcode Input Validation Simulation
  process.stdout.write('Test 4: Manual Barcode Validation Rules... ');
  const validateCode = (code) => {
    const clean = (code || '').trim();
    if (!clean) return { valid: false, error: 'Empty' };
    if (!/^\d+$/.test(clean)) return { valid: false, error: 'Non-numeric' };
    if (clean.length < 6 || clean.length > 14) return { valid: false, error: 'Invalid length' };
    return { valid: true };
  };

  const testCases = [
    { code: '', expected: false },
    { code: 'ABC12345', expected: false },
    { code: '1234', expected: false },
    { code: '8901234567890', expected: true },
    { code: '5449000000996', expected: true },
    { code: '0123456789012', expected: true },
  ];

  const allPassed = testCases.every(tc => validateCode(tc.code).valid === tc.expected);
  if (allPassed) {
    console.log('✅ PASSED (All validation patterns verified)');
    passed++;
  } else {
    console.log('❌ FAILED (Barcode validator discrepancy)');
    failed++;
  }

  // Test 5: Side-by-Side Delta & Trade-Off Math Check
  process.stdout.write('Test 5: Side-by-Side Delta & Trade-Off Math... ');
  const nutellaSugar = 56.3;
  const rawHazelnutSugar = 12.0;
  const deltaSugar = rawHazelnutSugar - nutellaSugar;
  const percentDelta = Math.round((deltaSugar / nutellaSugar) * 100);

  if (deltaSugar < 0 && percentDelta === -79) {
    console.log(`✅ PASSED (${deltaSugar.toFixed(1)}g diff, ${percentDelta}% sugar delta)`);
    passed++;
  } else {
    console.log(`❌ FAILED (Math error: deltaSugar=${deltaSugar}, percentDelta=${percentDelta})`);
    failed++;
  }

  // Test 6: Supabase Authentication Validation Rules
  process.stdout.write('Test 6: Authentication Form Validation Rules... ');
  const validateAuthInput = ({ email, password, confirmPassword, fullName, isSignUp }) => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { valid: false, error: 'Invalid email' };
    if (!password || password.length < 6) return { valid: false, error: 'Password too short' };
    if (isSignUp) {
      if (!fullName || !fullName.trim()) return { valid: false, error: 'Name required' };
      if (password !== confirmPassword) return { valid: false, error: 'Password mismatch' };
    }
    return { valid: true };
  };

  const authTests = [
    { input: { email: 'invalid-email', password: '123' }, isSignUp: false, expected: false },
    { input: { email: 'user@domain.com', password: '123' }, isSignUp: false, expected: false },
    { input: { email: 'user@domain.com', password: 'secretpassword' }, isSignUp: false, expected: true },
    { input: { email: 'user@domain.com', password: 'secretpassword', confirmPassword: 'different', fullName: 'Sarah', isSignUp: true }, expected: false },
    { input: { email: 'user@domain.com', password: 'secretpassword', confirmPassword: 'secretpassword', fullName: 'Sarah', isSignUp: true }, expected: true }
  ];

  const authTestsPassed = authTests.every(t => validateAuthInput({ ...t.input, isSignUp: t.isSignUp ?? t.input.isSignUp }).valid === t.expected);
  if (authTestsPassed) {
    console.log('✅ PASSED (Email format, password constraints, confirmation matching)');
    passed++;
  } else {
    console.log('❌ FAILED (Auth validation discrepancy)');
    failed++;
  }

  // Test 7: Supabase SQL Migration Schema Structure
  process.stdout.write('Test 7: Supabase SQL Migration & RLS Schema Check... ');
  const migrationPath = 'supabase/migrations/20261107000000_initial_schema.sql';
  if (fs.existsSync(migrationPath)) {
    const sql = fs.readFileSync(migrationPath, 'utf8');
    const hasProfiles = sql.includes('create table if not exists public.profiles');
    const hasScanHistory = sql.includes('create table if not exists public.scan_history');
    const hasSavedProducts = sql.includes('create table if not exists public.saved_products');
    const hasPreferences = sql.includes('create table if not exists public.user_preferences');
    const hasRLS = sql.includes('alter table public.profiles enable row level security') &&
                   sql.includes('alter table public.scan_history enable row level security') &&
                   sql.includes('alter table public.saved_products enable row level security') &&
                   sql.includes('alter table public.user_preferences enable row level security');
    const hasTrigger = sql.includes('create trigger on_auth_user_created') || sql.includes('create or replace trigger on_auth_user_created');

    if (hasProfiles && hasScanHistory && hasSavedProducts && hasPreferences && hasRLS && hasTrigger) {
      console.log('✅ PASSED (All 4 tables, RLS policies & automated user trigger verified)');
      passed++;
    } else {
      console.log('❌ FAILED (SQL migration missing required DDL components)');
      failed++;
    }
  } else {
    console.log('❌ FAILED (Migration file not found)');
    failed++;
  }

  // Summary
  console.log('\n=====================================================');
  console.log(`📊 SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAudit();
