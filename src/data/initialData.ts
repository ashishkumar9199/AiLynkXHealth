import { Doctor, PharmacyStore, MedicineItem, LabTestOption, Notification, Appointment, HomeSampleRequest, MedicineOrder, Hospital, DiagnosticLab } from '../types';

export const initialHospitals: Hospital[] = [
  {
    id: 'hosp-1',
    name: 'St. Jude Heart Institute & Clinic',
    address: '450 Medical Arts Plaza, Suite 300',
    phone: '+1 (555) 111-2222',
    email: 'admin@stjudeheart.org',
    username: 'stjude',
    password: 'password123',
    image: 'https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    bio: 'World-class cardiological care and state-of-the-art heart therapies.',
    rating: 4.9
  },
  {
    id: 'hosp-2',
    name: 'Metro Care General Hospital',
    address: '102 Health Avenue, Block B',
    phone: '+1 (555) 333-4444',
    email: 'contact@metrocare.com',
    username: 'metrocare',
    password: 'password123',
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    bio: 'Multi-specialty primary care and diabetes management services.',
    rating: 4.8
  },
  {
    id: 'hosp-3',
    name: 'DermaClair Skin & Laser Center',
    address: '88 Beauty Boulevard, 2nd Floor',
    phone: '+1 (555) 555-6666',
    email: 'info@dermaclair.com',
    username: 'dermaclair',
    password: 'password123',
    image: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    bio: 'Advanced clinical dermatology, cosmetic care, and high-precision lasers.',
    rating: 4.9
  },
  {
    id: 'hosp-4',
    name: 'OrthoSpine Joint & Bone Clinic',
    address: '22 Sport Science Way',
    phone: '+1 (555) 777-8888',
    email: 'appointments@orthospine.org',
    username: 'orthospine',
    password: 'password123',
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=600&auto=format&fit=crop&q=80',
    isActive: true,
    bio: 'Joint replacement, orthopedic surgery, physical therapy, and skeletal care.',
    rating: 4.7
  }
];

export const initialDoctors: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Sarah Jenkins',
    specialty: 'Cardiologist',
    qualifications: 'MD, FACC (Harvard Medical School)',
    experienceYears: 14,
    fee: 80,
    rating: 4.9,
    reviewCount: 312,
    consultationModes: ['video', 'clinic'],
    availability: ['09:00 AM', '11:30 AM', '02:00 PM', '04:30 PM'],
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    hospital: 'St. Jude Heart Institute & Clinic',
    address: '450 Medical Arts Plaza, Suite 300',
    bio: 'Senior consultant cardiologist specializing in preventative cardiology, hypertension management, and non-invasive cardiac imaging.',
    languages: ['English', 'Spanish'],
    username: 'sarah123',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  },
  {
    id: 'doc-2',
    name: 'Dr. Rajesh Sharma',
    specialty: 'Internal Medicine & Diabetology',
    qualifications: 'MBBS, MD (Internal Medicine)',
    experienceYears: 18,
    fee: 65,
    rating: 4.8,
    reviewCount: 450,
    consultationModes: ['video', 'clinic'],
    availability: ['10:00 AM', '01:00 PM', '03:30 PM', '06:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80',
    hospital: 'Metro Care General Hospital',
    address: '102 Health Avenue, Block B',
    bio: 'Dedicated physician treating metabolic disorders, type 2 diabetes, thyroid conditions, and chronic adult illnesses.',
    languages: ['English', 'Hindi'],
    username: 'rajesh123',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  },
  {
    id: 'doc-3',
    name: 'Dr. Elena Rostova',
    specialty: 'Dermatologist & Cosmetologist',
    qualifications: 'MD (Dermatology), Board Certified',
    experienceYears: 10,
    fee: 75,
    rating: 4.9,
    reviewCount: 280,
    consultationModes: ['video', 'clinic'],
    availability: ['09:30 AM', '12:00 PM', '02:30 PM', '05:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?w=400&auto=format&fit=crop&q=80',
    hospital: 'DermaClair Skin & Laser Center',
    address: '88 Beauty Boulevard, 2nd Floor',
    bio: 'Expert in clinical dermatology, acne treatments, eczema, psoriasis, and digital dermoscopy via telehealth.',
    languages: ['English', 'French', 'Russian'],
    username: 'elena123',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  },
  {
    id: 'doc-4',
    name: 'Dr. Marcus Vance',
    specialty: 'Orthopedic Specialist',
    qualifications: 'MS (Orthopedics), Fellowship in Joint Replacement',
    experienceYears: 15,
    fee: 90,
    rating: 4.7,
    reviewCount: 198,
    consultationModes: ['video', 'clinic'],
    availability: ['11:00 AM', '02:00 PM', '04:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&auto=format&fit=crop&q=80',
    hospital: 'OrthoSpine Joint & Bone Clinic',
    address: '22 Sport Science Way',
    bio: 'Specialist in joint pain, sports injuries, fracture recovery, and posture rehabilitation.',
    languages: ['English', 'German'],
    username: 'marcus123',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  },
  {
    id: 'doc-5',
    name: 'Dr. Priya Patel',
    specialty: 'Pediatrician & Child Health',
    qualifications: 'MD (Pediatrics), DCH',
    experienceYears: 12,
    fee: 60,
    rating: 5.0,
    reviewCount: 520,
    consultationModes: ['video', 'clinic'],
    availability: ['08:30 AM', '10:30 AM', '01:30 PM', '04:00 PM'],
    avatar: 'https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=400&auto=format&fit=crop&q=80',
    hospital: 'Little Angels Children Care',
    address: '15 Kid Care Drive',
    bio: 'Compassionate pediatric healthcare focusing on infant growth milestones, childhood immunizations, respiratory allergies, and nutrition.',
    languages: ['English', 'Hindi', 'Gujarati'],
    username: 'priya123',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  }
];

export const initialStores: PharmacyStore[] = [
  {
    id: 'store-1',
    name: 'MediCare Central Pharmacy',
    address: '101 Healthcare Plaza, Main Street',
    phone: '+1 (800) 555-0199',
    licenseNumber: 'PH-2024-88392',
    rating: 4.9,
    deliveryTime: '25-40 mins',
    isPartnerStore: true,
    image: 'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?w=500&auto=format&fit=crop&q=80',
    username: 'medcentral',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  },
  {
    id: 'store-2',
    name: 'City Care Health & Wellness',
    address: '44 Commercial Avenue, East Wing',
    phone: '+1 (800) 555-0240',
    licenseNumber: 'PH-2023-77410',
    rating: 4.8,
    deliveryTime: '30-50 mins',
    isPartnerStore: true,
    image: 'https://images.unsplash.com/photo-1576602976047-174e57a47881?w=500&auto=format&fit=crop&q=80',
    username: 'citycare',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  },
  {
    id: 'store-3',
    name: 'Apollo Express Meds',
    address: '78 Ring Road, Near Central Hospital',
    phone: '+1 (800) 555-0311',
    licenseNumber: 'PH-2025-11928',
    rating: 4.7,
    deliveryTime: '15-30 mins',
    isPartnerStore: true,
    image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=500&auto=format&fit=crop&q=80',
    username: 'apollo',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  }
];

export const initialMedicines: MedicineItem[] = [
  {
    id: 'med-1',
    storeId: 'store-1',
    storeName: 'MediCare Central Pharmacy',
    name: 'Amoxicillin 500mg (Antibiotic)',
    category: 'Prescription',
    price: 18.50,
    stock: 45,
    requiresPrescription: true,
    dosageForm: '10 Capsules',
    description: 'Broad-spectrum penicillin antibiotic for bacterial ear, sinus, throat, and chest infections.',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-2',
    storeId: 'store-1',
    storeName: 'MediCare Central Pharmacy',
    name: 'Metformin 500mg Extended Release',
    category: 'Diabetes Care',
    price: 14.00,
    stock: 80,
    requiresPrescription: true,
    dosageForm: '30 Tablets',
    description: 'First-line medication for blood glucose control in type 2 diabetes mellitus.',
    image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-3',
    storeId: 'store-2',
    storeName: 'City Care Health & Wellness',
    name: 'Paracetamol 650mg Extra Relief',
    category: 'OTC',
    price: 6.99,
    stock: 120,
    requiresPrescription: false,
    dosageForm: '15 Tablets',
    description: 'Analgesic and antipyretic for fast fever reduction and headache, toothache, body pain relief.',
    image: 'https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-4',
    storeId: 'store-2',
    storeName: 'City Care Health & Wellness',
    name: 'Vitamin D3 60,000 IU Softgels',
    category: 'Vitamins',
    price: 22.00,
    stock: 60,
    requiresPrescription: false,
    dosageForm: '8 Softgels',
    description: 'High-potency Cholecalciferol for bone strength, calcium absorption, and immune support.',
    image: 'https://images.unsplash.com/photo-1577401239170-897942555fb3?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-5',
    storeId: 'store-3',
    storeName: 'Apollo Express Meds',
    name: 'Omeprazole 20mg Gastro-Caps',
    category: 'OTC',
    price: 12.50,
    stock: 35,
    requiresPrescription: false,
    dosageForm: '14 Capsules',
    description: 'Proton pump inhibitor for acid reflux, GERD, and stomach ulcer protection.',
    image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300&auto=format&fit=crop&q=80'
  },
  {
    id: 'med-6',
    storeId: 'store-3',
    storeName: 'Apollo Express Meds',
    name: 'Digital Blood Pressure Monitor',
    category: 'Personal Care',
    price: 39.99,
    stock: 15,
    requiresPrescription: false,
    dosageForm: '1 Device with Arm Cuff',
    description: 'Automatic upper-arm digital BP monitor with heart arrhythmia detector and memory log.',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300&auto=format&fit=crop&q=80'
  }
];

export const initialLabTests: LabTestOption[] = [
  {
    id: 'test-1',
    name: 'Complete Blood Count (CBC) + ESR',
    category: 'Hematology',
    price: 25.00,
    preparation: 'No fasting required. Hydrate normally.',
    reportHours: 12,
    description: 'Evaluates hemoglobin, RBC, WBC count, platelets, and systemic infection markers.'
  },
  {
    id: 'test-2',
    name: 'Comprehensive Lipid Profile (Cholesterol)',
    category: 'Cardiology',
    price: 35.00,
    preparation: '10-12 hours overnight fasting required.',
    reportHours: 24,
    description: 'Measures Total Cholesterol, HDL (good), LDL (bad), Triglycerides, and VLDL.'
  },
  {
    id: 'test-3',
    name: 'HbA1c + Fasting Blood Glucose',
    category: 'Diabetes & Endocrinology',
    price: 30.00,
    preparation: 'Fasting blood sample required after 8 hours.',
    reportHours: 12,
    description: 'Gives 3-month average blood glucose control and current fasting glucose levels.'
  },
  {
    id: 'test-4',
    name: 'Thyroid Function Test (T3, T4, TSH)',
    category: 'Endocrinology',
    price: 40.00,
    preparation: 'Morning sample preferred before taking thyroid medications.',
    reportHours: 24,
    description: 'Assesses thyroid gland activity for hypothyroidism, hyperthyroidism, or sluggish metabolism.'
  },
  {
    id: 'test-5',
    name: 'Vitamin D3 & Vitamin B12 Duo',
    category: 'Wellness & Deficiency',
    price: 55.00,
    preparation: 'Fasting not required.',
    reportHours: 24,
    description: 'Detects bone health deficiencies, nerve weakness, fatigue, and immune health markers.'
  }
];

export const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    title: '🎥 Video Appointment Confirmed',
    message: 'Your upcoming video consultation with Dr. Sarah Jenkins is scheduled for today at 02:00 PM.',
    timestamp: '10 mins ago',
    type: 'appointment',
    read: false,
    targetPortal: 'patient'
  },
  {
    id: 'notif-2',
    title: '🤖 Prescription Analysis Ready',
    message: 'Gemini AI has analyzed your uploaded prescription PDF. Click to view drug interactions and dosage rules.',
    timestamp: '1 hour ago',
    type: 'analysis',
    read: false,
    targetPortal: 'patient'
  },
  {
    id: 'notif-3',
    title: '🧪 Home Sample Agent Assigned',
    message: 'Phlebotomist Rahul S. is assigned for your Complete Blood Count sample collection tomorrow at 08:30 AM.',
    timestamp: '3 hours ago',
    type: 'sample',
    read: false,
    targetPortal: 'patient'
  },
  {
    id: 'notif-4',
    title: '🩺 Admin Alert: New Doctor Request',
    message: 'System ready: Doctors added in Admin portal will automatically appear in landing page directory.',
    timestamp: 'Yesterday',
    type: 'system',
    read: true,
    targetPortal: 'admin'
  }
];

const getRelativeDateString = (offsetDays: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().split('T')[0];
};

export const initialAppointments: Appointment[] = [
  {
    id: 'apt-101',
    patientName: 'Alex Morgan',
    patientPhone: '+1 (555) 234-5678',
    patientEmail: 'alex.morgan@example.com',
    patientAge: 38,
    patientGender: 'Male',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Cardiologist',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    mode: 'clinic',
    date: getRelativeDateString(1),
    timeSlot: '02:00 PM',
    symptoms: 'Mild chest tightness after exercise and high blood pressure reading (142/90).',
    prescriptionPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    prescriptionPdfName: 'Previous_Cardio_Prescription_2025.pdf',
    testPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    testPdfName: 'ECG_Lipid_Panel_Results.pdf',
    status: 'scheduled',
    meetingRoomId: 'room-medicare-101',
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-102',
    patientName: 'Sophia Lin',
    patientPhone: '+1 (555) 987-6543',
    patientEmail: 'sophia.lin@example.com',
    patientAge: 29,
    patientGender: 'Female',
    doctorId: 'doc-3',
    doctorName: 'Dr. Elena Rostova',
    doctorSpecialty: 'Dermatologist & Cosmetologist',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?w=400&auto=format&fit=crop&q=80',
    mode: 'clinic',
    date: getRelativeDateString(2),
    timeSlot: '11:00 AM',
    symptoms: 'Persistent skin inflammation and allergic rash on right forearm.',
    prescriptionPdfName: 'Skin_Allergy_History.pdf',
    status: 'scheduled',
    createdAt: new Date().toISOString()
  },
  {
    id: 'apt-completed-1',
    patientName: 'Demo Patient',
    patientPhone: '+1 555-0199',
    patientEmail: 'patient@healthconnect.org',
    patientAge: 30,
    patientGender: 'Male',
    doctorId: 'doc-1',
    doctorName: 'Dr. Sarah Jenkins',
    doctorSpecialty: 'Cardiologist',
    doctorAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80',
    mode: 'video',
    date: '2026-08-10',
    timeSlot: '10:00 AM',
    symptoms: 'Mild high blood pressure and follow-up on exercise regimen.',
    status: 'completed',
    ePrescription: "Rx:\n1. Telmisartan 40mg - 1 Tab daily morning before breakfast\n2. Coenzyme Q10 100mg - 1 Tab after lunch\nAdvice: Maintain daily cardio routine. Limit salt intake.",
    doctorNotes: "Patient reports feeling well overall. Blood pressure is stable at 128/82. Recommend continuation of current lifestyle modifications and Telmisartan.",
    prescriptionPdfName: 'Cardio_Followup_Prescription.pdf',
    prescriptionPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: new Date(Date.now() - 7 * 86400000).toISOString()
  },
  {
    id: 'apt-completed-2',
    patientName: 'Demo Patient',
    patientPhone: '+1 555-0199',
    patientEmail: 'patient@healthconnect.org',
    patientAge: 30,
    patientGender: 'Male',
    doctorId: 'doc-3',
    doctorName: 'Dr. Elena Rostova',
    doctorSpecialty: 'Dermatologist & Cosmetologist',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813566-88855ce78961?w=400&auto=format&fit=crop&q=80',
    mode: 'video',
    date: '2026-08-12',
    timeSlot: '03:30 PM',
    symptoms: 'Mild skin rash and redness on left arm.',
    status: 'completed',
    ePrescription: "Rx:\n1. Hydrocortisone 1% Topical Cream - Apply twice daily to affected area for 5 days\n2. Cetirizine 10mg - 1 Tab daily at night for itch relief",
    doctorNotes: "Contact dermatitis suspected from new soap formulation. Advised patient to discontinue use and apply topical cream as prescribed.",
    prescriptionPdfName: 'Dermatitis_Treatment_Plan.pdf',
    prescriptionPdfUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    createdAt: new Date(Date.now() - 5 * 86400000).toISOString()
  }
];

export const samplePrescriptionTexts = [
  {
    title: "Cardiology & Hypertension Prescription",
    content: "Rx:\n1. Telmisartan 40mg - 1 Tab daily morning before breakfast (for BP control)\n2. Atorvastatin 10mg - 1 Tab at night before sleep (for cholesterol management)\n3. Aspirin 75mg - 1 Tab after lunch (antiplatelet blood thinner)\nDiagnosis: Essential Hypertension with Mild Hyperlipidemia. Drink 3L water daily, low sodium diet."
  },
  {
    title: "Type 2 Diabetes & Metabolic Care",
    content: "Rx:\n1. Metformin 500mg SR - 1 Tab twice daily after meals\n2. Glimepiride 1mg - 1 Tab morning 15 mins before breakfast\n3. Vitamin B12 Methylcobalamin 1500mcg - 1 Tab once daily\nAdvice: Fasting blood sugar target < 110 mg/dL. Avoid sugar, refined carbs. Walk 30 minutes daily."
  },
  {
    title: "Pediatric Antibiotics & Fever",
    content: "Rx (Patient Age: 6 yrs):\n1. Amoxicillin + Clavulanate Syrup (228mg/5ml) - 5 ml twice daily for 5 days after food\n2. Paracetamol Suspension (250mg/5ml) - 5 ml as needed every 6 hours for fever > 100.5 F\n3. Probiotic Sachet - 1 sachet in lukewarm water daily\nWarning: Complete 5 day antibiotic course. Watch for skin rash."
  }
];

export const initialLabs: DiagnosticLab[] = [
  {
    id: 'lab-1',
    name: 'Apex Diagnostic & Imaging Hub',
    address: '77 Health Boulevard, Sector 4',
    phone: '+1 (555) 888-0011',
    licenseNumber: 'LAB-2024-99882',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=80',
    username: 'apexlab',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  },
  {
    id: 'lab-2',
    name: 'Precision Pathology Labs',
    address: '210 Clinic Row, Suite 10',
    phone: '+1 (555) 888-0022',
    licenseNumber: 'LAB-2023-77661',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1579165276513-354f9d3eb7a6?w=500&auto=format&fit=crop&q=80',
    username: 'precisionpath',
    password: 'password123',
    isActive: true,
    approvalStatus: 'approved'
  }
];

export const initialSampleRequests: HomeSampleRequest[] = [
  {
    id: 'req-201',
    patientName: 'Demo Patient',
    patientPhone: '+1 555-0199',
    patientAddress: '128 Pinecrest Avenue, Apartment 4B',
    selectedTests: ['Complete Blood Count (CBC)', 'Lipid Profile', 'HbA1c (Glycated Haemoglobin)'],
    preferredDate: '2026-08-16',
    preferredTime: '08:00 AM - 10:00 AM',
    status: 'report-ready',
    technicianName: 'Rahul Sharma',
    technicianPhone: '+1 (555) 902-1244',
    totalAmount: 120,
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    labId: 'lab-1',
    labName: 'Apex Diagnostic & Imaging Hub',
    reportPdfName: 'Health_Report_CBC_Lipid_HbA1c.pdf',
    reportPdfUrl: '#',
    reportComments: `Biomarker Readings Summary:
• Haemoglobin: 14.5 g/dL (Normal: 13.5 - 17.5 g/dL)
• Fasting Blood Sugar: 104 mg/dL (Normal: 70 - 100 mg/dL) [Borderline Elevated]
• Total Cholesterol: 195 mg/dL (Normal: < 200 mg/dL)
• HbA1c: 5.6% (Normal: < 5.7%)
• Triglycerides: 148 mg/dL (Normal: < 150 mg/dL)

Clinical Review: All metabolic and hematological parameters are within stable reference limits. Fasting blood glucose is borderline elevated, suggesting mild dietary adjustments and regular walk routines. Keep lipid profile monitored.`
  },
  {
    id: 'req-202',
    patientName: 'Demo Patient',
    patientPhone: '+1 555-0199',
    patientAddress: '128 Pinecrest Avenue, Apartment 4B',
    selectedTests: ['Thyroid Panel (T3, T4, TSH)', 'Vitamin D3 & B12 Assay'],
    preferredDate: '2026-08-19',
    preferredTime: '09:00 AM - 11:00 AM',
    status: 'technician-assigned',
    technicianName: 'Marcus Aurelio',
    technicianPhone: '+1 (555) 482-1299',
    totalAmount: 85,
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    labId: 'lab-2',
    labName: 'Precision Pathology Labs'
  }
];

