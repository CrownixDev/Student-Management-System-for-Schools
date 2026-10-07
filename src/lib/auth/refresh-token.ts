import { createHash, randomBytes } from "node:crypto";

export function generateRefreshToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashRefreshToken(token: string): string {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

export function calculateRefreshTokenExpiry(usableDays: number): string {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + usableDays);
  return expiryDate.toISOString();
}

export function isRefreshTokenExpired(expiryDate: string): boolean {
  const now = new Date();
  const expiry = new Date(expiryDate);
  return now > expiry;
}
