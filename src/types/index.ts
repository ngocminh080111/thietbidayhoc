// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// CORE TYPES & INTERFACES
// ==============================================================================

export type RoleName = 'ADMIN' | 'EQUIPMENT_MANAGER' | 'DEPARTMENT_HEAD' | 'TEACHER';

export type RoomType = 'LY_THUYET' | 'THUC_HANH' | 'PHONG_MAY' | 'THI_NGHIEM' | 'XUONG' | 'KHO' | 'KHAC';

export type EquipmentCondition = 'TOT' | 'BINH_THUONG' | 'CAN_THEO_DOI' | 'HONG_NHE' | 'HONG_NANG' | 'KHONG_SU_DUNG_DUOC';

export type EquipmentStatus = 'TRONG_KHO' | 'DANG_SU_DUNG' | 'DANG_SUA_CHUA' | 'DANG_DIEU_CHUYEN' | 'THANH_LY' | 'MAT';

export type InventoryResult = 'CO_THUC_TE' | 'KHONG_CO' | 'CO_NHUNG_HONG' | 'CO_NHUNG_SAI_VI_TRI' | 'KHONG_XAC_DINH';

export type ReportSeverity = 'THAP' | 'TRUNG_BINH' | 'CAO' | 'KHAN_CAP';

export type ReportStatus = 'MOI_BAO' | 'DA_TIEP_NHAN' | 'DANG_XU_LY' | 'DA_SUA' | 'KHONG_SUA_DUOC' | 'DA_DONG';

export type MaintenanceResult = 'THANH_CONG' | 'KHONG_THE_SUA' | 'BAO_HANH_DOI_MOI' | 'CHO_LINH_KIEN';

export interface Department {
  id: string;
  code: string;
  name: string;
  description?: string;
  created_at?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  avatar_url?: string;
  department_id?: string;
  department_name?: string;
  roles: RoleName[];
  is_active: boolean;
  created_at?: string;
}

export interface Room {
  id: string;
  code: string;
  name: string;
  room_type: RoomType;
  building: string;
  floor: number;
  capacity: number;
  department_id?: string;
  department_name?: string;
  manager_id?: string;
  manager_name?: string;
  status: 'HOAT_DONG' | 'BAO_TRI' | 'DONG_CUA';
  note?: string;
  is_active: boolean;
  total_equipment?: number;
  created_at?: string;
}

export interface EquipmentCategory {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface Equipment {
  id: string;
  equipment_code: string;
  name: string;
  category_id: string;
  category_name?: string;
  model?: string;
  serial_number?: string;
  manufacturer?: string;
  manufacturing_year?: number;
  purchase_date?: string;
  entry_date?: string;
  original_price: number;
  funding_source?: string;
  current_room_id: string;
  current_room_code?: string;
  current_room_name?: string;
  building?: string;
  manager_id?: string;
  manager_name?: string;
  condition: EquipmentCondition;
  status: EquipmentStatus;
  warranty_expiry?: string;
  image_url?: string;
  note?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface EquipmentTransfer {
  id: string;
  equipment_id: string;
  equipment_code?: string;
  equipment_name?: string;
  from_room_id: string;
  from_room_code?: string;
  from_room_name?: string;
  to_room_id: string;
  to_room_code?: string;
  to_room_name?: string;
  transferred_by?: string;
  transferred_by_name?: string;
  transfer_date: string;
  reason: string;
  note?: string;
}

export interface InventorySession {
  id: string;
  session_code: string;
  title: string;
  start_date: string;
  end_date?: string;
  created_by?: string;
  created_by_name?: string;
  status: 'DANG_DIEN_RA' | 'HOAN_THANH' | 'HUY';
  scope_description?: string;
  note?: string;
  total_expected?: number;
  total_actual?: number;
  total_match?: number;
  total_missing?: number;
  total_misplaced?: number;
  total_damaged?: number;
}

export interface InventoryItem {
  id: string;
  session_id: string;
  equipment_id: string;
  equipment_code?: string;
  equipment_name?: string;
  expected_room_id: string;
  expected_room_code?: string;
  actual_room_id?: string;
  actual_room_code?: string;
  check_result: InventoryResult;
  actual_condition?: EquipmentCondition;
  note?: string;
  checked_by?: string;
  checked_by_name?: string;
  checked_at?: string;
}

export interface DamageReport {
  id: string;
  report_code: string;
  equipment_id: string;
  equipment_code?: string;
  equipment_name?: string;
  room_id: string;
  room_code?: string;
  room_name?: string;
  reported_by?: string;
  reported_by_name?: string;
  reported_at: string;
  issue_description: string;
  severity: ReportSeverity;
  status: ReportStatus;
  image_url?: string;
  note?: string;
}

export interface MaintenanceRecord {
  id: string;
  maintenance_code: string;
  equipment_id: string;
  equipment_code?: string;
  equipment_name?: string;
  damage_report_id?: string;
  damage_report_code?: string;
  received_date: string;
  completion_date?: string;
  service_provider: string;
  repair_details: string;
  replaced_components?: string;
  cost: number;
  result: MaintenanceResult;
  warranty_until?: string;
  recorded_by?: string;
  recorded_by_name?: string;
  note?: string;
}

export interface DashboardStats {
  total_equipment: number;
  in_use_equipment: number;
  in_stock_equipment: number;
  repairing_equipment: number;
  damaged_equipment: number;
  lost_equipment: number;
  total_rooms: number;
  alerts: {
    urgent_damages: number;
    maintenance_needed: number;
    warranty_expiring: number;
    lost_items: number;
    inventory_discrepancies: number;
  };
  by_room_type: { name: string; count: number }[];
  by_category: { name: string; count: number }[];
  by_condition: { condition: EquipmentCondition; count: number }[];
  by_status: { status: EquipmentStatus; count: number }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
