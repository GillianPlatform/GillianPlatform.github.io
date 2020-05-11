const remarkMath = require('remark-math');
const rehypeKatex = require('rehype-katex');

module.exports = {
  title: 'Gillian',
  tagline: 'A Multi-Language Platform for Compositional Symbolic Analysis',
  url: 'https://GillianPlatform.github.io',
  baseUrl: '/',
  favicon: 'img/favicon.ico',
  organizationName: 'GillianPlatform', // Usually your GitHub org/user name.
  projectName: 'GillianPlatform.github.io', // Usually your repo name.
  themeConfig: {
    prism: {
      theme: require('prism-react-renderer/themes/vsDark'),
    },
    navbar: {
      logo: {
        alt: 'Gillian logo, by Valentin Magnat',
        srcDark: 'img/logo_full_black.svg',
        src: 'img/logo_full_white.svg',
      },
      links: [
        { to: 'docs/start', label: 'Docs', position: 'left' },
        { to: 'docs/js/intro', label: 'Gillian-JS', position: 'left' },
        { to: 'docs/c/intro', label: 'Gillian-C', position: 'left' },
        { to: 'try', label: 'Try', position: 'right' },
        // {to: 'blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/GillianPlatform/Gillian',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Style Guide',
              to: 'docs/doc1',
            },
            {
              label: 'Second Doc',
              to: 'docs/doc2',
            },
          ],
        },
        {
          title: 'Resources',
          items: [
            {
              label: 'Tutorial',
              to: 'tutorial',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/GillianPlatform/Gillian',
            },
            {
              label: 'references',
              href: 'docs/js/references',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Gillian Team. Gillian and WISL logos by Valentin Magnat. Built with Docusaurus.`,
    },
  },
  scripts: ['/scripts/fetchCosette.js'],
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl:
            'https://github.com/GillianPlatform/GillianPlatform.github.io/edit/source/',
          remarkPlugins: [remarkMath],
          rehypePlugins: [rehypeKatex],
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
