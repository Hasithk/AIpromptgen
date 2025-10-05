/**
 * Format blog content from markdown to properly structured HTML
 * Ensures paragraphs, lists, headings are properly separated and styled
 */
export function formatBlogContent(content: string): string {
  if (!content) return '';

  // If content is already HTML (contains tags), process it
  if (content.includes('<h') || content.includes('<p>') || content.includes('<ul>')) {
    return enhanceHtmlContent(content);
  }

  // Otherwise, convert markdown to HTML
  return convertMarkdownToHtml(content);
}

/**
 * Enhance existing HTML content with proper spacing and structure
 */
function enhanceHtmlContent(html: string): string {
  let formatted = html;

  // Ensure all paragraphs are wrapped
  formatted = formatted.replace(/<p>([^<]+)<\/p>/g, '<p class="mb-4 leading-7">$1</p>');
  
  // Ensure headings have proper spacing
  formatted = formatted.replace(/<h2>/g, '<h2 class="text-2xl font-bold mt-8 mb-4">');
  formatted = formatted.replace(/<h3>/g, '<h3 class="text-xl font-semibold mt-6 mb-3">');
  formatted = formatted.replace(/<h4>/g, '<h4 class="text-lg font-semibold mt-4 mb-2">');
  
  // Ensure lists have proper spacing
  formatted = formatted.replace(/<ul>/g, '<ul class="list-disc list-inside mb-4 ml-4 space-y-2">');
  formatted = formatted.replace(/<ol>/g, '<ol class="list-decimal list-inside mb-4 ml-4 space-y-2">');
  formatted = formatted.replace(/<li>/g, '<li class="leading-7">');
  
  // Ensure blockquotes are styled
  formatted = formatted.replace(/<blockquote>/g, '<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 italic">');
  
  // Ensure code blocks are styled
  formatted = formatted.replace(/<code>/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">');
  formatted = formatted.replace(/<pre>/g, '<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto">');
  
  // Ensure strong/bold tags are styled
  formatted = formatted.replace(/<strong>/g, '<strong class="font-semibold text-foreground">');
  
  return formatted;
}

/**
 * Convert markdown content to properly formatted HTML
 */
function convertMarkdownToHtml(markdown: string): string {
  let html = markdown;

  // Convert headings with proper spacing
  html = html.replace(/^### (.+)$/gm, '<h3 class="text-xl font-semibold mt-6 mb-3">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 class="text-2xl font-bold mt-8 mb-4">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 class="text-3xl font-bold mt-8 mb-6">$1</h1>');

  // Convert unordered lists
  html = html.replace(/^\* (.+)$/gm, '<li class="leading-7">$1</li>');
  html = html.replace(/^- (.+)$/gm, '<li class="leading-7">$1</li>');
  
  // Wrap consecutive list items in ul tags
  html = html.replace(/(<li class="leading-7">.+<\/li>\n?)+/g, (match) => {
    return `<ul class="list-disc list-inside mb-4 ml-4 space-y-2">\n${match}</ul>\n`;
  });

  // Convert ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li class="leading-7">$1</li>');
  
  // Wrap consecutive numbered list items in ol tags (but only if they weren't already converted)
  html = html.replace(/(?<!<ul[^>]*>.*)<li class="leading-7">(\d+\..*?)<\/li>/g, (match) => {
    if (match.match(/^\d+\./)) {
      return `<ol class="list-decimal list-inside mb-4 ml-4 space-y-2">\n${match}</ol>\n`;
    }
    return match;
  });

  // Convert bold text with proper styling
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold text-foreground">$1</strong>');
  html = html.replace(/__(.+?)__/g, '<strong class="font-semibold text-foreground">$1</strong>');

  // Convert italic text
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/_(.+?)_/g, '<em>$1</em>');

  // Convert inline code
  html = html.replace(/`(.+?)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm">$1</code>');

  // Convert code blocks (multiline)
  html = html.replace(/```[\s\S]*?```/g, (match) => {
    const code = match.replace(/```/g, '').trim();
    return `<pre class="bg-muted p-4 rounded-lg my-4 overflow-x-auto"><code>${code}</code></pre>`;
  });

  // Convert blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote class="border-l-4 border-primary pl-4 py-2 my-4 italic">$1</blockquote>');

  // Convert links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>');

  // Convert horizontal rules
  html = html.replace(/^---$/gm, '<hr class="my-8 border-t border-border" />');

  // Convert remaining text into paragraphs
  // Split by double newlines to identify paragraphs
  const lines = html.split('\n');
  const processedLines: string[] = [];
  let inBlock = false;
  let currentParagraph = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check if we're in a block element (heading, list, blockquote, etc.)
    if (line.match(/^<(h[1-6]|ul|ol|li|blockquote|pre|hr|div)/)) {
      // Close current paragraph if any
      if (currentParagraph) {
        processedLines.push(`<p class="mb-4 leading-7">${currentParagraph}</p>`);
        currentParagraph = '';
      }
      processedLines.push(line);
      inBlock = true;
    } else if (line.match(/^<\/(ul|ol|blockquote|pre|div)>/)) {
      processedLines.push(line);
      inBlock = false;
    } else if (line === '') {
      // Empty line - close current paragraph if any
      if (currentParagraph) {
        processedLines.push(`<p class="mb-4 leading-7">${currentParagraph}</p>`);
        currentParagraph = '';
      }
      inBlock = false;
    } else if (!inBlock && line) {
      // Regular text line - add to current paragraph
      if (currentParagraph) {
        currentParagraph += ' ' + line;
      } else {
        currentParagraph = line;
      }
    } else {
      processedLines.push(line);
    }
  }

  // Close final paragraph if any
  if (currentParagraph) {
    processedLines.push(`<p class="mb-4 leading-7">${currentParagraph}</p>`);
  }

  html = processedLines.join('\n');

  return html;
}

/**
 * Generate properly formatted HTML content for blog posts
 * This is used for automated blog generation
 */
export function generateFormattedBlogContent(sections: {
  title?: string;
  introduction?: string;
  sections?: Array<{
    heading: string;
    content: string;
    subsections?: Array<{
      heading: string;
      content: string;
    }>;
  }>;
  conclusion?: string;
}): string {
  let html = '';

  if (sections.title) {
    html += `<h1 class="text-3xl font-bold mt-8 mb-6">${sections.title}</h1>\n\n`;
  }

  if (sections.introduction) {
    html += `<p class="mb-4 leading-7">${sections.introduction}</p>\n\n`;
  }

  if (sections.sections) {
    sections.sections.forEach((section) => {
      html += `<h2 class="text-2xl font-bold mt-8 mb-4">${section.heading}</h2>\n`;
      html += `<p class="mb-4 leading-7">${section.content}</p>\n\n`;

      if (section.subsections) {
        section.subsections.forEach((subsection) => {
          html += `<h3 class="text-xl font-semibold mt-6 mb-3">${subsection.heading}</h3>\n`;
          html += `<p class="mb-4 leading-7">${subsection.content}</p>\n\n`;
        });
      }
    });
  }

  if (sections.conclusion) {
    html += `<h2 class="text-2xl font-bold mt-8 mb-4">Conclusion</h2>\n`;
    html += `<p class="mb-4 leading-7">${sections.conclusion}</p>\n\n`;
  }

  return html;
}
