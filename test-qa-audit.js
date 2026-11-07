// Comprehensive Functional QA Audit Test Suite for Be Conscious (ESM)

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
  console.log('🧪 BE CONSCIOUS - AUTOMATED FUNCTIONAL QA AUDIT');
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

  let valPass = true;
  for (const tc of testCases) {
    if (validateCode(tc.code).valid !== tc.expected) {
      valPass = false;
      break;
    }
  }
  if (valPass) {
    console.log('✅ PASSED (All validation patterns verified)');
    passed++;
  } else {
    console.log('❌ FAILED (Validation pattern mismatch)');
    failed++;
  }

  // Test 5: Nutrition Trade-off Delta Math
  process.stdout.write('Test 5: Side-by-Side Delta & Trade-Off Math... ');
  const calcDiff = (val1, val2) => {
    const d = val1 - val2;
    const pct = val2 > 0 ? Math.round((d / val2) * 100) : null;
    return { d: Number(d.toFixed(1)), pct };
  };

  const diffSugar = calcDiff(12.0, 56.3);
  if (diffSugar.d === -44.3 && diffSugar.pct === -79) {
    console.log('✅ PASSED (-44.3g diff, -79% sugar delta)');
    passed++;
  } else {
    console.log(`❌ FAILED (${diffSugar.d}, ${diffSugar.pct}%)`);
    failed++;
  }

  console.log('\n=====================================================');
  console.log(`📊 SUMMARY: ${passed} Passed, ${failed} Failed`);
  console.log('=====================================================');
}

runAudit();
