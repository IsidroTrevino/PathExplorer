import { navigateToPage, waitForTimeout, waitForSelector } from '../utils/helpers';

describe('Basic Info Page', () => {
  beforeAll(async () => {
    await navigateToPage('/auth/LogIn');

    await waitForSelector('input[type="email"]');
    await page.waitForFunction(() => {
      return document.readyState === 'complete' && !document.querySelector('.loading-indicator');
    }, { timeout: 90000 });
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
    // More flexible spinner detection with timeout handling
    try {
      await page.waitForFunction(
        () => {
          const spinner = document.querySelector('.animate-spin');
          return !spinner;
        },
        { timeout: 30000 },
      );
    } catch (error) {
      console.log('Spinner timeout - continuing with test');
    }

    // Wait for form with fallback
    try {
      await waitForSelector('form', { timeout: 60000 });
    } catch (error) {
      console.log('Form not found, checking for content anyway');
    }

    // Allow some time for content to load regardless of spinner/form
    await waitForTimeout(5000);

    const nameInputExists = await page.evaluate(() => {
      const nameInput = document.querySelector('input[name="name"]');
      if (nameInput && (nameInput as HTMLInputElement).value.includes('Isidro')) {
        return true;
      }
      return document.body.textContent?.includes('Isidro') || false;
    });

    expect(nameInputExists).toBeTruthy();

    const personalInfoSectionExists = await page.evaluate(() => {
      const formText = document.querySelector('form')?.textContent;
      const bodyText = document.body.textContent;
      return Boolean(formText?.includes('Personal Information') ||
          bodyText?.includes('Personal Information'));
    });

    expect(personalInfoSectionExists).toBeTruthy();
  }, 120000);
});
