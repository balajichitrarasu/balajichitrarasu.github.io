# 🚀 Balaji Chitrarasu Portfolio — Open-Source REST API Backend

> A zero-dependency, pure Node.js REST API with file database (`database.json`), CORS support, and automatic frontend synchronization.

---

## 💻 1. Local Quickstart

To run the backend server locally on your machine:

```bash
# Navigate to the portfolio folder
cd G:\Portfolio

# Start the Node.js backend server
node server.js
```

You will see:
```text
🚀 Balaji Chitrarasu Portfolio Open-Source Backend Running!
📡 Local Server URL: http://localhost:3000
📊 Health Endpoint:  http://localhost:3000/api/health
💾 Database File:   G:\Portfolio\database.json
```

---

## 📡 2. Live REST API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Backend status & health check |
| `GET` / `POST` | `/api/profile` | Read or update profile avatar, name, role, location |
| `GET` / `POST` | `/api/skills` | Read or replace technical skills array |
| `GET` / `POST` / `PUT` / `DELETE` | `/api/projects` | Full CRUD operations for projects |
| `GET` / `POST` / `DELETE` | `/api/certs` | Full CRUD operations for certifications |
| `GET` / `POST` | `/api/messages` | Save & view contact form submissions |
| `POST` | `/api/analytics/hit` | Record page view hit counter |

---

## ☁️ 3. Deploy Live for FREE (Zero Cost Options)

### Option A: Render.com (Free Web Service)
1. Push your `G:\Portfolio` code to a **GitHub Repository**.
2. Log into [Render.com](https://render.com) → Click **New Web Service**.
3. Select your GitHub repository.
4. Set:
   - **Build Command**: `npm install` (or leave empty)
   - **Start Command**: `node server.js`
5. Click **Create Web Service**. Your free backend URL will be live at `https://your-app.onrender.com`!

### Option B: Railway.app (Free Tier)
1. Connect GitHub to [Railway.app](https://railway.app).
2. Click **New Project** → **Deploy from GitHub repo**.
3. Railway automatically detects `server.js` and deploys your REST API in 30 seconds!

---

## 🔗 4. Connect Deployed Backend to Portfolio Frontend

In `index.html` or `script.js`, set your deployed API URL:

```javascript
window.PORTFOLIO_API_URL = "https://your-app.onrender.com";
```

`api.js` will automatically fetch from your live cloud API when online, and fall back to `localStorage` when offline!
