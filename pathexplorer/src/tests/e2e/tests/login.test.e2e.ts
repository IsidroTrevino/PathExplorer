import { waitForSelector, waitForTimeout } from '../utils/helpers';

jest.setTimeout(120000);

describe('Login Functionality', () => {
  test('should redirect to basic-info page after successful login', async () => {
    await page.goto('http://localhost:3000', {
      waitUntil: 'networkidle0',
      timeout: 60000,
    });

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
      }
    });

    await page.goto('http://localhost:3000/auth/LogIn', {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

    await waitForTimeout(5000);

    await page.waitForFunction(() => document.readyState === 'complete', {
      timeout: 30000,
    });

    const emailInput = await page.waitForSelector('input[type="email"]', {
      visible: true,
      timeout: 45000,
    });
    await emailInput.type('alejandro96.mia@gmail.com', { delay: 100 });

    const passwordInput = await page.waitForSelector('input[type="password"]', {
      visible: true,
      timeout: 30000,
    });
    await passwordInput.type('$$0906alex$$', { delay: 100 });

    const loginButton = await page.waitForSelector('button[type="submit"]', {
      visible: true,
      timeout: 30000,
    });

    await Promise.all([
      page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: 60000,
      }),
      loginButton.click(),
    ]);

    const finalUrl = page.url();
    const isLoggedIn = finalUrl.includes('/user/') || finalUrl.includes('/basic-info');
    expect(isLoggedIn).toBe(true);
  }, 110000);
});
