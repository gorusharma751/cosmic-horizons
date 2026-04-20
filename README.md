# 🌟 Cosmic Horizons — Complete Setup Guide

## Project Structure
```
cosmic-horizons/
├── frontend/          ← Next.js Website (Port 3000)
├── backend/           ← Node.js API (Port 5000)
└── README.md
```

## Quick Start (Step by Step)

### Step 1 — Prerequisites Install karo
```bash
node --version    # Need 18+
npm --version     # Need 9+
```

### Step 2 — Backend Setup

```bash
cd backend
npm install

# Setup Environment Variables
cp .env.example .env
# Edit .env with your database URL and API keys
nano .env
```

**Configure Database:**

Choose one of these options:

#### Option A: Local PostgreSQL
```bash
# Windows: Install PostgreSQL from postgresql.org
# Create database
psql -U postgres
CREATE DATABASE cosmic_horizons;
\q

# Update .env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/cosmic_horizons
```

#### Option B: Supabase (Recommended for Easy Setup)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Copy database URL from Settings > Database
4. Update `.env`:
```
DATABASE_URL=postgresql://[user]:[password]@[project].supabase.co:5432/postgres
```

#### Option C: PlanetScale (MySQL)
1. Go to [planetscale.com](https://planetscale.com)
2. Create database
3. Copy connection string
4. Update `.env`

**Initialize Database & Start Server:**

```bash
# Push schema to database
npx prisma db push

# Optional: Seed sample data
npx prisma db seed

# Start development server
npm run dev
# ✅ Backend running at http://localhost:5000
```

### Step 3 — Frontend Setup
```bash
cd frontend
npm install
cp .env.local.example .env.local

# Start
npm run dev
# ✅ Website at http://localhost:3000
```

## Environment Variables Setup

### Backend `.env` Configuration

⚠️ **IMPORTANT**: Don't commit `.env` file to Git. Use `.env.example` as reference.

```bash
# Copy the template
cp backend/.env.example backend/.env

# Edit with your actual values
nano backend/.env
```

**Required Variables:**

| Variable | Where to Get | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL/Supabase | `postgresql://user:pass@localhost:5432/cosmic_horizons` |
| `JWT_SECRET` | Generate random (32+ chars) | `your-secret-key-min-32-characters` |
| `RAZORPAY_KEY_ID` | [Razorpay Dashboard](https://dashboard.razorpay.com/) | `rzp_test_xxxxx` |
| `RAZORPAY_KEY_SECRET` | Razorpay Dashboard | `secret_key_here` |
| `TWILIO_ACCOUNT_SID` | [Twilio Console](https://www.twilio.com/console) | `ACxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | Twilio Console | `auth_token_here` |
| `OPENAI_API_KEY` | [OpenAI API Keys](https://platform.openai.com/api-keys) | `sk-xxxxxxxx` |
| `CLOUDINARY_CLOUD_NAME` | [Cloudinary Dashboard](https://cloudinary.com/) | `your-cloud-name` |
| `CLOUDINARY_API_KEY` | Cloudinary Dashboard | `api_key_here` |
| `CLOUDINARY_API_SECRET` | Cloudinary Dashboard | `api_secret_here` |

### Frontend `.env.local` Configuration

```bash
# Create frontend env file
cp frontend/.env.local.example frontend/.env.local 2>/dev/null || echo "NEXT_PUBLIC_API_URL=http://localhost:5000" > frontend/.env.local
```

**Required Variables:**

| Variable | Value |
|----------|-------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000` |
| `NEXT_PUBLIC_RAZORPAY_KEY` | Same as backend `RAZORPAY_KEY_ID` |

## Pages Available

### User Website (localhost:3000)
| URL | Page |
|-----|------|
| `/` | Homepage |
| `/consultation` | All pandits listing |
| `/consultation/call` | Voice call |
| `/consultation/chat` | Chat |
| `/consultation/video` | Video call |
| `/kundli` | Free kundli generator |
| `/kundli/matching` | Matchmaking |
| `/horoscope` | All horoscopes |
| `/panchang` | Daily panchang |
| `/shop` | Product store |
| `/pooja` | Pooja services |
| `/live` | Live streams |
| `/cart` | Shopping cart |
| `/profile` | User profile |

### Admin Panel (localhost:3000/admin)
| URL | Page |
|-----|------|
| `/admin` | Dashboard |
| `/admin/users` | User management |
| `/admin/pandits` | Pandit management |
| `/admin/consultations` | All consultations |
| `/admin/orders` | Orders management |
| `/admin/revenue` | Revenue analytics |

### Pandit Dashboard (localhost:3000/pandit/dashboard)
| URL | Page |
|-----|------|
| `/pandit/dashboard` | Main dashboard |
| `/pandit/consultations` | My consultations |
| `/pandit/earnings` | Earnings |
| `/pandit/live` | Go live |

## API Endpoints

### Auth
```
POST /api/auth/send-otp
POST /api/auth/verify-otp
POST /api/auth/register
GET  /api/auth/profile
PUT  /api/auth/profile
```

### Pandits
```
GET  /api/pandits
GET  /api/pandits/featured
GET  /api/pandits/online
GET  /api/pandits/:id
```

### Consultations
```
POST /api/consultations/initiate
PUT  /api/consultations/:id/accept
PUT  /api/consultations/:id/end
POST /api/consultations/:id/rate
GET  /api/consultations/history
```

### Kundli
```
POST /api/kundli/generate
POST /api/kundli/matchmaking
GET  /api/kundli/horoscope/:sign
GET  /api/panchang
```

### Payments
```
POST /api/payments/create-order
POST /api/payments/verify
POST /api/payments/wallet/add
GET  /api/payments/transactions
```

## Development Login (Testing)

**Test Credentials:**
```
Phone: Any 10-digit number (e.g., 9876543210)
OTP: 123456 (fixed in dev mode)
```

## Testing & Troubleshooting

### ✅ Verify Both Servers Running
```bash
# Check Backend Health
curl http://localhost:5000/health
# Expected: {"status":"ok","timestamp":"...","service":"Cosmic Horizons API"}

# Check Frontend (open in browser)
http://localhost:3000
```

### 🔴 Common Issues & Solutions

**Backend crashes on startup - "Database connection error"**
```bash
✅ Solution:
1. Verify DATABASE_URL in backend/.env
   - Local: postgresql://postgres:postgres@localhost:5432/cosmic_horizons
   - Supabase: postgresql://user:pass@project.supabase.co:5432/postgres

2. Initialize database:
   cd backend
   npx prisma db push

3. Check JWT_SECRET (min 32 chars) is set

4. Restart: npm run dev
```

**Frontend shows "Cannot connect to API"**
```bash
✅ Solution:
1. Backend running? http://localhost:5000/health
2. Check frontend/.env.local:
   NEXT_PUBLIC_API_URL=http://localhost:5000
3. Clear browser cache
4. Restart: npm run dev
```

**Port already in use (Windows)**
```powershell
# Port 5000 (Backend):
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Port 3000 (Frontend):
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

**Module not found errors**
```bash
# Reinstall dependencies
cd backend && npm install && npm run build
cd ../frontend && npm install
```

**Prisma issues**
```bash
cd backend

# Regenerate Prisma client
npx prisma generate

# View database (opens http://localhost:5555)
npx prisma studio

# Reset database (⚠️ deletes all data!)
npx prisma migrate reset
```

## Production Deploy

Use split deployment for this codebase:

- **Frontend**: Vercel
- **Backend API**: Render Web Service (persistent Node server)
- **Database**: PostgreSQL (Supabase/Neon/Aiven/Render Postgres)

Why not Vercel only?

- Backend uses **Socket.IO** (persistent connections)
- Backend starts **cron jobs** (`node-cron`) for scheduled tasks
- Vercel serverless functions are short-lived and not ideal for always-on websocket + cron workloads

### 1) Deploy Backend on Render

This repo now includes `render.yaml` at project root.

1. Push code to GitHub.
2. In Render, click **New +** → **Blueprint** and select your repo.
3. Render will detect `render.yaml` and create the backend service from `backend/`.
4. Set required environment variables in Render dashboard:
    - `FRONTEND_URL`
    - `DATABASE_URL`
    - `JWT_SECRET`
    - `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`
    - `TWILIO_*`
    - `OPENAI_API_KEY`, `GEMINI_API_KEY`
    - `CLOUDINARY_*`
    - `SMTP_*`
    - `REDIS_URL` (recommended for scheduling/cache features)
5. Deploy and copy your backend URL (example: `https://cosmic-horizons-backend.onrender.com`).

### 2) Deploy Frontend on Vercel

1. Import the same GitHub repo in Vercel.
2. Set **Root Directory** to `frontend`.
3. Add Vercel environment variables:
    - `NEXT_PUBLIC_API_URL=https://your-backend.onrender.com`
    - `NEXT_PUBLIC_SOCKET_URL=https://your-backend.onrender.com`
    - `NEXT_PUBLIC_RAZORPAY_KEY=...`
    - `NEXT_PUBLIC_APP_URL=https://your-frontend-domain.vercel.app`
4. Deploy.

### 3) Configure Allowed Frontend Origins

Set backend `FRONTEND_URL` in Render to your deployed frontend origin.

- Single domain:
   - `FRONTEND_URL=https://your-frontend.vercel.app`
- Multiple domains (comma-separated):
   - `FRONTEND_URL=https://your-frontend.vercel.app,https://www.yourdomain.com`
- Include Vercel preview deployments (wildcard supported):
   - `FRONTEND_URL=https://your-frontend.vercel.app,https://*.vercel.app`

### 4) Post-Deploy Checks

```bash
# Backend health
curl https://your-backend.onrender.com/health
```

Then test from frontend:

- Login / OTP flow
- Consultation/socket features
- Payment flow
- Admin APIs

### Production Database Notes

- **Free tier**: Supabase / Neon (PostgreSQL)
- **Managed paid**: Render Postgres / AWS RDS

## Vercel Hobby Collaborator Automation (Jaibhagwan Only)

This repo is configured for this exact flow:

- When `JaibhagwanJindal` pushes to any non-main branch, a PR to `main` is auto-created.
- Only PRs authored by `JaibhagwanJindal` are auto-approved and auto-merged.
- Merge uses owner token so the final merge action is performed as owner.
- If `JaibhagwanJindal` directly pushes to `main`, workflow will fail and warn immediately.

Important limitation:

- GitHub cannot convert an already completed direct push on `main` into a PR before it lands.
- To guarantee owner-final history flow, branch protection on `main` is mandatory.

Files for this:

- `.github/workflows/auto-pr-jaibhagwan.yml`
- `.github/workflows/auto-merge-trusted-prs.yml`

### One-time Owner Setup

1. Generate a GitHub PAT (classic) for owner account with `repo` scope.
2. Add repo secret: `OWNER_TOKEN`.
3. Enable auto-merge in repo settings:
   - Settings -> General -> Pull Requests -> Allow auto-merge.
4. Configure branch protection for `main` so collaborators cannot push directly:
   - Require a pull request before merging.
   - Restrict who can push to `main` (owner only).
5. Keep required checks/reviews enabled as needed.

### Security Notes

- Do not commit PAT tokens in code or PRs.
- This automation is locked to only `JaibhagwanJindal`.
- Revoke and rotate leaked tokens immediately.

## Add More Features
1. **Push Notifications**: Firebase FCM already wired
2. **Email**: Nodemailer config `.env` mein hai
3. **Image Upload**: Cloudinary config ready hai
4. **WhatsApp**: Twilio WhatsApp API ready
