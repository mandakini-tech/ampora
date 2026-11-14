import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const getDashboardStats = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: {
          active_consumers: 6,
          total_consumers: 6,
          total_revenue_collected: 33664.35,
          pending_bill_amount: 1391.40,
          pending_bills_count: 2,
          overdue_bills_count: 1,
          open_complaints_count: 2,
          unbilled_readings_count: 1,
        },
      });
    }

    // Try view first
    const { data: viewData, error: viewError } = await supabase
      .from('vw_dashboard_summary')
      .select('*')
      .single();

    if (!viewError && viewData) {
      return res.status(200).json({
        success: true,
        data: viewData,
      });
    }

    // Fallback direct count queries
    const [consumersRes, billsRes, paymentsRes, complaintsRes] = await Promise.all([
      supabase.from('consumers').select('id, status', { count: 'exact' }),
      supabase.from('bills').select('id, status, total_amount'),
      supabase.from('payments').select('amount, status'),
      supabase.from('complaints').select('id, status'),
    ]);

    const activeConsumers = consumersRes.data ? consumersRes.data.filter(c => c.status === 'Active').length : 0;
    const totalConsumers = consumersRes.data ? consumersRes.data.length : 0;
    const totalRevenue = (paymentsRes.data || [])
      .filter(p => p.status === 'Successful')
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);
    const pendingBills = (billsRes.data || []).filter(b => b.status === 'Pending');
    const overdueBills = (billsRes.data || []).filter(b => b.status === 'Overdue');
    const openComplaints = (complaintsRes.data || []).filter(c => c.status === 'Submitted' || c.status === 'In Progress');

    return res.status(200).json({
      success: true,
      data: {
        active_consumers: activeConsumers,
        total_consumers: totalConsumers,
        total_revenue_collected: totalRevenue,
        pending_bill_amount: pendingBills.reduce((sum, b) => sum + Number(b.total_amount || 0), 0),
        pending_bills_count: pendingBills.length,
        overdue_bills_count: overdueBills.length,
        open_complaints_count: openComplaints.length,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve stats',
      error: error.message,
    });
  }
};

