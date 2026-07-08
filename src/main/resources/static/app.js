// API Base URL (Relative since it's served by Spring Boot)
const API_BASE = '';

// DOM Elements
const navLinks = document.querySelectorAll('.nav-links li');
const sections = document.querySelectorAll('.content-section');
const modalOverlay = document.getElementById('modal-overlay');
const closeButtons = document.querySelectorAll('.close-modal');
const toast = document.getElementById('toast');
const toastIcon = document.getElementById('toast-icon');
const toastMessage = document.getElementById('toast-message');

// Navigation Logic
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        // Remove active class from all
        navLinks.forEach(nav => nav.classList.remove('active'));
        sections.forEach(sec => sec.classList.remove('active'));
        
        // Add active class to clicked link and corresponding section
        link.classList.add('active');
        const targetId = link.getAttribute('data-target');
        document.getElementById(targetId).classList.add('active');

        // Fetch data based on active tab
        loadDataForActiveTab(targetId);
    });
});

// Modal Logic
function openModal(modalId) {
    modalOverlay.classList.add('active');
    document.getElementById(modalId).classList.add('active');
}

function closeModal() {
    modalOverlay.classList.remove('active');
    document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));
}

closeButtons.forEach(btn => btn.addEventListener('click', closeModal));
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

// Toast Notification
function showToast(message, type = 'success') {
    toast.className = `toast glass-panel ${type} show`;
    toastIcon.textContent = type === 'success' ? 'check_circle' : 'error';
    toastMessage.textContent = message;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Data Fetching and Rendering
async function loadDataForActiveTab(sectionId) {
    try {
        if (sectionId === 'books-section') await loadBooks();
        if (sectionId === 'authors-section') await loadAuthors();
        if (sectionId === 'categories-section') await loadCategories();
        if (sectionId === 'customers-section') await loadCustomers();
    } catch (error) {
        showToast('Error loading data', 'error');
        console.error(error);
    }
}

// === BOOKS ===
async function loadBooks() {
    const res = await fetch(`${API_BASE}/books`);
    const books = await res.json();
    const tbody = document.querySelector('#books-table tbody');
    tbody.innerHTML = books.map(book => `
        <tr>
            <td>#${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author ? book.author.name : 'Unknown'}</td>
            <td>${book.category ? book.category.name : 'Unknown'}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteBook(${book.id})">
                    <span class="material-symbols-outlined" style="font-size: 18px">delete</span>
                </button>
            </td>
        </tr>
    `).join('');
}

async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) return;
    try {
        const res = await fetch(`${API_BASE}/books/${id}`, { method: 'DELETE' });
        if (res.ok) {
            showToast('Book deleted successfully');
            loadBooks();
        } else {
            showToast('Failed to delete book', 'error');
        }
    } catch(err) {
        showToast('Error deleting book', 'error');
    }
}

// Load dropdowns for book form
async function populateBookDropdowns() {
    try {
        const [authorsRes, categoriesRes] = await Promise.all([
            fetch(`${API_BASE}/authors`),
            fetch(`${API_BASE}/categories`)
        ]);
        const authors = await authorsRes.json();
        const categories = await categoriesRes.json();

        const authorSelect = document.getElementById('book-author');
        authorSelect.innerHTML = authors.map(a => `<option value="${a.id}">${a.name}</option>`).join('');

        const categorySelect = document.getElementById('book-category');
        categorySelect.innerHTML = categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
    } catch (error) {
        console.error("Failed to load dropdowns", error);
    }
}

document.getElementById('add-book-btn').addEventListener('click', () => {
    populateBookDropdowns();
    openModal('add-book-modal');
});

document.getElementById('add-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const title = document.getElementById('book-title').value;
    const authorId = document.getElementById('book-author').value;
    const categoryId = document.getElementById('book-category').value;

    try {
        const res = await fetch(`${API_BASE}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title,
                author: { id: authorId },
                category: { id: categoryId }
            })
        });
        if (res.ok) {
            showToast('Book added successfully');
            closeModal();
            loadBooks();
            e.target.reset();
        }
    } catch(err) {
        showToast('Failed to add book', 'error');
    }
});


// === AUTHORS ===
async function loadAuthors() {
    const res = await fetch(`${API_BASE}/authors`);
    const authors = await res.json();
    const tbody = document.querySelector('#authors-table tbody');
    tbody.innerHTML = authors.map(author => `
        <tr>
            <td>#${author.id}</td>
            <td>${author.name}</td>
            <td>${author.email}</td>
        </tr>
    `).join('');
}

document.getElementById('add-author-btn').addEventListener('click', () => openModal('add-author-modal'));

document.getElementById('add-author-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('author-name').value;
    const email = document.getElementById('author-email').value;

    try {
        const res = await fetch(`${API_BASE}/authors`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });
        if (res.ok) {
            showToast('Author added successfully');
            closeModal();
            loadAuthors();
            e.target.reset();
        }
    } catch(err) {
        showToast('Failed to add author', 'error');
    }
});


// === CATEGORIES ===
async function loadCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    const categories = await res.json();
    const tbody = document.querySelector('#categories-table tbody');
    tbody.innerHTML = categories.map(category => `
        <tr>
            <td>#${category.id}</td>
            <td>${category.name}</td>
        </tr>
    `).join('');
}

document.getElementById('add-category-btn').addEventListener('click', () => openModal('add-category-modal'));

document.getElementById('add-category-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('category-name').value;

    try {
        const res = await fetch(`${API_BASE}/categories`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });
        if (res.ok) {
            showToast('Category added successfully');
            closeModal();
            loadCategories();
            e.target.reset();
        }
    } catch(err) {
        showToast('Failed to add category', 'error');
    }
});


// === CUSTOMERS ===
async function loadCustomers() {
    const res = await fetch(`${API_BASE}/customers`);
    const customers = await res.json();
    const tbody = document.querySelector('#customers-table tbody');
    tbody.innerHTML = customers.map(customer => `
        <tr>
            <td>#${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
        </tr>
    `).join('');
}

document.getElementById('add-customer-btn').addEventListener('click', () => openModal('add-customer-modal'));

document.getElementById('add-customer-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('customer-name').value;
    const email = document.getElementById('customer-email').value;
    const phone = document.getElementById('customer-phone').value;
    const address = document.getElementById('customer-address').value;

    try {
        const res = await fetch(`${API_BASE}/customers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, phone, address })
        });
        if (res.ok) {
            showToast('Customer added successfully');
            closeModal();
            loadCustomers();
            e.target.reset();
        }
    } catch(err) {
        showToast('Failed to add customer', 'error');
    }
});

// Initialize first tab data
loadDataForActiveTab('books-section');
