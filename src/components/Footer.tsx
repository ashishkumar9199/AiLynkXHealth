import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  HeartPulse, 
  PhoneCall, 
  ShieldAlert, 
  Globe, 
  Mail, 
  MapPin, 
  Stethoscope, 
  Sparkles 
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { setPortal, t, setIsSosModalOpen } = useApp();

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs mt-auto">
      
      {/* Top Red SOS Bar */}
      <div className="bg-red-600 text-white py-2.5 px-4 border-b border-red-700">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-white animate-pulse shrink-0" />
            <span className="font-bold text-xs sm:text-xs tracking-wide">
              Ambulance: 102 | 108 , Emergency : 112
            </span>
          </div>

          <button
            onClick={() => setIsSosModalOpen(true)}
            className="bg-white text-red-700 px-3 py-1 rounded font-black text-[10px] uppercase tracking-wider hover:bg-red-50 transition-colors shadow-xs shrink-0 cursor-pointer"
          >
            Call Emergency Hotline
          </button>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Brand Column */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">TELEHEALTH ECOSYSTEM PLATFORM</p>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed text-[11px]">
            Comprehensive online healthcare suite combining specialist video consultations, AI prescription safety reviews, lab sample pickup, and digital medicine store delivery.
          </p>
        </div>

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-widest text-blue-400">
            Care Services
          </h4>
          <ul className="space-y-1.5 text-slate-400 font-medium text-[11px]">
            <li>🎥 video consulation</li>
            <li>🏥 In-Person Clinic Visits</li>
            <li>🤖 AI Prescription Scanner</li>
            <li>🩸 Home Sample Pickup Service</li>
            <li>💊 Express Pharmacy Store Delivery</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <h4 className="font-bold text-xs uppercase tracking-widest text-blue-400">
            Contact & Support
          </h4>
          <div className="space-y-2 text-slate-400 text-[11px]">
            <p className="flex items-start gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
              <a href="tel:+919835552841" className="hover:text-white transition-colors">
                +91 98355 52841
              </a>
            </p>
            <p className="flex items-start gap-2">
              <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
              <a href="mailto:ailynkxhealth@gmail.com" className="hover:text-white transition-colors break-all">
                ailynkxhealth@gmail.com
              </a>
            </p>
            <p className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>Ashok Nagar, Vijay nagar, Patna - 800020</span>
            </p>
          </div>
        </div>

      </div>

      {/* Clean Minimalism Bottom Status Bar */}
      <div className="bg-slate-950 border-t border-slate-800 px-6 py-2.5 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-400 font-medium shrink-0 gap-2">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
          <span>SYSTEM STATUS: ALL TELEHEALTH SERVICES ONLINE</span>
        </div>
        <div className="flex items-center gap-4">
          <span>PRIVACY POLICY</span>
          <span>CLINICAL TERMS</span>
          <span>HIPAA COMPLIANT</span>
          <span className="font-mono text-slate-500">v2.4.0</span>
        </div>
      </div>

    </footer>
  );
};
