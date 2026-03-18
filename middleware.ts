import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Aplicar o middleware a todas as rotas excepto as estáticas e API
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
