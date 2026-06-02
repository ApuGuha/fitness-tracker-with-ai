# Fitness Tracker with AI

## File Structure

```
fitness-tracker-with-ai/
├── backend/
│   ├── controllers/
│   │   ├── aiController.js        # AI plan generation via OpenRouter
│   │   └── authController.js      # User auth, profile CRUD
│   ├── middleware/
│   │   └── auth.js                # JWT verification middleware
│   ├── models/
│   │   ├── Plan.js                # Mongoose schema for AI plans
│   │   └── User.js                # Mongoose schema for users
│   ├── routes/
│   │   └── api.js                 # All API route definitions
│   ├── server.js                  # Express entry point (port 5000)
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js           # Axios instance with JWT interceptor
│   │   ├── pages/
│   │   │   ├── Auth.jsx            # Login / Register page
│   │   │   ├── Consultation.jsx    # AI consultation input page
│   │   │   ├── Dashboard.jsx       # Profile & plan history
│   │   │   └── PlanView.jsx        # View AI-generated plan
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
```

## Prerequisites

- **Node.js** (v18 or higher)
- **MongoDB** running locally on port 27017 (or at a custom URI)
- **OpenRouter API key** (free tier available at https://openrouter.ai/)

## Setup

### 1. Backend

```bash
cd backend
npm install
```

Set the following environment variables before running. Do **not** create a `.env` file — instead, set them directly in your terminal or shell profile:

| Variable | Description | Default / Example |
|---|---|---|
| `MONGODB_URI` | MongoDB connection string | `mongodb://127.0.0.1:27017/fitness-ai` |
| `JWT_SECRET` | Secret key for JWT signing | `your-super-secret-jwt-key-change-this` |
| `OPENROUTER_API_KEY` | API key for OpenRouter AI | `sk-or-v1-...` (get from https://openrouter.ai/) |
| `PORT` | Backend server port | `5000` |

**PowerShell (set inline):**
```powershell
$env:OPENROUTER_API_KEY="sk-or-v1-your-key-here"
$env:JWT_SECRET="your-super-secret-jwt-key-change-this"
npm run dev
```

**Command Prompt:**
```cmd
set OPENROUTER_API_KEY=sk-or-v1-your-key-here
set JWT_SECRET=your-super-secret-jwt-key-change-this
npm run dev
```

**Linux/macOS:**
```bash
OPENROUTER_API_KEY="sk-or-v1-your-key-here" \
JWT_SECRET="your-super-secret-jwt-key-change-this" \
npm run dev
```

### 2. Frontend

Open a **second terminal** and run:

```bash
cd frontend
npm install
npm run dev
```

The frontend starts on `http://localhost:5173` by default.

## How to Run

| Layer | Command | Description |
|-------|---------|-------------|
| Backend | `npm run dev` | Development mode with auto-reload (nodemon) |
| Backend | `npm start` | Production mode |
| Frontend | `npm run dev` | Vite dev server |
| Frontend | `npm run build` | Production build to `dist/` |
| Frontend | `npm run preview` | Preview production build |

Access the app at `http://localhost:5173`.

## API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/auth/register` | No | Register a new user |
| POST | `/api/auth/login` | No | Login, returns JWT |
| GET | `/api/auth/profile` | Yes | Get user profile |
| PUT | `/api/auth/profile` | Yes | Update user profile |
| POST | `/api/ai/generate` | Yes | Generate fitness plan via AI |
| GET | `/api/ai/plans` | Yes | List user's plans |
| GET | `/api/ai/plans/:id` | Yes | Get single plan by ID |
| GET | `/api/ai/models` | No | List available AI providers |
