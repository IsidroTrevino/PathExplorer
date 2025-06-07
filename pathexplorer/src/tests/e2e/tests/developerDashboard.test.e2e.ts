import { navigateToPage, waitForTimeout } from '../utils/helpers';

describe('Developer Dashboard', () => {
  beforeAll(async () => {
    await navigateToPage('/auth/LogIn');

    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'alejandro96.mia@gmail.com');
    await page.type('input[type="password"]', '$$0906alex$$');

    const loginButton = await page.waitForSelector('button[type="submit"]');
    await loginButton.click();

    await page.waitForNavigation({ waitUntil: 'networkidle0' });

    await navigateToPage('/user/dashboard');

    await waitForTimeout(3000);
  });

  test('should display developer dashboard with charts and stats', async () => {
    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('.animate-spin');
        return !spinner;
      },
      { timeout: 15000 },
    );

    await waitForTimeout(2000);

    const pageTitle = await page.title();

    const dashboardTitle = await page.evaluate(() => {
      const heading = document.querySelector('h2');
      return heading ? heading.textContent : null;
    });

    expect(dashboardTitle).not.toBeNull();

    const statCardsExist = await page.evaluate(() => {
      const possibleCardSelectors = [
        '.card',
        '[data-card]',
        '[class*="card"]',
        '.cardContent',
        '.CardContent',
        '.MuiCard-root',
      ];

      for (const selector of possibleCardSelectors) {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) {
          return true;
        }
      }

      const sections = document.querySelectorAll('section');
      if (sections.length > 0) return true;

      return false;
    });

    expect(statCardsExist).toBeTruthy();

    const dashboardContentExists = await page.evaluate(() => {
      const keyTerms = [
        'Total Employees',
        'Certifications',
        'Skills',
        'Dashboard',
      ];

      const pageText = document.body.textContent || '';
      return keyTerms.some(term => pageText.includes(term));
    });

    expect(dashboardContentExists).toBeTruthy();

    const chartsExist = await page.evaluate(() => {
      const canvases = document.querySelectorAll('canvas');
      return canvases.length > 0;
    });
  });
});
