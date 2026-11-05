import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dengcpu.github.io',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
    },
  },
});
