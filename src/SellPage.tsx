import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, Tag, TrendingUp, Shield, Clock, DollarSign, Search, Filter } from 'lucide-react';
import type { TicketGroup, Country } from '../types';

interface SellPageProps {
  ticketGroups: TicketGroup[];
  countries: Country[];
  currentCountry: Country;
  onCountryChange: (countryCode: string) => void;
  t: (key: string) => string;
}

export function SellPage({
  ticketGroups,
}: SellPageProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tickets that can be sold (upcoming events)
  const sellableTickets = ticketGroups.filter(
    (group) => new Date(group.date) >= new Date()
  );

  const filteredTickets = sellableTickets.filter(
    (group) =>
      group.eventName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.artistName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <button onClick={() => navigate('/my-tickets')}>
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-semibold">Sell Tickets</h1>
          <button>
            <HelpCircle size={24} />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#026CDF] to-[#004C9E] text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Sell Your Tickets</h2>
        <p className="text-blue-100 mb-4">
          List your tickets for sale on Ticketmaster's secure marketplace
        </p>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <Shield size={16} className="mr-1" />
            <span>Secure</span>
          </div>
          <div className="flex items-center">
            <TrendingUp size={16} className="mr-1" />
            <span>Fair Price</span>
          </div>
          <div className="flex items-center">
            <Clock size={16} className="mr-1" />
            <span>Instant</span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search your tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#026CDF]"
          />
        </div>
      </div>

      {/* How It Works */}
      <div className="px-4 mb-6">
        <h3 className="font-semibold text-lg mb-4">How It Works</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Tag size={24} className="text-[#026CDF]" />
            </div>
            <p className="text-sm font-medium">1. List</p>
            <p className="text-xs text-gray-500">Set your price</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <p className="text-sm font-medium">2. Sell</p>
            <p className="text-xs text-gray-500">Get paid</p>
          </div>
          <div className="bg-white rounded-xl p-4 text-center shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield size={24} className="text-purple-600" />
            </div>
            <p className="text-sm font-medium">3. Transfer</p>
            <p className="text-xs text-gray-500">Safe & secure</p>
          </div>
        </div>
      </div>

      {/* Your Tickets */}
      <div className="px-4 pb-24">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Your Tickets</h3>
          <button className="flex items-center text-[#026CDF] text-sm">
            <Filter size={16} className="mr-1" />
            Filter
          </button>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tickets available</h3>
            <p className="text-gray-500">
              {searchQuery
                ? 'No tickets match your search'
                : 'You have no upcoming tickets to sell'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTickets.map((group) => (
              <div key={group.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-40">
                  <img
                    src={group.eventImage}
                    alt={group.eventName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <p className="text-sm opacity-80">{formatDate(group.date)}</p>
                    <h4 className="font-bold line-clamp-1">{group.eventName}</h4>
                    <p className="text-sm opacity-80">{group.venue}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm text-gray-600">
                      <p>Section {group.tickets[0]?.section} • Row {group.tickets[0]?.row}</p>
                      <p>{group.tickets.length} ticket(s)</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Estimated Value</p>
                      <p className="font-bold text-green-600">$150 - $200</p>
                    </div>
                  </div>
                  <button
                    onClick={() => navigate(`/ticket/${group.id}`)}
                    className="w-full bg-[#026CDF] text-white py-3 rounded-lg font-semibold"
                  >
                    List for Sale
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* FAQ Section */}
      <div className="px-4 pb-24">
        <h3 className="font-semibold text-lg mb-4">Frequently Asked Questions</h3>
        <div className="space-y-3">
          <FAQItem
            question="How do I price my tickets?"
            answer="Ticketmaster provides price recommendations based on market demand and face value. You can set your own price within reasonable limits."
          />
          <FAQItem
            question="When do I get paid?"
            answer="You'll receive payment within 5-7 business days after the event has taken place."
          />
          <FAQItem
            question="Can I cancel my listing?"
            answer="Yes, you can cancel your listing at any time before the tickets are sold."
          />
          <FAQItem
            question="What fees are involved?"
            answer="Ticketmaster charges a small service fee for facilitating the sale. This fee is deducted from your final payout."
          />
        </div>
      </div>
    </div>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left"
      >
        <span className="font-medium">{question}</span>
        <ChevronLeft
          size={20}
          className={`transform transition-transform ${isOpen ? '-rotate-90' : ''}`}
        />
      </button>
      {isOpen && (
        <div className="px-4 pb-4">
          <p className="text-gray-600 text-sm">{answer}</p>
        </div>
      )}
    </div>
  );
}
