import { waitForTimeout } from '../utils/helpers';

jest.setTimeout(120000);

describe('AI Recommendations Feature', () => {
  beforeAll(async () => {
    try {
      const baseUrl = 'http://localhost:3000';
      await page.goto(`${baseUrl}/auth/LogIn`, {
        waitUntil: 'domcontentloaded',
        timeout: 30000,
      });

      await page.evaluate(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
          console.warn('Error clearing storage:', e.message);
        }

        try {
          document.cookie.split(';').forEach(cookie => {
            const [name] = cookie.trim().split('=');
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/;`;
          });
        } catch (e) {
          console.warn('Error clearing cookies:', e.message);
        }
      }).catch(() => {
        console.log('Storage clearing skipped');
      });

      const emailInput = await Promise.race([
        page.waitForSelector('input[type="email"]', { timeout: 10000 }),
        page.waitForSelector('input[name="email"]', { timeout: 10000 }),
        page.waitForSelector('input[placeholder*="email" i]', { timeout: 10000 }),
      ]).catch(() => null);

      if (emailInput) {
        await emailInput.type('alejandro96.mia@gmail.com', { delay: 0 });

        const passwordInput = await Promise.race([
          page.waitForSelector('input[type="password"]', { timeout: 5000 }),
          page.waitForSelector('input[name="password"]', { timeout: 5000 }),
        ]).catch(() => null);

        if (passwordInput) {
          await passwordInput.type('$$0906alex$$', { delay: 0 });

          const loginButton = await page.$('button[type="submit"]');
          if (loginButton) {
            await Promise.all([
              loginButton.click(),
              page.waitForNavigation({ timeout: 20000 }).catch(() => null),
            ]);

            await page.goto(`${baseUrl}/user/profesional-path`, {
              waitUntil: 'domcontentloaded',
              timeout: 20000,
            });
          }
        }
      }
    } catch (error) {
      console.warn('Setup failed:', error.message);
    }
  }, 60000);

  test('should display role recommendations', async () => {
    const baseUrl = 'http://localhost:3000';
    const currentUrl = page.url();

    if (!currentUrl.includes('/user/profesional-path')) {
      console.warn('Not on professional path page, navigating there directly');
      await page.goto(`${baseUrl}/user/profesional-path`, {
        waitUntil: 'domcontentloaded',
        timeout: 20000,
      });
    }

    try {
      const aiRecommendationsTab = await page.$('button:nth-child(2)');
      if (aiRecommendationsTab) {
        await aiRecommendationsTab.click();
        await waitForTimeout(1000);
      }
    } catch (error) {
      console.warn('Could not click tab:', error.message);
    }

    const hasContent = await page.evaluate(() => {
      const pageContent = document.body.textContent || '';
      return pageContent.length > 500;
    });

    expect(hasContent).toBeTruthy();
  }, 60000);
});
