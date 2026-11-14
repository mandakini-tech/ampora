import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const getReadings = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('meter_readings')
      .select('*')
      .order('reading_date', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve meter readings',
      error: error.message,
    });
  }
};

export const createReading = async (req, res) => {
  try {
    const readingData = req.body;
    const readingId = readingData.id || `MR-${Math.floor(900 + Math.random() * 100)}`;
    const prev = Number(readingData.previousReading || readingData.previous_reading || 0);
    const curr = Number(readingData.currentReading || readingData.current_reading || 0);
    const units = curr - prev;

    if (units < 0) {
      return res.status(400).json({
        success: false,
        message: 'Current reading cannot be lower than previous reading',
      });
    }

    const newReading = {
      id: readingId,
      consumer_id: readingData.consumerId || readingData.consumer_id,
      consumer_name: readingData.consumerName || readingData.consumer_name,
      meter_number: readingData.meterNumber || readingData.meter_number,
      previous_reading: prev,
      current_reading: curr,
      units_consumed: units,
      reading_date: readingData.readingDate || readingData.reading_date || new Date().toISOString().split('T')[0],
      recorded_by: readingData.recordedBy || readingData.recorded_by || 'Field Staff',
      status: 'Pending Bill',
    };

    if (!isSupabaseConfigured()) {
      return res.status(201).json({
        success: true,
        source: 'standby',
        data: newReading,
      });
    }

    const { data, error } = await supabase
      .from('meter_readings')
      .insert([newReading])
      .select()
      .single();

    if (error) throw error;

    // Update consumer's readings in consumer table
    await supabase
      .from('consumers')
      .update({
        previous_reading: prev,
        current_reading: curr,
      })
      .eq('id', newReading.consumer_id);

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record meter reading',
      error: error.message,
    });
  }
};

