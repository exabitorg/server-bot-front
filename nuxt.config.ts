// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devServer: {
    port: 4000
  },
  server: {
    port: 4000
  },
  runtimeConfig: {
    public: {
      url: 'https://bot.exabit.uz/api' // https://botapi.hypernova.uz/api
    }
  },

  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  compatibilityDate: '2025-01-23',
});
