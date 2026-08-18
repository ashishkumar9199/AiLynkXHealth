import React, { useState } from 'react';
import { Appointment } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Video, 
  Building2, 
  Clock, 
  User, 
  Calendar as CalendarIcon, 
  X,
  Check,
  AlertCircle,
  Clock3,
  CalendarDays
} from 'lucide-react';

interface InteractiveCalendarProps {
  appointments: Appointment[];
  rescheduleAppointment: (id: string, date: string, timeSlot: string) => void;
  updateAppointmentStatus: (id: string, status: Appointment['status']) => void;
  startVideoCall: (apt: Appointment) => void;
  loggedInPatient: any;
}

export const InteractiveCalendar: React.FC<InteractiveCalendarProps> = ({
  appointments,
  rescheduleAppointment,
  updateAppointmentStatus,
  startVideoCall,
  loggedInPatient
}) => {
  // Filter only current patient's appointments
  const myAppointments = appointments.filter(
    apt => apt.patientEmail.toLowerCase() === (loggedInPatient?.email || '').toLowerCase()
  );

  // Default calendar to August 2026, consistent with system context
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2026, 7, 18));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 7, 18));
  
  // Rescheduling states
  const [reschedulingAptId, setReschedulingAptId] = useState<string | null>(null);
  const [newDateInput, setNewDateInput] = useState<string>('2026-08-18');
  const [newTimeSlot, setNewTimeSlot] = useState<string>('09:00 AM');

  const availableSlots = [
    '09:00 AM',
    '10:30 AM',
    '11:00 AM',
    '01:30 PM',
    '02:00 PM',
    '03:30 PM',
    '04:00 PM',
    '05:00 PM'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Helper date generators
  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Navigate months
  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Format a date object as YYYY-MM-DD
  const formatDateString = (y: number, m: number, d: number): string => {
    const formattedMonth = String(m + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    return `${y}-${formattedMonth}-${formattedDay}`;
  };

  const selectedDateStr = formatDateString(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate()
  );

  // Appointments on currently selected date
  const selectedDateAppointments = myAppointments.filter(
    apt => apt.date === selectedDateStr
  );

  // Handle Rescheduling Confirm
  const handleConfirmReschedule = (aptId: string) => {
    if (!newDateInput) return;
    rescheduleAppointment(aptId, newDateInput, newTimeSlot);
    setReschedulingAptId(null);
  };

  // Generate blank spaces for previous month overflow
  const prevMonthDays = [];
  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const prevYear = month === 0 ? year - 1 : year;
  const prevMonthLength = getDaysInMonth(prevYear, prevMonthIndex);
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    prevMonthDays.push(prevMonthLength - i);
  }

  // Generate days in current month
  const monthDays = [];
  for (let i = 1; i <= daysInMonth; i++) {
    monthDays.push(i);
  }

  // Generate blank spaces for next month overflow to complete the grid (usually 42 cells total)
  const totalCells = 42;
  const nextMonthDays = [];
  const remainingCells = totalCells - (prevMonthDays.length + monthDays.length);
  for (let i = 1; i <= remainingCells; i++) {
    nextMonthDays.push(i);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left side: Interactive Monthly Grid Card */}
      <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-5 space-y-4">
        
        {/* Calendar Nav Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <CalendarDays className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                {months[month]} {year}
              </h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                Click a day to filter your schedule
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={prevMonth}
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-950 rounded-lg transition-all cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date(2026, 7, 18))}
              className="px-2 py-1 text-[10px] bg-white hover:bg-slate-50 text-slate-800 font-bold rounded-lg border border-slate-200 transition-all cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-950 rounded-lg transition-all cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Row */}
        <div className="grid grid-cols-7 gap-1 text-center">
          {daysOfWeek.map(day => (
            <span key={day} className="text-[10px] font-black text-slate-400 uppercase tracking-widest py-1 block">
              {day}
            </span>
          ))}
        </div>

        {/* Calendar Grid Cells */}
        <div className="grid grid-cols-7 gap-1 border-t border-slate-100 pt-2">
          
          {/* Previous Month Overflow days */}
          {prevMonthDays.map((d, index) => {
            const tempMonth = month === 0 ? 11 : month - 1;
            const tempYear = month === 0 ? year - 1 : year;
            const cellDateStr = formatDateString(tempYear, tempMonth, d);
            const appointmentsCount = myAppointments.filter(a => a.date === cellDateStr && a.status !== 'cancelled').length;
            
            return (
              <button
                key={`prev-${index}`}
                onClick={() => setSelectedDate(new Date(tempYear, tempMonth, d))}
                className="aspect-square p-1 rounded-xl text-[11px] font-semibold text-slate-300 hover:bg-slate-50 transition-all text-left flex flex-col justify-between items-start cursor-pointer group"
              >
                <span>{d}</span>
                {appointmentsCount > 0 && (
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full self-center mb-1 group-hover:scale-125 transition-transform"></span>
                )}
              </button>
            );
          })}

          {/* Current Month active days */}
          {monthDays.map(d => {
            const cellDateStr = formatDateString(year, month, d);
            const dayAppointments = myAppointments.filter(a => a.date === cellDateStr && a.status !== 'cancelled');
            const isToday = year === 2026 && month === 7 && d === 18;
            const isSelected = selectedDate.getFullYear() === year && selectedDate.getMonth() === month && selectedDate.getDate() === d;
            
            return (
              <button
                key={`curr-${d}`}
                onClick={() => {
                  setSelectedDate(new Date(year, month, d));
                  setReschedulingAptId(null);
                }}
                className={`aspect-square p-1.5 rounded-2xl text-xs font-black transition-all text-left flex flex-col justify-between items-start cursor-pointer border relative group ${
                  isSelected 
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20' 
                    : isToday 
                      ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100/60' 
                      : 'bg-white text-slate-800 border-slate-100 hover:bg-slate-50'
                }`}
              >
                <span className="text-[11px]">{d}</span>

                {/* Bullet indicator or compact line preview of today's appointment */}
                {dayAppointments.length > 0 && (
                  <div className="w-full flex gap-0.5 justify-center mt-1 pb-0.5">
                    {dayAppointments.map((apt, idx) => (
                      <span 
                        key={apt.id || idx}
                        className={`w-1.5 h-1.5 rounded-full transition-transform group-hover:scale-125 ${
                          isSelected 
                            ? 'bg-white' 
                            : apt.mode === 'video'
                              ? 'bg-blue-500'
                              : 'bg-indigo-500'
                        }`}
                        title={`${apt.doctorName} (${apt.timeSlot})`}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}

          {/* Next Month Overflow days */}
          {nextMonthDays.map((d, index) => {
            const tempMonth = month === 11 ? 0 : month + 1;
            const tempYear = month === 11 ? year + 1 : year;
            const cellDateStr = formatDateString(tempYear, tempMonth, d);
            const appointmentsCount = myAppointments.filter(a => a.date === cellDateStr && a.status !== 'cancelled').length;

            return (
              <button
                key={`next-${index}`}
                onClick={() => setSelectedDate(new Date(tempYear, tempMonth, d))}
                className="aspect-square p-1 rounded-xl text-[11px] font-semibold text-slate-300 hover:bg-slate-50 transition-all text-left flex flex-col justify-between items-start cursor-pointer group"
              >
                <span>{d}</span>
                {appointmentsCount > 0 && (
                  <span className="w-1.5 h-1.5 bg-slate-300 rounded-full self-center mb-1 group-hover:scale-125 transition-transform"></span>
                )}
              </button>
            );
          })}

        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-2 border-t border-slate-100 text-[10px] text-slate-500 font-bold uppercase tracking-wider">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-500 rounded-full block"></span>
            <span>Video Consult</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-indigo-500 rounded-full block"></span>
            <span>Clinic Visit</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-red-500 rounded-full block"></span>
            <span>Today (Aug 18, 2026)</span>
          </div>
        </div>
      </div>

      {/* Right side: Selected Day Dossier Panel */}
      <div className="lg:col-span-5 bg-slate-50/70 border border-slate-200 rounded-3xl p-5 space-y-4 shadow-inner min-h-[350px]">
        <div>
          <h4 className="font-extrabold text-slate-900 text-sm">
            Schedule for: <span className="text-blue-700 font-black">{months[selectedDate.getMonth()]} {selectedDate.getDate()}, {selectedDate.getFullYear()}</span>
          </h4>
          <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            {selectedDateAppointments.length === 1 
              ? '1 Appointment Scheduled' 
              : `${selectedDateAppointments.length} Appointments Scheduled`}
          </p>
        </div>

        <div className="space-y-4">
          {selectedDateAppointments.length === 0 ? (
            <div className="text-center py-10 px-4 space-y-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-300 mx-auto border border-slate-150 shadow-inner">
                <Clock3 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">No Telehealth Appointments</p>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-normal max-w-[220px] mx-auto">
                  You are completely free on this day! Book another session if you need medical consultation.
                </p>
              </div>
            </div>
          ) : (
            selectedDateAppointments.map(apt => {
              const isRescheduling = reschedulingAptId === apt.id;
              
              return (
                <div 
                  key={apt.id} 
                  className={`bg-white rounded-2xl border p-4.5 space-y-4 shadow-xs transition-all ${
                    apt.status === 'cancelled' ? 'opacity-65 border-slate-150 bg-slate-100/50' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-slate-200 shrink-0">
                        <img src={apt.doctorAvatar} alt={apt.doctorName} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h5 className="font-extrabold text-xs text-slate-900 leading-snug">{apt.doctorName}</h5>
                        <p className="text-[10px] text-blue-700 font-bold leading-normal">{apt.doctorSpecialty}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider border block mb-1 ${
                        apt.status === 'completed' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                          : apt.status === 'cancelled'
                            ? 'bg-slate-100 text-slate-600 border-slate-300'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {apt.status}
                      </span>
                      <span className="text-[9px] font-mono font-bold text-slate-400 block">#{apt.id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      {apt.mode === 'video' ? <Video className="w-3.5 h-3.5 text-blue-600" /> : <Building2 className="w-3.5 h-3.5 text-indigo-600" />}
                      <span className="capitalize">{apt.mode}</span>
                    </div>
                    <div className="flex items-center gap-1.5 justify-end">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{apt.timeSlot}</span>
                    </div>
                  </div>

                  {/* symptoms / symptoms note */}
                  {apt.symptoms && (
                    <div className="text-[11px] text-slate-600 bg-blue-50/30 p-2.5 rounded-xl border border-blue-100/60 leading-normal">
                      <strong>Symptoms:</strong> {apt.symptoms}
                    </div>
                  )}

                  {/* Normal Operations Buttons */}
                  {apt.status === 'scheduled' && !isRescheduling && (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <button
                        onClick={() => {
                          setReschedulingAptId(apt.id);
                          setNewDateInput(apt.date);
                          setNewTimeSlot(apt.timeSlot);
                        }}
                        className="py-2 text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold rounded-xl border border-slate-200 transition-all cursor-pointer text-center"
                      >
                        Reschedule Date
                      </button>
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'cancelled')}
                        className="py-2 text-[10px] bg-red-50 hover:bg-red-100 text-red-700 font-extrabold rounded-xl border border-red-200 transition-all cursor-pointer text-center"
                      >
                        Cancel Visit
                      </button>
                    </div>
                  )}

                  {/* Rescheduling Inline Dashboard Forms */}
                  {isRescheduling && (
                    <div className="p-3 bg-blue-50/50 border border-blue-200 rounded-xl space-y-3 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-blue-800 uppercase tracking-wider">Select Reschedule Slot</span>
                        <button 
                          onClick={() => setReschedulingAptId(null)}
                          className="p-1 hover:bg-blue-100 rounded text-blue-700"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">New Consult Date *</label>
                          <input 
                            type="date"
                            value={newDateInput}
                            onChange={(e) => setNewDateInput(e.target.value)}
                            min="2026-08-18"
                            max="2026-12-31"
                            className="w-full text-[11px] p-2 bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-1 focus:ring-blue-600 font-semibold"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-extrabold text-slate-500 uppercase tracking-wider mb-1">Available Hours *</label>
                          <div className="grid grid-cols-2 gap-1.5">
                            {availableSlots.map(slot => (
                              <button
                                key={slot}
                                type="button"
                                onClick={() => setNewTimeSlot(slot)}
                                className={`py-1.5 text-[10px] font-black rounded-lg transition-all border ${
                                  newTimeSlot === slot 
                                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs' 
                                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                                }`}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleConfirmReschedule(apt.id)}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-extrabold transition-all shadow-xs text-center"
                      >
                        Confirm Slot Change
                      </button>
                    </div>
                  )}

                  {/* Active Video Call Trigger */}
                  {apt.status === 'scheduled' && apt.mode === 'video' && !isRescheduling && (
                    <button
                      id={`join-video-call-btn-${apt.id}`}
                      onClick={() => startVideoCall(apt)}
                      className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Live Video Consult</span>
                    </button>
                  )}

                  {apt.ePrescription && (
                    <div className="p-2 bg-emerald-50 border border-emerald-150 rounded-xl text-[10px] text-emerald-900 font-medium">
                      <p className="font-bold text-emerald-950 mb-0.5">✓ Digital E-Prescription Issued</p>
                      <p className="font-mono text-[9px] truncate text-emerald-800">
                        {apt.ePrescription}
                      </p>
                    </div>
                  )}

                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
