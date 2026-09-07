import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Mail, Smartphone, Check } from 'lucide-react';
import type { TicketGroup, Country } from '../types';

interface TransferPageProps {
  ticketGroups: TicketGroup[];
  countries: Country[];
  currentCountry: Country;
  onCountryChange: (countryCode: string) => void;
  onUpdateTicket: (id: string, updatedGroup: Partial<TicketGroup>) => void;
  t: (key: string) => string;
}

export function TransferPage({
  ticketGroups,
  onUpdateTicket,
  t,
}: TransferPageProps) {
  const { groupId } = useParams<{ groupId: string }>();
  const navigate = useNavigate();
  const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
  const [transferMethod, setTransferMethod] = useState<'email' | 'phone'>('email');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [recipientFirstName, setRecipientFirstName] = useState('');
  const [recipientLastName, setRecipientLastName] = useState('');
  const [note, setNote] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const group = ticketGroups.find((g) => g.id === groupId);

  if (!group) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500">Ticket not found</p>
          <button
            onClick={() => navigate('/my-tickets')}
            className="mt-4 text-[#026CDF] font-medium"
          >
            Go back to My Tickets
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatTime = (timeStr: string) => {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const toggleTicketSelection = (ticketId: string) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketId)
        ? prev.filter((id) => id !== ticketId)
        : [...prev, ticketId]
    );
  };

  const selectAllTickets = () => {
    setSelectedTickets(group.tickets.map((t) => t.id));
  };

  const deselectAllTickets = () => {
    setSelectedTickets([]);
  };

  const handleTransfer = async () => {
    if (selectedTickets.length === 0) return;
    if (!termsAccepted) return;

    setIsLoading(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Update tickets with transfer status
    const updatedTickets = group.tickets.map(ticket => {
      if (selectedTickets.includes(ticket.id)) {
        return {
          ...ticket,
          transferStatus: 'sent' as const,
          transferRecipient: {
            firstName: recipientFirstName,
            lastName: recipientLastName,
            email: transferMethod === 'email' ? recipientEmail : undefined,
            phone: transferMethod === 'phone' ? recipientPhone : undefined,
            note: note || undefined,
          },
        };
      }
      return ticket;
    });

    onUpdateTicket(group.id, { tickets: updatedTickets });
    
    setIsLoading(false);
    setShowSuccess(true);
  };

  // Success View - matches video exactly
  if (showSuccess) {
    const ticket = group.tickets.find(t => selectedTickets.includes(t.id));
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header with event info */}
        <div className="bg-black text-white">
          <div className="flex items-center px-4 py-3">
            <span className="text-lg font-bold">ticketmaster</span>
            <span className="ml-auto text-xl">🏠</span>
          </div>
          {/* Event banner */}
          <div className="relative h-32">
            <img
              src={group.eventImage}
              alt=""
              className="w-full h-full object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 text-white flex">
              <div className="mr-4">
                <p className="text-sm">{formatDate(group.date).split(',')[1]?.trim().split(' ')[0]}</p>
                <p className="text-3xl font-bold">{new Date(group.date).getDate()}</p>
              </div>
              <div>
                <p className="text-sm">{formatTime(group.time)}</p>
                <p className="font-bold">{group.artistName || group.eventName.split(':')[0]}</p>
                <p className="text-xs opacity-80">{group.location}</p>
                <p className="text-xs opacity-80">{group.venue}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Card */}
        <div className="mx-4 -mt-4 bg-white rounded-xl shadow-lg overflow-hidden relative z-10">
          {/* Green line */}
          <div className="h-1 bg-green-500" />
          
          {/* Green checkmark */}
          <div className="flex justify-center -mt-6">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
              <Check size={28} className="text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Recipient info */}
          <div className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-1">
              {t('sentTo')} {recipientFirstName} {recipientLastName}
            </h2>
            <p className="text-gray-500 text-sm">
              {transferMethod === 'email' ? recipientEmail : recipientPhone}
            </p>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Ticket Type */}
            <p className="text-gray-700 mb-4">{ticket?.ticketType || 'Reserved Seating'}</p>

            {/* Divider */}
            <div className="border-t border-gray-200 my-4" />

            {/* Seat Info */}
            <div className="flex justify-between">
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">{t('section')}</p>
                <p className="text-lg font-bold text-gray-900">{ticket?.section}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">{t('row')}</p>
                <p className="text-lg font-bold text-gray-900">{ticket?.row}</p>
              </div>
              <div className="text-center">
                <p className="text-xs text-gray-500 uppercase">{t('seat')}</p>
                <p className="text-lg font-bold text-gray-900">{ticket?.seat}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Warning message */}
        <div className="mx-4 mt-4 bg-white rounded-xl p-4 shadow-sm">
          <p className="text-gray-600 text-sm">
            {t('onceAccepted')}
          </p>
        </div>

        {/* Transfer Another Button */}
        <div className="px-4 mt-4 pb-8">
          <button
            onClick={() => {
              setShowSuccess(false);
              setSelectedTickets([]);
              setTermsAccepted(false);
            }}
            className="w-full bg-[#026CDF] text-white py-4 rounded-xl font-semibold"
          >
            {t('addAnother')}
          </button>
        </div>
      </div>
    );
  }

  // Loading View
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-[#026CDF] border-t-transparent rounded-full loading-spinner" />
          <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-b-transparent rounded-full loading-spinner" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Retrieving Order Details</h2>
        <p className="text-gray-500">Please wait a moment.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => navigate('/my-tickets')}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Transfer Tickets</h1>
          <button>
            <HelpCircle size={24} />
          </button>
        </div>
      </header>

      {/* Event Info */}
      <div className="bg-black text-white p-4">
        <p className="text-sm text-gray-400">
          {formatDate(group.date).toUpperCase()}
        </p>
        <h2 className="text-lg font-bold">{group.eventName}</h2>
        <p className="text-sm text-gray-400">{group.venue} - {group.location}</p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4 pb-24">
        {/* Transfer Info */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <h2 className="text-xl font-bold text-center mb-2">TRANSFER TICKETS</h2>
          <p className="text-gray-600 text-center text-sm">
            Send tickets to the people you will attend the event with. It's fast and completely free.
          </p>
        </div>

        {/* Select Tickets */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Select Tickets To Transfer</h3>
            <div className="flex space-x-2">
              <button
                onClick={selectAllTickets}
                className="text-[#026CDF] text-sm font-medium"
              >
                Select All
              </button>
              <button
                onClick={deselectAllTickets}
                className="text-[#026CDF] text-sm font-medium"
              >
                Deselect All
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {group.tickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => toggleTicketSelection(ticket.id)}
                className={`border-2 rounded-lg p-4 cursor-pointer transition-colors ${
                  selectedTickets.includes(ticket.id)
                    ? 'border-[#026CDF] bg-blue-50'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded border-2 mr-3 flex items-center justify-center ${
                      selectedTickets.includes(ticket.id)
                        ? 'bg-[#026CDF] border-[#026CDF]'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedTickets.includes(ticket.id) && (
                      <Check size={16} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{ticket.ticketType}</p>
                    <div className="flex justify-between mt-1">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Section</p>
                        <p className="font-semibold">{ticket.section}</p>
                        <p className="text-sm text-gray-600">{ticket.section}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs text-gray-500 uppercase">Row</p>
                        <p className="font-semibold">{ticket.row}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase">Seat</p>
                        <p className="font-semibold">{ticket.seat}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transfer Method */}
        {selectedTickets.length > 0 && (
          <>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Transfer Via</h3>
              <div className="space-y-3">
                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    transferMethod === 'email'
                      ? 'border-[#026CDF] bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="transferMethod"
                    checked={transferMethod === 'email'}
                    onChange={() => setTransferMethod('email')}
                    className="w-5 h-5 text-[#026CDF]"
                  />
                  <Mail size={20} className="ml-3 mr-2 text-gray-600" />
                  <span className="flex-1">Email Address</span>
                </label>

                <label
                  className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    transferMethod === 'phone'
                      ? 'border-[#026CDF] bg-blue-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="transferMethod"
                    checked={transferMethod === 'phone'}
                    onChange={() => setTransferMethod('phone')}
                    className="w-5 h-5 text-[#026CDF]"
                  />
                  <Smartphone size={20} className="ml-3 mr-2 text-gray-600" />
                  <span className="flex-1">Mobile Number</span>
                </label>
              </div>
            </div>

            {/* Recipient Info */}
            <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
              <h3 className="font-semibold">Recipient Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    value={recipientFirstName}
                    onChange={(e) => setRecipientFirstName(e.target.value)}
                    className="form-input"
                    placeholder="First name"
                  />
                </div>
                <div>
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    value={recipientLastName}
                    onChange={(e) => setRecipientLastName(e.target.value)}
                    className="form-input"
                    placeholder="Last name"
                  />
                </div>
              </div>

              {transferMethod === 'email' ? (
                <div>
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    value={recipientEmail}
                    onChange={(e) => setRecipientEmail(e.target.value)}
                    className="form-input"
                    placeholder="recipient@example.com"
                  />
                </div>
              ) : (
                <div>
                  <label className="form-label">Mobile Number</label>
                  <input
                    type="tel"
                    value={recipientPhone}
                    onChange={(e) => setRecipientPhone(e.target.value)}
                    className="form-input"
                    placeholder="+1 234 567 890"
                  />
                </div>
              )}

              <div>
                <label className="form-label">Note (Optional)</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="form-input min-h-[100px]"
                  placeholder="Add a personal message..."
                />
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-2">Terms & Conditions</h3>
              <div className="text-sm text-gray-600 max-h-40 overflow-y-auto border rounded-lg p-3 mb-4">
                <p className="mb-2">
                  Transfer is only available for select tickets, products, services, and extras (each a "Product" and collectively "Products"). Once a recipient has accepted a transfer, the transfer cannot be cancelled or reversed.
                </p>
                <p className="mb-2">
                  If a Product is transferred multiple times using Transfer, only the Product from the most recent Transfer will be valid for entry or redemption; all previous barcodes will be cancelled.
                </p>
                <p className="mb-2">
                  Only the original purchaser of a Product is eligible for refunds or credits—not the recipient of a Product Transfer. For cancelled events, the original purchaser will receive any available refund or credit, and no action is needed from the recipient of the transferred Products.
                </p>
                <p>
                  For postponed, rescheduled, or moved events, recipients of the transferred Products will need to transfer the Products back to the original purchaser to enable the original purchaser to take advantage of any available refund and/or credit options.
                </p>
              </div>

              <label className="flex items-start cursor-pointer">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-5 h-5 mt-0.5 mr-3 text-[#026CDF] rounded"
                />
                <span className="text-sm text-gray-700">
                  I agree to the Terms & Conditions and understand that this transfer cannot be cancelled or reversed.
                </span>
              </label>
            </div>

            {/* Tickets Being Transferred */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Tickets Being Transferred</span>
                <span className="text-gray-500">×{selectedTickets.length}</span>
              </div>
            </div>

            {/* Confirm Button */}
            <button
              onClick={handleTransfer}
              disabled={
                !termsAccepted ||
                !recipientFirstName ||
                !recipientLastName ||
                (transferMethod === 'email' ? !recipientEmail : !recipientPhone)
              }
              className="w-full bg-green-600 text-white py-4 rounded-xl font-semibold disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Confirm Transfer
            </button>
          </>
        )}
      </div>
    </div>
  );
}
