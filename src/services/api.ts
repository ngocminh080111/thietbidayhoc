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
  DashboardStats,
  AuditLog,
  DepreciationReportItem,
  DepreciationSummary,
  AppNotification,
  Vendor,
  LiquidationRecord,
  MaintenanceSchedule
} from '../types/index.ts';

const BASE_URL = '/api';

async function fetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('cdx_auth_token');
  const headers: Record<string, string> = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...((options?.headers as Record<string, string>) || {})
  };

  let res: Response;
  try {
    res = await fetch(`${BASE_URL}${url}`, {
      ...options,
      headers
    });
  } catch (networkErr: any) {
    console.warn(`[Network error calling ${url}]:`, networkErr);
    throw new Error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng hoặc thử lại.');
  }

  const contentType = res.headers.get('content-type') || '';
  const text = await res.text();

  if (!text || text.trim() === '') {
    if (!res.ok) {
      throw new Error(`Máy chủ phản hồi mã lỗi ${res.status}`);
    }
    return {} as T;
  }

  // Detect HTML or proxy error responses like "The page cannot be loaded..."
  const trimmed = text.trim();
  if (
    trimmed.startsWith('<') ||
    trimmed.startsWith('The page') ||
    trimmed.startsWith('<!DOCTYPE') ||
    (!contentType.includes('application/json') && !trimmed.startsWith('{') && !trimmed.startsWith('['))
  ) {
    console.warn(`[Non-JSON API response from ${url} (status: ${res.status})]:`, text.slice(0, 150));
    if (!res.ok) {
      throw new Error(`Máy chủ đang khởi động hoặc tạm thời gián đoạn (${res.status}). Vui lòng thử lại sau vài giây.`);
    }
    throw new Error('Máy chủ phản hồi dữ liệu không đúng chuẩn JSON. Vui lòng thử lại.');
  }

  let json: any;
  try {
    json = JSON.parse(text);
  } catch (parseErr) {
    console.error(`[JSON parse error for ${url}]:`, text.slice(0, 120));
    throw new Error('Dữ liệu từ máy chủ không đúng chuẩn JSON. Vui lòng thử lại.');
  }

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
  getInventoryItems: (sessionId: string) => fetchJson<InventoryItem[]>(`/inventory/sessions/${sessionId}/items`),

  // Audit Logs (Nhật ký kiểm toán)
  getAuditLogs: (filters?: { action?: string; entity_type?: string; search?: string; limit?: number }) => {
    const searchParams = new URLSearchParams();
    if (filters?.action && filters.action !== 'ALL') searchParams.append('action', filters.action);
    if (filters?.entity_type && filters.entity_type !== 'ALL') searchParams.append('entity_type', filters.entity_type);
    if (filters?.search) searchParams.append('search', filters.search);
    if (filters?.limit) searchParams.append('limit', String(filters.limit));
    const query = searchParams.toString() ? `?${searchParams.toString()}` : '';
    return fetchJson<AuditLog[]>(`/audit-logs${query}`);
  },
  logAudit: (data: Partial<AuditLog>) => fetchJson<AuditLog>('/audit-logs', {
    method: 'POST',
    body: JSON.stringify(data)
  }),

  // Batch Import from Excel
  importEquipmentBatch: (items: Array<any>, user_id?: string, user_name?: string) => {
    return fetchJson<{ success: boolean; imported_count: number; errors: string[]; imported: Equipment[] }>('/equipment/batch-import', {
      method: 'POST',
      body: JSON.stringify({ items, user_id, user_name })
    });
  },

  // Asset Depreciation & Financial Reports
  getDepreciationReport: () => fetchJson<{ items: DepreciationReportItem[]; summary: DepreciationSummary }>('/reports/depreciation'),

  // ==============================================================================
  // PHASE 6: NOTIFICATIONS & SYSTEM ALERTS
  // ==============================================================================
  getNotifications: () => fetchJson<AppNotification[]>('/notifications'),
  markNotificationRead: (id: string) => fetchJson<{ success: boolean }>(`/notifications/${id}/read`, {
    method: 'PATCH'
  }),
  markAllNotificationsRead: () => fetchJson<{ success: boolean }>('/notifications/read-all', {
    method: 'POST'
  }),

  // ==============================================================================
  // PHASE 6: VENDORS & SUPPLIERS
  // ==============================================================================
  getVendors: () => fetchJson<Vendor[]>('/vendors'),
  createVendor: (data: Partial<Vendor>) => fetchJson<Vendor>('/vendors', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateVendor: (id: string, data: Partial<Vendor>) => fetchJson<Vendor>(`/vendors/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  }),

  // ==============================================================================
  // PHASE 6: LIQUIDATION RECORDS & WORKFLOW
  // ==============================================================================
  getLiquidations: () => fetchJson<LiquidationRecord[]>('/liquidations'),
  createLiquidation: (data: Partial<LiquidationRecord>) => fetchJson<LiquidationRecord>('/liquidations', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  approveLiquidation: (id: string, signed_by?: string) => fetchJson<LiquidationRecord>(`/liquidations/${id}/approve`, {
    method: 'POST',
    body: JSON.stringify({ signed_by })
  }),

  // ==============================================================================
  // PHASE 6: PREVENTIVE MAINTENANCE SCHEDULES
  // ==============================================================================
  getMaintenanceSchedules: () => fetchJson<MaintenanceSchedule[]>('/maintenance-schedules'),
  createMaintenanceSchedule: (data: Partial<MaintenanceSchedule>) => fetchJson<MaintenanceSchedule>('/maintenance-schedules', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  updateMaintenanceSchedule: (id: string, data: Partial<MaintenanceSchedule>) => fetchJson<MaintenanceSchedule>(`/maintenance-schedules/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};
