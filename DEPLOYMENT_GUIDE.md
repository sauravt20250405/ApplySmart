# ApplySmart - Complete Deployment & Setup Guide
**Version:** 1.0.0  
**Author:** Saurav Thakur

---

## 📦 Complete Package Contents

### Backend Files
- ✅ `backend_server.py` - Main Flask server with AI validation
- ✅ `exam_rules_backend.py` - Exam rules configuration
- ✅ `requirements_backend.txt` - Python dependencies
- ✅ `.env.example` - Environment template

### Frontend Files
- ✅ `api-client.ts` - API client service for React
- ✅ Integration with existing React TypeScript setup

---

## 🚀 Local Development Setup

### Prerequisites
- Python 3.9+
- Node.js 18+
- Git
- 5GB free disk space (for AI models)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd applysmart-backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements_backend.txt

# Create environment file
cp .env.example .env

# Edit .env with your settings (optional for local dev)
nano .env  # or use your editor
```

### Step 2: Frontend Setup

```bash
# Navigate to frontend directory
cd applysmart-frontend

# Create .env file
cat > .env.local << EOF
REACT_APP_API_URL=http://localhost:5000/api
VITE_API_URL=http://localhost:5000/api
EOF

# Copy API client (if not already done)
cp ../api-client.ts src/lib/

# Install dependencies
npm install

# Start development server
npm run dev
```

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd applysmart-backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python backend_server.py
```

Server will start at: `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd applysmart-frontend
npm run dev
```

Frontend will start at: `http://localhost:5173`

---

## 🌐 Deployment Options

### Option 1: Render.com (Recommended for MVP)

#### Backend Deployment

1. **Create Render account:** https://render.com

2. **Create new Web Service:**
   - Connect GitHub repository
   - Select Python as runtime
   - Build command: `pip install -r requirements_backend.txt`
   - Start command: `gunicorn backend_server:app`

3. **Set environment variables:**
   ```
   SECRET_KEY=<generate-random-key>
   FLASK_ENV=production
   ```

4. **Deploy frontend** separately or use same service for static files

#### Frontend Deployment

1. **Create new Static Site:**
   - Connect GitHub repository
   - Build command: `npm install && npm run build`
   - Publish directory: `dist`

2. **Update API URL in `.env.production`:**
   ```
   REACT_APP_API_URL=https://your-backend-url.onrender.com/api
   ```

---

### Option 2: Docker + Docker Compose

#### Dockerfile (Backend)

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libsm6 libxext6 libxrender-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements_backend.txt .
RUN pip install --no-cache-dir -r requirements_backend.txt

# Copy application
COPY . .

# Create directories
RUN mkdir -p uploads outputs temp logs

# Expose port
EXPOSE 5000

# Run application
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "backend_server:app"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "5000:5000"
    environment:
      FLASK_ENV: production
      SECRET_KEY: ${SECRET_KEY}
      CORS_ORIGINS: http://localhost:3000,http://localhost:5173
    volumes:
      - ./backend/uploads:/app/uploads
      - ./backend/outputs:/app/outputs
      - ./backend/temp:/app/temp
    networks:
      - applysmart

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      REACT_APP_API_URL: http://backend:5000/api
    depends_on:
      - backend
    networks:
      - applysmart

networks:
  applysmart:
    driver: bridge
```

#### Run with Docker Compose

```bash
# Set environment variables
export SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")

# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

---

### Option 3: AWS EC2 + RDS

#### EC2 Setup

```bash
# Connect to EC2 instance
ssh -i your-key.pem ec2-user@your-instance-ip

# Update system
sudo yum update -y
sudo yum install python3 python3-pip git -y

# Clone repository
git clone https://github.com/yourusername/applysmart.git
cd applysmart

# Setup backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements_backend.txt

# Create systemd service
sudo tee /etc/systemd/system/applysmart.service > /dev/null <<EOF
[Unit]
Description=ApplySmart Backend
After=network.target

[Service]
Type=notify
User=ec2-user
WorkingDirectory=/home/ec2-user/applysmart/backend
ExecStart=/home/ec2-user/applysmart/backend/venv/bin/gunicorn backend_server:app
Environment="FLASK_ENV=production"
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# Enable and start service
sudo systemctl enable applysmart
sudo systemctl start applysmart
```

---

### Option 4: Heroku (Legacy but still working)

```bash
# Login to Heroku
heroku login

# Create app
heroku create your-app-name

# Add buildpack
heroku buildpacks:add heroku/python

# Set environment variables
heroku config:set SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
heroku config:set FLASK_ENV=production

# Create Procfile
echo "web: gunicorn backend_server:app" > Procfile

# Deploy
git push heroku main

# View logs
heroku logs --tail
```

---

## 🗄️ Database Setup (Production)

### PostgreSQL Setup

```bash
# Install PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb applysmart
sudo -u postgres createuser applysmart_user
sudo -u postgres psql -c "ALTER USER applysmart_user WITH PASSWORD 'secure_password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE applysmart TO applysmart_user;"

# Update .env
DATABASE_URL=postgresql://applysmart_user:secure_password@localhost:5432/applysmart
```

### MongoDB Setup (Alternative)

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Update .env
MONGODB_URI=mongodb://localhost:27017/applysmart
```

---

## 📊 Performance Optimization

### 1. Caching

```python
# Add to backend_server.py
from flask_caching import Cache

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

@app.route('/api/rules/<exam_type>/<int:year>')
@cache.cached(timeout=3600)  # Cache for 1 hour
def get_rules(exam_type, year):
    ...
```

### 2. Image Optimization

```python
# Optimize uploaded images
from PIL import Image

def optimize_image(file_path):
    img = Image.open(file_path)
    # Reduce size
    img.thumbnail((2000, 2000))
    # Convert to RGB if needed
    if img.mode in ('RGBA', 'LA'):
        img = img.convert('RGB')
    img.save(file_path, optimize=True, quality=85)
```

### 3. Async Processing

```python
# Use Celery for background tasks
from celery import Celery

celery = Celery(app.name)

@celery.task
def validate_document_async(file_path, rules):
    return AIValidationEngine.validate_document(file_path, 'photo', rules)
```

---

## 🔒 Security Hardening

### 1. HTTPS/SSL

```bash
# Generate SSL certificate (Let's Encrypt)
sudo apt-get install certbot
sudo certbot certonly --standalone -d yourdomain.com

# Update nginx config
server {
    listen 443 ssl http2;
    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
}
```

### 2. Rate Limiting

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

limiter = Limiter(
    app=app,
    key_func=get_remote_address,
    default_limits=["200 per day", "50 per hour"]
)

@app.route('/api/documents/upload', methods=['POST'])
@limiter.limit("10 per hour")
def upload_document():
    ...
```

### 3. Input Validation

```python
from werkzeug.validators import FileAllowed
from wtforms import Form, FileField, validators

class DocumentForm(Form):
    file = FileField('file', [
        FileAllowed(['jpg', 'jpeg', 'png'], 'Images only!')
    ])
```

### 4. CORS Configuration

```python
CORS(app, resources={
    r"/api/*": {
        "origins": os.getenv('CORS_ORIGINS', 'localhost:3000').split(','),
        "methods": ["GET", "POST", "PUT", "DELETE"],
        "allow_headers": ["Content-Type", "Authorization"]
    }
})
```

---

## 📈 Monitoring & Logging

### 1. Application Logging

```python
import logging
from logging.handlers import RotatingFileHandler

if not os.path.exists('logs'):
    os.mkdir('logs')

file_handler = RotatingFileHandler('logs/applysmart.log', maxBytes=10240000, backupCount=10)
file_handler.setFormatter(logging.Formatter(
    '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
))
file_handler.setLevel(logging.INFO)
app.logger.addHandler(file_handler)
```

### 2. Error Tracking (Sentry)

```python
import sentry_sdk
from sentry_sdk.integrations.flask import FlaskIntegration

sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    integrations=[FlaskIntegration()],
    traces_sample_rate=1.0
)
```

### 3. Monitoring Dashboard

```bash
# Install Prometheus client
pip install prometheus-flask-exporter

# Add to backend_server.py
from prometheus_flask_exporter import PrometheusMetrics
metrics = PrometheusMetrics(app)

# Access metrics at http://localhost:5000/metrics
```

---

## 🧪 Testing

### Unit Tests

```python
# test_backend.py
import unittest
from backend_server import app

class TestAuth(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_register(self):
        response = self.app.post('/api/auth/register', json={
            'phone': '+91 98765 43210',
            'name': 'Test User'
        })
        self.assertEqual(response.status_code, 201)
        self.assertIn('token', response.get_json())

if __name__ == '__main__':
    unittest.main()
```

### Run Tests

```bash
python -m pytest test_backend.py -v
```

---

## 🚨 Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Run `pip install -r requirements_backend.txt` |
| `CORS Error` | Update `CORS_ORIGINS` in `.env` |
| `Port already in use` | Change port: `python backend_server.py --port 5001` |
| `File upload fails` | Check `uploads` folder permissions |
| `Face detection not working` | Install OpenCV: `pip install opencv-python-headless` |
| `Out of memory` | Reduce max file size or use smaller images |
| `Database connection error` | Check `DATABASE_URL` in `.env` |

---

## 📱 Mobile & Cross-Platform

### React Native Setup

```bash
npx expo init applysmart-mobile
cd applysmart-mobile

# Copy API client to mobile project
cp api-client.ts src/lib/

# Install dependencies
npm install axios
```

### API Client for React Native

```typescript
// Use same api-client.ts - it's framework agnostic
import { apiClient } from './lib/api-client';

// Use in React Native component
const { upload } = useDocumentUpload();
```

---

## 📞 Support & Troubleshooting

### Getting Help

1. **Check Logs:** `tail -f logs/applysmart.log`
2. **Test API:** `curl http://localhost:5000/api/health`
3. **Check Network:** `netstat -tulpn | grep 5000`
4. **Database:** `sudo -u postgres psql -c "\list"`

### Contact

- **Email:** support@applysmart.in
- **Docs:** https://docs.applysmart.in
- **Issues:** https://github.com/yourusername/applysmart/issues

---

## ✅ Pre-Launch Checklist

- [ ] Backend server running without errors
- [ ] Frontend connects successfully to backend
- [ ] Authentication working (register/login)
- [ ] Document upload and validation working
- [ ] Rules loading for all exam types
- [ ] Error messages displaying correctly
- [ ] API response times < 2 seconds
- [ ] File uploads handling < 1 minute
- [ ] CORS configured correctly
- [ ] Environment variables set in production
- [ ] Database backed up
- [ ] SSL certificates valid
- [ ] Rate limiting enabled
- [ ] Logging configured
- [ ] Error tracking (Sentry) enabled
- [ ] Monitoring dashboard accessible

---

## 🎉 Launch!

Once all checks pass, you're ready to launch:

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Monitor
docker-compose logs -f backend frontend

# Backup
docker-compose exec db pg_dump applysmart > backup.sql
```

---

**Congratulations! Your ApplySmart application is deployed! 🚀**

For updates and new features, visit: https://github.com/yourusername/applysmart