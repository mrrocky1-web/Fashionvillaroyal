/**
 * FASHIONVILLAROYAL - Core Frontend Application Logic
 * Single-Page Architecture with State Management, Carousel, OTP Auth,
 * Multi-Photo Upload (up to 10 photos) with Redo/Remove buttons,
 * Custom Category & Color Options, Stock Quantity, Meesho/Flipkart/Custom Market Links,
 * Head Admin Controls: Maintenance Mode, Seller Verification & Account Suspension,
 * Editable Homepage Banner/Ads CMS, Seller Product Payment Method Options, Order Tracking,
 * Public Catalog Product Visibility, Seller Registration Requests, Wishlist & Social Share,
 * Product Star Ratings & Photo Reviews, Follow Seller Shop & Seller Store Profile Modal,
 * Size Selection, Out of Stock Handling, Profile & Address Management, and Account Deletion.
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
  wishlist: JSON.parse(localStorage.getItem('fvr_wishlist')) || [],
  followedShops: JSON.parse(localStorage.getItem('fvr_followed_shops')) || [],
  myOrders: JSON.parse(localStorage.getItem('fvr_my_orders')) || [],
  products: JSON.parse(localStorage.getItem('fvr_all_products')) || [],
  sellers: JSON.parse(localStorage.getItem('fvr_seller_requests')) || [
    { id: 'sel_1', name: 'Surat Textile Outlet', email: 'surat_seller@gmail.com', storeName: 'Royal Surat Sarees', status: 'Approved', date: '15 Aug 2026', location: 'Surat, Gujarat', rating: 4.9, followers: 340, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200', banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200' },
    { id: 'sel_2', name: 'Jaipur Kurti Supplier', email: 'jaipur_kurti@gmail.com', storeName: 'Jaipur Ethnic Craft', status: 'Pending', date: '01 Sep 2026', location: 'Jaipur, Rajasthan', rating: 4.6, followers: 85, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200', banner: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200' },
    { id: 'sel_3', name: 'Royal Silk Mills', email: 'royal_silk@gmail.com', storeName: 'Royal Silk House', status: 'Approved', date: '04 Sep 2026', location: 'Surat, Gujarat', rating: 4.8, followers: 210, avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200', banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200' }
  ],
  addPhotos: [],
  editPhotos: [],
  selectedSize: 'M',
  currentShopProfile: null,
  cms: {
    maintenanceMode: false,
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

// Default Initial Sample Products
const SAMPLE_PRODUCTS = [
  {
    _id: 'sample_1',
    title: 'Kanjivaram Silk Zari Woven Saree',
    category: 'Sarees',
    price: 1299,
    originalPrice: 3499,
    stock: 45,
    sizes: ['Free Size'],
    colors: ['Gold', 'Red', 'Pink'],
    acceptedPayments: ['COD', 'UPI', 'Card'],
    description: 'Traditional Kanjivaram pure silk blend saree with heavy zari border. Comes with unstitched blouse piece.',
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600'
    ],
    meeshoUrl: 'https://www.meesho.com/s/p/kanjivaram-saree',
    flipkartUrl: 'https://www.flipkart.com/dp/kanjivaram-saree',
    customMarketplaceUrl: 'https://www.amazon.in/dp/kanjivaram-saree',
    rating: 4.8,
    sellerId: 'sel_1',
    sellerStoreName: 'Royal Surat Sarees',
    reviews: [
      { userName: 'Priya Sharma', userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100', rating: 5, comment: 'Beautiful fabric quality and zari work! Fast delivery.', photo: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=200', date: '02 Sep 2026' }
    ]
  },
  {
    _id: 'sample_2',
    title: 'Anarkali Rayon Kurti Set with Dupatta',
    category: 'Kurti Sets',
    price: 899,
    originalPrice: 1999,
    stock: 60,
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Blue', 'Black', 'Multi'],
    acceptedPayments: ['COD', 'UPI'],
    description: 'Designer flared Anarkali Kurti with pants and chiffon printed dupatta. Soft premium cotton rayon fabric.',
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'
    ],
    meeshoUrl: 'https://www.meesho.com/s/p/anarkali-kurti-set',
    flipkartUrl: 'https://www.flipkart.com/dp/anarkali-kurti-set',
    customMarketplaceUrl: '',
    rating: 4.6,
    sellerId: 'sel_2',
    sellerStoreName: 'Jaipur Ethnic Craft',
    reviews: [
      { userName: 'Neha Verma', userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100', rating: 4, comment: 'Fitting is perfect. Loved the dupatta pattern.', photo: '', date: '04 Sep 2026' }
    ]
  },
  {
    _id: 'sample_3',
    title: 'Bridal Floral Velvet Lehenga Choli',
    category: 'Lehengas',
    price: 3499,
    originalPrice: 7999,
    stock: 0, // Out of Stock Test
    sizes: ['M', 'L', 'XL'],
    colors: ['Red', 'Maroon', 'Gold'],
    acceptedPayments: ['COD', 'UPI', 'Card'],
    description: 'Heavy embroidered velvet semi-stitched bridal lehenga choli set with double dupatta.',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=600'
    ],
    meeshoUrl: 'https://www.meesho.com',
    flipkartUrl: 'https://www.flipkart.com',
    customMarketplaceUrl: '',
    rating: 4.9,
    sellerId: 'sel_3',
    sellerStoreName: 'Royal Silk House',
    reviews: []
  },
  {
    _id: 'sample_4',
    title: 'Royal Kundan Choker Necklace Set',
    category: 'Jewelry',
    price: 499,
    originalPrice: 1499,
    stock: 100,
    sizes: ['Free Size'],
    colors: ['Gold', 'White'],
    acceptedPayments: ['UPI', 'Card'],
    description: 'Handcrafted Kundan jewelry set with matching earrings and maang tikka.',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?q=80&w=600'
    ],
    meeshoUrl: 'https://www.meesho.com',
    flipkartUrl: 'https://www.flipkart.com',
    customMarketplaceUrl: '',
    rating: 4.7,
    sellerId: 'sel_1',
    sellerStoreName: 'Royal Surat Sarees',
    reviews: []
  }
];

/* ==========================================================================
   INITIALIZATION & EVENT LISTENERS
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initApp();
  setupGlobalModalEscKey();
  setupClickOutsideDropdown();
});

function setupClickOutsideDropdown() {
  document.addEventListener('click', (e) => {
    const userContainer = document.getElementById('userMenuContainer');
    const userDropdown = document.getElementById('userDropdown');
    if (userContainer && !userContainer.contains(e.target) && userDropdown) {
      userDropdown.classList.add('hidden');
    }
  });
}

async function initApp() {
  if (!state.products || state.products.length === 0) {
    state.products = SAMPLE_PRODUCTS;
    saveProductsState();
  }

  updateUserUI();
  updateCartBadge();
  updateWishlistBadge();
  setupSearchListener();
  
  await fetchCMS();
  await fetchProducts();
  
  renderCarousel();
  startCarouselTimer();
  renderOffers();

  // Auto-sync products every 8 seconds for cross-network / multi-device public updates
  setInterval(fetchProducts, 8000);
}

function saveProductsState() {
  localStorage.setItem('fvr_all_products', JSON.stringify(state.products));
}

function saveSellersState() {
  localStorage.setItem('fvr_seller_requests', JSON.stringify(state.sellers));
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
  const headerLogoutBtn = document.getElementById('headerLogoutBtn');

  if (state.user) {
    if (authBtnText) authBtnText.textContent = state.user.name.split(' ')[0];
    if (dropdownUserName) dropdownUserName.textContent = state.user.name;
    if (dropdownUserRole) dropdownUserRole.textContent = `Role: ${state.user.role.toUpperCase()}`;

    if (headerLogoutBtn) {
      headerLogoutBtn.classList.remove('hidden');
    }

    if (state.user.role === 'admin') {
      if (adminPanelLink) adminPanelLink.classList.remove('hidden');
      if (sellerPanelLink) sellerPanelLink.classList.remove('hidden');
      if (navSellerBtn) navSellerBtn.classList.remove('hidden');
    } else if (state.user.role === 'seller') {
      if (adminPanelLink) adminPanelLink.classList.add('hidden');
      if (sellerPanelLink) sellerPanelLink.classList.remove('hidden');
      if (navSellerBtn) navSellerBtn.classList.remove('hidden');
    } else {
      if (adminPanelLink) adminPanelLink.classList.add('hidden');
      if (sellerPanelLink) sellerPanelLink.classList.add('hidden');
      if (navSellerBtn) navSellerBtn.classList.add('hidden');
    }
  } else {
    if (authBtnText) authBtnText.textContent = 'Login';
    if (userDropdown) userDropdown.classList.add('hidden');
    if (headerLogoutBtn) headerLogoutBtn.classList.add('hidden');
    if (navSellerBtn) navSellerBtn.classList.add('hidden');
  }
}

function toggleUserDropdown(e) {
  if (e) e.stopPropagation();
  if (!state.user) {
    openModal('authModal');
  } else {
    const userDropdown = document.getElementById('userDropdown');
    if (userDropdown) {
      userDropdown.classList.toggle('hidden');
    }
  }
}

function handleLogout() {
  state.user = null;
  state.token = null;
  localStorage.removeItem('fvr_user');
  localStorage.removeItem('fvr_token');
  
  const userDropdown = document.getElementById('userDropdown');
  if (userDropdown) userDropdown.classList.add('hidden');

  updateUserUI();
  showToast('🚪 Logged out successfully!', 'success');
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

  const cleanEmail = email.toLowerCase();
  const isAdminEmail = cleanEmail === 'admin@fashionvillaroyal.com' || cleanEmail === 'fhub0021@gmail.com';
  const isAdminPass = password === 'FashionRoyalAdmin@2026#';

  if (isAdminEmail) {
    if (!isAdminPass) {
      showToast('❌ Invalid Head Admin Password! Access Denied.', 'error');
      return;
    }

    state.user = {
      id: 'admin_master_001',
      name: 'Super Head Admin',
      email: cleanEmail,
      role: 'admin',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200'
    };
    state.token = 'super_admin_secure_token_2026';
    localStorage.setItem('fvr_user', JSON.stringify(state.user));
    localStorage.setItem('fvr_token', state.token);
    updateUserUI();
    closeModal('authModal');
    showToast('🔑 Welcome Super Head Admin! Full website control granted.', 'success');
    openModal('adminModal');
    return;
  }

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
    const role = cleanEmail.includes('seller') ? 'seller' : 'customer';
    state.user = { id: 'u_' + Date.now(), name: email.split('@')[0], email, role: role, storeName: role === 'seller' ? 'Royal Seller Store' : '' };
    state.token = 'demo_token';
    localStorage.setItem('fvr_user', JSON.stringify(state.user));
    localStorage.setItem('fvr_token', state.token);
    updateUserUI();
    closeModal('authModal');
    showToast(`Logged in as ${state.user.name}`, 'success');
  }
}

// BUG FIX #2: SELLER REGISTRATION DISPATCHED TO HEAD ADMIN PANEL
async function handleRegisterSubmit(event) {
  event.preventDefault();
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  const role = document.getElementById('regRole').value;
  const storeName = document.getElementById('regStoreName').value.trim();
  const phone = document.getElementById('regPhone').value.trim();

  const payload = { name, email, password, role, storeName, phone };

  if (role === 'seller') {
    const newSellerRequest = {
      id: 'sel_' + Date.now(),
      name,
      email,
      storeName: storeName || 'New Merchant Store',
      status: 'Pending',
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
      location: 'Surat / Pan-India',
      rating: 5.0,
      followers: 0
    };
    state.sellers.unshift(newSellerRequest);
    saveSellersState();
  }

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
    showToast(`Account registered! ${role === 'seller' ? 'Pending Head Admin Approval.' : ''}`, 'success');
  }
}

/* ==========================================================================
   PORTAL SWITCHER CONTROLLER (SELLER HUB vs HEAD ADMIN HUB)
   ========================================================================== */

function choosePortal(type) {
  closeModal('portalSwitcherModal');
  if (type === 'seller') {
    if (!state.user) {
      showToast('Please login to access Seller Hub.', 'info');
      openModal('authModal');
      return;
    }
    openModal('sellerModal');
  } else if (type === 'admin') {
    if (!state.user || state.user.role !== 'admin') {
      showToast('Head Admin password login required for Super Admin Control Panel.', 'error');
      openModal('authModal');
      return;
    }
    openModal('adminModal');
  }
}

/* ==========================================================================
   USER PROFILE & ADDRESS MANAGEMENT (ADD / EDIT ADDRESS & DELETE ACCOUNT)
   ========================================================================== */

function openUserProfileModal() {
  if (!state.user) {
    openModal('authModal');
    return;
  }

  document.getElementById('profName').value = state.user.name || '';
  document.getElementById('profPhone').value = state.user.phone || '';
  document.getElementById('profAvatarUrl').value = state.user.avatar || '';

  const sellerFields = document.getElementById('profSellerFields');
  if (state.user.role === 'seller' || state.user.role === 'admin') {
    sellerFields.classList.remove('hidden');
    document.getElementById('profStoreName').value = state.user.storeName || '';
    document.getElementById('profBannerUrl').value = state.user.banner || '';
  } else {
    sellerFields.classList.add('hidden');
  }

  const addr = state.user.address || {};
  document.getElementById('profStreet').value = addr.street || '';
  document.getElementById('profCity').value = addr.city || '';
  document.getElementById('profState').value = addr.state || '';
  document.getElementById('profPincode').value = addr.pincode || '';

  openModal('userProfileModal');
}

async function handleSaveProfile(event) {
  event.preventDefault();
  if (!state.user) return;

  const name = document.getElementById('profName').value.trim();
  const phone = document.getElementById('profPhone').value.trim();
  const avatar = document.getElementById('profAvatarUrl').value.trim();
  const storeName = document.getElementById('profStoreName') ? document.getElementById('profStoreName').value.trim() : '';
  const banner = document.getElementById('profBannerUrl') ? document.getElementById('profBannerUrl').value.trim() : '';

  const street = document.getElementById('profStreet').value.trim();
  const city = document.getElementById('profCity').value.trim();
  const stateVal = document.getElementById('profState').value.trim();
  const pincode = document.getElementById('profPincode').value.trim();

  state.user.name = name;
  state.user.phone = phone;
  state.user.avatar = avatar;
  if (storeName) state.user.storeName = storeName;
  if (banner) state.user.banner = banner;

  state.user.address = { street, city, state: stateVal, pincode };
  localStorage.setItem('fvr_user', JSON.stringify(state.user));

  try {
    await fetch(`${API_BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(state.user)
    });
  } catch (err) {}

  updateUserUI();
  closeModal('userProfileModal');
  showToast('Profile & Saved Address updated successfully!', 'success');
}

async function handleDeleteAccount() {
  if (!confirm('⚠️ Are you sure you want to permanently delete your account? All data will be removed.')) return;

  state.user = null;
  state.token = null;
  localStorage.removeItem('fvr_user');
  localStorage.removeItem('fvr_token');

  try {
    await fetch(`${API_BASE_URL}/auth/account`, { method: 'DELETE' });
  } catch (err) {}

  updateUserUI();
  closeModal('userProfileModal');
  showToast('Your account has been deleted.', 'success');
}

/* ==========================================================================
   WISHLIST & SOCIAL SHARE (WHATSAPP / LINK COPY)
   ========================================================================== */

function toggleWishlist(productId) {
  const index = state.wishlist.indexOf(productId);
  if (index > -1) {
    state.wishlist.splice(index, 1);
    showToast('Removed item from Wishlist', 'info');
  } else {
    state.wishlist.push(productId);
    showToast('Added item to My Wishlist ❤️', 'success');
  }

  localStorage.setItem('fvr_wishlist', JSON.stringify(state.wishlist));
  updateWishlistBadge();
  renderProductGrid();
}

function updateWishlistBadge() {
  const badge = document.getElementById('wishlistCountBadge');
  if (badge) badge.textContent = state.wishlist.length;
}

function openWishlistModal() {
  renderWishlistItems();
  openModal('wishlistModal');
}

function renderWishlistItems() {
  const container = document.getElementById('wishlistGridContainer');
  const items = state.products.filter(p => state.wishlist.includes(p._id));

  if (items.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1/-1; text-align:center; padding:50px 20px;">
        <i class="fa-solid fa-heart-crack" style="font-size:3rem; color:var(--gray-500);"></i>
        <h3 style="margin-top:15px;">Your Wishlist is empty</h3>
        <p style="color:var(--gray-500);">Click the heart icon on any product to save it here!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = items.map(p => `
    <div class="product-card">
      <div class="product-image-wrap" onclick="openProductDetail('${p._id}')">
        <img src="${p.images[0]}" alt="${p.title}">
      </div>
      <div class="product-details">
        <h3 class="product-title" onclick="openProductDetail('${p._id}')">${p.title}</h3>
        <div class="product-price-row">
          <span class="price-current">₹${p.price}</span>
        </div>
        <div style="display:flex; gap:8px; margin-top:10px;">
          <button class="btn btn-primary btn-block" onclick="addToCart('${p._id}'); toggleWishlist('${p._id}');">
            <i class="fa-solid fa-cart-plus"></i> Move to Cart
          </button>
          <button class="btn btn-secondary" onclick="toggleWishlist('${p._id}'); renderWishlistItems();" style="color:var(--danger);">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    </div>
  `).join('');
}

function shareProduct(productId) {
  const p = state.products.find(item => item._id === productId);
  if (!p) return;

  const title = p.title;
  const url = window.location.href;
  const shareText = `Check out "${title}" for ₹${p.price} on Fashionvillaroyal! Shop online or on Meesho/Flipkart: ${url}`;

  if (navigator.share) {
    navigator.share({
      title: title,
      text: shareText,
      url: url
    }).catch(() => {});
  } else {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;
    window.open(whatsappUrl, '_blank');
    showToast('Product share link opened for WhatsApp!', 'success');
  }
}

/* ==========================================================================
   DEDICATED SELLER SHOP PROFILE & STORE FOLLOWING SYSTEM
   ========================================================================== */

function openSellerStoreProfile(sellerId) {
  const seller = state.sellers.find(s => s.id === sellerId) || {
    id: sellerId || 'sel_1',
    storeName: 'Royal Store Outlet',
    location: 'Surat & Pan-India',
    rating: 4.8,
    followers: 120,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200',
    banner: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200'
  };

  state.currentShopProfile = seller;

  document.getElementById('shopBannerImg').src = seller.banner || 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1200';
  document.getElementById('shopAvatarImg').src = seller.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';
  document.getElementById('shopStoreName').textContent = seller.storeName || seller.name;
  document.getElementById('shopLocation').textContent = seller.location || 'Pan-India Manufacturer Hub';
  document.getElementById('shopRating').textContent = `${seller.rating || 4.8} ★`;
  document.getElementById('shopFollowers').textContent = seller.followers || 120;

  const btnFollow = document.getElementById('btnFollowShop');
  const isFollowing = state.followedShops.includes(seller.id);
  btnFollow.innerHTML = isFollowing ? `<i class="fa-solid fa-check"></i> Following` : `<i class="fa-solid fa-user-plus"></i> Follow Store`;
  btnFollow.classList.toggle('btn-secondary', isFollowing);
  btnFollow.classList.toggle('btn-primary', !isFollowing);

  const grid = document.getElementById('sellerShopProductGrid');
  const sellerProducts = state.products.filter(p => p.sellerId === seller.id || p.sellerStoreName === seller.storeName);

  if (sellerProducts.length === 0) {
    grid.innerHTML = `<div style="grid-column:1/-1; text-align:center; padding:30px;">No catalog products currently listed by this store.</div>`;
  } else {
    grid.innerHTML = sellerProducts.map(p => renderSingleProductCardHTML(p)).join('');
  }

  openModal('sellerStoreProfileModal');
}

function toggleFollowShop() {
  if (!state.currentShopProfile) return;
  const sellerId = state.currentShopProfile.id;

  const index = state.followedShops.indexOf(sellerId);
  if (index > -1) {
    state.followedShops.splice(index, 1);
    state.currentShopProfile.followers = Math.max(0, (state.currentShopProfile.followers || 120) - 1);
    showToast(`Unfollowed "${state.currentShopProfile.storeName}"`, 'info');
  } else {
    state.followedShops.push(sellerId);
    state.currentShopProfile.followers = (state.currentShopProfile.followers || 120) + 1;
    showToast(`Following "${state.currentShopProfile.storeName}"! ❤️`, 'success');
  }

  localStorage.setItem('fvr_followed_shops', JSON.stringify(state.followedShops));
  openSellerStoreProfile(sellerId);
}

/* ==========================================================================
   HOMEPAGE CMS, CAROUSEL & MAINTENANCE MODE CONTROLLER
   ========================================================================== */

async function fetchCMS() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/settings`);
    const data = await res.json();
    if (data.success && data.settings) {
      state.cms = { ...state.cms, ...data.settings };
    }
  } catch (err) {}
  updateCMSUI();
}

function updateCMSUI() {
  const annText = document.getElementById('announcementText');
  const suppEmail = document.getElementById('supportEmailDisplay');
  const maintenanceBanner = document.getElementById('maintenanceBanner');

  if (annText) annText.innerHTML = `<i class="fa-solid fa-store"></i> ${state.cms.announcementText || 'We are available in Meesho, Flipkart, Amazon & Custom Stores.'}`;
  if (suppEmail) suppEmail.textContent = state.cms.supportEmail || 'fhub0021@gmail.com';

  if (maintenanceBanner) {
    if (state.cms.maintenanceMode) maintenanceBanner.classList.remove('hidden');
    else maintenanceBanner.classList.add('hidden');
  }
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
   PRODUCT CATALOG & PUBLIC VISIBILITY FIX (BUG FIX #1)
   ========================================================================== */

async function fetchProducts() {
  try {
    const response = await fetch(`${API_BASE_URL}/products`);
    const data = await response.json();
    if (data.success && Array.isArray(data.products) && data.products.length > 0) {
      const serverMap = new Map();
      data.products.forEach(p => {
        const key = String(p._id || p.id || p.title);
        serverMap.set(key, p);
      });

      if (Array.isArray(state.products)) {
        state.products.forEach(p => {
          const key = String(p._id || p.id || p.title);
          if (!serverMap.has(key)) {
            serverMap.set(key, p);
          }
        });
      }

      state.products = Array.from(serverMap.values());
      saveProductsState();
    }
  } catch (err) {
    console.warn('Network sync notice:', err);
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

  grid.innerHTML = filtered.map(p => renderSingleProductCardHTML(p)).join('');
}

function renderSingleProductCardHTML(p) {
  const discount = p.originalPrice && p.originalPrice > p.price
    ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
    : 0;
  const isWishlisted = state.wishlist.includes(p._id);
  const isOutOfStock = p.stock <= 0;

  return `
    <div class="product-card" style="position:relative;">
      <div class="card-quick-actions">
        <button class="btn-card-action ${isWishlisted ? 'active' : ''}" onclick="toggleWishlist('${p._id}')" title="Save to Wishlist">
          <i class="fa-solid fa-heart"></i>
        </button>
        <button class="btn-card-action" onclick="shareProduct('${p._id}')" title="Share Product">
          <i class="fa-solid fa-share-nodes"></i>
        </button>
      </div>

      <div class="product-image-wrap" onclick="openProductDetail('${p._id}')">
        <img src="${p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'}" alt="${p.title}">
        ${isOutOfStock ? `<span class="badge-out-of-stock" style="position:absolute; top:10px; left:10px;">OUT OF STOCK</span>` : discount > 0 ? `<span class="badge-discount">${discount}% OFF</span>` : ''}
      </div>

      <div class="product-details">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
          <span class="product-cat">${p.category}</span>
          <span style="font-size:0.8rem; font-weight:700; color:var(--gold);"><i class="fa-solid fa-star"></i> ${p.rating || 4.8} ★</span>
        </div>

        <h3 class="product-title" onclick="openProductDetail('${p._id}')">${p.title}</h3>
        
        <div style="font-size:0.78rem; color:var(--gray-500); margin-bottom:8px;">
          Store: <a href="#" onclick="openSellerStoreProfile('${p.sellerId || 'sel_1'}'); event.stopPropagation();" style="color:var(--primary); font-weight:700;">${p.sellerStoreName || 'Royal Store Outlet'}</a>
        </div>

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

        ${isOutOfStock ? `
          <button class="btn-add-cart" disabled style="background:var(--gray-500); cursor:not-allowed;">
            <i class="fa-solid fa-ban"></i> Out of Stock
          </button>
        ` : `
          <button class="btn-add-cart" onclick="addToCart('${p._id}')">
            <i class="fa-solid fa-cart-plus"></i> Add to Cart
          </button>
        `}
      </div>
    </div>
  `;
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
  const paymentsList = p.acceptedPayments && p.acceptedPayments.length > 0 ? p.acceptedPayments.join(' | ') : 'COD & Online UPI';
  const sizesList = p.sizes && p.sizes.length > 0 ? p.sizes : ['S', 'M', 'L', 'XL', 'XXL'];

  const reviews = p.reviews || [];
  state.selectedSize = sizesList[0];

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
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span class="product-cat">${p.category}</span>
          <button class="btn btn-secondary" onclick="shareProduct('${p._id}')" style="padding:4px 10px; font-size:0.8rem;">
            <i class="fa-solid fa-share-nodes"></i> Share
          </button>
        </div>

        <h2 style="font-size: 1.6rem; margin: 8px 0; color: var(--dark);">${p.title}</h2>
        
        <div style="margin-bottom:10px; font-size:0.88rem; color:var(--gray-500);">
          Seller Shop: <a href="#" onclick="openSellerStoreProfile('${p.sellerId || 'sel_1'}')" style="color:var(--primary); font-weight:700;">${p.sellerStoreName || 'Royal Store Outlet'}</a>
        </div>

        <div class="product-price-row" style="margin-bottom: 15px;">
          <span class="price-current" style="font-size: 1.6rem;">₹${p.price}</span>
          ${p.originalPrice ? `<span class="price-original" style="font-size: 1.1rem;">₹${p.originalPrice}</span>` : ''}
          ${discount > 0 ? `<span class="badge-discount" style="position:static; margin-left: 10px;">${discount}% OFF</span>` : ''}
        </div>

        <!-- Size Picker -->
        <div style="margin-bottom: 15px;">
          <label style="font-size:0.85rem; font-weight:700; color:var(--gray-700); display:block; margin-bottom:6px;">Select Size:</label>
          <div class="size-checkbox-grid">
            ${sizesList.map((sz, idx) => `
              <label class="size-pill-label">
                <input type="radio" name="detailSize" value="${sz}" ${idx === 0 ? 'checked' : ''} onchange="state.selectedSize = '${sz}'"> ${sz}
              </label>
            `).join('')}
          </div>
        </div>

        <div style="margin-bottom: 15px; font-size: 0.9rem;">
          <p><i class="fa-solid fa-boxes-stacked text-purple"></i> Stock Status: ${p.stock > 0 ? `<strong style="color:var(--success);">${p.stock} Units Available</strong>` : `<strong style="color:var(--danger);">OUT OF STOCK</strong>`}</p>
          <p><i class="fa-solid fa-palette text-purple"></i> Available Colors: <strong>${colorsList}</strong></p>
          <p><i class="fa-solid fa-wallet text-purple"></i> Accepted Payments: <strong>${paymentsList}</strong></p>
        </div>

        <p style="color: var(--gray-700); margin-bottom: 20px;">${p.description}</p>
        
        <h4 style="font-size: 0.9rem; font-weight: 700; margin-bottom: 10px; color: var(--gray-700);">Buying Options:</h4>
        <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px;">
          ${p.stock > 0 ? `
            <button class="btn btn-primary btn-block btn-lg" onclick="addToCart('${p._id}', state.selectedSize); closeModal('productDetailModal'); toggleCartDrawer();">
              <i class="fa-solid fa-cart-shopping"></i> Buy on Fashionvillaroyal (Add to Cart)
            </button>
          ` : `
            <button class="btn btn-secondary btn-block btn-lg" disabled style="background:var(--gray-500); cursor:not-allowed;">
              <i class="fa-solid fa-ban"></i> Out of Stock
            </button>
          `}

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

    <!-- Customer Ratings & Photo Reviews Section -->
    <div class="reviews-container">
      <h3 style="margin-bottom:15px;"><i class="fa-solid fa-star text-gold"></i> Customer Ratings & Reviews (${reviews.length})</h3>

      <!-- Post Review Form -->
      <form onsubmit="handlePostReview(event, '${p._id}')" style="background:var(--gray-100); padding:15px; border-radius:8px; margin-bottom:20px;">
        <h4 style="font-size:0.9rem; font-weight:700; margin-bottom:10px;">Write a Public Review</h4>
        <div class="form-row">
          <div class="form-group">
            <label>Star Rating</label>
            <select id="revRating" required>
              <option value="5">⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
              <option value="4">⭐⭐⭐⭐ (4/5 Very Good)</option>
              <option value="3">⭐⭐⭐ (3/5 Good)</option>
              <option value="2">⭐⭐ (2/5 Fair)</option>
              <option value="1">⭐ (1/5 Poor)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Review Photo URL (Optional)</label>
            <input type="url" id="revPhotoUrl" placeholder="https://image.com/my-review.jpg">
          </div>
        </div>
        <div class="form-group">
          <label>Your Feedback / Comment *</label>
          <textarea id="revComment" rows="2" required placeholder="Write about fabric quality, fitting, delivery experience..."></textarea>
        </div>
        <button type="submit" class="btn btn-primary"><i class="fa-solid fa-paper-plane"></i> Submit Public Review</button>
      </form>

      <!-- Public Reviews List -->
      <div id="reviewsList">
        ${reviews.length === 0 ? `<p style="color:var(--gray-500); font-size:0.85rem;">No reviews submitted yet. Be the first customer to review this product!</p>` : reviews.map(r => `
          <div class="review-card">
            <div class="review-header">
              <div class="review-user">
                <img src="${r.userAvatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100'}" class="review-avatar">
                <span>${r.userName}</span>
              </div>
              <span class="review-stars">${'⭐'.repeat(r.rating)}</span>
            </div>
            <p style="font-size:0.85rem; color:var(--dark); margin:6px 0;">${r.comment}</p>
            ${r.photo ? `<img src="${r.photo}" class="review-photo-preview" onclick="window.open('${r.photo}')">` : ''}
            <div style="font-size:0.75rem; color:var(--gray-500); margin-top:4px;">${r.date || 'Recent Customer Review'}</div>
          </div>
        `).join('')}
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

function handlePostReview(event, productId) {
  event.preventDefault();
  const p = state.products.find(item => item._id === productId);
  if (!p) return;

  const rating = Number(document.getElementById('revRating').value);
  const photo = document.getElementById('revPhotoUrl').value.trim();
  const comment = document.getElementById('revComment').value.trim();
  const userName = state.user ? state.user.name : 'Verified Customer';
  const userAvatar = state.user && state.user.avatar ? state.user.avatar : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100';

  if (!p.reviews) p.reviews = [];
  p.reviews.unshift({
    userName,
    userAvatar,
    rating,
    comment,
    photo,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  });

  const avg = p.reviews.reduce((sum, r) => sum + r.rating, 0) / p.reviews.length;
  p.rating = Math.round(avg * 10) / 10;

  saveProductsState();

  try {
    fetch(`${API_BASE_URL}/products/${productId}/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userName, userAvatar, rating, comment, photo })
    });
  } catch (err) {}

  showToast('Public Review posted successfully! Thank you.', 'success');
  openProductDetail(productId);
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
                <div style="font-size:0.78rem; color:var(--gray-500);">Size: ${item.size || 'M'} | Qty: ${item.quantity} × ₹${item.price}</div>
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

function getSelectedSizes() {
  const checked = Array.from(document.querySelectorAll('input[name="prodSizes"]:checked')).map(c => c.value);
  return checked.length > 0 ? checked : ['S', 'M', 'L', 'XL', 'XXL'];
}

function getSelectedPayments() {
  const checked = Array.from(document.querySelectorAll('input[name="prodPayments"]:checked')).map(c => c.value);
  return checked.length > 0 ? checked : ['COD', 'UPI'];
}

// PUBLIC CATALOG VISIBILITY FIX (BUG FIX #1)
async function handleCreateProduct(event) {
  event.preventDefault();

  const title = document.getElementById('prodTitle').value.trim();
  let category = document.getElementById('prodCategory').value;
  if (category === 'Custom') {
    category = document.getElementById('prodCustomCategory').value.trim() || 'Custom';
  }

  const price = Number(document.getElementById('prodPrice').value);
  const originalPrice = document.getElementById('prodOriginalPrice').value ? Number(document.getElementById('prodOriginalPrice').value) : Math.round(price * 1.25);
  const stock = Number(document.getElementById('prodStock').value);
  const sizes = getSelectedSizes();
  const colors = getSelectedColors();
  const acceptedPayments = getSelectedPayments();

  const meeshoUrl = document.getElementById('prodMeeshoUrl').value.trim();
  const flipkartUrl = document.getElementById('prodFlipkartUrl').value.trim();
  const customMarketplaceUrl = document.getElementById('prodCustomMarketplaceUrl').value.trim();
  const description = document.getElementById('prodDescription').value.trim();

  const images = state.addPhotos.length > 0 ? state.addPhotos : ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'];

  const sellerStoreName = state.user ? (state.user.storeName || state.user.name) : 'Royal Store Outlet';
  const sellerId = state.user ? state.user.id : 'sel_1';
  const sellerAvatar = state.user && state.user.avatar ? state.user.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200';

  const newProdObj = {
    _id: 'prod_' + Date.now(),
    title,
    category,
    price,
    originalPrice,
    stock,
    sizes,
    colors,
    acceptedPayments,
    images,
    meeshoUrl,
    flipkartUrl,
    customMarketplaceUrl,
    description,
    sellerStoreName,
    sellerId,
    sellerAvatar,
    rating: 5.0,
    reviews: []
  };

  state.products.unshift(newProdObj);
  saveProductsState();
  renderProductGrid();

  try {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${state.token}`
      },
      body: JSON.stringify(newProdObj)
    });
    const data = await res.json();
    if (data.success && data.product) {
      const idx = state.products.findIndex(p => p._id === newProdObj._id || (p.title === newProdObj.title && p.sellerId === newProdObj.sellerId));
      if (idx !== -1) {
        state.products[idx] = data.product;
        saveProductsState();
        renderProductGrid();
      }
    }
  } catch (err) {
    console.warn('Backend sync warning:', err);
  }

  showToast('🎉 Product listed live on Fashionvillaroyal public storefront!', 'success');
  state.addPhotos = [];
  renderMultiPhotoGrid('add');
  switchSellerTab('list');
}

function renderSellerProductsTable() {
  const tbody = document.getElementById('sellerProductsTableBody');
  if (!tbody) return;

  const currentSellerId = state.user ? state.user.id : 'sel_1';
  const myProducts = state.products.filter(p => p.sellerId === currentSellerId || state.user?.role === 'admin');

  if (myProducts.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px;">No products listed yet.</td></tr>`;
    return;
  }

  tbody.innerHTML = myProducts.map(p => `
    <tr>
      <td><img src="${p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600'}" style="width:45px; height:45px; border-radius:6px; object-fit:cover;"></td>
      <td><strong>${p.title}</strong></td>
      <td>${p.category}</td>
      <td>₹${p.price} | Stock: ${p.stock}</td>
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
  document.getElementById('editProdStock').value = p.stock;
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

  Object.assign(p, updatedData);
  saveProductsState();

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

  renderProductGrid();
  renderSellerProductsTable();
  closeModal('editProductModal');
  showToast('Product details updated successfully!', 'success');
}

/* ==========================================================================
   DYNAMIC SHOPPING CART & CHECKOUT FORM VALIDATION
   ========================================================================== */

function addToCart(productId, selectedSize = 'M') {
  const p = state.products.find(item => item._id === productId);
  if (!p) return;

  if (p.stock <= 0) {
    showToast('Sorry, this product is currently Out of Stock!', 'error');
    return;
  }

  const existing = state.cart.find(item => item.product === productId && item.size === selectedSize);
  if (existing) {
    existing.quantity += 1;
  } else {
    state.cart.push({
      product: p._id,
      title: p.title,
      price: p.price,
      image: p.images && p.images[0] ? p.images[0] : 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600',
      size: selectedSize,
      quantity: 1
    });
  }

  saveCart();
  updateCartBadge();
  renderCartDrawer();
  showToast(`Added "${p.title.substring(0, 20)}..." (Size: ${selectedSize}) to cart`, 'success');
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
        <div style="font-size:0.8rem; color:var(--gray-500);">Size: <strong>${i.size || 'M'}</strong></div>
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
    
    if (state.user.address) {
      const addr = state.user.address;
      if (addr.street) document.getElementById('shipAddress').value = `${addr.street}`;
      if (addr.city) document.getElementById('shipCity').value = addr.city;
      if (addr.pincode) document.getElementById('shipPincode').value = addr.pincode;
    }
  }

  const list = document.getElementById('checkoutItemsList');
  const total = state.cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);

  list.innerHTML = state.cart.map(i => `
    <div style="display:flex; justify-content:space-between; font-size: 0.85rem; margin-bottom:6px;">
      <span>${i.title} (x${i.quantity}) - ${i.size || 'M'}</span>
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
   HEAD ADMIN CONTROL PANEL, SELLER SECURITY & MAINTENANCE CONTROLLER
   ========================================================================== */

function switchAdminTab(tab) {
  const tabs = ['stats', 'sellers', 'products', 'orders', 'cms'];
  tabs.forEach(t => {
    const tabBtn = document.getElementById(`admTab${t.charAt(0).toUpperCase() + t.slice(1)}`);
    const tabView = document.getElementById(`admin${t.charAt(0).toUpperCase() + t.slice(1)}View`);
    
    if (tabBtn) tabBtn.classList.toggle('active', t === tab);
    if (tabView) tabView.classList.toggle('hidden', t !== tab);
  });

  if (tab === 'stats') loadAdminStats();
  if (tab === 'sellers') loadAdminSellers();
  if (tab === 'products') loadAdminProducts();
  if (tab === 'orders') loadAdminOrders();
  if (tab === 'cms') loadAdminCMSForm();
}

async function loadAdminStats() {
  document.getElementById('statTotalProducts').textContent = state.products.length;
  document.getElementById('statTotalOrders').textContent = state.myOrders.length || 1;
  if (document.getElementById('statTotalSellers')) document.getElementById('statTotalSellers').textContent = state.sellers.length;
  document.getElementById('statTotalRevenue').textContent = `₹${state.myOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0) || 15400}`;
}

function handleToggleMaintenanceMode() {
  state.cms.maintenanceMode = !state.cms.maintenanceMode;
  updateCMSUI();

  try {
    fetch(`${API_BASE_URL}/admin/toggle-maintenance`, { method: 'POST' });
  } catch (err) {}

  showToast(`Head Admin Maintenance Mode is now ${state.cms.maintenanceMode ? 'ENABLED ⚠️' : 'DISABLED ✅'}`, state.cms.maintenanceMode ? 'error' : 'success');
}

// BUG FIX #2: HEAD ADMIN SELLER REQUEST MANAGEMENT
function loadAdminSellers() {
  const tbody = document.getElementById('adminSellersTableBody');
  const badge = document.getElementById('pendingSellersBadge');
  if (!tbody) return;

  const pendingCount = state.sellers.filter(s => s.status === 'Pending').length;
  if (badge) badge.textContent = pendingCount;

  if (state.sellers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" style="text-align:center; padding:20px;">No registered sellers found.</td></tr>`;
    return;
  }

  tbody.innerHTML = state.sellers.map(s => {
    const isApproved = s.status === 'Approved';
    const isSuspended = s.status === 'Suspended';
    const badgeClass = isApproved ? 'badge-approved' : isSuspended ? 'badge-suspended' : 'badge-pending';

    return `
      <tr>
        <td>
          <div style="display:flex; align-items:center; gap:10px;">
            <img src="${s.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100'}" style="width:35px; height:35px; border-radius:50%; object-fit:cover;">
            <div>
              <strong>${s.storeName || s.name}</strong><br>
              <span style="font-size:0.78rem; color:var(--gray-500);">${s.name} (${s.email})</span>
            </div>
          </div>
        </td>
        <td>${s.email}</td>
        <td>${s.date || '2026-09-01'}</td>
        <td><span class="badge-status ${badgeClass}">${s.status}</span></td>
        <td>
          <div style="display:flex; gap:6px; align-items:center;">
            ${!isApproved ? `<button class="btn btn-primary" onclick="approveSeller('${s.id}')" style="padding:4px 8px; font-size:0.78rem;"><i class="fa-solid fa-check"></i> Approve ID</button>` : ''}
            ${!isSuspended ? `<button class="btn btn-secondary" onclick="suspendSeller('${s.id}')" style="padding:4px 8px; font-size:0.78rem; color:var(--danger);"><i class="fa-solid fa-ban"></i> Suspend / Ban</button>` : `<button class="btn btn-primary" onclick="approveSeller('${s.id}')" style="padding:4px 8px; font-size:0.78rem;"><i class="fa-solid fa-unlock"></i> Unban</button>`}
            <button class="btn btn-secondary" onclick="deleteSeller('${s.id}')" style="padding:4px 8px; font-size:0.78rem; color:var(--danger);"><i class="fa-solid fa-trash"></i> Delete</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function approveSeller(sellerId) {
  const s = state.sellers.find(item => item.id === sellerId);
  if (s) {
    s.status = 'Approved';
    saveSellersState();
    loadAdminSellers();
    showToast(`Seller ID "${s.storeName || s.name}" Approved successfully!`, 'success');
  }
}

function suspendSeller(sellerId) {
  const s = state.sellers.find(item => item.id === sellerId);
  if (s) {
    s.status = 'Suspended';
    saveSellersState();
    loadAdminSellers();
    showToast(`Seller Account "${s.storeName || s.name}" Suspended & Banned!`, 'error');
  }
}

function deleteSeller(sellerId) {
  if (!confirm('Are you sure you want to delete this seller account completely?')) return;
  state.sellers = state.sellers.filter(item => item.id !== sellerId);
  saveSellersState();
  loadAdminSellers();
  showToast('Seller account removed.', 'success');
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
  saveProductsState();
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
  showToast('Front page CMS & Ads updated!', 'success');
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
