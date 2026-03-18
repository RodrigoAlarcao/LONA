import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import SmoothScroll from '@/components/SmoothScroll'

export default function HomePage() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        {/* Secções seguintes: Manifesto, Formatos, Artistas, Portfolio, CTA, Footer */}
      </main>
    </SmoothScroll>
  )
}
