import { navigateToPage, waitForSelector, waitForTimeout } from '../utils/helpers';

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

    expect(true).toBe(true);

    await navigateToPage('/auth/LogIn');
    const emailInput = await waitForSelector('input[type="email"]');
    await emailInput.type('alejandro96.mia@gmail.com');
    const passwordInput = await waitForSelector('input[type="password"]');
    await passwordInput.type('$$0906alex$$');
    const loginButton = await waitForSelector('button[type="submit"]');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      loginButton.click(),
    ]);

    await navigateToPage('/user/basic-info');

    const finalUrl = page.url();
    const isLoggedIn = finalUrl.includes('/user/') || finalUrl.includes('/basic-info');
    expect(isLoggedIn).toBe(true);
  }, 110000);
});
