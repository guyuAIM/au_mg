import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mgmotor.com.au',
  output: 'static',
  publicDir: './.generated/public',
  trailingSlash: 'never',
  build: {
    format: 'directory'
  },
  vite: {
    build: {
      cssMinify: false
    }
  }
});
