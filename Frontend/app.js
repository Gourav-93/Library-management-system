const API_BASE_URL = 'http://localhost:8080';

// Generic Fetch Function
async function apiCall(endpoint, method = 'GET', body = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        if (!response.ok) {
            throw new Error(`API call failed: ${response.statusText}`);
        }
        // DELETE requests might not return JSON or might return plain text
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
            return await response.json();
        } else {
            return await response.text();
        }
    } catch (error) {
        console.error('API Error:', error);
        alert('An error occurred. Check console for details.');
        throw error;
    }
}

// ==========================================
// Authors
// ==========================================
async function loadAuthors() {
    const loader = document.getElementById('loader');
    const tableBody = document.getElementById('authorsTableBody');
    if(!tableBody) return;

    loader.style.display = 'block';
    const authors = await apiCall('/authors');
    loader.style.display = 'none';

    tableBody.innerHTML = '';
    
    if(authors.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="empty-state">No authors found.</td></tr>';
        return;
    }

    authors.forEach(author => {
        const row = `<tr>
            <td>${author.id}</td>
            <td>${author.name}</td>
            <td>${author.email || 'N/A'}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function addAuthor(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;

    await apiCall('/authors', 'POST', { name, email });
    document.getElementById('addAuthorForm').reset();
    loadAuthors();
}

// ==========================================
// Categories
// ==========================================
async function loadCategories() {
    const loader = document.getElementById('loader');
    const tableBody = document.getElementById('categoriesTableBody');
    if(!tableBody) return;

    loader.style.display = 'block';
    const categories = await apiCall('/categories');
    loader.style.display = 'none';

    tableBody.innerHTML = '';
    
    if(categories.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="2" class="empty-state">No categories found.</td></tr>';
        return;
    }

    categories.forEach(category => {
        const row = `<tr>
            <td>${category.id}</td>
            <td>${category.name}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function addCategory(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;

    await apiCall('/categories', 'POST', { name });
    document.getElementById('addCategoryForm').reset();
    loadCategories();
}

// ==========================================
// Customers
// ==========================================
async function loadCustomers() {
    const loader = document.getElementById('loader');
    const tableBody = document.getElementById('customersTableBody');
    if(!tableBody) return;

    loader.style.display = 'block';
    const customers = await apiCall('/customers');
    loader.style.display = 'none';

    tableBody.innerHTML = '';
    
    if(customers.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No customers found.</td></tr>';
        return;
    }

    customers.forEach(customer => {
        const row = `<tr>
            <td>${customer.id}</td>
            <td>${customer.name}</td>
            <td>${customer.email}</td>
            <td>${customer.phone}</td>
            <td>${customer.address}</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function addCustomer(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;

    await apiCall('/customers', 'POST', { name, email, phone, address });
    document.getElementById('addCustomerForm').reset();
    loadCustomers();
}

// ==========================================
// Books
// ==========================================
async function loadBooks() {
    const loader = document.getElementById('loader');
    const tableBody = document.getElementById('booksTableBody');
    if(!tableBody) return;

    loader.style.display = 'block';
    const books = await apiCall('/books');
    loader.style.display = 'none';

    tableBody.innerHTML = '';
    
    if(books.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="5" class="empty-state">No books found.</td></tr>';
        return;
    }

    books.forEach(book => {
        const row = `<tr>
            <td>${book.id}</td>
            <td>${book.title}</td>
            <td>${book.author ? book.author.name : 'N/A'}</td>
            <td>${book.category ? book.category.name : 'N/A'}</td>
            <td>
                <button class="btn btn-danger" onclick="deleteBook(${book.id})">Delete</button>
            </td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

async function populateBookDropdowns() {
    const authorSelect = document.getElementById('author_id');
    const categorySelect = document.getElementById('category_id');
    
    if(!authorSelect || !categorySelect) return;

    const [authors, categories] = await Promise.all([
        apiCall('/authors'),
        apiCall('/categories')
    ]);

    authorSelect.innerHTML = '<option value="" disabled selected>Select Author</option>';
    authors.forEach(author => {
        authorSelect.innerHTML += `<option value="${author.id}">${author.name}</option>`;
    });

    categorySelect.innerHTML = '<option value="" disabled selected>Select Category</option>';
    categories.forEach(category => {
        categorySelect.innerHTML += `<option value="${category.id}">${category.name}</option>`;
    });
}

async function addBook(event) {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const authorId = document.getElementById('author_id').value;
    const categoryId = document.getElementById('category_id').value;

    if(!authorId || !categoryId) {
        alert("Please select both author and category");
        return;
    }

    const payload = {
        title,
        author: { id: parseInt(authorId) },
        category: { id: parseInt(categoryId) }
    };

    await apiCall('/books', 'POST', payload);
    document.getElementById('addBookForm').reset();
    loadBooks();
}

async function deleteBook(id) {
    if(confirm('Are you sure you want to delete this book?')) {
        await apiCall(`/books/${id}`, 'DELETE');
        loadBooks();
    }
}

// Setup Page Initialization based on current path
document.addEventListener('DOMContentLoaded', () => {
    const path = window.location.pathname;

    if (path.endsWith('authors.html')) {
        loadAuthors();
        document.getElementById('addAuthorForm')?.addEventListener('submit', addAuthor);
    } else if (path.endsWith('categories.html')) {
        loadCategories();
        document.getElementById('addCategoryForm')?.addEventListener('submit', addCategory);
    } else if (path.endsWith('customers.html')) {
        loadCustomers();
        document.getElementById('addCustomerForm')?.addEventListener('submit', addCustomer);
    } else if (path.endsWith('books.html')) {
        loadBooks();
        populateBookDropdowns();
        document.getElementById('addBookForm')?.addEventListener('submit', addBook);
    }
});
