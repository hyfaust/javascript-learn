/**
 * Self-contained test for 06-express-api-server
 * Starts server on port 3096, runs tests, then exits cleanly.
 */
const http = require('http');

const PORT = 3096;
process.env.PORT = String(PORT);

// Load the app (this calls app.listen internally)
require('./index.js');

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = { hostname: '127.0.0.1', port: PORT, path, method, headers: { 'Content-Type': 'application/json' } };
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: JSON.parse(data) }));
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function runTests() {
  // Wait for server to be ready
  await new Promise((r) => setTimeout(r, 500));

  let passed = 0;
  let failed = 0;

  function check(name, condition) {
    if (condition) { console.log(`  ✅ ${name}`); passed++; }
    else { console.log(`  ❌ ${name}`); failed++; }
  }

  console.log('\n=== Testing 06-express-api-server ===\n');

  // Test 1: GET /
  const t1 = await request('GET', '/');
  check('GET / returns API info', t1.status === 200 && t1.body.name === 'Notes API');

  // Test 2: GET /api/notes
  const t2 = await request('GET', '/api/notes');
  check('GET /api/notes returns 3 notes', t2.status === 200 && t2.body.total === 3);

  // Test 3: POST /api/notes
  const t3 = await request('POST', '/api/notes', { title: 'Test', content: 'Hello' });
  check('POST /api/notes creates note (201)', t3.status === 201 && t3.body.data.id === 4);

  // Test 4: GET /api/notes/4
  const t4 = await request('GET', '/api/notes/4');
  check('GET /api/notes/4 returns created note', t4.status === 200 && t4.body.data.title === 'Test');

  // Test 5: PUT /api/notes/4
  const t5 = await request('PUT', '/api/notes/4', { title: 'Updated' });
  check('PUT /api/notes/4 updates note', t5.status === 200 && t5.body.data.title === 'Updated');

  // Test 6: DELETE /api/notes/4
  const t6 = await request('DELETE', '/api/notes/4');
  check('DELETE /api/notes/4 deletes note', t6.status === 200 && t6.body.data.id === 4);

  // Test 7: GET /api/notes/999 (404)
  const t7 = await request('GET', '/api/notes/999');
  check('GET /api/notes/999 returns 404', t7.status === 404);

  // Test 8: POST without body (400)
  const t8 = await request('POST', '/api/notes', {});
  check('POST without title returns 400', t8.status === 400);

  // Test 9: Search
  const t9 = await request('GET', '/api/notes?keyword=express');
  check('GET /api/notes?keyword=express filters', t9.status === 200 && t9.body.total === 1);

  console.log(`\n  Results: ${passed} passed, ${failed} failed\n`);
  process.exit(failed > 0 ? 1 : 0);
}

// Safety timeout
setTimeout(() => { console.log('TIMEOUT'); process.exit(1); }, 10000);

runTests().catch((err) => { console.error('Test error:', err); process.exit(1); });
