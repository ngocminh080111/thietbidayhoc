// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// SEED DATA STORE (Khớp 100% với database/seed/001_seed_data.sql)
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
  UserProfile
} from '../../src/types/index.ts';

export const initialDepartments: Department[] = [
  { id: '22222222-2222-2222-2222-222222222201', code: 'KHOA-CNTT', name: 'Khoa Công nghệ Thông tin', description: 'Phòng máy thực hành phần mềm, mạng máy tính và IoT' },
  { id: '22222222-2222-2222-2222-222222222202', code: 'KHOA-CK', name: 'Khoa Cơ khí - Động lực', description: 'Xưởng cơ khí gia công, xưởng hàn và xưởng bảo dưỡng ô tô' },
  { id: '22222222-2222-2222-2222-222222222203', code: 'KHOA-DDT', name: 'Khoa Điện - Điện tử', description: 'Phòng thực hành vi mạch, điện công nghiệp và tự động hóa PLC' },
  { id: '22222222-2222-2222-2222-222222222204', code: 'KHOA-KTQT', name: 'Khoa Kinh tế & Quản trị', description: 'Phòng học mô phỏng kế toán doanh nghiệp và logistics' },
  { id: '22222222-2222-2222-2222-222222222205', code: 'KHOA-KHCB', name: 'Khoa Khoa học Cơ bản', description: 'Phòng thí nghiệm Lý, Hóa đại cương và khu giảng đường chung' },
];

export const initialUsers: UserProfile[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    email: 'admin@caodangx.edu.vn',
    full_name: 'Nguyễn Hoàng Long (Admin)',
    phone: '0901234567',
    roles: ['ADMIN'],
    is_active: true
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    email: 'quanlytb@caodangx.edu.vn',
    full_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    phone: '0912345678',
    roles: ['EQUIPMENT_MANAGER'],
    is_active: true
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    email: 'truongbomon@caodangx.edu.vn',
    full_name: 'TS. Lê Đức Thắng (Trưởng BM CNTT)',
    phone: '0923456789',
    department_id: '22222222-2222-2222-2222-222222222201',
    department_name: 'Khoa Công nghệ Thông tin',
    roles: ['DEPARTMENT_HEAD'],
    is_active: true
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    email: 'giangvien@caodangx.edu.vn',
    full_name: 'ThS. Vũ Hải Minh (Giảng viên)',
    phone: '0934567890',
    department_id: '22222222-2222-2222-2222-222222222201',
    department_name: 'Khoa Công nghệ Thông tin',
    roles: ['TEACHER'],
    is_active: true
  }
];

export const initialRooms: Room[] = [
  { id: '44444444-4444-4444-4444-444444444401', code: 'A101', name: 'Phòng Lý thuyết A101', room_type: 'LY_THUYET', building: 'Tòa A', floor: 1, capacity: 60, department_id: '22222222-2222-2222-2222-222222222205', department_name: 'Khoa Khoa học Cơ bản', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444402', code: 'A102', name: 'Phòng Lý thuyết A102', room_type: 'LY_THUYET', building: 'Tòa A', floor: 1, capacity: 60, department_id: '22222222-2222-2222-2222-222222222205', department_name: 'Khoa Khoa học Cơ bản', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444403', code: 'A201', name: 'Phòng Hội thảo Quốc tế A201', room_type: 'KHAC', building: 'Tòa A', floor: 2, capacity: 120, department_id: '22222222-2222-2222-2222-222222222204', department_name: 'Khoa Kinh tế & Quản trị', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444404', code: 'A202', name: 'Phòng Mô phỏng Doanh nghiệp A202', room_type: 'THUC_HANH', building: 'Tòa A', floor: 2, capacity: 45, department_id: '22222222-2222-2222-2222-222222222204', department_name: 'Khoa Kinh tế & Quản trị', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444405', code: 'B101', name: 'Kho Thiết bị Trung tâm', room_type: 'KHO', building: 'Tòa B', floor: 1, capacity: 10, status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444406', code: 'PM101', name: 'Phòng Máy tính Đồ họa PM101', room_type: 'PHONG_MAY', building: 'Tòa B', floor: 1, capacity: 40, department_id: '22222222-2222-2222-2222-222222222201', department_name: 'Khoa Công nghệ Thông tin', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444407', code: 'PM102', name: 'Phòng Máy tính Lập trình PM102', room_type: 'PHONG_MAY', building: 'Tòa B', floor: 1, capacity: 40, department_id: '22222222-2222-2222-2222-222222222201', department_name: 'Khoa Công nghệ Thông tin', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444408', code: 'PM201', name: 'Phòng Lab An toàn Mạng PM201', room_type: 'PHONG_MAY', building: 'Tòa B', floor: 2, capacity: 35, department_id: '22222222-2222-2222-2222-222222222201', department_name: 'Khoa Công nghệ Thông tin', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444409', code: 'PM202', name: 'Phòng Máy tính Khảo thí PM202', room_type: 'PHONG_MAY', building: 'Tòa B', floor: 2, capacity: 50, department_id: '22222222-2222-2222-2222-222222222201', department_name: 'Khoa Công nghệ Thông tin', status: 'BAO_TRI', is_active: true },
  { id: '44444444-4444-4444-4444-444444444410', code: 'C101', name: 'Phòng Thí nghiệm Vật lý C101', room_type: 'THI_NGHIEM', building: 'Tòa C', floor: 1, capacity: 30, department_id: '22222222-2222-2222-2222-222222222205', department_name: 'Khoa Khoa học Cơ bản', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444411', code: 'C102', name: 'Phòng Thí nghiệm Hóa học C102', room_type: 'THI_NGHIEM', building: 'Tòa C', floor: 1, capacity: 30, department_id: '22222222-2222-2222-2222-222222222205', department_name: 'Khoa Khoa học Cơ bản', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444412', code: 'C201', name: 'Phòng TH Điện tử Cơ bản C201', room_type: 'THUC_HANH', building: 'Tòa C', floor: 2, capacity: 40, department_id: '22222222-2222-2222-2222-222222222203', department_name: 'Khoa Điện - Điện tử', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444413', code: 'C202', name: 'Phòng Lab Vi điều khiển & IoT C202', room_type: 'THUC_HANH', building: 'Tòa C', floor: 2, capacity: 35, department_id: '22222222-2222-2222-2222-222222222203', department_name: 'Khoa Điện - Điện tử', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444414', code: 'C301', name: 'Phòng TH Tự động hóa PLC C301', room_type: 'THUC_HANH', building: 'Tòa C', floor: 3, capacity: 30, department_id: '22222222-2222-2222-2222-222222222203', department_name: 'Khoa Điện - Điện tử', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444415', code: 'XK01', name: 'Kho Vật tư Cơ khí', room_type: 'KHO', building: 'Khu Xưởng', floor: 1, capacity: 10, department_id: '22222222-2222-2222-2222-222222222202', department_name: 'Khoa Cơ khí - Động lực', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444416', code: 'X101', name: 'Xưởng Gia công CNC X101', room_type: 'XUONG', building: 'Khu Xưởng', floor: 1, capacity: 30, department_id: '22222222-2222-2222-2222-222222222202', department_name: 'Khoa Cơ khí - Động lực', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444417', code: 'X102', name: 'Xưởng Hàn & Cắt gọt X102', room_type: 'XUONG', building: 'Khu Xưởng', floor: 1, capacity: 35, department_id: '22222222-2222-2222-2222-222222222202', department_name: 'Khoa Cơ khí - Động lực', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444418', code: 'X201', name: 'Xưởng Động cơ Ô tô X201', room_type: 'XUONG', building: 'Khu Xưởng', floor: 1, capacity: 40, department_id: '22222222-2222-2222-2222-222222222202', department_name: 'Khoa Cơ khí - Động lực', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444419', code: 'X202', name: 'Xưởng Khung gầm & Điện Ô tô X202', room_type: 'XUONG', building: 'Khu Xưởng', floor: 1, capacity: 35, department_id: '22222222-2222-2222-2222-222222222202', department_name: 'Khoa Cơ khí - Động lực', status: 'HOAT_DONG', is_active: true },
  { id: '44444444-4444-4444-4444-444444444420', code: 'KTB01', name: 'Kho Thanh lý & Chờ sửa chữa', room_type: 'KHO', building: 'Tòa B', floor: 1, capacity: 15, status: 'HOAT_DONG', is_active: true }
];

export const initialCategories: EquipmentCategory[] = [
  { id: '55555555-5555-5555-5555-555555555501', code: 'CAT-MAYTINH', name: 'Máy vi tính & Máy chủ', description: 'Máy tính để bàn, trạm làm việc workstation và server' },
  { id: '55555555-5555-5555-5555-555555555502', code: 'CAT-MANG', name: 'Thiết bị Mạng & Viễn thông', description: 'Router, switch mạng, access point Wi-Fi, tủ rack và firewall' },
  { id: '55555555-5555-5555-5555-555555555503', code: 'CAT-CHIEU', name: 'Máy chiếu & Thiết bị Hiển thị', description: 'Máy chiếu hội trường, màn chiếu điện, TV tương tác' },
  { id: '55555555-5555-5555-5555-555555555504', code: 'CAT-DOLUONG', name: 'Thiết bị Đo lường & Thí nghiệm', description: 'Dao động ký, máy đếm tần, đồng hồ vạn năng số' },
  { id: '55555555-5555-5555-5555-555555555505', code: 'CAT-COKHI', name: 'Máy gia công Cơ khí & Động lực', description: 'Máy tiện CNC, máy phay, máy hàn, cầu nâng ô tô' },
  { id: '55555555-5555-5555-5555-555555555506', code: 'CAT-AMTHANH', name: 'Thiết bị Âm thanh Giảng đường', description: 'Amply, mixer, micro không dây và loa trợ giảng' },
  { id: '55555555-5555-5555-5555-555555555507', code: 'CAT-VANPHONG', name: 'Thiết bị Văn phòng & Khác', description: 'Máy điều hòa nhiệt độ, máy hút ẩm phòng lab' },
  { id: '55555555-5555-5555-5555-555555555508', code: 'CAT-MAYIN', name: 'Máy in & Thiết bị Sao chụp', description: 'Máy in laser đa năng, máy scan tài liệu chuyên dụng' },
  { id: '55555555-5555-5555-5555-555555555509', code: 'CAT-TUDONGHOA', name: 'Kit Thực hành & Tự động hóa', description: 'Kit thực hành PLC Siemens, cánh tay robot' },
  { id: '55555555-5555-5555-5555-555555555510', code: 'CAT-ANTOAN', name: 'Thiết bị An toàn & PCCC', description: 'Bình chữa cháy khí CO2, tủ cứu thương, hệ thống báo khói' }
];

// Helper để tạo 100 thiết bị
export function generateInitialEquipment(): Equipment[] {
  const list: Equipment[] = [
    {
      id: '66666666-6666-6666-6666-666666666001',
      equipment_code: 'TB-CNTT-00001',
      name: 'Máy vi tính để bàn Dell OptiPlex 7090',
      category_id: '55555555-5555-5555-5555-555555555501',
      category_name: 'Máy vi tính & Máy chủ',
      model: 'OptiPlex 7090 MT',
      serial_number: 'SN-DELL-7090-01',
      manufacturer: 'Dell Inc.',
      manufacturing_year: 2023,
      purchase_date: '2023-08-15',
      original_price: 18500000,
      current_room_id: '44444444-4444-4444-4444-444444444406',
      current_room_code: 'PM101',
      current_room_name: 'Phòng Máy tính Đồ họa PM101',
      building: 'Tòa B',
      condition: 'TOT',
      status: 'DANG_SU_DUNG',
      warranty_expiry: '2026-08-15',
      note: 'Máy trạm giáo viên PM101',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666002',
      equipment_code: 'TB-CNTT-00002',
      name: 'Máy vi tính để bàn Dell OptiPlex 7090',
      category_id: '55555555-5555-5555-5555-555555555501',
      category_name: 'Máy vi tính & Máy chủ',
      model: 'OptiPlex 7090 MT',
      serial_number: 'SN-DELL-7090-02',
      manufacturer: 'Dell Inc.',
      manufacturing_year: 2023,
      purchase_date: '2023-08-15',
      original_price: 18500000,
      current_room_id: '44444444-4444-4444-4444-444444444406',
      current_room_code: 'PM101',
      current_room_name: 'Phòng Máy tính Đồ họa PM101',
      building: 'Tòa B',
      condition: 'TOT',
      status: 'DANG_SU_DUNG',
      warranty_expiry: '2026-08-15',
      note: 'Máy thực hành số 01',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666005',
      equipment_code: 'TB-CNTT-00005',
      name: 'Máy vi tính để bàn Dell OptiPlex 7090',
      category_id: '55555555-5555-5555-5555-555555555501',
      category_name: 'Máy vi tính & Máy chủ',
      model: 'OptiPlex 7090 MT',
      serial_number: 'SN-DELL-7090-05',
      manufacturer: 'Dell Inc.',
      manufacturing_year: 2023,
      purchase_date: '2023-08-15',
      original_price: 18500000,
      current_room_id: '44444444-4444-4444-4444-444444444406',
      current_room_code: 'PM101',
      current_room_name: 'Phòng Máy tính Đồ họa PM101',
      building: 'Tòa B',
      condition: 'HONG_NHE',
      status: 'DANG_SUA_CHUA',
      warranty_expiry: '2026-08-15',
      note: 'Lỗi nguồn không lên đèn LED',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666010',
      equipment_code: 'TB-CNTT-00010',
      name: 'Máy chủ Rack Server Dell PowerEdge R750',
      category_id: '55555555-5555-5555-5555-555555555501',
      category_name: 'Máy vi tính & Máy chủ',
      model: 'PowerEdge R750',
      serial_number: 'SN-DELL-R750-01',
      manufacturer: 'Dell Inc.',
      manufacturing_year: 2023,
      purchase_date: '2023-11-01',
      original_price: 125000000,
      current_room_id: '44444444-4444-4444-4444-444444444408',
      current_room_code: 'PM201',
      current_room_name: 'Phòng Lab An toàn Mạng PM201',
      building: 'Tòa B',
      condition: 'TOT',
      status: 'DANG_SU_DUNG',
      warranty_expiry: '2028-11-01',
      note: 'Server ảo hóa phục vụ lab PM201',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666015',
      equipment_code: 'TB-CNTT-00015',
      name: 'Máy tính để bàn cũ CMS Polaris',
      category_id: '55555555-5555-5555-5555-555555555501',
      category_name: 'Máy vi tính & Máy chủ',
      model: 'Polaris P7',
      serial_number: 'SN-CMS-00129',
      manufacturer: 'CMS Corp',
      manufacturing_year: 2017,
      purchase_date: '2017-06-10',
      original_price: 8500000,
      current_room_id: '44444444-4444-4444-4444-444444444420',
      current_room_code: 'KTB01',
      current_room_name: 'Kho Thanh lý & Chờ sửa chữa',
      building: 'Tòa B',
      condition: 'KHONG_SU_DUNG_DUOC',
      status: 'THANH_LY',
      warranty_expiry: '2020-06-10',
      note: 'Đã lập biên bản thanh lý tài sản',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666016',
      equipment_code: 'TB-MANG-00016',
      name: 'Switch Cisco Catalyst 2960X 48 Port',
      category_id: '55555555-5555-5555-5555-555555555502',
      category_name: 'Thiết bị Mạng & Viễn thông',
      model: 'WS-C2960X-48TD-L',
      serial_number: 'SN-CSCO-2960-01',
      manufacturer: 'Cisco Systems',
      manufacturing_year: 2022,
      purchase_date: '2022-04-12',
      original_price: 28000000,
      current_room_id: '44444444-4444-4444-4444-444444444408',
      current_room_code: 'PM201',
      current_room_name: 'Phòng Lab An toàn Mạng PM201',
      building: 'Tòa B',
      condition: 'TOT',
      status: 'DANG_SU_DUNG',
      warranty_expiry: '2025-04-12',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666025',
      equipment_code: 'TB-MANG-00025',
      name: 'Bộ phát Wi-Fi di động 4G TP-Link M7350',
      category_id: '55555555-5555-5555-5555-555555555502',
      category_name: 'Thiết bị Mạng & Viễn thông',
      model: 'M7350',
      serial_number: 'SN-TPL-7350-01',
      manufacturer: 'TP-Link',
      manufacturing_year: 2023,
      purchase_date: '2023-04-10',
      original_price: 1350000,
      current_room_id: '44444444-4444-4444-4444-444444444405',
      current_room_code: 'B101',
      current_room_name: 'Kho Thiết bị Trung tâm',
      building: 'Tòa B',
      condition: 'HONG_NANG',
      status: 'MAT',
      warranty_expiry: '2025-04-10',
      note: 'Thất lạc sau đợt khảo sát thực tế',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666026',
      equipment_code: 'TB-CHIEU-00026',
      name: 'Máy chiếu Sony VPL-EX455',
      category_id: '55555555-5555-5555-5555-555555555503',
      category_name: 'Máy chiếu & Thiết bị Hiển thị',
      model: 'VPL-EX455',
      serial_number: 'SN-SNY-455-01',
      manufacturer: 'Sony Corp',
      manufacturing_year: 2022,
      purchase_date: '2022-08-10',
      original_price: 17800000,
      current_room_id: '44444444-4444-4444-4444-444444444401',
      current_room_code: 'A101',
      current_room_name: 'Phòng Lý thuyết A101',
      building: 'Tòa A',
      condition: 'TOT',
      status: 'DANG_SU_DUNG',
      warranty_expiry: '2025-08-10',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666031',
      equipment_code: 'TB-DOLUONG-00031',
      name: 'Dao động ký số Tektronix TBS1102B',
      category_id: '55555555-5555-5555-5555-555555555504',
      category_name: 'Thiết bị Đo lường & Thí nghiệm',
      model: 'TBS1102B (100MHz)',
      serial_number: 'SN-TEK-1102-01',
      manufacturer: 'Tektronix',
      manufacturing_year: 2023,
      purchase_date: '2023-04-18',
      original_price: 16500000,
      current_room_id: '44444444-4444-4444-4444-444444444412',
      current_room_code: 'C201',
      current_room_name: 'Phòng TH Điện tử Cơ bản C201',
      building: 'Tòa C',
      condition: 'TOT',
      status: 'DANG_SU_DUNG',
      warranty_expiry: '2026-04-18',
      is_active: true
    },
    {
      id: '66666666-6666-6666-6666-666666666041',
      equipment_code: 'TB-COKHI-00041',
      name: 'Máy tiện vạn năng Winho S430x1000',
      category_id: '55555555-5555-5555-5555-555555555505',
      category_name: 'Máy gia công Cơ khí & Động lực',
      model: 'S430x1000',
      serial_number: 'SN-WIN-430-01',
      manufacturer: 'Winho Machinery',
      manufacturing_year: 2021,
      purchase_date: '2021-12-05',
      original_price: 165000000,
      current_room_id: '44444444-4444-4444-4444-444444444416',
      current_room_code: 'X101',
      current_room_name: 'Xưởng Gia công CNC X101',
      building: 'Khu Xưởng',
      condition: 'TOT',
      status: 'DANG_SU_DUNG',
      warranty_expiry: '2026-12-05',
      is_active: true
    }
  ];

  // Sinh đủ 100 thiết bị
  for (let i = 11; i <= 100; i++) {
    const padded = String(i).padStart(3, '0');
    const id = `66666666-6666-6666-6666-666666666${padded}`;
    if (list.some(e => e.id === id)) continue;

    let catId = '55555555-5555-5555-5555-555555555501';
    let catName = 'Máy vi tính & Máy chủ';
    let codePrefix = 'TB-CNTT';
    let roomId = '44444444-4444-4444-4444-444444444407';
    let roomCode = 'PM102';
    let roomName = 'Phòng Máy tính Lập trình PM102';
    let building = 'Tòa B';
    let condition: any = 'TOT';
    let status: any = 'DANG_SU_DUNG';
    let price = 15000000;

    if (i > 15 && i <= 25) {
      catId = '55555555-5555-5555-5555-555555555502';
      catName = 'Thiết bị Mạng & Viễn thông';
      codePrefix = 'TB-MANG';
      roomId = '44444444-4444-4444-4444-444444444408';
      roomCode = 'PM201';
      roomName = 'Phòng Lab An toàn Mạng PM201';
      price = 22000000;
    } else if (i > 25 && i <= 35) {
      catId = '55555555-5555-5555-5555-555555555503';
      catName = 'Máy chiếu & Thiết bị Hiển thị';
      codePrefix = 'TB-CHIEU';
      roomId = '44444444-4444-4444-4444-444444444402';
      roomCode = 'A102';
      roomName = 'Phòng Lý thuyết A102';
      building = 'Tòa A';
      price = 19500000;
    } else if (i > 35 && i <= 50) {
      catId = '55555555-5555-5555-5555-555555555504';
      catName = 'Thiết bị Đo lường & Thí nghiệm';
      codePrefix = 'TB-DOLUONG';
      roomId = '44444444-4444-4444-4444-444444444410';
      roomCode = 'C101';
      roomName = 'Phòng Thí nghiệm Vật lý C101';
      building = 'Tòa C';
      price = 14000000;
    } else if (i > 50 && i <= 65) {
      catId = '55555555-5555-5555-5555-555555555505';
      catName = 'Máy gia công Cơ khí & Động lực';
      codePrefix = 'TB-COKHI';
      roomId = '44444444-4444-4444-4444-444444444418';
      roomCode = 'X201';
      roomName = 'Xưởng Động cơ Ô tô X201';
      building = 'Khu Xưởng';
      price = 75000000;
    } else if (i > 65 && i <= 75) {
      catId = '55555555-5555-5555-5555-555555555506';
      catName = 'Thiết bị Âm thanh Giảng đường';
      codePrefix = 'TB-AMTHANH';
      roomId = '44444444-4444-4444-4444-444444444401';
      roomCode = 'A101';
      roomName = 'Phòng Lý thuyết A101';
      building = 'Tòa A';
      price = 7800000;
    } else if (i > 75 && i <= 85) {
      catId = '55555555-5555-5555-5555-555555555508';
      catName = 'Máy in & Thiết bị Sao chụp';
      codePrefix = 'TB-IN';
      roomId = '44444444-4444-4444-4444-444444444404';
      roomCode = 'A202';
      roomName = 'Phòng Mô phỏng Doanh nghiệp A202';
      building = 'Tòa A';
      price = 12000000;
    } else if (i > 85 && i <= 95) {
      catId = '55555555-5555-5555-5555-555555555507';
      catName = 'Thiết bị Văn phòng & Khác';
      codePrefix = 'TB-VP';
      roomId = '44444444-4444-4444-4444-444444444406';
      roomCode = 'PM101';
      roomName = 'Phòng Máy tính Đồ họa PM101';
      building = 'Tòa B';
      price = 22000000;
    } else {
      catId = '55555555-5555-5555-5555-555555555510';
      catName = 'Thiết bị An toàn & PCCC';
      codePrefix = 'TB-PCCC';
      roomId = '44444444-4444-4444-4444-444444444417';
      roomCode = 'X102';
      roomName = 'Xưởng Hàn & Cắt gọt X102';
      building = 'Khu Xưởng';
      price = 1500000;
    }

    if (i === 45) {
      condition = 'CAN_THEO_DOI';
    } else if (i === 60) {
      condition = 'HONG_NHE';
      status = 'DANG_SUA_CHUA';
    } else if (i === 80) {
      status = 'TRONG_KHO';
      roomId = '44444444-4444-4444-4444-444444444405';
      roomCode = 'B101';
      roomName = 'Kho Thiết bị Trung tâm';
    }

    list.push({
      id,
      equipment_code: `${codePrefix}-${String(i).padStart(5, '0')}`,
      name: `${catName} chuẩn đào tạo số ${i}`,
      category_id: catId,
      category_name: catName,
      model: `Model-STD-${i}`,
      serial_number: `SN-${codePrefix}-${padded}`,
      manufacturer: 'Chính hãng',
      manufacturing_year: 2023,
      purchase_date: '2023-05-10',
      entry_date: '2023-05-15',
      original_price: price,
      funding_source: 'Ngân sách trường',
      current_room_id: roomId,
      current_room_code: roomCode,
      current_room_name: roomName,
      building,
      condition,
      status,
      warranty_expiry: '2026-05-10',
      is_active: true
    });
  }

  return list;
}

export const initialEquipment: Equipment[] = generateInitialEquipment();

export const initialTransfers: EquipmentTransfer[] = [
  {
    id: '77777777-7777-7777-7777-777777777001',
    equipment_id: '66666666-6666-6666-6666-666666666001',
    equipment_code: 'TB-CNTT-00001',
    equipment_name: 'Máy vi tính để bàn Dell OptiPlex 7090',
    from_room_id: '44444444-4444-4444-4444-444444444405',
    from_room_code: 'B101',
    from_room_name: 'Kho Thiết bị Trung tâm',
    to_room_id: '44444444-4444-4444-4444-444444444406',
    to_room_code: 'PM101',
    to_room_name: 'Phòng Máy tính Đồ họa PM101',
    transferred_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    transfer_date: '2024-01-10T09:00:00Z',
    reason: 'Cấp phát máy trạm cho phòng máy PM101'
  },
  {
    id: '77777777-7777-7777-7777-777777777002',
    equipment_id: '66666666-6666-6666-6666-666666666002',
    equipment_code: 'TB-CNTT-00002',
    equipment_name: 'Máy vi tính để bàn Dell OptiPlex 7090',
    from_room_id: '44444444-4444-4444-4444-444444444405',
    from_room_code: 'B101',
    from_room_name: 'Kho Thiết bị Trung tâm',
    to_room_id: '44444444-4444-4444-4444-444444444406',
    to_room_code: 'PM101',
    to_room_name: 'Phòng Máy tính Đồ họa PM101',
    transferred_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    transfer_date: '2024-01-12T14:30:00Z',
    reason: 'Bố trí thêm máy thực hành đồ họa'
  },
  {
    id: '77777777-7777-7777-7777-777777777003',
    equipment_id: '66666666-6666-6666-6666-666666666026',
    equipment_code: 'TB-CHIEU-00026',
    equipment_name: 'Máy chiếu Sony VPL-EX455',
    from_room_id: '44444444-4444-4444-4444-444444444405',
    from_room_code: 'B101',
    from_room_name: 'Kho Thiết bị Trung tâm',
    to_room_id: '44444444-4444-4444-4444-444444444401',
    to_room_code: 'A101',
    to_room_name: 'Phòng Lý thuyết A101',
    transferred_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    transfer_date: '2024-02-01T10:00:00Z',
    reason: 'Trang bị máy chiếu phục vụ giảng đường lớn A101'
  },
  {
    id: '77777777-7777-7777-7777-777777777004',
    equipment_id: '66666666-6666-6666-6666-666666666031',
    equipment_code: 'TB-DOLUONG-00031',
    equipment_name: 'Dao động ký số Tektronix TBS1102B',
    from_room_id: '44444444-4444-4444-4444-444444444405',
    from_room_code: 'B101',
    from_room_name: 'Kho Thiết bị Trung tâm',
    to_room_id: '44444444-4444-4444-4444-444444444412',
    to_room_code: 'C201',
    to_room_name: 'Phòng TH Điện tử Cơ bản C201',
    transferred_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    transfer_date: '2024-02-15T08:45:00Z',
    reason: 'Cấp phát thiết bị đo kiểm cho Khoa Điện'
  },
  {
    id: '77777777-7777-7777-7777-777777777005',
    equipment_id: '66666666-6666-6666-6666-666666666041',
    equipment_code: 'TB-COKHI-00041',
    equipment_name: 'Máy tiện vạn năng Winho S430x1000',
    from_room_id: '44444444-4444-4444-4444-444444444415',
    from_room_code: 'XK01',
    from_room_name: 'Kho Vật tư Cơ khí',
    to_room_id: '44444444-4444-4444-4444-444444444416',
    to_room_code: 'X101',
    to_room_name: 'Xưởng Gia công CNC X101',
    transferred_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    transfer_date: '2024-03-01T14:10:00Z',
    reason: 'Lắp đặt bàn giao máy tiện cho xưởng gia công'
  }
];

export const initialDamageReports: DamageReport[] = [
  {
    id: '88888888-8888-8888-8888-888888888001',
    report_code: 'BH-2024-0001',
    equipment_id: '66666666-6666-6666-6666-666666666005',
    equipment_code: 'TB-CNTT-00005',
    equipment_name: 'Máy vi tính để bàn Dell OptiPlex 7090',
    room_id: '44444444-4444-4444-4444-444444444406',
    room_code: 'PM101',
    room_name: 'Phòng Máy tính Đồ họa PM101',
    reported_by_name: 'ThS. Vũ Hải Minh (Giảng viên)',
    reported_at: '2024-03-01T08:30:00Z',
    issue_description: 'Máy tính bật nguồn không lên, có mùi khét nhẹ ở bộ nguồn case',
    severity: 'CAO',
    status: 'DANG_XU_LY',
    note: 'Đã tháo nguồn kiểm tra chập tụ'
  },
  {
    id: '88888888-8888-8888-8888-888888888002',
    report_code: 'BH-2024-0002',
    equipment_id: '66666666-6666-6666-6666-666666666026',
    equipment_code: 'TB-CHIEU-00026',
    equipment_name: 'Máy chiếu Sony VPL-EX455',
    room_id: '44444444-4444-4444-4444-444444444401',
    room_code: 'A101',
    room_name: 'Phòng Lý thuyết A101',
    reported_by_name: 'ThS. Vũ Hải Minh (Giảng viên)',
    reported_at: '2024-03-05T10:15:00Z',
    issue_description: 'Hình ảnh trình chiếu bị sọc mờ nhạt, quạt tản nhiệt máy kêu to',
    severity: 'TRUNG_BINH',
    status: 'DA_TIEP_NHAN',
    note: 'Cần vệ sinh lăng kính và kiểm tra bóng đèn chiếu'
  },
  {
    id: '88888888-8888-8888-8888-888888888003',
    report_code: 'BH-2024-0003',
    equipment_id: '66666666-6666-6666-6666-666666666010',
    equipment_code: 'TB-CNTT-00010',
    equipment_name: 'Máy chủ Rack Server Dell PowerEdge R750',
    room_id: '44444444-4444-4444-4444-444444444408',
    room_code: 'PM201',
    room_name: 'Phòng Lab An toàn Mạng PM201',
    reported_by_name: 'TS. Lê Đức Thắng (Trưởng BM CNTT)',
    reported_at: '2024-03-12T16:00:00Z',
    issue_description: 'Khay ổ cứng SAS số 2 báo đèn cam cảnh báo lỗi phần cứng RAID',
    severity: 'KHAN_CAP',
    status: 'DANG_XU_LY',
    note: 'Đã sao lưu dữ liệu khẩn cấp'
  }
];

export const initialMaintenanceRecords: MaintenanceRecord[] = [
  {
    id: '99999999-9999-9999-9999-999999999001',
    maintenance_code: 'SC-2024-0001',
    equipment_id: '66666666-6666-6666-6666-666666666005',
    equipment_code: 'TB-CNTT-00005',
    equipment_name: 'Máy vi tính để bàn Dell OptiPlex 7090',
    damage_report_id: '88888888-8888-8888-8888-888888888001',
    damage_report_code: 'BH-2024-0001',
    received_date: '2024-03-02',
    completion_date: '2024-03-04',
    service_provider: 'Trung tâm Bảo hành Dell Việt Nam',
    repair_details: 'Thay thế bộ nguồn 260W 80 Plus chính hãng và vệ sinh bo mạch',
    replaced_components: 'Nguồn Dell Optiplex 260W',
    cost: 1200000,
    result: 'THANH_CONG',
    warranty_until: '2025-03-04',
    recorded_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)'
  },
  {
    id: '99999999-9999-9999-9999-999999999002',
    maintenance_code: 'SC-2024-0002',
    equipment_id: '66666666-6666-6666-6666-666666666016',
    equipment_code: 'TB-MANG-00016',
    equipment_name: 'Switch Cisco Catalyst 2960X 48 Port',
    received_date: '2024-02-10',
    completion_date: '2024-02-11',
    service_provider: 'Tổ Bảo trì Thiết bị Nhà trường',
    repair_details: 'Bảo dưỡng định kỳ 6 tháng: thổi bụi, tra keo tản nhiệt chip chuyển mạch',
    replaced_components: 'Keo tản nhiệt Arctic MX-4',
    cost: 250000,
    result: 'THANH_CONG',
    warranty_until: '2024-08-11',
    recorded_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)'
  }
];

export const initialInventorySessions: InventorySession[] = [
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    session_code: 'KK-2025-HK2',
    title: 'Kiểm kê Tài sản & Thiết bị Cuối Học kỳ 2 Năm học 2024 - 2025',
    start_date: '2025-06-15',
    end_date: '2025-06-30',
    created_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    status: 'HOAN_THANH',
    scope_description: 'Toàn bộ các phòng máy tính, phòng thực hành và kho thiết bị thuộc Tòa B và Tòa C',
    total_expected: 40,
    total_actual: 39,
    total_match: 37,
    total_missing: 1,
    total_misplaced: 1,
    total_damaged: 1
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    session_code: 'KK-2026-HK1',
    title: 'Kiểm kê Thiết bị Đào tạo Đầu Năm học 2025 - 2026',
    start_date: '2026-03-01',
    end_date: '2026-03-25',
    created_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)',
    status: 'DANG_DIEN_RA',
    scope_description: 'Tất cả các phòng học lý thuyết Tòa A và các xưởng thực hành Cơ khí - Ô tô',
    total_expected: 60,
    total_actual: 58,
    total_match: 55,
    total_missing: 0,
    total_misplaced: 2,
    total_damaged: 3
  }
];

export const initialInventoryItems: InventoryItem[] = [
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    session_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    equipment_id: '66666666-6666-6666-6666-666666666001',
    equipment_code: 'TB-CNTT-00001',
    equipment_name: 'Máy vi tính để bàn Dell OptiPlex 7090',
    expected_room_id: '44444444-4444-4444-4444-444444444406',
    expected_room_code: 'PM101',
    actual_room_id: '44444444-4444-4444-4444-444444444406',
    actual_room_code: 'PM101',
    check_result: 'CO_THUC_TE',
    actual_condition: 'TOT',
    note: 'Đúng vị trí máy giáo viên',
    checked_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)'
  },
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    session_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    equipment_id: '66666666-6666-6666-6666-666666666025',
    equipment_code: 'TB-MANG-00025',
    equipment_name: 'Bộ phát Wi-Fi di động 4G TP-Link M7350',
    expected_room_id: '44444444-4444-4444-4444-444444444405',
    expected_room_code: 'B101',
    check_result: 'KHONG_CO',
    actual_condition: 'KHONG_SU_DUNG_DUOC',
    note: 'Thiếu hụt thực tế, phát hiện thất lạc',
    checked_by_name: 'Trần Thị Thu Thảo (QL Thiết bị)'
  }
];
