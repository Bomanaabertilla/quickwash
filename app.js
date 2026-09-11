// QuickWash App Logic

document.addEventListener('DOMContentLoaded', () => {
  // DOM References
  const partnerCards = document.querySelectorAll('.partner-card');
  const selectedPartnerText = document.getElementById('selected-partner-name');
  const searchInput = document.getElementById('search-input');
  const filterPills = document.querySelectorAll('.filter-pill');
  const openCountText = document.getElementById('open-count-text');
  const continueBtn = document.getElementById('continue-schedule-btn');
  
  const scheduleModal = document.getElementById('schedule-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const confirmBookingBtn = document.getElementById('confirm-booking-btn');
  const modalPartnerName = document.getElementById('modal-partner-name');
  
  const toastNotification = document.getElementById('toast-notification');
  const toastText = document.getElementById('toast-text');
  
  const toggleFrameBtn = document.getElementById('toggle-frame-btn');
  const viewportFrame = document.getElementById('viewport-frame');
  const frameBtnText = document.getElementById('frame-btn-text');
  
  const navTabs = document.querySelectorAll('.nav-tab');
  const locationCard = document.getElementById('location-card');
  const currentAddress = document.getElementById('current-address');

  let currentSelectedPartner = 'Sparkle Express Laundry';
  let activeCategory = 'All';

  // Helper Toast Notification
  function showToast(message) {
    toastText.textContent = message;
    toastNotification.classList.add('active');
    setTimeout(() => {
      toastNotification.classList.remove('active');
    }, 2800);
  }

  // 1. Partner Selection
  partnerCards.forEach(card => {
    card.addEventListener('click', () => {
      partnerCards.forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      
      const partnerName = card.getAttribute('data-name');
      currentSelectedPartner = partnerName;
      selectedPartnerText.textContent = partnerName;
      
      showToast(`Selected: ${partnerName}`);
    });
  });

  // 2. Search Filter Logic
  function filterPartners() {
    const query = searchInput.value.toLowerCase().trim();
    let visibleCount = 0;

    partnerCards.forEach(card => {
      const name = card.getAttribute('data-name').toLowerCase();
      const neighborhood = card.getAttribute('data-neighborhood').toLowerCase();
      
      const matchesSearch = name.includes(query) || neighborhood.includes(query);
      const matchesCategory = activeCategory === 'All' || card.getAttribute('data-neighborhood') === activeCategory;

      if (matchesSearch && matchesCategory) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    openCountText.textContent = `${visibleCount} open`;
  }

  searchInput.addEventListener('input', filterPartners);

  // 3. Category Filter Pills
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      activeCategory = pill.getAttribute('data-category');
      filterPartners();
    });
  });

  // 4. Scheduling Modal Drawer
  continueBtn.addEventListener('click', () => {
    modalPartnerName.textContent = currentSelectedPartner;
    scheduleModal.classList.add('active');
  });

  closeModalBtn.addEventListener('click', () => {
    scheduleModal.classList.remove('active');
  });

  scheduleModal.addEventListener('click', (e) => {
    if (e.target === scheduleModal) {
      scheduleModal.classList.remove('active');
    }
  });

  // Date Pills inside Modal
  const datePills = document.querySelectorAll('.date-pill');
  datePills.forEach(pill => {
    pill.addEventListener('click', () => {
      datePills.forEach(p => p.classList.remove('selected'));
      pill.classList.add('selected');
    });
  });

  // Time Slots inside Modal
  const timeSlots = document.querySelectorAll('.time-slot');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('selected'));
      slot.classList.add('selected');
    });
  });

  confirmBookingBtn.addEventListener('click', () => {
    scheduleModal.classList.remove('active');
    showToast(`Pickup scheduled with ${currentSelectedPartner}!`);
  });

  // 5. Change Location Action
  locationCard.addEventListener('click', () => {
    const newAddress = prompt("Enter new pickup address:", currentAddress.textContent);
    if (newAddress && newAddress.trim() !== "") {
      currentAddress.textContent = newAddress.trim();
      showToast("Pickup location updated!");
    }
  });

  // 6. Viewport Toggle (Desktop / Mobile view frame)
  toggleFrameBtn.addEventListener('click', () => {
    viewportFrame.classList.toggle('responsive-mode');
    const isResponsive = viewportFrame.classList.contains('responsive-mode');
    frameBtnText.textContent = isResponsive ? "Mobile View" : "Expand View";
  });

  // 7. Navigation Tabs Switcher
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      navTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      const tabName = tab.getAttribute('data-tab');
      if (tabName === 'orders') {
        showToast("Switched to Orders view");
      } else if (tabName === 'pricing') {
        showToast("Switched to Pricing view");
      } else {
        showToast("Switched to Laundry Providers");
      }
    });
  });
});
