import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage() {
  const newsletters = await prisma.newsletter.findMany({
    orderBy: { updatedAt: "desc" },
    include: { _count: { select: { modules: true } } },
  });

  return (
    <main className="space-y-4">
      <form action="/api/newsletters" method="post" className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-agc-navy">Create newsletter</h2>
        <div className="mt-2 flex gap-2">
          <input name="title" defaultValue={`AGC Newsletter ${new Date().toISOString().slice(0, 7)}`} />
          <button className="bg-agc-burgundy text-white" type="submit">
            New newsletter
          </button>
        </div>
      </form>

      <section className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-agc-navy">Previous newsletters</h2>
        <ul className="mt-3 space-y-2">
          {newsletters.map((newsletter) => (
            <li key={newsletter.id} className="flex items-center justify-between rounded border p-2">
              <div>
                <p className="font-medium">{newsletter.title}</p>
                <p className="text-xs text-slate-600">{newsletter._count.modules} modules</p>
              </div>
              <Link className="text-agc-burgundy underline" href={`/dashboard/newsletters/${newsletter.id}`}>
                Edit
              </Link>
            </li>
          ))}
          {newsletters.length === 0 ? <li className="text-sm text-slate-500">No newsletters yet.</li> : null}
        </ul>
      </section>
    </main>
  );
}
