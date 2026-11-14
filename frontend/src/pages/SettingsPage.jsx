import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Input, Select } from '../components/common/Input';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Bell,
  Building,
  CheckCircle2,
  Save,
} from 'lucide-react';

export const SettingsPage = () => {
  const { settings, updateSettings, tariffSlabs, updateTariffSlabs, currentUser } = useApp();

  const [activeTab, setActiveTab] = useState('tariff');

  // Form states
  const [slabs, setSlabs] = useState(tariffSlabs);
  const [fixedCharges, setFixedCharges] = useState(settings.fixedCharges);
  const [taxRate, setTaxRate] = useState(settings.taxRatePercent);
  const [subsidy, setSubsidy] = useState(settings.subsidyAmount);
  const [dueDays, setDueDays] = useState(settings.dueDays);

  const handleSlabChange = (id, field, val) => {
    setSlabs((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: Number(val) } : s))
    );
  };

  const handleSaveTariff = (e) => {
    e.preventDefault();
    updateTariffSlabs(slabs);
    updateSettings({
      ...settings,
      fixedCharges,
      taxRatePercent: Number(taxRate),
      subsidyAmount: Number(subsidy),
      dueDays: Number(dueDays),
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-6 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <h2 className="text-xl font-bold text-slate-900">System & Tariff Configuration</h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure slab rates, fixed demand charges, tax percentages, and company profile
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('tariff')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'tariff'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>Tariff Slabs & Taxes</span>
        </button>
        <button
          onClick={() => setActiveTab('company')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'company'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Building className="w-4 h-4" />
          <span>Company & Grid Info</span>
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'security'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Password & Security</span>
        </button>
      </div>

      {/* Tab Content: Tariff & Slab Config */}
      {activeTab === 'tariff' && (
        <form onSubmit={handleSaveTariff} className="space-y-6">
          <Card title="Slab Rate Configuration (INR / kWh)" subtitle="Modify slab rate tiers for energy calculation engine">
            <div className="space-y-4">
              {slabs.map((slab) => (
                <div
                  key={slab.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 text-xs"
                >
                  <div className="w-48">
                    <span className="font-bold text-slate-900 block">Slab #{slab.id}</span>
                    <span className="text-slate-500">{slab.description}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Range:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded border">
                      {slab.minUnits} - {slab.maxUnits === 999999 ? '301+' : slab.maxUnits} units
                    </span>
                  </div>
                  <div className="w-40">
                    <Input
                      label="Rate (₹ / unit)"
                      type="number"
                      step="0.10"
                      value={slab.rate}
                      onChange={(e) => handleSlabChange(slab.id, 'rate', e.target.value)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Fixed Charges & Statutory Levies">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <Input
                label="Residential Fixed Charge (₹)"
                type="number"
                value={fixedCharges.Residential}
                onChange={(e) => setFixedCharges({ ...fixedCharges, Residential: Number(e.target.value) })}
              />
              <Input
                label="Commercial Fixed Charge (₹)"
                type="number"
                value={fixedCharges.Commercial}
                onChange={(e) => setFixedCharges({ ...fixedCharges, Commercial: Number(e.target.value) })}
              />
              <Input
                label="Industrial Fixed Charge (₹)"
                type="number"
                value={fixedCharges.Industrial}
                onChange={(e) => setFixedCharges({ ...fixedCharges, Industrial: Number(e.target.value) })}
              />
              <Input
                label="State Electricity Duty Tax (%)"
                type="number"
                step="0.5"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
              />
              <Input
                label="Residential Subsidy Cap (₹)"
                type="number"
                value={subsidy}
                onChange={(e) => setSubsidy(e.target.value)}
              />
              <Input
                label="Payment Due Grace Days"
                type="number"
                value={dueDays}
                onChange={(e) => setDueDays(e.target.value)}
              />
            </div>

            <div className="mt-6 pt-4 border-t flex justify-end">
              <Button type="submit" variant="primary" icon={Save}>
                Save Tariff Configuration
              </Button>
            </div>
          </Card>
        </form>
      )}

      {/* Tab Content: Company Info */}
      {activeTab === 'company' && (
        <Card title="Utility Provider Details" subtitle="Displayed on printed bills and receipts">
          <div className="space-y-4 max-w-xl text-xs">
            <Input label="Company / Board Name" value={settings.companyName} disabled />
            <Input label="Headquarters Address" value={settings.companyAddress} disabled />
            <Input label="Toll-Free Customer Support" value={settings.supportPhone} disabled />
            <Input label="Support Email" value={settings.supportEmail} disabled />
          </div>
        </Card>
      )}

      {/* Tab Content: Security */}
      {activeTab === 'security' && (
        <Card title="Change Account Password" subtitle="Update current administrative login credentials">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Password updated successfully!');
            }}
            className="space-y-4 max-w-md text-xs"
          >
            <Input label="Current Password" type="password" required />
            <Input label="New Password" type="password" required />
            <Input label="Confirm New Password" type="password" required />

            <div className="pt-2">
              <Button type="submit" variant="primary">
                Update Password
              </Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
};
