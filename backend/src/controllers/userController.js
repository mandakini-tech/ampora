import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const getUsers = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve users',
      error: error.message,
    });
  }
};

export const createUser = async (req, res) => {
  try {
    const user = req.body;

    if (!isSupabaseConfigured()) {
      return res.status(201).json({
        success: true,
        source: 'standby',
        data: user,
      });
    }

    const { data, error } = await supabase
      .from('users')
      .upsert([user])
      .select()
      .single();

    if (error) throw error;

    return res.status(201).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to save user',
      error: error.message,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: { id, ...req.body },
      });
    }

    const { data, error } = await supabase
      .from('users')
      .update(req.body)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update user',
      error: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        message: `User ${id} deleted (standby mode)`,
      });
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: `User ${id} deleted successfully`,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete user',
      error: error.message,
    });
  }
};
