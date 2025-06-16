import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  console.log('✅ Middleware ejecutado:', req.nextUrl.pathname);

  const rol = req.cookies.get('custom-auth-rol')?.value;

  if (req.nextUrl.pathname.startsWith('/dashboard/configuraciones')) {
    if (rol !== 'Administrador') {
      console.log('⛔ Acceso denegado. Rol actual:', rol);
      return NextResponse.redirect(new URL('/errors/unauthorized', req.url));
    } else {
      console.log('✅ Acceso autorizado');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/configuraciones/:path*'],
};
