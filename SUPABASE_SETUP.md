# 🛡️ Be Conscious — Supabase Full-Stack Backend & Auth Guide

This document outlines the architecture, database schema, security policies, and step-by-step instructions to configure and connect Supabase to **Be Conscious**.

---

## 📋 Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [Step-by-Step Supabase Setup](#2-step-by-step-supabase-setup)
3. [Environment Configuration](#3-environment-configuration)
4. [Database Schema & Migrations](#4-database-schema--migrations)
5. [Row Level Security (RLS) Policies](#5-row-level-security-rls-policies)
6. [Google OAuth Configuration](#6-google-oauth-configuration)
7. [Automated Triggers](#7-automated-triggers)
8. [Testing & Verification](#8-testing--verification)

---

## 1. Architecture Overview

Be Conscious uses **Supabase** for complete cloud authentication and PostgreSQL persistence:

```
┌────────────────────────────────────────────────────────┐
│                   BE CONSCIOUS CLIENT                  │
│                                                        │
│  [ React Frontend ]  ◄─►  [ AuthContext / History ]   │
│           │                          │                 │
│           ▼                          ▼                 │
│  [ Open Food Facts API ]    [ Supabase JS Client ]     │
└──────────────────────────────────────┬─────────────────┘
                                       │ HTTPS / WSS
                                       ▼
┌────────────────────────────────────────────────────────┐
│                   SUPABASE BACKEND                     │
│                                                        │
│  ├── GoTrue Auth Engine (Email/Password, Google OAuth) │
│  ├── PostgreSQL Database (Profiles, Scans, Favourites) │
│  └── Row Level Security (Strict auth.uid() isolation)  │
└────────────────────────────────────────────────────────┘
```

* **Anonymous Users**: Enjoy uninterrupted scanning, analysis, and comparison with instant local storage fallback.
* **Authenticated Users**: Scans, favorites, and dietary rules automatically persist to Supabase PostgreSQL and synchronize in real-time across devices.

---

## 2. Step-by-Step Supabase Setup

### Step 1: Create a Free Supabase Project
1. Navigate to [https://supabase.com](https://supabase.com) and sign in.
2. Click **"New Project"**.
3. Select your organization, assign a project name (e.g. `be-conscious`), set a secure database password, and pick the region closest to your users.
4. Wait 1–2 minutes for the database cluster to provision.

### Step 2: Retrieve API Credentials
1. Go to **Project Settings** (gear icon) → **API**.
2. Copy your **Project URL** (under Project URL).
3. Copy your **anon public** key (under Project API Keys).
   > **Note**: Never expose the `service_role` key in frontend code or repository commits!

---

## 3. Environment Configuration

In the project root directory, create a `.env` file based on `.env.example`:

```bash
# .env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Vite automatically exposes variables prefixed with `VITE_` to the client browser.

---

## 4. Database Schema & Migrations

The complete PostgreSQL migration script is located at:
📁 [`supabase/migrations/20261107000000_initial_schema.sql`](./supabase/migrations/20261107000000_initial_schema.sql)

### How to Apply the Migration:
1. Open your Supabase Dashboard.
2. In the left sidebar, click **"SQL Editor"**.
3. Click **"New query"**.
4. Paste the contents of `supabase/migrations/20261107000000_initial_schema.sql` into the editor.
5. Click **"Run"** (Ctrl+Enter).

### Tables Created:
1. **`public.profiles`**: User profile identity (id, full_name, email, avatar_url, created_at, updated_at).
2. **`public.scan_history`**: Authenticated product scans (id, user_id, barcode, product_name, brand, product_image, product_data JSONB, scanned_at).
3. **`public.saved_products`**: Bookmarked foods with unique `(user_id, barcode)` constraint.
4. **`public.user_preferences`**: Dietary and allergen rules (user_id, dietary_preferences JSONB, allergen_preferences JSONB, updated_at).

---

## 5. Row Level Security (RLS) Policies

All 4 tables have **Row Level Security enabled** by default. Users cannot view or modify other users' records.

| Table | Policy Name | Command | Rule |
| :--- | :--- | :--- | :--- |
| `profiles` | Users can view own profile | SELECT | `auth.uid() = id` |
| `profiles` | Users can update own profile | UPDATE | `auth.uid() = id` |
| `scan_history` | Users can view own scans | SELECT | `auth.uid() = user_id` |
| `scan_history` | Users can insert own scans | INSERT | `auth.uid() = user_id` |
| `scan_history` | Users can delete own scans | DELETE | `auth.uid() = user_id` |
| `saved_products` | Users can manage favourites | ALL | `auth.uid() = user_id` |
| `user_preferences` | Users can manage preferences | ALL | `auth.uid() = user_id` |

---

## 6. Google OAuth Configuration

To activate the **"Continue with Google"** button:

1. In Supabase Dashboard, go to **Authentication** → **Providers** → **Google**.
2. Toggle Google to **Enabled**.
3. Copy the **Callback URL (for OAuth)** shown in Supabase (e.g., `https://<project-ref>.supabase.co/auth/v1/callback`).
4. Open the [Google Cloud Console](https://console.cloud.google.com/apis/credentials).
5. Create an **OAuth 2.0 Client ID** (Web application).
6. Under **Authorized redirect URIs**, paste the Supabase Callback URL.
7. Copy the generated **Client ID** and **Client Secret** into your Supabase Google Provider settings and click **Save**.
8. In Supabase Dashboard → **Authentication** → **URL Configuration**:
   - Set **Site URL** to `http://localhost:3000` (or your production domain).
   - Add `http://localhost:3000/**` to **Redirect URLs**.

---

## 7. Automated Triggers

The database includes automated triggers:
- **`on_auth_user_created`**: Executes `handle_new_user()` whenever an account registers via Email or Google OAuth, automatically creating a linked row in `public.profiles` and initializing default `public.user_preferences`.
- **`handle_updated_at`**: Automatically timestamps `updated_at` on profile or preference modifications.

---

## 8. Testing & Verification

1. **Anonymous Mode**:
   - Open `http://localhost:3000/`.
   - Scan any barcode at `/scan` — data loads and saves to local storage.
2. **Registration**:
   - Go to `/signup`.
   - Enter Full Name, Email, and Password (min. 6 characters).
   - Click "Create Conscious Account".
3. **Dashboard & Cloud Sync**:
   - Navigate to `/dashboard`.
   - Your name appears in the welcome header.
   - Any prior local scans sync to Supabase.
4. **Preferences Persistence**:
   - Switch to the "Food Preferences" tab in `/dashboard`.
   - Check preferences (e.g. Vegetarian, Palm-Oil-Free).
   - Click "Save Preferences to Profile" — persists in `public.user_preferences`.
5. **Sign Out & Protected Routes**:
   - Click "Sign Out".
   - Attempting to visit `/dashboard` redirects to `/login` with preservation of intended destination.
