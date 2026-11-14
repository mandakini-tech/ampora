import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Calculate bill charges based on tariff slabs and connection type
export const calculateCharges = (units, connectionType = 'Residential', slabs = [], settings = {}) => {
  const u = Math.max(0, Number(units) || 0);
  let energyCharges = 0;
  let unitsLeft = u;

  const defaultSlabs = slabs.length > 0 ? slabs : [
    { min_units: 0, max_units: 100, rate: 3.50 },
    { min_units: 101, max_units: 200, rate: 5.20 },
    { min_units: 201, max_units: 300, rate: 7.00 },
    { min_units: 301, max_units: 999999, rate: 8.50 },
  ];

  // Slab calculation
  for (const slab of defaultSlabs) {
    if (unitsLeft <= 0) break;
    const slabCapacity = slab.max_units - slab.min_units;
    const unitsInThisSlab = Math.min(unitsLeft, slabCapacity);
    energyCharges += unitsInThisSlab * Number(slab.rate);
    unitsLeft -= unitsInThisSlab;
  }

  const fixedMap = settings.fixed_charges || { Residential: 120, Commercial: 350, Industrial: 1200 };
  const fixedCharges = Number(fixedMap[connectionType] ?? 120);
  const subtotal = energyCharges + fixedCharges;
  const taxRate = Number(settings.tax_rate_percent ?? 9.0);
  const taxes = (subtotal * taxRate) / 100;
  
  const subsidyAmount = Number(settings.subsidy_amount ?? 100);
  const subsidy = (connectionType === 'Residential' && u <= 200) ? subsidyAmount : 0;
  const totalAmount = Math.max(0, subtotal + taxes - subsidy);

  return {
    units: u,
    energyCharges: Number(energyCharges.toFixed(2)),
    fixedCharges: Number(fixedCharges.toFixed(2)),
    taxes: Number(taxes.toFixed(2)),
    subsidy: Number(subsidy.toFixed(2)),
    totalAmount: Number(totalAmount.toFixed(2)),
  };
};

export const getBills = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('bills')
      .select('*')
      .order('bill_date', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve bills',
      error: error.message,
    });
  }
};

export const createBill = async (req, res) => {
  try {
    const billData = req.body;
    const billId = billData.id || `BILL-2026-${Math.floor(100 + Math.random() * 900)}`;

    const units = Number(billData.unitsConsumed || billData.units_consumed || 0);
    const connectionType = billData.connectionType || 'Residential';
    let slabs = [];
    let settings = {};

    if (isSupabaseConfigured()) {
      const [slabsResult, settingsResult] = await Promise.all([
        supabase.from('tariff_slabs').select('*').order('id', { ascending: true }),
        supabase.from('system_settings').select('*').eq('id', 'default').maybeSingle(),
      ]);

      if (slabsResult.error) throw slabsResult.error;
      if (settingsResult.error) throw settingsResult.error;

      slabs = slabsResult.data || [];
      settings = settingsResult.data || {};
    }

    const calculated = calculateCharges(units, connectionType, slabs, settings);

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + 15);

    const newBill = {
      id: billId,
      consumer_id: billData.consumerId || billData.consumer_id,
      consumer_name: billData.consumerName || billData.consumer_name,
      meter_number: billData.meterNumber || billData.meter_number,
      meter_reading_id: billData.meterReadingId || billData.meter_reading_id || null,
      billing_period: billData.billingPeriod || billData.billing_period || 'Current Billing Cycle',
      bill_date: billData.billDate || billData.bill_date || today.toISOString().split('T')[0],
      due_date: billData.dueDate || billData.due_date || dueDate.toISOString().split('T')[0],
      previous_reading: Number(billData.previousReading || billData.previous_reading || 0),
      current_reading: Number(billData.currentReading || billData.current_reading || 0),
      units_consumed: units,
      energy_charges: calculated.energyCharges,
      fixed_charges: calculated.fixedCharges,
      taxes: calculated.taxes,
      subsidy: calculated.subsidy,
      penalty: 0.00,
      total_amount: calculated.totalAmount,
      status: 'Pending',
    };

    if (!isSupabaseConfigured()) {
      return res.status(201).json({
        success: true,
        source: 'standby',
        data: newBill,
      });
    }

    const { data, error } = await supabase
      .from('bills')
      .insert([newBill])
      .select()
      .single();

    if (error) throw error;

    // If linked to meter reading, update meter reading status to Billed
    if (newBill.meter_reading_id) {
      await supabase
        .from('meter_readings')
        .update({ status: 'Billed' })
        .eq('id', newBill.meter_reading_id);
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to generate bill',
      error: error.message,
    });
  }
};

export const updateBillStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: { id, status },
      });
    }

    const { data, error } = await supabase
      .from('bills')
      .update({ status })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update bill status',
      error: error.message,
    });
  }
};

