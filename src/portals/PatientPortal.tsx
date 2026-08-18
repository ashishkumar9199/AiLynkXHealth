import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { VideoCallModal } from '../components/VideoCallModal';
import { Appointment } from '../types';
import { InsuranceVerification } from '../components/InsuranceVerification';
import { PatientProfileSection } from '../components/PatientProfileSection';
import { AIPrescriptionAnalyzer } from '../components/AIPrescriptionAnalyzer';
import { jsPDF } from 'jspdf';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
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
  Sparkles,
  TrendingUp,
  Activity
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

  // High-fidelity custom PDF generation function using jsPDF
  const downloadReportPDF = (req: any) => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Page dimensions
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      // Theme Colors
      const primaryColor = [15, 23, 42]; // Slate 900
      const accentColor = [37, 99, 235]; // Blue 600
      const lightBg = [248, 250, 252]; // Slate 50
      const borderColor = [226, 232, 240]; // Slate 200
      const textGray = [100, 116, 139]; // Slate 500

      // 1. Clinical Letterhead & Title Banner
      doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
      doc.rect(0, 0, pageWidth, 15, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.text('HEALTHCONNECT INTEGRATED PATHOLOGY NETWORK', 14, 10);
      doc.setFont('helvetica', 'normal');
      doc.text('AUTOMATED CLINICAL DOSSIER DISPATCH', pageWidth - 14, 10, { align: 'right' });

      // Brand Logo Header
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('HealthConnect Pathology Services', 14, 32);

      doc.setTextColor(textGray[0], textGray[1], textGray[2]);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('77 Health Boulevard, Clinical Sector 4 | Support: +1 (555) 888-0011 | pathology@healthconnect.org', 14, 38);

      // Horizontal Divider Line
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.5);
      doc.line(14, 42, pageWidth - 14, 42);

      // 2. Patient Demographics & Lab Information Grid Box
      doc.setFillColor(lightBg[0], lightBg[1], lightBg[2]);
      doc.rect(14, 46, pageWidth - 28, 38, 'F');
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.rect(14, 46, pageWidth - 28, 38, 'S');

      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('PATIENT DEMOGRAPHICS', 18, 52);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Name:`, 18, 59);
      doc.setFont('helvetica', 'bold');
      doc.text(`${req.patientName || 'Demo Patient'}`, 34, 59);

      doc.setFont('helvetica', 'normal');
      doc.text(`Age/Sex:`, 18, 65);
      doc.setFont('helvetica', 'bold');
      doc.text(`30 Years / Male`, 34, 65);

      doc.setFont('helvetica', 'normal');
      doc.text(`Contact:`, 18, 71);
      doc.setFont('helvetica', 'bold');
      doc.text(`${req.patientPhone || '+1 555-0199'}`, 34, 71);

      doc.setFont('helvetica', 'normal');
      doc.text(`Address:`, 18, 77);
      doc.setFont('helvetica', 'bold');
      const cleanAddress = req.patientAddress ? req.patientAddress.substring(0, 45) : '128 Pinecrest Avenue, Apartment 4B';
      doc.text(cleanAddress, 34, 77);

      // Lab Dispatch info (Right side of grid Box)
      const rightX = 110;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('DIAGNOSTICS SPECIFICATIONS', rightX, 52);

      doc.setFont('helvetica', 'normal');
      doc.text(`Lab Request ID:`, rightX, 59);
      doc.setFont('helvetica', 'bold');
      doc.text(`${req.id}`, rightX + 32, 59);

      doc.setFont('helvetica', 'normal');
      doc.text(`Sample Date:`, rightX, 65);
      doc.setFont('helvetica', 'bold');
      doc.text(`${req.preferredDate || '2026-08-16'}`, rightX + 32, 65);

      doc.setFont('helvetica', 'normal');
      doc.text(`Source Lab:`, rightX, 71);
      doc.setFont('helvetica', 'bold');
      doc.text(`${req.labName || 'Apex Diagnostic Hub'}`, rightX + 32, 71);

      doc.setFont('helvetica', 'normal');
      doc.text(`Status:`, rightX, 77);
      doc.setTextColor(16, 185, 129); // Green 500
      doc.setFont('helvetica', 'bold');
      doc.text(`COMPLETED / VERIFIED`, rightX + 32, 77);

      // Restore Text Color
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);

      // 3. Lab Test Biomarkers Table
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('LABORATORY ANALYSIS RESULTS', 14, 94);

      // Table Header row
      doc.setFillColor(30, 41, 59); // Dark grey
      doc.rect(14, 98, pageWidth - 28, 8, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('TEST PARAMETER', 18, 103);
      doc.text('OBSERVED VALUE', 90, 103);
      doc.text('REFERENCE RANGE', 135, 103);
      doc.text('STATUS', 175, 103);

      // Table Body Rows (Mock biomarkers)
      const biomarkers = [
        { name: 'Haemoglobin', val: '14.5 g/dL', range: '13.5 - 17.5 g/dL', status: 'Optimal', isNormal: true },
        { name: 'Fasting Blood Sugar', val: '104 mg/dL', range: '70 - 100 mg/dL', status: 'Borderline High', isNormal: false },
        { name: 'Total Cholesterol', val: '195 mg/dL', range: '< 200 mg/dL', status: 'Optimal', isNormal: true },
        { name: 'HbA1c (Glycated Hb)', val: '5.6 %', range: '< 5.7 %', status: 'Optimal', isNormal: true },
        { name: 'Triglycerides', val: '148 mg/dL', range: '< 150 mg/dL', status: 'Optimal', isNormal: true },
        { name: 'Serum Calcium', val: '9.2 mg/dL', range: '8.8 - 10.2 mg/dL', status: 'Optimal', isNormal: true },
        { name: 'Vitamin D3 (25-OH)', val: '31.4 ng/mL', range: '30.0 - 100.0 ng/mL', status: 'Optimal', isNormal: true }
      ];

      let currentY = 106;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);

      biomarkers.forEach((bm, idx) => {
        // Zebra striping
        if (idx % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, currentY, pageWidth - 28, 7.5, 'F');
        }
        
        doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
        doc.line(14, currentY + 7.5, pageWidth - 14, currentY + 7.5);

        // Render Values
        doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
        doc.setFont('helvetica', 'bold');
        doc.text(bm.name, 18, currentY + 5);
        
        doc.setFont('helvetica', 'normal');
        doc.text(bm.val, 90, currentY + 5);
        doc.text(bm.range, 135, currentY + 5);

        // Render Status badge with safe colors
        if (bm.isNormal) {
          doc.setTextColor(16, 185, 129); // Green
          doc.setFont('helvetica', 'bold');
          doc.text(bm.status, 175, currentY + 5);
        } else {
          doc.setTextColor(245, 158, 11); // Amber
          doc.setFont('helvetica', 'bold');
          doc.text(bm.status, 175, currentY + 5);
        }

        currentY += 7.5;
      });

      // 4. Clinical Review & Notes Section
      currentY += 10;
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.setLineWidth(0.5);
      doc.line(14, currentY, pageWidth - 14, currentY);

      currentY += 6;
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('CLINICAL PATHOLOGIST OBSERVATIONS', 14, currentY);

      currentY += 4;
      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      
      const clinicalComments = doc.splitTextToSize(
        req.reportComments || "No special comments. All metabolic indices are within standard reference targets. Periodic checkups are recommended twice annually.",
        pageWidth - 28
      );
      doc.text(clinicalComments, 14, currentY);

      // 5. Signature Footer Block
      currentY += 24;
      if (currentY > pageHeight - 40) {
        doc.addPage();
        currentY = 30;
      }

      // Pathologist details
      doc.setDrawColor(borderColor[0], borderColor[1], borderColor[2]);
      doc.line(14, currentY, 74, currentY);
      doc.line(pageWidth - 74, currentY, pageWidth - 14, currentY);

      doc.setFontSize(8.5);
      doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
      doc.setFont('helvetica', 'bold');
      doc.text('Dr. Nathan Cole, MD (Pathology)', 14, currentY + 5);
      doc.setFont('helvetica', 'normal');
      doc.text('Consultant Clinical Pathologist', 14, currentY + 9);
      doc.text('Lic No: LIC-882741', 14, currentY + 13);

      doc.setFont('helvetica', 'bold');
      doc.text('Rahul Sharma, B.Sc (MLT)', pageWidth - 74, currentY + 5);
      doc.setFont('helvetica', 'normal');
      doc.text('Senior Laboratory Phlebotomist', pageWidth - 74, currentY + 9);
      doc.text('Contact Verification Node Active', pageWidth - 74, currentY + 13);

      // Security Stamp Watermark overlay
      doc.setFillColor(240, 253, 250);
      doc.setDrawColor(13, 148, 136);
      doc.setLineWidth(0.8);
      doc.rect(pageWidth / 2 - 25, currentY - 5, 50, 16, 'D');
      doc.setTextColor(13, 148, 136);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.text('VERIFIED & SIGNED', pageWidth / 2, currentY + 1, { align: 'center' });
      doc.setFontSize(6);
      doc.text('HealthConnect Pathology Hub', pageWidth / 2, currentY + 6, { align: 'center' });

      // Save PDF document
      doc.save(req.reportPdfName || `Lab_Report_${req.id}.pdf`);
    } catch (error) {
      console.error("PDF generation failed:", error);
    }
  };

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

      {/* Tab Content 3: Home Lab Samples Visual Dashboard */}
      {activeTab === 'samples' && (
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h2 className="font-extrabold text-slate-900 text-2xl flex items-center gap-2">
                <Activity className="w-6 h-6 text-blue-600 animate-pulse" />
                Lab Diagnostics & Wellness Dashboard
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Monitor live home-sample status, review biomaterial analytics, and download official clinical reports.
              </p>
            </div>
            
            <button
              onClick={() => setPortal('landing')}
              className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm shrink-0"
            >
              <Plus className="w-4 h-4" />
              Order New Home Lab Test
            </button>
          </div>

          {/* Quick Metrics Header Card Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-3xl flex items-center gap-3">
              <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-sm shadow-blue-200">
                <TestTube2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-blue-700 font-extrabold uppercase tracking-wider block">Total Test Bookings</span>
                <span className="text-xl font-black text-slate-900">{sampleRequests.length}</span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 p-4 rounded-3xl flex items-center gap-3">
              <div className="p-3 bg-amber-500 rounded-2xl text-white shadow-sm shadow-amber-200">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-amber-700 font-extrabold uppercase tracking-wider block">In-Progress Samples</span>
                <span className="text-xl font-black text-slate-900">
                  {sampleRequests.filter(r => r.status !== 'report-ready').length}
                </span>
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-4 rounded-3xl flex items-center gap-3">
              <div className="p-3 bg-emerald-600 rounded-2xl text-white shadow-sm shadow-emerald-200">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] text-emerald-700 font-extrabold uppercase tracking-wider block">Reports Released (PDF)</span>
                <span className="text-xl font-black text-slate-900">
                  {sampleRequests.filter(r => r.status === 'report-ready').length}
                </span>
              </div>
            </div>
          </div>

          {/* Biomarker Trend Chart Panel using Recharts */}
          <div className="bg-white border border-slate-200 p-5 rounded-3xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Historical Biomarker Analysis</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Chronological progress chart of your core metrics across past tests.</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold text-slate-500 uppercase bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
                Verified Lab Synced
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 h-64 bg-slate-50 rounded-2xl p-2 border border-slate-100 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { date: 'Jun 15', Glucose: 92, Haemoglobin: 13.8, Cholesterol: 180 },
                      { date: 'Jul 15', Glucose: 95, Haemoglobin: 14.1, Cholesterol: 188 },
                      { date: 'Aug 16', Glucose: 104, Haemoglobin: 14.5, Cholesterol: 195 }
                    ]}
                    margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                    <YAxis tick={{ fontSize: 9, fontWeight: 700, fill: '#64748b' }} />
                    <Tooltip contentStyle={{ fontSize: '11px', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    <Legend wrapperStyle={{ fontSize: '10px', fontWeight: 800 }} />
                    <Line name="Fasting Glucose (mg/dL)" type="monotone" dataKey="Glucose" stroke="#2563eb" strokeWidth={3} activeDot={{ r: 6 }} />
                    <Line name="Haemoglobin (g/dL)" type="monotone" dataKey="Haemoglobin" stroke="#10b981" strokeWidth={3} />
                    <Line name="Total Cholesterol (mg/dL)" type="monotone" dataKey="Cholesterol" stroke="#f59e0b" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex flex-col justify-between">
                <div className="space-y-3">
                  <span className="text-[10px] text-blue-900 font-extrabold bg-blue-50 px-2 py-1 rounded-md border border-blue-100 block w-fit uppercase">
                    Key Indicators Guide
                  </span>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-slate-700 font-bold">
                      <span className="text-slate-600 font-medium">Fasting Glucose:</span>
                      <span className="font-extrabold text-slate-900">70 - 100 mg/dL</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-700 font-bold">
                      <span className="text-slate-600 font-medium">Haemoglobin:</span>
                      <span className="font-extrabold text-slate-900">13.5 - 17.5 g/dL</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-slate-700 font-bold">
                      <span className="text-slate-600 font-medium">Total Cholesterol:</span>
                      <span className="font-extrabold text-slate-900">&lt; 200 mg/dL</span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-200 pt-3 mt-3 text-[11px] text-slate-500 leading-relaxed font-semibold">
                  <strong>Clinical Note:</strong> Fasting glucose rose to <span className="text-amber-600 font-bold">104 mg/dL</span> on August 16. Fasting glucose above 100 is borderline. Keep exercising regularly and avoid added sugars.
                </div>
              </div>
            </div>
          </div>

          {/* Individual Test Request Trackers */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm">Active Lab Progress & Reports</h3>

            <div className="space-y-4">
              {sampleRequests.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                  <p className="text-slate-600 font-semibold text-sm">No active home sample collection requests.</p>
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
                  
                  // Progress step numerical value
                  const activeStep = isPending ? 1 : isAssigned ? 2 : isCollected ? 3 : 4;

                  return (
                    <div key={req.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4 transition-all hover:shadow-md">
                      {/* Booking Metadata Header */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900">
                            Request #{req.id}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">•</span>
                          <span className="text-xs text-slate-500 font-bold">
                            {req.labName || 'Partner Lab'}
                          </span>
                        </div>
                        
                        <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${
                          isPending ? 'bg-amber-100 text-amber-800 border-amber-200' :
                          isAssigned ? 'bg-blue-100 text-blue-800 border-blue-200' :
                          isCollected ? 'bg-purple-100 text-purple-800 border-purple-200' :
                          'bg-emerald-100 text-emerald-800 border-emerald-200'
                        }`}>
                          {req.status.replace('-', ' ')}
                        </span>
                      </div>

                      {/* Diagnostic Tests Booked */}
                      <div>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Ordered Panels</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {req.selectedTests.map((t, idx) => (
                            <span key={idx} className="bg-slate-100 border border-slate-200 rounded-xl px-2.5 py-1 text-slate-700 text-[11px] font-bold">
                              {t}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Live Visual Tracker Stepper */}
                      <div className="bg-slate-50/50 p-4 rounded-2xl border border-slate-100 space-y-3">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Real-time Sample Progress</span>
                        
                        <div className="relative flex items-center justify-between mt-6 px-4">
                          {/* Stepper background line */}
                          <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-200">
                            <div 
                              className="h-full bg-blue-600 transition-all duration-500" 
                              style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
                            />
                          </div>

                          {/* Stepper Node 1 */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                              activeStep >= 1 ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200' : 'bg-white border-slate-300 text-slate-500'
                            }`}>
                              1
                            </div>
                            <span className="text-[10px] font-extrabold text-slate-700 mt-1.5">Registered</span>
                          </div>

                          {/* Stepper Node 2 */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                              activeStep >= 2 ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200' : 'bg-white border-slate-300 text-slate-500'
                            }`}>
                              2
                            </div>
                            <span className="text-[10px] font-extrabold text-slate-700 mt-1.5">Assigned</span>
                          </div>

                          {/* Stepper Node 3 */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                              activeStep >= 3 ? 'bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-200' : 'bg-white border-slate-300 text-slate-500'
                            }`}>
                              3
                            </div>
                            <span className="text-[10px] font-extrabold text-slate-700 mt-1.5">Collected</span>
                          </div>

                          {/* Stepper Node 4 */}
                          <div className="relative z-10 flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs border ${
                              activeStep >= 4 ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm shadow-emerald-200' : 'bg-white border-slate-300 text-slate-500'
                            }`}>
                              4
                            </div>
                            <span className="text-[10px] font-extrabold text-slate-700 mt-1.5">Report Ready</span>
                          </div>
                        </div>
                      </div>

                      {/* Scheduled Logistics details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-bold">
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Date & Preferred Time</p>
                          <p className="text-slate-800 font-bold mt-0.5">📅 {req.preferredDate} ({req.preferredTime})</p>
                        </div>
                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">Patient Address</p>
                          <p className="text-slate-800 font-bold mt-0.5">📍 {req.patientAddress}</p>
                        </div>
                      </div>

                      {/* Assigned Phlebotomist Info Block */}
                      {(req.technicianName || req.technicianPhone) && (
                        <div className="p-3 bg-blue-50 border border-blue-100 rounded-xl text-xs text-slate-700 flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-800 font-bold flex items-center justify-center text-xs shrink-0 border border-blue-200">
                              {req.technicianName?.substring(0, 2).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-extrabold text-blue-900 text-xs">Home-Service Technician Assigned</p>
                              <p className="text-[11px] text-slate-600 font-bold mt-0.5">
                                Name: {req.technicianName} | Mobile: {req.technicianPhone}
                              </p>
                            </div>
                          </div>
                          
                          <a 
                            href={`tel:${req.technicianPhone}`}
                            className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wide shrink-0 shadow-sm"
                          >
                            Call Agent
                          </a>
                        </div>
                      )}

                      {/* Report PDF Display with Custom Pathologist PDF trigger */}
                      {isReady && (
                        <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100 space-y-3">
                          <div className="flex items-center justify-between gap-3 flex-wrap">
                            <div>
                              <span className="text-[10px] text-emerald-800 font-extrabold uppercase tracking-widest block">Laboratory Dossier Released</span>
                              <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5 mt-0.5">
                                <FileText className="w-4 h-4 text-emerald-600" />
                                {req.reportPdfName || 'Official_Health_Report.pdf'}
                              </span>
                            </div>
                            
                            <button
                              onClick={() => downloadReportPDF(req)}
                              className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black uppercase tracking-wide px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 shadow-sm"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF Report</span>
                            </button>
                          </div>
                          
                          {req.reportComments && (
                            <div className="bg-white/90 p-3 rounded-xl border border-emerald-100 text-[11px] text-slate-600 leading-relaxed font-semibold">
                              <span className="font-extrabold text-emerald-900 block text-[10px] uppercase mb-1">
                                Pathological Review Comments:
                              </span>
                              <p className="whitespace-pre-line font-semibold">{req.reportComments}</p>
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
