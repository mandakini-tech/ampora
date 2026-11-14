import { supabase, isSupabaseConfigured } from '../lib/supabase';

// ==============================================================================
// DEFAULT SYSTEM CONSTANTS (Used when tables are initially empty)
// ==============================================================================

export const defaultSettings = {
  fixedCharges: {
    Residential: 120,
    Commercial: 350,
    Industrial: 1200,
  },
  taxRatePercent: 9.0,
  subsidyAmount: 100,
  latePenaltyPercent: 5.0,
  dueDays: 15,
  companyName: 'Ampora Electricity Distribution Ltd.',
  companyAddress: '102 Energy Tower, Smart Grid Avenue, Tech City - 560001',
  supportPhone: '1800-425-7000',
  supportEmail: 'helpdesk@ampora.gov.in',
  currencySymbol: '₹',
};

export const defaultTariffSlabs = [
  { id: 1, minUnits: 0, maxUnits: 100, rate: 3.50, description: 'Lifeline / Basic Tier' },
  { id: 2, minUnits: 101, maxUnits: 200, rate: 5.20, description: 'Standard Domestic' },
  { id: 3, minUnits: 201, maxUnits: 300, rate: 7.00, description: 'Higher Domestic' },
  { id: 4, minUnits: 301, maxUnits: 999999, rate: 8.50, description: 'Commercial / High Usage' },
];

// Baseline user accounts for all system roles (No dummy photos / avatar: null)
export const defaultUsers = [
  {
    id: 'USR-01',
    name: 'System Administrator',
    email: 'admin@ampora.gov.in',
    role: 'Administrator',
    status: 'Active',
    lastLogin: 'Active now',
    avatar: null,
  },
  {
    id: 'USR-02',
    name: 'Ramesh Verma',
    email: 'billing@ampora.gov.in',
    role: 'Billing Staff',
    status: 'Active',
    lastLogin: 'Active now',
    avatar: null,
  },
  {
    id: 'USR-03',
    name: 'Rajesh Kumar',
    email: 'consumer@ampora.gov.in',
    role: 'Consumer',
    status: 'Active',
    lastLogin: 'Active now',
    consumerId: 'PWR-2026-1042',
    avatar: null,
  },
  {
    id: 'USR-04',
    name: 'Suresh Kumar',
    email: 'field@ampora.gov.in',
    role: 'Field Officer',
    status: 'Active',
    lastLogin: 'Active now',
    avatar: null,
  },
];

export const defaultAdminUser = defaultUsers[0];

// ==============================================================================
// FIELD TRANSFORMATION HELPERS (PostgreSQL snake_case <-> React camelCase)
// ==============================================================================

export const mapConsumerFromDb = (c) => ({
  id: c.id,
  name: c.name,
  email: c.email,
  phone: c.phone,
  address: c.address,
  meterNumber: c.meter_number,
  connectionType: c.connection_type,
  tariffCategory: c.tariff_category,
  status: c.status,
  registrationDate: c.registration_date,
  currentReading: Number(c.current_reading),
  previousReading: Number(c.previous_reading),
});

export const mapConsumerToDb = (c) => ({
  id: c.id,
  name: c.name,
  email: c.email,
  phone: c.phone,
  address: c.address,
  meter_number: c.meterNumber,
  connection_type: c.connectionType,
  tariff_category: c.tariffCategory,
  status: c.status,
  registration_date: c.registrationDate,
  current_reading: Number(c.currentReading || 0),
  previous_reading: Number(c.previousReading || 0),
});

export const mapReadingFromDb = (r) => ({
  id: r.id,
  consumerId: r.consumer_id,
  consumerName: r.consumer_name,
  meterNumber: r.meter_number,
  previousReading: Number(r.previous_reading),
  currentReading: Number(r.current_reading),
  unitsConsumed: Number(r.units_consumed),
  readingDate: r.reading_date,
  recordedBy: r.recorded_by,
  status: r.status,
});

export const mapReadingToDb = (r) => ({
  id: r.id,
  consumer_id: r.consumerId,
  consumer_name: r.consumerName,
  meter_number: r.meterNumber,
  previous_reading: Number(r.previousReading),
  current_reading: Number(r.currentReading),
  units_consumed: Number(r.unitsConsumed),
  reading_date: r.readingDate,
  recorded_by: r.recordedBy,
  status: r.status,
});

export const mapBillFromDb = (b) => ({
  id: b.id,
  consumerId: b.consumer_id,
  consumerName: b.consumer_name,
  meterNumber: b.meter_number,
  meterReadingId: b.meter_reading_id,
  billingPeriod: b.billing_period,
  billDate: b.bill_date,
  dueDate: b.due_date,
  previousReading: Number(b.previous_reading),
  currentReading: Number(b.current_reading),
  unitsConsumed: Number(b.units_consumed),
  energyCharges: Number(b.energy_charges),
  fixedCharges: Number(b.fixed_charges),
  taxes: Number(b.taxes),
  subsidy: Number(b.subsidy),
  penalty: Number(b.penalty),
  totalAmount: Number(b.total_amount),
  status: b.status,
});

export const mapBillToDb = (b) => ({
  id: b.id,
  consumer_id: b.consumerId,
  consumer_name: b.consumerName,
  meter_number: b.meterNumber,
  meter_reading_id: b.meterReadingId || null,
  billing_period: b.billingPeriod,
  bill_date: b.billDate,
  due_date: b.dueDate,
  previous_reading: Number(b.previousReading),
  current_reading: Number(b.currentReading),
  units_consumed: Number(b.unitsConsumed),
  energy_charges: Number(b.energyCharges),
  fixed_charges: Number(b.fixedCharges),
  taxes: Number(b.taxes),
  subsidy: Number(b.subsidy),
  penalty: Number(b.penalty || 0),
  total_amount: Number(b.totalAmount),
  status: b.status,
});

export const mapPaymentFromDb = (p) => ({
  id: p.id,
  billId: p.bill_id,
  consumerId: p.consumer_id,
  consumerName: p.consumer_name,
  amount: Number(p.amount),
  paymentDate: p.payment_date,
  paymentMethod: p.payment_method,
  transactionRef: p.transaction_ref,
  status: p.status,
});

export const mapPaymentToDb = (p) => ({
  id: p.id,
  bill_id: p.billId,
  consumer_id: p.consumerId,
  consumer_name: p.consumerName,
  amount: Number(p.amount),
  payment_date: p.paymentDate,
  payment_method: p.paymentMethod,
  transaction_ref: p.transactionRef,
  status: p.status,
});

export const mapComplaintFromDb = (c) => ({
  id: c.id,
  consumerId: c.consumer_id,
  consumerName: c.consumer_name,
  type: c.type,
  description: c.description,
  submittedDate: c.submitted_date,
  priority: c.priority,
  status: c.status,
  assignedTo: c.assigned_to,
  resolutionNotes: c.resolution_notes || '',
});

export const mapComplaintToDb = (c) => ({
  id: c.id,
  consumer_id: c.consumerId,
  consumer_name: c.consumerName,
  type: c.type,
  description: c.description,
  submitted_date: c.submittedDate,
  priority: c.priority,
  status: c.status,
  assigned_to: c.assignedTo || 'Unassigned',
  resolution_notes: c.resolutionNotes || '',
});

export const mapUserFromDb = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  status: u.status,
  consumerId: u.consumer_id,
  avatar: u.avatar || null,
  lastLogin: u.last_login,
});

export const mapUserToDb = (u) => ({
  id: u.id,
  name: u.name,
  email: u.email,
  role: u.role,
  status: u.status || 'Active',
  consumer_id: u.consumerId || null,
  avatar: u.avatar || null,
  last_login: u.lastLogin || 'Just now',
});

export const mapSettingsFromDb = (s) => ({
  fixedCharges: s.fixed_charges || defaultSettings.fixedCharges,
  taxRatePercent: Number(s.tax_rate_percent ?? defaultSettings.taxRatePercent),
  subsidyAmount: Number(s.subsidy_amount ?? defaultSettings.subsidyAmount),
  latePenaltyPercent: Number(s.late_penalty_percent ?? defaultSettings.latePenaltyPercent),
  dueDays: Number(s.due_days ?? defaultSettings.dueDays),
  companyName: s.company_name || defaultSettings.companyName,
  companyAddress: s.company_address || defaultSettings.companyAddress,
  supportPhone: s.support_phone || defaultSettings.supportPhone,
  supportEmail: s.support_email || defaultSettings.supportEmail,
  currencySymbol: s.currency_symbol || defaultSettings.currencySymbol,
});

export const mapSettingsToDb = (s) => ({
  id: 'default',
  fixed_charges: s.fixedCharges,
  tax_rate_percent: Number(s.taxRatePercent),
  subsidy_amount: Number(s.subsidyAmount),
  late_penalty_percent: Number(s.latePenaltyPercent),
  due_days: Number(s.dueDays),
  company_name: s.companyName,
  company_address: s.companyAddress,
  support_phone: s.supportPhone,
  support_email: s.supportEmail,
  currency_symbol: s.currencySymbol,
});

export const mapSlabFromDb = (sl) => ({
  id: sl.id,
  minUnits: sl.min_units,
  maxUnits: sl.max_units,
  rate: Number(sl.rate),
  description: sl.description,
});

export const mapSlabToDb = (sl) => ({
  id: sl.id,
  min_units: sl.minUnits,
  max_units: sl.maxUnits,
  rate: Number(sl.rate),
  description: sl.description,
});

// ==============================================================================
// UNIFIED DATA ACCESS SERVICES (SUPABASE)
// ==============================================================================

export const api = {
  async fetchAll() {
    if (!isSupabaseConfigured() || !supabase) {
      return {
        isLive: false,
        consumers: JSON.parse(localStorage.getItem('ampora_consumers') || '[]'),
        meterReadings: JSON.parse(localStorage.getItem('ampora_readings') || '[]'),
        bills: JSON.parse(localStorage.getItem('ampora_bills') || '[]'),
        payments: JSON.parse(localStorage.getItem('ampora_payments') || '[]'),
        complaints: JSON.parse(localStorage.getItem('ampora_complaints') || '[]'),
        users: JSON.parse(localStorage.getItem('ampora_users') || 'null') || defaultUsers,
        settings: JSON.parse(localStorage.getItem('ampora_settings') || 'null') || defaultSettings,
        tariffSlabs: JSON.parse(localStorage.getItem('ampora_slabs') || 'null') || defaultTariffSlabs,
      };
    }

    try {
      const [
        consumersRes,
        readingsRes,
        billsRes,
        paymentsRes,
        complaintsRes,
        usersRes,
        settingsRes,
        slabsRes,
      ] = await Promise.all([
        supabase.from('consumers').select('*').order('created_at', { ascending: false }),
        supabase.from('meter_readings').select('*').order('reading_date', { ascending: false }),
        supabase.from('bills').select('*').order('bill_date', { ascending: false }),
        supabase.from('payments').select('*').order('created_at', { ascending: false }),
        supabase.from('complaints').select('*').order('submitted_date', { ascending: false }),
        supabase.from('users').select('*'),
        supabase.from('system_settings').select('*').eq('id', 'default').maybeSingle(),
        supabase.from('tariff_slabs').select('*').order('id', { ascending: true }),
      ]);

      const consumers = consumersRes.data ? consumersRes.data.map(mapConsumerFromDb) : [];
      const meterReadings = readingsRes.data ? readingsRes.data.map(mapReadingFromDb) : [];
      const bills = billsRes.data ? billsRes.data.map(mapBillFromDb) : [];
      const payments = paymentsRes.data ? paymentsRes.data.map(mapPaymentFromDb) : [];
      const complaints = complaintsRes.data ? complaintsRes.data.map(mapComplaintFromDb) : [];

      // Bootstrap users if empty in Supabase
      let users = usersRes.data?.length ? usersRes.data.map(mapUserFromDb) : [];
      if (users.length === 0) {
        users = defaultUsers;
        try {
          supabase.from('users').upsert(defaultUsers.map(mapUserToDb)).then(() => {});
        } catch (e) {
          console.warn('Could not bootstrap users to Supabase:', e);
        }
      }

      // Bootstrap settings if empty in Supabase
      let settings = settingsRes.data ? mapSettingsFromDb(settingsRes.data) : defaultSettings;
      if (!settingsRes.data) {
        try {
          supabase.from('system_settings').upsert([mapSettingsToDb(defaultSettings)]).then(() => {});
        } catch (e) {
          console.warn('Could not bootstrap settings to Supabase:', e);
        }
      }

      // Bootstrap slabs if empty in Supabase
      let tariffSlabs = slabsRes.data?.length ? slabsRes.data.map(mapSlabFromDb) : defaultTariffSlabs;
      if (!slabsRes.data || slabsRes.data.length === 0) {
        try {
          supabase.from('tariff_slabs').upsert(defaultTariffSlabs.map(mapSlabToDb)).then(() => {});
        } catch (e) {
          console.warn('Could not bootstrap slabs to Supabase:', e);
        }
      }

      return {
        isLive: true,
        consumers,
        meterReadings,
        bills,
        payments,
        complaints,
        users,
        settings,
        tariffSlabs,
      };
    } catch (err) {
      console.warn('Supabase fetch failed:', err);
      return {
        isLive: false,
        error: err.message,
        consumers: JSON.parse(localStorage.getItem('ampora_consumers') || '[]'),
        meterReadings: JSON.parse(localStorage.getItem('ampora_readings') || '[]'),
        bills: JSON.parse(localStorage.getItem('ampora_bills') || '[]'),
        payments: JSON.parse(localStorage.getItem('ampora_payments') || '[]'),
        complaints: JSON.parse(localStorage.getItem('ampora_complaints') || '[]'),
        users: JSON.parse(localStorage.getItem('ampora_users') || 'null') || defaultUsers,
        settings: JSON.parse(localStorage.getItem('ampora_settings') || 'null') || defaultSettings,
        tariffSlabs: JSON.parse(localStorage.getItem('ampora_slabs') || 'null') || defaultTariffSlabs,
      };
    }
  },

  // Users
  async addUser(user) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('users').upsert([mapUserToDb(user)]);
        if (error) console.error('Supabase addUser error:', error);
      } catch (e) {
        console.error('Supabase addUser exception:', e);
      }
    }
  },

  // Consumers
  async addConsumer(consumer) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('consumers').insert([mapConsumerToDb(consumer)]);
        if (error) console.error('Supabase addConsumer error:', error);
      } catch (e) {
        console.error('Supabase addConsumer exception:', e);
      }
    }
  },

  async updateConsumer(id, fields) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const dbFields = {};
        if (fields.name) dbFields.name = fields.name;
        if (fields.email) dbFields.email = fields.email;
        if (fields.phone) dbFields.phone = fields.phone;
        if (fields.address) dbFields.address = fields.address;
        if (fields.status) dbFields.status = fields.status;
        if (fields.connectionType) dbFields.connection_type = fields.connectionType;
        if (fields.tariffCategory) dbFields.tariff_category = fields.tariffCategory;
        if (fields.currentReading !== undefined) dbFields.current_reading = fields.currentReading;
        if (fields.previousReading !== undefined) dbFields.previous_reading = fields.previousReading;

        const { error } = await supabase.from('consumers').update(dbFields).eq('id', id);
        if (error) console.error('Supabase updateConsumer error:', error);
      } catch (e) {
        console.error('Supabase updateConsumer exception:', e);
      }
    }
  },

  async deleteConsumer(id) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('consumers').delete().eq('id', id);
        if (error) console.error('Supabase deleteConsumer error:', error);
      } catch (e) {
        console.error('Supabase deleteConsumer exception:', e);
      }
    }
  },

  // Meter Readings
  async addMeterReading(reading) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('meter_readings').insert([mapReadingToDb(reading)]);
        if (error) console.error('Supabase addMeterReading error:', error);
      } catch (e) {
        console.error('Supabase addMeterReading exception:', e);
      }
    }
  },

  // Bills
  async addBill(bill) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('bills').insert([mapBillToDb(bill)]);
        if (error) console.error('Supabase addBill error:', error);
      } catch (e) {
        console.error('Supabase addBill exception:', e);
      }
    }
  },

  async updateBillStatus(id, status) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('bills').update({ status }).eq('id', id);
        if (error) console.error('Supabase updateBillStatus error:', error);
      } catch (e) {
        console.error('Supabase updateBillStatus exception:', e);
      }
    }
  },

  // Payments
  async addPayment(payment) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('payments').insert([mapPaymentToDb(payment)]);
        if (error) console.error('Supabase addPayment error:', error);
      } catch (e) {
        console.error('Supabase addPayment exception:', e);
      }
    }
  },

  // Complaints
  async addComplaint(complaint) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase.from('complaints').insert([mapComplaintToDb(complaint)]);
        if (error) console.error('Supabase addComplaint error:', error);
      } catch (e) {
        console.error('Supabase addComplaint exception:', e);
      }
    }
  },

  async updateComplaint(id, updates) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const dbUpdates = {};
        if (updates.status !== undefined) dbUpdates.status = updates.status;
        if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
        if (updates.resolutionNotes !== undefined) dbUpdates.resolution_notes = updates.resolutionNotes;
        if (updates.priority !== undefined) dbUpdates.priority = updates.priority;

        const { error } = await supabase.from('complaints').update(dbUpdates).eq('id', id);
        if (error) console.error('Supabase updateComplaint error:', error);
      } catch (e) {
        console.error('Supabase updateComplaint exception:', e);
      }
    }
  },

  // Settings & Tariff
  async updateSettings(settings) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const { error } = await supabase
          .from('system_settings')
          .upsert([mapSettingsToDb(settings)]);
        if (error) console.error('Supabase updateSettings error:', error);
      } catch (e) {
        console.error('Supabase updateSettings exception:', e);
      }
    }
  },

  async updateTariffSlabs(slabs) {
    if (isSupabaseConfigured() && supabase) {
      try {
        const dbSlabs = slabs.map(mapSlabToDb);
        const { error } = await supabase.from('tariff_slabs').upsert(dbSlabs);
        if (error) console.error('Supabase updateTariffSlabs error:', error);
      } catch (e) {
        console.error('Supabase updateTariffSlabs exception:', e);
      }
    }
  },
};
