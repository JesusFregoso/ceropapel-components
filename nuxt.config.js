import pkg from './package.json';

export default {
  srcDir: __dirname,

  generate: {
    dir: process.env.DIST_PATH || 'dist',
    crawler: false
  },

  router: {
    base: process.env.BASE_URL
  },

  head: {
    title: 'Metecsis - Custom-Elements',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  customElements: {
    entries: [
      {
        name: 'MtxPdfViewer',
        tags: [
          {
            name: 'MtxPdfViewer',
            path: '@/components/PdfViewer'
          }
        ]
      },
      {
        name: 'MtxDocumentEditor',
        tags: [
          {
            name: 'MtxDocumentEditor',
            path: '@/components/DocumentEditor'
          }
        ]
      }
    ]
  },

  buildModules: [
    '@nuxtjs/eslint-module'
  ],

  modules: [
    'nuxt-custom-elements'
  ]

};
