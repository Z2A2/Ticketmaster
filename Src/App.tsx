import { createContext, useContext, useReducer, useState, useRef } from 'react';
import {
  Search, MapPin, Calendar, ChevronDown, ChevronRight, ChevronLeft,
  Heart, Ticket, Banknote, User, ArrowLeft,
  Share2, MoreVertical, Bell, Edit2, Check, Plus, Trash2, Copy,
  Shield, Mail, Navigation, MapPinned,
  Clock, Tag, Barcode, Wallet
} from 'lucide-react';

// ─── TYPES ───────────────────────────────────────────────────────────
interface TicketData {
  id: string;
  eventId: string;
  section: string;
  row: string;
  seat: string;
  type: string;
  entry: string;
  barcode: string;
}

interface EventData {
  id: string;
  artistName: string;
  tourName: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  state: string;
  bannerImage: string;
  ticketImage: string;
  tickets: TicketData[];
  orderNumber: string;
  purchaseDate: string;
}

interface AppState {
  screen: string;
  prevScreen: string | null;
  activeTab: string;
  selectedEventId: string | null;
  selectedTicketIndex: number;
  events: EventData[];
  location: string;
  dateFilter: string;
  country: string;
  user: { name: string; email: string; phone: string; photo: string | null };
  notifications: boolean;
  locationBasedContent: boolean;
  favorites: string[];
  transferHistory: any[];
}

type Action =
  | { type: 'NAVIGATE'; screen: string }
  | { type: 'GO_BACK' }
  | { type: 'SET_TAB'; tab: string }
  | { type: 'SELECT_EVENT'; eventId: string }
  | { type: 'SELECT_TICKET'; index: number }
  | { type: 'ADD_EVENT'; event: EventData }
  | { type: 'UPDATE_EVENT'; eventId: string; event: Partial<EventData> }
  | { type: 'DELETE_EVENT'; eventId: string }
  | { type: 'SET_LOCATION'; location: string }
  | { type: 'SET_DATE_FILTER'; filter: string }
  | { type: 'SET_COUNTRY'; country: string }
  | { type: 'TOGGLE_NOTIFICATIONS' }
  | { type: 'TOGGLE_LOCATION_CONTENT' }
  | { type: 'UPDATE_USER'; user: Partial<AppState['user']> }
  | { type: 'ADD_TRANSFER'; transfer: any }
  | { type: 'ADD_FAVORITE'; eventId: string }
  | { type: 'REMOVE_FAVORITE'; eventId: string };

// ─── INITIAL DATA ────────────────────────────────────────────────────
const initialEvents: EventData[] = [
  {
    id: '1',
    artistName: 'BTS',
    tourName: "BTS WORLD TOUR 'ARIRANG' IN TORONTO",
    date: 'SUN • AUG 23, 2026',
    time: '8:00 PM',
    venue: 'Rogers Stadium',
    city: 'Toronto',
    state: 'ON',
    bannerImage: '/bts-toronto.jpg',
    ticketImage: '/bts-toronto.jpg',
    orderNumber: '29000601018105811',
    purchaseDate: 'Mar 15, 2026',
    tickets: [
      { id: 't1', eventId: '1', section: 'N110', row: '24', seat: '14', type: 'Standard Admission', entry: 'Gate 4 - Main Entrance', barcode: '890123456789' },
      { id: 't2', eventId: '1', section: 'N110', row: '24', seat: '15', type: 'Standard Admission', entry: 'Gate 4 - Main Entrance', barcode: '890123456790' },
    ],
  },
];

const initialState: AppState = {
  screen: 'discover',
  prevScreen: null,
  activeTab: 'discover',
  selectedEventId: null,
  selectedTicketIndex: 0,
  events: initialEvents,
  location: 'Los Angeles, CA',
  dateFilter: 'All Dates',
  country: 'United States',
  user: { name: 'Regina', email: 'ragina568@gmail.com', phone: '+1 (310) 555-0123', photo: null },
  notifications: true,
  locationBasedContent: false,
  favorites: [],
  transferHistory: [],
};

// ─── REDUCER ─────────────────────────────────────────────────────────
function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'NAVIGATE':
      return { ...state, prevScreen: state.screen, screen: action.screen };
    case 'GO_BACK':
      return { ...state, screen: state.prevScreen ?? state.activeTab, prevScreen: null };
    case 'SET_TAB':
      return { ...state, activeTab: action.tab, screen: action.tab, prevScreen: null };
    case 'SELECT_EVENT':
      return { ...state, selectedEventId: action.eventId, selectedTicketIndex: 0 };
    case 'SELECT_TICKET':
      return { ...state, selectedTicketIndex: action.index };
    case 'ADD_EVENT':
      return { ...state, events: [...state.events, action.event] };
    case 'UPDATE_EVENT':
      return {
        ...state,
        events: state.events.map(e => e.id === action.eventId ? { ...e, ...action.event } : e),
      };
    case 'DELETE_EVENT':
      return { ...state, events: state.events.filter(e => e.id !== action.eventId) };
    case 'SET_LOCATION':
      return { ...state, location: action.location };
    case 'SET_DATE_FILTER':
      return { ...state, dateFilter: action.filter };
    case 'SET_COUNTRY':
      return { ...state, country: action.country };
    case 'TOGGLE_NOTIFICATIONS':
      return { ...state, notifications: !state.notifications };
    case 'TOGGLE_LOCATION_CONTENT':
      return { ...state, locationBasedContent: !state.locationBasedContent };
    case 'UPDATE_USER':
      return { ...state, user: { ...state.user, ...action.user } };
    case 'ADD_TRANSFER':
      return { ...state, transferHistory: [...state.transferHistory, action.transfer] };
    case 'ADD_FAVORITE':
      return { ...state, favorites: [...state.favorites, action.eventId] };
    case 'REMOVE_FAVORITE':
      return { ...state, favorites: state.favorites.filter(id => id !== action.eventId) };
    default:
      return state;
  }
}

// ─── CONTEXT ─────────────────────────────────────────────────────────
const AppContext = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

// ─── DISCOVER SCREEN ─────────────────────────────────────────────────
function DiscoverScreen() {
  const { state, dispatch } = useApp();
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const categories = ['Concerts', 'Sports', 'Arts, Theater & Comedy'];
  const [activeCategory, setActiveCategory] = useState(0);

  const featuredEvents = [
    { id: 'f1', title: 'Benson Boone', image: '/benson-boone.jpg', subtitle: 'Starlight Stadium Tour' },
    { id: 'f2', title: 'The Lonesome Drifters', image: '/country-artist.jpg', subtitle: 'Live in Concert' },
    { id: 'f3', title: 'Rock Revolution', image: '/rock-concert.jpg', subtitle: 'Summer Festival 2026' },
  ];

  const trendingEvents = [
    { id: 't1', title: 'NBA Finals 2026', date: 'Jun 15, 2026', venue: 'Crypto.com Arena', image: '/basketball-game.jpg', price: 'From $150' },
    { id: 't2', title: 'Phantom of the Opera', date: 'Jul 20 - Aug 15, 2026', venue: 'Theatre Royal', image: '/theater-show.jpg', price: 'From $85' },
    { id: 't3', title: 'Rock Revolution Tour', date: 'Aug 5, 2026', venue: 'Madison Square Garden', image: '/rock-concert.jpg', price: 'From $75' },
  ];

  return (
    <div className="h-full flex flex-col bg-[#111111]">
      {/* Header */}
      <div className="shrink-0 bg-[#111111] px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-3">
          <div className="w-8" />
          {/* Ticketmaster Logo */}
          <div className="flex-1 flex justify-center">
            <svg viewBox="0 0 200 28" className="h-6 w-auto">
              <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
                fill="white" fontSize="22" fontWeight="bold" fontStyle="italic"
                fontFamily="Arial, Helvetica, sans-serif">ticketmaster</text>
            </svg>
          </div>
          {/* Country Flag */}
          <button onClick={() => setShowCountryPicker(true)}
            className="w-8 h-8 rounded-full border-2 border-white/80 overflow-hidden flex items-center justify-center">
            <span className="text-lg">🇺🇸</span>
          </button>
        </div>

        {/* Location & Dates Filter */}
        <div className="flex items-center mb-3">
          <div className="flex-1 flex items-center gap-2">
            <MapPin size={20} strokeWidth={1.5} className="text-white" />
            <div>
              <p className="text-[10px] text-white font-semibold tracking-wider">LOCATION</p>
              <p className="text-[13px] text-white/70">{state.location}</p>
            </div>
          </div>
          <div className="w-px h-10 bg-white/30" />
          <div className="flex-1 flex items-center gap-2 pl-3">
            <Calendar size={20} strokeWidth={1.5} className="text-white" />
            <div className="flex-1">
              <p className="text-[10px] text-white font-semibold tracking-wider">DATES</p>
              <p className="text-[13px] text-white/70">{state.dateFilter}</p>
            </div>
          </div>
          <ChevronDown size={20} className="text-white" />
        </div>

        {/* Search Box */}
        <button
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'search' })}
          className="w-full bg-white rounded-xl px-4 py-3 flex items-center mb-3"
        >
          <div className="flex-1 text-left">
            <p className="text-[10px] text-gray-500 font-bold tracking-wider">SEARCH</p>
            <p className="text-[15px] text-gray-400">Artist, Event or Venue</p>
          </div>
          <Search size={24} className="text-[#006DFF]" strokeWidth={2} />
        </button>

        {/* Category Buttons */}
        <div className="flex gap-2 mb-1 overflow-x-auto no-scrollbar">
          {categories.map((cat, i) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(i)}
              className={`px-5 py-2.5 rounded-xl text-[14px] font-medium whitespace-nowrap border transition-colors
                ${i === activeCategory
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-white border-white/60'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Featured Banner */}
        <div className="relative w-full h-[340px]">
          <img src={featuredEvents[activeCategory]?.image || featuredEvents[0].image}
            alt="Featured" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-4">
            <p className="text-white text-[26px] font-bold mb-3">
              {featuredEvents[activeCategory]?.title || featuredEvents[0].title}
            </p>
            <button className="bg-[#006DFF] text-white px-6 py-3 rounded-xl text-[15px] font-semibold">
              Find Tickets
            </button>
          </div>
        </div>

        {/* Trending Events Section */}
        <div className="bg-white px-4 pt-5 pb-4">
          <h3 className="text-[18px] font-bold text-black mb-3">Trending Events</h3>
          {trendingEvents.map(event => (
            <div key={event.id} className="mb-4 last:mb-0">
              <div className="relative rounded-xl overflow-hidden">
                <img src={event.image} alt={event.title} className="w-full h-[180px] object-cover" />
                <div className="absolute top-3 left-3 bg-white/90 px-2 py-1 rounded-md">
                  <p className="text-[11px] font-semibold text-black">{event.price}</p>
                </div>
              </div>
              <div className="mt-2">
                <p className="text-[15px] font-semibold text-black">{event.title}</p>
                <p className="text-[13px] text-gray-500">{event.date}</p>
                <p className="text-[13px] text-gray-500">{event.venue}</p>
              </div>
            </div>
          ))}
        </div>

        {/* More Events */}
        <div className="bg-white px-4 pb-6">
          <h3 className="text-[18px] font-bold text-black mb-3">Recommended for You</h3>
          {trendingEvents.slice().reverse().map(event => (
            <div key={`rec-${event.id}`} className="flex gap-3 mb-4 last:mb-0">
              <img src={event.image} alt={event.title} className="w-20 h-20 rounded-xl object-cover" />
              <div className="flex-1 flex flex-col justify-center">
                <p className="text-[14px] font-semibold text-black">{event.title}</p>
                <p className="text-[12px] text-gray-500">{event.date}</p>
                <p className="text-[12px] text-gray-500">{event.venue}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Country Picker Modal */}
      {showCountryPicker && (
        <div className="absolute inset-0 z-[60] flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCountryPicker(false)} />
          <div className="relative bg-white rounded-t-3xl animate-slide-up max-h-[70%] flex flex-col">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            <h3 className="text-center text-[18px] font-bold text-black pb-3">Change Location</h3>
            <div className="flex-1 overflow-y-auto no-scrollbar px-4 pb-6">
              {['United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 'Netherlands', 'Japan', 'Mexico', 'Brazil'].map(c => (
                <button key={c}
                  onClick={() => { dispatch({ type: 'SET_COUNTRY', country: c }); setShowCountryPicker(false); }}
                  className="w-full flex items-center gap-3 py-3.5 border-b border-gray-100">
                  <span className="text-2xl">
                    {c === 'United States' && '🇺🇸'}
                    {c === 'Canada' && '🇨🇦'}
                    {c === 'United Kingdom' && '🇬🇧'}
                    {c === 'Australia' && '🇦🇺'}
                    {c === 'Germany' && '🇩🇪'}
                    {c === 'France' && '🇫🇷'}
                    {c === 'Spain' && '🇪🇸'}
                    {c === 'Italy' && '🇮🇹'}
                    {c === 'Netherlands' && '🇳🇱'}
                    {c === 'Japan' && '🇯🇵'}
                    {c === 'Mexico' && '🇲🇽'}
                    {c === 'Brazil' && '🇧🇷'}
                  </span>
                  <span className="flex-1 text-left text-[16px] text-black">{c}</span>
                  {state.country === c && <Check size={20} className="text-[#006DFF]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── FOR YOU SCREEN (TICKET EDITOR) ─────────────────────────────────
function ForYouScreen() {
  const { state, dispatch } = useApp();
  const [editingEvent, setEditingEvent] = useState<EventData | null>(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [bannerPreview, setBannerPreview] = useState('');

  const emptyEvent: EventData = {
    id: '', artistName: '', tourName: '', date: '', time: '',
    venue: '', city: '', state: '', bannerImage: '', ticketImage: '',
    orderNumber: '', purchaseDate: '', tickets: [],
  };

  const [formData, setFormData] = useState<EventData>(emptyEvent);

  const resetForm = () => {
    setFormData(emptyEvent);
    setBannerPreview('');
    setEditingEvent(null);
  };

  const handleNewEvent = () => {
    resetForm();
    setShowForm(true);
  };

  const handleEditEvent = (event: EventData) => {
    setEditingEvent(event);
    setFormData({ ...event });
    setBannerPreview(event.bannerImage);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formData.artistName || !formData.tourName) return;
    if (editingEvent) {
      dispatch({ type: 'UPDATE_EVENT', eventId: editingEvent.id, event: formData });
    } else {
      const newEvent = { ...formData, id: Date.now().toString(), bannerImage: bannerPreview || '/benson-boone.jpg', ticketImage: bannerPreview || '/benson-boone.jpg' };
      if (newEvent.tickets.length === 0) {
        newEvent.tickets = [{ id: `t${Date.now()}`, eventId: newEvent.id, section: 'A1', row: '1', seat: '1', type: 'General Admission', entry: 'Main Entrance', barcode: Math.random().toString().slice(2, 14) }];
      }
      dispatch({ type: 'ADD_EVENT', event: newEvent });
    }
    setShowForm(false);
    resetForm();
  };

  const handleDelete = (eventId: string) => {
    dispatch({ type: 'DELETE_EVENT', eventId });
  };

  const handleDuplicate = (event: EventData) => {
    const dup = { ...event, id: Date.now().toString(), tourName: `${event.tourName} (Copy)`, tickets: event.tickets.map(t => ({ ...t, id: `t${Date.now()}${Math.random()}`, eventId: Date.now().toString() })) };
    dispatch({ type: 'ADD_EVENT', event: dup });
  };

  const addTicket = () => {
    const newTicket: TicketData = {
      id: `t${Date.now()}`, eventId: formData.id,
      section: 'A1', row: '1', seat: `${formData.tickets.length + 1}`,
      type: 'General Admission', entry: 'Main Entrance',
      barcode: Math.random().toString().slice(2, 14),
    };
    setFormData({ ...formData, tickets: [...formData.tickets, newTicket] });
  };

  const updateTicket = (index: number, field: keyof TicketData, value: string) => {
    const updated = formData.tickets.map((t, i) => i === index ? { ...t, [field]: value } : t);
    setFormData({ ...formData, tickets: updated });
  };

  const removeTicket = (index: number) => {
    setFormData({ ...formData, tickets: formData.tickets.filter((_, i) => i !== index) });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setBannerPreview(result);
        setFormData({ ...formData, bannerImage: result, ticketImage: result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F2F2F7]">
      {/* Header */}
      <div className="shrink-0 bg-[#111111] px-4 pt-3 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-white text-[18px] font-bold">For You</h2>
          <button onClick={handleNewEvent} className="bg-[#006DFF] text-white px-4 py-2 rounded-lg text-[13px] font-semibold flex items-center gap-1">
            <Plus size={16} /> New Event
          </button>
        </div>
        <p className="text-white/60 text-[13px] mt-1">Create and manage your tickets</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-4">
        {state.events.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Heart size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-[15px]">No events yet</p>
            <p className="text-gray-400 text-[13px]">Tap "New Event" to create your first ticket</p>
          </div>
        ) : (
          state.events.map(event => (
            <div key={event.id} className="bg-white rounded-xl overflow-hidden mb-3 shadow-sm">
              <img src={event.bannerImage} alt={event.tourName} className="w-full h-40 object-cover" />
              <div className="p-3">
                <p className="text-[10px] text-gray-500 uppercase tracking-wider">{event.date} • {event.time}</p>
                <p className="text-[15px] font-bold text-black mt-0.5">{event.tourName}</p>
                <p className="text-[13px] text-gray-500">{event.venue} - {event.city}, {event.state}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Ticket size={14} className="text-gray-400" />
                  <p className="text-[12px] text-gray-500">x{event.tickets.length} Ticket{event.tickets.length !== 1 ? 's' : ''}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button onClick={() => handleEditEvent(event)} className="flex-1 bg-[#006DFF] text-white py-2.5 rounded-lg text-[13px] font-semibold">
                    Edit
                  </button>
                  <button onClick={() => handleDuplicate(event)} className="px-3 py-2.5 bg-gray-100 rounded-lg">
                    <Copy size={18} className="text-gray-600" />
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="px-3 py-2.5 bg-red-50 rounded-lg">
                    <Trash2 size={18} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="absolute inset-0 z-[60] bg-white flex flex-col">
          <div className="shrink-0 bg-[#111111] px-4 py-3 flex items-center justify-between">
            <button onClick={() => { setShowForm(false); resetForm(); }} className="text-white text-[15px]">Cancel</button>
            <h3 className="text-white text-[16px] font-semibold">{editingEvent ? 'Edit Event' : 'New Event'}</h3>
            <button onClick={handleSave} className="text-[#006DFF] text-[15px] font-semibold">Save</button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar p-4">
            {/* Banner Image Upload */}
            <div className="mb-4">
              <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
              <button onClick={() => fileInputRef.current?.click()}
                className="w-full h-40 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden">
                {bannerPreview ? (
                  <img src={bannerPreview} alt="Banner" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Plus size={32} className="text-gray-400 mb-1" />
                    <p className="text-[13px] text-gray-500">Tap to upload event banner</p>
                  </>
                )}
              </button>
            </div>

            {/* Form Fields */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Artist Name</label>
                <input value={formData.artistName} onChange={e => setFormData({ ...formData, artistName: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 bg-gray-100 rounded-lg text-[15px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" placeholder="Enter artist name" />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Tour / Event Name</label>
                <input value={formData.tourName} onChange={e => setFormData({ ...formData, tourName: e.target.value })}
                  className="w-full mt-1 px-3 py-2.5 bg-gray-100 rounded-lg text-[15px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" placeholder="Enter tour or event name" />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Date</label>
                  <input value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-gray-100 rounded-lg text-[15px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" placeholder="e.g. SUN • AUG 23, 2026" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Time</label>
                  <input value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-gray-100 rounded-lg text-[15px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" placeholder="e.g. 8:00 PM" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Venue</label>
                  <input value={formData.venue} onChange={e => setFormData({ ...formData, venue: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-gray-100 rounded-lg text-[15px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" placeholder="Venue name" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">City</label>
                  <input value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-gray-100 rounded-lg text-[15px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" placeholder="City" />
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">State/Province</label>
                  <input value={formData.state} onChange={e => setFormData({ ...formData, state: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-gray-100 rounded-lg text-[15px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" placeholder="State" />
                </div>
                <div className="flex-1">
                  <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Order #</label>
                  <input value={formData.orderNumber} onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                    className="w-full mt-1 px-3 py-2.5 bg-gray-100 rounded-lg text-[15px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" placeholder="Order number" />
                </div>
              </div>

              {/* Tickets Section */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[14px] font-bold text-black">Tickets ({formData.tickets.length})</h4>
                  <button onClick={addTicket} className="text-[#006DFF] text-[13px] font-semibold flex items-center gap-1">
                    <Plus size={16} /> Add Ticket
                  </button>
                </div>

                {formData.tickets.map((ticket, idx) => (
                  <div key={ticket.id} className="bg-gray-50 rounded-xl p-3 mb-3">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[12px] font-semibold text-gray-500">TICKET #{idx + 1}</p>
                      {formData.tickets.length > 1 && (
                        <button onClick={() => removeTicket(idx)} className="text-red-500">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase">Section</label>
                        <input value={ticket.section} onChange={e => updateTicket(idx, 'section', e.target.value)}
                          className="w-full px-2 py-2 bg-white rounded-lg text-[14px] text-black outline-none border border-gray-200" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase">Row</label>
                        <input value={ticket.row} onChange={e => updateTicket(idx, 'row', e.target.value)}
                          className="w-full px-2 py-2 bg-white rounded-lg text-[14px] text-black outline-none border border-gray-200" />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-500 uppercase">Seat</label>
                        <input value={ticket.seat} onChange={e => updateTicket(idx, 'seat', e.target.value)}
                          className="w-full px-2 py-2 bg-white rounded-lg text-[14px] text-black outline-none border border-gray-200" />
                      </div>
                    </div>
                    <div className="mb-2">
                      <label className="text-[10px] text-gray-500 uppercase">Ticket Type</label>
                      <input value={ticket.type} onChange={e => updateTicket(idx, 'type', e.target.value)}
                        className="w-full px-2 py-2 bg-white rounded-lg text-[14px] text-black outline-none border border-gray-200" />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-500 uppercase">Entry Info</label>
                      <input value={ticket.entry} onChange={e => updateTicket(idx, 'entry', e.target.value)}
                        className="w-full px-2 py-2 bg-white rounded-lg text-[14px] text-black outline-none border border-gray-200" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MY TICKETS SCREEN ───────────────────────────────────────────────
function MyTicketsScreen() {
  const { state, dispatch } = useApp();
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = state.events;
  const past: EventData[] = [];

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="shrink-0 bg-[#111111] px-4 pt-3 pb-0">
        <div className="flex items-center justify-between mb-3">
          <div className="w-10" />
          <h2 className="text-white text-[18px] font-bold">My Events</h2>
          <button className="text-white text-[14px] font-medium">Help</button>
        </div>

        {/* Tabs */}
        <div className="flex">
          <button onClick={() => setTab('upcoming')}
            className={`flex-1 py-3 text-center text-[13px] font-semibold tracking-wider border-b-2 transition-colors
              ${tab === 'upcoming' ? 'text-white border-white' : 'text-white/50 border-transparent'}`}>
            UPCOMING ({upcoming.length})
          </button>
          <button onClick={() => setTab('past')}
            className={`flex-1 py-3 text-center text-[13px] font-semibold tracking-wider border-b-2 transition-colors
              ${tab === 'past' ? 'text-white border-white' : 'text-white/50 border-transparent'}`}>
            PAST ({past.length})
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {tab === 'upcoming' ? (
          upcoming.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-8">
              <Ticket size={48} className="text-gray-300 mb-3" />
              <p className="text-gray-500 text-[15px]">No upcoming events</p>
              <p className="text-gray-400 text-[13px] mt-1">Create tickets in the For You tab</p>
            </div>
          ) : (
            upcoming.map(event => (
              <button key={event.id}
                onClick={() => { dispatch({ type: 'SELECT_EVENT', eventId: event.id }); dispatch({ type: 'NAVIGATE', screen: 'eventDetails' }); }}
                className="w-full text-left">
                <div className="mx-4 mt-4 rounded-lg overflow-hidden shadow-md">
                  <img src={event.bannerImage} alt={event.tourName} className="w-full h-[280px] object-cover" />
                  <div className="bg-[#262628] p-5">
                    <p className="text-[12px] text-white/70 uppercase tracking-wider">{event.date} • {event.time}</p>
                    <p className="text-[22px] font-bold text-white mt-1 leading-tight">{event.tourName}</p>
                    <div className="w-full h-px bg-white/20 my-3" />
                    <p className="text-[14px] text-white/80">{event.venue} - {event.city}, {event.state}</p>
                  </div>
                </div>
              </button>
            ))
          )
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <Clock size={48} className="text-gray-300 mb-3" />
            <p className="text-gray-500 text-[15px]">No past events</p>
          </div>
        )}
        <div className="h-8" />
      </div>
    </div>
  );
}

// ─── EVENT DETAILS SCREEN ────────────────────────────────────────────
function EventDetailsScreen() {
  const { state, dispatch } = useApp();
  const event = state.events.find(e => e.id === state.selectedEventId);
  const [activeDetailTab, setActiveDetailTab] = useState<'tickets' | 'extras'>('tickets');

  if (!event) return null;

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Banner */}
        <div className="relative">
          <img src={event.bannerImage} alt={event.tourName} className="w-full h-[320px] object-cover" />
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
            <button onClick={() => dispatch({ type: 'GO_BACK' })}
              className="w-9 h-9 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center">
              <ArrowLeft size={20} className="text-white" />
            </button>
            <button className="text-white text-[14px] font-medium">Help</button>
          </div>
        </div>

        {/* Event Info Card */}
        <div className="mx-4 -mt-16 relative z-10 bg-[#262628] rounded-xl p-5">
          <p className="text-[12px] text-white/70 uppercase tracking-wider">{event.date} • {event.time}</p>
          <p className="text-[20px] font-bold text-white mt-1 leading-tight">{event.tourName}</p>
          <p className="text-[14px] text-white/70 mt-2">{event.venue} - {event.city}, {event.state}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1.5">
              <Ticket size={18} className="text-white/70" />
              <span className="text-white text-[14px]">x{event.tickets.length}</span>
            </div>
          </div>

          {/* View Tickets Button */}
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'ticketView' })}
            className="w-full mt-4 bg-[#006DFF] text-white py-4 rounded-xl text-[16px] font-bold flex items-center justify-center gap-2"
          >
            <Barcode size={22} />
            View Tickets
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mt-5 border-b border-gray-200">
          <button onClick={() => setActiveDetailTab('tickets')}
            className={`flex-1 py-3 text-center text-[14px] font-semibold border-b-2 transition-colors
              ${activeDetailTab === 'tickets' ? 'text-black border-black' : 'text-gray-400 border-transparent'}`}>
            Tickets
          </button>
          <button onClick={() => setActiveDetailTab('extras')}
            className={`flex-1 py-3 text-center text-[14px] font-semibold border-b-2 transition-colors
              ${activeDetailTab === 'extras' ? 'text-black border-black' : 'text-gray-400 border-transparent'}`}>
            Extras
          </button>
        </div>

        {/* Order Info */}
        <div className="px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[16px] font-bold text-black">Order #{event.orderNumber}</p>
              <p className="text-[13px] text-gray-500">x{event.tickets.length} Ticket{event.tickets.length !== 1 ? 's' : ''}</p>
            </div>
            <button className="p-2">
              <MoreVertical size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Ticket Info Cards */}
          {event.tickets.map((ticket, idx) => (
            <div key={ticket.id} className="bg-[#F2F2F7] rounded-xl p-4 mb-3">
              <p className="text-[11px] text-gray-500 uppercase tracking-wider font-medium mb-3">TICKET {idx + 1}</p>
              <div className="grid grid-cols-3 gap-4 mb-3">
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Section</p>
                  <p className="text-[18px] font-bold text-black">{ticket.section}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Row</p>
                  <p className="text-[18px] font-bold text-black">{ticket.row}</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-gray-500 uppercase">Seat</p>
                  <p className="text-[18px] font-bold text-black">{ticket.seat}</p>
                </div>
              </div>
              <div className="h-px bg-gray-300 my-2" />
              <p className="text-[13px] text-gray-600">{ticket.type}</p>
              <p className="text-[12px] text-gray-500">{ticket.entry}</p>
            </div>
          ))}

          {/* Transfer Info */}
          {state.transferHistory.filter(t => t.eventId === event.id).length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <p className="text-[13px] text-[#006DFF] font-medium">
                Transfer Pending: {state.transferHistory.filter(t => t.eventId === event.id)[0]?.firstName} {state.transferHistory.filter(t => t.eventId === event.id)[0]?.lastName}
              </p>
            </div>
          )}
        </div>

        {/* More Options */}
        <div className="px-4 pb-4">
          <h4 className="text-[13px] font-bold text-black uppercase tracking-wider mb-3">More Options</h4>

          {/* Map Placeholder */}
          <div className="w-full h-[200px] bg-[#E5E5EA] rounded-xl overflow-hidden relative mb-3">
            <iframe
              title="Venue Map"
              width="100%"
              height="100%"
              frameBorder="0"
              scrolling="no"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=-79.39%2C43.64%2C-79.37%2C43.66&layer=mapnik&marker=43.65%2C-79.38`}
              style={{ filter: 'grayscale(0.2)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="bg-[#006DFF] text-white px-3 py-1.5 rounded-lg text-[12px] font-semibold shadow-lg">
                {event.venue}
              </div>
            </div>
          </div>

          <button
            onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.venue + ' ' + event.city + ' ' + event.state)}`, '_blank')}
            className="w-full bg-[#F2F2F7] text-black py-3.5 rounded-xl text-[15px] font-semibold mb-3 flex items-center justify-center gap-2"
          >
            <Navigation size={18} />
            Get Directions
          </button>

          {/* Share Card */}
          <div className="bg-gradient-to-br from-[#006DFF] to-[#0051FF] rounded-xl p-5 mb-3">
            <div className="flex items-center gap-4">
              <img src={event.bannerImage} alt="" className="w-16 h-16 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-white text-[14px] font-bold">{event.tourName}</p>
                <p className="text-white/80 text-[12px]">{event.venue}</p>
                <p className="text-white/80 text-[12px]">{event.date}</p>
              </div>
            </div>
            <p className="text-white text-[20px] font-black mt-3 tracking-tight">YOU GOT TICKETS!</p>
          </div>

          <button className="w-full bg-[#F2F2F7] text-black py-3.5 rounded-xl text-[15px] font-semibold mb-6 flex items-center justify-center gap-2">
            <Share2 size={18} />
            Share You're Going
          </button>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="shrink-0 bg-white border-t border-gray-200 px-4 py-3">
        <div className="flex items-center justify-around">
          <button className="flex flex-col items-center gap-1 opacity-40">
            <Tag size={22} className="text-gray-500" />
            <span className="text-[11px] text-gray-500">Upgrade</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'NAVIGATE', screen: 'transfer' })}
            className="flex flex-col items-center gap-1"
          >
            <Share2 size={22} className="text-[#006DFF]" />
            <span className="text-[11px] text-[#006DFF] font-medium">Transfer</span>
          </button>
          <button
            onClick={() => dispatch({ type: 'SET_TAB', tab: 'sell' })}
            className="flex flex-col items-center gap-1 opacity-40"
          >
            <Banknote size={22} className="text-gray-500" />
            <span className="text-[11px] text-gray-500">Sell</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TICKET VIEW SCREEN ──────────────────────────────────────────────
function TicketViewScreen() {
  const { state, dispatch } = useApp();
  const event = state.events.find(e => e.id === state.selectedEventId);
  const ticket = event?.tickets[state.selectedTicketIndex];

  if (!event || !ticket) return null;

  return (
    <div className="h-full flex flex-col bg-[#111111]">
      {/* Header */}
      <div className="shrink-0 flex items-center justify-between px-4 py-3">
        <button onClick={() => dispatch({ type: 'GO_BACK' })} className="text-white text-[15px] flex items-center gap-1">
          <ChevronLeft size={20} /> Back
        </button>
        <p className="text-white text-[14px] font-medium">Ticket {state.selectedTicketIndex + 1} of {event.tickets.length}</p>
        <button className="text-white text-[14px]">Help</button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4">
        {/* Event Info */}
        <div className="mb-4">
          <p className="text-[12px] text-white/60 uppercase">{event.date} • {event.time}</p>
          <p className="text-[18px] font-bold text-white mt-0.5">{event.tourName}</p>
          <p className="text-[13px] text-white/60">{event.venue}</p>
        </div>

        {/* Ticket Card */}
        <div className="bg-white rounded-2xl overflow-hidden mb-4">
          {/* Ticket Image */}
          <img src={event.ticketImage} alt="Ticket" className="w-full h-[160px] object-cover" />

          {/* Ticket Details */}
          <div className="p-4">
            <p className="text-[10px] text-gray-500 uppercase tracking-wider mb-2">{ticket.type}</p>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase">Section</p>
                <p className="text-[22px] font-bold text-black">{ticket.section}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase">Row</p>
                <p className="text-[22px] font-bold text-black">{ticket.row}</p>
              </div>
              <div className="text-center">
                <p className="text-[10px] text-gray-500 uppercase">Seat</p>
                <p className="text-[22px] font-bold text-black">{ticket.seat}</p>
              </div>
            </div>
            <p className="text-[12px] text-gray-500 text-center">{ticket.entry}</p>
          </div>

          {/* Divider */}
          <div className="relative h-4">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t-2 border-dashed border-gray-200" />
            <div className="absolute left-0 top-0 w-4 h-4 bg-[#111111] rounded-full -translate-x-1/2" />
            <div className="absolute right-0 top-0 w-4 h-4 bg-[#111111] rounded-full translate-x-1/2" />
          </div>

          {/* Barcode Section */}
          <div className="p-4 relative overflow-hidden">
            {/* Animated Scan Line */}
            <div className="absolute left-0 right-0 h-0.5 bg-[#006DFF] scan-line z-10 opacity-70" />

            {/* Side indicators */}
            <div className="absolute left-2 top-4 bottom-4 w-1 bg-gradient-to-b from-green-400 via-[#006DFF] to-green-400 rounded-full animate-pulse" />
            <div className="absolute right-2 top-4 bottom-4 w-1 bg-gradient-to-b from-green-400 via-[#006DFF] to-green-400 rounded-full animate-pulse" />

            <div className="flex flex-col items-center py-4">
              {/* QR Code */}
              <div className="w-48 h-48 bg-white p-2 rounded-lg mb-3">
                <QrCodeDisplay value={ticket.barcode} />
              </div>
              {/* Barcode */}
              <div className="w-full px-8">
                <BarcodeDisplay value={ticket.barcode} />
              </div>
              <p className="text-[12px] text-gray-500 mt-2 font-mono">{ticket.barcode}</p>
            </div>
          </div>
        </div>

        {/* Navigation between tickets */}
        {event.tickets.length > 1 && (
          <div className="flex gap-3 mb-4">
            {state.selectedTicketIndex > 0 && (
              <button
                onClick={() => dispatch({ type: 'SELECT_TICKET', index: state.selectedTicketIndex - 1 })}
                className="flex-1 bg-white/10 text-white py-3 rounded-xl text-[14px] font-medium"
              >
                ← Previous Ticket
              </button>
            )}
            {state.selectedTicketIndex < event.tickets.length - 1 && (
              <button
                onClick={() => dispatch({ type: 'SELECT_TICKET', index: state.selectedTicketIndex + 1 })}
                className="flex-1 bg-[#006DFF] text-white py-3 rounded-xl text-[14px] font-medium"
              >
                Next Ticket →
              </button>
            )}
          </div>
        )}

        {/* Add to Wallet */}
        <button className="w-full bg-white text-black py-4 rounded-xl text-[15px] font-semibold mb-4 flex items-center justify-center gap-2">
          <Wallet size={20} />
          Add to Apple Wallet
        </button>
      </div>
    </div>
  );
}

// ─── QR CODE DISPLAY ─────────────────────────────────────────────────
function QrCodeDisplay({ value }: { value: string }) {
  // Generate a deterministic pattern from the barcode value
  const pattern = Array.from(value).map(c => c.charCodeAt(0));
  const cells = 25;
  const cellSize = 192 / cells;

  return (
    <svg viewBox={`0 0 ${cells * cellSize} ${cells * cellSize}`} className="w-full h-full">
      <rect width="100%" height="100%" fill="white" />
      {Array.from({ length: cells }, (_, row) =>
        Array.from({ length: cells }, (_, col) => {
          const idx = (row * cells + col) % pattern.length;
          const isDark = pattern[idx] % 2 === (row % 2 === col % 2 ? 0 : 1);
          // Finder patterns (corners)
          const isFinder =
            (row < 7 && col < 7) ||
            (row < 7 && col >= cells - 7) ||
            (row >= cells - 7 && col < 7);
          const inFinder = isFinder && (
            (row === 0 || row === 6 || col === 0 || col === 6) ||
            (row >= 2 && row <= 4 && col >= 2 && col <= 4)
          );
          const show = inFinder || (isDark && !isFinder);
          return show ? (
            <rect
              key={`${row}-${col}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill="black"
            />
          ) : null;
        })
      )}
    </svg>
  );
}

// ─── BARCODE DISPLAY ─────────────────────────────────────────────────
function BarcodeDisplay({ value }: { value: string }) {
  const bars = Array.from(value).map((c, i) => {
    const code = c.charCodeAt(0);
    return (
      <div key={i} className="flex">
        <div style={{ width: `${(code % 3) + 2}px` }} className="bg-black h-10" />
        <div style={{ width: `${(code % 2) + 1}px` }} className="bg-white h-10" />
      </div>
    );
  });

  return (
    <div className="flex justify-center items-end gap-0">
      {bars}
    </div>
  );
}

// ─── TRANSFER SCREEN ─────────────────────────────────────────────────
function TransferScreen() {
  const { state, dispatch } = useApp();
  const event = state.events.find(e => e.id === state.selectedEventId);
  const ticket = event?.tickets[state.selectedTicketIndex];
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [note, setNote] = useState('');
  const [useMobile, setUseMobile] = useState(false);

  if (!event || !ticket) return null;

  const handleTransfer = () => {
    const transfer = {
      eventId: event.id,
      ticketId: ticket.id,
      firstName,
      lastName,
      email: useMobile ? mobile : email,
      note,
      status: 'pending',
      date: new Date().toISOString(),
    };
    dispatch({ type: 'ADD_TRANSFER', transfer: transfer });
    dispatch({ type: 'GO_BACK' });
  };

  const canSubmit = firstName && lastName && (useMobile ? mobile : email);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header with Event Image */}
      <div className="relative">
        <img src={event.bannerImage} alt="" className="w-full h-[140px] object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <button onClick={() => dispatch({ type: 'GO_BACK' })} className="text-white flex items-center gap-1">
            <ArrowLeft size={20} />
          </button>
          <button className="text-white text-[14px]">Help</button>
        </div>
        <div className="absolute bottom-3 left-4">
          <p className="text-[11px] text-white/80">{event.date} • {event.time}</p>
          <p className="text-[14px] font-bold text-white">{event.tourName}</p>
        </div>
      </div>

      {/* Transfer Form */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-5">
        <div className="text-center mb-5">
          <h3 className="text-[18px] font-bold text-black">TRANSFER TICKETS</h3>
          <p className="text-[14px] text-gray-500 mt-1">1 Ticket Selected</p>
          <p className="text-[13px] text-gray-500">Section <span className="font-bold text-black">{ticket.section}</span>, Row <span className="font-bold text-black">{ticket.row}</span>, Seat <span className="font-bold text-black">{ticket.seat}</span></p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[14px] text-black">First Name<span className="text-red-500">*</span></label>
            <input value={firstName} onChange={e => setFirstName(e.target.value)}
              className="w-full mt-1 px-3 py-3 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-[#006DFF]"
              placeholder="Enter First Name" />
          </div>
          <div>
            <label className="text-[14px] text-black">Last Name<span className="text-red-500">*</span></label>
            <input value={lastName} onChange={e => setLastName(e.target.value)}
              className="w-full mt-1 px-3 py-3 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-[#006DFF]"
              placeholder="Enter Last Name" />
          </div>

          {useMobile ? (
            <div>
              <label className="text-[14px] text-black">Mobile Number<span className="text-red-500">*</span></label>
              <input value={mobile} onChange={e => setMobile(e.target.value)}
                className="w-full mt-1 px-3 py-3 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-[#006DFF]"
                placeholder="Enter Mobile Number" type="tel" />
              <button onClick={() => setUseMobile(false)} className="text-[#006DFF] text-[13px] mt-2 underline">Use Email Instead</button>
            </div>
          ) : (
            <div>
              <label className="text-[14px] text-black">Email<span className="text-red-500">*</span></label>
              <input value={email} onChange={e => setEmail(e.target.value)}
                className="w-full mt-1 px-3 py-3 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-[#006DFF]"
                placeholder="Enter Email Address" type="email" />
              <button onClick={() => setUseMobile(true)} className="text-[#006DFF] text-[13px] mt-2 underline">Use Mobile Number Instead</button>
            </div>
          )}

          <div>
            <label className="text-[14px] text-black">Note</label>
            <textarea value={note} onChange={e => setNote(e.target.value)}
              className="w-full mt-1 px-3 py-3 border border-gray-300 rounded-lg text-[16px] text-black outline-none focus:border-[#006DFF] resize-none h-24"
              placeholder="Add an optional note..." />
          </div>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="shrink-0 p-4 bg-white border-t border-gray-100">
        <button
          onClick={handleTransfer}
          disabled={!canSubmit}
          className={`w-full py-4 rounded-xl text-[16px] font-bold transition-colors
            ${canSubmit ? 'bg-[#006DFF] text-white' : 'bg-gray-200 text-gray-400'}`}
        >
          Forward 1 Ticket
        </button>
      </div>
    </div>
  );
}

// ─── SELL SCREEN ─────────────────────────────────────────────────────
function SellScreen() {
  const [page] = useState(0);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Hero Section */}
      <div className="shrink-0 bg-[#111111] px-4 pt-4 pb-6">
        <div className="flex flex-col items-center text-center">
          <img src="/sell-illustration.png" alt="Sell" className="w-40 h-40 object-contain mb-4" />
          <h2 className="text-white text-[22px] font-black tracking-wider mb-2">SELL TICKETS</h2>
          <p className="text-white/60 text-[14px] max-w-[280px] leading-relaxed">
            Plans changed? Get access to millions of fans, sell your tickets safely and securely.
          </p>
          <div className="flex gap-2 mt-4 mb-5">
            <div className={`w-2 h-2 rounded-full ${page === 0 ? 'bg-white' : 'bg-white/30'}`} />
            <div className={`w-2 h-2 rounded-full ${page === 1 ? 'bg-white' : 'bg-white/30'}`} />
          </div>
          <button className="border border-white text-white px-8 py-3 rounded-xl text-[14px] font-semibold mb-3">
            Learn How It Works
          </button>
          <button className="w-full bg-[#006DFF] text-white py-4 rounded-xl text-[16px] font-bold">
            Sell Your Tickets
          </button>
        </div>
      </div>

      {/* Management Section */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="py-2">
          {[
            { icon: <Tag size={22} className="text-gray-600" />, label: "Tickets I'm Selling", count: 0 },
            { icon: <Check size={22} className="text-gray-600" />, label: "Sold Tickets", count: 0 },
            { icon: <Clock size={22} className="text-gray-600" />, label: "Expired Tickets", count: 0 },
          ].map((item, i) => (
            <button key={i} className="w-full flex items-center gap-4 px-4 py-4 border-b border-gray-100 text-left">
              {item.icon}
              <span className="flex-1 text-[16px] text-black">{item.label}</span>
              <ChevronRight size={20} className="text-gray-400" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── ACCOUNT SCREEN ──────────────────────────────────────────────────
function AccountScreen() {
  const { state, dispatch } = useApp();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editName, setEditName] = useState(state.user.name);
  const [editEmail, setEditEmail] = useState(state.user.email);
  const [editPhone, setEditPhone] = useState(state.user.phone);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProfile = () => {
    dispatch({ type: 'UPDATE_USER', user: { name: editName, email: editEmail, phone: editPhone } });
    setShowEditProfile(false);
  };

  return (
    <div className="h-full flex flex-col bg-[#F2F2F7]">
      {/* Header */}
      <div className="shrink-0 bg-[#111111] px-4 pt-3 pb-6">
        <h2 className="text-white text-[18px] font-bold text-center mb-4">Account</h2>
        <div className="flex items-center gap-3">
          <button onClick={() => fileInputRef.current?.click()} className="relative">
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onloadend = () => dispatch({ type: 'UPDATE_USER', user: { photo: reader.result as string } });
                  reader.readAsDataURL(file);
                }
              }} />
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
              {state.user.photo ? (
                <img src={state.user.photo} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={28} className="text-white/70" />
              )}
            </div>
          </button>
          <div>
            <p className="text-white text-[20px] font-bold">{state.user.name}</p>
            <p className="text-white/60 text-[14px]">{state.user.email}</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        {/* Notifications */}
        <div className="bg-white mt-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-[16px] font-bold text-black">Notifications</h3>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 text-left">
            <Mail size={22} className="text-gray-600" />
            <span className="flex-1 text-[16px] text-black">My Notifications</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Bell size={22} className="text-gray-600" />
            <span className="flex-1 text-[16px] text-black">Receive Notifications?</span>
            <input type="checkbox" checked={state.notifications}
              onChange={() => dispatch({ type: 'TOGGLE_NOTIFICATIONS' })}
              className="ios-switch" />
          </div>
        </div>

        {/* Location Settings */}
        <div className="bg-white mt-4">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-[16px] font-bold text-black">Location Settings</h3>
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
            <MapPinned size={22} className="text-gray-600" />
            <span className="flex-1 text-[16px] text-black">My Location</span>
            <span className="text-[#006DFF] text-[14px]">{state.location}</span>
            <Edit2 size={16} className="text-[#006DFF] ml-1" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
            <span className="text-[20px]">🇺🇸</span>
            <span className="flex-1 text-[16px] text-black">My Country</span>
            <span className="text-[#006DFF] text-[14px]">{state.country}</span>
            <Edit2 size={16} className="text-[#006DFF] ml-1" />
          </div>
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Navigation size={22} className="text-gray-600" />
            <span className="flex-1 text-[16px] text-black">Location Based Content</span>
            <input type="checkbox" checked={state.locationBasedContent}
              onChange={() => dispatch({ type: 'TOGGLE_LOCATION_CONTENT' })}
              className="ios-switch" />
          </div>
        </div>

        {/* Preferences */}
        <div className="bg-white mt-4 mb-6">
          <div className="px-4 py-3 border-b border-gray-100">
            <h3 className="text-[16px] font-bold text-black">Preferences</h3>
          </div>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 text-left">
            <Heart size={22} className="text-gray-600" />
            <span className="flex-1 text-[16px] text-black">My Favourites</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button onClick={() => setShowEditProfile(true)}
            className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-100 text-left">
            <Edit2 size={22} className="text-gray-600" />
            <span className="flex-1 text-[16px] text-black">Edit Details</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3.5 text-left">
            <Shield size={22} className="text-gray-600" />
            <span className="flex-1 text-[16px] text-black">Security</span>
            <ChevronRight size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="absolute inset-0 z-[60] bg-white flex flex-col animate-fade-in">
          <div className="shrink-0 bg-[#111111] px-4 py-3 flex items-center justify-between">
            <button onClick={() => setShowEditProfile(false)} className="text-white text-[15px]">Cancel</button>
            <h3 className="text-white text-[16px] font-semibold">Edit Profile</h3>
            <button onClick={handleSaveProfile} className="text-[#006DFF] text-[15px] font-semibold">Save</button>
          </div>
          <div className="flex-1 p-4 space-y-4">
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Name</label>
              <input value={editName} onChange={e => setEditName(e.target.value)}
                className="w-full mt-1 px-3 py-3 bg-gray-100 rounded-lg text-[16px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Email</label>
              <input value={editEmail} onChange={e => setEditEmail(e.target.value)}
                className="w-full mt-1 px-3 py-3 bg-gray-100 rounded-lg text-[16px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" type="email" />
            </div>
            <div>
              <label className="text-[11px] text-gray-500 uppercase tracking-wider font-medium">Phone</label>
              <input value={editPhone} onChange={e => setEditPhone(e.target.value)}
                className="w-full mt-1 px-3 py-3 bg-gray-100 rounded-lg text-[16px] text-black outline-none focus:ring-2 focus:ring-[#006DFF]" type="tel" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── BOTTOM NAVIGATION ───────────────────────────────────────────────
function BottomNav() {
  const { state, dispatch } = useApp();

  const tabs = [
    { key: 'discover', label: 'Discover', icon: Search },
    { key: 'forYou', label: 'For You', icon: Heart },
    { key: 'myTickets', label: 'My Tickets', icon: Ticket },
    { key: 'sell', label: 'Sell', icon: Banknote },
    { key: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="shrink-0 h-16 bg-white border-t border-gray-200 z-50 flex items-center justify-around select-none">
      {tabs.map(t => {
        const isActive = state.activeTab === t.key;
        const Icon = t.icon;
        return (
          <button
            key={t.key}
            onClick={() => dispatch({ type: 'SET_TAB', tab: t.key })}
            className="flex flex-col items-center justify-center gap-0.5 w-16 h-full"
          >
            <Icon
              size={24}
              strokeWidth={isActive ? 2.5 : 1.5}
              className={isActive ? 'text-[#006DFF]' : 'text-gray-400'}
            />
            <span className={`text-[10px] ${isActive ? 'text-[#006DFF] font-semibold' : 'text-gray-400'}`}>
              {t.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

// ─── APP COMPONENT ───────────────────────────────────────────────────
function App() {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const renderScreen = () => {
    switch (state.screen) {
      case 'discover': return <DiscoverScreen />;
      case 'forYou': return <ForYouScreen />;
      case 'myTickets': return <MyTicketsScreen />;
      case 'eventDetails': return <EventDetailsScreen />;
      case 'ticketView': return <TicketViewScreen />;
      case 'transfer': return <TransferScreen />;
      case 'sell': return <SellScreen />;
      case 'account': return <AccountScreen />;
      default: return <DiscoverScreen />;
    }
  };

  const showNav = ['discover', 'forYou', 'myTickets', 'sell', 'account'].includes(state.screen);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      <div className="h-screen w-full bg-neutral-900 flex justify-center items-center p-0 md:p-4">
        <div className="w-full max-w-[430px] h-[100dvh] md:h-[850px] bg-white rounded-none overflow-hidden shadow-2xl relative isolate flex flex-col">
          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            {renderScreen()}
          </main>

          {/* Bottom Navigation */}
          {showNav && <BottomNav />}
        </div>
      </div>
    </AppContext.Provider>
  );
}

export default App;
