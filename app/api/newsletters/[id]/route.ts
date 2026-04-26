import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const payload = await request.json();
  const modules = Array.isArray(payload.modules) ? payload.modules : [];

  await prisma.$transaction([
    prisma.newsletter.update({ where: { id: params.id }, data: { title: payload.title } }),
    prisma.newsletterModule.deleteMany({ where: { newsletterId: params.id } }),
    prisma.newsletterModule.createMany({
      data: modules.map((module: any, index: number) => ({
        newsletterId: params.id,
        position: index,
        type: module.type,
        title: module.title,
        body: module.body,
        imageUrl: module.imageUrl || null,
        link: module.link || null,
      })),
    }),
  ]);

  return NextResponse.json({ ok: true });
}
