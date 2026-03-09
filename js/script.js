/**
 * script.js – Logică partajată și date produse
 * BorLock – Magazin online de tehnologie
 * Proiect Atestat IT, clasa a XII-a
 */

/* ============================================================
   DATE PRODUSE – Array cu toate produsele magazinului
   ============================================================ */
const products = [
  {
    id: 1,
    name: "Laptop ASUS VivoBook 15",
    category: "Laptops",
    price: 2499,
    oldPrice: 2999,
    specs: {
      cpu: "Intel Core i5-1235U",
      ram: "16GB DDR4",
      storage: "512GB SSD",
      gpu: "Intel Iris Xe",
      display: "15.6\" FHD IPS",
      os: "Windows 11"
    },
    description: "Laptop performant pentru uz zilnic, ideal pentru studenți și profesioniști. Procesor Intel de generația a 12-a, display Full HD IPS și baterie de lungă durată.",
    image: null,
    stock: 15,
    rating: 4.5,
    color: "#4a90d9"
  },
  {
    id: 2,
    name: "Laptop Lenovo IdeaPad 3",
    category: "Laptops",
    price: 1999,
    oldPrice: 2499,
    specs: {
      cpu: "AMD Ryzen 5 7520U",
      ram: "8GB DDR5",
      storage: "256GB SSD",
      gpu: "AMD Radeon 610M",
      display: "15.6\" FHD TN",
      os: "Windows 11"
    },
    description: "Laptop accesibil cu procesor AMD Ryzen, perfect pentru sarcini de birou și navigare web. Raport calitate-preț excelent.",
    image: null,
    stock: 8,
    rating: 4.0,
    color: "#e74c3c"
  },
  {
    id: 3,
    name: "Smartphone Samsung Galaxy A54",
    category: "Smartphones",
    price: 1499,
    oldPrice: 1799,
    specs: {
      cpu: "Exynos 1380",
      ram: "8GB",
      storage: "128GB",
      gpu: "Mali-G68",
      display: "6.4\" AMOLED 120Hz",
      camera: "50MP+12MP+5MP"
    },
    description: "Smartphone de top cu cameră de 50MP, display AMOLED 120Hz și baterie de 5000mAh. Ideal pentru fotografie și multimedia.",
    image: null,
    stock: 22,
    rating: 4.5,
    color: "#9b59b6"
  },
  {
    id: 4,
    name: "Smartphone iPhone 15",
    category: "Smartphones",
    price: 4499,
    oldPrice: 4999,
    specs: {
      cpu: "Apple A16 Bionic",
      ram: "6GB",
      storage: "128GB",
      gpu: "Apple GPU 5-core",
      display: "6.1\" Super Retina XDR",
      camera: "48MP+12MP"
    },
    description: "Cel mai nou iPhone cu chipset A16 Bionic, cameră de 48MP cu zoom 2x și Dynamic Island. Experiența Apple la cel mai înalt nivel.",
    image: null,
    stock: 5,
    rating: 5.0,
    color: "#2ecc71"
  },
  {
    id: 5,
    name: "Tabletă Samsung Galaxy Tab A9",
    category: "Tablete",
    price: 1299,
    oldPrice: 1499,
    specs: {
      cpu: "Snapdragon 695",
      ram: "4GB",
      storage: "64GB",
      gpu: "Adreno 619",
      display: "8.7\" LCD 60Hz",
      camera: "8MP"
    },
    description: "Tabletă compactă și ușoară, perfectă pentru conținut multimedia, citit și gaming casual. Display vibrant și autonomie excelentă.",
    image: null,
    stock: 12,
    rating: 4.0,
    color: "#1abc9c"
  },
  {
    id: 6,
    name: "Monitor LG 27\" IPS",
    category: "Monitoare",
    price: 1099,
    oldPrice: 1299,
    specs: {
      cpu: "N/A",
      ram: "N/A",
      storage: "N/A",
      gpu: "N/A",
      display: "27\" IPS FHD 75Hz",
      panel: "IPS, 1ms response"
    },
    description: "Monitor IPS de 27 inchi cu rezoluție Full HD, culori precise și unghi de vizualizare larg de 178°. Ideal pentru design și gaming.",
    image: null,
    stock: 7,
    rating: 4.5,
    color: "#e67e22"
  },
  {
    id: 7,
    name: "Placă video ASUS RTX 4060",
    category: "Componente PC",
    price: 1799,
    oldPrice: 2099,
    specs: {
      cpu: "N/A",
      ram: "8GB GDDR6",
      storage: "N/A",
      gpu: "NVIDIA RTX 4060",
      display: "N/A",
      tdp: "115W"
    },
    description: "Placă video NVIDIA RTX 4060 cu 8GB GDDR6, ray tracing în timp real și DLSS 3. Perfectă pentru gaming 1080p și 1440p.",
    image: null,
    stock: 4,
    rating: 5.0,
    color: "#27ae60"
  },
  {
    id: 8,
    name: "Procesor Intel Core i5-13400",
    category: "Componente PC",
    price: 899,
    oldPrice: 1099,
    specs: {
      cpu: "Intel Core i5-13400",
      ram: "N/A",
      storage: "N/A",
      gpu: "Intel UHD 730",
      display: "N/A",
      cores: "10 nuclee (6P+4E)"
    },
    description: "Procesor Intel de generația a 13-a cu 10 nuclee și frecvență boost de 4.6GHz. Ideal pentru workstations și gaming.",
    image: null,
    stock: 10,
    rating: 4.5,
    color: "#3498db"
  },
  {
    id: 9,
    name: "Tastatură mecanică Redragon K552",
    category: "Periferice",
    price: 299,
    oldPrice: 399,
    specs: {
      cpu: "N/A",
      ram: "N/A",
      storage: "N/A",
      gpu: "N/A",
      display: "N/A",
      switches: "Outemu Red"
    },
    description: "Tastatură mecanică TKL cu iluminare RGB și switch-uri Outemu Red. Design compact, perfect pentru gaming și programare.",
    image: null,
    stock: 30,
    rating: 4.0,
    color: "#c0392b"
  },
  {
    id: 10,
    name: "Căști gaming Razer BlackShark V2",
    category: "Gaming",
    price: 499,
    oldPrice: 699,
    specs: {
      cpu: "N/A",
      ram: "N/A",
      storage: "N/A",
      gpu: "N/A",
      display: "N/A",
      driver: "50mm Razer TriForce"
    },
    description: "Căști gaming cu sunet surround THX Spatial Audio, microfon HyperClear Cardioid și design ergonomic ultra-ușor.",
    image: null,
    stock: 18,
    rating: 4.5,
    color: "#8e44ad"
  },
  {
    id: 11,
    name: "Laptop HP Pavilion 15",
    category: "Laptops",
    price: 2899,
    oldPrice: 3299,
    specs: {
      cpu: "Intel Core i7-1255U",
      ram: "16GB DDR4",
      storage: "1TB SSD",
      gpu: "NVIDIA MX550 4GB",
      display: "15.6\" FHD IPS",
      os: "Windows 11"
    },
    description: "Laptop premium HP cu procesor i7 și placă video dedicată NVIDIA MX550. Ideal pentru multitasking, editing foto/video și gaming casual.",
    image: null,
    stock: 6,
    rating: 4.5,
    color: "#16a085"
  },
  {
    id: 12,
    name: "Boxă portabilă JBL Charge 5",
    category: "Audio",
    price: 799,
    oldPrice: 999,
    specs: {
      cpu: "N/A",
      ram: "N/A",
      storage: "N/A",
      gpu: "N/A",
      display: "N/A",
      battery: "20 ore autonomie"
    },
    description: "Boxă Bluetooth portabilă cu sunet puternic 40W, rezistentă la apă IP67 și funcție PowerBank. Bass profund și sunet 360°.",
    image: null,
    stock: 25,
    rating: 4.5,
    color: "#e74c3c"
  }
];

/* ============================================================
   FUNCȚII UTILITARE GENERALE
   ============================================================ */

/**
 * Generează HTML pentru stele de rating
 * @param {number} rating – valoarea ratingului (0-5)
 * @returns {string} HTML cu stele
 */
function renderStars(rating) {
  let starsHTML = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      starsHTML += '<span class="star filled">★</span>';
    } else if (i - 0.5 <= rating) {
      starsHTML += '<span class="star half">★</span>';
    } else {
      starsHTML += '<span class="star empty">☆</span>';
    }
  }
  return starsHTML;
}

/**
 * Generează imaginea placeholder pentru un produs (SVG inline)
 * @param {Object} product – obiectul produs
 * @returns {string} URL-ul imaginii (SVG data URI)
 */
function getProductImage(product) {
  // Generăm un SVG cu culoarea și numele produsului
  const color = product.color || '#0066ff';
  const name = product.name.substring(0, 20);
  const category = product.category;

  // Iconuri simple pentru categorii
  const icons = {
    'Laptops': '💻',
    'Smartphones': '📱',
    'Tablete': '📟',
    'Monitoare': '🖥️',
    'Componente PC': '🔧',
    'Periferice': '⌨️',
    'Audio': '🔊',
    'Gaming': '🎮'
  };
  const icon = icons[category] || '📦';

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200" viewBox="0 0 300 200">
    <rect width="300" height="200" fill="${color}" rx="8"/>
    <rect x="10" y="10" width="280" height="180" fill="rgba(255,255,255,0.1)" rx="6"/>
    <text x="150" y="90" font-family="Arial" font-size="48" text-anchor="middle" dominant-baseline="middle">${icon}</text>
    <text x="150" y="140" font-family="Arial" font-size="11" fill="white" text-anchor="middle" dominant-baseline="middle" font-weight="bold">${name}</text>
    <text x="150" y="160" font-family="Arial" font-size="9" fill="rgba(255,255,255,0.8)" text-anchor="middle" dominant-baseline="middle">${category}</text>
  </svg>`;

  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

/**
 * Calculează procentul de reducere
 * @param {number} price – prețul curent
 * @param {number} oldPrice – prețul vechi
 * @returns {number} procentul de reducere
 */
function getDiscountPercent(price, oldPrice) {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round((1 - price / oldPrice) * 100);
}

/**
 * Formatează prețul în RON
 * @param {number} price – prețul
 * @returns {string} prețul formatat
 */
function formatPrice(price) {
  return price.toLocaleString('ro-RO') + ' RON';
}

/**
 * Găsește un produs după ID
 * @param {number} id – ID-ul produsului
 * @returns {Object|undefined} produsul găsit
 */
function getProductById(id) {
  return products.find(p => p.id === parseInt(id));
}

/* ============================================================
   GENERARE CARD PRODUS
   ============================================================ */

/**
 * Creează HTML-ul pentru un card de produs
 * @param {Object} product – datele produsului
 * @returns {string} HTML-ul cardului
 */
function createProductCard(product) {
  const discount = getDiscountPercent(product.price, product.oldPrice);
  const imgSrc = getProductImage(product);
  const stars = renderStars(product.rating);
  const inStock = product.stock > 0;
  const specsPreview = Object.entries(product.specs)
    .filter(([k, v]) => v && v !== 'N/A')
    .slice(0, 2)
    .map(([k, v]) => `<span>${v}</span>`)
    .join('');

  return `
    <div class="product-card" data-id="${product.id}" data-category="${product.category}" data-name="${product.name.toLowerCase()}" data-price="${product.price}">
      ${discount > 0 ? `<div class="discount-badge">-${discount}%</div>` : ''}
      <a href="product.html?id=${product.id}" class="product-image-link">
        <img src="${imgSrc}" alt="${product.name}" class="product-image" loading="lazy">
      </a>
      <div class="product-info">
        <a href="product.html?id=${product.id}" class="product-name">${product.name}</a>
        <div class="product-rating">
          ${stars}
          <span class="rating-value">(${product.rating})</span>
        </div>
        <div class="product-specs-preview">${specsPreview}</div>
        <div class="product-pricing">
          ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
          <span class="current-price">${formatPrice(product.price)}</span>
        </div>
        <div class="product-stock ${inStock ? 'in-stock' : 'out-of-stock'}">
          ${inStock ? '✓ În stoc' : '✗ Stoc epuizat'}
        </div>
        <div class="product-actions">
          <button class="btn-cart" onclick="addToCart(${product.id})" ${!inStock ? 'disabled' : ''}>
            🛒 Adaugă în coș
          </button>
          <button class="btn-favorite" onclick="toggleFavorite(${product.id})" id="fav-btn-${product.id}" title="Favorite">
            ❤️
          </button>
          <button class="btn-compare" onclick="addToCompare(${product.id})" title="Compară">
            ⚖️
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ============================================================
   INIȚIALIZARE PAGINĂ – NAVBAR ȘI STARE ACTIVĂ
   ============================================================ */

/**
 * Setează link-ul activ în navbar în funcție de pagina curentă
 */
function setActiveNavLink() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-links a');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/**
 * Actualizează badge-ul cu numărul de produse din coș
 */
function updateCartBadge() {
  const cart = JSON.parse(localStorage.getItem('borlock_cart') || '[]');
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const badge = document.getElementById('cart-badge');
  if (badge) {
    badge.textContent = totalItems;
    badge.style.display = totalItems > 0 ? 'flex' : 'none';
  }
}

/**
 * Actualizează starea butoanelor de favorite
 */
function updateFavoriteButtons() {
  const favorites = JSON.parse(localStorage.getItem('borlock_favorites') || '[]');
  products.forEach(product => {
    const btn = document.getElementById(`fav-btn-${product.id}`);
    if (btn) {
      if (favorites.includes(product.id)) {
        btn.classList.add('active');
        btn.title = 'Elimină din favorite';
      } else {
        btn.classList.remove('active');
        btn.title = 'Adaugă la favorite';
      }
    }
  });
}

/* ============================================================
   MENIU MOBIL – HAMBURGER MENU
   ============================================================ */

/**
 * Inițializează meniul hamburger pentru mobil
 */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');

  if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('open');
    });

    // Închide meniul când se face click pe un link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('open');
      });
    });
  }
}

/* ============================================================
   NOTIFICĂRI TOAST
   ============================================================ */

/**
 * Afișează o notificare toast
 * @param {string} message – mesajul de afișat
 * @param {string} type – tipul: 'success', 'error', 'info'
 */
function showToast(message, type = 'success') {
  // Elimină toast-ul existent dacă există
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">✕</button>
  `;
  document.body.appendChild(toast);

  // Afișează toast-ul cu animație
  setTimeout(() => toast.classList.add('show'), 10);

  // Ascunde după 3 secunde
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ============================================================
   FUNCȚII GLOBALE – ADD TO CART, FAVORITES, COMPARE
   (Expuse global pentru a fi folosite din HTML)
   ============================================================ */

/**
 * Adaugă un produs în coș
 * @param {number} productId – ID-ul produsului
 */
function addToCart(productId) {
  const product = getProductById(productId);
  if (!product) return;

  let cart = JSON.parse(localStorage.getItem('borlock_cart') || '[]');
  const existingItem = cart.find(item => item.id === productId);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ id: productId, quantity: 1 });
  }

  localStorage.setItem('borlock_cart', JSON.stringify(cart));
  updateCartBadge();
  showToast(`"${product.name}" a fost adăugat în coș! 🛒`, 'success');
}

/**
 * Adaugă/elimină un produs din favorite
 * @param {number} productId – ID-ul produsului
 */
function toggleFavorite(productId) {
  const product = getProductById(productId);
  if (!product) return;

  let favorites = JSON.parse(localStorage.getItem('borlock_favorites') || '[]');
  const index = favorites.indexOf(productId);

  if (index === -1) {
    favorites.push(productId);
    showToast(`"${product.name}" a fost adăugat la favorite! ❤️`, 'success');
  } else {
    favorites.splice(index, 1);
    showToast(`"${product.name}" a fost eliminat din favorite.`, 'info');
  }

  localStorage.setItem('borlock_favorites', JSON.stringify(favorites));
  updateFavoriteButtons();
}

/**
 * Adaugă un produs în lista de comparare
 * @param {number} productId – ID-ul produsului
 */
function addToCompare(productId) {
  const product = getProductById(productId);
  if (!product) return;

  let compare = JSON.parse(localStorage.getItem('borlock_compare') || '[]');

  if (compare.includes(productId)) {
    showToast(`"${product.name}" este deja în lista de comparare.`, 'info');
    return;
  }

  if (compare.length >= 3) {
    showToast('Poți compara maximum 3 produse! Elimină un produs mai întâi.', 'error');
    return;
  }

  compare.push(productId);
  localStorage.setItem('borlock_compare', JSON.stringify(compare));
  showToast(`"${product.name}" a fost adăugat pentru comparare! ⚖️`, 'success');
}

/* ============================================================
   INIȚIALIZARE LA ÎNCĂRCAREA PAGINII
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setActiveNavLink();
  updateCartBadge();
  updateFavoriteButtons();
  initMobileMenu();
});
