import { useState, useRef, useEffect } from 'react';
import { Plus, Edit2, Trash2, User, Camera, ChevronLeft, PlusCircle, MinusCircle, LayoutGrid, Pencil, Image, Eye, Lock, MessageCircle } from 'lucide-react';
import type { TicketGroup, Country, User as UserType, DiscoverSection } from '../types';

const NEW_DESIGN_PASSWORD = 'Yaseer234!!';
const WHATSAPP_NUMBER = '+2347066045578';

interface ForYouPageProps {
  ticketGroups: TicketGroup[];
  onAddTicket: (ticketGroup: TicketGroup) => void;
  onUpdateTicket: (id: string, updatedGroup: Partial<TicketGroup>) => void;
  onDeleteTicket: (id: string) => void;
  countries: Country[];
  currentCountry: Country;
  onCountryChange: (countryCode: string) => void;
  user: UserType;
  onUpdateUser: (user: Partial<UserType>) => void;
  t: (key: string) => string;
  discoverSections: DiscoverSection[];
  onAddDiscoverEvent: (sectionId: string, event: any) => void;
  onDeleteDiscoverEvent: (sectionId: string, eventId: string) => void;
  onAddDiscoverSection: (section: DiscoverSection) => void;
  onDeleteDiscoverSection: (sectionId: string) => void;
}

export function ForYouPage({
  ticketGroups, onAddTicket, onUpdateTicket, onDeleteTicket, countries, currentCountry, onCountryChange,
  user, onUpdateUser, t, discoverSections, onAddDiscoverEvent,
  onDeleteDiscoverEvent, onAddDiscoverSection, onDeleteDiscoverSection,
}: ForYouPageProps) {
  // Design mode state
  const [designMode, setDesignMode] = useState<'choose' | 'old' | 'new'>('choose');
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [showDiscoverEdit, setShowDiscoverEdit] = useState(false);
  const [editingGroup, setEditingGroup] = useState<TicketGroup | null>(null);
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showAddDiscoverEvent, setShowAddDiscoverEvent] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const discoverImageRef = useRef<HTMLInputElement>(null);

  // Check if design mode is already saved
  useEffect(() => {
    const savedMode = localStorage.getItem('ticketmaster_design_mode');
    if (savedMode === 'old' || savedMode === 'new') {
      setDesignMode(savedMode as 'old' | 'new');
    }
  }, []);

  // Ticket form state
  const [eventForm, setEventForm] = useState({
    eventName: '', artistName: '', venue: '', location: '', date: '', time: '',
    eventImage: '', ticketType: '', entryInfo: '', purchaseDate: '',
  });
  const [tickets, setTickets] = useState<Array<{ section: string; row: string; seat: string }>>([{ section: '', row: '', seat: '' }]);

  // Discover edit form state
  const [discoverForm, setDiscoverForm] = useState({
    title: '', subtitle: '', image: '', label: '', sublabel: '', actionLabel: '', category: 'concerts', genre: '',
  });
  const [newSectionForm, setNewSectionForm] = useState({ title: '', type: 'card' as const });

  const resetForm = () => {
    setEventForm({ eventName: '', artistName: '', venue: '', location: '', date: '', time: '', eventImage: '', ticketType: '', entryInfo: '', purchaseDate: '' });
    setTickets([{ section: '', row: '', seat: '' }]);
  };
  const resetDiscoverForm = () => {
    setDiscoverForm({ title: '', subtitle: '', image: '', label: '', sublabel: '', actionLabel: '', category: 'concerts', genre: '' });
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === NEW_DESIGN_PASSWORD) {
      setPasswordError(false);
      setDesignMode('new');
      localStorage.setItem('ticketmaster_design_mode', 'new');
    } else {
      setPasswordError(true);
    }
  };

  const handleSelectOldDesign = () => {
    setDesignMode('old');
    localStorage.setItem('ticketmaster_design_mode', 'old');
  };

  const handleSwitchDesign = () => {
    setDesignMode('choose');
    setPasswordInput('');
    setPasswordError(false);
    setShowForgotPassword(false);
    localStorage.removeItem('ticketmaster_design_mode');
  };

  const handleEdit = (group: TicketGroup) => {
    setEditingGroup(group);
    setEventForm({
      eventName: group.eventName, artistName: group.artistName, venue: group.venue,
      location: group.location, date: group.date, time: group.time, eventImage: group.eventImage,
      ticketType: group.tickets[0]?.ticketType || '', entryInfo: group.tickets[0]?.entryInfo || '',
      purchaseDate: group.tickets[0]?.purchaseDate || '',
    });
    setTickets(group.tickets.map(t => ({ section: t.section, row: t.row, seat: t.seat })));
    setShowAddForm(true);
  };

  const handleDelete = (id: string) => { if (confirm('Delete this ticket?')) onDeleteTicket(id); };
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setEventForm(p => ({...p, eventImage: reader.result as string})); reader.readAsDataURL(file); }
  };
  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => onUpdateUser({ profileImage: reader.result as string }); reader.readAsDataURL(file); }
  };
  const addTicketSeat = () => setTickets(p => [...p, { section: '', row: '', seat: '' }]);
  const removeTicketSeat = (i: number) => { if (tickets.length > 1) setTickets(p => p.filter((_, idx) => idx !== i)); };
  const updateTicketSeat = (i: number, f: 'section'|'row'|'seat', v: string) => setTickets(p => p.map((t, idx) => idx === i ? {...t, [f]: v} : t));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mapImageUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(eventForm.venue + ' ' + eventForm.location)}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(eventForm.venue + ' ' + eventForm.location)}`;
    const baseOrder = editingGroup?.tickets[0]?.orderNumber || `${Math.floor(Math.random()*100000000)}`;
    const newTickets = tickets.map((tk, i) => ({
      id: editingGroup?.tickets[i]?.id || `ticket-${Date.now()}-${i}`, eventName: eventForm.eventName, artistName: eventForm.artistName,
      venue: eventForm.venue, location: eventForm.location, date: eventForm.date, time: eventForm.time,
      ticketType: eventForm.ticketType, entryInfo: eventForm.entryInfo, purchaseDate: eventForm.purchaseDate,
      section: tk.section, row: tk.row, seat: tk.seat, eventImage: eventForm.eventImage || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop',
      mapImage: mapImageUrl, orderNumber: i===0 ? baseOrder : `${parseInt(baseOrder)+i}`,
      barcodeNumber: editingGroup?.tickets[i]?.barcodeNumber || `*${Math.random().toString(36).substring(2,8).toUpperCase()}*/-*`,
    }));
    const g: TicketGroup = { id: editingGroup?.id || `group-${Date.now()}`, eventName: eventForm.eventName, artistName: eventForm.artistName,
      venue: eventForm.venue, location: eventForm.location, date: eventForm.date, time: eventForm.time,
      eventImage: eventForm.eventImage || 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop',
      mapImage: mapImageUrl, tickets: newTickets,
    };
    editingGroup ? onUpdateTicket(editingGroup.id, g) : onAddTicket(g);
    setEditingGroup(null); resetForm(); setShowAddForm(false);
  };

  // Discover edit handlers
  const handleDiscoverImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) { const reader = new FileReader(); reader.onloadend = () => setDiscoverForm(p => ({...p, image: reader.result as string})); reader.readAsDataURL(file); }
  };
  const handleAddDiscoverEvent = (sectionId: string) => {
    if (!discoverForm.title || !discoverForm.image) return;
    onAddDiscoverEvent(sectionId, { title: discoverForm.title, subtitle: discoverForm.subtitle, image: discoverForm.image,
      label: discoverForm.label, sublabel: discoverForm.sublabel, actionLabel: discoverForm.actionLabel,
      category: discoverForm.category, genre: discoverForm.genre,
    });
    resetDiscoverForm(); setShowAddDiscoverEvent(null);
  };
  const handleAddNewSection = () => {
    if (!newSectionForm.title) return;
    onAddDiscoverSection({ id: `section-${Date.now()}`, title: newSectionForm.title, type: newSectionForm.type, events: [] });
    setNewSectionForm({ title: '', type: 'card' });
  };

  const formatDate = (d: string) => { if(!d) return''; const date=new Date(d); return date.toLocaleDateString('en-US',{weekday:'short',day:'numeric',month:'short',year:'numeric'}); };

  // ===== DESIGN SELECTOR SCREEN =====
  if (designMode === 'choose') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#026CDF] to-gray-900 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-white text-3xl font-bold italic tracking-tight">ticketmaster</h1>
            <p className="text-white/60 text-sm mt-2">Choose your experience</p>
          </div>

          {/* Password Modal for New Design */}
          <div className="space-y-4 mb-6">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
              <div className="flex items-center gap-3 mb-3">
                <Lock size={20} className="text-yellow-400" />
                <span className="text-white font-medium text-sm">New Design is password protected</span>
              </div>
              <input
                type="password"
                value={passwordInput}
                onChange={e => { setPasswordInput(e.target.value); setPasswordError(false); }}
                placeholder="Enter password"
                className="w-full bg-white/20 text-white placeholder-white/50 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-[#026CDF]"
                onKeyDown={e => e.key === 'Enter' && handlePasswordSubmit()}
              />
              {passwordError && <p className="text-red-400 text-xs mt-2">Incorrect password. Try again.</p>}
              <button onClick={handlePasswordSubmit} className="w-full bg-[#026CDF] text-white py-3 rounded-lg font-semibold mt-3 hover:bg-[#004C9E] transition-colors">
                Unlock New Design
              </button>
              <button onClick={() => setShowForgotPassword(!showForgotPassword)} className="w-full text-white/60 text-xs mt-2 hover:text-white">
                Forgot password?
              </button>
              {showForgotPassword && (
                <div className="mt-3 p-3 bg-yellow-500/20 rounded-lg border border-yellow-500/30">
                  <p className="text-yellow-300 text-xs flex items-center gap-2">
                    <MessageCircle size={14} />
                    Text <span className="font-bold">{WHATSAPP_NUMBER}</span> on WhatsApp
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/20" />
            <span className="text-white/40 text-xs">OR</span>
            <div className="flex-1 h-px bg-white/20" />
          </div>

          {/* Old Design Button */}
          <button onClick={handleSelectOldDesign} className="w-full bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-colors text-left flex items-center gap-4">
            <div className="w-14 h-14 bg-gray-700 rounded-xl flex items-center justify-center">
              <Eye size={28} className="text-white" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">Classic Design</p>
              <p className="text-white/50 text-xs">The original Ticketmaster layout</p>
            </div>
          </button>
        </div>
      </div>
    );
  }

  // ===== NEW DESIGN: DISCOVER PAGE EDIT =====
  if (designMode === 'new' && showDiscoverEdit) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center h-14 px-4">
            <button onClick={() => setShowDiscoverEdit(false)} className="flex items-center text-gray-700">
              <ChevronLeft size={24} /><span className="ml-1">Back</span>
            </button>
            <h1 className="absolute inset-0 flex items-center justify-center pointer-events-none font-semibold text-lg">Discover Page Edit</h1>
          </div>
        </header>
        <div className="p-4 space-y-6 pb-24">
          {/* Add New Section */}
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h2 className="font-semibold text-lg mb-3">Add New Section</h2>
            <div className="flex gap-2">
              <input type="text" value={newSectionForm.title} onChange={e => setNewSectionForm(p=>({...p,title:e.target.value}))}
                className="form-input flex-1" placeholder="Section title" />
              <select value={newSectionForm.type} onChange={e => setNewSectionForm(p=>({...p,type:e.target.value as any}))}
                className="form-input w-32">
                <option value="card">Card</option><option value="carousel">Carousel</option><option value="hero">Hero</option>
                <option value="banner">Banner</option><option value="guides">Guides</option>
              </select>
            </div>
            <button onClick={handleAddNewSection} className="w-full bg-[#026CDF] text-white py-2 rounded-lg font-medium mt-2">Add Section</button>
          </div>
          {discoverSections.map(section => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b bg-gray-50">
                <div><h3 className="font-semibold">{section.title || section.type.toUpperCase()}</h3><p className="text-xs text-gray-500">{section.events.length} event(s)</p></div>
                <div className="flex gap-2">
                  <button onClick={() => { setShowAddDiscoverEvent(showAddDiscoverEvent === section.id ? null : section.id); resetDiscoverForm(); }} className="bg-[#026CDF] text-white p-2 rounded-lg"><Plus size={16} /></button>
                  <button onClick={() => { if(confirm('Delete this section?')) onDeleteDiscoverSection(section.id); }} className="bg-red-500 text-white p-2 rounded-lg"><Trash2 size={16} /></button>
                </div>
              </div>
              <div className="divide-y">
                {section.events.map(event => (
                  <div key={event.id} className="flex items-center p-3 gap-3">
                    <img src={event.image} alt={event.title} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                    <div className="flex-1 min-w-0"><p className="font-medium text-sm truncate">{event.title}</p><p className="text-xs text-gray-500">{event.label || event.genre || event.category}</p></div>
                    <button onClick={() => onDeleteDiscoverEvent(section.id, event.id)} className="text-red-500 p-1"><Trash2 size={16} /></button>
                  </div>
                ))}
              </div>
              {showAddDiscoverEvent === section.id && (
                <div className="p-4 bg-blue-50 border-t">
                  <h4 className="font-medium text-sm mb-3">Add Event</h4>
                  <div className="space-y-3">
                    <div onClick={() => discoverImageRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-[#026CDF]">
                      {discoverForm.image ? <img src={discoverForm.image} alt="" className="w-full h-32 object-cover rounded" />
                        : <div className="text-gray-500"><Image size={32} className="mx-auto mb-1" /><p className="text-xs">Tap to upload image</p></div>}
                      <input ref={discoverImageRef} type="file" accept="image/*" onChange={handleDiscoverImageUpload} className="hidden" />
                    </div>
                    <input type="text" value={discoverForm.title} onChange={e => setDiscoverForm(p=>({...p,title:e.target.value}))} className="form-input" placeholder="Event title" />
                    <input type="text" value={discoverForm.subtitle} onChange={e => setDiscoverForm(p=>({...p,subtitle:e.target.value}))} className="form-input" placeholder="Subtitle (optional)" />
                    <input type="text" value={discoverForm.label} onChange={e => setDiscoverForm(p=>({...p,label:e.target.value}))} className="form-input" placeholder="Label (e.g. PRESALE)" />
                    <input type="text" value={discoverForm.sublabel} onChange={e => setDiscoverForm(p=>({...p,sublabel:e.target.value}))} className="form-input" placeholder="Sublabel" />
                    <input type="text" value={discoverForm.actionLabel} onChange={e => setDiscoverForm(p=>({...p,actionLabel:e.target.value}))} className="form-input" placeholder="Button text" />
                    <input type="text" value={discoverForm.genre} onChange={e => setDiscoverForm(p=>({...p,genre:e.target.value}))} className="form-input" placeholder="Genre" />
                    <div className="flex gap-2">
                      <button onClick={() => handleAddDiscoverEvent(section.id)} className="flex-1 bg-[#026CDF] text-white py-2 rounded-lg font-medium">Add Event</button>
                      <button onClick={() => { setShowAddDiscoverEvent(null); resetDiscoverForm(); }} className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg">Cancel</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // ===== ADD/EDIT TICKET FORM =====
  if (showAddForm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b sticky top-0 z-40">
          <div className="flex items-center justify-between h-14 px-4">
            <button onClick={() => { setShowAddForm(false); setEditingGroup(null); resetForm(); }} className="flex items-center text-gray-700">
              <ChevronLeft size={24} /><span className="ml-1">Back</span>
            </button>
            <h1 className="text-lg font-semibold">{editingGroup ? 'Edit Ticket' : 'Add Ticket'}</h1>
            <div className="w-16" />
          </div>
        </header>
        <form onSubmit={handleSubmit} className="p-4 space-y-4 pb-24">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <label className="form-label">Event Image</label>
            <div onClick={() => fileInputRef.current?.click()} className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#026CDF]">
              {eventForm.eventImage ? <img src={eventForm.eventImage} alt="Event" className="w-full h-48 object-cover rounded" />
                : <div className="text-gray-500"><Camera size={48} className="mx-auto mb-2" /><p>Tap to upload event image</p></div>}
              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg">Event Details</h2>
            <div><label className="form-label">Event Name</label><input type="text" value={eventForm.eventName} onChange={e=>setEventForm(p=>({...p,eventName:e.target.value}))} className="form-input" placeholder="Event name" required /></div>
            <div><label className="form-label">Artist Name</label><input type="text" value={eventForm.artistName} onChange={e=>setEventForm(p=>({...p,artistName:e.target.value}))} className="form-input" placeholder="Artist name" required /></div>
            <div className="grid grid-cols-2 gap-4">
              <div><label className="form-label">Date</label><input type="date" value={eventForm.date} onChange={e=>setEventForm(p=>({...p,date:e.target.value}))} className="form-input" required /></div>
              <div><label className="form-label">Time</label><input type="time" value={eventForm.time} onChange={e=>setEventForm(p=>({...p,time:e.target.value}))} className="form-input" required /></div>
            </div>
            <div><label className="form-label">Venue</label><input type="text" value={eventForm.venue} onChange={e=>setEventForm(p=>({...p,venue:e.target.value}))} className="form-input" placeholder="Venue" required /></div>
            <div><label className="form-label">Location</label><input type="text" value={eventForm.location} onChange={e=>setEventForm(p=>({...p,location:e.target.value}))} className="form-input" placeholder="Location" required /></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <h2 className="font-semibold text-lg">Ticket Information</h2>
            <div><label className="form-label">Ticket Type</label><input type="text" value={eventForm.ticketType} onChange={e=>setEventForm(p=>({...p,ticketType:e.target.value}))} className="form-input" placeholder="Artist Presale | Aisle Seating" required /></div>
            <div><label className="form-label">Entry Info</label><input type="text" value={eventForm.entryInfo} onChange={e=>setEventForm(p=>({...p,entryInfo:e.target.value}))} className="form-input" placeholder="Grabowski Tribune" required /></div>
            <div><label className="form-label">Purchase Date</label><input type="date" value={eventForm.purchaseDate} onChange={e=>setEventForm(p=>({...p,purchaseDate:e.target.value}))} className="form-input" required /></div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div className="flex items-center justify-between"><h2 className="font-semibold text-lg">Seat Information</h2>
              <button type="button" onClick={addTicketSeat} className="flex items-center text-[#026CDF] text-sm font-medium"><PlusCircle size={18} className="mr-1" />Add Ticket</button></div>
            {tickets.map((tk, i) => (
              <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between"><span className="font-medium text-gray-700">Ticket {i+1}</span>
                  {tickets.length>1 && <button type="button" onClick={()=>removeTicketSeat(i)} className="text-red-500"><MinusCircle size={18} /></button>}</div>
                <div className="grid grid-cols-3 gap-3">
                  <div><label className="form-label text-xs">Section</label><input type="text" value={tk.section} onChange={e=>updateTicketSeat(i,'section',e.target.value)} className="form-input" placeholder="24A" required /></div>
                  <div><label className="form-label text-xs">Row</label><input type="text" value={tk.row} onChange={e=>updateTicketSeat(i,'row',e.target.value)} className="form-input" placeholder="23" required /></div>
                  <div><label className="form-label text-xs">Seat</label><input type="text" value={tk.seat} onChange={e=>updateTicketSeat(i,'seat',e.target.value)} className="form-input" placeholder="24" required /></div>
                </div>
              </div>
            ))}
          </div>
          <button type="submit" className="w-full bg-[#026CDF] text-white py-4 rounded-xl font-semibold text-lg">
            {editingGroup ? 'Update Tickets' : `Add ${tickets.length} Ticket${tickets.length>1?'s':''}`}
          </button>
        </form>
      </div>
    );
  }

  // ===== MAIN FOR YOU PAGE =====
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="flex items-center"><h1 className="text-lg font-semibold">{t('favorites')}</h1></div>
          <div className="flex items-center space-x-2">
            {/* Design Switcher */}
            <button onClick={handleSwitchDesign} className="bg-purple-600 text-white p-2 rounded-lg" title="Switch Design">
              <Pencil size={16} />
            </button>
            {designMode === 'new' && (
              <button onClick={() => setShowDiscoverEdit(true)} className="bg-green-600 text-white p-2 rounded-lg" title="Discover Page Edit">
                <LayoutGrid size={16} />
              </button>
            )}
            <button onClick={() => setShowCountrySelector(!showCountrySelector)} className="flex items-center space-x-1 px-2 py-1 rounded-lg hover:bg-gray-100">
              <span className="text-xl">{currentCountry.flag}</span>
            </button>
            <button onClick={() => setShowAddForm(true)} className="bg-[#026CDF] text-white p-2 rounded-lg"><Plus size={20} /></button>
          </div>
        </div>
        {showCountrySelector && (
          <div className="absolute top-14 right-4 bg-white shadow-lg rounded-lg border z-50 w-64 max-h-80 overflow-y-auto">
            <div className="p-2"><p className="text-xs font-semibold text-gray-500 uppercase px-3 py-2">Select Country</p>
              {countries.map(c => (
                <button key={c.code} onClick={()=>{onCountryChange(c.code);setShowCountrySelector(false);}}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg ${currentCountry.code===c.code?'bg-[#026CDF] text-white':'hover:bg-gray-100'}`}>
                  <span className="text-xl">{c.flag}</span><span className="flex-1 text-left text-sm">{c.name}</span>
                </button>
              ))}</div>
          </div>
        )}
      </header>

      {/* Profile Section */}
      <div className="bg-white p-4 mb-4">
        <div className="flex items-center space-x-4">
          <div onClick={()=>profileInputRef.current?.click()} className="relative w-20 h-20 rounded-full bg-gray-200 overflow-hidden cursor-pointer">
            {user.profileImage ? <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center bg-[#026CDF]"><User size={32} className="text-white" /></div>}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><Camera size={20} className="text-white" /></div>
            <input ref={profileInputRef} type="file" accept="image/*" onChange={handleProfileImageUpload} className="hidden" />
          </div>
          <div><h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2><p className="text-gray-500">{user.email}</p><p className="text-sm text-gray-400">{ticketGroups.length} events</p></div>
        </div>
      </div>

      {/* Current Design Badge */}
      <div className="px-4 mb-4">
        <div className={`rounded-lg px-4 py-2 flex items-center justify-between ${designMode === 'new' ? 'bg-gradient-to-r from-[#026CDF] to-blue-500' : 'bg-gray-800'}`}>
          <div className="flex items-center gap-2">
            <span className="text-white text-xs font-medium px-2 py-0.5 bg-white/20 rounded">{designMode === 'new' ? 'NEW' : 'CLASSIC'}</span>
            <span className="text-white text-sm">Design Active</span>
          </div>
          <button onClick={handleSwitchDesign} className="text-white/80 text-xs hover:text-white">Switch</button>
        </div>
      </div>

      {/* Discover Page Edit Banner (New Design Only) */}
      {designMode === 'new' && (
        <div className="px-4 mb-4">
          <button onClick={() => setShowDiscoverEdit(true)} className="w-full bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-xl p-4 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center"><LayoutGrid size={20} /></div>
              <div className="text-left"><p className="font-semibold">Discover Page Edit</p><p className="text-xs text-green-100">Add/edit events on the Discover page</p></div>
            </div>
            <ChevronLeft size={20} className="rotate-180" />
          </button>
        </div>
      )}

      {/* My Tickets List */}
      <div className="px-4 pb-24">
        <h3 className="text-lg font-semibold mb-4">My Saved Tickets</h3>
        {ticketGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" /><path d="M13 5v2M13 17v2M13 11v2" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets yet</h3>
            <p className="text-gray-500 mb-4">Add your first ticket to get started</p>
            <button onClick={()=>setShowAddForm(true)} className="bg-[#026CDF] text-white px-6 py-3 rounded-lg font-medium">Add Ticket</button>
          </div>
        ) : (
          <div className="space-y-4">
            {ticketGroups.map(group => (
              <div key={group.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-40">
                  <img src={group.eventImage} alt={group.eventName} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm opacity-80">{formatDate(group.date)} {group.time}</p>
                    <h4 className="font-bold text-lg line-clamp-1">{group.eventName}</h4>
                    <p className="text-sm opacity-80">{group.venue}</p>
                  </div>
                </div>
                <div className="p-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600"><p>{group.tickets.length} ticket{group.tickets.length>1?'s':''}</p>
                    <p className="text-xs text-gray-400">{group.tickets.map(t=>`Sec ${t.section}, Row ${t.row}, Seat ${t.seat}`).join(' | ')}</p></div>
                  <div className="flex space-x-2">
                    <button onClick={()=>handleEdit(group)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"><Edit2 size={18} /></button>
                    <button onClick={()=>handleDelete(group.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
