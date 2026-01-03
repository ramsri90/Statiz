// My Orders Page Logic
const API = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
  // Check authorization
  if (!isLoggedIn()) {
    alert('Please login to view orders');
    window.location.href = 'login.html';
    return;
  }

  loadUserOrders();
  updateGreeting();
});

/**
 * Update greeting with user name
 */
function updateGreeting() {
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const displayName = userName || userEmail;
  
  document.getElementById('userGreeting').textContent = `Welcome back, ${displayName}!`;
}

/**
 * Load user's orders from API
 */
async function loadUserOrders() {
  const userEmail = localStorage.getItem('userEmail');

  try {
    // Fetch all orders
    const response = await fetch(`${API}/orders?customerEmail=${userEmail}`);
    
    if (!response.ok) {
      throw new Error('Failed to load orders');
    }

    const orders = await response.json();

    if (orders.length === 0) {
      document.getElementById('ordersGrid').style.display = 'none';
      document.getElementById('emptyState').style.display = 'block';
    } else {
      displayOrders(orders);
    }
  } catch (error) {
    console.error('Error loading orders:', error);
    alert('Error loading orders: ' + error.message);
  }
}

/**
 * Display orders in grid format
 */
function displayOrders(orders) {
  const ordersGrid = document.getElementById('ordersGrid');
  ordersGrid.innerHTML = '';

  // Sort orders by date (newest first)
  orders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));

  orders.forEach(order => {
    const orderCard = createOrderCard(order);
    ordersGrid.appendChild(orderCard);
  });
}

/**
 * Create an order card element
 */
function createOrderCard(order) {
  const card = document.createElement('div');
  card.className = 'order-card';

  const orderDate = new Date(order.orderDate);
  const formattedDate = orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Create items list
  const itemsList = order.items
    .reduce((acc, item) => {
      const existing = acc.find(i => i.name === item.name);
      if (existing) {
        existing.count++;
      } else {
        acc.push({ name: item.name, count: 1 });
      }
      return acc;
    }, [])
    .map(item => `${item.name} x${item.count}`)
    .join('<br>');

  // Determine status color
  let statusClass = 'status-pending';
  if (order.status === 'delivered') statusClass = 'status-delivered';
  else if (order.status === 'shipped') statusClass = 'status-shipped';
  else if (order.status === 'cancelled') statusClass = 'status-cancelled';

  card.innerHTML = `
    <div class="order-header">
      <div class="order-id">Order #${order.id}</div>
      <div class="order-status ${statusClass}">${order.status.toUpperCase()}</div>
    </div>

    <div class="order-info">
      <div class="info-row">
        <span class="info-label">Order Date:</span>
        <span class="info-value">${formattedDate}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Delivery To:</span>
        <span class="info-value">${order.city}</span>
      </div>
      <div class="info-row">
        <span class="info-label">Items:</span>
        <span class="info-value">${order.items.length}</span>
      </div>
    </div>

    <div class="order-items">
      <div class="items-title">📦 Order Items</div>
      <div class="item-list">${itemsList}</div>
    </div>

    <div class="order-total">Total: ₹${order.total}</div>

    <div class="order-actions">
      <button class="btn-view" onclick="viewOrderDetails(${order.id})">View Details</button>
      <button class="btn-track" onclick="trackOrder(${order.id})">Track Order</button>
    </div>
  `;

  return card;
}

/**
 * View full order details
 */
async function viewOrderDetails(orderId) {
  try {
    const response = await fetch(`${API}/orders/${orderId}`);
    if (response.ok) {
      const order = await response.json();
      // Redirect to confirmation page with order ID
      window.location.href = `order-confirmation.html?orderId=${orderId}`;
    }
  } catch (error) {
    alert('Error loading order details');
  }
}

/**
 * Track order (can be expanded with tracking info)
 */
function trackOrder(orderId) {
  alert(`Tracking for Order #${orderId} - Coming Soon!\n\nYour order status will be updated as it progresses.`);
}
