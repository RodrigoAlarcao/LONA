import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import Manifesto from '@/components/sections/Manifesto'
import Formats from '@/components/sections/Formats'
import SmoothScroll from '@/components/SmoothScroll'

export default function HomePage() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Formats />
        {/* Secções seguintes: Artistas, Portfolio, CTA, Footer */}
      </main>
    </SmoothScroll>
  )
}
