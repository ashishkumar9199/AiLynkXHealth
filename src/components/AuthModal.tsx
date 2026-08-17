import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PortalType } from '../types';
import { 
  X, 
  LogIn, 
  UserPlus, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Stethoscope, 
  Building2, 
  Pill, 
  FlaskConical, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    setPortal,
    addDoctor,
    addHospital,
    addStore,
    addLab,
    addNotification,
    doctors,
    hospitals,
    stores,
    labs
  } = useApp();

  const [selectedRole, setSelectedRole] = useState<PortalType>('patient');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Custom Registration Fields
  const [fullName, setFullName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  
  // Patient Specific
  const [patientAge, setPatientAge] = useState('30');
  const [patientGender, setPatientGender] = useState('Male');
  const [bloodGroup, setBloodGroup] = useState('O+');

  // Doctor Specific
  const [doctorSpecialty, setDoctorSpecialty] = useState('Cardiologist');
  const [doctorQualifications, setDoctorQualifications] = useState('MD, DM Cardiology');
  const [doctorFee, setDoctorFee] = useState('100');
  const [doctorExperience, setDoctorExperience] = useState('12');
  const [doctorHospital, setDoctorHospital] = useState('Medicare General Hospital');
  const [doctorBio, setDoctorBio] = useState('Dedicated clinical specialist passionate about cardiovascular wellness.');

  // Hospital Specific
  const [hospitalAddress, setHospitalAddress] = useState('');
  const [hospitalBio, setHospitalBio] = useState('Leading multi-specialty clinical care center.');

  // Pharmacy Specific
  const [pharmacyLicense, setPharmacyLicense] = useState('LIC-PHARM-90812');
  const [pharmacyAddress, setPharmacyAddress] = useState('');
  
  // Lab Specific
  const [labLicense, setLabLicense] = useState('LIC-LAB-34561');
  const [labAddress, setLabAddress] = useState('');

  // Success / Pending Modal States
  const [signupSuccessData, setSignupSuccessData] = useState<{
    title: string;
    message: string;
    roleName: string;
    isAutoApproved: boolean;
  } | null>(null);

  if (!isAuthModalOpen) return null;

  const handleRoleChange = (role: PortalType) => {
    setSelectedRole(role);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedRole === 'patient') {
      const storedPatients = localStorage.getItem('aily_registered_patients');
      const patients = storedPatients ? JSON.parse(storedPatients) : [
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
      if (!storedPatients) {
        localStorage.setItem('aily_registered_patients', JSON.stringify(patients));
      }

      const foundPatient = patients.find(
        (p: any) => p.email.toLowerCase() === email.trim().toLowerCase() && p.password === password
      );

      if (!foundPatient) {
        alert('Invalid patient credentials. Please try again or sign up.');
        return;
      }

      // Store active session and profile
      localStorage.setItem('logged_in_patient', JSON.stringify(foundPatient));
      localStorage.setItem('patient_profile', JSON.stringify(foundPatient));
    } else if (selectedRole === 'doctor') {
      const foundDoc = doctors.find(
        (d: any) => d.username?.toLowerCase() === email.trim().toLowerCase() && d.password === password
      );

      if (!foundDoc) {
        alert('Invalid doctor credentials. Please try again.');
        return;
      }

      localStorage.setItem('logged_in_doctor_id', foundDoc.id);
    } else if (selectedRole === 'hospital') {
      const foundHosp = hospitals.find(
        (h: any) => h.username?.toLowerCase() === email.trim().toLowerCase() && h.password === password
      );

      if (!foundHosp) {
        alert('Invalid hospital credentials. Please try again.');
        return;
      }

      localStorage.setItem('logged_in_hospital_id', foundHosp.id);
    } else if (selectedRole === 'pharmacy') {
      const foundStore = stores.find(
        (s: any) => s.username?.toLowerCase() === email.trim().toLowerCase() && s.password === password
      );

      if (!foundStore) {
        alert('Invalid pharmacy credentials. Please try again.');
        return;
      }

      if (foundStore.isActive === false) {
        alert('Your pharmacy partner store access has been deactivated by the administrator.');
        return;
      }

      localStorage.setItem('logged_in_store_id', foundStore.id);
    } else if (selectedRole === 'lab') {
      const foundLab = labs.find(
        (l: any) => l.username?.toLowerCase() === email.trim().toLowerCase() && l.password === password
      );

      if (!foundLab) {
        alert('Invalid diagnostic laboratory credentials. Please try again.');
        return;
      }

      localStorage.setItem('logged_in_lab_id', foundLab.id);
    }

    // Simulate login success
    addNotification({
      title: `🔑 Logged into ${selectedRole.toUpperCase()} Portal`,
      message: `Successfully logged in as ${email}. Welcome back to HealthConnect!`,
      type: 'system',
      targetPortal: selectedRole
    });

    setPortal(selectedRole);
    setIsAuthModalOpen(false);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !email.trim() || !contactPhone.trim()) {
      alert('Please fill out all required fields: Name, Email, and Phone.');
      return;
    }

    let isAutoApproved = false;
    let title = '';
    let message = '';
    let roleName = '';

    if (selectedRole === 'patient') {
      isAutoApproved = true;
      title = 'Welcome aboard!';
      message = 'Your personal Patient Health Record profile has been generated successfully. You can now book clinic appointments, upload PDFs, and request home phlebotomy visits.';
      roleName = 'Patient';
      
      // Store in registered patients
      const storedPatients = localStorage.getItem('aily_registered_patients');
      const patients = storedPatients ? JSON.parse(storedPatients) : [
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

      const exists = patients.some((p: any) => p.email.toLowerCase() === email.trim().toLowerCase());
      if (exists) {
        alert('An account with this email is already registered.');
        return;
      }

      const newPatientObj = {
        name: fullName,
        email: email.trim().toLowerCase(),
        password: password || 'password123',
        phone: contactPhone,
        age: patientAge,
        gender: patientGender,
        bloodGroup: bloodGroup
      };

      patients.push(newPatientObj);
      localStorage.setItem('aily_registered_patients', JSON.stringify(patients));
      
      // Automatically log them in as well
      localStorage.setItem('logged_in_patient', JSON.stringify(newPatientObj));
      localStorage.setItem('patient_profile', JSON.stringify(newPatientObj));

      addNotification({
        title: '🎉 Patient Registration Successful',
        message: `Welcome ${fullName}! Your patient health records account is active.`,
        type: 'system',
        targetPortal: 'patient'
      });
    } else if (selectedRole === 'doctor') {
      isAutoApproved = false;
      title = 'Clinical Registration Submitted';
      message = `Thank you, Dr. ${fullName}. Your clinical practice profile (${doctorSpecialty}) has been submitted to the Admin Gate. Please toggle to the Admin portal to verify and approve your registration instantly.`;
      roleName = 'Specialist Doctor';

      addDoctor({
        name: `Dr. ${fullName}`,
        specialty: doctorSpecialty,
        qualifications: doctorQualifications,
        experienceYears: parseInt(doctorExperience) || 5,
        fee: parseFloat(doctorFee) || 80,
        consultationModes: ['video', 'clinic'],
        availability: ['Mon-Fri 09:00 AM - 01:00 PM', 'Mon-Fri 02:00 PM - 05:00 PM'],
        avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=150&q=80',
        hospital: doctorHospital || 'Medicare General Hospital',
        address: '102 Medical Arts Center, Block B',
        bio: doctorBio,
        languages: ['English', 'Spanish'],
        username: email,
        password: 'password',
        isActive: false,
        approvalStatus: 'pending'
      });
    } else if (selectedRole === 'hospital') {
      isAutoApproved = false;
      title = 'Hospital Node Submitted';
      message = `Clinical site ${fullName} has been created with pending verification. Go to the Admin Management workspace to approve this healthcare node.`;
      roleName = 'Hospital Facility';

      addHospital({
        name: fullName,
        address: hospitalAddress || '404 Healthcare Boulevard, City Center',
        phone: contactPhone,
        email: email,
        username: email,
        image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&w=300&q=80',
        isActive: false,
        bio: hospitalBio,
        approvalStatus: 'pending'
      });
    } else if (selectedRole === 'pharmacy') {
      isAutoApproved = false;
      title = 'Store Application Lodged';
      message = `Pharmacy vendor registration for "${fullName}" has been submitted for administrative certification. Toggle the Admin tab to certify this vendor license.`;
      roleName = 'Pharmacy Store';

      addStore({
        name: fullName,
        address: pharmacyAddress || '88 Apothecary Lane, Block D',
        phone: contactPhone,
        licenseNumber: pharmacyLicense,
        deliveryTime: '30-45 mins',
        image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=300&q=80',
        approvalStatus: 'pending'
      });
    } else if (selectedRole === 'lab') {
      isAutoApproved = false;
      title = 'Diagnostic Desk Registered';
      message = `Diagnostic center "${fullName}" registration completed with status PENDING. Approve the lab via the Administrator gate to unlock phlebotomist scheduling.`;
      roleName = 'Diagnostic Laboratory';

      addLab({
        name: fullName,
        address: labAddress || '10 Diagnostics Square, Plaza Level',
        phone: contactPhone,
        licenseNumber: labLicense,
        image: 'https://images.unsplash.com/photo-1579154204601-01588f351167?auto=format&fit=crop&w=300&q=80',
        isActive: false,
        approvalStatus: 'pending'
      });
    }

    setSignupSuccessData({
      title,
      message,
      roleName,
      isAutoApproved
    });
  };

  const closeAndNavigate = () => {
    setSignupSuccessData(null);
    setIsAuthModalOpen(false);
    
    if (selectedRole === 'patient') {
      setPortal('patient');
    } else {
      // For pending registrations, navigate them to the Admin portal or public portal to let them approve
      setPortal('admin');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200">
      
      {signupSuccessData ? (
        /* Success Screen */
        <div 
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6 sm:p-8 text-center space-y-6"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600 border border-emerald-100">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          
          <div className="space-y-2">
            <span className="bg-emerald-50 text-emerald-700 font-extrabold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
              {signupSuccessData.roleName} Registered
            </span>
            <h3 className="text-xl font-black text-slate-950 mt-2">{signupSuccessData.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed pt-1">
              {signupSuccessData.message}
            </p>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-500 flex items-start gap-2.5 text-left leading-relaxed">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <span>
              {signupSuccessData.isAutoApproved 
                ? 'Your secure environment is ready immediately! Click below to enter your workspace.'
                : 'Since this is a simulated high-fidelity clinic setup, you can immediately toggle to the Admin Management Workspace to verify, approve, and activate this node.'}
            </span>
          </div>

          <button
            onClick={closeAndNavigate}
            className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer"
          >
            {signupSuccessData.isAutoApproved ? 'Go to My Dashboard' : 'Open Admin Gate (Approve)'}
          </button>
        </div>
      ) : (
        /* Standard Auth Form */
        <div 
          className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white/10 rounded-2xl border border-white/10">
                {authModalMode === 'login' ? <LogIn className="w-5 h-5 text-white" /> : <UserPlus className="w-5 h-5 text-white" />}
              </div>
              <div>
                <span className="bg-red-500 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider block w-max">
                  SECURE ENDPOINT
                </span>
                <h2 className="font-black text-base text-white tracking-tight mt-0.5">
                  {authModalMode === 'login' ? 'Sign In to Workspace Portal' : 'Create Portal Account'}
                </h2>
              </div>
            </div>

            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors border border-white/10 cursor-pointer"
              title="Close Portal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-slate-800">
            {/* Tabs for Login vs Signup */}
            <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('login');
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authModalMode === 'login' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthModalMode('signup');
                  if (selectedRole === 'admin') {
                    // admin can't sign up
                    setSelectedRole('patient');
                  }
                }}
                className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  authModalMode === 'signup' 
                    ? 'bg-white text-blue-700 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <UserPlus className="w-3.5 h-3.5" />
                Register
              </button>
            </div>

            {/* Step 1: Choose Portal System */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black uppercase tracking-wider text-slate-500">
                1. Choose System Portal
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {/* Patient Tile */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('patient')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'patient'
                      ? 'border-red-600 bg-red-50/20 ring-1 ring-red-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <User className={`w-5 h-5 mb-2 ${selectedRole === 'patient' ? 'text-red-600' : 'text-slate-500'}`} />
                  <p className="font-extrabold text-xs text-slate-900 leading-none">Patient Hub</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-tight">Patient PHR dashboard</p>
                </button>

                {/* Doctor Tile */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('doctor')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'doctor'
                      ? 'border-red-600 bg-red-50/20 ring-1 ring-red-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Stethoscope className={`w-5 h-5 mb-2 ${selectedRole === 'doctor' ? 'text-red-600' : 'text-slate-500'}`} />
                  <p className="font-extrabold text-xs text-slate-900 leading-none">Specialist</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-tight">Consultation desk</p>
                </button>

                {/* Pharmacy Tile */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('pharmacy')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'pharmacy'
                      ? 'border-red-600 bg-red-50/20 ring-1 ring-red-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Pill className={`w-5 h-5 mb-2 ${selectedRole === 'pharmacy' ? 'text-red-600' : 'text-slate-500'}`} />
                  <p className="font-extrabold text-xs text-slate-900 leading-none">Pharmacy</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-tight">Meds & inventory</p>
                </button>

                {/* Lab Tile */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('lab')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'lab'
                      ? 'border-red-600 bg-red-50/20 ring-1 ring-red-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <FlaskConical className={`w-5 h-5 mb-2 ${selectedRole === 'lab' ? 'text-red-600' : 'text-slate-500'}`} />
                  <p className="font-extrabold text-xs text-slate-900 leading-none">Diagnostic Lab</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-tight">Phlebotomy desk</p>
                </button>

                {/* Hospital Tile */}
                <button
                  type="button"
                  onClick={() => handleRoleChange('hospital')}
                  className={`p-3 rounded-2xl border text-left transition-all ${
                    selectedRole === 'hospital'
                      ? 'border-red-600 bg-red-50/20 ring-1 ring-red-600/20'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <Building2 className={`w-5 h-5 mb-2 ${selectedRole === 'hospital' ? 'text-red-600' : 'text-slate-500'}`} />
                  <p className="font-extrabold text-xs text-slate-900 leading-none">Hospital Node</p>
                  <p className="text-[9px] text-slate-500 mt-1 leading-tight">Inpatient beds & admin</p>
                </button>


              </div>
            </div>



            {/* Form Fields */}
            {authModalMode === 'login' ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Secure Username / Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={selectedRole === 'patient' ? "e.g. name@example.com" : `Enter your ${selectedRole} username`}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600/30 font-semibold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600/30 font-semibold"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer mt-2"
                >
                  Sign In to {selectedRole.toUpperCase()}
                </button>
              </form>
            ) : (
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      {selectedRole === 'patient' ? 'Full Patient Name *' : 
                       selectedRole === 'doctor' ? 'Doctor Full Name *' :
                       selectedRole === 'hospital' ? 'Hospital Node Name *' :
                       selectedRole === 'pharmacy' ? 'Pharmacy Store Name *' : 'Lab Diagnostic Name *'}
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder={selectedRole === 'doctor' ? 'e.g. Sarah Jenkins' : 'e.g. Medicare Labs'}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600/30 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Contact Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.g. contact@domain.org"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600/30 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Contact Phone Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="tel"
                        required
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        placeholder="e.g. +1 555-019-2834"
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600/30 font-semibold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Password Code *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                      <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-red-600 focus:ring-1 focus:ring-red-600/30 font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Role Specific Extra Inputs */}
                {selectedRole === 'patient' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Patient PHR Demographics</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Age</label>
                        <input
                          type="number"
                          value={patientAge}
                          onChange={(e) => setPatientAge(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Gender</label>
                        <select
                          value={patientGender}
                          onChange={(e) => setPatientGender(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        >
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Blood Group</label>
                        <select
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-center"
                        >
                          <option>O+</option>
                          <option>O-</option>
                          <option>A+</option>
                          <option>A-</option>
                          <option>B+</option>
                          <option>B-</option>
                          <option>AB+</option>
                          <option>AB-</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === 'doctor' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Doctor Clinical Credentials</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Specialty</label>
                        <select
                          value={doctorSpecialty}
                          onChange={(e) => setDoctorSpecialty(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        >
                          <option>Cardiologist</option>
                          <option>Dermatologist</option>
                          <option>Pediatrician</option>
                          <option>General Physician</option>
                          <option>Neurologist</option>
                          <option>Orthopedic Surgeon</option>
                          <option>Gynecologist</option>
                          <option>Psychiatrist</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Qualifications</label>
                        <input
                          type="text"
                          value={doctorQualifications}
                          onChange={(e) => setDoctorQualifications(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Consultation Fee ($)</label>
                        <input
                          type="number"
                          value={doctorFee}
                          onChange={(e) => setDoctorFee(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Exp (Years)</label>
                        <input
                          type="number"
                          value={doctorExperience}
                          onChange={(e) => setDoctorExperience(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Affiliated Hospital</label>
                        <input
                          type="text"
                          value={doctorHospital}
                          onChange={(e) => setDoctorHospital(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === 'hospital' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Hospital Facility Details</p>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Street Address</label>
                      <input
                        type="text"
                        required
                        value={hospitalAddress}
                        onChange={(e) => setHospitalAddress(e.target.value)}
                        placeholder="e.g. 102 Healthcare Blvd, Sector 4"
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 mb-1">Facility Description</label>
                      <input
                        type="text"
                        value={hospitalBio}
                        onChange={(e) => setHospitalBio(e.target.value)}
                        className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                      />
                    </div>
                  </div>
                )}

                {selectedRole === 'pharmacy' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Pharmacy License & Address</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">License Number</label>
                        <input
                          type="text"
                          required
                          value={pharmacyLicense}
                          onChange={(e) => setPharmacyLicense(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Store Address</label>
                        <input
                          type="text"
                          required
                          value={pharmacyAddress}
                          onChange={(e) => setPharmacyAddress(e.target.value)}
                          placeholder="e.g. 52 Apothecary Ln"
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {selectedRole === 'lab' && (
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">Laboratory Certification</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">License Number</label>
                        <input
                          type="text"
                          required
                          value={labLicense}
                          onChange={(e) => setLabLicense(e.target.value)}
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 mb-1">Laboratory Address</label>
                        <input
                          type="text"
                          required
                          value={labAddress}
                          onChange={(e) => setLabAddress(e.target.value)}
                          placeholder="e.g. 10 Diagnostics Rd"
                          className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 cursor-pointer mt-2"
                >
                  Register as {selectedRole.toUpperCase()}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
