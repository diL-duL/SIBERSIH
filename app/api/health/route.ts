import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  const startTime = Date.now();

  try {
    // Jalankan probe ringan ke PostgreSQL Supabase
    await prisma.$queryRaw`SELECT 1`;
    const latencyMs = Date.now() - startTime;

    return NextResponse.json(
      {
        status: "healthy",
        timestamp: new Date().toISOString(),
        database: "connected",
        latencyMs,
        uptime: process.uptime(),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const latencyMs = Date.now() - startTime;
    console.error("Health check failed:", error);

    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: "disconnected",
        latencyMs,
        error: error instanceof Error ? error.message : "Database connection failure",
      },
      { status: 503 }
    );
  }
}
