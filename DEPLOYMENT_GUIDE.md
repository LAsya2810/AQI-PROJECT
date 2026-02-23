# 🚀 Deployment Guide - AQI Project to Render

Complete guide to deploy the AQI application to Render.com

---

## 📋 Prerequisites

1. **Render Account** - Sign up at [render.com](https://render.com)
2. **GitHub Account** - Link your code repository
3. **Git** - Version control system
4. **Node.js 14+** - For building frontend
5. **Python 3.11+** - For backend

---

## 🔑 Step 1: Prepare Your Code for Deployment

### 1.1 Create Git Repository (if not already done)

```bash
cd c:\Users\Admin\OneDrive\Desktop\AQI_PROJECT
git init
git add .
git commit -m "Initial commit - AQI project"
```

### 1.2 Add Deployment Files

The following files have been created for you:
- ✅ `Dockerfile` - Backend containerization
- ✅ `render.yaml` - Render deployment config
- ✅ `.env.example` files - Environment variable templates

### 1.3 Create .env Files from Examples

**Backend:**
```bash
cp backend\.env.example backend\.env
```

Edit `backend\.env` and add any API keys if needed.

**Frontend:**
```bash
cp frontend\.env.example frontend\.env
```

Make sure `REACT_APP_API_URL` points to your Render backend URL.

---

## 🌐 Step 2: Push Code to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/aqi-project.git
git branch -M main
git push -u origin main
```

---

## 🎯 Step 3: Deploy on Render

### Option A: Deploy with render.yaml (Recommended)

1. **Go to** [render.com/dashboard](https://render.com/dashboard)
2. **Click** "New +" → "Blueprint"
3. **Connect** your GitHub repository
4. **Select** the repository and branch (main)
5. **Review** the render.yaml configuration
6. **Click** "Deploy"

Render will automatically:
- Build Docker image for backend
- Deploy backend service
- Build and deploy frontend
- Set up environment variables

### Option B: Manual Deployment (Alternative)

#### Deploy Backend:

1. Go to [Render Dashboard](https://render.com/dashboard)
2. Click "New +" → "Web Service"
3. **Configuration:**
   - **Name:** aqi-backend
   - **GitHub Repository:** select your repo
   - **Branch:** main
   - **Runtime:** Docker
   - **Build Command:** `pip install -r backend/requirements.txt`
   - **Start Command:** `cd backend && gunicorn --bind 0.0.0.0:5000 --workers 4 app:app`
   - **Plan:** Free or Starter (as needed)

4. **Environment Variables:**
   ```
   FLASK_ENV=production
   PYTHONUNBUFFERED=1
   ```

5. Click "Create Web Service"

#### Deploy Frontend:

1. Click "New +" → "Static Site"
2. **Configuration:**
   - **Name:** aqi-frontend
   - **GitHub Repository:** select your repo
   - **Branch:** main
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/build`

3. **Environment Variables:**
   ```
   REACT_APP_API_URL=https://aqi-backend.onrender.com/api
   ```
   (Replace `aqi-backend` with your actual backend service name)

4. Click "Create Static Site"

---

## 🔗 Step 4: Connect Frontend to Backend

After backend deployment, update the frontend API URL:

1. **Get Backend URL:** From Render Dashboard → Backend Service → Note the URL (e.g., `https://aqi-backend.onrender.com`)

2. **Update Frontend Environment:**
   - Update `frontend/.env`:
     ```
     REACT_APP_API_URL=https://aqi-backend.onrender.com/api
     ```
   - Push changes to GitHub
   - Render will auto-redeploy frontend

---

## 🗄️ Step 5: Set Up Database (if using PostgreSQL)

### Using SQLite (Current - No Additional Setup)

Your app uses SQLite which is file-based, so no database setup needed.

### Upgrade to PostgreSQL (Optional for Production)

If you want a managed database:

1. Go to Render Dashboard → "New +" → "PostgreSQL"
2. Create database
3. Update backend connection string in environment variables:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```
4. Update `app.py` to use PostgreSQL instead of SQLite

---

## 🧪 Step 6: Test Your Deployment

### Check Backend Health

```bash
curl https://aqi-backend.onrender.com/api/health
```

Expected response:
```json
{
  "status": "Backend is running",
  "timestamp": "2024-02-23T10:00:00"
}
```

### Check Frontend

Open: `https://aqi-frontend.onrender.com`

Should display the AQI dashboard.

### Check API Endpoints

```bash
# Get current AQI for a city
curl https://aqi-backend.onrender.com/api/current/Delhi

# Get forecast
curl https://aqi-backend.onrender.com/api/forecast/Delhi
```

---

## 📊 Monitoring & Logs

1. **Go to** Render Dashboard
2. **Select** your service (backend or frontend)
3. **Click** "Logs" to view real-time logs
4. **Check** for errors or warnings

---

## 🔄 Continuous Deployment

Once deployed:
- **Automatic redeploy:** Every time you push to main branch
- **View deployments:** Services → Deployments tab
- **Rollback:** Click previous deployment version

---

## ⚠️ Troubleshooting

### Backend Won't Start

**Check logs:**
```
Render Dashboard → Service → Logs
```

**Common issues:**
- Missing dependencies in requirements.txt
- Environment variables not set
- Port already in use

**Solution:**
```bash
# Verify Dockerfile builds locally
docker build -t aqi-backend backend/
docker run -p 5000:5000 aqi-backend
```

### Frontend Can't Connect to Backend

**Check:**
1. Backend service is running
2. `REACT_APP_API_URL` matches backend URL
3. CORS is enabled in backend (already configured)

**Fix:**
```bash
# Update frontend/.env
REACT_APP_API_URL=https://YOUR_BACKEND_URL/api
```

### Build Failures

**Most common:**
- Missing files (check all source files are committed)
- Syntax errors in code
- Node/Python version incompatibilities

**Solution:**
```bash
# Test locally first
npm run build    # Frontend
pip install -r requirements.txt  # Backend
python app.py    # Backend
```

---

## 💰 Cost Optimization

### Free Plan Limits (Render Free Tier)

- **Web Services:** 1 instance, limited resources
- **Databases:** No persistent storage
- **Builds:** Slower, limited buildtime
- **Downtime:** Service spins down after 15 min inactivity

### Upgrade for Production

- **Starter Plan:** $7/month per service
- **Benefits:** Always running, better performance

---

## 🔐 Security Checklist

- [ ] Remove `.env` file from git (use `.env.example`)
- [ ] Set production API keys in Render dashboard
- [ ] Enable HTTPS (Render does this automatically)
- [ ] Keep dependencies updated
- [ ] Monitor logs for errors/attacks
- [ ] Use strong database passwords (if PostgreSQL)

---

## 📞 Support

- **Render Docs:** https://render.com/docs
- **Project GitHub Issues:** Create issues in your repo
- **Contact:** Render support dashboard

---

## ✅ Deployment Checklist

- [ ] Code committed to GitHub
- [ ] All `.env.example` files created
- [ ] `Dockerfile` in backend/
- [ ] `render.yaml` in root
- [ ] GitHub connected to Render
- [ ] Backend service deployed
- [ ] Frontend service deployed
- [ ] Environment variables set
- [ ] Frontend URL points to correct backend
- [ ] Health check passes
- [ ] Dashboard loads in browser
