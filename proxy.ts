import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Proteger rutas admin
  if (pathname.startsWith("/admin")) {
    // Obtener el token de sesión de las cookies
    const sessionToken = request.cookies.get("better-auth.session_token");

    // Si no hay token, redirigir al login
    if (!sessionToken) {
      const loginUrl = new URL("/login", request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Aquí podrías validar el token con Better Auth si lo necesitas
    // Por ahora, solo verificamos que exista
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
