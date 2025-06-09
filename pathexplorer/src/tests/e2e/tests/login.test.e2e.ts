import { waitForTimeout, waitForSelector } from '../utils/helpers';

jest.setTimeout(90000);

describe('Login Functionality', () => {
  test('should redirect to basic-info page after successful login', async () => {
    await page.goto('http://localhost:3000/auth/LogIn', {
      waitUntil: 'networkidle0',
      timeout: 30000,
    });

    await waitForTimeout(1000);

    const emailInput = await waitForSelector('input[type="email"]', { visible: true });
    await emailInput.click({ clickCount: 3 });
    await emailInput.type('alejandro96.mia@gmail.com', { delay: 10 });

    const passwordInput = await waitForSelector('input[type="password"]', { visible: true });
    await passwordInput.click({ clickCount: 3 });
    await passwordInput.type('$$0906alex$$', { delay: 10 });

    const loginButton = await waitForSelector('button[type="submit"]', { visible: true });

    await Promise.all([
      loginButton.click(),
      page.waitForNavigation({
        waitUntil: 'networkidle0',
        timeout: 30000,
      }),
    ]);

    const finalUrl = page.url();
    expect(finalUrl).toContain('/user/basic-info');

    const pageContent = await page.evaluate(() => document.body.textContent);
    expect(pageContent).toBeTruthy();
  }, 60000);
});
