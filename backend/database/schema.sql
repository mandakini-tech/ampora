-- ==============================================================================
-- AMPORA ELECTRICITY BILLING MANAGEMENT SYSTEM - SUPABASE DATABASE SCHEMA
-- ==============================================================================
-- Target Database: PostgreSQL 15+ (Supabase)
-- Instructions: Run this script in the Supabase SQL Editor.
-- ==============================================================================

-- Enable UUID extension if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- Helper function to auto-update 'updated_at' timestamp
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ------------------------------------------------------------------------------
-- 1. SYSTEM SETTINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.system_settings (
    id VARCHAR(50) PRIMARY KEY DEFAULT 'default',
    fixed_charges JSONB NOT NULL DEFAULT '{"Residential": 120, "Commercial": 350, "Industrial": 1200}'::jsonb,
    tax_rate_percent NUMERIC(5, 2) NOT NULL DEFAULT 9.00,
    subsidy_amount NUMERIC(10, 2) NOT NULL DEFAULT 100.00,
    late_penalty_percent NUMERIC(5, 2) NOT NULL DEFAULT 5.00,
    due_days INTEGER NOT NULL DEFAULT 15,
    company_name VARCHAR(255) NOT NULL DEFAULT 'Ampora Electricity Distribution Ltd.',
    company_address TEXT NOT NULL DEFAULT '102 Energy Tower, Smart Grid Avenue, Tech City - 560001',
    support_phone VARCHAR(50) NOT NULL DEFAULT '1800-425-7000',
    support_email VARCHAR(255) NOT NULL DEFAULT 'helpdesk@ampora.gov.in',
    currency_symbol VARCHAR(10) NOT NULL DEFAULT '₹',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. TARIFF SLABS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tariff_slabs (
    id SERIAL PRIMARY KEY,
    min_units INTEGER NOT NULL,
    max_units INTEGER NOT NULL,
    rate NUMERIC(8, 2) NOT NULL,
    description VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 3. USERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Administrator', 'Billing Staff', 'Consumer', 'Field Officer')),
    status VARCHAR(20) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Inactive', 'Suspended')),
    consumer_id VARCHAR(50),
    avatar TEXT,
    last_login VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 4. CONSUMERS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.consumers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    meter_number VARCHAR(50) UNIQUE NOT NULL,
    connection_type VARCHAR(50) NOT NULL CHECK (connection_type IN ('Residential', 'Commercial', 'Industrial')),
    tariff_category VARCHAR(100) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended', 'Disconnected')),
    registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
    current_reading NUMERIC(12, 2) NOT NULL DEFAULT 0,
    previous_reading NUMERIC(12, 2) NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 5. METER READINGS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meter_readings (
    id VARCHAR(50) PRIMARY KEY,
    consumer_id VARCHAR(50) NOT NULL REFERENCES public.consumers(id) ON DELETE CASCADE,
    consumer_name VARCHAR(255),
    meter_number VARCHAR(50) NOT NULL,
    previous_reading NUMERIC(12, 2) NOT NULL,
    current_reading NUMERIC(12, 2) NOT NULL,
    units_consumed NUMERIC(12, 2) NOT NULL,
    reading_date DATE NOT NULL DEFAULT CURRENT_DATE,
    recorded_by VARCHAR(255) DEFAULT 'System Staff',
    status VARCHAR(30) NOT NULL DEFAULT 'Pending Bill' CHECK (status IN ('Pending Bill', 'Billed', 'Verified', 'Flagged')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. BILLS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bills (
    id VARCHAR(50) PRIMARY KEY,
    consumer_id VARCHAR(50) NOT NULL REFERENCES public.consumers(id) ON DELETE CASCADE,
    consumer_name VARCHAR(255),
    meter_number VARCHAR(50),
    meter_reading_id VARCHAR(50) REFERENCES public.meter_readings(id) ON DELETE SET NULL,
    billing_period VARCHAR(50) NOT NULL,
    bill_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    previous_reading NUMERIC(12, 2) NOT NULL,
    current_reading NUMERIC(12, 2) NOT NULL,
    units_consumed NUMERIC(12, 2) NOT NULL,
    energy_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    fixed_charges NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    taxes NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    subsidy NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    penalty NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid', 'Overdue', 'Cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 7. PAYMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id VARCHAR(50) PRIMARY KEY,
    bill_id VARCHAR(50) NOT NULL REFERENCES public.bills(id) ON DELETE CASCADE,
    consumer_id VARCHAR(50) NOT NULL REFERENCES public.consumers(id) ON DELETE CASCADE,
    consumer_name VARCHAR(255),
    amount NUMERIC(10, 2) NOT NULL,
    payment_date VARCHAR(50) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_ref VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'Successful' CHECK (status IN ('Successful', 'Pending', 'Failed', 'Refunded')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. COMPLAINTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.complaints (
    id VARCHAR(50) PRIMARY KEY,
    consumer_id VARCHAR(50) NOT NULL REFERENCES public.consumers(id) ON DELETE CASCADE,
    consumer_name VARCHAR(255),
    type VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    submitted_date DATE NOT NULL DEFAULT CURRENT_DATE,
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High', 'Critical')),
    status VARCHAR(30) NOT NULL DEFAULT 'Submitted' CHECK (status IN ('Submitted', 'In Progress', 'Resolved', 'Closed')),
    assigned_to VARCHAR(255) DEFAULT 'Unassigned',
    resolution_notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- TRIGGERS FOR AUTO-UPDATING 'updated_at'
-- ------------------------------------------------------------------------------
CREATE OR REPLACE TRIGGER trg_system_settings_updated
    BEFORE UPDATE ON public.system_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_tariff_slabs_updated
    BEFORE UPDATE ON public.tariff_slabs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_consumers_updated
    BEFORE UPDATE ON public.consumers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_meter_readings_updated
    BEFORE UPDATE ON public.meter_readings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_bills_updated
    BEFORE UPDATE ON public.bills
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_payments_updated
    BEFORE UPDATE ON public.payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_complaints_updated
    BEFORE UPDATE ON public.complaints
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER trg_users_updated
    BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ------------------------------------------------------------------------------
-- PERFORMANCE INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_consumers_meter_no ON public.consumers(meter_number);
CREATE INDEX IF NOT EXISTS idx_consumers_status ON public.consumers(status);
CREATE INDEX IF NOT EXISTS idx_readings_consumer ON public.meter_readings(consumer_id);
CREATE INDEX IF NOT EXISTS idx_readings_date ON public.meter_readings(reading_date);
CREATE INDEX IF NOT EXISTS idx_bills_consumer ON public.bills(consumer_id);
CREATE INDEX IF NOT EXISTS idx_bills_status ON public.bills(status);
CREATE INDEX IF NOT EXISTS idx_payments_bill ON public.payments(bill_id);
CREATE INDEX IF NOT EXISTS idx_payments_consumer ON public.payments(consumer_id);
CREATE INDEX IF NOT EXISTS idx_complaints_consumer ON public.complaints(consumer_id);
CREATE INDEX IF NOT EXISTS idx_complaints_status ON public.complaints(status);

-- ------------------------------------------------------------------------------
-- DASHBOARD ANALYTICS VIEW
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW public.vw_dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM public.consumers WHERE status = 'Active') AS active_consumers,
    (SELECT COUNT(*) FROM public.consumers) AS total_consumers,
    (SELECT COALESCE(SUM(amount), 0) FROM public.payments WHERE status = 'Successful') AS total_revenue_collected,
    (SELECT COALESCE(SUM(total_amount), 0) FROM public.bills WHERE status = 'Pending') AS pending_bill_amount,
    (SELECT COUNT(*) FROM public.bills WHERE status = 'Pending') AS pending_bills_count,
    (SELECT COUNT(*) FROM public.bills WHERE status = 'Overdue') AS overdue_bills_count,
    (SELECT COUNT(*) FROM public.complaints WHERE status IN ('Submitted', 'In Progress')) AS open_complaints_count,
    (SELECT COUNT(*) FROM public.meter_readings WHERE status = 'Pending Bill') AS unbilled_readings_count;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
-- Enable RLS on all tables
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tariff_slabs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.consumers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.meter_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- Allow anon & authenticated read/write for seamless development and frontend access.
-- In production, these policies can be restricted to specific user roles or JWT claims.
CREATE POLICY "Allow public read system_settings" ON public.system_settings FOR SELECT USING (true);
CREATE POLICY "Allow public write system_settings" ON public.system_settings FOR ALL USING (true);

CREATE POLICY "Allow public read tariff_slabs" ON public.tariff_slabs FOR SELECT USING (true);
CREATE POLICY "Allow public write tariff_slabs" ON public.tariff_slabs FOR ALL USING (true);

CREATE POLICY "Allow public read users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public write users" ON public.users FOR ALL USING (true);

CREATE POLICY "Allow public read consumers" ON public.consumers FOR SELECT USING (true);
CREATE POLICY "Allow public write consumers" ON public.consumers FOR ALL USING (true);

CREATE POLICY "Allow public read meter_readings" ON public.meter_readings FOR SELECT USING (true);
CREATE POLICY "Allow public write meter_readings" ON public.meter_readings FOR ALL USING (true);

CREATE POLICY "Allow public read bills" ON public.bills FOR SELECT USING (true);
CREATE POLICY "Allow public write bills" ON public.bills FOR ALL USING (true);

CREATE POLICY "Allow public read payments" ON public.payments FOR SELECT USING (true);
CREATE POLICY "Allow public write payments" ON public.payments FOR ALL USING (true);

CREATE POLICY "Allow public read complaints" ON public.complaints FOR SELECT USING (true);
CREATE POLICY "Allow public write complaints" ON public.complaints FOR ALL USING (true);

