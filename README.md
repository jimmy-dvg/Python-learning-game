# 🐍 py-quest

A gamified Python learning platform built with **Vanilla JavaScript**, **Vite**, and **Supabase**. Learn Python through interactive coding challenges, earn XP/rewards, and track your progress through a modular curriculum.

## 🚀 Key Features

- **Multi-page Application (MPA)**: Clean separation of concerns (Home, Dashboard, Level, Profile, Admin).
- **Responsive UI**: Custom Bootstrap scaffold with collapsible sidebars and dark-themed code editors.
- **Interactive Python Lab**: Real-time code execution with test results and XP animations.
- **Difficulty Scaling**: Deterministic challenge variants and exponential difficulty curves.
- **Supabase Backend**: Integrated Auth, DB tracking (Atomic XP), and Storage (Avatars).
- **Admin Suite**: Dashboard for managing challenges and resetting user progress.

## 🛠 Tech Stack

- **Frontend**: Vanilla JS (ES Modules), Bootstrap 5, Vite.
- **Backend**: Supabase (PostgreSQL, Auth, Edge Functions).
- **Testing**: Lightweight custom test harness for core services.

## ⚙️ Local Setup

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

3. **Database Migration**:
   Run the scripts in the `migrations/` folder in order (001 -> 002 -> 003) via the **Supabase SQL Editor**.

4. **Seed Data**:
   The `001_create_schema.sql` migration includes initial levels and challenges for variables and conditionals.

5. **Start Development**:
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run the full service test suite (Auth, Difficulty, Progress, Factory):
```bash
npm test
```

## 🔐 Demo Credentials

- **Username**: `demo@pyquest.com`
- **Password**: `demo123`

*Note: For Admin access, manually update the `role` column to `'admin'` in the `profiles` table for your user.*

## 📦 Deployment Checklist

1. **Vercel / Netlify**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set `.env` variables in the platform's dashboard.
2. **Supabase**:
   - Ensure the `avatars` storage bucket is set to **Public**.
   - Deploy Edge Functions (if applicable) using `supabase functions deploy`.
3. **Database**:
   - Verify all migrations are applied.
   - Configure RLS policies (see `src/services/adminService.js` for examples).

## 📂 Project Structure

- `index.html`: Entry point & Home.
- `src/components/`: Shared UI components (`header.js`, `challengePlayer.js`).
- `src/services/`: Pure logic services and API clients.
- `src/styles/`: Custom CSS and Bootstrap overrides.
- `migrations/`: SQL progression for Supabase.
- `src/edge/`: Logic for Supabase Edge Functions.

---
Built by Soft-Tech AI for the py-quest community.
