import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, MapPin, ArrowUpRight, RefreshCw, Upload } from 'lucide-react';
import type { TicketGroup } from '../types';

interface TicketDetailPageProps {
  ticketGroups: TicketGroup[];
}

export function TicketDetailPage({ ticketGroups }: TicketDetailPageProps) {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tickets' | 'extras'>('tickets');
  const [showBarcode, setShowBarcode] = useState(false);

  const group = ticketGroups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Ticket not found</p>
          <button onClick={() => navigate('/my-tickets')} className="mt-4 text-[#026CDF] font-medium">Go back</button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' }).toUpperCase();
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const ticket = group.tickets[0];

  // Barcode View Modal
  if (showBarcode) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        <header className="bg-black text-white flex items-center justify-between h-14 px-4">
          <button onClick={() => setShowBarcode(false)}><ChevronLeft size={24} /></button>
          <h1 className="text-sm font-medium truncate max-w-[200px]">{group.eventName}</h1>
          <button><HelpCircle size={24} /></button>
        </header>
        <div className="h-[calc(100vh-56px)] overflow-hidden relative">
          <div className="absolute inset-0">
            <img src={group.eventImage} alt="" className="w-full h-full object-cover opacity-30" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
          </div>
          <div className="relative h-full flex flex-col items-center justify-center p-8">
            <p className="text-white/80 text-sm mb-6">{ticket.ticketType}</p>
            <div className="flex justify-center items-start space-x-12 mb-8">
              <div className="text-center"><p className="text-white/50 text-xs uppercase mb-1">Sec</p><p className="text-white text-2xl font-bold">{ticket.section}</p></div>
              <div className="text-center"><p className="text-white/50 text-xs uppercase mb-1">Row</p><p className="text-white text-2xl font-bold">{ticket.row}</p></div>
              <div className="text-center"><p className="text-white/50 text-xs uppercase mb-1">Seat</p><p className="text-white text-2xl font-bold">{ticket.seat}</p></div>
            </div>
            <div className="relative mb-6">
              <div className="absolute -inset-3 rounded-2xl border-2 border-purple-500 qr-ring opacity-60" />
              <div className="absolute -inset-1 rounded-xl border-2 border-blue-400 qr-ring opacity-40" style={{ animationDirection: 'reverse', animationDuration: '2s' }} />
              <div className="bg-white p-4 rounded-xl relative z-10">
                <img src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${ticket.barcodeNumber}`} alt="QR" className="w-56 h-56" />
              </div>
            </div>
            <p className="text-white/80 text-sm mb-6">{ticket.entryInfo}</p>
            <button className="w-full max-w-xs bg-gray-800/80 text-white py-3 rounded-lg flex items-center justify-center space-x-2">
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M2 6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6zm2 0v12h16V6H4zm2 2h12v2H6V8zm0 4h12v2H6v-2z"/></svg>
              <span>Add to Apple Wallet</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Header with Event Image */}
      <div className="relative">
        <img src={group.eventImage} alt={group.eventName} className="w-full h-48 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60" />
        {/* Top Nav */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4">
          <button onClick={() => navigate('/my-tickets')} className="w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center">
            <ChevronLeft size={24} className="text-white" />
          </button>
          <button className="text-white font-medium">Help</button>
        </div>
        {/* Date/Time Overlay */}
        <div className="absolute bottom-16 left-4 right-4">
          <p className="text-white text-sm font-medium">{formatDate(group.date)} • {formatTime(group.time)}</p>
        </div>
        {/* Barcode Button */}
        <button onClick={() => setShowBarcode(true)} className="absolute bottom-16 right-4 w-14 h-14 bg-[#026CDF] rounded-full flex items-center justify-center shadow-lg">
          <svg viewBox="0 0 24 24" className="w-7 h-7 text-white" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 7V5a2 2 0 0 1 2-2h2M3 17v2a2 2 0 0 0 2 2h2M21 7V5a2 2 0 0 0-2-2h-2M21 17v2a2 2 0 0 1-2 2h-2" />
            <path d="M8 12h8M8 8h.01M8 16h.01M12 8h.01M12 16h.01M16 8h.01M16 16h.01" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Event Info Card */}
      <div className="bg-[#1a1a1a] text-white px-4 py-4">
        <h1 className="text-2xl font-bold uppercase leading-tight">{group.eventName}</h1>
        <div className="flex items-center justify-between mt-2">
          <p className="text-white/70 text-sm">{group.venue} - {group.location}</p>
          <div className="flex items-center text-white/70">
            <svg viewBox="0 0 24 24" className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
              <path d="M13 5v2M13 17v2M13 11v2" />
            </svg>
            <span className="text-sm">x{group.tickets.length}</span>
          </div>
        </div>
      </div>

      {/* View Tickets Button */}
      <button onClick={() => setShowBarcode(true)} className="w-full bg-[#026CDF] text-white py-4 font-semibold text-lg flex items-center justify-center space-x-2">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 7V5a2 2 0 0 1 2-2h2M3 17v2a2 2 0 0 0 2 2h2M21 7V5a2 2 0 0 0-2-2h-2M21 17v2a2 2 0 0 1-2 2h-2" />
          <path d="M8 12h8M8 8h.01M8 16h.01M12 8h.01M12 16h.01M16 8h.01M16 16h.01" strokeLinecap="round" />
        </svg>
        <span>View Tickets</span>
      </button>

      {/* Tabs */}
      <div className="flex border-b">
        <button onClick={() => setActiveTab('tickets')} className={`flex-1 py-3 text-center font-medium ${activeTab === 'tickets' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}>
          Tickets
        </button>
        <button onClick={() => setActiveTab('extras')} className={`flex-1 py-3 text-center font-medium ${activeTab === 'extras' ? 'text-black border-b-2 border-black' : 'text-gray-400'}`}>
          Extras
        </button>
      </div>

      {activeTab === 'tickets' ? (
        <div className="px-4 py-4 space-y-6">
          {/* Order Info */}
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">Order #{ticket.orderNumber}</h2>
                <p className="text-gray-500 text-sm">x{group.tickets.length} Ticket{group.tickets.length > 1 ? 's' : ''}</p>
              </div>
              <button className="p-2">
                <svg viewBox="0 0 24 24" className="w-6 h-6 text-gray-400" fill="currentColor">
                  <circle cx="12" cy="6" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="18" r="2" />
                </svg>
              </button>
            </div>
          </div>

          {/* Ticket Table */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-white">
              <p className="font-bold text-sm">TICKET{group.tickets.length > 1 ? 'S' : ''}</p>
            </div>
            {group.tickets.map((t, i) => (
              <div key={t.id} className={`px-4 py-3 ${i < group.tickets.length - 1 ? 'border-b border-white' : ''}`}>
                <div className="grid grid-cols-3 gap-4">
                  <div><p className="text-gray-500 text-xs uppercase">Section</p><p className="font-bold text-lg">{t.section}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase">Row</p><p className="font-bold text-lg">{t.row}</p></div>
                  <div><p className="text-gray-500 text-xs uppercase">Seat</p><p className="font-bold text-lg">{t.seat}</p></div>
                </div>
              </div>
            ))}
          </div>

          {/* More Options */}
          <div>
            <h3 className="font-bold text-lg mb-3">MORE OPTIONS</h3>
            {/* Map */}
            <div className="relative rounded-xl overflow-hidden h-48 bg-gray-100">
              <img src={group.mapImage || `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(group.venue + ' ' + group.location)}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(group.venue + ' ' + group.location)}`}
                alt="Map" className="w-full h-full object-cover" />
              {/* Floating Action Bar */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg flex overflow-hidden">
                <button onClick={() => navigate(`/transfer/${group.id}`)} className="flex items-center px-5 py-2.5 text-sm font-medium hover:bg-gray-50">
                  <ArrowUpRight size={18} className="mr-1.5 text-[#026CDF]" />Transfer
                </button>
                <div className="w-px bg-gray-200" />
                <button className="flex items-center px-5 py-2.5 text-sm font-medium text-gray-400">
                  <RefreshCw size={18} className="mr-1.5" />Sell
                </button>
              </div>
              {/* Map Pin */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
                <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                  <MapPin size={24} className="text-white" />
                </div>
              </div>
            </div>
          </div>

          {/* Promotional Banner */}
          <div className="bg-[#1a1a1a] rounded-xl overflow-hidden flex">
            <div className="flex-1 p-3">
              <img src={group.eventImage} alt="" className="w-full h-28 object-cover rounded" />
              <p className="text-white text-xs mt-2 font-medium">{formatDate(group.date)} • {formatTime(group.time)}</p>
              <p className="text-white font-bold text-sm">{group.eventName}</p>
              <p className="text-white/60 text-xs">{group.venue},{group.location}</p>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <div>
                <p className="text-white font-black text-3xl uppercase leading-tight">YOU GOT</p>
                <p className="text-white font-black text-3xl uppercase leading-tight">TICKETS!</p>
                <div className="w-20 h-1 bg-white mt-2" />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-2">Post on Social Media</h3>
            <p className="text-gray-600 text-sm mb-4">Build hype for the event, and share that you got tickets with your friends and family.</p>
            <button className="w-full bg-gray-100 text-black py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
              <span>Share You're Going</span>
              <Upload size={18} />
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-center gap-4 pb-4">
            <button className="flex flex-col items-center px-6 py-3 bg-gray-100 rounded-2xl text-gray-400">
              <ArrowUpRight size={24} /><span className="text-xs mt-1">Upgrade</span>
            </button>
            <button onClick={() => navigate(`/transfer/${group.id}`)} className="flex flex-col items-center px-6 py-3 bg-gray-100 rounded-2xl">
              <ArrowUpRight size={24} className="text-[#026CDF]" /><span className="text-xs mt-1">Transfer</span>
            </button>
            <button className="flex flex-col items-center px-6 py-3 bg-gray-100 rounded-2xl text-gray-400">
              <RefreshCw size={24} /><span className="text-xs mt-1">Sell</span>
            </button>
          </div>
        </div>
      ) : (
        /* Extras Tab */
        <div className="px-4 py-4 space-y-6">
          {/* Map */}
          <div className="relative rounded-xl overflow-hidden h-64 bg-gray-100">
            <img src={group.mapImage || `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(group.venue + ' ' + group.location)}&zoom=15&size=600x300&maptype=roadmap&markers=color:red%7C${encodeURIComponent(group.venue + ' ' + group.location)}`}
              alt="Map" className="w-full h-full object-cover" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-full">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center shadow-lg">
                <MapPin size={24} className="text-white" />
              </div>
            </div>
          </div>
          <button className="w-full bg-gray-100 text-black py-3 rounded-lg font-medium">Get Directions</button>

          {/* Promotional Banner */}
          <div className="bg-[#1a1a1a] rounded-xl overflow-hidden flex">
            <div className="flex-1 p-3">
              <img src={group.eventImage} alt="" className="w-full h-28 object-cover rounded" />
              <p className="text-white text-xs mt-2 font-medium">{formatDate(group.date)} • {formatTime(group.time)}</p>
              <p className="text-white font-bold text-sm">{group.eventName}</p>
              <p className="text-white/60 text-xs">{group.venue},{group.location}</p>
            </div>
            <div className="flex-1 flex items-center justify-center p-4">
              <div>
                <p className="text-white font-black text-3xl uppercase leading-tight">YOU GOT</p>
                <p className="text-white font-black text-3xl uppercase leading-tight">TICKETS!</p>
                <div className="w-20 h-1 bg-white mt-2" />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-bold text-lg mb-2">Post on Social Media</h3>
            <p className="text-gray-600 text-sm mb-4">Build hype for the event, and share that you got tickets with your friends and family.</p>
            <button className="w-full bg-gray-100 text-black py-3 rounded-lg font-medium flex items-center justify-center space-x-2">
              <span>Share You're Going</span>
              <Upload size={18} />
            </button>
          </div>

          {/* Bottom Actions */}
          <div className="flex justify-center gap-4 pb-4">
            <button className="flex flex-col items-center px-6 py-3 bg-gray-100 rounded-2xl text-gray-400">
              <ArrowUpRight size={24} /><span className="text-xs mt-1">Upgrade</span>
            </button>
            <button onClick={() => navigate(`/transfer/${group.id}`)} className="flex flex-col items-center px-6 py-3 bg-gray-100 rounded-2xl">
              <ArrowUpRight size={24} className="text-[#026CDF]" /><span className="text-xs mt-1">Transfer</span>
            </button>
            <button className="flex flex-col items-center px-6 py-3 bg-gray-100 rounded-2xl text-gray-400">
              <RefreshCw size={24} /><span className="text-xs mt-1">Sell</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
