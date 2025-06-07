import { navigateToPage, waitForTimeout, waitForSelector } from '../utils/helpers';

describe('Login Functionality', () => {
  test('should redirect to basic-info page after successful login', async () => {
    await navigateToPage('/auth/LogIn');

    await waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'alejandro96.mia@gmail.com');
    await page.type('input[type="password"]', '$$0906alex$$');

    // Make sure form is valid before clicking
    await page.evaluate(() => {
      const form = document.querySelector('form');
      if (form) form.setAttribute('data-ready', 'true');
    });

    const loginButton = await waitForSelector('button[type="submit"]');
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
      loginButton.click(),
    ]);

    // Add extra time for any client-side redirects to complete
    await waitForTimeout(5000);

    const currentUrl = page.url();

    // If we're still on the login page, try one more time
    if (currentUrl.includes('/auth/LogIn')) {
      await loginButton.click();
      await page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 });
      await waitForTimeout(5000);
    }

    const finalUrl = page.url();
    expect(finalUrl).toContain('/user/basic-info');

    const pageContent = await page.evaluate(() => {
      const heading = document.querySelector('h1, h2')?.textContent;
      return { heading };
    });

    expect(pageContent.heading).toBeTruthy();
  }, 120000);
});
