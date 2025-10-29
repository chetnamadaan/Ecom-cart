I'll help you create a comprehensive README file. Create a file called `README.md` in your project root folder and add this content:

```markdown
# BharatCart - Mock E-commerce Shopping Cart

A full-stack shopping cart application built with React, Node.js, Express, and MongoDB for Vibe Commerce screening.

![BharatCart](https://img.shields.io/badge/BharatCart-E--Commerce-blue)
![React](https://img.shields.io/badge/React-18.2.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

## 📋 Features

- **Product Catalog**: Browse through 8 electronic products
- **Shopping Cart**: Add/remove items with real-time total calculation
- **Checkout System**: Mock checkout with order confirmation
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Database Persistence**: MongoDB integration for data storage
- **Indian Rupees**: Prices displayed in Indian currency format

## 🛠 Tech Stack

- **Frontend**: React, Axios, CSS3
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Development**: CORS, Nodemon, Dotenv

## 📸 Screenshots

### Products Page
![Products Page](screenshots/products.png)
*Homepage showing product grid with "Add to Cart" functionality*

### Shopping Cart
![Shopping Cart](screenshots/cart.png)
*Cart view showing items, quantities, and total calculation*

### Checkout Process
![Checkout](screenshots/checkout.png)
*Checkout form with customer details and order summary*

### Order Confirmation
![Order Confirmation](screenshots/receipt.png)
*Order receipt with order ID and transaction details*

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mock-ecom-cart
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Environment Configuration**
   - Create `.env` file in backend directory:
     ```env
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/mock-ecom-cart
     ```

### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   ```
   Server runs on http://localhost:5000

2. **Start Frontend Development Server** (in new terminal)
   ```bash
   cd frontend
   npm start
   ```
   Application runs on http://localhost:3000

3. **Access the Application**
   Open your browser and navigate to `http://localhost:3000`

## 📁 Project Structure

```
mock-ecom-cart/
├── backend/
│   ├── server.js          # Express server + API routes
│   ├── package.json       # Backend dependencies
│   └── .env              # Environment variables
├── frontend/
│   ├── public/
│   │   └── images/       # Product images
│   ├── src/
│   │   ├── App.js        # Main React component
│   │   ├── App.css       # Styling
│   │   └── index.js      # React entry point
│   └── package.json      # Frontend dependencies
└── README.md             # Project documentation
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/products` | Get all products | - | Array of products |
| POST | `/api/cart` | Add to cart | `{productId, quantity}` | Cart item |
| GET | `/api/cart` | Get cart | - | `{items, total}` |
| DELETE | `/api/cart/:id` | Remove item | - | Success message |
| POST | `/api/checkout` | Checkout | `{name, email}` | Order receipt |

## 🎯 User Flow

1. **Browse Products**: View product grid with images, prices, and descriptions
2. **Add to Cart**: Click "Add to Cart" on desired products
3. **Manage Cart**: View cart items, quantities, and total amount
4. **Checkout**: Fill customer details and submit order
5. **Confirmation**: Receive order receipt with order ID and details

## 💾 Database Schema

### Products Collection
```javascript
{
  name: String,
  price: Number,
  description: String,
  image: String
}
```

### Cart Collection
```javascript
{
  productId: ObjectId,
  quantity: Number
}
```
