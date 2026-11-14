import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const getComplaints = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('complaints')
      .select('*')
      .order('submitted_date', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve complaints',
      error: error.message,
    });
  }
};

export const createComplaint = async (req, res) => {
  try {
    const complaintData = req.body;
    const complaintId = complaintData.id || `CMP-${Math.floor(400 + Math.random() * 100)}`;

    const newComplaint = {
      id: complaintId,
      consumer_id: complaintData.consumerId || complaintData.consumer_id,
      consumer_name: complaintData.consumerName || complaintData.consumer_name,
      type: complaintData.type,
      description: complaintData.description,
      submitted_date: complaintData.submittedDate || complaintData.submitted_date || new Date().toISOString().split('T')[0],
      priority: complaintData.priority || 'Medium',
      status: complaintData.status || 'Submitted',
      assigned_to: complaintData.assignedTo || complaintData.assigned_to || 'Unassigned',
      resolution_notes: complaintData.resolutionNotes || complaintData.resolution_notes || '',
    };

    if (!isSupabaseConfigured()) {
      return res.status(201).json({
        success: true,
        source: 'standby',
        data: newComplaint,
      });
    }

    const { data, error } = await supabase
      .from('complaints')
      .insert([newComplaint])
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
      message: 'Failed to create complaint',
      error: error.message,
    });
  }
};

export const updateComplaint = async (req, res) => {
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

    const dbUpdates = {};
    if (updates.status !== undefined) dbUpdates.status = updates.status;
    if (updates.assignedTo !== undefined) dbUpdates.assigned_to = updates.assignedTo;
    if (updates.assigned_to !== undefined) dbUpdates.assigned_to = updates.assigned_to;
    if (updates.resolutionNotes !== undefined) dbUpdates.resolution_notes = updates.resolutionNotes;
    if (updates.resolution_notes !== undefined) dbUpdates.resolution_notes = updates.resolution_notes;
    if (updates.priority !== undefined) dbUpdates.priority = updates.priority;

    const { data, error } = await supabase
      .from('complaints')
      .update(dbUpdates)
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
      message: 'Failed to update complaint',
      error: error.message,
    });
  }
};

