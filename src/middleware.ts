import { authMiddleware } from "@clerk/nextjs";
export default authMiddleware({
  // publicRoutes: ["/", "/meetings"]
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};