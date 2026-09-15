# HƯỚNG DẪN CẤU HÌNH DATABASE SUPABASE & CHẠY MIGRATION

Hệ thống quản lý thiết bị Trường Cao đẳng X sử dụng cơ sở dữ liệu **PostgreSQL** được lưu trữ trên nền tảng **Supabase**, tích hợp đầy đủ **Supabase Auth**, **Supabase Storage** và **Row Level Security (RLS)**.

---

## 1. Cấu trúc thư mục Database

```text
database/
├── migrations/
│   └── 001_initial_schema.sql    # Định nghĩa Enum, 13 bảng, indexes, triggers, hàm helper và chính sách RLS
├── seed/
│   └── 001_seed_data.sql          # 5 khoa, 20 phòng, 10 nhóm TB, 100 thiết bị, 10 điều chuyển, 10 báo hỏng, 10 sửa chữa, 2 kiểm kê, 4 tài khoản
└── README.md                      # Tài liệu này
```

---

## 2. Hướng dẫn chạy trên Supabase Dashboard (SQL Editor)

### Bước 1: Tạo dự án Supabase mới
1. Truy cập [https://supabase.com](https://supabase.com) và đăng nhập.
2. Tạo dự án mới: `equipment-management-college-x`.
3. Lưu lại các thông số môi trường tại mục **Project Settings > API**:
   - `Project URL` (dùng cho `VITE_SUPABASE_URL` và `SUPABASE_URL`)
   - `anon / public key` (dùng cho `VITE_SUPABASE_ANON_KEY`)
   - `service_role secret` (dùng cho `SUPABASE_SERVICE_ROLE_KEY` ở backend Node.js)

### Bước 2: Chạy Migration khởi tạo Schema
1. Mở menu **SQL Editor** trong giao diện Supabase.
2. Mở file `database/migrations/001_initial_schema.sql`, sao chép toàn bộ nội dung và dán vào SQL Editor.
3. Nhấn nút **RUN** (Ctrl + Enter).
4. Xác nhận kết quả: Hệ thống sẽ tạo thành công:
   - 7 Custom Enums (`room_type_enum`, `equipment_condition_enum`, `equipment_status_enum`, `inventory_result_enum`, `report_severity_enum`, `report_status_enum`, `maintenance_result_enum`)
   - 13 Bảng với đầy đủ Foreign Keys và Constraints
   - Các chỉ mục tối ưu tìm kiếm (`indexes`)
   - Triggers tự động cập nhật `updated_at`
   - Bật Row Level Security (RLS) và gán các chính sách phân quyền cho từng bảng.

### Bước 3: Tạo 4 Tài khoản Demo trên Supabase Authentication
Trước khi chạy file Seed, bạn cần tạo 4 tài khoản trong mục **Authentication > Users > Add user**:

| Email | Mật khẩu mẫu | Vai trò dự kiến | User UID (tùy chọn gán) |
| :--- | :--- | :--- | :--- |
| `admin@caodangx.edu.vn` | `Admin@123456` | ADMIN | `33333333-3333-3333-3333-333333333301` |
| `quanlytb@caodangx.edu.vn` | `Quanly@123456` | EQUIPMENT_MANAGER | `33333333-3333-3333-3333-333333333302` |
| `truongbomon@caodangx.edu.vn` | `Bomon@123456` | DEPARTMENT_HEAD | `33333333-3333-3333-3333-333333333303` |
| `giangvien@caodangx.edu.vn` | `Giangvien@123456` | TEACHER | `33333333-3333-3333-3333-333333333304` |

*(Lưu ý: Nếu tạo trên giao diện Supabase sinh ra UID ngẫu nhiên, bạn chỉ cần cập nhật lại trường `id` trong bảng `profiles` tương ứng với UID vừa tạo).*

### Bước 4: Chạy Seed Data mẫu
1. Trong **SQL Editor**, dán toàn bộ nội dung file `database/seed/001_seed_data.sql`.
2. Nhấn nút **RUN**.
3. Dữ liệu sẽ nạp:
   - 4 Vai trò hệ thống (`ADMIN`, `EQUIPMENT_MANAGER`, `DEPARTMENT_HEAD`, `TEACHER`)
   - 5 Khoa / Bộ môn
   - 20 Phòng học / Phòng máy / Xưởng / Kho thiết bị
   - 10 Nhóm thiết bị tiêu chuẩn
   - 100 Thiết bị đào tạo thực tế
   - 10 Bản ghi lịch sử điều chuyển thiết bị
   - 10 Phiếu báo hỏng thiết bị
   - 10 Hồ sơ sửa chữa và bảo trì kèm chi phí thực tế
   - 2 Đợt kiểm kê tài sản (1 đã hoàn thành, 1 đang diễn ra)
   - Nhật ký kiểm toán `audit_logs` mẫu

---

## 3. Cấu hình Supabase Storage cho Tải ảnh Thiết bị & Báo hỏng

1. Mở menu **Storage** trên Supabase Dashboard.
2. Nhấn **New bucket**:
   - Tên bucket: `equipment-images`
   - Bật tùy chọn: `Public bucket` (để hiển thị ảnh thiết bị trên web)
3. Tạo bucket thứ hai cho ảnh hiện trường sự cố:
   - Tên bucket: `damage-reports`
   - Bật tùy chọn: `Public bucket`
4. Cấu hình Storage Policies (RLS) cho phép authenticated users upload và public read.

---

## 4. Kiểm tra Toàn vẹn Dữ liệu (Verification Queries)

Bạn có thể chạy câu lệnh sau trong SQL Editor để kiểm tra số liệu sau khi nạp:

```sql
SELECT 
    (SELECT COUNT(*) FROM departments) AS total_departments,
    (SELECT COUNT(*) FROM rooms) AS total_rooms,
    (SELECT COUNT(*) FROM equipment_categories) AS total_categories,
    (SELECT COUNT(*) FROM equipment) AS total_equipment,
    (SELECT COUNT(*) FROM equipment_transfers) AS total_transfers,
    (SELECT COUNT(*) FROM damage_reports) AS total_damage_reports,
    (SELECT COUNT(*) FROM maintenance_records) AS total_maintenance,
    (SELECT COUNT(*) FROM inventory_sessions) AS total_inventory_sessions;
```

Kết quả mong đợi:
- `total_departments`: 5
- `total_rooms`: 20
- `total_categories`: 10
- `total_equipment`: 100
- `total_transfers`: 10
- `total_damage_reports`: 10
- `total_maintenance`: 10
- `total_inventory_sessions`: 2
