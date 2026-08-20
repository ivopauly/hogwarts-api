// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  extends: ['shadcn-docs-nuxt'],
  // shadcn-docs-nuxt >=1.0 bundles @nuxtjs/i18n with the `prefix_except_default`
  // strategy. The consuming project must declare defaultLocale and locales, or the
  // theme's navigation composable throws on an undefined locale tree.
  // Hogwarts API is English-only, so this is a single-locale declaration.
  i18n: {
    defaultLocale: 'en',
    locales: [
      {
        code: 'en',
        name: 'English',
        language: 'en-US',
      },
    ],
  },
  content: {
    highlight: {
      // The docs author MDC examples inside ::code-group blocks. Without `mdc`
      // registered as a highlight language the "Code" tab renders nothing.
      langs: ['mdc', 'mermaid', 'tsx'],
    },
  },
  compatibilityDate: '2024-07-06',
});
