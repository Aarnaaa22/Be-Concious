# Be Conscious 🥗
> **Know what you eat. Choose what matters.**

Be Conscious is a modern, responsive, user-friendly food awareness web application designed to help consumers decode what is really inside packaged grocery foods. Scan barcodes with your device camera to uncover real calories, laboratory-tested nutritional values, plain-English ingredients, declared allergens, and food processing degree (NOVA classification) without confusing marketing slogans.

---

## ✨ Features & Architecture

### 1. Live Barcode Scanner (`/scan`)
- **Heading**: *"Scan Before You Snack!"*
- Real camera scanning powered by `@zxing/browser` and `@zxing/library`.
- Supports retail barcodes: **EAN-13, EAN-8, UPC-A, UPC-E**.
- Animated pink scanning laser, camera switch controls, audio feedback chime, and automatic duplicate scan prevention.
- Permanent manual numeric barcode input fallback with validation.

### 2. Open Food Facts API v3 Integration
- Direct connection to the official Open Food Facts v3 product lookup API (`https://world.openfoodfacts.org/api/v3/product/{barcode}.json`).
- Custom User-Agent header: `BeConsciousApp/1.0 (https://github.com/Aarnaaa22/Be-Concious)`.
- 2-tier caching system (in-memory Map + `sessionStorage`) for instant repeat lookups.
- Strict unit preservation (kcal vs kJ, grams vs milligrams) with serving size validation.

### 3. Product Analysis Dashboard (`/analysis/:productId`)
- **Section 1: Product Overview**: Real product image, brand, title, barcode, package net weight, and quick actions.
- **Section 2: Quick Nutrition Summary**: Four large readable cards for Calories, Protein, Sugar, and Total Fat.
- **Section 3: Conscious Food Insights**: Official Nutri-Score, NOVA Group (1–4), and a transparent, documented Conscious Score (0–100).
- **Section 4: Nutrition Breakdown**: Clean horizontal bars with toggle between per-100g and per-serving values.
- **Section 5: Ingredient Detective**:
  - Live ingredient search with keyword highlighting.
  - Verified plain-English explanations for common food ingredients (palm oil, whey powder, citric acid, lecithins).
  - Clear separation between confirmed declared allergens and possible cross-contamination traces (`May contain traces`).
  - Factual additive & E-number purposes without unsupported alarmist claims.
- **Section 6: Things Worth Knowing**: Nutritional takeaways and label reality checks.
- **Section 6.5: Better Alternatives for Your Goals**: Goal-oriented suggestions within the same category.
- **Section 7: Next Steps & Comparison**: Instant comparison and log actions.

### 4. Product Comparison & Better Alternatives (`/compare`)
- **Heading**: *"Compare Before You Choose."*
- Side-by-side comparison of two packaged foods by barcode.
- Normalized per-100g / 100ml table for fair comparison: Calories, Sugar, Protein, Total Fat, Saturated Fat, Fibre, and Sodium.
- Visual delta highlights with directional arrows and goal badges (e.g. `-44.3g sugar`, `+7.2g protein`).
- **Better Alternatives Engine**:
  - Queries database for similar products in the relevant food category.
  - Explains why an alternative might fit specific nutritional goals (lower sugar, higher protein, lower sodium).
  - Explicit neutrality: Never claims that one product is universally healthier than another.
  - Empty state fallback: *"No alternatives found yet. Try comparing another product!"*

### 5. My History & Saved Favourites (`/history`)
- **Heading**: *"Your Conscious Journey."*
- **Recent Scans**: Reopen past food analyses, view relative scan timestamps, and delete individual scan entries.
- **Clear History with Confirmation**: Protects against accidental history loss with a modal prompt.
- **Saved Favourites**: Bookmark products to your personal list; 100% persisted in `localStorage` across reloads without requiring account creation.
- Live search and quick filters (`All Items`, `NOVA 1-2`, `NOVA 3-4`, `Score 80+`).

### 6. Explore Food Catalog (`/explore`)
- **Heading**: *"Discover Your Food."*
- Large search input supporting product names, brands, or ingredients.
- Queries Open Food Facts worldwide registry in real time for queries $\ge 3$ characters.
- Category filters (Breakfast, Beverages, Dairy, Snacks, Spreads, Plant-Based, Organic).
- Full loading, error, and empty states.

---

## 🎨 Exact Brand Palette

- **Deep Berry**: `#92003A` (Primary headings, active buttons, navigation dock)
- **Vibrant Pink**: `#F62477` (Primary CTAs, scan lines, highlights)
- **Soft Pink**: `#FFADEE` (Decorative badges, gentle accent chips)
- **Warm Yellow**: `#FFE185` (Friendly insight cards, tips, highlight pills)
- **Supporting Neutrals**:
  - White: `#FFFFFF`
  - Light Background: `#FFFAFC`
  - Dark Readable Text: `#30232A`

---

## 🛠️ Tech Stack

- **React 18** with **Vite**
- **Tailwind CSS** (Custom theme tokens and tactile paper-card system)
- **React Router v6**
- **@zxing/browser** & **@zxing/library** (Retail barcode decoding)
- **Lucide React** (Consistent minimal icons)
- **Recharts** (Nutrition visualization)
- **Framer Motion** (Subtle micro-interactions)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```
Creates an optimized production bundle with manual chunk splitting (`zxing`, `charts`, `motion`, `vendor`).

---

## 📜 Verification & Testing

Verify Open Food Facts API resolution and live barcodes:
```bash
node test-api.js
```
Tested against verified benchmark items:
- Coca-Cola Classic (`5449000000996`)
- Nutella Hazelnut Spread (`3017620422003`)
- Non-existent barcode (`0000000000000`) returning *"Oops! We couldn't find this product."*
