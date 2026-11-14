-- ==============================================================================
-- AMPORA ELECTRICITY BILLING MANAGEMENT SYSTEM - SEED DATA
-- ==============================================================================
-- Target Database: PostgreSQL 15+ (Supabase)
-- Instructions: Run this script after schema.sql to populate initial sample records.
-- ==============================================================================

-- Clear existing data if resetting
DELETE FROM public.payments;
DELETE FROM public.bills;
DELETE FROM public.meter_readings;
DELETE FROM public.complaints;
DELETE FROM public.consumers;
DELETE FROM public.users;
DELETE FROM public.tariff_slabs;
DELETE FROM public.system_settings;

-- ------------------------------------------------------------------------------
-- 1. SYSTEM SETTINGS SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.system_settings (
    id,
    fixed_charges,
    tax_rate_percent,
    subsidy_amount,
    late_penalty_percent,
    due_days,
    company_name,
    company_address,
    support_phone,
    support_email,
    currency_symbol
) VALUES (
    'default',
    '{"Residential": 120, "Commercial": 350, "Industrial": 1200}'::jsonb,
    9.00,
    100.00,
    5.00,
    15,
    'Ampora Electricity Distribution Ltd.',
    '102 Energy Tower, Smart Grid Avenue, Tech City - 560001',
    '1800-425-7000',
    'helpdesk@ampora.gov.in',
    '₹'
);

-- ------------------------------------------------------------------------------
-- 2. TARIFF SLABS SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.tariff_slabs (id, min_units, max_units, rate, description) VALUES
(1, 0, 100, 3.50, 'Lifeline / Basic Tier'),
(2, 101, 200, 5.20, 'Standard Domestic'),
(3, 201, 300, 7.00, 'Higher Domestic'),
(4, 301, 999999, 8.50, 'Commercial / High Usage');

-- ------------------------------------------------------------------------------
-- 3. USERS SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.users (id, name, email, role, status, last_login, avatar, consumer_id) VALUES
('USR-01', 'Dr. Ananya Roy', 'admin@ampora.gov.in', 'Administrator', 'Active', '2026-10-08 10:15 AM', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150', NULL),
('USR-02', 'Ramesh Verma', 'ramesh.billing@ampora.gov.in', 'Billing Staff', 'Active', '2026-10-08 09:30 AM', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', NULL),
('USR-03', 'Rajesh Kumar', 'rajesh.kumar@example.com', 'Consumer', 'Active', '2026-10-07 08:45 PM', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'PWR-2026-1042');

-- ------------------------------------------------------------------------------
-- 4. CONSUMERS SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.consumers (
    id, name, email, phone, address, meter_number, connection_type, tariff_category, status, registration_date, current_reading, previous_reading
) VALUES
('PWR-2026-1042', 'Rajesh Kumar', 'rajesh.kumar@example.com', '+91 98765 43210', '42, Green Park Avenue, Block C, Metro Region', 'MTR-884920', 'Residential', 'LT-1 Domestic', 'Active', '2024-01-15', 1380, 1250),
('PWR-2026-1043', 'Aarav Sharma', 'aarav.sharma@techhub.io', '+91 98123 45678', 'B-12, Apex Commercial Complex, Sector 4', 'MTR-993011', 'Commercial', 'LT-2 Commercial', 'Active', '2024-02-10', 4520, 3950),
('PWR-2026-1044', 'Priya Patel', 'priya.patel@gmail.com', '+91 97654 32109', '78 Sunlight Apartments, Rose Garden Road', 'MTR-772184', 'Residential', 'LT-1 Domestic', 'Active', '2024-03-22', 2150, 1980),
('PWR-2026-1045', 'Precision Forgings Pvt Ltd', 'accounts@precisionforgings.co.in', '+91 94455 66778', 'Plot 14, Industrial Estate Phase II', 'MTR-554109', 'Industrial', 'HT-1 Industrial', 'Active', '2023-11-05', 18450, 15200),
('PWR-2026-1046', 'Vikram Malhotra', 'vikram.m@domain.com', '+91 91234 56789', '15-A, Silver Oaks Society, North Extension', 'MTR-332019', 'Residential', 'LT-1 Domestic', 'Suspended', '2024-04-01', 980, 980),
('PWR-2026-1047', 'Sunita Reddy', 'sunita.r@gmail.com', '+91 99887 76655', 'Flat 402, Lakeview Towers, Hill Station Road', 'MTR-661902', 'Residential', 'LT-1 Domestic', 'Active', '2024-05-18', 3110, 2860);

-- ------------------------------------------------------------------------------
-- 5. METER READINGS SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.meter_readings (
    id, consumer_id, consumer_name, meter_number, previous_reading, current_reading, units_consumed, reading_date, recorded_by, status
) VALUES
('MR-901', 'PWR-2026-1042', 'Rajesh Kumar', 'MTR-884920', 1250, 1380, 130, '2026-10-01', 'Ramesh Staff (ID: ST-04)', 'Billed'),
('MR-902', 'PWR-2026-1043', 'Aarav Sharma', 'MTR-993011', 3950, 4520, 570, '2026-10-02', 'Ramesh Staff (ID: ST-04)', 'Billed'),
('MR-903', 'PWR-2026-1044', 'Priya Patel', 'MTR-772184', 1980, 2150, 170, '2026-10-03', 'Suresh Staff (ID: ST-02)', 'Billed'),
('MR-904', 'PWR-2026-1045', 'Precision Forgings Pvt Ltd', 'MTR-554109', 15200, 18450, 3250, '2026-10-04', 'Suresh Staff (ID: ST-02)', 'Pending Bill'),
('MR-905', 'PWR-2026-1047', 'Sunita Reddy', 'MTR-661902', 2860, 3110, 250, '2026-10-05', 'Ramesh Staff (ID: ST-04)', 'Billed');

-- ------------------------------------------------------------------------------
-- 6. BILLS SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.bills (
    id, consumer_id, consumer_name, meter_number, meter_reading_id, billing_period, bill_date, due_date,
    previous_reading, current_reading, units_consumed, energy_charges, fixed_charges, taxes, subsidy, penalty, total_amount, status
) VALUES
('BILL-2026-101', 'PWR-2026-1042', 'Rajesh Kumar', 'MTR-884920', 'MR-901', 'September 2026', '2026-10-01', '2026-10-16', 1250, 1380, 130, 506.00, 120.00, 56.34, 100.00, 0.00, 582.34, 'Pending'),
('BILL-2026-102', 'PWR-2026-1043', 'Aarav Sharma', 'MTR-993011', 'MR-902', 'September 2026', '2026-10-02', '2026-10-17', 3950, 4520, 570, 3865.00, 350.00, 379.35, 0.00, 0.00, 4594.35, 'Paid'),
('BILL-2026-103', 'PWR-2026-1044', 'Priya Patel', 'MTR-772184', 'MR-903', 'September 2026', '2026-10-03', '2026-10-18', 1980, 2150, 170, 714.00, 120.00, 75.06, 100.00, 0.00, 809.06, 'Pending'),
('BILL-2026-104', 'PWR-2026-1047', 'Sunita Reddy', 'MTR-661902', NULL, 'August 2026', '2026-09-01', '2026-09-16', 2600, 2860, 260, 1290.00, 120.00, 126.90, 0.00, 70.84, 1607.74, 'Overdue'),
('BILL-2026-098', 'PWR-2026-1042', 'Rajesh Kumar', 'MTR-884920', NULL, 'August 2026', '2026-09-01', '2026-09-16', 1120, 1250, 130, 506.00, 120.00, 56.34, 62.34, 0.00, 620.00, 'Paid'),
('BILL-2026-095', 'PWR-2026-1045', 'Precision Forgings Pvt Ltd', 'MTR-554109', NULL, 'August 2026', '2026-09-01', '2026-09-16', 12000, 15200, 3200, 24700.00, 1200.00, 2550.00, 0.00, 0.00, 28450.00, 'Paid');

-- ------------------------------------------------------------------------------
-- 7. PAYMENTS SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.payments (
    id, bill_id, consumer_id, consumer_name, amount, payment_date, payment_method, transaction_ref, status
) VALUES
('TXN-882041', 'BILL-2026-102', 'PWR-2026-1043', 'Aarav Sharma', 4594.35, '2026-10-04 14:32', 'UPI', 'UPI/6289410294/gpay', 'Successful'),
('TXN-882040', 'BILL-2026-098', 'PWR-2026-1042', 'Rajesh Kumar', 620.00, '2026-09-10 11:15', 'Net Banking', 'HDFC-NB-992014', 'Successful'),
('TXN-882039', 'BILL-2026-095', 'PWR-2026-1045', 'Precision Forgings Pvt Ltd', 28450.00, '2026-09-05 16:45', 'NEFT / RTGS', 'ICICI-RTGS-772910', 'Successful');

-- ------------------------------------------------------------------------------
-- 8. COMPLAINTS SEED
-- ------------------------------------------------------------------------------
INSERT INTO public.complaints (
    id, consumer_id, consumer_name, type, description, submitted_date, priority, status, assigned_to, resolution_notes
) VALUES
('CMP-401', 'PWR-2026-1042', 'Rajesh Kumar', 'Billing Error', 'The estimated reading in previous bill was higher than meter display. Request meter reading re-verification.', '2026-10-02', 'Medium', 'In Progress', 'Suresh (Field Supervisor)', 'Inspection team scheduled for 10th Oct.'),
('CMP-402', 'PWR-2026-1047', 'Sunita Reddy', 'Faulty Meter', 'Digital display screen flickering continuously and showing ERR-04 error code.', '2026-10-04', 'High', 'Submitted', 'Unassigned', ''),
('CMP-403', 'PWR-2026-1043', 'Aarav Sharma', 'Power Outage', 'Intermittent single-phase power supply drop during peak office hours (2 PM to 5 PM).', '2026-09-28', 'High', 'Resolved', 'Transformer Repair Team', 'Replaced faulty fuse terminal at Distribution Box 14.');

