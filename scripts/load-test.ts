#!/usr/bin/env bun

/**
 * Load Testing Script for H14 Stress Test
 * Simulasi resolusi 50+ domain toko bersamaan
 * Target: SSR response time < 1 detik per store
 */

import http from 'http';

interface LoadTestConfig {
  baseUrl: string;
  storeDomains: string[];
  concurrentRequests: number;
  requestsPerStore: number;
  timeoutMs: number;
}

interface TestResult {
  store: string;
  statusCode: number;
  responseTime: number;
  success: boolean;
  error?: string;
}

const config: LoadTestConfig = {
  baseUrl: process.env.TEST_BASE_URL || 'http://localhost:4321',
  storeDomains: generateStoreDomainsForTesting(50),
  concurrentRequests: 10,
  requestsPerStore: 5,
  timeoutMs: 5000,
};

/**
 * Generate 50 test store subdomains
 */
function generateStoreDomainsForTesting(count: number): string[] {
  const domains: string[] = [];
  for (let i = 1; i <= count; i++) {
    domains.push(`store-${i.toString().padStart(3, '0')}`);
  }
  return domains;
}

/**
 * Fetch store page dengan host header untuk SSR
 */
function fetchStorefrontPage(
  subdomain: string,
  baseUrl: string,
  timeoutMs: number
): Promise<TestResult> {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const url = new URL(`/storefront/${subdomain}`, baseUrl);
    
    const timeoutHandle = setTimeout(() => {
      resolve({
        store: subdomain,
        statusCode: 0,
        responseTime: timeoutMs,
        success: false,
        error: `Timeout after ${timeoutMs}ms`,
      });
    }, timeoutMs);

    const req = http.get(url.toString(), {
      headers: {
        'Host': `${subdomain}.localhost:3000`,
      },
      timeout: timeoutMs,
    }, (res) => {
      const responseTime = Date.now() - startTime;
      clearTimeout(timeoutHandle);

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        const success = res.statusCode === 200 && responseTime < 1000;
        resolve({
          store: subdomain,
          statusCode: res.statusCode || 0,
          responseTime,
          success,
          error: !success ? `Status ${res.statusCode}, Time ${responseTime}ms` : undefined,
        });
      });
    });

    req.on('error', (err) => {
      const responseTime = Date.now() - startTime;
      clearTimeout(timeoutHandle);
      resolve({
        store: subdomain,
        statusCode: 0,
        responseTime,
        success: false,
        error: err.message,
      });
    });
  });
}

/**
 * Run concurrent stress test
 */
async function runStressTest(): Promise<void> {
  console.log(`\n🚀 H14 Stress Test Started`);
  console.log(`📊 Configuration:`);
  console.log(`   - Base URL: ${config.baseUrl}`);
  console.log(`   - Total Stores: ${config.storeDomains.length}`);
  console.log(`   - Concurrent: ${config.concurrentRequests}`);
  console.log(`   - Requests per Store: ${config.requestsPerStore}`);
  console.log(`   - Timeout: ${config.timeoutMs}ms`);
  console.log(`   - SLA Target: <1000ms per request\n`);

  const results: TestResult[] = [];
  const totalRequests = config.storeDomains.length * config.requestsPerStore;
  let completed = 0;

  // Create queue for concurrent requests
  let activeRequests = 0;
  const queue: (() => Promise<void>)[] = [];

  for (const domain of config.storeDomains) {
    for (let i = 0; i < config.requestsPerStore; i++) {
      queue.push(async () => {
        try {
          const result = await fetchStorefrontPage(domain, config.baseUrl, config.timeoutMs);
          results.push(result);
          completed++;
          process.stdout.write(`\r✓ ${completed}/${totalRequests} requests`);
        } catch (err) {
          completed++;
          process.stdout.write(`\r✓ ${completed}/${totalRequests} requests (error)`);
        }
      });
    }
  }

  // Process queue with concurrency limit
  const processQueue = async () => {
    while (queue.length > 0 && activeRequests < config.concurrentRequests) {
      activeRequests++;
      const task = queue.shift();
      if (task) {
        await task();
        activeRequests--;
      }
    }
  };

  // Run all tasks
  while (queue.length > 0) {
    await processQueue();
  }

  // Wait for remaining
  while (activeRequests > 0) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }

  console.log(`\n\n📈 Results:\n`);
  analyzeResults(results);
}

/**
 * Analyze dan display test results
 */
function analyzeResults(results: TestResult[]): void {
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);

  const responseTimes = successful.map((r) => r.responseTime);
  const avgTime = responseTimes.length > 0
    ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length
    : 0;
  const minTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0;
  const maxTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0;
  const p95Time = responseTimes.length > 0
    ? responseTimes.sort((a, b) => a - b)[Math.floor(responseTimes.length * 0.95)]
    : 0;

  const successRate = (successful.length / results.length * 100).toFixed(2);

  console.log(`✓ Successful: ${successful.length}/${results.length} (${successRate}%)`);
  console.log(`✗ Failed: ${failed.length}/${results.length}`);
  console.log(`\n⏱️  Response Times:`);
  console.log(`   - Min: ${minTime}ms`);
  console.log(`   - Avg: ${avgTime.toFixed(2)}ms`);
  console.log(`   - p95: ${p95Time}ms`);
  console.log(`   - Max: ${maxTime}ms`);

  const slaCompliant = successful.length >= results.length * 0.95 && p95Time < 1000;
  console.log(`\n🎯 SLA Compliance:`);
  console.log(`   ${slaCompliant ? '✓ PASS' : '✗ FAIL'} - p95 < 1000ms: ${p95Time < 1000}`);
  console.log(`   ${successful.length >= results.length * 0.95 ? '✓ PASS' : '✗ FAIL'} - Success Rate ≥ 95%`);

  if (failed.length > 0) {
    console.log(`\n❌ Failed Requests (first 10):`);
    failed.slice(0, 10).forEach((r) => {
      console.log(`   ${r.store}: ${r.statusCode || 'timeout'} - ${r.error}`);
    });
  }

  console.log(`\n${slaCompliant ? '✅ TEST PASSED' : '❌ TEST FAILED'}\n`);
  process.exit(slaCompliant ? 0 : 1);
}

// Run test
runStressTest().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
