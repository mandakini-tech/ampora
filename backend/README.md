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

### 1. Start Backend Server
```bash
# Inside /backend directory
npm install
npm run dev
```
The server will start at `http://localhost:3000`. You can test health by visiting `http://localhost:5000/api/health`.

---

## 📡 API Endpoints Overview

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status & Supabase connection check |
| `GET` | `/api/consumers` | List all registered consumers |
| `POST` | `/api/consumers` | Register a new consumer |
| `PUT` | `/api/consumers/:id` | Update consumer profile |
| `DELETE` | `/api/consumers/:id` | Remove a consumer |
| `GET` | `/api/users` | List system users |
| `POST` | `/api/users` | Create or update a system user |
| `PUT` | `/api/users/:id` | Update a system user |
| `DELETE` | `/api/users/:id` | Remove a system user |
| `GET` | `/api/readings` | List meter reading records |
| `POST` | `/api/readings` | Record new meter reading |
| `GET` | `/api/bills` | List electricity bills |
| `POST` | `/api/bills` | Generate a new bill (auto-calculates slab tiers & charges) |
| `PATCH` | `/api/bills/:id` | Update bill status |
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

Set `VITE_API_BASE_URL=http://localhost:5000/api` in `frontend/.env` to use these REST endpoints. When it is unset, the frontend continues to access Supabase directly.

