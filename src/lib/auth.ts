import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

const COOKIE = "bb_admin_session";
const secret = () => new TextEncoder().encode(process.env.AUTH_SECRET || "dev-only-secret-change-me-please-32chars!!");

export type Session = { sub: string; email: string; name: string };

export async function createSession(user: { id: string; email: string; name: string }) {
  const token = await new SignJWT({ email: user.email, name: user.name })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<Session | null> {
  try {
    const jar = await cookies();
    const token = jar.get(COOKIE)?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, secret());
    return { sub: payload.sub as string, email: payload.email as string, name: payload.name as string };
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<Session> {
  const s = await getSession();
  if (!s) throw new Error("UNAUTHORIZED");
  return s;
}

export async function verifyCredentials(email: string, password: string) {
  const normalized = email.toLowerCase().trim();
  let user = await prisma.user.findUnique({ where: { email: normalized } });
  // First-run bootstrap: if no admin exists yet and the credentials match the
  // ADMIN_EMAIL / ADMIN_PASSWORD environment variables, create the account.
  if (!user && process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && (await prisma.user.count()) === 0) {
    if (normalized === process.env.ADMIN_EMAIL.toLowerCase().trim() && password === process.env.ADMIN_PASSWORD) {
      const { ensureAdmin } = await import("./seed-content");
      user = await ensureAdmin(prisma, normalized, password);
    }
  }
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
