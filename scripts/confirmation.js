// Order Confirmation Page Logic
const API = 'http://localhost:3000';

document.addEventListener('DOMContentLoaded', function() {
  loadOrderDetails();
});

/**
 * Load and display order details
 */
async function loadOrderDetails() {
  // Get order ID from URL
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');

  if (!orderId) {
    alert('Order not found');
    window.location.href = 'index.html';
    return;
  }

  try {
    // Fetch order details from API
    const response = await fetch(`${API}/orders/${orderId}`);
    
    if (!response.ok) {
      throw new Error('Order not found');
    }

    const order = await response.json();

    // Display order information
    displayOrderInfo(order);
  } catch (error) {
    console.error('Error loading order:', error);
    alert('Error loading order details');
    window.location.href = 'index.html';
  }
}

/**
 * Display order information on the page
 */
function displayOrderInfo(order) {
  // Order ID
  document.getElementById('orderId').textContent = `#${order.id}`;

  // Order Date
  const orderDate = new Date(order.orderDate);
  document.getElementById('orderDate').textContent = orderDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Display discount if applicable
  if (order.discount && order.discount > 0) {
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('discountAmount').textContent = `-₹${order.discount}`;
  }

  // Total Amount
  document.getElementById('totalAmount').textContent = `₹${order.total}`;

  // Delivery Details
  const deliveryInfo = `
    <strong>${order.customerName}</strong><br>
    ${order.deliveryAddress}<br>
    ${order.city}, ${order.postalCode}<br>
    Phone: ${order.customerPhone}
  `;
  document.getElementById('deliveryDetails').innerHTML = deliveryInfo;

  // Confirmation Email
  document.getElementById('confirmEmail').textContent = order.customerEmail;
}
