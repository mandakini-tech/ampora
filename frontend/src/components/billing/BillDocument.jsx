import React from 'react';

const formatCurrency = (amount, symbol = '₹') => `${symbol}${(Number(amount) || 0).toLocaleString('en-IN', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}`;

export const printBillDocument = (bill) => {
  if (!bill) return;
  const previousTitle = document.title;
  document.title = `Ampora-${bill.id}`;
  window.print();
  document.title = previousTitle;
};

export const BillDocument = ({ bill, consumer, settings }) => (
  <article id="printable-area" className="bill-document space-y-5 border border-slate-200 bg-white p-6 text-slate-900">
    <header className="flex items-start justify-between gap-6 border-b border-slate-300 pb-4">
      <div>
        <h2 className="text-xl font-bold">{settings?.companyName || 'Ampora Utility Ltd.'}</h2>
        <p className="mt-1 text-xs">Official Electricity Consumption & Tax Invoice</p>
        {settings?.companyAddress && <p className="mt-1 text-xs">{settings.companyAddress}</p>}
        <p className="mt-1 text-xs">
          {[settings?.supportEmail, settings?.supportPhone].filter(Boolean).join(' • ')}
        </p>
      </div>
      <div className="text-right text-xs">
        <p className="font-bold">Invoice: {bill.id}</p>
        <p className="mt-1">Status: {bill.status}</p>
        <p className="mt-1">Issue date: {bill.billDate || '—'}</p>
        <p className="mt-1 font-semibold">Due date: {bill.dueDate || '—'}</p>
      </div>
    </header>

    <section className="grid grid-cols-2 gap-6 border-b border-slate-200 pb-4 text-xs">
      <div>
        <h3 className="mb-2 font-bold uppercase tracking-wide">Billed to</h3>
        <p className="font-semibold">{bill.consumerName || consumer?.name || 'Consumer'}</p>
        <p>Consumer ID: {bill.consumerId}</p>
        {consumer?.address && <p>{consumer.address}</p>}
        {consumer?.phone && <p>Phone: {consumer.phone}</p>}
        {consumer?.email && <p>Email: {consumer.email}</p>}
      </div>
      <div>
        <h3 className="mb-2 font-bold uppercase tracking-wide">Connection & billing</h3>
        <p>Meter: {bill.meterNumber || consumer?.meterNumber || '—'}</p>
        <p>Connection type: {bill.connectionType || consumer?.connectionType || '—'}</p>
        <p>Billing period: {bill.billingPeriod || '—'}</p>
        <p>Previous reading: {bill.previousReading ?? '—'} kWh</p>
        <p>Current reading: {bill.currentReading ?? '—'} kWh</p>
        <p>Units consumed: {bill.unitsConsumed ?? 0} kWh</p>
        {bill.meterReadingId && <p>Reading reference: {bill.meterReadingId}</p>}
      </div>
    </section>

    <section>
      <h3 className="mb-2 text-sm font-bold uppercase tracking-wide">Itemized charges</h3>
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-y border-slate-300 text-left">
            <th className="py-2 pr-3">Description</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-slate-200">
            <td className="py-2 pr-3">Energy consumption ({bill.unitsConsumed ?? 0} kWh)</td>
            <td className="py-2 text-right">{formatCurrency(bill.energyCharges, settings?.currencySymbol)}</td>
          </tr>
          <tr className="border-b border-slate-200">
            <td className="py-2 pr-3">Fixed charges</td>
            <td className="py-2 text-right">{formatCurrency(bill.fixedCharges, settings?.currencySymbol)}</td>
          </tr>
          <tr className="border-b border-slate-200">
            <td className="py-2 pr-3">Taxes and duties</td>
            <td className="py-2 text-right">{formatCurrency(bill.taxes, settings?.currencySymbol)}</td>
          </tr>
          {Number(bill.subsidy) > 0 && (
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-3">Subsidy</td>
              <td className="py-2 text-right">−{formatCurrency(bill.subsidy, settings?.currencySymbol)}</td>
            </tr>
          )}
          {Number(bill.penalty) > 0 && (
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-3">Late payment penalty</td>
              <td className="py-2 text-right">{formatCurrency(bill.penalty, settings?.currencySymbol)}</td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-slate-700 font-bold">
            <td className="py-3 pr-3">TOTAL AMOUNT PAYABLE</td>
            <td className="py-3 text-right text-base">{formatCurrency(bill.totalAmount, settings?.currencySymbol)}</td>
          </tr>
        </tfoot>
      </table>
    </section>

    <footer className="border-t border-slate-200 pt-3 text-[11px]">
      <p>For billing questions or service issues, contact Ampora support using the details above.</p>
      <p className="mt-1">Computer-generated invoice; no signature required.</p>
    </footer>
  </article>
);
