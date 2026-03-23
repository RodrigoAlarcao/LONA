import { getTranslations } from 'next-intl/server'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import WorkGrid from '@/components/work/WorkGrid'
import projects from '@/data/projects.json'

interface Props {
  params: { locale: string }
}

export async function generateMetadata({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'workPage' })
  return { title: `LONA — ${t('label')}` }
}

export default async function WorkPage({ params: { locale } }: Props) {
  const t = await getTranslations({ locale, namespace: 'workPage' })

  const labels = {
    heading:     t('heading'),
    all:         t('all'),
    street:      t('street'),
    install:     t('install'),
    noProjects:  t('noProjects'),
    exploration: t('exploration'),
  }

  return (
    <SmoothScroll>
      <Nav />
      <main>
        <WorkGrid projects={projects} locale={locale} labels={labels} />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
