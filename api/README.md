# ⚙️ ShopMandu Backend

The **ShopMandu Backend** is a RESTful API built with **Node.js** and **Express.js**. It powers the ShopMandu multi-vendor marketplace by handling authentication, authorization, product management, orders, payments, image uploads, AI-powered product descriptions, email delivery, and other marketplace operations.

---

# Prerequisites

Before running the backend, ensure the following software is installed:

- Node.js (v18 or later recommended)
- npm
- MongoDB
- Docker Desktop (for Redis)

You will also need accounts or credentials for:

- Google Cloud Platform
- Cloudinary
- Stripe
- Khalti
- Gmail (App Password)
- Google Gemini AI

---

# Installation

### 1. Navigate to the backend directory

```bash
cd api
```

### 2. Install dependencies

```bash
npm install
```

---

# Environment Configuration

Create a `.env` file inside the **api** directory.

Copy the provided example file.

```bash
cp .env.example .env
```

Or simply:

1. Copy `.env.example`
2. Rename the copied file to `.env`
3. Fill in all required environment variables.

The backend requires configuration for:

- MongoDB
- JWT Authentication
- Google OAuth
- Cloudinary
- Redis
- Stripe
- Khalti
- Nodemailer
- Google Gemini AI

Refer to the provided `.env.example` file for the complete list of environment variables.

> [!NOTE]
> The provided `.env.example` file contains all environment variables required by the application.
>
> Some services such as **Google OAuth**, **Cloudinary**, **Stripe**, **Khalti**, **Redis**, **Nodemailer**, and **Google Gemini AI** require their own accounts and API credentials before the related features can be used.
>
> If you are only exploring or developing a subset of the application, you may leave the credentials for unused services empty. However, features depending on those services will not function until valid credentials are provided.

---

# Google OAuth Setup

ShopMandu supports Google Sign-In using Google's OAuth 2.0 authentication service.

## Step 1. Create a Google Cloud Project

Visit:

https://console.cloud.google.com/

Create a new project or use an existing one.

---

## Step 2. Configure OAuth Consent Screen

Navigate to:

```
APIs & Services
    ↓
OAuth Consent Screen
```

Configure the application information.

---

## Step 3. Create OAuth Credentials

Navigate to:

```
APIs & Services
    ↓
Credentials
```

Create a new:

```
OAuth Client ID
```

Application Type:

```
Web Application
```

### Authorized JavaScript Origin

```
http://localhost:5000
```

### Authorized Redirect URI

```
http://localhost:5000/api/auth/register/google
```

---

## Step 4. Configure Environment Variables

After creating the OAuth Client, Google will provide you with a **Client ID** and **Client Secret**.

Open your project's **Credentials** page, copy the generated values, and paste them into your `.env` file.

| Environment Variable | Value                                                       |
| -------------------- | ----------------------------------------------------------- |
| `CLIENT_ID`          | Copy your **OAuth Client ID** from Google Cloud Console     |
| `CLIENT_SECRET`      | Copy your **OAuth Client Secret** from Google Cloud Console |
| `PROJECT_ID`         | Your Google Cloud Project ID                                |
| `AUTH_URI`           | Use the default Google OAuth URL                            |
| `TOKEN_URI`          | Use the default Google OAuth URL                            |
| `AUTH_PROVIDER_URL`  | Use the default Google OAuth certificates URL               |
| `REDIRECT_URI`       | `http://localhost:5000/api/auth/register/google`            |
| `SCOPE`              | `openid-email-profile`                                      |

Your `.env` configuration should look similar to:

```env
CLIENT_ID=your-google-client-id
CLIENT_SECRET=your-google-client-secret
PROJECT_ID=your-google-project-id

AUTH_URI=https://accounts.google.com/o/oauth2/auth
TOKEN_URI=https://oauth2.googleapis.com/token
AUTH_PROVIDER_URL=https://www.googleapis.com/oauth2/v1/certs

REDIRECT_URI=http://localhost:5000/api/auth/register/google

SCOPE=openid-email-profile
```

> [!TIP]
> You can find the **Client ID** and **Client Secret** by navigating to:
>
> **Google Cloud Console → APIs & Services → Credentials → Your OAuth Client**
>
> Copy the values directly from the credential details page into your `.env` file.

---

# Email (Nodemailer) Setup

ShopMandu uses **Nodemailer** to send:

- Email Verification
- Password Reset Emails
- Contact Us Messages
- Other Email Notifications

For Gmail, use an **App Password** instead of your regular account password.

---

## Step 1. Enable Two-Factor Authentication

Open:

https://myaccount.google.com/security

Enable:

```
2-Step Verification
```

---

## Step 2. Generate an App Password

Navigate to:

```
Google Account
    ↓
Security
    ↓
App Passwords
```

Generate a new App Password.

Google will provide a **16-character password**.

---

## Step 3. Configure Environment Variables

```env
EMAIL_USER=your-email@gmail.com
PASS_USER=your-google-app-password
```

> Never use your normal Gmail password.

---

# Redis Setup

ShopMandu uses **Redis** for request rate limiting and future caching support.

## Install Docker Desktop

Download Docker Desktop from:

https://docs.docker.com/desktop/setup/install/windows-install/

---

## Install WSL (Windows)

If Docker requests WSL, install it by running:

```bash
wsl --install
```

Update WSL if necessary:

```bash
wsl --update
```

Restart your computer if prompted.

---

## Start Redis

Run the following command:

```bash
docker run -d --name redis-stack -p 6379:6379 -p 8001:8001 redis/redis-stack:latest
```

After Redis starts successfully:

Redis Server

```
redis://localhost:6379
```

Redis Insight

```
http://localhost:8001
```

---

# Start the Email Worker

ShopMandu uses **BullMQ** to process email jobs asynchronously.

The email worker handles:

- Email Verification
- Password Reset Emails
- Contact Us Emails
- Other queued email notifications

Open a **second terminal**.

Navigate to the backend directory.

```bash
cd api
```

Run the worker.

```bash
node src/workers/email.worker.js
```

Keep this terminal running while developing.

> Redis must be running before starting the worker.

---

# Running the Application

> [!IMPORTANT]
> Before starting the backend, ensure the following services are properly configured and running:
>
> - MongoDB
> - Redis (Docker Container)
> - Email Worker (BullMQ)
> - Required third-party credentials in `.env`
>
> Missing or incorrect configuration may prevent certain features such as authentication, payments, image uploads, AI generation, or email delivery from working correctly.

Start the backend server.

```bash
npm start
```

The API will run on:

```
http://localhost:5000
```

---

# Available Scripts

| Command                            | Description                      |
| ---------------------------------- | -------------------------------- |
| `npm start`                        | Starts the backend using Nodemon |
| `node src/workers/email.worker.js` | Starts the BullMQ email worker   |

---

# Core Technologies

| Category       | Technology        |
| -------------- | ----------------- |
| Runtime        | Node.js           |
| Framework      | Express.js        |
| Database       | MongoDB           |
| ODM            | Mongoose          |
| Authentication | JWT, Google OAuth |
| Validation     | Zod               |
| Cache          | Redis             |
| Storage        | Cloudinary        |
| Email          | Nodemailer        |
| Queue          | BullMQ            |
| Payments       | Stripe, Khalti    |
| AI             | Google Gemini AI  |

---

# Security

The backend includes multiple layers of security.

- JWT Authentication
- Google OAuth Authentication
- Role-Based Access Control (RBAC)
- Password Hashing using bcrypt
- Helmet Security Middleware
- Configurable CORS Policy
- Request Validation using Zod
- Redis-backed Rate Limiting
- Centralized Error Handling
- Environment-based Configuration

---

# Rate Limiting

Redis-backed rate limiting protects the API from abuse.

| Endpoint       | Policy                             |
| -------------- | ---------------------------------- |
| Authentication | 10 requests per minute per IP      |
| Contact Us     | 3 requests every 30 minutes per IP |

---

# API Modules

The backend is organized into modular route groups.

| Module         | Description                           |
| -------------- | ------------------------------------- |
| Authentication | User authentication and authorization |
| Users          | User profile management               |
| Vendors        | Vendor registration and management    |
| Shops          | Shop management                       |
| Products       | Product management                    |
| Categories     | Category management                   |
| Cart           | Shopping cart                         |
| Wishlist       | Wishlist management                   |
| Orders         | Order processing                      |
| Payments       | Stripe & Khalti integration           |
| Coupons        | Coupon management                     |
| Reviews        | Product reviews and ratings           |
| Returns        | Return request management             |
| AI             | AI-generated product descriptions     |
| Contact        | Contact Us functionality              |

---

# Project Structure

The backend follows a modular architecture.

| Directory          | Description                                                   |
| ------------------ | ------------------------------------------------------------- |
| `src/config/`      | Application configuration                                     |
| `src/controllers/` | Route controllers                                             |
| `src/middleware/`  | Authentication, validation, error handling, and rate limiting |
| `src/models/`      | Database models                                               |
| `src/routes/`      | API route definitions                                         |
| `src/services/`    | Business logic and integrations                               |
| `src/utils/`       | Utility functions                                             |
| `src/workers/`     | BullMQ background workers                                     |
| `src/server.js`    | Application entry point                                       |

---

# External Services

| Service          | Purpose                           |
| ---------------- | --------------------------------- |
| MongoDB          | Primary Database                  |
| Redis            | Rate limiting and future caching  |
| Cloudinary       | Image storage                     |
| Stripe           | Online payment processing         |
| Khalti           | Digital payment gateway           |
| Nodemailer       | Email delivery                    |
| Google Gemini AI | AI-generated product descriptions |

---

# Additional Documentation

For additional project documentation, refer to:

- 📖 **Project Documentation:** `../README.md`
- 🖥️ **Frontend Documentation:** `../web/README.md`

---

<div align="center">

Built with ❤️ using **Node.js**, **Express.js**, **MongoDB**, **Redis**, **BullMQ**, **Cloudinary**, and **Google Gemini AI**.

</div>
