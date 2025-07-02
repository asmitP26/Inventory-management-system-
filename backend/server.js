const express = require("express")
const cors = require("cors")
const bodyParser = require("body-parser")
const path = require("path")

// Import routes
const authRoutes = require("./routes/auth")
const inventoryRoutes = require("./routes/inventory")

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")))

// API Routes
app.use("/api/auth", authRoutes)
app.use("/api/inventory", inventoryRoutes)

// Serve frontend for any non-API routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : {},
  })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`)
  console.log(`📁 Serving frontend from: ${path.join(__dirname, "../frontend")}`)
  console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`)
})

module.exports = app
