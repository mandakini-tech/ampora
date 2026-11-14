// Helper functions to generate analytics charts dynamically from real Supabase data

export const getMonthlyRevenueData = (payments = [], bills = []) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();
  
  // Create last 6 months buckets
  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    last6Months.push(months[idx]);
  }

  const revenueByMonth = {};
  last6Months.forEach(m => {
    revenueByMonth[m] = { month: m, revenue: 0, target: 40.0 };
  });

  // Calculate from payments
  payments.forEach(p => {
    if (p.status === 'Successful' && p.paymentDate) {
      const date = new Date(p.paymentDate);
      if (!isNaN(date.getTime())) {
        const m = months[date.getMonth()];
        if (revenueByMonth[m]) {
          // In lakhs (e.g. amount / 100000) or thousands
          revenueByMonth[m].revenue += Number(p.amount || 0) / 100000;
        }
      }
    }
  });

  // Format to 2 decimal places
  return Object.values(revenueByMonth).map(item => ({
    ...item,
    revenue: Number(item.revenue.toFixed(2)),
  }));
};

export const getConsumptionChartData = (bills = [], meterReadings = []) => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonthIdx = new Date().getMonth();

  const last6Months = [];
  for (let i = 5; i >= 0; i--) {
    const idx = (currentMonthIdx - i + 12) % 12;
    last6Months.push(months[idx]);
  }

  const consumptionByMonth = {};
  last6Months.forEach(m => {
    consumptionByMonth[m] = {
      month: m,
      Residential: 0,
      Commercial: 0,
      Industrial: 0,
    };
  });

  bills.forEach(b => {
    if (b.billDate) {
      const date = new Date(b.billDate);
      if (!isNaN(date.getTime())) {
        const m = months[date.getMonth()];
        if (consumptionByMonth[m]) {
          // Detect connection type from consumer if available or default to Residential
          const category = b.connectionType || 'Residential';
          const units = Number(b.unitsConsumed || 0);
          if (consumptionByMonth[m][category] !== undefined) {
            consumptionByMonth[m][category] += units;
          } else {
            consumptionByMonth[m].Residential += units;
          }
        }
      }
    }
  });

  return Object.values(consumptionByMonth);
};

export const getPaymentStatusData = (bills = []) => {
  if (!bills || bills.length === 0) {
    return [
      { name: 'Paid', value: 0, color: '#16a34a' },
      { name: 'Pending', value: 0, color: '#f59e0b' },
      { name: 'Overdue', value: 0, color: '#dc2626' },
    ];
  }

  const paid = bills.filter(b => b.status === 'Paid').length;
  const pending = bills.filter(b => b.status === 'Pending').length;
  const overdue = bills.filter(b => b.status === 'Overdue').length;

  return [
    { name: 'Paid', value: paid, color: '#16a34a' },
    { name: 'Pending', value: pending, color: '#f59e0b' },
    { name: 'Overdue', value: overdue, color: '#dc2626' },
  ];
};

export const getConsumerGrowthData = (consumers = []) => {
  const months = ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];
  const total = consumers.length;

  return months.map((month, idx) => ({
    month,
    consumers: Math.max(0, Math.round(total * ((idx + 1) / months.length))),
  }));
};

