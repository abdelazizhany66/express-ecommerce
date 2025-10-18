# E-Commerce Backend API

The **E-Commerce Backend API** is a complete and scalable server-side application built with **Node.js**, **Express**, and **MongoDB**.  
It provides all the essential backend services needed to power a modern online store — including product management, authentication, payments, and order processing.

---

## Project Overview

The E-Commerce Backend API is designed following **RESTful API principles** to handle every aspect of an online store’s backend.  
It provides features for managing products, categories, users, and orders while maintaining security, validation, and scalability.

This project can be used as a **foundation for real-world e-commerce systems** or as a **portfolio project** demonstrating backend development skills with Node.js and MongoDB.

### Main Objectives

- Build a **modular and maintainable** backend architecture for e-commerce platforms.
- Support **secure authentication and authorization** using JSON Web Tokens (JWT).
- Implement **CRUD operations** for core entities such as categories, subcategories, brands, products, reviews, and coupons.
- Handle **image uploads and processing** using Multer and Sharp.
- Support **cash and online payments** through integration with a payment gateway ( Stripe).
- Apply **data validation** and **advanced error handling** for reliability.
- Ensure **high security** through modern practices like rate limiting, sanitization, and HTTPS.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [How the Web Works](#2-how-web-work)
3. [Preparing Tools and Environment](#3-preparing-tools-and-environment)
4. [Express Server and MongoDB Setup](#4-preparing-express-server-and-mongodb)
5. [Categories CRUD Operations](#5-categories-crud-operations)
6. [Error Handling & Validation Layer](#6-advanced-error-handling--adding-validation-layer)
7. [Subcategories & Brands CRUD](#7-subcategories-crud--brands-crud-operations)
8. [Products CRUD Operations](#8-products-crud-operations)
9. [Image Upload & Processing](#9-upload-single-and-multiple-images-and-image-processing)
10. [Authentication & Authorization](#10-authentication-and-authorization)
11. [Reviews, Wishlist & Addresses](#11-reviews-wishlist-and-user-addresses)
12. [Coupons & Shopping Cart](#12-coupons-and-shopping-cart)
13. [Orders, Payments & Deployment](#13-cash-and-online-orders-online-payments-and-deployments)
14. [Security](#14-security)

---

### 1 Project Overview

This section introduces the full **E-Commerce backend project** that will be implemented during the course.  
You’ll understand the **features**, **modules**, and **objectives** of the system before starting development.

**Keywords:** project structure, overview, backend roadmap, feature planning

---

### 2 How Web Work

A quick review of **network fundamentals** and **how the web works** — including requests, responses, and servers.  
This builds the foundation for understanding your backend’s role in the overall system.

**Keywords:** HTTP, networking basics, client-server, web fundamentals

---

### 3 Preparing Tools And Environment

Setting up your **development environment**, including Node.js, code editor, and project structure.

**Keywords:** Node.js setup, VS Code, environment configuration

---

### 4 Preparing Express Server And MongoDB

Creating and configuring an **Express.js server**, connecting it to a **MongoDB database**,  
and organizing the **project file structure** for scalability.

**Keywords:** Express setup, MongoDB connection, REST API structure

---

### 5 Categories CRUD Operations

Implementing **Create, Read, Update, Delete** operations for product categories (e.g., clothes, electronics).  
This introduces basic **RESTful API** concepts.

**Keywords:** CRUD, REST API, category endpoints, MongoDB models

---

### 6 Advanced Error Handling & Adding Validation Layer

Learning how **Express handles errors** and building a **global error handler**.  
Adding **data validation** to ensure clean, correct input.

**Keywords:** error middleware, Joi, validation, error handling patterns

---

### 7 SubCategories CRUD & Brands CRUD Operations

Creating **subcategories** that belong to main categories, and implementing **brands management**.

**Keywords:** subcategories, brands, relations, data modeling

---

### 8 Products CRUD Operations

Developing full **product management** features: create, edit, delete, search, filter, and sort.  
You’ll also implement **pagination** and **query features**.

**Keywords:** product API, filtering, sorting, search, pagination

---

### 9 Upload Single And Multiple Images And Image Processing

Handling **file uploads** (single and multiple) with **image processing** for performance optimization.  
Also includes error handling for invalid file types.

**Keywords:** multer, sharp, image optimization, file upload

---

### 10 Authentication And Authorization

Implementing full **user authentication** (register, login, forgot password) using **JWT tokens**.  
Adding **role-based access control (RBAC)** for Admins, Managers, and Users.

**Keywords:** JWT, auth, roles, RBAC, password hashing

---

### 11 Reviews, Wishlist And User Addresses

Building features for **user reviews**, **wishlist management**, and **user addresses** for delivery.  
Includes calculating average product ratings.

**Keywords:** reviews, wishlist, user addresses, rating system

---

### 12 Coupons And Shopping Cart

Creating **coupon management** for Admins and a **shopping cart system** for users.  
Includes applying discount coupons to the cart.

**Keywords:** coupons, discounts, shopping cart, cart logic

---

### 13 Cash And Online Orders, Online Payments And Deployments

Developing **order processing** for both **cash and online payments**.  
Integration with **payment gateways (e.g., Stripe)** and deployment on **Heroku**.

**Keywords:** Stripe, payment gateway, orders, Heroku deployment

---

### 14 Security

Applying **security best practices** to protect your backend —  
like data sanitization, rate limiting, CORS, and HTTPS configuration.

**Keywords:** XSS protection, CSRF, Helmet, Rate Limiting, HTTPS

---

## Tech Stack

- **Node.js** — JavaScript runtime environment
- **Express.js** — Web framework for building APIs
- **MongoDB** — NoSQL database for flexible data modeling
- **Mongoose** — ODM for MongoDB
- **JWT & bcrypt** — Authentication and password hashing
- **Multer + Sharp** — File uploads and image optimization
- **Stripe API** — Payment gateway integration
- **Helmet, CORS, Rate-Limiter** — Security middleware

---

## Installation & Setup

### Install dependencies

```bash
npm install

Create .env file

#  Environment Configuration
NODE_ENV=development
PORT=8000
BASE_URL=http://localhost:8000

#  Database Configuration
DB_USER=database-name
DB_PASSWORD=E1II3nAJxFKQYOFy
DB_NAME=ecommerce-db
DB_URI=mongodb+srv://database-name:E1UU2nAJxFKQYOFy@cluster0.oxadrz8.mongodb.net/

#  JWT Configuration
JWT_SECRET=kahgkgdakbadvbadbkvaditueiuie
JWT_EXPIRE_IN=90d

#  Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=fgrsybluinbhtqtj

#  Stripe Configuration
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_WEBHOOK_SECRET=whsec_dummy_example_key

Run the server

npm run start:dev
```
