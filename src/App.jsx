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
import { Smartphone, Maximize2, CheckCircle, Store } from 'lucide-react';

export default function App() {
  // Navigation & Screen state: 'providers' | 'provider-detail' | 'services' | 'preferences' | 'payment' | 'confirmation' | 'tracking' | 'owner-login' | 'owner-dashboard' | 'owner-profile'
  const [currentScreen, setCurrentScreen] = useState('providers');

  const [selectedPartnerId, setSelectedPartnerId] = useState('sparkle');
  const [scheduledTime, setScheduledTime] = useState('Tue, May 13 (1:30 PM)');
  const [totalAmount, setTotalAmount] = useState('390.00');
  const [selectedNetwork, setSelectedNetwork] = useState('mtn');
  const [momoNumber, setMomoNumber] = useState('+233 24 123 4567');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [address, setAddress] = useState('742 Evergreen Terrace');
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
    return PARTNERS_DATA.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || partner.neighborhood === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const selectedPartner = useMemo(() => {
    return PARTNERS_DATA.find((p) => p.id === selectedPartnerId) || PARTNERS_DATA[0];
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

  const handleProceedToPreferences = (totalStr) => {
    setTotalAmount(totalStr);
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
    setCurrentScreen('payment');
  };

  const handleAuthorizePayment = () => {
    showToast('Payment authorized! Confirming order...');
    setCurrentScreen('confirmation');
  };

  return (
    <div className="min-h-screen bg-[#0b1320] flex flex-col items-center justify-center p-2 sm:p-4 relative font-sans">
      
      {/* Owner Hub Access Button */}
      <button
        onClick={() => setCurrentScreen(currentScreen === 'owner-dashboard' || currentScreen === 'owner-login' ? 'providers' : 'owner-login')}
        className="fixed top-4 left-4 bg-[#006a60] text-white px-4 py-2 rounded-full text-xs font-extrabold shadow-lg hover:bg-[#005850] transition-all flex items-center gap-2 z-50 border border-teal-400/30"
      >
        <Store className="w-4 h-4 text-amber-300" />
        <span>{currentScreen.startsWith('owner') ? 'Customer App' : 'Owner Hub'}</span>
      </button>

      {/* Viewport Frame Mode Switcher */}
      <button
        onClick={() => setIsResponsiveMode(!isResponsiveMode)}
        className="fixed top-4 right-4 bg-white/90 backdrop-blur-md border border-white/20 text-slate-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg hover:bg-white transition-all flex items-center gap-2 z-50"
      >
        {isResponsiveMode ? (
          <>
            <Smartphone className="w-4 h-4 text-brand-teal" />
            <span>Mobile Frame</span>
          </>
        ) : (
          <>
            <Maximize2 className="w-4 h-4 text-brand-teal" />
            <span>Full Responsive</span>
          </>
        )}
      </button>

      {/* Main Viewport Container */}
      <div
        className={`w-full bg-[#f7f9fc] overflow-hidden relative flex flex-col transition-all duration-300 ${
          isResponsiveMode
            ? 'max-w-4xl min-h-[92vh] rounded-3xl shadow-2xl'
            : 'max-w-[420px] h-[844px] max-h-[94vh] rounded-[40px] shadow-device'
        }`}
      >
        {/* Status Bar (Simulated phone bar for mobile frame) */}
        {!isResponsiveMode && (
          <div className="h-9 px-6 flex items-center justify-between text-xs font-semibold text-slate-900 select-none z-10 bg-[#f7f9fc]">
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
            onBackToHome={() => setCurrentScreen('providers')}
            onTrackStatus={() => setCurrentScreen('tracking')}
          />
        )}

        {currentScreen === 'tracking' && (
          <TrackLaundryScreen
            partner={selectedPartner}
            scheduledTime={scheduledTime}
            totalAmount={totalAmount}
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
