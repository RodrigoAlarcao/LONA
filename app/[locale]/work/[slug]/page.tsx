import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import SmoothScroll from '@/components/SmoothScroll'
import ProjectDetail from '@/components/work/ProjectDetail'
import projects from '@/data/projects.json'

interface Props {
  params: { locale: string; slug: string }
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params: { locale, slug } }: Props) {
  const project = projects.find((p) => p.slug === slug)
  if (!project) return {}
  const title = locale === 'en' ? project.titleEn : project.title
  return { title: `LONA — ${title}` }
}

export default async function ProjectPage({ params: { locale, slug } }: Props) {
  const project = projects.find((p) => p.slug === slug)
  if (!project) notFound()

  const idx  = projects.indexOf(project)
  const prev = idx > 0 ? projects[idx - 1] : null
  const next = idx < projects.length - 1 ? projects[idx + 1] : null

  const t = await getTranslations({ locale, namespace: 'projectPage' })

  return (
    <SmoothScroll>
      <Nav />
      <main>
        <ProjectDetail
          project={project}
          locale={locale}
          prev={prev ? { slug: prev.slug, title: locale === 'en' ? prev.titleEn : prev.title, cover: prev.cover } : null}
          next={next ? { slug: next.slug, title: locale === 'en' ? next.titleEn : next.title, cover: next.cover } : null}
          labels={{
            client:         t('client'),
            artist:         t('artist'),
            location:       t('location'),
            year:           t('year'),
            format:         t('format'),
            duration:       t('duration'),
            dimensions:     t('dimensions'),
            processCaption: t('processCaption'),
            exploration:    t('exploration'),
            allWork:        t('allWork'),
            prev:           t('prev'),
            next:           t('next'),
          }}
        />
      </main>
      <Footer />
    </SmoothScroll>
  )
}
