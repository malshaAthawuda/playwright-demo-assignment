import { Reporter, FullConfig, Suite, TestCase, TestResult, FullResult } from '@playwright/test/reporter';
import { chromium } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

class ImageReporter implements Reporter {
    private testResults = new Map<string, TestCase>();
    private totalDuration = 0;

    onTestEnd(test: TestCase, result: TestResult) {
        this.testResults.set(test.id, test);
        this.totalDuration += result.duration;
    }

    async onEnd(result: FullResult) {
        let passed = 0;
        let failed = 0;
        let skipped = 0;

        for (const test of this.testResults.values()) {
            const outcome = test.outcome();
            if (outcome === 'expected' || outcome === 'flaky') {
                passed++;
            } else if (outcome === 'unexpected') {
                failed++;
            } else if (outcome === 'skipped') {
                skipped++;
            }
        }

        const total = passed + failed + skipped;
        const passPercentage = total === 0 ? 0 : Math.round((passed / total) * 100);
        const durationSec = (this.totalDuration / 1000).toFixed(2);
        const outcomeStatus = failed === 0 ? 'SUCCESS' : 'FAILURE';
        const statusColor = failed === 0 ? '#10b981' : '#ef4444';

        // Generate emoji strings
        // Cap the number of emojis to prevent layout breakage if there are many tests
        const maxEmojis = 50;
        const renderEmojis = (count: number, emoji: string) => {
            const displayCount = Math.min(count, maxEmojis);
            let str = emoji.repeat(displayCount);
            if (count > maxEmojis) str += '+';
            return str;
        };

        const happyFaces = renderEmojis(passed, '😄');
        const sadFaces = renderEmojis(failed, '😢');
        const neutralFaces = renderEmojis(skipped, '😐');

        console.log(`\nGenerating Image Report...`);

        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Test Results</title>
          <style>
              @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');
              
              body {
                  margin: 0;
                  padding: 0;
                  font-family: 'Inter', sans-serif;
                  background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
                  color: #f8fafc;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  width: 800px;
                  height: 500px;
              }
              .card {
                  background: rgba(255, 255, 255, 0.05);
                  backdrop-filter: blur(10px);
                  border: 1px solid rgba(255, 255, 255, 0.1);
                  border-radius: 24px;
                  padding: 40px;
                  width: 90%;
                  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
                  position: relative;
                  overflow: hidden;
              }
              .card::before {
                  content: '';
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 100%;
                  height: 6px;
                  background: ${statusColor};
              }
              .header {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 25px;
              }
              .title {
                  font-size: 28px;
                  font-weight: 800;
                  margin: 0;
                  letter-spacing: -0.5px;
              }
              .status-badge {
                  background: ${statusColor}22;
                  color: ${statusColor};
                  padding: 8px 16px;
                  border-radius: 999px;
                  font-weight: 600;
                  font-size: 14px;
                  letter-spacing: 1px;
                  border: 1px solid ${statusColor}44;
              }
              .stats-grid {
                  display: grid;
                  grid-template-columns: repeat(4, 1fr);
                  gap: 20px;
                  margin-bottom: 25px;
              }
              .stat-box {
                  background: rgba(0, 0, 0, 0.2);
                  border-radius: 16px;
                  padding: 20px;
                  text-align: center;
              }
              .stat-value {
                  font-size: 36px;
                  font-weight: 800;
                  margin-bottom: 4px;
              }
              .stat-label {
                  font-size: 12px;
                  color: #94a3b8;
                  text-transform: uppercase;
                  letter-spacing: 1px;
                  font-weight: 600;
              }
              .pass-val { color: #10b981; }
              .fail-val { color: #ef4444; }
              .skip-val { color: #eab308; }
              
              .emojis-container {
                  background: rgba(0, 0, 0, 0.15);
                  border-radius: 12px;
                  padding: 15px;
                  margin-bottom: 25px;
                  font-size: clamp(14px, calc(100vw / ${Math.max(30, total)}), 32px);
                  line-height: 1.2;
                  display: flex;
                  justify-content: center;
                  gap: 2px;
                  flex-wrap: nowrap;
                  overflow: hidden;
              }
              
              .progress-bg {
                  width: 100%;
                  height: 12px;
                  background: rgba(255, 255, 255, 0.1);
                  border-radius: 999px;
                  overflow: hidden;
                  display: flex;
              }
              .progress-bar {
                  height: 100%;
                  transition: width 1s ease-in-out;
              }
              .progress-pass { background: #10b981; width: ${total === 0 ? 0 : (passed / total) * 100}%; }
              .progress-fail { background: #ef4444; width: ${total === 0 ? 0 : (failed / total) * 100}%; }
              .progress-skip { background: #eab308; width: ${total === 0 ? 0 : (skipped / total) * 100}%; }
              
              .footer {
                  margin-top: 20px;
                  display: flex;
                  justify-content: space-between;
                  font-size: 13px;
                  color: #64748b;
              }
          </style>
      </head>
      <body>
          <div class="card">
              <div class="header">
                  <h1 class="title">Automated Test Execution</h1>
                  <div class="status-badge">${outcomeStatus}</div>
              </div>
              
              <div class="stats-grid">
                  <div class="stat-box">
                      <div class="stat-value pass-val">${passed}</div>
                      <div class="stat-label">Passed</div>
                  </div>
                  <div class="stat-box">
                      <div class="stat-value fail-val">${failed}</div>
                      <div class="stat-label">Failed</div>
                  </div>
                  <div class="stat-box">
                      <div class="stat-value skip-val">${skipped}</div>
                      <div class="stat-label">Skipped</div>
                  </div>
                  <div class="stat-box">
                      <div class="stat-value" style="color: #60a5fa">${passPercentage}%</div>
                      <div class="stat-label">Success Rate</div>
                  </div>
              </div>

              <div class="emojis-container">
                  ${total === 0 ? '<span style="color: #94a3b8; font-size: 14px;">No tests executed</span>' : `${happyFaces}${sadFaces}${neutralFaces}`}
              </div>

              <div class="progress-bg">
                  <div class="progress-bar progress-pass"></div>
                  <div class="progress-bar progress-fail"></div>
                  <div class="progress-bar progress-skip"></div>
              </div>

              <div class="footer">
                  <div>Total Tests: ${total}</div>
                  <div>Execution Time: ${durationSec}s</div>
              </div>
          </div>
      </body>
      </html>
    `;

        try {
            const browser = await chromium.launch();
            const page = await browser.newPage({
                viewport: { width: 800, height: 450 },
                deviceScaleFactor: 2, // High resolution
            });
            await page.setContent(htmlContent, { waitUntil: 'networkidle' });

            const outputPath = path.join(process.cwd(), 'playwright-report', 'test-results.png');

            // Ensure directory exists
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });

            await page.screenshot({ path: outputPath });
            await browser.close();

            console.log(`Image report generated successfully: ${outputPath}`);
        } catch (e) {
            console.error('Failed to generate image report:', e);
        }
    }
}

export default ImageReporter;
