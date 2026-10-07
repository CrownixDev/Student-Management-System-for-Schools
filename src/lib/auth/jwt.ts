import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { ACCESS_TOKEN_EXPIRATION, JWT_AUDIENCE, JWT_ISSUER } from "./constants";
import { UserRole } from "@/generated/prisma/enums";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) throw new Error("JWT_SECRET is not configured");
const jwtSecretKey = new TextEncoder().encode(jwtSecret);

export type AccessTokenPayload = JWTPayload & {
  sub: string;
  role: UserRole;
};

export async function createAccessToken({ username, role }: { username: string; role: UserRole }): Promise<string> {
  return new SignJWT({ role })
    .setProtectedHeader({
      alg: "HS256",
      typ: "JWT",
    })
    .setSubject(username)
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime(ACCESS_TOKEN_EXPIRATION)
    .sign(jwtSecretKey);
}

export async function verifyAccessToken(token: string): Promise<AccessTokenPayload> {
  const { payload } = await jwtVerify<AccessTokenPayload>(token, jwtSecretKey, {
    algorithms: ["HS256"],
    issuer: JWT_ISSUER,
    audience: JWT_AUDIENCE,
    requiredClaims: ["sub", "role"],
  });

  return payload;
}
