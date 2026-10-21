import { PrismaClient } from '@prisma/client';

// Create missing CMS content only: an admin's edits to sections or SEO must survive reseeding.
export async function seedOpenPlayDubaiPage(prisma: PrismaClient) {
  const page = await prisma.cmsPage.upsert({
    where: { slug: 'open-play-dubai' },
    update: {},
    create: {
      slug: 'open-play-dubai',
      title: 'Open Play Dubai',
      metaTitle: 'Mahjong Open Play Across Dubai | Mahjong Success',
      metaDescription:
        'Find friendly Mahjong Open Play days across Dubai. Choose a venue, book your seat and meet your Mahjong community.',
    },
  });

  const sections = [
    {
      key: 'hero',
      name: 'Hero Section',
      content: {
        label: 'Mahjong Open Play',
        title: 'Mahjong Open Play\nAcross Dubai',
        description:
          'Find your table. Meet your community. Enjoy the game. Discover welcoming, organised Mahjong Play Days at board game cafes and community venues across Dubai.',
        buttonText: 'Book Your Seat',
        buttonLink: '/play-days-booking',
      },
    },
    {
      key: 'intro',
      name: 'Open Play, Made Easy',
      content: {
        title: 'Open Play, Made Easy',
        paragraphs: [
          'Whether you enjoy Taiwanese, American, International Goulash or Western Mahjong, our Play Days offer a chance to practise your skills, meet fellow enthusiasts and enjoy the game in good company.',
          'There is no need to host or organise your own group of four. Choose your preferred location, check the available sessions and book your seat. We bring the tiles and organise the tables; you bring your love of Mahjong.',
        ],
      },
    },
    {
      key: 'steps',
      name: 'How Open Play Works',
      content: {
        items: [
          {
            title: 'Choose Your Location',
            description: 'Find a Play Day at a convenient cafe or community venue across Dubai.',
          },
          {
            title: 'Book Your Seat',
            description: 'Check the available dates, timings and game formats, then reserve your place.',
          },
          {
            title: 'Meet & Play',
            description: 'Arrive to a ready table, meet fellow players and enjoy an organised game.',
          },
        ],
      },
    },
    {
      key: 'partners',
      name: 'Play Day Partners',
      content: {
        label: 'Across the city',
        title: 'Our Play Day Partners',
        description: 'Curated partner venues for relaxed play - book your session now.',
        items: [
          {
            name: 'Hive Board Game Cafe',
            area: 'The Greens',
            description: 'Join fellow Mahjong players for friendly games in a welcoming neighbourhood setting.',
          },
          {
            name: 'Six Board Game Cafe',
            area: 'Downtown Dubai & Dubai Harbour',
            description: 'Two locations to meet, share a table and make Mahjong part of your social calendar.',
          },
          {
            name: 'Unwind Board Game Cafe',
            area: 'Hessa Street, Al Barsha',
            description: 'Gather for enjoyable Mahjong sessions at either of Unwind’s two Dubai branches.',
          },
          {
            name: 'Tile Board Game Cafe',
            area: 'Jumeirah Heights',
            description: 'Connect with the Mahjong Success community over tiles, conversation and friendly play.',
          },
          {
            name: 'District',
            area: 'Across Dubai',
            description: 'Discover automatic Mahjong tables in place to meet fellow players and enjoy Mahjong Success Play Days.',
          },
        ],
        buttonText: 'Book Now',
        buttonLink: '/play-days-booking',
      },
    },
    {
      key: 'neighbourhoods',
      name: 'Neighbourhood Play',
      content: {
        label: 'Neighbourhood Play',
        title: 'More Places to Play Across Dubai',
        paragraphs: [
          'Our Play Days also take place at locations across Dubai.',
          'As our Circle grows, we look forward to bringing Mahjong to more neighbourhoods across Dubai. Check our booking page for available locations, dates, timings and game formats.',
        ],
        items: [
          'Barsha',
          'Business Bay',
          'Dubai Hills',
          'Emirates Hills',
          'Jumeirah',
          'Jumeirah Islands',
          'Palm Jumeirah',
        ],
        buttonText: 'And more',
        buttonLink: '/play-days-booking',
      },
    },
    {
      key: 'circle',
      name: 'Circle Registration',
      content: {
        label: 'One-time registration',
        title: 'Join the Mahjong Success Circle',
        description:
          'New to the Circle? Complete your one-time registration so we know your preferred Mahjong games, locations and timings. Once registered, you can book the Play Days that suit you.',
        items: [
          'Tell us the games you play',
          'Share your preferred locations',
          'Choose the timings that suit you',
        ],
        image: '/community-social-1.png',
        imageAlt: 'Friends enjoying Mahjong together around a table',
        buttonText: 'Join the Circle',
        buttonLink: '/join-circle',
      },
    },
    {
      key: 'cta',
      name: 'Final Booking CTA',
      content: {
        label: 'Your next game awaits',
        title: 'Explore Play Days & Book Your Seat',
        tagline: 'You have the interest. We have the tiles.',
        buttonText: 'Book Your Seat',
        buttonLink: '/play-days-booking',
        secondaryButtonText: 'Join the Circle',
        secondaryButtonLink: '/join-circle',
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
