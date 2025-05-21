import { navigateToPage, waitForTimeout } from '../utils/helpers';

describe('Login Functionality', () => {
  test('should redirect to basic-info page after successful login', async () => {
    await navigateToPage('/auth/LogIn');

    await page.waitForSelector('input[type="email"]');

    await page.type('input[type="email"]', 'alejandro96.mia@gmail.com');
    await page.type('input[type="password"]', '$$0906alex$$');

    const loginButton = await page.waitForSelector('button[type="submit"]');
    await loginButton.click();

    await page.waitForNavigation();

    const currentUrl = page.url();

    await waitForTimeout(1000);

    expect(currentUrl).toContain('/user/basic-info');

    const pageContent = await page.evaluate(() => {
      const heading = document.querySelector('h1, h2')?.textContent;
      return { heading };
    });

    expect(pageContent.heading).toBeTruthy();
  }, 30000);
});
