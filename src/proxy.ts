import { NextRequest, NextResponse } from "next/server";
import { JWTUtils } from "./lib/jwtUtils";
import {
  getDefaultDashboardRoute,
  getRouteOwner,
  isAuthRoute,
  UserRole,
} from "./lib/authUtils";
import {
  getNewTokenWithRefreshToken,
  getUserInfo,
} from "./services/auth.services";
import { isTokenExpiredSoon } from "./lib/tokenUtils";

const refreshTokenMiddleware = async (refreshToken: string) => {
  try {
    const refresh = await getNewTokenWithRefreshToken(refreshToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error refreshing token in middleware", error);
    return false;
  }
};

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  const decodedAccessToken =
    accessToken &&
    JWTUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
      .data;
  const isValidAccessToken =
    accessToken &&
    JWTUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
      .success;
  let userRole: UserRole | null = null;
  if (decodedAccessToken) {
    userRole = decodedAccessToken.role as UserRole;
  }

  const routeOwner = getRouteOwner(pathname);
  const unifySuperAdminAndAdmin =
    userRole === "SUPER_ADMIN" ? "ADMIN" : userRole;

  userRole = unifySuperAdminAndAdmin;

  const isAuth = isAuthRoute(pathname);

  if (
    isValidAccessToken &&
    refreshToken &&
    (await isTokenExpiredSoon(refreshToken))
  ) {
    const requestHeaders = new Headers(request.headers);
    const response = NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });

    try {
      const refresh = await refreshTokenMiddleware(refreshToken);
      if (refresh) {
        requestHeaders.set("x-token-refreshed", "1");
      }
      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
        headers: response.headers,
      });
    } catch (error) {
      console.error("Error refreshing token in middleware", error);
    }
    return response;
  }

  // Rule 1: If the user is authenticated and has a valid access token, trying to access the auth route, redirect to the default dashboard route
  if (isAuth && isValidAccessToken && userRole) {
    return NextResponse.redirect(
      new URL(getDefaultDashboardRoute(userRole), request.url),
    );
  }
  if (pathname === "/reset-password") {
    const email = request.nextUrl.searchParams.get("email");
    if (accessToken && email) {
      const userInfo = await getUserInfo();
      if (userInfo.needsPasswordChange) {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(
          new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
        );
      }
    }
    if (email) {
      return NextResponse.next();
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Rule 2: User is trying to access public route => allow
  if (routeOwner === null) {
    return NextResponse.next();
  }
  // Rule 3: User is not logged in => redirect to login page
  if (!accessToken || !isValidAccessToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
  // Rule 4: User is trying to access common protected route => allow
  if (routeOwner === "COMMON") {
    return NextResponse.next();
  }

  if (accessToken) {
    const userInfo = await getUserInfo();

    if (userInfo.emailVerified === false) {
      if (pathname !== "/verify-email") {
        const verifyEmailUrl = new URL("/verify-email", request.url);
        verifyEmailUrl.searchParams.set("email", userInfo.email);
        return NextResponse.redirect(verifyEmailUrl);
      }
      return NextResponse.next();
    }
    if (userInfo && userInfo.emailVerified && pathname === "/verify-email") {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }

    if (userInfo.needsPasswordChange) {
      if (pathname !== "/reset-password") {
        const resetPasswordUrl = new URL("/reset-password", request.url);
        resetPasswordUrl.searchParams.set("email", userInfo.email);
        return NextResponse.redirect(resetPasswordUrl);
      }
      return NextResponse.next();
    }
    if (
      userInfo &&
      !userInfo.needsPasswordChange &&
      pathname === "/reset-password"
    ) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }
  }

  // Rule 5: user trying to visit role based protected route but does not have the role => redirect to the default dashboard route
  if (
    routeOwner === "ADMIN" ||
    routeOwner === "DOCTOR" ||
    routeOwner === "PATIENT"
  ) {
    if (userRole !== routeOwner) {
      return NextResponse.redirect(
        new URL(getDefaultDashboardRoute(userRole as UserRole), request.url),
      );
    }
  }
  return NextResponse.next();
}
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.well-known).*)",
  ],
};
