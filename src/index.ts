// Ticket Types
export interface Ticket {
  id: string;
  eventName: string;
  artistName: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  ticketType: string;
  entryInfo: string;
  purchaseDate: string;
  section: string;
  row: string;
  seat: string;
  eventImage: string;
  mapImage?: string;
  orderNumber: string;
  barcodeNumber: string;
  transferStatus?: 'active' | 'sent' | 'claimed' | 'cancelled';
  transferRecipient?: {
    firstName: string;
    lastName: string;
    email?: string;
    phone?: string;
    note?: string;
  };
}

export interface TicketGroup {
  id: string;
  eventName: string;
  artistName: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  eventImage: string;
  mapImage?: string;
  tickets: Ticket[];
}

// Legacy Event type (for compatibility)
export interface Event {
  id: string;
  name: string;
  artist: string;
  venue: string;
  location: string;
  date: string;
  time: string;
  image: string;
  category: string;
  price?: string;
}

// Event Types for Discover Page
export interface DiscoverEvent {
  id: string;
  title: string;
  subtitle?: string;
  category: 'hero' | 'featured' | 'vip' | 'sports' | 'concerts' | 'arts' | 'family' | 'guide' | 'deal' | 'sell' | 'presale' | 'recently-viewed' | 'popular' | 'entertainment' | 'travel';
  image: string;
  label?: string;
  sublabel?: string;
  action?: string;
  actionLabel?: string;
  genre?: string;
  date?: string;
  venue?: string;
  location?: string;
  price?: string;
  custom?: boolean;
}

export interface DiscoverSection {
  id: string;
  title: string;
  subtitle?: string;
  type: 'hero' | 'carousel' | 'grid' | 'card' | 'horizontal' | 'recently-viewed' | 'presales' | 'guides' | 'deals' | 'banner';
  events: DiscoverEvent[];
}

// User Types
export interface User {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profileImage?: string;
  country: string;
  language: string;
}

// Transfer Types
export interface TransferData {
  ticketId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  note: string;
}

// Country Types
export interface Country {
  code: string;
  name: string;
  flag: string;
  language: string;
  languageName: string;
}

// Navigation Types
export type TabType = 'discover' | 'favorites' | 'my-tickets' | 'sell' | 'account';
