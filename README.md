# 🛒 MERN Stack E-Commerce Web Application

This is a fully functional **E-commerce Web Application** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js) with modern UI and powerful features. It includes both **User** and **Admin** dashboards, integrated **Stripe payments**, and **MongoDB Atlas** for cloud data storage.

---

## 🚀 Live Demo

🔗 [Click here to view the live app](https://my-eccomerce-frontend.vercel.app/)

---

## 📂 GitHub Repository

🔗 [Git Code – Ecommerce App](https://github.com/aadilshaikh1208/eccomerce-app)

---

## 💡 Features

### 🛍️ User Functionality
- 🔐 Secure login/signup (authentication)
- 📦 Add to cart, update quantity
- 🗂️ Category-based product browsing
- 📄 Product detail view
- 💳 Stripe payment integration (test with dummy card)
- 📜 View order history
- 📥 Download orders in PDF format
- 👤 Profile management and logout

### 🛠️ Admin Functionality
- 👨‍💼 Admin login (admin@gmail.com / 123)
- 📊 View total users, orders, products
- ➕ Add, update, delete products by category
- 🗂️ Category-wise product filtering
- 👥 Manage users
- 🔒 Secure logout

---

## 💳 Test Payment (Stripe)

To test the payment gateway, use the following dummy card:

Card Number: 4242 4242 4242 4242
Expiry Date: 12/34
CVV: 123


---

## 🧠 Built With Help of AI Tools

This project was developed with the active use of the following **AI coding assistants**:
- [ChatGPT](https://chat.openai.com)
- [Claude](https://claude.ai)

These tools accelerated development, improved debugging, and supported cleaner architecture and code design.

---

## 🛠️ Tech Stack

- **Frontend:** React.js, Tailwind CSS, React Router
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Payments:** Stripe API
- **Authentication:** JWT
- **Other Tools:** PDFKit, React Icons

---

## 📎 How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/aadilshaikh1208/eccomerce-app.git

2. **Navigate to project directory and install dependencies (both frontend & backend):**
   ```bash
   cd eccomerce-app
   npm install

3. **Set up environment variables:**
   ```bash
   MONGODB_URI=your_mongo_uri
   JWT_SECRET=your_jwt_secret
   STRIPE_SECRET_KEY=your_stripe_secret


4. **Run backend and frontend:**
   ```bash
   npm run dev


