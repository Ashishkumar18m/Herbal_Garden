# 🌿 Herbal_Garden – Herbal Products Website

**Live Demo:** [[https://virtual-herbal-garden-ly4h.onrender.com](https://virtual-herbal-garden-ly4h.onrender.com)]

Herbal_Garden is a full-stack web application designed to showcase herbal products and allow users to submit contact inquiries and place orders. The application is built using **HTML, CSS, and JavaScript** on the frontend, with a **Node.js and Express.js backend** connected to **MongoDB** for data persistence. The complete application is deployed on **Render**.

---

## 🖼️ Project Screenshots

Below are some screenshots of the Herbal_Garden website:

![Screenshot_24-1-2026_95448_virtual-herbal-garden-ly4h onrender com](https://github.com/user-attachments/assets/490c1781-a603-43ab-a9e7-2abd25e8a9c6)

---

![Screenshot_24-1-2026_95937_virtual-herbal-garden-ly4h onrender com](https://github.com/user-attachments/assets/a8d82d9f-5bf3-46c4-85c8-3595b929fa49)


---

## ✨ Features

* 🌱 Herbal product showcase using static and dynamic data
* 📩 Contact form for customer inquiries
* 🛒 Order submission and storage
* 💾 Data persistence with MongoDB Atlas
* 🌐 Full-stack deployment on Render
* 📱 Responsive and user-friendly interface

---

## 🧑‍💻 Tech Stack

* **Frontend:** HTML5, CSS3, JavaScript
* **Backend Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB Atlas
* **ODM:** Mongoose
* **Deployment:** Render

---

## 📁 Project Structure

```
Herbal_Garden/
├── backend/                 # Backend (Node.js + Express)
│   ├── node_modules/         # Backend dependencies
│   ├── server.js             # Server entry point
│   ├── package.json          # Backend dependencies & scripts
│   ├── .env                  # Environment variables (local only)
│   └── models/               # Mongoose schemas
│       ├── Contact.js
│       ├── Product.js
│       └── Order.js
├── index.html                # Main frontend page
├── index3.html               # Additional frontend page
├── app.js                    # Frontend JavaScript logic
├── products.json             # Static product data
├── garden2.css               # Main stylesheet
├── garden3.css               # Additional stylesheet
```

---

## ⚙️ Environment Variables

Create the following environment variables in the **Render Dashboard** (do not commit `.env` to GitHub):

```
MONGO_URI=your_mongodb_atlas_connection_string
PORT=5000
```

> Render automatically assigns the `PORT`, so ensure your server uses:

```js
const PORT = process.env.PORT || 5000;
```

---

## 🛠️ Installation & Local Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ashishkumar18m/Herbal_Garden.git
cd Herbal_Garden
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```
MONGO_URI=your_mongodb_connection_string
PORT=5000
```

Start the server:

```bash
npm start
```

You should see the following output in the terminal:

```text
============================================================
🚀 HERBAL GARDEN FULL BACKEND STARTED!
📍 Port: 5000
🌐 URL: http://localhost:5000
🔗 Test: http://localhost:5000/api/test
============================================================
📋 AVAILABLE ENDPOINTS:
   📦 Products: http://localhost:5000/api/products
   📧 Contact: http://localhost:5000/api/contact
   🛒 Orders: http://localhost:5000/api/orders
   👁️  View contacts: http://localhost:5000/api/contacts
   👁️  View orders: http://localhost:5000/api/orders
============================================================
💾 DATA WILL BE SAVED TO:
   • contacts - Form submissions
   • products - All medicinal plants
   • orders - Customer orders
============================================================
⚠️  Make sure MongoDB Atlas is configured:
   1. Create free cluster at https://cloud.mongodb.com/
   2. Get connection string from "Connect" button
   3. Add to .env file: MONGODB_URI=your_connection_string
   4. Add your IP to Network Access in MongoDB Atlas
============================================================
✅ Connected to MongoDB Atlas!
📁 Database: herbal_garden
📊 Found existing products in database
============================================================
```

After this, open the following URL in your browser:

🌐 **[http://localhost:5000](http://localhost:5000)**

---

## ☁️ Deployment (Render)

* **Language:** Node
* **Branch:** main
* **Root Directory:** backend
* **Build Command:** npm install
* **Start Command:** node server.js or npm start

### MongoDB Atlas Configuration

* Network Access → Allow access from anywhere (`0.0.0.0/0`)

---

## 👨‍🌾 Author

**Ashish Kumar**

Herbal_Garden Project

---


🌿 *Growing nature with technology* 🌿
