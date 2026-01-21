/// <reference types="node" />
import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright Configuration - 2026 Standard
 * Runs comprehensive tests across browsers and devices
 * 
 * Docs: https://playwright.dev/docs/test-configuration
 */

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: [
        ['html'],
        ['json', { outputFile: 'test-results/results.json' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['list']
    ],
    use: {
        baseURL: 'http://localhost:8000',
        trace: 'on-first-retry',
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },

    projects: [
        // Desktop browsers
        {
            name: 'chromium',
            use: { 
                ...devices['Desktop Chrome']
            },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },

        // Mobile devices
        {
            name: 'Mobile Chrome',
            use: { ...devices['Pixel 5'] },
        },
        {
            name: 'Mobile Safari',
            use: { ...devices['iPhone 12'] },
        },
        {
            name: 'iPad',
            use: { ...devices['iPad Pro'] },
        },

        // Edge browser
        {
            name: 'Microsoft Edge',
            use: { 
                ...devices['Desktop Edge']
            },
        },
    ],

    webServer: {
        command: 'npm run serve',
        url: 'http://localhost:8000',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },

    timeout: 30000,
    globalTimeout: 600000,
});
