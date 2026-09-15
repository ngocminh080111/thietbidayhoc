// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// FRONTEND API CLIENT SERVICE
// ==============================================================================
import {
  Department,
  Room,
  EquipmentCategory,
  Equipment,
  EquipmentTransfer,
  DamageReport,
  MaintenanceRecord,
  InventorySession,
  InventoryItem,
  UserProfile,
  DashboardStats
} from '../types/index.ts';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('cdx_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {})
  };

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers
  });

  const json = await res.json();
  if (!res.ok || json.success === false) {
    throw new Error(json.message || json.error || 'Yêu cầu xử lý thất bại');
  }
  return json.data !== undefined ? json.data : json;
}

export const api = {
  // System Health
  getHealth: () => fetchJson<{ status: string; system: string }>('/health'),

  // Auth & Users
  getUsers: () => fetchJson<UserProfile[]>('/auth/users'),
  login: (email: string, password?: string) => fetchJson<{ user: UserProfile; token: string; expires_at: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  logout: () => fetchJson<{ success: boolean; message: string }>('/auth/logout', {
    method: 'POST'
  }),
  getMe: () => fetchJson<UserProfile>('/auth/me'),
  updateProfile: (data: { userId: string; full_name?: string; phone?: string; department_id?: string; department_name?: string }) =>
    fetchJson<UserProfile>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    }),
  changePassword: (data: { userId: string; currentPassword: string; newPassword: string }) =>
    fetchJson<{ success: boolean; message: string }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify(data)
    }),
  forgotPassword: (email: string) =>
    fetchJson<{ success: boolean; message: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email })
    }),

  // Dashboard
  getDashboardStats: () => fetchJson<DashboardStats>('/dashboard/stats'),

  // Departments & Categories
  getDepartments: () => fetchJson<Department[]>('/departments'),
  getCategories: () => fetchJson<EquipmentCategory[]>('/categories'),

  // Rooms
  getRooms: () => fetchJson<Room[]>('/rooms'),
  getRoom: (id: string) => fetchJson<Room>(`/rooms/${id}`),
  createRoom: (data: Partial<Room>) => fetchJson<Room>('/rooms', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateRoom: (id: string, data: Partial<Room>) => fetchJson<Room>(`/rooms/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteRoom: (id: string) => fetchJson<{ success: boolean }>(`/rooms/${id}`, {
    method: 'DELETE'
  }),

  // Equipment
  getEquipment: (params?: { search?: string; category_id?: string; room_id?: string; condition?: string; status?: string }) => {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v) searchParams.append(k, v);
      });
    }
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return fetchJson<Equipment[]>(`/equipment${query}`);
  },
  getEquipmentItem: (id: string) => fetchJson<Equipment>(`/equipment/${id}`),
  createEquipment: (data: Partial<Equipment>) => fetchJson<Equipment>('/equipment', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateEquipment: (id: string, data: Partial<Equipment>) => fetchJson<Equipment>(`/equipment/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),
  deleteEquipment: (id: string) => fetchJson<{ success: boolean }>(`/equipment/${id}`, {
    method: 'DELETE'
  }),

  // Transfers
  getTransfers: (equipment_id?: string) => {
    const q = equipment_id ? `?equipment_id=${equipment_id}` : '';
    return fetchJson<EquipmentTransfer[]>(`/transfers${q}`);
  },
  createTransfer: (data: { equipment_id: string; to_room_id: string; reason: string; transferred_by_name?: string; note?: string }) => {
    return fetchJson<EquipmentTransfer>('/transfers', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  },

  // Damage Reports
  getDamageReports: () => fetchJson<DamageReport[]>('/damage-reports'),
  createDamageReport: (data: Partial<DamageReport>) => fetchJson<DamageReport>('/damage-reports', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateDamageReportStatus: (id: string, status: DamageReport['status'], note?: string) => {
    return fetchJson<DamageReport>(`/damage-reports/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note })
    });
  },

  // Maintenance
  getMaintenanceRecords: () => fetchJson<MaintenanceRecord[]>('/maintenance'),
  createMaintenanceRecord: (data: Partial<MaintenanceRecord>) => fetchJson<MaintenanceRecord>('/maintenance', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Inventory
  getInventorySessions: () => fetchJson<InventorySession[]>('/inventory/sessions'),
  createInventorySession: (data: Partial<InventorySession>) => fetchJson<InventorySession>('/inventory/sessions', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getInventoryItems: (sessionId: string) => fetchJson<InventoryItem[]>(`/inventory/sessions/${sessionId}/items`)
};
