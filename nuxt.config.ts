import { preset } from "@knime/styles/config/postcss.config.cjs";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  css: ["./assets/index.css"],
  compatibilityDate: "2025-05-15",
  devtools: { enabled: true },
  modules: ["@nuxt/eslint", "@pinia/nuxt"],
  postcss: {
    plugins: {
      "postcss-mixins": {},
      "postcss-preset-env": preset,
    },
  },
  runtimeConfig: {
    // during dev, filled from .env file; in production, filled from environment variables
    knimeServiceUser: "",
    knimeServicePassword: "",
    public: {
      // Keys within public, will be also exposed to the client-side
    },
  },
  routeRules: {
    // Homepage pre-rendered at build time
    "/": { prerender: true },
    // game only client-side rendered
    "/game": { ssr: false },
  },
});
