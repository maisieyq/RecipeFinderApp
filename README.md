# 🍳 RecipeFinderApp

## 📖 Table of Contents
- [Overview](#-overview)
- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Core Features](#-core-features)
- [System Architecture](#-system-architecture)
- [Data Management](#-data-management)
- [User Roles](#-user-roles)
- [Technology Stack](#-technology-stack)
- [Installation Guide](#-installation-guide)
- [Future Enhancements](#-future-enhancements)
- [Conclusion](#-conclusion)

---

## 📌 Overview
**RecipeFinderApp** is a React Native mobile application designed to help users efficiently search, explore, and manage recipes. It focuses on improving **meal planning** and reducing **food wastage** by providing intelligent recipe suggestions based on user needs and available ingredients.

The application integrates external APIs with local storage to deliver a **hybrid online-offline experience**.

---

## ❗ Problem Statement
Many users struggle with:
- Deciding what to cook daily  
- Underutilizing ingredients at home  
- Food wastage due to poor planning  

Traditional recipe platforms:
- Do not prioritize available ingredients  
- Lack personalization  
- Require constant internet access  

---

## 💡 Solution
RecipeFinderApp solves these issues by:
- Providing **ingredient-based recipe recommendations**  
- Allowing **offline data access using SQLite**  
- Offering **personalized features** such as favourites and history tracking  

---

## 🚀 Core Features

### 🏠 Home Module
- Displays featured recipes from TheMealDB API  
- Categorized browsing (Chicken, Beef, Seafood, Vegetarian, Dessert)  
- Quick access to popular recipes  

---

### 🔍 Search Module
- Real-time search with **debouncing**  
- Filter recipes by category  
- Sort results alphabetically  
- Optimized API usage  

---

### 🥕 Pantry-Based Discovery
- Users input available ingredients  
- System suggests matching recipes  
- Quick-add ingredient chips for faster interaction  

---

### 👤 Authentication System
- User registration & login  
- Password encryption using bcrypt  
- Persistent login with AsyncStorage  

---

### ⭐ Favourites Management
- Save recipes for future reference  
- Dedicated favourites screen  
- Full CRUD functionality  

---

### 🕒 Cooking History
- Tracks viewed recipes automatically  
- Enables quick revisit of past recipes  

---

### 📦 Pantry Management
- Add, view, and delete ingredients  
- Persistent storage using SQLite  
- Sync across sessions  

---

### 📖 Recipe Details
- Ingredients with measurements  
- Step-by-step instructions  
- Nutritional estimation  
- Cuisine and category tags  

---

### 🌙 Theme Support
- Light and dark mode  
- User-controlled settings  

---

## 🏗️ System Architecture
The application follows a **modular architecture**:
- **Presentation Layer**: UI Components  
- **Logic Layer**: State Management  
- **Data Layer**: API + SQLite Database  

This design ensures:
- Scalability  
- Maintainability  
- Clear separation of concerns  

---

## 🔄 Data Management

### 🌐 External API
- TheMealDB API for recipe data  

### 💾 Local Database (SQLite)
Stores:
- User accounts  
- Pantry items  
- Favourite recipes  
- Viewing history  

### 🔗 Hybrid Data Flow
- Online → Fetch recipes  
- Offline → Access saved data  

---

## 👥 User Roles

### 👀 Guest Users
- Browse recipes  
- Search recipes  

### 🔐 Authenticated Users
- Pantry management  
- Save favourites  
- View cooking history  
- Personalized experience  

---

## 🛠️ Technology Stack
- **Frontend**: React Native  
- **Database**: SQLite  
- **Storage**: AsyncStorage  
- **API**: TheMealDB  
- **Security**: bcrypt  

---

## ⚙️ Installation Guide

### 📌 Prerequisites
Make sure you have installed:
- Node.js  
- npm  
- React Native CLI  
- Android Studio (for emulator)
  

### 📥 1. Clone the Repository
```bash
git clone https://github.com/maisieyq/RecipeFinderApp.git
cd RecipeFinderApp
```


### 📦 2. Install Frontend Dependencies
```bash
npm install
```


### 🗄️ 3. Setup Backend Server (SQLite)
Navigate to the database folder:
```bash
cd database
```
Install backend dependencies:
```bash
npm install express sqlite3 cors bcrypt
```
Start the backend server:
```bash
node server.js
```


### 🔙 4. Return to Root Project
```bash
cd..
```


### ▶️ 5. Run the React Native App
```bash
npx react-native run-android


