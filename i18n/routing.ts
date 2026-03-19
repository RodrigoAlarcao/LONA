import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
  // PT sem prefixo, EN com prefixo /en
  localePrefix: 'as-needed',
  // Ignora Accept-Language do browser — PT é sempre o default
  localeDetection: false,
  pathnames: {
    '/': '/',
    '/about': {
      pt: '/sobre',
      en: '/about',
    },
    '/work': {
      pt: '/trabalho',
      en: '/work',
    },
    '/work/[slug]': {
      pt: '/trabalho/[slug]',
      en: '/work/[slug]',
    },
    '/artists': {
      pt: '/artistas',
      en: '/artists',
    },
    '/contact': {
      pt: '/contacto',
      en: '/contact',
    },
  },
})
