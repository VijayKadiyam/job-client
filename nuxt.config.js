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
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons' }
    ],
    script: [
      { src: 'https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_CHTML' },
      { src: '/javascripts/ckeditor/ckeditor.js' },
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { 
    continuous: 'true',
    color: 'red',
    height: '4px'
  },

  /*
  ** Global CSS
  */
  css: [
    '~/assets/style/app.styl'
  ],

  router: {
    middleware: [
      'clearValidationErrors',
      'auth',
      'organization'
    ]
  },

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/mixins/validation',
    '@/plugins/mixins/auth',
    '@/plugins/mixins/settings',
    '@/plugins/axios',
    '@/plugins/charts',
    { src: '@/plugins/vue-json-excel', ssr: false },
    { src: "@/plugins/vue2-google-maps.js"}
  ],

  auth: {
    strategies: {
      local: {
        endpoints: {
          login: {url: '/login', method: 'post', propertyName: 'token'},
          logout: {url: '/logout', method: 'get'},
          user: {url: '/me', method: 'get', propertyName: 'data'},
        }
      }
    },
    redirect: {
      login: '/auth/login',
      logout: '/auth/login',
      home: '/'
    }
  },

  /*
  ** Nuxt.js modules
  */
  modules: [
    // Doc: https://github.com/nuxt-community/axios-module#usage
    '@nuxtjs/axios',
    '@nuxtjs/auth'
  ],
  /*
  ** Axios module configuration
  */
  axios: {
    // See https://github.com/nuxt-community/axios-module#options
    baseURL: (process.env.NODE_ENV == 'production') 
      ? ((process.env.NUXT_ENV_CLIENT == 'pms')
          ? 'http://92.42.108.132:8082/api' // For PMS 
          : 'http://crm.firststepsolutions.in:8080/api/')// For Sanket
      : 'http://92.42.108.132:8082/api' // For Localhost
  },

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      transpile: [/^vue2-google-maps($|\/)/]
    },
  },
}
