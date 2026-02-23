# 📋 Deployment Checklist for AQI Project

Use this checklist to ensure everything is ready for deployment.

---

## ✅ Pre-Deployment Setup

### Code Preparation
- [ ] All code committed to Git
- [ ] No sensitive data in code (API keys should be in `.env`)
- [ ] `.env` files are NOT committed (check `.gitignore`)
- [ ] `.env.example` files exist for all services

### Dependencies
- [ ] `requirements.txt` is updated with all Python packages
- [ ] `requirements.txt` includes production server (gunicorn)
- [ ] `package.json` has all npm dependencies
- [ ] No deprecated or vulnerable packages

### Code Quality
- [ ] No syntax errors (`python -m py_compile backend/*.py`)
- [ ] Frontend builds without errors (`npm run build`)
- [ ] Backend starts without errors (`python app.py`)
- [ ] All imports resolve correctly

### Configuration Files
- [ ] ✅ `Dockerfile` exists in backend/
- [ ] ✅ `frontend/Dockerfile` exists
- [ ] ✅ `docker-compose.yml` exists
- [ ] ✅ `render.yaml` exists
- [ ] ✅ `.gitignore` configured correctly
- [ ] ✅ `.dockerignore` configured

### Documentation
- [ ] ✅ `DEPLOYMENT_GUIDE.md` created
- [ ] ✅ README.md updated with deployment info
- [ ] Comments added to complex code sections
- [ ] API endpoints documented

---

## ✅ Local Testing

Before pushing to cloud, run these tests:

### Backend Testing
- [ ] Database initializes: `python backend/init_data.py`
- [ ] Server starts: `python backend/app.py`
- [ ] Health check passes: `curl http://localhost:5000/api/health`
- [ ] API endpoints work: Test 2-3 endpoints
- [ ] No 500 errors in logs

### Frontend Testing
- [ ] Dependencies install: `npm install` in frontend/
- [ ] Dev server starts: `npm start`
- [ ] Build succeeds: `npm run build`
- [ ] Build size is reasonable (< 500KB)
- [ ] No console errors or warnings

### Integration Testing
- [ ] Frontend can communicate with backend
- [ ] Real-time data updates work
- [ ] No CORS errors
- [ ] WebSocket connections (if used) work

### Docker Testing
- [ ] Docker image builds: `docker build`
- [ ] Container runs: `docker run`
- [ ] Container health check passes
- [ ] Port forwarding works

---

## ✅ GitHub Setup

### Repository
- [ ] GitHub repository created
- [ ] Code pushed to GitHub (main branch)
- [ ] Repository is public (or accessible to Render)
- [ ] Branch protection rules configured (optional)

### Git Configuration
- [ ] No large files in repo (> 100MB)
- [ ] No unnecessary files committed
- [ ] `.gitignore` prevents node_modules upload
- [ ] `.gitignore` prevents __pycache__ upload

---

## ✅ Render Setup

### Account & Access
- [ ] Render account created at render.com
- [ ] GitHub account connected to Render
- [ ] Repository authorized for Render access

### Environment Variables
- [ ] All required env vars identified
- [ ] Sensitive keys not in code (use Render dashboard)
- [ ] Backend env vars set in Render dashboard:
  - [ ] FLASK_ENV=production
  - [ ] PYTHONUNBUFFERED=1
  - [ ] API keys (if any)
- [ ] Frontend env vars set in Render dashboard:
  - [ ] REACT_APP_API_URL=https://aqi-backend.onrender.com/api

### Service Configuration
- [ ] Backend service configured
  - [ ] Name: aqi-backend (or chosen name)
  - [ ] Runtime: Docker
  - [ ] Port: 5000
  - [ ] Memory: Sufficient (at least 512MB)
- [ ] Frontend service configured
  - [ ] Name: aqi-frontend
  - [ ] Type: Static Site
  - [ ] Build command: `cd frontend && npm install && npm run build`
  - [ ] Publish directory: `frontend/build`

---

## ✅ post-Deployment Testing

### Health Checks
- [ ] Backend health endpoint responds: `/api/health`
- [ ] Frontend loads in browser
- [ ] No 500 errors in Render logs
- [ ] Services auto-restart if they crash

### Functionality Testing
- [ ] API endpoints accessible
- [ ] Database queries work
- [ ] Frontend displays data
- [ ] User interactions work
- [ ] Real-time updates functional

### Performance
- [ ] Page load time < 3 seconds
- [ ] API response time < 1 second
- [ ] No memory leaks (monitor for 15 min)
- [ ] Database queries efficient

### Security
- [ ] HTTPS enabled (Render default)
- [ ] No sensitive data in logs
- [ ] Database credentials not exposed
- [ ] API keys not in frontend code
- [ ] CORS properly configured

---

## ✅ Monitoring & Maintenance

### Logging
- [ ] Both backend and frontend logs accessible
- [ ] Error notifications configured (optional)
- [ ] Performance metrics visible

### Updates
- [ ] Monitor security updates for dependencies
- [ ] Plan for database backups (if using PostgreSQL)
- [ ] Update documentation with deployment URLs

### Backup Plan
- [ ] Know how to rollback to previous version
- [ ] Database backup strategy documented
- [ ] Disaster recovery plan in place

---

## 📊 Deployment Progress

### Phase 1: Preparation
- Time: 15-20 minutes
- Status: ⏳ In Progress / ✅ Complete

### Phase 2: Local Testing  
- Time: 10-15 minutes
- Status: ⏳ In Progress / ✅ Complete

### Phase 3: GitHub Push
- Time: 5 minutes
- Status: ⏳ In Progress / ✅ Complete

### Phase 4: Render Deployment
- Time: 10-15 minutes (first deploy)
- Status: ⏳ In Progress / ✅ Complete

### Phase 5: Post-Deployment Testing
- Time: 10 minutes
- Status: ⏳ In Progress / ✅ Complete

---

## 🆘 Quick Troubleshooting

| Issue | Check | Solution |
|-------|-------|----------|
| Backend won't start | Logs in Render | Check Dockerfile, requirements.txt |
| Frontend blank page | Browser console | Check REACT_APP_API_URL env var |
| 404 errors on routes | Frontend routes | Check build command, publish directory |
| CORS errors | Browser console | Check CORS headers in Flask |
| Database connection error | Backend logs | Check DATABASE_URL env var |
| Slow performance | Render metrics | Scale up resources, check queries |

---

## 📞 Support Contacts

- **Render Docs**: https://render.com/docs
- **Flask Documentation**: https://flask.palletsprojects.com
- **React Documentation**: https://react.dev
- **GitHub Issues**: Create issue in your repository

---

**Last Updated**: February 23, 2026  
**Deployment Platform**: Render.com  
**Last Deployed**: [Add date of first deployment]
