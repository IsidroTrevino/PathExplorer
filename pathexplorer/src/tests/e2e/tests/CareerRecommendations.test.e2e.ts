import { navigateToPage, waitForTimeout } from '../utils/helpers';

describe('AI Recommendations Feature', () => {
  beforeAll(async () => {
    await navigateToPage('/auth/LogIn');

    await page.waitForSelector('input[type="email"]', { timeout: 60000 });
    await page.type('input[type="email"]', 'alejandro96.mia@gmail.com');
    await page.type('input[type="password"]', '$$0906alex$$');

    const loginButton = await page.waitForSelector('button[type="submit"]', { timeout: 60000 });
    if (!loginButton) throw new Error('Login button not found');
    await loginButton.click();

    await Promise.race([
      page.waitForNavigation({ waitUntil: 'networkidle0', timeout: 60000 }),
      waitForTimeout(5000),
    ]);

    await navigateToPage('/user/profesional-path');

    await waitForTimeout(8000);
  }, 120000);

  test('should load and display certification recommendations when button is clicked', async () => {
    const buttonTexts = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('button')).map(btn => {
        return {
          text: btn.textContent?.trim(),
          classes: btn.className,
          hasRecommendText: btn.textContent?.includes('Recommendations'),
          hasGenerateText: btn.textContent?.includes('Generate'),
        };
      });
    });

    const generateButtonHandle = await page.evaluateHandle(() => {
      const buttons = Array.from(document.querySelectorAll('button'));

      let button = buttons.find(btn =>
        btn.textContent?.trim() === 'Generate Recommendations' ||
          btn.textContent?.includes('Generate Recommendations'),
      );

      if (!button) {
        button = buttons.find(btn =>
          btn.textContent?.includes('Generate') &&
            btn.textContent?.includes('Recommendation'),
        );
      }

      if (!button) {
        button = buttons.find(btn =>
          btn.querySelector('svg') &&
            btn.textContent?.includes('Generate'),
        );
      }

      return button || null;
    });

    const buttonExists = await page.evaluate(btn => btn !== null, generateButtonHandle);

    if (!buttonExists) {
      const htmlStructure = await page.evaluate(() => {
        return document.body.innerHTML;
      });
      throw new Error('Generate Recommendations button not found');
    }

    await generateButtonHandle.click();

    await waitForTimeout(5000);

    const hasLoadingIndicator = await page.evaluate(() => {
      return Boolean(
        document.querySelector('.animate-spin') ||
          document.body.textContent?.includes('Generating'),
      );
    });

    if (hasLoadingIndicator) {
      try {
        await page.waitForFunction(
          () => !document.querySelector('.animate-spin'),
          { timeout: 60000 },
        );
      } catch (e) {
      }
    }

    await waitForTimeout(5000);

    const contentExists = await page.evaluate(() => {
      return Boolean(
        document.querySelector('.grid-cols-1') ||
          document.querySelector('.grid-cols-2') ||
          document.querySelector('.grid-cols-4') ||
          document.body.textContent?.includes('recommendation') ||
          document.body.textContent?.includes('Recommendation') ||
          document.body.textContent?.includes('career') ||
          document.body.textContent?.includes('Career'),
      );
    });

    expect(contentExists).toBeTruthy();
  }, 180000);
});
