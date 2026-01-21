import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get('ef_token')?.value

  // Protect authenticated routes only
  const protectedRoutes = ['/dashboard', '/learning', '/missions', '/schemes', '/chat', '/help', '/notifications']
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next|public|favicon|static).*)']\n}
}
