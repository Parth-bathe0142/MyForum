# 📝 Forum App

A simple forum application built using **Node.js** and **MongoDB** as part of a **Coursera project** to demonstrate backend development skills. This project includes user authentication, forum creation, and post submissions.

## 🚀 Features

- User authentication (Signup, Login, Logout)
- Create new forums
- Post messages in forums
- Display forum and post lists dynamically

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend:** HTML, CSS, JavaScript
- **Session Management:** express-session

## 📂 Project Structure

```
📦 forum-app
├── 📂 public          # Frontend (HTML, CSS, JavaScript)
     ├── 📄 index.html
     ├── 📄 styles.html
├── 📂 server          # Backend (Node.js + Express)
     ├── 📄 server.js  # Main server file
     ├── 📄 mongoClient.js  # MongoDB connection logic
├── 📄 .env            # Environment variables
├── 📄 package.json    # Project dependencies
└── 📄 README.md       # Project documentation
```

## 🏗️ API Endpoints

### User Authentication

- `POST /signup_request` → Register a new user
- `POST /login_request` → Log in an existing user
- `GET /logout_request` → Log out the user

### Forums & Posts

- `GET /forum-list` → Get all forums
- `POST /new-forum` → Create a new forum
- `GET /forum/:id` → Get posts from a forum
- `POST /new-post` → Add a new post to a forum

## 🛠️ Future Improvements

- Password hashing for secure authentication
- Role-based access control
- User profile management
- Real-time updates using WebSockets

Made by Parth Bathe

