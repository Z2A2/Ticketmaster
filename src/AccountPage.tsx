import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, HelpCircle, User, Settings, CreditCard, Bell, Shield, MapPin, Globe, ChevronRight, Camera, LogOut, Ticket, Heart, History } from 'lucide-react';
import type { Country, User as UserType } from '../types';

interface AccountPageProps {
  user: UserType;
  onUpdateUser: (user: Partial<UserType>) => void;
  countries: Country[];
  currentCountry: Country;
  onCountryChange: (countryCode: string) => void;
  t: (key: string) => string;
}

export function AccountPage({
  user,
  onUpdateUser,
  countries,
  currentCountry,
  onCountryChange,
  t,
}: AccountPageProps) {
  const navigate = useNavigate();
  const [showCountrySelector, setShowCountrySelector] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
  });
  const profileInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpdateUser({ profileImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    onUpdateUser({
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
    });
    setShowEditProfile(false);
  };

  const menuItems = [
    { icon: Ticket, label: 'My Tickets', action: () => navigate('/my-tickets'), badge: null },
    { icon: Heart, label: 'Favorites', action: () => navigate('/favorites'), badge: null },
    { icon: History, label: 'Order History', action: () => {}, badge: null },
    { icon: CreditCard, label: 'Payment Methods', action: () => {}, badge: null },
    { icon: MapPin, label: 'Saved Addresses', action: () => {}, badge: null },
    { icon: Bell, label: 'Notifications', action: () => {}, badge: '3' },
    { icon: Shield, label: 'Security', action: () => {}, badge: null },
    { icon: Settings, label: 'Settings', action: () => {}, badge: null },
    { icon: HelpCircle, label: 'Help & Support', action: () => {}, badge: null },
  ];

  // Edit Profile Modal
  if (showEditProfile) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="flex items-center justify-between h-14 px-4">
            <button onClick={() => setShowEditProfile(false)}>
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-lg font-semibold">Edit Profile</h1>
            <button onClick={handleSaveProfile} className="text-[#026CDF] font-medium">
              Save
            </button>
          </div>
        </header>

        {/* Form */}
        <div className="p-4 space-y-4">
          {/* Profile Image */}
          <div className="flex justify-center mb-6">
            <div
              onClick={() => profileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full bg-gray-200 overflow-hidden cursor-pointer"
            >
              {user.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-[#026CDF]">
                  <User size={40} className="text-white" />
                </div>
              )}
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera size={24} className="text-white" />
              </div>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageUpload}
                className="hidden"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm space-y-4">
            <div>
              <label className="form-label">First Name</label>
              <input
                type="text"
                value={editForm.firstName}
                onChange={(e) => setEditForm(prev => ({ ...prev, firstName: e.target.value }))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Last Name</label>
              <input
                type="text"
                value={editForm.lastName}
                onChange={(e) => setEditForm(prev => ({ ...prev, lastName: e.target.value }))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Email</label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                className="form-input"
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="tel"
                value={editForm.phone}
                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                className="form-input"
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-40">
        <div className="flex items-center justify-between h-14 px-4">
          <h1 className="text-lg font-semibold">{t('account')}</h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowCountrySelector(!showCountrySelector)}
              className="text-2xl"
            >
              {currentCountry.flag}
            </button>
            <button>
              <Settings size={24} />
            </button>
          </div>
        </div>

        {/* Country Selector Dropdown */}
        {showCountrySelector && (
          <div className="absolute top-14 right-4 bg-white shadow-lg rounded-lg border border-gray-200 z-50 w-64 max-h-80 overflow-y-auto">
            <div className="p-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Select Country
              </p>
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    onCountryChange(country.code);
                    setShowCountrySelector(false);
                  }}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    currentCountry.code === country.code
                      ? 'bg-[#026CDF] text-white'
                      : 'hover:bg-gray-100 text-gray-900'
                  }`}
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="flex-1 text-left">{country.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Profile Section */}
      <div className="bg-black text-white p-6">
        <div className="flex items-center space-x-4">
          <div
            onClick={() => setShowEditProfile(true)}
            className="relative w-20 h-20 rounded-full bg-gray-700 overflow-hidden cursor-pointer"
          >
            {user.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#026CDF]">
                <User size={32} className="text-white" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
              <Camera size={20} className="text-white" />
            </div>
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-gray-400">{user.email}</p>
            <button
              onClick={() => setShowEditProfile(true)}
              className="text-[#026CDF] text-sm mt-1"
            >
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="bg-white mx-4 -mt-4 rounded-xl shadow-lg p-4 flex justify-around">
        <div className="text-center">
          <p className="text-2xl font-bold text-[#026CDF]">12</p>
          <p className="text-xs text-gray-500">Events</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-[#026CDF]">5</p>
          <p className="text-xs text-gray-500">Favorites</p>
        </div>
        <div className="w-px bg-gray-200" />
        <div className="text-center">
          <p className="text-2xl font-bold text-[#026CDF]">3</p>
          <p className="text-xs text-gray-500">Orders</p>
        </div>
      </div>

      {/* Menu Items */}
      <div className="p-4 space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={index}
              onClick={item.action}
              className="w-full bg-white rounded-xl p-4 flex items-center justify-between shadow-sm hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <Icon size={20} className="text-gray-600" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center">
                {item.badge && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full mr-2">
                    {item.badge}
                  </span>
                )}
                <ChevronRight size={20} className="text-gray-400" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Region Settings */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-700 mb-3 px-2">Region & Language</h3>
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <button
            onClick={() => setShowCountrySelector(true)}
            className="w-full flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                <Globe size={20} className="text-gray-600" />
              </div>
              <div>
                <span className="font-medium block">Country/Region</span>
                <span className="text-sm text-gray-500">{currentCountry.name}</span>
              </div>
            </div>
            <div className="flex items-center">
              <span className="text-2xl mr-2">{currentCountry.flag}</span>
              <ChevronRight size={20} className="text-gray-400" />
            </div>
          </button>
        </div>
      </div>

      {/* Sign Out */}
      <div className="p-4 pb-24">
        <button className="w-full bg-red-50 text-red-600 rounded-xl p-4 flex items-center justify-center space-x-2 font-medium hover:bg-red-100 transition-colors">
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* App Version */}
      <div className="text-center pb-8">
        <p className="text-xs text-gray-400">Ticketmaster v1.0.0</p>
      </div>
    </div>
  );
}
