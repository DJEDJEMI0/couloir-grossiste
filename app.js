// Couloir Grossiste - Application Logic

// Initial Data Setup
const DEFAULT_PRODUCTS = [
    {
        id: "prod-1",
        name: "T-shirt Premium Oversized Black",
        category: "tshirts",
        priceRetail: 6500,
        priceWholesale: 4500,
        image: "images/tshirt.png",
        description: "T-shirt premium en coton lourd 240g. Coupe oversized moderne avec col rond ajusté. Tissu doux et très résistant.",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: "prod-2",
        name: "Polo Chic Classic Navy",
        category: "polos",
        priceRetail: 8000,
        priceWholesale: 5500,
        image: "images/polo.png",
        description: "Polo de luxe classique en maille piquée double. Col et finitions de manches côtelés. Coupe ajustée élégante.",
        sizes: ["M", "L", "XL", "XXL"],
        inStock: true
    },
    {
        id: "prod-3",
        name: "Jogging Streetwear Fleece",
        category: "joggings",
        priceRetail: 12000,
        priceWholesale: 8500,
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?q=80&w=800",
        description: "Pantalon de jogging premium molletonné. Poches zippées latérales, cordon de serrage en métal poli et chevilles élastiquées.",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: "prod-4",
        name: "Ensemble Short & T-shirt Summer",
        category: "complets",
        priceRetail: 15000,
        priceWholesale: 10500,
        image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800",
        description: "Ensemble deux pièces assorties en coton léger respirant. Idéal pour un look décontracté et d'été.",
        sizes: ["S", "M", "L", "XL"],
        inStock: true
    },
    {
        id: "prod-5",
        name: "Sneakers Run Light White",
        category: "chaussures",
        priceRetail: 25000,
        priceWholesale: 18000,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=800",
        description: "Baskets running légères au design épuré. Semelle souple amortissante pour un confort quotidien inégalé.",
        sizes: ["40", "41", "42", "43", "44"],
        inStock: true
    },
    {
        id: "prod-6",
        name: "Casquette Signature Black",
        category: "casquettes",
        priceRetail: 4500,
        priceWholesale: 3000,
        image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=800",
        description: "Casquette de baseball en coton brossé. Fermeture en métal ajustable et logo brodé signature à l'avant.",
        sizes: ["Taille Unique"],
        inStock: true
    }
];

const DEFAULT_SETTINGS = {
    whatsapp: "22507088558338",
    adj_landmark: "Entre le Supermarché Bon Prix et le Supermarché Chic Shop",
    adj_schedule: "À partir de 06h30",
    yop_landmark: "Entre la Pharmacie Keneya et la Pharmacie Phénix",
    yop_schedule: "À partir de 06h30",
    hero_tagline: "La qualité fait la différence",
    hero_title: "COULOIR GROSSISTE",
    hero_desc: "Vente de vêtements de qualité supérieure en gros et au détail. Retrouvez nos collections exclusives et profitez d'arrivages réguliers à des prix défiant toute concurrence."
};

// Application State
let products = [];
let settings = {};
let cart = [];
let selectedCategory = "all";
let searchQuery = "";
let currentProductDetail = null;
let currentDetailSize = null;
let currentDetailQty = 1;

// Authentication State
let adminEmail = "";
let adminPassword = "";
let isAdminLoggedIn = false;
let authStep = 1; // 1: Email check, 2: Password check

// Elements Cache
const DOM = {
    toastContainer: document.getElementById('toast-container'),
    btnCartTrigger: document.getElementById('btn-cart-trigger'),
    cartCount: document.getElementById('cart-count'),
    cartDrawer: document.getElementById('cart-drawer'),
    cartOverlay: document.getElementById('cart-overlay'),
    btnCloseCart: document.getElementById('btn-close-cart'),
    cartItemsContainer: document.getElementById('cart-items-container'),
    summaryItemsCount: document.getElementById('summary-items-count'),
    summaryTotalPrice: document.getElementById('summary-total-price'),
    btnCheckoutWhatsapp: document.getElementById('btn-checkout-whatsapp'),
    
    // Catalog
    productsGrid: document.getElementById('products-grid'),
    filterCategories: document.getElementById('filter-categories'),
    searchBar: document.getElementById('search-bar'),
    
    // Info Cards
    adjLandmark: document.getElementById('adj-landmark'),
    adjSchedule: document.getElementById('adj-schedule'),
    yopLandmark: document.getElementById('yop-landmark'),
    yopSchedule: document.getElementById('yop-schedule'),
    heroTaglineText: document.getElementById('hero-tagline-text'),
    heroTitleText: document.getElementById('hero-title-text'),
    heroDescText: document.getElementById('hero-desc-text'),

    // Modals
    productDetailModal: document.getElementById('product-detail-modal'),
    closeDetailBackdrop: document.getElementById('close-detail-backdrop'),
    btnCloseDetail: document.getElementById('btn-close-detail'),
    detailTitle: document.getElementById('detail-title'),
    detailImg: document.getElementById('detail-img'),
    detailCategory: document.getElementById('detail-category'),
    detailProductName: document.getElementById('detail-product-name'),
    detailPrice: document.getElementById('detail-price'),
    detailWholesale: document.getElementById('detail-wholesale'),
    detailDesc: document.getElementById('detail-desc'),
    detailSizesContainer: document.getElementById('detail-sizes-container'),
    detailQtyVal: document.getElementById('detail-qty-val'),
    btnDetailQtyMinus: document.getElementById('btn-detail-qty-minus'),
    btnDetailQtyPlus: document.getElementById('btn-detail-qty-plus'),
    btnDetailAddCart: document.getElementById('btn-detail-add-cart'),

    // Admin Auth
    btnAdminTrigger: document.getElementById('btn-admin-trigger'),
    adminAuthModal: document.getElementById('admin-auth-modal'),
    closeAuthBackdrop: document.getElementById('close-auth-backdrop'),
    btnCloseAuth: document.getElementById('btn-close-auth'),
    adminAuthForm: document.getElementById('admin-auth-form'),
    authEmailGroup: document.getElementById('auth-email-group'),
    authEmail: document.getElementById('auth-email'),
    authPasswordGroup: document.getElementById('auth-password-group'),
    authPasswordLabel: document.getElementById('auth-password-label'),
    authPassword: document.getElementById('auth-password'),
    authInfoMessage: document.getElementById('auth-info-message'),
    btnAuthSubmit: document.getElementById('btn-auth-submit'),

    // Admin Dashboard
    adminDashboardModal: document.getElementById('admin-dashboard-modal'),
    closeDashboardBackdrop: document.getElementById('close-dashboard-backdrop'),
    btnCloseDashboard: document.getElementById('btn-close-dashboard'),
    btnAdminLogout: document.getElementById('btn-admin-logout'),
    adminTabButtons: document.querySelectorAll('.admin-tab-btn'),
    adminPanes: document.querySelectorAll('.admin-pane'),
    adminProductsList: document.getElementById('admin-products-list'),
    
    // Add/Edit Product
    btnAdminAddProduct: document.getElementById('btn-admin-add-product'),
    adminProductFormPane: document.getElementById('admin-product-form-pane'),
    btnAdminCancelProduct: document.getElementById('btn-admin-cancel-product'),
    adminProductForm: document.getElementById('admin-product-form'),
    formProductId: document.getElementById('form-product-id'),
    productFormTitle: document.getElementById('product-form-title'),
    prodName: document.getElementById('prod-name'),
    prodCategory: document.getElementById('prod-category'),
    prodPriceRetail: document.getElementById('prod-price-retail'),
    prodPriceWholesale: document.getElementById('prod-price-wholesale'),
    prodImg: document.getElementById('prod-img'),
    prodDesc: document.getElementById('prod-desc'),
    prodInStock: document.getElementById('prod-in-stock'),

    // Settings & Security
    adminSettingsForm: document.getElementById('admin-settings-form'),
    setWhatsapp: document.getElementById('set-whatsapp'),
    setAdjLandmark: document.getElementById('set-adj-landmark'),
    setAdjSchedule: document.getElementById('set-adj-schedule'),
    setYopLandmark: document.getElementById('set-yop-landmark'),
    setYopSchedule: document.getElementById('set-yop-schedule'),
    
    adminSecurityForm: document.getElementById('admin-security-form'),
    setAdminEmail: document.getElementById('set-admin-email'),
    setAdminPassword: document.getElementById('set-admin-password')
};

// Toast Notifications Helper
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 
        `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>` :
        `<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v2z"/></svg>`;
        
    toast.innerHTML = `${icon}<span>${message}</span>`;
    DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'none'; // reset animation for fade out
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-20px)';
        toast.style.transition = 'opacity 0.3s, transform 0.3s';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Data Synchronization
function loadData() {
    // Load products
    const storedProducts = localStorage.getItem('cg_products');
    if (storedProducts) {
        products = JSON.parse(storedProducts);
    } else {
        products = [...DEFAULT_PRODUCTS];
        localStorage.setItem('cg_products', JSON.stringify(products));
    }

    // Load settings
    const storedSettings = localStorage.getItem('cg_settings');
    if (storedSettings) {
        settings = JSON.parse(storedSettings);
    } else {
        settings = {...DEFAULT_SETTINGS};
        localStorage.setItem('cg_settings', JSON.stringify(settings));
    }

    // Load credentials
    adminEmail = localStorage.getItem('cg_admin_email') || "";
    adminPassword = localStorage.getItem('cg_admin_password') || "";

    // Load cart
    const storedCart = localStorage.getItem('cg_cart');
    if (storedCart) {
        cart = JSON.parse(storedCart);
    }

    updateStorefrontDOM();
}

function saveData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Update Storefront texts and configurations
function updateStorefrontDOM() {
    DOM.adjLandmark.textContent = settings.adj_landmark;
    DOM.adjSchedule.textContent = settings.adj_schedule;
    DOM.yopLandmark.textContent = settings.yop_landmark;
    DOM.yopSchedule.textContent = settings.yop_schedule;
    
    // Update Hero
    DOM.heroTaglineText.innerHTML = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
        </svg>
        ${settings.hero_tagline}
    `;
    DOM.heroTitleText.innerHTML = settings.hero_title.replace("GROSSISTE", `<span class="text-gradient">GROSSISTE</span>`);
    DOM.heroDescText.textContent = settings.hero_desc;
    
    renderCatalog();
    updateCartDOM();
}

// Render product catalog with filters and search
function renderCatalog() {
    DOM.productsGrid.innerHTML = "";
    
    const filtered = products.filter(p => {
        const matchesCategory = selectedCategory === "all" || p.category === selectedCategory;
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              p.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
        DOM.productsGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 48px; color: var(--text-muted);">
                Aucun produit trouvé dans cette catégorie.
            </div>
        `;
        return;
    }

    filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = "product-card glass";
        
        const stockBadge = p.inStock ? "" : `<span class="badge-tag badge-stock-out">Rupture</span>`;
        const actionButton = p.inStock ? 
            `<button class="btn-add-cart" onclick="openProductDetail('${p.id}')">Voir les détails</button>` :
            `<button class="btn-add-cart" disabled>Indisponible</button>`;

        card.innerHTML = `
            <div class="product-image">
                <img src="${p.image}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800'">
                <div class="product-badges">
                    <span class="badge-tag">Gros & Détail</span>
                    ${stockBadge}
                </div>
            </div>
            <div class="product-content">
                <span class="product-category">${p.category}</span>
                <h3 class="product-title">${p.name}</h3>
                <p class="product-description">${p.description}</p>
                <div class="product-pricing">
                    <div class="price-row retail">
                        <span>Détail :</span>
                        <strong>${p.priceRetail.toLocaleString()} FCFA</strong>
                    </div>
                    <div class="price-row">
                        <span>En Gros :</span>
                        <strong>${p.priceWholesale.toLocaleString()} FCFA</strong>
                    </div>
                </div>
                ${actionButton}
            </div>
        `;
        DOM.productsGrid.appendChild(card);
    });
}

// Cart Drawer operations
function updateCartDOM() {
    DOM.cartItemsContainer.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;

    if (cart.length === 0) {
        DOM.cartItemsContainer.innerHTML = `
            <div class="cart-empty">
                <svg viewBox="0 0 24 24"><path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm7 17H5V10h14v10zm-5-5H7v-2h7v2z"/></svg>
                <p>Votre panier est vide</p>
            </div>
        `;
        DOM.cartCount.textContent = "0";
        DOM.summaryItemsCount.textContent = "0";
        DOM.summaryTotalPrice.textContent = "0 FCFA";
        DOM.btnCheckoutWhatsapp.disabled = true;
        DOM.btnCheckoutWhatsapp.style.opacity = "0.5";
        return;
    }

    DOM.btnCheckoutWhatsapp.disabled = false;
    DOM.btnCheckoutWhatsapp.style.opacity = "1";

    cart.forEach((item, index) => {
        totalItems += item.qty;
        const itemTotal = item.price * item.qty;
        totalPrice += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = "cart-item";
        
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800'">
            </div>
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <span class="cart-item-meta">Taille: ${item.size} | ${item.price.toLocaleString()} FCFA</span>
                <div class="cart-item-qty">
                    <button class="btn-qty" onclick="changeCartQty(${index}, -1)">-</button>
                    <span>${item.qty}</span>
                    <button class="btn-qty" onclick="changeCartQty(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-item-price-actions">
                <button class="btn-remove-item" onclick="removeFromCart(${index})">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                    </svg>
                </button>
                <span class="cart-item-price">${itemTotal.toLocaleString()} FCFA</span>
            </div>
        `;
        DOM.cartItemsContainer.appendChild(cartItem);
    });

    DOM.cartCount.textContent = totalItems;
    DOM.summaryItemsCount.textContent = totalItems;
    DOM.summaryTotalPrice.textContent = `${totalPrice.toLocaleString()} FCFA`;
    saveData('cg_cart', cart);
}

function addToCart(productId, size, qty) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Determine price structure (retail by default, wholesale if bulk, here retail is general)
    const price = product.priceRetail;

    // Check if item exists in cart with same size
    const existingIndex = cart.findIndex(item => item.id === productId && item.size === size);

    if (existingIndex > -1) {
        cart[existingIndex].qty += qty;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            size: size,
            qty: qty,
            price: price,
            image: product.image
        });
    }

    updateCartDOM();
    showToast(`Produit ajouté au panier ! (${product.name} - ${size})`);
}

window.changeCartQty = function(index, delta) {
    if (index < 0 || index >= cart.length) return;
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
        cart.splice(index, 1);
    }
    updateCartDOM();
};

window.removeFromCart = function(index) {
    if (index < 0 || index >= cart.length) return;
    const name = cart[index].name;
    cart.splice(index, 1);
    updateCartDOM();
    showToast(`${name} retiré du panier.`, 'error');
};

// Checkout WhatsApp Pre-filled message generator
function checkoutWhatsApp() {
    if (cart.length === 0) return;
    
    let message = `Bonjour COULOIR GROSSISTE, je souhaite passer commande :\n\n`;
    let total = 0;
    
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        total += subtotal;
        message += `• *${item.name}* (Taille: ${item.size})\n  Quantité: ${item.qty} × ${item.price.toLocaleString()} FCFA = *${subtotal.toLocaleString()} FCFA*\n\n`;
    });
    
    message += `-----------------------------\n`;
    message += `Total Estimé : *${total.toLocaleString()} FCFA*\n`;
    message += `Merci de me confirmer la disponibilité des articles pour finaliser ma commande.`;

    const encodedText = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${settings.whatsapp}?text=${encodedText}`;
    
    window.open(whatsappUrl, '_blank');
}

// Product Details Modal operations
window.openProductDetail = function(id) {
    const product = products.find(p => p.id === id);
    if (!product) return;

    currentProductDetail = product;
    currentDetailQty = 1;
    
    DOM.detailImg.src = product.image;
    DOM.detailImg.onerror = function() {
        this.src = "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800";
    };
    DOM.detailCategory.textContent = product.category;
    DOM.detailProductName.textContent = product.name;
    DOM.detailPrice.textContent = `${product.priceRetail.toLocaleString()} FCFA`;
    DOM.detailWholesale.textContent = `Prix de gros : ${product.priceWholesale.toLocaleString()} FCFA (à partir de la quantité de gros)`;
    DOM.detailDesc.textContent = product.description;
    DOM.detailQtyVal.textContent = "1";

    // Setup sizes
    DOM.detailSizesContainer.innerHTML = "";
    if (product.sizes && product.sizes.length > 0) {
        currentDetailSize = product.sizes[0];
        product.sizes.forEach((s, i) => {
            const btn = document.createElement('button');
            btn.className = `size-btn ${i === 0 ? 'active' : ''}`;
            btn.textContent = s;
            btn.addEventListener('click', () => {
                document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentDetailSize = s;
            });
            DOM.detailSizesContainer.appendChild(btn);
        });
    } else {
        currentDetailSize = "Taille Unique";
        const btn = document.createElement('button');
        btn.className = "size-btn active";
        btn.textContent = "Unique";
        DOM.detailSizesContainer.appendChild(btn);
    }

    DOM.productDetailModal.classList.add('active');
};

function closeProductDetail() {
    DOM.productDetailModal.classList.remove('active');
    currentProductDetail = null;
}

// Admin panel Authentication logic
function openAdminAuth() {
    authStep = 1;
    DOM.authPasswordGroup.style.display = "none";
    DOM.authPassword.required = false;
    DOM.authEmail.disabled = false;
    DOM.authEmail.value = "";
    DOM.authPassword.value = "";
    DOM.btnAuthSubmit.textContent = "Continuer";
    
    // Check if credentials exist
    if (!adminEmail) {
        DOM.authInfoMessage.textContent = "C'est votre première connexion. Saisissez votre adresse e-mail pour l'enregistrer comme compte administrateur.";
    } else {
        DOM.authInfoMessage.textContent = "Entrez votre adresse e-mail d'administration pour continuer.";
    }

    DOM.adminAuthModal.classList.add('active');
}

function handleAdminAuthSubmit(e) {
    e.preventDefault();
    const emailInput = DOM.authEmail.value.trim().toLowerCase();
    
    // First setup
    if (!adminEmail) {
        if (authStep === 1) {
            authStep = 2;
            DOM.authEmail.disabled = true;
            DOM.authPasswordGroup.style.display = "block";
            DOM.authPassword.required = true;
            DOM.authPasswordLabel.textContent = "Créer un mot de passe administrateur";
            DOM.authInfoMessage.textContent = "Définissez maintenant le mot de passe pour cet e-mail.";
            DOM.btnAuthSubmit.textContent = "Créer le compte";
            DOM.authPassword.focus();
        } else {
            const passInput = DOM.authPassword.value;
            if (passInput.length < 4) {
                showToast("Le mot de passe doit comporter au moins 4 caractères.", "error");
                return;
            }
            adminEmail = emailInput;
            adminPassword = passInput;
            localStorage.setItem('cg_admin_email', adminEmail);
            localStorage.setItem('cg_admin_password', adminPassword);
            
            showToast("Compte administrateur créé avec succès !");
            loginAdmin();
        }
    } 
    // Existing Admin Account
    else {
        if (authStep === 1) {
            if (emailInput === adminEmail.toLowerCase()) {
                authStep = 2;
                DOM.authEmail.disabled = true;
                DOM.authPasswordGroup.style.display = "block";
                DOM.authPassword.required = true;
                DOM.authPasswordLabel.textContent = "Mot de passe d'accès";
                DOM.authInfoMessage.textContent = "Saisissez votre mot de passe pour ouvrir la session.";
                DOM.btnAuthSubmit.textContent = "Se connecter";
                DOM.authPassword.focus();
            } else {
                showToast("Adresse e-mail administrateur non reconnue.", "error");
            }
        } else {
            const passInput = DOM.authPassword.value;
            if (passInput === adminPassword) {
                showToast("Connexion d'administration réussie !");
                loginAdmin();
            } else {
                showToast("Mot de passe incorrect.", "error");
            }
        }
    }
}

function loginAdmin() {
    isAdminLoggedIn = true;
    DOM.adminAuthModal.classList.remove('active');
    
    // Open Dashboard
    openAdminDashboard();
}

function logoutAdmin() {
    isAdminLoggedIn = false;
    DOM.adminDashboardModal.classList.remove('active');
    showToast("Session administrateur fermée.", "error");
}

// Admin Dashboard Tabs & Pane control
function openAdminDashboard() {
    if (!isAdminLoggedIn) return;
    
    // Populate settings tab
    DOM.setWhatsapp.value = settings.whatsapp;
    DOM.setAdjLandmark.value = settings.adj_landmark;
    DOM.setAdjSchedule.value = settings.adj_schedule;
    DOM.setYopLandmark.value = settings.yop_landmark;
    DOM.setYopSchedule.value = settings.yop_schedule;
    
    // Populate security tab
    DOM.setAdminEmail.value = adminEmail;
    DOM.setAdminPassword.value = ""; // Don't prefill password plain text for security

    // Render Admin Products List
    renderAdminProductsList();
    
    // Reset tabs
    switchAdminTab("admin-products");

    DOM.adminDashboardModal.classList.add('active');
}

function switchAdminTab(tabId) {
    DOM.adminTabButtons.forEach(btn => {
        if (btn.getAttribute('data-tab') === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    DOM.adminPanes.forEach(pane => {
        if (pane.id === tabId) {
            pane.classList.add('active');
        } else {
            pane.classList.remove('active');
        }
    });

    // Hide product form sub-pane when switching main tabs
    if (tabId !== 'admin-products') {
        DOM.adminProductFormPane.classList.remove('active');
    }
}

function renderAdminProductsList() {
    DOM.adminProductsList.innerHTML = "";
    products.forEach((p, idx) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><img src="${p.image}" class="product-row-img" onerror="this.src='https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=80'"></td>
            <td style="font-weight: 600;">${p.name}</td>
            <td><span class="badge-tag">${p.category}</span></td>
            <td>Détail: ${p.priceRetail.toLocaleString()} F<br><span style="color:var(--text-muted)">Gros: ${p.priceWholesale.toLocaleString()} F</span></td>
            <td>${p.inStock ? '<span style="color:var(--success)">En Stock</span>' : '<span style="color:var(--danger)">Rupture</span>'}</td>
            <td>
                <div style="display: flex; gap: 8px;">
                    <button class="btn-action-small btn-action-edit" onclick="openEditProductForm('${p.id}')">Modifier</button>
                    <button class="btn-action-small btn-action-delete" onclick="deleteProduct('${p.id}')">Supprimer</button>
                </div>
            </td>
        `;
        DOM.adminProductsList.appendChild(row);
    });
}

// Delete product
window.deleteProduct = function(id) {
    if (!confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    
    products = products.filter(p => p.id !== id);
    saveData('cg_products', products);
    renderAdminProductsList();
    renderCatalog();
    showToast("Produit supprimé avec succès.", "error");
};

// Add & Edit Product Forms
window.openEditProductForm = function(id) {
    const p = products.find(prod => prod.id === id);
    if (!p) return;

    DOM.productFormTitle.textContent = "Modifier le Produit";
    DOM.formProductId.value = p.id;
    DOM.prodName.value = p.name;
    DOM.prodCategory.value = p.category;
    DOM.prodPriceRetail.value = p.priceRetail;
    DOM.prodPriceWholesale.value = p.priceWholesale;
    DOM.prodImg.value = p.image;
    DOM.prodDesc.value = p.description;
    DOM.prodInStock.checked = p.inStock;

    // Check sizes
    document.querySelectorAll('input[name="prod-sizes"]').forEach(cb => {
        cb.checked = p.sizes.includes(cb.value);
    });

    // Switch pane to form
    DOM.adminProductsList.closest('.admin-pane').classList.remove('active');
    DOM.adminProductFormPane.classList.add('active');
};

function openAddProductForm() {
    DOM.productFormTitle.textContent = "Ajouter un Produit";
    DOM.formProductId.value = "";
    DOM.prodName.value = "";
    DOM.prodCategory.value = "tshirts";
    DOM.prodPriceRetail.value = "";
    DOM.prodPriceWholesale.value = "";
    DOM.prodImg.value = "";
    DOM.prodDesc.value = "";
    DOM.prodInStock.checked = true;

    document.querySelectorAll('input[name="prod-sizes"]').forEach(cb => {
        cb.checked = ["S", "M", "L", "XL"].includes(cb.value);
    });

    DOM.adminProductsList.closest('.admin-pane').classList.remove('active');
    DOM.adminProductFormPane.classList.add('active');
}

function handleProductFormSubmit(e) {
    e.preventDefault();
    
    const id = DOM.formProductId.value;
    const name = DOM.prodName.value.trim();
    const category = DOM.prodCategory.value;
    const priceRetail = parseInt(DOM.prodPriceRetail.value);
    const priceWholesale = parseInt(DOM.prodPriceWholesale.value);
    const image = DOM.prodImg.value.trim() || "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800";
    const description = DOM.prodDesc.value.trim();
    const inStock = DOM.prodInStock.checked;
    
    const sizes = [];
    document.querySelectorAll('input[name="prod-sizes"]:checked').forEach(cb => {
        sizes.push(cb.value);
    });

    if (sizes.length === 0) {
        showToast("Sélectionnez au moins une taille.", "error");
        return;
    }

    if (id) {
        // Edit existing product
        const idx = products.findIndex(p => p.id === id);
        if (idx > -1) {
            products[idx] = { id, name, category, priceRetail, priceWholesale, image, description, sizes, inStock };
            showToast("Produit mis à jour !");
        }
    } else {
        // Create new product
        const newId = `prod-${Date.now()}`;
        products.push({ id: newId, name, category, priceRetail, priceWholesale, image, description, sizes, inStock });
        showToast("Produit ajouté avec succès !");
    }

    saveData('cg_products', products);
    
    // Return to list
    DOM.adminProductFormPane.classList.remove('active');
    document.getElementById('admin-products').classList.add('active');
    
    renderAdminProductsList();
    renderCatalog();
}

// Save site settings (land marks, timings, whatsapp number)
function handleSettingsSubmit(e) {
    e.preventDefault();
    
    settings.whatsapp = DOM.setWhatsapp.value.trim();
    settings.adj_landmark = DOM.setAdjLandmark.value.trim();
    settings.adj_schedule = DOM.setAdjSchedule.value.trim();
    settings.yop_landmark = DOM.setYopLandmark.value.trim();
    settings.yop_schedule = DOM.setYopSchedule.value.trim();
    
    saveData('cg_settings', settings);
    updateStorefrontDOM();
    
    showToast("Paramètres du site enregistrés !");
}

// Update security credentials (email, password)
function handleSecuritySubmit(e) {
    e.preventDefault();
    
    const newEmail = DOM.setAdminEmail.value.trim().toLowerCase();
    const newPass = DOM.setAdminPassword.value;
    
    if (newPass.length < 4) {
        showToast("Le mot de passe doit comporter au moins 4 caractères.", "error");
        return;
    }

    adminEmail = newEmail;
    adminPassword = newPass;
    localStorage.setItem('cg_admin_email', adminEmail);
    localStorage.setItem('cg_admin_password', adminPassword);
    
    DOM.setAdminPassword.value = "";
    showToast("Identifiants mis à jour !");
}

// Event Listeners Setup
function initEventListeners() {
    // Open/Close Cart Drawer
    DOM.btnCartTrigger.addEventListener('click', () => {
        DOM.cartDrawer.classList.add('active');
        DOM.cartOverlay.classList.add('active');
    });

    const closeCart = () => {
        DOM.cartDrawer.classList.remove('active');
        DOM.cartOverlay.classList.remove('active');
    };
    DOM.btnCloseCart.addEventListener('click', closeCart);
    DOM.cartOverlay.addEventListener('click', closeCart);

    // Filter Buttons
    DOM.filterCategories.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
            e.target.classList.add('active');
            selectedCategory = e.target.getAttribute('data-category');
            renderCatalog();
        }
    });

    // Search Bar input
    DOM.searchBar.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderCatalog();
    });

    // Product detail quantity modifiers
    DOM.btnDetailQtyMinus.addEventListener('click', () => {
        if (currentDetailQty > 1) {
            currentDetailQty--;
            DOM.detailQtyVal.textContent = currentDetailQty;
        }
    });

    DOM.btnDetailQtyPlus.addEventListener('click', () => {
        currentDetailQty++;
        DOM.detailQtyVal.textContent = currentDetailQty;
    });

    // Close detail modal
    const closeDetail = () => DOM.productDetailModal.classList.remove('active');
    DOM.btnCloseDetail.addEventListener('click', closeDetail);
    DOM.closeDetailBackdrop.addEventListener('click', closeDetail);

    // Add to cart from detail modal
    DOM.btnDetailAddCart.addEventListener('click', () => {
        if (currentProductDetail) {
            addToCart(currentProductDetail.id, currentDetailSize, currentDetailQty);
            closeDetail();
        }
    });

    // WhatsApp Checkout trigger
    DOM.btnCheckoutWhatsapp.addEventListener('click', checkoutWhatsApp);

    // Admin Auth Actions
    DOM.btnAdminTrigger.addEventListener('click', () => {
        if (isAdminLoggedIn) {
            openAdminDashboard();
        } else {
            openAdminAuth();
        }
    });

    const closeAuth = () => DOM.adminAuthModal.classList.remove('active');
    DOM.btnCloseAuth.addEventListener('click', closeAuth);
    DOM.closeAuthBackdrop.addEventListener('click', closeAuth);
    DOM.adminAuthForm.addEventListener('submit', handleAdminAuthSubmit);

    // Admin Dashboard Actions
    const closeDashboard = () => DOM.adminDashboardModal.classList.remove('active');
    DOM.btnCloseDashboard.addEventListener('click', closeDashboard);
    DOM.closeDashboardBackdrop.addEventListener('click', closeDashboard);
    DOM.btnAdminLogout.addEventListener('click', logoutAdmin);

    // Admin Tabs switching
    DOM.adminSidebar.addEventListener('click', (e) => {
        const btn = e.target.closest('.admin-tab-btn');
        if (btn && btn.id !== 'btn-admin-logout') {
            const tabId = btn.getAttribute('data-tab');
            switchAdminTab(tabId);
        }
    });

    // Add/Edit Product pane triggers
    DOM.btnAdminAddProduct.addEventListener('click', openAddProductForm);
    DOM.btnAdminCancelProduct.addEventListener('click', () => {
        DOM.adminProductFormPane.classList.remove('active');
        document.getElementById('admin-products').classList.add('active');
    });

    DOM.adminProductForm.addEventListener('submit', handleProductFormSubmit);
    DOM.adminSettingsForm.addEventListener('submit', handleSettingsSubmit);
    DOM.adminSecurityForm.addEventListener('submit', handleSecuritySubmit);
}

// Initialise Application
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initEventListeners();
});
