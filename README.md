# BarberPro

BarberPro is a full-stack barbershop management system with:

- React dashboard with responsive RTL layout and optional English labels
- Node.js + Express REST API
- MySQL schema and seed data
- Authentication with admin and barber roles
- Booking, queue, finance, reporting, QR confirmation, and WhatsApp-ready links

## Run the project

### 1. Database

Create the database and seed it:

```sql
SOURCE server/database/schema.sql;
SOURCE server/database/seed.sql;
```

### 2. Server

```bash
cd server
copy .env.example .env
npm install
npm run dev
```

### 3. Client

```bash
cd client
npm install
npm run dev
```

## Demo credentials

- Admin: `admin@barberpro.com` / `admin123`
- Barber: `barber@barberpro.com` / `admin123`
