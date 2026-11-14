# Ampora Backend & Supabase Database

This directory houses the backend server, PostgreSQL database schemas, seed datasets, and Supabase integration for the **Ampora Electricity Billing Management System**.

---

## 📁 Directory Structure

```text
backend/
├── database/
│   ├── schema.sql           # Complete PostgreSQL schema (tables, RLS policies, triggers, views, indexes)
│   └── seed.sql             # Realistic seed dataset (consumers, bills, payments, complaints, slabs, users)
├── src/
│   ├── config/
│   │   └── supabase.js      # Supabase client initialization & connection status
│   ├── controllers/         # Business logic for billing calculations, consumers, payments, etc.
│   │   ├── billController.js
│   │   ├── complaintController.js
│   │   ├── consumerController.js
│   │   ├── paymentController.js
│   │   ├── readingController.js
│   │   ├── settingsController.js
│   │   └── statsController.js
│   ├── routes/              # Express API endpoints
│   │   ├── api.js           # Main router & healthcheck
│   │   ├── bills.js
│   │   ├── complaints.js
│   │   ├── consumers.js
│   │   ├── payments.js
│   │   ├── readings.js
│   │   ├── settings.js
│   │   └── stats.js
│   └── server.js            # Express server entry point
├── .env.example             # Example backend environment variables
├── package.json             # Backend dependencies (Express, CORS, Supabase, Dotenv)
└── README.md                # This setup guide
```

---

## 🚀 Supabase Setup (Step-by-Step)

### 1. Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in.
2. Click **New Project**, choose an organization and project name (e.g. `ampora-electricity`).
3. Set a strong database password and select a region close to your users.
4. Wait for the database provisioning to complete (takes ~1-2 minutes).

### 2. Execute Database Schema & Seed Data
1. Open your Supabase Dashboard and go to the **SQL Editor** tab (left sidebar).
2. Click **New Query**.
3. Copy the entire contents of [`database/schema.sql`](file:///c:/Users/YASHASVI/Desktop/College/Semester%205/SE/SE%20Project/ampora/backend/database/schema.sql) and paste it into the query editor.
4. Click **Run** (or `Ctrl + Enter`). This creates:
   - `system_settings`
   - `tariff_slabs`
   - `users`
   - `consumers`
   - `meter_readings`
   - `bills`
   - `payments`
   - `complaints`
   - Row-Level Security (RLS) policies
   - Performance indexes
   - Views (`vw_dashboard_summary`)
   - Triggers for automatic `updated_at` timestamps
5. Click **New Query** again.
6. Copy the entire contents of [`database/seed.sql`](file:///c:/Users/YASHASVI/Desktop/College/Semester%205/SE/SE%20Project/ampora/backend/database/seed.sql) and paste it.
7. Click **Run**. This populates the database with initial sample consumers, meter readings, bills, complaints, and tariff tiers.

### 3. Retrieve Supabase API Keys
1. In the Supabase Dashboard, navigate to **Project Settings** (gear icon) -> **API** (or **API Keys**).
2. You will see:
   - **Project URL** (e.g., `https://xyzcompany.supabase.co`)
   - **Publishable Key** (formerly called **`anon` / public key**): Safe for browser and frontend client code.
   - **Secret Key** (formerly called **`service_role` / secret key**): Has elevated admin permissions. Only use this on the backend server (`backend/.env`). Never expose it in frontend client code!

### 4. Configure Backend Environment
Edit `backend/.env`:
```env
PORT=5000
NODE_ENV=development
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SECRET_KEY=your-supabase-secret-key-here
# (or SUPABASE_SERVICE_ROLE_KEY=...)
CORS_ORIGIN=http://localhost:3000
```

### 5. Start Backend Server
```bash
# Inside /backend directory
npm install
npm run dev
```
The server will start at `http://localhost:5000`. You can test health by visiting `http://localhost:5000/api/health`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status & Supabase connection check |
| `GET` | `/api/consumers` | List all registered consumers |
| `POST` | `/api/consumers` | Register a new consumer |
| `PUT` | `/api/consumers/:id` | Update consumer profile |
| `DELETE` | `/api/consumers/:id` | Remove a consumer |
| `GET` | `/api/readings` | List meter reading records |
| `POST` | `/api/readings` | Record new meter reading |
| `GET` | `/api/bills` | List electricity bills |
| `POST` | `/api/bills` | Generate a new bill (auto-calculates slab tiers & charges) |
| `GET` | `/api/payments` | List payment transactions |
| `POST` | `/api/payments` | Record bill payment receipt & mark bill as Paid |
| `GET` | `/api/complaints` | List consumer complaints |
| `POST` | `/api/complaints` | File a new consumer grievance |
| `PUT` | `/api/complaints/:id` | Update grievance status / resolution notes |
| `GET` | `/api/stats` | Aggregated dashboard analytics metrics |
| `GET` | `/api/settings` | System billing settings & tariff charges |
| `PUT` | `/api/settings` | Update system billing settings |
| `GET` | `/api/settings/tariff-slabs` | Get active tariff tiers |
| `PUT` | `/api/settings/tariff-slabs` | Update tariff slabs |

