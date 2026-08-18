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

  const getPortalColorConfig = (id: string) => {
    const configs: Record<string, { 
      bgActive: string; 
      badgeActive: string;
      hoverBorder: string;
      hoverBg: string;
      iconBg: string;
      iconColor: string;
      checkColor: string;
    }> = {
      landing: {
        bgActive: 'bg-blue-50/90 border-blue-500 shadow-md ring-2 ring-blue-500/10 scale-[1.01]',
        badgeActive: 'bg-blue-100 text-blue-800 border-blue-200',
        hoverBorder: 'group-hover:border-blue-300',
        hoverBg: 'hover:bg-blue-50/20',
        iconBg: 'bg-blue-50 text-blue-600',
        iconColor: 'text-blue-600',
        checkColor: 'text-blue-600'
      },
      patient: {
        bgActive: 'bg-indigo-50/90 border-indigo-500 shadow-md ring-2 ring-indigo-500/10 scale-[1.01]',
        badgeActive: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        hoverBorder: 'group-hover:border-indigo-300',
        hoverBg: 'hover:bg-indigo-50/20',
        iconBg: 'bg-indigo-50 text-indigo-600',
        iconColor: 'text-indigo-600',
        checkColor: 'text-indigo-600'
      },
      doctor: {
        bgActive: 'bg-emerald-50/90 border-emerald-500 shadow-md ring-2 ring-emerald-500/10 scale-[1.01]',
        badgeActive: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        hoverBorder: 'group-hover:border-emerald-300',
        hoverBg: 'hover:bg-emerald-50/20',
        iconBg: 'bg-emerald-50 text-emerald-600',
        iconColor: 'text-emerald-600',
        checkColor: 'text-emerald-600'
      },
      hospital: {
        bgActive: 'bg-cyan-50/90 border-cyan-500 shadow-md ring-2 ring-cyan-500/10 scale-[1.01]',
        badgeActive: 'bg-cyan-100 text-cyan-800 border-cyan-200',
        hoverBorder: 'group-hover:border-cyan-300',
        hoverBg: 'hover:bg-cyan-50/20',
        iconBg: 'bg-cyan-50 text-cyan-600',
        iconColor: 'text-cyan-600',
        checkColor: 'text-cyan-600'
      },
      pharmacy: {
        bgActive: 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-500/10 scale-[1.01]',
        badgeActive: 'bg-amber-100 text-amber-800 border-amber-200',
        hoverBorder: 'group-hover:border-amber-300',
        hoverBg: 'hover:bg-amber-50/20',
        iconBg: 'bg-amber-50 text-amber-600',
        iconColor: 'text-amber-600',
        checkColor: 'text-amber-600'
      },
      lab: {
        bgActive: 'bg-red-50/90 border-red-500 shadow-md ring-2 ring-red-500/10 scale-[1.01]',
        badgeActive: 'bg-red-100 text-red-800 border-red-200',
        hoverBorder: 'group-hover:border-red-300',
        hoverBg: 'hover:bg-red-50/20',
        iconBg: 'bg-red-50 text-red-600',
        iconColor: 'text-red-600',
        checkColor: 'text-red-600'
      }
    };
    return configs[id] || configs.landing;
  };

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
            const colors = getPortalColorConfig(item.id);
            return (
              <button
                key={item.id}
                id={`select-portal-${item.id}`}
                onClick={() => setPortal(item.id)}
                className={`w-full text-left p-4.5 rounded-2xl border transition-all duration-200 flex items-start gap-4 group relative cursor-pointer ${
                  isActive
                    ? colors.bgActive
                    : `border-slate-200/80 bg-white ${colors.hoverBg} ${colors.hoverBorder} shadow-xs hover:shadow-sm`
                }`}
              >
                {/* Left Active Glow Tag */}
                {isActive && (
                  <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-7 bg-blue-600 rounded-full" />
                )}

                <div className={`p-3 rounded-xl transition-colors ${isActive ? 'bg-blue-600 text-white' : colors.iconBg}`}>
                  {React.cloneElement(item.icon as React.ReactElement, {
                    className: `w-5 h-5 ${isActive ? 'text-white' : colors.iconColor}`
                  })}
                </div>

                <div className="flex-1 min-w-0 pr-1">
                  <div className="flex items-start justify-between gap-2">
                    <span className={`font-extrabold text-sm tracking-tight ${isActive ? 'text-slate-900' : 'text-slate-800 group-hover:text-blue-600'}`}>
                      {t(item.nameKey)}
                    </span>
                    {item.badge && (
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${
                        isActive ? colors.badgeActive : 'bg-slate-50 text-slate-500 border-slate-100'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-normal">
                    {item.description}
                  </p>
                </div>

                {isActive && (
                  <CheckCircle2 className={`w-5 h-5 ${colors.checkColor} shrink-0 self-center animate-in zoom-in-50 duration-150`} />
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
