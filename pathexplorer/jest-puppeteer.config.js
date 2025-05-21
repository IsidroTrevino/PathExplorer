module.exports = {
  launch: {
    headless: process.env.HEADLESS !== 'false',
    defaultViewport: { width: 1280, height: 720 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    slowMo: 0,
  },
  browserContext: 'default',
  exitOnPageError: false
};
