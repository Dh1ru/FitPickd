// Product data structure
let products = [
    {
        id: 1,
        name: "Premium Cotton Shirt",
        description: "Classic fit cotton shirt perfect for any occasion",
        price: 2499,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
        category: "shirts",
        sizes: ["S", "M", "L", "XL", "XXL"],
        featured: true,
        views: 0
    },
    {
        id: 2,
        name: "Slim Fit Pants",
        description: "Modern slim fit pants with premium fabric",
        price: 1899,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        category: "pants",
        sizes: ["S", "M", "L", "XL"],
        featured: true,
        views: 0
    },
    {
        id: 3,
        name: "Casual Jacket",
        description: "Versatile casual jacket for everyday wear",
        price: 3499,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        category: "jackets",
        sizes: ["M", "L", "XL", "XXL"],
        featured: true,
        views: 0
    },
    {
        id: 4,
        name: "Leather Belt",
        description: "Premium leather belt with classic buckle",
        price: 899,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        category: "accessories",
        sizes: ["S", "M", "L"],
        featured: false,
        views: 0
    },
    {
        id: 5,
        name: "Denim Shirt",
        description: "Classic denim shirt with modern styling",
        price: 1999,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        category: "shirts",
        sizes: ["S", "M", "L", "XL"],
        featured: false,
        views: 0
    },
    {
        id: 6,
        name: "Chino Pants",
        description: "Comfortable chino pants for casual and formal wear",
        price: 1699,
        image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        category: "pants",
        sizes: ["S", "M", "L", "XL", "XXL"],
        featured: false,
        views: 0
    }
];

// Load products from localStorage if available
function loadProducts() {
    const savedProducts = localStorage.getItem('fitpickd_products');
    if (savedProducts) {
        products = JSON.parse(savedProducts);
    }
}

// Save products to localStorage
function saveProducts() {
    localStorage.setItem('fitpickd_products', JSON.stringify(products));
}

// Initialize products
loadProducts();

// Mobile navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }));
}

// Create product card HTML
function createProductCard(product) {
    const sizesHtml = product.sizes.map(size => `<span class="size-tag">${size}</span>`).join('');
    
    return `
        <div class="product-card" data-product-id="${product.id}">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₹${product.price.toLocaleString()}</div>
                <div class="product-sizes">${sizesHtml}</div>
                <button class="order-btn" onclick="orderProduct('${product.name}', ${product.price})">
                    DM to Order
                </button>
            </div>
        </div>
    `;
}

// Order product via WhatsApp
function orderProduct(productName, price) {
    const message = `Hi FitPickd! I'm interested in ordering the ${productName} for ₹${price.toLocaleString()}. Can you help me with the details?`;
    const whatsappUrl = `https://wa.me/9198765432100?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Track product view
    const product = products.find(p => p.name === productName);
    if (product) {
        product.views++;
        saveProducts();
    }
}

// Display featured products on homepage
function displayFeaturedProducts() {
    const featuredContainer = document.getElementById('featured-products');
    if (featuredContainer) {
        const featuredProducts = products.filter(product => product.featured).slice(0, 6);
        featuredContainer.innerHTML = featuredProducts.map(createProductCard).join('');
    }
}

// Display all products on shop page
function displayAllProducts(filteredProducts = null) {
    const productsContainer = document.getElementById('products-grid');
    if (productsContainer) {
        const productsToShow = filteredProducts || products;
        productsContainer.innerHTML = productsToShow.map(createProductCard).join('');
    }
}

// Filter and sort products
function filterProducts() {
    const categoryFilter = document.getElementById('category-filter');
    const sizeFilter = document.getElementById('size-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('search-products');

    if (!categoryFilter && !sizeFilter && !sortFilter && !searchInput) return;

    let filteredProducts = [...products];

    // Category filter
    if (categoryFilter && categoryFilter.value) {
        filteredProducts = filteredProducts.filter(product => product.category === categoryFilter.value);
    }

    // Size filter
    if (sizeFilter && sizeFilter.value) {
        filteredProducts = filteredProducts.filter(product => product.sizes.includes(sizeFilter.value));
    }

    // Search filter
    if (searchInput && searchInput.value) {
        const searchTerm = searchInput.value.toLowerCase();
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm)
        );
    }

    // Sort products
    if (sortFilter && sortFilter.value) {
        switch (sortFilter.value) {
            case 'price-low':
                filteredProducts.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filteredProducts.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
                break;
        }
    }

    displayAllProducts(filteredProducts);
}

// Contact form handling
function handleContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = formData.get('name');
            const product = formData.get('product');
            const size = formData.get('size');
            const phone = formData.get('phone');
            const message = formData.get('message');

            // Create WhatsApp message
            let whatsappMessage = `Hi FitPickd! I'm ${name} (${phone}).`;
            
            if (product) {
                whatsappMessage += ` I'm interested in: ${product}`;
                if (size) {
                    whatsappMessage += ` in size ${size}`;
                }
            }
            
            if (message) {
                whatsappMessage += `\n\nMessage: ${message}`;
            }

            const whatsappUrl = `https://wa.me/9198765432100?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(whatsappUrl, '_blank');
            
            // Reset form
            this.reset();
            alert('Thank you! We\'ll contact you soon on WhatsApp.');
        });
    }
}

// Initialize page-specific functionality
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch (currentPage) {
        case 'index.html':
        case '':
            displayFeaturedProducts();
            break;
        case 'shop.html':
            displayAllProducts();
            // Add event listeners for filters
            const categoryFilter = document.getElementById('category-filter');
            const sizeFilter = document.getElementById('size-filter');
            const sortFilter = document.getElementById('sort-filter');
            
            if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
            if (sizeFilter) sizeFilter.addEventListener('change', filterProducts);
            if (sortFilter) sortFilter.addEventListener('change', filterProducts);
            break;
        case 'contact.html':
            handleContactForm();
            break;
    }
}

// Lazy loading for images
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[loading="lazy"]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
    initializeLazyLoading();
    initializeSmoothScrolling();
    
    // Add scroll effect to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (navbar) {
            if (window.scrollY > 100) {
                navbar.style.backgroundColor = 'rgba(250, 249, 246, 0.98)';
            } else {
                navbar.style.backgroundColor = 'rgba(250, 249, 246, 0.95)';
            }
        }
    });
});

// Export functions for admin panel
window.FitPickdApp = {
    products,
    loadProducts,
    saveProducts,
    createProductCard,
    displayFeaturedProducts,
    displayAllProducts,
    filterProducts
}; 