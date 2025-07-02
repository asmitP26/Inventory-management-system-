# Inventory Management System with Role-Based Access

A web-based inventory management system built for educational purposes, featuring role-based access control and basic CRUD operations.

## 🚀 Features

- **Role-Based Access Control**
  - Admin: Full access (Create, Read, Update, Delete items)
  - User: Read-only access (View items only)

- **Authentication**
  - Simple login/logout system using LocalStorage
  - Session persistence across browser sessions

- **Inventory Management**
  - Add new inventory items (Admin only)
  - Update existing items (Admin only)
  - Delete items (Admin only)
  - View all items (Admin & User)
  - Search and filter functionality

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Node.js, Express.js |
| Storage | LocalStorage (Frontend), JSON files (Backend) |

## 📁 Project Structure

\`\`\`
inventory-management-system/
├── frontend/
│   ├── index.html          # Login page
│   ├── dashboard.html      # Main inventory dashboard
│   ├── styles.css          # Styling
│   ├── script.js           # Main JavaScript logic
│   └── auth.js             # Authentication logic
├── backend/
│   ├── server.js           # Express server
│   ├── routes/
│   │   ├── auth.js         # Authentication routes
│   │   └── inventory.js    # Inventory CRUD routes
│   ├── data/
│   │   └── inventory.json  # Mock data storage
│   └── package.json        # Node.js dependencies
└── README.md
\`\`\`

## 🚦 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Web browser
- Text editor/IDE

### Installation

1. **Clone or download the project**
   \`\`\`bash
   # If using git
   git clone <your-repo-url>
   cd inventory-management-system
   \`\`\`

2. **Set up the backend**
   \`\`\`bash
   cd backend
   npm install
   npm start
   \`\`\`

3. **Set up the frontend**
   \`\`\`bash
   cd frontend
   # Open index.html in your browser or use a live server
   \`\`\`

### Default Login Credentials

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| User | user | user123 |

## 🎯 Usage

1. **Login**: Start at \`index.html\` and login with the credentials above
2. **Dashboard**: After login, you'll be redirected to the inventory dashboard
3. **Admin Features**: If logged in as admin, you can add, edit, and delete items
4. **User Features**: Regular users can only view the inventory
5. **Logout**: Click the logout button to end your session

## 🔧 Customization

### Adding New Users
Edit the \`users\` array in \`frontend/auth.js\`:
\`\`\`javascript
const users = [
    { username: 'admin', password: 'admin123', role: 'admin' },
    { username: 'user', password: 'user123', role: 'user' },
    // Add new users here
];
\`\`\`

### Modifying Inventory Fields
Update the item structure in \`frontend/script.js\` and corresponding HTML forms.

### Styling
Customize the appearance by modifying \`frontend/styles.css\`.

## 🚀 Future Enhancements

- **Database Integration**: Replace JSON files with MongoDB or MySQL
- **Advanced Authentication**: Implement JWT tokens and password hashing
- **File Upload**: Add image upload for inventory items
- **Reporting**: Generate inventory reports and analytics
- **API Integration**: Create RESTful APIs for mobile app integration
- **Real-time Updates**: Add WebSocket support for live inventory updates

## 📚 Learning Objectives

This project helps you learn:
- Frontend web development (HTML, CSS, JavaScript)
- Backend development with Node.js
- Role-based access control
- Local storage management
- Basic CRUD operations
- Project structure and organization

## 🤝 Contributing

This is an educational project. Feel free to:
- Add new features
- Improve the UI/UX
- Optimize the code
- Add more comprehensive error handling

## 📄 License

This project is for educational purposes. Feel free to use and modify as needed.

## 📞 Support

If you encounter any issues or have questions, please refer to the code comments or create an issue in the repository.
\`\`\`

Now, let's create the frontend files: