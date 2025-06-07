import { navigateToPage, waitForTimeout } from '../utils/helpers';

describe('Login Functionality', () => {
  test('should redirect to basic-info page after successful login', async () => {
    await navigateToPage('/auth/LogIn');

    await page.waitForSelector('input[type="email"]', { timeout: 60000 });

    await page.type('input[type="email"]', 'alejandro96.mia@gmail.com');
    await page.type('input[type="password"]', '$$0906alex$$');

    const loginButton = await page.waitForSelector('button[type="submit"]', { timeout: 60000 });
    await loginButton.click();

    await Promise.race([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
      waitForTimeout(5000),
    ]);

    const currentUrl = page.url();

    await waitForTimeout(2000);

    expect(currentUrl).toContain('/user/basic-info');

    const pageContent = await page.evaluate(() => {
      const heading = document.querySelector('h1, h2')?.textContent;
      return { heading };
    });

    expect(pageContent.heading).toBeTruthy();
  }, 120000);
});
