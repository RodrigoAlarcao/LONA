import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['pt', 'en'],
  defaultLocale: 'pt',
  // PT sem prefixo, EN com prefixo /en
  localePrefix: 'as-needed',
})
