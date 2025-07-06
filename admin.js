// Admin credentials
const ADMIN_CREDENTIALS = {
    username: 'Admin123',
    password: 'Admin123'
};

// Check if user is authenticated
function isAuthenticated() {
    return sessionStorage.getItem('admin_authenticated') === 'true';
}

// Authenticate user
function authenticate(username, password) {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
        sessionStorage.setItem('admin_authenticated', 'true');
        return true;
    }
    return false;
}

// Logout user
function logout() {
    sessionStorage.removeItem('admin_authenticated');
    window.location.href = 'admin.html';
}

// Redirect if not authenticated
function checkAuth() {
    if (!isAuthenticated()) {
        window.location.href = 'admin.html';
    }
}

// Load products from main app
function loadProductsFromApp() {
    if (window.FitPickdApp) {
        return window.FitPickdApp.products;
    }
    
    // Fallback to localStorage
    const savedProducts = localStorage.getItem('fitpickd_products');
    return savedProducts ? JSON.parse(savedProducts) : [];
}

// Save products to main app
function saveProductsToApp(products) {
    if (window.FitPickdApp) {
        window.FitPickdApp.products = products;
        window.FitPickdApp.saveProducts();
    } else {
        localStorage.setItem('fitpickd_products', JSON.stringify(products));
    }
}

// Initialize admin login page
function initializeAdminLogin() {
    const loginForm = document.getElementById('admin-login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (authenticate(username, password)) {
                window.location.href = 'admin-dashboard.html';
            } else {
                alert('Invalid credentials. Please try again.');
            }
        });
    }
}

// Initialize admin dashboard
function initializeAdminDashboard() {
    checkAuth();
    
    let products = loadProductsFromApp();
    let editingProductId = null;
    
    // Navigation
    const navLinks = document.querySelectorAll('.admin-nav .nav-link');
    const sections = document.querySelectorAll('.admin-section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links and sections
            navLinks.forEach(l => l.parentElement.classList.remove('active'));
            sections.forEach(s => s.classList.remove('active'));
            
            // Add active class to clicked link
            this.parentElement.classList.add('active');
            
            // Show corresponding section
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).classList.add('active');
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Add product button
    const addProductBtn = document.getElementById('add-product-btn');
    const productFormContainer = document.getElementById('product-form-container');
    const productForm = document.getElementById('product-form');
    const formTitle = document.getElementById('form-title');
    const cancelProductBtn = document.getElementById('cancel-product-btn');
    
    if (addProductBtn) {
        addProductBtn.addEventListener('click', function() {
            editingProductId = null;
            formTitle.textContent = 'Add New Product';
            productForm.reset();
            productFormContainer.style.display = 'block';
            addProductBtn.style.display = 'none';
        });
    }
    
    if (cancelProductBtn) {
        cancelProductBtn.addEventListener('click', function() {
            productFormContainer.style.display = 'none';
            addProductBtn.style.display = 'block';
            productForm.reset();
            editingProductId = null;
        });
    }
    
    // Product form submission
    if (productForm) {
        productForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const productData = {
                name: formData.get('product-name'),
                description: formData.get('product-description'),
                price: parseFloat(formData.get('product-price')),
                image: formData.get('product-image'),
                category: formData.get('product-category'),
                sizes: Array.from(formData.getAll('sizes')),
                featured: formData.get('product-featured') === 'on',
                views: 0
            };
            
            if (editingProductId) {
                // Edit existing product
                const index = products.findIndex(p => p.id === editingProductId);
                if (index !== -1) {
                    productData.id = editingProductId;
                    productData.views = products[index].views;
                    products[index] = productData;
                }
            } else {
                // Add new product
                productData.id = Date.now();
                products.push(productData);
            }
            
            saveProductsToApp(products);
            displayProductsList();
            updateAnalytics();
            
            // Reset form
            this.reset();
            productFormContainer.style.display = 'none';
            addProductBtn.style.display = 'block';
            editingProductId = null;
            
            alert(editingProductId ? 'Product updated successfully!' : 'Product added successfully!');
        });
    }
    
    // Display products list
    function displayProductsList() {
        const productsList = document.getElementById('products-list');
        if (!productsList) return;
        
        productsList.innerHTML = products.map(product => `
            <div class="product-item">
                <img src="${product.image}" alt="${product.name}">
                <div class="product-details">
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    <p><strong>Category:</strong> ${product.category}</p>
                    <p><strong>Sizes:</strong> ${product.sizes.join(', ')}</p>
                    <p><strong>Featured:</strong> ${product.featured ? 'Yes' : 'No'}</p>
                    <p><strong>Views:</strong> ${product.views}</p>
                </div>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <div class="product-actions">
                    <button class="edit-btn" onclick="editProduct(${product.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="delete-btn" onclick="deleteProduct(${product.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
    }
    
    // Edit product
    window.editProduct = function(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;
        
        editingProductId = productId;
        formTitle.textContent = 'Edit Product';
        
        // Fill form with product data
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-description').value = product.description;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-image').value = product.image;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-featured').checked = product.featured;
        
        // Check size checkboxes
        document.querySelectorAll('input[name="sizes"]').forEach(checkbox => {
            checkbox.checked = product.sizes.includes(checkbox.value);
        });
        
        productFormContainer.style.display = 'block';
        addProductBtn.style.display = 'none';
    };
    
    // Delete product
    window.deleteProduct = function(productId) {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== productId);
            saveProductsToApp(products);
            displayProductsList();
            updateAnalytics();
            alert('Product deleted successfully!');
        }
    };
    
    // Search and filter products
    const searchInput = document.getElementById('search-products');
    const filterCategory = document.getElementById('filter-category');
    
    if (searchInput) {
        searchInput.addEventListener('input', filterProductsList);
    }
    
    if (filterCategory) {
        filterCategory.addEventListener('change', filterProductsList);
    }
    
    function filterProductsList() {
        let filteredProducts = [...products];
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const categoryFilter = filterCategory ? filterCategory.value : '';
        
        if (searchTerm) {
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm)
            );
        }
        
        if (categoryFilter) {
            filteredProducts = filteredProducts.filter(product =>
                product.category === categoryFilter
            );
        }
        
        const productsList = document.getElementById('products-list');
        if (productsList) {
            productsList.innerHTML = filteredProducts.map(product => `
                <div class="product-item">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="product-details">
                        <h4>${product.name}</h4>
                        <p>${product.description}</p>
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p><strong>Sizes:</strong> ${product.sizes.join(', ')}</p>
                        <p><strong>Featured:</strong> ${product.featured ? 'Yes' : 'No'}</p>
                        <p><strong>Views:</strong> ${product.views}</p>
                    </div>
                    <div class="product-price">₹${product.price.toLocaleString()}</div>
                    <div class="product-actions">
                        <button class="edit-btn" onclick="editProduct(${product.id})">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="delete-btn" onclick="deleteProduct(${product.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }
    
    // Update analytics
    function updateAnalytics() {
        const totalProducts = document.getElementById('total-products');
        const featuredProductsCount = document.getElementById('featured-products-count');
        const mostViewedProduct = document.getElementById('most-viewed-product');
        const categoriesCount = document.getElementById('categories-count');
        
        if (totalProducts) {
            totalProducts.textContent = products.length;
        }
        
        if (featuredProductsCount) {
            const featuredCount = products.filter(p => p.featured).length;
            featuredProductsCount.textContent = featuredCount;
        }
        
        if (mostViewedProduct) {
            const mostViewed = products.reduce((max, product) => 
                product.views > max.views ? product : max, { views: 0 }
            );
            mostViewedProduct.textContent = mostViewed.views > 0 ? mostViewed.name : 'No data';
        }
        
        if (categoriesCount) {
            const categories = new Set(products.map(p => p.category));
            categoriesCount.textContent = categories.size;
        }
    }
    
    // Export data
    const exportDataBtn = document.getElementById('export-data-btn');
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', function() {
            const dataStr = JSON.stringify(products, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'fitpickd-products.json';
            link.click();
            URL.revokeObjectURL(url);
        });
    }
    
    // Import data
    const importDataBtn = document.getElementById('import-data-btn');
    const importFile = document.getElementById('import-file');
    
    if (importDataBtn) {
        importDataBtn.addEventListener('click', function() {
            importFile.click();
        });
    }
    
    if (importFile) {
        importFile.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    try {
                        const importedProducts = JSON.parse(e.target.result);
                        if (Array.isArray(importedProducts)) {
                            products = importedProducts;
                            saveProductsToApp(products);
                            displayProductsList();
                            updateAnalytics();
                            alert('Products imported successfully!');
                        } else {
                            alert('Invalid file format. Please select a valid JSON file.');
                        }
                    } catch (error) {
                        alert('Error reading file. Please check the file format.');
                    }
                };
                reader.readAsText(file);
            }
        });
    }
    
    // Initialize dashboard
    displayProductsList();
    updateAnalytics();
}

// Initialize based on current page
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage === 'admin.html') {
        initializeAdminLogin();
    } else if (currentPage === 'admin-dashboard.html') {
        initializeAdminDashboard();
    }
}); 