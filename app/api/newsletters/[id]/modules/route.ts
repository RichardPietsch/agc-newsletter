import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { defaultModuleContent, ModuleType } from "@/lib/modules";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { type } = await request.json();
  const template = defaultModuleContent(type as ModuleType);
  const count = await prisma.newsletterModule.count({ where: { newsletterId: params.id } });

  await prisma.newsletterModule.create({
    data: {
      newsletterId: params.id,
      type,
      title: template.title,
      body: template.body,
      imageUrl: template.imageUrl ?? null,
      link: template.link ?? null,
      position: count,
    },
  });

  return NextResponse.json({ ok: true });
}
