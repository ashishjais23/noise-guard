-- ====================================================================
-- NoiseWatch: Smart Urban Noise Monitoring & Control System
-- PostgreSQL / Supabase Database Schema
-- Academic & Research Prototype (College Project - EVS)
-- ====================================================================

-- 1. Locations Table
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(120) NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_type VARCHAR(50) NOT NULL CHECK (location_type IN ('Traffic Corridor', 'Commercial / Market', 'Residential', 'Silence / Healthcare', 'Institutional', 'Construction Zone', 'Industrial')),
    description TEXT,
    baseline_db NUMERIC(5, 2) DEFAULT 55.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Noise Readings Table
CREATE TABLE IF NOT EXISTS public.noise_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    noise_level_db NUMERIC(5, 2) NOT NULL CHECK (noise_level_db >= 20.0 AND noise_level_db <= 140.0),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    data_source VARCHAR(30) NOT NULL CHECK (data_source IN ('SIMULATED', 'OBSERVED', 'RESEARCH DATA')),
    measurement_method VARCHAR(80) DEFAULT 'Simulated Stochastics / Manual Sound Level Meter'
);

-- 3. Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_id UUID REFERENCES public.locations(id) ON DELETE CASCADE,
    noise_level_db NUMERIC(5, 2) NOT NULL,
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('Moderate', 'High', 'Critical')),
    duration_minutes INTEGER DEFAULT 5,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Acknowledged', 'Resolved')),
    data_source VARCHAR(30) NOT NULL DEFAULT 'SIMULATED'
);

-- 4. Recommendations Table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alert_id UUID REFERENCES public.alerts(id) ON DELETE SET NULL,
    category VARCHAR(60) NOT NULL,
    potential_factors TEXT[] NOT NULL DEFAULT '{}',
    suggested_interventions TEXT[] NOT NULL DEFAULT '{}',
    disclaimer TEXT DEFAULT 'Rule-based educational suggestion. Requires on-site environmental assessment before municipal implementation.',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Research Sources Table
CREATE TABLE IF NOT EXISTS public.research_sources (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(120) NOT NULL,
    url TEXT,
    publication_year INTEGER,
    source_type VARCHAR(50) NOT NULL CHECK (source_type IN ('Standard / Regulation', 'Health Guideline', 'Academic Paper', 'Technical Report')),
    summary TEXT
);

-- Indexes for efficient analytical queries
CREATE INDEX IF NOT EXISTS idx_noise_readings_timestamp ON public.noise_readings(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_noise_readings_location ON public.noise_readings(location_id);
CREATE INDEX IF NOT EXISTS idx_noise_readings_source ON public.noise_readings(data_source);
CREATE INDEX IF NOT EXISTS idx_alerts_timestamp ON public.alerts(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON public.alerts(severity);

-- Row Level Security (RLS) configuration for Supabase
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.noise_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_sources ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all public dashboard visitors (No mandatory login required)
CREATE POLICY "Public read access for locations" ON public.locations FOR SELECT USING (true);
CREATE POLICY "Public read access for noise_readings" ON public.noise_readings FOR SELECT USING (true);
CREATE POLICY "Public read access for alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Public read access for recommendations" ON public.recommendations FOR SELECT USING (true);
CREATE POLICY "Public read access for research_sources" ON public.research_sources FOR SELECT USING (true);

-- Allow public insert for observed readings / CSV imports
CREATE POLICY "Public insert for noise_readings" ON public.noise_readings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public insert for alerts" ON public.alerts FOR INSERT WITH CHECK (true);
