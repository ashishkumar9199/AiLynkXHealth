import React, { useState, useMemo } from 'react';
import { Doctor } from '../types';
import { 
  Calendar, 
  Clock, 
  User, 
  Sparkles, 
  ChevronRight, 
  Star, 
  Filter, 
  HelpCircle,
  AlertCircle,
  CheckCircle2,
  Stethoscope
} from 'lucide-react';

interface DoctorAvailabilityHeatmapProps {
  doctors: Doctor[];
  onBookQuickSlot: (doctor: Doctor, dateStr: string, slotStr: string) => void;
}

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '09:00 AM',
  '10:30 AM',
  '11:00 AM',
  '01:30 PM',
  '02:00 PM',
  '03:30 PM',
  '04:00 PM',
  '05:00 PM'
];

// Helper to determine which days a doctor works based on their ID
const getDoctorWorkingDays = (docId: string): string[] => {
  switch (docId) {
    case 'doc-1': return ['Monday', 'Wednesday', 'Friday'];
    case 'doc-2': return ['Tuesday', 'Thursday', 'Saturday'];
    case 'doc-3': return ['Monday', 'Tuesday', 'Thursday'];
    case 'doc-4': return ['Wednesday', 'Friday', 'Sunday'];
    case 'doc-5': return ['Monday', 'Wednesday', 'Thursday', 'Friday'];
    case 'doc-6': return ['Tuesday', 'Thursday', 'Friday', 'Saturday'];
    default:
      // Fallback hash-based days
      const days = [];
      if (docId.charCodeAt(docId.length - 1) % 2 === 0) {
        days.push('Monday', 'Wednesday', 'Friday');
      } else {
        days.push('Tuesday', 'Thursday', 'Saturday');
      }
      return days;
  }
};

export const DoctorAvailabilityHeatmap: React.FC<DoctorAvailabilityHeatmapProps> = ({
  doctors,
  onBookQuickSlot
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('All');
  const [hoveredCell, setHoveredCell] = useState<{ day: string; slot: string; doctorsList: Doctor[] } | null>(null);
  const [selectedCell, setSelectedCell] = useState<{ day: string; slot: string; doctorsList: Doctor[] }>({
    day: 'Monday',
    slot: '09:00 AM',
    doctorsList: []
  });

  // Extract all unique specialties for filter dropdown
  const specialties = useMemo(() => {
    const list = new Set<string>();
    doctors.forEach(d => {
      if (d.specialty && d.approvalStatus === 'approved') {
        list.add(d.specialty);
      }
    });
    return ['All', ...Array.from(list)];
  }, [doctors]);

  // Filter approved doctors
  const approvedDoctors = useMemo(() => {
    return doctors.filter(d => d.approvalStatus === 'approved' && d.isActive);
  }, [doctors]);

  // Compute availability mapping matrix
  const availabilityMatrix = useMemo(() => {
    const matrix: Record<string, Record<string, Doctor[]>> = {};

    WEEKDAYS.forEach(day => {
      matrix[day] = {};
      TIME_SLOTS.forEach(slot => {
        matrix[day][slot] = [];
      });
    });

    approvedDoctors.forEach(doc => {
      // Check specialty filter
      if (selectedSpecialty !== 'All' && doc.specialty !== selectedSpecialty) {
        return;
      }
      // Check doctor filter
      if (selectedDoctorId !== 'All' && doc.id !== selectedDoctorId) {
        return;
      }

      const workingDays = getDoctorWorkingDays(doc.id);
      workingDays.forEach(day => {
        // Many doctors have basic slots, map availability slots
        const slots = doc.availability && doc.availability.length > 0 
          ? doc.availability 
          : ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'];

        slots.forEach(slot => {
          // Normalize slots to match TIME_SLOTS closest entries or matches
          if (matrix[day] && matrix[day][slot]) {
            matrix[day][slot].push(doc);
          } else {
            // Match closest approximate slot or push directly
            const closest = TIME_SLOTS.find(s => s.substring(0, 2) === slot.substring(0, 2));
            if (closest && matrix[day][closest]) {
              matrix[day][closest].push(doc);
            }
          }
        });
      });
    });

    return matrix;
  }, [approvedDoctors, selectedSpecialty, selectedDoctorId]);

  // Update initial selected cell matching current filters
  useMemo(() => {
    const list = availabilityMatrix[selectedCell.day]?.[selectedCell.slot] || [];
    setSelectedCell(prev => ({
      ...prev,
      doctorsList: list
    }));
  }, [availabilityMatrix, selectedCell.day, selectedCell.slot]);

  // Color helper based on density count
  const getCellColorClass = (count: number) => {
    if (count === 0) return 'bg-slate-50 text-slate-300 hover:bg-slate-100/50 border-slate-100';
    if (count === 1) return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70 border-emerald-100';
    if (count === 2) return 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200/80 border-emerald-200';
    return 'bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-700 shadow-xs';
  };

  // Convert weekday to upcoming date string (Aug 2026 dates)
  const getNextDateForWeekday = (weekday: string): string => {
    const dayMap: Record<string, number> = {
      'Monday': 17,    // Aug 17, 2026
      'Tuesday': 18,   // Aug 18, 2026 (Today)
      'Wednesday': 19, // Aug 19, 2026
      'Thursday': 20,  // Aug 20, 2026
      'Friday': 21,    // Aug 21, 2026
      'Saturday': 22,  // Aug 22, 2026
      'Sunday': 23     // Aug 23, 2026
    };
    const dayNum = dayMap[weekday] || 18;
    return `2026-08-${dayNum}`;
  };

  return (
    <div className="space-y-6">
      {/* Visual Heatmap Header with Filters */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 border border-blue-100">
              <Stethoscope className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-snug">Doctor Availability Heat Map</h3>
              <p className="text-xs text-slate-500 mt-0.5">Filter specialties or specific doctors to visualize weekly consultation peak slots.</p>
            </div>
          </div>

          {/* Color Spectrum Legend */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-150 px-3 py-1.5 rounded-2xl self-start text-[10px] font-bold text-slate-500 uppercase tracking-wider">
            <span>Unavailable</span>
            <span className="w-3 h-3 bg-slate-100 rounded-sm border border-slate-200" />
            <span className="w-3 h-3 bg-emerald-100 rounded-sm border border-emerald-200" />
            <span className="w-3 h-3 bg-emerald-200 rounded-sm border border-emerald-300" />
            <span className="w-3 h-3 bg-emerald-600 rounded-sm border border-emerald-700" />
            <span>High Density</span>
          </div>
        </div>

        {/* Filters Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Specialty Filter</span>
            </label>
            <select
              value={selectedSpecialty}
              onChange={(e) => {
                setSelectedSpecialty(e.target.value);
                setSelectedDoctorId('All');
              }}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-bold text-slate-800"
            >
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec === 'All' ? '🏥 All Medical Specialties' : spec}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
              <User className="w-3 h-3" />
              <span>Specific Physician</span>
            </label>
            <select
              value={selectedDoctorId}
              onChange={(e) => setSelectedDoctorId(e.target.value)}
              className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-bold text-slate-800"
            >
              <option value="All">👤 All Registered Physicians</option>
              {approvedDoctors
                .filter(d => selectedSpecialty === 'All' || d.specialty === selectedSpecialty)
                .map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Weekly Heatmap Matrix Box */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="overflow-x-auto">
            <div className="min-w-[640px] space-y-1">
              
              {/* Heatmap Column Hours Headers */}
              <div className="grid grid-cols-8 gap-1.5 pb-2 text-center border-b border-slate-100">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-left self-end">
                  WEEKDAY
                </span>
                {TIME_SLOTS.map(slot => (
                  <span key={slot} className="text-[10px] font-black text-slate-800 uppercase tracking-wider flex flex-col items-center justify-center py-1">
                    <Clock className="w-3 h-3 text-slate-400 mb-0.5" />
                    <span>{slot}</span>
                  </span>
                ))}
              </div>

              {/* Rows (Days) */}
              <div className="pt-2 space-y-1.5">
                {WEEKDAYS.map(day => {
                  return (
                    <div key={day} className="grid grid-cols-8 gap-1.5 items-center">
                      {/* Row Header (Day Name) */}
                      <span className="text-xs font-black text-slate-900 pr-2 truncate">
                        {day}
                      </span>

                      {/* Columns (Slots) */}
                      {TIME_SLOTS.map(slot => {
                        const cellDoctors = availabilityMatrix[day]?.[slot] || [];
                        const count = cellDoctors.length;
                        const isSelected = selectedCell.day === day && selectedCell.slot === slot;
                        
                        return (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              setSelectedCell({ day, slot, doctorsList: cellDoctors });
                            }}
                            onMouseEnter={() => setHoveredCell({ day, slot, doctorsList: cellDoctors })}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`aspect-video rounded-xl border flex flex-col items-center justify-center p-1.5 transition-all text-center relative cursor-pointer active:scale-95 ${getCellColorClass(count)} ${
                              isSelected 
                                ? 'ring-3 ring-blue-600/30 border-blue-600 font-extrabold scale-[1.02] shadow-md z-10' 
                                : ''
                            }`}
                          >
                            <span className="text-xs font-black">{count}</span>
                            <span className="text-[9px] font-bold opacity-75 uppercase">
                              {count === 1 ? 'doc' : 'docs'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })}
              </div>

            </div>
          </div>

          {/* Quick instructions & stats badge */}
          <div className="flex items-start gap-2 bg-blue-50/50 p-3 rounded-2xl border border-blue-100 text-[11px] text-slate-600 leading-relaxed">
            <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <div>
              <strong>Interactive Visual Analytics:</strong> Each box displays the number of active physicians available at that specific hour. Click any cell to view profiles of available physicians, compare consultation fees, and instantly submit a booking.
            </div>
          </div>
        </div>

        {/* Selected Hour Consultation Dossier Panel */}
        <div className="lg:col-span-4 bg-slate-50 rounded-3xl p-5 border border-slate-200 shadow-inner space-y-4 min-h-[420px]">
          <div>
            <span className="text-[10px] font-black text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
              {selectedCell.day}s @ {selectedCell.slot}
            </span>
            <h4 className="font-extrabold text-slate-900 text-sm mt-1.5">Available Doctors</h4>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {selectedCell.doctorsList.length === 1 
                ? '1 Practitioner Available' 
                : `${selectedCell.doctorsList.length} Practitioners Available`}
            </p>
          </div>

          <div className="space-y-3">
            {selectedCell.doctorsList.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-3 bg-white rounded-2xl border border-slate-150 shadow-inner">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto" />
                <div>
                  <p className="text-xs font-bold text-slate-800">No Doctor Scheduled</p>
                  <p className="text-[11px] text-slate-400 mt-1 leading-normal max-w-[200px] mx-auto">
                    No doctor is matches these filters for this day/time. Try filtering other specialties.
                  </p>
                </div>
              </div>
            ) : (
              selectedCell.doctorsList.map(doc => {
                const dateStr = getNextDateForWeekday(selectedCell.day);
                
                return (
                  <div key={doc.id} className="bg-white p-3.5 rounded-2xl border border-slate-150 shadow-xs space-y-3 hover:border-slate-300 transition-colors">
                    <div className="flex items-start gap-2.5">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-100 shrink-0">
                        <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="font-black text-xs text-slate-900 truncate leading-none mb-1">{doc.name}</h5>
                        <p className="text-[10px] text-blue-700 font-bold truncate leading-none mb-1.5">{doc.specialty}</p>
                        
                        <div className="flex items-center gap-2 text-[10px] text-slate-500 font-semibold">
                          <span className="flex items-center gap-0.5 text-amber-500">
                            <Star className="w-3 h-3 fill-amber-500" />
                            <strong>{doc.rating}</strong>
                          </span>
                          <span>•</span>
                          <span>{doc.experienceYears} yrs exp</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] bg-slate-50 p-2 rounded-xl border border-slate-100 font-semibold text-slate-600">
                      <span>Consultation Fee</span>
                      <span className="text-slate-900 font-extrabold">${doc.fee}</span>
                    </div>

                    <button
                      onClick={() => onBookQuickSlot(doc, dateStr, selectedCell.slot)}
                      className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-[11px] font-extrabold transition-all shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Book Slot ({selectedCell.slot})</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
