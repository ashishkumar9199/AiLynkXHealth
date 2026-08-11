import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  PortalType,
  Language,
  Doctor,
  PharmacyStore,
  MedicineItem,
  CartItem,
  Appointment,
  HomeSampleRequest,
  MedicineOrder,
  Notification,
  UploadedMedicalDoc,
  Hospital,
  DiagnosticLab
} from '../types';
import {
  initialDoctors,
  initialStores,
  initialMedicines,
  initialNotifications,
  initialAppointments,
  initialHospitals,
  initialLabs
} from '../data/initialData';
import { translations } from '../i18n/translations';

interface AppContextType {
  portal: PortalType;
  setPortal: (portal: PortalType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;

  // Doctors
  doctors: Doctor[];
  addDoctor: (doc: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => void;
  editDoctor: (doc: Doctor) => void;
  deleteDoctor: (id: string) => void;

  // Hospitals
  hospitals: Hospital[];
  addHospital: (hosp: Omit<Hospital, 'id' | 'rating'>) => void;
  editHospital: (hosp: Hospital) => void;
  deleteHospital: (id: string) => void;

  // Stores & Medicines
  stores: PharmacyStore[];
  addStore: (store: Omit<PharmacyStore, 'id' | 'rating' | 'isPartnerStore'>) => void;
  editStore: (store: PharmacyStore) => void;
  medicines: MedicineItem[];
  addMedicine: (med: Omit<MedicineItem, 'id'>) => void;

  // Cart & Orders
  cart: CartItem[];
  addToCart: (med: MedicineItem, qty?: number) => void;
  removeFromCart: (medId: string) => void;
  updateCartQuantity: (medId: string, delta: number) => void;
  clearCart: () => void;
  orders: MedicineOrder[];
  placeOrder: (order: Omit<MedicineOrder, 'id' | 'createdAt' | 'status'>) => void;
  updateOrderStatus: (id: string, status: MedicineOrder['status']) => void;

  // Appointments
  appointments: Appointment[];
  bookAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>) => Promise<Appointment>;
  updateAppointmentStatus: (id: string, status: Appointment['status'], ePrescription?: string, doctorNotes?: string) => void;

  // Home Sample
  sampleRequests: HomeSampleRequest[];
  requestHomeSample: (sample: Omit<HomeSampleRequest, 'id' | 'createdAt' | 'status'>) => Promise<HomeSampleRequest>;
  updateSampleStatus: (id: string, status: HomeSampleRequest['status'], technicianName?: string, technicianPhone?: string) => void;
  shareLabReport: (requestId: string, reportPdfUrl: string, reportPdfName: string, reportComments: string) => void;

  // Diagnostic Labs
  labs: DiagnosticLab[];
  addLab: (lab: Omit<DiagnosticLab, 'id' | 'rating'>) => void;
  editLab: (lab: DiagnosticLab) => void;
  deleteLab: (id: string) => void;

  // Uploaded Documents
  uploadedDocs: UploadedMedicalDoc[];
  uploadDocument: (doc: Omit<UploadedMedicalDoc, 'id' | 'uploadDate'>) => void;

  // Notifications
  notifications: Notification[];
  unreadNotificationCount: number;
  addNotification: (notif: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Modals & Drawers
  isPortalDrawerOpen: boolean;
  setIsPortalDrawerOpen: (open: boolean) => void;
  isNotificationDrawerOpen: boolean;
  setIsNotificationDrawerOpen: (open: boolean) => void;
  isSosModalOpen: boolean;
  setIsSosModalOpen: (open: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'signup';
  setAuthModalMode: (mode: 'login' | 'signup') => void;
  activeVideoCall: Appointment | null;
  startVideoCall: (apt: Appointment) => void;
  endVideoCall: () => void;
  activeBookingDoctor: Doctor | null;
  setActiveBookingDoctor: (doc: Doctor | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const [portal, setPortalState] = useState<PortalType>('landing');
  const [language, setLanguageState] = useState<Language>('en');

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    const stored = localStorage.getItem('aily_doctors');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored doctors', e);
      }
    }
    return initialDoctors;
  });

  const [hospitals, setHospitals] = useState<Hospital[]>(() => {
    const stored = localStorage.getItem('aily_hospitals');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored hospitals', e);
      }
    }
    return initialHospitals;
  });

  const [stores, setStores] = useState<PharmacyStore[]>(() => {
    const stored = localStorage.getItem('aily_stores');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored stores', e);
      }
    }
    return initialStores;
  });

  const [labs, setLabs] = useState<DiagnosticLab[]>(() => {
    const stored = localStorage.getItem('aily_labs');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored labs', e);
      }
    }
    return initialLabs;
  });

  useEffect(() => {
    localStorage.setItem('aily_doctors', JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem('aily_hospitals', JSON.stringify(hospitals));
  }, [hospitals]);

  useEffect(() => {
    localStorage.setItem('aily_stores', JSON.stringify(stores));
  }, [stores]);

  useEffect(() => {
    localStorage.setItem('aily_labs', JSON.stringify(labs));
  }, [labs]);

  const [medicines, setMedicines] = useState<MedicineItem[]>(initialMedicines);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  
  const [sampleRequests, setSampleRequests] = useState<HomeSampleRequest[]>(() => {
    const stored = localStorage.getItem('aily_sample_requests');
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Error parsing stored sample requests', e);
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('aily_sample_requests', JSON.stringify(sampleRequests));
  }, [sampleRequests]);
  const [orders, setOrders] = useState<MedicineOrder[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  
  const [uploadedDocs, setUploadedDocs] = useState<UploadedMedicalDoc[]>([]);

  const [isPortalDrawerOpen, setIsPortalDrawerOpen] = useState(false);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('login');
  const [activeVideoCall, setActiveVideoCall] = useState<Appointment | null>(null);
  const [activeBookingDoctor, setActiveBookingDoctor] = useState<Doctor | null>(null);

  // Synchronize URL path with local portal state for full multi-page fidelity
  useEffect(() => {
    const rawStoredPath = localStorage.getItem('admin_secret_path') || 'admin-gate-suk2h2ai';
    const cleanSecret = rawStoredPath.trim().toLowerCase().replace(/^#\/?/, '').replace(/^\//, '').replace(/\/$/, '');
    
    const cleanPath = location.pathname.toLowerCase().replace(/^\//, '').replace(/\/$/, '');
    const cleanHash = location.hash.toLowerCase().replace(/^#\/?/, '').replace(/\/$/, '');
    const searchParams = new URLSearchParams(location.search.toLowerCase());
    const hasSecretInSearch = Array.from(searchParams.values()).some(val => val === cleanSecret) || location.search.toLowerCase().includes(cleanSecret);

    if (cleanPath === cleanSecret || cleanHash === cleanSecret || hasSecretInSearch) {
      setPortalState('admin');
      if (cleanPath !== cleanSecret) {
        navigate(`/${cleanSecret}`, { replace: true });
      }
    } else if (cleanPath === 'patient') {
      setPortalState('patient');
    } else if (cleanPath === 'doctor') {
      setPortalState('doctor');
    } else if (cleanPath === 'hospital') {
      setPortalState('hospital');
    } else if (cleanPath === 'pharmacy') {
      setPortalState('pharmacy');
    } else if (cleanPath === 'lab') {
      setPortalState('lab');
    } else if (cleanPath === '' || cleanPath === 'landing') {
      setPortalState('landing');
    }
  }, [location.pathname, location.hash, location.search]);

  // Translation function
  const t = (key: string): string => {
    const langObj = translations[language] || translations.en;
    return langObj[key] || translations.en[key] || key;
  };

  // Portal switcher with scroll reset and router navigation
  const setPortal = (p: PortalType) => {
    setIsPortalDrawerOpen(false);
    
    let targetPath = '/';
    if (p === 'patient') targetPath = '/patient';
    else if (p === 'doctor') targetPath = '/doctor';
    else if (p === 'hospital') targetPath = '/hospital';
    else if (p === 'pharmacy') targetPath = '/pharmacy';
    else if (p === 'lab') targetPath = '/lab';
    else if (p === 'admin') {
      const rawStoredPath = localStorage.getItem('admin_secret_path') || 'admin-gate-suk2h2ai';
      const cleanSecret = rawStoredPath.trim().toLowerCase().replace(/^#\/?/, '').replace(/^\//, '');
      targetPath = `/${cleanSecret}`;
    }
    
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Language switcher
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    // RTL handling for Arabic
    if (lang === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // Doctor CRUD (Admin & Signup)
  const addDoctor = (docData: Omit<Doctor, 'id' | 'rating' | 'reviewCount'>) => {
    const newDoc: Doctor = {
      ...docData,
      id: `doc-${Date.now()}`,
      rating: 5.0,
      reviewCount: 1,
      approvalStatus: (docData as any).approvalStatus || 'approved'
    };
    setDoctors(prev => [newDoc, ...prev]);

    // Send Notification to all portals
    if (newDoc.approvalStatus === 'approved') {
      addNotification({
        title: '🩺 New Specialist Doctor Added',
        message: `${newDoc.name} (${newDoc.specialty}) is now listed on the landing page and available for booking!`,
        type: 'system',
        targetPortal: 'landing'
      });
    } else {
      addNotification({
        title: '🩺 New Doctor Registration',
        message: `Dr. ${newDoc.name} has registered and is waiting for admin verification and approval.`,
        type: 'system',
        targetPortal: 'admin'
      });
    }
  };

  const editDoctor = (updatedDoc: Doctor) => {
    setDoctors(prev => prev.map(d => d.id === updatedDoc.id ? updatedDoc : d));
  };

  const deleteDoctor = (id: string) => {
    setDoctors(prev => prev.filter(d => d.id !== id));
  };

  // Hospital CRUD
  const addHospital = (hospData: Omit<Hospital, 'id' | 'rating'>) => {
    const newHosp: Hospital = {
      ...hospData,
      id: `hosp-${Date.now()}`,
      rating: 5.0,
      isActive: true,
      approvalStatus: (hospData as any).approvalStatus || 'approved'
    };
    setHospitals(prev => [newHosp, ...prev]);

    if (newHosp.approvalStatus === 'approved') {
      addNotification({
        title: '🏥 New Hospital Registered',
        message: `${newHosp.name} has joined the Medicare Plus network!`,
        type: 'system',
        targetPortal: 'landing'
      });
    } else {
      addNotification({
        title: '🏥 Hospital Sign-up Pending',
        message: `${newHosp.name} has submitted a clinical center registration. Waiting for admin approval.`,
        type: 'system',
        targetPortal: 'admin'
      });
    }
  };

  const editHospital = (updatedHosp: Hospital) => {
    setHospitals(prev => prev.map(h => h.id === updatedHosp.id ? updatedHosp : h));
  };

  const deleteHospital = (id: string) => {
    setHospitals(prev => prev.filter(h => h.id !== id));
  };

  // Pharmacy Stores CRUD (Admin)
  const addStore = (storeData: Omit<PharmacyStore, 'id' | 'rating' | 'isPartnerStore'>) => {
    const newStore: PharmacyStore = {
      ...storeData,
      id: `store-${Date.now()}`,
      rating: 5.0,
      isPartnerStore: true,
      approvalStatus: (storeData as any).approvalStatus || 'approved'
    };
    setStores(prev => [...prev, newStore]);

    if (newStore.approvalStatus === 'approved') {
      addNotification({
        title: '🏪 New Pharmacy Store Added',
        message: `${newStore.name} added to pharmacy portal for medicine ordering.`,
        type: 'system',
        targetPortal: 'pharmacy'
      });
    } else {
      addNotification({
        title: '🏪 Pharmacy Registration Pending',
        message: `${newStore.name} has submitted a partner store application. Waiting for admin approval.`,
        type: 'system',
        targetPortal: 'admin'
      });
    }
  };

  const editStore = (updatedStore: PharmacyStore) => {
    setStores(prev => prev.map(s => s.id === updatedStore.id ? updatedStore : s));
  };

  const addMedicine = (medData: Omit<MedicineItem, 'id'>) => {
    const newMed: MedicineItem = {
      ...medData,
      id: `med-${Date.now()}`
    };
    setMedicines(prev => [newMed, ...prev]);
  };

  // Shopping Cart & Orders
  const addToCart = (med: MedicineItem, qty = 1) => {
    setCart(prev => {
      const existingIndex = prev.findIndex(item => item.medicine.id === med.id);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += qty;
        return updated;
      }
      return [...prev, { medicine: med, quantity: qty }];
    });
  };

  const removeFromCart = (medId: string) => {
    setCart(prev => prev.filter(item => item.medicine.id !== medId));
  };

  const updateCartQuantity = (medId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.medicine.id === medId) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (orderData: Omit<MedicineOrder, 'id' | 'createdAt' | 'status'>) => {
    const newOrder: MedicineOrder = {
      ...orderData,
      id: `MED-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'placed',
      createdAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    clearCart();

    addNotification({
      title: '📦 Medicine Order Placed',
      message: `Order #${newOrder.id} placed successfully ($${newOrder.totalAmount.toFixed(2)}). Dispatching soon!`,
      type: 'order',
      targetPortal: 'patient'
    });
  };

  const updateOrderStatus = (id: string, status: MedicineOrder['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    
    addNotification({
      title: '🚚 Medicine Order Status Update',
      message: `Order #${id} status changed to: ${status.replace('-', ' ').toUpperCase()}.`,
      type: 'order',
      targetPortal: 'patient'
    });
  };

  // Appointment Booking System
  const bookAppointment = async (aptData: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment> => {
    const newApt: Appointment = {
      ...aptData,
      id: `APT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'scheduled',
      meetingRoomId: `room-medicare-${Date.now().toString().slice(-4)}`,
      createdAt: new Date().toISOString()
    };

    setAppointments(prev => [newApt, ...prev]);

    // Store uploaded PDFs to patient's document hub
    if (newApt.prescriptionPdfName && newApt.prescriptionPdfUrl) {
      uploadDocument({
        name: newApt.prescriptionPdfName,
        fileType: 'prescription',
        url: newApt.prescriptionPdfUrl,
        size: '1.5 MB'
      });
    }

    if (newApt.testPdfName && newApt.testPdfUrl) {
      uploadDocument({
        name: newApt.testPdfName,
        fileType: 'test_pdf',
        url: newApt.testPdfUrl,
        size: '2.1 MB'
      });
    }

    addNotification({
      title: `📅 ${newApt.mode === 'video' ? 'Video Consultation' : 'Clinic Visit'} Scheduled`,
      message: `Appointment with ${newApt.doctorName} on ${newApt.date} at ${newApt.timeSlot} confirmed!`,
      type: 'appointment',
      targetPortal: 'patient'
    });

    return newApt;
  };

  const updateAppointmentStatus = (
    id: string,
    status: Appointment['status'],
    ePrescription?: string,
    doctorNotes?: string
  ) => {
    setAppointments(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status,
          ePrescription: ePrescription || a.ePrescription,
          doctorNotes: doctorNotes || a.doctorNotes
        };
      }
      return a;
    }));

    if (ePrescription) {
      uploadDocument({
        name: `E-Prescription_${id}.pdf`,
        fileType: 'prescription',
        url: '#',
        size: '0.8 MB'
      });

      addNotification({
        title: '📋 New E-Prescription Issued',
        message: `Dr. issued an electronic prescription for Appointment #${id}. View in your patient dashboard.`,
        type: 'appointment',
        targetPortal: 'patient'
      });
    }
  };

  // Home Sample Collection
  const requestHomeSample = async (sampleData: Omit<HomeSampleRequest, 'id' | 'createdAt' | 'status'>): Promise<HomeSampleRequest> => {
    const newSample: HomeSampleRequest = {
      ...sampleData,
      id: `LAB-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    setSampleRequests(prev => [newSample, ...prev]);

    addNotification({
      title: '🩸 Home Sample Collection Requested',
      message: `Request #${newSample.id} submitted for ${newSample.selectedTests.length} tests on ${newSample.preferredDate}. Phlebotomist will be assigned shortly.`,
      type: 'sample',
      targetPortal: 'patient'
    });

    return newSample;
  };

  const updateSampleStatus = (
    id: string,
    status: HomeSampleRequest['status'],
    technicianName?: string,
    technicianPhone?: string
  ) => {
    setSampleRequests(prev => prev.map(s => {
      if (s.id === id) {
        return {
          ...s,
          status,
          technicianName: technicianName || s.technicianName,
          technicianPhone: technicianPhone || s.technicianPhone
        };
      }
      return s;
    }));

    addNotification({
      title: '🩸 Lab Sample Collection Update',
      message: `Lab Request #${id} updated to: ${status.replace('-', ' ').toUpperCase()}.${technicianName ? ` Technician: ${technicianName}` : ''}`,
      type: 'sample',
      targetPortal: 'patient'
    });
  };

  const shareLabReport = (
    requestId: string,
    reportPdfUrl: string,
    reportPdfName: string,
    reportComments: string
  ) => {
    setSampleRequests(prev => prev.map(s => {
      if (s.id === requestId) {
        return {
          ...s,
          status: 'report-ready',
          reportPdfUrl,
          reportPdfName,
          reportComments
        };
      }
      return s;
    }));

    // Trigger document upload for patient's hub automatically
    uploadDocument({
      name: reportPdfName || `Lab_Report_${requestId}.pdf`,
      fileType: 'lab_report',
      url: reportPdfUrl,
      size: '1.4 MB'
    });

    addNotification({
      title: '🩸 Diagnostic Lab Report Ready',
      message: `Your medical lab test report for Request #${requestId} is ready! You can now view and download it directly from your Patient Hub.`,
      type: 'sample',
      targetPortal: 'patient'
    });
  };

  const addLab = (labData: Omit<DiagnosticLab, 'id' | 'rating'>) => {
    const newLab: DiagnosticLab = {
      ...labData,
      id: `lab-${Date.now()}`,
      rating: 5.0,
      isActive: true,
      approvalStatus: labData.approvalStatus || 'approved'
    };
    setLabs(prev => [newLab, ...prev]);

    if (newLab.approvalStatus === 'approved') {
      addNotification({
        title: '🔬 Diagnostic Center Added',
        message: `${newLab.name} is now approved and integrated into the home sample collection service!`,
        type: 'system',
        targetPortal: 'patient'
      });
    } else {
      addNotification({
        title: '🔬 Diagnostic Center Registration',
        message: `${newLab.name} has registered and is pending administrator review and activation.`,
        type: 'system',
        targetPortal: 'admin'
      });
    }
  };

  const editLab = (updatedLab: DiagnosticLab) => {
    setLabs(prev => prev.map(l => l.id === updatedLab.id ? updatedLab : l));
  };

  const deleteLab = (id: string) => {
    setLabs(prev => prev.filter(l => l.id !== id));
  };

  // Document management
  const uploadDocument = (docData: Omit<UploadedMedicalDoc, 'id' | 'uploadDate'>) => {
    const newDoc: UploadedMedicalDoc = {
      ...docData,
      id: `doc-${Date.now()}`,
      uploadDate: new Date().toISOString().split('T')[0]
    };
    setUploadedDocs(prev => [newDoc, ...prev]);
  };

  // Notifications management
  const addNotification = (notifData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotif: Notification = {
      ...notifData,
      id: `notif-${Date.now()}`,
      timestamp: 'Just now',
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => {
      const isVisible = portal === 'admin' ? n.targetPortal === 'admin' : n.targetPortal !== 'admin';
      if (isVisible) {
        return { ...n, read: true };
      }
      return n;
    }));
  };

  const filteredNotificationsForPortal = notifications.filter(n => {
    if (portal === 'admin') {
      return n.targetPortal === 'admin';
    } else {
      return n.targetPortal !== 'admin';
    }
  });

  const unreadNotificationCount = filteredNotificationsForPortal.filter(n => !n.read).length;

  // Video Call Telehealth trigger
  const startVideoCall = (apt: Appointment) => {
    setActiveVideoCall(apt);
  };

  const endVideoCall = () => {
    setActiveVideoCall(null);
  };

  return (
    <AppContext.Provider value={{
      portal,
      setPortal,
      language,
      setLanguage,
      t,
      doctors,
      addDoctor,
      editDoctor,
      deleteDoctor,
      hospitals,
      addHospital,
      editHospital,
      deleteHospital,
      stores,
      addStore,
      editStore,
      medicines,
      addMedicine,
      cart,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      orders,
      placeOrder,
      updateOrderStatus,
      appointments,
      bookAppointment,
      updateAppointmentStatus,
      sampleRequests,
      requestHomeSample,
      updateSampleStatus,
      shareLabReport,
      labs,
      addLab,
      editLab,
      deleteLab,
      uploadedDocs,
      uploadDocument,
      notifications: filteredNotificationsForPortal,
      unreadNotificationCount,
      addNotification,
      markNotificationRead,
      markAllNotificationsRead,
      isPortalDrawerOpen,
      setIsPortalDrawerOpen,
      isNotificationDrawerOpen,
      setIsNotificationDrawerOpen,
      isSosModalOpen,
      setIsSosModalOpen,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalMode,
      setAuthModalMode,
      activeVideoCall,
      startVideoCall,
      endVideoCall,
      activeBookingDoctor,
      setActiveBookingDoctor
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
