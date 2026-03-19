import { getTranslations } from 'next-intl/server'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import ArtistsGrid from '@/components/artists/ArtistsGrid'
import artists from '@/data/artists.json'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'artistsPage' })
  return { title: `LONA — ${t('label').replace('— ', '')}` }
}

export default async function ArtistsPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'artistsPage' })

  return (
    <SmoothScroll>
      <Nav />
      <main>
        <ArtistsGrid
          artists={artists}
          locale={locale}
          label={t('label')}
          heading={t('heading')}
          editorial={t('editorial')}
        />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
