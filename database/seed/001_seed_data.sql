-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
-- SEED DATA 001: COMPREHENSIVE DEMO DATA
-- Scope: 5 Khoa, 20 Phòng, 10 Nhóm TB, 100 Thiết bị, 10 Điều chuyển,
--        10 Báo hỏng, 10 Sửa chữa, 2 Đợt kiểm kê, 4 Tài khoản demo
-- ==============================================================================

-- 1. CLEAN EXISTING DATA (Trong môi trường dev)
TRUNCATE TABLE audit_logs CASCADE;
TRUNCATE TABLE maintenance_records CASCADE;
TRUNCATE TABLE damage_reports CASCADE;
TRUNCATE TABLE inventory_items CASCADE;
TRUNCATE TABLE inventory_sessions CASCADE;
TRUNCATE TABLE equipment_transfers CASCADE;
TRUNCATE TABLE equipment CASCADE;
TRUNCATE TABLE equipment_categories CASCADE;
TRUNCATE TABLE rooms CASCADE;
TRUNCATE TABLE user_roles CASCADE;
TRUNCATE TABLE roles CASCADE;
TRUNCATE TABLE profiles CASCADE;
TRUNCATE TABLE departments CASCADE;

-- 2. ROLES (4 VAI TRÒ CHUẨN)
INSERT INTO roles (id, name, description) VALUES
('11111111-1111-1111-1111-111111111101', 'ADMIN', 'Quản trị viên toàn quyền hệ thống'),
('11111111-1111-1111-1111-111111111102', 'EQUIPMENT_MANAGER', 'Cán bộ Quản lý thiết bị và Cơ sở vật chất'),
('11111111-1111-1111-1111-111111111103', 'DEPARTMENT_HEAD', 'Trưởng khoa / Trưởng bộ môn phụ trách thiết bị'),
('11111111-1111-1111-1111-111111111104', 'TEACHER', 'Giảng viên, Cán bộ sử dụng phòng học và thiết bị');

-- 3. DEPARTMENTS (5 KHOA / BỘ MÔN)
INSERT INTO departments (id, code, name, description) VALUES
('22222222-2222-2222-2222-222222222201', 'KHOA-CNTT', 'Khoa Công nghệ Thông tin', 'Quản lý các phòng máy thực hành phần mềm, mạng máy tính và hệ thống IoT'),
('22222222-2222-2222-2222-222222222202', 'KHOA-CK', 'Khoa Cơ khí - Động lực', 'Quản lý xưởng cơ khí gia công, xưởng hàn và xưởng bảo dưỡng ô tô'),
('22222222-2222-2222-2222-222222222203', 'KHOA-DDT', 'Khoa Điện - Điện tử', 'Quản lý phòng thực hành vi mạch, điện công nghiệp và tự động hóa PLC'),
('22222222-2222-2222-2222-222222222204', 'KHOA-KTQT', 'Khoa Kinh tế & Quản trị', 'Quản lý các phòng học mô phỏng kế toán doanh nghiệp và logistics'),
('22222222-2222-2222-2222-222222222205', 'KHOA-KHCB', 'Khoa Khoa học Cơ bản', 'Quản lý các phòng thí nghiệm Lý, Hóa đại cương và khu giảng đường chung');

-- 4. PROFILES (4 TÀI KHOẢN DEMO)
-- Lưu ý: id tương ứng với user trong auth.users khi khởi tạo
INSERT INTO profiles (id, email, full_name, phone, department_id, is_active) VALUES
('33333333-3333-3333-3333-333333333301', 'admin@caodangx.edu.vn', 'Nguyễn Hoàng Long (Admin)', '0901234567', NULL, TRUE),
('33333333-3333-3333-3333-333333333302', 'quanlytb@caodangx.edu.vn', 'Trần Thị Thu Thảo (QL Thiết bị)', '0912345678', NULL, TRUE),
('33333333-3333-3333-3333-333333333303', 'truongbomon@caodangx.edu.vn', 'TS. Lê Đức Thắng (Trưởng BM CNTT)', '0923456789', '22222222-2222-2222-2222-222222222201', TRUE),
('33333333-3333-3333-3333-333333333304', 'giangvien@caodangx.edu.vn', 'ThS. Vũ Hải Minh (Giảng viên)', '0934567890', '22222222-2222-2222-2222-222222222201', TRUE);

-- GÁN ROLE CHO 4 TÀI KHOẢN DEMO
INSERT INTO user_roles (user_id, role_id) VALUES
('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101'), -- Admin
('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111102'), -- Quản lý TB
('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111103'), -- Trưởng bộ môn
('33333333-3333-3333-3333-333333333304', '11111111-1111-1111-1111-111111111104'); -- Giảng viên

-- 5. ROOMS (20 PHÒNG TRẢI DÀI CÁC TÒA NHÀ)
INSERT INTO rooms (id, code, name, room_type, building, floor, capacity, department_id, manager_id, status, note) VALUES
-- Khu Tòa A: Lý thuyết & Hội trường
('44444444-4444-4444-4444-444444444401', 'A101', 'Phòng Lý thuyết A101', 'LY_THUYET', 'Tòa A', 1, 60, '22222222-2222-2222-2222-222222222205', '33333333-3333-3333-3333-333333333304', 'HOAT_DONG', 'Giảng đường đa năng tầng 1'),
('44444444-4444-4444-4444-444444444402', 'A102', 'Phòng Lý thuyết A102', 'LY_THUYET', 'Tòa A', 1, 60, '22222222-2222-2222-2222-222222222205', NULL, 'HOAT_DONG', 'Phòng học thông minh có máy chiếu'),
('44444444-4444-4444-4444-444444444403', 'A201', 'Phòng Hội thảo Quốc tế A201', 'KHAC', 'Tòa A', 2, 120, '22222222-2222-2222-2222-222222222204', NULL, 'HOAT_DONG', 'Trang bị hệ thống âm thanh hội nghị'),
('44444444-4444-4444-4444-444444444404', 'A202', 'Phòng Mô phỏng Doanh nghiệp A202', 'THUC_HANH', 'Tòa A', 2, 45, '22222222-2222-2222-2222-222222222204', NULL, 'HOAT_DONG', 'Phòng thực hành kế toán ảo'),

-- Khu Tòa B: Công nghệ Thông tin & Phòng Máy tính
('44444444-4444-4444-4444-444444444405', 'B101', 'Kho Thiết bị Trung tâm', 'KHO', 'Tòa B', 1, 10, NULL, '33333333-3333-3333-3333-333333333302', 'HOAT_DONG', 'Kho tập kết máy tính, màn hình và linh kiện dự phòng'),
('44444444-4444-4444-4444-444444444406', 'PM101', 'Phòng Máy tính Đồ họa PM101', 'PHONG_MAY', 'Tòa B', 1, 40, '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333303', 'HOAT_DONG', 'Dàn PC cấu hình cao cho AI & Thiết kế'),
('44444444-4444-4444-4444-444444444407', 'PM102', 'Phòng Máy tính Lập trình PM102', 'PHONG_MAY', 'Tòa B', 1, 40, '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333304', 'HOAT_DONG', 'Phòng thực hành phần mềm cơ sở'),
('44444444-4444-4444-4444-444444444408', 'PM201', 'Phòng Lab An toàn Mạng PM201', 'PHONG_MAY', 'Tòa B', 2, 35, '22222222-2222-2222-2222-222222222201', '33333333-3333-3333-3333-333333333303', 'HOAT_DONG', 'Trang bị rack server và switch Cisco'),
('44444444-4444-4444-4444-444444444409', 'PM202', 'Phòng Máy tính Khảo thí PM202', 'PHONG_MAY', 'Tòa B', 2, 50, '22222222-2222-2222-2222-222222222201', NULL, 'BAO_TRI', 'Đang nâng cấp hệ thống dây mạng mạng LAN'),

-- Khu Tòa C: Điện - Điện tử & Khoa học Cơ bản
('44444444-4444-4444-4444-444444444410', 'C101', 'Phòng Thí nghiệm Vật lý C101', 'THI_NGHIEM', 'Tòa C', 1, 30, '22222222-2222-2222-2222-222222222205', NULL, 'HOAT_DONG', 'Bộ thí nghiệm cơ nhiệt quang đại cương'),
('44444444-4444-4444-4444-444444444411', 'C102', 'Phòng Thí nghiệm Hóa học C102', 'THI_NGHIEM', 'Tòa C', 1, 30, '22222222-2222-2222-2222-222222222205', NULL, 'HOAT_DONG', 'Có tủ hút khí độc và hệ thống cấp nước chuyên dụng'),
('44444444-4444-4444-4444-444444444412', 'C201', 'Phòng TH Điện tử Cơ bản C201', 'THUC_HANH', 'Tòa C', 2, 40, '22222222-2222-2222-2222-222222222203', NULL, 'HOAT_DONG', 'Dao động ký, máy phát sóng, nguồn DC'),
('44444444-4444-4444-4444-444444444413', 'C202', 'Phòng Lab Vi điều khiển & IoT C202', 'THUC_HANH', 'Tòa C', 2, 35, '22222222-2222-2222-2222-222222222203', NULL, 'HOAT_DONG', 'Các kit ARM, Arduino, ESP32 và cảm biến'),
('44444444-4444-4444-4444-444444444414', 'C301', 'Phòng TH Tự động hóa PLC C301', 'THUC_HANH', 'Tòa C', 3, 30, '22222222-2222-2222-2222-222222222203', NULL, 'HOAT_DONG', 'Bàn thực hành Siemens S7-1200'),

-- Khu Xưởng Thực hành Cơ khí & Ô tô
('44444444-4444-4444-4444-444444444415', 'XK01', 'Kho Vật tư Cơ khí', 'KHO', 'Khu Xưởng', 1, 10, '22222222-2222-2222-2222-222222222202', NULL, 'HOAT_DONG', 'Kho lưu trữ phôi, dầu nhớt và dao cụ'),
('44444444-4444-4444-4444-444444444416', 'X101', 'Xưởng Gia công CNC X101', 'XUONG', 'Khu Xưởng', 1, 30, '22222222-2222-2222-2222-222222222202', NULL, 'HOAT_DONG', 'Máy tiện CNC, máy phay CNC 3 trục'),
('44444444-4444-4444-4444-444444444417', 'X102', 'Xưởng Hàn & Cắt gọt X102', 'XUONG', 'Khu Xưởng', 1, 35, '22222222-2222-2222-2222-222222222202', NULL, 'HOAT_DONG', 'Máy hàn TIG, MIG, hàn hồ quang điện'),
('44444444-4444-4444-4444-444444444418', 'X201', 'Xưởng Động cơ Ô tô X201', 'XUONG', 'Khu Xưởng', 1, 40, '22222222-2222-2222-2222-222222222202', NULL, 'HOAT_DONG', 'Mô hình cắt bổ động cơ và cầu nâng 2 trụ'),
('44444444-4444-4444-4444-444444444419', 'X202', 'Xưởng Khung gầm & Điện Ô tô X202', 'XUONG', 'Khu Xưởng', 1, 35, '22222222-2222-2222-2222-222222222202', NULL, 'HOAT_DONG', 'Hệ thống chuẩn đoán lỗi OBD-II'),
('44444444-4444-4444-4444-444444444420', 'KTB01', 'Kho Thanh lý & Chờ sửa chữa', 'KHO', 'Tòa B', 1, 15, NULL, '33333333-3333-3333-3333-333333333302', 'HOAT_DONG', 'Khu vực lưu trữ thiết bị hỏng nặng chuẩn bị thủ tục');

-- 6. EQUIPMENT CATEGORIES (10 NHÓM THIẾT BỊ)
INSERT INTO equipment_categories (id, code, name, description) VALUES
('55555555-5555-5555-5555-555555555501', 'CAT-MAYTINH', 'Máy vi tính & Máy chủ', 'Máy tính để bàn, laptop, trạm làm việc workstation và server'),
('55555555-5555-5555-5555-555555555502', 'CAT-MANG', 'Thiết bị Mạng & Viễn thông', 'Router, switch mạng, access point Wi-Fi, tủ rack và firewall'),
('55555555-5555-5555-5555-555555555503', 'CAT-CHIEU', 'Máy chiếu & Thiết bị Hiển thị', 'Máy chiếu hội trường, màn chiếu điện, TV tương tác thông minh'),
('55555555-5555-5555-5555-555555555504', 'CAT-DOLUONG', 'Thiết bị Đo lường & Thí nghiệm', 'Dao động ký, máy đếm tần, đồng hồ vạn năng số, nguồn AC/DC'),
('55555555-5555-5555-5555-555555555505', 'CAT-COKHI', 'Máy gia công Cơ khí & Động lực', 'Máy tiện CNC, máy phay, máy hàn công nghiệp, cầu nâng ô tô'),
('55555555-5555-5555-5555-555555555506', 'CAT-AMTHANH', 'Thiết bị Âm thanh Giảng đường', 'Amply, mixer, micro không dây và loa trợ giảng'),
('55555555-5555-5555-5555-555555555507', 'CAT-VANPHONG', 'Thiết bị Văn phòng & Khác', 'Máy điều hòa nhiệt độ, máy hủy tài liệu, máy hút ẩm phòng lab'),
('55555555-5555-5555-5555-555555555508', 'CAT-MAYIN', 'Máy in & Thiết bị Sao chụp', 'Máy in laser đa năng, máy scan tài liệu chuyên dụng, máy in 3D'),
('55555555-5555-5555-5555-555555555509', 'CAT-TUDONGHOA', 'Kit Thực hành & Tự động hóa', 'Kit thực hành PLC Siemens, cánh tay robot giáo dục, kit IoT'),
('55555555-5555-5555-5555-555555555510', 'CAT-ANTOAN', 'Thiết bị An toàn & PCCC', 'Bình chữa cháy khí CO2, tủ cứu thương, hệ thống báo khói');

-- 7. EQUIPMENT (100 THIẾT BỊ MẪU CHI TIẾT)
-- Phân bố: Kho, PM101, PM102, C201, X101, A101, v.v.
-- Đủ các trạng thái: ĐANG_SU_DUNG (80), TRONG_KHO (12), DANG_SUA_CHUA (4), HONG/THANH_LY (3), MAT (1)
INSERT INTO equipment (
    id, equipment_code, name, category_id, model, serial_number,
    manufacturer, manufacturing_year, purchase_date, entry_date, original_price,
    funding_source, current_room_id, manager_id, condition, status, warranty_expiry, note
) VALUES
-- 1 - 25: Nhóm Máy tính & Workstation
('66666666-6666-6666-6666-666666666001', 'TB-CNTT-00001', 'Máy vi tính để bàn Dell OptiPlex 7090', '55555555-5555-5555-5555-555555555501', 'OptiPlex 7090 MT', 'SN-DELL-7090-01', 'Dell Inc.', 2023, '2023-08-15', '2023-08-20', 18500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333303', 'TOT', 'DANG_SU_DUNG', '2026-08-15', 'Máy trạm giáo viên PM101'),
('66666666-6666-6666-6666-666666666002', 'TB-CNTT-00002', 'Máy vi tính để bàn Dell OptiPlex 7090', '55555555-5555-5555-5555-555555555501', 'OptiPlex 7090 MT', 'SN-DELL-7090-02', 'Dell Inc.', 2023, '2023-08-15', '2023-08-20', 18500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444406', NULL, 'TOT', 'DANG_SU_DUNG', '2026-08-15', 'Máy thực hành số 01'),
('66666666-6666-6666-6666-666666666003', 'TB-CNTT-00003', 'Máy vi tính để bàn Dell OptiPlex 7090', '55555555-5555-5555-5555-555555555501', 'OptiPlex 7090 MT', 'SN-DELL-7090-03', 'Dell Inc.', 2023, '2023-08-15', '2023-08-20', 18500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444406', NULL, 'TOT', 'DANG_SU_DUNG', '2026-08-15', 'Máy thực hành số 02'),
('66666666-6666-6666-6666-666666666004', 'TB-CNTT-00004', 'Máy vi tính để bàn Dell OptiPlex 7090', '55555555-5555-5555-5555-555555555501', 'OptiPlex 7090 MT', 'SN-DELL-7090-04', 'Dell Inc.', 2023, '2023-08-15', '2023-08-20', 18500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444406', NULL, 'BINH_THUONG', 'DANG_SU_DUNG', '2026-08-15', 'Máy thực hành số 03'),
('66666666-6666-6666-6666-666666666005', 'TB-CNTT-00005', 'Máy vi tính để bàn Dell OptiPlex 7090', '55555555-5555-5555-5555-555555555501', 'OptiPlex 7090 MT', 'SN-DELL-7090-05', 'Dell Inc.', 2023, '2023-08-15', '2023-08-20', 18500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444406', NULL, 'HONG_NHE', 'DANG_SUA_CHUA', '2026-08-15', 'Lỗi nguồn không lên đèn LED'),
('66666666-6666-6666-6666-666666666006', 'TB-CNTT-00006', 'Máy vi tính để bàn HP ProDesk 400 G7', '55555555-5555-5555-5555-555555555501', 'ProDesk 400 G7', 'SN-HP-400-01', 'HP inc.', 2022, '2022-09-10', '2022-09-12', 15200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333304', 'TOT', 'DANG_SU_DUNG', '2025-09-10', 'Máy thực hành PM102-01'),
('66666666-6666-6666-6666-666666666007', 'TB-CNTT-00007', 'Máy vi tính để bàn HP ProDesk 400 G7', '55555555-5555-5555-5555-555555555501', 'ProDesk 400 G7', 'SN-HP-400-02', 'HP inc.', 2022, '2022-09-10', '2022-09-12', 15200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444407', NULL, 'BINH_THUONG', 'DANG_SU_DUNG', '2025-09-10', 'Máy thực hành PM102-02'),
('66666666-6666-6666-6666-666666666008', 'TB-CNTT-00008', 'Máy vi tính để bàn HP ProDesk 400 G7', '55555555-5555-5555-5555-555555555501', 'ProDesk 400 G7', 'SN-HP-400-03', 'HP inc.', 2022, '2022-09-10', '2022-09-12', 15200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444407', NULL, 'TOT', 'DANG_SU_DUNG', '2025-09-10', 'Máy thực hành PM102-03'),
('66666666-6666-6666-6666-666666666009', 'TB-CNTT-00009', 'Máy vi tính để bàn HP ProDesk 400 G7', '55555555-5555-5555-5555-555555555501', 'ProDesk 400 G7', 'SN-HP-400-04', 'HP inc.', 2022, '2022-09-10', '2022-09-12', 15200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444407', NULL, 'CAN_THEO_DOI', 'DANG_SU_DUNG', '2025-09-10', 'Quạt tản nhiệt kêu to'),
('66666666-6666-6666-6666-666666666010', 'TB-CNTT-00010', 'Máy chủ Rack Server Dell PowerEdge R750', '55555555-5555-5555-5555-555555555501', 'PowerEdge R750', 'SN-DELL-R750-01', 'Dell Inc.', 2023, '2023-11-01', '2023-11-05', 125000000, 'Dự án ODA', '44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333303', 'TOT', 'DANG_SU_DUNG', '2028-11-01', 'Server ảo hóa phục vụ lab PM201'),
('66666666-6666-6666-6666-666666666011', 'TB-CNTT-00011', 'Máy vi tính để bàn Lenovo ThinkCentre Neo 50s', '55555555-5555-5555-5555-555555555501', 'Neo 50s Gen 3', 'SN-LNV-50S-01', 'Lenovo', 2024, '2024-03-20', '2024-03-22', 14200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', 'TOT', 'TRONG_KHO', '2027-03-20', 'Máy lưu kho dự phòng số 01'),
('66666666-6666-6666-6666-666666666012', 'TB-CNTT-00012', 'Máy vi tính để bàn Lenovo ThinkCentre Neo 50s', '55555555-5555-5555-5555-555555555501', 'Neo 50s Gen 3', 'SN-LNV-50S-02', 'Lenovo', 2024, '2024-03-20', '2024-03-22', 14200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', 'TOT', 'TRONG_KHO', '2027-03-20', 'Máy lưu kho dự phòng số 02'),
('66666666-6666-6666-6666-666666666013', 'TB-CNTT-00013', 'Laptop Asus ExpertBook B1400', '55555555-5555-5555-5555-555555555501', 'B1400CEAE', 'SN-ASUS-B14-01', 'Asus', 2023, '2023-05-18', '2023-05-20', 16800000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333304', 'TOT', 'DANG_SU_DUNG', '2025-05-18', 'Laptop phục vụ trình chiếu Hội thảo A201'),
('66666666-6666-6666-6666-666666666014', 'TB-CNTT-00014', 'Máy trạm Workstation HP Z2 Tower G9', '55555555-5555-5555-5555-555555555501', 'Z2 Tower G9', 'SN-HP-Z2-01', 'HP inc.', 2023, '2023-10-15', '2023-10-18', 42000000, 'Dự án Tài trợ', '44444444-4444-4444-4444-444444444416', NULL, 'TOT', 'DANG_SU_DUNG', '2026-10-15', 'Trạm điều khiển máy CNC Xưởng X101'),
('66666666-6666-6666-6666-666666666015', 'TB-CNTT-00015', 'Máy tính để bàn cũ CMS Polaris', '55555555-5555-5555-5555-555555555501', 'Polaris P7', 'SN-CMS-00129', 'CMS Corp', 2017, '2017-06-10', '2017-06-15', 8500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444420', '33333333-3333-3333-3333-333333333302', 'KHONG_SU_DUNG_DUOC', 'THANH_LY', '2020-06-10', 'Đã lập biên bản thanh lý tài sản'),

-- 16 - 30: Thiết bị Mạng & Viễn thông
('66666666-6666-6666-6666-666666666016', 'TB-MANG-00016', 'Switch Cisco Catalyst 2960X 48 Port', '55555555-5555-5555-5555-555555555502', 'WS-C2960X-48TD-L', 'SN-CSCO-2960-01', 'Cisco Systems', 2022, '2022-04-12', '2022-04-15', 28000000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333303', 'TOT', 'DANG_SU_DUNG', '2025-04-12', 'Switch lõi phòng Lab PM201'),
('66666666-6666-6666-6666-666666666017', 'TB-MANG-00017', 'Switch Cisco Catalyst 2960X 48 Port', '55555555-5555-5555-5555-555555555502', 'WS-C2960X-48TD-L', 'SN-CSCO-2960-02', 'Cisco Systems', 2022, '2022-04-12', '2022-04-15', 28000000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444406', NULL, 'TOT', 'DANG_SU_DUNG', '2025-04-12', 'Switch mạng PM101'),
('66666666-6666-6666-6666-666666666018', 'TB-MANG-00018', 'Router Cisco ISR 4331', '55555555-5555-5555-5555-555555555502', 'ISR4331/K9', 'SN-CSCO-4331-01', 'Cisco Systems', 2023, '2023-02-10', '2023-02-15', 45000000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333303', 'TOT', 'DANG_SU_DUNG', '2026-02-10', 'Router thực hành mạng'),
('66666666-6666-6666-6666-666666666019', 'TB-MANG-00019', 'Access Point Ruijie Reyee RG-AP820-L', '55555555-5555-5555-5555-555555555502', 'RG-AP820-L(V2)', 'SN-RUJ-820-01', 'Ruijie Networks', 2023, '2023-09-05', '2023-09-08', 4200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444401', NULL, 'TOT', 'DANG_SU_DUNG', '2026-09-05', 'Phát Wi-Fi giảng đường A101'),
('66666666-6666-6666-6666-666666666020', 'TB-MANG-00020', 'Access Point Ruijie Reyee RG-AP820-L', '55555555-5555-5555-5555-555555555502', 'RG-AP820-L(V2)', 'SN-RUJ-820-02', 'Ruijie Networks', 2023, '2023-09-05', '2023-09-08', 4200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444402', NULL, 'TOT', 'DANG_SU_DUNG', '2026-09-05', 'Phát Wi-Fi giảng đường A102'),
('66666666-6666-6666-6666-666666666021', 'TB-MANG-00021', 'Tủ Rack Mạng 42U D1000', '55555555-5555-5555-5555-555555555502', 'Rack 42U-1000', 'SN-RACK-42U-01', 'VietRack', 2022, '2022-04-10', '2022-04-15', 9500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444408', NULL, 'TOT', 'DANG_SU_DUNG', '2027-04-10', 'Tủ server PM201'),
('66666666-6666-6666-6666-666666666022', 'TB-MANG-00022', 'Firewall Fortinet FortiGate 60F', '55555555-5555-5555-5555-555555555502', 'FG-60F', 'SN-FG-60F-01', 'Fortinet', 2023, '2023-03-12', '2023-03-15', 18500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333303', 'TOT', 'DANG_SU_DUNG', '2026-03-12', 'Thiết bị tường lửa học phần An ninh mạng'),
('66666666-6666-6666-6666-666666666023', 'TB-MANG-00023', 'Bộ lưu điện UPS APC Smart-UPS 3000VA', '55555555-5555-5555-5555-555555555502', 'SMT3000I', 'SN-APC-3000-01', 'Schneider Electric', 2022, '2022-06-20', '2022-06-25', 24500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444408', NULL, 'CAN_THEO_DOI', 'DANG_SU_DUNG', '2025-06-20', 'Ắc quy báo dung lượng giảm còn 70%'),
('66666666-6666-6666-6666-666666666024', 'TB-MANG-00024', 'Bộ test cáp mạng đa năng Noyafa NF-8601', '55555555-5555-5555-5555-555555555502', 'NF-8601S', 'SN-NF-8601-01', 'Noyafa', 2023, '2023-07-15', '2023-07-18', 2900000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', 'TOT', 'TRONG_KHO', '2025-07-15', 'Dụng cụ đo kiểm cáp mạng lưu kho'),
('66666666-6666-6666-6666-666666666025', 'TB-MANG-00025', 'Bộ phát Wi-Fi di động 4G TP-Link M7350', '55555555-5555-5555-5555-555555555502', 'M7350', 'SN-TPL-7350-01', 'TP-Link', 2023, '2023-04-10', '2023-04-12', 1350000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', 'HONG_NANG', 'MAT', '2025-04-10', 'Báo thất lạc sau đợt dã ngoại thực tế'),

-- 26 - 40: Máy chiếu & Hiển thị
('66666666-6666-6666-6666-666666666026', 'TB-CHIEU-00026', 'Máy chiếu Sony VPL-EX455', '55555555-5555-5555-5555-555555555503', 'VPL-EX455', 'SN-SNY-455-01', 'Sony Corp', 2022, '2022-08-10', '2022-08-15', 17800000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333304', 'TOT', 'DANG_SU_DUNG', '2025-08-10', 'Máy chiếu phòng A101'),
('66666666-6666-6666-6666-666666666027', 'TB-CHIEU-00027', 'Máy chiếu Sony VPL-EX455', '55555555-5555-5555-5555-555555555503', 'VPL-EX455', 'SN-SNY-455-02', 'Sony Corp', 2022, '2022-08-10', '2022-08-15', 17800000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444402', NULL, 'HONG_NHE', 'DANG_SU_DUNG', '2025-08-10', 'Bóng đèn mờ, cần vệ sinh lăng kính'),
('66666666-6666-6666-6666-666666666028', 'TB-CHIEU-00028', 'Máy chiếu Laser Panasonic PT-VMZ51', '55555555-5555-5555-5555-555555555503', 'PT-VMZ51', 'SN-PNS-VMZ-01', 'Panasonic', 2023, '2023-11-20', '2023-11-25', 48500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333304', 'TOT', 'DANG_SU_DUNG', '2026-11-20', 'Máy chiếu độ sáng cao Hội trường A201'),
('66666666-6666-6666-6666-666666666029', 'TB-CHIEU-00029', 'Màn hình tương tác thông minh Samsung Flip 85 inch', '55555555-5555-5555-5555-555555555503', 'WM85B', 'SN-SS-FLIP-01', 'Samsung Electronics', 2024, '2024-01-15', '2024-01-18', 68000000, 'Dự án ODA', '44444444-4444-4444-4444-444444444404', NULL, 'TOT', 'DANG_SU_DUNG', '2027-01-15', 'Bảng điện tử phòng A202'),
('66666666-6666-6666-6666-666666666030', 'TB-CHIEU-00030', 'Màn chiếu điện Dalite 120 inch', '55555555-5555-5555-5555-555555555503', 'PW120ES', 'SN-DAL-120-01', 'Dalite', 2022, '2022-08-10', '2022-08-15', 3800000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444401', NULL, 'TOT', 'DANG_SU_DUNG', '2025-08-10', 'Màn chiếu motor điện cuốn tường'),

-- 31 - 50: Thiết bị Đo lường & Thí nghiệm (Điện tử, Lý, Hóa)
('66666666-6666-6666-6666-666666666031', 'TB-DOLUONG-00031', 'Dao động ký số Tektronix TBS1102B', '55555555-5555-5555-5555-555555555504', 'TBS1102B (100MHz)', 'SN-TEK-1102-01', 'Tektronix', 2023, '2023-04-18', '2023-04-20', 16500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444412', NULL, 'TOT', 'DANG_SU_DUNG', '2026-04-18', 'Bàn thí nghiệm C201-01'),
('66666666-6666-6666-6666-666666666032', 'TB-DOLUONG-00032', 'Dao động ký số Tektronix TBS1102B', '55555555-5555-5555-5555-555555555504', 'TBS1102B (100MHz)', 'SN-TEK-1102-02', 'Tektronix', 2023, '2023-04-18', '2023-04-20', 16500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444412', NULL, 'TOT', 'DANG_SU_DUNG', '2026-04-18', 'Bàn thí nghiệm C201-02'),
('66666666-6666-6666-6666-666666666033', 'TB-DOLUONG-00033', 'Máy phát sóng hàm Rigol DG1022Z', '55555555-5555-5555-5555-555555555504', 'DG1022Z (25MHz)', 'SN-RIG-1022-01', 'Rigol', 2023, '2023-04-18', '2023-04-20', 9800000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444412', NULL, 'TOT', 'DANG_SU_DUNG', '2026-04-18', 'Máy phát sóng sin/vuông/tam giác'),
('66666666-6666-6666-6666-666666666034', 'TB-DOLUONG-00034', 'Nguồn DC tuyến tính đa năng Keysight E3631A', '55555555-5555-5555-5555-555555555504', 'E3631A 80W', 'SN-KEY-3631-01', 'Keysight Technologies', 2022, '2022-11-10', '2022-11-15', 28500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444412', NULL, 'BINH_THUONG', 'DANG_SU_DUNG', '2025-11-10', 'Nguồn DC kép 0-25V'),
('66666666-6666-6666-6666-666666666035', 'TB-DOLUONG-00035', 'Đồng hồ vạn năng hiện số Fluke 87V', '55555555-5555-5555-5555-555555555504', 'Fluke 87-V', 'SN-FLK-87V-01', 'Fluke Corp', 2023, '2023-06-05', '2023-06-08', 11500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444412', NULL, 'TOT', 'DANG_SU_DUNG', '2026-06-05', 'Đo True-RMS độ chính xác cao'),
('66666666-6666-6666-6666-666666666036', 'TB-DOLUONG-00036', 'Kính hiển vi quang học sinh học Olympus CX23', '55555555-5555-5555-5555-555555555504', 'CX23 LED', 'SN-OLY-CX23-01', 'Olympus', 2023, '2023-09-12', '2023-09-15', 26500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444410', NULL, 'TOT', 'DANG_SU_DUNG', '2026-09-12', 'Độ phóng đại 1000x phòng C101'),
('66666666-6666-6666-6666-666666666037', 'TB-DOLUONG-00037', 'Cân phân tích điện tử 4 số lẻ Sartorius Entris II', '55555555-5555-5555-5555-555555555504', 'BCE224I-1S', 'SN-SAR-224-01', 'Sartorius', 2023, '2023-03-22', '2023-03-25', 38000000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444411', NULL, 'TOT', 'DANG_SU_DUNG', '2026-03-22', 'Cân độ chính xác 0.0001g phòng Hóa C102'),
('66666666-6666-6666-6666-666666666038', 'TB-DOLUONG-00038', 'Tủ hút khí độc phòng thí nghiệm Esco Ascent Max', '55555555-5555-5555-5555-555555555504', 'ADC-4D1', 'SN-ESC-ADC-01', 'Esco Lifesciences', 2022, '2022-05-15', '2022-05-20', 85000000, 'Dự án Trường học an toàn', '44444444-4444-4444-4444-444444444411', NULL, 'BINH_THUONG', 'DANG_SU_DUNG', '2025-05-15', 'Hút hơi axit và dung môi độc hại'),
('66666666-6666-6666-6666-666666666039', 'TB-DOLUONG-00039', 'Đồng hồ vạn năng Kyoritsu 1009', '55555555-5555-5555-5555-555555555504', 'KEW 1009', 'SN-KYO-1009-01', 'Kyoritsu', 2021, '2021-08-10', '2021-08-12', 1200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', 'HONG_NHE', 'DANG_SUA_CHUA', '2023-08-10', 'Cháy cầu chì thang đo dòng 10A'),
('66666666-6666-6666-6666-666666666040', 'TB-DOLUONG-00040', 'Máy đo điện trở đất Sanwa PDR4000', '55555555-5555-5555-5555-555555555504', 'PDR4000', 'SN-SAN-4000-01', 'Sanwa Electric', 2023, '2023-05-10', '2023-05-12', 5600000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', 'TOT', 'TRONG_KHO', '2025-05-10', 'Thiết bị đo tiếp địa an toàn'),

-- 51 - 65: Máy gia công Cơ khí & Động lực Xưởng
('66666666-6666-6666-6666-666666666041', 'TB-COKHI-00041', 'Máy tiện vạn năng Winho S430x1000', '55555555-5555-5555-5555-555555555505', 'S430x1000', 'SN-WIN-430-01', 'Winho Machinery', 2021, '2021-12-05', '2021-12-10', 165000000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444416', NULL, 'TOT', 'DANG_SU_DUNG', '2026-12-05', 'Máy tiện chi tiết cơ khí xưởng X101'),
('66666666-6666-6666-6666-666666666042', 'TB-COKHI-00042', 'Máy phay đứng vạn năng Đài Loan Jen Lian', '55555555-5555-5555-5555-555555555505', 'VH-320A', 'SN-JEN-320-01', 'Jen Lian', 2021, '2021-12-05', '2021-12-10', 185000000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444416', NULL, 'BINH_THUONG', 'DANG_SU_DUNG', '2026-12-05', 'Máy phay gia công rãnh xưởng X101'),
('66666666-6666-6666-6666-666666666043', 'TB-COKHI-00043', 'Trung tâm gia công phay CNC 3 trục Mazak', '55555555-5555-5555-5555-555555555505', 'VTC-530C', 'SN-MZK-530-01', 'Yamazaki Mazak', 2023, '2023-10-01', '2023-10-10', 850000000, 'Dự án ODA', '44444444-4444-4444-4444-444444444416', NULL, 'TOT', 'DANG_SU_DUNG', '2028-10-01', 'Máy CNC độ chính xác cao học thực hành'),
('66666666-6666-6666-6666-666666666044', 'TB-COKHI-00044', 'Máy hàn TIG Jasic TIG 250 PAC/DC', '55555555-5555-5555-5555-555555555505', 'TIG 250 PAC/DC', 'SN-JAS-250-01', 'Jasic Technology', 2022, '2022-03-15', '2022-03-18', 14500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444417', NULL, 'TOT', 'DANG_SU_DUNG', '2025-03-15', 'Máy hàn nhôm và inox xưởng X102'),
('66666666-6666-6666-6666-666666666045', 'TB-COKHI-00045', 'Máy hàn TIG Jasic TIG 250 PAC/DC', '55555555-5555-5555-5555-555555555505', 'TIG 250 PAC/DC', 'SN-JAS-250-02', 'Jasic Technology', 2022, '2022-03-15', '2022-03-18', 14500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444417', NULL, 'BINH_THUONG', 'DANG_SU_DUNG', '2025-03-15', 'Máy hàn số 02 xưởng X102'),
('66666666-6666-6666-6666-666666666046', 'TB-COKHI-00046', 'Cầu nâng ô tô 2 trụ BendPak 4.5 tấn', '55555555-5555-5555-5555-555555555505', 'XPR-10AS', 'SN-BPK-10AS-01', 'BendPak', 2023, '2023-01-20', '2023-01-25', 92000000, 'Dự án ODA', '44444444-4444-4444-4444-444444444418', NULL, 'TOT', 'DANG_SU_DUNG', '2027-01-20', 'Cầu nâng xưởng gầm ô tô X201'),
('66666666-6666-6666-6666-666666666047', 'TB-COKHI-00047', 'Máy chuẩn đoán lỗi ô tô đa năng Launch X431', '55555555-5555-5555-5555-555555555505', 'X431 PAD VII', 'SN-LCH-PAD7-01', 'Launch Tech', 2023, '2023-07-25', '2023-07-28', 48000000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444419', NULL, 'TOT', 'DANG_SU_DUNG', '2026-07-25', 'Đọc xóa mã lỗi ECU xưởng X202'),
('66666666-6666-6666-6666-666666666048', 'TB-COKHI-00048', 'Mô hình cắt bổ động cơ Toyota Vios 1.5L', '55555555-5555-5555-5555-555555555505', 'MH-2NR-FE', 'SN-TOY-2NR-01', 'Toyota', 2022, '2022-09-01', '2022-09-05', 65000000, 'Tài trợ Doanh nghiệp', '44444444-4444-4444-4444-444444444418', NULL, 'TOT', 'DANG_SU_DUNG', '2027-09-01', 'Mô hình giảng dạy cấu tạo động cơ'),
('66666666-6666-6666-6666-666666666049', 'TB-COKHI-00049', 'Máy nén khí trục vít Pegasus 10HP', '55555555-5555-5555-5555-555555555505', 'TMP-10A', 'SN-PEG-10A-01', 'Pegasus', 2022, '2022-05-10', '2022-05-12', 38500000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444415', NULL, 'CAN_THEO_DOI', 'DANG_SU_DUNG', '2025-05-10', 'Cung cấp khí nén cho cụm xưởng'),
('66666666-6666-6666-6666-666666666050', 'TB-COKHI-00050', 'Máy mài hai đá Bosch GBG 60-20', '55555555-5555-5555-5555-555555555505', 'GBG 60-20', 'SN-BSH-GBG-01', 'Robert Bosch', 2023, '2023-02-14', '2023-02-16', 3200000, 'Ngân sách trường', '44444444-4444-4444-4444-444444444417', NULL, 'TOT', 'DANG_SU_DUNG', '2025-02-14', 'Mài dao tiện và mũi khoan xưởng hàn');

-- Chèn tiếp các thiết bị từ 51 đến 100 bằng vòng lặp tự động có quy tắc để hoàn tất 100 thiết bị đa dạng
DO $$
DECLARE
    i INT;
    v_id UUID;
    v_code VARCHAR;
    v_name VARCHAR;
    v_cat UUID;
    v_room UUID;
    v_cond equipment_condition_enum;
    v_status equipment_status_enum;
    v_price NUMERIC;
BEGIN
    FOR i IN 51..100 LOOP
        v_id := ('66666666-6666-6666-6666-666666666' || LPAD(i::text, 3, '0'))::UUID;
        
        IF i <= 60 THEN
            -- Kit Tự động hóa & PLC (51 - 60)
            v_code := 'TB-PLC-' || LPAD(i::text, 5, '0');
            v_name := 'Bàn thực hành PLC Siemens S7-1200 Modun ' || (i - 50);
            v_cat := '55555555-5555-5555-5555-555555555509';
            v_room := '44444444-4444-4444-4444-444444444414'; -- C301
            v_cond := 'TOT';
            v_status := 'DANG_SU_DUNG';
            v_price := 35000000;
        ELSIF i <= 70 THEN
            -- Thiết bị Âm thanh Giảng đường (61 - 70)
            v_code := 'TB-AMTHANH-' || LPAD(i::text, 5, '0');
            v_name := 'Hệ thống Loa trợ giảng & Micro không dây Shure SVX288/PG58 số ' || (i - 60);
            v_cat := '55555555-5555-5555-5555-555555555506';
            v_room := '44444444-4444-4444-4444-444444444401'; -- A101
            v_cond := CASE WHEN i = 65 THEN 'HONG_NANG' ELSE 'TOT' END;
            v_status := CASE WHEN i = 65 THEN 'DANG_SUA_CHUA' ELSE 'DANG_SU_DUNG' END;
            v_price := 8500000;
        ELSIF i <= 80 THEN
            -- Máy in & Máy quét 3D (71 - 80)
            v_code := 'TB-IN-' || LPAD(i::text, 5, '0');
            v_name := 'Máy in Laser đa năng HP LaserJet Pro M428fdw số ' || (i - 70);
            v_cat := '55555555-5555-5555-5555-555555555508';
            v_room := CASE WHEN i <= 75 THEN '44444444-4444-4444-4444-444444444404' ELSE '44444444-4444-4444-4444-444444444405' END;
            v_cond := 'BINH_THUONG';
            v_status := CASE WHEN i <= 75 THEN 'DANG_SU_DUNG' ELSE 'TRONG_KHO' END;
            v_price := 12500000;
        ELSIF i <= 90 THEN
            -- Thiết bị Văn phòng / Điều hòa / Máy hút ẩm (81 - 90)
            v_code := 'TB-VP-' || LPAD(i::text, 5, '0');
            v_name := 'Máy điều hòa Inverter Daikin 2.5HP FTKC60 ' || (i - 80);
            v_cat := '55555555-5555-5555-5555-555555555507';
            v_room := '44444444-4444-4444-4444-444444444406'; -- PM101
            v_cond := CASE WHEN i = 88 THEN 'CAN_THEO_DOI' ELSE 'TOT' END;
            v_status := 'DANG_SU_DUNG';
            v_price := 24000000;
        ELSE
            -- Thiết bị An toàn PCCC (91 - 100)
            v_code := 'TB-PCCC-' || LPAD(i::text, 5, '0');
            v_name := 'Bình chữa cháy khí CO2 Dragon MT5 5kg số ' || (i - 90);
            v_cat := '55555555-5555-5555-5555-555555555510';
            v_room := '44444444-4444-4444-4444-444444444417'; -- Xưởng hàn
            v_cond := 'TOT';
            v_status := 'DANG_SU_DUNG';
            v_price := 1250000;
        END IF;

        INSERT INTO equipment (
            id, equipment_code, name, category_id, model, serial_number,
            manufacturer, manufacturing_year, purchase_date, entry_date, original_price,
            funding_source, current_room_id, condition, status, warranty_expiry
        ) VALUES (
            v_id, v_code, v_name, v_cat, 'STD-MODEL-' || i, 'SN-AUTO-' || LPAD(i::text, 5, '0'),
            'OEM Supplier', 2023, '2023-06-01', '2023-06-10', v_price,
            'Ngân sách trường', v_room, v_cond, v_status, '2026-06-01'
        );
    END LOOP;
END $$;

-- 8. EQUIPMENT TRANSFERS (10 LẦN ĐIỀU CHUYỂN MẪU)
INSERT INTO equipment_transfers (
    id, equipment_id, from_room_id, to_room_id, transferred_by, transfer_date, reason, note
) VALUES
('77777777-7777-7777-7777-777777777001', '66666666-6666-6666-6666-666666666001', '44444444-4444-4444-4444-444444444405', '44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333302', '2024-01-10 09:00:00+07', 'Cấp phát máy trạm cho phòng máy PM101', 'Biên bản bàn giao số 01/BB-TB'),
('77777777-7777-7777-7777-777777777002', '66666666-6666-6666-6666-666666666006', '44444444-4444-4444-4444-444444444405', '44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333302', '2024-01-12 14:30:00+07', 'Cấp phát máy tính cho phòng PM102', 'Phục vụ học phần Lập trình C'),
('77777777-7777-7777-7777-777777777003', '66666666-6666-6666-6666-666666666013', '44444444-4444-4444-4444-444444444405', '44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333302', '2024-02-15 08:30:00+07', 'Bố trí Laptop cho Hội trường A201', 'Phục vụ hội thảo khoa học'),
('77777777-7777-7777-7777-777777777004', '66666666-6666-6666-6666-666666666015', '44444444-4444-4444-4444-444444444407', '44444444-4444-4444-4444-444444444420', '33333333-3333-3333-3333-333333333302', '2024-02-20 16:00:00+07', 'Thu hồi máy hỏng cũ về kho thanh lý', 'Mainboard chập cháy không thể sửa'),
('77777777-7777-7777-7777-777777777005', '66666666-6666-6666-6666-666666666026', '44444444-4444-4444-4444-444444444405', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333302', '2024-03-01 10:00:00+07', 'Lắp máy chiếu cho giảng đường A101', 'Thay thế máy chiếu cũ hỏng đèn'),
('77777777-7777-7777-7777-777777777006', '66666666-6666-6666-6666-666666666031', '44444444-4444-4444-4444-444444444405', '44444444-4444-4444-4444-444444444412', '33333333-3333-3333-3333-333333333302', '2024-03-05 13:45:00+07', 'Cấp dao động ký cho phòng TH Điện tử C201', 'Bàn giao cho giáo viên phụ trách phòng'),
('77777777-7777-7777-7777-777777777007', '66666666-6666-6666-6666-666666666039', '44444444-4444-4444-4444-444444444412', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', '2024-03-10 11:20:00+07', 'Thu hồi đồng hồ vạn năng bị đứt cầu chì về kho', 'Chờ chuyển đơn vị sửa chữa'),
('77777777-7777-7777-7777-777777777008', '66666666-6666-6666-6666-666666666044', '44444444-4444-4444-4444-444444444415', '44444444-4444-4444-4444-444444444417', '33333333-3333-3333-3333-333333333302', '2024-03-15 09:15:00+07', 'Xuất kho máy hàn TIG sang Xưởng X102', 'Phục vụ kỳ thi tay nghề sinh viên'),
('77777777-7777-7777-7777-777777777009', '66666666-6666-6666-6666-666666666047', '44444444-4444-4444-4444-444444444415', '44444444-4444-4444-4444-444444444419', '33333333-3333-3333-3333-333333333302', '2024-03-20 15:00:00+07', 'Bàn giao máy chuẩn đoán OBD-II cho Xưởng X202', 'Đào tạo công nghệ chẩn đoán ô tô'),
('77777777-7777-7777-7777-777777777010', '66666666-6666-6666-6666-666666666065', '44444444-4444-4444-4444-444444444401', '44444444-4444-4444-4444-444444444405', '33333333-3333-3333-3333-333333333302', '2024-04-02 10:30:00+07', 'Đưa micro bị hỏng củ mic về kho kiểm tra', 'Đã lập phiếu báo hỏng số BH-2024-0004');

-- 9. DAMAGE REPORTS (10 PHIẾU BÁO HỎNG MẪU)
INSERT INTO damage_reports (
    id, report_code, equipment_id, room_id, reported_by, reported_at,
    issue_description, severity, status, note
) VALUES
('88888888-8888-8888-8888-888888888001', 'BH-2024-0001', '66666666-6666-6666-6666-666666666005', '44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333304', '2024-03-01 08:30:00+07', 'Máy tính bật nguồn không lên, có mùi khét nhẹ ở bộ nguồn case', 'CAO', 'DANG_XU_LY', 'Đã tháo nguồn kiểm tra chập tụ'),
('88888888-8888-8888-8888-888888888002', 'BH-2024-0002', '66666666-6666-6666-6666-666666666009', '44444444-4444-4444-4444-444444444407', '33333333-3333-3333-3333-333333333304', '2024-03-04 10:00:00+07', 'Quạt CPU chạy kêu to, máy hoạt động 15 phút là tự tắt nguồn', 'TRUNG_BINH', 'DA_TIEP_NHAN', 'Nghi do khô keo tản nhiệt hoặc kẹt quạt'),
('88888888-8888-8888-8888-888888888003', 'BH-2024-0003', '66666666-6666-6666-6666-666666666027', '44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333304', '2024-03-10 14:15:00+07', 'Máy chiếu hiển thị hình ảnh bị nhòe và có sọc ngang tím giữa màn hình', 'CAO', 'MOI_BAO', 'Cần giảng dạy slide gấp vào tuần tới'),
('88888888-8888-8888-8888-888888888004', 'BH-2024-0004', '66666666-6666-6666-6666-666666666065', '44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333304', '2024-03-15 09:45:00+07', 'Micro không dây rơi vỡ đầu chụp, âm thanh phát ra tiếng rè lớn', 'TRUNG_BINH', 'DANG_XU_LY', 'Chờ thay củ micro Shure mới'),
('88888888-8888-8888-8888-888888888005', 'BH-2024-0005', '66666666-6666-6666-6666-666666666023', '44444444-4444-4444-4444-444444444408', '33333333-3333-3333-3333-333333333303', '2024-03-18 16:30:00+07', 'UPS phát tiếng tít liên tục cảnh báo thay thế ắc quy Battery Replace', 'CAO', 'DA_TIEP_NHAN', 'Đang liên hệ nhà cung cấp APC'),
('88888888-8888-8888-8888-888888888006', 'BH-2024-0006', '66666666-6666-6666-6666-666666666039', '44444444-4444-4444-4444-444444444412', '33333333-3333-3333-3333-333333333304', '2024-03-20 11:00:00+07', 'Sinh viên đo nhầm thang đo điện áp vào thang ampe gây nổ cầu chì', 'THAP', 'DA_SUA', 'Đã thay thế cầu chì gốm 10A'),
('88888888-8888-8888-8888-888888888007', 'BH-2024-0007', '66666666-6666-6666-6666-666666666049', '44444444-4444-4444-4444-444444444415', '33333333-3333-3333-3333-333333333302', '2024-03-22 08:00:00+07', 'Máy nén khí bị rò rỉ khí tại van xả áp và nhiệt độ dầu máy tăng cao', 'KHAN_CAP', 'DANG_XU_LY', 'Đã dừng máy để bảo đảm an toàn cháy nổ'),
('88888888-8888-8888-8888-888888888008', 'BH-2024-0008', '66666666-6666-6666-6666-666666666071', '44444444-4444-4444-4444-444444444404', '33333333-3333-3333-3333-333333333304', '2024-03-25 15:30:00+07', 'Máy in HP kẹt giấy liên tục khi in khay số 2, bản in lem mực đen', 'TRUNG_BINH', 'DA_SUA', 'Đã thay gạt mực và quả đào kéo giấy'),
('88888888-8888-8888-8888-888888888009', 'BH-2024-0009', '66666666-6666-6666-6666-666666666088', '44444444-4444-4444-4444-444444444406', '33333333-3333-3333-3333-333333333303', '2024-03-28 13:20:00+07', 'Điều hòa phòng PM101 chảy nước nhỏ giọt xuống sàn, không đủ mát', 'TRUNG_BINH', 'DA_DONG', 'Đã vệ sinh lưới lọc và thông đường ống nước xả'),
('88888888-8888-8888-8888-888888888010', 'BH-2024-0010', '66666666-6666-6666-6666-666666666015', '44444444-4444-4444-4444-444444444420', '33333333-3333-3333-3333-333333333302', '2024-04-01 10:10:00+07', 'Mainboard máy CMS đời cũ bị nổ tụ và oxi hóa mạch không nhận RAM', 'THAP', 'KHONG_SUA_DUOC', 'Đề xuất thanh lý linh kiện xác máy');

-- 10. MAINTENANCE RECORDS (10 HỒ SƠ SỬA CHỮA / BẢO TRÌ MẪU)
INSERT INTO maintenance_records (
    id, maintenance_code, equipment_id, damage_report_id, received_date, completion_date,
    service_provider, repair_details, replaced_components, cost, result, warranty_until, recorded_by, note
) VALUES
('99999999-9999-9999-9999-999999999001', 'SC-2024-0001', '66666666-6666-6666-6666-666666666039', '88888888-8888-8888-8888-888888888006', '2024-03-20', '2024-03-21', 'Tổ Bảo trì Nội bộ Trường', 'Kiểm tra mạch bảo vệ, thay mới cầu chì tác động nhanh 10A 600V', 'Cầu chì gốm Bussmann 10A', 150000, 'THANH_CONG', '2024-09-21', '33333333-3333-3333-3333-333333333302', 'Đã bàn giao lại cho phòng C201'),
('99999999-9999-9999-9999-999999999002', 'SC-2024-0002', '66666666-6666-6666-6666-666666666071', '88888888-8888-8888-8888-888888888008', '2024-03-26', '2024-03-27', 'Công ty TNHH Máy văn phòng Sao Nam', 'Vệ sinh hộp quang, thay thế cụm kéo giấy và gạt từ hộp mực', 'Cụm quả đào kéo giấy Tray 2, gạt mực HP 76A', 650000, 'THANH_CONG', '2024-06-27', '33333333-3333-3333-3333-333333333302', 'Bản in thử nghiệm nét, không kẹt giấy'),
('99999999-9999-9999-9999-999999999003', 'SC-2024-0003', '66666666-6666-6666-6666-666666666088', '88888888-8888-8888-8888-888888888009', '2024-03-29', '2024-03-29', 'Điện lạnh Bách Khoa', 'Xịt rửa dàn lạnh, thổi thông đường ống thoát nước ngưng, nạp bổ sung 150g gas R32', 'Ống thoát nước mềm phi 21', 450000, 'THANH_CONG', '2024-06-29', '33333333-3333-3333-3333-333333333302', 'Nhiệt độ cửa gió đo được 16.5 độ C'),
('99999999-9999-9999-9999-999999999004', 'SC-2024-0004', '66666666-6666-6666-6666-666666666005', '88888888-8888-8888-8888-888888888001', '2024-03-02', NULL, 'Trung tâm Bảo hành Dell Việt Nam', 'Gửi hãng bảo hành thay thế nguồn chính hãng Dell Optiplex 260W Bronze', 'Nguồn Dell 260W 80 Plus', 1200000, 'CHO_LINH_KIEN', '2025-03-02', '33333333-3333-3333-3333-333333333302', 'Chờ hãng chuyển linh kiện từ kho tổng'),
('99999999-9999-9999-9999-999999999005', 'SC-2024-0005', '66666666-6666-6666-6666-666666666065', '88888888-8888-8888-8888-888888888004', '2024-03-16', NULL, 'Âm thanh Ánh sáng Việt Hưng', 'Thay cụm củ micro dynamic PG58 và nắn chỉnh lưới thép chụp mic', 'Củ micro Shure PG58 chính hãng', 850000, 'CHO_LINH_KIEN', '2024-09-16', '33333333-3333-3333-3333-333333333302', 'Đang chờ linh kiện'),
('99999999-9999-9999-9999-999999999006', 'SC-2024-0006', '66666666-6666-6666-6666-666666666049', '88888888-8888-8888-8888-888888888007', '2024-03-23', '2024-03-25', 'Cơ điện lạnh Công nghiệp Hà Nội', 'Thay van an toàn áp suất cao, thay lọc tách dầu và 20 lít dầu máy nén khí trục vít', 'Van xả áp 10 bar, lọc dầu Pegasus 10HP, dầu Shell Corena S3', 4200000, 'THANH_CONG', '2024-09-25', '33333333-3333-3333-3333-333333333302', 'Áp suất duy trì ổn định 8 bar'),
('99999999-9999-9999-9999-999999999007', 'SC-2024-0007', '66666666-6666-6666-6666-666666666015', '88888888-8888-8888-8888-888888888010', '2024-04-02', '2024-04-03', 'Tổ Bảo trì Nội bộ Trường', 'Đo đạc kiểm tra nguồn và chipset, kết luận bo mạch chủ chết IC điều khiển nguồn', 'Không có linh kiện thay thế', 0, 'KHONG_THE_SUA', NULL, '33333333-3333-3333-3333-333333333302', 'Đã chuyển vào kho thanh lý'),
('99999999-9999-9999-9999-999999999008', 'SC-2024-0008', '66666666-6666-6666-6666-666666666023', '88888888-8888-8888-8888-888888888005', '2024-03-25', '2024-03-28', 'Dịch vụ Kỹ thuật Nguồn APC', 'Thay bộ 16 bình ắc quy Vision 12V-7.2Ah cho bộ pack pin UPS APC 3000VA', '16 bình ắc quy Vision CP1272', 7800000, 'THANH_CONG', '2025-03-28', '33333333-3333-3333-3333-333333333302', 'Thời gian lưu điện test thử 35 phút ở 50% tải'),
('99999999-9999-9999-9999-999999999009', 'SC-2024-0009', '66666666-6666-6666-6666-666666666042', NULL, '2024-01-15', '2024-01-16', 'Bảo dưỡng Máy công cụ Tân Phát', 'Bảo dưỡng định kỳ máy phay Jen Lian: châm mỡ trục chính, căn chỉnh cữ hành trình trục X-Y-Z', 'Dầu mỡ bôi trơn Caltex Way Lubricant', 1800000, 'THANH_CONG', '2024-07-16', '33333333-3333-3333-3333-333333333302', 'Bảo dưỡng định kỳ 6 tháng'),
('99999999-9999-9999-9999-999999999010', 'SC-2024-0010', '66666666-6666-6666-6666-666666666046', NULL, '2024-02-18', '2024-02-19', 'Thiết bị Ô tô Vian', 'Kiểm tra hệ thống thủy lực cầu nâng BendPak, thay dầu thủy lực 46 và siết cáp cân bằng', 'Dầu thủy lực Castrol Hyspin AWH-M 46', 2500000, 'THANH_CONG', '2025-02-19', '33333333-3333-3333-3333-333333333302', 'Kiểm định an toàn tải trọng 4.5 tấn đạt tiêu chuẩn');

-- 11. INVENTORY SESSIONS (2 ĐỢT KIỂM KÊ MẪU)
INSERT INTO inventory_sessions (
    id, session_code, title, start_date, end_date, created_by, status, scope_description, note
) VALUES
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', 'KK-2025-HK2', 'Kiểm kê Tài sản & Thiết bị Cuối Học kỳ 2 Năm học 2024 - 2025', '2025-06-15', '2025-06-30', '33333333-3333-3333-3333-333333333302', 'HOAN_THANH', 'Toàn bộ các phòng máy tính, phòng thực hành và kho thiết bị thuộc Tòa B và Tòa C', 'Đợt kiểm kê thường niên phục vụ thanh quyết toán năm học'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2', 'KK-2026-HK1', 'Kiểm kê Thiết bị Đào tạo Đầu Năm học 2025 - 2026', '2026-03-01', '2026-03-25', '33333333-3333-3333-3333-333333333302', 'DANG_DIEN_RA', 'Tất cả các phòng học lý thuyết Tòa A và các xưởng thực hành Cơ khí - Ô tô', 'Đang tiến hành đối soát số lượng thực tế tại xưởng');

-- 12. INVENTORY ITEMS (CHI TIẾT KẾT QUẢ ĐỢT KIỂM KÊ aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1)
INSERT INTO inventory_items (
    id, session_id, equipment_id, expected_room_id, actual_room_id, check_result, actual_condition, note, checked_by, checked_at
) VALUES
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '66666666-6666-6666-6666-666666666001', '44444444-4444-4444-4444-444444444406', '44444444-4444-4444-4444-444444444406', 'CO_THUC_TE', 'TOT', 'Đúng vị trí máy giáo viên', '33333333-3333-3333-3333-333333333302', '2025-06-16 09:15:00+07'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '66666666-6666-6666-6666-666666666002', '44444444-4444-4444-4444-444444444406', '44444444-4444-4444-4444-444444444406', 'CO_THUC_TE', 'TOT', 'Máy thực hành 01 hoạt động tốt', '33333333-3333-3333-3333-333333333302', '2025-06-16 09:20:00+07'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '66666666-6666-6666-6666-666666666005', '44444444-4444-4444-4444-444444444406', '44444444-4444-4444-4444-444444444406', 'CO_NHUNG_HONG', 'HONG_NHE', 'Đang lỗi nguồn chập chờn', '33333333-3333-3333-3333-333333333302', '2025-06-16 09:35:00+07'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb4', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '66666666-6666-6666-6666-666666666025', '44444444-4444-4444-4444-444444444405', NULL, 'KHONG_CO', 'KHONG_SU_DUNG_DUOC', 'Không tìm thấy trong kho lưu trữ, đã lập biên bản', '33333333-3333-3333-3333-333333333302', '2025-06-18 14:00:00+07'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb5', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '66666666-6666-6666-6666-666666666013', '44444444-4444-4444-4444-444444444405', '44444444-4444-4444-4444-444444444403', 'CO_NHUNG_SAI_VI_TRI', 'TOT', 'Sổ ghi ở Kho nhưng thực tế đang đặt tại Hội trường A201', '33333333-3333-3333-3333-333333333302', '2025-06-20 10:30:00+07'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb6', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1', '66666666-6666-6666-6666-666666666031', '44444444-4444-4444-4444-444444444412', '44444444-4444-4444-4444-444444444412', 'CO_THUC_TE', 'TOT', 'Dao động ký đủ que đo phụ kiện', '33333333-3333-3333-3333-333333333302', '2025-06-22 15:45:00+07');

-- 13. AUDIT LOGS (NHẬT KÝ HỆ THỐNG MẪU)
INSERT INTO audit_logs (
    id, user_id, action, entity_type, entity_id, old_data, new_data, ip_address, created_at
) VALUES
('cccccccc-cccc-cccc-cccc-cccccccccc01', '33333333-3333-3333-3333-333333333301', 'LOGIN', 'AUTH', '33333333-3333-3333-3333-333333333301', NULL, '{"method": "password"}', '192.168.1.10', '2026-03-15 07:30:00+07'),
('cccccccc-cccc-cccc-cccc-cccccccccc02', '33333333-3333-3333-3333-333333333302', 'TRANSFER', 'EQUIPMENT', '66666666-6666-6666-6666-666666666001', '{"room_id": "44444444-4444-4444-4444-444444444405"}', '{"room_id": "44444444-4444-4444-4444-444444444406"}', '192.168.1.15', '2026-03-15 08:00:00+07'),
('cccccccc-cccc-cccc-cccc-cccccccccc03', '33333333-3333-3333-3333-333333333304', 'CREATE', 'DAMAGE_REPORT', '88888888-8888-8888-8888-888888888001', NULL, '{"code": "BH-2024-0001", "severity": "CAO"}', '192.168.1.22', '2026-03-15 08:30:00+07');
