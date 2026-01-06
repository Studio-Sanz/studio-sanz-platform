import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  // En producción, Better Auth usa el prefijo __Secure-
  const cookieName = process.env.NODE_ENV === "production"
    ? "__Secure-better-auth.session_token"
    : "better-auth.session_token";

  const hasAuthToken = !!cookieStore.get(cookieName);

  return NextResponse.json({
    cookies: allCookies.map((c) => ({
      name: c.name,
      value: c.value.substring(0, 20) + "...", // Mostrar solo los primeros 20 chars por seguridad
      hasValue: !!c.value,
    })),
    expectedCookieName: cookieName,
    hasBetterAuthToken: hasAuthToken,
    environment: process.env.NODE_ENV,
    requestHeaders: {
      cookie: request.headers.get("cookie"),
    },
  });
}
