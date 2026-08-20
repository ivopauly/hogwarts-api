// https://nuxt.com/docs/api/configuration/nuxt-config

const SITE_URL = 'https://hogwarts-api.com';

// Kept in one place so the meta tags, app.config.ts and README cannot drift apart.
const SITE_DESCRIPTION
  = 'The Hogwarts API is a magical API containing data from the wizarding world of '
    + 'Harry Potter, Hogwarts Legacy and the Fantastic Beasts universe.';

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
  // The theme ships @nuxtjs/color-mode with the default `system` preference.
  // Dark is the brand's primary presentation (the gold reads best on navy), so it
  // is the default for a first visit. `preference` only seeds the initial value —
  // the header toggle still works and a visitor's choice is remembered.
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
  },

  // nuxt-site-config (pulled in by the theme's nuxt-og-image) uses this to turn
  // relative asset paths into the absolute URLs that OpenGraph and Twitter require.
  site: {
    url: 'https://hogwarts-api.com',
    name: 'Hogwarts API',
  },

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
      ],
      meta: [
        { name: 'description', content: SITE_DESCRIPTION },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Hogwarts API' },
        { property: 'og:title', content: 'Hogwarts API' },
        { property: 'og:description', content: SITE_DESCRIPTION },
        { property: 'og:image', content: `${SITE_URL}/og-image.png` },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Hogwarts API' },
        { property: 'og:url', content: SITE_URL },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Hogwarts API' },
        { name: 'twitter:description', content: SITE_DESCRIPTION },
        { name: 'twitter:image', content: `${SITE_URL}/og-image.png` },
        { name: 'twitter:image:alt', content: 'Hogwarts API' },
        { name: 'theme-color', content: '#0A101C' },
      ],
    },
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
