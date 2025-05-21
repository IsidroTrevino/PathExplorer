import { navigateToPage, waitForTimeout } from '../utils/helpers';

describe('AI Recommendations Feature', () => {
  beforeAll(async () => {
    await navigateToPage('/auth/LogIn');

    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'alejandro96.mia@gmail.com');
    await page.type('input[type="password"]', '$$0906alex$$');

    const loginButton = await page.waitForSelector('button[type="submit"]');
    await loginButton.click();

    await page.waitForNavigation();

    await navigateToPage('/user/profesional-path');

    await waitForTimeout(1000);
  });

  test('should load and display certification recommendations when button is clicked', async () => {
    await page.waitForSelector('button');

    const button = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(button =>
        button.textContent?.includes('Generate Recommendations'),
      );
    });

    const buttonExists = await page.evaluate(btn => btn !== null && btn !== undefined, button);
    if (!buttonExists) {
      throw new Error('Generate Recommendations button not found');
    }

    await button.click();

    const loadingElement = await page.waitForSelector('.animate-spin');
    expect(loadingElement).toBeTruthy();

    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('.animate-spin');
        if (spinner) return false;
        return true;
      },
      { timeout: 60000 },
    );

    const contentExists = await page.evaluate(() => {
      const hasCards = document.querySelector('.grid-cols-1');
      const hasNoDataMessage = Array.from(document.querySelectorAll('p')).some(p =>
        p.textContent?.includes('No recommendation'),
      );
      return Boolean(hasCards || hasNoDataMessage);
    });

    expect(contentExists).toBeTruthy();
  });
});
