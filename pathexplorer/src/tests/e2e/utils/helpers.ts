export async function navigateToPage(path: string): Promise<void> {
  // Asumiendo que corre en localhost:3000
  await page.goto(`http://localhost:3000${path}`);
}

export async function waitForTimeout(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
