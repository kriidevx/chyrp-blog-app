import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export async function markdownToHtml(markdown: string) {
  const result = await remark()
    .use(html)
    .use(remarkGfm)
    .process(markdown);
  return result.toString();
}

export function extractExcerpt(markdown: string, maxLength: number = 160) {
  // Remove markdown syntax
  let text = markdown
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Replace links
    .replace(/[*_~`]/g, '') // Remove emphasis markers
    .replace(/#{1,6}\s/g, '') // Remove headers
    .replace(/\n/g, ' ') // Replace newlines with spaces
    .trim();

  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
}
