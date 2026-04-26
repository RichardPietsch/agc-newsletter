"use client";

import { ModuleType, moduleCatalog } from "@/lib/modules";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Module = {
  id: string;
  position: number;
  type: ModuleType;
  title: string;
  body: string;
  imageUrl: string | null;
  link: string | null;
};

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function buildPreviewHtml(title: string, modules: Module[]) {
  const sections = [...modules]
    .sort((a, b) => a.position - b.position)
    .map(
      (module) => `
  <section style="padding:24px;border-bottom:1px solid #e5e7eb;">
    ${module.imageUrl ? `<img src="${escapeHtml(module.imageUrl)}" alt="${escapeHtml(module.title)}" style="width:100%;max-height:280px;object-fit:cover;border-radius:8px;" />` : ""}
    <h2 style="font-size:24px;color:#0D1B2A;margin:16px 0 8px;">${escapeHtml(module.title)}</h2>
    <p style="font-size:16px;line-height:1.6;white-space:pre-line;">${escapeHtml(module.body)}</p>
    ${module.link ? `<p style="margin-top:14px;"><a href="${escapeHtml(module.link)}" style="background:#6D1F2F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Open link</a></p>` : ""}
  </section>`,
    )
    .join("\n");

  return `<!doctype html>
<html><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /><title>${escapeHtml(title)}</title></head>
<body style="margin:0;background:#F5F1E8;font-family:Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1E8;padding:24px 0;"><tr><td align="center">
<table role="presentation" width="680" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
<tr><td style="padding:28px;background:#0D1B2A;color:#fff;"><h1 style="margin:0;font-size:28px;">Anglo-German Club</h1><p style="margin:8px 0 0;">Harvestehuder Weg 44 · 20149 Hamburg</p></td></tr>
${sections}
<tr><td style="padding:20px;background:#0D1B2A;color:#fff;font-size:12px;line-height:1.5;"><p style="margin:0;">Club office: office@anglogermanclub.de · +49 40-45 01 55-12/13</p></td></tr>
</table>
</td></tr></table>
</body></html>`;
}

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
  const [isModalOpen, setIsModalOpen] = useState(false);

  const previewHtml = useMemo(() => buildPreviewHtml(title, modules), [title, modules]);

  async function save(nextModules: Module[], nextTitle = title) {
    await fetch(`/api/newsletters/${newsletterId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: nextTitle, modules: nextModules }),
    });
    router.refresh();
  }

  return (
    <>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="space-y-4 rounded-xl bg-white p-4 shadow">
          <div className="flex flex-wrap items-end gap-3 border-b pb-4">
            <label className="text-sm">
              Newsletter title
              <input className="ml-2" value={title} onChange={(e) => setTitle(e.target.value)} />
            </label>
            <button className="bg-agc-navy text-white" onClick={() => save(modules, title)}>
              Save
            </button>
            <button className="border border-agc-navy text-agc-navy" onClick={() => setIsModalOpen(true)}>
              Add module
            </button>
            <a className="bg-agc-burgundy text-white" href={`/api/export/${newsletterId}`}>
              Export HTML
            </a>
          </div>

          <div className="space-y-3">
            {[...modules]
              .sort((a, b) => a.position - b.position)
              .map((module, index) => (
                <article key={module.id} className="space-y-2 rounded-lg border p-3">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs uppercase tracking-wider text-slate-500">{module.type}</p>
                    <div className="space-x-2">
                      <button
                        className="border"
                        onClick={() => {
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
                        onClick={() => {
                          const clone = [...modules];
                          if (index === clone.length - 1) return;
                          [clone[index + 1], clone[index]] = [clone[index], clone[index + 1]];
                          setModules(clone.map((m, i) => ({ ...m, position: i })));
                        }}
                      >
                        ↓
                      </button>
                      <button
                        className="border border-red-300 text-red-700"
                        onClick={() => {
                          const remaining = modules.filter((m) => m.id !== module.id);
                          setModules(remaining.map((m, i) => ({ ...m, position: i })));
                        }}
                      >
                        Remove
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
          </div>

          <button className="bg-agc-navy text-white" onClick={() => save(modules, title)}>
            Save changes
          </button>
        </section>

        <section className="rounded-xl bg-white p-4 shadow">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-agc-navy">Live preview</h2>
            <span className="text-xs text-slate-500">WYSIWYG browser render</span>
          </div>
          <iframe
            title="Live newsletter preview"
            srcDoc={previewHtml}
            className="h-[calc(100vh-220px)] min-h-[620px] w-full rounded-lg border"
          />
        </section>
      </div>

      {isModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-5 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-agc-navy">Add a module</h3>
              <button className="border" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
            <div className="space-y-2">
              {moduleCatalog.map((item) => (
                <button
                  key={item.type}
                  className="w-full rounded border border-slate-200 bg-slate-50 p-3 text-left"
                  onClick={async () => {
                    const res = await fetch(`/api/newsletters/${newsletterId}/modules`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ type: item.type }),
                    });

                    if (res.ok) {
                      setIsModalOpen(false);
                      router.refresh();
                    }
                  }}
                >
                  <p className="font-medium">{item.name}</p>
                  <p className="text-xs text-slate-600">{item.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
