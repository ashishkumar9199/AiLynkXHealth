import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PhotoUpload } from '../components/PhotoUpload';
import { Doctor, Appointment } from '../types';
import { 
  Hospital, 
  PlusCircle, 
  Users, 
  Calendar, 
  Clock, 
  Video, 
  Phone, 
  Mail, 
  MapPin, 
  Sparkles, 
  Plus, 
  Trash2, 
  LogOut, 
  Key, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Stethoscope,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';

export const HospitalPortal: React.FC = () => {
  const { 
    hospitals, 
    addHospital, 
    editHospital, 
    doctors, 
    addDoctor, 
    deleteDoctor, 
    appointments, 
    t 
  } = useApp();

  // Authentication State
  const [loggedInHospId, setLoggedInHospId] = useState<string | null>(() => {
    return localStorage.getItem('logged_in_hospital_id');
  });

  const [authView, setAuthView] = useState<'signin' | 'signup'>('signin');
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Hospital Signup Form State
  const [signupName, setSignupName] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupBio, setSignupBio] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupImage, setSignupImage] = useState('https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupError, setSignupError] = useState('');

  // Doctor Registration Form State (within Hospital)
  const [docName, setDocName] = useState('');
  const [docSpecialty, setDocSpecialty] = useState('Cardiologist');
  const [docQualifications, setDocQualifications] = useState('');
  const [docExperience, setDocExperience] = useState<number>(5);
  const [docFee, setDocFee] = useState<number>(50);
  const [docBio, setDocBio] = useState('');
  const [docLanguages, setDocLanguages] = useState('English, Spanish');
  const [docUsername, setDocUsername] = useState('');
  const [docPassword, setDocPassword] = useState('');
  const [docAvatar, setDocAvatar] = useState('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80');
  const [docSuccess, setDocSuccess] = useState('');
  const [docError, setDocError] = useState('');

  // Hospital Info Update State
  const [isEditingInfo, setIsEditingInfo] = useState(false);
  const [editName, setEditName] = useState('');
  const [editAddress, setEditAddress] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editBio, setEditBio] = useState('');

  // Find currently logged-in hospital
  const currentHospital = hospitals.find(h => h.id === loggedInHospId);

  // Filter doctors registered under this hospital
  const hospitalDoctors = doctors.filter(
    d => d.hospitalId === loggedInHospId || d.hospital.toLowerCase() === currentHospital?.name.toLowerCase()
  );

  // Gather all appointments for doctors under this hospital
  const doctorIds = hospitalDoctors.map(d => d.id);
  const hospitalAppointments = appointments.filter(apt => doctorIds.includes(apt.doctorId));

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }

    const foundHosp = hospitals.find(
      h => h.username.toLowerCase() === usernameInput.trim().toLowerCase() && h.password === passwordInput
    );

    if (!foundHosp) {
      setLoginError('Invalid hospital username or password. Please try again.');
      return;
    }

    if (foundHosp.isActive === false) {
      setLoginError('This hospital account is deactivated. Please contact support.');
      return;
    }

    setLoggedInHospId(foundHosp.id);
    localStorage.setItem('logged_in_hospital_id', foundHosp.id);
    
    // Set edit fields for updates
    setEditName(foundHosp.name);
    setEditAddress(foundHosp.address);
    setEditPhone(foundHosp.phone);
    setEditEmail(foundHosp.email);
    setEditBio(foundHosp.bio || '');

    setUsernameInput('');
    setPasswordInput('');
  };

  // Handle Signup
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    if (!signupName.trim() || !signupAddress.trim() || !signupPhone.trim() || !signupEmail.trim() || !signupUsername.trim() || !signupPassword.trim()) {
      setSignupError('All fields marked with * are required.');
      return;
    }

    const usernameTaken = hospitals.some(h => h.username.toLowerCase() === signupUsername.trim().toLowerCase());
    if (usernameTaken) {
      setSignupError('This username is already taken. Please choose another.');
      return;
    }

    const newHosp = {
      name: signupName.trim(),
      address: signupAddress.trim(),
      phone: signupPhone.trim(),
      email: signupEmail.trim(),
      bio: signupBio.trim() || 'Committed to providing high-quality medical services.',
      username: signupUsername.trim().toLowerCase(),
      password: signupPassword,
      image: signupImage.trim() || 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
      isActive: true,
      approvalStatus: 'pending' as const
    };

    addHospital(newHosp);

    setSignupSuccess('Clinical Center registered successfully! Your registration is now pending administrator approval. Please wait for the platform coordinator to activate your credentials.');
    
    // Switch to signin and pre-fill credentials
    setUsernameInput(newHosp.username);
    setPasswordInput(newHosp.password);

    // Reset fields
    setSignupName('');
    setSignupAddress('');
    setSignupPhone('');
    setSignupEmail('');
    setSignupBio('');
    setSignupUsername('');
    setSignupPassword('');

    setTimeout(() => {
      setAuthView('signin');
      setSignupSuccess('');
    }, 6000);
  };

  // Handle Add Doctor to Hospital
  const handleAddDoctorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDocError('');
    setDocSuccess('');

    if (!currentHospital) return;

    if (!docName.trim() || !docQualifications.trim() || !docUsername.trim() || !docPassword.trim()) {
      setDocError('Please fill in all required fields marked with *');
      return;
    }

    const usernameTaken = doctors.some(d => d.username?.toLowerCase() === docUsername.trim().toLowerCase());
    if (usernameTaken) {
      setDocError('This doctor username is already taken.');
      return;
    }

    const newDocObj = {
      name: docName.trim().startsWith('Dr. ') ? docName.trim() : `Dr. ${docName.trim()}`,
      specialty: docSpecialty,
      qualifications: docQualifications.trim(),
      experienceYears: Number(docExperience) || 1,
      fee: Number(docFee) || 50,
      consultationModes: ['video', 'clinic'] as ('video' | 'clinic')[],
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      avatar: docAvatar.trim() || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
      hospital: currentHospital.name,
      address: currentHospital.address,
      bio: docBio.trim() || `Specialist at ${currentHospital.name}.`,
      languages: docLanguages.trim() ? docLanguages.split(',').map(s => s.trim()) : ['English'],
      username: docUsername.trim().toLowerCase(),
      password: docPassword,
      isActive: true,
      approvalStatus: 'approved' as const, // Pre-approved because registered directly by hospital portal admin
      hospitalId: currentHospital.id
    };

    addDoctor(newDocObj);

    setDocSuccess(`${newDocObj.name} has been successfully registered and listed under your hospital!`);

    // Reset Doctor Form
    setDocName('');
    setDocQualifications('');
    setDocExperience(5);
    setDocFee(50);
    setDocBio('');
    setDocLanguages('English, Spanish');
    setDocUsername('');
    setDocPassword('');
    setDocAvatar('https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80');

    setTimeout(() => {
      setDocSuccess('');
    }, 5000);
  };

  // Handle Hospital Info Update
  const handleUpdateHospitalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentHospital) return;

    const updated = {
      ...currentHospital,
      name: editName,
      address: editAddress,
      phone: editPhone,
      email: editEmail,
      bio: editBio
    };

    editHospital(updated);
    setIsEditingInfo(false);
  };

  // Handle Logout
  const handleLogout = () => {
    setLoggedInHospId(null);
    localStorage.removeItem('logged_in_hospital_id');
  };

  // Pre-fill fields for hospital updates if logged in
  React.useEffect(() => {
    if (currentHospital) {
      setEditName(currentHospital.name);
      setEditAddress(currentHospital.address);
      setEditPhone(currentHospital.phone);
      setEditEmail(currentHospital.email);
      setEditBio(currentHospital.bio || '');
    }
  }, [loggedInHospId]);

  // 1. If deactivated
  if (loggedInHospId && currentHospital && currentHospital.isActive === false) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center text-xs">
        <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Hospital Portal Suspended</h2>
        <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl leading-relaxed text-left">
          This hospital administration portal has been suspended or deactivated by the system administrator. 
          If you believe this is an error, please reach out to the platform coordinator.
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider"
        >
          Sign Out Administration
        </button>
      </div>
    );
  }

  // 2. If pending verification
  if (loggedInHospId && currentHospital && currentHospital.approvalStatus === 'pending') {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Hospital Application Under Verification</h2>
          <span className="inline-block bg-amber-100 text-amber-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Approval Pending
          </span>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Hello, Administrative Representative of {currentHospital.name}. Your details are successfully registered. To maintain safety and credential standards, please wait for platform administrator approval.
          </p>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/50 space-y-3">
          <h3 className="font-extrabold text-amber-950 uppercase text-[10px]">Verification Checklist</h3>
          <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
            <li>Validation of hospital registry, licenses, and official address.</li>
            <li>Verification of medical directory coordinators.</li>
            <li>Approval allows your medical center to list specialist practitioners directly.</li>
          </ul>
        </div>

        <div className="border border-slate-100 p-4 rounded-2xl space-y-2 bg-slate-50 text-[11px]">
          <span className="font-bold text-slate-500 block uppercase text-[9px]">Submitted Clinical Center Details:</span>
          <div><strong className="text-slate-700 font-bold">Facility Name:</strong> {currentHospital.name}</div>
          <div><strong className="text-slate-700 font-bold">Address:</strong> {currentHospital.address}</div>
          <div><strong className="text-slate-700 font-bold">Contact Email:</strong> {currentHospital.email}</div>
          <div><strong className="text-slate-700 font-bold">Contact Phone:</strong> {currentHospital.phone}</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              window.location.reload();
            }}
            className="flex-1 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer text-center"
          >
            Check Status Now
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold uppercase tracking-wider cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  // 3. If rejected
  if (loggedInHospId && currentHospital && currentHospital.approvalStatus === 'rejected') {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center text-xs">
        <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Application Rejected</h2>
        <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl leading-relaxed text-left space-y-2">
          <p className="font-bold text-red-950">Dear Representative of {currentHospital.name},</p>
          <p>
            Your clinical center registration request has been rejected by the portal administrator. 
            Common reasons include inability to verify licensing status, mismatching hospital identifiers, or unrecognized coordinator credentials.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              handleLogout();
            }}
            className="flex-1 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
          >
            Try signup again
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold uppercase tracking-wider cursor-pointer"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="hospital-portal-wrapper" className="space-y-8 max-w-6xl mx-auto py-2">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-2xl translate-x-10 -translate-y-10" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl -translate-x-20 translate-y-20" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-blue-600/90 text-white px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
              <img
                src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&h=120&fit=crop&auto=format&q=80"
                alt="AiLynkX Logo"
                className="w-4 h-4 rounded-full object-cover animate-pulse border border-white/25"
                referrerPolicy="no-referrer"
              />
              Institutions & Clinics
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {currentHospital ? currentHospital.name : 'AiLynkX Hospital Portal'}
            </h1>
            <p className="text-sm text-blue-100 max-w-xl">
              {currentHospital 
                ? 'Centralized administration dashboard. Manage medical specialists, coordinate outpatient schedules, and verify electronic healthcare requests.'
                : 'Empower your healthcare facility. Register multiple specialist doctors, manage appointment queues, and track patients under one unified portal.'
              }
            </p>
          </div>
          {currentHospital && (
            <button
              id="hospital-logout-btn"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all self-start md:self-center shadow"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out Administration</span>
            </button>
          )}
        </div>
      </div>

      {/* --- UNAUTHENTICATED VIEWS --- */}
      {!currentHospital ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Information & Feature Summary (Left Side) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-lg font-extrabold text-slate-950 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Hospital & Clinic Workspace
              </h2>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rather than joining as a single medical doctor, register your entire clinical institution to allow multi-practitioner schedules.
              </p>
              
              <hr className="border-slate-100" />
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Register Multiple Doctors</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Add, manage, or remove specialist profiles. Pre-approved doctors immediately show up on the landing page!</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Unified Booking Queue</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Track upcoming outpatient clinic visits and video teleconsultations for all doctors under your care.</p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Pre-Approved Standard</h4>
                    <p className="text-[11px] text-slate-500 mt-0.5">Doctors registered through verified hospitals bypass the admin approval state, allowing immediate telemedicine service.</p>
                  </div>
                </div>
              </div>
            </div>


          </div>

          {/* Form Area (Right Side) */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            
            {/* View Selector Tabs */}
            <div className="flex border-b border-slate-100 bg-slate-50">
              <button
                id="tab-hospital-signin"
                onClick={() => { setAuthView('signin'); setLoginError(''); setSignupError(''); }}
                className={`flex-1 py-4 text-center font-bold text-xs tracking-wider uppercase transition-colors ${
                  authView === 'signin' 
                    ? 'bg-white text-blue-700 border-t-2 border-t-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Sign In Administration
              </button>
              <button
                id="tab-hospital-signup"
                onClick={() => { setAuthView('signup'); setLoginError(''); setSignupError(''); }}
                className={`flex-1 py-4 text-center font-bold text-xs tracking-wider uppercase transition-colors ${
                  authView === 'signup' 
                    ? 'bg-white text-blue-700 border-t-2 border-t-blue-600' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                Register New Institution
              </button>
            </div>

            <div className="p-6 sm:p-8">
              
              {/* --- SIGN IN --- */}
              {authView === 'signin' && (
                <form id="hospital-signin-form" onSubmit={handleLoginSubmit} className="space-y-4">
                  {loginError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Hospital Admin Username</label>
                    <input 
                      type="text" 
                      placeholder="Enter hospital username"
                      value={usernameInput}
                      onChange={e => setUsernameInput(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Security Password</label>
                    <div className="relative">
                      <input 
                        type={showPassword ? 'text' : 'password'} 
                        placeholder="••••••••"
                        value={passwordInput}
                        onChange={e => setPasswordInput(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-700"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="hospital-signin-submit-btn"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md mt-2"
                  >
                    Enter Hospital Dashboard
                  </button>
                </form>
              )}

              {/* --- SIGN UP --- */}
              {authView === 'signup' && (
                <form id="hospital-signup-form" onSubmit={handleSignupSubmit} className="space-y-4">
                  {signupError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{signupError}</span>
                    </div>
                  )}
                  {signupSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{signupSuccess}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700">Hospital Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. City General Health Center"
                        value={signupName}
                        onChange={e => setSignupName(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700">Official Email *</label>
                      <input 
                        type="email" 
                        placeholder="e.g. administrator@citygeneral.org"
                        value={signupEmail}
                        onChange={e => setSignupEmail(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700">Official Phone *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. +1 (555) 999-1234"
                        value={signupPhone}
                        onChange={e => setSignupPhone(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700">Physical Address *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. 742 Evergreen Terrace, Sector 4"
                        value={signupAddress}
                        onChange={e => setSignupAddress(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Hospital Representative Bio & Philosophy</label>
                    <textarea 
                      rows={2}
                      placeholder="e.g. Serving the community since 1995 with state of the art trauma and child medicine units..."
                      value={signupBio}
                      onChange={e => setSignupBio(e.target.value)}
                      className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50 resize-none"
                    />
                  </div>

                  <hr className="border-slate-100" />

                  <div className="space-y-1 text-left">
                    <PhotoUpload
                      value={signupImage}
                      onChange={setSignupImage}
                      label="Upload Hospital Photo"
                      type="hospital"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700">Admin Username *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. citygeneral"
                        value={signupUsername}
                        onChange={e => setSignupUsername(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                      />
                    </div>

                    <div className="space-y-1 text-left">
                      <label className="text-xs font-bold text-slate-700">Administrative Password *</label>
                      <input 
                        type="password" 
                        placeholder="At least 6 characters"
                        value={signupPassword}
                        onChange={e => setSignupPassword(e.target.value)}
                        className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    id="hospital-signup-submit-btn"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl transition-all shadow-md mt-2"
                  >
                    Submit Hospital Registration
                  </button>
                </form>
              )}

            </div>
          </div>
        </div>
      ) : (
        /* --- AUTHENTICATED WORKSPACE --- */
        <div className="space-y-8">
          
          {/* Hospital Stats Blocks & Profile */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Hospital Stats Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                  <Hospital className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Institution Details</h3>
                <div className="text-xs text-slate-500 space-y-1.5 mt-2">
                  <p className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {currentHospital.address}</p>
                  <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {currentHospital.phone}</p>
                  <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-blue-600 shrink-0" /> {currentHospital.email}</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between text-xs font-bold text-slate-700">
                <span>Rating: ⭐ {currentHospital.rating || '5.0'}</span>
                <button
                  onClick={() => setIsEditingInfo(!isEditingInfo)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  Edit Info
                </button>
              </div>
            </div>

            {/* Doctor Count Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                  <Users className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Registered Specialists</h3>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {hospitalDoctors.length}
                </p>
                <p className="text-xs text-slate-500">
                  Fully licensed doctors actively providing consultation under your facility name.
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4 text-xs font-medium text-slate-600">
                Status: <span className="text-emerald-600 font-bold">Active & Serving</span>
              </div>
            </div>

            {/* Appointment Count Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between">
              <div className="space-y-2">
                <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Calendar className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">Total Bookings</h3>
                <p className="text-3xl font-black text-slate-900 mt-1">
                  {hospitalAppointments.length}
                </p>
                <p className="text-xs text-slate-500">
                  Outpatient bookings registered with your hospital doctors (clinic + video).
                </p>
              </div>
              <div className="border-t border-slate-100 pt-4 mt-4 text-xs font-semibold text-indigo-600 flex items-center gap-1">
                <span>Coordinates appointments live</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>

          {/* Hospital Information Editor Form (Collapsible) */}
          {isEditingInfo && (
            <div className="bg-slate-100 p-6 rounded-3xl border border-slate-200 space-y-4">
              <h3 className="font-extrabold text-sm text-slate-900">Update Hospital Public Record</h3>
              <form onSubmit={handleUpdateHospitalInfo} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Hospital Name</label>
                    <input 
                      type="text" 
                      value={editName}
                      onChange={e => setEditName(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Official Email</label>
                    <input 
                      type="email" 
                      value={editEmail}
                      onChange={e => setEditEmail(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Phone</label>
                    <input 
                      type="text" 
                      value={editPhone}
                      onChange={e => setEditPhone(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-700">Physical Address</label>
                    <input 
                      type="text" 
                      value={editAddress}
                      onChange={e => setEditAddress(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700">Philosophy / Bio</label>
                  <textarea 
                    rows={2}
                    value={editBio}
                    onChange={e => setEditBio(e.target.value)}
                    className="w-full text-xs p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-blue-600 bg-white"
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setIsEditingInfo(false)}
                    className="px-4 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-xs font-bold transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors shadow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TWO COLUMN GRID: Add Doctor & Current Doctors List */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Register Doctor Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-black text-slate-900 flex items-center gap-1.5 border-b border-slate-100 pb-2">
                <PlusCircle className="w-5 h-5 text-blue-600" />
                Add Specialist to Hospital
              </h2>
              
              <form onSubmit={handleAddDoctorSubmit} className="space-y-3.5">
                {docError && (
                  <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{docError}</span>
                  </div>
                )}
                {docSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{docSuccess}</span>
                  </div>
                )}

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700">Doctor Full Name *</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dr. Arthur Conan"
                    value={docName}
                    onChange={e => setDocName(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Specialty Area</label>
                    <select
                      value={docSpecialty}
                      onChange={e => setDocSpecialty(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                    >
                      <option value="Cardiologist">Cardiologist</option>
                      <option value="Internal Medicine & Diabetology">Internal Medicine</option>
                      <option value="Dermatologist & Cosmetologist">Dermatologist</option>
                      <option value="Orthopedic Specialist">Orthopedic</option>
                      <option value="Pediatrician & Child Health">Pediatrician</option>
                      <option value="Neurologist">Neurologist</option>
                      <option value="Ophthalmologist">Ophthalmologist</option>
                      <option value="General Physician">General Physician</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Experience Years</label>
                    <input 
                      type="number" 
                      min={1} 
                      max={60}
                      value={docExperience}
                      onChange={e => setDocExperience(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Qualifications *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. MD, MBBS (Yale)"
                      value={docQualifications}
                      onChange={e => setDocQualifications(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Consultation Fee ($)</label>
                    <input 
                      type="number" 
                      min={1}
                      value={docFee}
                      onChange={e => setDocFee(Number(e.target.value))}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700">Languages (comma-separated)</label>
                  <input 
                    type="text" 
                    value={docLanguages}
                    onChange={e => setDocLanguages(e.target.value)}
                    className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-bold text-slate-700">Doctor Bio & Specializations</label>
                  <textarea 
                    rows={2}
                    placeholder="e.g. Passionate about cardiovascular medicine and telemedicine guidance..."
                    value={docBio}
                    onChange={e => setDocBio(e.target.value)}
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50 resize-none"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <PhotoUpload
                    value={docAvatar}
                    onChange={setDocAvatar}
                    label="Upload Doctor Photo"
                    type="avatar"
                  />
                </div>

                <hr className="border-slate-100" />

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Portal Username *</label>
                    <input 
                      type="text" 
                      placeholder="e.g. arthur123"
                      value={docUsername}
                      onChange={e => setDocUsername(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                    />
                  </div>

                  <div className="space-y-1 text-left">
                    <label className="text-xs font-bold text-slate-700">Portal Password *</label>
                    <input 
                      type="password" 
                      placeholder="At least 6 chars"
                      value={docPassword}
                      onChange={e => setDocPassword(e.target.value)}
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-600 bg-slate-50"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  id="hospital-add-doctor-submit-btn"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2.5 rounded-xl transition-all shadow mt-2"
                >
                  Confirm Specialist Registration
                </button>
              </form>
            </div>

            {/* Right Col: Current Specialists List */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="w-5 h-5 text-emerald-600" />
                    Our Clinic's Medical Specialists
                  </span>
                  <span className="text-[10px] font-bold bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">
                    {hospitalDoctors.length} listed
                  </span>
                </h2>

                {hospitalDoctors.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Users className="w-12 h-12 mx-auto stroke-1" />
                    <p className="text-xs font-medium">No doctors registered for this hospital yet.</p>
                    <p className="text-[11px] text-slate-400">Use the form on the left to add your first healthcare specialist.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
                    {hospitalDoctors.map(doc => (
                      <div key={doc.id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between space-y-3">
                        <div className="flex items-start gap-3">
                          <img 
                            src={doc.avatar} 
                            alt={doc.name} 
                            className="w-11 h-11 rounded-full object-cover shrink-0 border border-slate-200"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <h4 className="text-xs font-extrabold text-slate-900">{doc.name}</h4>
                            <p className="text-[10px] font-bold text-blue-700 mt-0.5">{doc.specialty}</p>
                            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{doc.qualifications}</p>
                          </div>
                        </div>

                        <div className="border-t border-slate-100 pt-2 flex items-center justify-between text-[10px] font-bold text-slate-600">
                          <span>Fee: ${doc.fee}</span>
                          <span>Exp: {doc.experienceYears} Years</span>
                          
                          <button
                            id={`delete-doctor-btn-${doc.id}`}
                            onClick={() => {
                              if (confirm(`Are you sure you want to remove ${doc.name} from your hospital specialists?`)) {
                                deleteDoctor(doc.id);
                              }
                            }}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
                            title="Remove specialist"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Hospital Outpatient Booking Queue */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <h2 className="text-sm font-black text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                    Unified Outpatient Appointment Queue
                  </span>
                  <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    {hospitalAppointments.length} Bookings
                  </span>
                </h2>

                {hospitalAppointments.length === 0 ? (
                  <div className="py-10 text-center text-slate-400 space-y-2">
                    <Clock className="w-10 h-10 mx-auto stroke-1" />
                    <p className="text-xs font-medium">No appointments registered under your doctors.</p>
                    <p className="text-[11px] text-slate-400">Newly booked patient sessions will appear here live for coordination.</p>
                  </div>
                ) : (
                  <div className="space-y-3.5 max-h-[400px] overflow-y-auto pr-1">
                    {hospitalAppointments.map(apt => (
                      <div 
                        key={apt.id} 
                        className={`p-4 rounded-2xl border transition-all text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          apt.status === 'scheduled' 
                            ? 'border-indigo-100 bg-indigo-50/20' 
                            : 'border-slate-100 bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 uppercase tracking-wide">
                              #{apt.id}
                            </span>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 uppercase tracking-wide flex items-center gap-1">
                              {apt.mode === 'video' ? <Video className="w-3 h-3 text-red-500" /> : <MapPin className="w-3 h-3 text-blue-500" />}
                              {apt.mode === 'video' ? 'Video Call' : 'Clinic Visit'}
                            </span>
                          </div>
                          
                          <h4 className="text-xs font-black text-slate-900">
                            Patient: {apt.patientName} <span className="text-slate-400 font-medium">({apt.patientAge}y, {apt.patientGender})</span>
                          </h4>
                          
                          <div className="text-[10px] text-slate-500 font-semibold flex flex-wrap items-center gap-x-3 gap-y-1">
                            <span className="text-slate-900">Doctor: {apt.doctorName}</span>
                            <span>•</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-slate-400" /> {apt.date} at {apt.timeSlot}</span>
                          </div>

                          {apt.symptoms && (
                            <p className="text-[10px] text-slate-500 italic font-medium line-clamp-1 bg-white border border-slate-100 p-1.5 rounded-lg">
                              Symptoms: "{apt.symptoms}"
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                            apt.status === 'scheduled' 
                              ? 'bg-blue-100 text-blue-800' 
                              : apt.status === 'completed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-slate-100 text-slate-600'
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};
