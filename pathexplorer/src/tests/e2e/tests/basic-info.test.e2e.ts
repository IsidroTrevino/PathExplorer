import { waitForSelector, waitForTimeout, navigateToPage } from '../utils/helpers';

jest.setTimeout(90000);

describe('Basic Info Page E2E Test', () => {
  test('should load basic info page with correct user information', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
      }
    });

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

    const pageHeader = await waitForSelector('h1');
    const headerText = await page.evaluate(el => el.textContent, pageHeader);
    expect(headerText).toBe('Personal Information');

    const hasLoader = await page.evaluate(() =>
      document.querySelector('.animate-spin') !== null,
    );

    if (hasLoader) {
      await page.waitForFunction(
        () => document.querySelector('.animate-spin') === null,
        { timeout: 30000 },
      );
    }

    await waitForTimeout(2000);

    const sectionHeaders = await page.$$eval('.text-xl.font-medium.text-\\[\\#7500C0\\]',
      headers => headers.map(h => h.textContent?.trim()),
    );

    expect(sectionHeaders).toContain('Personal Information');
    expect(sectionHeaders).toContain('Location Information');
    expect(sectionHeaders).toContain('Professional Information');

    const firstNameInput = await waitForSelector('input[placeholder="First name"]');
    const firstNameValue = await page.evaluate(el => el.value, firstNameInput);
    expect(firstNameValue).toBe('Isidro');

    const formFieldsLoaded = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="text"]');
      let hasPopulatedFields = false;

      for (const input of inputs) {
        if ((input as HTMLInputElement).value.trim() !== '') {
          hasPopulatedFields = true;
          break;
        }
      }

      return hasPopulatedFields;
    });

    expect(formFieldsLoaded).toBe(true);
  });
});
