import { $ } from 'zx';
import chalk from 'chalk';
import pkg from 'fs-extra';
const { fs } = pkg;
import path from 'path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import portfinder from 'portfinder';

// Configuration
const RUNS = 3;
const SERVER_START_DELAY = 5000; // Increased delay for server startup
const BASE_URL = '/'; // Default path to measure

// Results storage
const results = {};

async function startServer(framework) {
  try {
    const port = await portfinder.getPortPromise();
    const serverProcess = $`node frameworks/${framework}/server.js --port ${port}`;
    await sleep(SERVER_START_DELAY);
    return { serverProcess, port };
  } catch (error) {
    console.error(chalk.red(`Failed to start server for ${framework}:`), error);
    process.exit(1);
  }
}

async function runLighthouse(url, port) {
  const chrome = await launch({ 
    chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']
  });

  try {
    const options = {
      port: chrome.port,
      output: 'json',
      onlyCategories: ['performance']
    };

    const runnerResult = await lighthouse(url, options);
    return runnerResult.lhr;
  } finally {
    await chrome.kill();
  }
}

function extractMetrics(report) {
  return {
    performanceScore: report.categories.performance.score * 100,
    firstContentfulPaint: report.audits['first-contentful-paint'].numericValue,
    largestContentfulPaint: report.audits['largest-contentful-paint'].numericValue,
    interactive: report.audits.interactive.numericValue,
    totalBlockingTime: report.audits['total-blocking-time'].numericValue
  };
}

async function measureFramework(framework) {
  try {
    const { serverProcess, port } = await startServer(framework);
    const measureUrl = `http://localhost:${port}${BASE_URL}`;
    
    console.log(chalk.yellow(`Measuring ${framework} at ${measureUrl}`));
    
    const reports = [];
    for (let i = 0; i < RUNS; i++) {
      const report = await runLighthouse(measureUrl, port);
      reports.push(extractMetrics(report));
      await sleep(1000); // Cool-down between runs
    }

    // Save results
    const outputDir = path.join('apps/components/src/reports', framework);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    await fs.outputJson(
      path.join(outputDir, `${timestamp}.json`),
      { framework, runs: RUNS, results: reports },
      { spaces: 2 }
    );

    // Cleanup
    serverProcess.kill();
    return reports;

  } catch (error) {
    console.error(chalk.red(`Measurement failed for ${framework}:`), error);
    process.exit(1);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Main execution
export async function measureAll(frameworks) {
  const results = {};
  
  for (const framework of frameworks) {
    results[framework] = await measureFramework(framework);
    await sleep(3000); // Cool-down between frameworks
  }
  
  return results;
}