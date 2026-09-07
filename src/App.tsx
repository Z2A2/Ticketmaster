import { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import type { TicketGroup, User, Country, DiscoverSection } from './types';
import { DiscoverPage } from './pages/DiscoverPage';
import { ForYouPage } from './pages/ForYouPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { TicketDetailPage } from './pages/TicketDetailPage';
import { TransferPage } from './pages/TransferPage';
import { SellPage } from './pages/SellPage';
import { AccountPage } from './pages/AccountPage';
import { BottomNav } from './components/BottomNav';
import { allCountries } from './data/countries';
import { defaultDiscoverSections } from './data/discoverData';
import { getTranslation } from './data/translations';

function App() {
  const [ticketGroups, setTicketGroups] = useState<TicketGroup[]>([]);
  const [discoverSections, setDiscoverSections] = useState<DiscoverSection[]>([]);
  const [currentCountry, setCurrentCountry] = useState<Country>(allCountries.find(c => c.code === 'US') || allCountries[0]);
  const [user, setUser] = useState<User>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 234 567 890',
    country: 'US',
    language: 'en',
  });

  // Load from localStorage on mount
  useEffect(() => {
    const savedTickets = localStorage.getItem('ticketGroups');
    if (savedTickets) {
      try { setTicketGroups(JSON.parse(savedTickets)); } catch (e) { console.error(e); }
    }
    const savedCountry = localStorage.getItem('selectedCountry');
    if (savedCountry) {
      const country = allCountries.find(c => c.code === savedCountry);
      if (country) {
        setCurrentCountry(country);
        setUser(prev => ({ ...prev, country: country.code, language: country.language }));
      }
    }
    const savedDiscover = localStorage.getItem('discoverSections');
    if (savedDiscover) {
      try { setDiscoverSections(JSON.parse(savedDiscover)); } catch (e) { console.error(e); }
    } else {
      setDiscoverSections(defaultDiscoverSections);
    }
  }, []);

  // Save to localStorage
  useEffect(() => { localStorage.setItem('ticketGroups', JSON.stringify(ticketGroups)); }, [ticketGroups]);
  useEffect(() => { localStorage.setItem('discoverSections', JSON.stringify(discoverSections)); }, [discoverSections]);

  const addTicketGroup = (ticketGroup: TicketGroup) => { setTicketGroups(prev => [...prev, ticketGroup]); };
  const updateTicketGroup = (id: string, updatedGroup: Partial<TicketGroup>) => {
    setTicketGroups(prev => prev.map(group => group.id === id ? { ...group, ...updatedGroup } : group));
  };
  const deleteTicketGroup = (id: string) => { setTicketGroups(prev => prev.filter(group => group.id !== id)); };
  const updateUser = (updatedUser: Partial<User>) => { setUser(prev => ({ ...prev, ...updatedUser })); };

  const changeCountry = (countryCode: string) => {
    const country = allCountries.find(c => c.code === countryCode);
    if (country) {
      setCurrentCountry(country);
      updateUser({ country: countryCode, language: country.language });
      localStorage.setItem('selectedCountry', countryCode);
    }
  };

  const t = useCallback((key: string): string => getTranslation(user.language, key), [user.language]);

  // Discover page edit functions
  const addDiscoverEvent = (sectionId: string, event: any) => {
    setDiscoverSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return { ...section, events: [...section.events, { ...event, id: `custom-${Date.now()}`, custom: true }] };
      }
      return section;
    }));
  };

  const deleteDiscoverEvent = (sectionId: string, eventId: string) => {
    setDiscoverSections(prev => prev.map(section => {
      if (section.id === sectionId) {
        return { ...section, events: section.events.filter(e => e.id !== eventId) };
      }
      return section;
    }));
  };

  const addDiscoverSection = (section: DiscoverSection) => {
    setDiscoverSections(prev => [...prev, section]);
  };

  const deleteDiscoverSection = (sectionId: string) => {
    setDiscoverSections(prev => prev.filter(s => s.id !== sectionId));
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 pb-20">
        <Routes>
          <Route path="/" element={<Navigate to="/discover" replace />} />
          <Route path="/discover" element={
            <DiscoverPage discoverSections={discoverSections} currentCountry={currentCountry} onCountryChange={changeCountry} />
          } />
          <Route path="/favorites" element={
            <ForYouPage ticketGroups={ticketGroups} onAddTicket={addTicketGroup} onUpdateTicket={updateTicketGroup} onDeleteTicket={deleteTicketGroup}
              countries={allCountries} currentCountry={currentCountry} onCountryChange={changeCountry} user={user} onUpdateUser={updateUser} t={t}
              discoverSections={discoverSections} onAddDiscoverEvent={addDiscoverEvent}
              onDeleteDiscoverEvent={deleteDiscoverEvent} onAddDiscoverSection={addDiscoverSection} onDeleteDiscoverSection={deleteDiscoverSection} />
          } />
          <Route path="/my-tickets" element={
            <MyTicketsPage ticketGroups={ticketGroups} countries={allCountries} currentCountry={currentCountry} onCountryChange={changeCountry} t={t} />
          } />
          <Route path="/ticket/:groupId" element={
            <TicketDetailPage ticketGroups={ticketGroups} />
          } />
          <Route path="/transfer/:groupId" element={
            <TransferPage ticketGroups={ticketGroups} countries={allCountries} currentCountry={currentCountry} onCountryChange={changeCountry} onUpdateTicket={updateTicketGroup} t={t} />
          } />
          <Route path="/sell" element={
            <SellPage ticketGroups={ticketGroups} countries={allCountries} currentCountry={currentCountry} onCountryChange={changeCountry} t={t} />
          } />
          <Route path="/account" element={
            <AccountPage user={user} onUpdateUser={updateUser} countries={allCountries} currentCountry={currentCountry} onCountryChange={changeCountry} t={t} />
          } />
        </Routes>
        <BottomNav t={t} />
      </div>
    </Router>
  );
}

export default App;
