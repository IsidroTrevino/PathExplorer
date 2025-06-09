import { waitForSelector, waitForTimeout } from '../utils/helpers';

jest.setTimeout(90000);

describe('Curriculum Page E2E Test', () => {
  test('should load curriculum page with all sections', async () => {
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });

    await page.evaluate(() => {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (e) {
      }
    });

    await page.goto('http://localhost:3000/auth/LogIn', { waitUntil: 'networkidle0' });
    const emailInput = await waitForSelector('input[type="email"]');
    await emailInput.type('alejandro96.mia@gmail.com');
    const passwordInput = await waitForSelector('input[type="password"]');
    await passwordInput.type('$$0906alex$$');
    const loginButton = await waitForSelector('button[type="submit"]');

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle0' }),
      loginButton.click(),
    ]);

    await page.goto('http://localhost:3000/user/curriculum', { waitUntil: 'networkidle0' });

    const pageHeader = await waitForSelector('h1');
    const headerText = await page.evaluate(el => el.textContent, pageHeader);
    expect(headerText).toBe('Curriculum');

    const hasSkeletons = await page.evaluate(() =>
      document.querySelectorAll('.animate-pulse').length > 0,
    );

    if (hasSkeletons) {
      await page.waitForFunction(
        () => document.querySelectorAll('.animate-pulse').length === 0,
        { timeout: 30000 },
      );
    }

    await waitForTimeout(2000);

    const sectionHeaders = await page.$$eval('h2.text-xl.font-semibold',
      headers => headers.map(h => h.textContent?.trim()),
    );

    expect(sectionHeaders).toContain('Technical skills');
    expect(sectionHeaders).toContain('Soft skills');
    expect(sectionHeaders).toContain('Goals');

    const cvSectionExists = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('h2'))
        .some(el => el.textContent?.includes('Curriculum'));
    });
    expect(cvSectionExists).toBe(true);

    const contentLoaded = await page.evaluate(() => {
      const hasSkillCards = document.querySelectorAll('.rounded-lg.border.bg-white').length > 0;

      const hasEmptyStates = document.querySelectorAll('[class*="EmptyView"]').length > 0;

      const hasCvUpload = document.querySelector('[class*="border-dashed"]') !== null;

      return hasSkillCards || hasEmptyStates || hasCvUpload;
    });

    expect(contentLoaded).toBe(true);
  });
});
