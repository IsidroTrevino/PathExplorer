export const navigateToPage = async (path: string) => {
  await page.goto(`http://localhost:3000${path}`, {
    waitUntil: 'networkidle0',
    timeout: 90000,
  });
  // Give extra time for React to hydrate and render
  await waitForTimeout(2000);
};

export const waitForSelector = async (selector: string, options = {}) => {
  const defaultOptions = { timeout: 90000 };
  const mergedOptions = { ...defaultOptions, ...options };

  try {
    return await page.waitForSelector(selector, mergedOptions);
  } catch (error) {
    throw new Error(`Failed to find selector: ${selector}`);
  }
};

export async function waitForTimeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
