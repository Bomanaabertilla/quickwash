import {
  Store,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Clock,
  Zap,
  CheckCircle2,
  Plus,
  RefreshCw,
  Bell,
  User,
  Eye,
  Save,
  LogOut,
  Calendar,
  TrendingUp,
  Check,
  Building,
  CreditCard,
  Sliders,
  Sparkles,
  Search,
  ShieldCheck,
  ChevronRight,
  Shirt,
  GripVertical,
  Trash2,
  ExternalLink,
  ChevronDown,
  Truck,
  RotateCcw,
  Star,
  ArrowLeft
} from 'lucide-react';

export default function OwnerProfileSetupScreen({
  onBackToDashboard,
  onBackToApp,
  onLogout,
  onSupportClick
}) {
  const [isUnsaved, setIsUnsaved] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Shop Details & Location State
  const [shopName, setShopName] = useState('Sparkle Express Laundry');
  const [branchDescriptor, setBranchDescriptor] = useState('Ring Road Central Flagship');
  const [shopCategory, setShopCategory] = useState('Laundromat & Dry Cleaning');
  const [physicalAddress, setPhysicalAddress] = useState('Plot 14B, Upper West Side, Ring Road Central, Accra');
  const [deliveryRadius, setDeliveryRadius] = useState(8.5);

  // Contact Information State
  const [primaryPhone, setPrimaryPhone] = useState('+233 24 123 4567');
  const [whatsapp, setWhatsapp] = useState('+233 55 987 6543');
  const [businessEmail, setBusinessEmail] = useState('accra@sparklewash');

  // Operating Hours & Turnaround Promise
  const [openTime, setOpenTime] = useState('07:00');
  const [closeTime, setCloseTime] = useState('20:30');
  const [turnaroundPromise, setTurnaroundPromise] = useState('24h'); // '24h' | '48h' | 'Same day'

  // Services Rates State
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Wash & fold',
      description: 'Everyday garments, t-shirts, towels',
      unit: 'per kg',
      price: '37.00',
      active: true,
      icon: Shirt
    },
    {
      id: 2,
      name: 'Dry cleaning',
      description: 'Solvent gentle cycle suits, dresses',
      unit: 'per item',
      price: '90.00',
      active: true,
      icon: Building
    },
    {
      id: 3,
      name: 'Iron only',
      description: 'Steam press without washing',
      unit: 'per item',
      price: '25.00',
      active: true,
      icon: Zap
    },
    {
      id: 4,
      name: 'Duvet & bulky clean',
      description: 'Comforters, heavy blankets, quilts',
      unit: 'per piece',
      price: '120.00',
      active: true,
      icon: Sparkles
    }
  ]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleUpdateServiceField = (id, field, value) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
    setIsUnsaved(true);
  };

  const handleToggleServiceActive = (id) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, active: !s.active } : s));
    setIsUnsaved(true);
  };

  const handleDeleteService = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    setIsUnsaved(true);
    showToast('Removed service line item');
  };

  const handleAddService = () => {
    const newId = Date.now();
    setServices(prev => [
      ...prev,
      {
        id: newId,
        name: 'Custom Service',
        description: 'Specialized garment treatment',
        unit: 'per item',
        price: '50.00',
        active: true,
        icon: Sparkles
      }
    ]);
    setIsUnsaved(true);
    showToast('Added new service line item to catalog');
  };

  const handleSaveProfile = () => {
    setIsUnsaved(false);
    showToast('Business profile & pricing catalog live synced to marketplace!');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#f4f7fb] text-slate-900 pb-24 overflow-y-auto custom-scrollbar">
      
      {/* Toast popup */}
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-slate-900 text-white px-4 py-2.5 rounded-full text-xs font-bold shadow-2xl z-[100] flex items-center gap-2 border border-teal-400/30 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sub-Header Breadcrumb & Page Title Bar */}
      <div className="bg-white border-b border-slate-200/80 px-4 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
        
        <div>
          {/* Clickable Breadcrumbs */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1">
            <button
              onClick={() => onBackToDashboard && onBackToDashboard()}
              className="hover:text-[#006a60] hover:underline cursor-pointer transition-colors"
            >
              Operations
            </button>
            <span>&gt;</span>
            <button
              onClick={() => onBackToDashboard && onBackToDashboard()}
              className="hover:text-[#006a60] hover:underline cursor-pointer transition-colors"
            >
              Shop configuration
            </button>
            <span>&gt;</span>
            <span className="text-slate-700 font-bold">Business profile</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Business profile setup
            </h1>
            <span className="bg-emerald-50 text-emerald-700 text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200/70 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              LIVE ON MARKETPLACE
            </span>
          </div>
        </div>

        {/* Top Right Status & Navigation Buttons */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5 bg-sky-50 text-sky-800 border border-sky-200/70 px-3 py-1.5 rounded-full text-xs font-extrabold">
            <span className="w-2 h-2 rounded-full bg-sky-500"></span>
            <span>All systems synced</span>
          </div>

          <button
            onClick={() => {
              showToast('Opening public QuickWash customer store page preview...');
            }}
            className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Eye className="w-4 h-4 text-[#006a60]" />
            <span>View public catalog</span>
          </button>
        </div>

      </div>

      {/* Main Content Area (Two Columns) */}
      <div className="p-4 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start max-w-[1400px] mx-auto w-full">
        
        {/* Left Column: Live Customer View Mobile App Card Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-3 sticky top-4">
          
          <div className="flex items-center justify-between text-xs font-extrabold text-slate-700">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Live customer view</span>
            </div>
            <span className="bg-slate-200 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
              Mobile App Card
            </span>
          </div>

          {/* Customer Preview Phone Card Frame */}
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden flex flex-col transition-all hover:border-[#006a60]/50">
            
            {/* Store Cover Photo */}
            <div className="relative h-44 w-full bg-slate-800 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=800&q=80"
                alt="Store Interior"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-black/20"></div>

              {/* Status Badges on Cover */}
              <div className="absolute top-3 left-3 flex items-center gap-1 bg-emerald-500/90 backdrop-blur-md text-white text-[10.5px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-white"></span>
                <span>Open now • Closes {closeTime} PM</span>
              </div>

              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md text-amber-600 text-[11px] font-extrabold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>4.9 (318)</span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
                <span className="bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[11px] font-bold">
                  {branchDescriptor || 'Ring Road Central Flagship'}
                </span>
                <span className="bg-[#006a60] text-white px-2 py-0.5 rounded-md text-[10.5px] font-extrabold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  QuickWash Verified
                </span>
              </div>
            </div>

            {/* Store Details Header */}
            <div className="p-4 border-b border-slate-100 flex flex-col gap-1.5 bg-white">
              <div className="flex items-center gap-1.5">
                <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {shopName || 'Sparkle Express Laundry'}
                </h2>
                <CheckCircle2 className="w-4 h-4 text-[#006a60] fill-[#006a60]" />
              </div>

              <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Upper West Side • Accra Central • 0.6 km away</span>
              </p>

              <div className="flex items-center gap-2 mt-1 text-[11px] font-bold text-slate-600 flex-wrap">
                <span className="bg-teal-50 text-[#006a60] px-2 py-0.5 rounded-md border border-teal-200/60 flex items-center gap-1">
                  <Zap className="w-3 h-3 text-[#006a60]" />
                  {turnaroundPromise} standard turnaround
                </span>
                <span className="bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md border border-sky-200/60 flex items-center gap-1">
                  <Truck className="w-3 h-3 text-sky-600" />
                  Free courier pickup
                </span>
              </div>
            </div>

            {/* Services & Pricing Preview Catalog */}
            <div className="p-4 flex flex-col gap-2.5 bg-slate-50/50">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                <span className="uppercase tracking-wider text-[10.5px]">SERVICES &amp; PRICING</span>
                <span className="text-[#006a60] font-extrabold text-[11px]">
                  {services.filter(s => s.active).length} active
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {services.filter(s => s.active).map((service) => (
                  <div
                    key={service.id}
                    className="bg-white p-2.5 rounded-2xl border border-slate-200/70 flex items-center justify-between text-xs shadow-2xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-xl bg-teal-50 text-[#006a60] flex items-center justify-center font-bold">
                        <Shirt className="w-3.5 h-3.5" />
                      </div>
                      <span className="font-extrabold text-slate-800">{service.name}</span>
                    </div>

                    <div className="flex items-baseline gap-1 font-mono font-extrabold text-slate-900">
                      <span className="text-[#006a60]">GHC {service.price}</span>
                      <span className="text-[10px] text-slate-400 font-sans font-normal">/ {service.unit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Customer Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-200/60">
                <button className="bg-slate-100 hover:bg-slate-200 text-slate-800 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors border border-slate-200">
                  <Phone className="w-3.5 h-3.5 text-slate-600" />
                  <span>{primaryPhone}</span>
                </button>

                <button className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition-colors shadow-2xs">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>WhatsApp Chat</span>
                </button>
              </div>

            </div>

          </div>

          <p className="text-[11px] text-slate-400 font-medium px-2 leading-relaxed">
            Preview updates in real time as changes are made. This is how customers discover and book your laundry shop on the QuickWash app.
          </p>

        </div>

        {/* Right Column: Form Sections (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Section 1: Shop Details & Location */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Store className="w-4 h-4 text-[#006a60]" />
                <span>1. Shop details &amp; location</span>
              </h3>
              <span className="text-[10.5px] font-mono font-bold text-slate-400">ACC-SPK-081</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Shop Name */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Shop name</label>
                <div className="relative">
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => {
                      setShopName(e.target.value);
                      setIsUnsaved(true);
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#006a60] pr-8"
                  />
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-2.5 top-2.5" />
                </div>
              </div>

              {/* Branch descriptor */}
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700">Branch descriptor / tagline</label>
                <input
                  type="text"
                  value={branchDescriptor}
                  onChange={(e) => {
                    setBranchDescriptor(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#006a60]"
                />
              </div>

            </div>

            {/* Shop Category */}
            <div className="flex flex-col gap-1 text-xs">
              <label className="font-bold text-slate-700">Shop category</label>
              <select
                value={shopCategory}
                onChange={(e) => {
                  setShopCategory(e.target.value);
                  setIsUnsaved(true);
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#006a60] cursor-pointer"
              >
                <option value="Laundromat & Dry Cleaning">Laundromat &amp; Dry Cleaning</option>
                <option value="Commercial Laundry & Uniforms">Commercial Laundry &amp; Uniforms</option>
                <option value="Express Steam Pressing Only">Express Steam Pressing Only</option>
              </select>
            </div>

            {/* Physical Address */}
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center justify-between">
                <label className="font-bold text-slate-700">Physical address &amp; pickup point</label>
                <button
                  onClick={() => showToast('Opened GPS pin locator on map')}
                  className="text-[11px] text-[#006a60] font-bold hover:underline flex items-center gap-1"
                >
                  <MapPin className="w-3 h-3" />
                  Select on map
                </button>
              </div>
              <div className="relative">
                <input
                  type="text"
                  value={physicalAddress}
                  onChange={(e) => {
                    setPhysicalAddress(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#006a60] pl-8"
                />
                <MapPin className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Dispatch Delivery Radius Slider */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col gap-2 text-xs">
              <div className="flex items-center justify-between font-bold text-slate-800">
                <span>Dispatch delivery radius</span>
                <span className="font-mono text-base font-extrabold text-[#006a60]">
                  {deliveryRadius} km
                </span>
              </div>

              <input
                type="range"
                min="1"
                max="25"
                step="0.5"
                value={deliveryRadius}
                onChange={(e) => {
                  setDeliveryRadius(parseFloat(e.target.value));
                  setIsUnsaved(true);
                }}
                className="w-full accent-[#006a60] cursor-pointer"
              />

              <div className="flex items-center justify-between text-[10.5px] text-slate-400 font-medium">
                <span>1 km (Local neighborhood)</span>
                <span className="text-slate-600 font-bold">Coverage: Ring Road, Circle, Osu, Ridge, Cantonments</span>
                <span>25 km</span>
              </div>
            </div>

          </div>

          {/* Section 2: Contact Information */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#006a60]" />
                <span>2. Contact information</span>
              </h3>
              <span className="text-[10.5px] font-bold text-slate-400">Customer-facing channels</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              
              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  Primary phone
                </label>
                <input
                  type="text"
                  value={primaryPhone}
                  onChange={(e) => {
                    setPrimaryPhone(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#006a60]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <MessageSquare className="w-3 h-3 text-emerald-600" />
                  WhatsApp line
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => {
                    setWhatsapp(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#006a60]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-bold text-slate-700 flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400" />
                  Business email
                </label>
                <input
                  type="text"
                  value={businessEmail}
                  onChange={(e) => {
                    setBusinessEmail(e.target.value);
                    setIsUnsaved(true);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-900 font-bold focus:outline-none focus:border-[#006a60]"
                />
              </div>

            </div>

          </div>

          {/* Section 3: Operating Hours & Turnaround Promise */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#006a60]" />
                <span>3. Operating hours &amp; turnaround promise</span>
              </h3>
              <span className="text-[10.5px] font-mono font-bold text-slate-400">GMT (UTC+0)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Working Window */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col gap-2">
                <span className="font-bold text-slate-800">Daily working window</span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10.5px] text-slate-500 font-medium">Opening time</span>
                    <input
                      type="text"
                      value={openTime}
                      onChange={(e) => {
                        setOpenTime(e.target.value);
                        setIsUnsaved(true);
                      }}
                      className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-[#006a60]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-[10.5px] text-slate-500 font-medium">Closing time</span>
                    <input
                      type="text"
                      value={closeTime}
                      onChange={(e) => {
                        setCloseTime(e.target.value);
                        setIsUnsaved(true);
                      }}
                      className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-[#006a60]"
                    />
                  </div>
                </div>
              </div>

              {/* Turnaround Guarantee */}
              <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 flex flex-col gap-2">
                <span className="font-bold text-slate-800">Standard turnaround promise</span>
                
                <div className="grid grid-cols-3 gap-1.5">
                  {['24h', '48h', 'Same day'].map((promise) => (
                    <button
                      key={promise}
                      onClick={() => {
                        setTurnaroundPromise(promise);
                        setIsUnsaved(true);
                      }}
                      className={`py-2 rounded-xl font-bold text-xs transition-all ${
                        turnaroundPromise === promise
                          ? 'bg-[#006a60] text-white shadow-xs'
                          : 'bg-white text-slate-600 border border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {promise}
                    </button>
                  ))}
                </div>

                <span className="text-[10.5px] text-slate-400 font-medium mt-0.5">
                  Evening intake accepted until 19:45 daily
                </span>
              </div>

            </div>

          </div>

          {/* Floating Save & Sync Sticky Bar */}
          <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-md flex flex-wrap items-center justify-between gap-3">
            
            <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <RefreshCw className="w-4 h-4 text-[#006a60] animate-spin" />
              <div>
                <span className="font-extrabold text-slate-900 block">Profile updates ready</span>
                <span className="text-[11px] text-slate-500">Real-time sync to marketplace preview enabled</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setIsUnsaved(false);
                  showToast('Discarded shop profile edits');
                }}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-bold transition-colors border border-slate-200"
              >
                Discard changes
              </button>

              <button
                onClick={handleSaveProfile}
                className="bg-[#006a60] hover:bg-[#005850] text-white px-5 py-2 rounded-xl text-xs font-extrabold flex items-center gap-1.5 shadow-sm transition-all border border-teal-400/30"
              >
                <Check className="w-4 h-4 text-amber-300" />
                <span>Save profile &amp; update live preview</span>
              </button>
            </div>

          </div>

          {/* Section 4: Services & Pricing Configuration */}
          <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs flex flex-col gap-4">
            
            <div className="flex items-center justify-between border-b border-slate-200/70 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-[#006a60]" />
                  <span>4. Services &amp; pricing configuration</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Set customer rates in Ghana Cedis (GH₵) for marketplace catalog
                </p>
              </div>

              <span className="bg-sky-50 text-sky-800 text-[10.5px] font-extrabold px-2.5 py-1 rounded-lg border border-sky-200/70">
                Currency: GHS (GH₵)
              </span>
            </div>

            {/* Editable Services List */}
            <div className="flex flex-col gap-4">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex flex-col gap-3 relative hover:border-slate-300 transition-all"
                >
                  {/* Service Header Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <GripVertical className="w-4 h-4 text-slate-400 cursor-grab" />
                      <span className="font-extrabold text-xs text-slate-900">
                        Service #{index + 1}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-slate-600">Active</span>
                        <input
                          type="checkbox"
                          checked={service.active}
                          onChange={() => handleToggleServiceActive(service.id)}
                          className="w-4 h-4 accent-[#006a60] cursor-pointer"
                        />
                      </div>

                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-slate-400 hover:text-rose-500 p-1 rounded-lg transition-colors"
                        title="Delete service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Form fields for Service */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                    
                    {/* Service Name */}
                    <div className="flex flex-col gap-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 text-[11px]">Service name</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => handleUpdateServiceField(service.id, 'name', e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-[#006a60]"
                      />
                    </div>

                    {/* Description */}
                    <div className="flex flex-col gap-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 text-[11px]">Description</label>
                      <input
                        type="text"
                        value={service.description}
                        onChange={(e) => handleUpdateServiceField(service.id, 'description', e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 font-medium focus:outline-none focus:border-[#006a60]"
                      />
                    </div>

                    {/* Pricing Unit */}
                    <div className="flex flex-col gap-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 text-[11px]">Pricing unit</label>
                      <select
                        value={service.unit}
                        onChange={(e) => handleUpdateServiceField(service.id, 'unit', e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-2 py-1.5 text-slate-900 font-bold focus:outline-none focus:border-[#006a60] cursor-pointer"
                      >
                        <option value="per kg">per kg</option>
                        <option value="per item">per item</option>
                        <option value="per piece">per piece</option>
                        <option value="per bag">per bag</option>
                      </select>
                    </div>

                    {/* Unit Price */}
                    <div className="flex flex-col gap-1 sm:col-span-1">
                      <label className="font-bold text-slate-700 text-[11px]">Unit price (GH₵)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={service.price}
                          onChange={(e) => handleUpdateServiceField(service.id, 'price', e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 font-mono text-slate-900 font-extrabold focus:outline-none focus:border-[#006a60] pl-9"
                        />
                        <span className="absolute left-2.5 top-1.5 text-[11px] font-bold text-slate-400">GHC</span>
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

            {/* Add Service Button */}
            <button
              onClick={handleAddService}
              className="w-full border-2 border-dashed border-slate-300 hover:border-[#006a60] hover:bg-teal-50/50 text-[#006a60] py-3 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>+ Add another service</span>
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}
