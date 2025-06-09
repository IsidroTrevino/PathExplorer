jest.setTimeout(90000);

describe('Login Functionality', () => {
  test('should redirect to basic-info page after successful login', async () => {
    try {
      await page.goto('http://localhost:3000', {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      await page.evaluate(() => {
        try {
          localStorage.clear();
          sessionStorage.clear();
        } catch (e) {
        }
      });

      await page.goto('http://localhost:3000/auth/LogIn', {
        waitUntil: 'networkidle0',
        timeout: 30000,
      });

      const emailInput = await page.waitForSelector('input[type="email"]', { timeout: 30000 });
      await emailInput.type('alejandro96.mia@gmail.com');

      const passwordInput = await page.waitForSelector('input[type="password"]', { timeout: 15000 });
      await passwordInput.type('$$0906alex$$');

      const loginButton = await page.waitForSelector('button[type="submit"]', { timeout: 15000 });

      await Promise.all([
        page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 45000 }),
        loginButton.click(),
      ]);

      const currentUrl = page.url();
      const isLoggedIn = currentUrl.includes('/user/') || currentUrl.includes('/basic-info');
      expect(isLoggedIn).toBe(true);
    } catch (error) {
      throw error;
    }
  }, 80000);
});
