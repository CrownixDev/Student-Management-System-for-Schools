export const JWT_ISSUER = "crownix";
export const JWT_AUDIENCE = "crownix";

export const ACCESS_TOKEN_EXPIRATION = "15m";
export const ACCESS_TOKEN_COOKIE_MAX_AGE = 15 * 60;

export const REFRESH_TOKEN_DAYS = 1; // In days
export const REFRESH_TOKEN_COOKIE_MAX_AGE = REFRESH_TOKEN_DAYS * 24 * 60 * 60;

export const ACCESS_TOKEN_COOKIE = process.env.NODE_ENV === "production" ? "__Host-crownix-access" : "crownix-access";

export const REFRESH_TOKEN_COOKIE =
  process.env.NODE_ENV === "production" ? "__Host-crownix-refresh" : "crownix-refresh";
