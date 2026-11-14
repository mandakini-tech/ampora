import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const getConsumers = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        message: 'Supabase credentials not configured in backend/.env.',
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('consumers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      source: 'supabase',
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve consumers',
      error: error.message,
    });
  }
};

export const getConsumerById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: null,
      });
    }

    const { data, error } = await supabase
      .from('consumers')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve consumer',
      error: error.message,
    });
  }
};

export const createConsumer = async (req, res) => {
  try {
    const consumerData = req.body;
    const id = consumerData.id || `PWR-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const newRecord = {
      id,
      name: consumerData.name,
      email: consumerData.email,
      phone: consumerData.phone,
      address: consumerData.address,
      meter_number: consumerData.meterNumber || consumerData.meter_number,
      connection_type: consumerData.connectionType || consumerData.connection_type || 'Residential',
      tariff_category: consumerData.tariffCategory || consumerData.tariff_category || 'LT-1 Domestic',
      status: consumerData.status || 'Active',
      registration_date: consumerData.registrationDate || consumerData.registration_date || new Date().toISOString().split('T')[0],
      current_reading: Number(consumerData.currentReading || consumerData.current_reading || 0),
      previous_reading: Number(consumerData.previousReading || consumerData.previous_reading || 0),
    };

    if (!isSupabaseConfigured()) {
      return res.status(201).json({
        success: true,
        source: 'standby',
        data: newRecord,
      });
    }

    const { data, error } = await supabase
      .from('consumers')
      .insert([newRecord])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create consumer',
      error: error.message,
    });
  }
};

export const updateConsumer = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: { id, ...updates },
      });
    }

    const { data, error } = await supabase
      .from('consumers')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update consumer',
      error: error.message,
    });
  }
};

export const deleteConsumer = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        message: `Consumer ${id} deleted (standby mode)`,
      });
    }

    const { error } = await supabase
      .from('consumers')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: `Consumer ${id} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete consumer',
      error: error.message,
    });
  }
};

