import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/check-in/:path*",
    "/skills/:path*",
    "/chat/:path*",
    "/events/:path*",
    "/history/:path*",
    "/settings/:path*",
    "/onboarding/:path*",
  ],
};
