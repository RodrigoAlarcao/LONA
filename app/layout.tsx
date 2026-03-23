import type { Metadata } from 'next'
import './globals.css'

// Fontes auto-hospedadas via @fontsource — zero layout shift, sem dependência de rede no build
// Weights específicos para cada fonte do projecto LONA
import '@fontsource/cormorant-garamond/300.css'
import '@fontsource/cormorant-garamond/400.css'
import '@fontsource/cormorant-garamond/600.css'
import '@fontsource/cormorant-garamond/700.css'
import '@fontsource/dm-sans/300.css'
import '@fontsource/dm-sans/400.css'
import '@fontsource/dm-sans/500.css'
import '@fontsource/ibm-plex-mono/400.css'
import '@fontsource/ibm-plex-mono/500.css'

export const metadata: Metadata = {
  title: 'LONA — Arte que faz marcas',
  description: 'Conectamos marcas a artistas para criar obras permanentes.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://lona.pt'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <head>
        {/* Preload do fundo do hero — crítico para LCP mobile */}
        <link rel="preload" as="image" href="/images/hero-lona-empty.jpg" fetchPriority="high" />
      </head>
      <body>{children}</body>
    </html>
  )
}
