export interface Project {
  id: string
  slug: string
  title: string        // PT
  titleEn: string      // EN
  client: string
  artist: string       // slug do artista
  type: 'street' | 'install'
  year: number
  city: string
  description: string  // PT
  descriptionEn: string // EN
  images: string[]     // paths relativos a /public/
  cover: string        // imagem principal para grid
  tags: string[]
}

export interface Artist {
  id: string
  slug: string
  name: string
  nameEn: string
  bio: string
  bioEn: string
  medium: string
  mediumEn: string
  location: string
  images: string[]
  cover: string
  projects: string[]   // slugs de projetos
}

export type Locale = 'pt' | 'en'

export interface ContactFormData {
  name: string
  email: string
  company?: string
  interest: 'brand' | 'artist' | 'other'
  message: string
}
