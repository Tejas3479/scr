'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/Header'

export default function HeaderWrapper() {
  const pathname = usePathname()
  
  // Hide header on landing and auth pages
  const hideHeaderRoutes = ['/landing', '/auth/login', '/auth/register']
  const shouldShowHeader = !hideHeaderRoutes.includes(pathname || '')

  return shouldShowHeader ? <Header /> : null
}
