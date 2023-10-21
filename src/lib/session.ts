// lib/session.ts
import { withIronSession } from "next-iron-session";
import { NextApiHandler } from "next";

export default function withSession(handler: NextApiHandler) {
  const password :string | undefined = process.env.SECRET_COOKIE_PASSWORD

  if (!password) {
    console.error('Environment variables are not set');
    return
  }
  return withIronSession(handler, {
    password: password,
    cookieName: "next_app_cookie",
    cookieOptions: {
      secure: process.env.NODE_ENV === "production",
    },
  });
}