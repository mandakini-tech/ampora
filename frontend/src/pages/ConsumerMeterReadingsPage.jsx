import React from 'react';
import { useApp } from '../context/AppContext';
import { Badge } from '../components/common/Badge';
import { Card } from '../components/common/Card';
import { Table } from '../components/common/Table';

export const ConsumerMeterReadingsPage = () => {
  const { currentUser, meterReadings } = useApp();
  const readings = meterReadings
    .filter((reading) => reading.consumerId === currentUser?.consumerId)
    .slice()
    .sort((a, b) => new Date(b.readingDate || 0) - new Date(a.readingDate || 0));

  const columns = [
    { header: 'Reading ID', accessor: 'id' },
    { header: 'Reading Date', accessor: 'readingDate' },
    { header: 'Meter', accessor: 'meterNumber' },
    {
      header: 'Previous',
      accessor: 'previousReading',
      render: (reading) => `${Number(reading.previousReading) || 0} kWh`,
    },
    {
      header: 'Current',
      accessor: 'currentReading',
      render: (reading) => `${Number(reading.currentReading) || 0} kWh`,
    },
    {
      header: 'Usage',
      accessor: 'unitsConsumed',
      render: (reading) => `${Number(reading.unitsConsumed) || 0} kWh`,
    },
    {
      header: 'Status',
      accessor: 'status',
      render: (reading) => <Badge variant={reading.status}>{reading.status}</Badge>,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">My Meter Readings</h2>
        <p className="mt-1 text-xs text-slate-500">Readings recorded for your electricity connection.</p>
      </div>

      <Card title="Reading History">
        <Table
          columns={columns}
          data={readings}
          searchPlaceholder="Search your readings by ID or meter..."
          emptyMessage="No meter readings are available for your account yet."
        />
      </Card>
    </div>
  );
};
