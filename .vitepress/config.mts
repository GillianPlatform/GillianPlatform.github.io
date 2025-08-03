import { DefaultTheme, defineConfig } from 'vitepress'

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
      { text: 'Guide', link: '/intro' },
    ],

    sidebar: [
      {
        items: [
          { text: 'Introduction', link: '/intro' },
          { text: 'Installing for Development', link: '/dev-install' },
          { text: 'Developing Gillian', link: '/develop'},
          {
            text: 'Labs & Tutorials',
            link: '/labs/',
            collapsed: false,
            items: [
              { text: 'SSFT 2025', link: '/labs/ssft25/' }
            ]
          }
        ],
      },
      {
        text: 'Instantiations',
        link: '/instantiations/',
        collapsed: false,
        items: [
          { text: 'WISL', link: '/instantiations/wisl' },
          {
            text: 'Gillian-C',
            link: '/instantiations/c/',
            collapsed: true,
            items: [
              { text: 'Symbolic Testing', link: '/instantiations/c/symbolic-testing'},
              { text: 'PLDI\'20 Artifact Documentation', link: '/instantiations/c/pldi20-artifact' },
            ],
          },
          {
            text: 'Gillian-JS',
            link: '/instantiations/js/',
            collapsed: true,
            items: [
              { text: 'Symbolic Testing', link: '/instantiations/js/symbolic-testing' },
              {
                text: 'PLDI\'20 Artifact Documentation',
                link: '/instantiations/js/pldi20-artifact/',
                items: [
                  { text: 'JS-2-GIL and Test262', link: '/instantiations/js/pldi20-artifact/js2gil' },
                  { text: 'Symbolic Test Results', link: '/instantiations/js/pldi20-artifact/symbolic-test-results' },
                ],
              },
            ],
          },
          { text: 'Gillian-C2', link: '/instantiations/c2' },
          { text: 'Gillian-Rust', link: '/instantiations/rust' },
        ],
      },
      {
        items: [
          {
            text: 'Publications',
            link: '/publications/',
            collapsed: true,
            items: [
              { text: 'Gillian-Rust (2025)', link: '/publications/rust' },
              { text: 'Matching Plans (2024)', link: '/publications/mp' },
              { text: 'Compositional Symbolic Execution, Part I (2024)', link: '/publications/cse1' },
              { text: 'Symbolic Debugging with Gillian (2023)', link: '/publications/debugging' },
              { text: 'Gillian, Part II (2021)', link: '/publications/gillian2' },
              { text: 'Gillian, Part I (2020)', link: '/publications/gillian1' },
              { text: 'JaVerT 2.0 (2019)', link: '/publications/javert2' },
              { text: 'Cosette (2018)', link: '/publications/cosette' },
              { text: 'JaVerT (2018)', link: '/publications/javert' },
            ]
          },
          { text: 'Other Gillian-related Publications', link: '/other-publications' },
          { text: 'Copyright & License', link: '/license' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
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
