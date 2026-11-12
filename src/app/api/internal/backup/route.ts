import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import path from "node:path";
import fs from "node:fs/promises";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: NextRequest): boolean {
  const expectedToken = process.env.CROWNIX_INTERNAL_TOKEN;
  const authorization = request.headers.get("authorization");

  if (!expectedToken || !authorization) return false;

  return authorization === `Bearer ${expectedToken}`;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { fileName } = await request.json();

    if (typeof fileName !== "string" || !/^backup-[\w-]+\.db$/.test(fileName)) {
      return NextResponse.json({ error: "Invalid backup filename." }, { status: 400 });
    }

    const backupDirectory = process.env.CROWNIX_BACKUP_DIR;

    if (!backupDirectory) {
      throw new Error("Backup directory is not configured.");
    }

    const destination = path.resolve(backupDirectory, fileName);

    // Ensure the resolved destination is inside the backup directory.
    const relativePath = path.relative(path.resolve(backupDirectory), destination);

    if (relativePath.startsWith("..") || path.isAbsolute(relativePath)) {
      return NextResponse.json({ error: "Invalid backup destination." }, { status: 400 });
    }

    await fs.mkdir(backupDirectory, { recursive: true });

    try {
      await fs.access(destination);
      return NextResponse.json({ error: "Backup file already exists." }, { status: 409 });
    } catch {
      // Destination does not exist
    }

    const sqlPath = destination.replace(/\\/g, "/").replace(/'/g, "''");

    // Creates a consistent standalone SQLite snapshot.
    await prisma.$executeRawUnsafe(`VACUUM INTO '${sqlPath}'`);

    const stat = await fs.stat(destination);

    return NextResponse.json({
      success: true,
      fileName,
      size: stat.size,
    });
  } catch (error) {
    console.error("Database backup failed:", error);
    return NextResponse.json({ error: "Database backup failed." }, { status: 500 });
  }
}
