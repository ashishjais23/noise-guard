# NoiseWatch: Civic Noise Platform & Urban Monitoring System
> **Academic & Research Prototype (College Project - EVS)**  
> *Subtitle: "KNOW YOUR NOISE. Measure. Understand. Report."*

---

## 📌 Project Overview
**NoiseWatch** is an educational and research-oriented smart-city web application engineered to monitor, analyze, visualize, and assist in managing urban noise pollution. Developed as an **Environmental Studies (EVS)** project, the system demonstrates how spatial and temporal sound level telemetry can be ingested, analyzed according to environmental health metrics ($L_{eq}$, $L_{den}$), mapped geospatially, and translated into threshold alerts and rule-based mitigation strategies.

### 🛡️ Academic Integrity & Hardware Disclosure
- **Zero Sensor Pretense:** The current software prototype does **NOT** falsely claim to be wired to physical sound sensors.
- **Three Data Modalities:**
  1. `OBSERVED`: Real manually collected field recordings from calibrated sound level meters.
  2. `RESEARCH DATA`: Imported municipal or research datasets.
  3. `SIMULATED`: Realistic stochastic real-time demonstration data generated via an autoregressive Markovian drift model.
- Every card, chart, and map pin explicitly displays a visible data source badge (`SIMULATED`, `OBSERVED`, or `RESEARCH DATA`).

---

## 🛠️ Technology Stack
- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS (Strictly Light Theme: slate/teal palette, soft borders, subtle shadows)
- **Mapping:** Leaflet & React Leaflet with free OpenStreetMap tiles (no paid API key required)
- **Charts:** Recharts (time-series, diurnal distributions, location comparisons)
- **Icons:** Lucide React
- **Backend / Database:** Supabase & PostgreSQL (full DDL provided in `supabase/schema.sql`; operates offline-first via browser storage if Supabase credentials are not configured)
- **Deployment:** Vercel / Netlify ready

---

## 🗺️ Application Architecture & Pages
NoiseWatch includes **9 dedicated views**:

1. **Home (`/`):** Hero section, live status overview across monitored city points, "What It Does" breakdown, 6-stage architecture pipeline, and academic transparency notice.
2. **Dashboard:** Primary command center with live KPI metric cards (Current Noise Level, Average Today, Maximum Recorded, High Noise Events, Monitored Locations), real-time simulation controls (Pause, Resume, Reset, Rate selector), Recharts live trend line chart (1h, 6h, 24h), and quick hotspot cards.
3. **Noise Map:** Interactive Leaflet GIS map with custom SVG status pins (Safe, Moderate, High, Critical), pulsing event halos, marker click detail slide-over drawer, and status/search filters.
4. **Analytics:** Research-oriented analytics engine with 4 charts (Diurnal time-of-day distribution, location-by-location comparison, 24-hour progression) and dynamically formulated academic observations.
5. **Alerts:** Real-time threshold surveillance detecting excursions with duration logging, severity categorization, deduplication, and direct drill-downs ("View Location", "View Interventions").
6. **Recommendations:** Rule-based situational intervention suggestions covering traffic congestion, construction works, commercial markets, silence/hospital zones, and industrial sites with academic disclaimers.
7. **Research:** 10 comprehensive scientific compendium modules covering acoustics, epidemiological health impacts (ischemic heart disease, sleep fragmentation), $L_{eq}$ physics, canyon effects, and genuine citations (WHO, CPCB, ISO 1996, IEC 61672).
8. **Methodology:** Complete 7-step process from literature review to rule-based actions, detailed explanation of the three data paradigms, prototype disclosure, and future ESP32 + MEMS microphone IoT architecture.
9. **About Project:** Acoustics educational guide explaining decibel logarithmic formulas, sound pressure levels ($P_0 = 20\ \mu\text{Pa}$), A-weighting ($\text{dB}(A)$), the necessity of acoustic calibration, and why smartphone microphones are not certified environmental instruments.

---

## 🚀 Getting Started

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install --legacy-peer-deps
```

### 2. Development Server
Run the local Vite development server:
```bash
npm run dev
```

### 3. Production Build
Verify compilation and bundle generation:
```bash
npm run build
```

---

## 🗄️ Database & Supabase Integration (Optional)
NoiseWatch works seamlessly offline out-of-the-box. To connect a remote Supabase PostgreSQL database:

1. Create a project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and execute the DDL script found in `supabase/schema.sql`.
3. Copy your project URL and public anon key into a `.env` file:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```
4. Restart the development server. The top header will automatically indicate **"Supabase Sync"**.

---

## 📊 CSV Data Import Format
To import field measurements, click **"Import CSV"** in the top navigation or use the modal to download a sample template:
```csv
location,date,time,noise_level_db,data_source
Main Arterial Road (MG Highway Junction),2026-09-29,10:30:00,78.4,OBSERVED
University Campus Gate & Transit Plaza,2026-09-29,11:15:00,63.1,OBSERVED
District Multi-Specialty Hospital & Silence Zone,2026-09-29,15:45:00,46.8,OBSERVED
```

---

## ⚖️ Academic License & Citation
Developed for academic assessment in **Environmental Studies (EVS): Urban Noise Pollution & Acoustic Ecology Prototyping**.
All scientific research references are drawn from public guidelines published by the **World Health Organization (WHO)** and the **Central Pollution Control Board (CPCB)**, Govt. of India.
