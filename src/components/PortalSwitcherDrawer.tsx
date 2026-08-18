import React from 'react';
import { useApp } from '../context/AppContext';
import { PortalType } from '../types';
import { 
  X, 
  Home, 
  User, 
  Stethoscope, 
  Building2,
  Pill, 
  ShieldCheck, 
  ChevronRight, 
  Sparkles,
  PhoneCall,
  PlusCircle,
  FileSearch,
  CheckCircle2,
  Beaker
} from 'lucide-react';

export const PortalSwitcherDrawer: React.FC = () => {
  const { portal, setPortal, isPortalDrawerOpen, setIsPortalDrawerOpen, t, doctors, hospitals, appointments, orders, sampleRequests } = useApp();

  if (!isPortalDrawerOpen) return null;

  const portalsList: {
    id: PortalType;
    nameKey: string;
    description: string;
    icon: React.ReactNode;
    badge?: string;
    highlightColor: string;
  }[] = [
    {
      id: 'landing',
      nameKey: 'portalLanding',
      description: 'Find doctors, book video/clinic visits, AI prescription analysis & home lab samples.',
      icon: <Home className="w-5 h-5 text-blue-600" />,
      highlightColor: 'hover:border-blue-500 hover:bg-blue-50/50'
    },
    {
      id: 'patient',
      nameKey: 'portalPatient',
      description: 'Track upcoming appointments, uploaded prescriptions, lab reports & medicine orders.',
      icon: <User className="w-5 h-5 text-indigo-600" />,
      badge: `${appointments.length} Appointments`,
      highlightColor: 'hover:border-indigo-500 hover:bg-indigo-50/50'
    },
    {
      id: 'doctor',
      nameKey: 'portalDoctor',
      description: 'Consultation workspace for doctors to join video calls & view patient PDF records live.',
      icon: <Stethoscope className="w-5 h-5 text-emerald-600" />,
      badge: `${doctors.length} Doctors Registered`,
      highlightColor: 'hover:border-emerald-500 hover:bg-emerald-50/50'
    },
    {
      id: 'hospital',
      nameKey: 'portalHospital',
      description: 'Administrative workspace for clinical centers to manage multiple specialist doctors and queue schedules.',
      icon: <Building2 className="w-5 h-5 text-cyan-600" />,
      badge: `${hospitals ? hospitals.length : 0} Hospitals Listed`,
      highlightColor: 'hover:border-cyan-500 hover:bg-cyan-50/50'
    },
    {
      id: 'pharmacy',
      nameKey: 'portalPharmacy',
      description: 'Browse stores added by admin, search medicines, upload RX & order for delivery.',
      icon: <Pill className="w-5 h-5 text-amber-600" />,
      highlightColor: 'hover:border-amber-500 hover:bg-amber-50/50'
    },
    {
      id: 'lab',
      nameKey: 'portalLab',
      description: 'Access center for pathology labs, diagnostics, phlebotomist assignment, and report uploads.',
      icon: <Beaker className="w-5 h-5 text-red-600" />,
      highlightColor: 'hover:border-red-500 hover:bg-red-50/50'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-950 text-white p-5 flex items-center justify-between border-b border-blue-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 text-white flex items-center justify-center font-black text-xl shadow-md border border-red-400">
              M+
            </div>
            <div>
              <h2 className="font-bold text-lg text-white leading-tight">
                {t('portals')}
              </h2>
              <p className="text-xs text-blue-200">
                {t('selectPortal')}
              </p>
            </div>
          </div>
          <button
            id="close-portal-drawer-btn"
            onClick={() => setIsPortalDrawerOpen(false)}
            className="p-2 rounded-lg bg-white/10 hover:bg-red-600 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Portals List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          <div className="px-2 pb-1 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Available Workspaces
          </div>

          {portalsList.map(item => {
            const isActive = portal === item.id;
            return (
              <button
                key={item.id}
                id={`select-portal-${item.id}`}
                onClick={() => setPortal(item.id)}
                className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-3.5 group relative ${
                  isActive
                    ? 'border-blue-600 bg-blue-50/80 shadow-md ring-2 ring-blue-600/20'
                    : `border-slate-200 bg-white ${item.highlightColor} shadow-sm hover:shadow`
                }`}
              >
                <div className={`p-2.5 rounded-lg ${isActive ? 'bg-blue-600 text-white' : 'bg-slate-100'}`}>
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: `w-5 h-5 ${isActive ? 'text-white' : ''}`
                  })}
                </div>

                <div className="flex-1 pr-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`font-semibold text-sm ${isActive ? 'text-blue-950 font-bold' : 'text-slate-900 group-hover:text-blue-700'}`}>
                      {t(item.nameKey)}
                    </span>
                    {item.badge && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {isActive && (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 self-center" />
                )}
              </button>
            );
          })}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Cloud Telehealth Live
          </span>
          <button 
            id="portal-drawer-sos-btn"
            onClick={() => {
              setIsPortalDrawerOpen(false);
              alert("Emergency Hotline: Dial 911 or Call +1 (800) MEDICARE for immediate medical dispatch!");
            }}
            className="flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700"
          >
            <PhoneCall className="w-3.5 h-3.5 text-red-600" />
            24/7 Helpline
          </button>
        </div>
      </div>
    </div>
  );
};
