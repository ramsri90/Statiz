// Authorization Utility Functions

/**
 * Check if user is logged in
 * @returns {boolean} true if user is logged in
 */
function isLoggedIn() {
  return localStorage.getItem('userEmail') !== null;
}

/**
 * Check if user is admin
 * @returns {boolean} true if user is admin
 */
function isAdmin() {
  return localStorage.getItem('isAdmin') === 'true';
}

/**
 * Get logged-in user email
 * @returns {string|null} user email or null
 */
function getUserEmail() {
  return localStorage.getItem('userEmail');
}

/**
 * Get logged-in user name
 * @returns {string|null} user name or null
 */
function getUserName() {
  return localStorage.getItem('userName');
}

/**
 * Require login - redirects to login page if not logged in
 * @returns {boolean} true if logged in
 */
function requireLogin() {
  if (!isLoggedIn()) {
    alert('Please login to continue');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * Require admin - redirects to login page if not admin
 * @returns {boolean} true if admin
 */
function requireAdmin() {
  if (!isAdmin()) {
    alert('Admin access required');
    window.location.href = 'login.html';
    return false;
  }
  return true;
}

/**
 * Logout current user
 */
function logoutUser() {
  localStorage.removeItem('isAdmin');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('userName');
  window.location.href = 'login.html';
}

/**
 * Toggle Light/Dark Theme
 */
function toggleTheme() {
  document.body.classList.toggle('light-mode');
  const isLight = document.body.classList.contains('light-mode');
  localStorage.setItem('theme', isLight ? 'light' : 'dark');
  
  const btn = document.getElementById('themeToggle');
  if (btn) btn.textContent = isLight ? '🌙' : '☀️';
}

/**
 * Initialize Theme
 */
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const btn = document.getElementById('themeToggle');
  
  if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
    if (btn) btn.textContent = '🌙';
  }
  
  if (btn) btn.addEventListener('click', toggleTheme);
}

/**
 * Update navbar to show user info
 */
function updateNavbarUserInfo() {
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');
  
  if (userEmail || userName) {
    const displayName = userName || userEmail;
    const hour = new Date().getHours();
    let greeting = 'Good Evening';
    if (hour < 12) greeting = 'Good Morning';
    else if (hour < 18) greeting = 'Good Afternoon';

    // 1. Update Navbar Greeting
    const navGreetingEl = document.querySelector('.nav-greeting');
    if (navGreetingEl) {
      navGreetingEl.textContent = `${greeting}, ${displayName}`;
    }

    // 2. Update Page Specific Greeting (e.g. My Orders)
    const pageGreetingEl = document.getElementById('userGreeting');
    if (pageGreetingEl) {
      pageGreetingEl.textContent = `${greeting}, ${displayName}`;
    }

    // 3. Update Navbar Buttons (Logout & Theme)
    const navButtons = document.querySelector('.nav-buttons');
    if (navButtons) {
      const currentHTML = navButtons.innerHTML;
      if (!currentHTML.includes('logout')) {
        navButtons.innerHTML = `
          <button id="themeToggle" class="nav-btn theme-btn">☀️</button>
          <button class="nav-btn logout">Logout</button>
        `;
        navButtons.querySelector('.logout').addEventListener('click', logoutUser);
        initTheme();
      }
    }
  }
}

/**
 * Highlight active nav link based on current URL
 */
function highlightActiveLink() {
  // Get current filename (e.g., index.html) or default to index.html for root
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPage) {
      link.classList.add('active');
    }
  });
}

// Run on DOM load
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateNavbarUserInfo();
  highlightActiveLink();
});
