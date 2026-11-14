import { supabase, isSupabaseConfigured } from '../config/supabase.js';

export const getPayments = async (req, res) => {
  try {
    if (!isSupabaseConfigured()) {
      return res.status(200).json({
        success: true,
        source: 'standby',
        data: [],
      });
    }

    const { data, error } = await supabase
      .from('payments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve payments',
      error: error.message,
    });
  }
};

export const createPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const txnId = paymentData.id || `TXN-${Math.floor(800000 + Math.random() * 100000)}`;

    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newPayment = {
      id: txnId,
      bill_id: paymentData.billId || paymentData.bill_id,
      consumer_id: paymentData.consumerId || paymentData.consumer_id,
      consumer_name: paymentData.consumerName || paymentData.consumer_name,
      amount: Number(paymentData.amount || 0),
      payment_date: paymentData.paymentDate || paymentData.payment_date || formattedDate,
      payment_method: paymentData.paymentMethod || paymentData.payment_method || 'UPI',
      transaction_ref: paymentData.transactionRef || paymentData.transaction_ref || `${paymentData.paymentMethod || 'UPI'}/TXN-${Date.now().toString().slice(-6)}`,
      status: 'Successful',
    };

    if (!isSupabaseConfigured()) {
      return res.status(201).json({
        success: true,
        source: 'standby',
        data: newPayment,
      });
    }

    const { data, error } = await supabase
      .from('payments')
      .insert([newPayment])
      .select()
      .single();

    if (error) throw error;

    // Mark the corresponding bill as Paid
    if (newPayment.bill_id) {
      await supabase
        .from('bills')
        .update({ status: 'Paid' })
        .eq('id', newPayment.bill_id);
    }

    return res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record payment',
      error: error.message,
    });
  }
};

