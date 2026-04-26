import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateNewsletterHtml } from "@/lib/html-export";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: params.id },
    include: { modules: true },
  });

  if (!newsletter) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const html = generateNewsletterHtml(newsletter);
  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `attachment; filename="newsletter-${newsletter.id}.html"`,
    },
  });
}
