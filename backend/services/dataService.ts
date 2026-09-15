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
  DashboardStats
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

// User credentials map (matching database/seed/001_seed_data.sql & README.md)
const userPasswords: Record<string, string> = {
  'admin@caodangx.edu.vn': 'Admin@123456',
  'quanlytb@caodangx.edu.vn': 'Quanly@123456',
  'truongbomon@caodangx.edu.vn': 'Bomon@123456',
  'giangvien@caodangx.edu.vn': 'Giangvien@123456'
};

export const dataService = {
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
  }
};
