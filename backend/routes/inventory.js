const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

const dataPath = path.join(__dirname, "../data/inventory.json")

// Helper function to read inventory data
function readInventoryData() {
  try {
    if (fs.existsSync(dataPath)) {
      const data = fs.readFileSync(dataPath, "utf8")
      return JSON.parse(data)
    } else {
      // Return default data if file doesn't exist
      return [
        { id: 1, name: "Laptop", category: "Electronics", quantity: 15, price: 999.99 },
        { id: 2, name: "T-Shirt", category: "Clothing", quantity: 50, price: 19.99 },
        { id: 3, name: "JavaScript Book", category: "Books", quantity: 8, price: 29.99 },
        { id: 4, name: "Garden Hose", category: "Home & Garden", quantity: 3, price: 45.99 },
        { id: 5, name: "Basketball", category: "Sports", quantity: 0, price: 24.99 },
      ]
    }
  } catch (error) {
    console.error("Error reading inventory data:", error)
    return []
  }
}

// Helper function to write inventory data
function writeInventoryData(data) {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(dataPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }

    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error("Error writing inventory data:", error)
    return false
  }
}

// GET all inventory items
router.get("/", (req, res) => {
  try {
    const inventory = readInventoryData()
    const { search } = req.query

    let filteredInventory = inventory

    // Apply search filter if provided
    if (search) {
      filteredInventory = inventory.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase()),
      )
    }

    res.json({
      success: true,
      data: filteredInventory,
      total: filteredInventory.length,
    })
  } catch (error) {
    console.error("Error fetching inventory:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching inventory data",
    })
  }
})

// GET single inventory item
router.get("/:id", (req, res) => {
  try {
    const inventory = readInventoryData()
    const itemId = Number.parseInt(req.params.id)
    const item = inventory.find((item) => item.id === itemId)

    if (item) {
      res.json({
        success: true,
        data: item,
      })
    } else {
      res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }
  } catch (error) {
    console.error("Error fetching item:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching item data",
    })
  }
})

// POST new inventory item
router.post("/", (req, res) => {
  try {
    const { name, category, quantity, price } = req.body

    // Validate input
    if (!name || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    const inventory = readInventoryData()

    // Generate new ID
    const newId = Math.max(...inventory.map((item) => item.id), 0) + 1

    // Create new item
    const newItem = {
      id: newId,
      name: name.trim(),
      category: category.trim(),
      quantity: Number.parseInt(quantity),
      price: Number.parseFloat(price),
    }

    // Add to inventory
    inventory.push(newItem)

    // Save to file
    if (writeInventoryData(inventory)) {
      res.status(201).json({
        success: true,
        message: "Item added successfully",
        data: newItem,
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Error saving item",
      })
    }
  } catch (error) {
    console.error("Error adding item:", error)
    res.status(500).json({
      success: false,
      message: "Error adding item",
    })
  }
})

// PUT update inventory item
router.put("/:id", (req, res) => {
  try {
    const itemId = Number.parseInt(req.params.id)
    const { name, category, quantity, price } = req.body

    // Validate input
    if (!name || !category || quantity === undefined || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      })
    }

    const inventory = readInventoryData()
    const itemIndex = inventory.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    // Update item
    inventory[itemIndex] = {
      id: itemId,
      name: name.trim(),
      category: category.trim(),
      quantity: Number.parseInt(quantity),
      price: Number.parseFloat(price),
    }

    // Save to file
    if (writeInventoryData(inventory)) {
      res.json({
        success: true,
        message: "Item updated successfully",
        data: inventory[itemIndex],
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Error updating item",
      })
    }
  } catch (error) {
    console.error("Error updating item:", error)
    res.status(500).json({
      success: false,
      message: "Error updating item",
    })
  }
})

// DELETE inventory item
router.delete("/:id", (req, res) => {
  try {
    const itemId = Number.parseInt(req.params.id)
    const inventory = readInventoryData()
    const itemIndex = inventory.findIndex((item) => item.id === itemId)

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      })
    }

    // Remove item
    const deletedItem = inventory.splice(itemIndex, 1)[0]

    // Save to file
    if (writeInventoryData(inventory)) {
      res.json({
        success: true,
        message: "Item deleted successfully",
        data: deletedItem,
      })
    } else {
      res.status(500).json({
        success: false,
        message: "Error deleting item",
      })
    }
  } catch (error) {
    console.error("Error deleting item:", error)
    res.status(500).json({
      success: false,
      message: "Error deleting item",
    })
  }
})

module.exports = router
