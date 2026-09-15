// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// MAIN APPLICATION ENTRY POINT
// ==============================================================================
import React, { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { AppLayout, NavTab } from './components/layout/AppLayout.tsx';
import { DashboardView } from './components/dashboard/DashboardView.tsx';
import { EquipmentView } from './components/equipment/EquipmentView.tsx';
import { RoomsView } from './components/rooms/RoomsView.tsx';
import { TransfersView } from './components/transfers/TransfersView.tsx';
import { DamagesView } from './components/damages/DamagesView.tsx';
import { MaintenanceView } from './components/maintenance/MaintenanceView.tsx';
import { InventoryView } from './components/inventory/InventoryView.tsx';
import { UsersView } from './components/users/UsersView.tsx';
import { Equipment } from './types/index.ts';

function MainApp() {
  const [currentTab, setCurrentTab] = useState<NavTab>('dashboard');
  const [selectedEquipmentForTransfer, setSelectedEquipmentForTransfer] = useState<Equipment | null>(null);
  const [selectedEquipmentForDamage, setSelectedEquipmentForDamage] = useState<Equipment | null>(null);

  const handleOpenTransfer = (equipment: Equipment) => {
    setSelectedEquipmentForTransfer(equipment);
    setCurrentTab('transfers');
  };

  const handleOpenDamageReport = (equipment?: Equipment) => {
    setSelectedEquipmentForDamage(equipment || null);
    setCurrentTab('damages');
  };

  const handleOpenNewEquipment = () => {
    setCurrentTab('equipment');
  };

  return (
    <AppLayout currentTab={currentTab} onTabChange={setCurrentTab}>
      {currentTab === 'dashboard' && (
        <DashboardView
          onNavigate={setCurrentTab}
          onOpenNewEquipment={handleOpenNewEquipment}
          onOpenNewReport={() => handleOpenDamageReport()}
        />
      )}
      {currentTab === 'equipment' && (
        <EquipmentView
          onOpenTransferModal={handleOpenTransfer}
          onOpenDamageReportModal={handleOpenDamageReport}
        />
      )}
      {currentTab === 'rooms' && <RoomsView />}
      {currentTab === 'transfers' && (
        <TransfersView initialEquipment={selectedEquipmentForTransfer} />
      )}
      {currentTab === 'damages' && (
        <DamagesView initialEquipment={selectedEquipmentForDamage} />
      )}
      {currentTab === 'maintenance' && <MaintenanceView />}
      {currentTab === 'inventory' && <InventoryView />}
      {currentTab === 'users' && <UsersView />}
    </AppLayout>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
