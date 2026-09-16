import React, { useState } from 'react';
import {
  Tag,
  Plus,
  Shirt,
  Sparkles,
  Zap,
  Building,
  Check,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Sliders,
  DollarSign,
  Package,
  Layers,
  Info,
  ChevronRight,
  Search,
  Filter,
  X
} from 'lucide-react';

export default function OwnerServicesPricingScreen({ onShowToast }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal Edit / Create State
  const [modalService, setModalService] = useState(null);
  const [isNewService, setIsNewService] = useState(false);

  // Initial full services catalog data
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Wash & Fold',
      category: 'Wash & Fold',
      description: 'Everyday garments, t-shirts, jeans, bedsheets, and towels washed, dried, and neatly packed.',
      unit: 'per kg',
      price: '37.00',
      turnaround: '24 hrs',
      minOrder: '3 kg min',
      popular: true,
      active: true,
      iconName: 'shirt'
    },
    {
      id: 2,
      name: 'Dry Cleaning (Suits & Blazers)',
      category: 'Dry Clean & Press',
      description: 'Gentle eco-solvent cycle for two-piece suits, formal blazers, dinner jackets, and silk ties.',
      unit: 'per item',
      price: '90.00',
      turnaround: '48 hrs',
      minOrder: '1 item',
      popular: false,
      active: true,
      iconName: 'building'
    },
    {
      id: 3,
      name: 'Steam Iron & Press Only',
      category: 'Dry Clean & Press',
      description: 'High-pressure commercial steam pressing without wash cycle. Crisp collars and sharp creases.',
      unit: 'per item',
      price: '25.00',
      turnaround: '12 hrs',
      minOrder: '2 items',
      popular: false,
      active: true,
      iconName: 'zap'
    },
    {
      id: 4,
      name: 'Duvet & Heavy Comforter Clean',
      category: 'Bulky & Household',
      description: 'King and Queen size heavy fiber comforters, duvets, weighted blankets, and winter quilts.',
      unit: 'per piece',
      price: '120.00',
      turnaround: '48 hrs',
      minOrder: '1 piece',
      popular: true,
      active: true,
      iconName: 'sparkles'
    },
    {
      id: 5,
      name: 'Express Wash & Dry (Same Day)',
      category: 'Wash & Fold',
      description: 'Priority rush cycle. Delivered back freshly folded within 4 to 6 hours of intake pickup.',
      unit: 'per kg',
      price: '65.00',
      turnaround: '4-6 hrs',
      minOrder: '4 kg min',
      popular: true,
      active: true,
      iconName: 'zap'
    },
    {
      id: 6,
      name: 'Sneaker & Footwear Restoration',
      category: 'Specialty',
      description: 'Hand scrub, midsole whitening, deep mesh extraction, insole wash, and deodorization.',
      unit: 'per pair',
      price: '80.00',
      turnaround: '48 hrs',
      minOrder: '1 pair',
      popular: false,
      active: true,
      iconName: 'sparkles'
    },
    {
      id: 7,
      name: 'Curtains & Window Drapes',
      category: 'Bulky & Household',
      description: 'Anti-dustmite delicate fabric wash, steam finish, and wrinkle-free protective garment bag.',
      unit: 'per set',
      price: '150.00',
      turnaround: '72 hrs',
      minOrder: '1 set',
      popular: false,
      active: true,
      iconName: 'package'
    },
    {
      id: 8,
      name: 'Traditional Wear (Kente & Agbada)',
      category: 'Specialty',
      description: 'Handcrafted fabric care with color-lock preservation, mild organic soap, and hand starching.',
      unit: 'per set',
      price: '110.00',
      turnaround: '48 hrs',
      minOrder: '1 set',
      popular: false,
      active: true,
      iconName: 'shirt'
    }
  ]);

  // Add-ons & Treatment Modifiers State
  const [addons, setAddons] = useState([
    { id: 'a1', name: 'Downy Scent Booster Beads', price: '15.00', active: true, desc: 'Long-lasting floral fragrance' },
    { id: 'a2', name: 'Hypoallergenic Baby Detergent', price: '20.00', active: true, desc: 'Dye-free & perfume-free formula' },
    { id: 'a3', name: 'Deep Enzyme Stain Treatment', price: '35.00', active: true, desc: 'Targets grease, oil, and collar rings' },
    { id: 'a4', name: 'Eco-Friendly Reusable Laundry Bag', price: '45.00', active: false, desc: 'Heavy-duty nylon canvas bag' }
  ]);

  // Filter logic
  const categories = ['All', 'Wash & Fold', 'Dry Clean & Press', 'Bulky & Household', 'Specialty'];

  const filteredServices = services.filter((s) => {
    const matchesCat = activeCategory === 'All' || s.category === activeCategory;
    const matchesSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleToggleActive = (id) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        const nextState = !s.active;
        if (onShowToast) onShowToast(`${s.name} is now ${nextState ? 'Active' : 'Paused'} on Marketplace`);
        return { ...s, active: nextState };
      }
      return s;
    }));
  };

  const handleOpenEdit = (service) => {
    setModalService({ ...service });
    setIsNewService(false);
  };

  const handleOpenAdd = () => {
    setModalService({
      id: Date.now(),
      name: '',
      category: activeCategory !== 'All' ? activeCategory : 'Wash & Fold',
      description: '',
      unit: 'per kg',
      price: '40.00',
      turnaround: '24 hrs',
      minOrder: '1 item',
      popular: false,
      active: true,
      iconName: 'shirt'
    });
    setIsNewService(true);
  };

  const handleSaveModal = (e) => {
    e.preventDefault();
    if (!modalService.name.trim()) {
      if (onShowToast) onShowToast('Please enter a service name');
      return;
    }

    if (isNewService) {
      setServices([modalService, ...services]);
      if (onShowToast) onShowToast(`Added "${modalService.name}" to service catalog`);
    } else {
      setServices(prev => prev.map(s => s.id === modalService.id ? modalService : s));
      if (onShowToast) onShowToast(`Updated "${modalService.name}" details & rates`);
    }

    setModalService(null);
  };

  const handleDeleteFromModal = (id) => {
    setServices(prev => prev.filter(s => s.id !== id));
    if (onShowToast) onShowToast(`Removed "${modalService.name}" from catalog`);
    setModalService(null);
  };

  const handleToggleAddon = (id) => {
    setAddons(prev => prev.map(a => a.id === id ? { ...a, active: !a.active } : a));
    if (onShowToast) onShowToast('Updated catalog add-on preference');
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F5] text-slate-800 pb-24 overflow-y-auto">
      
      {/* Sub-Header Breadcrumbs & Navigation Bar */}
      <div className="px-6 lg:px-10 pt-6 pb-4 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-1.5">
            <span className="hover:text-slate-600 transition-colors">Operations</span>
            <span className="text-slate-400">&gt;</span>
            <span className="hover:text-slate-600 transition-colors">Shop configuration</span>
            <span className="text-slate-400">&gt;</span>
            <span className="text-[#008276] font-bold">Services &amp; Pricing</span>
          </div>

          <h1 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
            Services &amp; Pricing Catalog
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-normal mt-1">
            Configure your customer rates, pricing units, turnaround commitments, and premium garment care addons.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="bg-[#dce6f5] text-[#2c538a] text-xs font-bold px-3.5 py-2 rounded-2xl flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            <span>Currency: Ghana Cedis (GH₵)</span>
          </div>

          <button
            onClick={handleOpenAdd}
            className="bg-[#008276] hover:bg-[#007065] text-white px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Service</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="px-6 lg:px-10 max-w-7xl mx-auto w-full flex flex-col gap-6 mt-2">
        
        {/* Metric Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Services</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {services.filter(s => s.active).length} of {services.length}
              </h3>
              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Published on marketplace
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#008276] flex items-center justify-center">
              <Tag className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Base Wash &amp; Fold</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">GH₵ 37.00</h3>
              <span className="text-[11px] text-slate-500 font-medium mt-1">per kg • 24h standard</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Shirt className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Average Basket</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">GH₵ 240.00</h3>
              <span className="text-[11px] text-slate-500 font-medium mt-1">Across 14 active today</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-2xs flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Fastest Turnaround</span>
              <h3 className="text-2xl font-black text-slate-900 mt-1">4 Hours</h3>
              <span className="text-[11px] text-teal-700 font-bold mt-1">Express Rush intake</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Category Tabs & Search Bar */}
        <div className="bg-white rounded-3xl p-4 border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#008276] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-2.5" />
            <input
              type="text"
              placeholder="Search services or garments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#008276]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-3xl border p-5 flex flex-col justify-between transition-all shadow-2xs ${
                service.active
                  ? 'border-slate-200/90 hover:border-slate-300'
                  : 'border-dashed border-slate-300 opacity-60 bg-slate-50/60'
              }`}
            >
              <div>
                {/* Card Top Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#008276] flex items-center justify-center font-bold">
                      <Shirt className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-extrabold text-slate-900 tracking-tight">
                          {service.name}
                        </h3>
                        {service.popular && (
                          <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                            Popular
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        {service.category} • {service.minOrder}
                      </span>
                    </div>
                  </div>

                  {/* Active Toggle */}
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-xl border border-slate-200/60">
                    <span className="text-[11px] font-bold text-slate-600">
                      {service.active ? 'Active' : 'Paused'}
                    </span>
                    <input
                      type="checkbox"
                      checked={service.active}
                      onChange={() => handleToggleActive(service.id)}
                      className="w-4 h-4 accent-[#008276] cursor-pointer"
                    />
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-500 font-normal mt-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              {/* Price & Turnaround Row */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div 
                  onClick={() => handleOpenEdit(service)}
                  className="flex items-center gap-1.5 cursor-pointer group"
                  title="Click to edit service rate"
                >
                  <span className="text-xs text-slate-400 font-bold">Rate:</span>
                  <div className="flex items-baseline gap-1 bg-teal-50/70 group-hover:bg-teal-100/80 border border-teal-100 px-3 py-1.5 rounded-xl font-bold transition-colors">
                    <span className="text-base font-black text-[#008276]">
                      GH₵ {service.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      / {service.unit}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    {service.turnaround}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleOpenEdit(service)}
                    className="p-2 hover:bg-teal-50 hover:text-[#008276] text-slate-500 rounded-xl transition-all border border-transparent hover:border-teal-200 cursor-pointer shadow-2xs"
                    title="Edit full service details"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {/* Section: Premium Garment Add-ons & Treatments */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs flex flex-col gap-4 mt-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#008276]" />
                <span>Garment Care Add-ons &amp; Treatments</span>
              </h3>
              <p className="text-xs text-slate-500 font-normal mt-0.5">
                Optional custom treatment upsells available to customers during basket checkout.
              </p>
            </div>
            <span className="text-xs font-bold text-[#008276] bg-teal-50 px-3 py-1 rounded-xl">
              Upsell Revenue Booster
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 pt-2">
            {addons.map((addon) => (
              <div
                key={addon.id}
                className="bg-slate-50 border border-slate-200/80 rounded-2xl p-4 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-slate-900">{addon.name}</span>
                    <input
                      type="checkbox"
                      checked={addon.active}
                      onChange={() => handleToggleAddon(addon.id)}
                      className="w-4 h-4 accent-[#008276] cursor-pointer"
                    />
                  </div>
                  <p className="text-[11px] text-slate-500 font-normal mt-1 leading-tight">
                    {addon.desc}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#008276]">
                    + GH₵ {addon.price}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400">
                    {addon.active ? 'Available' : 'Disabled'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Edit / Add Service Modal Dialog */}
      {modalService && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-[999] animate-fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-teal-50 text-[#008276] flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">
                    {isNewService ? 'Add New Service' : `Edit ${modalService.name}`}
                  </h3>
                  <span className="text-[11px] text-slate-400 font-medium">
                    Configure customer rates and turnaround commitments
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setModalService(null)}
                className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="flex flex-col gap-4 text-xs font-medium">
              
              {/* Service Name */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Service Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wash & Fold, Suit Dry Cleaning..."
                  value={modalService.name}
                  onChange={(e) => setModalService({ ...modalService, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#008276]"
                />
              </div>

              {/* Category & Pricing Unit */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={modalService.category}
                    onChange={(e) => setModalService({ ...modalService, category: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#008276] cursor-pointer"
                  >
                    <option value="Wash & Fold">Wash &amp; Fold</option>
                    <option value="Dry Clean & Press">Dry Clean &amp; Press</option>
                    <option value="Bulky & Household">Bulky &amp; Household</option>
                    <option value="Specialty">Specialty</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pricing Unit</label>
                  <select
                    value={modalService.unit}
                    onChange={(e) => setModalService({ ...modalService, unit: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#008276] cursor-pointer"
                  >
                    <option value="per kg">per kg (weight)</option>
                    <option value="per item">per item (piece)</option>
                    <option value="per piece">per piece (bulky)</option>
                    <option value="per pair">per pair (shoes)</option>
                    <option value="per set">per set (outfit)</option>
                  </select>
                </div>
              </div>

              {/* Unit Rate & Turnaround */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Unit Rate (GH₵)</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.50"
                      min="1"
                      required
                      value={modalService.price}
                      onChange={(e) => setModalService({ ...modalService, price: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono text-slate-900 font-extrabold focus:outline-none focus:border-[#008276]"
                    />
                    <span className="absolute left-3 top-2.5 text-slate-400 font-bold">GH₵</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Turnaround Time</label>
                  <select
                    value={modalService.turnaround}
                    onChange={(e) => setModalService({ ...modalService, turnaround: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-[#008276] cursor-pointer"
                  >
                    <option value="4-6 hrs">4-6 hrs (Express Rush)</option>
                    <option value="12 hrs">12 hrs (Same Day)</option>
                    <option value="24 hrs">24 hrs (Standard)</option>
                    <option value="48 hrs">48 hrs (Delicate / Dry Clean)</option>
                    <option value="72 hrs">72 hrs (Bulky Drapes)</option>
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Customer Description</label>
                <textarea
                  rows="2"
                  placeholder="Describe garments, washing process, detergent, packaging..."
                  value={modalService.description}
                  onChange={(e) => setModalService({ ...modalService, description: e.target.value })}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-slate-800 font-normal focus:outline-none focus:border-[#008276]"
                />
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalService.popular}
                    onChange={(e) => setModalService({ ...modalService, popular: e.target.checked })}
                    className="w-4 h-4 accent-[#008276]"
                  />
                  <span className="text-xs font-bold text-slate-700">Show "Popular" Tag</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={modalService.active}
                    onChange={(e) => setModalService({ ...modalService, active: e.target.checked })}
                    className="w-4 h-4 accent-[#008276]"
                  />
                  <span className="text-xs font-bold text-slate-700">Active on Catalog</span>
                </label>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 mt-2">
                {!isNewService ? (
                  <button
                    type="button"
                    onClick={() => handleDeleteFromModal(modalService.id)}
                    className="text-rose-600 hover:text-rose-700 text-xs font-bold flex items-center gap-1 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Service</span>
                  </button>
                ) : <div />}

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setModalService(null)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-[#008276] hover:bg-[#007065] text-white rounded-xl text-xs font-extrabold transition-all shadow-xs cursor-pointer flex items-center gap-1.5"
                  >
                    <Check className="w-4 h-4 text-teal-200" />
                    <span>Save Changes</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
