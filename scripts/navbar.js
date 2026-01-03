// Hamburger Menu Toggle
document.addEventListener('DOMContentLoaded', function() {
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const dropdowns = document.querySelectorAll('.dropdown');

  if (hamburger) {
    hamburger.addEventListener('click', function() {
      navMenu.classList.toggle('active');
    });
  }

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-link, .dropdown-item');
  navLinks.forEach(link => {
    link.addEventListener('click', function() {
      navMenu.classList.remove('active');
    });
  });

  // Handle dropdown menus on mobile
  dropdowns.forEach(dropdown => {
    const toggleBtn = dropdown.querySelector('.nav-link');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', function(e) {
        e.preventDefault();
        dropdown.classList.toggle('active');
      });
    }
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', function(e) {
    dropdowns.forEach(dropdown => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
      }
    });
  });

  // Update cart count in navbar
  updateNavbarCartCount();

  // Listen for cart changes
  window.addEventListener('storage', updateNavbarCartCount);

  // Update navbar with logged-in user info
  const userEmail = localStorage.getItem('userEmail');
  const isAdmin = localStorage.getItem('isAdmin');
  
  if (userEmail || isAdmin) {
    const userName = localStorage.getItem('userName') || userEmail;
    const navButtons = document.querySelector('.nav-buttons');
    
    // Check if this is not login page (avoid double user display)
    if (navButtons && !navButtons.innerHTML.includes('👤')) {
      const currentHTML = navButtons.innerHTML;
      if (!currentHTML.includes('Logout') && !currentHTML.includes('Back')) {
        navButtons.innerHTML = `
          <span style="color: #fff; margin-right: 10px; font-size: 14px;">👤 ${userName}</span>
          <button class="nav-btn logout">Logout</button>
        `;
        
        // Re-attach logout listener
        navButtons.querySelector('.logout').addEventListener('click', function() {
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userName');
          window.location.href = 'login.html';
        });
      }
    }
  }

  // Handle logout button if it exists
  const logoutBtn = document.querySelector('.nav-btn.logout');
  if (logoutBtn && !logoutBtn.hasListener) {
    logoutBtn.addEventListener('click', function() {
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      window.location.href = 'login.html';
    });
    logoutBtn.hasListener = true;
  }
});

/**
 * Update cart count in navbar
 */
function updateNavbarCartCount() {
  const cartCountElement = document.getElementById('navCartCount');
  if (cartCountElement) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    cartCountElement.textContent = cart.length;
    
    // Hide count if 0
    if (cart.length === 0) {
      cartCountElement.style.display = 'none';
    } else {
      cartCountElement.style.display = 'flex';
    }
  }
}
