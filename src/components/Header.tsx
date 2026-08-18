import React from 'react';
import { useApp } from '../context/AppContext';
import { Language, PortalType } from '../types';
import { AnnouncementBanner } from './AnnouncementBanner';
import { 
  Menu, 
  Bell, 
  Globe, 
  ShoppingCart, 
  PhoneCall, 
  ShieldAlert,
  ChevronDown,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    portal, 
    setPortal, 
    language, 
    setLanguage, 
    t, 
    setIsPortalDrawerOpen, 
    setIsNotificationDrawerOpen,
    setIsSosModalOpen,
    unreadNotificationCount,
    cart,
    setIsAuthModalOpen,
    setAuthModalMode
  } = useApp();

  const [isLangOpen, setIsLangOpen] = React.useState(false);

  const totalCartCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);

  const languagesList: { code: Language; name: string; flag: string }[] = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
    { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
    { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
    { code: 'mr', name: 'मराठी', flag: '🇮🇳' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
  ];

  const getPortalName = (p: PortalType) => {
    switch (p) {
      case 'landing': return t('portalLanding');
      case 'patient': return t('portalPatient');
      case 'doctor': return t('portalDoctor');
      case 'hospital': return t('portalHospital');
      case 'pharmacy': return t('portalPharmacy');
      case 'admin': return t('portalAdmin');
      default: return 'Portal';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-blue-700 text-white shadow-md">
      {/* "Coming Soon" Infinite Scrolling Announcement Banner */}
      <AnnouncementBanner />

      {/* Top Red Emergency Bar */}
      <div className="bg-red-600 text-white py-1 px-4 text-xs font-semibold flex items-center justify-between border-b border-red-700">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="truncate text-[11px] sm:text-xs font-medium tracking-wide">
            🚨 Ambulance: 102 | 108 , Emergency : 112
          </span>
          <button 
            id="sos-header-btn"
            onClick={() => setIsSosModalOpen(true)}
            className="ml-auto bg-white text-red-700 px-2.5 py-0.5 rounded font-black text-[10px] uppercase tracking-wider hover:bg-red-50 transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            SOS Help
          </button>
        </div>
      </div>

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Left Branding + 3-Line Portals Button */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* THREE-LINE BUTTON FOR PORTALS - MANDATORY REQUIREMENT */}
          <button
            id="portal-hamburger-menu-btn"
            onClick={() => setIsPortalDrawerOpen(true)}
            className="p-2 bg-blue-800 hover:bg-blue-900 text-white rounded-lg transition-colors border border-blue-600 flex items-center gap-1.5 sm:gap-2 shadow-sm group cursor-pointer shrink-0"
            title="Open Portals Switcher Menu"
          >
            <div className="flex flex-col gap-1 w-5 h-4 justify-center items-center">
              <span className="w-5 h-0.5 bg-white rounded-full transition-all group-hover:bg-red-300"></span>
              <span className="w-5 h-0.5 bg-white rounded-full transition-all group-hover:bg-red-300"></span>
              <span className="w-5 h-0.5 bg-white rounded-full transition-all group-hover:bg-red-300"></span>
            </div>
            <span className="hidden sm:inline-block text-xs font-bold uppercase tracking-wider text-white">
              {t('portals')}
            </span>
            <span className="bg-red-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded uppercase hidden md:inline-block">
              6
            </span>
          </button>
        </div>

        {/* Center Active Workspace Indicator Badge (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 bg-blue-800 border border-blue-600 px-3 py-1.5 rounded-full text-xs font-semibold text-blue-100 shadow-inner">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-blue-200 text-[10px] uppercase tracking-wider font-bold">Portal:</span>
          <span className="text-white font-extrabold">{getPortalName(portal)}</span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">

          {/* Multi-Language Selector Pill */}
          <div className="relative">
            <button 
              id="language-selector-btn"
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center justify-center sm:justify-start gap-1 sm:gap-1.5 bg-blue-800 hover:bg-blue-900 text-white w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all border border-blue-600 shadow-xs cursor-pointer shrink-0"
            >
              <Globe className="w-3.5 h-3.5 text-blue-200" />
              <span className="uppercase text-[11px] tracking-wider hidden sm:inline">{language}</span>
              <span className="hidden sm:inline text-xs">{languagesList.find(l => l.code === language)?.flag}</span>
              <ChevronDown className={`w-3 h-3 text-blue-300 transition-transform duration-200 hidden sm:inline ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Language Dropdown Menu */}
            {isLangOpen && (
              <>
                <div 
                  className="fixed inset-0 z-40 cursor-default" 
                  onClick={() => setIsLangOpen(false)} 
                />
                <div className="absolute right-0 mt-2 w-48 bg-white text-slate-800 rounded-xl shadow-2xl border border-slate-200 py-1 z-50 animate-in fade-in duration-150 max-h-80 overflow-y-auto">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    Select Language
                  </div>
                  {languagesList.map(lang => (
                    <button
                      key={lang.code}
                      id={`select-lang-${lang.code}`}
                      onClick={() => {
                        setLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-blue-50 transition-colors cursor-pointer ${
                        language === lang.code ? 'text-blue-700 font-bold bg-blue-50/80' : 'text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{lang.flag}</span>
                        <span>{lang.name}</span>
                      </span>
                      {language === lang.code && <span className="text-blue-600 font-bold">✓</span>}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Notification Center Bell */}
          <button
            id="notification-center-header-btn"
            onClick={() => setIsNotificationDrawerOpen(true)}
            className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-800 hover:bg-blue-900 text-white transition-all relative border border-blue-600 group shadow-xs cursor-pointer shrink-0"
            title="Notification Center"
          >
            <Bell className="w-4 h-4 text-blue-100 group-hover:text-white" />
            {unreadNotificationCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border border-blue-700"></span>
            )}
          </button>

          {/* Cart Icon (Takes to Pharmacy) */}
          <button
            id="cart-header-btn"
            onClick={() => setPortal('pharmacy')}
            className="p-2 w-8 h-8 flex items-center justify-center rounded-full bg-blue-800 hover:bg-blue-900 text-white transition-all relative border border-blue-600 group shadow-xs cursor-pointer shrink-0"
            title="Medicine Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4 text-blue-100 group-hover:text-white" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 bg-red-500 text-white text-[8px] font-black rounded-full flex items-center justify-center px-1 border border-blue-700 shadow-xs">
                {totalCartCount}
              </span>
            )}
          </button>

          {/* Sign In Button */}
          <button
            id="header-login-btn"
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center justify-center sm:justify-start gap-1.5 bg-blue-800 hover:bg-blue-900 text-white w-8 h-8 sm:w-auto sm:px-3 sm:py-1.5 rounded-full text-xs font-bold transition-all border border-blue-600 shadow-xs cursor-pointer hover:border-blue-400 active:scale-95 shrink-0"
            title="Sign In"
          >
            <LogIn className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-blue-200" />
            <span className="hidden sm:inline">Sign In</span>
          </button>

          {/* Sign Up / Register Button */}
          <button
            id="header-signup-btn"
            onClick={() => {
              setAuthModalMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center justify-center sm:justify-start gap-1.5 bg-red-600 hover:bg-red-700 text-white w-8 h-8 sm:w-auto sm:px-3.5 sm:py-1.5 rounded-full text-xs font-black transition-all border border-red-500 shadow-md hover:shadow-lg active:scale-95 shrink-0"
            title="Register"
          >
            <UserPlus className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-white" />
            <span className="hidden sm:inline">Register</span>
          </button>

        </div>
      </div>
    </header>
  );
};
