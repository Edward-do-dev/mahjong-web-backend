import { PrismaClient } from '@prisma/client';
import { seedBlogPage } from '../../prisma/seeds/blog.seed';

describe('Blog CMS seed', () => {
  it('creates editable blog sections and preserves saved edits when reseeded', async () => {
    let page: any;
    const sections = new Map<string, any>();
    const prisma = {
      cmsPage: {
        upsert: jest.fn(async ({ create }: any) => {
          if (!page) page = { id: 1, ...create };
          return page;
        }),
      },
      cmsSection: {
        upsert: jest.fn(async ({ create }: any) => {
          if (!sections.has(create.key)) sections.set(create.key, { ...create });
          return sections.get(create.key);
        }),
      },
    };

    await seedBlogPage(prisma as unknown as PrismaClient);
    expect(page.slug).toBe('blog');
    expect([...sections.keys()]).toEqual(['hero', 'featured', 'latest', 'cta']);
    expect(sections.get('latest').content.articles).toHaveLength(6);
    expect(sections.get('featured').content.article.image).toBeTruthy();

    sections.get('hero').content.title = 'Updated in CMS';
    page.metaTitle = 'Updated SEO';
    await seedBlogPage(prisma as unknown as PrismaClient);

    expect(sections.size).toBe(4);
    expect(sections.get('hero').content.title).toBe('Updated in CMS');
    expect(page.metaTitle).toBe('Updated SEO');
    expect(prisma.cmsPage.upsert.mock.calls[1][0].update).toEqual({});
    expect(prisma.cmsSection.upsert.mock.calls[4][0].update).toEqual({});
  });
});
