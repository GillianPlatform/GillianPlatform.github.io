import { DefaultTheme, defineConfig } from 'vitepress';
import sidebar from './sidebar.mts';

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'The Gillian Project',
  description: 'Documentation for the Gillian verification platform',
  srcDir: './src',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    logo: {
      dark: '/logo_dark.svg',
      light: '/logo_light.svg',
      alt: 'Gillian',
    },
    siteTitle: false,

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Intro', link: '/intro' },
    ],

    sidebar,

    socialLinks: [
      { icon: 'github', link: 'https://github.com/GillianPlatform/Gillian' }
    ],

    search: {
      provider: 'local',
    },

    footer: {
      copyright: 'Copyright © 2020-present The Gillian Team at Imperial College London',
    }
  },
  markdown: {
    math: true,
  },
});
