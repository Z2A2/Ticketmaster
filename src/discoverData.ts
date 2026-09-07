import type { DiscoverSection } from '../types';

export const defaultDiscoverSections: DiscoverSection[] = [
  {
    id: 'hero',
    title: '',
    type: 'hero',
    events: [
      {
        id: 'hero-1',
        title: 'Journey',
        category: 'hero',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
        actionLabel: 'Find Tickets',
      }
    ]
  },
  {
    id: 'featured-1',
    title: '',
    type: 'card',
    events: [
      {
        id: 'featured-wwe',
        title: 'WWE',
        category: 'featured',
        image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/WWE_Logo.svg/1200px-WWE_Logo.svg.png',
        label: 'WRESTLING',
      },
      {
        id: 'vip-niall',
        title: 'Niall Horan',
        category: 'vip',
        image: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&q=80',
        label: 'GO AS A VIP',
      },
      {
        id: 'verified-rams',
        title: '2026 Rams Schedule',
        category: 'sports',
        image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
        label: 'GET 100% VERIFIED TICKETS',
      },
      {
        id: 'festival-freestyle',
        title: 'Freestyle Festival Fest, Lisa Lisa & Stevie B',
        category: 'concerts',
        image: 'https://images.unsplash.com/photo-1459749411177-047381bb3ece?w=800&q=80',
        sublabel: 'TOYOTA ARENA ON SATURDAY, JUNE 27',
      }
    ]
  },
  {
    id: 'recently-viewed',
    title: 'RECENTLY VIEWED',
    type: 'recently-viewed',
    events: [
      {
        id: 'recent-1',
        title: 'Central Cee',
        category: 'recently-viewed',
        image: 'https://images.unsplash.com/photo-1574169208507-84376144848b?w=400&q=80',
      }
    ]
  },
  {
    id: 'presales',
    title: 'SPONSORED PRESALES AND OFFERS',
    type: 'presales',
    events: [
      {
        id: 'presale-1',
        title: 'Santana & The Doobie Brothers - Oneness Tour 2026',
        category: 'presale',
        image: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800&q=80',
        label: 'PRESALE',
        sublabel: 'THU - AUG 13 - 7:00 PM',
        venue: 'Hollywood, CA',
        location: 'Hollywood Bowl',
      }
    ]
  },
  {
    id: 'popular-concerts',
    title: 'POPULAR NEAR YOU',
    subtitle: 'CONCERTS',
    type: 'carousel',
    events: [
      {
        id: 'pop-concert-1',
        title: 'The Spinners',
        category: 'concerts',
        image: 'https://images.unsplash.com/photo-1525994886773-080587e161c2?w=800&q=80',
        genre: 'R&B',
      }
    ]
  },
  {
    id: 'popular-sports',
    title: '',
    subtitle: 'SPORTS',
    type: 'carousel',
    events: [
      {
        id: 'pop-sport-1',
        title: '2026 World Cup',
        category: 'sports',
        image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80',
        genre: 'SOCCER',
      }
    ]
  },
  {
    id: 'popular-arts',
    title: '',
    subtitle: 'ARTS, THEATER & COMEDY',
    type: 'carousel',
    events: [
      {
        id: 'pop-arts-1',
        title: 'SmartLess Podcast',
        category: 'arts',
        image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=800&q=80',
        genre: 'PODCAST',
      }
    ]
  },
  {
    id: 'popular-family',
    title: '',
    subtitle: 'FAMILY',
    type: 'carousel',
    events: [
      {
        id: 'pop-family-1',
        title: "Bluey's Big Play",
        category: 'family',
        image: 'https://images.unsplash.com/photo-1502161254066-6c74afbf07aa?w=800&q=80',
        genre: "CHILDREN'S THEATRE",
      }
    ]
  },
  {
    id: 'entertainment-guides',
    title: 'ENTERTAINMENT GUIDES',
    type: 'guides',
    events: [
      {
        id: 'guide-nba',
        title: 'NBA Basketball Tickets',
        category: 'guide',
        image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80',
        sublabel: 'See your favorite team hit the court and get tickets at the Official Ticket Marketplace of the NBA.',
      },
      {
        id: 'guide-nhl',
        title: 'NHL Hockey Tickets',
        category: 'guide',
        image: 'https://images.unsplash.com/photo-1575364289437-f7de2e5e5849?w=800&q=80',
        sublabel: 'Be there live when your favorite team hits the ice at the Official Ticket Marketplace of the NHL.',
      },
      {
        id: 'guide-mlb',
        title: 'MLB Baseball Tickets',
        category: 'guide',
        image: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?w=800&q=80',
        sublabel: 'We answer all of your questions about the 2026 MLB season, including how to get tickets to see your favorite team.',
      },
      {
        id: 'guide-soccer',
        title: 'World Cup Soccer Tickets',
        category: 'guide',
        image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=800&q=80',
        sublabel: 'Shop World Cup soccer tickets and catch all the upcoming matches at Ticketmaster.',
      }
    ]
  },
  {
    id: 'discover-more',
    title: 'DISCOVER MORE',
    type: 'banner',
    events: [
      {
        id: 'discover-1',
        title: 'A Look at the 2026 MLB Schedule and New Rules',
        category: 'featured',
        image: 'https://images.unsplash.com/photo-1504450758481-7338eba7524a?w=800&q=80',
        genre: 'SPORTS',
        sublabel: "MLB's 2026 season is bringing big schedule changes and new rules. Here's what fans need to know before first pitch.",
        actionLabel: 'DISCOVER MORE',
      }
    ]
  },
  {
    id: 'featured-travel',
    title: 'FEATURED',
    type: 'card',
    events: [
      {
        id: 'travel-hotels',
        title: 'Combine your ticket with a hotel & save up to 33%',
        category: 'travel',
        image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
        label: 't / TRAVEL',
        actionLabel: 'Hotels',
      }
    ]
  },
  {
    id: 'ticket-deals',
    title: '',
    type: 'card',
    events: [
      {
        id: 'deals-1',
        title: 'TICKET DEALS',
        category: 'deal',
        image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
        actionLabel: 'Ticket Deals',
      },
      {
        id: 'deals-2',
        title: 'FEEL THE PERFORMANCE, LIVE THE MOMENT AS A VIP.',
        category: 'deal',
        image: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=80',
        label: 'ticketmaster',
        actionLabel: 'VIP Packages',
      },
      {
        id: 'sell-1',
        title: "WHEN YOU'RE OUT, GET OTHER FANS IN",
        category: 'sell',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
        actionLabel: 'Sell on Ticketmaster',
      }
    ]
  }
];
