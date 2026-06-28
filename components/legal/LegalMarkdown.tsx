import Link from "next/link";
import type { LegalBlock } from "@/lib/legal/markdown";

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={index}>{part.slice(2, -2)}</strong>;
    }

    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const [, label, href] = linkMatch;
      if (href.startsWith("/")) {
        return (
          <Link key={index} href={href}>
            {label}
          </Link>
        );
      }

      return (
        <a key={index} href={href}>
          {label}
        </a>
      );
    }

    return part;
  });
}

function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "h3") {
          return <h3 key={index}>{block.text}</h3>;
        }

        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{renderInline(item)}</li>
              ))}
            </ul>
          );
        }

        return <p key={index}>{renderInline(block.text)}</p>;
      })}
    </>
  );
}

export function LegalMarkdown({
  intro,
  sections,
}: {
  intro: LegalBlock[];
  sections: Array<{ id: string; title: string; blocks: LegalBlock[] }>;
}) {
  return (
    <div className="legal-markdown">
      <LegalBlocks blocks={intro} />
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="legal-section">
          <h2>{section.title}</h2>
          <LegalBlocks blocks={section.blocks} />
        </section>
      ))}
    </div>
  );
}
