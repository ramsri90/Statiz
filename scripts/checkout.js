// Checkout Page Logic
const API = 'http://localhost:3000';

// Check authorization
if (!isLoggedIn()) {
  alert('Please login to checkout');
  window.location.href = 'login.html';
}

// Initialize checkout page
document.addEventListener('DOMContentLoaded', function() {
  initializeCheckout();
  setupFormValidation();
  setupFormSubmit();
});

/**
 * Initialize checkout page with cart data
 */
function initializeCheckout() {
  // Get cart from localStorage
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const userEmail = localStorage.getItem('userEmail');
  const userName = localStorage.getItem('userName');

  if (cart.length === 0) {
    alert('Your cart is empty');
    window.location.href = 'art-crafts.html';
    return;
  }

  // Populate form with user data
  if (userEmail) {
    document.getElementById('email').value = userEmail;
  }
  if (userName) {
    document.getElementById('fullName').value = userName;
  }

  // Display cart items and calculate totals
  displayCartItems(cart);
  calculateTotals(cart);
}

/**
 * Display cart items in order summary
 */
function displayCartItems(cart) {
  const cartItemsDiv = document.getElementById('cartItems');
  cartItemsDiv.innerHTML = '';

  // Group items by name
  const itemCounts = {};
  cart.forEach(item => {
    if (itemCounts[item.name]) {
      itemCounts[item.name].count++;
    } else {
      itemCounts[item.name] = { count: 1, price: item.price };
    }
  });

  // Display grouped items
  Object.entries(itemCounts).forEach(([name, data]) => {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'cart-item';
    itemDiv.innerHTML = `
      <div>
        <div class="item-name">${name}</div>
        <div class="item-qty">Qty: ${data.count} × ₹${data.price}</div>
      </div>
      <div class="item-price">₹${data.price * data.count}</div>
    `;
    cartItemsDiv.appendChild(itemDiv);
  });
}

/**
 * Calculate and display totals
 */
function calculateTotals(cart) {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  // Check if any item is >= 50 rupees
  const hasSpecialOffer = cart.some(item => item.price >= 50);
  
  // Apply 5% discount if any item is 50+ rupees
  let discount = 0;
  let discountText = '';
  if (hasSpecialOffer) {
    discount = Math.round(subtotal * 0.05);
    discountText = ' (5% Special Offer)';
  }
  
  // Add shipping charges if cart value < 50
  let shipping = 0;
  if (subtotal < 50) {
    shipping = 25;
  }
  
  const total = subtotal - discount + shipping;

  document.getElementById('subtotal').textContent = `₹${subtotal}`;
  
  // Show discount if applicable
  const discountRow = document.getElementById('discount');
  if (discountRow) {
    if (hasSpecialOffer) {
      discountRow.style.display = 'flex';
      discountRow.querySelector('span:last-child').textContent = `-₹${discount}${discountText}`;
    } else {
      discountRow.style.display = 'none';
    }
  }
  
  // Show shipping if applicable
  const shippingRow = document.getElementById('shipping');
  if (shippingRow) {
    if (shipping > 0) {
      shippingRow.style.display = 'flex';
      shippingRow.querySelector('span:last-child').textContent = `₹${shipping}`;
    } else {
      shippingRow.style.display = 'none';
      shippingRow.querySelector('span:last-child').textContent = 'FREE';
    }
  }
  
  document.getElementById('total').textContent = `₹${total}`;
}

/**
 * Setup form validation
 */
function setupFormValidation() {
  const cardInput = document.getElementById('cardNumber');
  const expiryInput = document.getElementById('expiry');
  const cvvInput = document.getElementById('cvv');
  const phoneInput = document.getElementById('phone');

  // Card number formatting
  cardInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    e.target.value = formattedValue;
  });

  // Expiry date formatting (MM/YY)
  expiryInput.addEventListener('input', function(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    e.target.value = value;
  });

  // CVV - only numbers
  cvvInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
  });

  // Phone - only numbers
  phoneInput.addEventListener('input', function(e) {
    e.target.value = e.target.value.replace(/\D/g, '');
  });
}

/**
 * Setup form submission
 */
function setupFormSubmit() {
  const form = document.getElementById('checkoutForm');
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    await submitOrder();
  });
}

/**
 * Submit order to API
 */
async function submitOrder() {
  const form = document.getElementById('checkoutForm');
  const submitBtn = document.querySelector('.btn-place-order');

  // Validate form
  if (!form.checkValidity()) {
    alert('Please fill all required fields correctly');
    return;
  }

  // Get cart and calculate totals
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  // Check if any item is >= 50 rupees for discount
  const hasSpecialOffer = cart.some(item => item.price >= 50);
  let discount = 0;
  if (hasSpecialOffer) {
    discount = Math.round(subtotal * 0.05);
  }
  
  // Add shipping charges if cart value < 50
  let shipping = 0;
  if (subtotal < 50) {
    shipping = 25;
  }
  
  const total = subtotal - discount + shipping;

  // Create order object
  const order = {
    orderDate: new Date().toISOString(),
    customerName: document.getElementById('fullName').value,
    customerEmail: document.getElementById('email').value,
    customerPhone: document.getElementById('phone').value,
    deliveryAddress: document.getElementById('address').value,
    city: document.getElementById('city').value,
    postalCode: document.getElementById('postalCode').value,
    items: cart,
    subtotal: subtotal,
    discount: discount,
    shipping: shipping,
    total: total,
    status: 'pending',
    paymentMethod: 'card',
    cardLast4: document.getElementById('cardNumber').value.slice(-4)
  };

  submitBtn.disabled = true;
  submitBtn.textContent = 'Processing...';

  try {
    // Send order to API
    const response = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    });

    if (response.ok) {
      const createdOrder = await response.json();
      
      // Clear cart
      localStorage.removeItem('cart');
      
      // Redirect to order confirmation
      window.location.href = `order-confirmation.html?orderId=${createdOrder.id}`;
    } else {
      alert('Failed to place order. Please try again.');
      submitBtn.disabled = false;
      submitBtn.textContent = 'Place Order';
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error placing order: ' + error.message);
    submitBtn.disabled = false;
    submitBtn.textContent = 'Place Order';
  }
}
