import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  initialConsumers,
  initialMeterReadings,
  initialBills,
  initialPayments,
  initialComplaints,
  initialUsers,
  initialSettings,
  initialTariffSlabs,
} from '../mock/data';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current user state (defaults to Admin for full demo flexibility)
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ampora_user');
    return saved ? JSON.parse(saved) : initialUsers[0]; // Admin by default
  });

  const [consumers, setConsumers] = useState(() => {
    const saved = localStorage.getItem('ampora_consumers');
    return saved ? JSON.parse(saved) : initialConsumers;
  });

  const [meterReadings, setMeterReadings] = useState(() => {
    const saved = localStorage.getItem('ampora_readings');
    return saved ? JSON.parse(saved) : initialMeterReadings;
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('ampora_bills');
    return saved ? JSON.parse(saved) : initialBills;
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('ampora_payments');
    return saved ? JSON.parse(saved) : initialPayments;
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('ampora_complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ampora_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ampora_settings');
    return saved ? JSON.parse(saved) : initialSettings;
  });

  const [tariffSlabs, setTariffSlabs] = useState(() => {
    const saved = localStorage.getItem('ampora_slabs');
    return saved ? JSON.parse(saved) : initialTariffSlabs;
  });

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem('ampora_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('ampora_consumers', JSON.stringify(consumers));
  }, [consumers]);

  useEffect(() => {
    localStorage.setItem('ampora_readings', JSON.stringify(meterReadings));
  }, [meterReadings]);

  useEffect(() => {
    localStorage.setItem('ampora_bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('ampora_payments', JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem('ampora_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('ampora_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('ampora_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('ampora_slabs', JSON.stringify(tariffSlabs));
  }, [tariffSlabs]);

  // Toast Helper
  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Login / Switch Role
  const login = (role, email, password) => {
    const matchedUser = users.find((u) => u.role === role && u.email === email);
    if (matchedUser) {
      setCurrentUser(matchedUser);
      addToast(`Welcome back, ${matchedUser.name}! (${matchedUser.role})`, 'success');
      return true;
    } else {
      // Fallback demo login if custom email typed
      const newUser = {
        id: `USR-${Date.now().toString().slice(-3)}`,
        name: email.split('@')[0] || 'Demo User',
        email: email,
        role: role,
        status: 'Active',
        lastLogin: 'Just now',
        consumerId: role === 'Consumer' ? 'PWR-2026-1042' : undefined,
      };
      setCurrentUser(newUser);
      addToast(`Logged in as ${role}`, 'success');
      return true;
    }
  };

  const switchRole = (newRole) => {
    let targetUser = users.find((u) => u.role === newRole);
    if (!targetUser) {
      targetUser = {
        id: `USR-${Date.now().toString().slice(-3)}`,
        name: `${newRole} Demo User`,
        email: `${newRole.toLowerCase()}@ampora.gov.in`,
        role: newRole,
        status: 'Active',
        lastLogin: 'Just now',
        consumerId: newRole === 'Consumer' ? 'PWR-2026-1042' : undefined,
      };
    }
    setCurrentUser(targetUser);
    addToast(`Switched view to ${newRole}`, 'info');
  };

  const logout = () => {
    setCurrentUser(null);
    addToast('Logged out successfully', 'info');
  };

  // Core Calculator for Bill Generation
  const calculateBillCharges = (units, connectionType = 'Residential') => {
    const u = Math.max(0, Number(units) || 0);
    let energyCharges = 0;

    // Slab breakdown calculation
    let unitsLeft = u;

    // 0 - 100 units
    const slab1Units = Math.min(unitsLeft, 100);
    energyCharges += slab1Units * (tariffSlabs[0]?.rate || 3.50);
    unitsLeft = Math.max(0, unitsLeft - slab1Units);

    // 101 - 200 units
    if (unitsLeft > 0) {
      const slab2Units = Math.min(unitsLeft, 100);
      energyCharges += slab2Units * (tariffSlabs[1]?.rate || 5.20);
      unitsLeft = Math.max(0, unitsLeft - slab2Units);
    }

    // 201 - 300 units
    if (unitsLeft > 0) {
      const slab3Units = Math.min(unitsLeft, 100);
      energyCharges += slab3Units * (tariffSlabs[2]?.rate || 7.00);
      unitsLeft = Math.max(0, unitsLeft - slab3Units);
    }

    // 301+ units
    if (unitsLeft > 0) {
      energyCharges += unitsLeft * (tariffSlabs[3]?.rate || 8.50);
    }

    const fixedCharges = settings.fixedCharges[connectionType] || 120;
    const subtotal = energyCharges + fixedCharges;
    const taxes = (subtotal * settings.taxRatePercent) / 100;
    
    // Subsidy applies to residential under 200 units
    const subsidy = (connectionType === 'Residential' && u <= 200) ? settings.subsidyAmount : 0;
    const totalAmount = Math.max(0, subtotal + taxes - subsidy);

    return {
      units: u,
      energyCharges: Number(energyCharges.toFixed(2)),
      fixedCharges: Number(fixedCharges.toFixed(2)),
      taxes: Number(taxes.toFixed(2)),
      subsidy: Number(subsidy.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      tariffSlabs: [
        { slab: '0 - 100 units', units: Math.min(u, 100), rate: tariffSlabs[0]?.rate || 3.50, amount: Math.min(u, 100) * (tariffSlabs[0]?.rate || 3.50) },
        { slab: '101 - 200 units', units: Math.max(0, Math.min(u - 100, 100)), rate: tariffSlabs[1]?.rate || 5.20, amount: Math.max(0, Math.min(u - 100, 100)) * (tariffSlabs[1]?.rate || 5.20) },
        { slab: '201 - 300 units', units: Math.max(0, Math.min(u - 200, 100)), rate: tariffSlabs[2]?.rate || 7.00, amount: Math.max(0, Math.min(u - 200, 100)) * (tariffSlabs[2]?.rate || 7.00) },
        { slab: '301+ units', units: Math.max(0, u - 300), rate: tariffSlabs[3]?.rate || 8.50, amount: Math.max(0, u - 300) * (tariffSlabs[3]?.rate || 8.50) },
      ]
    };
  };

  // CRUD Actions
  const addConsumer = (newConsumerData) => {
    const id = `PWR-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const newConsumer = {
      ...newConsumerData,
      id,
      registrationDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      previousReading: Number(newConsumerData.initialReading || 0),
      currentReading: Number(newConsumerData.initialReading || 0),
    };
    setConsumers((prev) => [newConsumer, ...prev]);
    addToast(`Consumer ${newConsumer.name} registered with ID ${id}!`, 'success');
    return newConsumer;
  };

  const updateConsumer = (id, updatedFields) => {
    setConsumers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    addToast(`Consumer ${id} updated successfully`, 'success');
  };

  const deleteConsumer = (id) => {
    setConsumers((prev) => prev.filter((c) => c.id !== id));
    addToast(`Consumer ${id} deleted from system`, 'info');
  };

  const addMeterReading = (readingData) => {
    const consumer = consumers.find((c) => c.id === readingData.consumerId);
    if (!consumer) {
      addToast('Consumer not found', 'error');
      return false;
    }

    const unitsConsumed = Number(readingData.currentReading) - Number(readingData.previousReading);
    if (unitsConsumed < 0) {
      addToast('Current reading cannot be less than previous reading', 'error');
      return false;
    }

    const readingId = `MR-${Math.floor(900 + Math.random() * 100)}`;
    const newReading = {
      id: readingId,
      consumerId: consumer.id,
      consumerName: consumer.name,
      meterNumber: consumer.meterNumber,
      previousReading: Number(readingData.previousReading),
      currentReading: Number(readingData.currentReading),
      unitsConsumed,
      readingDate: readingData.readingDate || new Date().toISOString().split('T')[0],
      recordedBy: currentUser ? `${currentUser.name} (${currentUser.role})` : 'System Staff',
      status: 'Pending Bill',
    };

    setMeterReadings((prev) => [newReading, ...prev]);
    
    // Update consumer current reading
    updateConsumer(consumer.id, {
      previousReading: Number(readingData.previousReading),
      currentReading: Number(readingData.currentReading),
    });

    addToast(`Meter reading recorded (${unitsConsumed} units consumed)`, 'success');
    return newReading;
  };

  const generateBill = (billData) => {
    const consumer = consumers.find((c) => c.id === billData.consumerId);
    if (!consumer) {
      addToast('Consumer not found', 'error');
      return false;
    }

    const calculated = calculateBillCharges(billData.unitsConsumed, consumer.connectionType);
    const billId = `BILL-2026-${Math.floor(100 + Math.random() * 900)}`;

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(today.getDate() + settings.dueDays);

    const newBill = {
      id: billId,
      consumerId: consumer.id,
      consumerName: consumer.name,
      meterNumber: consumer.meterNumber,
      billingPeriod: billData.billingPeriod || 'October 2026',
      billDate: today.toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      previousReading: Number(billData.previousReading),
      currentReading: Number(billData.currentReading),
      unitsConsumed: Number(billData.unitsConsumed),
      energyCharges: calculated.energyCharges,
      fixedCharges: calculated.fixedCharges,
      taxes: calculated.taxes,
      subsidy: calculated.subsidy,
      penalty: 0.00,
      totalAmount: calculated.totalAmount,
      status: 'Pending',
    };

    setBills((prev) => [newBill, ...prev]);

    // Update meter reading status if linked
    if (billData.meterReadingId) {
      setMeterReadings((prev) =>
        prev.map((mr) => (mr.id === billData.meterReadingId ? { ...mr, status: 'Billed' } : mr))
      );
    }

    addToast(`Bill ${billId} generated for ${consumer.name} (Amount: ₹${newBill.totalAmount})`, 'success');
    return newBill;
  };

  const payBill = (billId, paymentMethod = 'UPI', transactionRef = '') => {
    const targetBill = bills.find((b) => b.id === billId);
    if (!targetBill) {
      addToast('Bill not found', 'error');
      return false;
    }

    if (targetBill.status === 'Paid') {
      addToast('Bill is already paid!', 'info');
      return true;
    }

    // Update bill status
    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'Paid' } : b))
    );

    // Create payment transaction
    const txnId = `TXN-${Math.floor(800000 + Math.random() * 100000)}`;
    const now = new Date();
    const formattedDate = `${now.toISOString().split('T')[0]} ${now.toTimeString().slice(0, 5)}`;

    const newPayment = {
      id: txnId,
      billId: targetBill.id,
      consumerId: targetBill.consumerId,
      consumerName: targetBill.consumerName,
      amount: targetBill.totalAmount,
      paymentDate: formattedDate,
      paymentMethod,
      transactionRef: transactionRef || `${paymentMethod}/TXN-${Date.now().toString().slice(-6)}`,
      status: 'Successful',
    };

    setPayments((prev) => [newPayment, ...prev]);
    addToast(`Payment of ₹${targetBill.totalAmount} received for ${targetBill.id}`, 'success');
    return newPayment;
  };

  const addComplaint = (complaintData) => {
    const id = `CMP-${Math.floor(400 + Math.random() * 100)}`;
    const newComplaint = {
      id,
      consumerId: complaintData.consumerId || currentUser?.consumerId || 'PWR-2026-1042',
      consumerName: complaintData.consumerName || currentUser?.name || 'Rajesh Kumar',
      type: complaintData.type,
      description: complaintData.description,
      submittedDate: new Date().toISOString().split('T')[0],
      priority: complaintData.priority || 'Medium',
      status: 'Submitted',
      assignedTo: 'Unassigned',
      resolutionNotes: '',
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    addToast(`Complaint #${id} submitted successfully`, 'success');
    return newComplaint;
  };

  const updateComplaint = (id, status, resolutionNotes = '', assignedTo = '') => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: status || c.status,
            resolutionNotes: resolutionNotes !== undefined ? resolutionNotes : c.resolutionNotes,
            assignedTo: assignedTo || c.assignedTo,
          };
        }
        return c;
      })
    );
    addToast(`Complaint #${id} updated to ${status}`, 'success');
  };

  const addUser = (userData) => {
    const id = `USR-${Math.floor(10 + Math.random() * 90)}`;
    const newUser = {
      ...userData,
      id,
      status: 'Active',
      lastLogin: 'Never',
    };
    setUsers((prev) => [newUser, ...prev]);
    addToast(`User account ${newUser.email} created`, 'success');
    return newUser;
  };

  const updateUser = (id, updatedFields) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...updatedFields } : u))
    );
    addToast(`User ${id} updated`, 'success');
  };

  const deleteUser = (id) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    addToast(`User ${id} deleted`, 'info');
  };

  const updateSettings = (newSettings) => {
    setSettings(newSettings);
    addToast('System settings updated successfully', 'success');
  };

  const updateTariffSlabs = (newSlabs) => {
    setTariffSlabs(newSlabs);
    addToast('Tariff slabs updated successfully', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        logout,
        switchRole,
        consumers,
        addConsumer,
        updateConsumer,
        deleteConsumer,
        meterReadings,
        addMeterReading,
        bills,
        generateBill,
        calculateBillCharges,
        payments,
        payBill,
        complaints,
        addComplaint,
        updateComplaint,
        users,
        addUser,
        updateUser,
        deleteUser,
        settings,
        updateSettings,
        tariffSlabs,
        updateTariffSlabs,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
