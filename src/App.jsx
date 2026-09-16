import React, { useState, useMemo } from 'react';
import Header from './components/Header.jsx';
import PickupLocation from './components/PickupLocation.jsx';
import SearchBar from './components/SearchBar.jsx';
import FilterPills from './components/FilterPills.jsx';
import PartnerList from './components/PartnerList.jsx';
import FloatingActionBar from './components/FloatingActionBar.jsx';
import BottomNav from './components/BottomNav.jsx';
import ScheduleModal from './components/ScheduleModal.jsx';
import PwaInstallBanner from './components/PwaInstallBanner.jsx';
import ProviderDetailScreen from './components/ProviderDetailScreen.jsx';
import ServicesScreen from './components/ServicesScreen.jsx';
import PreferencesScreen from './components/PreferencesScreen.jsx';
import PaymentCheckoutScreen from './components/PaymentCheckoutScreen.jsx';
import OrderConfirmationScreen from './components/OrderConfirmationScreen.jsx';
import TrackLaundryScreen from './components/TrackLaundryScreen.jsx';
import OwnerAuthScreen from './components/OwnerAuthScreen.jsx';
import OwnerDashboardScreen from './components/OwnerDashboardScreen.jsx';
import OwnerProfileSetupScreen from './components/OwnerProfileSetupScreen.jsx';
import { PARTNERS_DATA, CATEGORIES } from './data/partners.js';
import { getShopProfile } from './data/shopStore.js';
import { createOrder, getLatestOrder } from './data/ordersStore.js';
import { Smartphone, Maximize2, CheckCircle, Store } from 'lucide-react';

export default function App() {
  // Navigation & Screen state: 'providers' | 'provider-detail' | 'services' | 'preferences' | 'payment' | 'confirmation' | 'tracking' | 'owner-login' | 'owner-dashboard' | 'owner-profile'
  const [currentScreen, setCurrentScreen] = useState(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('screen')) return params.get('screen');
      if (window.location.hash) return window.location.hash.replace('#', '');
    }
    return 'owner-dashboard';
  });

  const [selectedPartnerId, setSelectedPartnerId] = useState('sparkle');
  const [scheduledTime, setScheduledTime] = useState('Mon, May 25 (10:00 AM)');
  const [totalAmount, setTotalAmount] = useState('235.00');
  const [selectedServices, setSelectedServices] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState('mtn');
  const [momoNumber, setMomoNumber] = useState('+233 24 123 4567');
  const [activeBookingRef, setActiveBookingRef] = useState(() => getLatestOrder()?.id || 'LB-2026-0091');
  const [specialInstructions, setSpecialInstructions] = useState('Use hypoallergenic lavender detergent');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [address, setAddress] = useState('Plot 14B, Ring Road Central, Accra');
  const [activeTab, setActiveTab] = useState('laundry');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isResponsiveMode, setIsResponsiveMode] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Filter partners based on search query & active category pill
  const filteredPartners = useMemo(() => {
    return PARTNERS_DATA.map(p => {
      if (p.id === 'sparkle') {
        const shop = getShopProfile();
        return {
          ...p,
          name: shop.name,
          neighborhood: shop.neighborhood || p.neighborhood,
          deliveryTime: `${shop.turnaroundPromise} Turnaround`,
          pricePerKg: shop.pricePerKg
        };
      }
      return p;
    }).filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || partner.neighborhood === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const selectedPartner = useMemo(() => {
    const base = PARTNERS_DATA.find((p) => p.id === selectedPartnerId) || PARTNERS_DATA[0];
    if (base.id === 'sparkle') {
      const shop = getShopProfile();
      return {
        ...base,
        name: shop.name,
        neighborhood: shop.neighborhood || base.neighborhood,
        deliveryTime: `${shop.turnaroundPromise} Turnaround`,
        pricePerKg: shop.pricePerKg
      };
    }
    return base;
  }, [selectedPartnerId]);

  const handleSelectPartner = (partner) => {
    setSelectedPartnerId(partner.id);
    showToast(`Selected: ${partner.name}`);
  };

  const handleChangeAddress = () => {
    const newAddr = prompt('Enter new pickup address:', address);
    if (newAddr && newAddr.trim() !== '') {
      setAddress(newAddr.trim());
      showToast('Pickup location updated!');
    }
  };

  // Step transitions
  const handleProceedToProviderDetail = () => {
    setCurrentScreen('provider-detail');
  };

  const handleProceedToServices = (selectedTimeStr) => {
    setScheduledTime(selectedTimeStr);
    showToast(`Reservation set for ${selectedTimeStr}!`);
    setCurrentScreen('services');
  };

  const handleProceedToPreferences = (totalStr, servicesList) => {
    setTotalAmount(totalStr);
    if (servicesList) setSelectedServices(servicesList);
    setCurrentScreen('preferences');
  };

  const handleProceedToPayment = (prefData) => {
    if (prefData?.momoNumber) {
      setMomoNumber(prefData.momoNumber);
    }
    if (prefData?.network) {
      setSelectedNetwork(prefData.network);
    }
    if (prefData?.estimatedTotal) {
      setTotalAmount(prefData.estimatedTotal);
    }
    if (prefData?.instructions) {
      setSpecialInstructions(prefData.instructions);
    }
    setCurrentScreen('payment');
  };

  const handleAuthorizePayment = () => {
    const newOrder = createOrder({
      customerName: 'Alex Morgan',
      phone: momoNumber,
      address: address,
      slot: scheduledTime,
      services: selectedServices,
      amount: totalAmount,
      paymentMethod: selectedNetwork === 'mtn' ? 'MTN Mobile Money' : selectedNetwork === 'telecel' ? 'Telecel Cash' : 'AT Money',
      specialNotes: specialInstructions,
      partnerName: selectedPartner.name
    });

    setActiveBookingRef(newOrder.id);
    showToast(`Order #${newOrder.id} confirmed & sent to ${selectedPartner.name}!`);
    setCurrentScreen('confirmation');
  };

  const isOwnerScreen = currentScreen.startsWith('owner');
  const isWideDashboard = isResponsiveMode || isOwnerScreen;

  return (
    <div className={`min-h-screen font-sans ${isOwnerScreen ? 'bg-[#FBFBF9]' : 'bg-[#f5f4ef] flex flex-col items-center justify-center p-2 sm:p-4'}`}>
      
      {/* Elegant, Human View Switcher Dock */}
      <aside aria-label="Portal Switcher" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-stone-900/90 text-stone-200 backdrop-blur-md px-2 py-1.5 rounded-full shadow-2xl border border-stone-700/80 flex items-center gap-1.5 text-xs font-medium">
        <button
          onClick={() => setCurrentScreen('providers')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
            !isOwnerScreen 
              ? 'bg-white text-stone-900 font-bold shadow-xs' 
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <span>🛍️ Customer Storefront</span>
        </button>
        <button
          onClick={() => setCurrentScreen('owner-dashboard')}
          className={`px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 ${
            isOwnerScreen 
              ? 'bg-[#0D6352] text-white font-bold shadow-xs' 
              : 'text-stone-400 hover:text-white'
          }`}
        >
          <span>🏪 Store Manager</span>
        </button>
        
        {!isOwnerScreen && (
          <button
            onClick={() => setIsResponsiveMode(!isResponsiveMode)}
            className="ml-1 pl-2 border-l border-stone-700 text-stone-400 hover:text-white text-[11px] pr-2 flex items-center gap-1"
            title="Toggle Mobile Bezel Preview"
          >
            {isResponsiveMode ? <Smartphone className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isResponsiveMode ? 'Phone' : 'Expand'}</span>
          </button>
        )}
      </aside>

      {/* Main Viewport Container */}
      <div
        className={`w-full overflow-hidden relative flex flex-col transition-all duration-300 ${
          isOwnerScreen
            ? 'min-h-screen bg-[#FBFBF9]'
            : isWideDashboard
            ? 'max-w-[1280px] min-h-[94vh] bg-white rounded-3xl shadow-xl border border-stone-200/80'
            : 'max-w-[420px] h-[844px] max-h-[94vh] rounded-[40px] shadow-2xl bg-white border-4 border-stone-800'
        }`}
      >
        {/* Status Bar (Simulated phone bar for mobile frame only) */}
        {!isWideDashboard && !isOwnerScreen && (
          <div className="h-9 px-6 flex items-center justify-between text-xs font-semibold text-stone-800 select-none z-10 bg-white">
            <span>9:41</span>
            <div className="flex items-center gap-1.5">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12.55a11 11 0 0 1 14 0"></path>
                <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
                <line x1="12" y1="20" x2="12.01" y2="20"></line>
              </svg>
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="16" height="10" rx="2" ry="2"></rect>
                <line x1="22" y1="11" x2="22" y2="13"></line>
              </svg>
            </div>
          </div>
        )}

        {/* PWA Install Banner Prompt */}
        <PwaInstallBanner />

        {/* Screen Switching Router */}
        {currentScreen === 'providers' && (
          <>
            {/* Scrollable Screen Content */}
            <main className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-2 pb-[175px] flex flex-col gap-4">
              <Header
                onSupportClick={() => showToast('Connecting to Customer Support...')}
                onProfileClick={() => showToast('User Profile Account')}
              />

              <PickupLocation
                address={address}
                onChangeAddress={handleChangeAddress}
              />

              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />

              <FilterPills
                categories={CATEGORIES}
                activeCategory={activeCategory}
                onSelectCategory={setActiveCategory}
              />

              <div className="flex items-center justify-between mt-1">
                <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Available Partners</h2>
                <span className="text-sm font-medium text-slate-500">{filteredPartners.length} open</span>
              </div>

              <PartnerList
                partners={filteredPartners}
                selectedPartnerId={selectedPartnerId}
                onSelectPartner={handleSelectPartner}
              />
            </main>

            {/* Dynamic Action Bar */}
            <FloatingActionBar
              selectedPartnerName={selectedPartner.name}
              onContinue={handleProceedToProviderDetail}
            />

            {/* Bottom Navigation */}
            <BottomNav
              activeTab={activeTab}
              onTabChange={(tab) => {
                setActiveTab(tab);
                if (tab === 'orders') showToast('Switched to Orders view');
                else if (tab === 'pricing') showToast('Switched to Pricing view');
                else showToast('Switched to Laundry Providers');
              }}
            />
          </>
        )}

        {currentScreen === 'provider-detail' && (
          <ProviderDetailScreen
            partner={selectedPartner}
            onBack={() => setCurrentScreen('providers')}
            onContinueToServices={handleProceedToServices}
            onSupportClick={() => showToast('Connecting to Customer Support...')}
            onProfileClick={() => showToast('User Profile Account')}
          />
        )}

        {currentScreen === 'services' && (
          <ServicesScreen
            partner={selectedPartner}
            scheduledTime={scheduledTime}
            onBack={() => setCurrentScreen('provider-detail')}
            onContinue={handleProceedToPreferences}
            onSupportClick={() => showToast('Connecting to Customer Support...')}
            onProfileClick={() => showToast('User Profile Account')}
          />
        )}

        {currentScreen === 'preferences' && (
          <PreferencesScreen
            partner={selectedPartner}
            scheduledTime={scheduledTime}
            estimatedTotal={totalAmount}
            selectedNetwork={selectedNetwork}
            onBack={() => setCurrentScreen('services')}
            onContinueToPayment={handleProceedToPayment}
            onSupportClick={() => showToast('Connecting to Customer Support...')}
            onProfileClick={() => showToast('User Profile Account')}
          />
        )}

        {currentScreen === 'payment' && (
          <PaymentCheckoutScreen
            partner={selectedPartner}
            scheduledTime={scheduledTime}
            totalAmount={totalAmount}
            momoNumber={momoNumber}
            selectedNetwork={selectedNetwork}
            onBack={() => setCurrentScreen('preferences')}
            onAuthorize={handleAuthorizePayment}
            onSupportClick={() => showToast('Connecting to Customer Support...')}
            onProfileClick={() => showToast('User Profile Account')}
          />
        )}

        {currentScreen === 'confirmation' && (
          <OrderConfirmationScreen
            partner={selectedPartner}
            scheduledTime={scheduledTime}
            totalAmount={totalAmount}
            bookingReference={activeBookingRef}
            onBackToHome={() => setCurrentScreen('providers')}
            onTrackStatus={() => setCurrentScreen('tracking')}
          />
        )}

        {currentScreen === 'tracking' && (
          <TrackLaundryScreen
            partner={selectedPartner}
            scheduledTime={scheduledTime}
            totalAmount={totalAmount}
            bookingReference={activeBookingRef}
            momoNumber={momoNumber}
            onBack={() => setCurrentScreen('confirmation')}
            onSupportClick={() => showToast('Connecting to Customer Support...')}
            onProfileClick={() => showToast('User Profile Account')}
          />
        )}

        {currentScreen === 'owner-login' && (
          <OwnerAuthScreen
            onLoginSuccess={() => {
              showToast('Welcome back, Store Owner!');
              setCurrentScreen('owner-dashboard');
            }}
            onBackToApp={() => setCurrentScreen('providers')}
          />
        )}

        {currentScreen === 'owner-dashboard' && (
          <OwnerDashboardScreen
            onBackToApp={() => setCurrentScreen('providers')}
            onOpenProfile={() => setCurrentScreen('owner-profile')}
            onLogout={() => {
              showToast('Logged out of Owner Hub');
              setCurrentScreen('owner-login');
            }}
          />
        )}

        {currentScreen === 'owner-profile' && (
          <OwnerProfileSetupScreen
            onBackToDashboard={() => setCurrentScreen('owner-dashboard')}
            onBackToApp={() => setCurrentScreen('providers')}
            onLogout={() => {
              showToast('Logged out of Owner Hub');
              setCurrentScreen('owner-login');
            }}
            onSupportClick={() => showToast('Connecting to Customer Support...')}
          />
        )}
      </div>

      {/* Schedule Picker Drawer Modal (can be invoked from quick actions) */}
      <ScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        partnerName={selectedPartner.name}
        onConfirm={(date, time) => {
          setIsModalOpen(false);
          handleProceedToServices(`${date} (${time})`);
        }}
      />

      {/* Toast Popup Notification */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full text-xs sm:text-sm font-bold shadow-2xl z-[100] flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-brand-teal" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
