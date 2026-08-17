import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PhotoUpload } from '../components/PhotoUpload';
import { MedicineItem } from '../types';
import { 
  Pill, 
  ShoppingCart, 
  Search, 
  Building2, 
  Plus, 
  Minus, 
  Trash2, 
  Upload, 
  CheckCircle2, 
  ShieldAlert,
  Clock,
  Star,
  Lock,
  Unlock,
  Key,
  LogOut,
  AlertCircle,
  Eye,
  EyeOff,
  Package,
  Truck,
  UserCheck,
  FileText,
  CheckCircle
} from 'lucide-react';

export const PharmacyPortal: React.FC = () => {
  const { 
    stores, 
    medicines, 
    cart, 
    addToCart, 
    removeFromCart, 
    updateCartQuantity, 
    clearCart, 
    placeOrder, 
    orders,
    updateOrderStatus,
    sampleRequests,
    updateSampleStatus,
    editStore,
    addStore,
    addMedicine,
    t 
  } = useApp();

  // Mode Switch: 'patient' or 'partner'
  const [viewMode, setViewMode] = useState<'patient' | 'partner'>('patient');

  // Partner authentication state
  const [loggedInStoreId, setLoggedInStoreId] = useState<string | null>(() => {
    return localStorage.getItem('logged_in_store_id');
  });
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  // Partner Sign Up States
  const [partnerAuthView, setPartnerAuthView] = useState<'signin' | 'signup'>('signin');
  const [signupStoreName, setSignupStoreName] = useState('');
  const [signupStoreAddress, setSignupStoreAddress] = useState('');
  const [signupStorePhone, setSignupStorePhone] = useState('');
  const [signupStoreLicense, setSignupStoreLicense] = useState('');
  const [signupStoreUsername, setSignupStoreUsername] = useState('');
  const [signupStorePassword, setSignupStorePassword] = useState('');
  const [signupStoreImage, setSignupStoreImage] = useState('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=80');
  const [partnerSignupSuccess, setPartnerSignupSuccess] = useState('');
  const [partnerSignupError, setPartnerSignupError] = useState('');

  // Partner Password Change State
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Partner Add Medicine Form State
  const [newMedName, setNewMedName] = useState('');
  const [newMedPrice, setNewMedPrice] = useState('');
  const [newMedCategory, setNewMedCategory] = useState('OTC');
  const [newMedDosage, setNewMedDosage] = useState('10 Tablets');
  const [newMedDesc, setNewMedDesc] = useState('');
  const [newMedRequiresRx, setNewMedRequiresRx] = useState(false);
  const [newMedSuccess, setNewMedSuccess] = useState(false);

  // Phlebotomist Assigner State
  const [assigningSampleId, setAssigningSampleId] = useState<string | null>(null);
  const [techNameInput, setTechNameInput] = useState('');
  const [techPhoneInput, setTechPhoneInput] = useState('');

  // Patient Store Browsing states
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [rxFile, setRxFile] = useState<{ name: string; url: string } | null>(null);

  const categories = ['All', 'Prescription', 'OTC', 'Vitamins', 'First Aid', 'Diabetes Care', 'Personal Care'];

  // Current logged in store
  const currentStore = stores.find(s => s.id === loggedInStoreId);

  // Filter medicines for patient browsing
  const filteredMedicines = medicines.filter(med => {
    const matchesStore = selectedStoreId === 'all' || med.storeId === selectedStoreId;
    const matchesCat = selectedCategory === 'All' || med.category === selectedCategory;
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          med.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStore && matchesCat && matchesSearch;
  });

  const cartTotal = cart.reduce((acc, item) => acc + (item.medicine.price * item.quantity), 0);
  const requiresRxInCart = cart.some(item => item.medicine.requiresPrescription);

  const handleRxUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setRxFile({
        name: file.name,
        url: URL.createObjectURL(file)
      });
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) return;
    if (!patientName.trim() || !patientPhone.trim() || !deliveryAddress.trim()) {
      alert("Please fill in your name, phone, and delivery address.");
      return;
    }

    if (requiresRxInCart && !rxFile) {
      alert("One or more items in your cart require a Doctor's Prescription. Please upload your prescription image/PDF.");
      return;
    }

    placeOrder({
      patientName,
      patientPhone,
      deliveryAddress,
      items: cart,
      totalAmount: cartTotal,
      prescriptionName: rxFile?.name,
      prescriptionUrl: rxFile?.url
    });

    setIsCheckoutOpen(false);
    setRxFile(null);
  };

  // Partner Log In
  const handlePartnerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (!usernameInput.trim() || !passwordInput.trim()) {
      setLoginError('Please enter both store username and password.');
      return;
    }

    const foundStore = stores.find(
      s => s.username?.toLowerCase() === usernameInput.trim().toLowerCase() && s.password === passwordInput
    );

    if (!foundStore) {
      setLoginError('Invalid partner username or password.');
      return;
    }

    if (foundStore.isActive === false) {
      setLoginError('Your partner store access has been deactivated permanently by the administrator.');
      return;
    }

    // Success
    setLoggedInStoreId(foundStore.id);
    localStorage.setItem('logged_in_store_id', foundStore.id);
    setUsernameInput('');
    setPasswordInput('');
  };

  // Partner Sign Up
  const handlePartnerSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setPartnerSignupError('');
    setPartnerSignupSuccess('');

    if (!signupStoreName.trim() || !signupStoreAddress.trim() || !signupStorePhone.trim() || !signupStoreLicense.trim() || !signupStoreUsername.trim() || !signupStorePassword.trim()) {
      setPartnerSignupError('All fields marked with * are required.');
      return;
    }

    const usernameTaken = stores.some(s => s.username?.toLowerCase() === signupStoreUsername.trim().toLowerCase());
    if (usernameTaken) {
      setPartnerSignupError('This username is already taken. Please choose another.');
      return;
    }

    const newStoreObj = {
      name: signupStoreName.trim(),
      address: signupStoreAddress.trim(),
      phone: signupStorePhone.trim(),
      licenseNumber: signupStoreLicense.trim(),
      username: signupStoreUsername.trim().toLowerCase(),
      password: signupStorePassword,
      image: signupStoreImage.trim() || 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&auto=format&fit=crop&q=80',
      isActive: true,
      approvalStatus: 'pending' as const
    };

    addStore(newStoreObj);

    setPartnerSignupSuccess('Pharmacy & Diagnostics Store registered successfully! Your registration is now pending administrator approval. Please wait for the platform coordinator to activate your partner credentials.');

    // Pre-fill login credentials
    setUsernameInput(newStoreObj.username);
    setPasswordInput(newStoreObj.password);

    // Reset fields
    setSignupStoreName('');
    setSignupStoreAddress('');
    setSignupStorePhone('');
    setSignupStoreLicense('');
    setSignupStoreUsername('');
    setSignupStorePassword('');

    setTimeout(() => {
      setPartnerAuthView('signin');
      setPartnerSignupSuccess('');
    }, 6000);
  };

  // Partner Log Out
  const handlePartnerLogout = () => {
    setLoggedInStoreId(null);
    localStorage.removeItem('logged_in_store_id');
    setIsChangingPassword(false);
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordSuccess('');
    setPasswordError('');
  };

  // Partner Password Change
  const handlePartnerPasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentStore) return;

    if (oldPassword !== currentStore.password) {
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

    editStore({
      ...currentStore,
      password: newPassword
    });

    setPasswordSuccess('Password updated successfully!');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => {
      setIsChangingPassword(false);
      setPasswordSuccess('');
    }, 3000);
  };

  // Partner Add Medicine
  const handleAddMedicine = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName.trim() || !newMedPrice.trim() || !currentStore) return;

    addMedicine({
      name: newMedName,
      storeId: currentStore.id,
      storeName: currentStore.name,
      category: newMedCategory,
      price: Number(newMedPrice),
      dosageForm: newMedDosage,
      description: newMedDesc || 'Partner store certified medical formulation.',
      requiresPrescription: newMedRequiresRx,
      image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&auto=format&fit=crop&q=80'
    });

    setNewMedSuccess(true);
    setTimeout(() => setNewMedSuccess(false), 3000);

    // Reset Form
    setNewMedName('');
    setNewMedPrice('');
    setNewMedDesc('');
    setNewMedRequiresRx(false);
  };

  // Assign Phlebotomist
  const handleAssignTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assigningSampleId || !techNameInput.trim()) return;

    updateSampleStatus(assigningSampleId, 'assigned', techNameInput.trim(), techPhoneInput.trim() || '+1 (800) 555-0199');
    setAssigningSampleId(null);
    setTechNameInput('');
    setTechPhoneInput('');
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Top Selector: Patient vs Pharmacist Dashboard */}
      <div className="flex justify-end">
        <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200 text-[11px] font-black uppercase tracking-wider shadow-sm">
          <button
            onClick={() => setViewMode('patient')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'patient' 
                ? 'bg-amber-600 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🛒 Patient Storefront
          </button>
          <button
            onClick={() => setViewMode('partner')}
            className={`px-4 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
              viewMode === 'partner' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔑 Partner Portal Dashboard
          </button>
        </div>
      </div>

      {/* RENDER VIEW 1: PATIENT SHOPPING PORTAL */}
      {viewMode === 'patient' && (
        <>
          {/* Banner */}
          <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-amber-955 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-amber-600">
            <div>
              <span className="bg-amber-500 text-amber-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider mb-2 inline-block">
                Pharmacy & Medicine Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white">
                Order Medicines from Partner Stores
              </h1>
              <p className="text-amber-100 text-xs sm:text-sm mt-1 max-w-xl">
                Browse verified pharmacy stores added by admin. Order prescription drugs, health supplements, and diagnostic monitoring devices with express home delivery.
              </p>
            </div>

            {/* View Cart Quick Trigger */}
            <button
              id="open-checkout-modal-btn"
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-white text-amber-955 hover:bg-amber-50 font-extrabold px-5 py-3 rounded-2xl text-xs shadow-md transition-all flex items-center gap-2 shrink-0 border border-amber-200"
            >
              <ShoppingCart className="w-4 h-4 text-amber-700" />
              <span>View Cart ({cart.length} Items)</span>
            </button>
          </div>

          {/* Stores List (Added by Admin) */}
          <section className="space-y-3">
            <h3 className="font-extrabold text-slate-800 text-xs uppercase tracking-wider">
              Partner Pharmacy Stores (Added by Admin)
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                id="select-store-all"
                onClick={() => setSelectedStoreId('all')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedStoreId === 'all'
                    ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-600/30'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <span className="font-extrabold text-xs text-slate-900 block">All Admin Stores</span>
                <span className="text-[11px] text-slate-500">{medicines.length} Medicines available</span>
              </button>

              {stores.filter(s => s.isActive !== false).map(store => (
                <button
                  key={store.id}
                  id={`select-store-${store.id}`}
                  onClick={() => setSelectedStoreId(store.id)}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    selectedStoreId === store.id
                      ? 'border-blue-600 bg-blue-50/80 shadow-sm ring-1 ring-blue-600/30'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900 truncate">{store.name}</span>
                    <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                      ★ {store.rating || 5.0}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{store.address}</p>
                </button>
              ))}
            </div>
          </section>

          {/* Category & Search Filter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-bold">
              {categories.map(cat => (
                <button
                  key={cat}
                  id={`category-pill-${cat}`}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                id="search-medicines-input"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search medicine name..."
                className="pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-xl text-xs text-slate-800"
              />
            </div>
          </div>

          {/* Medicine Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMedicines.map(med => (
              <div key={med.id} className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <img 
                      src={med.image} 
                      alt={med.name} 
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0" 
                    />
                    
                    <div className="text-right">
                      <span className="text-lg font-black text-amber-950 block">${med.price.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400 font-medium">{med.dosageForm}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {med.category}
                    </span>
                    
                    <h3 className="font-extrabold text-sm text-slate-900 mt-1.5">
                      {med.name}
                    </h3>

                    <p className="text-[11px] text-slate-500 mt-1 leading-normal line-clamp-2">
                      {med.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span className="truncate">Store: <strong>{med.storeName}</strong></span>
                    {med.requiresPrescription && (
                      <span className="text-red-600 font-bold shrink-0">Rx Required</span>
                    )}
                  </div>

                  <button
                    id={`add-to-cart-btn-${med.id}`}
                    onClick={() => addToCart(med)}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>
            ))}
          </div>

          {/* Checkout Modal / Drawer */}
          {isCheckoutOpen && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
                <h3 className="font-extrabold text-lg text-slate-900 flex items-center justify-between">
                  <span>Shopping Cart & Checkout</span>
                  <button onClick={() => setIsCheckoutOpen(false)} className="text-slate-400 hover:text-slate-600 text-xs">Close ✕</button>
                </h3>

                {cart.length === 0 ? (
                  <p className="text-slate-500 text-xs py-6 text-center">Your cart is empty.</p>
                ) : (
                  <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                    
                    {/* Cart Items */}
                    <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                      {cart.map(item => (
                        <div key={item.medicine.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                          <div>
                            <span className="font-bold text-slate-900 block">{item.medicine.name}</span>
                            <span className="text-[11px] text-slate-500">${item.medicine.price.toFixed(2)} each</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.medicine.id, -1)}
                              className="p-1 rounded bg-slate-200 hover:bg-slate-300"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="font-bold">{item.quantity}</span>
                            <button
                              type="button"
                              onClick={() => updateCartQuantity(item.medicine.id, 1)}
                              className="p-1 rounded bg-slate-200 hover:bg-slate-300"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeFromCart(item.medicine.id)}
                              className="p-1 rounded bg-red-100 text-red-600 hover:bg-red-200 ml-1"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex justify-between items-center text-xs font-bold text-amber-950">
                      <span>Total Amount:</span>
                      <span className="text-base">${cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-3 pt-2">
                      <h4 className="font-bold text-xs uppercase text-slate-700">Delivery Information</h4>
                      <input
                        type="text"
                        id="checkout-name"
                        value={patientName}
                        onChange={e => setPatientName(e.target.value)}
                        placeholder="Full Name *"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                      <input
                        type="tel"
                        id="checkout-phone"
                        value={patientPhone}
                        onChange={e => setPatientPhone(e.target.value)}
                        placeholder="Phone Number *"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                        required
                      />
                      <textarea
                        rows={2}
                        id="checkout-address"
                        value={deliveryAddress}
                        onChange={e => setDeliveryAddress(e.target.value)}
                        placeholder="Home Delivery Address *"
                        className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
                        required
                      ></textarea>
                    </div>

                    {/* Upload Prescription if required */}
                    {requiresRxInCart && (
                      <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 space-y-2">
                        <label className="block text-xs font-bold text-red-900">
                          ⚠️ Prescription Required for Items in Cart
                        </label>
                        <input
                          type="file"
                          accept=".pdf,image/*"
                          onChange={handleRxUpload}
                          className="text-[11px] text-slate-600 w-full"
                        />
                        {rxFile && (
                          <p className="text-[10px] text-emerald-700 font-bold">✓ Uploaded: {rxFile.name}</p>
                        )}
                      </div>
                    )}

                    <button
                      type="submit"
                      id="confirm-place-order-btn"
                      className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
                    >
                      Confirm & Place Order (${cartTotal.toFixed(2)})
                    </button>

                  </form>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* RENDER VIEW 2: PARTNER PHARMACY & LAB SECURE DASHBOARD */}
      {viewMode === 'partner' && (
        <>
          {/* RENDER 2A: LOGIN / SIGNUP FORM IF NOT AUTHENTICATED */}
          {(!loggedInStoreId || !currentStore) ? (
            <div className="max-w-xl mx-auto my-6 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto shadow-sm overflow-hidden border border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1516549655169-df83a0774514?w=120&h=120&fit=crop&auto=format&q=80"
                    alt="AiLynkX Logo"
                    className="w-full h-full object-cover animate-pulse"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h2 className="text-xl font-black text-slate-900">AiLynkX Partner Portal</h2>
                <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
                  Access center for pharmacy stores and medical lab phlebotomists. Log in with your credentials, or apply to register your store.
                </p>
              </div>

              {/* View Switch Tabs */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
                <button
                  onClick={() => { setPartnerAuthView('signin'); setLoginError(''); setPartnerSignupError(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    partnerAuthView === 'signin' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Partner Sign In
                </button>
                <button
                  onClick={() => { setPartnerAuthView('signup'); setLoginError(''); setPartnerSignupError(''); }}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    partnerAuthView === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Apply Partner Store
                </button>
              </div>

              {partnerAuthView === 'signin' ? (
                /* Sign In Form */
                <div className="space-y-4">
                  {loginError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{loginError}</span>
                    </div>
                  )}

                  <form onSubmit={handlePartnerLogin} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Partner Username *</label>
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={e => setUsernameInput(e.target.value)}
                        placeholder="Enter partner store username"
                        className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Store Password *</label>
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
                      className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                    >
                      Partner Authentication
                    </button>
                  </form>
                </div>
              ) : (
                /* Sign Up Form */
                <div className="space-y-4">
                  {partnerSignupError && (
                    <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl text-red-800 text-xs font-semibold flex items-start gap-2.5">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <span>{partnerSignupError}</span>
                    </div>
                  )}

                  {partnerSignupSuccess && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-medium flex items-start gap-2.5 leading-relaxed">
                      <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{partnerSignupSuccess}</span>
                    </div>
                  )}

                  <form onSubmit={handlePartnerSignup} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Pharmacy / Laboratory Name *</label>
                      <input
                        type="text"
                        value={signupStoreName}
                        onChange={e => setSignupStoreName(e.target.value)}
                        placeholder="e.g. HealthShield Diagnostic Labs"
                        className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-bold text-slate-700 mb-1">Official Address *</label>
                      <input
                        type="text"
                        value={signupStoreAddress}
                        onChange={e => setSignupStoreAddress(e.target.value)}
                        placeholder="e.g. 505 Medical Plaza, Suite B"
                        className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Store Phone *</label>
                      <input
                        type="tel"
                        value={signupStorePhone}
                        onChange={e => setSignupStorePhone(e.target.value)}
                        placeholder="e.g. +1 (800) 555-0199"
                        className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Medical Store License Number *</label>
                      <input
                        type="text"
                        value={signupStoreLicense}
                        onChange={e => setSignupStoreLicense(e.target.value)}
                        placeholder="e.g. PH-2026-X99"
                        className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Partner Username *</label>
                      <input
                        type="text"
                        value={signupStoreUsername}
                        onChange={e => setSignupStoreUsername(e.target.value)}
                        placeholder="Choose username"
                        className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                        required
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Partner Password *</label>
                      <input
                        type="password"
                        value={signupStorePassword}
                        onChange={e => setSignupStorePassword(e.target.value)}
                        placeholder="Choose security password"
                        className="w-full p-3 rounded-xl border border-slate-300 font-medium"
                        required
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <PhotoUpload
                        value={signupStoreImage}
                        onChange={setSignupStoreImage}
                        label="Upload Pharmacy / Diagnostic Center Photo"
                        type="store"
                      />
                    </div>

                    <div className="sm:col-span-2 pt-2">
                      <button
                        type="submit"
                        className="w-full py-3.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer"
                      >
                        Submit Registration Application
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="pt-4 border-t border-slate-100 text-center text-[10px] text-slate-400 font-medium">
                Authorized Lab / Store Access Console • Medicare Partners
              </div>
            </div>
          ) : currentStore.isActive === false ? (
            <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center text-xs animate-in fade-in duration-200">
              <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <AlertCircle className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Partner Access Suspended</h2>
              <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl leading-relaxed text-left">
                Your partner store and diagnostic lab portal access has been deactivated permanently by the administrator. 
                If you believe this is an error or wish to appeal the suspension, please contact support.
              </div>
              <button
                onClick={handlePartnerLogout}
                className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
              >
                Sign Out Partner
              </button>
            </div>
          ) : currentStore.approvalStatus === 'pending' ? (
            <div className="max-w-xl mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-xs animate-in fade-in duration-200">
              <div className="text-center space-y-2">
                <div className="w-14 h-14 bg-amber-100 text-amber-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm animate-pulse">
                  <Clock className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-black text-slate-900">Partner Verification Pending</h2>
                <span className="inline-block bg-amber-100 text-amber-800 text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Approval Pending
                </span>
                <p className="text-slate-500 font-medium max-w-sm mx-auto">
                  Hello, Representative of {currentStore.name}. Your details are successfully registered. To list your store and phlebotomist service on AilynkX Health, please wait for platform administrator approval.
                </p>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/50 space-y-3">
                <h3 className="font-extrabold text-amber-950 uppercase text-[10px]">Verification Checklist</h3>
                <ul className="list-disc pl-4 space-y-1.5 text-slate-700">
                  <li>Store licensing and pharmaceutical distribution certifications.</li>
                  <li>Official contact numbers check.</li>
                  <li>Validation of delivery range and lab collection capabilities.</li>
                </ul>
              </div>

              <div className="border border-slate-100 p-4 rounded-2xl space-y-2 bg-slate-50 text-[11px]">
                <span className="font-bold text-slate-500 block uppercase text-[9px]">Submitted Store Details:</span>
                <div><strong className="text-slate-700 font-bold">Store Name:</strong> {currentStore.name}</div>
                <div><strong className="text-slate-700 font-bold">Address:</strong> {currentStore.address}</div>
                <div><strong className="text-slate-700 font-bold">License Number:</strong> {currentStore.licenseNumber}</div>
                <div><strong className="text-slate-700 font-bold">Contact Phone:</strong> {currentStore.phone}</div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.location.reload();
                  }}
                  className="flex-1 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer text-center"
                >
                  Check Status Now
                </button>
                <button
                  onClick={handlePartnerLogout}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : currentStore.approvalStatus === 'rejected' ? (
            <div className="max-w-md mx-auto my-12 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm space-y-6 text-center text-xs animate-in fade-in duration-200">
              <div className="w-14 h-14 bg-red-100 text-red-700 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <h2 className="text-xl font-black text-slate-900">Application Rejected</h2>
              <div className="p-4 bg-red-50 border border-red-100 text-red-800 rounded-2xl leading-relaxed text-left space-y-2">
                <p className="font-bold text-red-950">Dear Representative of {currentStore.name},</p>
                <p>
                  Your pharmaceutical partner application has been rejected by the portal administrator. 
                  Common reasons include failure to verify medical distributor licensing, missing active phone lines, or mismatching postal address details.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handlePartnerLogout}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                >
                  Try signup again
                </button>
                <button
                  onClick={handlePartnerLogout}
                  className="px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-bold uppercase tracking-wider cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            </div>
          ) : (
            // RENDER 2B: SECURE MANAGEMENT DASHBOARD
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Partner Dashboard Header */}
              <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border border-slate-800">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-amber-500 text-slate-900 rounded-2xl flex items-center justify-center text-xl font-black shadow-inner">
                    {currentStore.name.charAt(0)}
                  </div>
                  <div>
                    <span className="bg-amber-500 text-slate-950 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider mb-1 inline-block">
                      Partner Console Active
                    </span>
                    <h1 className="text-xl sm:text-2xl font-black text-white">
                      {currentStore.name}
                    </h1>
                    <p className="text-slate-300 text-xs mt-0.5 font-medium">
                      Store Address: {currentStore.address} • License: {currentStore.licenseNumber}
                    </p>
                  </div>
                </div>

                {/* Account Settings */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setIsChangingPassword(!isChangingPassword)}
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs font-extrabold rounded-xl border border-white/10 transition-all flex items-center gap-1.5"
                  >
                    <Key className="w-3.5 h-3.5 text-amber-400" />
                    <span>Change Password</span>
                  </button>
                  <button
                    onClick={handlePartnerLogout}
                    className="px-4 py-2 bg-red-600/90 hover:bg-red-600 text-white text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5 shadow-md"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out Partner</span>
                  </button>
                </div>
              </div>

              {/* Password update form */}
              {isChangingPassword && (
                <div className="bg-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm max-w-md space-y-4 animate-in slide-in-from-top-4 duration-200">
                  <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                    <Key className="w-4 h-4 text-amber-600" />
                    Update Partner Store Password
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

                  <form onSubmit={handlePartnerPasswordChange} className="space-y-3 text-xs">
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
                        className="px-4 py-2 bg-amber-600 text-white font-extrabold rounded-xl text-[11px]"
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

              {/* Management Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* COLUMN 1: NEW MEDICINE ADDER + STORE INVENTORY */}
                <div className="lg:col-span-4 space-y-6">
                  {/* Add Product */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-2">
                      <Plus className="w-4 h-4 text-amber-600" />
                      Add to Store Inventory
                    </h3>

                    {newMedSuccess && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold rounded-xl">
                        ✓ Medicine listed in your inventory!
                      </div>
                    )}

                    <form onSubmit={handleAddMedicine} className="space-y-3">
                      <div>
                        <label className="block font-bold text-slate-600 mb-0.5">Medicine Name *</label>
                        <input
                          type="text"
                          value={newMedName}
                          onChange={e => setNewMedName(e.target.value)}
                          placeholder="e.g. Paracetamol 500mg"
                          className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-600 mb-0.5">Price ($) *</label>
                          <input
                            type="number"
                            step="0.01"
                            value={newMedPrice}
                            onChange={e => setNewMedPrice(e.target.value)}
                            placeholder="12.99"
                            className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-0.5">Category</label>
                          <select
                            value={newMedCategory}
                            onChange={e => setNewMedCategory(e.target.value)}
                            className="w-full p-2 bg-white rounded-lg border border-slate-300 font-semibold"
                          >
                            <option value="OTC">OTC (Over the Counter)</option>
                            <option value="Prescription">Prescription (Rx)</option>
                            <option value="Vitamins">Vitamins</option>
                            <option value="Diabetes Care">Diabetes Care</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-bold text-slate-600 mb-0.5">Dosage / Form</label>
                          <input
                            type="text"
                            value={newMedDosage}
                            onChange={e => setNewMedDosage(e.target.value)}
                            placeholder="e.g. 10 Tablets"
                            className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                          />
                        </div>
                        <div className="flex items-end pb-2">
                          <label className="flex items-center gap-1.5 font-bold text-slate-600 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newMedRequiresRx}
                              onChange={e => setNewMedRequiresRx(e.target.checked)}
                              className="rounded border-slate-300 text-amber-600"
                            />
                            <span>Requires Rx</span>
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-slate-600 mb-0.5">Description</label>
                        <textarea
                          rows={2}
                          value={newMedDesc}
                          onChange={e => setNewMedDesc(e.target.value)}
                          placeholder="Usage instructions or components..."
                          className="w-full p-2 bg-white rounded-lg border border-slate-300 font-medium"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl transition-all shadow-sm"
                      >
                        Publish Product Listing
                      </button>
                    </form>
                  </div>

                  {/* Store Catalogue */}
                  <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                    <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">
                      Your Inventory ({medicines.filter(m => m.storeId === currentStore.id).length})
                    </h3>
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 text-xs">
                      {medicines.filter(m => m.storeId === currentStore.id).map(m => (
                        <div key={m.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 block">{m.name}</span>
                            <span className="text-[10px] text-slate-500">{m.dosageForm} • {m.category}</span>
                          </div>
                          <span className="font-black text-amber-950">${m.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* COLUMN 2: CUSTOMER MEDICINE ORDERS & INCOMING PHARMACY TASKS */}
                <div className="lg:col-span-8 space-y-6">
                  
                  {/* Incoming Orders Box */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Package className="w-5 h-5 text-amber-600" />
                      Incoming Medicine Orders
                    </h3>

                    {orders.length === 0 ? (
                      <p className="text-slate-400 text-xs italic py-6 text-center">No client pharmacy orders placed yet.</p>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(order => {
                          // Check if order has any item for this store (or support general fulfill for demo)
                          const hasStoreItem = order.items.some(i => i.medicine.storeId === currentStore.id) || true;
                          if (!hasStoreItem) return null;

                          return (
                            <div key={order.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                              <div className="flex items-center justify-between flex-wrap gap-2">
                                <div>
                                  <span className="font-extrabold text-slate-900 block text-sm">Order #{order.id}</span>
                                  <span className="text-[10px] text-slate-400 font-semibold">{new Date(order.createdAt).toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-slate-400 font-bold uppercase">Status:</span>
                                  <span className={`px-2 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                                    order.status === 'placed' ? 'bg-amber-100 text-amber-800' :
                                    order.status === 'preparing' ? 'bg-blue-100 text-blue-800' :
                                    order.status === 'shipped' ? 'bg-indigo-100 text-indigo-800' :
                                    'bg-emerald-100 text-emerald-800'
                                  }`}>
                                    {order.status}
                                  </span>
                                </div>
                              </div>

                              {/* Items Table */}
                              <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1.5">
                                <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Ordered Items</span>
                                {order.items.map(item => (
                                  <div key={item.medicine.id} className="flex justify-between text-slate-700 font-medium">
                                    <span>{item.medicine.name} <strong className="text-slate-900 font-bold">x{item.quantity}</strong></span>
                                    <span>${(item.medicine.price * item.quantity).toFixed(2)}</span>
                                  </div>
                                ))}
                                {order.prescriptionName && (
                                  <div className="pt-1.5 border-t border-slate-100 flex items-center gap-1.5 text-blue-700 font-bold text-[10px]">
                                    <FileText className="w-3.5 h-3.5" />
                                    <span>Prescription verified: {order.prescriptionName}</span>
                                  </div>
                                )}
                              </div>

                              {/* Customer info */}
                              <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-500">
                                <div>
                                  <strong className="text-slate-800 block">Deliver to:</strong>
                                  <p className="font-medium">{order.patientName} • {order.patientPhone}</p>
                                  <p className="italic">{order.deliveryAddress}</p>
                                </div>
                                <div className="text-right">
                                  <strong className="text-slate-400">Total Charged</strong>
                                  <p className="text-sm font-black text-slate-900">${order.totalAmount.toFixed(2)}</p>
                                </div>
                              </div>

                              {/* Order actions */}
                              <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200">
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'preparing')}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase border ${
                                    order.status === 'placed' 
                                      ? 'bg-amber-600 text-white hover:bg-amber-700' 
                                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  }`}
                                  disabled={order.status !== 'placed'}
                                >
                                  Prepare Order
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'shipped')}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase border ${
                                    order.status === 'preparing' 
                                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  }`}
                                  disabled={order.status !== 'preparing'}
                                >
                                  Ship / Dispatch
                                </button>
                                <button
                                  onClick={() => updateOrderStatus(order.id, 'delivered')}
                                  className={`px-3 py-1.5 rounded-lg font-bold text-[10px] uppercase border ${
                                    order.status === 'shipped' 
                                      ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                                      : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                                  }`}
                                  disabled={order.status !== 'shipped'}
                                >
                                  Deliver to Doorstep
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* LAB PORTAL SECTION: Home Sample Requests */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                    <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
                      <Clock className="w-5 h-5 text-indigo-600" />
                      Medical Lab Diagnostic Requests (Home Sample Collections)
                    </h3>

                    {sampleRequests.length === 0 ? (
                      <p className="text-slate-400 text-xs italic py-6 text-center font-medium">No diagnostic sample collection requests received.</p>
                    ) : (
                      <div className="space-y-4">
                        {sampleRequests.map(req => (
                          <div key={req.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-3">
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div>
                                <span className="font-extrabold text-slate-900 text-sm block">Lab Request #{req.id}</span>
                                <span className="text-[10px] text-slate-400 font-semibold">Scheduled Date: {req.preferredDate} ({req.preferredTime})</span>
                              </div>
                              <span className={`px-2.5 py-0.5 rounded-full font-black text-[9px] uppercase tracking-wider ${
                                req.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                req.status === 'assigned' ? 'bg-indigo-100 text-indigo-800 animate-pulse' :
                                req.status === 'collected' ? 'bg-blue-100 text-blue-800' :
                                'bg-emerald-100 text-emerald-800'
                              }`}>
                                {req.status}
                              </span>
                            </div>

                            {/* Tests requested */}
                            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
                              <span className="text-[10px] font-black uppercase text-slate-400 block tracking-wider">Diagnostic Test Panel</span>
                              <div className="flex flex-wrap gap-1.5 pt-0.5">
                                {req.selectedTests.map(t => (
                                  <span key={t} className="px-2 py-1 bg-slate-100 text-slate-700 rounded-lg font-semibold text-[10px]">
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Client & tech details */}
                            <div className="grid grid-cols-2 gap-4 text-[11px] text-slate-500">
                              <div>
                                <strong className="text-slate-800 block">Patient details:</strong>
                                <p className="font-medium">{req.patientName} • {req.patientPhone}</p>
                                <p className="italic">{req.patientAddress}</p>
                              </div>
                              <div>
                                <strong className="text-slate-800 block">Phlebotomist:</strong>
                                {req.technicianName ? (
                                  <p className="font-medium text-slate-700">✓ Assigned: {req.technicianName} ({req.technicianPhone})</p>
                                ) : (
                                  <p className="text-amber-700 font-bold">⚠️ Awaiting Specialist Assignment</p>
                                )}
                              </div>
                            </div>

                            {/* Lab actions */}
                            <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200 flex-wrap">
                              {req.status === 'pending' && (
                                <button
                                  onClick={() => setAssigningSampleId(req.id)}
                                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold rounded-lg text-[10px] uppercase shadow-xs"
                                >
                                  Assign Phlebotomist
                                </button>
                              )}

                              {req.status === 'assigned' && (
                                <button
                                  onClick={() => updateSampleStatus(req.id, 'collected')}
                                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-lg text-[10px] uppercase shadow-xs"
                                >
                                  Confirm Sample Collected
                                </button>
                              )}

                              {req.status === 'collected' && (
                                <button
                                  onClick={() => updateSampleStatus(req.id, 'completed')}
                                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-lg text-[10px] uppercase shadow-xs"
                                >
                                  Upload Results & Mark Completed
                                </button>
                              )}
                            </div>

                            {/* Inline assigner form */}
                            {assigningSampleId === req.id && (
                              <form onSubmit={handleAssignTech} className="p-3 bg-indigo-50 border border-indigo-200 rounded-xl space-y-2.5 mt-2">
                                <span className="font-extrabold text-indigo-900 block text-[10px] uppercase tracking-wider">Assign Lab Representative</span>
                                <div className="grid grid-cols-2 gap-2">
                                  <input
                                    type="text"
                                    value={techNameInput}
                                    onChange={e => setTechNameInput(e.target.value)}
                                    placeholder="Phlebotomist Name *"
                                    className="p-2 bg-white rounded border border-slate-300 w-full text-xs font-semibold"
                                    required
                                  />
                                  <input
                                    type="tel"
                                    value={techPhoneInput}
                                    onChange={e => setTechPhoneInput(e.target.value)}
                                    placeholder="Mobile Number"
                                    className="p-2 bg-white rounded border border-slate-300 w-full text-xs font-semibold"
                                  />
                                </div>
                                <div className="flex justify-end gap-1.5">
                                  <button
                                    type="submit"
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded font-extrabold text-[10px] uppercase"
                                  >
                                    Assign Now
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setAssigningSampleId(null)}
                                    className="px-2.5 py-1.5 bg-slate-300 hover:bg-slate-400 text-slate-800 rounded font-bold text-[10px] uppercase"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </form>
                            )}

                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}
        </>
      )}

    </div>
  );
};
