import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import PickupLocation from './components/PickupLocation';
import SearchBar from './components/SearchBar';
import FilterPills from './components/FilterPills';
import PartnerList from './components/PartnerList';
import FloatingActionBar from './components/FloatingActionBar';
import BottomNav from './components/BottomNav';
import ScheduleModal from './components/ScheduleModal';
import PwaInstallBanner from './components/PwaInstallBanner';
import ProviderDetailScreen from './components/ProviderDetailScreen';
import ServicesScreen from './components/ServicesScreen';
import PreferencesScreen from './components/PreferencesScreen';
import PaymentCheckoutScreen from './components/PaymentCheckoutScreen';
import OrderConfirmationScreen from './components/OrderConfirmationScreen';
import TrackLaundryScreen from './components/TrackLaundryScreen';
import OwnerAuthScreen from './components/OwnerAuthScreen';
import OwnerLayout, { OwnerRoute } from './components/OwnerLayout';
import OwnerBookingsScheduleScreen from './components/OwnerBookingsScheduleScreen';
import OwnerWeeklyAvailabilityScreen from './components/OwnerWeeklyAvailabilityScreen';
import OwnerServicesPricingScreen from './components/OwnerServicesPricingScreen';
import OwnerShopProfileScreen from './components/OwnerShopProfileScreen';
import OwnerAnalyticsScreen from './components/OwnerAnalyticsScreen';
import OwnerSettingsScreen from './components/OwnerSettingsScreen';
import { getPartners, CATEGORIES } from './data/partners';
import { getShopProfile } from './data/shopStore';
import { createOrder, getLatestOrder } from './data/ordersStore';
import AppSidebar from './components/AppSidebar';
import { Smartphone, Maximize2, CheckCircle, Menu } from 'lucide-react';
import type { Partner, OrderItem, CheckoutDetails } from '@quickwash/shared';

export type ScreenType = 
  | 'providers' 
  | 'provider-detail' 
  | 'services' 
  | 'preferences' 
  | 'payment' 
  | 'confirmation' 
  | 'tracking' 
  | 'owner-login' 
  | 'owner-dashboard' 
  | 'owner-bookings'
  | 'owner-availability'
  | 'owner-services'
  | 'owner-profile'
  | 'owner-analytics'
  | 'owner-settings';

export const ROUTE_PATH_MAP: Record<ScreenType, string> = {
  'providers': '/',
  'provider-detail': '/provider-detail',
  'services': '/services',
  'preferences': '/preferences',
  'payment': '/payment',
  'confirmation': '/confirmation',
  'tracking': '/tracking',
  'owner-login': '/owner/login',
  'owner-dashboard': '/owner/bookings',
  'owner-bookings': '/owner/bookings',
  'owner-availability': '/owner/availability',
  'owner-services': '/owner/services',
  'owner-profile': '/owner/profile',
  'owner-analytics': '/owner/analytics',
  'owner-settings': '/owner/settings',
};

export function getScreenFromLocation(): ScreenType {
  if (typeof window === 'undefined') return 'providers';

  const params = new URLSearchParams(window.location.search);
  const screenParam = params.get('screen') as ScreenType | null;
  const pageParam = params.get('page') || params.get('tab');
  
  if (screenParam && screenParam in ROUTE_PATH_MAP) return screenParam;

  if (pageParam) {
    if (pageParam === 'weekly-availability' || pageParam === 'availability') return 'owner-availability';
    if (pageParam === 'bookings' || pageParam === 'schedule') return 'owner-bookings';
    if (pageParam === 'services') return 'owner-services';
    if (pageParam === 'profile') return 'owner-profile';
    if (pageParam === 'analytics') return 'owner-analytics';
    if (pageParam === 'settings') return 'owner-settings';
    if (pageParam in ROUTE_PATH_MAP) return pageParam as ScreenType;
  }

  if (window.location.hash) {
    const cleanHash = window.location.hash.replace('#', '').replace(/^\//, '');
    if (cleanHash === 'owner/availability' || cleanHash === 'owner-availability') return 'owner-availability';
    if (cleanHash === 'owner/bookings' || cleanHash === 'owner-bookings') return 'owner-bookings';
    if (cleanHash === 'owner/services' || cleanHash === 'owner-services') return 'owner-services';
    if (cleanHash === 'owner/profile' || cleanHash === 'owner-profile') return 'owner-profile';
    if (cleanHash === 'owner/analytics' || cleanHash === 'owner-analytics') return 'owner-analytics';
    if (cleanHash === 'owner/settings' || cleanHash === 'owner-settings') return 'owner-settings';
    if (cleanHash === 'tracking') return 'tracking';
    if (cleanHash === 'services') return 'services';
    if (cleanHash === 'providers' || cleanHash === '') return 'providers';
  }

  const cleanPath = window.location.pathname.toLowerCase().replace(/\/$/, '');
  if (cleanPath === '/owner/availability' || cleanPath === '/availability') return 'owner-availability';
  if (cleanPath === '/owner/bookings' || cleanPath === '/owner/schedule' || cleanPath === '/bookings') return 'owner-bookings';
  if (cleanPath === '/owner/services') return 'owner-services';
  if (cleanPath === '/owner/profile') return 'owner-profile';
  if (cleanPath === '/owner/analytics') return 'owner-analytics';
  if (cleanPath === '/owner/settings') return 'owner-settings';
  if (cleanPath === '/owner/login' || cleanPath === '/login') return 'owner-login';
  if (cleanPath === '/owner') return 'owner-bookings';
  if (cleanPath === '/services') return 'services';
  if (cleanPath === '/tracking' || cleanPath === '/orders') return 'tracking';
  if (cleanPath === '/provider-detail') return 'provider-detail';
  if (cleanPath === '/preferences') return 'preferences';
  if (cleanPath === '/payment') return 'payment';
  if (cleanPath === '/confirmation') return 'confirmation';
  if (cleanPath === '' || cleanPath === '/providers') return 'providers';

  return 'providers';
}

export default function App() {
  // Navigation & Screen state
  const [currentScreen, setCurrentScreen] = useState<ScreenType>(() => getScreenFromLocation());

  const [selectedPartnerId, setSelectedPartnerId] = useState<string>('sparkle');
  const [scheduledTime, setScheduledTime] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<string>('0.00');
  const [selectedServices, setSelectedServices] = useState<OrderItem[]>([]);
  const [selectedNetwork, setSelectedNetwork] = useState<string>('mtn');
  const [customerName, setCustomerName] = useState<string>('');
  const [momoNumber, setMomoNumber] = useState<string>('');
  const [activeBookingRef, setActiveBookingRef] = useState<string>(() => getLatestOrder()?.id || '');
  const [specialInstructions, setSpecialInstructions] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [address, setAddress] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('laundry');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isResponsiveMode, setIsResponsiveMode] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const navigateTo = (screen: ScreenType, replace = false) => {
    setCurrentScreen(screen);
    if (typeof window !== 'undefined') {
      const targetPath = ROUTE_PATH_MAP[screen] || '/';
      if (replace) {
        window.history.replaceState({ screen }, '', targetPath);
      } else if (window.location.pathname !== targetPath) {
        window.history.pushState({ screen }, '', targetPath);
      }
    }
  };

  React.useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.screen) {
        setCurrentScreen(e.state.screen);
      } else {
        const detected = getScreenFromLocation();
        setCurrentScreen(detected);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Filter partners based on search query & active category pill
  const filteredPartners = useMemo<Partner[]>(() => {
    const partners = getPartners();
    return partners.filter((partner) => {
      const matchesSearch =
        partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        partner.neighborhood.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        activeCategory === 'All' || partner.neighborhood === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory]);

  const selectedPartner = useMemo<Partner>(() => {
    const partners = getPartners();
    return partners.find((p) => p.id === selectedPartnerId) || partners[0];
  }, [selectedPartnerId]);

  const handleSelectPartner = (partner: Partner) => {
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
    navigateTo('provider-detail');
  };

  const handleProceedToServices = (selectedTimeStr: string) => {
    setScheduledTime(selectedTimeStr);
    showToast(`Reservation set for ${selectedTimeStr}!`);
    navigateTo('services');
  };

  const handleProceedToPreferences = (totalStr: string, servicesList?: OrderItem[]) => {
    setTotalAmount(totalStr);
    if (servicesList) setSelectedServices(servicesList);
    navigateTo('preferences');
  };

  const handleProceedToPayment = (prefData: CheckoutDetails) => {
    if (prefData?.fullName) {
      setCustomerName(prefData.fullName);
    }
    if (prefData?.address) {
      setAddress(prefData.address);
    }
    if (prefData?.momoNumber) {
      setMomoNumber(prefData.momoNumber);
    }
    if ((prefData as any)?.network) {
      setSelectedNetwork((prefData as any).network);
    }
    if (prefData?.estimatedTotal) {
      setTotalAmount(prefData.estimatedTotal);
    }
    if ((prefData as any)?.instructions || prefData?.notes) {
      setSpecialInstructions((prefData as any).instructions || prefData.notes || '');
    }
    navigateTo('payment');
  };

  const handleAuthorizePayment = () => {
    const newOrder = createOrder({
      customerName: customerName.trim() || 'Customer',
      phone: momoNumber,
      address: address,
      slot: scheduledTime || 'Standard Pickup',
      services: selectedServices,
      amount: totalAmount,
      paymentMethod: selectedNetwork === 'mtn' ? 'MTN Mobile Money' : selectedNetwork === 'telecel' ? 'Telecel Cash' : 'AT Money',
      specialNotes: specialInstructions,
      partnerName: selectedPartner?.name || 'Sparkle Express Laundry'
    });

    setActiveBookingRef(newOrder.id);
    showToast(`Order #${newOrder.id} confirmed!`);
    navigateTo('confirmation');
  };

  const isOwnerScreen = currentScreen.startsWith('owner');
  const isWideDashboard = isResponsiveMode || isOwnerScreen;

  return (
    <div className={`min-h-screen font-sans ${isOwnerScreen ? 'bg-[#FBFBF9]' : 'bg-[#f5f4ef] flex flex-col items-center justify-center p-2 sm:p-4'}`}>
      
      {/* Sliding Sidebar Navigation */}
      <AppSidebar
        isOpen={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
        currentScreen={currentScreen}
        onNavigate={(screen) => navigateTo(screen)}
        isResponsiveMode={isResponsiveMode}
        onToggleResponsiveMode={() => setIsResponsiveMode(!isResponsiveMode)}
        onSupportClick={() => showToast('Connecting to Customer Support...')}
        onLogout={() => {
          showToast('Logged out of QuickWash');
          navigateTo('owner-login');
        }}
      />

      {/* Floating Sliding Sidebar Toggle Tab (Accessible on storefront views) */}
      {!isOwnerScreen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          className="fixed bottom-5 left-5 z-40 bg-slate-900/90 text-white hover:bg-slate-800 shadow-xl border border-slate-700/80 rounded-full px-3.5 py-2.5 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all cursor-pointer backdrop-blur-md text-xs font-bold"
          title="Open Navigation Menu"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-4 h-4 text-teal-400" />
          <span className="hidden sm:inline">Menu</span>
        </button>
      )}

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
                onMenuClick={() => setIsSidebarOpen(true)}
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
                if (tab === 'orders') {
                  showToast('Switched to Orders tracking');
                  navigateTo('tracking');
                } else if (tab === 'pricing') {
                  showToast('Switched to Services catalog');
                  navigateTo('services');
                } else {
                  showToast('Switched to Laundry Providers');
                  navigateTo('providers');
                }
              }}
            />
          </>
        )}

        {currentScreen === 'provider-detail' && (
          <ProviderDetailScreen
            partner={selectedPartner}
            onBack={() => navigateTo('providers')}
            onContinueToServices={handleProceedToServices}
            onSupportClick={() => showToast('Connecting to Customer Support...')}
            onProfileClick={() => showToast('User Profile Account')}
          />
        )}

        {currentScreen === 'services' && (
          <ServicesScreen
            partner={selectedPartner}
            scheduledTime={scheduledTime}
            onBack={() => navigateTo('provider-detail')}
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
            initialFullName={customerName}
            initialPhone={momoNumber}
            initialAddress={address}
            initialNotes={specialInstructions}
            onBack={() => navigateTo('services')}
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
            onBack={() => navigateTo('preferences')}
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
            onBackToHome={() => navigateTo('providers')}
            onTrackStatus={() => navigateTo('tracking')}
          />
        )}

        {currentScreen === 'tracking' && (
          <TrackLaundryScreen
            partner={selectedPartner}
            scheduledTime={scheduledTime}
            totalAmount={totalAmount}
            bookingReference={activeBookingRef}
            momoNumber={momoNumber}
            onBack={() => navigateTo('confirmation')}
            onSupportClick={() => showToast('Connecting to Customer Support...')}
            onProfileClick={() => showToast('User Profile Account')}
          />
        )}

        {currentScreen === 'owner-login' && (
          <OwnerAuthScreen
            onLoginSuccess={() => {
              showToast('Welcome back, Store Owner!');
              navigateTo('owner-bookings');
            }}
            onBackToApp={() => navigateTo('providers')}
          />
        )}

        {/* Dedicated Store Manager Pages wrapped in unified OwnerLayout */}
        {(currentScreen === 'owner-bookings' || currentScreen === 'owner-dashboard') && (
          <OwnerLayout
            currentRoute="owner-bookings"
            onNavigate={(route) => navigateTo(route as ScreenType)}
            onLogout={() => {
              showToast('Logged out of Owner Hub');
              navigateTo('owner-login');
            }}
            onBackToApp={() => navigateTo('providers')}
            onShowToast={showToast}
          >
            <OwnerBookingsScheduleScreen onShowToast={showToast} />
          </OwnerLayout>
        )}

        {currentScreen === 'owner-availability' && (
          <OwnerLayout
            currentRoute="owner-availability"
            onNavigate={(route) => navigateTo(route as ScreenType)}
            onLogout={() => {
              showToast('Logged out of Owner Hub');
              navigateTo('owner-login');
            }}
            onBackToApp={() => navigateTo('providers')}
            onShowToast={showToast}
          >
            <OwnerWeeklyAvailabilityScreen
              onBackToDashboard={() => navigateTo('owner-bookings')}
              onShowToast={showToast}
            />
          </OwnerLayout>
        )}

        {currentScreen === 'owner-services' && (
          <OwnerLayout
            currentRoute="owner-services"
            onNavigate={(route) => navigateTo(route as ScreenType)}
            onLogout={() => {
              showToast('Logged out of Owner Hub');
              navigateTo('owner-login');
            }}
            onBackToApp={() => navigateTo('providers')}
            onShowToast={showToast}
          >
            <OwnerServicesPricingScreen
              onBackToDashboard={() => navigateTo('owner-bookings')}
              onShowToast={showToast}
            />
          </OwnerLayout>
        )}

        {currentScreen === 'owner-profile' && (
          <OwnerLayout
            currentRoute="owner-profile"
            onNavigate={(route) => navigateTo(route as ScreenType)}
            onLogout={() => {
              showToast('Logged out of Owner Hub');
              navigateTo('owner-login');
            }}
            onBackToApp={() => navigateTo('providers')}
            onShowToast={showToast}
          >
            <OwnerShopProfileScreen
              onBackToDashboard={() => navigateTo('owner-bookings')}
              onBackToApp={() => navigateTo('providers')}
              onShowToast={showToast}
            />
          </OwnerLayout>
        )}

        {currentScreen === 'owner-analytics' && (
          <OwnerLayout
            currentRoute="owner-analytics"
            onNavigate={(route) => navigateTo(route as ScreenType)}
            onLogout={() => {
              showToast('Logged out of Owner Hub');
              navigateTo('owner-login');
            }}
            onBackToApp={() => navigateTo('providers')}
            onShowToast={showToast}
          >
            <OwnerAnalyticsScreen onShowToast={showToast} />
          </OwnerLayout>
        )}

        {currentScreen === 'owner-settings' && (
          <OwnerLayout
            currentRoute="owner-settings"
            onNavigate={(route) => navigateTo(route as ScreenType)}
            onLogout={() => {
              showToast('Logged out of Owner Hub');
              navigateTo('owner-login');
            }}
            onBackToApp={() => navigateTo('providers')}
            onShowToast={showToast}
          >
            <OwnerSettingsScreen onShowToast={showToast} />
          </OwnerLayout>
        )}
      </div>

      {/* Schedule Picker Drawer Modal */}
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
          <CheckCircle className="w-4 h-4 text-teal-400" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
