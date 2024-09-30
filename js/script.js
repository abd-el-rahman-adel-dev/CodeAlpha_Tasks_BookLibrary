let books = JSON.parse(localStorage.getItem("books")) || [];
let currentUser = null;
const itemsPerPage = 5;
let currentPage = 1;

// User Authentication
function register() {
  const username = document.getElementById("username").value;
  if (username) {
    localStorage.setItem("currentUser", username);
    currentUser = username;
    alert("Registered successfully!");
    updateAuthSection();
  } else {
    alert("Please enter a username.");
  }
}

function login() {
  const username = document.getElementById("username").value;
  if (username && localStorage.getItem("currentUser") === username) {
    currentUser = username;
    alert("Logged in successfully!");
    updateAuthSection();
  } else {
    alert("Invalid username.");
  }
}

function logout() {
  currentUser = null;
  // localStorage.removeItem("currentUser");
  updateAuthSection();
}

function updateAuthSection() {
  const authSection = document.getElementById("authSection");
  if (currentUser) {
    authSection.innerHTML = `<h3>Welcome, ${currentUser}</h3>
            <button class="btn btn-danger mb-2" onclick="logout()">Logout</button>`;
  } else {
    authSection.innerHTML = `
            <h3>User Authentication</h3>
            <input type="text" id="username" class="form-control mb-2" placeholder="Username" />
            <button class="btn btn-primary mb-2" onclick="register()">Register</button>
            <button class="btn btn-secondary mb-2" onclick="login()">Login</button>`;
  }
}

// Function to display books with pagination
function displayBooks(books) {
  const bookListDiv = document.getElementById("bookList");
  bookListDiv.innerHTML = "";

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedBooks = books.slice(start, end);

  paginatedBooks.forEach((book) => {
    const bookCard = document.createElement("div");
    bookCard.className = "col-lg-4 col-md-6 col-sm-12 mb-4";
    bookCard.innerHTML = `
            <div class="card card-100">
                <img src="${
                  book.image
                }" class="card-img-top img-fluid img-thumbnail" alt="${
      book.title
    }" />
                <div class="card-body  d-flex flex-column justify-content-between">
                    <h5 class="card-title">${book.title}</h5>
                    <p><strong>Author:</strong> ${book.author}</p>
                    <p><strong>Category:</strong> ${book.category}</p>
                    <p><strong>ISBN:</strong> ${book.isbn}</p>
                    <p><strong>Status:</strong> ${
                      book.available ? "Available" : "Borrowed"
                    }</p>
                    <div>
                    <button class="btn btn-warning" onclick="borrowBook('${
                      book.isbn
                    }')">Borrow</button>
                    <button class="btn btn-info" onclick="editBook('${
                      book.isbn
                    }')">Edit</button>
                    <button class="btn btn-danger" onclick="deleteBook('${
                      book.isbn
                    }')">Delete</button></div>
                </div>
            </div>
        `;
    bookListDiv.appendChild(bookCard);
  });

  setupPagination(books.length);
}

// Function to search for books
function searchBooks() {
  const query = document.getElementById("searchQuery").value.toLowerCase();
  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.isbn.toLowerCase().includes(query)
  );
  displayBooks(filteredBooks);
}

// Function to sort books
function sortBooks() {
  const sortOption = document.getElementById("sortOptions").value;
  const sortedBooks = [...books].sort((a, b) => {
    if (a[sortOption] < b[sortOption]) return -1;
    if (a[sortOption] > b[sortOption]) return 1;
    return 0;
  });
  displayBooks(sortedBooks);
}

// Function to add a new book
function addBook() {
  const title = document.getElementById("bookTitle").value;
  const author = document.getElementById("bookAuthor").value;
  const category = document.getElementById("bookCategory").value;
  const isbn = document.getElementById("bookISBN").value;
  const image = document.getElementById("bookImage").files[0];

  if (title && author && category && isbn && image) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const newBook = {
        title,
        author,
        category,
        isbn,
        image: e.target.result, // Image URL as a base64 string
        available: true,
      };
      books.push(newBook);
      saveBooks();
      displayBooks(books);
      clearInputFields();
    };
    reader.readAsDataURL(image);
  } else {
    alert("Please fill all fields and upload an image");
  }
}

// Function to borrow a book
function borrowBook(isbn) {
  const book = books.find((b) => b.isbn === isbn);
  if (book && book.available) {
    book.available = false;
    saveBooks();
    displayBooks(books);
    alert("You have borrowed the book");
  } else {
    alert("Book is already borrowed");
  }
}

// Function to edit a book
function editBook(isbn) {
  const book = books.find((b) => b.isbn === isbn);
  if (book) {
    document.getElementById("bookTitle").value = book.title;
    document.getElementById("bookAuthor").value = book.author;
    document.getElementById("bookCategory").value = book.category;
    document.getElementById("bookISBN").value = book.isbn;
    document.getElementById("bookImage").value = ""; // Reset image input
    deleteBook(isbn); // Remove book before adding it again
  }
}

// Function to delete a book
function deleteBook(isbn) {
  books = books.filter((b) => b.isbn !== isbn);
  saveBooks();
  displayBooks(books);
}

// Function to save books to localStorage
function saveBooks() {
  localStorage.setItem("books", JSON.stringify(books));
}

// Function to clear input fields
function clearInputFields() {
  document.getElementById("bookTitle").value = "";
  document.getElementById("bookAuthor").value = "";
  document.getElementById("bookCategory").value = "";
  document.getElementById("bookISBN").value = "";
  document.getElementById("bookImage").value = "";
}

// Function to setup pagination
function setupPagination(totalBooks) {
  const paginationDiv = document.getElementById("pagination");
  paginationDiv.innerHTML = "";

  const pageCount = Math.ceil(totalBooks / itemsPerPage);
  for (let i = 1; i <= pageCount; i++) {
    const button = document.createElement("button");
    button.innerText = i;
    button.className = "btn btn-secondary mx-1";
    button.onclick = function () {
      currentPage = i;
      displayBooks(books);
    };
    paginationDiv.appendChild(button);
  }
}

// Initial load
updateAuthSection();
displayBooks(books);
