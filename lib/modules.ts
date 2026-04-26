export type ModuleType =
  | "hero"
  | "eventCard"
  | "twoColumn"
  | "quote"
  | "cta"
  | "infoList";

export const moduleCatalog: Array<{ type: ModuleType; name: string; description: string }> = [
  { type: "hero", name: "Hero Banner", description: "Top image with title and intro copy." },
  { type: "eventCard", name: "Event Card", description: "Image, date, short teaser and RSVP link." },
  { type: "twoColumn", name: "Two Column Content", description: "Text + image in two balanced columns." },
  { type: "quote", name: "Chairman Quote", description: "Formal quote block for editorial voice." },
  { type: "cta", name: "Call-To-Action", description: "Prominent button to registration pages." },
  { type: "infoList", name: "Practical Info List", description: "Bullet list for dress code or timings." },
];

export function defaultModuleContent(type: ModuleType) {
  const templates: Record<ModuleType, { title: string; body: string; imageUrl?: string; link?: string }> = {
    hero: {
      title: "Monthly Club Newsletter",
      body: "A curated overview of upcoming talks, dinners, and concerts.",
      imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
    },
    eventCard: {
      title: "Featured Event",
      body: "Short event teaser with date, format and speaker details.",
      link: "https://example.com/event",
    },
    twoColumn: {
      title: "Club Highlights",
      body: "Use this module for stories and member-relevant updates.",
    },
    quote: {
      title: "From the Club Office",
      body: '"We look forward to welcoming you in the clubhouse this month."',
    },
    cta: {
      title: "Reserve Your Seat",
      body: "Registrations are now open for selected spring events.",
      link: "https://example.com/register",
    },
    infoList: {
      title: "Practical Information",
      body: "• Dress code: Smart casual\n• Doors open: 18:30\n• Contact: office@anglogermanclub.de",
    },
  };

  return templates[type];
}
