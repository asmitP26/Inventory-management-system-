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
  localStorage.removeItem("currentUser")
  window.location.href = "index.html"
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
  if (!isLoggedIn()) {
    window.location.href = "index.html"
    return false
  }
  return true
}
