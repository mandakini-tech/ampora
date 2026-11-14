import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const getSettings = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: null,
      });
    }

    const { data, error } = await supabase
      .from('system_settings')
      .select('*')
      .eq('id', 'default')
      .maybeSingle();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve settings',
      error: error.message,
    });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const updates = req.body;

    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: updates,
      });
    }

    const { data, error } = await supabase
      .from('system_settings')
      .upsert([{ ...updates, id: 'default' }])
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
      message: 'Failed to update settings',
      error: error.message,
    });
  }
};

export const getTariffSlabs = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('tariff_slabs')
      .select('*')
      .order('id', { ascending: true });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tariff slabs',
      error: error.message,
    });
  }
};

export const updateTariffSlabs = async (req, res) => {
  try {
    const slabs = req.body; // array of slabs

    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: slabs,
      });
    }

    // Upsert slabs
    const { data, error } = await supabase
      .from('tariff_slabs')
      .upsert(slabs)
      .select();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update tariff slabs',
      error: error.message,
    });
  }
};

