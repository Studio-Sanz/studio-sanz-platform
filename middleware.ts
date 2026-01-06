import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas admin (excepto /admin/login que redirige a /login)
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    // Obtener el token de sesión de las cookies
    const sessionToken = request.cookies.get("better-auth.session_token");

    // Debug logging para producción
    if (process.env.NODE_ENV === "production") {
      console.log("Middleware check:", {
        pathname,
        hasSessionToken: !!sessionToken,
        tokenValue: sessionToken?.value ? "exists" : "missing",
        cookies: request.cookies.getAll().map(c => c.name),
      });
    }

    // Si no hay token, redirigir al login
    if (!sessionToken || !sessionToken.value) {
      console.log("No session token found, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar que el token tenga un valor válido
    if (sessionToken.value.trim() === "") {
      console.log("Empty session token, redirecting to login");
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
