import { CheckCircle2, AlertTriangle, Globe } from "lucide-react";
import type { DisclosureSection } from "@/lib/disclosure/parse";

const PROSE_CLASSES =
  "max-w-none text-base leading-relaxed text-muted-foreground " +
  "[&_p]:my-4 " +
  "[&_strong]:text-foreground [&_strong]:font-semibold " +
  "[&_em]:italic " +
  "[&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:font-sans [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:tracking-tight " +
  "[&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:font-sans [&_h4]:text-base [&_h4]:font-semibold [&_h4]:text-foreground " +
  "[&_ul]:my-4 [&_ul]:pl-5 [&_ul]:list-disc [&_ul]:space-y-1 " +
  "[&_ol]:my-4 [&_ol]:pl-5 [&_ol]:list-decimal [&_ol]:space-y-1 " +
  "[&_li]:pl-1 " +
  "[&_a]:text-teal [&_a]:underline-offset-4 hover:[&_a]:underline " +
  "[&_blockquote]:my-6 [&_blockquote]:border-l-2 [&_blockquote]:border-teal [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-foreground/85";

function ProseHtml({ html }: { html: string }) {
  return (
    <div
      className={PROSE_CLASSES}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

function PartHeader({ num, title }: { num: number; title: string }) {
  return (
    <header className="mb-6">
      <p className="font-mono text-xs uppercase tracking-[0.18em] text-teal/80">
        Part {String(num).padStart(2, "0")}
      </p>
      <h2 className="mt-3 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
    </header>
  );
}

function ResponsibilitySplit({
  section,
}: {
  section: Extract<DisclosureSection, { kind: "responsibility-split" }>;
}) {
  return (
    <section
      id={section.id}
      className="scroll-mt-24 border-t border-white/[0.06] py-16"
    >
      <PartHeader num={section.num} title={section.title} />
      {section.lead ? <ProseHtml html={section.lead} /> : null}
      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <article
          className="rounded-xl border p-6"
          style={{
            background: "rgba(29, 158, 117, 0.10)",
            borderColor: "rgba(29, 158, 117, 0.45)",
          }}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-teal" aria-hidden="true" />
            <h3 className="font-sans text-base font-semibold text-foreground">
              {section.hayplus.heading}
            </h3>
          </div>
          <div className="mt-3">
            <ProseHtml html={section.hayplus.bodyHtml} />
          </div>
        </article>
        <article
          className="rounded-xl border p-6"
          style={{
            background: "rgba(186, 117, 23, 0.10)",
            borderColor: "rgba(186, 117, 23, 0.45)",
          }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber" aria-hidden="true" />
            <h3 className="font-sans text-base font-semibold text-foreground">
              {section.user.heading}
            </h3>
          </div>
          <div className="mt-3">
            <ProseHtml html={section.user.bodyHtml} />
          </div>
        </article>
        <article className="rounded-xl border border-white/[0.06] bg-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <h3 className="font-sans text-base font-semibold text-foreground">
              {section.neither.heading}
            </h3>
          </div>
          <div className="mt-3">
            <ProseHtml html={section.neither.bodyHtml} />
          </div>
        </article>
      </div>
    </section>
  );
}

function Acknowledgments({
  section,
}: {
  section: Extract<DisclosureSection, { kind: "acknowledgments" }>;
}) {
  return (
    <section
      id={section.id}
      className="scroll-mt-24 border-t border-white/[0.06] py-16"
    >
      <PartHeader num={section.num} title={section.title} />
      {section.lead ? <ProseHtml html={section.lead} /> : null}
      <div className="mt-6 space-y-4">
        {section.boxes.map((box, i) => (
          <article
            key={i}
            className="rounded-xl border border-teal/30 bg-card p-6"
          >
            <p className="font-mono text-[11px] uppercase tracking-widest text-teal/80">
              Acknowledgment {i + 1}
            </p>
            <h3 className="mt-2 font-sans text-base font-semibold text-foreground">
              {box.heading}
            </h3>
            <div className="mt-3">
              <ProseHtml html={box.bodyHtml} />
            </div>
            <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-secondary/60 px-3 py-1 font-mono text-[11px] text-muted-foreground">
              <span
                aria-hidden="true"
                className="inline-block h-3 w-3 rounded-sm border border-muted-foreground/40"
              />
              You will tick this box when signing during onboarding.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function DisclosureContent({
  sections,
}: {
  sections: DisclosureSection[];
}) {
  return (
    <article className="space-y-0">
      {sections.map((section) => {
        if (section.kind === "intro") {
          return (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 pb-12"
            >
              <h2 className="mb-4 font-sans text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {section.title}
              </h2>
              <ProseHtml html={section.bodyHtml} />
            </section>
          );
        }
        if (section.kind === "responsibility-split") {
          return (
            <ResponsibilitySplit key={section.id} section={section} />
          );
        }
        if (section.kind === "acknowledgments") {
          return <Acknowledgments key={section.id} section={section} />;
        }
        return (
          <section
            key={section.id}
            id={section.id}
            className="scroll-mt-24 border-t border-white/[0.06] py-16"
          >
            <PartHeader num={section.num} title={section.title} />
            <ProseHtml html={section.bodyHtml} />
          </section>
        );
      })}
    </article>
  );
}
