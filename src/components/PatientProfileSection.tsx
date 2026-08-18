import React, { useState } from 'react';
import { 
  User, 
  Phone, 
  Heart, 
  Calendar, 
  Activity, 
  ShieldAlert, 
  Save, 
  Edit2, 
  CheckCircle, 
  Users, 
  Weight, 
  Ruler, 
  Mail, 
  Fingerprint,
  HeartPulse
} from 'lucide-react';

interface PatientProfileSectionProps {
  patient: any;
  onUpdatePatient: (updatedPatient: any) => void;
  addNotification: (notif: { title: string; message: string; type: string; targetPortal: string }) => void;
}

export const PatientProfileSection: React.FC<PatientProfileSectionProps> = ({
  patient,
  onUpdatePatient,
  addNotification
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form states initialized with existing patient values or defaults
  const [name, setName] = useState(patient?.name || '');
  const [phone, setPhone] = useState(patient?.phone || '');
  const [age, setAge] = useState(patient?.age || '30');
  const [gender, setGender] = useState(patient?.gender || 'Male');
  const [bloodGroup, setBloodGroup] = useState(patient?.bloodGroup || 'O+');
  
  // New personal health indicators
  const [height, setHeight] = useState(patient?.height || '');
  const [weight, setWeight] = useState(patient?.weight || '');
  const [allergies, setAllergies] = useState(patient?.allergies || 'None');
  const [chronicConditions, setChronicConditions] = useState(patient?.chronicConditions || 'None');

  // New emergency contact fields
  const [emergencyName, setEmergencyName] = useState(patient?.emergencyName || '');
  const [emergencyRelation, setEmergencyRelation] = useState(patient?.emergencyRelation || 'Spouse');
  const [emergencyPhone, setEmergencyPhone] = useState(patient?.emergencyPhone || '');

  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setSaveSuccess(false);

    if (!name.trim()) {
      setValidationError('Full Name cannot be empty.');
      return;
    }
    if (!phone.trim()) {
      setValidationError('Primary Phone Number is required.');
      return;
    }
    if (isEditing && emergencyName.trim() && !emergencyPhone.trim()) {
      setValidationError('Please specify a contact phone number for your emergency contact.');
      return;
    }

    const updatedPatient = {
      ...patient,
      name: name.trim(),
      phone: phone.trim(),
      age: age,
      gender: gender,
      bloodGroup: bloodGroup,
      height: height,
      weight: weight,
      allergies: allergies.trim() || 'None',
      chronicConditions: chronicConditions.trim() || 'None',
      emergencyName: emergencyName.trim(),
      emergencyRelation: emergencyRelation,
      emergencyPhone: emergencyPhone.trim()
    };

    onUpdatePatient(updatedPatient);
    setIsEditing(false);
    setSaveSuccess(true);
    
    addNotification({
      title: '👤 Medical Profile Synchronized',
      message: 'Your personal health profile, emergency contacts, and blood group have been securely updated.',
      type: 'system',
      targetPortal: 'patient'
    });

    setTimeout(() => {
      setSaveSuccess(false);
    }, 4000);
  };

  return (
    <div className="space-y-6">
      
      {/* Title & Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Health Profile
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Keep your vital statistics, allergies, and emergency points updated to optimize telehealth dispatch.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setValidationError('');
                  // Reset back to original values
                  setName(patient?.name || '');
                  setPhone(patient?.phone || '');
                  setAge(patient?.age || '30');
                  setGender(patient?.gender || 'Male');
                  setBloodGroup(patient?.bloodGroup || 'O+');
                  setHeight(patient?.height || '');
                  setWeight(patient?.weight || '');
                  setAllergies(patient?.allergies || 'None');
                  setChronicConditions(patient?.chronicConditions || 'None');
                  setEmergencyName(patient?.emergencyName || '');
                  setEmergencyRelation(patient?.emergencyRelation || 'Spouse');
                  setEmergencyPhone(patient?.emergencyPhone || '');
                }}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 font-bold rounded-xl text-xs transition-all"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold px-4 py-2 rounded-xl text-xs shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 transition-all"
            >
              <Edit2 className="w-3.5 h-3.5" />
              Modify Profile
            </button>
          )}
        </div>
      </div>

      {/* Success Notification Alert Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Profile changes updated and saved securely to Local Database.</span>
        </div>
      )}

      {/* Validation Error Banner */}
      {validationError && (
        <div className="bg-red-50 border border-red-200 text-red-800 text-xs font-bold px-4 py-3 rounded-2xl flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-red-600 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Main Form Fields Layout */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Personal and Bio Vitals (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Section: Demographics & Core Info */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <Fingerprint className="w-4 h-4 text-blue-500" />
              Demographics & Bio Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Full Patient Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="Enter your full name"
                  />
                </div>
              </div>

              {/* Email (Always Read-Only) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Login Email (Read-Only)</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-300" />
                  <input
                    type="email"
                    disabled
                    value={patient?.email || ''}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-150 bg-slate-100 text-slate-500 font-medium text-xs cursor-not-allowed outline-none"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Primary Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="+1 555-0100"
                  />
                </div>
              </div>

              {/* Age */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Age (Years)</label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    min="1"
                    max="125"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Gender */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Gender</label>
                <select
                  disabled={!isEditing}
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none cursor-pointer"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                </select>
              </div>

              {/* Blood Group */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Blood Group</label>
                <select
                  disabled={!isEditing}
                  value={bloodGroup}
                  onChange={(e) => setBloodGroup(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none cursor-pointer text-red-600 font-bold"
                >
                  <option value="A+">A+ (A Positive)</option>
                  <option value="A-">A- (A Negative)</option>
                  <option value="B+">B+ (B Positive)</option>
                  <option value="B-">B- (B Negative)</option>
                  <option value="AB+">AB+ (AB Positive)</option>
                  <option value="AB-">AB- (AB Negative)</option>
                  <option value="O+">O+ (O Positive)</option>
                  <option value="O-">O- (O Negative)</option>
                </select>
              </div>

            </div>
          </div>

          {/* Section: Clinical Vitals & Stats */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 space-y-6 shadow-sm">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <HeartPulse className="w-4 h-4 text-emerald-500" />
              Clinical Vitals & Measurements
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Height */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Height (cm)</label>
                <div className="relative">
                  <Ruler className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Weight (kg)</label>
                <div className="relative">
                  <Weight className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    disabled={!isEditing}
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 gap-4 pt-2">
              
              {/* Allergies */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Drug & Food Allergies</label>
                  {!isEditing && allergies !== 'None' && (
                    <span className="bg-red-50 text-red-600 border border-red-100 text-[9px] font-black uppercase px-2 py-0.5 rounded-md">
                      Has Allergy
                    </span>
                  )}
                </div>
                <textarea
                  disabled={!isEditing}
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-600 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none leading-relaxed"
                  placeholder="List any food or medical allergies. Type 'None' if none apply."
                />
              </div>

              {/* Chronic Conditions */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Chronic Conditions & Medical History</label>
                <textarea
                  disabled={!isEditing}
                  value={chronicConditions}
                  onChange={(e) => setChronicConditions(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-600 font-medium text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none resize-none leading-relaxed"
                  placeholder="Describe your active clinical conditions or history (e.g., Hypertension, Type II Diabetes). Type 'None' if none."
                />
              </div>

            </div>
          </div>

        </div>

        {/* Right Column: Emergency Contacts and Instructions (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Section: Emergency Contacts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 pb-3 border-b border-slate-100">
              <Users className="w-4 h-4 text-rose-500" />
              Emergency Contacts
            </h3>

            <div className="space-y-4">
              
              {/* Emergency Contact Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block font-sans">Contact Name</label>
                <input
                  type="text"
                  disabled={!isEditing}
                  value={emergencyName}
                  onChange={(e) => setEmergencyName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none"
                  placeholder="e.g. John Doe"
                />
              </div>

              {/* Relationship */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Relationship</label>
                <select
                  disabled={!isEditing}
                  value={emergencyRelation}
                  onChange={(e) => setEmergencyRelation(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none cursor-pointer"
                >
                  <option value="Spouse">Spouse</option>
                  <option value="Parent">Parent</option>
                  <option value="Sibling">Sibling</option>
                  <option value="Child">Child</option>
                  <option value="Friend">Friend</option>
                  <option value="Guardian">Guardian</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Emergency Contact Phone */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Emergency Contact Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 disabled:bg-slate-50 disabled:text-slate-500 font-medium text-xs focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none"
                    placeholder="+1 555-0155"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Clinical Security and Storage Disclaimers */}
          <div className="bg-slate-900 text-slate-400 rounded-3xl p-6 border border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-white">
              <Activity className="w-5 h-5 text-emerald-400" />
              <h4 className="font-bold text-xs">AilynkX Compliance</h4>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400 font-medium">
              Profile information is stored locally in standard secure client-side storage systems and synchronized in real-time across your active browser windows. 
            </p>
            <div className="pt-2 border-t border-slate-800 flex items-center gap-2 text-[10px] text-slate-500 font-black tracking-wider uppercase">
              <span>✓ HIPAA-Ready Encryption</span>
            </div>
          </div>

        </div>

      </form>
    </div>
  );
};
