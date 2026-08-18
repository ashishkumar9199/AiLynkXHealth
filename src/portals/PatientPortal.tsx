import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VideoCallModal } from '../components/VideoCallModal';
import { Appointment } from '../types';
import { InsuranceVerification } from '../components/InsuranceVerification';
import { PatientProfileSection } from '../components/PatientProfileSection';
import { AIPrescriptionAnalyzer } from '../components/AIPrescriptionAnalyzer';
import { 
  Calendar, 
  Video, 
  Building2, 
  FileText, 
  TestTube2, 
  Package, 
  Clock, 
  CheckCircle2, 
  Upload, 
  Plus, 
  Download,
  AlertCircle,
  ArrowRight,
  ExternalLink,
  User,
  Lock,
  LogOut,
  Key,
  Eye,
  EyeOff,
  Mail,
  Check,
  ShieldCheck,
  Sparkles
} from 'lucide-react';

export const PatientPortal: React.FC = () => {
  const { 
    appointments, 
    sampleRequests, 
    orders, 
    uploadedDocs, 
    uploadDocument, 
    startVideoCall, 
    activeVideoCall, 
    endVideoCall,
    setPortal,
    addNotification,
    t 
  } = useApp();

  // Patient Authentication State
  const [loggedInPatient, setLoggedInPatient] = useState<any>(() => {
    const saved = localStorage.getItem('logged_in_patient');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return null;
  });

  // Storage listener to keep state perfectly synchronized in real-time
  useEffect(() => {
    const checkAuth = () => {
      const saved = localStorage.getItem('logged_in_patient');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (JSON.stringify(parsed) !== JSON.stringify(loggedInPatient)) {
            setLoggedInPatient(parsed);
          }
        } catch (e) {
          // ignore
        }
      } else if (loggedInPatient) {
        setLoggedInPatient(null);
      }
    };

    window.addEventListener('storage', checkAuth);
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener('storage', checkAuth);
      clearInterval(interval);
    };
  }, [loggedInPatient]);

  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  
  // Login input states
  const [signInEmail, setSignInEmail] = useState('');
  const [signInPassword, setSignInPassword] = useState('');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInError, setSignInError] = useState('');

  // Signup input states
  const [signUpName, setSignUpName] = useState('');
  const [signUpEmail, setSignUpEmail] = useState('');
  const [signUpPassword, setSignUpPassword] = useState('');
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [signUpPhone, setSignUpPhone] = useState('');
  const [signUpAge, setSignUpAge] = useState('30');
  const [signUpGender, setSignUpGender] = useState('Male');
  const [signUpBloodGroup, setSignUpBloodGroup] = useState('O+');
  const [signUpError, setSignUpError] = useState('');

  const getRegisteredPatients = () => {
    const stored = localStorage.getItem('aily_registered_patients');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        name: 'Demo Patient',
        email: 'patient@healthconnect.org',
        password: 'password123',
        phone: '+1 555-0199',
        age: '30',
        gender: 'Male',
        bloodGroup: 'O+'
      }
    ];
  };

  const handleSignInSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignInError('');

    if (!signInEmail.trim() || !signInPassword.trim()) {
      setSignInError('Please fill in all fields.');
      return;
    }

    const patients = getRegisteredPatients();
    const foundPatient = patients.find(
      (p: any) => p.email.toLowerCase() === signInEmail.trim().toLowerCase() && p.password === signInPassword
    );

    if (!foundPatient) {
      setSignInError('Invalid registered patient email or password. Please try again or sign up.');
      return;
    }

    // Success login
    localStorage.setItem('logged_in_patient', JSON.stringify(foundPatient));
    localStorage.setItem('patient_profile', JSON.stringify(foundPatient));
    setLoggedInPatient(foundPatient);
    
    addNotification({
      title: '🔑 Patient Dashboard Unlocked',
      message: `Welcome back, ${foundPatient.name}! You are now securely logged into your health portal.`,
      type: 'system',
      targetPortal: 'patient'
    });

    setSignInEmail('');
    setSignInPassword('');
  };

  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignUpError('');

    if (!signUpName.trim() || !signUpEmail.trim() || !signUpPassword.trim() || !signUpPhone.trim()) {
      setSignUpError('Please fill in all required fields.');
      return;
    }

    const patients = getRegisteredPatients();
    const exists = patients.some((p: any) => p.email.toLowerCase() === signUpEmail.trim().toLowerCase());
    
    if (exists) {
      setSignUpError('An account with this email address is already registered.');
      return;
    }

    const newPatientObj = {
      name: signUpName.trim(),
      email: signUpEmail.trim().toLowerCase(),
      password: signUpPassword,
      phone: signUpPhone.trim(),
      age: signUpAge,
      gender: signUpGender,
      bloodGroup: signUpBloodGroup
    };

    patients.push(newPatientObj);
    localStorage.setItem('aily_registered_patients', JSON.stringify(patients));
    
    // Auto login
    localStorage.setItem('logged_in_patient', JSON.stringify(newPatientObj));
    localStorage.setItem('patient_profile', JSON.stringify(newPatientObj));
    setLoggedInPatient(newPatientObj);

    addNotification({
      title: '🎉 Patient Registration Successful',
      message: `Welcome ${newPatientObj.name}! Your patient health records account has been created.`,
      type: 'system',
      targetPortal: 'patient'
    });

    // Clear fields
    setSignUpName('');
    setSignUpEmail('');
    setSignUpPassword('');
    setSignUpPhone('');
    setSignUpAge('30');
    setSignUpGender('Male');
    setSignUpBloodGroup('O+');
  };

  const handleLogout = () => {
    localStorage.removeItem('logged_in_patient');
    localStorage.removeItem('patient_profile');
    setLoggedInPatient(null);
  };

  const [activeTab, setActiveTab] = useState<'appointments' | 'documents' | 'samples' | 'orders' | 'insurance' | 'consultations' | 'profile' | 'analyzer'>('appointments');
  
  const myPastConsultations = appointments.filter(
    apt => apt.mode === 'video' && 
    (apt.status === 'completed' || apt.status === 'cancelled' || new Date(apt.date) < new Date() || apt.id.includes('completed')) &&
    apt.patientEmail.toLowerCase() === (loggedInPatient?.email || '').toLowerCase()
  );
  const [docUploadModal, setDocUploadModal] = useState(false);

  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<'prescription' | 'lab_report' | 'test_pdf'>('prescription');

  const handleUploadNewDoc = (e: React.FormEvent) => {
    e.preventDefault();
    if (!docName.trim()) return;

    uploadDocument({
      name: docName.endsWith('.pdf') ? docName : `${docName}.pdf`,
      fileType: docType,
      url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      size: '1.8 MB'
    });

    setDocName('');
    setDocUploadModal(false);
  };

  if (!loggedInPatient) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-xl">
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-600 shadow-inner">
            <User className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Patient Health Dashboard</h2>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Please log in with your patient credentials to access your secure prescriptions, upcoming consultations, and medical history.
          </p>
        </div>

        {/* Auth Tabs Capsule */}
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs font-bold gap-1 mb-6">
          <button
            onClick={() => { setAuthView('signin'); setSignInError(''); setSignUpError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authView === 'signin' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setAuthView('signup'); setSignInError(''); setSignUpError(''); }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              authView === 'signup' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Create Account
          </button>
        </div>

        {authView === 'signin' ? (
          <form onSubmit={handleSignInSubmit} className="space-y-4">
            {signInError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{signInError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Email / Username *
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  placeholder="e.g. name@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Password *
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type={showSignInPassword ? 'text' : 'password'}
                  required
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showSignInPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all uppercase tracking-wider"
            >
              Sign In to Patient Portal
            </button>
          </form>
        ) : (
          <form onSubmit={handleSignUpSubmit} className="space-y-4">
            {signUpError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span>{signUpError}</span>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Full Name *
              </label>
              <input
                type="text"
                required
                value={signUpName}
                onChange={(e) => setSignUpName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Email Address *
              </label>
              <input
                type="email"
                required
                value={signUpEmail}
                onChange={(e) => setSignUpEmail(e.target.value)}
                placeholder="e.g. jane.doe@example.com"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Choose Password *
              </label>
              <div className="relative">
                <input
                  type={showSignUpPassword ? 'text' : 'password'}
                  required
                  value={signUpPassword}
                  onChange={(e) => setSignUpPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 pr-10 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowSignUpPassword(!showSignUpPassword)}
                  className="absolute right-3.5 top-3 text-slate-400 hover:text-slate-600"
                >
                  {showSignUpPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={signUpPhone}
                onChange={(e) => setSignUpPhone(e.target.value)}
                placeholder="e.g. +1 (555) 019-9922"
                className="w-full px-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Age *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  max="120"
                  value={signUpAge}
                  onChange={(e) => setSignUpAge(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Gender *
                </label>
                <select
                  value={signUpGender}
                  onChange={(e) => setSignUpGender(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1 uppercase tracking-wider">
                  Blood *
                </label>
                <select
                  value={signUpBloodGroup}
                  onChange={(e) => setSignUpBloodGroup(e.target.value)}
                  className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-hidden focus:border-blue-600 focus:ring-1 focus:ring-blue-600/30 font-semibold"
                >
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-extrabold py-3 rounded-2xl text-xs shadow-md transition-all uppercase tracking-wider"
            >
              Generate Patient Profile & Login
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Patient Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider inline-block">
              AiLynkX Patient Portal
            </span>
            <span className="bg-white/10 text-white text-[10px] font-bold px-2.5 py-1 rounded-full tracking-wider inline-block">
              👤 ID: #{loggedInPatient?.email?.split('@')[0]}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Welcome, {loggedInPatient?.name || 'Patient'}!
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm mt-1 max-w-xl">
            Age: {loggedInPatient?.age || '30'} | Gender: {loggedInPatient?.gender || 'Male'} | Blood: {loggedInPatient?.bloodGroup || 'O+'} | Phone: {loggedInPatient?.phone || 'N/A'}
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            id="patient-dashboard-book-btn"
            onClick={() => setPortal('landing')}
            className="bg-red-600 hover:bg-red-700 text-white font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Book New Consultation</span>
          </button>
          
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white border border-white/20 font-extrabold px-5 py-3 rounded-2xl text-xs shadow-sm transition-all flex items-center gap-2 shrink-0"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs font-bold gap-1">
        <button
          id="tab-appointments"
          onClick={() => setActiveTab('appointments')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'appointments' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Appointments ({appointments.length})
        </button>

        <button
          id="tab-documents"
          onClick={() => setActiveTab('documents')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'documents' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" />
          Medical PDFs & Reports ({uploadedDocs.length})
        </button>

        <button
          id="tab-analyzer"
          onClick={() => setActiveTab('analyzer')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'analyzer' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          AI Prescription Analyzer
        </button>

        <button
          id="tab-samples"
          onClick={() => setActiveTab('samples')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'samples' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <TestTube2 className="w-4 h-4" />
          Home Lab Samples ({sampleRequests.length})
        </button>

        <button
          id="tab-orders"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'orders' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-4 h-4" />
          Medicine Orders ({orders.length})
        </button>

        <button
          id="tab-insurance"
          onClick={() => setActiveTab('insurance')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'insurance' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Insurance Verification {loggedInPatient?.insurance?.status === 'verified' ? '(Verified)' : '(Unverified)'}
        </button>

        <button
          id="tab-consultations"
          onClick={() => setActiveTab('consultations')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'consultations' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Consultation History ({myPastConsultations.length})
        </button>

        <button
          id="tab-profile"
          onClick={() => setActiveTab('profile')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all whitespace-nowrap ${
            activeTab === 'profile' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <User className="w-4 h-4" />
          Patient Profile
        </button>
      </div>

      {/* Tab Content 1: Appointments */}
      {activeTab === 'appointments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-lg">
              Your Appointments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {appointments.map(apt => (
              <div key={apt.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                    apt.mode === 'video' 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  }`}>
                    {apt.mode === 'video' ? '🎥 Video Consultation' : '🏥 Clinic Visit'}
                  </span>
                  
                  <span className="text-xs font-mono font-bold text-slate-400">
                    #{apt.id}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <img 
                    src={apt.doctorAvatar} 
                    alt={apt.doctorName} 
                    className="w-12 h-12 rounded-2xl object-cover border-2 border-blue-600/20"
                  />
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {apt.doctorName}
                    </h3>
                    <p className="text-xs text-blue-700 font-semibold">
                      {apt.doctorSpecialty}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-blue-600" />
                    <span>{apt.timeSlot}</span>
                  </div>
                </div>

                {apt.symptoms && (
                  <p className="text-xs text-slate-600 bg-blue-50/50 p-2.5 rounded-xl border border-blue-100">
                    <strong>Reason:</strong> {apt.symptoms}
                  </p>
                )}

                {/* Video Call Trigger Action */}
                {apt.mode === 'video' && (
                  <button
                    id={`join-video-call-btn-${apt.id}`}
                    onClick={() => startVideoCall(apt)}
                    className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-extrabold text-xs shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Call Now</span>
                  </button>
                )}

                {apt.ePrescription && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 font-medium">
                    <p className="font-bold text-emerald-950 mb-1">✓ Digital E-Prescription Issued</p>
                    <p className="font-mono text-[11px] whitespace-pre-wrap text-emerald-800">
                      {apt.ePrescription}
                    </p>
                  </div>
                )}

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 2: Medical PDFs & Reports */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-slate-900 text-lg">
              Uploaded Prescriptions & Test PDFs
            </h2>
            <button
              id="upload-new-pdf-btn"
              onClick={() => setDocUploadModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm"
            >
              <Upload className="w-4 h-4" /> Upload New PDF
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uploadedDocs.map(doc => (
              <div key={doc.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                    <FileText className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {doc.size}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-900 truncate">
                    {doc.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Uploaded: {doc.uploadDate}
                  </p>
                </div>

                <a
                  href={doc.url}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" /> View / Download PDF
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content 3: Home Lab Samples */}
      {activeTab === 'samples' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-slate-900 text-lg">
            Home Sample Collection Tracking
          </h2>

          <div className="space-y-3">
            {sampleRequests.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 font-medium text-sm">No active home sample collection requests.</p>
                <button
                  onClick={() => setPortal('landing')}
                  className="mt-2 text-xs font-bold text-blue-600 underline"
                >
                  Apply for Home Sample Collection on Landing Page
                </button>
              </div>
            ) : (
              sampleRequests.map(req => {
                const isPending = req.status === 'pending';
                const isAssigned = req.status === 'technician-assigned';
                const isCollected = req.status === 'sample-collected';
                const isReady = req.status === 'report-ready';
                
                return (
                  <div key={req.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-blue-900">
                        Request #{req.id}
                      </span>
                      <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${
                        isPending ? 'bg-amber-100 text-amber-800 border-amber-200' :
                        isAssigned ? 'bg-blue-100 text-blue-800 border-blue-200' :
                        isCollected ? 'bg-purple-100 text-purple-800 border-purple-200' :
                        'bg-emerald-100 text-emerald-800 border-emerald-200'
                      }`}>
                        {req.status.replace('-', ' ')}
                      </span>
                    </div>

                    <p className="text-xs font-bold text-slate-800">
                      Tests: {req.selectedTests.join(', ')}
                    </p>

                    {req.labName && (
                      <p className="text-xs text-slate-500 font-medium">
                        Laboratory Partner: <span className="font-extrabold text-blue-900 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md inline-block">{req.labName}</span>
                      </p>
                    )}

                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <p>📅 Date: {req.preferredDate} ({req.preferredTime})</p>
                      <p>📍 Address: {req.patientAddress}</p>
                    </div>

                    {/* Dispatch Phlebotomist details */}
                    {(req.technicianName || req.technicianPhone) && (
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/60 text-xs text-slate-700">
                        <p className="font-bold text-blue-900 flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          <span>Assigned Phlebotomist / Technician</span>
                        </p>
                        <p className="mt-1 font-medium">
                          Name: <span className="font-bold text-slate-800">{req.technicianName}</span> | 
                          Contact: <span className="font-bold text-slate-800">{req.technicianPhone}</span>
                        </p>
                      </div>
                    )}

                    {/* Report PDF Display */}
                    {isReady && req.reportPdfUrl && (
                      <div className="p-4 bg-emerald-50/40 rounded-2xl border border-emerald-200/50 space-y-2.5">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-wide block">Test Results Published</span>
                            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-0.5">
                              <FileText className="w-4 h-4 text-emerald-600" />
                              {req.reportPdfName}
                            </span>
                          </div>
                          
                          <a
                            href={req.reportPdfUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                          >
                            <Download className="w-3 h-3" />
                            <span>Download PDF</span>
                          </a>
                        </div>
                        
                        {req.reportComments && (
                          <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-100 text-[11px] text-slate-600">
                            <span className="font-bold text-emerald-900 block text-[10px] uppercase mb-0.5">Clinical observations particularly:</span>
                            <p className="whitespace-pre-line font-medium leading-relaxed">{req.reportComments}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Tab Content 4: Medicine Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h2 className="font-extrabold text-slate-900 text-lg">
            Medicine Orders History
          </h2>

          <div className="space-y-3">
            {orders.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-slate-600 font-medium text-sm">No medicine orders placed yet.</p>
                <button
                  onClick={() => setPortal('pharmacy')}
                  className="mt-2 text-xs font-bold text-blue-600 underline"
                >
                  Browse Pharmacy Store to order medicines
                </button>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-900">
                      Order #{order.id}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border border-emerald-200">
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-700">
                    {order.items.map((item, i) => (
                      <p key={i} className="flex justify-between">
                        <span>{item.medicine.name} x {item.quantity}</span>
                        <span className="font-bold">${(item.medicine.price * item.quantity).toFixed(2)}</span>
                      </p>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Total Paid:</span>
                    <span className="font-black text-blue-950 text-sm">${order.totalAmount.toFixed(2)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Tab Content 5: Insurance Verification */}
      {activeTab === 'insurance' && (
        <InsuranceVerification
          patient={loggedInPatient}
          onUpdatePatient={(updatedPatient) => {
            setLoggedInPatient(updatedPatient);
            localStorage.setItem('logged_in_patient', JSON.stringify(updatedPatient));
            localStorage.setItem('patient_profile', JSON.stringify(updatedPatient));
            
            // Also sync within aily_registered_patients list
            const stored = localStorage.getItem('aily_registered_patients');
            if (stored) {
              try {
                const patients = JSON.parse(stored);
                const index = patients.findIndex((p: any) => p.email.toLowerCase() === updatedPatient.email.toLowerCase());
                if (index !== -1) {
                  patients[index] = updatedPatient;
                  localStorage.setItem('aily_registered_patients', JSON.stringify(patients));
                }
              } catch (e) {
                console.error(e);
              }
            }
          }}
          addNotification={addNotification}
        />
      )}

      {/* Tab Content 6: Consultation History */}
      {activeTab === 'consultations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Video className="w-5 h-5 text-blue-600" />
                Past Video Consultations
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Access records, clinical notes, and active digital prescriptions issued during your secure video calls.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2 text-center shrink-0">
              <span className="block text-2xl font-black text-blue-700">{myPastConsultations.length}</span>
              <span className="text-[10px] uppercase font-black tracking-wider text-blue-500">Total Visits</span>
            </div>
          </div>

          <div className="space-y-4">
            {myPastConsultations.length === 0 ? (
              <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto space-y-4">
                <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto text-slate-400">
                  <Video className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-slate-900 text-sm">No past consultations found</h3>
                  <p className="text-xs text-slate-500">You haven't completed any digital consultations on AilynkX Health yet.</p>
                </div>
                <button
                  onClick={() => setPortal('landing')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs shadow-md transition-all inline-flex items-center gap-1.5"
                >
                  Book Your First Consultation
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {myPastConsultations.map(consultation => (
                  <div
                    key={consultation.id}
                    className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm hover:shadow-md transition-all space-y-6"
                  >
                    {/* Header Row */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                      <div className="flex items-center gap-2.5">
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider">
                          ✓ Completed Consultation
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-400">
                          ID: {consultation.id}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {consultation.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {consultation.timeSlot}
                        </span>
                      </div>
                    </div>

                    {/* Doctor Details & Symptoms */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                      <div className="md:col-span-5 flex items-start gap-4">
                        <img
                          src={consultation.doctorAvatar}
                          alt={consultation.doctorName}
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-slate-100 shadow-sm"
                        />
                        <div className="space-y-1">
                          <h4 className="font-extrabold text-slate-900 text-base">{consultation.doctorName}</h4>
                          <p className="text-xs text-blue-700 font-extrabold">{consultation.doctorSpecialty}</p>
                          <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>AilynkX Premium Partner</span>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-2">
                        <h5 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Reason for Consultation & Symptoms</h5>
                        <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100 text-xs text-slate-700 leading-relaxed">
                          {consultation.symptoms || 'No symptoms specified.'}
                        </div>
                      </div>
                    </div>

                    {/* Shared Post-Appointment Notes and E-Prescriptions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                      
                      {/* Clinical Doctor Notes */}
                      <div className="bg-blue-50/40 rounded-2xl p-5 border border-blue-100/60 space-y-3">
                        <h5 className="text-[11px] font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-blue-600" />
                          Shared Doctor's Clinical Notes
                        </h5>
                        <p className="text-xs text-slate-700 leading-relaxed bg-white p-3.5 rounded-xl border border-blue-50/80 font-medium min-h-[90px]">
                          {consultation.doctorNotes || 'No specific post-consultation notes were added by the physician.'}
                        </p>
                      </div>

                      {/* E-Prescription Details */}
                      <div className="bg-emerald-50/40 rounded-2xl p-5 border border-emerald-100/60 space-y-3">
                        <h5 className="text-[11px] font-black text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                          <FileText className="w-4 h-4 text-emerald-600" />
                          E-Prescription & Medicines
                        </h5>
                        <div className="bg-white p-3.5 rounded-xl border border-emerald-50/80 font-mono text-[11px] text-emerald-950 leading-relaxed min-h-[90px] whitespace-pre-line">
                          {consultation.ePrescription || "No medication was prescribed during this consultation."}
                        </div>
                      </div>

                    </div>

                    {/* Shared Prescription and Lab Links */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100 bg-slate-50/50 p-4 rounded-2xl">
                      <span className="text-xs text-slate-500 font-bold flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        Signed & Verified Electronically
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {consultation.prescriptionPdfName && (
                          <a
                            href={consultation.prescriptionPdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-700 hover:text-slate-900 font-extrabold px-3.5 py-2 rounded-xl text-[11px] border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-600" />
                            <span>{consultation.prescriptionPdfName}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )}
                        {consultation.testPdfName && (
                          <a
                            href={consultation.testPdfUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-white text-slate-700 hover:text-slate-900 font-extrabold px-3.5 py-2 rounded-xl text-[11px] border border-slate-200 shadow-xs hover:border-slate-300 transition-all flex items-center gap-1.5"
                          >
                            <Download className="w-3.5 h-3.5 text-indigo-600" />
                            <span>{consultation.testPdfName}</span>
                            <ExternalLink className="w-3 h-3 text-slate-400" />
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 7: Patient Profile */}
      {activeTab === 'profile' && (
        <PatientProfileSection
          patient={loggedInPatient}
          onUpdatePatient={(updatedPatient) => {
            setLoggedInPatient(updatedPatient);
            localStorage.setItem('logged_in_patient', JSON.stringify(updatedPatient));
            localStorage.setItem('patient_profile', JSON.stringify(updatedPatient));
            
            // Sync with aily_registered_patients database
            const stored = localStorage.getItem('aily_registered_patients');
            if (stored) {
              try {
                const patients = JSON.parse(stored);
                const index = patients.findIndex((p: any) => p.email.toLowerCase() === updatedPatient.email.toLowerCase());
                if (index !== -1) {
                  patients[index] = updatedPatient;
                  localStorage.setItem('aily_registered_patients', JSON.stringify(patients));
                }
              } catch (e) {
                console.error(e);
              }
            }
          }}
          addNotification={addNotification}
        />
      )}

      {/* Tab Content: AI Prescription Analyzer */}
      {activeTab === 'analyzer' && (
        <AIPrescriptionAnalyzer />
      )}

      {/* Doc Upload Modal */}
      {docUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <h3 className="font-extrabold text-base text-slate-900">Upload Medical Document / PDF</h3>
            <form onSubmit={handleUploadNewDoc} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Title</label>
                <input
                  type="text"
                  id="new-doc-title-input"
                  value={docName}
                  onChange={e => setDocName(e.target.value)}
                  placeholder="e.g. Allergy_Blood_Test_2026"
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Document Type</label>
                <select
                  id="new-doc-type-select"
                  value={docType}
                  onChange={e => setDocType(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                >
                  <option value="prescription">Doctor Prescription</option>
                  <option value="lab_report">Lab Test Report</option>
                  <option value="test_pdf">Medical History PDF</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDocUploadModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="submit-new-doc-btn"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl"
                >
                  Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Video Call Modal */}
      {activeVideoCall && (
        <VideoCallModal
          appointment={activeVideoCall}
          onClose={endVideoCall}
        />
      )}

    </div>
  );
};
