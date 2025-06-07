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
    const aiRecommendationsTab = await page.waitForSelector('button:has-text("AI Recommendations")', {
      timeout: 30000,
    }).catch(async () => {
      return await page.$('button[class*="flex-1"]:nth-of-type(2)');
    });

    if (!aiRecommendationsTab) {
      const allButtons = await page.evaluate(() =>
        Array.from(document.querySelectorAll('button')).map(b => b.textContent?.trim()),
      );
      throw new Error('AI Recommendations tab not found');
    }

    await aiRecommendationsTab.click();

    await waitForTimeout(5000);

    const hasLoadingSpinner = await page.evaluate(() =>
      Boolean(document.querySelector('.animate-spin')),
    );

    if (hasLoadingSpinner) {
      await page.waitForFunction(
        () => !document.querySelector('.animate-spin'),
        { timeout: 60000 },
      );
    }

    await waitForTimeout(5000);

    const hasRecommendations = await page.evaluate(() => {
      const hasTimelineContainer = document.querySelectorAll('.space-y-16').length > 0;
      const hasRecommendationText = document.body.textContent?.includes('Recommendation #');
      const hasRequiredSkillsText = document.body.textContent?.includes('Required Skills');

      return hasTimelineContainer || hasRecommendationText || hasRequiredSkillsText;
    });

    expect(hasRecommendations).toBeTruthy();

    const hasRoleInfo = await page.evaluate(() => {
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5');
      const listItems = document.querySelectorAll('li');

      return headings.length > 0 || listItems.length > 0;
    });

    expect(hasRoleInfo).toBeTruthy();
  }, 180000);
});
