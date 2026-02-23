# 🚀 Deployment Quick Reference

One-page cheat sheet for deploying the AQI Project to Render.

---

## 🎯 In 3 Steps

### Step 1: Test Locally
```bash
# Windows PowerShell
.\test-deployment.ps1

# OR macOS/Linux
bash test-deployment.sh
```

### Step 2: Push to GitHub
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 3: Deploy on Render
1. Go to https://render.com
2. Click "New Blueprint"
3. Connect GitHub repo
4. Done! ✅ Auto-deploys in 5 minutes

---

## 📝 Files Created

| File | Purpose |
|------|---------|
| `backend/Dockerfile` | Backend containerization |
| `frontend/Dockerfile` | Frontend containerization |
| `docker-compose.yml` | Local Docker orchestration |
| `render.yaml` | Render deployment config |
| `backend/.env.example` | Backend env template |
| `frontend/.env.example` | Frontend env template |
| `.gitignore` | Prevent sensitive file commits |
| `DEPLOYMENT_GUIDE.md` | Detailed deployment steps |
| `DEPLOYMENT_CHECKLIST.md` | Pre-deployment checklist |

---

## 🔑 Important Environment Variables

### Backend (`backend/.env`)
```
FLASK_ENV=production
PYTHONUNBUFFERED=1
DATABASE_URL=sqlite:///aqi_data.db
```

### Frontend (`frontend/.env`)
```
REACT_APP_API_URL=https://aqi-backend.onrender.com/api
```

---

## 🧪 Quick Validation

```bash
# Backend builds
docker build -t aqi-backend backend/

# Frontend builds  
cd frontend && npm run build

# Everything works together
docker-compose up
```

---

## 📞 Deployed URLs (After Deployment)

- **Frontend**: `https://aqi-frontend.onrender.com`
- **Backend API**: `https://aqi-backend.onrender.com/api`
- **Health Check**: `https://aqi-backend.onrender.com/api/health`

---

## 🔍 Monitor & Troubleshoot

**View Logs** (in Render Dashboard):
1. Select your service
2. Click "Logs" tab
3. Search for errors

**Common Issues**:
- Backend crashing → Check `requirements.txt` has gunicorn
- Frontend blank → Check `REACT_APP_API_URL` env var
- 404 errors → Check build directory is `frontend/build`

---

## 📚 Documentation

| Document | For |
|----------|-----|
| [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) | Detailed step-by-step instructions |
| [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) | Pre-deployment validation |
| [README.md](README.md) | Project overview |
| [QUICKSTART.md](QUICKSTART.md) | Local development setup |
| [ARCHITECTURE.md](ARCHITECTURE.md) | System design |

---

## ⚡ Performance Tips

1. **Frontend**: Minified build < 500KB ✅
2. **Backend**: Using Gunicorn with multiple workers ✅
3. **Database**: SQLite sufficient for MVP (upgrade to PostgreSQL for scale)
4. **Caching**: Add Redis for session caching (future enhancement)

---

## 🔐 Security Checklist

- [ ] `.env` NOT committed to Git
- [ ] Sensitive keys in Render dashboard only
- [ ] HTTPS enabled (Render default)
- [ ] CORS properly configured
- [ ] Input validation on backend
- [ ] Rate limiting on API endpoints (future)

---

## 📈 Scaling

| Need | Solution |
|------|----------|
| More traffic | Scale Render service (paid plans) |
| Database growth | Migrate to PostgreSQL |
| Better performance | Add caching layer (Redis) |
| Multiple instances | Enable auto-scaling (Render Team plan) |

---

## 🎓 Learning Resources

- [Render Documentation](https://render.com/docs)
- [Flask Production Guide](https://flask.palletsprojects.com/deployment/)
- [React Build Optimization](https://create-react-app.dev/docs/production-build/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

## ✅ Success Criteria

- [ ] Render dashboard shows both services "Live"
- [ ] Frontend loads without errors
- [ ] API endpoints respond
- [ ] Data displays in browser
- [ ] No 500 errors in logs
- [ ] Page loads in < 3 seconds

---

**Status**: 🟢 Ready to Deploy  
**Target Platform**: Render.com  
**Last Updated**: February 23, 2026  
**Version**: 1.0.0
