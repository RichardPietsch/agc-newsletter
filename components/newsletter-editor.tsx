"use client";

import { ModuleType, moduleCatalog } from "@/lib/modules";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Module = {
  id: string;
  position: number;
  type: ModuleType;
  title: string;
  body: string;
  imageUrl: string | null;
  link: string | null;
};

export function NewsletterEditor({
  newsletterId,
  initialTitle,
  initialModules,
}: {
  newsletterId: string;
  initialTitle: string;
  initialModules: Module[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [modules, setModules] = useState(initialModules);

  async function save(nextModules: Module[], nextTitle = title) {
    await fetch(`/api/newsletters/${newsletterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: nextTitle, modules: nextModules }),
    });
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <aside className="rounded-xl bg-white p-4 shadow">
        <h2 className="text-lg font-semibold text-agc-navy">Module Catalog</h2>
        <div className="mt-3 space-y-2">
          {moduleCatalog.map((item) => (
            <button
              key={item.type}
              className="w-full border border-slate-200 bg-slate-50 text-left"
              onClick={async () => {
                const res = await fetch(`/api/newsletters/${newsletterId}/modules`, {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ type: item.type }),
                });
                if (res.ok) router.refresh();
              }}
            >
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-slate-600">{item.description}</p>
            </button>
          ))}
        </div>
      </aside>

      <section className="space-y-4 rounded-xl bg-white p-4 shadow">
        <div className="flex flex-wrap items-end gap-3 border-b pb-4">
          <label className="text-sm">
            Newsletter title
            <input className="ml-2" value={title} onChange={(e) => setTitle(e.target.value)} />
          </label>
          <button className="bg-agc-navy text-white" onClick={() => save(modules, title)}>
            Save
          </button>
          <a className="bg-agc-burgundy text-white" href={`/api/export/${newsletterId}`}>
            Export HTML
          </a>
        </div>

        {modules
          .sort((a, b) => a.position - b.position)
          .map((module, index) => (
            <article key={module.id} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs uppercase tracking-wider text-slate-500">{module.type}</p>
                <div className="space-x-2">
                  <button
                    className="border"
                    onClick={async () => {
                      const clone = [...modules];
                      if (index === 0) return;
                      [clone[index - 1], clone[index]] = [clone[index], clone[index - 1]];
                      setModules(clone.map((m, i) => ({ ...m, position: i })));
                    }}
                  >
                    ↑
                  </button>
                  <button
                    className="border"
                    onClick={async () => {
                      const clone = [...modules];
                      if (index === clone.length - 1) return;
                      [clone[index + 1], clone[index]] = [clone[index], clone[index + 1]];
                      setModules(clone.map((m, i) => ({ ...m, position: i })));
                    }}
                  >
                    ↓
                  </button>
                </div>
              </div>
              <input
                className="w-full"
                value={module.title}
                onChange={(e) => setModules(modules.map((m) => (m.id === module.id ? { ...m, title: e.target.value } : m)))}
                placeholder="Title"
              />
              <textarea
                className="w-full"
                rows={4}
                value={module.body}
                onChange={(e) => setModules(modules.map((m) => (m.id === module.id ? { ...m, body: e.target.value } : m)))}
              />
              <input
                className="w-full"
                value={module.imageUrl ?? ""}
                placeholder="Image URL"
                onChange={(e) => setModules(modules.map((m) => (m.id === module.id ? { ...m, imageUrl: e.target.value } : m)))}
              />
              <input
                className="w-full"
                value={module.link ?? ""}
                placeholder="Landing page URL"
                onChange={(e) => setModules(modules.map((m) => (m.id === module.id ? { ...m, link: e.target.value } : m)))}
              />
            </article>
          ))}

        <button className="bg-agc-navy text-white" onClick={() => save(modules, title)}>
          Save changes
        </button>
      </section>
    </div>
  );
}
