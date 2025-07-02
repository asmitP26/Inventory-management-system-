// Sample inventory data
let inventory = [
  { id: 1, name: "MacBook Pro", category: "Electronics", quantity: 15, price: 1299.99 },
  { id: 2, name: "Wireless Headphones", category: "Electronics", quantity: 25, price: 199.99 },
  { id: 3, name: "Cotton T-Shirt", category: "Clothing", quantity: 50, price: 19.99 },
  { id: 4, name: "JavaScript: The Good Parts", category: "Books", quantity: 8, price: 29.99 },
  { id: 5, name: "Garden Hose 50ft", category: "Home & Garden", quantity: 3, price: 45.99 },
  { id: 6, name: "Professional Basketball", category: "Sports", quantity: 0, price: 24.99 },
  { id: 7, name: "Yoga Mat", category: "Sports", quantity: 12, price: 35.99 },
  { id: 8, name: "Coffee Maker", category: "Home & Garden", quantity: 6, price: 89.99 },
]

let currentEditId = null

// Authentication functions
function isLoggedIn() {
  // Placeholder for actual authentication logic
  return true
}

function getCurrentUser() {
  // Placeholder for actual user retrieval logic
  return { username: "admin", role: "admin" }
}

function isAdmin() {
  // Placeholder for actual admin check logic
  const currentUser = getCurrentUser()
  return currentUser && currentUser.role === "admin"
}

// Initialize the dashboard
document.addEventListener("DOMContentLoaded", () => {
  // Double-check authentication
  if (!isLoggedIn()) {
    window.location.replace("index.html")
    return
  }

  const currentUser = getCurrentUser()
  if (!currentUser) {
    window.location.replace("index.html")
    return
  }

  // Update welcome message
  document.getElementById("userWelcome").textContent =
    `Welcome, ${currentUser.username} (${currentUser.role.toUpperCase()})`

  // Show admin controls if user is admin
  if (isAdmin()) {
    document.getElementById("adminControls").style.display = "block"
    document.getElementById("actionsHeader").style.display = "table-cell"
  }

  // Load inventory from localStorage if exists
  const savedInventory = localStorage.getItem("inventory")
  if (savedInventory) {
    try {
      inventory = JSON.parse(savedInventory)
    } catch (e) {
      console.error("Error parsing saved inventory:", e)
      saveInventory() // Reset to default
    }
  } else {
    // Save initial inventory to localStorage
    saveInventory()
  }

  // Initialize event listeners
  initializeEventListeners()

  // Display inventory
  displayInventory()

  // Show welcome notification
  setTimeout(() => {
    showNotification(`Welcome back, ${currentUser.username}!`, "success")
  }, 500)
})

// Initialize all event listeners
function initializeEventListeners() {
  // Logout button with improved handling
  const logoutBtn = document.getElementById("logoutBtn")
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      e.stopPropagation()

      if (confirm("Are you sure you want to logout?")) {
        handleLogout()
      }
    })
  }

  // Search functionality with debounce
  let searchTimeout
  const searchInput = document.getElementById("searchInput")
  if (searchInput) {
    searchInput.addEventListener("input", function () {
      clearTimeout(searchTimeout)
      searchTimeout = setTimeout(() => {
        displayInventory(this.value)
      }, 300)
    })
  }

  // Add item button (admin only)
  const addItemBtn = document.getElementById("addItemBtn")
  if (addItemBtn) {
    addItemBtn.addEventListener("click", () => {
      openModal("Add New Item")
    })
  }

  // Modal close button
  const closeBtn = document.querySelector(".close")
  if (closeBtn) {
    closeBtn.addEventListener("click", closeModal)
  }

  // Cancel button
  const cancelBtn = document.getElementById("cancelBtn")
  if (cancelBtn) {
    cancelBtn.addEventListener("click", closeModal)
  }

  // Item form submission
  const itemForm = document.getElementById("itemForm")
  if (itemForm) {
    itemForm.addEventListener("submit", handleItemSubmit)
  }

  // Close modal when clicking outside
  window.addEventListener("click", (event) => {
    const modal = document.getElementById("itemModal")
    if (event.target === modal) {
      closeModal()
    }
  })

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // ESC to close modal
    if (e.key === "Escape") {
      closeModal()
    }
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault()
      const searchInput = document.getElementById("searchInput")
      if (searchInput) {
        searchInput.focus()
      }
    }
  })
}

// Improved logout handler
function handleLogout() {
  try {
    // Show logging out message
    showNotification("Logging out...", "info")

    // Clear all data
    localStorage.clear()

    // Force redirect after short delay
    setTimeout(() => {
      window.location.replace("index.html")
    }, 800)
  } catch (error) {
    console.error("Logout error:", error)
    // Force redirect even if there's an error
    window.location.replace("index.html")
  }
}

// Display inventory items
function displayInventory(searchTerm = "") {
  const tableBody = document.getElementById("inventoryTableBody")
  if (!tableBody) return

  const filteredInventory = inventory.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  tableBody.innerHTML = ""

  if (filteredInventory.length === 0) {
    tableBody.innerHTML = `
      <tr>
        <td colspan="${isAdmin() ? "7" : "6"}" style="text-align: center; padding: 3rem; color: #718096;">
          <div style="font-size: 1.2rem; margin-bottom: 0.5rem;">
            ${searchTerm ? "🔍 No items found" : "📦 No inventory items"}
          </div>
          <div style="font-size: 0.9rem;">
            ${searchTerm ? "Try adjusting your search terms" : "Start by adding some items to your inventory"}
          </div>
        </td>
      </tr>
    `
    return
  }

  filteredInventory.forEach((item, index) => {
    const row = document.createElement("tr")
    row.style.animationDelay = `${index * 0.05}s`
    row.style.animation = "fadeInUp 0.5s ease-out forwards"

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
      <td><strong>#${item.id}</strong></td>
      <td>
        <div style="font-weight: 600; color: #2d3748;">${item.name}</div>
      </td>
      <td>
        <span style="background: rgba(102, 126, 234, 0.1); color: #667eea; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.8rem; font-weight: 600;">
          ${item.category}
        </span>
      </td>
      <td>
        <span style="font-weight: 600; font-size: 1.1rem; color: ${item.quantity === 0 ? "#e53e3e" : item.quantity <= 5 ? "#ed8936" : "#38a169"};">
          ${item.quantity}
        </span>
      </td>
      <td>
        <span style="font-weight: 600; font-size: 1.1rem; color: #2d3748;">
          $${item.price.toFixed(2)}
        </span>
      </td>
      <td><span class="status-badge ${statusClass}">${status}</span></td>
      ${
        isAdmin()
          ? `
          <td>
            <div class="action-buttons">
              <button class="btn btn-edit" onclick="editItem(${item.id})" title="Edit Item">
                ✏️ Edit
              </button>
              <button class="btn btn-danger" onclick="deleteItem(${item.id})" title="Delete Item">
                🗑️ Delete
              </button>
            </div>
          </td>
        `
          : ""
      }
    `

    tableBody.appendChild(row)
  })
}

// Add CSS animation for table rows
const style = document.createElement("style")
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`
document.head.appendChild(style)

// Open modal for add/edit
function openModal(title, item = null) {
  const modalTitle = document.getElementById("modalTitle")
  const modal = document.getElementById("itemModal")

  if (!modalTitle || !modal) return

  modalTitle.textContent = title
  modal.style.display = "block"

  // Focus first input after modal opens
  setTimeout(() => {
    const nameInput = document.getElementById("itemName")
    if (nameInput) {
      nameInput.focus()
    }
  }, 100)

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
    const form = document.getElementById("itemForm")
    if (form) {
      form.reset()
    }
  }
}

// Close modal
function closeModal() {
  const modal = document.getElementById("itemModal")
  if (modal) {
    modal.style.display = "none"
  }
  currentEditId = null
  const form = document.getElementById("itemForm")
  if (form) {
    form.reset()
  }
}

// Handle item form submission
function handleItemSubmit(e) {
  e.preventDefault()

  const submitBtn = e.target.querySelector('button[type="submit"]')
  if (!submitBtn) return

  const originalText = submitBtn.textContent
  submitBtn.innerHTML = '<span class="loading"></span> Saving...'
  submitBtn.disabled = true

  // Simulate processing delay
  setTimeout(() => {
    const formData = new FormData(e.target)
    const itemData = {
      name: formData.get("name")?.trim() || "",
      category: formData.get("category") || "",
      quantity: Number.parseInt(formData.get("quantity")) || 0,
      price: Number.parseFloat(formData.get("price")) || 0,
    }

    // Validation
    if (!itemData.name || !itemData.category || itemData.quantity < 0 || itemData.price < 0) {
      showNotification("Please fill in all fields with valid values!", "error")
      submitBtn.textContent = originalText
      submitBtn.disabled = false
      return
    }

    if (currentEditId) {
      // Update existing item
      updateItem(currentEditId, itemData)
    } else {
      // Add new item
      addItem(itemData)
    }

    submitBtn.textContent = originalText
    submitBtn.disabled = false
    closeModal()
  }, 800)
}

// Add new item
function addItem(itemData) {
  const newId = Math.max(...inventory.map((item) => item.id), 0) + 1
  const newItem = { id: newId, ...itemData }

  inventory.unshift(newItem) // Add to beginning for better UX
  saveInventory()
  displayInventory()

  showNotification(`✅ "${itemData.name}" added successfully!`, "success")
}

// Update existing item
function updateItem(id, itemData) {
  const index = inventory.findIndex((item) => item.id === id)
  if (index !== -1) {
    inventory[index] = { id, ...itemData }
    saveInventory()
    displayInventory()

    showNotification(`✅ "${itemData.name}" updated successfully!`, "success")
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
  const item = inventory.find((item) => item.id === id)
  if (!item) return

  if (confirm(`Are you sure you want to delete "${item.name}"?\n\nThis action cannot be undone.`)) {
    inventory = inventory.filter((item) => item.id !== id)
    saveInventory()
    displayInventory()

    showNotification(`🗑️ "${item.name}" deleted successfully!`, "success")
  }
}

// Save inventory to localStorage
function saveInventory() {
  try {
    localStorage.setItem("inventory", JSON.stringify(inventory))
  } catch (error) {
    console.error("Error saving inventory:", error)
    showNotification("Error saving data!", "error")
  }
}

// Enhanced notification function
function showNotification(message, type = "info") {
  // Remove existing notifications
  const existingNotifications = document.querySelectorAll(".notification")
  existingNotifications.forEach((notification) => {
    if (document.body.contains(notification)) {
      document.body.removeChild(notification)
    }
  })

  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification notification-${type}`
  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <span>${getNotificationIcon(type)}</span>
      <span>${message}</span>
    </div>
  `

  // Add styles
  const colors = {
    success: { bg: "#d4edda", color: "#155724", border: "#c3e6cb" },
    error: { bg: "#f8d7da", color: "#721c24", border: "#f5c6cb" },
    info: { bg: "#d1ecf1", color: "#0c5460", border: "#bee5eb" },
    warning: { bg: "#fff3cd", color: "#856404", border: "#ffeaa7" },
  }

  const colorScheme = colors[type] || colors.info

  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 1rem 1.5rem;
    background: ${colorScheme.bg};
    color: ${colorScheme.color};
    border: 1px solid ${colorScheme.border};
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0,0,0,0.15);
    z-index: 1001;
    font-weight: 500;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    transform: translateX(100%);
    opacity: 0;
    max-width: 400px;
    backdrop-filter: blur(10px);
  `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
    notification.style.opacity = "1"
  }, 100)

  // Remove notification after 4 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 4000)
}

function getNotificationIcon(type) {
  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
    warning: "⚠️",
  }
  return icons[type] || icons.info
}
