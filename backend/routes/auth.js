const express = require("express")
const router = express.Router()

// Mock user database (in production, this would be in a real database)
const users = [
  { id: 1, username: "admin", password: "admin123", role: "admin" },
  { id: 2, username: "user", password: "user123", role: "user" },
]

// Login endpoint
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      })
    }

    // Find user
    const user = users.find((u) => u.username === username && u.password === password)

    if (user) {
      // Return user info (excluding password)
      const userSession = {
        id: user.id,
        username: user.username,
        role: user.role,
        loginTime: new Date().toISOString(),
      }

      res.json({
        success: true,
        message: "Login successful",
        user: userSession,
      })
    } else {
      res.status(401).json({
        success: false,
        message: "Invalid username or password",
      })
    }
  } catch (error) {
    console.error("Login error:", error)
    res.status(500).json({
      success: false,
      message: "Internal server error",
    })
  }
})

// Get current user info (for session validation)
router.get("/me", (req, res) => {
  // In a real application, you would validate JWT token here
  // For this demo, we'll just return a success response
  res.json({
    success: true,
    message: "Session valid",
  })
})

// Logout endpoint
router.post("/logout", (req, res) => {
  // In a real application, you would invalidate the JWT token here
  res.json({
    success: true,
    message: "Logout successful",
  })
})

module.exports = router
