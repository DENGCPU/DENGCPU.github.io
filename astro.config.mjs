import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://dengcpu.github.io',
  trailingSlash: 'always',
  markdown: {
    shikiConfig: {
      themes: {
        light: 'rose-pine-dawn',
        dark: 'rose-pine-moon',
      },
    },
  },
});
