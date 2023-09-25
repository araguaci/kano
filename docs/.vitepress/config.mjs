import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  base: '/kano/',
  title: 'Kano',
  description: 'A powerful real-time Geovisualizer',
  ignoreDeadLinks: true,
  head: [
    ['link', { href: 'https://cdnjs.cloudflare.com/ajax/libs/line-awesome/1.3.0/line-awesome/css/line-awesome.min.css', rel: 'stylesheet' }],
    ['link', { rel: 'icon', href: `https://s3.eu-central-1.amazonaws.com/kalisioscope/kano/kano-icon-64x64.png` }]
  ],
  themeConfig: {
    logo: 'https://s3.eu-central-1.amazonaws.com/kalisioscope/kano/kano-icon-256x256.png',
    jwt: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJkZXYua2FsaXNpby54eXoiLCJpc3MiOiJrYWxpc2lvIn0.CGvJwPPkuiFvNzo3zUBb-_vwD0CKbUfm7w7TkCY-Ts4',
    socialLinks: [{ icon: 'github', link: 'https://github.com/kalisio/kano' }],
    nav: [
      { text: 'About', link: '/about/introduction' },
      { text: 'Guides', link: '/guides/understanding-kano' },
      { text: 'Reference', link: '/reference/configuration' }
    ],
    sidebar: {
      '/about/': getAboutSidebar(),
      '/guides/': getGuidesSidebar(),
      '/reference/': getReferenceSidebar()
    },
    footer: {
      copyright: 'MIT Licensed | Copyright © 2017-20xx Kalisio'
    }
  },
  build: {
    rollupOptions: {
      external: [fileURLToPath(new URL('../../.postcssrc.js', import.meta.url))],
    }
  }
})

function getAboutSidebar () {
  return [
    { text: 'Introduction', link: '/about/introduction' },
    { text: 'Roadmap', link: '/about/roadmap' },
    { text: 'Contributing', link: '/about/contributing' },
    { text: 'License', link: '/about/license' },
    { text: 'Contact', link: '/about/contact' }
  ]
}

function getGuidesSidebar () {
  return [
    { text: 'Understanding Kano', link: '/guides/understanding-kano' },
    { text: 'Getting Started', link: '/guides/getting-started' },
    { text: 'Installing Kano', link: '/guides/installing-kano' },
    { text: 'Customizing Kano', link: '/guides/customizing-kano' },
    { text: 'Advanced usage', link: '/guides/advanced-usage' },
    { text: 'Using the Kano API', link: '/guides/kano-api' }
  ]
}

function getReferenceSidebar () {
  return [
    { text: 'Configuration', link: '/reference/configuration' },
    { text: 'API', link: '/reference/api' }
  ]
}
