import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const pathname = request.nextUrl.pathname;

  // Define private routes
  const privateRoutes = [
    "/admin", 
    "/api/gallery/general/manage",
    "/api/gallery/office/manage",
    "/api/media/delete",
    "/api/media/upload",
    "/api/people/delete",
    "/api/people/new",
    "/api/people/update",
    "/api/posts/manage",
    "/api/products/delete",
    "/api/products/new",
    "/api/products/update",
    "/api/projects/delete",
    "/api/projects/new",
    "/api/projects/update",
  ]; // Add other private routes as needed

  // Check if the requested route is a private route
  if (privateRoutes.some((route) => pathname.startsWith(route))) {
    // If no token exists, redirect to sign-in page
    if (!token) {
      const signInUrl = new URL("/signin", request.url);
      
      // Append the callback URL to redirect the user back after login
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    // You can add additional checks for roles here if needed (e.g., admin)
    if (token.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // Allow access to all other routes
  return NextResponse.next();
}

// Match the paths for middleware
export const config = {
  matcher: [
    "/admin/:path*",
    "/api/gallery/:path*",
    "/api/media/:path*",
    "/api/people/:path*",
    "/api/posts/:path*",
    "/api/products/:path*",
    "/api/projects/:path*",
  ],
};
