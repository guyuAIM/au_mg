// Default package includes navigation. CLI mode overrides this setting per build.
export default {
  mode: 'navigation', // 'navigation' | 'content'
  navigation: {
    enabled: true,
    sourceUrl: 'https://mgmotor.com.au/about/faqs',
    timeoutMs: 4500,
    maxResponseBytes: 2000000,
    // These actions have no verified standalone public form page. Continue on
    // the official homepage, where MG owns the form and its privacy controls.
    actionUrl: 'https://mgmotor.com.au/'
  }
};
