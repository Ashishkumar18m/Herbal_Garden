// =========================================================
// 1. Object-Oriented Programming (OOP) Demonstration
// =========================================================

/**
 * Class representing a single Product Card UI component.
 * This satisfies the OOP requirement (using classes and objects to manage UI components).
 */
class ProductCard {
    constructor(productData) {
        this.data = productData;
    }

    // Method to generate the HTML for the product card
    render() {
        const product = this.data;
        // Generate star rating icons
        const stars = '★'.repeat(Math.floor(product.rating.stars)) + '☆'.repeat(5 - Math.floor(product.rating.stars));
        
        // Generate property tags
        const propertyTags = product.properties.map(prop => 
            `<span class="property"><i class="fas fa-tag"></i> ${prop}</span>`
        ).join('');

        return `
            <div class="item" data-id="${product.id}" data-properties="${product.properties.join(', ')}">
                <a href="/products/${product.id}"> 
                    <img src="${product.image}" alt="${product.name}" onerror="this.onerror=null;this.src='https://placehold.co/400x300?text=Plant'">
                </a>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="description">${product.description.substring(0, 80)}...</p>
                    <div class="rating">
                        <span class="stars">${stars}</span> (${product.rating.review} reviews)
                    </div>
                    <div class="properties-list">
                        ${propertyTags}
                    </div>
                    <div class="product-footer">
                        <div class="product-price">
                            $${product.price.toFixed(2)} <span>$${(product.previous_price || 0).toFixed(2)}</span>
                        </div>
                        <div>
                            <button class="add-to-cart js-add-to-cart" data-product-id="${product.id}">
                                <i class="fas fa-shopping-cart"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
}

// =========================================================
// 2. Client-Side Data Initialization and Rendering
// =========================================================

const productGrid = document.querySelector('.js-product-grid');
const rawProductData = document.getElementById('productData');
let allProducts = [];

try {
    // Parse the data passed from the EJS template (MongoDB data)
    allProducts = JSON.parse(rawProductData.textContent);
    renderProducts(allProducts);
} catch (error) {
    console.error("Error loading product data from EJS template:", error);
}

/**
 * Renders an array of products into the grid using the ProductCard class.
 * @param {Array} productsToRender - The array of product objects.
 */
function renderProducts(productsToRender) {
    if (!productGrid) return;
    productGrid.innerHTML = '';
    
    if (productsToRender.length === 0) {
        productGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
        return;
    }

    let productsHTML = productsToRender.map(product => {
        // Create a new instance of the ProductCard class for each product
        const card = new ProductCard(product);
        return card.render();
    }).join('');

    productGrid.innerHTML = productsHTML;

    // Re-attach event listeners for "Add to Cart"
    document.querySelectorAll('.js-add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.dataset.productId;
            // Assuming cartManager.js is loaded and defines addToCart
            if (typeof addToCart === 'function') {
                addToCart(productId); 
            } else {
                console.error("Cart manager function not available.");
            }
        });
    });
}

// =========================================================
// 3. Website Interactivity: Search/Filter
// =========================================================

/**
 * Filters the product list based on search input and property dropdown.
 */
function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const propertyFilter = document.getElementById('propertyFilter').value;

    const filteredProducts = allProducts.filter(product => {
        // 1. Search filter: Check name or description
        const matchesSearch = product.name.toLowerCase().includes(searchInput) ||
                              product.description.toLowerCase().includes(searchInput);

        // 2. Property filter: Check property array
        const matchesProperty = propertyFilter === 'all' || product.properties.includes(propertyFilter);
        
        return matchesSearch && matchesProperty;
    });

    renderProducts(filteredProducts);
}

// Attach filterProducts to the global window object so it can be called from EJS
window.filterProducts = filterProducts;
