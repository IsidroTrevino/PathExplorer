import { navigateToPage, waitForTimeout } from '../utils/helpers';

describe('Basic Info Page', () => {
  beforeAll(async () => {
    await navigateToPage('/auth/LogIn');

    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'alejandro96.mia@gmail.com');
    await page.type('input[type="password"]', '$$0906alex$$');

    const loginButton = await page.waitForSelector('button[type="submit"]');
    await loginButton.click();

    await page.waitForNavigation();

    await navigateToPage('/user/basic-info');

    await waitForTimeout(1000);
  });

  test('should display employee information with name Isidro', async () => {
    await page.waitForFunction(
      () => {
        const spinner = document.querySelector('.animate-spin');
        return !spinner;
      },
      { timeout: 10000 },
    );

    await page.waitForSelector('form');

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
  });
});
