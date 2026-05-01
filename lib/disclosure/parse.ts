import fs from "fs/promises";
import path from "path";
import { remark } from "remark";
import remarkHtml from "remark-html";

export type Card = { heading: string; bodyHtml: string };

export type DisclosureSection =
  | { kind: "intro"; id: "intro"; title: string; bodyHtml: string }
  | { kind: "part"; id: string; num: number; title: string; bodyHtml: string }
  | {
      kind: "responsibility-split";
      id: string;
      num: number;
      title: string;
      lead: string;
      hayplus: Card;
      user: Card;
      neither: Card;
    }
  | {
      kind: "acknowledgments";
      id: string;
      num: number;
      title: string;
      lead: string;
      boxes: Card[];
    };

export type DisclosureDocument = {
  title: string;
  version: string;
  effectiveDate: string;
  sections: DisclosureSection[];
};

async function md(input: string): Promise<string> {
  const out = await remark().use(remarkHtml).process(input);
  return String(out);
}

function slugForPart(num: number) {
  return `part-${num}`;
}

/**
 * Split a markdown body into named sub-sections by H3 headings.
 * Returns an ordered list of { heading, body }.
 */
function splitByH3(body: string): { heading: string; body: string }[] {
  const lines = body.split("\n");
  const out: { heading: string; body: string }[] = [];
  let current: { heading: string; body: string } | null = null;
  for (const line of lines) {
    const m = line.match(/^### (.+)$/);
    if (m) {
      if (current) out.push(current);
      current = { heading: m[1] ?? "", body: "" };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) out.push(current);
  return out;
}

export async function loadDisclosure(): Promise<DisclosureDocument> {
  const filePath = path.join(
    process.cwd(),
    "HayPlusbot-Risk-Disclosure.md",
  );
  const raw = (await fs.readFile(filePath, "utf-8"))
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n");

  // Pull title + frontmatter-ish bold lines from the top
  const titleMatch = raw.match(/^# (.+)$/m);
  const versionMatch = raw.match(/\*\*Version:\*\*\s*(\S.*?)\s*$/m);
  const effectiveMatch = raw.match(/\*\*Effective date:\*\*\s*(\S.*?)\s*$/m);

  const title = titleMatch?.[1] ?? "Risk Disclosure";
  const version = versionMatch?.[1] ?? "3.3";
  const effectiveDate = effectiveMatch?.[1] ?? "[TO BE INSERTED AT LAUNCH]";

  // Split body into sections by `## ` heading lines.
  // We deliberately ignore the H1 + frontmatter block at the top.
  const lines = raw.split("\n");
  type Block = { heading: string; body: string };
  const blocks: Block[] = [];
  let current: Block | null = null;
  for (const line of lines) {
    const m = line.match(/^## (.+)$/);
    if (m) {
      if (current) blocks.push(current);
      current = { heading: m[1] ?? "", body: "" };
    } else if (current) {
      current.body += line + "\n";
    }
  }
  if (current) blocks.push(current);

  const sections: DisclosureSection[] = [];

  for (const block of blocks) {
    const heading = block.heading.trim();
    const partMatch = heading.match(/^Part (\d+)\s*[—–-]\s*(.+)$/);

    if (!partMatch) {
      // intro / preamble (e.g., "Why you're reading this")
      sections.push({
        kind: "intro",
        id: "intro",
        title: heading,
        bodyHtml: await md(block.body.trim()),
      });
      continue;
    }

    const num = parseInt(partMatch[1] ?? "0", 10);
    const title = partMatch[2] ?? heading;
    const id = slugForPart(num);

    if (num === 3) {
      // Responsibility split — three H3 sub-sections
      // The body has a small lead paragraph BEFORE the first H3 — capture it.
      const subBody = block.body;
      const firstH3Idx = subBody.indexOf("\n### ");
      const lead =
        firstH3Idx === -1 ? subBody.trim() : subBody.slice(0, firstH3Idx).trim();
      const subs = splitByH3(subBody);
      const find = (re: RegExp) => subs.find((s) => re.test(s.heading));
      const hayplus = find(/HayPlusbot is responsible/i);
      const user = find(/^What you are responsible/i);
      const neither = find(/neither of us controls/i);
      sections.push({
        kind: "responsibility-split",
        id,
        num,
        title,
        lead: await md(lead),
        hayplus: {
          heading: hayplus?.heading ?? "What HayPlusbot is responsible for",
          bodyHtml: await md(hayplus?.body.trim() ?? ""),
        },
        user: {
          heading: user?.heading ?? "What you are responsible for",
          bodyHtml: await md(user?.body.trim() ?? ""),
        },
        neither: {
          heading: neither?.heading ?? "What neither of us controls",
          bodyHtml: await md(neither?.body.trim() ?? ""),
        },
      });
      continue;
    }

    if (num === 5) {
      // Acknowledgments — Box 1, Box 2, Box 3 H3 sub-sections
      const subBody = block.body;
      const firstH3Idx = subBody.indexOf("\n### ");
      const lead =
        firstH3Idx === -1 ? subBody.trim() : subBody.slice(0, firstH3Idx).trim();
      const subs = splitByH3(subBody);
      const boxes: Card[] = [];
      for (const s of subs) {
        boxes.push({
          heading: s.heading,
          bodyHtml: await md(s.body.trim()),
        });
      }
      sections.push({
        kind: "acknowledgments",
        id,
        num,
        title,
        lead: await md(lead),
        boxes,
      });
      continue;
    }

    // Standard part — render body as HTML
    sections.push({
      kind: "part",
      id,
      num,
      title,
      bodyHtml: await md(block.body.trim()),
    });
  }

  return { title, version, effectiveDate, sections };
}
