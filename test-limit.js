/**
 * Test script untuk visitor daily limit
 * Simulate 3 visitor IPs, masing-masing trigger view + click
 * Semua harus succeed, tapi call ke-2 harus return limited: true
 */

const storeId = 'b7cfa3ae-eb68-4509-91a3-3823539f93fe';
const baseUrl = 'http://localhost:4321/api/analytics/track';

async function trackWithIp(ip, eventType) {
  try {
    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': ip,
      },
      body: JSON.stringify({ storeId, eventType }),
    });

    const data = await response.json();
    return { ip, eventType, ...data };
  } catch (err) {
    return { ip, eventType, error: err.message };
  }
}

async function runTests() {
  console.log('=== TESTING DAILY VISITOR LIMIT ===\n');

  // Test 1: IP 192.168.1.104 - view
  console.log('Test 1: IP 192.168.1.104 - view (should succeed)');
  let result = await trackWithIp('192.168.1.104', 'store_view');
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('Expected: limited = false/undefined\n');

  // Test 2: IP 192.168.1.104 - view again (should be limited)
  console.log('Test 2: IP 192.168.1.104 - view again (should be LIMITED)');
  result = await trackWithIp('192.168.1.104', 'store_view');
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('Expected: limited = true\n');

  // Test 3: IP 192.168.1.104 - click (should succeed, different event type)
  console.log('Test 3: IP 192.168.1.104 - click (should succeed)');
  result = await trackWithIp('192.168.1.104', 'wa_click');
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('Expected: limited = false/undefined\n');

  // Test 4: IP 192.168.1.104 - click again (should be limited)
  console.log('Test 4: IP 192.168.1.104 - click again (should be LIMITED)');
  result = await trackWithIp('192.168.1.104', 'wa_click');
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('Expected: limited = true\n');

  // Test 5: IP 192.168.1.105 - view (should succeed, different IP)
  console.log('Test 5: IP 192.168.1.105 - view (should succeed, different IP)');
  result = await trackWithIp('192.168.1.105', 'store_view');
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('Expected: limited = false/undefined\n');

  // Test 6: IP 192.168.1.106 - click (should succeed, different IP)
  console.log('Test 6: IP 192.168.1.106 - click (should succeed, different IP)');
  result = await trackWithIp('192.168.1.106', 'wa_click');
  console.log('Result:', JSON.stringify(result, null, 2));
  console.log('Expected: limited = false/undefined\n');

  console.log('=== TESTS COMPLETE ===');
}

runTests();
