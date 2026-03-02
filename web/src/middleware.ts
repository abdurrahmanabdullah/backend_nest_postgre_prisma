// src/middleware.ts
import { DEFAULT_LOCALE, LOCALES } from "@/config/site";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

function getDomain(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host.includes("localhost")) return undefined;

  // Extract the main domain more reliably
  const parts = host.split(".");
  if (parts.length > 2) {
    // For subdomains, return the main domain
    return `.${parts.slice(-2).join(".")}`;
  }
  // For apex domain
  return `.${host}`;
}

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: "always",
});

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Always allow NextAuth API routes
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // health check
  if (pathname === "/api/health") {
    return NextResponse.next();
  }

  // Get the current locale from the URL or cookies
  const pathnameHasLocale = LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  // Extract current locale from pathname or use default
  const currentLocale = pathnameHasLocale
    ? pathname.split("/")[1]
    : request.cookies.get("NEXT_LOCALE")?.value || DEFAULT_LOCALE;

  // Add manifest to the static files check
  const isStaticFile =
    /\.(ico|png|jpg|jpeg|svg|css|js|txt|webmanifest|json)$/.test(pathname);

  // Skip middleware for static files and favicons
  if (
    isStaticFile ||
    pathname.startsWith("/favicon/") ||
    pathname.startsWith("/_next/static") ||
    pathname === "/manifest.json" ||
    pathname === "/site.webmanifest" ||
    pathname === "/favicon.ico" ||
    pathname === "/robots.txt"
  ) {
    return NextResponse.next();
  }

  // Redirect to URL with locale if missing
  if (!pathnameHasLocale && pathname !== "/") {
    try {
      // Get the base URL from the request
      const baseUrl = new URL(request.url).origin;
      const newUrl = new URL(`${baseUrl}/${currentLocale}${pathname}`);
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl);
    } catch (error) {
      console.error("URL construction error:", error);
      return NextResponse.next();
    }
  }

  // Handle protected routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Define paths that need authentication
  const protectedPaths = [
    "/dashboard",
    "/profile",
    "/settings",
    "/admin",
    "/app",
    "/code-viewer",
    "/assets",
    "/chatbot",
    "/database",
    "/environment",
    "/navbar",
    "/overview",
    "/settings",
    "/translations",
  ];

  // Define public paths that should never trigger authentication
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/",
    "/success", // Add the success page
  ];

  // Improved path matching logic
  const isProtectedPath = (path: string, locale: string): boolean => {
    // First, normalize the path by removing the locale prefix
    let pathWithoutLocale = path;
    if (path.startsWith(`/${locale}/`)) {
      pathWithoutLocale = path.substring(locale.length + 1);
    }

    // Check if it's in the public paths list first
    if (
      publicPaths.some(
        (publicPath) =>
          pathWithoutLocale === publicPath ||
          pathWithoutLocale.startsWith(`${publicPath}?`)
      )
    ) {
      return false; // It's explicitly public
    }

    // Check for exact protected paths
    for (const protectedPath of protectedPaths) {
      if (
        pathWithoutLocale === protectedPath ||
        pathWithoutLocale.startsWith(`${protectedPath}/`)
      ) {
        return true;
      }
    }

    // More careful check for dynamic routes
    // Split the path and check each segment
    const pathParts = pathWithoutLocale.split("/").filter(Boolean);
    for (const protectedPath of protectedPaths) {
      const protectedParts = protectedPath.split("/").filter(Boolean);

      // If the protected path is a single segment (like "app")
      if (
        protectedParts.length === 1 &&
        pathParts.includes(protectedParts[0])
      ) {
        // Only match if it's a whole path segment
        return true;
      }
    }

    return false;
  };

  // In the middleware function, use the improved check
  if (isProtectedPath(pathname, currentLocale) && !token) {
    try {
      const baseUrl = new URL(request.url).origin;
      const loginUrl = new URL(`/${currentLocale}/login`, baseUrl);
      // Add a param to prevent loops
      loginUrl.searchParams.set("callbackUrl", request.url);
      // Skip redirection if we're already on a login-related page
      if (pathname.includes("/login")) {
        return NextResponse.next();
      }
      return NextResponse.redirect(loginUrl);
    } catch (error) {
      console.error("URL construction error:", error);
      return NextResponse.redirect(`/${currentLocale}/login`);
    }
  }

  // Apply intl middleware
  const response = await intlMiddleware(request);

  try {
    // Set locale cookie for persistence - WITH ERROR HANDLING
    const domain = getDomain(request);
    response.cookies.set("NEXT_LOCALE", currentLocale, {
      path: "/",
      domain: domain || undefined,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 365 * 24 * 60 * 60, // 1 year
    });
  } catch (error) {
    console.error("Cookie setting error:", error);
    // Continue even if cookie setting fails
  }

  return response;
}
