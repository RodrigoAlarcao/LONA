// O middleware next-intl trata do redirect para /pt ou /en
// Este ficheiro nunca é alcançado em condições normais
import { redirect } from 'next/navigation'

export default function RootPage() {
  redirect('/')
}
