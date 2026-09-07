import { useState, useRef } from 'react';
import { Search, ChevronDown, X, MapPin, Calendar } from 'lucide-react';
import type { DiscoverSection } from '../types';
import type { Country } from '../types';
import { allCountries } from '../data/countries';

interface DiscoverPageProps {
  discoverSections: DiscoverSection[];
  currentCountry: Country;
  onCountryChange: (countryCode: string) => void;
}

export function DiscoverPage({
  discoverSections,
  currentCountry,
  onCountryChange,
}: DiscoverPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('Los Angeles...');
  const [selectedDate, setSelectedDate] = useState('All Dates');
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const popularLocations = ['Los Angeles', 'New York', 'London', 'Chicago', 'Houston', 'Phoenix'];
  const dateOptions = ['All Dates', 'Today', 'This Week', 'This Weekend', 'Next Week', 'This Month', 'Custom'];

  // Filter sections based on search
  const filteredSections = discoverSections.map(section => ({
    ...section,
    events: section.events.filter(event => {
      const matchesSearch = !searchQuery || 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    })
  })).filter(section => section.events.length > 0);

  return (
    <div className="min-h-screen bg-white">
      {/* Header - Black with ticketmaster logo */}
      <header className="bg-black sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-white text-xl font-bold italic tracking-tight" style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}>ticketmaster</h1>
          <button
            onClick={() => setShowCountrySelector(!showCountrySelector)}
            className="text-2xl"
          >
            {currentCountry.flag}
          </button>
        </div>

        {/* Location & Date Row */}
        <div className="flex items-center px-4 pb-3">
          <div className="relative flex-1">
            <div className="flex items-center">
              <button 
                className="flex items-center text-white/80 text-sm mr-4"
                onClick={() => { setShowLocationDropdown(true); setShowDateDropdown(false); }}
              >
                <MapPin size={16} className="mr-1" />
                <span className="truncate max-w-[120px]">{selectedLocation}</span>
                <ChevronDown size={14} className="ml-1" />
              </button>
              <button 
                className="flex items-center text-white/80 text-sm"
                onClick={() => { setShowDateDropdown(true); setShowLocationDropdown(false); }}
              >
                <Calendar size={16} className="mr-1" />
                <span className="uppercase text-xs tracking-wider">DATES</span>
                <span className="ml-2">{selectedDate}</span>
                <ChevronDown size={14} className="ml-1" />
              </button>
              {(showLocationDropdown || showDateDropdown) && (
                <button 
                  onClick={() => { setShowLocationDropdown(false); setShowDateDropdown(false); }}
                  className="ml-2 text-white"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center bg-white rounded-full overflow-hidden">
            <span className="pl-4 text-xs font-bold text-gray-500 tracking-wider">SEARCH</span>
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Artist, Event or Venue"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 outline-none"
            />
            <button className="pr-4">
              <Search size={18} className="text-gray-500" />
            </button>
          </div>
        </div>
      </header>

      {/* Location Dropdown */}
      {showLocationDropdown && (
        <div className="fixed inset-x-0 top-[120px] bg-white shadow-lg z-50 max-h-80 overflow-y-auto mx-4 rounded-lg">
          <div className="p-3 border-b flex justify-between items-center">
            <span className="font-semibold">Location</span>
            <button onClick={() => setShowLocationDropdown(false)}>
              <X size={18} />
            </button>
          </div>
          {popularLocations.map(loc => (
            <button
              key={loc}
              className="w-full text-left px-4 py-3 border-b hover:bg-gray-50 text-sm"
              onClick={() => { setSelectedLocation(loc); setShowLocationDropdown(false); }}
            >
              {loc}
            </button>
          ))}
        </div>
      )}

      {/* Date Dropdown */}
      {showDateDropdown && (
        <div className="fixed inset-x-0 top-[120px] bg-white shadow-lg z-50 max-h-80 overflow-y-auto mx-4 rounded-lg">
          <div className="p-3 border-b flex justify-between items-center">
            <span className="font-semibold">Dates</span>
            <button onClick={() => setShowDateDropdown(false)}>
              <X size={18} />
            </button>
          </div>
          {dateOptions.map(date => (
            <button
              key={date}
              className="w-full text-left px-4 py-3 border-b hover:bg-gray-50 text-sm"
              onClick={() => { setSelectedDate(date); setShowDateDropdown(false); }}
            >
              {date}
            </button>
          ))}
        </div>
      )}

      {/* Country Selector Dropdown */}
      {showCountrySelector && (
        <div className="fixed inset-0 bg-black/50 z-[60]">
          <div className="absolute top-14 right-0 left-0 bg-white shadow-lg z-[60] max-h-[80vh] overflow-y-auto mx-2 rounded-lg">
            <div className="p-3 border-b flex justify-between items-center">
              <span className="font-semibold">Select Country</span>
              <button onClick={() => setShowCountrySelector(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-0">
              {allCountries.map(country => (
                <button
                  key={country.code}
                  onClick={() => {
                    onCountryChange(country.code);
                    setShowCountrySelector(false);
                  }}
                  className={`flex items-center px-4 py-3 border-b border-r hover:bg-gray-50 transition-colors ${
                    currentCountry.code === country.code ? 'bg-blue-50' : ''
                  }`}
                >
                  <span className="text-xl mr-2">{country.flag}</span>
                  <span className="text-sm truncate">{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="pb-4">
        {filteredSections.map((section) => {
          if (section.type === 'hero') {
            return (
              <div key={section.id} className="relative">
                {section.events.map(event => (
                  <div key={event.id} className="relative h-64 w-full">
                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute bottom-8 left-4 right-4 text-white">
                      <h2 className="text-3xl font-bold mb-1">{event.title}</h2>
                    </div>
                    <div className="absolute bottom-2 right-4">
                      <button className="bg-[#026CDF] text-white px-4 py-2 rounded-lg font-bold text-sm">
                        {event.actionLabel || 'Find Tickets'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          if (section.type === 'recently-viewed') {
            return (
              <div key={section.id} className="px-4 py-4">
                <h2 className="text-xs font-bold text-gray-400 tracking-wider mb-3">{section.title}</h2>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {section.events.map(event => (
                    <div key={event.id} className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      </div>
                      <p className="text-[10px] text-center mt-1 text-gray-500">{event.title}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.type === 'presales') {
            return (
              <div key={section.id} className="px-4 py-4 bg-gray-100">
                <h2 className="text-xs font-bold text-gray-500 tracking-wider mb-2 flex items-center">
                  <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  {section.title}
                  <span className="ml-auto text-gray-400 text-xs font-normal">Near {selectedLocation.replace('...', ', CA')}</span>
                </h2>
                {section.events.map(event => (
                  <div key={event.id} className="bg-white rounded-xl overflow-hidden shadow-sm">
                    <div className="relative h-40">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                      <div className="absolute top-3 left-3 bg-black text-white text-xs px-2 py-1 rounded">
                        {event.label}
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-[#026CDF] font-medium">{event.sublabel}</p>
                      <p className="font-semibold text-sm mt-1">{event.title}</p>
                      <p className="text-gray-500 text-xs">{event.location} {event.venue}</p>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          if (section.type === 'carousel') {
            return (
              <div key={section.id} className="px-4 py-3">
                {section.subtitle && (
                  <h2 className="text-xs font-bold text-gray-400 tracking-wider mb-1">{section.subtitle}</h2>
                )}
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
                  {section.events.map(event => (
                    <div key={event.id} className="flex-shrink-0 w-48">
                      <div className="relative rounded-lg overflow-hidden">
                        <img src={event.image} alt={event.title} className="w-full h-28 object-cover" />
                        {event.genre && (
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                            <p className="text-white text-[10px] font-bold">{event.genre}</p>
                            <p className="text-white text-sm font-bold">{event.title}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.type === 'guides') {
            return (
              <div key={section.id} className="px-4 py-4">
                <h2 className="text-xs font-bold text-gray-400 tracking-wider mb-3">{section.title}</h2>
                <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4">
                  {section.events.map(event => (
                    <div key={event.id} className="flex-shrink-0 w-64 bg-gray-50 rounded-xl overflow-hidden">
                      <img src={event.image} alt={event.title} className="w-full h-36 object-cover" />
                      <div className="p-3">
                        <p className="font-bold text-sm">{event.title}</p>
                        <p className="text-gray-500 text-xs mt-1 line-clamp-3">{event.sublabel}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          if (section.type === 'banner') {
            return (
              <div key={section.id} className="px-4 py-4">
                <h2 className="text-xs font-bold text-gray-400 tracking-wider mb-3">{section.title}</h2>
                {section.events.map(event => (
                  <div key={event.id} className="relative rounded-xl overflow-hidden">
                    <img src={event.image} alt={event.title} className="w-full h-48 object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 flex flex-col justify-end">
                      <p className="text-white text-[10px] font-bold uppercase tracking-wider">{event.genre}</p>
                      <p className="text-white font-bold text-sm mt-1">{event.title}</p>
                      <p className="text-white/80 text-xs mt-1 line-clamp-2">{event.sublabel}</p>
                      <button className="mt-2 bg-transparent border border-white text-white text-xs px-3 py-1 rounded w-fit">
                        {event.actionLabel}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            );
          }

          if (section.type === 'card') {
            return (
              <div key={section.id} className="px-4 py-2">
                {section.title && (
                  <h2 className="text-xs font-bold text-gray-400 tracking-wider mb-3">{section.title}</h2>
                )}
                <div className="space-y-4">
                  {section.events.map(event => (
                    <div key={event.id} className="relative rounded-xl overflow-hidden shadow-sm">
                      <img src={event.image} alt={event.title} className="w-full h-44 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent p-4 flex flex-col justify-end">
                        {event.label && (
                          <p className="text-white text-xs font-bold italic">{event.label}</p>
                        )}
                        <p className="text-white font-bold text-sm">{event.title}</p>
                        {event.sublabel && (
                          <p className="text-white/80 text-xs">{event.sublabel}</p>
                        )}
                      </div>
                      {event.actionLabel && (
                        <div className="absolute top-3 right-3">
                          <button className="bg-white text-black text-xs font-bold px-3 py-1.5 rounded">
                            {event.actionLabel}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
