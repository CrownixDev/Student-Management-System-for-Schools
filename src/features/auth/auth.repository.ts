import { prisma } from "@/lib/prisma";
import { UserRole } from "@/generated/prisma/client";
import { authUserSelect, IUserRegisterData } from "./auth.types";
import { UserUpdateInput } from "@/generated/prisma/models";

export class AuthRepository {
  async isFirstUser(): Promise<boolean> {
    return (await prisma.user.count()) === 0;
  }

  async isUsernameAvailable(username: string): Promise<boolean> {
    return (await prisma.user.count({ where: { username } })) !== 1;
  }

  async getUserByUsername(username: string) {
    return prisma.user.findUnique({ where: { username }, select: authUserSelect });
  }

  async getUserByRefreshToken(refreshTokenHash: string) {
    return prisma.user.findUnique({
      where: { refreshTokenHash },
      select: { ...authUserSelect, refreshTokenExpiresAt: true },
    });
  }

  async getUserForLogin(username: string) {
    return prisma.user.findUnique({
      where: { username },
      select: { ...authUserSelect, passwordHash: true },
    });
  }

  async updateUserByUsername(username: string, data: UserUpdateInput) {
    await prisma.user.update({
      where: { username },
      data,
    });
  }

  async registerUser(
    data: IUserRegisterData & { refreshToken: string; refreshTokenExpiresAt: string },
    role: UserRole,
  ) {
    const { username, password, refreshToken, refreshTokenExpiresAt } = data;

    await prisma.user.create({
      data: {
        username,
        role,
        passwordHash: password,
        refreshTokenHash: refreshToken,
        refreshTokenExpiresAt,
      },
    });
  }

  async rotateRefreshToken(oldHash: string, newHash: string, expiresAt: string) {
    return prisma.user.update({
      where: { refreshTokenHash: oldHash },
      data: {
        refreshTokenHash: newHash,
        refreshTokenExpiresAt: expiresAt,
      },
    });
  }

  async deleteRefreshToken(refreshTokenHash: string) {
    await prisma.user.updateMany({
      where: { refreshTokenHash },
      data: {
        refreshTokenHash: null,
        refreshTokenExpiresAt: null,
      },
    });
  }
}
