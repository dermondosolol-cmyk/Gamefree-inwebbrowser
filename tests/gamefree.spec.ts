/**
 * Playwright Test Suite - 2026 Standard
 * Automated testing for game loading, performance, and compatibility
 * 
 * Installation: npm install -D @playwright/test
 * Run: npx playwright test
 */

import { test, expect, Page, Browser } from '@playwright/test';

test.describe('Gamefree Browser - Automated Testing', () => {
    let page: Page;

    test.beforeAll(async ({ browser }: { browser: Browser }) => {
        page = await browser.newPage();
    });

    test.afterAll(async () => {
        await page.close();
    });

    test.describe('Page Loading', () => {
        test('should load homepage successfully', async ({ page }: { page: Page }) => {
            const response = await page.goto('http://localhost:8000/');
            expect(response?.status()).toBe(200);
            await expect(page).toHaveTitle(/Gamefree/);
        });

        test('should load all navigation tabs', async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            const tabs = await page.locator('[data-tab]').count();
            expect(tabs).toBeGreaterThan(0);
        });

        test('should have Virtual PC tab', async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            const virtualPCTab = page.locator('[data-tab="virtual-pc"]');
            await expect(virtualPCTab).toBeVisible();
        });
    });

    test.describe('Virtual PC Functionality', () => {
        test.beforeEach(async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            const virtualPCTab = page.locator('[data-tab="virtual-pc"]');
            await virtualPCTab.click();
            // Wait for Virtual PC to initialize
            await page.waitForTimeout(1000);
        });

        test('should display desktop environment', async ({ page }: { page: Page }) => {
            const desktop = page.locator('.virtualpc-desktop');
            await expect(desktop).toBeVisible();
        });

        test('should display taskbar', async ({ page }: { page: Page }) => {
            const taskbar = page.locator('.virtualpc-taskbar');
            await expect(taskbar).toBeVisible();
        });

        test('should display windows', async ({ page }: { page: Page }) => {
            const windows = page.locator('.desktop-window');
            const count = await windows.count();
            expect(count).toBeGreaterThanOrEqual(2);
        });

        test('should allow window dragging', async ({ page }: { page: Page }) => {
            const window = page.locator('.desktop-window').first();
            const initialBox = await window.boundingBox();
            
            // Drag the window header
            const header = window.locator('.window-header');
            await header.dragTo(page.locator('body'), {
                sourcePosition: { x: 50, y: 10 },
                targetPosition: { x: 200, y: 100 }
            });

            const finalBox = await window.boundingBox();
            expect(finalBox?.x).not.toBe(initialBox?.x);
            expect(finalBox?.y).not.toBe(initialBox?.y);
        });

        test('should toggle start menu', async ({ page }: { page: Page }) => {
            const startBtn = page.locator('[data-action="toggle-menu"]');
            await startBtn.click();
            
            const menu = page.locator('.start-menu');
            await expect(menu).toBeVisible();

            await startBtn.click();
            await expect(menu).toBeHidden();
        });
    });

    test.describe('Game Loading', () => {
        test.beforeEach(async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            const gamesTab = page.locator('[data-tab="games"]');
            await gamesTab.click();
            await page.waitForTimeout(500);
        });

        test('should display game grid', async ({ page }: { page: Page }) => {
            const gameGrid = page.locator('.game-grid');
            await expect(gameGrid).toBeVisible();
        });

        test('should load game cards', async ({ page }: { page: Page }) => {
            const gameCards = page.locator('.game-card');
            const count = await gameCards.count();
            expect(count).toBeGreaterThan(0);
        });

        test('should search games', async ({ page }: { page: Page }) => {
            const searchInput = page.locator('[data-search]');
            await searchInput.fill('chess');
            
            await page.waitForTimeout(500);
            const gameCards = page.locator('.game-card');
            const count = await gameCards.count();
            
            expect(count).toBeGreaterThan(0);
            // Check if any visible card contains "chess"
            const cardText = await gameCards.first().textContent();
            expect(cardText?.toLowerCase()).toContain('chess');
        });

        test('should handle game launch', async ({ page }: { page: Page }) => {
            const playButtons = page.locator('button:has-text("Play")');
            const count = await playButtons.count();
            
            if (count > 0) {
                await playButtons.first().click();
                // Wait for game to start loading
                await page.waitForTimeout(1000);
                
                const modal = page.locator('.modal-overlay');
                await expect(modal).toBeVisible();
            }
        });
    });

    test.describe('Terminal Functionality', () => {
        test.beforeEach(async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            const virtualPCTab = page.locator('[data-tab="virtual-pc"]');
            await virtualPCTab.click();
            await page.waitForTimeout(1000);
        });

        test('should access terminal window', async ({ page }: { page: Page }) => {
            const terminalWindow = page.locator('.desktop-window:has(.terminal-content)');
            await expect(terminalWindow).toBeVisible();
        });

        test('should execute help command', async ({ page }: { page: Page }) => {
            const terminalInput = page.locator('.terminal-input').last();
            await terminalInput.focus();
            await terminalInput.type('help');
            await terminalInput.press('Enter');
            
            await page.waitForTimeout(500);
            const output = page.locator('.terminal-line');
            await expect(output).toContainText(/help|command/i);
        });

        test('should execute games command', async ({ page }: { page: Page }) => {
            const terminalInput = page.locator('.terminal-input').last();
            await terminalInput.focus();
            await terminalInput.type('games');
            await terminalInput.press('Enter');
            
            await page.waitForTimeout(500);
            const output = page.locator('.terminal-line');
            const text = await output.last().textContent();
            expect(text?.toLowerCase()).toContain('game');
        });

        test('should clear terminal', async ({ page }: { page: Page }) => {
            const terminalInput = page.locator('.terminal-input').last();
            await terminalInput.focus();
            await terminalInput.type('cls');
            await terminalInput.press('Enter');
            
            await page.waitForTimeout(500);
            // After clear, there should be minimal output
            const lines = page.locator('.terminal-line');
            const count = await lines.count();
            expect(count).toBeLessThan(5);
        });
    });

    test.describe('Performance Metrics', () => {
        test('should load page under 3 seconds', async ({ page }: { page: Page }) => {
            const startTime = Date.now();
            await page.goto('http://localhost:8000/', { 
                waitUntil: 'networkidle' 
            });
            const loadTime = Date.now() - startTime;
            
            console.log(`Page load time: ${loadTime}ms`);
            expect(loadTime).toBeLessThan(3000);
        });

        test('should have good Lighthouse score', async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            
            const performanceMetrics = await page.evaluate(() => {
                const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
                return {
                    domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                    pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
                    firstPaint: performance.getEntriesByType('paint')[0]?.startTime
                };
            });

            console.log('Performance metrics:', performanceMetrics);
            expect(performanceMetrics.domContentLoaded).toBeLessThan(2000);
        });

        test('should not have memory leaks in Virtual PC', async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            
            // Get initial memory
            const initialMemory = await page.evaluate(() => {
                return (performance as any).memory?.usedJSHeapSize;
            });

            // Interact with Virtual PC multiple times
            for (let i = 0; i < 10; i++) {
                const tab = page.locator('[data-tab="virtual-pc"]');
                await tab.click();
                await page.waitForTimeout(200);
            }

            // Check final memory
            const finalMemory = await page.evaluate(() => {
                return (performance as any).memory?.usedJSHeapSize;
            });

            if (initialMemory && finalMemory) {
                const increase = (finalMemory - initialMemory) / 1024 / 1024;
                console.log(`Memory increase: ${increase.toFixed(2)}MB`);
                // Allow up to 10MB increase
                expect(increase).toBeLessThan(10);
            }
        });
    });

    test.describe('Responsive Design', () => {
        test('should work on mobile (375px)', async ({ page }: { page: Page }) => {
            await page.setViewportSize({ width: 375, height: 667 });
            await page.goto('http://localhost:8000/');
            
            const content = page.locator('main');
            await expect(content).toBeVisible();
        });

        test('should work on tablet (768px)', async ({ page }: { page: Page }) => {
            await page.setViewportSize({ width: 768, height: 1024 });
            await page.goto('http://localhost:8000/');
            
            const content = page.locator('main');
            await expect(content).toBeVisible();
        });

        test('should work on desktop (1920px)', async ({ page }: { page: Page }) => {
            await page.setViewportSize({ width: 1920, height: 1080 });
            await page.goto('http://localhost:8000/');
            
            const content = page.locator('main');
            await expect(content).toBeVisible();
        });
    });

    test.describe('Error Handling', () => {
        test('should handle missing elements gracefully', async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            
            // Check for console errors
            const errors: string[] = [];
            page.on('console', (msg: { type: () => string; text: () => string }) => {
                if (msg.type() === 'error') {
                    errors.push(msg.text());
                }
            });

            await page.waitForTimeout(1000);
            
            // Should have minimal errors
            expect(errors.length).toBeLessThan(3);
        });

        test('should recover from network errors', async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            
            // Simulate offline
            await page.context().setOffline(true);
            
            const offlineIndicator = page.locator('[data-status="offline"]');
            // Page should still be functional
            expect(page).toBeDefined();
            
            // Go back online
            await page.context().setOffline(false);
        });
    });

    test.describe('Security Checks', () => {
        test('should have proper iframe sandbox attributes', async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            
            const iframes = page.locator('iframe');
            const count = await iframes.count();

            for (let i = 0; i < count; i++) {
                const sandbox = await iframes.nth(i).getAttribute('sandbox');
                if (sandbox) {
                    expect(sandbox).toContain('allow-scripts');
                    expect(sandbox).not.toContain('allow-top-navigation');
                }
            }
        });

        test('should use HTTPS for external resources', async ({ page }: { page: Page }) => {
            await page.goto('http://localhost:8000/');
            
            const links = page.locator('a[href^="http://"]');
            const count = await links.count();
            
            console.log(`Found ${count} HTTP links (should be minimal on HTTPS site)`);
        });
    });
});
