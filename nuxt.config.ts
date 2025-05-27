// https://nuxt.com/docs/api/configuration/nuxt-config
const css = ["./public/css/index.css"];

export default defineNuxtConfig({
  css,
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@pinia/nuxt"],
  runtimeConfig: {
    knimeServiceUser: "",
    knimeServicePassword: "",
    public: {
      // Keys within public, will be also exposed to the client-side
    },
  },
});
