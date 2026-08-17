import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PhotoUpload } from '../components/PhotoUpload';
import { HomeSampleRequest } from '../types';
import { 
  Beaker, 
  ClipboardList, 
  CheckCircle, 
  Clock, 
  Phone, 
  MapPin, 
  Search, 
  Filter, 
  Lock, 
  AlertCircle, 
  FileText, 
  Send, 
  LogOut, 
  ArrowRight, 
  User,
  ShieldAlert,
  Calendar,
  Check,
  FileCheck,
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const LabPortal: React.FC = () => {
  const { 
    labs, 
    addLab, 
    sampleRequests, 
    updateSampleStatus, 
    shareLabReport,
    addNotification,
    t
  } = useApp();

  // Authentication States
  const [loggedInLabId, setLoggedInLabId] = useState<string>(() => {
    return localStorage.getItem('logged_in_lab_id') || '';
  });
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Signup States
  const [signupName, setSignupName] = useState('');
  const [signupAddress, setSignupAddress] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupLicense, setSignupLicense] = useState('');
  const [signupUsername, setSignupUsername] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupImage, setSignupImage] = useState('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80');
  const [signupSuccess, setSignupSuccess] = useState('');
  const [signupError, setSignupError] = useState('');

  // Dashboard States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'technician-assigned' | 'sample-collected' | 'report-ready'>('all');
  const [selectedRequest, setSelectedRequest] = useState<HomeSampleRequest | null>(null);

  // Technician Assignment Form
  const [techName, setTechName] = useState('');
  const [techPhone, setTechPhone] = useState('');
  const [assignmentSuccess, setAssignmentSuccess] = useState('');

  // Report Upload Form
  const [reportComments, setReportComments] = useState('');
  const [customReportName, setCustomReportName] = useState('');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  const [shareSuccess, setShareSuccess] = useState('');

  // Get current lab profile if logged in
  const currentLab = labs.find(l => l.id === loggedInLabId);

  // Auto load active session
  useEffect(() => {
    if (loggedInLabId) {
      localStorage.setItem('logged_in_lab_id', loggedInLabId);
    } else {
      localStorage.removeItem('logged_in_lab_id');
    }
  }, [loggedInLabId]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!loginUsername.trim() || !loginPassword.trim()) {
      setLoginError('Please enter your administrator username and password.');
      return;
    }

    const foundLab = labs.find(
      l => l.username?.toLowerCase() === loginUsername.trim().toLowerCase() && l.password === loginPassword
    );

    if (!foundLab) {
      setLoginError('Invalid laboratory username or security password.');
      return;
    }

    if (foundLab.isActive === false) {
      setLoginError('Your diagnostic center access has been deactivated by the system administrator.');
      return;
    }

    // Login success
    setLoggedInLabId(foundLab.id);
    setLoginUsername('');
    setLoginPassword('');
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError('');
    setSignupSuccess('');

    if (!signupName.trim() || !signupAddress.trim() || !signupPhone.trim() || !signupLicense.trim() || !signupUsername.trim() || !signupPassword.trim()) {
      setSignupError('All fields marked with * are required to submit registration.');
      return;
    }

    const usernameTaken = labs.some(
      l => l.username?.toLowerCase() === signupUsername.trim().toLowerCase()
    );

    if (usernameTaken) {
      setSignupError('This username is already taken. Please choose another.');
      return;
    }

    // Submit new lab with pending status
    addLab({
      name: signupName.trim(),
      address: signupAddress.trim(),
      phone: signupPhone.trim(),
      licenseNumber: signupLicense.trim(),
      image: signupImage || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80',
      username: signupUsername.trim().toLowerCase(),
      password: signupPassword,
      isActive: true,
      approvalStatus: 'pending' // Lab starts as pending admin approval
    });

    setSignupSuccess('Your Lab & Diagnostic Center registration was submitted successfully! It is currently pending verification and approval by the administrator.');
    
    // Clear fields
    setSignupName('');
    setSignupAddress('');
    setSignupPhone('');
    setSignupLicense('');
    setSignupUsername('');
    setSignupPassword('');
  };

  const handleLogout = () => {
    setLoggedInLabId('');
    setSelectedRequest(null);
  };

  // Assign Phlebotomist (Technician)
  const handleAssignTechnician = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    if (!techName.trim() || !techPhone.trim()) {
      alert('Please fill in both the technician name and phone number.');
      return;
    }

    updateSampleStatus(selectedRequest.id, 'technician-assigned', techName.trim(), techPhone.trim());
    
    // Update local modal state
    const updated = {
      ...selectedRequest,
      status: 'technician-assigned' as const,
      technicianName: techName.trim(),
      technicianPhone: techPhone.trim()
    };
    setSelectedRequest(updated);
    setAssignmentSuccess('Phlebotomist assigned successfully! Patient has been notified.');
    
    setTimeout(() => {
      setAssignmentSuccess('');
    }, 4000);
  };

  // Collect sample helper
  const handleMarkSampleCollected = () => {
    if (!selectedRequest) return;
    updateSampleStatus(selectedRequest.id, 'sample-collected');
    
    const updated = {
      ...selectedRequest,
      status: 'sample-collected' as const
    };
    setSelectedRequest(updated);
  };

  // Share Diagnostic Report particularly
  const handleShareReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRequest) return;

    const reportName = customReportName.trim() || `Lab_Report_${selectedRequest.id}.pdf`;
    
    shareLabReport(
      selectedRequest.id,
      selectedPresetUrl,
      reportName,
      reportComments.trim() || 'All parameters fall within clinical biological reference ranges.'
    );

    // Update state to reflect changes
    const updated = {
      ...selectedRequest,
      status: 'report-ready' as const,
      reportPdfUrl: selectedPresetUrl,
      reportPdfName: reportName,
      reportComments: reportComments.trim() || 'All parameters fall within clinical biological reference ranges.'
    };
    setSelectedRequest(updated);
    setShareSuccess('Lab Diagnostic Report published and shared with the patient instantly!');
    setReportComments('');
    setCustomReportName('');

    setTimeout(() => {
      setShareSuccess('');
    }, 5000);
  };

  // Quick preset report results generators (simulating the PDF)
  const generateSimulatedPreset = (type: string) => {
    setCustomReportName(`${type.replace(/\s+/g, '_')}_Report_${selectedRequest?.id || 'LAB'}.pdf`);
    let findings = '';
    if (type === 'Complete Blood Count (CBC)') {
      findings = 'FINDINGS:\n- Hemoglobin: 14.2 g/dL (Normal: 13.0 - 17.0)\n- White Blood Cells (WBC): 7.2 x10^3/µL (Normal: 4.0 - 11.0)\n- Platelet Count: 240 x10^3/µL (Normal: 150 - 450)\n- Red Blood Cells (RBC): 4.8 x10^6/µL (Normal: 4.5 - 5.9)\n\nCLINICAL IMPRESSION:\nParameters within normal limits. No evidence of anemia or acute systemic infection.';
    } else if (type === 'Comprehensive Lipid Profile') {
      findings = 'FINDINGS:\n- Total Cholesterol: 212 mg/dL (Borderline High: 200 - 239)\n- HDL Cholesterol (Good): 42 mg/dL (Normal: > 40)\n- LDL Cholesterol (Bad): 138 mg/dL (Optimal: < 100, Borderline: 130 - 159)\n- Triglycerides: 160 mg/dL (Borderline High: 150 - 199)\n\nCLINICAL IMPRESSION:\nMild borderline hyperlipidemia. Recommend physical exercise and dietary low-fat adjustments.';
    } else if (type === 'HbA1c + Blood Glucose') {
      findings = 'FINDINGS:\n- Fasting Blood Sugar: 96 mg/dL (Normal: 70 - 100)\n- HbA1c (Glycated Hemoglobin): 5.4% (Normal: < 5.7%, Prediabetes: 5.7% - 6.4%)\n\nCLINICAL IMPRESSION:\nExcellent blood sugar regulation. No clinical indicator of pre-diabetes or impaired glucose tolerance.';
    } else {
      findings = 'FINDINGS:\n- All standard pathology serum assays performed and cleared within standard biological deviation thresholds.\n\nCLINICAL IMPRESSION:\nNo active pathology observed.';
    }
    setReportComments(findings);
  };

  // Filter sample requests assigned specifically to this lab partner, or legacy unassigned ones
  const labSpecificRequests = sampleRequests.filter(req => {
    if (req.labId) {
      return req.labId === loggedInLabId;
    }
    return true; // Fallback for legacy requests without explicit labId
  });

  // Filtering Requests
  const filteredRequests = labSpecificRequests.filter(req => {
    const matchesSearch = req.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          req.selectedTests.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || req.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate stats based on lab-specific requests
  const totalCount = labSpecificRequests.length;
  const pendingAssignCount = labSpecificRequests.filter(r => r.status === 'pending').length;
  const collectedCount = labSpecificRequests.filter(r => r.status === 'sample-collected').length;
  const readyCount = labSpecificRequests.filter(r => r.status === 'report-ready').length;

  // Render Login & Registration Panels
  if (!loggedInLabId || !currentLab) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4" id="lab-auth-root">
        {/* Banner header */}
        <div className="text-center mb-8">
          <div className="inline-flex w-14 h-14 rounded-2xl mb-4 border border-slate-100 shadow-sm overflow-hidden justify-center items-center">
            <img
              src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&h=120&fit=crop&auto=format&q=80"
              alt="AiLynkX Logo"
              className="w-full h-full object-cover animate-pulse"
              referrerPolicy="no-referrer"
            />
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">
            AiLynkX Lab Portal
          </h1>
          <p className="text-slate-500 mt-2 font-medium max-w-lg mx-auto text-sm sm:text-base">
            Secure administrative console for registered diagnostic laboratories, pathology centers, and phlebotomists.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-slate-100 p-1.5 rounded-xl max-w-sm mx-auto mb-8 border border-slate-200">
          <button
            onClick={() => { setActiveTab('login'); setLoginError(''); setSignupError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'login' 
                ? 'bg-white text-blue-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In to Lab
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setLoginError(''); setSignupError(''); }}
            className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'signup' 
                ? 'bg-white text-blue-900 shadow-sm' 
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Register Laboratory
          </button>
        </div>

        {/* Login Area */}
        {activeTab === 'login' ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-10 max-w-md mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Lock className="w-5 h-5 text-red-600" />
              Lab Login
            </h2>
            <p className="text-slate-500 text-xs font-medium mb-6">
              Enter your credentials to access home sample collection jobs.
            </p>

            {loginError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Lab Username</label>
                <input
                  type="text"
                  placeholder="Enter lab username"
                  value={loginUsername}
                  onChange={e => setLoginUsername(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">Security Password</label>
                <input
                  type="password"
                  placeholder="At least 6 characters"
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-blue-600 focus:bg-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-red-700 text-white font-bold text-sm shadow hover:from-red-700 hover:to-red-800 transition-all flex items-center justify-center gap-2 mt-2"
              >
                <span>Authorize Workspace</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>


          </div>
        ) : (
          /* Signup Form */
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 max-w-2xl mx-auto">
            <h2 className="text-xl font-bold text-slate-800 mb-1 flex items-center gap-2">
              <Beaker className="w-5 h-5 text-red-600" />
              Partner Lab Application
            </h2>
            <p className="text-slate-500 text-xs font-medium mb-6">
              Register your pathology lab, diagnostic center, or imaging clinic to become an authorized sample collection partner.
            </p>

            {signupError && (
              <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{signupError}</span>
              </div>
            )}

            {signupSuccess && (
              <div className="mb-5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                <p className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Application Submitted
                </p>
                <p>{signupSuccess}</p>
                <button
                  onClick={() => setActiveTab('login')}
                  className="mt-3 text-xs bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-lg font-bold"
                >
                  Return to Sign In
                </button>
              </div>
            )}

            {!signupSuccess && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Diagnostic Center Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Diagnostics"
                      value={signupName}
                      onChange={e => setSignupName(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Medical License Number *</label>
                    <input
                      type="text"
                      placeholder="e.g. LAB-2026-XXXXX"
                      value={signupLicense}
                      onChange={e => setSignupLicense(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Center Contact Phone *</label>
                    <input
                      type="text"
                      placeholder="e.g. +1 (555) 000-1111"
                      value={signupPhone}
                      onChange={e => setSignupPhone(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Center Address *</label>
                    <input
                      type="text"
                      placeholder="Full facility address"
                      value={signupAddress}
                      onChange={e => setSignupAddress(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <div>
                  <PhotoUpload
                    value={signupImage}
                    onChange={setSignupImage}
                    label="Upload Lab / Diagnostic Center Photo"
                    type="store"
                  />
                </div>

                <hr className="border-slate-100 my-4" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Portal Admin Username *</label>
                    <input
                      type="text"
                      placeholder="Used for workspace login"
                      value={signupUsername}
                      onChange={e => setSignupUsername(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">Secure Password *</label>
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={signupPassword}
                      onChange={e => setSignupPassword(e.target.value)}
                      className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow transition-all mt-4"
                >
                  Submit Laboratory Registration
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    );
  }

  // Pending approval screen
  if (currentLab.approvalStatus !== 'approved') {
    return (
      <div className="max-w-md mx-auto py-16 px-4" id="lab-pending-root">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-amber-500" />
          
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-5 border border-amber-200">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="text-xl font-bold text-slate-900 mb-2">
            Verification Pending
          </h1>
          <p className="text-sm text-slate-500 font-medium leading-relaxed mb-6">
            Hi <strong>{currentLab.name}</strong>, your account has been registered successfully but is currently waiting for <strong>Administrator Review</strong>.
          </p>

          <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-left mb-6 text-xs text-slate-600 space-y-2">
            <div className="flex justify-between">
              <span className="font-semibold">License ID:</span>
              <span className="text-slate-900 font-medium">{currentLab.licenseNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Portal Status:</span>
              <span className="text-amber-700 font-bold px-2 py-0.5 rounded-full bg-amber-100 uppercase tracking-wider text-[9px]">
                {currentLab.approvalStatus?.toUpperCase() || 'PENDING'}
              </span>
            </div>
            <p className="border-t border-slate-200 pt-2 text-[11px] text-slate-500 text-center leading-normal">
              Home sample requests will be accessible immediately once approved. Please check back shortly.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4 text-slate-500" />
            <span>Sign Out Profile</span>
          </button>
        </div>
      </div>
    );
  }

  // MAIN LABORATORY SECURE DASHBOARD (Approved State)
  return (
    <div className="space-y-6" id="lab-dashboard-root">
      {/* Upper header */}
      <div className="bg-gradient-to-r from-red-600 to-red-900 rounded-3xl p-6 text-white shadow-md flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img 
            src={currentLab.image} 
            alt={currentLab.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white/20 shadow-md"
            referrerPolicy="no-referrer"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg md:text-xl font-black text-white leading-tight">
                {currentLab.name}
              </h1>
              <span className="bg-emerald-500 text-white font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                <Check className="w-3 h-3" />
                Verified
              </span>
            </div>
            <p className="text-xs text-red-100 font-medium mt-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              {currentLab.address}
            </p>
            <p className="text-[10px] text-red-200 font-bold mt-1 uppercase tracking-wider">
              License No: {currentLab.licenseNumber}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <span className="text-[10px] text-red-200 block font-bold uppercase tracking-wide">Live Operations</span>
            <span className="text-xs font-bold text-white">Pathology Dispatch Queue</span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 border border-white/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Analytical Stats Panel */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <ClipboardList className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Total Orders</span>
            <span className="text-xl font-black text-slate-800">{totalCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl border border-amber-100">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">New/Pending</span>
            <span className="text-xl font-black text-slate-800">{pendingAssignCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl border border-purple-100">
            <Beaker className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Sample Collected</span>
            <span className="text-xl font-black text-slate-800">{collectedCount}</span>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 block font-bold uppercase tracking-wider">Reports Sent</span>
            <span className="text-xl font-black text-slate-800">{readyCount}</span>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN: Request queue list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
              <h2 className="font-extrabold text-slate-800 text-sm md:text-base flex items-center gap-2">
                <Beaker className="w-4 h-4 text-red-600" />
                Home Sample Collection Queue
              </h2>
              
              {/* Status Tabs inside header */}
              <div className="flex flex-wrap bg-slate-50 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                    statusFilter === 'all' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setStatusFilter('pending')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                    statusFilter === 'pending' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  New
                </button>
                <button
                  onClick={() => setStatusFilter('sample-collected')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                    statusFilter === 'sample-collected' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Collected
                </button>
                <button
                  onClick={() => setStatusFilter('report-ready')}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide transition-all ${
                    statusFilter === 'report-ready' ? 'bg-white text-blue-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Ready
                </button>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by Patient Name, ID, or specific diagnostic test..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-red-600 bg-slate-50"
              />
            </div>

            {/* List */}
            {filteredRequests.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <ClipboardList className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-xs text-slate-500 font-bold">No home sample requests matching criteria.</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Please check again or adjust filters.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map(req => {
                  const isSelected = selectedRequest?.id === req.id;
                  
                  return (
                    <button
                      key={req.id}
                      onClick={() => { setSelectedRequest(req); setShareSuccess(''); setAssignmentSuccess(''); }}
                      className={`w-full text-left p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-3 ${
                        isSelected 
                          ? 'border-red-600 bg-red-50/20 shadow-sm ring-1 ring-red-600/30' 
                          : 'border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50/60'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-slate-800">
                            {req.patientName}
                          </span>
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                            {req.id}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {req.selectedTests.map((t, idx) => (
                            <span key={idx} className="text-[9px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded-md">
                              {t}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-2 font-medium">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {req.preferredDate} ({req.preferredTime})
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400 truncate max-w-[150px]" />
                            {req.patientAddress}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-start md:self-center shrink-0">
                        {req.status === 'pending' && (
                          <span className="text-[9px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            New Request
                          </span>
                        )}
                        {req.status === 'technician-assigned' && (
                          <span className="text-[9px] font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Tech Assigned
                          </span>
                        )}
                        {req.status === 'sample-collected' && (
                          <span className="text-[9px] font-bold text-purple-800 bg-purple-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Collected
                          </span>
                        )}
                        {req.status === 'report-ready' && (
                          <span className="text-[9px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Report Sent
                          </span>
                        )}
                        
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Action panel for selected request */}
        <div className="space-y-4">
          {selectedRequest ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              {/* Header */}
              <div className="bg-slate-50 border-b border-slate-200 p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-slate-800 text-sm">
                    Job Manager
                  </h3>
                  <span className="text-[10px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-0.5 rounded-md">
                    {selectedRequest.id}
                  </span>
                </div>
                <p className="text-slate-400 text-[10px] font-medium mt-0.5">
                  Assigned workspace protocols
                </p>
              </div>

              {/* Patient bio */}
              <div className="p-4 space-y-4">
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">Patient Name</span>
                      <span className="text-xs font-extrabold text-slate-800">{selectedRequest.patientName}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider text-right">Fee Status</span>
                      <span className="text-xs font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">${selectedRequest.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5 pt-1.5 border-t border-slate-200/50">
                    <p className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      {selectedRequest.patientPhone}
                    </p>
                    <p className="text-xs text-slate-600 font-medium flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                      <span>{selectedRequest.patientAddress}</span>
                    </p>
                  </div>
                </div>

                {/* Steps workflow progress indicator */}
                <div>
                  <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider mb-2">Workflow Phase</span>
                  <div className="grid grid-cols-4 gap-1">
                    <div className={`h-1.5 rounded-full ${selectedRequest.status !== 'pending' ? 'bg-red-600' : 'bg-red-300 animate-pulse'}`} />
                    <div className={`h-1.5 rounded-full ${['technician-assigned', 'sample-collected', 'report-ready'].includes(selectedRequest.status) ? 'bg-red-600' : 'bg-slate-200'}`} />
                    <div className={`h-1.5 rounded-full ${['sample-collected', 'report-ready'].includes(selectedRequest.status) ? 'bg-red-600' : 'bg-slate-200'}`} />
                    <div className={`h-1.5 rounded-full ${selectedRequest.status === 'report-ready' ? 'bg-red-600' : 'bg-slate-200'}`} />
                  </div>
                  <div className="flex justify-between text-[8px] font-bold text-slate-400 uppercase tracking-wide mt-1">
                    <span>1. New</span>
                    <span>2. Dispatch</span>
                    <span>3. Collected</span>
                    <span>4. Published</span>
                  </div>
                </div>

                {/* STEP 1: Assign Technician Form */}
                {selectedRequest.status === 'pending' && (
                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <User className="w-4 h-4 text-blue-600" />
                      <span>Dispatch Phlebotomist</span>
                    </div>

                    {assignmentSuccess && (
                      <p className="text-[11px] font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        {assignmentSuccess}
                      </p>
                    )}

                    <form onSubmit={handleAssignTechnician} className="space-y-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Technician Full Name</label>
                        <input
                          type="text"
                          placeholder="e.g. Robert Smith"
                          value={techName}
                          onChange={e => setTechName(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-red-600 bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase">Technician Mobile No.</label>
                        <input
                          type="text"
                          placeholder="e.g. +1 (555) 304-2099"
                          value={techPhone}
                          onChange={e => setTechPhone(e.target.value)}
                          className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-red-600 bg-white"
                        />
                      </div>
                      <button
                        type="submit"
                        className="w-full py-2 bg-blue-900 hover:bg-blue-950 text-white font-bold text-[11px] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                      >
                        <Send className="w-3 h-3" />
                        <span>Dispatch & Assign Technician</span>
                      </button>
                    </form>
                  </div>
                )}

                {/* STEP 2: Update status to collected */}
                {selectedRequest.status === 'technician-assigned' && (
                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-4 text-center space-y-3">
                    <div className="text-left bg-blue-50/80 p-2.5 rounded-lg border border-blue-100 text-[11px] text-slate-700 font-medium">
                      <p className="font-bold text-blue-900">Phlebotomist Dispatched</p>
                      <p className="text-slate-500 mt-0.5">
                        Name: {selectedRequest.technicianName}<br />
                        Phone: {selectedRequest.technicianPhone}
                      </p>
                    </div>

                    <p className="text-[11px] text-slate-500 font-medium leading-normal">
                      Once your technician returns to the facility with the physical blood/swab sample vials, mark it collected to initiate the diagnostic assessment.
                    </p>

                    <button
                      onClick={handleMarkSampleCollected}
                      className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-[11px] rounded-lg shadow-sm transition-all flex items-center justify-center gap-1.5"
                    >
                      <Beaker className="w-3.5 h-3.5" />
                      <span>Confirm Sample Received</span>
                    </button>
                  </div>
                )}

                {/* STEP 3: Share Report besonders Form */}
                {(selectedRequest.status === 'sample-collected' || selectedRequest.status === 'report-ready') && (
                  <div className="border border-slate-100 bg-slate-50/50 rounded-xl p-3.5 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 justify-between">
                      <span className="flex items-center gap-1">
                        <FileCheck className="w-4 h-4 text-emerald-600" />
                        <span>Share Diagnostic Report</span>
                      </span>
                      {selectedRequest.status === 'report-ready' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-1.5 py-0.5 rounded-md">
                          Published
                        </span>
                      )}
                    </div>

                    {shareSuccess && (
                      <p className="text-[11px] font-medium text-emerald-700 bg-emerald-50 p-2 rounded-lg border border-emerald-100">
                        {shareSuccess}
                      </p>
                    )}

                    {/* Report presets generator */}
                    {selectedRequest.status !== 'report-ready' && (
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Quick Report Presets</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            type="button"
                            onClick={() => generateSimulatedPreset('Complete Blood Count (CBC)')}
                            className="p-1.5 text-slate-600 hover:text-blue-900 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[9px] font-bold text-center leading-tight truncate"
                          >
                            Normal CBC Hematology
                          </button>
                          <button
                            type="button"
                            onClick={() => generateSimulatedPreset('Comprehensive Lipid Profile')}
                            className="p-1.5 text-slate-600 hover:text-blue-900 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[9px] font-bold text-center leading-tight truncate"
                          >
                            Borderline High Lipid
                          </button>
                          <button
                            type="button"
                            onClick={() => generateSimulatedPreset('HbA1c + Blood Glucose')}
                            className="p-1.5 text-slate-600 hover:text-blue-900 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[9px] font-bold text-center leading-tight truncate"
                          >
                            Healthy HbA1c Diabetes
                          </button>
                          <button
                            type="button"
                            onClick={() => generateSimulatedPreset('Clear General Assays')}
                            className="p-1.5 text-slate-600 hover:text-blue-900 bg-white hover:bg-blue-50 border border-slate-200 rounded text-[9px] font-bold text-center leading-tight truncate"
                          >
                            Standard Pathology preset
                          </button>
                        </div>
                      </div>
                    )}

                    {selectedRequest.status === 'report-ready' && (
                      <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 text-[11px] text-emerald-800 font-medium">
                        <p className="font-bold flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" />{selectedRequest.reportPdfName}</p>
                        <p className="text-[10px] text-slate-500 mt-1">Shared Comments/Findings: {selectedRequest.reportComments}</p>
                      </div>
                    )}

                    {selectedRequest.status !== 'report-ready' ? (
                      <form onSubmit={handleShareReportSubmit} className="space-y-3 pt-1">
                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase">Document Report Name *</label>
                          <input
                            type="text"
                            placeholder="e.g. Hematology_CBC_Blood_Panel.pdf"
                            value={customReportName}
                            onChange={e => setCustomReportName(e.target.value)}
                            required
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-red-600 bg-white font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase">Preset Report PDF Link (Mocked URL)</label>
                          <select
                            value={selectedPresetUrl}
                            onChange={e => setSelectedPresetUrl(e.target.value)}
                            className="w-full text-[11px] p-2 rounded-lg border border-slate-200 focus:outline-none bg-white font-medium text-slate-700"
                          >
                            <option value="https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf">Standard Clinical PDF sample (dummy.pdf)</option>
                            <option value="https://pdfobject.com/pdf/sample.pdf">Alternative Diagnostic PDF sample (sample.pdf)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-[9px] font-bold text-slate-500 uppercase">Observations / Test Comments *</label>
                          <textarea
                            rows={4}
                            placeholder="Type test measurements or observations particularly..."
                            value={reportComments}
                            onChange={e => setReportComments(e.target.value)}
                            required
                            className="w-full text-xs p-2 rounded-lg border border-slate-200 focus:outline-none focus:border-red-600 bg-white font-medium"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-colors flex items-center justify-center gap-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Publish & Share Report</span>
                        </button>
                      </form>
                    ) : (
                      <div className="pt-2 text-center">
                        <p className="text-[11px] text-slate-400 font-medium">To modify or republish this report, contact central system administrator support.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center text-slate-400">
              <Beaker className="w-10 h-10 text-slate-200 mx-auto mb-2" />
              <p className="text-xs font-bold text-slate-700">Select a Sample Request</p>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-normal">
                Click on any request on the left pane to dispatch phlebotomists, record sample acquisitions, or upload/share reports.
              </p>
            </div>
          )}

          {/* Guidelines info card */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-2xl">
            <div className="flex items-center gap-2 text-blue-800 font-bold text-xs">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Diagnostic Portal Rules</span>
            </div>
            <ul className="text-[10px] text-slate-600 mt-2 space-y-1.5 list-disc list-inside leading-normal font-medium">
              <li>Home sample collection is requested by patients online.</li>
              <li>Always update your technician dispatch profile so patients can see who is arriving.</li>
              <li>Sharing a diagnostic report will automatically archive the test PDF in the patient's secure digital vault.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
};
