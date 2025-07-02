// Mock user database
const users = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" },
]

// Login function
function login(username, password) {
  const user = users.find((u) => u.username === username && u.password === password)

  if (user) {
    // Store user info in localStorage (excluding password)
    const userSession = {
      username: user.username,
      role: user.role,
      loginTime: new Date().toISOString(),
    }

    localStorage.setItem("currentUser", JSON.stringify(userSession))
    return { success: true, user: userSession }
  } else {
    return { success: false, message: "Invalid username or password" }
  }
}

// Logout function
function logout() {
  // Clear all localStorage data
  localStorage.removeItem("currentUser")
  localStorage.removeItem("inventory")

  // Show logout message
  showNotification("Logging out...", "info")

  // Force redirect to login page immediately
  setTimeout(() => {
    window.location.replace("index.html")
  }, 500)
}

// Get current user
function getCurrentUser() {
  const userStr = localStorage.getItem("currentUser")
  return userStr ? JSON.parse(userStr) : null
}

// Check if user is logged in
function isLoggedIn() {
  return getCurrentUser() !== null
}

// Check if user is admin
function isAdmin() {
  const user = getCurrentUser()
  return user && user.role === "admin"
}

// Protect page (redirect to login if not authenticated)
function protectPage() {
  const currentUser = getCurrentUser()
  if (!currentUser) {
    // Force redirect to login page
    window.location.replace("index.html")
    return false
  }
  return true
}

// Show notification function (for auth.js)
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
    background: ${type === "success" ? "#d4edda" : type === "info" ? "#d1ecf1" : "#f8d7da"};
    color: ${type === "success" ? "#155724" : type === "info" ? "#0c5460" : "#721c24"};
    border: 1px solid ${type === "success" ? "#c3e6cb" : type === "info" ? "#bee5eb" : "#f5c6cb"};
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    z-index: 1001;
    font-weight: 500;
    transition: all 0.3s ease;
    transform: translateX(100%);
    opacity: 0;
  `

  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
    notification.style.opacity = "1"
  }, 100)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.style.opacity = "0"
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 3000)
}
