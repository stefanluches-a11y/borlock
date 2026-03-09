/**
 * lottery.js – Sistemul de loterie BorLock Lucky Discount
 * BorLock – Magazin online de tehnologie
 *
 * Funcționalitate:
 * - Se activează automat după autentificare
 * - 50% șansă de câștig
 * - Câștigătorul primește codul BORLOCK25 (25% reducere)
 * - Rezultatul se stochează în sessionStorage (o singură dată per sesiune)
 */

/* ============================================================
   CONSTANTE LOTERIE
   ============================================================ */
const LOTTERY_SESSION_KEY = 'borlock_lottery_done';    // Cheie sessionStorage
const LOTTERY_WIN_KEY = 'borlock_lottery_win';          // Cheie localStorage pentru câștig
const DISCOUNT_CODE = 'BORLOCK25';                       // Codul de reducere
const WIN_CHANCE = 0.5;                                  // 50% șansă de câștig

/* ============================================================
   LOGICA PRINCIPALĂ A LOTERIEI
   ============================================================ */

/**
 * Verifică dacă loteria a fost deja rulată în sesiunea curentă
 * @returns {boolean}
 */
function hasLotteryBeenRun() {
  return sessionStorage.getItem(LOTTERY_SESSION_KEY) === 'true';
}

/**
 * Rulează loteria și determină câștigătorul
 * @returns {boolean} true dacă utilizatorul câștigă
 */
function runLottery() {
  return Math.random() < WIN_CHANCE;
}

/**
 * Marchează loteria ca rulată în sesiunea curentă
 */
function markLotteryAsRun() {
  sessionStorage.setItem(LOTTERY_SESSION_KEY, 'true');
}

/**
 * Salvează câștigul în localStorage pentru utilizare ulterioară
 * @param {boolean} won – dacă utilizatorul a câștigat
 */
function saveLotteryResult(won) {
  if (won) {
    localStorage.setItem(LOTTERY_WIN_KEY, DISCOUNT_CODE);
  }
}

/* ============================================================
   AFIȘARE MODAL LOTERIE
   ============================================================ */

/**
 * Creează și injectează modalul de loterie în DOM
 */
function createLotteryModal() {
  // Elimină modalul existent dacă există
  const existing = document.getElementById('lottery-modal');
  if (existing) existing.remove();

  const modal = document.createElement('div');
  modal.id = 'lottery-modal';
  modal.className = 'lottery-modal-overlay';

  modal.innerHTML = `
    <div class="lottery-modal">
      <!-- Animație de încărcare loterie -->
      <div class="lottery-loading" id="lottery-loading">
        <div class="lottery-spinner">🎰</div>
        <h2>Se rulează loteria...</h2>
        <p>Ești în loteria BorLock Lucky Discount!</p>
        <div class="lottery-dots">
          <span></span><span></span><span></span>
        </div>
      </div>

      <!-- Rezultat câștig -->
      <div class="lottery-result" id="lottery-result" style="display:none;">
        <div class="lottery-result-icon" id="lottery-icon"></div>
        <h2 id="lottery-title"></h2>
        <p id="lottery-message"></p>
        <div id="lottery-code-container" style="display:none;">
          <div class="discount-code-box">
            <span id="lottery-code">${DISCOUNT_CODE}</span>
            <button class="btn-copy" onclick="copyDiscountCode()" title="Copiază codul">
              📋 Copiază
            </button>
          </div>
          <p class="code-info">Folosește acest cod la finalizarea comenzii pentru 25% reducere!</p>
        </div>
        <button class="btn-lottery-close" onclick="closeLotteryModal()">
          Continuă cumpărăturile →
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Previne scroll-ul în fundal
  document.body.style.overflow = 'hidden';
}

/**
 * Afișează rezultatul loteriei cu animații
 * @param {boolean} won – dacă utilizatorul a câștigat
 */
function showLotteryResult(won) {
  const loading = document.getElementById('lottery-loading');
  const result = document.getElementById('lottery-result');
  const icon = document.getElementById('lottery-icon');
  const title = document.getElementById('lottery-title');
  const message = document.getElementById('lottery-message');
  const codeContainer = document.getElementById('lottery-code-container');

  if (!loading || !result) return;

  // Ascunde loading-ul
  loading.style.display = 'none';
  result.style.display = 'flex';
  result.style.flexDirection = 'column';
  result.style.alignItems = 'center';

  if (won) {
    // Mesaj câștig
    icon.textContent = '🎉';
    icon.className = 'lottery-result-icon win-icon';
    title.textContent = 'Felicitări! Ai câștigat!';
    message.textContent = 'Ai câștigat un discount de 25%! Codul tău special:';
    codeContainer.style.display = 'block';

    // Adaugă confetti animation
    createConfetti();
  } else {
    // Mesaj pierdere
    icon.textContent = '😔';
    icon.className = 'lottery-result-icon lose-icon';
    title.textContent = 'Mai mult noroc data viitoare!';
    message.textContent = 'Nu ai câștigat de această dată, dar poți încerca din nou la următoarea autentificare. Continuă cumpărăturile!';
    codeContainer.style.display = 'none';
  }

  // Adaugă clasa de animație
  result.classList.add('result-show');
}

/**
 * Creează efectul de confetti pentru câștig
 */
function createConfetti() {
  const colors = ['#0066ff', '#00d4ff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
  const modal = document.querySelector('.lottery-modal');
  if (!modal) return;

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti-piece';
    confetti.style.cssText = `
      left: ${Math.random() * 100}%;
      background: ${colors[Math.floor(Math.random() * colors.length)]};
      animation-delay: ${Math.random() * 3}s;
      animation-duration: ${2 + Math.random() * 2}s;
      width: ${5 + Math.random() * 10}px;
      height: ${5 + Math.random() * 10}px;
      border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
    `;
    modal.appendChild(confetti);

    // Elimină confetti după animație
    setTimeout(() => confetti.remove(), 5000);
  }
}

/**
 * Copiază codul de reducere în clipboard
 */
function copyDiscountCode() {
  navigator.clipboard.writeText(DISCOUNT_CODE).then(() => {
    showToast('Codul a fost copiat! 📋', 'success');
  }).catch(() => {
    // Fallback pentru browsere mai vechi
    const el = document.createElement('textarea');
    el.value = DISCOUNT_CODE;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    showToast('Codul a fost copiat! 📋', 'success');
  });
}

/**
 * Închide modalul de loterie
 */
function closeLotteryModal() {
  const modal = document.getElementById('lottery-modal');
  if (modal) {
    modal.classList.add('fade-out');
    setTimeout(() => {
      modal.remove();
      document.body.style.overflow = '';
    }, 300);
  }
}

/* ============================================================
   FUNCȚIA PRINCIPALĂ – INIȚIALIZARE LOTERIE
   ============================================================ */

/**
 * Inițializează și rulează loteria după login
 * Se apelează din login.html după autentificarea cu succes
 */
function initLottery() {
  // Verifică dacă loteria a mai fost rulată în această sesiune
  if (hasLotteryBeenRun()) return;

  // Marchează loteria ca rulată
  markLotteryAsRun();

  // Creează modalul
  createLotteryModal();

  // Rulează loteria după un delay de 1.5 secunde (pentru efect dramatic)
  setTimeout(() => {
    const won = runLottery();
    saveLotteryResult(won);
    showLotteryResult(won);
  }, 2000);
}

/**
 * Verifică dacă utilizatorul are un cod de reducere salvat
 * Afișează badge-ul în navbar dacă există
 */
function checkSavedDiscount() {
  const discountCode = localStorage.getItem(LOTTERY_WIN_KEY);
  if (discountCode) {
    const discountBadge = document.getElementById('discount-badge');
    if (discountBadge) {
      discountBadge.style.display = 'inline-flex';
      discountBadge.title = `Ai codul de reducere: ${discountCode}`;
    }
  }
}

/* ============================================================
   INIȚIALIZARE LA ÎNCĂRCAREA PAGINII
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Verifică dacă există discount salvat și afișează badge-ul
  checkSavedDiscount();

  // Dacă suntem pe pagina de login și există un flag de login reușit,
  // inițializează loteria
  if (sessionStorage.getItem('borlock_just_logged_in') === 'true') {
    sessionStorage.removeItem('borlock_just_logged_in');
    initLottery();
  }
});
