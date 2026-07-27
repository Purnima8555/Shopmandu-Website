# 🖥️ ShopMandu Frontend

The **ShopMandu Frontend** is a modern React application built with **Vite** that provides a fast, responsive, and intuitive user experience for customers, vendors, and administrators. It communicates with the ShopMandu backend through a RESTful API to deliver marketplace functionality such as authentication, product browsing, shopping cart management, order processing, and dashboard management.

---

# Prerequisites

Before running the frontend application, ensure you have the following installed:

- Node.js (v18 or later recommended)
- npm (or another supported package manager)
- A running ShopMandu backend server

---

# Installation

### 1. Navigate to the frontend directory

```bash
cd web
```

### 2. Install dependencies

```bash
npm install
```

---

# Environment Configuration

Create a `.env` file inside the `web` directory.

You can create it by copying the provided example file:

```bash
cp .env.example .env
```

Or simply:

1. Copy `.env.example`
2. Rename the copied file to `.env`

Your `.env` file should contain:

```env
VITE_SERVER_URL="http://localhost:5000"
```

> **Note:** Update the value if your backend server is running on a different host or port.

---

# Run the Development Server

Start the development server:

```bash
npm run dev
```

By default, the application will be available at:

```
http://localhost:3000
```

---

# Project Structure

The frontend is organized into modular directories to improve maintainability and scalability.

| Directory         | Description                            |
| ----------------- | -------------------------------------- |
| `src/api/`        | API service functions                  |
| `src/assets/`     | Static assets such as images and icons |
| `src/components/` | Reusable UI components                 |
| `src/constants/`  | Application constants                  |
| `src/features/`   | Feature-specific components and logic  |
| `src/pages/`      | Application pages                      |
| `src/routers/`    | React Router configuration             |
| `src/utils/`      | Utility functions                      |

---

# Additional Documentation

For more information about the project, refer to:

- 📖 **Project Overview:** `../README.md`
- ⚙️ **Backend Documentation:** `../api/README.md`

---

<div align="center">

Built with ❤️ using **React**, **Vite**, **Tailwind CSS**, and **Zustand**.

</div>
