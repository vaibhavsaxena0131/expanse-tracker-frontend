# 💸 Expense Tracker Frontend

A frontend web application for tracking employee expenses, with features like submitting expenses, approval/rejection by admins, and real-time status updates.

Built with:
- ⚛️ React
- 🧠 Redux Toolkit
- ⛑️ TypeScript
- 🧪 Axios
- 🌐 API integration with backend (Node.js)

---

## 📦 Features

- 👤 User authentication (login/register)
- 📄 Submit new expense requests
- 📋 View submitted expense history
- ✅ Admin approval/rejection of expenses
- 🔄 Auto-refresh after action (approve/reject)
- 🔐 Secure API calls with token and credentials

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v20+)
- npm

---

### 📁 Project Structure

```
src/
├── components/        # Reusable UI components
├── pages/             # Page-level components (Dashboard, Login, etc.)
├── store/             # Redux Toolkit setup (slices, store)
├── api/               # Axios config and API calls
├── utils/             # Helper functions
└── App.tsx            # Main app entry
```

---

## 🧠 State Management

Using `@reduxjs/toolkit`:

* `expensesSlice` for expense items
* `authSlice` for login/logout/auth state

---

## 📡 API Usage

The app makes authenticated requests using Axios. Login tokens are stored in cookies using:

```ts
axios.defaults.withCredentials = true;
```

---

## 🛠️ Scripts

```bash
npm run dev       # start development server
npm run build     # build for production
npm run preview   # preview built app
```

---

## 🧪 TODOs / Improvements

* [ ] Add filters for date/category
* [ ] Add notifications on approval/rejection
* [ ] Add pagination and search
* [ ] Add dark mode toggle

---

## 🧑‍💻 Contributors

* Vaibhav 

---
