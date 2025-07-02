// Sample inventory data
let inventory = [
  { id: 1, name: "Laptop", category: "Electronics", quantity: 15, price: 999.99 },
  { id: 2, name: "T-Shirt", category: "Clothing", quantity: 50, price: 19.99 },
  { id: 3, name: "JavaScript Book", category: "Books", quantity: 8, price: 29.99 },
  { id: 4, name: "Garden Hose", category: "Home & Garden", quantity: 3, price: 45.99 },
  { id: 5, name: "Basketball", category: "Sports", quantity: 0, price: 24.99 },
]

let currentEditId = null

// Mock functions for authentication and authorization
function protectPage() {
  // In a real application, this would check for a valid session token
  return true // Allow access for now
}

function getCurrentUser() {
  // In a real application, this would retrieve user data from a session or database
  return { username: "TestUser", role: "admin" }
}

function isAdmin() {
  const user = getCurrentUser()
  return user && user.role === "admin"
}

function logout() {
  // In a real application, this would clear the session token and redirect to the login page
  alert("Logged out!")
}

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Protect the page
  if (!protectPage()) return

  const currentUser = getCurrentUser()

  // Update welcome message
  document.getElementById("userWelcome").textContent = `Welcome, ${currentUser.username} (${currentUser.role})`

  // Show admin controls if user is admin
  if (isAdmin()) {
    document.getElementById("adminControls").style.display = "block"
    document.getElementById("actionsHeader").style.display = "table-cell"
  }

  // Load inventory from localStorage if exists
  const savedInventory = localStorage.getItem("inventory")
  if (savedInventory) {
    inventory = JSON.parse(savedInventory)
  } else {
    // Save initial inventory to localStorage
    saveInventory()
  }

  // Initialize event listeners
  initializeEventListeners()

  // Display inventory
  displayInventory()
})

// Initialize all event listeners
function initializeEventListeners() {
  // Logout button
  document.getElementById("logoutBtn").addEventListener("click", logout)

  // Search functionality
  document.getElementById("searchInput").addEventListener("input", function () {
    displayInventory(this.value)
  })

  // Add item button (admin only)
  const addItemBtn = document.getElementById("addItemBtn")
  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      openModal("Add New Item")
    })
  }

  // Modal close button
  document.querySelector(".close").addEventListener("click", closeModal)

  // Cancel button
  document.getElementById("cancelBtn").addEventListener("click", closeModal)

  // Item form submission
  document.getElementById("itemForm").addEventListener("submit", handleItemSubmit)

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("itemModal")
    if (event.target === modal) {
      closeModal()
    }
  })
}

// Display inventory items
function displayInventory(searchTerm = "") {
  const tableBody = document.getElementById("inventoryTableBody")
  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  tableBody.innerHTML = ""

  if (filteredInventory.length === 0) {
    tableBody.innerHTML = `
            <tr>
                <td colspan="${isAdmin() ? "7" : "6"}" style="text-align: center; padding: 2rem; color: #666;">
                    ${searchTerm ? "No items found matching your search." : "No inventory items found."}
                </td>
            </tr>
        `
    return
  }

  filteredInventory.forEach((item) => {
    const row = document.createElement("tr")

    // Determine status based on quantity
    let status = "In Stock"
    let statusClass = "status-in-stock"

    if (item.quantity === 0) {
      status = "Out of Stock"
      statusClass = "status-out-of-stock"
    } else if (item.quantity <= 5) {
      status = "Low Stock"
      statusClass = "status-low-stock"
    }

    row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.name}</td>
            <td>${item.category}</td>
            <td>${item.quantity}</td>
            <td>$${item.price.toFixed(2)}</td>
            <td><span class="status-badge ${statusClass}">${status}</span></td>
            ${
              isAdmin()
                ? `
                <td>
                    <div class="action-buttons">
                        <button class="btn btn-edit" onclick="editItem(${item.id})">Edit</button>
                        <button class="btn btn-danger" onclick="deleteItem(${item.id})">Delete</button>
                    </div>
                </td>
            `
                : ""
            }
        `

    tableBody.appendChild(row)
  })
}

// Open modal for add/edit
function openModal(title, item = null) {
  document.getElementById("modalTitle").textContent = title
  document.getElementById("itemModal").style.display = "block"

  if (item) {
    // Editing existing item
    currentEditId = item.id
    document.getElementById("itemName").value = item.name
    document.getElementById("itemCategory").value = item.category
    document.getElementById("itemQuantity").value = item.quantity
    document.getElementById("itemPrice").value = item.price
  } else {
    // Adding new item
    currentEditId = null
    document.getElementById("itemForm").reset()
  }
}

// Close modal
function closeModal() {
  document.getElementById("itemModal").style.display = "none"
  currentEditId = null
  document.getElementById("itemForm").reset()
}

// Handle item form submission
function handleItemSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const itemData = {
    name: formData.get("name"),
    category: formData.get("category"),
    quantity: Number.parseInt(formData.get("quantity")),
    price: Number.parseFloat(formData.get("price")),
  }

  if (currentEditId) {
    // Update existing item
    updateItem(currentEditId, itemData)
  } else {
    // Add new item
    addItem(itemData)
  }

  closeModal()
}

// Add new item
function addItem(itemData) {
  const newId = Math.max(...inventory.map((item) => item.id), 0) + 1
  const newItem = { id: newId, ...itemData }

  inventory.push(newItem)
  saveInventory()
  displayInventory()

  showNotification("Item added successfully!", "success")
}

// Update existing item
function updateItem(id, itemData) {
  const index = inventory.findIndex((item) => item.id === id)
  if (index !== -1) {
    inventory[index] = { id, ...itemData }
    saveInventory()
    displayInventory()

    showNotification("Item updated successfully!", "success")
  }
}

// Edit item
function editItem(id) {
  const item = inventory.find((item) => item.id === id)
  if (item) {
    openModal("Edit Item", item)
  }
}

// Delete item
function deleteItem(id) {
  if (confirm("Are you sure you want to delete this item?")) {
    inventory = inventory.filter((item) => item.id !== id)
    saveInventory()
    displayInventory()

    showNotification("Item deleted successfully!", "success")
  }
}

// Save inventory to localStorage
function saveInventory() {
  localStorage.setItem("inventory", JSON.stringify(inventory))
}

// Show notification
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.textContent = message

  // Add styles
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === "success" ? "#d4edda" : "#f8d7da"};
        color: ${type === "success" ? "#155724" : "#721c24"};
        border: 1px solid ${type === "success" ? "#c3e6cb" : "#f5c6cb"};
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1001;
        font-weight: 500;
        transition: all 0.3s ease;
    `

  document.body.appendChild(notification)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}
