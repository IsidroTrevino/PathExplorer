import { waitForSelector, waitForTimeout } from '../utils/helpers';

jest.setTimeout(120000);

describe('Certifications Page', () => {
  test('should load and display certifications page with content', async () => {
    try {

      await page.goto('http://localhost:3000/auth/LogIn', { waitUntil: 'networkidle0' });

      const emailInput = await waitForSelector('input[type="email"]');
      await emailInput.type('alejandro96.mia@gmail.com', { delay: 50 });

      const passwordInput = await waitForSelector('input[type="password"]');
      await passwordInput.type('$$0906alex$$', { delay: 50 });

      const loginButton = await waitForSelector('button[type="submit"]');
      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0' }),
        loginButton.click(),
      ]);

      await page.evaluate(() => {
        if (!localStorage.getItem('userAuth')) {
          // No action needed - just checking
        }
      });

      await page.goto('http://localhost:3000/user/certifications', {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      const pageTitle = await waitForSelector('h2.text-lg.font-semibold');
      const titleText = await page.evaluate(el => el.textContent, pageTitle);
      expect(titleText).toBe('My Certifications');

      const hasSkeletons = await page.evaluate(() =>
        document.querySelectorAll('.skeleton').length > 0,
      );

      if (hasSkeletons) {
        await page.waitForFunction(
          () => document.querySelectorAll('.skeleton').length === 0,
          { timeout: 30000 },
        );
      }

      await waitForTimeout(3000);

      const contentState = await page.evaluate(() => {
        const cards = document.querySelectorAll('div.p-5.border-b.border-gray-300');
        const emptyState = document.querySelector('.p-6.text-center.text-gray-500');
        const emptyStateText = emptyState ? emptyState.textContent || '' : '';

        return {
          hasCards: cards.length > 0,
          hasEmptyState: emptyStateText.includes('No certifications found'),
        };
      });

      expect(contentState.hasCards || contentState.hasEmptyState).toBe(true);
    } catch (error) {
      throw error;
    }
  }, 90000);
});
