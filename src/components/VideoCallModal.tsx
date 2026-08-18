import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { 
  X, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff, 
  PhoneOff, 
  FileText, 
  Send, 
  CheckCircle2, 
  Download, 
  Sparkles,
  ShieldAlert,
  Minimize2,
  Maximize2,
  Loader2,
  ShieldCheck,
  Camera
} from 'lucide-react';

interface Props {
  appointment: Appointment;
  onClose: () => void;
}

export const VideoCallModal: React.FC<Props> = ({ appointment, onClose }) => {
  const { updateAppointmentStatus, t, addNotification } = useApp();

  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [activeTab, setActiveTab] = useState<'records' | 'chat' | 'eprescribe'>('records');

  // Real-time camera integration states
  const [waitingState, setWaitingState] = useState<'lobby' | 'call'>('lobby');
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micLevelPulse, setMicLevelPulse] = useState(false);

  const lobbyVideoRef = useRef<HTMLVideoElement | null>(null);
  const pipVideoRef = useRef<HTMLVideoElement | null>(null);

  // Hook up browser MediaStream APIs to query Camera and Microphone hardware
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    
    async function startMedia() {
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true
        });
        activeStream = stream;
        setCameraStream(stream);
        
        // Feed stream to lobby video player
        if (lobbyVideoRef.current) {
          lobbyVideoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        console.error('Camera/Mic access error:', err);
        setCameraError('Unable to access camera or microphone. Please ensure permissions are granted and no other application is using your camera.');
      }
    }
    
    startMedia();

    // Simulated microphone feedback audio frequency indicator
    const pulseInterval = setInterval(() => {
      setMicLevelPulse(prev => !prev);
    }, 600);
    
    return () => {
      clearInterval(pulseInterval);
      if (activeStream) {
        activeStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Sync track enabling with toggle state buttons
  useEffect(() => {
    if (cameraStream) {
      cameraStream.getVideoTracks().forEach(track => {
        track.enabled = videoOn;
      });
    }
  }, [videoOn, cameraStream]);

  useEffect(() => {
    if (cameraStream) {
      cameraStream.getAudioTracks().forEach(track => {
        track.enabled = micOn;
      });
    }
  }, [micOn, cameraStream]);

  // Bind video stream to PiP viewport upon entering consultation room
  useEffect(() => {
    if (waitingState === 'call' && cameraStream && pipVideoRef.current) {
      setTimeout(() => {
        if (pipVideoRef.current) {
          pipVideoRef.current.srcObject = cameraStream;
        }
      }, 100);
    }
  }, [waitingState, cameraStream]);

  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'System', text: 'Encrypted HD Video Consultation session initiated.', time: '14:00' },
    { sender: appointment.doctorName, text: `Hello ${appointment.patientName}, I am reviewing your symptoms and attached medical reports now.`, time: '14:01' }
  ]);

  const [ePrescriptionNote, setEPrescriptionNote] = useState(
    `Rx for ${appointment.patientName}:\n1. Tab Amoxicillin 500mg - 1 Tab TID x 5 days\n2. Tab Paracetamol 650mg - 1 Tab PRN for fever\nAdvice: Warm saltwater gargle, 3L hydration daily.`
  );
  const [ePrescriptionIssued, setEPrescriptionIssued] = useState(false);

  // Send chat message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    setChatMessages(prev => [
      ...prev,
      { sender: 'You', text: chatInput, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setChatInput('');
  };

  // Issue digital E-Prescription
  const handleIssueEPrescription = () => {
    updateAppointmentStatus(appointment.id, 'completed', ePrescriptionNote, "Patient evaluated via Telehealth video call. Vitals reported stable.");
    setEPrescriptionIssued(true);

    addNotification({
      title: '📄 Digital E-Prescription Issued',
      message: `Dr. ${appointment.doctorName} issued an e-prescription for Appointment #${appointment.id}. Saved to patient records.`,
      type: 'appointment',
      targetPortal: 'patient'
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-6xl h-[92vh] rounded-3xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        
        {/* Left Side: Video Call Stream / Waiting Room Lobby */}
        <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
          
          {waitingState === 'lobby' ? (
            /* ==================== WAITING ROOM LOBBY ==================== */
            <div className="flex-1 flex flex-col p-6 space-y-6 overflow-y-auto">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                    <ShieldCheck className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-white">Telehealth Secure Lobby</h3>
                    <p className="text-[11px] text-slate-400 font-medium">Verify your audio and video components prior to entering the secure clinic room.</p>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Lobby Columns Grid */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                
                {/* Left: Real-Time Local Camera Setup Preview */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Camera Source Diagnostics</span>
                  
                  <div className="aspect-video w-full rounded-2xl overflow-hidden relative border border-slate-800 bg-slate-900 flex items-center justify-center shadow-lg">
                    {cameraError ? (
                      <div className="p-4 text-center space-y-3">
                        <ShieldAlert className="w-10 h-10 text-amber-500 mx-auto" />
                        <p className="text-xs text-slate-400 leading-normal max-w-xs">{cameraError}</p>
                      </div>
                    ) : videoOn ? (
                      <video 
                        ref={lobbyVideoRef}
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                    ) : (
                      <div className="text-center text-slate-500">
                        <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p className="text-xs">Camera Output Disabled</p>
                      </div>
                    )}

                    {/* Camera Active badge overlay */}
                    <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-white px-2.5 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${videoOn && !cameraError ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
                      {videoOn ? 'Live Stream Active' : 'Camera Muted'}
                    </div>
                  </div>

                  {/* Audio Feedback Diagnostics */}
                  <div className="bg-slate-900/50 rounded-2xl border border-slate-800/80 p-3.5 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                        micOn ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-white block">Microphone Capture Level</span>
                        <span className="text-[9px] text-slate-400 block">
                          {micOn ? 'Simulated decibel frequency active' : 'Microphone audio input disabled'}
                        </span>
                      </div>
                    </div>

                    {/* Mic Level indicator bar */}
                    {micOn && (
                      <div className="flex gap-0.5 items-end h-5">
                        <div className={`w-1 rounded-full bg-emerald-500 transition-all ${micLevelPulse ? 'h-2' : 'h-3'}`} />
                        <div className={`w-1 rounded-full bg-emerald-500 transition-all ${micLevelPulse ? 'h-4' : 'h-1'}`} />
                        <div className={`w-1 rounded-full bg-emerald-500 transition-all ${micLevelPulse ? 'h-1' : 'h-5'}`} />
                        <div className={`w-1 rounded-full bg-emerald-500 transition-all ${micLevelPulse ? 'h-3' : 'h-2'}`} />
                      </div>
                    )}
                  </div>
                </div>

                {/* Right: Security Handshake and Dispatcher Checks */}
                <div className="space-y-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Lobby Verification Checklist</span>
                  
                  <div className="bg-slate-900/30 rounded-2xl border border-slate-800 p-5 space-y-4 text-xs">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-slate-400 font-semibold">Clinic Encryption Protocol</span>
                      <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800 font-bold text-[10px]">TLS 1.3 Secure</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-slate-400 font-semibold">WebRTC Signaling Channel</span>
                      <span className="text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800 font-bold text-[10px]">Connected</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-slate-400 font-semibold">Network Latency (RTT)</span>
                      <span className="text-blue-400 bg-blue-950/80 px-2 py-0.5 rounded-md border border-blue-800 font-bold text-[10px]">22 ms (Excellent)</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 font-semibold">Medical Attendant Status</span>
                      <span className="text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-800 font-bold text-[10px]">Ready & Waiting</span>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-950/40 border border-blue-900/60 rounded-xl text-[11px] text-blue-300 leading-normal">
                    💡 Clicking <strong>Enter Consultation Room</strong> below establishes a secure WebRTC pipeline to stream encrypted video with Dr. {appointment.doctorName}.
                  </div>
                </div>

              </div>

              {/* Lobby Entry Button Panel */}
              <div className="border-t border-slate-800 pt-4.5 flex flex-wrap gap-4 items-center justify-between">
                {/* Toggle controls inside lobby */}
                <div className="flex gap-3">
                  <button
                    onClick={() => setMicOn(!micOn)}
                    className={`p-3 rounded-xl transition-all ${
                      micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600/80 text-white'
                    }`}
                  >
                    {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setVideoOn(!videoOn)}
                    className={`p-3 rounded-xl transition-all ${
                      videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600/80 text-white'
                    }`}
                  >
                    {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                  </button>
                </div>

                <button
                  onClick={() => setWaitingState('call')}
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black text-xs shadow-lg shadow-blue-500/10 flex items-center gap-2"
                >
                  <Camera className="w-4 h-4" />
                  <span>Enter Consultation Room</span>
                </button>
              </div>

            </div>
          ) : (
            /* ==================== ACTIVE CONSULTATION CALL ==================== */
            <>
              {/* Top Call Bar */}
              <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between z-10">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-red-600 animate-pulse"></span>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      <span>Consultation with {appointment.doctorName}</span>
                      <span className="bg-blue-600/30 text-blue-400 border border-blue-500/30 text-[10px] px-2 py-0.5 rounded-full font-mono">
                        HD Encrypted
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Patient: {appointment.patientName} ({appointment.patientAge} yrs, {appointment.patientGender})
                    </p>
                  </div>
                </div>

                <button 
                  id="close-video-modal-btn"
                  onClick={onClose}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Main Video Window */}
              <div className="flex-1 relative bg-slate-900 flex items-center justify-center p-4">
                
                {/* Main Speaker Video Frame (Doctor's Feed) */}
                <div className="w-full h-full rounded-2xl overflow-hidden relative border border-slate-800 bg-slate-950 flex items-center justify-center shadow-2xl">
                  <div className="relative w-full h-full bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center">
                    <img 
                      src={appointment.doctorAvatar} 
                      alt={appointment.doctorName}
                      className="w-48 h-48 rounded-full object-cover border-4 border-blue-500/50 shadow-2xl animate-pulse"
                    />
                    <div className="absolute inset-0 bg-blue-900/10 pointer-events-none"></div>
                    <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      {appointment.doctorName} (Physician)
                    </div>
                  </div>

                  {/* PiP Patient Camera Feed (Real Camera) */}
                  <div className="absolute top-4 right-4 w-40 h-28 rounded-2xl bg-slate-900 border-2 border-blue-500/60 shadow-xl overflow-hidden flex items-center justify-center">
                    {cameraError ? (
                      <div className="text-[9px] text-slate-400 text-center px-1">Mic/Cam Blocked</div>
                    ) : videoOn ? (
                      <video 
                        ref={pipVideoRef}
                        autoPlay 
                        playsInline 
                        muted 
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                    ) : (
                      <div className="text-center p-2 text-slate-500">
                        <VideoOff className="w-5 h-5 mx-auto mb-1 opacity-50" />
                        <span className="text-[9px]">Camera Off</span>
                      </div>
                    )}
                    <div className="absolute bottom-1 right-2 text-[9px] text-white font-mono bg-slate-950/80 px-1.5 py-0.5 rounded">
                      You (Patient)
                    </div>
                  </div>
                </div>

              </div>

              {/* Bottom Control Bar */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-center gap-4 z-10">
                <button
                  id="toggle-mic-btn"
                  onClick={() => setMicOn(!micOn)}
                  className={`p-3.5 rounded-2xl transition-all shadow-md ${
                    micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
                  }`}
                >
                  {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
                </button>

                <button
                  id="toggle-video-btn"
                  onClick={() => setVideoOn(!videoOn)}
                  className={`p-3.5 rounded-2xl transition-all shadow-md ${
                    videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-600 text-white'
                  }`}
                >
                  {videoOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
                </button>

                <button
                  id="end-call-btn"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs flex items-center gap-2 shadow-lg transition-all"
                >
                  <PhoneOff className="w-5 h-5" />
                  <span>{t('endCall')}</span>
                </button>
              </div>
            </>
          )}

        </div>

        {/* Right Side: PDF Assessor & Medical Records / E-Prescription Panel */}
        <div className="w-full lg:w-96 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col">
          
          {/* Side Tabs */}
          <div className="p-2 bg-slate-950 border-b border-slate-800 grid grid-cols-3 gap-1">
            <button
              id="tab-records-pdf"
              onClick={() => setActiveTab('records')}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                activeTab === 'records'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              PDF Records
            </button>
            <button
              id="tab-consult-chat"
              onClick={() => setActiveTab('chat')}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Live Chat
            </button>
            <button
              id="tab-eprescribe"
              onClick={() => setActiveTab('eprescribe')}
              className={`py-2 px-2 rounded-xl text-[11px] font-bold transition-all ${
                activeTab === 'eprescribe'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              E-Rx Issuer
            </button>
          </div>

          {/* Tab 1: Uploaded PDF Assessor */}
          {activeTab === 'records' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-4 text-xs text-slate-300">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
                <span className="text-[10px] uppercase font-bold text-blue-400 block mb-1">
                  Patient Symptoms
                </span>
                <p className="text-white font-medium italic">
                  "{appointment.symptoms}"
                </p>
              </div>

              <h4 className="font-extrabold text-xs text-white uppercase tracking-wider pt-2 border-t border-slate-800">
                Uploaded Records & PDFs
              </h4>

              {/* Prescription PDF Card */}
              <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-blue-400" />
                    Prescription PDF
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Ready
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] truncate">
                  {appointment.prescriptionPdfName || 'Patient_Previous_Rx.pdf'}
                </p>
                <a
                  href={appointment.prescriptionPdfUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:underline pt-1"
                >
                  <Download className="w-3.5 h-3.5" /> Open / Inspect Document PDF
                </a>
              </div>

              {/* Lab Test PDF Card */}
              <div className="p-3.5 rounded-xl bg-slate-800 border border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-red-400" />
                    Lab Test PDF
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                    Ready
                  </span>
                </div>
                <p className="text-slate-400 text-[11px] truncate">
                  {appointment.testPdfName || 'CBC_Lipid_Panel_Report.pdf'}
                </p>
                <a
                  href={appointment.testPdfUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-blue-400 hover:underline pt-1"
                >
                  <Download className="w-3.5 h-3.5" /> Open / Inspect Report PDF
                </a>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/60 border border-blue-800/80 text-[11px] text-blue-200">
                💡 Doctor can review these files during video call to assess medical history and issue accurate E-Prescriptions.
              </div>
            </div>
          )}

          {/* Tab 2: Live Chat */}
          {activeTab === 'chat' && (
            <div className="flex-1 flex flex-col p-4">
              <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`p-2.5 rounded-xl ${
                    msg.sender === 'You' ? 'bg-blue-600 text-white ml-6' : 'bg-slate-800 text-slate-200 mr-6'
                  }`}>
                    <div className="flex justify-between text-[10px] opacity-75 mb-1">
                      <span className="font-bold">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p>{msg.text}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="mt-3 flex gap-2 pt-2 border-t border-slate-800">
                <input
                  type="text"
                  id="chat-input-field"
                  value={chatInput}
                  onChange={e => setChatInput(e.target.value)}
                  placeholder="Type message..."
                  className="flex-1 p-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}

          {/* Tab 3: Digital E-Prescription Issuer */}
          {activeTab === 'eprescribe' && (
            <div className="p-4 flex-1 overflow-y-auto space-y-4">
              <div>
                <label className="block text-xs font-bold text-white mb-1.5">
                  Write Digital E-Prescription
                </label>
                <textarea
                  rows={8}
                  id="eprescription-editor"
                  value={ePrescriptionNote}
                  onChange={e => setEPrescriptionNote(e.target.value)}
                  className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-xs font-mono text-emerald-400 focus:ring-1 focus:ring-emerald-500"
                ></textarea>
              </div>

              {ePrescriptionIssued ? (
                <div className="p-3 bg-emerald-950/80 border border-emerald-700 rounded-xl text-xs text-emerald-200 font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  E-Prescription issued and saved to patient dashboard!
                </div>
              ) : (
                <button
                  id="issue-eprescription-btn"
                  onClick={handleIssueEPrescription}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  Issue Digital E-Prescription
                </button>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
