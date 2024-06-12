import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import Markdown from "react-markdown";

export default function MarkdownBlock({content}: { content: string }) {
    return (
        <Markdown
            className="h-full prose break-words prose-p:leading-relaxed prose-pre:p-0"
            remarkPlugins={[remarkGfm, remarkMath]}
            rehypePlugins={[rehypeRaw, rehypeSanitize]}
            components={{
                p({children}) {
                    return <p className="mb-2 last:mb-0">{children}</p>
                },


            }}
        >
            {content}
        </Markdown>
    )
}