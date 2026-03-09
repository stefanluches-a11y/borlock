/**
 * search.js – Sistem de căutare și filtrare produse
 * BorLock – Magazin online de tehnologie
 *
 * Funcționează pe products.html și categories.html
 * Filtrare în timp real fără server
 */

/* ============================================================
   VARIABILE DE STARE PENTRU FILTRARE
   ============================================================ */
let currentSearchTerm = '';      // Termenul de căutare curent
let currentCategory = 'all';     // Categoria selectată
let currentMinPrice = 0;         // Prețul minim
let currentMaxPrice = 99999;     // Prețul maxim
let currentSort = 'default';     // Sortare curentă

/* ============================================================
   FILTRARE ȘI SORTARE PRODUSE
   ============================================================ */

/**
 * Filtrează produsele pe baza criteriilor curente
 * @returns {Array} produsele filtrate
 */
function filterProducts() {
  return products.filter(product => {
    // Filtru după termen de căutare
    const searchMatch = currentSearchTerm === '' ||
      product.name.toLowerCase().includes(currentSearchTerm) ||
      product.category.toLowerCase().includes(currentSearchTerm) ||
      Object.values(product.specs).some(s =>
        s && s.toString().toLowerCase().includes(currentSearchTerm)
      );

    // Filtru după categorie
    const categoryMatch = currentCategory === 'all' ||
      product.category === currentCategory;

    // Filtru după preț
    const priceMatch = product.price >= currentMinPrice &&
      product.price <= currentMaxPrice;

    return searchMatch && categoryMatch && priceMatch;
  });
}

/**
 * Sortează produsele după criteriul selectat
 * @param {Array} productList – lista de produse de sortat
 * @returns {Array} produsele sortate
 */
function sortProducts(productList) {
  const sorted = [...productList];

  switch (currentSort) {
    case 'price-asc':
      // Preț crescător
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      // Preț descrescător
      return sorted.sort((a, b) => b.price - a.price);
    case 'name-asc':
      // Denumire A-Z
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'name-desc':
      // Denumire Z-A
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case 'rating':
      // Rating descrescător
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

/* ============================================================
   RANDARE REZULTATE
   ============================================================ */

/**
 * Randează produsele filtrate în container
 */
function renderFilteredProducts() {
  const container = document.getElementById('products-grid');
  const countEl = document.getElementById('results-count');

  if (!container) return;

  const filtered = filterProducts();
  const sorted = sortProducts(filtered);

  // Actualizează numărul de rezultate
  if (countEl) {
    countEl.textContent = `${sorted.length} produse găsite`;
  }

  if (sorted.length === 0) {
    // Niciun produs găsit
    container.innerHTML = `
      <div class="no-results">
        <div class="no-results-icon">🔍</div>
        <h3>Niciun produs găsit</h3>
        <p>Încearcă să modifici filtrele sau termenul de căutare.</p>
        <button class="btn-primary" onclick="resetFilters()">Resetează filtrele</button>
      </div>
    `;
    return;
  }

  // Randează cardurile produselor
  container.innerHTML = sorted.map(product => createProductCard(product)).join('');

  // Actualizează starea butoanelor de favorite
  updateFavoriteButtons();
}

/* ============================================================
   INIȚIALIZARE BARE DE FILTRARE
   ============================================================ */

/**
 * Inițializează bara de căutare cu event listeners
 */
function initSearchBar() {
  const searchInput = document.getElementById('search-input');
  const searchBtn = document.getElementById('search-btn');
  const clearBtn = document.getElementById('search-clear');

  if (searchInput) {
    // Căutare în timp real la fiecare tastă
    searchInput.addEventListener('input', (e) => {
      currentSearchTerm = e.target.value.toLowerCase().trim();

      // Afișează/ascunde butonul de ștergere
      if (clearBtn) {
        clearBtn.style.display = currentSearchTerm ? 'flex' : 'none';
      }

      renderFilteredProducts();
    });

    // Căutare la apăsare Enter
    searchInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        renderFilteredProducts();
      }
    });
  }

  // Buton căutare
  if (searchBtn) {
    searchBtn.addEventListener('click', () => {
      renderFilteredProducts();
    });
  }

  // Buton ștergere text
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) searchInput.value = '';
      currentSearchTerm = '';
      clearBtn.style.display = 'none';
      renderFilteredProducts();
    });
  }
}

/**
 * Inițializează filtrele de categorie
 */
function initCategoryFilter() {
  const categoryBtns = document.querySelectorAll('.filter-category-btn');
  const categorySelect = document.getElementById('category-filter');

  // Butoane de categorie (sidebar)
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;
      renderFilteredProducts();
    });
  });

  // Select dropdown pentru categorie
  if (categorySelect) {
    categorySelect.addEventListener('change', (e) => {
      currentCategory = e.target.value;
      renderFilteredProducts();
    });
  }
}

/**
 * Inițializează filtrele de preț
 */
function initPriceFilter() {
  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  const applyPriceBtn = document.getElementById('apply-price');
  const priceRange = document.getElementById('price-range');

  // Aplică filtrul de preț
  function applyPriceFilter() {
    if (minPriceInput) currentMinPrice = parseFloat(minPriceInput.value) || 0;
    if (maxPriceInput) currentMaxPrice = parseFloat(maxPriceInput.value) || 99999;
    renderFilteredProducts();
  }

  if (applyPriceBtn) {
    applyPriceBtn.addEventListener('click', applyPriceFilter);
  }

  // Slider preț
  if (priceRange) {
    priceRange.addEventListener('input', (e) => {
      currentMaxPrice = parseInt(e.target.value);
      const priceDisplay = document.getElementById('price-display');
      if (priceDisplay) priceDisplay.textContent = formatPrice(currentMaxPrice);
      renderFilteredProducts();
    });
  }
}

/**
 * Inițializează sortarea produselor
 */
function initSortFilter() {
  const sortSelect = document.getElementById('sort-select');

  if (sortSelect) {
    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      renderFilteredProducts();
    });
  }
}

/**
 * Setează o categorie din URL params și filtrează
 */
function initFromURLParams() {
  const urlParams = new URLSearchParams(window.location.search);
  const categoryParam = urlParams.get('category');

  if (categoryParam) {
    currentCategory = categoryParam;

    // Activează butonul corespunzător dacă există
    const categoryBtns = document.querySelectorAll('.filter-category-btn');
    categoryBtns.forEach(btn => {
      btn.classList.remove('active');
      if (btn.dataset.category === categoryParam) {
        btn.classList.add('active');
      }
    });

    // Actualizează dropdown-ul dacă există
    const categorySelect = document.getElementById('category-filter');
    if (categorySelect) categorySelect.value = categoryParam;
  }
}

/**
 * Resetează toate filtrele la valorile implicite
 */
function resetFilters() {
  currentSearchTerm = '';
  currentCategory = 'all';
  currentMinPrice = 0;
  currentMaxPrice = 99999;
  currentSort = 'default';

  // Resetează elementele UI
  const searchInput = document.getElementById('search-input');
  if (searchInput) searchInput.value = '';

  const categoryBtns = document.querySelectorAll('.filter-category-btn');
  categoryBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.category === 'all') btn.classList.add('active');
  });

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) sortSelect.value = 'default';

  const minPriceInput = document.getElementById('min-price');
  const maxPriceInput = document.getElementById('max-price');
  if (minPriceInput) minPriceInput.value = '';
  if (maxPriceInput) maxPriceInput.value = '';

  renderFilteredProducts();
}

/* ============================================================
   INIȚIALIZARE LA ÎNCĂRCAREA PAGINII
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Verifică dacă suntem pe o pagină cu grid de produse
  const productsGrid = document.getElementById('products-grid');
  if (!productsGrid) return;

  // Citește parametrii din URL (ex: ?category=Laptops)
  initFromURLParams();

  // Inițializează toate filtrele
  initSearchBar();
  initCategoryFilter();
  initPriceFilter();
  initSortFilter();

  // Randează produsele inițial
  renderFilteredProducts();
});
