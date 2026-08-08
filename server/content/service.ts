import fs from 'fs/promises';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import { sanitizeSlug, isSafePath } from '../security/rateLimiter';

const CONTENT_DIR = path.join(process.cwd(), 'content');

export async function getAllContentItems<T>(contentType: string): Promise<T[]> {
  const targetDir = path.join(CONTENT_DIR, contentType);
  try {
    const files = await fs.readdir(targetDir);
    const items: any[] = [];

    for (const filename of files) {
      if (filename.endsWith('.md')) {
        const filePath = path.join(targetDir, filename);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const { data, content } = matter(fileContent);
        const slug = filename.replace(/\.md$/, '');
        items.push({
          slug,
          ...data,
          content,
        });
      } else if (filename.endsWith('.json')) {
        const filePath = path.join(targetDir, filename);
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const json = JSON.parse(fileContent);
        if (Array.isArray(json)) {
          items.push(...json);
        } else {
          items.push(json);
        }
      }
    }

    return items as T[];
  } catch (error) {
    return [];
  }
}

export async function getContentBySlug<T>(contentType: string, slug: string): Promise<{ data: any; htmlContent: string } | null> {
  const cleanSlug = sanitizeSlug(slug);
  const filePath = path.join(CONTENT_DIR, contentType, `${cleanSlug}.md`);

  if (!isSafePath(CONTENT_DIR, filePath)) {
    throw new Error('Path traversal attempt detected');
  }

  try {
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    const processedContent = await remark().use(html).process(content);
    const htmlContent = processedContent.toString();

    return {
      data: {
        slug: cleanSlug,
        ...data,
      },
      htmlContent,
    };
  } catch (error) {
    return null;
  }
}

export async function saveContentItem(contentType: string, slug: string, frontmatter: Record<string, any>, content: string): Promise<boolean> {
  const cleanSlug = sanitizeSlug(slug);
  const targetDir = path.join(CONTENT_DIR, contentType);
  await fs.mkdir(targetDir, { recursive: true });

  const filePath = path.join(targetDir, `${cleanSlug}.md`);
  if (!isSafePath(CONTENT_DIR, filePath)) {
    throw new Error('Path traversal attempt detected');
  }

  const fileString = matter.stringify(content, frontmatter);
  await fs.writeFile(filePath, fileString, 'utf-8');
  return true;
}
