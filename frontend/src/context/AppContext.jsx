import React, { createContext, useContext, useState, useEffect } from 'react';
import { api, defaultSettings, defaultTariffSlabs, defaultAdminUser } from '../services/api';
import { isSupabaseConfigured } from '../lib/supabase';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // Current user state - Defaults to null so users land on Login / Registration page first
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('ampora_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Clean out legacy mock avatars
        if (parsed?.avatar && parsed.avatar.includes('unsplash')) {
          parsed.avatar = null;
        }
        return parsed;
      } catch {
        return null;
      }
    }
    return null;
  });

  const [consumers, setConsumers] = useState(() => {
    const saved = localStorage.getItem('ampora_consumers');
    return saved ? JSON.parse(saved) : [];
  });

  const [meterReadings, setMeterReadings] = useState(() => {
    const saved = localStorage.getItem('ampora_readings');
    return saved ? JSON.parse(saved) : [];
  });

  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('ampora_bills');
    return saved ? JSON.parse(saved) : [];
  });

  const [payments, setPayments] = useState(() => {
    const saved = localStorage.getItem('ampora_payments');
    return saved ? JSON.parse(saved) : [];
  });

  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('ampora_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('ampora_users');
    return saved ? JSON.parse(saved) : [defaultAdminUser];
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('ampora_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [tariffSlabs, setTariffSlabs] = useState(() => {
    const saved = localStorage.getItem('ampora_slabs');
    return saved ? JSON.parse(saved) : defaultTariffSlabs;
  });

  // Supabase sync states
  const [isSupabaseLive, setIsSupabaseLive] = useState(isSupabaseConfigured());
  const [isSyncing, setIsSyncing] = useState(false);

  // Toasts state
  const [toasts, setToasts] = useState([]);

  // Persistence side effects to localStorage (cache)
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

  // Synchronize from Supabase
  const refreshData = async (showNotification = false) => {
    setIsSyncing(true);
    try {
      const data = await api.fetchAll();
      if (data.isLive) {
        setIsSupabaseLive(true);
        setConsumers(data.consumers || []);
        setMeterReadings(data.meterReadings || []);
        setBills(data.bills || []);
        setPayments(data.payments || []);
        setComplaints(data.complaints || []);
        if (data.users?.length) setUsers(data.users);
        if (data.settings) setSettings(data.settings);
        if (data.tariffSlabs?.length) setTariffSlabs(data.tariffSlabs);
        if (showNotification) addToast('Database synchronized with Supabase', 'success');
      } else {
        setIsSupabaseLive(false);
      }
    } catch (err) {
      console.warn('Database refresh error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

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
      // Fallback login if custom email typed
      const newUser = {
        id: `USR-${Date.now().toString().slice(-3)}`,
        name: email.split('@')[0] || 'User',
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

  // Register New User & Consumer
  const register = async (userData) => {
    const id = `USR-${Date.now().toString().slice(-4)}`;
    const consumerId = userData.role === 'Consumer' ? `PWR-2026-${Math.floor(1000 + Math.random() * 9000)}` : undefined;

    const newUser = {
      id,
      name: userData.name || (userData.email.split('@')[0]),
      email: userData.email,
      role: userData.role || 'Consumer',
      status: 'Active',
      lastLogin: 'Just now',
      consumerId,
      avatar: null,
    };

    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);

    // Save user to Supabase (await to catch errors)
    try {
      await api.addUser(newUser);
    } catch (e) {
      console.error('Failed to save user to Supabase:', e);
    }

    // If Consumer role, also create consumer profile in database
    if (userData.role === 'Consumer') {
      const connType = userData.connectionType || 'Residential';
      const tariffMap = {
        Residential: 'LT-1 Domestic',
        Commercial: 'LT-2 Commercial',
        Industrial: 'LT-3 Industrial',
      };
      const newConsumer = {
        id: consumerId,
        name: userData.name,
        email: userData.email,
        phone: userData.phone || 'Not provided',
        address: userData.address || 'Not provided',
        meterNumber: `MTR-${Math.floor(100000 + Math.random() * 900000)}`,
        connectionType: connType,
        tariffCategory: tariffMap[connType] || 'LT-1 Domestic',
        status: 'Active',
        registrationDate: new Date().toISOString().split('T')[0],
        currentReading: 0,
        previousReading: 0,
      };
      setConsumers((prev) => [newConsumer, ...prev]);
      try {
        await api.addConsumer(newConsumer);
      } catch (e) {
        console.error('Failed to save consumer to Supabase:', e);
      }
    }

    addToast(`Account created! Logged in as ${newUser.name} (${newUser.role})`, 'success');
    return newUser;
  };

  const switchRole = (newRole) => {
    let targetUser = users.find((u) => u.role === newRole);
    if (!targetUser) {
      targetUser = {
        id: `USR-${Date.now().toString().slice(-3)}`,
        name: `${newRole} User`,
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
    let unitsLeft = u;

    // Use available slabs or fallback defaults
    const activeSlabs = tariffSlabs && tariffSlabs.length > 0 ? tariffSlabs : defaultTariffSlabs;

    const slab1Units = Math.min(unitsLeft, 100);
    energyCharges += slab1Units * (activeSlabs[0]?.rate || 3.50);
    unitsLeft = Math.max(0, unitsLeft - slab1Units);

    if (unitsLeft > 0) {
      const slab2Units = Math.min(unitsLeft, 100);
      energyCharges += slab2Units * (activeSlabs[1]?.rate || 5.20);
      unitsLeft = Math.max(0, unitsLeft - slab2Units);
    }

    if (unitsLeft > 0) {
      const slab3Units = Math.min(unitsLeft, 100);
      energyCharges += slab3Units * (activeSlabs[2]?.rate || 7.00);
      unitsLeft = Math.max(0, unitsLeft - slab3Units);
    }

    if (unitsLeft > 0) {
      energyCharges += unitsLeft * (activeSlabs[3]?.rate || 8.50);
    }

    const fixedMap = settings?.fixedCharges || defaultSettings.fixedCharges;
    const fixedCharges = fixedMap[connectionType] || 120;
    const subtotal = energyCharges + fixedCharges;
    const taxRate = settings?.taxRatePercent ?? 9.0;
    const taxes = (subtotal * taxRate) / 100;
    
    const subsidyLimit = settings?.subsidyAmount ?? 100;
    const subsidy = (connectionType === 'Residential' && u <= 200) ? subsidyLimit : 0;
    const totalAmount = Math.max(0, subtotal + taxes - subsidy);

    return {
      units: u,
      energyCharges: Number(energyCharges.toFixed(2)),
      fixedCharges: Number(fixedCharges.toFixed(2)),
      taxes: Number(taxes.toFixed(2)),
      subsidy: Number(subsidy.toFixed(2)),
      totalAmount: Number(totalAmount.toFixed(2)),
      tariffSlabs: [
        { slab: '0 - 100 units', units: Math.min(u, 100), rate: activeSlabs[0]?.rate || 3.50, amount: Math.min(u, 100) * (activeSlabs[0]?.rate || 3.50) },
        { slab: '101 - 200 units', units: Math.max(0, Math.min(u - 100, 100)), rate: activeSlabs[1]?.rate || 5.20, amount: Math.max(0, Math.min(u - 100, 100)) * (activeSlabs[1]?.rate || 5.20) },
        { slab: '201 - 300 units', units: Math.max(0, Math.min(u - 200, 100)), rate: activeSlabs[2]?.rate || 7.00, amount: Math.max(0, Math.min(u - 200, 100)) * (activeSlabs[2]?.rate || 7.00) },
        { slab: '301+ units', units: Math.max(0, u - 300), rate: activeSlabs[3]?.rate || 8.50, amount: Math.max(0, u - 300) * (activeSlabs[3]?.rate || 8.50) },
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
    api.addConsumer(newConsumer);
    addToast(`Consumer ${newConsumer.name} registered with ID ${id}!`, 'success');
    return newConsumer;
  };

  const updateConsumer = (id, updatedFields) => {
    setConsumers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
    api.updateConsumer(id, updatedFields);
    addToast(`Consumer ${id} updated successfully`, 'success');
  };

  const deleteConsumer = (id) => {
    setConsumers((prev) => prev.filter((c) => c.id !== id));
    api.deleteConsumer(id);
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
    api.addMeterReading(newReading);
    
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
    dueDate.setDate(today.getDate() + (settings?.dueDays || 15));

    const newBill = {
      id: billId,
      consumerId: consumer.id,
      consumerName: consumer.name,
      meterNumber: consumer.meterNumber,
      billingPeriod: billData.billingPeriod || 'Current Billing Cycle',
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
    api.addBill(newBill);

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

    setBills((prev) =>
      prev.map((b) => (b.id === billId ? { ...b, status: 'Paid' } : b))
    );
    api.updateBillStatus(billId, 'Paid');

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
    api.addPayment(newPayment);
    addToast(`Payment of ₹${targetBill.totalAmount} received for ${targetBill.id}`, 'success');
    return newPayment;
  };

  const addComplaint = (complaintData) => {
    const id = `CMP-${Math.floor(400 + Math.random() * 100)}`;
    const newComplaint = {
      id,
      consumerId: complaintData.consumerId || currentUser?.consumerId || 'PWR-2026-1042',
      consumerName: complaintData.consumerName || currentUser?.name || 'Customer',
      type: complaintData.type,
      description: complaintData.description,
      submittedDate: new Date().toISOString().split('T')[0],
      priority: complaintData.priority || 'Medium',
      status: 'Submitted',
      assignedTo: 'Unassigned',
      resolutionNotes: '',
    };

    setComplaints((prev) => [newComplaint, ...prev]);
    api.addComplaint(newComplaint);
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
    api.updateComplaint(id, { status, resolutionNotes, assignedTo });
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
    api.updateSettings(newSettings);
    addToast('System settings updated successfully', 'success');
  };

  const updateTariffSlabs = (newSlabs) => {
    setTariffSlabs(newSlabs);
    api.updateTariffSlabs(newSlabs);
    addToast('Tariff slabs updated successfully', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        login,
        register,
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
        isSupabaseLive,
        isSyncing,
        refreshData,
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
