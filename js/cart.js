/**
 * cart.js – Gestionarea coșului de cumpărături
 * BorLock – Magazin online de tehnologie
 *
 * Toate datele sunt stocate în localStorage sub cheia 'borlock_cart'
 * Format: [{ id: 1, quantity: 2 }, ...]
 */

/* ============================================================
   FUNCȚII PRINCIPALE PENTRU COȘUL DE CUMPĂRĂTURI
   ============================================================ */

/**
 * Obține toate produsele din coș cu detalii complete
 * @returns {Array} Array de obiecte { product, quantity }
 */
function getCartItems() {
  const cart = JSON.parse(localStorage.getItem('borlock_cart') || '[]');
  return cart
    .map(item => {
      const product = getProductById(item.id);
      return product ? { product, quantity: item.quantity } : null;
    })
    .filter(item => item !== null);
}

/**
 * Elimină un produs din coș după ID
 * @param {number} productId – ID-ul produsului de eliminat
 */
function removeFromCart(productId) {
  let cart = JSON.parse(localStorage.getItem('borlock_cart') || '[]');
  cart = cart.filter(item => item.id !== productId);
  localStorage.setItem('borlock_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart(); // Re-randează coșul
  showToast('Produsul a fost eliminat din coș.', 'info');
}

/**
 * Actualizează cantitatea unui produs din coș
 * @param {number} productId – ID-ul produsului
 * @param {number} delta – valoarea cu care se modifică (+1 sau -1)
 */
function updateQuantity(productId, delta) {
  let cart = JSON.parse(localStorage.getItem('borlock_cart') || '[]');
  const item = cart.find(i => i.id === productId);

  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      // Dacă cantitatea ajunge la 0, elimină produsul
      cart = cart.filter(i => i.id !== productId);
    }
  }

  localStorage.setItem('borlock_cart', JSON.stringify(cart));
  updateCartBadge();
  renderCart();
}

/**
 * Calculează totalul coșului
 * @returns {number} prețul total
 */
function calculateTotal() {
  const items = getCartItems();
  return items.reduce((total, item) => total + item.product.price * item.quantity, 0);
}

/**
 * Golește complet coșul de cumpărături
 */
function clearCart() {
  localStorage.removeItem('borlock_cart');
  updateCartBadge();
  renderCart();
}

/* ============================================================
   RANDARE COȘ PE PAGINA cart.html
   ============================================================ */

/**
 * Randează lista de produse din coș pe pagina cart.html
 */
function renderCart() {
  const cartContainer = document.getElementById('cart-items');
  const totalContainer = document.getElementById('cart-total');
  const emptyMessage = document.getElementById('cart-empty');
  const cartContent = document.getElementById('cart-content');

  if (!cartContainer) return; // Nu suntem pe pagina coșului

  const items = getCartItems();

  if (items.length === 0) {
    // Afișează mesajul de coș gol
    if (emptyMessage) emptyMessage.style.display = 'flex';
    if (cartContent) cartContent.style.display = 'none';
    return;
  }

  // Ascunde mesajul de coș gol, afișează conținut
  if (emptyMessage) emptyMessage.style.display = 'none';
  if (cartContent) cartContent.style.display = 'block';

  // Generează HTML pentru fiecare item din coș
  cartContainer.innerHTML = items.map(({ product, quantity }) => {
    const imgSrc = getProductImage(product);
    const discount = getDiscountPercent(product.price, product.oldPrice);

    return `
      <div class="cart-item" data-id="${product.id}">
        <img src="${imgSrc}" alt="${product.name}" class="cart-item-image">
        <div class="cart-item-info">
          <a href="product.html?id=${product.id}" class="cart-item-name">${product.name}</a>
          <div class="cart-item-category">${product.category}</div>
          <div class="cart-item-specs">
            ${product.specs.cpu !== 'N/A' ? `<span>CPU: ${product.specs.cpu}</span>` : ''}
            ${product.specs.ram !== 'N/A' ? `<span>RAM: ${product.specs.ram}</span>` : ''}
          </div>
        </div>
        <div class="cart-item-price">
          ${product.oldPrice ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>` : ''}
          <span class="current-price">${formatPrice(product.price)}</span>
          ${discount > 0 ? `<span class="discount-tag">-${discount}%</span>` : ''}
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="updateQuantity(${product.id}, -1)">−</button>
          <span class="qty-value">${quantity}</span>
          <button class="qty-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
        </div>
        <div class="cart-item-subtotal">
          <strong>${formatPrice(product.price * quantity)}</strong>
        </div>
        <button class="cart-item-remove" onclick="removeFromCart(${product.id})" title="Elimină">
          🗑️
        </button>
      </div>
    `;
  }).join('');

  // Actualizează totalul
  const total = calculateTotal();
  if (totalContainer) {
    totalContainer.innerHTML = `
      <div class="total-row">
        <span>Subtotal (${items.reduce((s, i) => s + i.quantity, 0)} produse):</span>
        <strong>${formatPrice(total)}</strong>
      </div>
      <div class="total-row">
        <span>Transport:</span>
        <strong class="free-shipping">GRATUIT</strong>
      </div>
      <div class="total-row total-final">
        <span>Total:</span>
        <strong class="final-price">${formatPrice(total)}</strong>
      </div>
    `;
  }
}

/* ============================================================
   SIMULARE COMANDĂ (CHECKOUT)
   ============================================================ */

/**
 * Simulează finalizarea comenzii
 */
function checkout() {
  const items = getCartItems();
  if (items.length === 0) {
    showToast('Coșul tău este gol!', 'error');
    return;
  }

  const total = calculateTotal();
  const orderNumber = 'BL' + Date.now().toString().slice(-6);

  // Afișează mesajul de confirmare
  const confirmationModal = document.getElementById('checkout-modal');
  if (confirmationModal) {
    document.getElementById('order-number').textContent = orderNumber;
    document.getElementById('order-total').textContent = formatPrice(total);
    confirmationModal.style.display = 'flex';
  }

  // Golește coșul după comandă
  clearCart();
}

/**
 * Închide modalul de confirmare comandă
 */
function closeCheckoutModal() {
  const modal = document.getElementById('checkout-modal');
  if (modal) modal.style.display = 'none';
}

/* ============================================================
   INIȚIALIZARE COȘ LA ÎNCĂRCAREA PAGINII
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Randează coșul dacă suntem pe pagina cart.html
  if (document.getElementById('cart-items')) {
    renderCart();
  }
});
