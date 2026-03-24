export interface Project {
  id: string
  slug: string
  title: string        // PT
  titleEn: string      // EN
  client: string
  clientSector?: string
  artist: string       // slug do artista
  artistName?: string
  type: 'street' | 'install'
  year: number
  city: string
  location?: string
  duration?: string
  dimensions?: string
  status?: string
  description: string  // PT
  descriptionEn: string // EN
  images: string[]     // paths relativos a /public/
  cover: string        // imagem principal para grid
  palette?: string[]
  tags: string[]
}

export interface Artist {
  id: string
  slug: string
  name: string
  location: string
  medium: string
  mediumEn: string
  bio: string
  bioEn: string
  project: string      // slug do projeto associado
  portrait: string
  action: string
  tags: string[]
}

export type Locale = 'pt' | 'en'

export interface ContactFormData {
  name: string
  email: string
  company?: string
  interest: 'brand' | 'artist' | 'other'
  message: string
}
