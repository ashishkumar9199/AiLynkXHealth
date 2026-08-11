export type PortalType = 'landing' | 'patient' | 'doctor' | 'pharmacy' | 'admin' | 'hospital' | 'lab';

export type Language = 'en' | 'es' | 'hi' | 'bn' | 'ta' | 'te' | 'mr' | 'fr' | 'ar' | 'de';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  username: string;
  password?: string;
  image: string;
  isActive?: boolean;
  bio?: string;
  rating?: number;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  qualifications: string;
  experienceYears: number;
  fee: number;
  rating: number;
  reviewCount: number;
  consultationModes: ('video' | 'clinic')[];
  availability: string[];
  avatar: string;
  hospital: string;
  address: string;
  bio: string;
  languages: string[];
  username?: string;
  password?: string;
  isActive?: boolean;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
  hospitalId?: string;
}

export interface UploadedMedicalDoc {
  id: string;
  name: string;
  fileType: 'prescription' | 'lab_report' | 'test_pdf';
  url: string;
  uploadDate: string;
  size: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  patientAge: number;
  patientGender: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialty: string;
  doctorAvatar: string;
  mode: 'video' | 'clinic';
  date: string;
  timeSlot: string;
  symptoms: string;
  prescriptionPdfUrl?: string;
  prescriptionPdfName?: string;
  testPdfUrl?: string;
  testPdfName?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingRoomId?: string;
  ePrescription?: string;
  doctorNotes?: string;
  createdAt: string;
}

export interface HomeSampleRequest {
  id: string;
  patientName: string;
  patientPhone: string;
  patientAddress: string;
  selectedTests: string[];
  preferredDate: string;
  preferredTime: string;
  requisitionPdfUrl?: string;
  requisitionPdfName?: string;
  status: 'pending' | 'technician-assigned' | 'sample-collected' | 'report-ready';
  technicianName?: string;
  technicianPhone?: string;
  totalAmount: number;
  createdAt: string;
  reportPdfUrl?: string;
  reportPdfName?: string;
  reportComments?: string;
  labId?: string;
  labName?: string;
}

export interface DiagnosticLab {
  id: string;
  name: string;
  address: string;
  phone: string;
  licenseNumber: string;
  rating: number;
  image: string;
  username?: string;
  password?: string;
  isActive?: boolean;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
}

export interface PharmacyStore {
  id: string;
  name: string;
  address: string;
  phone: string;
  licenseNumber: string;
  rating: number;
  deliveryTime: string;
  image: string;
  isPartnerStore: boolean;
  username?: string;
  password?: string;
  isActive?: boolean;
  approvalStatus?: 'approved' | 'pending' | 'rejected';
}

export interface MedicineItem {
  id: string;
  storeId: string;
  storeName: string;
  name: string;
  category: 'Prescription' | 'OTC' | 'Vitamins' | 'First Aid' | 'Diabetes Care' | 'Personal Care';
  price: number;
  stock: number;
  requiresPrescription: boolean;
  dosageForm: string;
  description: string;
  image: string;
}

export interface CartItem {
  medicine: MedicineItem;
  quantity: number;
}

export interface MedicineOrder {
  id: string;
  patientName: string;
  patientPhone: string;
  deliveryAddress: string;
  items: CartItem[];
  totalAmount: number;
  prescriptionUrl?: string;
  prescriptionName?: string;
  status: 'placed' | 'confirmed' | 'out-for-delivery' | 'delivered';
  createdAt: string;
}

export interface PrescriptionAnalysis {
  medications: {
    name: string;
    dosage: string;
    duration: string;
    purpose: string;
  }[];
  diagnosisNote: string;
  instructions: string[];
  warnings: string[];
  dietaryAdvice: string;
  questionsForDoctor: string[];
  isSimulated?: boolean;
  isLegible?: boolean;
  retakeTip?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'appointment' | 'analysis' | 'sample' | 'order' | 'system';
  read: boolean;
  targetPortal?: PortalType;
  actionPayload?: any;
}

export interface LabTestOption {
  id: string;
  name: string;
  category: string;
  price: number;
  preparation: string;
  reportHours: number;
  description: string;
}

export interface InsuranceDetails {
  provider: string;
  policyNumber: string;
  groupNumber: string;
  holderName: string;
  relationship: string;
  status: 'unverified' | 'pending' | 'verified';
  frontCardUrl?: string;
  backCardUrl?: string;
  verifiedAt?: string;
}

