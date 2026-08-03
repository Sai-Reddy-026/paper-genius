import { Fragment } from "react";

/** Minimal markdown renderer for headings, lists, bold/italic, inline & fenced code. */
function renderInline(text: string, keyPrefix: string) {
  const tokens = text.split(/(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g).filter(Boolean);
  return tokens.map((token, i) => {
    const key = `${keyPrefix}-${i}`;
    if (token.startsWith("`") && token.endsWith("`")) {
      return (
        <code
          key={key}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground"
        >
          {token.slice(1, -1)}
        </code>
      );
    }
    if (token.startsWith("**") && token.endsWith("**")) {
      return (
        <strong key={key} className="font-semibold text-foreground">
          {token.slice(2, -2)}
        </strong>
      );
    }
    if (token.startsWith("*") && token.endsWith("*")) {
      return <em key={key}>{token.slice(1, -1)}</em>;
    }
    return <Fragment key={key}>{token}</Fragment>;
  });
}

export function Markdown({ content }: { content: string }) {
  const blocks = content.split(/```/);

  return (
    <div className="space-y-3 text-[0.95rem] leading-relaxed text-foreground/90">
      {blocks.map((block, blockIndex) => {
        if (blockIndex % 2 === 1) {
          const [rawLang, ...rest] = block.replace(/^\n/, "").split("\n");
          const maybeLang = rawLang ?? "";
          const isLang = /^[a-z]+$/i.test(maybeLang.trim());
          const code = (isLang ? rest.join("\n") : block.replace(/^\n/, "")).replace(/\n$/, "");
          return (
            <div key={blockIndex} className="overflow-hidden rounded-xl border bg-muted/40">
              <div className="flex items-center justify-between border-b bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                <span className="font-mono">{isLang ? maybeLang.trim() : "code"}</span>
              </div>
              <pre className="overflow-x-auto p-3 font-mono text-[0.82rem] leading-relaxed">
                <code>{code}</code>
              </pre>
            </div>
          );
        }

        const lines = block.split("\n");
        return (
          <Fragment key={blockIndex}>
            {lines.map((line, lineIndex) => {
              const key = `${blockIndex}-${lineIndex}`;
              const trimmed = line.trim();
              if (!trimmed) return null;
              if (trimmed.startsWith("### ")) {
                return (
                  <h4 key={key} className="pt-1 text-sm font-semibold tracking-tight">
                    {renderInline(trimmed.slice(4), key)}
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3 key={key} className="pt-1 text-base font-semibold">
                    {renderInline(trimmed.slice(3), key)}
                  </h3>
                );
              }
              const ordered = trimmed.match(/^(\d+)\.\s+(.*)$/);
              if (ordered) {
                return (
                  <div key={key} className="flex gap-2">
                    <span className="font-mono text-xs text-primary">{ordered[1]}.</span>
                    <p>{renderInline(ordered[2] ?? "", key)}</p>
                  </div>
                );
              }
              if (trimmed.startsWith("- ")) {
                return (
                  <div key={key} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <p>{renderInline(trimmed.slice(2), key)}</p>
                  </div>
                );
              }
              return <p key={key}>{renderInline(trimmed, key)}</p>;
            })}
          </Fragment>
        );
      })}
    </div>
  );
}
