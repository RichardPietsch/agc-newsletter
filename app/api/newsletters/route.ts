import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.redirect(new URL("/login", request.url));

  const formData = await request.formData();
  const title = String(formData.get("title") || "Untitled Newsletter");

  const created = await prisma.newsletter.create({
    data: { title, ownerId: session.user.id },
  });

  return NextResponse.redirect(new URL(`/dashboard/newsletters/${created.id}`, request.url));
}
