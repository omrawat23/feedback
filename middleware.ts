
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Define protected routes
const protectedRoutes = ["/dashboard", "/projects", "/payments"];

export default withAuth(
  function middleware(req) {
    const isProtectedRoute = protectedRoutes.some(route => 
      req.nextUrl.pathname.startsWith(route)
    );

    // If it's not a protected route, allow the request
    if (!isProtectedRoute) {
      return NextResponse.next();
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: ["/dashboard(.*)", "/projects(.*)", "/payments(.*)"]
};