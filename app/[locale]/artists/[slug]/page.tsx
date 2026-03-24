import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import ArtistDetail from '@/components/artists/ArtistDetail'
import artists from '@/data/artists.json'
import projects from '@/data/projects.json'

interface Props {
  params: { locale: string; slug: string }
}

export async function generateStaticParams() {
  return artists.map((a) => ({ slug: a.slug }))
}

export async function generateMetadata({ params: { slug } }: Props) {
  const artist = artists.find((a) => a.slug === slug)
  if (!artist) return {}
  return { title: `LONA — ${artist.name}` }
}

export default async function ArtistPage({ params: { locale, slug } }: Props) {
  const artist = artists.find((a) => a.slug === slug)
  if (!artist) notFound()

  const project = projects.find((p) => p.slug === artist.project) ?? null
  const t = await getTranslations({ locale, namespace: 'artistsPage' })

  return (
    <SmoothScroll>
      <Nav />
      <main>
        <ArtistDetail
          artist={artist}
          project={project}
          locale={locale}
          labels={{
            associatedProject: t('associatedProject'),
            viewProject: t('viewProject'),
            allArtists: t('allArtists'),
            exploration: t('exploration'),
          }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
