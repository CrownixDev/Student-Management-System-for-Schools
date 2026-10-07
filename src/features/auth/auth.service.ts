import { AuthRepository } from "./auth.repository";
import { IAuthResponseUser, ILoginData } from "./auth.types";
import { ApiError } from "@/lib/ApiError";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import {
  calculateRefreshTokenExpiry,
  generateRefreshToken,
  hashRefreshToken,
  isRefreshTokenExpired,
} from "@/lib/auth/refresh-token";
import { createAccessToken } from "@/lib/auth/jwt";
import { REFRESH_TOKEN_DAYS } from "@/lib/auth/constants";

export class AuthService {
  constructor(private repository: AuthRepository) {}

  async getUserByUsername(username: string): Promise<IAuthResponseUser | null> {
    const user = await this.repository.getUserByUsername(username);
    if (!user) throw new ApiError(404, "User not found");
    return user;
  }

  async registerAdmin(data: ILoginData): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
  }> {
    const { username, password } = data;

    const isUsernameAvailable = await this.repository.isUsernameAvailable(username);
    console.log("isUsernameAvailable", isUsernameAvailable);
    if (!isUsernameAvailable) {
      throw new ApiError(400, "Username already taken");
    }

    const passwordHash = await hashPassword(password);
    const accessToken = await createAccessToken({ username, role: "admin" });
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const refreshTokenExpiresAt = calculateRefreshTokenExpiry(REFRESH_TOKEN_DAYS);

    await this.repository.registerUser(
      {
        username,
        password: passwordHash,
        refreshToken: refreshTokenHash,
        refreshTokenExpiresAt,
      },
      "admin",
    );
    return { accessToken, refreshToken };
  }

  async login(data: ILoginData): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    active: boolean;
  }> {
    const { username, password } = data;

    const user = await this.repository.getUserForLogin(username);
    if (!user) throw new ApiError(401, "Invalid credentials");

    const isPasswordValid = await verifyPassword(password, user.passwordHash);
    if (!isPasswordValid) throw new ApiError(401, "Invalid credentials");

    if (!user.isActive) {
      return { accessToken: null, refreshToken: null, active: false };
    }

    const accessToken = await createAccessToken({ username, role: user.role });
    const refreshToken = generateRefreshToken();
    const refreshTokenHash = hashRefreshToken(refreshToken);
    const refreshTokenExpiresAt = calculateRefreshTokenExpiry(REFRESH_TOKEN_DAYS);

    await this.repository.updateUserByUsername(username, { refreshTokenHash, refreshTokenExpiresAt });
    return { accessToken, refreshToken, active: true };
  }

  async refreshSession(refreshToken: string): Promise<{
    accessToken: string | null;
    refreshToken: string | null;
    active: boolean;
  }> {
    if (!refreshToken) throw new ApiError(401, "Refresh token not found");

    const refreshTokenHash = hashRefreshToken(refreshToken);

    const user = await this.repository.getUserByRefreshToken(refreshTokenHash);

    if (!user || !user.refreshTokenExpiresAt) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    if (!user.isActive) {
      return { accessToken: null, refreshToken: null, active: false };
    }

    const isExpired = isRefreshTokenExpired(user.refreshTokenExpiresAt);
    if (isExpired) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const newAccessToken = await createAccessToken({ username: user.username, role: user.role });
    const oldRefreshTokenHash = hashRefreshToken(refreshToken);

    const newRefreshToken = generateRefreshToken();
    const newRefreshTokenHash = hashRefreshToken(newRefreshToken);
    const newRefreshTokenExpiresAt = calculateRefreshTokenExpiry(REFRESH_TOKEN_DAYS);

    await this.repository.rotateRefreshToken(oldRefreshTokenHash, newRefreshTokenHash, newRefreshTokenExpiresAt);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      active: true,
    };
  }

  async logOut(refreshToken: string) {
    if (!refreshToken) return;
    const refreshTokenHash = hashRefreshToken(refreshToken);
    await this.repository.deleteRefreshToken(refreshTokenHash);
  }
}
