# ApplySmart - Backend API Documentation & Integration Guide
**Version:** 1.0.0  
**Last Updated:** January 28, 2026  
**Author:** Saurav Thakur

---

## 🚀 Quick Start

### 1. Installation

```bash
# Clone repository
git clone https://github.com/yourusername/applysmart-backend.git
cd applysmart-backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements_backend.txt

# Setup environment
cp .env.example .env
# Edit .env with your configuration
```

### 2. Run Server

```bash
python backend_server.py
```

Server will start at: `http://localhost:5000`

### 3. Connect Frontend

Update your frontend API URL in `index.ts`:

```typescript
const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
};
```

---

## 📋 API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "phone": "+91 98765 43210",
  "name": "Raj Kumar",
  "email": "raj@example.com"
}

Response:
{
  "success": true,
  "user": {
    "id": "uuid",
    "phone": "+91 98765 43210",
    "createdAt": "2026-01-28T12:00:00",
    "preferences": {"theme": "light", "notifications": true}
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

#### Login with OTP
```
POST /api/auth/login
Content-Type: application/json

{
  "phone": "+91 98765 43210",
  "otp": "1234"
}

Response:
{
  "success": true,
  "user": {...},
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### Applications

#### Create Application
```
POST /api/applications
Authorization: Bearer {token}
Content-Type: application/json

{
  "examType": "NDA",
  "year": 2026
}

Response:
{
  "success": true,
  "application": {
    "id": "app-uuid",
    "examType": "NDA",
    "year": 2026,
    "status": "draft",
    "documents": [],
    "complianceScore": 0,
    "createdAt": "2026-01-28T12:00:00"
  }
}
```

#### Get Applications
```
GET /api/applications
Authorization: Bearer {token}

Response:
{
  "success": true,
  "applications": [...]
}
```

#### Get Application by ID
```
GET /api/applications/{appId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "application": {...}
}
```

---

### Document Upload & Validation

#### Upload Document
```
POST /api/documents/upload
Authorization: Bearer {token}
Content-Type: multipart/form-data

Parameters:
- file: <image_file>
- documentType: "photo" | "signature" | "document"
- appId: "application-id"
- rules: [JSON array of validation rules]

Response:
{
  "success": true,
  "document": {
    "id": "doc-uuid",
    "name": "photo.jpg",
    "type": "photo",
    "status": "complete",
    "uploadedAt": "2026-01-28T12:00:00"
  },
  "validation": {
    "documentId": "doc-uuid",
    "documentType": "photo",
    "overallPassed": true,
    "overallConfidence": 96,
    "complianceScore": 98,
    "results": [
      {
        "passed": true,
        "confidence": 98,
        "rule": {...},
        "details": "Dimensions correct: 4.0cm × 4.5cm"
      }
    ],
    "autoCorrections": [
      {
        "id": "correction-uuid",
        "type": "resize",
        "description": "Auto-resized to 500×500 pixels",
        "confidence": 96
      }
    ]
  }
}
```

#### Get Document
```
GET /api/documents/{docId}
Authorization: Bearer {token}

Response:
{
  "success": true,
  "document": {...}
}
```

#### Get Document Preview
```
GET /api/documents/{docId}/preview
Authorization: Bearer {token}

Response: Binary image data
```

---

### Rules & Validation

#### Get Exam Rules
```
GET /api/rules/{examType}/{year}

Example: GET /api/rules/NDA/2026

Response:
{
  "success": true,
  "ruleSet": {
    "examType": "NDA",
    "year": 2026,
    "version": "2.1.0",
    "requirements": [
      {
        "id": "nda-photo",
        "name": "Passport Size Photograph",
        "type": "photo",
        "required": true,
        "rules": [...]
      }
    ]
  }
}
```

---

### Analytics

#### Get User Analytics
```
GET /api/analytics
Authorization: Bearer {token}

Response:
{
  "success": true,
  "analytics": {
    "userId": "user-uuid",
    "totalApplications": 3,
    "documentStats": {
      "total": 12,
      "autoFixed": 10,
      "manualFixed": 2
    },
    "complianceHistory": [
      {
        "date": "2026-01-25",
        "score": 92
      }
    ],
    "timeSaved": 180
  }
}
```

---

### Health Check

```
GET /api/health

Response:
{
  "status": "healthy",
  "timestamp": "2026-01-28T12:00:00",
  "version": "1.0.0"
}
```

---

## 🔐 Authentication

### JWT Token Usage

Include token in all authenticated requests:

```bash
curl -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIs..." \
     http://localhost:5000/api/applications
```

### Token Expiration

- Default: 24 hours
- Configure in `.env`: `JWT_EXPIRATION_HOURS=24`

---

## 📁 Project Structure

```
applysmart-backend/
├── backend_server.py           # Main Flask application
├── exam_rules_backend.py       # Exam rules & validation rules
├── requirements_backend.txt    # Python dependencies
├── .env.example               # Environment template
├── uploads/                   # User uploaded files
├── outputs/                   # Processed/corrected files
├── temp/                      # Temporary processing files
├── logs/                      # Application logs
└── README.md                  # This file
```

---

## 🧠 AI Validation Features

### Image Processing Capabilities

1. **Dimension Validation**
   - Check pixel dimensions (pixels)
   - Convert between pixels ↔ cm/inches
   - Auto-resize with aspect ratio preservation

2. **DPI/Resolution Validation**
   - Calculate DPI from pixel dimensions
   - Validate minimum DPI requirements
   - Auto-upscale if needed

3. **File Size Validation**
   - Check file size constraints
   - Auto-compression
   - Format conversion

4. **Format Validation**
   - Check file format (JPEG, PNG, etc.)
   - Auto-conversion between formats

5. **Background Analysis**
   - Detect background uniformity
   - Identify white background
   - Auto-background normalization

6. **Face Detection**
   - Detect face presence
   - Check face size ratio
   - Verify frontal orientation

---

## 🔧 Integration with Frontend

### AppContext Integration

```typescript
// In your React component
import { useApp } from '@/context/AppContext';

const MyComponent = () => {
  const { currentApplication, user } = useApp();

  const validateDocument = async (file) => {
    // Get rules for current exam
    const rules = currentApplication.ruleSet.requirements[0].rules;

    // Call backend validation
    const response = await fetch('/api/documents/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData  // Contains file, documentType, appId, rules
    });

    const result = await response.json();
    // Update context with validation results
  };
};
```

### API Client Setup

```typescript
// lib/api.ts
export const apiClient = {
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',

  async request(method, endpoint, data?, token?) {
    const headers = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers,
      body: data ? JSON.stringify(data) : undefined
    });

    return response.json();
  },

  async upload(endpoint, formData, token) {
    const headers = {};

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers,
      body: formData
    });

    return response.json();
  }
};
```

---

## 🚨 Error Handling

### Standard Error Response

```json
{
  "error": "Error message describing what went wrong",
  "code": "ERROR_CODE"
}
```

### Common Errors

| Status | Error | Solution |
|--------|-------|----------|
| 400 | `No file provided` | Include file in request |
| 401 | `Missing authorization header` | Add JWT token to request |
| 403 | `Unauthorized` | User cannot access this resource |
| 404 | `Document not found` | Check document ID |
| 413 | `File too large` | Upload file < 10MB |
| 500 | `Internal server error` | Check server logs |

---

## 🧪 Testing

### Test with cURL

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+91 98765 43210",
    "name": "Test User",
    "email": "test@example.com"
  }'

# Get applications
curl -X GET http://localhost:5000/api/applications \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Upload document
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@photo.jpg" \
  -F "documentType=photo" \
  -F "appId=app-uuid" \
  -F "rules=[]"
```

---

## 📊 Performance Considerations

1. **Image Processing**: 
   - Face detection: ~500ms
   - Background analysis: ~300ms
   - Overall validation: ~2 seconds

2. **File Uploads**:
   - Max size: 10MB
   - Supported formats: PNG, JPG, JPEG, GIF, WEBP, PDF

3. **Database**:
   - Currently in-memory (MVP)
   - Production: Use PostgreSQL/MongoDB
   - Implement caching for rules

---

## 🔒 Security Best Practices

1. **Change SECRET_KEY in production** ⚠️
   ```bash
   python -c "import secrets; print(secrets.token_urlsafe(32))"
   ```

2. **Use HTTPS in production**
   - Configure SSL/TLS certificates
   - Update CORS_ORIGINS in .env

3. **Validate file uploads**
   - Check file type (MIME)
   - Scan for malware
   - Limit file size

4. **Protect user data**
   - Hash sensitive information
   - Encrypt documents in storage
   - Implement rate limiting

---

## 📱 Deployment

### Local Development
```bash
python backend_server.py
```

### Docker Deployment
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements_backend.txt .
RUN pip install -r requirements_backend.txt

COPY . .
CMD ["python", "backend_server.py"]
```

### Cloud Deployment (Render/Heroku)
```yaml
services:
  - type: web
    name: applysmart-backend
    runtime: python
    buildCommand: pip install -r requirements_backend.txt
    startCommand: gunicorn backend_server:app
    envVars:
      - key: FLASK_ENV
        value: production
      - key: SECRET_KEY
        generateValue: true
```

---

## 🆘 Troubleshooting

### Issue: "Module not found"
**Solution:** Install dependencies
```bash
pip install -r requirements_backend.txt
```

### Issue: "CORS Error"
**Solution:** Update CORS configuration in `.env`
```
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com
```

### Issue: "File upload fails"
**Solution:** Check folder permissions
```bash
chmod 755 uploads outputs temp
```

### Issue: "Face detection not working"
**Solution:** Ensure OpenCV is installed
```bash
pip install opencv-python-headless
```

---

## 📚 Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [OpenCV Python](https://docs.opencv.org/4.8.0/)
- [PyJWT](https://pyjwt.readthedocs.io/)
- [CORS Docs](https://flask-cors.readthedocs.io/)

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

---

## 📄 License

MIT License - See LICENSE file for details

---

## 💬 Support

For issues and questions:
- Open an issue on GitHub
- Contact: support@applysmart.in
- Documentation: https://docs.applysmart.in

---

**Happy coding! 🚀**