// Shopping Cart Page Logic

document.addEventListener('DOMContentLoaded', function() {
  // Check authorization
  if (!isLoggedIn()) {
    alert('Please login to view cart');
    window.location.href = 'login.html';
    return;
  }

  loadCart();
  updateCartDisplay();
});

/**
 * Load and display cart items
 */
function loadCart() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (cart.length === 0) {
    document.querySelector('.cart-items-list').style.display = 'none';
    document.getElementById('emptyCart').style.display = 'flex';
    document.getElementById('cartSummary').style.display = 'none';
    return;
  }

  document.querySelector('.cart-items-list').style.display = 'block';
  document.getElementById('emptyCart').style.display = 'none';
  document.getElementById('cartSummary').style.display = 'block';
  displayCartItems(cart);
}

/**
 * Display cart items in table format
 */
function displayCartItems(cart) {
  const cartList = document.querySelector('.cart-items-list');
  cartList.innerHTML = '';

  // Group items by name for better display
  const itemMap = {};
  cart.forEach((item, index) => {
    if (itemMap[item.name]) {
      itemMap[item.name].count++;
      itemMap[item.name].indices.push(index);
    } else {
      itemMap[item.name] = {
        ...item,
        count: 1,
        indices: [index]
      };
    }
  });

  // Display each unique item
  Object.entries(itemMap).forEach(([name, item]) => {
    const cartItem = document.createElement('div');
    cartItem.className = 'cart-item';
    cartItem.innerHTML = `
      <div class="item-image">📦</div>
      <div class="item-details">
        <h3>${item.name}</h3>
        <p>Price: ₹${item.price}</p>
      </div>
      <div class="item-quantity">
        <button class="qty-btn" onclick="updateQuantity('${name}', -1)">−</button>
        <input type="number" class="qty-input" value="${item.count}" min="1" onchange="setQuantity('${name}', this.value)">
        <button class="qty-btn" onclick="updateQuantity('${name}', 1)">+</button>
      </div>
      <div class="item-price">₹${item.price * item.count}</div>
      <div class="item-remove">
        <button class="btn-remove" onclick="removeItem('${name}')">Remove</button>
      </div>
    `;
    cartList.appendChild(cartItem);
  });
}

/**
 * Update item quantity
 */
function updateQuantity(itemName, change) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Find item indices
  const indices = [];
  cart.forEach((item, index) => {
    if (item.name === itemName) {
      indices.push(index);
    }
  });

  if (change > 0) {
    // Add one item
    if (indices.length > 0) {
      cart.push(cart[indices[0]]);
    }
  } else if (change < 0) {
    // Remove one item
    if (indices.length > 0) {
      cart.splice(indices[indices.length - 1], 1);
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartDisplay();
}

/**
 * Set specific quantity
 */
function setQuantity(itemName, newQty) {
  const qty = parseInt(newQty) || 1;
  if (qty < 1) {
    removeItem(itemName);
    return;
  }

  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  // Find how many of this item currently exist
  const currentIndices = [];
  cart.forEach((item, index) => {
    if (item.name === itemName) {
      currentIndices.push(index);
    }
  });

  // Remove current items
  for (let i = currentIndices.length - 1; i >= 0; i--) {
    cart.splice(currentIndices[i], 1);
  }

  // Add new quantity
  if (currentIndices.length > 0) {
    const baseItem = cart.find(item => item.name === itemName);
    if (baseItem) {
      for (let i = 0; i < qty; i++) {
        cart.push({ ...baseItem });
      }
    }
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
  updateCartDisplay();
}

/**
 * Remove item from cart
 */
function removeItem(itemName) {
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart = cart.filter(item => item.name !== itemName);
  
  localStorage.setItem('cart', JSON.stringify(cart));
  
  if (cart.length === 0) {
    document.querySelector('.cart-items-list').style.display = 'none';
    document.getElementById('emptyCart').style.display = 'flex';
    document.getElementById('cartSummary').style.display = 'none';
  } else {
    loadCart();
  }
  
  updateCartDisplay();
}

/**
 * Update cart totals
 */
function updateCartDisplay() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  
  // Add shipping if cart value < 50
  let shipping = 0;
  if (subtotal < 50) {
    shipping = 25;
  }
  
  const total = subtotal + shipping;

  document.getElementById('subtotal').textContent = `₹${subtotal}`;
  
  // Update shipping display
  const shippingElement = document.getElementById('shipping');
  if (shippingElement) {
    if (shipping > 0) {
      shippingElement.textContent = `₹${shipping}`;
    } else {
      shippingElement.textContent = 'FREE';
    }
  }
  
  document.getElementById('total').textContent = `₹${total}`;
}

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }

  // Verify user is logged in
  if (!isLoggedIn()) {
    alert('Please login to checkout');
    window.location.href = 'login.html';
    return;
  }

  window.location.href = 'checkout.html';
}
