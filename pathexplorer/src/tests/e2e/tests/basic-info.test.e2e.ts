import { navigateToPage, waitForTimeout } from '../utils/helpers';

describe('Basic Info Page', () => {
  beforeAll(async () => {
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

    await navigateToPage('/user/basic-info');

    await waitForTimeout(3000);
  }, 120000);

  test('should display employee information with name Isidro', async () => {
    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('.animate-spin');
        return !spinner;
      },
      { timeout: 30000 },
    );

    await page.waitForSelector('form', { timeout: 60000 });

    const nameInputExists = await page.evaluate(() => {
      const nameInput = document.querySelector('input[name="name"]');
      if (nameInput && (nameInput as HTMLInputElement).value.includes('Isidro')) {
        return true;
      }

      return document.body.textContent?.includes('Isidro') || false;
    });

    expect(nameInputExists).toBeTruthy();

    const personalInfoSectionExists = await page.evaluate(() => {
      return Boolean(document.querySelector('form')?.textContent?.includes('Personal Information'));
    });

    expect(personalInfoSectionExists).toBeTruthy();
  }, 120000);
});
