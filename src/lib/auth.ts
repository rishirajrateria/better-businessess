import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { prisma } from "./db";
import { ADMIN_EMAIL, ADMIN_PASSWORD } from "./admin-credentials";

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
  // The configured admin pair (ADMIN_EMAIL / ADMIN_PASSWORD, or the defaults in
  // admin-credentials.ts) always signs in. It creates the account on a fresh
  // database and repairs it if the stored password drifts from the configuration,
  // so a deploy can never lock you out. To rotate it, change those two values.
  if (normalized === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const { ensureAdmin } = await import("./seed-content");
    if (!user) return ensureAdmin(prisma, normalized, password);
    if (!(await bcrypt.compare(password, user.passwordHash))) {
      return prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(password) } });
    }
    return user;
  }
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export const hashPassword = (pw: string) => bcrypt.hash(pw, 12);
