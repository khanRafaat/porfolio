import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/** Renders CMS markdown with the site's article styling (see globals.css). */
export function Prose({ children }: { children: string }) {
  return (
    <div className="prose-custom">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
