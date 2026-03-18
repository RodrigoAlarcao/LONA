import Nav from '@/components/layout/Nav'
import Hero from '@/components/sections/Hero'
import Manifesto from '@/components/sections/Manifesto'
import Formats from '@/components/sections/Formats'
import Artists from '@/components/sections/Artists'
import Work from '@/components/sections/Work'
import SmoothScroll from '@/components/SmoothScroll'

export default function HomePage() {
  return (
    <SmoothScroll>
      <Nav />
      <main>
        <Hero />
        <Manifesto />
        <Formats />
        <Artists />
        <Work />
        {/* Secções seguintes: CTA, Footer */}
      </main>
    </SmoothScroll>
  )
}
