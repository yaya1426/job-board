import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const ADMIN_HOSTS = ["admin.wazifa.app", "dev-admin.wazifa.app"];
const PUBLIC_HOSTS = ["wazifa.app", "dev.wazifa.app"];

function isDashboardPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/");
}
function isAllowedAdminPublicPath(pathname: string) {
  return pathname === "/login" || pathname === "/not-authorized";
}

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").toLowerCase();
  const pathname = request.nextUrl.pathname;

  const isAdminHost = ADMIN_HOSTS.includes(host);
  const isPublicHost = PUBLIC_HOSTS.includes(host);
  const isDashboardRoute = isDashboardPath(pathname);

  // Case 1:
  // Public website users should not access dashboard URLs from the main domain.
  // Example: wazifa.app/dashboard -> wazifa.app/
  if (isPublicHost && isDashboardRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Case 2:
  // Visiting the admin domain root should open the dashboard by default.
  // Example: admin.wazifa.app/ -> admin.wazifa.app/dashboard
  if (isAdminHost && pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 3:
  // On the admin domain, unknown public pages should not be browsed directly.
  // Keep only login and not-authorized available, otherwise send to dashboard.
  // Example: admin.wazifa.app/jobs -> admin.wazifa.app/dashboard
  if (isAdminHost && !isDashboardRoute && !isAllowedAdminPublicPath(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Case 4:
  // Anything related to the admin area now needs an auth/role check.
  // This covers:
  // - admin.wazifa.app/dashboard
  // - dev-admin.wazifa.app/dashboard
  // - direct /dashboard access on any host
  if (isAdminHost || isDashboardRoute) {
    // Case 4a:
    // Allow admin-domain public pages to render without checking role,
    // otherwise users could never reach login or not-authorized pages.
    if (isAllowedAdminPublicPath(pathname)) {
      return NextResponse.next();
    }

    // Case 4b:
    // Read the signed NextAuth JWT from the request cookies.
    // In proxy, we use getToken() instead of getServerSession().
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Case 4c:
    // Guest user: no token, so redirect to login and return them to dashboard after login.
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", "/dashboard");
      return NextResponse.redirect(loginUrl);
    }

    // Case 4d:
    // Logged-in user but not admin: block access with a friendly page.
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/not-authorized", request.url));
    }
  }

  // Case 5:
  // Everything else is public and can continue normally.
  return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
  matcher: ["/((?!api/|_next/static|_next/image|sw\\.js|favicon\\.ico).*)"],
};
