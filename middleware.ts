import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // En producción, Better Auth usa el prefijo __Secure- por seguridad
  const cookieName = process.env.NODE_ENV === "production"
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";

  const sessionToken = request.cookies.get(cookieName);
  const isAuthenticated = !!(sessionToken && sessionToken.value && sessionToken.value.trim() !== "");

  // Si está autenticado e intenta acceder a /login, redirigir a /admin
  if (pathname === "/login" && isAuthenticated) {
    const adminUrl = new URL("/admin", request.url);
    return NextResponse.redirect(adminUrl);
  }

  // Proteger rutas admin (excepto /admin/login que redirige a /login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
