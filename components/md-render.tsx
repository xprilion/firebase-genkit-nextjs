import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const MarkdownRenderer = ({ markdown }: {markdown: string}) => {
	return (
		<ReactMarkdown remarkPlugins={[remarkGfm]}>
			{markdown}
		</ReactMarkdown>
	);
};

export default MarkdownRenderer;