import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import Manifesto from '@/components/sections/Manifesto'
import SmoothScroll from '@/components/SmoothScroll'

export default function HomePage() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        {/* Secções seguintes: Formatos, Artistas, Portfolio, CTA, Footer */}
      </main>
    </SmoothScroll>
  )
}
