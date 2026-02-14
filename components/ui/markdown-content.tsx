import { cn } from "@/lib/utils";
import { marked } from "marked";
import type * as React from "react";
import { Suspense, isValidElement, memo, useMemo } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

const DEFAULT_PRE_BLOCK_CLASS =
	" w-fit rounded-xl bg-zinc-950 text-zinc-50 dark:bg-zinc-900 border border-border p-4";

const extractTextContent = (node: React.ReactNode): string => {
	if (typeof node === "string") {
		return node;
	}
	if (Array.isArray(node)) {
		return node.map(extractTextContent).join("");
	}
	if (isValidElement(node)) {
		//@ts-ignore
		return extractTextContent(node.props.children);
	}
	return "";
};

interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
	language: string;
}

const HighlightedPre = memo(
	async ({ children, className, language, ...props }: HighlightedPreProps) => {
		const { codeToTokens, bundledLanguages } = await import("shiki");
		const code = extractTextContent(children);

		if (!(language in bundledLanguages)) {
			return (
				<pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
					<code className="whitespace-pre-wrap">{children}</code>
				</pre>
			);
		}

		const { tokens } = await codeToTokens(code, {
			lang: language as keyof typeof bundledLanguages,
			themes: {
				light: "github-dark",
				dark: "github-dark",
			},
		});

		return (
			<pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
				<code className="whitespace-pre-wrap">
					{tokens.map((line, lineIndex) => (
						<span
							key={`line-${
								// biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
								lineIndex
							}`}
						>
							{line.map((token, tokenIndex) => {
								const style =
									typeof token.htmlStyle === "string"
										? undefined
										: token.htmlStyle;

								return (
									<span
										key={`token-${
											// biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
											tokenIndex
										}`}
										style={style}
									>
										{token.content}
									</span>
								);
							})}
							{lineIndex !== tokens.length - 1 && "\n"}
						</span>
					))}
				</code>
			</pre>
		);
	},
);

HighlightedPre.displayName = "HighlightedPre";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
	language: string;
}

const CodeBlock = ({
	children,
	language,
	className,
	...props
}: CodeBlockProps) => {
	return (
		<Suspense
			fallback={
				<pre {...props} className={cn(DEFAULT_PRE_BLOCK_CLASS, className)}>
					<code className="whitespace-pre-wrap">{children}</code>
				</pre>
			}
		>
			<HighlightedPre language={language} {...props}>
				{children}
			</HighlightedPre>
		</Suspense>
	);
};

CodeBlock.displayName = "CodeBlock";

const components: Partial<Components> = {
	h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
	h2: ({ children, ...props }) => <h2 {...props}>{children}</h2>,
	h3: ({ children, ...props }) => <h3 {...props}>{children}</h3>,
	h4: ({ children, ...props }) => <h4 {...props}>{children}</h4>,
	h5: ({ children, ...props }) => <h5 {...props}>{children}</h5>,
	h6: ({ children, ...props }) => <h6 {...props}>{children}</h6>,
	p: ({ children, ...props }) => <p {...props}>{children}</p>,
	a: ({ children, ...props }) => (
		<a target="_blank" rel="noreferrer" {...props}>
			{children}
		</a>
	),
	strong: ({ children, ...props }) => <strong {...props}>{children}</strong>,
	ul: ({ children, ...props }) => <ul {...props}>{children}</ul>,
	ol: ({ children, ...props }) => <ol {...props}>{children}</ol>,
	li: ({ children, ...props }) => <li {...props}>{children}</li>,
	blockquote: ({ children, ...props }) => (
		<blockquote {...props}>{children}</blockquote>
	),
	hr: (props) => <hr {...props} />,
	img: ({ alt, ...props }) => <img alt={alt} {...props} />,
	table: ({ children, ...props }) => <table {...props}>{children}</table>,
	tr: ({ children, ...props }) => <tr {...props}>{children}</tr>,
	th: ({ children, ...props }) => <th {...props}>{children}</th>,
	td: ({ children, ...props }) => <td {...props}>{children}</td>,

	code: ({ children, className = "", ...props }) => {
		const match = /language-(\w+)/.exec(className);
		if (match) {
			return (
				<CodeBlock language={match[1]} className={className} {...props}>
					{children}
				</CodeBlock>
			);
		}

		return (
			<code className={className} {...props}>
				{children}
			</code>
		);
	},

	pre: ({ children }) => <>{children}</>,
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
	if (!markdown) {
		return [];
	}
	const tokens = marked.lexer(markdown);
	return tokens.map((token) => token.raw);
}

interface MarkdownBlockProps {
	content: string;
	className?: string;
}

const MemoizedMarkdownBlock = memo(
	({ content, className }: MarkdownBlockProps) => {
		return (
			<ReactMarkdown
				remarkPlugins={[remarkGfm]}
				components={components}
				// className={className}
			>
				{content}
			</ReactMarkdown>
		);
	},
	(prevProps, nextProps) => {
		if (prevProps.content !== nextProps.content) {
			return false;
		}
		return true;
	},
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

interface MarkdownContentProps {
	content: string;
	id: string;
	className?: string;
}

export const MarkdownContent = memo(
	({ content, id, className }: MarkdownContentProps) => {
		const blocks = useMemo(
			() => parseMarkdownIntoBlocks(content || ""),
			[content],
		);

		return blocks.map((block, index) => (
			<MemoizedMarkdownBlock
				content={block}
				className={className}
				key={`${id}-block_${index}`}
			/>
		));
	},
);

MarkdownContent.displayName = "MarkdownContent";
