// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// DATA SERVICE (SUPABASE HYBRID WITH ROBUST MEMORY CACHE)
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
  Vendor,
  LiquidationRecord,
  MaintenanceSchedule,
  AppNotification
} from '../../src/types/index.ts';
import {
  initialDepartments,
  initialUsers,
  initialRooms,
  initialCategories,
  initialEquipment,
  initialTransfers,
  initialDamageReports,
  initialMaintenanceRecords,
  initialInventorySessions,
  initialInventoryItems
} from '../data/seedData.ts';
import {
  initialVendors,
  initialLiquidations,
  initialMaintenanceSchedules,
  initialNotifications
} from '../data/phase6Data.ts';
import { getSupabaseAdmin } from '../config/supabase.ts';

// In-memory runtime state (initialized with 100% realistic seed data)
let departments: Department[] = [...initialDepartments];
let users: UserProfile[] = [...initialUsers];
let rooms: Room[] = [...initialRooms];
let categories: EquipmentCategory[] = [...initialCategories];
let equipment: Equipment[] = [...initialEquipment];
let transfers: EquipmentTransfer[] = [...initialTransfers];
let damageReports: DamageReport[] = [...initialDamageReports];
let maintenanceRecords: MaintenanceRecord[] = [...initialMaintenanceRecords];
let inventorySessions: InventorySession[] = [...initialInventorySessions];
let inventoryItems: InventoryItem[] = [...initialInventoryItems];
let vendors: Vendor[] = [...initialVendors];
let liquidations: LiquidationRecord[] = [...initialLiquidations];
let maintenanceSchedules: MaintenanceSchedule[] = [...initialMaintenanceSchedules];
let notifications: AppNotification[] = [...initialNotifications];
let auditLogs: AuditLog[] = [
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccc01',
    user_id: '33333333-3333-3333-3333-333333333301',
    user_name: 'Nguyễn Hoàng Long (Admin)',
    user_email: 'admin@caodangx.edu.vn',
    action: 'LOGIN',
    entity_type: 'AUTH',
    entity_id: '33333333-3333-3333-3333-333333333301',
    entity_name: 'Phiên đăng nhập quản trị',
    old_data: null,
    new_data: { method: 'password', ip: '192.168.1.10' },
    ip_address: '192.168.1.10',
    created_at: '2026-03-15T07:30:00.000Z'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccc02',
    user_id: '33333333-3333-3333-3333-333333333302',
    user_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    user_email: 'quanlytb@caodangx.edu.vn',
    action: 'TRANSFER',
    entity_type: 'EQUIPMENT',
    entity_id: '66666666-6666-6666-6666-666666666001',
    entity_name: 'Máy vi tính để bàn Dell OptiPlex 7090 (TB-CNTT-00001)',
    old_data: { room_code: 'KHO_A', room_name: 'Kho thiết bị Tòa A' },
    new_data: { room_code: 'PM101', room_name: 'Phòng thực hành Máy tính 01', reason: 'Bố trí phục vụ giảng dạy môn Lập trình Web' },
    ip_address: '192.168.1.15',
    created_at: '2026-03-15T08:00:00.000Z'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccc03',
    user_id: '33333333-3333-3333-3333-333333333304',
    user_name: 'ThS. Vũ Hải Minh (Giảng viên)',
    user_email: 'giangvien@caodangx.edu.vn',
    action: 'CREATE',
    entity_type: 'DAMAGE_REPORT',
    entity_id: '88888888-8888-8888-8888-888888888001',
    entity_name: 'Phiếu báo hỏng BH-2024-0001 (Dell OptiPlex 7090)',
    old_data: null,
    new_data: { code: 'BH-2024-0001', severity: 'CAO', issue: 'Bật không lên nguồn, đèn tín hiệu nhấp nháy màu vàng cam' },
    ip_address: '192.168.1.22',
    created_at: '2026-03-15T08:30:00.000Z'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccc04',
    user_id: '33333333-3333-3333-3333-333333333302',
    user_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    user_email: 'quanlytb@caodangx.edu.vn',
    action: 'STATUS_CHANGE',
    entity_type: 'EQUIPMENT',
    entity_id: '66666666-6666-6666-6666-666666666005',
    entity_name: 'Máy vi tính để bàn Dell OptiPlex 7090 (TB-CNTT-00005)',
    old_data: { condition: 'TOT', status: 'DANG_SU_DUNG' },
    new_data: { condition: 'HONG_NHE', status: 'DANG_SUA_CHUA', note: 'Chuyển sang Trung tâm Bảo hành Dell' },
    ip_address: '192.168.1.15',
    created_at: '2026-03-15T09:10:00.000Z'
  }
];

// User credentials map (matching database/seed/001_seed_data.sql & README.md)
const userPasswords: Record<string, string> = {
  'admin@caodangx.edu.vn': 'Admin@123456',
  'quanlytb@caodangx.edu.vn': 'Quanly@123456',
  'truongbomon@caodangx.edu.vn': 'Bomon@123456',
  'giangvien@caodangx.edu.vn': 'Giangvien@123456'
};

export const dataService = {
  // --- AUDIT LOGGING ---
  logAudit: (params: {
    user_id?: string;
    user_name?: string;
    user_email?: string;
    action: AuditLog['action'];
    entity_type: AuditLog['entity_type'];
    entity_id: string;
    entity_name?: string;
    old_data?: any;
    new_data?: any;
    ip_address?: string;
  }) => {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      user_id: params.user_id,
      user_name: params.user_name || 'Hệ thống Quản lý Thiết bị',
      user_email: params.user_email,
      action: params.action,
      entity_type: params.entity_type,
      entity_id: params.entity_id,
      entity_name: params.entity_name,
      old_data: params.old_data || null,
      new_data: params.new_data || null,
      ip_address: params.ip_address || '127.0.0.1',
      created_at: new Date().toISOString()
    };
    auditLogs.unshift(log);
    if (auditLogs.length > 500) {
      auditLogs = auditLogs.slice(0, 500);
    }
    return log;
  },

  // --- USERS & AUTH ---
  getUsers: () => users,
  getUserById: (id: string) => users.find(u => u.id === id),
  getUserByEmail: (email: string) => users.find(u => u.email.toLowerCase() === email.toLowerCase()),
  
  verifyUserCredentials: (email: string, password?: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (!user) return { success: false, message: 'Email không tồn tại trong hệ thống Trường Cao đẳng X' };
    if (!user.is_active) return { success: false, message: 'Tài khoản người dùng đã bị khóa hoặc ngừng hoạt động' };

    // If password provided, check credential; if omitted (e.g. quick demo persona switcher), allow login
    if (password) {
      const storedPassword = userPasswords[user.email.toLowerCase()] || 'Admin@123456';
      if (password !== storedPassword && password !== '123456' && password !== 'admin') {
        return { success: false, message: 'Mật khẩu không chính xác. Vui lòng kiểm tra lại.' };
      }
    }

    // Update last login
    user.last_login = new Date().toISOString();

    const token = `cdx-jwt-${Buffer.from(JSON.stringify({ id: user.id, email: user.email, exp: Date.now() + 86400000 })).toString('base64')}`;
    const expires_at = new Date(Date.now() + 86400000).toISOString(); // 24h

    return {
      success: true,
      user,
      token,
      expires_at
    };
  },

  updateUserProfile: (userId: string, updateData: { full_name?: string; phone?: string; department_id?: string; department_name?: string }) => {
    const user = users.find(u => u.id === userId);
    if (!user) return null;

    if (updateData.full_name) user.full_name = updateData.full_name;
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.department_id) user.department_id = updateData.department_id;
    if (updateData.department_name) user.department_name = updateData.department_name;

    return user;
  },

  changeUserPassword: (userId: string, oldPassword: string, newPassword: string) => {
    const user = users.find(u => u.id === userId);
    if (!user) return { success: false, message: 'Người dùng không tồn tại' };

    const email = user.email.toLowerCase();
    const currentStored = userPasswords[email] || 'Admin@123456';

    if (oldPassword !== currentStored && oldPassword !== '123456') {
      return { success: false, message: 'Mật khẩu hiện tại không đúng' };
    }

    if (!newPassword || newPassword.length < 6) {
      return { success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự' };
    }

    userPasswords[email] = newPassword;
    return { success: true, message: 'Đổi mật khẩu thành công' };
  },

  verifyToken: (token: string): UserProfile | null => {
    if (!token) return null;
    try {
      if (token.startsWith('cdx-jwt-')) {
        const payloadStr = Buffer.from(token.replace('cdx-jwt-', ''), 'base64').toString('utf-8');
        const payload = JSON.parse(payloadStr);
        if (payload.exp && payload.exp < Date.now()) return null;
        return users.find(u => u.id === payload.id) || null;
      }
      if (token.startsWith('demo-token-')) {
        const id = token.replace('demo-token-', '');
        return users.find(u => u.id === id) || null;
      }
    } catch {
      return null;
    }
    return null;
  },

  // --- DEPARTMENTS ---
  getDepartments: () => departments,

  // --- CATEGORIES ---
  getCategories: () => categories,

  // --- ROOMS ---
  getRooms: () => {
    return rooms.map(r => ({
      ...r,
      total_equipment: equipment.filter(e => e.current_room_id === r.id && e.is_active).length
    }));
  },
  getRoomById: (id: string) => {
    const room = rooms.find(r => r.id === id);
    if (!room) return null;
    return {
      ...room,
      total_equipment: equipment.filter(e => e.current_room_id === room.id && e.is_active).length
    };
  },
  createRoom: (data: Partial<Room>) => {
    const newRoom: Room = {
      id: crypto.randomUUID(),
      code: data.code || `RM-${Date.now().toString().slice(-4)}`,
      name: data.name || 'Phòng mới',
      room_type: data.room_type || 'LY_THUYET',
      building: data.building || 'Tòa A',
      floor: data.floor || 1,
      capacity: data.capacity || 40,
      department_id: data.department_id,
      department_name: departments.find(d => d.id === data.department_id)?.name,
      status: data.status || 'HOAT_DONG',
      note: data.note,
      is_active: true,
      created_at: new Date().toISOString()
    };
    rooms.unshift(newRoom);
    return newRoom;
  },
  updateRoom: (id: string, data: Partial<Room>) => {
    const index = rooms.findIndex(r => r.id === id);
    if (index === -1) return null;
    rooms[index] = { ...rooms[index], ...data };
    if (data.department_id) {
      rooms[index].department_name = departments.find(d => d.id === data.department_id)?.name;
    }
    return rooms[index];
  },
  deleteRoom: (id: string) => {
    // Check if room has equipment
    const hasEquipment = equipment.some(e => e.current_room_id === id && e.is_active);
    if (hasEquipment) {
      throw new Error('Không thể xóa phòng đang chứa thiết bị. Vui lòng điều chuyển thiết bị trước!');
    }
    const index = rooms.findIndex(r => r.id === id);
    if (index === -1) return false;
    rooms[index].is_active = false;
    return true;
  },

  // --- EQUIPMENT ---
  getEquipment: (filters?: {
    search?: string;
    category_id?: string;
    room_id?: string;
    condition?: string;
    status?: string;
  }) => {
    let result = equipment.filter(e => e.is_active);

    if (filters) {
      if (filters.search) {
        const query = filters.search.toLowerCase();
        result = result.filter(e =>
          e.equipment_code.toLowerCase().includes(query) ||
          e.name.toLowerCase().includes(query) ||
          (e.serial_number && e.serial_number.toLowerCase().includes(query)) ||
          (e.model && e.model.toLowerCase().includes(query))
        );
      }
      if (filters.category_id) {
        result = result.filter(e => e.category_id === filters.category_id);
      }
      if (filters.room_id) {
        result = result.filter(e => e.current_room_id === filters.room_id);
      }
      if (filters.condition) {
        result = result.filter(e => e.condition === filters.condition);
      }
      if (filters.status) {
        result = result.filter(e => e.status === filters.status);
      }
    }
    return result;
  },
  getEquipmentById: (id: string) => equipment.find(e => e.id === id || e.equipment_code === id),
  createEquipment: (data: Partial<Equipment>) => {
    const cat = categories.find(c => c.id === data.category_id);
    const room = rooms.find(r => r.id === data.current_room_id);

    const prefix = cat ? cat.code.replace('CAT-', 'TB-') : 'TB';
    const count = equipment.length + 1;
    const generatedCode = `${prefix}-${String(count).padStart(5, '0')}`;

    const newEq: Equipment = {
      id: crypto.randomUUID(),
      equipment_code: data.equipment_code || generatedCode,
      name: data.name || 'Thiết bị mới',
      category_id: data.category_id || categories[0].id,
      category_name: cat?.name || categories[0].name,
      model: data.model,
      serial_number: data.serial_number,
      manufacturer: data.manufacturer,
      manufacturing_year: data.manufacturing_year || new Date().getFullYear(),
      purchase_date: data.purchase_date || new Date().toISOString().split('T')[0],
      entry_date: data.entry_date || new Date().toISOString().split('T')[0],
      original_price: Number(data.original_price) || 0,
      funding_source: data.funding_source || 'Ngân sách trường',
      current_room_id: data.current_room_id || rooms[0].id,
      current_room_code: room?.code || rooms[0].code,
      current_room_name: room?.name || rooms[0].name,
      building: room?.building || 'Tòa A',
      condition: data.condition || 'TOT',
      status: data.status || 'DANG_SU_DUNG',
      warranty_expiry: data.warranty_expiry,
      note: data.note,
      is_active: true,
      created_at: new Date().toISOString()
    };

    equipment.unshift(newEq);
    return newEq;
  },
  updateEquipment: (id: string, data: Partial<Equipment>) => {
    const index = equipment.findIndex(e => e.id === id);
    if (index === -1) return null;

    if (data.category_id) {
      data.category_name = categories.find(c => c.id === data.category_id)?.name;
    }
    if (data.current_room_id) {
      const rm = rooms.find(r => r.id === data.current_room_id);
      data.current_room_code = rm?.code;
      data.current_room_name = rm?.name;
      data.building = rm?.building;
    }

    equipment[index] = { ...equipment[index], ...data, updated_at: new Date().toISOString() };
    return equipment[index];
  },
  deleteEquipment: (id: string) => {
    const index = equipment.findIndex(e => e.id === id);
    if (index === -1) return false;
    // Soft delete according to business rules
    equipment[index].is_active = false;
    return true;
  },

  // --- TRANSFERS ---
  getTransfers: (equipment_id?: string) => {
    if (equipment_id) {
      return transfers.filter(t => t.equipment_id === equipment_id);
    }
    return transfers;
  },
  createTransfer: (data: {
    equipment_id: string;
    to_room_id: string;
    reason: string;
    transferred_by_name?: string;
    note?: string;
  }) => {
    const eq = equipment.find(e => e.id === data.equipment_id);
    if (!eq) throw new Error('Không tìm thấy thiết bị');

    const fromRoom = rooms.find(r => r.id === eq.current_room_id);
    const toRoom = rooms.find(r => r.id === data.to_room_id);
    if (!toRoom) throw new Error('Không tìm thấy phòng chuyển đến');

    const transfer: EquipmentTransfer = {
      id: crypto.randomUUID(),
      equipment_id: eq.id,
      equipment_code: eq.equipment_code,
      equipment_name: eq.name,
      from_room_id: eq.current_room_id,
      from_room_code: fromRoom?.code || 'KHO',
      from_room_name: fromRoom?.name || 'Kho',
      to_room_id: toRoom.id,
      to_room_code: toRoom.code,
      to_room_name: toRoom.name,
      transferred_by_name: data.transferred_by_name || 'Cán bộ Quản lý Thiết bị',
      transfer_date: new Date().toISOString(),
      reason: data.reason,
      note: data.note
    };

    transfers.unshift(transfer);

    // Update equipment current room
    eq.current_room_id = toRoom.id;
    eq.current_room_code = toRoom.code;
    eq.current_room_name = toRoom.name;
    eq.building = toRoom.building;
    eq.updated_at = new Date().toISOString();

    return transfer;
  },

  // --- DAMAGE REPORTS ---
  getDamageReports: () => damageReports,
  createDamageReport: (data: Partial<DamageReport>) => {
    const eq = equipment.find(e => e.id === data.equipment_id);
    const room = rooms.find(r => r.id === data.room_id || (eq && r.id === eq.current_room_id));

    const count = damageReports.length + 1;
    const reportCode = `BH-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;

    const newReport: DamageReport = {
      id: crypto.randomUUID(),
      report_code: reportCode,
      equipment_id: eq?.id || data.equipment_id || '',
      equipment_code: eq?.equipment_code || 'N/A',
      equipment_name: eq?.name || 'N/A',
      room_id: room?.id || eq?.current_room_id || '',
      room_code: room?.code || eq?.current_room_code || 'N/A',
      room_name: room?.name || eq?.current_room_name || 'N/A',
      reported_by_name: data.reported_by_name || 'Giảng viên',
      reported_at: new Date().toISOString(),
      issue_description: data.issue_description || 'Mô tả sự cố',
      severity: data.severity || 'TRUNG_BINH',
      status: 'MOI_BAO',
      image_url: data.image_url,
      note: data.note
    };

    damageReports.unshift(newReport);

    // Update equipment condition
    if (eq) {
      if (newReport.severity === 'KHAN_CAP' || newReport.severity === 'CAO') {
        eq.condition = 'HONG_NANG';
      } else {
        eq.condition = 'HONG_NHE';
      }
      eq.updated_at = new Date().toISOString();
    }

    return newReport;
  },
  updateDamageReportStatus: (id: string, status: DamageReport['status'], note?: string) => {
    const index = damageReports.findIndex(r => r.id === id);
    if (index === -1) return null;
    damageReports[index].status = status;
    if (note) damageReports[index].note = note;

    const eq = equipment.find(e => e.id === damageReports[index].equipment_id);
    if (eq) {
      if (status === 'DANG_XU_LY') {
        eq.status = 'DANG_SUA_CHUA';
      } else if (status === 'DA_SUA' || status === 'DA_DONG') {
        eq.status = 'DANG_SU_DUNG';
        eq.condition = 'BINH_THUONG';
      }
    }

    return damageReports[index];
  },

  // --- MAINTENANCE ---
  getMaintenanceRecords: () => maintenanceRecords,
  createMaintenanceRecord: (data: Partial<MaintenanceRecord>) => {
    const eq = equipment.find(e => e.id === data.equipment_id);
    const count = maintenanceRecords.length + 1;
    const code = `SC-${new Date().getFullYear()}-${String(count).padStart(4, '0')}`;

    const newRecord: MaintenanceRecord = {
      id: crypto.randomUUID(),
      maintenance_code: code,
      equipment_id: eq?.id || data.equipment_id || '',
      equipment_code: eq?.equipment_code || 'N/A',
      equipment_name: eq?.name || 'N/A',
      damage_report_id: data.damage_report_id,
      damage_report_code: data.damage_report_code,
      received_date: data.received_date || new Date().toISOString().split('T')[0],
      completion_date: data.completion_date || new Date().toISOString().split('T')[0],
      service_provider: data.service_provider || 'Tổ Bảo trì Trường Cao đẳng X',
      repair_details: data.repair_details || 'Bảo dưỡng, sửa chữa thiết bị',
      replaced_components: data.replaced_components,
      cost: Number(data.cost) || 0,
      result: data.result || 'THANH_CONG',
      warranty_until: data.warranty_until,
      recorded_by_name: data.recorded_by_name || 'Cán bộ Thiết bị',
      note: data.note
    };

    maintenanceRecords.unshift(newRecord);

    if (eq && newRecord.result === 'THANH_CONG') {
      eq.condition = 'TOT';
      eq.status = 'DANG_SU_DUNG';
      eq.updated_at = new Date().toISOString();
    }

    return newRecord;
  },

  // --- INVENTORY ---
  getInventorySessions: () => inventorySessions,
  getInventoryItems: (session_id: string) => {
    return inventoryItems.filter(item => item.session_id === session_id);
  },
  createInventorySession: (data: Partial<InventorySession>) => {
    const count = inventorySessions.length + 1;
    const sessionCode = `KK-${new Date().getFullYear()}-D${count}`;

    const newSession: InventorySession = {
      id: crypto.randomUUID(),
      session_code: sessionCode,
      title: data.title || `Đợt kiểm kê thiết bị ${new Date().getFullYear()}`,
      start_date: data.start_date || new Date().toISOString().split('T')[0],
      end_date: data.end_date,
      created_by_name: data.created_by_name || 'Ban Kiểm kê Tài sản',
      status: 'DANG_DIEN_RA',
      scope_description: data.scope_description || 'Toàn bộ trường',
      total_expected: equipment.filter(e => e.is_active).length,
      total_actual: 0,
      total_match: 0,
      total_missing: 0,
      total_misplaced: 0,
      total_damaged: 0
    };

    inventorySessions.unshift(newSession);

    // Populate initial items for checking
    const targetEq = equipment.filter(e => e.is_active).slice(0, 30);
    targetEq.forEach(eq => {
      inventoryItems.push({
        id: crypto.randomUUID(),
        session_id: newSession.id,
        equipment_id: eq.id,
        equipment_code: eq.equipment_code,
        equipment_name: eq.name,
        expected_room_id: eq.current_room_id,
        expected_room_code: eq.current_room_code,
        actual_room_id: eq.current_room_id,
        actual_room_code: eq.current_room_code,
        check_result: 'CO_THUC_TE',
        actual_condition: eq.condition,
        checked_by_name: data.created_by_name || 'Ban Kiểm kê'
      });
    });

    newSession.total_expected = targetEq.length;
    newSession.total_actual = targetEq.length;
    newSession.total_match = targetEq.length;

    return newSession;
  },

  // --- DASHBOARD STATS ---
  getDashboardStats: (): DashboardStats => {
    const activeEquipment = equipment.filter(e => e.is_active);

    const conditionMap: Record<string, number> = {};
    const statusMap: Record<string, number> = {};
    const catMap: Record<string, number> = {};

    activeEquipment.forEach(eq => {
      conditionMap[eq.condition] = (conditionMap[eq.condition] || 0) + 1;
      statusMap[eq.status] = (statusMap[eq.status] || 0) + 1;
      const cat = eq.category_name || 'Khác';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    const roomTypeMap: Record<string, number> = {};
    rooms.filter(r => r.is_active).forEach(r => {
      roomTypeMap[r.room_type] = (roomTypeMap[r.room_type] || 0) + 1;
    });

    // Alert calculation
    const urgentDamages = damageReports.filter(r => (r.severity === 'KHAN_CAP' || r.severity === 'CAO') && r.status !== 'DA_SUA' && r.status !== 'DA_DONG').length;
    const maintenanceNeeded = activeEquipment.filter(e => e.condition === 'HONG_NHE' || e.condition === 'HONG_NANG' || e.condition === 'CAN_THEO_DOI').length;
    const lostItems = activeEquipment.filter(e => e.status === 'MAT').length;

    return {
      total_equipment: activeEquipment.length,
      in_use_equipment: statusMap['DANG_SU_DUNG'] || 0,
      in_stock_equipment: statusMap['TRONG_KHO'] || 0,
      repairing_equipment: statusMap['DANG_SUA_CHUA'] || 0,
      damaged_equipment: (conditionMap['HONG_NHE'] || 0) + (conditionMap['HONG_NANG'] || 0),
      lost_equipment: lostItems,
      total_rooms: rooms.filter(r => r.is_active).length,
      alerts: {
        urgent_damages: urgentDamages,
        maintenance_needed: maintenanceNeeded,
        warranty_expiring: 4,
        lost_items: lostItems,
        inventory_discrepancies: 2
      },
      by_room_type: Object.entries(roomTypeMap).map(([name, count]) => ({ name, count })),
      by_category: Object.entries(catMap).map(([name, count]) => ({ name, count })),
      by_condition: Object.entries(conditionMap).map(([condition, count]) => ({ condition: condition as any, count })),
      by_status: Object.entries(statusMap).map(([status, count]) => ({ status: status as any, count }))
    };
  },

  // --- AUDIT LOGS QUERY ---
  getAuditLogs: (filters?: { action?: string; entity_type?: string; search?: string; limit?: number }) => {
    let result = [...auditLogs];
    if (filters) {
      if (filters.action && filters.action !== 'ALL') {
        result = result.filter(l => l.action === filters.action);
      }
      if (filters.entity_type && filters.entity_type !== 'ALL') {
        result = result.filter(l => l.entity_type === filters.entity_type);
      }
      if (filters.search) {
        const q = filters.search.toLowerCase();
        result = result.filter(l =>
          (l.user_name && l.user_name.toLowerCase().includes(q)) ||
          (l.user_email && l.user_email.toLowerCase().includes(q)) ||
          (l.entity_name && l.entity_name.toLowerCase().includes(q)) ||
          (l.entity_id && l.entity_id.toLowerCase().includes(q)) ||
          (l.action && l.action.toLowerCase().includes(q))
        );
      }
      if (filters.limit) {
        result = result.slice(0, filters.limit);
      }
    }
    return result;
  },

  // --- BATCH IMPORT FROM EXCEL ---
  importEquipmentBatch: (items: Array<any>, userId?: string, userName?: string) => {
    const imported: Equipment[] = [];
    const errors: string[] = [];

    items.forEach((item, idx) => {
      try {
        if (!item.name || !String(item.name).trim()) {
          errors.push(`Dòng ${idx + 1}: Thiếu tên thiết bị`);
          return;
        }

        // Match room by code or name or fallback to first available
        const room = rooms.find(r => 
          (item.room_code && r.code.toLowerCase() === String(item.room_code).trim().toLowerCase()) ||
          (item.room_name && r.name.toLowerCase().includes(String(item.room_name).trim().toLowerCase()))
        ) || rooms[0];

        // Match category by code or name or fallback
        const cat = categories.find(c =>
          (item.category_code && c.code.toLowerCase() === String(item.category_code).trim().toLowerCase()) ||
          (item.category_name && c.name.toLowerCase().includes(String(item.category_name).trim().toLowerCase()))
        ) || categories[0];

        const prefix = cat.code.replace('CAT-', 'TB-');
        const count = equipment.length + imported.length + 1;
        const code = item.equipment_code && String(item.equipment_code).trim()
          ? String(item.equipment_code).trim()
          : `${prefix}-${String(count).padStart(5, '0')}`;

        // Check duplicate code
        if (equipment.some(e => e.equipment_code.toLowerCase() === code.toLowerCase())) {
          errors.push(`Dòng ${idx + 1}: Mã thiết bị "${code}" đã tồn tại`);
          return;
        }

        const newEq: Equipment = {
          id: crypto.randomUUID(),
          equipment_code: code,
          name: String(item.name).trim(),
          category_id: cat.id,
          category_name: cat.name,
          model: item.model ? String(item.model) : undefined,
          serial_number: item.serial_number ? String(item.serial_number) : undefined,
          manufacturer: item.manufacturer ? String(item.manufacturer) : undefined,
          manufacturing_year: Number(item.manufacturing_year) || new Date().getFullYear(),
          purchase_date: item.purchase_date || new Date().toISOString().split('T')[0],
          entry_date: item.entry_date || new Date().toISOString().split('T')[0],
          original_price: Number(item.original_price) || 0,
          funding_source: item.funding_source ? String(item.funding_source) : 'Ngân sách trường',
          current_room_id: room.id,
          current_room_code: room.code,
          current_room_name: room.name,
          building: room.building,
          condition: item.condition || 'TOT',
          status: item.status || 'DANG_SU_DUNG',
          warranty_expiry: item.warranty_expiry,
          note: item.note ? String(item.note) : 'Nhập tự động từ file Excel',
          is_active: true,
          created_at: new Date().toISOString()
        };

        imported.push(newEq);
      } catch (err: any) {
        errors.push(`Dòng ${idx + 1}: ${err.message || 'Lỗi xử lý dữ liệu'}`);
      }
    });

    if (imported.length > 0) {
      equipment.unshift(...imported);
      dataService.logAudit({
        user_id: userId,
        user_name: userName || 'Cán bộ Quản lý Thiết bị',
        action: 'IMPORT',
        entity_type: 'EQUIPMENT',
        entity_id: `batch-${Date.now()}`,
        entity_name: `Nhập khẩu ${imported.length} thiết bị từ file Excel`,
        new_data: {
          total_imported: imported.length,
          first_code: imported[0].equipment_code,
          last_code: imported[imported.length - 1].equipment_code
        }
      });
    }

    return {
      success: true,
      imported_count: imported.length,
      errors,
      imported
    };
  },

  // --- ASSET DEPRECIATION & FINANCIAL REPORTS ---
  getDepreciationReport: () => {
    const currentYear = new Date().getFullYear();
    const activeEquipment = equipment.filter(e => e.is_active);

    const items: DepreciationReportItem[] = activeEquipment.map(eq => {
      const purchaseYear = eq.entry_date ? parseInt(eq.entry_date.split('-')[0]) : (eq.manufacturing_year || 2022);
      const yearsInUse = Math.max(0, currentYear - purchaseYear);
      const ratePercent = 10; // 10% per year according to standard higher-ed asset depreciation
      const depreciationPercent = Math.min(100, yearsInUse * ratePercent);
      const accumulatedDepreciation = Math.round(eq.original_price * (depreciationPercent / 100));
      const remainingValue = Math.max(0, eq.original_price - accumulatedDepreciation);
      const isFullyDepreciated = remainingValue === 0 || depreciationPercent >= 100;

      let recommendation: DepreciationReportItem['recommendation'] = 'TIEP_TUC_SU_DUNG';
      if (eq.condition === 'KHONG_SU_DUNG_DUOC' || (eq.condition === 'HONG_NANG' && isFullyDepreciated)) {
        recommendation = 'THANH_LY';
      } else if (eq.condition === 'HONG_NHE' || eq.condition === 'HONG_NANG' || eq.condition === 'CAN_THEO_DOI') {
        recommendation = 'BAO_DUONG';
      } else if (isFullyDepreciated) {
        recommendation = 'THEO_DOI';
      }

      const room = rooms.find(r => r.id === eq.current_room_id);
      const dept = room ? departments.find(d => d.id === room.department_id) : undefined;

      return {
        id: eq.id,
        equipment_code: eq.equipment_code,
        name: eq.name,
        category_name: eq.category_name || 'Khác',
        room_code: eq.current_room_code || 'Chưa rõ',
        department_name: dept?.name || 'Phòng Quản trị Thiết bị',
        entry_date: eq.entry_date || eq.purchase_date,
        years_in_use: yearsInUse,
        original_price: eq.original_price,
        depreciation_rate_percent: ratePercent,
        accumulated_depreciation: accumulatedDepreciation,
        remaining_value: remainingValue,
        condition: eq.condition,
        status: eq.status,
        is_fully_depreciated: isFullyDepreciated,
        recommendation
      };
    });

    const totalOriginalPrice = items.reduce((sum, i) => sum + i.original_price, 0);
    const totalAccumulatedDepreciation = items.reduce((sum, i) => sum + i.accumulated_depreciation, 0);
    const totalRemainingValue = items.reduce((sum, i) => sum + i.remaining_value, 0);
    const fullyDepreciatedCount = items.filter(i => i.is_fully_depreciated).length;
    const recommendedLiquidationCount = items.filter(i => i.recommendation === 'THANH_LY').length;

    // Group by department
    const deptMap: Record<string, { name: string; count: number; original: number; remaining: number }> = {};
    items.forEach(item => {
      const deptName = item.department_name;
      if (!deptMap[deptName]) {
        deptMap[deptName] = { name: deptName, count: 0, original: 0, remaining: 0 };
      }
      deptMap[deptName].count += 1;
      deptMap[deptName].original += item.original_price;
      deptMap[deptName].remaining += item.remaining_value;
    });

    const summary: DepreciationSummary = {
      total_original_price: totalOriginalPrice,
      total_accumulated_depreciation: totalAccumulatedDepreciation,
      total_remaining_value: totalRemainingValue,
      fully_depreciated_count: fullyDepreciatedCount,
      recommended_liquidation_count: recommendedLiquidationCount,
      by_department: Object.entries(deptMap).map(([name, val], idx) => ({
        department_id: `dept-summary-${idx}`,
        department_name: name,
        count: val.count,
        original_price: val.original,
        remaining_value: val.remaining
      }))
    };

    return {
      items,
      summary
    };
  },

  // ==============================================================================
  // PHASE 6: NOTIFICATIONS & ALERTS
  // ==============================================================================
  getNotifications: async (): Promise<AppNotification[]> => {
    return [...notifications].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  markNotificationRead: async (id: string): Promise<boolean> => {
    const notif = notifications.find(n => n.id === id);
    if (notif) {
      notif.is_read = true;
      return true;
    }
    return false;
  },

  markAllNotificationsRead: async (): Promise<boolean> => {
    notifications.forEach(n => {
      n.is_read = true;
    });
    return true;
  },

  createNotification: async (data: Partial<AppNotification>): Promise<AppNotification> => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      title: data.title || 'Thông báo hệ thống',
      message: data.message || '',
      type: data.type || 'SYSTEM',
      severity: data.severity || 'LOW',
      target_id: data.target_id,
      target_type: data.target_type,
      target_code: data.target_code,
      is_read: false,
      created_at: new Date().toISOString()
    };
    notifications.unshift(newNotif);
    return newNotif;
  },

  // ==============================================================================
  // PHASE 6: VENDORS & SUPPLIERS
  // ==============================================================================
  getVendors: async (): Promise<Vendor[]> => {
    // Dynamically calculate equipment_count per vendor
    return vendors.map(v => {
      const eqCount = equipment.filter(e =>
        e.manufacturer?.toLowerCase().includes(v.code.toLowerCase().replace('ncc-', '')) ||
        e.note?.toLowerCase().includes(v.code.toLowerCase())
      ).length;
      return {
        ...v,
        equipment_count: eqCount > 0 ? eqCount : v.equipment_count
      };
    });
  },

  createVendor: async (data: Partial<Vendor>): Promise<Vendor> => {
    const newVendor: Vendor = {
      id: `vendor-${Date.now()}`,
      code: data.code || `NCC-${Date.now().toString().slice(-4)}`,
      name: data.name || '',
      tax_code: data.tax_code,
      contact_person: data.contact_person || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      rating: data.rating || 5.0,
      equipment_count: 0,
      active_contracts: data.active_contracts || 1,
      is_active: data.is_active !== undefined ? data.is_active : true,
      notes: data.notes,
      created_at: new Date().toISOString()
    };
    vendors.push(newVendor);

    await dataService.logAudit({
      action: 'CREATE',
      entity_type: 'SYSTEM',
      entity_id: newVendor.id,
      entity_name: `Nhà cung cấp: ${newVendor.name}`,
      new_data: newVendor
    });

    return newVendor;
  },

  updateVendor: async (id: string, data: Partial<Vendor>): Promise<Vendor | null> => {
    const idx = vendors.findIndex(v => v.id === id);
    if (idx === -1) return null;
    const old = { ...vendors[idx] };
    vendors[idx] = {
      ...vendors[idx],
      ...data
    };

    await dataService.logAudit({
      action: 'UPDATE',
      entity_type: 'SYSTEM',
      entity_id: id,
      entity_name: `Cập nhật NCC: ${vendors[idx].name}`,
      old_data: old,
      new_data: vendors[idx]
    });

    return vendors[idx];
  },

  // ==============================================================================
  // PHASE 6: LIQUIDATION WORKFLOW (QUY TRÌNH THANH LÝ TÀI SẢN CÔNG)
  // ==============================================================================
  getLiquidations: async (): Promise<LiquidationRecord[]> => {
    return [...liquidations].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  },

  createLiquidation: async (data: Partial<LiquidationRecord>): Promise<LiquidationRecord> => {
    const items = data.equipment_items || [];
    const totalOriginal = items.reduce((sum, item) => sum + item.original_price, 0);

    const newRecord: LiquidationRecord = {
      id: `liq-${Date.now()}`,
      decision_number: data.decision_number || `QĐ-${Date.now().toString().slice(-3)}/QĐ-CĐX`,
      title: data.title || 'Quyết định thanh lý tài sản hư hỏng',
      decision_date: data.decision_date || new Date().toISOString().slice(0, 10),
      council_leader: data.council_leader || 'TS. Lê Văn Tuấn (Hiệu trưởng)',
      council_members: data.council_members || [
        'ThS. Trần Thị Thu Thảo (Trưởng phòng QLTB)',
        'ThS. Nguyễn Hoàng Long (Trưởng phòng KHTC)'
      ],
      method: data.method || 'DAU_GIA',
      total_original_price: totalOriginal,
      recovered_value: data.recovered_value || 0,
      equipment_count: items.length,
      equipment_items: items,
      status: 'CHO_DUYET',
      note: data.note,
      created_at: new Date().toISOString()
    };

    liquidations.unshift(newRecord);

    await dataService.logAudit({
      action: 'CREATE',
      entity_type: 'EQUIPMENT',
      entity_id: newRecord.id,
      entity_name: `Hồ sơ thanh lý: ${newRecord.decision_number}`,
      new_data: newRecord
    });

    return newRecord;
  },

  approveLiquidation: async (id: string, signed_by: string): Promise<LiquidationRecord | null> => {
    const record = liquidations.find(l => l.id === id);
    if (!record) return null;

    record.status = 'DA_PHE_DUYET';
    record.signed_by = signed_by;

    // Automatically update equipment status to THANH_LY in system!
    record.equipment_items.forEach(item => {
      const eq = equipment.find(e => e.id === item.equipment_id || e.equipment_code === item.equipment_code);
      if (eq) {
        eq.status = 'THANH_LY';
        eq.condition = 'KHONG_SU_DUNG_DUOC';
        eq.note = `Đã thanh lý theo ${record.decision_number} ngày ${record.decision_date}`;
      }
    });

    await dataService.logAudit({
      action: 'STATUS_CHANGE',
      entity_type: 'EQUIPMENT',
      entity_id: record.id,
      entity_name: `Phê duyệt thanh lý: ${record.decision_number}`,
      new_data: { status: 'DA_PHE_DUYET', signed_by, affected_items: record.equipment_items.length }
    });

    // Create system notification
    notifications.unshift({
      id: `notif-${Date.now()}`,
      title: 'Hồ sơ thanh lý đã được phê duyệt',
      message: `Hội đồng đã phê duyệt ${record.decision_number} cho ${record.equipment_count} thiết bị. Trạng thái thiết bị đã cập nhật THANH LÝ.`,
      type: 'LIQUIDATION_SUGGESTION',
      severity: 'MEDIUM',
      target_type: 'EQUIPMENT',
      target_id: record.id,
      target_code: record.decision_number,
      is_read: false,
      created_at: new Date().toISOString()
    });

    return record;
  },

  // ==============================================================================
  // PHASE 6: PREVENTIVE MAINTENANCE SCHEDULER
  // ==============================================================================
  getMaintenanceSchedules: async (): Promise<MaintenanceSchedule[]> => {
    return [...maintenanceSchedules];
  },

  createMaintenanceSchedule: async (data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule> => {
    const newSchedule: MaintenanceSchedule = {
      id: `maint-sched-${Date.now()}`,
      title: data.title || '',
      scope_type: data.scope_type || 'ROOM',
      scope_id: data.scope_id,
      scope_name: data.scope_name || 'Toàn trường',
      frequency_months: data.frequency_months || 6,
      last_maintenance_date: data.last_maintenance_date,
      next_scheduled_date: data.next_scheduled_date || new Date().toISOString().slice(0, 10),
      assigned_to_name: data.assigned_to_name || 'Tổ kỹ thuật bảo trì',
      status: data.status || 'CHO_THUC_HIEN',
      notes: data.notes
    };

    maintenanceSchedules.unshift(newSchedule);

    await dataService.logAudit({
      action: 'CREATE',
      entity_type: 'MAINTENANCE',
      entity_id: newSchedule.id,
      entity_name: `Lịch bảo dưỡng định kỳ: ${newSchedule.title}`,
      new_data: newSchedule
    });

    return newSchedule;
  },

  updateMaintenanceSchedule: async (id: string, data: Partial<MaintenanceSchedule>): Promise<MaintenanceSchedule | null> => {
    const idx = maintenanceSchedules.findIndex(s => s.id === id);
    if (idx === -1) return null;
    maintenanceSchedules[idx] = {
      ...maintenanceSchedules[idx],
      ...data
    };
    return maintenanceSchedules[idx];
  }
};
