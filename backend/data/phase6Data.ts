// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// PHASE 6 SEED DATA: VENDORS, LIQUIDATIONS, SCHEDULES & NOTIFICATIONS
// ==============================================================================
import {
  Vendor,
  LiquidationRecord,
  MaintenanceSchedule,
  AppNotification
} from '../../src/types/index.ts';

export const initialVendors: Vendor[] = [
  {
    id: 'vendor-uuid-0001',
    code: 'NCC-FPT',
    name: 'Công ty Cổ phần Hệ thống Thông tin FPT (FPT IS)',
    tax_code: '0101778163',
    contact_person: 'Nguyễn Văn Quang (GĐ Khối Giáo dục)',
    phone: '0912 345 678',
    email: 'quangnv@fpt.com.vn',
    address: 'Tòa nhà FPT, Phố Duy Tân, Cầu Giấy, Hà Nội',
    rating: 5.0,
    equipment_count: 42,
    active_contracts: 3,
    is_active: true,
    notes: 'Đối tác cung cấp hệ thống máy vi tính Dell và mạng LAN phòng máy',
    created_at: '2023-01-15T08:00:00.000Z'
  },
  {
    id: 'vendor-uuid-0002',
    code: 'NCC-DELL',
    name: 'Công ty TNHH Dell Global B.V. Việt Nam',
    tax_code: '0304678129',
    contact_person: 'Phan Minh Tuấn (Phụ trách Kênh Doanh nghiệp)',
    phone: '0908 889 990',
    email: 'prosupport_vietnam@dell.com',
    address: 'Tầng 26, Tòa nhà Bitexco, Q1, TP. Hồ Chí Minh',
    rating: 4.8,
    equipment_count: 35,
    active_contracts: 4,
    is_active: true,
    notes: 'Bảo hành tận nơi chính hãng 3 năm (ProSupport)',
    created_at: '2023-03-20T08:00:00.000Z'
  },
  {
    id: 'vendor-uuid-0003',
    code: 'NCC-PANASONIC',
    name: 'Công ty TNHH Panasonic Việt Nam',
    tax_code: '0101416738',
    contact_person: 'Lê Thị Thu Hương (Chăm sóc đại lý)',
    phone: '1800 1593',
    email: 'support_av@vn.panasonic.com',
    address: 'Lô J1-J2, KCN Thăng Long, Đông Anh, Hà Nội',
    rating: 4.7,
    equipment_count: 18,
    active_contracts: 2,
    is_active: true,
    notes: 'Cung cấp máy chiếu hội trường, màn hình tương tác thông minh',
    created_at: '2023-06-10T08:00:00.000Z'
  },
  {
    id: 'vendor-uuid-0004',
    code: 'NCC-JASIC',
    name: 'Tập đoàn Cơ khí & Thiết bị Hàn Jasic Việt Nam',
    tax_code: '0105342119',
    contact_person: 'Trương Quốc Bảo (Trưởng phòng Kỹ thuật)',
    phone: '024 3782 1234',
    email: 'service@jasic.com.vn',
    address: 'KCN Sài Đồng B, Long Biên, Hà Nội',
    rating: 4.6,
    equipment_count: 15,
    active_contracts: 2,
    is_active: true,
    notes: 'Cung ứng và bảo dưỡng máy hàn TIG/MIG, máy cắt plasma xưởng cơ khí',
    created_at: '2023-08-01T08:00:00.000Z'
  },
  {
    id: 'vendor-uuid-0005',
    code: 'NCC-DAIKIN',
    name: 'Công ty Cổ phần Daikin Air Conditioning Vietnam',
    tax_code: '0301493437',
    contact_person: 'Hoàng Đình Đức (Kỹ sư Dịch vụ HVAC)',
    phone: '1800 6777',
    email: 'hvac_service@daikin.com.vn',
    address: 'Tòa nhà Discovery Complex, Cầu Giấy, Hà Nội',
    rating: 4.9,
    equipment_count: 24,
    active_contracts: 3,
    is_active: true,
    notes: 'Hợp đồng bảo trì định kỳ hệ thống điều hòa biến tần các phòng máy',
    created_at: '2023-11-12T08:00:00.000Z'
  }
];

export const initialLiquidations: LiquidationRecord[] = [
  {
    id: 'liq-uuid-0001',
    decision_number: 'QĐ-42/QĐ-CĐX',
    title: 'Quyết định thanh lý tài sản hư hỏng, hết niên hạn sử dụng Đợt 2/2025',
    decision_date: '2025-11-20',
    council_leader: 'TS. Lê Văn Tuấn (Chủ tịch Hội đồng - Hiệu trưởng)',
    council_members: [
      'ThS. Trần Thị Thu Thảo (Phó Chủ tịch - Trưởng phòng Quản trị TB)',
      'ThS. Nguyễn Hoàng Long (Ủy viên - Trưởng phòng Kế hoạch Tài chính)',
      'KS. Phạm Đức Huy (Ủy viên - Ban Thanh tra Nhân dân)'
    ],
    method: 'DAU_GIA',
    total_original_price: 185000000,
    recovered_value: 32500000,
    equipment_count: 5,
    equipment_items: [
      {
        equipment_id: 'eq-old-01',
        equipment_code: 'TB-CNTT-00088',
        name: 'Máy tính để bàn HP Compaq Pro 6300 (Thế hệ cũ)',
        original_price: 35000000,
        remaining_value: 0,
        condition: 'KHONG_SU_DUNG_DUOC',
        reason: 'Mainboard và nguồn bị chập cháy, chip Core 2 Duo lỗi thời'
      },
      {
        equipment_id: 'eq-old-02',
        equipment_code: 'TB-CNTT-00089',
        name: 'Máy in Laser Canon LBP 2900 (Đã sử dụng 10 năm)',
        original_price: 15000000,
        remaining_value: 0,
        condition: 'KHONG_SU_DUNG_DUOC',
        reason: 'Hỏng cụm sấy và bánh răng truyền động, chi phí thay thế vượt giá trị'
      },
      {
        equipment_id: 'eq-old-03',
        equipment_code: 'TB-DDT-00076',
        name: 'Máy hàn thiếc Weller WES51 analog',
        original_price: 25000000,
        remaining_value: 0,
        condition: 'KHONG_SU_DUNG_DUOC',
        reason: 'Cháy biến áp điều nhiệt, vỏ nứt vỡ không đảm bảo an toàn điện'
      },
      {
        equipment_id: 'eq-old-04',
        equipment_code: 'TB-CK-00054',
        name: 'Máy cưa sắt bàn mini Hitachi CC14ST',
        original_price: 45000000,
        remaining_value: 2000000,
        condition: 'KHONG_SU_DUNG_DUOC',
        reason: 'Rơ bạc đạn cốt máy, mâm kẹp biến dạng gây rung lắc nguy hiểm'
      },
      {
        equipment_id: 'eq-old-05',
        equipment_code: 'TB-CNTT-00095',
        name: 'Máy chiếu Sony VPL-DX100 (Bóng đèn đã nổ)',
        original_price: 65000000,
        remaining_value: 0,
        condition: 'KHONG_SU_DUNG_DUOC',
        reason: 'Lăng kính LCD ố vàng loang lổ, bóng chiếu hết giờ hoạt động'
      }
    ],
    status: 'HOAN_TAT',
    signed_by: 'TS. Lê Văn Tuấn',
    note: 'Đã hoàn tất bán đấu giá công khai, nộp tiền mặt vào tài khoản kho bạc trường',
    created_at: '2025-11-20T09:00:00.000Z'
  },
  {
    id: 'liq-uuid-0002',
    decision_number: 'QĐ-18/QĐ-CĐX',
    title: 'Đề xuất lập Hội đồng thanh lý tài sản không thể phục hồi Đợt 1/2026',
    decision_date: '2026-03-10',
    council_leader: 'TS. Lê Văn Tuấn (Hiệu trưởng)',
    council_members: [
      'ThS. Trần Thị Thu Thảo (Trưởng phòng QLTB)',
      'ThS. Nguyễn Hoàng Long (Trưởng phòng KHTC)',
      'Trưởng các Khoa liên quan'
    ],
    method: 'TAN_DUNG_LINH_KIEN',
    total_original_price: 98000000,
    recovered_value: 12500000,
    equipment_count: 3,
    equipment_items: [
      {
        equipment_id: 'eq-old-11',
        equipment_code: 'TB-CK-00010',
        name: 'Máy hàn que điện tử Hồng Ký HK-200A',
        original_price: 28000000,
        remaining_value: 0,
        condition: 'KHONG_SU_DUNG_DUOC',
        reason: 'Hỏng bo mạch điều khiển công suất IGBT không có linh kiện thay thế'
      },
      {
        equipment_id: 'eq-old-12',
        equipment_code: 'TB-CNTT-00025',
        name: 'Switch mạng Cisco Catalyst 2960 24 Port',
        original_price: 32000000,
        remaining_value: 2500000,
        condition: 'KHONG_SU_DUNG_DUOC',
        reason: 'Cháy chập nguồn do sét đánh lan truyền, chết cổng 1-16'
      },
      {
        equipment_id: 'eq-old-13',
        equipment_code: 'TB-OTO-00015',
        name: 'Thiết bị sạc ắc quy lưu động 12V/24V',
        original_price: 38000000,
        remaining_value: 0,
        condition: 'KHONG_SU_DUNG_DUOC',
        reason: 'Chập cầu chì nhiệt bên trong, đứt cuộn dây thứ cấp'
      }
    ],
    status: 'CHO_DUYET',
    note: 'Đang trình Ban Giám hiệu ký duyệt quyết định thành lập hội đồng kiểm kê thực địa',
    created_at: '2026-03-10T14:30:00.000Z'
  }
];

export const initialMaintenanceSchedules: MaintenanceSchedule[] = [
  {
    id: 'maint-sched-001',
    title: 'Bảo dưỡng, vệ sinh hệ thống máy tính & tra keo tản nhiệt phòng PM101 - PM105',
    scope_type: 'CATEGORY',
    scope_name: 'Máy vi tính để bàn & Mạng nội bộ',
    frequency_months: 3,
    last_maintenance_date: '2025-12-15',
    next_scheduled_date: '2026-03-25',
    assigned_to_name: 'Trần Thị Thu Thảo & Tổ kỹ thuật CNTT',
    status: 'CHO_THUC_HIEN',
    notes: 'Ưu tiên kiểm tra quạt tản nhiệt CPU và ổ cứng SSD các máy dạy thiết kế đồ họa'
  },
  {
    id: 'maint-sched-002',
    title: 'Kiểm tra căn chỉnh ray trượt, thay dầu hộp số máy tiện CNC Xưởng Cơ khí X01',
    scope_type: 'ROOM',
    scope_name: 'Xưởng Cơ khí & Gia công CNC (X01)',
    frequency_months: 6,
    last_maintenance_date: '2025-10-01',
    next_scheduled_date: '2026-04-01',
    assigned_to_name: 'Kỹ thuật viên hãng Jasic & Thầy Lê Văn Nam',
    status: 'DANG_THUC_HIEN',
    notes: 'Phối hợp cùng kỹ sư ủy quyền từ nhà cung cấp máy'
  },
  {
    id: 'maint-sched-003',
    title: 'Vệ sinh phin lọc bụi, kiểm tra áp suất gas máy lạnh Tòa nhà Giảng đường A',
    scope_type: 'ALL',
    scope_name: 'Toàn bộ các phòng học lý thuyết & phòng máy Tòa A',
    frequency_months: 6,
    last_maintenance_date: '2025-09-20',
    next_scheduled_date: '2026-03-30',
    assigned_to_name: 'Công ty CP Daikin Air Conditioning Vietnam',
    status: 'CHO_THUC_HIEN',
    notes: 'Thực hiện vào cuối tuần để không gián đoạn lịch học của sinh viên'
  },
  {
    id: 'maint-sched-004',
    title: 'Đo kiểm điện trở đất, kiểm định an toàn thiết bị nâng hạ cầu nâng ô tô',
    scope_type: 'ROOM',
    scope_name: 'Xưởng Thực hành Ô tô (X02)',
    frequency_months: 12,
    last_maintenance_date: '2025-02-18',
    next_scheduled_date: '2026-02-28',
    assigned_to_name: 'Trung tâm Kiểm định Kỹ thuật An toàn Khu vực 1',
    status: 'DA_HOAN_THANH',
    notes: 'Đã dán tem kiểm định an toàn có hiệu lực đến 02/2027'
  }
];

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-001',
    title: 'Báo hỏng khẩn cấp cần tiếp nhận ngay',
    message: 'Thiết bị TB-CNTT-00001 tại PM101 gặp sự cố sập nguồn, đèn vàng nhấp nháy trong giờ dạy',
    type: 'DAMAGE_ALERT',
    severity: 'URGENT',
    target_type: 'DAMAGE_REPORT',
    target_id: '88888888-8888-8888-8888-888888888001',
    target_code: 'BH-2024-0001',
    is_read: false,
    created_at: '2026-03-15T08:30:00.000Z'
  },
  {
    id: 'notif-002',
    title: 'Cảnh báo bảo hành sắp hết hạn trong 30 ngày',
    message: 'Lô 10 máy vi tính Dell OptiPlex 7090 tại PM101 sắp hết hạn bảo hành ngày 20/04/2026',
    type: 'WARRANTY_EXPIRING',
    severity: 'HIGH',
    target_type: 'EQUIPMENT',
    target_id: '66666666-6666-6666-6666-666666666001',
    target_code: 'TB-CNTT-00001',
    is_read: false,
    created_at: '2026-03-14T09:00:00.000Z'
  },
  {
    id: 'notif-003',
    title: 'Đề xuất lập Hội đồng thanh lý tài sản công',
    message: 'Có 3 thiết bị tại Xưởng Cơ khí và Kho thiết bị không thể phục hồi, đủ điều kiện thanh lý',
    type: 'LIQUIDATION_SUGGESTION',
    severity: 'MEDIUM',
    target_type: 'EQUIPMENT',
    target_id: 'liq-uuid-0002',
    target_code: 'QĐ-18/QĐ-CĐX',
    is_read: false,
    created_at: '2026-03-13T14:15:00.000Z'
  },
  {
    id: 'notif-004',
    title: 'Lịch bảo dưỡng định kỳ Quý 1/2026 đến hạn',
    message: 'Kế hoạch bảo dưỡng hệ thống máy vi tính phòng PM101-PM105 cần bắt đầu trước ngày 25/03/2026',
    type: 'MAINTENANCE_DUE',
    severity: 'MEDIUM',
    target_type: 'MAINTENANCE',
    target_id: 'maint-sched-001',
    target_code: 'KH-BD-01',
    is_read: false,
    created_at: '2026-03-12T10:00:00.000Z'
  },
  {
    id: 'notif-005',
    title: 'Đợt kiểm kê tài sản KK-2026-HK1 đang diễn ra',
    message: 'Còn 3 phòng học chưa hoàn tất nhập liệu kết quả kiểm kê thực tế',
    type: 'INVENTORY_ALERT',
    severity: 'LOW',
    target_type: 'INVENTORY',
    target_id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01',
    target_code: 'KK-2026-HK1',
    is_read: true,
    created_at: '2026-03-10T08:00:00.000Z'
  }
];
