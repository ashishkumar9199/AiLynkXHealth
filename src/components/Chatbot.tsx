import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { MedicalBotAvatar } from './MedicalBotAvatar';
import { 
  MessageSquare, 
  Bot,
  X, 
  Send, 
  User, 
  Calendar, 
  TestTube2, 
  Phone, 
  Mail, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  Activity, 
  HeartHandshake,
  Clock,
  Video,
  Building2,
  ChevronRight,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  customRender?: React.ReactNode;
}

interface PatientProfile {
  name: string;
  phone: string;
  email: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
}

export const Chatbot: React.FC = () => {
  const { 
    doctors, 
    bookAppointment, 
    requestHomeSample, 
    setPortal 
  } = useApp();

  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [hasPulse, setHasPulse] = useState(true);
  
  // Dialog flow state
  // 'none' | 'register' | 'book_select_doctor' | 'book_select_mode' | 'book_select_slot' | 'book_symptoms' | 'book_confirm' | 'lab_select_tests' | 'lab_details' | 'lab_confirm'
  const [flowState, setFlowState] = useState<string>('none');
  
  // Registration form temporary state
  const [regForm, setRegForm] = useState<PatientProfile>({
    name: '',
    phone: '',
    email: '',
    age: 30,
    gender: 'Male'
  });

  // Appointment booking temporary state
  const [bookingDoctor, setBookingDoctor] = useState<any>(null);
  const [bookingMode, setBookingMode] = useState<'video' | 'clinic'>('video');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingSlot, setBookingSlot] = useState('');
  const [bookingSymptoms, setBookingSymptoms] = useState('');

  // Lab test temporary state
  const [selectedLabTests, setSelectedLabTests] = useState<string[]>([]);
  const [labAddress, setLabAddress] = useState('');
  const [labPhone, setLabPhone] = useState('');
  const [labDate, setLabDate] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Standard tests list
  const availableTests = [
    { id: 'cbc', name: 'Complete Blood Count (CBC)', price: 25 },
    { id: 'hba1c', name: 'Diabetes Screen (HbA1c)', price: 30 },
    { id: 'lipid', name: 'Lipid Profile (Cholesterol)', price: 45 },
    { id: 'thyroid', name: 'Thyroid Panel (TSH, T3, T4)', price: 40 },
    { id: 'vitamin', name: 'Vitamin D & B12 Panel', price: 55 }
  ];

  const getSavedProfile = (): PatientProfile | null => {
    const profile = localStorage.getItem('patient_profile');
    if (profile) {
      try {
        return JSON.parse(profile);
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  useEffect(() => {
    // Add welcome message when chatbot mounts
    const saved = getSavedProfile();
    const welcomeText = saved 
      ? `Hello, ${saved.name}! Welcome back. I am Dr. AiLynkX, your health assistant. How can I care for you today?`
      : "Hello! I am Dr. AiLynkX, your personal medical assistant. I can guide you through booking appointments, registering your medical profile, or ordering laboratory home pick-ups. How may I help you today?";
    
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: welcomeText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setHasPulse(false);
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const addBotMessage = (text: string, customRender?: React.ReactNode) => {
    setMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'bot',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customRender
      }
    ]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: 'user',
        text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const resetFlow = () => {
    setFlowState('none');
    setBookingDoctor(null);
    setBookingSlot('');
    setBookingDate('');
    setBookingSymptoms('');
    setSelectedLabTests([]);
  };

  // Pre-configured questions
  const handlePredefinedQuestion = (question: string, reply: string) => {
    addUserMessage(question);
    setTimeout(() => {
      addBotMessage(reply);
    }, 500);
  };

  // Main input text query handling (keywords)
  const handleSendText = (text: string) => {
    if (!text.trim()) return;
    addUserMessage(text);
    setInputValue('');

    const query = text.toLowerCase();

    setTimeout(() => {
      // Intent matching
      if (query.includes('register') || query.includes('signup') || query.includes('sign up') || query.includes('create profile') || query.includes('my profile')) {
        startRegistrationFlow();
      } else if (query.includes('appointment') || query.includes('book') || query.includes('consultation') || query.includes('doctor') || query.includes('specialist')) {
        startBookingFlow();
      } else if (query.includes('lab') || query.includes('sample') || query.includes('blood') || query.includes('test') || query.includes('pickup') || query.includes('home test')) {
        startLabFlow();
      } else if (query.includes('emergency') || query.includes('sos') || query.includes('critical') || query.includes('help')) {
        addBotMessage("⚠️ EMERGENCY REMINDER: If you are experiencing a life-threatening medical emergency, please click the red SOS Quick Dial button at the top header immediately or call 911/your local emergency service. We can arrange immediate medical dispatch.");
      } else if (query.includes('pharmacy') || query.includes('medicine') || query.includes('order') || query.includes('pill') || query.includes('drug')) {
        addBotMessage("You can view partner pharmacies and order OTC or Prescription medicines directly on our Pharmacy portal. I've placed a quick link below to switch there.", (
          <button 
            onClick={() => {
              setPortal('pharmacy');
              setIsOpen(false);
            }} 
            className="mt-2 text-xs bg-amber-600 hover:bg-amber-700 text-white font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-xs"
          >
            Go to Pharmacy Portal →
          </button>
        ));
      } else if (query.includes('prescription') || query.includes('analyzer') || query.includes('scan') || query.includes('pdf')) {
        addBotMessage("Our platform features a highly accurate AI Prescription Analyzer. Simply scroll down the main landing page or upload your files to read exact medicine dosages and expert health reports.");
      } else {
        addBotMessage("I am processing your question. To assist you optimally, you can choose one of our primary medical workflows or ask about general clinic information.", (
          <div className="flex flex-col gap-1.5 mt-2">
            <button 
              onClick={() => startRegistrationFlow()} 
              className="text-left text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl transition-all"
            >
              👤 Register Patient Profile
            </button>
            <button 
              onClick={() => startBookingFlow()} 
              className="text-left text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl transition-all"
            >
              📅 Book Medical Appointment
            </button>
            <button 
              onClick={() => startLabFlow()} 
              className="text-left text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-3 py-2 rounded-xl transition-all"
            >
              🩸 Order Doorstep Lab Test
            </button>
          </div>
        ));
      }
    }, 600);
  };

  // --- 1. REGISTRATION FLOW ---
  const startRegistrationFlow = () => {
    const saved = getSavedProfile();
    if (saved) {
      addBotMessage(`You are already registered as **${saved.name}** (${saved.age}yo, ${saved.gender}). Would you like to update your credentials?`, (
        <div className="flex gap-2 mt-2">
          <button 
            onClick={() => {
              setRegForm(saved);
              setFlowState('register');
              addBotMessage("Please update your medical profile details below:");
            }} 
            className="text-xs bg-red-600 text-white px-3 py-1.5 rounded-xl font-bold hover:bg-red-700 transition-all"
          >
            Update Profile
          </button>
          <button 
            onClick={() => resetFlow()} 
            className="text-xs bg-slate-100 text-slate-600 px-3 py-1.5 rounded-xl font-bold hover:bg-slate-200 transition-all"
          >
            Keep Existing
          </button>
        </div>
      ));
    } else {
      setFlowState('register');
      addBotMessage("Let's set up your local patient profile! This secure profile is stored privately on your device so you can book sessions instantly.");
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.name || !regForm.phone || !regForm.email) return;

    localStorage.setItem('patient_profile', JSON.stringify(regForm));
    setFlowState('none');
    addBotMessage(`🎉 Profile successfully registered! Welcome, **${regForm.name}**. I've synchronized your patient credentials.`, (
      <div className="flex flex-col gap-1.5 mt-2">
        <p className="text-[10px] text-slate-400">What would you like to do next?</p>
        <div className="flex flex-wrap gap-1.5">
          <button 
            onClick={() => startBookingFlow()} 
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Book Appointment
          </button>
          <button 
            onClick={() => startLabFlow()} 
            className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-xl font-bold hover:bg-emerald-700 transition-all"
          >
            Order Lab Pickup
          </button>
        </div>
      </div>
    ));
  };

  // --- 2. BOOKING FLOW ---
  const startBookingFlow = () => {
    const saved = getSavedProfile();
    if (!saved) {
      addBotMessage("To book an appointment, please quickly register your patient profile first so doctors have your correct record.");
      setFlowState('register');
      return;
    }

    setFlowState('book_select_doctor');
    addBotMessage("Please choose a medical specialist from our verified panel:");
  };

  const selectDoctorForBooking = (doc: any) => {
    setBookingDoctor(doc);
    setFlowState('book_select_mode');
    addBotMessage(`You have selected **${doc.name}** (${doc.specialty}). Please choose consultation mode:`, (
      <div className="grid grid-cols-2 gap-2 mt-2">
        <button 
          onClick={() => {
            setBookingMode('video');
            proceedToSlotSelection('video');
          }}
          className="flex flex-col items-center gap-1 p-2.5 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 rounded-2xl transition-all text-xs text-slate-800 font-bold"
        >
          <Video className="w-4 h-4 text-blue-600" />
          <span>Video Call</span>
        </button>
        <button 
          onClick={() => {
            setBookingMode('clinic');
            proceedToSlotSelection('clinic');
          }}
          className="flex flex-col items-center gap-1 p-2.5 border border-slate-200 hover:border-blue-600 hover:bg-blue-50 rounded-2xl transition-all text-xs text-slate-800 font-bold"
        >
          <Building2 className="w-4 h-4 text-blue-600" />
          <span>Clinic Visit</span>
        </button>
      </div>
    ));
  };

  const proceedToSlotSelection = (mode: 'video' | 'clinic') => {
    setFlowState('book_select_slot');
    // Set a default date for convenience
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDateStr = tomorrow.toISOString().split('T')[0];
    setBookingDate(defaultDateStr);
    addBotMessage(`You selected: ${mode === 'video' ? 'Video Consultation' : 'In-Person Clinic'}. Please configure date & time:`);
  };

  const handleBookingDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingDate || !bookingSlot) return;

    setFlowState('book_symptoms');
    addBotMessage("Almost done! Please briefly summarize your medical reason or symptoms:");
  };

  const handleSymptomsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingSymptoms.trim()) return;

    setFlowState('book_confirm');
    const profile = getSavedProfile()!;
    addBotMessage(`Excellent. Here is your appointment summary with Dr. ${bookingDoctor.name}. Please confirm scheduling:`, (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3 mt-1 shadow-xs animate-in zoom-in-95 duration-200">
        <div className="flex gap-2">
          <img src={bookingDoctor.avatar} className="w-10 h-10 rounded-xl object-cover" />
          <div>
            <p className="font-extrabold text-slate-900">{bookingDoctor.name}</p>
            <p className="text-slate-500 text-[10px]">{bookingDoctor.specialty}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 text-[11px] border-t border-slate-100 pt-2 text-slate-600">
          <p>📅 <strong>Date:</strong> {bookingDate}</p>
          <p>⏰ <strong>Time:</strong> {bookingSlot}</p>
          <p>🛡️ <strong>Patient:</strong> {profile.name}</p>
          <p>💵 <strong>Fee:</strong> ${bookingDoctor.fee}</p>
        </div>
        <div className="text-[11px] bg-white p-2 rounded-lg border border-slate-100 text-slate-500">
          <strong>Symptoms:</strong> {bookingSymptoms}
        </div>
        <button 
          onClick={() => triggerRealBooking()}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl transition-all shadow-xs text-center uppercase tracking-wider text-[10px]"
        >
          Confirm Scheduled Appointment
        </button>
      </div>
    ));
  };

  const triggerRealBooking = async () => {
    const profile = getSavedProfile()!;
    
    const newAppointment = {
      patientName: profile.name,
      patientPhone: profile.phone,
      patientEmail: profile.email,
      patientAge: Number(profile.age),
      patientGender: profile.gender,
      doctorId: bookingDoctor.id,
      doctorName: bookingDoctor.name,
      doctorSpecialty: bookingDoctor.specialty,
      doctorAvatar: bookingDoctor.avatar,
      mode: bookingMode,
      date: bookingDate,
      timeSlot: bookingSlot,
      symptoms: bookingSymptoms
    };

    try {
      const result = await bookAppointment(newAppointment);
      setFlowState('none');
      addBotMessage(`🎉 Medical consultation confirmed! Appointment record #${result.id} is securely assigned.`, (
        <div className="flex flex-col gap-1.5 mt-2">
          <p className="text-[10px] text-slate-400">You can manage this slot, chat with clinicians, or join the video room in your Patient Dashboard.</p>
          <button 
            onClick={() => {
              setPortal('patient');
              setIsOpen(false);
            }} 
            className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-2 rounded-xl transition-all shadow-xs self-start"
          >
            Go to Patient Dashboard →
          </button>
        </div>
      ));
    } catch (err) {
      addBotMessage("Sorry, I ran into an issue saving your appointment. Please retry shortly.");
    }
  };

  // --- 3. HOME LAB SAMPLE PICKUP FLOW ---
  const startLabFlow = () => {
    const profile = getSavedProfile();
    if (!profile) {
      addBotMessage("To register a lab test doorstep pickup, please fill out your patient profile first.");
      setFlowState('register');
      return;
    }

    setFlowState('lab_select_tests');
    setSelectedLabTests([]);
    addBotMessage("Let's organize a doorstep sample collection. Please select your clinical tests:");
  };

  const toggleLabTest = (testId: string) => {
    setSelectedLabTests(prev => 
      prev.includes(testId) ? prev.filter(id => id !== testId) : [...prev, testId]
    );
  };

  const handleLabTestsSubmit = () => {
    if (selectedLabTests.length === 0) return;
    const profile = getSavedProfile()!;
    setLabPhone(profile.phone);
    setFlowState('lab_details');
    addBotMessage("Great choices. Where and when should the certified phlebotomist arrive for sample collection?");
  };

  const handleLabDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!labAddress.trim() || !labPhone || !labDate) return;

    setFlowState('lab_confirm');
    const selectedObj = availableTests.filter(t => selectedLabTests.includes(t.id));
    const totalAmount = selectedObj.reduce((sum, t) => sum + t.price, 0);

    addBotMessage("Please review your Doorstep Lab Request:", (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs space-y-3 mt-1 shadow-xs animate-in zoom-in-95 duration-200">
        <h4 className="font-extrabold text-slate-900 border-b border-slate-200 pb-1.5 uppercase tracking-wider text-[10px] text-red-600 flex items-center gap-1">
          <TestTube2 className="w-3.5 h-3.5" />
          Home Lab Requisition
        </h4>
        <div className="space-y-1">
          <p className="font-bold text-slate-700">Selected Diagnostics:</p>
          <ul className="list-disc list-inside text-slate-600 text-[11px] space-y-0.5">
            {selectedObj.map(t => (
              <li key={t.id}>{t.name} - ${t.price}</li>
            ))}
          </ul>
        </div>
        <div className="grid grid-cols-2 gap-1.5 text-[11px] pt-1.5 border-t border-slate-100 text-slate-600">
          <p>📅 <strong>Date:</strong> {labDate}</p>
          <p>📞 <strong>Phone:</strong> {labPhone}</p>
          <p className="col-span-2">📍 <strong>Address:</strong> {labAddress}</p>
          <p className="col-span-2 text-slate-900 font-extrabold text-xs pt-1">
            Total Amount: ${totalAmount}
          </p>
        </div>
        <button 
          onClick={() => triggerRealLabRequest()}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-2.5 rounded-xl transition-all shadow-xs text-center uppercase tracking-wider text-[10px]"
        >
          Book Doorstep Lab Pickup
        </button>
      </div>
    ));
  };

  const triggerRealLabRequest = async () => {
    const profile = getSavedProfile()!;
    const selectedObj = availableTests.filter(t => selectedLabTests.includes(t.id));
    const totalAmount = selectedObj.reduce((sum, t) => sum + t.price, 0);

    const newLabReq = {
      patientName: profile.name,
      patientPhone: labPhone,
      patientAddress: labAddress,
      selectedTests: selectedObj.map(t => t.name),
      preferredDate: labDate,
      preferredTime: '08:00 AM - 11:00 AM', // standard fast hours
      totalAmount
    };

    try {
      await requestHomeSample(newLabReq);
      setFlowState('none');
      addBotMessage("🩸 Your Home Lab requisition is booked! A licensed phlebotomist will text you before arrival. Results will be uploaded directly to your Health Dashboard.", (
        <button 
          onClick={() => {
            setPortal('patient');
            setIsOpen(false);
          }} 
          className="mt-2 text-xs bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-3 py-1.5 rounded-xl transition-all shadow-xs"
        >
          Check Dashboard Reports →
        </button>
      ));
    } catch (err) {
      addBotMessage("Sorry, I had an issue scheduling the doorstep collection. Please try again.");
    }
  };


  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      
      {/* Floating Chat Bubble */}
      {!isOpen && (
        <button
          id="dr-ailynkx-bubble-trigger"
          onClick={() => setIsOpen(true)}
          className="relative bg-red-600 hover:bg-red-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-105 duration-300 flex items-center justify-center cursor-pointer group border-2 border-white"
          title="Consult Dr. AiLynkX"
        >
          {hasPulse && (
            <span className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-60"></span>
          )}
          <MedicalBotAvatar size={24} showBackground={false} className="relative z-10" />
          <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-md whitespace-nowrap tracking-wide border border-slate-700">
            Dr. AiLynkX Carebot
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div 
          id="dr-ailynkx-chatbox"
          className="bg-white w-[340px] sm:w-[380px] h-[520px] rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-6 fade-in duration-300"
        >
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center overflow-hidden">
                  <MedicalBotAvatar size={40} showBackground={true} />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900"></span>
              </div>
              <div>
                <h3 className="font-extrabold text-sm tracking-tight flex items-center gap-1.5">
                  Dr. AiLynkX
                  <span className="text-[9px] bg-red-600 text-white font-black px-1.5 py-0.5 rounded uppercase tracking-wider">
                    Medical Assistant
                  </span>
                </h3>
              </div>
            </div>
            
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            
            {/* Disclaimer pill */}
            <div className="text-center">
              <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-500 text-[9px] px-2.5 py-1 rounded-lg font-medium border border-slate-200">
                <AlertCircle className="w-3 h-3 text-slate-400" />
                Concierge assistant. For immediate emergencies call 911.
              </span>
            </div>

            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} items-start`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 mt-0.5 border border-slate-100 shadow-xs">
                    <MedicalBotAvatar size={28} showBackground={true} />
                  </div>
                )}
                <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'} space-y-1 max-w-[80%]`}>
                  <div
                    className={`rounded-2xl px-3.5 py-2.5 text-xs shadow-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-red-600 text-white font-medium rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none font-medium'
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.text}</p>
                    {msg.customRender && (
                      <div className="mt-1">{msg.customRender}</div>
                    )}
                  </div>
                  <span className="text-[9px] text-slate-400 font-medium px-1">
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* --- CUSTOM INLINE ACTION VIEWS DEPENDING ON STATE --- */}
            
            {/* Registration Form */}
            {flowState === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in duration-200 shadow-sm">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Create Health Profile</h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={regForm.name}
                    onChange={e => setRegForm({...regForm, name: e.target.value})}
                    placeholder="John Doe"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold">Age</label>
                    <input
                      type="number"
                      required
                      value={regForm.age}
                      onChange={e => setRegForm({...regForm, age: Number(e.target.value)})}
                      className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-500 font-bold">Gender</label>
                    <select
                      value={regForm.gender}
                      onChange={e => setRegForm({...regForm, gender: e.target.value as any})}
                      className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Mobile Phone</label>
                  <input
                    type="tel"
                    required
                    value={regForm.phone}
                    onChange={e => setRegForm({...regForm, phone: e.target.value})}
                    placeholder="+1 (555) 0199"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    value={regForm.email}
                    onChange={e => setRegForm({...regForm, email: e.target.value})}
                    placeholder="john@example.com"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                  />
                </div>

                <div className="flex gap-2 pt-1.5">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-2 rounded-xl transition-all shadow-xs text-center text-[10px] uppercase tracking-wider"
                  >
                    Save My Profile
                  </button>
                  <button
                    type="button"
                    onClick={() => resetFlow()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 rounded-xl transition-all text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Doctor Selection Horizontal List */}
            {flowState === 'book_select_doctor' && (
              <div className="space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-bold px-1 uppercase">
                  <span>Available Panel ({doctors.filter(d => d.approvalStatus === 'approved').length})</span>
                  <button onClick={() => resetFlow()} className="text-slate-500 hover:text-red-600">Cancel</button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                  {doctors.filter(d => d.approvalStatus === 'approved').map(doc => (
                    <div 
                      key={doc.id} 
                      className="bg-white border border-slate-200 rounded-2xl p-3 min-w-[200px] max-w-[200px] shrink-0 snap-center flex flex-col justify-between shadow-xs hover:border-blue-600 transition-all"
                    >
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <img src={doc.avatar} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="font-extrabold text-[11px] text-slate-900 leading-tight">{doc.name}</p>
                            <p className="text-[9px] text-slate-500 font-medium leading-tight">{doc.specialty}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-600 leading-relaxed line-clamp-2">{doc.bio}</p>
                      </div>
                      
                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-extrabold text-slate-900">${doc.fee}/session</span>
                        <button
                          onClick={() => selectDoctorForBooking(doc)}
                          className="bg-red-600 hover:bg-red-700 text-white font-black px-2.5 py-1 rounded-lg text-[9px] uppercase tracking-wide transition-all shadow-xs"
                        >
                          Select
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Date & Time Slot Form */}
            {flowState === 'book_select_slot' && (
              <form onSubmit={handleBookingDetailsSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in duration-200 shadow-sm">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Select Consultation Schedule</h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Preferred Date</label>
                  <input
                    type="date"
                    required
                    value={bookingDate}
                    onChange={e => setBookingDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Preferred Time Slot</label>
                  <select
                    required
                    value={bookingSlot}
                    onChange={e => setBookingSlot(e.target.value)}
                    className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                  >
                    <option value="">-- Choose Slot --</option>
                    <option value="09:00 AM - 09:30 AM">09:00 AM - 09:30 AM</option>
                    <option value="11:30 AM - 12:00 PM">11:30 AM - 12:00 PM</option>
                    <option value="02:30 PM - 03:00 PM">02:30 PM - 03:00 PM</option>
                    <option value="04:00 PM - 04:30 PM">04:00 PM - 04:30 PM</option>
                  </select>
                </div>

                <div className="flex gap-2 pt-1">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-2 rounded-xl transition-all shadow-xs text-center text-[10px] uppercase tracking-wider"
                  >
                    Proceed to Symptoms
                  </button>
                  <button
                    type="button"
                    onClick={() => resetFlow()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 rounded-xl transition-all text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Symptoms Input Form */}
            {flowState === 'book_symptoms' && (
              <form onSubmit={handleSymptomsSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in duration-200 shadow-sm">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Describe Reason for Visit</h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Symptoms / Notes</label>
                  <textarea
                    required
                    rows={3}
                    value={bookingSymptoms}
                    onChange={e => setBookingSymptoms(e.target.value)}
                    placeholder="Describe any pain, duration, or special requests..."
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium leading-normal resize-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-2 rounded-xl transition-all shadow-xs text-center text-[10px] uppercase tracking-wider"
                  >
                    Review Schedule
                  </button>
                  <button
                    type="button"
                    onClick={() => resetFlow()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 rounded-xl transition-all text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {/* Lab Test Selection Checklist */}
            {flowState === 'lab_select_tests' && (
              <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in duration-200 shadow-sm">
                <div className="flex justify-between items-center pb-1 border-b border-slate-100">
                  <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Select Lab Tests</h4>
                  <button onClick={() => resetFlow()} className="text-[10px] text-slate-400 hover:text-red-600">Cancel</button>
                </div>

                <div className="space-y-2">
                  {availableTests.map(t => (
                    <label 
                      key={t.id} 
                      className={`flex items-center justify-between p-2 rounded-xl border cursor-pointer transition-all ${
                        selectedLabTests.includes(t.id) 
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold' 
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-700 font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={selectedLabTests.includes(t.id)}
                          onChange={() => toggleLabTest(t.id)}
                          className="accent-emerald-600 rounded"
                        />
                        <span className="text-[11px]">{t.name}</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-500">${t.price}</span>
                    </label>
                  ))}
                </div>

                <div className="pt-1.5 flex items-center justify-between border-t border-slate-100">
                  <span className="text-[10px] text-slate-400 font-bold uppercase">
                    Total: ${availableTests.filter(t => selectedLabTests.includes(t.id)).reduce((sum, t) => sum + t.price, 0)}
                  </span>
                  <button
                    disabled={selectedLabTests.length === 0}
                    onClick={handleLabTestsSubmit}
                    className="bg-red-600 hover:bg-red-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-black px-4 py-2 rounded-xl text-[10px] uppercase tracking-wider transition-all shadow-xs"
                  >
                    Proceed to Delivery
                  </button>
                </div>
              </div>
            )}

            {/* Lab Patient & Date Details */}
            {flowState === 'lab_details' && (
              <form onSubmit={handleLabDetailsSubmit} className="bg-white border border-slate-200 rounded-2xl p-4 text-xs space-y-3 animate-in fade-in duration-200 shadow-sm">
                <h4 className="font-extrabold text-slate-800 uppercase tracking-wider text-[10px]">Pickup Date & Address</h4>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Contact Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={labPhone}
                    onChange={e => setLabPhone(e.target.value)}
                    placeholder="+1 (555) 0199"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Appointment Date</label>
                  <input
                    type="date"
                    required
                    value={labDate}
                    onChange={e => setLabDate(e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-500 font-bold">Complete Address for Pickup</label>
                  <input
                    type="text"
                    required
                    value={labAddress}
                    onChange={e => setLabAddress(e.target.value)}
                    placeholder="123 Health Street, Apt 4B"
                    className="w-full px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white text-slate-800 focus:outline-none focus:border-red-600 transition-all font-medium"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-extrabold py-2 rounded-xl transition-all shadow-xs text-center text-[10px] uppercase tracking-wider"
                  >
                    Review Lab Pickup
                  </button>
                  <button
                    type="button"
                    onClick={() => resetFlow()}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-2 rounded-xl transition-all text-[10px]"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Bar */}
          {flowState === 'none' && (
            <div className="px-3 py-2 bg-white border-t border-slate-150 overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
              <button 
                onClick={() => handlePredefinedQuestion(
                  "Where are clinics located?", 
                  "Our network of premium diagnostic labs and clinic centers are spread downtown. You can manage and contact individual stores and labs directly from the Pharmacy or patient portals."
                )}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap"
              >
                📍 Clinic locations
              </button>
              <button 
                onClick={() => handlePredefinedQuestion(
                  "Is there emergency dispatch?", 
                  "Absolutely. We support critical SOS quick-dial buttons inside the header bar. Pressing the SOS triggers live coordinate alerts for immediate health response dispatch."
                )}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap"
              >
                ⚠️ Emergency hotline
              </button>
              <button 
                onClick={() => handlePredefinedQuestion(
                  "How to scan prescription PDFs?", 
                  "Scroll to the 'AI Prescription Analyzer' section on the main landing portal. Drag and drop any prescription PDF or medical document. Our server analyzes medications and alerts immediately!"
                )}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2.5 py-1.5 rounded-xl transition-all whitespace-nowrap"
              >
                📄 Scan Prescriptions
              </button>
            </div>
          )}

          {/* Input Footer */}
          <div className="p-3 bg-white border-t border-slate-150 flex items-center gap-2 shrink-0">
            <input
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSendText(inputValue)}
              placeholder="Ask Dr. AiLynkX or describe symptoms..."
              className="flex-1 bg-slate-50 border border-slate-200 px-3.5 py-2.5 rounded-2xl text-xs focus:outline-none focus:bg-white focus:border-red-600 transition-all font-medium text-slate-800"
            />
            <button
              id="chatbot-send-msg-btn"
              onClick={() => handleSendText(inputValue)}
              className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-xl transition-all flex items-center justify-center cursor-pointer shadow-xs shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
