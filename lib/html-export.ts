import { Newsletter, NewsletterModule } from "@prisma/client";

function escapeHtml(str: string) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function moduleToHtml(module: NewsletterModule) {
  const { title, body, imageUrl, link, type } = module;
  return `
  <section style="padding:24px;border-bottom:1px solid #e5e7eb;">
    ${imageUrl ? `<img src="${escapeHtml(imageUrl)}" alt="${escapeHtml(title)}" style="width:100%;max-height:280px;object-fit:cover;border-radius:8px;" />` : ""}
    <h2 style="font-size:24px;color:#0D1B2A;margin:16px 0 8px;">${escapeHtml(title)}</h2>
    <p style="font-size:16px;line-height:1.6;white-space:pre-line;">${escapeHtml(body)}</p>
    ${link ? `<p style="margin-top:14px;"><a href="${escapeHtml(link)}" style="background:#6D1F2F;color:#fff;padding:10px 16px;border-radius:6px;text-decoration:none;">Open ${escapeHtml(type)} link</a></p>` : ""}
  </section>`;
}

export function generateNewsletterHtml(newsletter: Newsletter & { modules: NewsletterModule[] }) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(newsletter.title)}</title>
  </head>
  <body style="margin:0;background:#F5F1E8;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F5F1E8;padding:24px 0;">
      <tr><td align="center">
        <table role="presentation" width="680" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;">
          <tr><td style="padding:28px;background:#0D1B2A;color:#fff;">
            <h1 style="margin:0;font-size:28px;">Anglo-German Club</h1>
            <p style="margin:8px 0 0;">Harvestehuder Weg 44 · 20149 Hamburg</p>
          </td></tr>
          ${newsletter.modules.sort((a, b) => a.position - b.position).map(moduleToHtml).join("\n")}
          <tr><td style="padding:20px;background:#0D1B2A;color:#fff;font-size:12px;line-height:1.5;">
            <p style="margin:0;">Club office: office@anglogermanclub.de · +49 40-45 01 55-12/13</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}
