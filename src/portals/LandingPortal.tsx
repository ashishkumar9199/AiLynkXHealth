import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { AIPrescriptionAnalyzer } from '../components/AIPrescriptionAnalyzer';
import { DoctorCard } from '../components/DoctorCard';
import { AppointmentBookingModal } from '../components/AppointmentBookingModal';
import { HomeSampleCollectionModal } from '../components/HomeSampleCollectionModal';
import { Chatbot } from '../components/Chatbot';
import { Doctor } from '../types';
import { 
  Stethoscope, 
  Sparkles, 
  TestTube2, 
  Pill, 
  PhoneCall, 
  ShieldCheck, 
  Search, 
  CheckCircle2, 
  ArrowRight,
  UserCheck,
  Building2,
  Calendar,
  Clock,
  HeartPulse,
  Activity
} from 'lucide-react';

export const LandingPortal: React.FC = () => {
  const { doctors, stores, medicines, setPortal, t, setActiveBookingDoctor, activeBookingDoctor } = useApp();

  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedMode, setSelectedMode] = useState<'all' | 'video' | 'clinic'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSampleModalOpen, setIsSampleModalOpen] = useState(false);

  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const backgroundImages = [
    "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=1200&q=80", // Doctors consulting
    "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=1200&q=80", // Laboratory diagnostic diagnostics
    "https://images.unsplash.com/photo-1504813184591-015556c5c572?auto=format&fit=crop&w=1200&q=80", // Medical clinic hospital treatment
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"  // Online consultation video telehealth
  ];

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  // Filter Doctors (added by admin and approved)
  const filteredDoctors = doctors.filter(doc => {
    // Only approved doctors appear on the public panel
    if (doc.approvalStatus !== 'approved') return false;

    const matchesSpecialty = selectedSpecialty === 'All' || doc.specialty === selectedSpecialty;
    const matchesMode = selectedMode === 'all' || doc.consultationModes.includes(selectedMode);
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          doc.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSpecialty && matchesMode && matchesSearch;
  });

  const specialtiesList = ['All', 'Cardiologist', 'Internal Medicine & Diabetology', 'Dermatologist & Cosmetologist', 'Orthopedic Specialist', 'Pediatrician & Child Health'];

  return (
    <div className="space-y-12 pb-16">
      
      {/* Hero Section */}
      <section className="bg-slate-950 text-white rounded-3xl p-6 sm:p-12 shadow-2xl relative overflow-hidden border border-slate-850 min-h-[380px]">
        {/* Background Slideshow Overlay */}
        <div className="absolute inset-0 z-0">
          {backgroundImages.map((src, idx) => (
            <img
              key={src}
              src={src}
              alt={`Service slide ${idx + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                idx === currentBgIndex ? 'opacity-65' : 'opacity-0'
              }`}
              referrerPolicy="no-referrer"
            />
          ))}
          {/* Neutral Horizontal Gradient for perfect text contrast while preserving natural photo colors on the right */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>

        {/* Slide Indicators inside hero background */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/10">
          {backgroundImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentBgIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${
                idx === currentBgIndex ? 'bg-red-500 w-4' : 'bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to background slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-12 space-y-6">
            


            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              {t('heroTitle')}
            </h1>

            <p className="text-blue-100 text-sm sm:text-base leading-relaxed max-w-xl">
              {t('heroSubtitle')}
            </p>

            {/* Quick CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-book-doctor-btn"
                onClick={() => {
                  const elem = document.getElementById('doctors-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm"
              >
                <Stethoscope className="w-5 h-5" />
                <span>{t('consultDoctors')}</span>
              </button>

              <button
                id="hero-ai-analyzer-btn"
                onClick={() => {
                  const elem = document.getElementById('prescription-analyzer-section');
                  if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                }}
                className="bg-white text-blue-950 hover:bg-blue-50 font-extrabold px-6 py-3.5 rounded-2xl shadow-md transition-all flex items-center gap-2 text-sm border border-blue-200"
              >
                <span>{t('prescriptionAnalyzer')}</span>
              </button>

              <button
                id="header-quick-book-btn"
                onClick={() => {
                  const doctorElem = document.getElementById('doctors-section');
                  if (doctorElem) {
                    doctorElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm border border-red-500"
              >
                <Stethoscope className="w-5 h-5" />
                <span>{t('bookAppointment')}</span>
              </button>
            </div>

            {/* Key Trust Stats */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-blue-700/60 max-w-lg text-xs">
              <div>
                <span className="block text-xl font-extrabold text-white">100%</span>
                <span className="text-blue-200 text-[11px]">Verified Doctors</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white">24/7</span>
                <span className="text-blue-200 text-[11px]">Video Consults</span>
              </div>
              <div>
                <span className="block text-xl font-extrabold text-white">Home</span>
                <span className="text-blue-200 text-[11px]">Sample Pickup</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Quick Action Navigation Grid */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        <button
          id="quick-action-book"
          onClick={() => {
            const elem = document.getElementById('doctors-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 hover:border-blue-500/80 transition-all duration-300 text-left group border border-slate-200 bg-slate-950 cursor-pointer"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=600&q=80" 
              alt={t('bookAppointment')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.3] group-hover:brightness-[0.35]"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </div>
          
          {/* Floating Icon Badge top right */}
          <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-blue-500/10 backdrop-blur-md border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Calendar className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full p-5 flex flex-col justify-end">
            <span className="text-[9px] uppercase font-black tracking-wider text-blue-400 mb-1 group-hover:text-blue-300 transition-colors">
              Schedule & Meet
            </span>
            <h3 className="font-black text-sm sm:text-base text-white tracking-tight drop-shadow-sm group-hover:text-white transition-colors">
              {t('bookAppointment')}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 leading-snug drop-shadow-xs">
              Video Call or Clinic Visit
            </p>
          </div>
        </button>

        <button
          id="quick-action-analyzer"
          onClick={() => {
            const elem = document.getElementById('prescription-analyzer-section');
            if (elem) elem.scrollIntoView({ behavior: 'smooth' });
          }}
          className="relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 hover:border-red-500/80 transition-all duration-300 text-left group border border-slate-200 bg-slate-950 cursor-pointer"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80" 
              alt={t('prescriptionAnalyzer')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.3] group-hover:brightness-[0.35]"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </div>
          
          {/* Floating Icon Badge top right */}
          <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-red-500/10 backdrop-blur-md border border-red-500/30 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Sparkles className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full p-5 flex flex-col justify-end">
            <span className="text-[9px] uppercase font-black tracking-wider text-red-400 mb-1 group-hover:text-red-300 transition-colors">
              Clinical Intelligence
            </span>
            <h3 className="font-black text-sm sm:text-base text-white tracking-tight drop-shadow-sm group-hover:text-white transition-colors">
              {t('prescriptionAnalyzer')}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 leading-snug drop-shadow-xs">
              AI record & PDF scanner
            </p>
          </div>
        </button>

        <button
          id="quick-action-sample"
          onClick={() => setIsSampleModalOpen(true)}
          className="relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 hover:border-emerald-500/80 transition-all duration-300 text-left group border border-slate-200 bg-slate-950 cursor-pointer"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?auto=format&fit=crop&w=600&q=80" 
              alt={t('homeSample')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.3] group-hover:brightness-[0.35]"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </div>
          
          {/* Floating Icon Badge top right */}
          <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <TestTube2 className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full p-5 flex flex-col justify-end">
            <span className="text-[9px] uppercase font-black tracking-wider text-emerald-400 mb-1 group-hover:text-emerald-300 transition-colors">
              Diagnostics
            </span>
            <h3 className="font-black text-sm sm:text-base text-white tracking-tight drop-shadow-sm group-hover:text-white transition-colors">
              {t('homeSample')}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 leading-snug drop-shadow-xs">
              Doorstep phlebotomist
            </p>
          </div>
        </button>

        <button
          id="quick-action-pharmacy"
          onClick={() => setPortal('pharmacy')}
          className="relative h-48 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl hover:-translate-y-1 hover:border-amber-500/80 transition-all duration-300 text-left group border border-slate-200 bg-slate-950 cursor-pointer"
        >
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=600&q=80" 
              alt={t('orderMedicines')}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 brightness-[0.3] group-hover:brightness-[0.35]"
              referrerPolicy="no-referrer"
            />
            {/* Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
          </div>
          
          {/* Floating Icon Badge top right */}
          <div className="absolute top-4 right-4 z-10 w-9 h-9 rounded-xl bg-amber-500/10 backdrop-blur-md border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:bg-amber-600 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
            <Pill className="w-4 h-4" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full p-5 flex flex-col justify-end">
            <span className="text-[9px] uppercase font-black tracking-wider text-amber-400 mb-1 group-hover:text-amber-300 transition-colors">
              E-Pharmacy
            </span>
            <h3 className="font-black text-sm sm:text-base text-white tracking-tight drop-shadow-sm group-hover:text-white transition-colors">
              {t('orderMedicines')}
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-300 font-medium mt-1 leading-snug drop-shadow-xs">
              From admin stores
            </p>
          </div>
        </button>

      </section>

      {/* AI Prescription Analyzer Component */}
      <AIPrescriptionAnalyzer />

      {/* Doctors Section (Added by Admin) */}
      <section id="doctors-section" className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-red-600 block mb-1">
              Verified Medical Panel
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-blue-950">
              {t('doctorsTitle')}
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              {t('doctorsSubtitle')}
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                id="search-doctors-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search doctor or specialty..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800 shadow-xs focus:ring-2 focus:ring-blue-600/20"
              />
            </div>

            {/* Mode Filter */}
            <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
              <button
                id="filter-mode-all"
                onClick={() => setSelectedMode('all')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedMode === 'all' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                All Modes
              </button>
              <button
                id="filter-mode-video"
                onClick={() => setSelectedMode('video')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedMode === 'video' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Video Call
              </button>
              <button
                id="filter-mode-clinic"
                onClick={() => setSelectedMode('clinic')}
                className={`px-3 py-1 rounded-lg font-bold transition-colors ${
                  selectedMode === 'clinic' ? 'bg-blue-600 text-white' : 'text-slate-600'
                }`}
              >
                Clinic Visit
              </button>
            </div>
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map(doctor => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onBook={() => setActiveBookingDoctor(doctor)}
            />
          ))}
        </div>

        {filteredDoctors.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-700 font-bold text-sm">
              No doctors found matching criteria.
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Admin can add new doctor profiles anytime in the Admin Portal!
            </p>
          </div>
        )}
      </section>

      {/* Home Sample Collection Banner */}
      <section className="bg-gradient-to-r from-emerald-900 to-teal-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-800">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-1.5 bg-emerald-700 text-emerald-100 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <TestTube2 className="w-3.5 h-3.5 text-yellow-300" />
            Lab Test at Doorstep
          </div>
          <h3 className="text-2xl font-black text-white">
            Apply for Home Sample Collection
          </h3>
          <p className="text-emerald-100 text-xs leading-relaxed">
            Certified phlebotomist will visit your home for blood & urine sample collection. Reports uploaded to your Patient Dashboard within 24 hours.
          </p>
        </div>

        <button
          id="request-home-sample-banner-btn"
          onClick={() => setIsSampleModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-all shrink-0 text-sm"
        >
          Apply for Home Collection
        </button>
      </section>

      {/* Medical Professional / Doctor Join Banner */}
      <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white rounded-3xl p-8 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 border border-slate-700">
        <div className="space-y-2 max-w-xl text-left">
          <h3 className="text-2xl font-black text-white">
            Are you a Registered Medical Doctor?
          </h3>
          <p className="text-slate-300 text-xs leading-relaxed">
            Join our digital Telehealth Ecosystem. Register your specialist profile, manage consult queues, and host high-definition video consults. Your registration is secure and will go live once verified by our platform administrator.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 shrink-0">
          <button
            id="landing-doctor-signin-btn"
            onClick={() => {
              localStorage.setItem('doctor_portal_view_mode', 'signin');
              setPortal('doctor');
            }}
            className="bg-white hover:bg-slate-100 text-slate-900 font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-all text-sm border border-slate-200 cursor-pointer"
          >
            Doctor Login
          </button>
          <button
            id="landing-doctor-signup-btn"
            onClick={() => {
              localStorage.setItem('doctor_portal_view_mode', 'signup');
              setPortal('doctor');
            }}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-6 py-3 rounded-2xl shadow-lg transition-all text-sm border border-emerald-500 cursor-pointer"
          >
            Apply to Join Panel
          </button>
        </div>
      </section>

      {/* Modals */}
      {activeBookingDoctor && (
        <AppointmentBookingModal
          doctor={activeBookingDoctor}
          onClose={() => setActiveBookingDoctor(null)}
        />
      )}

      {isSampleModalOpen && (
        <HomeSampleCollectionModal
          onClose={() => setIsSampleModalOpen(false)}
        />
      )}

      {/* Floating Medical Chatbot */}
      <Chatbot />

    </div>
  );
};

export const DoctorCardComponent = DoctorCard;
