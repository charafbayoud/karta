import { LegalPageShell } from "@/components/landing/LegalPageShell";
import { LegalMarkdown } from "@/components/legal/LegalMarkdown";
import { TableOfContents } from "@/components/legal/TableOfContents";
import { loadLegalDocument } from "@/lib/legal/markdown";

type LegalLayoutProps = {
  label: string;
  title: string;
  document: "privacy.md" | "terms.md";
};

export function LegalLayout({ label, title, document }: LegalLayoutProps) {
  const { updated, intro, sections, toc } = loadLegalDocument(document);

  return (
    <LegalPageShell label={label} title={title} updated={updated}>
      <div className="legal-layout">
        <TableOfContents items={toc} />
        <LegalMarkdown intro={intro} sections={sections} />
      </div>
    </LegalPageShell>
  );
}
