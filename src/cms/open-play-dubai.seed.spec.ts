import { PrismaClient } from '@prisma/client';
import { CmsService } from './cms.service';
import { PrismaService } from '../prisma/prisma.service';
import { seedOpenPlayDubaiPage } from '../../prisma/seeds/open-play-dubai.seed';

describe('Open Play Dubai CMS seed and API service', () => {
  const pages = new Map<string, any>();
  const sections = new Map<string, any>();
  let nextId = 1;

  const prisma = {
    cmsPage: {
      upsert: jest.fn(async ({ where, create }: any) => {
        if (!pages.has(where.slug)) pages.set(where.slug, { id: nextId++, ...create });
        return pages.get(where.slug);
      }),
      findMany: jest.fn(async () =>
        [...pages.values()].map((page) => ({
          ...page,
          sections: [...sections.values()]
            .filter((section) => section.pageId === page.id)
            .sort((a, b) => a.order - b.order),
        })),
      ),
      findUnique: jest.fn(async ({ where }: any) => {
        const page = pages.get(where.slug);
        return page && {
          ...page,
          sections: [...sections.values()]
            .filter((section) => section.pageId === page.id)
            .sort((a, b) => a.order - b.order),
        };
      }),
      update: jest.fn(async ({ where, data }: any) => {
        const page = pages.get(where.slug);
        Object.assign(page, data);
        return page;
      }),
    },
    cmsSection: {
      upsert: jest.fn(async ({ where, create }: any) => {
        const key = `${where.pageId_key.pageId}:${where.pageId_key.key}`;
        if (!sections.has(key)) sections.set(key, { id: nextId++, ...create });
        return sections.get(key);
      }),
      update: jest.fn(async ({ where, data }: any) => {
        const section = [...sections.values()].find((item) => item.id === where.id);
        Object.assign(section, data);
        return section;
      }),
    },
  };

  const service = new CmsService(prisma as unknown as PrismaService);

  beforeEach(() => {
    pages.clear();
    sections.clear();
    nextId = 1;
    jest.clearAllMocks();
  });

  it('lists and reads all seven sections in display order with the initial SEO and page copy', async () => {
    await seedOpenPlayDubaiPage(prisma as unknown as PrismaClient);

    const page = await service.getPageBySlug('open-play-dubai');
    expect((await service.getAllPages()).map((item) => item.slug)).toContain('open-play-dubai');
    expect(page).toMatchObject({
      title: 'Open Play Dubai',
      metaTitle: 'Mahjong Open Play Across Dubai | Mahjong Success',
      metaDescription: 'Find friendly Mahjong Open Play days across Dubai. Choose a venue, book your seat and meet your Mahjong community.',
    });
    expect(page?.sections.map((section) => section.key)).toEqual([
      'hero', 'intro', 'steps', 'partners', 'neighbourhoods', 'circle', 'cta',
    ]);
    expect((page?.sections[2].content as any).items).toHaveLength(3);
    expect((page?.sections[3].content as any).items).toHaveLength(5);
    expect((page?.sections[4].content as any).items).toContain('Palm Jumeirah');
    expect(page?.sections[5].content).toMatchObject({
      image: '/community-social-1.png', buttonLink: '/join-circle',
    });
  });

  it('keeps existing pages, admin section edits and SEO edits on repeat runs', async () => {
    pages.set('home', { id: nextId++, slug: 'home', title: 'Home Page' });
    await seedOpenPlayDubaiPage(prisma as unknown as PrismaClient);
    const page = (await service.getPageBySlug('open-play-dubai'))!;
    const hero = page.sections[0];
    await service.updateSection(hero.id, { title: 'Edited by admin' });
    await service.updatePageSeo('open-play-dubai', {
      metaTitle: 'Edited SEO', metaDescription: 'Edited description',
    });

    await seedOpenPlayDubaiPage(prisma as unknown as PrismaClient);
    const updated = (await service.getPageBySlug('open-play-dubai'))!;
    expect(updated.sections).toHaveLength(7);
    expect(updated.sections[0]).toMatchObject({ id: hero.id, content: { title: 'Edited by admin' } });
    expect(updated).toMatchObject({ metaTitle: 'Edited SEO', metaDescription: 'Edited description' });
    expect((await service.getAllPages()).map((item) => item.slug)).toContain('home');
    expect(prisma.cmsPage.upsert.mock.calls[1][0].update).toEqual({});
    expect(prisma.cmsSection.upsert.mock.calls[7][0].update).toEqual({});
  });
});
