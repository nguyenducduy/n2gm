const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }]
  },

  router: {
    middleware: ["check-auth"]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: "#2ecc71", height: "3px" },

  /*
  ** Global CSS
  */
  css: [
    'normalize.css',
    'element-ui/lib/theme-chalk/index.css'
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '@/plugins/element-ui.ts', ssr: true },
    { src: '@/plugins/i18n.ts', ssr: true },
    { src: '@/plugins/axios.ts', ssr: true },
    { src: "~plugins/notify.ts", ssr: false }
  ],

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@/modules/typescript.js'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    baseURL: 'http://localhost:9000/graphql',
    timeout: 30,
    headers: {
      "Content-Type": "application/json"
    }
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      if (!ctx.isDev) {
        config.devtool = false
      }

      // inject `compilerModules` to vue-loader options
      config.module.rules.forEach(rule => {
        if (rule.loader === 'vue-loader') {
          rule.options.loaders = {
            i18n: '@kazupon/vue-i18n-loader'
          }
        }
      })
    }
  }
}
