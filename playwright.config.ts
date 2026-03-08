import { defineConfig } from '@playwright/test';
import dotenv from 'dotenv';

// Read from default ".env" file.
dotenv.config();

export default defineConfig({
  testDir: './tests',
  timeout: 60 * 1000,
  workers: 4,
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report' }],
    ['./excel-reporter.ts']
  ],
  use: {
    headless: true || !!process.env.CI,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
});