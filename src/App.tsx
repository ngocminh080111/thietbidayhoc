// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// MAIN APPLICATION ENTRY POINT
// ==============================================================================
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext.tsx';
import { AppLayout, NavTab } from './components/layout/AppLayout.tsx';
import { LoginView } from './components/auth/LoginView.tsx';
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
  const { currentUser, loading } = useAuth();
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-semibold text-slate-600">Đang khởi tạo phiên làm việc hệ thống...</p>
      </div>
    );
  }

  // If not logged in, present institutional login portal
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
        <header className="bg-white border-b border-slate-200 py-3 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="text-xs font-bold text-slate-800">TRƯỜNG CAO ĐẲNG X</div>
            <div className="text-xs text-slate-500">Phòng Quản trị Thiết bị & Cơ sở vật chất</div>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center">
          <LoginView />
        </main>
        <footer className="bg-white border-t border-slate-200 py-3 text-center text-xs text-slate-500">
          © 2026 Trường Cao đẳng X - Hệ thống Quản lý Thiết bị
        </footer>
      </div>
    );
  }

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
