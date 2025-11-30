// Use a global array for the cart, as data persistence will be handled by MongoDB/Firestore in a production app.
// For this client-side demo, we use localStorage as a mock persistence layer.
let cart = JSON.parse(localStorage.getItem('cart')) || []; 

/**
 * Saves the current cart array to browser's localStorage.
 */
function saveToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

/**
 * Updates the cart quantity display on the header.
 */
function updateCartQuantity() {
    let cartQuantity = 0;
    cart.forEach((item) => {
        cartQuantity += item.quantity;
    });
    
    document.querySelectorAll('.js-cart-quantity').forEach(element => {
        if (element) {
            element.textContent = cartQuantity;
        }
    });
}

/**
 * Adds a product to the cart or increments its quantity.
 * @param {string|number} productId - The ID of the product.
 * @param {number} quantity - The amount to add (default 1).
 */
function addToCart(productId, quantity = 1) {
    let matchingItem = cart.find(item => item.productId == productId);

    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity
        });
    }
    saveToStorage();
    updateCartQuantity();
    console.log(`Product ${productId} added to cart. Total items: ${cart.length}`);
}

// Initialize the cart quantity display on load
document.addEventListener('DOMContentLoaded', updateCartQuantity);

// Export/Make available globally for other scripts (like productOOP.js)
window.addToCart = addToCart;
window.cart = cart; 
window.updateCartQuantity = updateCartQuantity;
window.saveToStorage = saveToStorage;