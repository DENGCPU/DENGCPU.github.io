import { defineConfig } from 'astro/config';
import { remarkLooseAtxHeadings } from './src/plugins/remark-loose-atx-headings.mjs';

export default defineConfig({
  site: 'https://dengcpu.github.io',
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [remarkLooseAtxHeadings],
    shikiConfig: {
      themes: {
        light: 'rose-pine-dawn',
        dark: 'rose-pine-moon',
      },
    },
  },
});
