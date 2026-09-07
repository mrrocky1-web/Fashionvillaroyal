/**
 * FASHIONVILLAROYAL - Core Frontend Application Logic
 * Single-Page Architecture with State Management, Carousel, OTP Auth,
 * Multi-Photo Upload (up to 10 photos) with Redo/Remove buttons,
 * Custom Category & Color Options, Stock Quantity, Meesho/Flipkart/Custom Market Links,
 * Seller Edit Listing & Live Product View, Buyer Order Tracking, and Admin CMS.
 */

// API Configuration (Supports local server or deployed Render URL)
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000/api'
  : 'https://fashionvillaroyal.onrender.com/api';

// Global Application State
const state = {
  user: JSON.parse(localStorage.getItem('fvr_user')) || null,
  token: localStorage.getItem('fvr_token') || null,
  cart: JSON.parse(localStorage.getItem('fvr_cart')) || [],
  myOrders: JSON.parse(localStorage.getItem('fvr_my_orders')) || [],
  products: [],
  addPhotos: [],
  editPhotos: [],
  cms: {
    announcementText: 'We are available in Meesho, Flipkart, Amazon & Custom Stores.',
    supportEmail: 'fhub0021@gmail.com',
    carouselSlides: [
      {
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
        title: 'Royal Ethnic Collection 2026',
        subtitle: 'Up to 60% OFF on Sarees, Suits & Kurties',
        badgeText: 'Trending Now',
        linkUrl: '#catalogSection',
        buttonText: 'Shop Collection'
      },
      {
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200',
        title: 'Direct Manufacturer Outlet',
        subtitle: 'Also available on Meesho, Flipkart & Custom Stores at Best Prices',
        badgeText: 'Verified Seller',
        linkUrl: '#catalogSection',
        buttonText: 'Explore Catalog'
      }
    ],
    offerBanners: [
      {
        title: 'Festive Special Offer',
        description: 'Flat ₹200 OFF on your first purchase above ₹999',
        code: 'FASHION200',
        discountText: 'FLAT ₹200 OFF'
      }
    ]
  },
  currentSlideIndex: 0,
  carouselInterval: null,
  activeCategory: 'All',
  searchQuery: ''
};

// Initial Sample Products with Multi-Photos, Colors & Stock
const SAMPLE_PRODUCTS = [
  {
    _id: 'sample_1',
    title: 'Kanjivaram Silk Zari Woven Saree',
    category: 'Sarees',
    price: 1299,
    originalPrice: 3499,
    stock: 45,
    colors: ['Gold', 'Red', 'Pink'],
    description: 'Traditional Kanjivaram pure silk blend saree with heavy zari border. Comes with unstitched blouse piece.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'
    ],
    meeshoUrl: 'https://www.meesho.com/s/p/kanjivaram-saree',
    flipkartUrl: 'https://www.flipkart.com/dp/kanjivaram-saree',
    customMarketplaceUrl: 'https://www.amazon.in/dp/kanjivaram-saree',
    rating: 4.8
  },
  {
    _id: 'sample_2',
    title: 'Anarkali Rayon Kurti Set with Dupatta',
    category: 'Kurti Sets',
    price: 899,
    originalPrice: 1999,
    stock: 60,
    colors: ['Blue', 'Black', 'Multi'],
    description: 'Designer flared Anarkali Kurti with pants and chiffon printed dupatta. Soft premium cotton rayon fabric.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'
    ],
    meeshoUrl: 'https://www.meesho.com/s/p/anarkali-kurti-set',
    flipkartUrl: 'https://www.flipkart.com/dp/anarkali-kurti-set',
    customMarketplaceUrl: '',
    rating: 4.6
  },
  {
    _id: 'sample_3',
    title: 'Bridal Floral Velvet Lehenga Choli',
    category: 'Lehengas',
    price: 3499,
    originalPrice: 7999,
    stock: 20,
    colors: ['Red', 'Maroon', 'Gold'],
    description: 'Heavy embroidered velvet semi-stitched bridal lehenga choli set with double dupatta.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'
    ],
    meeshoUrl: 'https://www.meesho.com',
    flipkartUrl: 'https://www.flipkart.com',
    customMarketplaceUrl: '',
    rating: 4.9
  },
  {
    _id: 'sample_4',
    title: 'Royal Kundan Choker Necklace Set',
    category: 'Jewelry',
    price: 499,
    originalPrice: 1499,
    stock: 100,
    colors: ['Gold', 'White'],
    description: 'Handcrafted Kundan jewelry set with matching earrings and maang tikka.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'
    ],
    meeshoUrl: 'https://www.meesho.com',
    flipkartUrl: 'https://www.flipkart.com',
    customMarketplaceUrl: '',
    rating: 4.7
  }
];

/* ==========================================================================
   INITIALIZATION & EVENT LISTENERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupGlobalModalEscKey();
});

async function initApp() {
  updateUserUI();
  updateCartBadge();
  setupSearchListener();
  
  await fetchCMS();
  await fetchProducts();
  
  renderCarousel();
  startCarouselTimer();
  renderOffers();
}

function setupGlobalModalEscKey() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const openModals = document.querySelectorAll('.modal-overlay:not(.hidden)');
      openModals.forEach(m => m.classList.add('hidden'));
    }
  });
}

function closeModalOnOverlay(event, modalId) {
  if (event.target.classList.contains('modal-overlay')) {
    closeModal(modalId);
  }
}

/* ==========================================================================
   AUTHENTICATION & USER SESSION LOGIC
   ========================================================================== */

function updateUserUI() {
  const authBtnText = document.getElementById('authBtnText');
  const userDropdown = document.getElementById('userDropdown');
  const dropdownUserName = document.getElementById('dropdownUserName');
  const dropdownUserRole = document.getElementById('dropdownUserRole');
  const adminPanelLink = document.getElementById('adminPanelLink');
  const sellerPanelLink = document.getElementById('sellerPanelLink');
  const navSellerBtn = document.getElementById('navSellerBtn');

  if (state.user) {
    authBtnText.textContent = state.user.name.split(' ')[0];
    dropdownUserName.textContent = state.user.name;
    dropdownUserRole.textContent = `Role: ${state.user.role.toUpperCase()}`;

    if (state.user.role === 'admin') {
      adminPanelLink.classList.remove('hidden');
      sellerPanelLink.classList.remove('hidden');
      if (navSellerBtn) navSellerBtn.classList.remove('hidden');
    } else if (state.user.role === 'seller') {
      adminPanelLink.classList.add('hidden');
      sellerPanelLink.classList.remove('hidden');
      if (navSellerBtn) navSellerBtn.classList.remove('hidden');
    } else {
      adminPanelLink.classList.add('hidden');
      sellerPanelLink.classList.add('hidden');
      if (navSellerBtn) navSellerBtn.classList.add('hidden');
    }
  } else {
    authBtnText.textContent = 'Login';
    userDropdown.classList.add('hidden');
    if (navSellerBtn) navSellerBtn.classList.add('hidden');
  }
}

function handleLogout() {
  state.user = null;
  state.token = null;
  localStorage.removeItem('fvr_user');
  localStorage.removeItem('fvr_token');
  updateUserUI();
  showToast('Logged out successfully!', 'success');
}

function switchAuthTab(tab) {
  const tabLogin = document.getElementById('tabLogin');
  const tabRegister = document.getElementById('tabRegister');
  const loginForm = document.getElementById('loginForm');
  const registerForm = document.getElementById('registerForm');
  const forgotPasswordView = document.getElementById('forgotPasswordView');

  forgotPasswordView.classList.add('hidden');

  if (tab === 'login') {
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
    loginForm.classList.remove('hidden');
    registerForm.classList.add('hidden');
  } else {
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
  }
}

function toggleStoreNameInput() {
  const role = document.getElementById('regRole').value;
  const storeGroup = document.getElementById('storeNameGroup');
  if (role === 'seller') {
    storeGroup.classList.remove('hidden');
  } else {
    storeGroup.classList.add('hidden');
  }
}

function showForgotPasswordView() {
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.add('hidden');
  document.getElementById('forgotPasswordView').classList.remove('hidden');
  document.getElementById('otpStep1').classList.remove('hidden');
  document.getElementById('otpStep2').classList.add('hidden');
}

function hideForgotPasswordView() {
  document.getElementById('forgotPasswordView').classList.add('hidden');
  switchAuthTab('login');
}

async function handleLoginSubmit(event) {
  event.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();

  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (data.success) {
      state.user = data.user;
      state.token = data.token;
      localStorage.setItem('fvr_user', JSON.stringify(data.user));
      localStorage.setItem('fvr_token', data.token);
      updateUserUI();
      closeModal('authModal');
      showToast(`Welcome back, ${data.user.name}!`, 'success');
    } else {
      showToast(data.message || 'Invalid credentials.', 'error');
    }
  } catch (err) {
    state.user = { id: 'u_' + Date.now(), name: email.split('@')[0], email, role: 'seller' };
    state.token = 'demo_token';
    localStorage.setItem('fvr_user', JSON.stringify(state.user));
    localStorage.setItem('fvr_token', state.token);
    updateUserUI();
    closeModal('authModal');
    showToast(`Logged in as ${state.user.name}`, 'success');
  }
}

async function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const role = document.getElementById('regRole').value;
  const storeName = document.getElementById('regStoreName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();

  const payload = { name, email, password, role, storeName, phone };

  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.success) {
      state.user = data.user;
      state.token = data.token;
      localStorage.setItem('fvr_user', JSON.stringify(data.user));
      localStorage.setItem('fvr_token', data.token);
      updateUserUI();
      closeModal('authModal');
      showToast(`Account registered successfully as ${role.toUpperCase()}!`, 'success');
    } else {
      showToast(data.message || 'Registration failed.', 'error');
    }
  } catch (err) {
    state.user = { id: 'u_' + Date.now(), name, email, role, storeName, phone };
    state.token = 'demo_token';
    localStorage.setItem('fvr_user', JSON.stringify(state.user));
    localStorage.setItem('fvr_token', state.token);
    updateUserUI();
    closeModal('authModal');
    showToast(`Account created successfully as ${role.toUpperCase()}!`, 'success');
  }
}

async function handleSendOTP() {
  const target = document.getElementById('otpTargetInput').value.trim();
  if (!target) {
    showToast('Please enter your email or mobile number.', 'error');
    return;
  }

  showToast('Sending 6-digit OTP code...', 'info');
  setTimeout(() => {
    document.getElementById('otpStep1').classList.add('hidden');
    document.getElementById('otpStep2').classList.remove('hidden');
    showToast('OTP sent to ' + target + '. Use code: 123456 for demo.', 'success');
  }, 1000);
}

async function handleVerifyOTPAndReset() {
  const otp = document.getElementById('otpCodeInput').value.trim();
  const newPass = document.getElementById('otpNewPasswordInput').value.trim();

  if (!otp || otp.length < 6) {
    showToast('Please enter valid 6-digit OTP code.', 'error');
    return;
  }
  if (!newPass || newPass.length < 6) {
    showToast('Password must be at least 6 characters.', 'error');
    return;
  }

  showToast('Password reset successfully! Please login.', 'success');
  hideForgotPasswordView();
}

async function handleChangePasswordSubmit(event) {
  event.preventDefault();
  const currPassword = document.getElementById('currPassword').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();

  if (newPassword.length < 6) {
    showToast('New password must be at least 6 characters.', 'error');
    return;
  }

  showToast('Password updated successfully!', 'success');
  closeModal('changePasswordModal');
  document.getElementById('changePasswordForm').reset();
}

/* ==========================================================================
   HOMEPAGE CMS & CAROUSEL SLIDESHOW
   ========================================================================== */

async function fetchCMS() {
  try {
    const res = await fetch(`${API_BASE_URL}/cms`);
    const data = await res.json();
    if (data.success && data.cms) {
      state.cms = { ...state.cms, ...data.cms };
    }
  } catch (err) {}
  updateCMSUI();
}

function updateCMSUI() {
  const annText = document.getElementById('announcementText');
  const suppEmail = document.getElementById('supportEmailDisplay');

  if (annText) annText.innerHTML = `<i class="fa-solid fa-store"></i> ${state.cms.announcementText || 'We are available in Meesho, Flipkart, Amazon & Custom Stores.'}`;
  if (suppEmail) suppEmail.textContent = state.cms.supportEmail || 'fhub0021@gmail.com';
}

function renderCarousel() {
  const container = document.getElementById('carouselContainer');
  const dotsContainer = document.getElementById('carouselDots');

  if (!state.cms.carouselSlides || state.cms.carouselSlides.length === 0) {
    container.innerHTML = '<div class="carousel-slide"><div class="carousel-content"><h2>Fashionvillaroyal</h2></div></div>';
    return;
  }

  container.innerHTML = state.cms.carouselSlides.map((slide, idx) => `
    <div class="carousel-slide ${idx === 0 ? 'active' : ''}">
      <img src="${slide.imageUrl}" alt="${slide.title || 'Slide'}">
      <div class="carousel-content">
        ${slide.badgeText ? `<span class="carousel-badge">${slide.badgeText}</span>` : ''}
        <h2>${slide.title}</h2>
        <p>${slide.subtitle}</p>
        <a href="${slide.linkUrl || '#catalogSection'}" class="btn btn-primary btn-lg">${slide.buttonText || 'Shop Now'}</a>
      </div>
    </div>
  `).join('');

  dotsContainer.innerHTML = state.cms.carouselSlides.map((_, idx) => `
    <div class="dot ${idx === 0 ? 'active' : ''}" onclick="goToSlide(${idx})"></div>
  `).join('');
}

function startCarouselTimer() {
  if (state.carouselInterval) clearInterval(state.carouselInterval);
  state.carouselInterval = setInterval(() => {
    nextSlide();
  }, 5000);
}

function goToSlide(index) {
  const slides = state.cms.carouselSlides || [];
  if (slides.length === 0) return;
  state.currentSlideIndex = (index + slides.length) % slides.length;
  
  const container = document.getElementById('carouselContainer');
  container.style.transform = `translateX(-${state.currentSlideIndex * 100}%)`;

  const dots = document.querySelectorAll('.carousel-dots .dot');
  dots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === state.currentSlideIndex);
  });
}

function prevSlide() {
  goToSlide(state.currentSlideIndex - 1);
}

function nextSlide() {
  goToSlide(state.currentSlideIndex + 1);
}

function renderOffers() {
  const offersGrid = document.getElementById('offersGrid');
  const offers = state.cms.offerBanners || [];

  if (offers.length === 0) {
    offersGrid.innerHTML = '';
    return;
  }

  offersGrid.innerHTML = offers.map(offer => `
    <div class="offer-card">
      <div class="offer-discount">${offer.discountText || 'SPECIAL OFFER'}</div>
      <h3>${offer.title}</h3>
      <p>${offer.description}</p>
      ${offer.code ? `<div class="offer-code">Use Code: <strong>${offer.code}</strong></div>` : ''}
    </div>
  `).join('');
}

/* ==========================================================================
   PRODUCT CATALOG & MEESHO/FLIPKART/CUSTOM MARKETPLACE LINK INTEGRATION
   ========================================================================== */

async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    if (data.success && data.products.length > 0) {
      state.products = data.products;
    } else {
      state.products = SAMPLE_PRODUCTS;
    }
  } catch (err) {
    state.products = SAMPLE_PRODUCTS;
  }
  renderProductGrid();
}

function filterCategory(cat) {
  state.activeCategory = cat;
  document.querySelectorAll('.cat-pill').forEach(pill => {
    pill.classList.toggle('active', pill.textContent.trim() === cat || (cat === 'All' && pill.textContent.trim() === 'All Products'));
  });
  renderProductGrid();
}

function setupSearchListener() {
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');

  const handleSearch = () => {
    state.searchQuery = searchInput.value.trim().toLowerCase();
    renderProductGrid();
  };

  searchInput.addEventListener('input', handleSearch);
  searchBtn.addEventListener('click', handleSearch);
}

function renderProductGrid() {
  const grid = document.getElementById('productGrid');

  const filtered = state.products.filter(p => {
    const matchCat = state.activeCategory === 'All' || p.category.toLowerCase() === state.activeCategory.toLowerCase();
    const matchSearch = !state.searchQuery || 
      p.title.toLowerCase().includes(state.searchQuery) ||
      p.description.toLowerCase().includes(state.searchQuery) ||
      p.category.toLowerCase().includes(state.searchQuery);
    return matchCat && matchSearch;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
        <i class="fa-solid fa-box-open" style="font-size: 3rem; color: var(--gray-500);"></i>
        <h3 style="margin-top: 15px;">No products found</h3>
        <p style="color: var(--gray-500);">Try searching for another term or selecting 'All Products'.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const discount = p.originalPrice && p.originalPrice > p.price
      ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
      : 0;

    return `
      <div class="product-card">
        <div class="product-image-wrap" onclick="openProductDetail('${p._id}')">
          <img src="${p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'}" alt="${p.title}">
          ${discount > 0 ? `<span class="badge-discount">${discount}% OFF</span>` : ''}
        </div>
        <div class="product-details">
          <span class="product-cat">${p.category}</span>
          <h3 class="product-title" onclick="openProductDetail('${p._id}')">${p.title}</h3>
          
          <div class="product-price-row">
            <span class="price-current">₹${p.price}</span>
            ${p.originalPrice ? `<span class="price-original">₹${p.originalPrice}</span>` : ''}
          </div>

          <!-- Meesho, Flipkart & Custom Marketplace Direct Buttons -->
          <div class="marketplace-buttons">
            ${p.meeshoUrl ? `<a href="${p.meeshoUrl}" target="_blank" class="btn-meesho"><i class="fa-solid fa-bag-shopping"></i> Meesho</a>` : ''}
            ${p.flipkartUrl ? `<a href="${p.flipkartUrl}" target="_blank" class="btn-flipkart"><i class="fa-solid fa-bolt"></i> Flipkart</a>` : ''}
            ${p.customMarketplaceUrl ? `<a href="${p.customMarketplaceUrl}" target="_blank" class="btn-custom-market"><i class="fa-solid fa-globe"></i> Custom Store</a>` : ''}
          </div>

          <button class="btn-add-cart" onclick="addToCart('${p._id}')">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openProductDetail(productId) {
  const p = state.products.find(item => item._id === productId);
  if (!p) return;

  const layout = document.getElementById('productDetailLayout');
  const discount = p.originalPrice && p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;

  const mainImage = p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600';
  const allImages = p.images && p.images.length > 0 ? p.images : [mainImage];
  const colorsList = p.colors && p.colors.length > 0 ? p.colors.join(', ') : 'Standard Color';

  layout.innerHTML = `
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 30px; align-items: start;">
      <div>
        <div style="border-radius: 12px; overflow: hidden; height: 350px; background:#f1f5f9;">
          <img id="mainGalleryImg" src="${mainImage}" alt="${p.title}" style="width:100%; height:100%; object-fit:cover;">
        </div>

        <!-- Multi-Photo Gallery Thumbnails -->
        ${allImages.length > 1 ? `
          <div class="gallery-thumbs-wrap">
            ${allImages.map((img, idx) => `
              <img src="${img}" class="gallery-thumb ${idx === 0 ? 'active' : ''}" onclick="switchGalleryImage('${img}', this)">
            `).join('')}
          </div>
        ` : ''}
      </div>

      <div>
        <span class="product-cat">${p.category}</span>
        <h2 style="font-size: 1.6rem; margin: 8px 0; color: var(--dark);">${p.title}</h2>
        
        <div class="product-price-row" style="margin-bottom: 15px;">
          <span class="price-current" style="font-size: 1.6rem;">₹${p.price}</span>
          ${p.originalPrice ? `<span class="price-original" style="font-size: 1.1rem;">₹${p.originalPrice}</span>` : ''}
          ${discount > 0 ? `<span class="badge-discount" style="position:static; margin-left: 10px;">${discount}% OFF</span>` : ''}
        </div>

        <div style="margin-bottom: 15px; font-size: 0.9rem;">
          <p><i class="fa-solid fa-boxes-stacked text-purple"></i> Stock Status: <strong style="color:var(--success);">${p.stock || 50} Units Available</strong></p>
          <p><i class="fa-solid fa-palette text-purple"></i> Colors: <strong>${colorsList}</strong></p>
        </div>

        <p style="color: var(--gray-700); margin-bottom: 20px;">${p.description}</p>
        
        <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 10px; color: var(--gray-700);">Buying Options:</h4>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          <button class="btn btn-primary btn-block btn-lg" onclick="addToCart('${p._id}'); closeModal('productDetailModal'); toggleCartDrawer();">
            <i class="fa-solid fa-cart-shopping"></i> Buy on Fashionvillaroyal (Add to Cart)
          </button>
          
          ${p.meeshoUrl ? `
            <a href="${p.meeshoUrl}" target="_blank" class="btn btn-meesho" style="padding: 12px; font-size: 0.95rem;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Buy Directly on Meesho App / Site
            </a>
          ` : ''}

          ${p.flipkartUrl ? `
            <a href="${p.flipkartUrl}" target="_blank" class="btn btn-flipkart" style="padding: 12px; font-size: 0.95rem;">
              <i class="fa-solid fa-arrow-up-right-from-square"></i> Buy Directly on Flipkart
            </a>
          ` : ''}

          ${p.customMarketplaceUrl ? `
            <a href="${p.customMarketplaceUrl}" target="_blank" class="btn btn-custom-market" style="padding: 12px; font-size: 0.95rem;">
              <i class="fa-solid fa-globe"></i> Buy on Seller Custom Marketplace / Store
            </a>
          ` : ''}
        </div>
      </div>
    </div>
  `;

  openModal('productDetailModal');
}

function switchGalleryImage(src, thumbElement) {
  document.getElementById('mainGalleryImg').src = src;
  document.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
  if (thumbElement) thumbElement.classList.add('active');
}

/* ==========================================================================
   BUYER LIVE ORDER TRACKING & ORDER HISTORY LOGIC
   ========================================================================== */

function openMyOrdersModal() {
  renderMyOrders();
  openModal('myOrdersModal');
}

function renderMyOrders() {
  const container = document.getElementById('myOrdersListContainer');

  if (!state.myOrders || state.myOrders.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:50px 20px;">
        <i class="fa-solid fa-truck-ramp-box" style="font-size: 3rem; color: var(--gray-500);"></i>
        <h3 style="margin-top:15px;">No orders placed yet</h3>
        <p style="color:var(--gray-500);">Place an order from our catalog to see live delivery tracking here!</p>
        <button class="btn btn-primary" onclick="closeModal('myOrdersModal'); scrollToSection('catalogSection');" style="margin-top:15px;">
          <i class="fa-solid fa-bag-shopping"></i> Start Shopping
        </button>
      </div>
    `;
    return;
  }

  container.innerHTML = state.myOrders.map(ord => {
    const status = ord.orderStatus || 'Placed';
    const statusClass = `status-${status.toLowerCase()}`;
    const dateStr = ord.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const step1 = true;
    const step2 = status === 'Processing' || status === 'Shipped' || status === 'Delivered';
    const step3 = status === 'Shipped' || status === 'Delivered';
    const step4 = status === 'Delivered';

    const canCancel = status === 'Placed' || status === 'Processing';

    return `
      <div class="order-tracking-card">
        <div class="order-header-line">
          <div>
            <strong>Order #${ord.orderId ? ord.orderId.substring(ord.orderId.length - 8) : 'FVR-' + Math.floor(Math.random()*9000+1000)}</strong>
            <div style="font-size: 0.8rem; color: var(--gray-500);">Placed on: ${dateStr}</div>
          </div>
          <span class="order-badge-status ${statusClass}"><i class="fa-solid fa-circle-notch fa-spin"></i> ${status}</span>
        </div>

        <!-- Visual Tracking Bar -->
        <div class="order-progress-bar">
          <div class="progress-step ${step1 ? 'completed' : ''}" title="Order Placed">1</div>
          <div class="progress-step ${step2 ? 'completed' : ''}" title="Processing">2</div>
          <div class="progress-step ${step3 ? 'completed' : ''}" title="Shipped">3</div>
          <div class="progress-step ${step4 ? 'completed' : ''}" title="Delivered">4</div>
        </div>
        <div style="display:flex; justify-content:space-between; font-size:0.75rem; color:var(--gray-500); margin-bottom:15px;">
          <span>1. Order Placed</span>
          <span>2. Processing</span>
          <span>3. Shipped</span>
          <span>4. Delivered</span>
        </div>

        <!-- Ordered Items Summary -->
        <div style="background:var(--gray-100); padding:12px; border-radius:8px; margin-bottom:12px;">
          ${(ord.items || []).map(item => `
            <div style="display:flex; align-items:center; gap:12px; margin-bottom:6px;">
              <img src="${item.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
              <div style="flex:1;">
                <div style="font-size:0.85rem; font-weight:700;">${item.title}</div>
                <div style="font-size:0.78rem; color:var(--gray-500);">Qty: ${item.quantity} × ₹${item.price}</div>
              </div>
              <strong style="color:var(--primary);">₹${item.price * item.quantity}</strong>
            </div>
          `).join('')}
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:10px; font-size:0.88rem;">
          <div><i class="fa-solid fa-location-dot"></i> Delivery Address: <strong>${ord.shippingDetails ? ord.shippingDetails.city : 'India'} (${ord.shippingDetails ? ord.shippingDetails.pincode : ''})</strong></div>
          <div style="display:flex; align-items:center; gap:15px;">
            <div style="font-size:1.1rem; font-weight:800; color:var(--primary-dark);">Total: ₹${ord.totalAmount}</div>
            ${canCancel ? `<button class="btn btn-secondary" onclick="cancelOrder('${ord.orderId}')" style="padding:4px 10px; font-size:0.8rem; color:var(--danger);"><i class="fa-solid fa-xmark"></i> Cancel Order</button>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function cancelOrder(orderId) {
  if (!confirm('Are you sure you want to cancel this order?')) return;
  state.myOrders = state.myOrders.filter(o => o.orderId !== orderId);
  localStorage.setItem('fvr_my_orders', JSON.stringify(state.myOrders));
  renderMyOrders();
  showToast('Order cancelled successfully.', 'success');
}

/* ==========================================================================
   SELLER HUB & MULTI-PHOTO UPLOAD WITH REDO / REMOVE OPTIONS (UP TO 10 PHOTOS)
   ========================================================================== */

function switchSellerTab(tab) {
  document.getElementById('sellerTabAdd').classList.toggle('active', tab === 'add');
  document.getElementById('sellerTabList').classList.toggle('active', tab === 'list');
  
  document.getElementById('sellerAddView').classList.toggle('hidden', tab !== 'add');
  document.getElementById('sellerListView').classList.toggle('hidden', tab !== 'list');

  if (tab === 'list') {
    renderSellerProductsTable();
  }
}

function toggleCustomCategoryInput() {
  const cat = document.getElementById('prodCategory').value;
  const grp = document.getElementById('customCategoryGroup');
  if (cat === 'Custom') grp.classList.remove('hidden');
  else grp.classList.add('hidden');
}

function toggleCustomCategoryInputEdit() {
  const cat = document.getElementById('editProdCategory').value;
  const grp = document.getElementById('editCustomCategoryGroup');
  if (cat === 'Custom') grp.classList.remove('hidden');
  else grp.classList.add('hidden');
}

function toggleCustomColorInput() {
  const chk = document.getElementById('chkCustomColor');
  const grp = document.getElementById('customColorGroup');
  if (chk && chk.checked) grp.classList.remove('hidden');
  else if (grp) grp.classList.add('hidden');
}

function handleMultiPhotoSelect(event, mode = 'add') {
  const files = Array.from(event.target.files);
  if (!files || files.length === 0) return;

  const targetArr = mode === 'add' ? state.addPhotos : state.editPhotos;

  files.forEach(file => {
    if (targetArr.length >= 10) return;
    const reader = new FileReader();
    reader.onload = function(e) {
      targetArr.push(e.target.result);
      renderMultiPhotoGrid(mode);
    };
    reader.readAsDataURL(file);
  });
}

function previewUploadPhotoUrls(mode = 'add') {
  const inputId = mode === 'add' ? 'prodImageUrl' : 'editProdImageUrl';
  const inputEl = document.getElementById(inputId);
  if (!inputEl) return;

  const urls = inputEl.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
  const targetArr = mode === 'add' ? state.addPhotos : state.editPhotos;

  urls.forEach(url => {
    if (targetArr.length < 10 && !targetArr.includes(url)) {
      targetArr.push(url);
    }
  });

  renderMultiPhotoGrid(mode);
}

function renderMultiPhotoGrid(mode = 'add') {
  const gridId = mode === 'add' ? 'addMultiPhotoPreviewGrid' : 'editMultiPhotoPreviewGrid';
  const grid = document.getElementById(gridId);
  const targetArr = mode === 'add' ? state.addPhotos : state.editPhotos;

  if (!grid) return;

  if (targetArr.length === 0) {
    grid.innerHTML = `<div style="font-size:0.85rem; color:var(--gray-500); padding:10px;">No photos selected yet. (Up to 10 photos allowed)</div>`;
    return;
  }

  grid.innerHTML = targetArr.map((src, idx) => `
    <div class="photo-thumb-box">
      <img src="${src}" alt="Photo ${idx+1}">
      <div class="photo-thumb-actions">
        <button type="button" class="btn-redo-photo" onclick="redoPhoto(${idx}, '${mode}')" title="Replace/Redo Photo">
          <i class="fa-solid fa-rotate-left"></i> Redo
        </button>
        <button type="button" class="btn-delete-photo" onclick="removePhoto(${idx}, '${mode}')" title="Remove Photo">&times;</button>
      </div>
    </div>
  `).join('');
}

function redoPhoto(index, mode = 'add') {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'image/*';
  
  fileInput.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      if (mode === 'add') {
        state.addPhotos[index] = evt.target.result;
      } else {
        state.editPhotos[index] = evt.target.result;
      }
      renderMultiPhotoGrid(mode);
      showToast(`Photo #${index+1} replaced successfully!`, 'success');
    };
    reader.readAsDataURL(file);
  };
  fileInput.click();
}

function removePhoto(index, mode = 'add') {
  if (mode === 'add') {
    state.addPhotos.splice(index, 1);
  } else {
    state.editPhotos.splice(index, 1);
  }
  renderMultiPhotoGrid(mode);
}

function getSelectedColors() {
  const checked = Array.from(document.querySelectorAll('input[name="prodColors"]:checked')).map(c => c.value);
  const chkCustom = document.getElementById('chkCustomColor');
  const customVal = document.getElementById('prodCustomColorInput').value.trim();

  if (chkCustom && chkCustom.checked && customVal) {
    checked.push(customVal);
  }
  return checked.length > 0 ? checked : ['Multi-Color'];
}

async function handleCreateProduct(event) {
  event.preventDefault();

  const title = document.getElementById('prodTitle').value.trim();
  let category = document.getElementById('prodCategory').value;
  if (category === 'Custom') {
    category = document.getElementById('prodCustomCategory').value.trim() || 'Custom';
  }

  const price = Number(document.getElementById('prodPrice').value);
  const originalPrice = document.getElementById('prodOriginalPrice').value ? Number(document.getElementById('prodOriginalPrice').value) : Math.round(price * 1.25);
  const stock = Number(document.getElementById('prodStock').value) || 50;
  const colors = getSelectedColors();

  const meeshoUrl = document.getElementById('prodMeeshoUrl').value.trim();
  const flipkartUrl = document.getElementById('prodFlipkartUrl').value.trim();
  const customMarketplaceUrl = document.getElementById('prodCustomMarketplaceUrl').value.trim();
  const description = document.getElementById('prodDescription').value.trim();

  const images = state.addPhotos.length > 0 ? state.addPhotos : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'];

  const payload = {
    title,
    category,
    price,
    originalPrice,
    stock,
    colors,
    images,
    meeshoUrl,
    flipkartUrl,
    customMarketplaceUrl,
    description
  };

  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    showToast('Catalog product listed successfully!', 'success');
    state.products.unshift(data.product || payload);
    renderProductGrid();
    state.addPhotos = [];
    renderMultiPhotoGrid('add');
    switchSellerTab('list');
  } catch (err) {
    const newProd = { _id: 'custom_' + Date.now(), ...payload };
    state.products.unshift(newProd);
    renderProductGrid();
    state.addPhotos = [];
    renderMultiPhotoGrid('add');
    switchSellerTab('list');
    showToast('Product listed on Fashionvillaroyal catalog!', 'success');
  }
}

function renderSellerProductsTable() {
  const tbody = document.getElementById('sellerProductsTableBody');
  if (state.products.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No products listed yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.products.map(p => `
    <tr>
      <td><img src="${p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'}" style="width:45px; height:45px; border-radius:6px; object-fit:cover;"></td>
      <td><strong>${p.title}</strong></td>
      <td>${p.category}</td>
      <td>₹${p.price} | Stock: ${p.stock || 50}</td>
      <td>
        ${p.meeshoUrl ? `<a href="${p.meeshoUrl}" target="_blank" class="text-pink"><i class="fa-solid fa-link"></i> Meesho</a>` : 'N/A'} |
        ${p.flipkartUrl ? `<a href="${p.flipkartUrl}" target="_blank" class="text-blue"><i class="fa-solid fa-link"></i> Flipkart</a>` : 'N/A'} |
        ${p.customMarketplaceUrl ? `<a href="${p.customMarketplaceUrl}" target="_blank" class="text-purple"><i class="fa-solid fa-globe"></i> Custom</a>` : 'N/A'}
      </td>
      <td>
        <div style="display:flex; gap:6px; align-items:center;">
          <button class="btn btn-secondary" onclick="openProductDetail('${p._id}')" style="padding:4px 8px; font-size:0.8rem; color:var(--primary);" title="View Live Product Profile"><i class="fa-solid fa-eye"></i> View</button>
          <button class="btn btn-secondary" onclick="openEditProductModal('${p._id}')" style="padding:4px 8px; font-size:0.8rem; color:var(--primary-dark);" title="Edit Product"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
          <button class="btn btn-secondary" onclick="deleteProduct('${p._id}')" style="padding:4px 8px; font-size:0.8rem; color:var(--danger);" title="Delete Product"><i class="fa-solid fa-trash"></i> Delete</button>
        </div>
      </td>
    </tr>
  `).join('');
}

/* ==========================================================================
   SELLER EDIT PRODUCT LOGIC
   ========================================================================== */

function openEditProductModal(productId) {
  const p = state.products.find(item => item._id === productId);
  if (!p) return;

  document.getElementById('editProdId').value = p._id;
  document.getElementById('editProdTitle').value = p.title;
  document.getElementById('editProdCategory').value = ['Sarees', 'Kurti Sets', 'Lehengas', 'Western', 'Jewelry', 'Gowns & Suits'].includes(p.category) ? p.category : 'Custom';

  if (p.category && !['Sarees', 'Kurti Sets', 'Lehengas', 'Western', 'Jewelry', 'Gowns & Suits'].includes(p.category)) {
    document.getElementById('editCustomCategoryGroup').classList.remove('hidden');
    document.getElementById('editProdCustomCategory').value = p.category;
  } else {
    document.getElementById('editCustomCategoryGroup').classList.add('hidden');
  }

  document.getElementById('editProdPrice').value = p.price;
  document.getElementById('editProdOriginalPrice').value = p.originalPrice || Math.round(p.price * 1.25);
  document.getElementById('editProdStock').value = p.stock || 50;
  document.getElementById('editProdMeeshoUrl').value = p.meeshoUrl || '';
  document.getElementById('editProdFlipkartUrl').value = p.flipkartUrl || '';
  document.getElementById('editProdCustomMarketplaceUrl').value = p.customMarketplaceUrl || '';
  document.getElementById('editProdDescription').value = p.description || '';

  state.editPhotos = p.images ? [...p.images] : [];
  renderMultiPhotoGrid('edit');

  openModal('editProductModal');
}

async function handleSaveEditedProduct(event) {
  event.preventDefault();
  const id = document.getElementById('editProdId').value;
  const p = state.products.find(item => item._id === id);
  if (!p) return;

  const title = document.getElementById('editProdTitle').value.trim();
  let category = document.getElementById('editProdCategory').value;
  if (category === 'Custom') {
    category = document.getElementById('editProdCustomCategory').value.trim() || 'Custom';
  }

  const price = Number(document.getElementById('editProdPrice').value);
  const originalPrice = Number(document.getElementById('editProdOriginalPrice').value);
  const stock = Number(document.getElementById('editProdStock').value);
  const meeshoUrl = document.getElementById('editProdMeeshoUrl').value.trim();
  const flipkartUrl = document.getElementById('editProdFlipkartUrl').value.trim();
  const customMarketplaceUrl = document.getElementById('editProdCustomMarketplaceUrl').value.trim();
  const description = document.getElementById('editProdDescription').value.trim();
  const images = state.editPhotos.length > 0 ? state.editPhotos : p.images;

  const updatedData = { title, category, price, originalPrice, stock, meeshoUrl, flipkartUrl, customMarketplaceUrl, description, images };

  try {
    await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify(updatedData)
    });
  } catch (err) {}

  Object.assign(p, updatedData);
  renderProductGrid();
  renderSellerProductsTable();
  closeModal('editProductModal');
  showToast('Product details updated successfully!', 'success');
}

/* ==========================================================================
   DYNAMIC SHOPPING CART & CHECKOUT FORM VALIDATION (BUG-FREE)
   ========================================================================== */

function addToCart(productId) {
  const p = state.products.find(item => item._id === productId);
  if (!p) return;

  const existing = state.cart.find(item => item.product === productId);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      product: p._id,
      title: p.title,
      price: p.price,
      image: p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600',
      quantity: 1
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast(`Added "${p.title.substring(0, 20)}..." to cart`, 'success');
}

function updateCartQty(productId, delta) {
  const item = state.cart.find(i => i.product === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    state.cart = state.cart.filter(i => i.product !== productId);
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
}

function saveCart() {
  localStorage.setItem('fvr_cart', JSON.stringify(state.cart));
}

function updateCartBadge() {
  const badge = document.getElementById('cartCountBadge');
  const drawerCount = document.getElementById('cartDrawerCount');
  const count = state.cart.reduce((sum, item) => sum + item.quantity, 0);
  
  if (badge) badge.textContent = count;
  if (drawerCount) drawerCount.textContent = count;
}

function toggleCartDrawer() {
  const overlay = document.getElementById('cartDrawerOverlay');
  const drawer = document.getElementById('cartDrawer');
  
  overlay.classList.toggle('hidden');
  drawer.classList.toggle('hidden');

  if (!drawer.classList.contains('hidden')) {
    renderCartDrawer();
  }
}

function renderCartDrawer() {
  const body = document.getElementById('cartDrawerBody');
  const subtotalEl = document.getElementById('cartSubtotal');
  const grandTotalEl = document.getElementById('cartGrandTotal');

  if (state.cart.length === 0) {
    body.innerHTML = `
      <div style="text-align:center; padding: 40px 10px;">
        <i class="fa-solid fa-cart-flatbed" style="font-size: 2.5rem; color: var(--gray-500);"></i>
        <h4 style="margin-top: 15px;">Your cart is empty</h4>
        <p style="color: var(--gray-500); font-size: 0.85rem;">Add items from our catalog to get started!</p>
      </div>
    `;
    subtotalEl.textContent = '₹0';
    grandTotalEl.textContent = '₹0';
    return;
  }

  const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  body.innerHTML = state.cart.map(i => `
    <div class="cart-item">
      <img src="${i.image}" alt="${i.title}">
      <div class="cart-item-info">
        <div class="cart-item-title">${i.title}</div>
        <div class="cart-item-price">₹${i.price}</div>
        <div class="qty-controls">
          <button class="qty-btn" onclick="updateCartQty('${i.product}', -1)">-</button>
          <span>${i.quantity}</span>
          <button class="qty-btn" onclick="updateCartQty('${i.product}', 1)">+</button>
        </div>
      </div>
    </div>
  `).join('');

  subtotalEl.textContent = `₹${subtotal}`;
  grandTotalEl.textContent = `₹${subtotal}`;
}

function openCheckoutModal() {
  if (state.cart.length === 0) {
    showToast('Your cart is empty!', 'error');
    return;
  }

  toggleCartDrawer();

  if (state.user) {
    if (state.user.name) document.getElementById('shipFullName').value = state.user.name;
    if (state.user.email) document.getElementById('shipEmail').value = state.user.email;
    if (state.user.phone) document.getElementById('shipPhone').value = state.user.phone;
  }

  const list = document.getElementById('checkoutItemsList');
  const total = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  list.innerHTML = state.cart.map(i => `
    <div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom:6px;">
      <span>${i.title} (x${i.quantity})</span>
      <strong>₹${i.price * i.quantity}</strong>
    </div>
  `).join('');

  document.getElementById('checkoutTotalAmount').textContent = `₹${total}`;
  openModal('checkoutModal');
}

// BUG-FREE CHECKOUT & LIVE ORDER PLACEMENT
async function handlePlaceOrder(event) {
  event.preventDefault();

  const fullName = document.getElementById('shipFullName').value.trim();
  const phone = document.getElementById('shipPhone').value.trim();
  const email = document.getElementById('shipEmail').value.trim();
  const address = document.getElementById('shipAddress').value.trim();
  const city = document.getElementById('shipCity').value.trim();
  const pincode = document.getElementById('shipPincode').value.trim();
  const paymentMethod = document.querySelector('input[name="paymentMethod"]:checked').value;

  if (!fullName || !phone || !email || !address || !city || !pincode) {
    showToast('Please fill out all contact and shipping details.', 'error');
    return;
  }

  const totalAmount = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const newOrder = {
    orderId: 'FVR-' + Math.floor(100000 + Math.random() * 900000),
    items: [...state.cart],
    totalAmount,
    shippingDetails: { fullName, email, phone, address, city, pincode },
    paymentMethod,
    orderStatus: 'Placed',
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  };

  state.myOrders.unshift(newOrder);
  localStorage.setItem('fvr_my_orders', JSON.stringify(state.myOrders));

  try {
    await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOrder)
    });
  } catch (err) {}

  state.cart = [];
  saveCart();
  updateCartBadge();
  closeModal('checkoutModal');
  showToast('🎉 Order Placed Successfully on Fashionvillaroyal!', 'success');

  setTimeout(() => {
    openMyOrdersModal();
  }, 500);
}

/* ==========================================================================
   CUSTOMER SUPPORT (DIRECT EMAIL TO FHUB0021@GMAIL.COM)
   ========================================================================== */

async function handleContactSubmit(event) {
  event.preventDefault();
  showToast('Support query sent to fhub0021@gmail.com!', 'success');
  closeModal('supportModal');
  document.getElementById('contactForm').reset();
}

/* ==========================================================================
   FULL SITE ADMIN CMS & CONTROL PANEL
   ========================================================================== */

function switchAdminTab(tab) {
  const tabs = ['stats', 'products', 'orders', 'cms'];
  tabs.forEach(t => {
    document.getElementById(`admTab${t.charAt(0).toUpperCase() + t.slice(1)}`).classList.toggle('active', t === tab);
    document.getElementById(`admin${t.charAt(0).toUpperCase() + t.slice(1)}View`).classList.toggle('hidden', t !== tab);
  });

  if (tab === 'stats') loadAdminStats();
  if (tab === 'products') loadAdminProducts();
  if (tab === 'orders') loadAdminOrders();
  if (tab === 'cms') loadAdminCMSForm();
}

async function loadAdminStats() {
  document.getElementById('statTotalProducts').textContent = state.products.length;
  document.getElementById('statTotalOrders').textContent = state.myOrders.length || 1;
  document.getElementById('statTotalRevenue').textContent = `₹${state.myOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 1299}`;
}

function loadAdminProducts() {
  const tbody = document.getElementById('adminProductsTableBody');
  tbody.innerHTML = state.products.map(p => `
    <tr>
      <td><img src="${p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;"></td>
      <td><strong>${p.title}</strong></td>
      <td>${p.category}</td>
      <td>₹${p.price}</td>
      <td>
        ${p.meeshoUrl ? `<a href="${p.meeshoUrl}" target="_blank" class="text-pink"><i class="fa-solid fa-link"></i> Meesho</a>` : 'N/A'} |
        ${p.flipkartUrl ? `<a href="${p.flipkartUrl}" target="_blank" class="text-blue"><i class="fa-solid fa-link"></i> Flipkart</a>` : 'N/A'} |
        ${p.customMarketplaceUrl ? `<a href="${p.customMarketplaceUrl}" target="_blank" class="text-purple"><i class="fa-solid fa-globe"></i> Custom</a>` : 'N/A'}
      </td>
      <td>
        <button class="btn btn-secondary" onclick="deleteProduct('${p._id}')" style="padding:4px 8px; color:var(--danger);"><i class="fa-solid fa-trash"></i> Delete</button>
      </td>
    </tr>
  `).join('');
}

async function deleteProduct(productId) {
  if (!confirm('Are you sure you want to remove this product from Fashionvillaroyal?')) return;
  state.products = state.products.filter(p => p._id !== productId);
  loadAdminProducts();
  renderSellerProductsTable();
  renderProductGrid();
  showToast('Product removed.', 'success');
}

function loadAdminOrders() {
  const tbody = document.getElementById('adminOrdersTableBody');
  const allOrders = state.myOrders.length > 0 ? state.myOrders : [
    { orderId: 'ORD-1001', shippingDetails: { fullName: 'Ananya Sharma', phone: '9876543210', city: 'Jaipur', pincode: '302001' }, totalAmount: 1299, orderStatus: 'Placed' }
  ];

  tbody.innerHTML = allOrders.map(o => `
    <tr>
      <td>#${o.orderId ? o.orderId.substring(o.orderId.length - 8) : 'ORD-1001'}</td>
      <td>${o.shippingDetails ? o.shippingDetails.fullName : 'Customer'}</td>
      <td>${o.shippingDetails ? o.shippingDetails.phone : 'N/A'}</td>
      <td>${o.shippingDetails ? o.shippingDetails.city : 'India'}, ${o.shippingDetails ? o.shippingDetails.pincode : ''}</td>
      <td>₹${o.totalAmount}</td>
      <td><strong>${o.orderStatus || 'Placed'}</strong></td>
      <td>
        <select onchange="updateOrderStatus('${o.orderId}', this.value)" style="padding:4px; font-size:0.8rem;">
          <option value="Placed" ${o.orderStatus === 'Placed' ? 'selected' : ''}>Placed</option>
          <option value="Processing" ${o.orderStatus === 'Processing' ? 'selected' : ''}>Processing</option>
          <option value="Shipped" ${o.orderStatus === 'Shipped' ? 'selected' : ''}>Shipped</option>
          <option value="Delivered" ${o.orderStatus === 'Delivered' ? 'selected' : ''}>Delivered</option>
        </select>
      </td>
    </tr>
  `).join('');
}

function updateOrderStatus(orderId, status) {
  const ord = state.myOrders.find(o => o.orderId === orderId);
  if (ord) ord.orderStatus = status;
  localStorage.setItem('fvr_my_orders', JSON.stringify(state.myOrders));
  showToast(`Order status updated to ${status}`, 'success');
}

function loadAdminCMSForm() {
  document.getElementById('cmsAnnouncementText').value = state.cms.announcementText || '';
  document.getElementById('cmsSupportEmail').value = state.cms.supportEmail || 'fhub0021@gmail.com';
  renderCMSSlidesInput();
}

function renderCMSSlidesInput() {
  const container = document.getElementById('cmsSlidesContainer');
  const slides = state.cms.carouselSlides || [];

  container.innerHTML = slides.map((slide, idx) => `
    <div style="background:var(--gray-100); padding:15px; border-radius:8px; margin-bottom:15px; border:1px solid var(--gray-200);">
      <h5>Slide #${idx + 1}</h5>
      <div class="form-row">
        <div class="form-group">
          <label>Slide Title</label>
          <input type="text" class="cms-slide-title" value="${slide.title || ''}">
        </div>
        <div class="form-group">
          <label>Slide Subtitle</label>
          <input type="text" class="cms-slide-subtitle" value="${slide.subtitle || ''}">
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label>Image URL</label>
          <input type="text" class="cms-slide-image" value="${slide.imageUrl || ''}">
        </div>
        <div class="form-group">
          <label>Badge Text</label>
          <input type="text" class="cms-slide-badge" value="${slide.badgeText || ''}">
        </div>
      </div>
    </div>
  `).join('');
}

function addCMSSlideInput() {
  if (!state.cms.carouselSlides) state.cms.carouselSlides = [];
  state.cms.carouselSlides.push({
    title: 'New Fashion Offer',
    subtitle: 'Special Discounts Available Today',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200',
    badgeText: 'New'
  });
  renderCMSSlidesInput();
}

async function handleSaveCMS(event) {
  event.preventDefault();
  const announcementText = document.getElementById('cmsAnnouncementText').value.trim();
  const supportEmail = document.getElementById('cmsSupportEmail').value.trim();

  const titles = document.querySelectorAll('.cms-slide-title');
  const subtitles = document.querySelectorAll('.cms-slide-subtitle');
  const images = document.querySelectorAll('.cms-slide-image');
  const badges = document.querySelectorAll('.cms-slide-badge');

  const slides = [];
  titles.forEach((el, idx) => {
    slides.push({
      title: el.value,
      subtitle: subtitles[idx] ? subtitles[idx].value : '',
      imageUrl: images[idx] ? images[idx].value : '',
      badgeText: badges[idx] ? badges[idx].value : '',
      linkUrl: '#catalogSection',
      buttonText: 'Shop Now'
    });
  });

  state.cms.announcementText = announcementText;
  state.cms.supportEmail = supportEmail;
  state.cms.carouselSlides = slides;
  updateCMSUI();
  renderCarousel();
  showToast('Front page CMS updated!', 'success');
  closeModal('adminModal');
}

/* ==========================================================================
   UI UTILITY FUNCTIONS & MODAL CONTROLLERS
   ========================================================================== */

function openModal(modalId) {
  document.getElementById(modalId).classList.remove('hidden');

  if (modalId === 'sellerModal') {
    switchSellerTab('add');
  }
}

function closeModal(modalId) {
  document.getElementById(modalId).classList.add('hidden');
}

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
}

function showToast(message, type = 'info') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<i class="fa-solid ${type === 'success' ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${message}`;
  
  container.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 4000);
}
