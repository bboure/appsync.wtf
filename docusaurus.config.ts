import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'AppSync WTF',
  tagline: 'A collection of resources to learn and build with AWS AppSync',
  favicon: 'img/favicon.ico',

  // Set the production url of your site here
  url: 'https://appsync.wtf',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'bboure', // Usually your GitHub org/user name.
  projectName: 'appsync.wtf', // Usually your repo name.

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          path: './resources',
          routeBasePath: '/resources',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: false,
        // blog: {
        //   showReadingTime: true,
        //   // Please change this to your repo.
        //   // Remove this to remove the "edit this page" links.
        //   editUrl:
        //     'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        // },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],
  scripts: [
    {
      src: 'https://plausible.io/js/script.js',
      'data-domain': 'appsync.wtf',
      defer: true,
    },
  ],
  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'typescript-workshop',
        path: 'workshops/typescript-workshop',
        routeBasePath: 'workshops/typescript-workshop',
        sidebarPath: './sidebars/workshops/typescript-workshop.ts',
      },
    ],
  ],
  themeConfig: {
    // Replace with your project's social card
    image: 'img/card.png',
    docs: {
      sidebar: {
        hideable: true,
      },
    },
    navbar: {
      title: 'AppSync WTF',
      logo: {
        alt: 'AppSync WTF',
        src: 'img/logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'resources',
          position: 'left',
          label: 'Resources',
        },
        {
          label: 'Developer Guide',
          href: 'https://docs.aws.amazon.com/appsync/latest/devguide/what-is-appsync.html',
        },
        {
          label: 'API',
          href: 'https://docs.aws.amazon.com/appsync/latest/APIReference/Welcome.html',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/bboure/appsync.wtf',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          items: [
            {
              label: 'FAQ',
              to: 'faq',
            },
          ],
        },
      ],
      copyright: `Built by <a href="https://twitter.com/Benoit_Boure">Benoît Bouré</a> &#x2764;`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
