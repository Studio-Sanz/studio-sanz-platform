import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas admin (excepto /admin/login que redirige a /login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Obtener el token de sesión de las cookies
    const sessionToken = request.cookies.get("better-auth.session_token");

    // Si no hay token, redirigir al login
    if (!sessionToken || !sessionToken.value) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar que el token tenga un valor válido
    if (sessionToken.value.trim() === "") {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
