import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { NewsletterEditor } from "@/components/newsletter-editor";

export default async function EditNewsletterPage({ params }: { params: { id: string } }) {
  const newsletter = await prisma.newsletter.findUnique({
    where: { id: params.id },
    include: { modules: { orderBy: { position: "asc" } } },
  });

  if (!newsletter) notFound();

  return (
    <main>
      <NewsletterEditor
        newsletterId={newsletter.id}
        initialTitle={newsletter.title}
        initialModules={newsletter.modules}
      />
    </main>
  );
}
