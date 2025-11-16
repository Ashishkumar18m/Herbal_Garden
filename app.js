

let listProductHTML = document.querySelector('.js-product-grid'); // Product grid
let listCartHTML = document.querySelector('.listCart'); // Cart items container
let iconCart = document.querySelector('.cart'); // Cart icon container
let iconCartSpan = document.querySelector('.cart-quantity'); // Cart item count
let body = document.querySelector('body');
let closeCart = document.querySelector('.close');
let products = [];
let cart = [];

// ==================== TOGGLE CART ====================
iconCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});
closeCart.addEventListener('click', () => {
    body.classList.toggle('showCart');
});

// ==================== ADD PRODUCTS TO PAGE ====================
const addDataToHTML = () => {
    listProductHTML.innerHTML = '';

    if (products.length > 0) {
        products.forEach(product => {
            let newProduct = document.createElement('div');
            // use product._id if present for unique dataset id fallback to product.id
            const dataId = product._id || product.id;
            newProduct.dataset.id = dataId;
            newProduct.classList.add('item');

            // Use name without spaces for index3 linking
            const nameHash = product.name ? product.name.replace(/\s+/g, '') : '';

            newProduct.innerHTML = `
                <div class="Tulsi">
                    <a href="index3.html#${nameHash}">
                        <img src="${product.image}" alt="${product.name}">
                    </a>

                    <div>
                        <h4>${product.name}</h4>
                        <div class="rating">
                            <div class="stars">
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star"></i>
                                <i class="fas fa-star-half-alt"></i>
                            </div>
                            <span class="rating-value">${product.rating?.stars ?? ''} (${product.rating?.review ?? 0})</span>
                        </div>
                        <p class="product-description">${product.description ?? ''}</p>

                        <div class="product-footer">
                            <div class="product-price">
                                $${Number(product.price).toFixed(2)} <span>$${Number(product.previous_price ?? product.price).toFixed(2)}</span>
                            </div>
                            <div>
                                <button class="add-to-cart js-add-to-cart" data-product-id="${dataId}">
                                    <i class="fas fa-shopping-cart"></i> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            listProductHTML.appendChild(newProduct);
        });
    }
};

// ==================== ADD TO CART ====================
listProductHTML.addEventListener('click', (event) => {
    let positionClick = event.target;

    if (positionClick.classList.contains('js-add-to-cart') ||
        positionClick.closest('.js-add-to-cart')) {

        let button = positionClick.closest('.js-add-to-cart');
        let id_product = button.dataset.productId;
        addToCart(id_product);
    }
});

const addToCart = (product_id) => {
    let positionThisProductInCart = cart.findIndex((value) => value.product_id == product_id);
    if (cart.length <= 0) {
        cart = [{
            product_id: product_id,
            quantity: 1
        }];
    } else if (positionThisProductInCart < 0) {
        cart.push({
            product_id: product_id,
            quantity: 1
        });
    } else {
        cart[positionThisProductInCart].quantity += 1;
    }
    addCartToHTML();
    addCartToMemory();
};

// ==================== SAVE CART TO LOCAL STORAGE ====================
const addCartToMemory = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// ==================== DISPLAY CART IN HTML ====================
const addCartToHTML = () => {
    listCartHTML.innerHTML = '';
    let totalQuantity = 0;
    let totalAmount = 0;

    if (cart.length > 0) {
        cart.forEach(item => {
            // find by _id or numeric id
            let positionProduct = products.findIndex((value) => {
                const dataId = value._id ? String(value._id) : String(value.id);
                return dataId == item.product_id;
            });
            let info = products[positionProduct];

            totalQuantity += item.quantity;
            totalAmount += Number(info.price) * item.quantity;

            let newItem = document.createElement('div');
            newItem.classList.add('item');
            newItem.dataset.id = item.product_id;

            newItem.innerHTML = `
                <div class="image">
                    <img src="${info.image}">
                </div>
                <div class="name">${info.name}</div>
                <div class="totalPrice">$${(info.price * item.quantity).toFixed(2)}</div>
                <div class="quantity">
                    <span class="minus">-</span>
                    <span>${item.quantity}</span>
                    <span class="plus">+</span>
                </div>
            `;
            listCartHTML.appendChild(newItem);
        });
    }

    // Update total quantity on cart icon
    iconCartSpan.innerText = totalQuantity;

    // Add total amount section at the bottom
    let totalSection = document.createElement('div');
    totalSection.classList.add('cart-total');
    totalSection.innerHTML = `
        <hr>
        <div class="total-amount-container">
            <span class="total-label">Total Amount:</span>
            <span class="total-value">$${totalAmount.toFixed(2)}</span>
        </div>
    `;
    listCartHTML.appendChild(totalSection);
};

// ==================== CHANGE CART QUANTITY ====================
listCartHTML.addEventListener('click', (event) => {
    let positionClick = event.target;
    if (positionClick.classList.contains('minus') || positionClick.classList.contains('plus')) {
        let product_id = positionClick.parentElement.parentElement.dataset.id;
        let type = positionClick.classList.contains('plus') ? 'plus' : 'minus';
        changeQuantityCart(product_id, type);
    }
});

const changeQuantityCart = (product_id, type) => {
    let positionItemInCart = cart.findIndex((value) => value.product_id == product_id);
    if (positionItemInCart >= 0) {
        let info = cart[positionItemInCart];
        if (type === 'plus') {
            info.quantity++;
        } else {
            info.quantity--;
            if (info.quantity <= 0) {
                cart.splice(positionItemInCart, 1);
            }
        }
    }
    addCartToHTML();
    addCartToMemory();
};

// ==================== INITIALIZE APP (fetch from backend) ====================
const initApp = () => {
    fetch('/api/products')
        .then(response => response.json())
        .then(data => {
            products = data;
            addDataToHTML();

            // Load cart from memory
            if (localStorage.getItem('cart')) {
                cart = JSON.parse(localStorage.getItem('cart'));
                addCartToHTML();
            }
        })
        .catch(err => {
            console.error('Failed to load products from API, falling back to local products.json', err);
            // fallback to local products.json if needed
            fetch('products.json')
                .then(r => r.json())
                .then(d => {
                    products = d;
                    addDataToHTML();
                    if (localStorage.getItem('cart')) {
                        cart = JSON.parse(localStorage.getItem('cart'));
                        addCartToHTML();
                    }
                });
        });
};

initApp();
