import { PrismaClient } from '@prisma/client';

// Insert missing content without overwriting edits made in the CMS.
export async function seedBlogPage(prisma: PrismaClient) {
  const page = await prisma.cmsPage.upsert({
    where: { slug: 'blog' },
    update: {},
    create: {
      slug: 'blog',
      title: 'Blog',
      metaTitle: 'Mahjong Success Blog | Mahjong Success',
      metaDescription: 'Learning tips, game guides and ideas from the Mahjong Success community.',
    },
  });

  const sections = [
    {
      key: 'hero', name: 'Blog Hero', content: {
        label: 'Stories from our tables', title: 'Blog',
        description: 'Learning tips, game guides and ideas from the Mahjong Success community.',
      },
    },
    {
      key: 'featured', name: 'Featured Story', content: {
        label: 'Featured story', title: 'From the Mahjong Success community', previewText: 'Article preview',
        article: {
          slug: 'five-ways-guided-play-builds-confidence',
          title: 'Five Ways Guided Play Builds Confidence at the Table',
          category: 'Learning', date: 'October 18, 2026',
          description: 'Discover how supported gameplay helps new and experienced players turn knowledge into confident decisions.',
          image: '/community-social-1.png', imageAlt: 'Friends playing Mahjong together around a table',
          body: 'Guided play gives you a welcoming space to put what you have learned into practice. With support close at hand, each turn becomes an opportunity to recognise patterns and make decisions with more confidence.\n\nPlaying alongside others helps you learn from real situations, ask questions and develop your own rhythm. Over time, the table feels less intimidating and much more like a place to belong.',
        },
      },
    },
    {
      key: 'latest', name: 'Latest Articles', content: {
        label: 'Latest articles', title: 'Ideas & Inspiration',
        description: 'Explore learning tips, game guides and fresh perspectives from around the Mahjong table.',
        articles: [
          {
            slug: 'strategic-thinking-beyond-mahjong-table', title: 'Strategic Thinking Beyond the Mahjong Table',
            category: 'Corporate', date: 'October 5, 2026',
            description: 'How observation, adaptability and decision-making through Mahjong can create stronger workplace conversations.',
            image: '/guided-games.jpg', imageAlt: 'A player choosing a Mahjong tile',
            body: 'Mahjong encourages us to observe, weigh possibilities and adapt when the game changes. These are familiar skills in a workplace, where collaboration matters as much as individual strategy.\n\nAround the table, players practise listening, making decisions and sharing a challenge together. It is a fresh way to connect with colleagues beyond the usual meeting room.',
          },
          {
            slug: 'getting-to-know-taiwanese-mahjong', title: 'Getting to Know Taiwanese Mahjong',
            category: 'Game Guides', date: 'September 28, 2026',
            description: 'An approachable introduction to the rhythm, structure and distinctive features of Taiwanese Mahjong.',
            image: '/community-social-2.png', imageAlt: 'Players enjoying Mahjong together',
            body: 'Taiwanese Mahjong has its own rhythm, tile combinations and table traditions. Learning its structure a step at a time makes a new variation feel approachable.\n\nStart with the flow of a round, get comfortable recognising the tiles and give yourself time to enjoy the game with others.',
          },
          {
            slug: 'what-to-expect-first-mahjong-session', title: 'What to Expect from Your First Mahjong Session',
            category: 'For Beginners', date: 'September 14, 2026',
            description: 'A simple guide to the tiles, table and supportive learning experience awaiting first-time players.',
            image: '/community-ladies-2.png', imageAlt: 'A group learning Mahjong at a table',
            body: 'Your first Mahjong session is about curiosity, not perfection. You will get to know the tiles, see how a round works and have plenty of chances to ask questions.\n\nCome ready to learn at your own pace, meet other players and enjoy the satisfaction of making your first moves.',
          },
          {
            slug: 'read-the-table-plan-next-move', title: 'How to Read the Table and Plan Your Next Move',
            category: 'Learning', date: 'September 9, 2026',
            description: 'Learn to spot useful tiles, watch the changing table and make your next decision with confidence.',
            image: '/why-guided-play.jpg', imageAlt: 'Hands arranging tiles on a Mahjong table',
            body: 'Every discard offers a little more information. Watching the table helps you notice which tiles have appeared and how your own hand might develop.\n\nTake a moment before each move to consider your options. With practice, you will find a balance between following a plan and staying flexible.',
          },
          {
            slug: 'beginners-guide-mahjong-tiles', title: 'A Beginner’s Guide to the Mahjong Tiles',
            category: 'For Beginners', date: 'September 3, 2026',
            description: 'Get familiar with the suits and special tiles before your first game begins.',
            image: '/game-nml.jpg', imageAlt: 'Mahjong tiles arranged on a green table',
            body: 'The tiles are the starting point for every Mahjong game. Begin by recognising the numbered suits, then get to know the honour and special tiles used in your variation.\n\nYou do not have to memorise everything at once. Familiarity grows naturally as you sort your hand and play more rounds.',
          },
          {
            slug: 'mahjong-etiquette-better-game', title: 'Mahjong Etiquette That Makes Every Game Better',
            category: 'At the Table', date: 'August 27, 2026',
            description: 'A few thoughtful table habits can make each session more welcoming and enjoyable for everyone.',
            image: '/diff-2-etiquette.jpg', imageAlt: 'Mahjong players sharing a game',
            body: 'A great game is about more than the tiles. Making space for other players, keeping a friendly pace and being patient with newcomers makes the table more welcoming.\n\nSmall gestures of kindness help everyone relax and enjoy the game together.',
          },
        ],
      },
    },
    {
      key: 'cta', name: 'Share Your Story', content: {
        label: 'Join the conversation', title: 'Have a Mahjong Story to Share?',
        description: 'We would love to hear about your learning journey, favourite game or memorable moment around the table.',
        buttonText: 'Contact Us', buttonLink: '/contact',
      },
    },
  ];

  for (const [order, section] of sections.entries()) {
    await prisma.cmsSection.upsert({
      where: { pageId_key: { pageId: page.id, key: section.key } },
      update: {},
      create: { pageId: page.id, order, ...section },
    });
  }
}
