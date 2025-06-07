import { navigateToPage, waitForTimeout } from '../utils/helpers';

describe('Certifications Feature', () => {
  beforeAll(async () => {
    await navigateToPage('/auth/LogIn');

    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'alejandro96.mia@gmail.com');
    await page.type('input[type="password"]', '$$0906alex$$');

    const loginButton = await page.waitForSelector('button[type="submit"]');
    if (!loginButton) throw new Error('Login button not found');
    await loginButton.click();

    await page.waitForNavigation({ waitUntil: 'networkidle0' });
    await waitForTimeout(2000);
  });

  test('should navigate to certifications page and verify content loads', async () => {
    await navigateToPage('/user/certifications');

    await waitForTimeout(5000);

    const pageTitle = await page.evaluate(() => {
      const header = document.querySelector('h1');
      return header ? header.textContent : null;
    });

    expect(pageTitle).toContain('Certifications');

    const certificationsSection = await page.evaluate(() => {
      const section = document.querySelector('h2');
      return section ? section.textContent : null;
    });

    expect(certificationsSection).toContain('My Certifications');

    const hasCertificationsContent = await page.evaluate(() => {
      const cards = document.querySelectorAll('[class*="border-b border-gray-300"]').length > 0;
      const emptyState = document.body.textContent?.includes('No certifications found');
      return { cards, emptyState };
    });

    expect(hasCertificationsContent.cards || hasCertificationsContent.emptyState).toBeTruthy();

    const pageStructure = await page.evaluate(() => {
      return {
        hasHeader: Boolean(document.querySelector('h1')),
        hasCertificationsSection: Boolean(document.querySelector('h2')),
        hasContent: document.body.textContent?.length > 100,
      };
    });

    expect(pageStructure.hasHeader).toBeTruthy();
    expect(pageStructure.hasCertificationsSection).toBeTruthy();
    expect(pageStructure.hasContent).toBeTruthy();
  });
});
