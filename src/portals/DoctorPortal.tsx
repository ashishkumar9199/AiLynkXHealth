import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { VideoCallModal } from '../components/VideoCallModal';
import { PhotoUpload } from '../components/PhotoUpload';
import { Appointment } from '../types';
import { DoctorAnalytics } from '../components/DoctorAnalytics';
import { 
  Stethoscope, 
  Video, 
  Building2, 
  Calendar, 
  Clock, 
  FileText, 
  CheckCircle2, 
  User, 
  Sparkles,
  Download,
  Lock,
  LogOut,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';

export const DoctorPortal: React.FC = () => {
  const { doctors, appointments, editDoctor, addDoctor, startVideoCall, activeVideoCall, endVideoCall, updateAppointmentStatus, t } = useApp();

  // Authentication State
  const [loggedInDocId, setLoggedInDocId] = useState<string | null>(() => {
    return localStorage.getItem('logged_in_doctor_id');
  });

  const [authView, setAuthView] = useState<'signin' | 'signup'>(() => {
    const mode = localStorage.getItem('doctor_portal_view_mode');
    localStorage.removeItem('doctor_portal_view_mode'); // clear once consumed
    return mode === 'signup' ? 'signup' : 'signin';
  });

  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Doctor Registration Form State
  const [regName, setRegName] = useState('');
  const [regSpecialty, setRegSpecialty] = useState('Cardiologist');
  const [regQualifications, setRegQualifications] = useState('');
  const [regExperience, setRegExperience] = useState<number>(5);
  const [regFee, setRegFee] = useState<number>(50);
  const [regHospital, setRegHospital] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regBio, setRegBio] = useState('');
  const [regLanguages, setRegLanguages] = useState('English');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAvatar, setRegAvatar] = useState('https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80');
  const [regSuccess, setRegSuccess] = useState('');
  const [regError, setRegError] = useState('');

  // Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Active filter for patient queue
  const [filterMode, setFilterMode] = useState<'all' | 'video' | 'clinic'>('all');

  // Find currently logged-in doctor
  const currentDoctor = doctors.find(d => d.id === loggedInDocId);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both username and password.');
      return;
    }

    // Find doctor with matching credentials (case-insensitive for username)
    const foundDoc = doctors.find(
      d => d.username?.toLowerCase() === usernameInput.trim().toLowerCase() && d.password === passwordInput
    );

    if (!foundDoc) {
      setLoginError('Invalid doctor portal username or password. Please try again.');
      return;
    }

    // Successful login
    setLoggedInDocId(foundDoc.id);
    localStorage.setItem('logged_in_doctor_id', foundDoc.id);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Handle Signup / Registration Submit
  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegError('');
    setRegSuccess('');

    if (!regName.trim() || !regQualifications.trim() || !regUsername.trim() || !regPassword.trim()) {
      setRegError('Please fill in all required fields marked with *');
      return;
    }

    const usernameTaken = doctors.some(d => d.username?.toLowerCase() === regUsername.trim().toLowerCase());
    if (usernameTaken) {
      setRegError('This username is already taken. Please choose another username.');
      return;
    }

    const newDocObj = {
      name: regName.trim().startsWith('Dr. ') ? regName.trim() : `Dr. ${regName.trim()}`,
      specialty: regSpecialty,
      qualifications: regQualifications.trim(),
      experienceYears: Number(regExperience) || 1,
      fee: Number(regFee) || 50,
      consultationModes: ['video', 'clinic'] as ('video' | 'clinic')[],
      availability: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM'],
      avatar: regAvatar.trim() || 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
      hospital: regHospital.trim() || 'General Clinic',
      address: regAddress.trim() || 'Digital Telehealth Panel',
      bio: regBio.trim() || 'Certified medical specialist on HealthConnect platform.',
      languages: regLanguages.trim() ? regLanguages.split(',').map(s => s.trim()) : ['English'],
      username: regUsername.trim().toLowerCase(),
      password: regPassword,
      isActive: true,
      approvalStatus: 'pending' as const
    };

    addDoctor(newDocObj);

    setRegSuccess('Your professional profile application was submitted successfully! Your account status is currently "Pending Approval". The portal administrator will verify your medical license & qualifications, then approve your request to list you on the ecosystem.');
    
    // Clear registration fields
    setRegName('');
    setRegQualifications('');
    setRegHospital('');
    setRegAddress('');
    setRegBio('');
    setRegLanguages('English');
    setRegUsername('');
    setRegPassword('');

    // Pre-fill login credentials for them and switch view
    setUsernameInput(newDocObj.username);
    setPasswordInput(newDocObj.password);

    setTimeout(() => {
      setAuthView('signin');
      setRegSuccess('');
    }, 8000);
  };

  // Handle Logout
  const handleLogout = () => {
    setLoggedInDocId(null);
    localStorage.removeItem('logged_in_doctor_id');
    setIsChangingPassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess('');
    setPasswordError('');
  };

  // Handle Password Change
  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentDoctor) return;

    if (oldPassword !== currentDoctor.password) {
      setPasswordError('Current password is incorrect.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // Save updated password
    editDoctor({
      ...currentDoctor,
      password: newPassword
    });

    setPasswordSuccess('Password updated successfully! Keep this password safe.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess('');
    }, 3000);
  };

  // Filter all appointments for currently logged in doctor (regardless of active mode filter)
  const allDoctorAppointments = appointments.filter(a => {
    if (!currentDoctor) return false;
    return a.doctorId === currentDoctor.id || 
      a.doctorName.toLowerCase().includes(currentDoctor.name.toLowerCase().replace('dr. ', ''));
  });

  // Filter appointments for currently logged in doctor
  const doctorAppointments = appointments.filter(a => {
    if (!currentDoctor) return false;
    
    // Match by doctor id, or if id is missing/generic, match by doctor name
    const matchesDoc = 
      a.doctorId === currentDoctor.id || 
      a.doctorName.toLowerCase().includes(currentDoctor.name.toLowerCase().replace('dr. ', ''));
    
    const matchesMode = filterMode === 'all' || a.mode === filterMode;
    return matchesDoc && matchesMode;
  });

  // 1. Render Login / Signup screen if not logged in
  if (!loggedInDocId || !currentDoctor) {
    return (
      <div className="max-w-xl mx-auto my-8 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm overflow-hidden border border-slate-100">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&h=120&fit=crop&auto=format&q=80"
              alt="AiLynkX Logo"
              className="w-full h-full object-cover animate-pulse"
              referrerPolicy="no-referrer"
            />
          </div>
          <h2 className="text-2xl font-black text-slate-900">AiLynkX Doctor Portal</h2>
          <p className="text-xs text-slate-500 font-medium max-w-sm mx-auto">
            Authorized medical staff access. Register your profile to join the Telehealth Ecosystem, or sign in to manage your consultation queue.
          </p>
        </div>

        {/* View Switch Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => { setAuthView('signin'); setLoginError(''); setRegError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              authView === 'signin' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Doctor Sign In
          </button>
          <button
            onClick={() => { setAuthView('signup'); setLoginError(''); setRegError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              authView === 'signup' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Apply to Join Panel
          </button>
        </div>

        {authView === 'signin' ? (
          /* Sign In Form */
          <div className="space-y-4">
            {loginError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Username *</label>
                <input
                  type="text"
                  value={usernameInput}
                  onChange={e => setUsernameInput(e.target.value)}
                  placeholder="Enter doctor username"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Security Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordInput}
                    onChange={e => setPasswordInput(e.target.value)}
                    placeholder="••••••••"
                    className="w-full p-3 rounded-xl border border-slate-300 font-bold tracking-wider"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                Authenticate & Log In
              </button>
            </form>
          </div>
        ) : (
          /* Sign Up Form */
          <div className="space-y-4">
            {regError && (
              <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span>{regError}</span>
              </div>
            )}

            {regSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-start gap-2.5 leading-relaxed">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <span>{regSuccess}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Full Name (including prefix) *</label>
                <input
                  type="text"
                  value={regName}
                  onChange={e => setRegName(e.target.value)}
                  placeholder="e.g. Dr. Jane Cooper"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Specialty Division *</label>
                <select
                  value={regSpecialty}
                  onChange={e => setRegSpecialty(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium bg-white"
                >
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Internal Medicine & Diabetology">Internal Medicine & Diabetology</option>
                  <option value="Dermatologist & Cosmetologist">Dermatologist & Cosmetologist</option>
                  <option value="Orthopedic Specialist">Orthopedic Specialist</option>
                  <option value="Pediatrician & Child Health">Pediatrician & Child Health</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Medical Qualifications *</label>
                <input
                  type="text"
                  value={regQualifications}
                  onChange={e => setRegQualifications(e.target.value)}
                  placeholder="e.g. MD, FACP, MBBS"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Years of Practice Experience *</label>
                <input
                  type="number"
                  min="1"
                  value={regExperience}
                  onChange={e => setRegExperience(Number(e.target.value))}
                  placeholder="e.g. 10"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Telehealth Consultation Fee ($) *</label>
                <input
                  type="number"
                  min="10"
                  value={regFee}
                  onChange={e => setRegFee(Number(e.target.value))}
                  placeholder="e.g. 75"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Affiliated Hospital/Clinic *</label>
                <input
                  type="text"
                  value={regHospital}
                  onChange={e => setRegHospital(e.target.value)}
                  placeholder="e.g. Mount Sinai Health"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Practice Location/Address *</label>
                <input
                  type="text"
                  value={regAddress}
                  onChange={e => setRegAddress(e.target.value)}
                  placeholder="e.g. 520 Medical Arts Center, NY"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block font-bold text-slate-700 mb-1">Professional Biography / Bio *</label>
                <textarea
                  value={regBio}
                  onChange={e => setRegBio(e.target.value)}
                  placeholder="Detail your clinical training, areas of expertise, and approach to digital telehealth patient care..."
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium h-20"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Languages Spoken (comma separated)</label>
                <input
                  type="text"
                  value={regLanguages}
                  onChange={e => setRegLanguages(e.target.value)}
                  placeholder="e.g. English, Spanish, French"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="sm:col-span-2">
                <PhotoUpload
                  value={regAvatar}
                  onChange={setRegAvatar}
                  label="Upload Profile Photo"
                  type="avatar"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Username *</label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  placeholder="e.g. drjane12"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Password *</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                  required
                />
              </div>

              <div className="sm:col-span-2 pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  Submit Registration Application
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
          HealthConnect Telehealth Network • Authorized Access Control
        </div>
      </div>
    );
  }

  // 2. Render Deactivated Screen if doctor is inactive
  if (currentDoctor.isActive === false) {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center text-xs">
        <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Access Suspended</h2>
        <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl leading-relaxed text-left">
          Your medical practitioner portal has been deactivated by the system administrator. 
          If you believe this is an error or wish to appeal the suspension of your clinical services, please reach out to the medical board coordinator.
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider"
        >
          Sign Out of Account
        </button>
      </div>
    );
  }

  // 3. Render Pending Approval Screen if doctor is awaiting verification
  if (currentDoctor.approvalStatus === 'pending') {
    return (
      <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
            <Clock className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-slate-900">Application Under Verification</h2>
          <span className="inline-block bg-amber-100 text-amber-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
            Verification Pending
          </span>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">
            Hello, {currentDoctor.name}. Your profile details are securely saved. However, to maintain the safety of our telehealth ecosystem, you must wait for administrator approval.
          </p>
        </div>

        <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/50 space-y-3">
          <h3 className="font-extrabold text-amber-950 uppercase text-[10px]">What is being verified?</h3>
          <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
            <li>State medical board license status & credentials verification.</li>
            <li>Board specialty certification validation ({currentDoctor.specialty}).</li>
            <li>Qualifications check: {currentDoctor.qualifications}.</li>
            <li>Valid affiliation with {currentDoctor.hospital}.</li>
          </ul>
        </div>

        <div className="border border-slate-100 p-4 rounded-2xl space-y-2 bg-slate-50 text-[11px]">
          <span className="font-bold text-slate-500 block uppercase text-[9px]">Your Submitted Details:</span>
          <div><strong className="text-slate-700 font-bold">Doctor Name:</strong> {currentDoctor.name}</div>
          <div><strong className="text-slate-700 font-bold">Specialty Division:</strong> {currentDoctor.specialty}</div>
          <div><strong className="text-slate-700 font-bold">Hospital/Clinic:</strong> {currentDoctor.hospital}</div>
          <div><strong className="text-slate-700 font-bold">Consult Fee:</strong> ${currentDoctor.fee}</div>
          <div><strong className="text-slate-700 font-bold">Credentials:</strong> {currentDoctor.qualifications}</div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => {
              // Refresh state from localStorage to check if approved
              window.location.reload();
            }}
            className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer text-center"
          >
            Check Status Now
          </button>
          <button
            onClick={handleLogout}
            className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold uppercase tracking-wider cursor-pointer"
          >
            Log Out
          </button>
        </div>
      </div>
    );
  }

  // 4. Render Rejected Screen if doctor was rejected
  if (currentDoctor.approvalStatus === 'rejected') {
    return (
      <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center text-xs">
        <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <X className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900">Application Rejected</h2>
        <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl leading-relaxed text-left space-y-2">
          <p className="font-bold text-red-950">Dear {currentDoctor.name},</p>
          <p>
            Your practitioner registration application has been rejected by the portal administrator. 
            Common reasons include unverified licensing credentials, mismatching qualifications, or invalid clinic verification.
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => {
              // Let them sign up again by deleting this specific profile or resetting
              // But standard logout & try again is easier
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
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner with doctor details & logout */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-800 to-blue-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-emerald-700">
        <div className="flex items-center gap-4">
          <img 
            src={currentDoctor.avatar} 
            alt={currentDoctor.name} 
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
          />
          <div>
            <span className="bg-emerald-600 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider mb-1 inline-block">
              Authenticated Doctor Portal
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              {currentDoctor.name}
            </h1>
            <p className="text-emerald-100 text-xs mt-0.5 max-w-xl font-medium">
              Specialist {currentDoctor.specialty} • {currentDoctor.hospital}
            </p>
          </div>
        </div>

        {/* Doctor Actions Quick Bar */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsChangingPassword(!isChangingPassword)}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-xl border border-white/15 transition-all flex items-center gap-1.5"
          >
            <Key className="w-3.5 h-3.5 text-emerald-300" />
            <span>Change Password</span>
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Change Password Dropdown Panel */}
      {isChangingPassword && (
        <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm max-w-md space-y-4 animate-in slide-in-from-top-4 duration-200">
          <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
            <Key className="w-4 h-4 text-emerald-600" />
            Update Portal Password
          </h3>

          {passwordError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold">
              ⚠️ {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          <form onSubmit={handlePasswordChangeSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Current Password *</label>
              <input
                type="password"
                value={oldPassword}
                onChange={e => setOldPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">New Password *</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                required
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Confirm New Password *</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-white"
                required
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-[11px]"
              >
                Save Password
              </button>
              <button
                type="button"
                onClick={() => setIsChangingPassword(false)}
                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-[11px]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Analytics & Schedule Insights */}
      {currentDoctor && (
        <DoctorAnalytics 
          appointments={allDoctorAppointments} 
          doctorAvailabilityCount={currentDoctor.availability ? currentDoctor.availability.length : 4} 
        />
      )}

      {/* Mode Filter Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
          <Stethoscope className="w-5 h-5 text-emerald-600" />
          Today's Patient Queue ({doctorAppointments.length})
        </h2>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
          <button
            id="doc-filter-all"
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterMode === 'all' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            All Appointments
          </button>
          <button
            id="doc-filter-video"
            onClick={() => setFilterMode('video')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterMode === 'video' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            Video Calls Only
          </button>
          <button
            id="doc-filter-clinic"
            onClick={() => setFilterMode('clinic')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              filterMode === 'clinic' ? 'bg-emerald-600 text-white' : 'text-slate-600'
            }`}
          >
            Clinic Visits
          </button>
        </div>
      </div>

      {/* Patient Queue Cards */}
      {doctorAppointments.length === 0 ? (
        <div className="p-8 bg-slate-50 border border-dashed border-slate-300 text-center text-slate-500 rounded-3xl space-y-2">
          <p className="font-bold text-slate-700 text-sm">No scheduled patients in your queue</p>
          <p className="text-xs max-w-xs mx-auto text-slate-400 font-medium">
            You currently do not have any {filterMode === 'all' ? '' : `${filterMode} `}appointments booked for today.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {doctorAppointments.map(apt => (
            <div key={apt.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4">
              
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                  apt.mode === 'video' 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                }`}>
                  {apt.mode === 'video' ? '🎥 Telehealth Video Call' : '🏥 Hospital Visit'}
                </span>

                <span className="text-xs font-mono font-bold text-slate-400">
                  Patient #{apt.id}
                </span>
              </div>

              {/* Patient Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {apt.patientName}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    {apt.patientAge} Yrs • {apt.patientGender} • {apt.patientPhone}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">Slot</span>
                  <span className="text-xs font-bold text-blue-800">{apt.timeSlot}</span>
                </div>
              </div>

              {/* Symptoms */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700">
                <span className="font-bold text-slate-900 block mb-0.5">Reported Symptoms:</span>
                <p className="italic">{apt.symptoms}</p>
              </div>

              {/* Uploaded PDF Attachments Assessor */}
              <div className="p-3 bg-blue-50/80 rounded-2xl border border-blue-200 space-y-2 text-xs">
                <span className="font-extrabold text-blue-950 uppercase text-[10px] block">
                  Attached Medical PDFs (Inspectable during call):
                </span>

                <div className="flex flex-wrap gap-2 text-[11px]">
                  {apt.prescriptionPdfName && (
                    <a
                      href={apt.prescriptionPdfUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white rounded-xl border border-blue-200 text-blue-700 font-bold flex items-center gap-1.5 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>{apt.prescriptionPdfName}</span>
                    </a>
                  )}

                  {apt.testPdfName && (
                    <a
                      href={apt.testPdfUrl || '#'}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-white rounded-xl border border-blue-200 text-blue-700 font-bold flex items-center gap-1.5 hover:underline"
                    >
                      <FileText className="w-3.5 h-3.5 text-red-600" />
                      <span>{apt.testPdfName}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Doctor Actions */}
              <div className="pt-2 flex items-center gap-3">
                {apt.mode === 'video' ? (
                  <button
                    id={`doctor-launch-video-btn-${apt.id}`}
                    onClick={() => startVideoCall(apt)}
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" />
                    <span>Start Patient Video Call</span>
                  </button>
                ) : (
                  <button
                    onClick={() => updateAppointmentStatus(apt.id, 'completed', "Prescription issued during clinic visit.", "Vitals normal.")}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-extrabold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Mark Clinic Visit Completed</span>
                  </button>
                )}
              </div>

            </div>
          ))}
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
