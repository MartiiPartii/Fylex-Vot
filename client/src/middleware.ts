import { NextResponse, NextRequest } from 'next/server'

const protect = ['/dashboard', '/document', '/profile', '/upload']
const auth = ['/auth/github/callback', '/login', '/register']

export function middleware(request: NextRequest) {
    const cookie = request.cookies.get("token")
    const pathname = request.nextUrl.pathname
    const method = request.method
    const hasToken = !!cookie?.value

    // Early return for static assets
    if (
        pathname.startsWith('/_next/') || 
        pathname.startsWith('/images/') || 
        pathname.startsWith('/meta/')
    ) {
        return NextResponse.next()
    }
    
    if (cookie && auth.includes(pathname)) {
        console.log(`${method} ${pathname} [cookie=present] -> redirect /dashboard (auth route)`)
        return NextResponse.redirect(new URL("/dashboard", request.url))
    }
    else if (!cookie && protect.some(path => pathname.startsWith(path))) {
        console.log(`${method} ${pathname} [cookie=missing] -> redirect /login (protected route)`)
        return NextResponse.redirect(new URL("/login", request.url))
    } else {
        console.log(`${method} ${pathname} [cookie=${hasToken ? 'present' : 'missing'}] -> next`)
        return NextResponse.next()
    }
}

// Optimize middleware matcher
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (images, etc.)
         */
        '/((?!api|_next/static|_next/image|favicon.ico|images|meta).*)',
    ],
}