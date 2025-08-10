// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/zenbox"];

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (protectedRoutes.includes(pathname)) {
    const jwtToken = request.cookies.get("jwtToken");

    if (!jwtToken) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    try {
      await jwtVerify(
        jwtToken.value,
        new TextEncoder().encode(process.env.JWT_SECRET)
      );
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/zenbox"],
};
