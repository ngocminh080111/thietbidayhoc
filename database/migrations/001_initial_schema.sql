-- ==============================================================================
-- HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
-- MIGRATION 001: INITIAL DATABASE SCHEMA & ROW LEVEL SECURITY (RLS)
-- Target Database: PostgreSQL 14+ (Supabase)
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. CUSTOM TYPES & ENUMS
-- ==============================================================================

-- Loại phòng
DO $$ BEGIN
    CREATE TYPE room_type_enum AS ENUM (
        'LY_THUYET',      -- Phòng học lý thuyết
        'THUC_HANH',      -- Phòng học thực hành chung
        'PHONG_MAY',       -- Phòng máy tính
        'THI_NGHIEM',      -- Phòng thí nghiệm (Hóa, Sinh, Vật lý...)
        'XUONG',          -- Xưởng thực hành (Cơ khí, Ô tô, Điện...)
        'KHO',            -- Kho thiết bị / vật tư
        'KHAC'            -- Phòng chức năng, hội trường...
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Tình trạng kỹ thuật thiết bị
DO $$ BEGIN
    CREATE TYPE equipment_condition_enum AS ENUM (
        'TOT',                   -- Hoạt động hoàn hảo
        'BINH_THUONG',           -- Hoạt động ổn định
        'CAN_THEO_DOI',          -- Có dấu hiệu xuống cấp
        'HONG_NHE',              -- Hỏng hóc nhỏ, vẫn tạm dùng được
        'HONG_NANG',             -- Hỏng nặng, cần ngừng sử dụng
        'KHONG_SU_DUNG_DUOC'     -- Hỏng hoàn toàn / Chờ thanh lý
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Trạng thái vận hành thiết bị
DO $$ BEGIN
    CREATE TYPE equipment_status_enum AS ENUM (
        'TRONG_KHO',             -- Đang lưu kho, chưa cấp phát
        'DANG_SU_DUNG',          -- Đang bố trí tại phòng để giảng dạy/học tập
        'DANG_SUA_CHUA',         -- Đang bảo hành / sửa chữa
        'DANG_DIEU_CHUYEN',      -- Đang trong quá trình bàn giao, chuyển phòng
        'THANH_LY',              -- Đã làm thủ tục thanh lý
        'MAT'                    -- Bị thất lạc / mất mát
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Kết quả kiểm kê
DO $$ BEGIN
    CREATE TYPE inventory_result_enum AS ENUM (
        'CO_THUC_TE',            -- Khớp thực tế và sổ sách
        'KHONG_CO',              -- Thiếu hụt (sổ có nhưng thực tế không thấy)
        'CO_NHUNG_HONG',         -- Có mặt nhưng thiết bị bị hỏng
        'CO_NHUNG_SAI_VI_TRI',   -- Tìm thấy ở phòng khác không đúng sổ
        'KHONG_XAC_DINH'         -- Chưa rõ tình trạng
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Mức độ nghiêm trọng của sự cố báo hỏng
DO $$ BEGIN
    CREATE TYPE report_severity_enum AS ENUM (
        'THAP',                  -- Ưu tiên thấp
        'TRUNG_BINH',            -- Ưu tiên vừa
        'CAO',                   -- Ưu tiên cao
        'KHAN_CAP'               -- Dừng giờ học, cần xử lý ngay lập tức
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Trạng thái phiếu báo hỏng
DO $$ BEGIN
    CREATE TYPE report_status_enum AS ENUM (
        'MOI_BAO',               -- Vừa gửi phiếu
        'DA_TIEP_NHAN',          -- Cán bộ QLTB đã ghi nhận
        'DANG_XU_LY',            -- Đang kiểm tra / liên hệ bảo hành
        'DA_SUA',                -- Đã khắc phục xong
        'KHONG_SUA_DUOC',        -- Không thể khắc phục (chuyển thanh lý)
        'DA_DONG'                -- Hoàn thành đóng phiếu
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Kết quả sửa chữa / bảo trì
DO $$ BEGIN
    CREATE TYPE maintenance_result_enum AS ENUM (
        'THANH_CONG',            -- Sửa xong, thiết bị tốt
        'KHONG_THE_SUA',         -- Không thể khắc phục
        'BAO_HANH_DOI_MOI',      -- Hãng bảo hành đổi thiết bị mới
        'CHO_LINH_KIEN'          -- Tạm ngưng do thiếu linh kiện thay thế
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. CORE APPLICATION TABLES
-- ==============================================================================

-- BẢNG 1: KHOA / PHÒNG BAN / BỘ MÔN (DEPARTMENTS)
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 2: HỒ SƠ NGƯỜI DÙNG (PROFILES)
-- Liên kết 1-1 với bảng auth.users của Supabase
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 3: VAI TRÒ HỆ THỐNG (ROLES)
CREATE TABLE IF NOT EXISTS roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(255) NOT NULL
);

-- BẢNG 4: GÁN VAI TRÒ CHO NGƯỜI DÙNG (USER_ROLES)
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, role_id)
);

-- BẢNG 5: PHÒNG VÀ KHÔNG GIAN (ROOMS)
CREATE TABLE IF NOT EXISTS rooms (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    room_type room_type_enum NOT NULL DEFAULT 'LY_THUYET',
    building VARCHAR(100) NOT NULL,
    floor INT NOT NULL DEFAULT 1,
    capacity INT DEFAULT 40,
    department_id UUID REFERENCES departments(id) ON DELETE RESTRICT,
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'HOAT_DONG', -- 'HOAT_DONG', 'BAO_TRI', 'DONG_CUA'
    note TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 6: NHÓM THIẾT BỊ (EQUIPMENT_CATEGORIES)
CREATE TABLE IF NOT EXISTS equipment_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 7: THIẾT BỊ (EQUIPMENT)
CREATE TABLE IF NOT EXISTS equipment (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_code VARCHAR(100) UNIQUE NOT NULL, -- Ví dụ: TB-CNTT-00001
    name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES equipment_categories(id) ON DELETE RESTRICT,
    model VARCHAR(150),
    serial_number VARCHAR(150),
    manufacturer VARCHAR(150),
    manufacturing_year INT,
    purchase_date DATE,
    entry_date DATE DEFAULT CURRENT_DATE,
    original_price NUMERIC(15, 2) DEFAULT 0,
    funding_source VARCHAR(150) DEFAULT 'Ngân sách trường',
    current_room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
    manager_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    condition equipment_condition_enum NOT NULL DEFAULT 'TOT',
    status equipment_status_enum NOT NULL DEFAULT 'TRONG_KHO',
    warranty_expiry DATE,
    image_url TEXT,
    note TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 8: LỊCH SỬ ĐIỀU CHUYỂN (EQUIPMENT_TRANSFERS)
CREATE TABLE IF NOT EXISTS equipment_transfers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    from_room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    to_room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE RESTRICT,
    transferred_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    transfer_date TIMESTAMPTZ DEFAULT NOW(),
    reason TEXT NOT NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 9: ĐỢT KIỂM KÊ (INVENTORY_SESSIONS)
CREATE TABLE IF NOT EXISTS inventory_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_code VARCHAR(50) UNIQUE NOT NULL, -- Ví dụ: KK-2026-HK1
    title VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'DANG_DIEN_RA', -- 'DANG_DIEN_RA', 'HOAN_THANH', 'HUY'
    scope_description TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 10: CHI TIẾT KIỂM KÊ TỪNG THIẾT BỊ (INVENTORY_ITEMS)
CREATE TABLE IF NOT EXISTS inventory_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES inventory_sessions(id) ON DELETE CASCADE,
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    expected_room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
    actual_room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    check_result inventory_result_enum NOT NULL DEFAULT 'CO_THUC_TE',
    actual_condition equipment_condition_enum,
    note TEXT,
    checked_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    checked_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT unique_session_equipment UNIQUE(session_id, equipment_id)
);

-- BẢNG 11: BÁO HỎNG THIẾT BỊ (DAMAGE_REPORTS)
CREATE TABLE IF NOT EXISTS damage_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_code VARCHAR(50) UNIQUE NOT NULL, -- Ví dụ: BH-2026-0001
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    room_id UUID REFERENCES rooms(id) ON DELETE RESTRICT,
    reported_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    issue_description TEXT NOT NULL,
    severity report_severity_enum DEFAULT 'TRUNG_BINH',
    status report_status_enum DEFAULT 'MOI_BAO',
    image_url TEXT,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 12: SỬA CHỮA / BẢO TRÌ (MAINTENANCE_RECORDS)
CREATE TABLE IF NOT EXISTS maintenance_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    maintenance_code VARCHAR(50) UNIQUE NOT NULL, -- Ví dụ: SC-2026-0001
    equipment_id UUID NOT NULL REFERENCES equipment(id) ON DELETE RESTRICT,
    damage_report_id UUID REFERENCES damage_reports(id) ON DELETE SET NULL,
    received_date DATE DEFAULT CURRENT_DATE,
    completion_date DATE,
    service_provider VARCHAR(255) NOT NULL,
    repair_details TEXT NOT NULL,
    replaced_components TEXT,
    cost NUMERIC(15, 2) DEFAULT 0,
    result maintenance_result_enum DEFAULT 'THANH_CONG',
    warranty_until DATE,
    recorded_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- BẢNG 13: NHẬT KÝ KIỂM TOÁN HỆ THỐNG (AUDIT_LOGS)
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- 'LOGIN', 'CREATE', 'UPDATE', 'DELETE', 'TRANSFER', etc.
    entity_type VARCHAR(100) NOT NULL, -- 'EQUIPMENT', 'ROOM', 'DAMAGE_REPORT', etc.
    entity_id VARCHAR(100) NOT NULL,
    old_data JSONB,
    new_data JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. PERFORMANCE INDEXES
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_rooms_code ON rooms(code);
CREATE INDEX IF NOT EXISTS idx_rooms_department ON rooms(department_id);
CREATE INDEX IF NOT EXISTS idx_rooms_building ON rooms(building);

CREATE INDEX IF NOT EXISTS idx_equipment_code ON equipment(equipment_code);
CREATE INDEX IF NOT EXISTS idx_equipment_room ON equipment(current_room_id);
CREATE INDEX IF NOT EXISTS idx_equipment_category ON equipment(category_id);
CREATE INDEX IF NOT EXISTS idx_equipment_status ON equipment(status);
CREATE INDEX IF NOT EXISTS idx_equipment_condition ON equipment(condition);
CREATE INDEX IF NOT EXISTS idx_equipment_serial ON equipment(serial_number);

CREATE INDEX IF NOT EXISTS idx_transfers_equipment ON equipment_transfers(equipment_id);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON equipment_transfers(transfer_date);

CREATE INDEX IF NOT EXISTS idx_inventory_items_session ON inventory_items(session_id);
CREATE INDEX IF NOT EXISTS idx_inventory_items_result ON inventory_items(check_result);

CREATE INDEX IF NOT EXISTS idx_damage_reports_equipment ON damage_reports(equipment_id);
CREATE INDEX IF NOT EXISTS idx_damage_reports_status ON damage_reports(status);
CREATE INDEX IF NOT EXISTS idx_damage_reports_room ON damage_reports(room_id);

CREATE INDEX IF NOT EXISTS idx_maintenance_equipment ON maintenance_records(equipment_id);
CREATE INDEX IF NOT EXISTS idx_maintenance_report ON maintenance_records(damage_report_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- ==============================================================================
-- 5. TRIGGER FUNCTIONS (AUTOMATIC UPDATED_AT)
-- ==============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_trigger()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_profiles_timestamp ON profiles;
CREATE TRIGGER trg_update_profiles_timestamp
    BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_trigger();

DROP TRIGGER IF EXISTS trg_update_rooms_timestamp ON rooms;
CREATE TRIGGER trg_update_rooms_timestamp
    BEFORE UPDATE ON rooms
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_trigger();

DROP TRIGGER IF EXISTS trg_update_equipment_timestamp ON equipment;
CREATE TRIGGER trg_update_equipment_timestamp
    BEFORE UPDATE ON equipment
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_trigger();

DROP TRIGGER IF EXISTS trg_update_inventory_sessions_timestamp ON inventory_sessions;
CREATE TRIGGER trg_update_inventory_sessions_timestamp
    BEFORE UPDATE ON inventory_sessions
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_trigger();

DROP TRIGGER IF EXISTS trg_update_damage_reports_timestamp ON damage_reports;
CREATE TRIGGER trg_update_damage_reports_timestamp
    BEFORE UPDATE ON damage_reports
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_trigger();

DROP TRIGGER IF EXISTS trg_update_maintenance_records_timestamp ON maintenance_records;
CREATE TRIGGER trg_update_maintenance_records_timestamp
    BEFORE UPDATE ON maintenance_records
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_trigger();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) HELPER FUNCTIONS
-- ==============================================================================

-- Kiểm tra xem user hiện tại có vai trò được chỉ định không
CREATE OR REPLACE FUNCTION auth_has_role(target_role VARCHAR)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name = target_role
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Kiểm tra xem user có phải ADMIN hoặc QUẢN LÝ THIẾT BỊ không
CREATE OR REPLACE FUNCTION is_manager_or_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM user_roles ur
        JOIN roles r ON ur.role_id = r.id
        WHERE ur.user_id = auth.uid()
          AND r.name IN ('ADMIN', 'EQUIPMENT_MANAGER')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Lấy mã đơn vị của user hiện tại
CREATE OR REPLACE FUNCTION get_user_department_id()
RETURNS UUID AS $$
    SELECT department_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- ==============================================================================
-- 7. ENABLE ROW LEVEL SECURITY & DEFINE POLICIES
-- ==============================================================================

ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE equipment_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE damage_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- 7.1 DEPARTMENTS POLICIES
CREATE POLICY "departments_select_all" ON departments
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "departments_admin_all" ON departments
    FOR ALL TO authenticated USING (auth_has_role('ADMIN'));

-- 7.2 PROFILES POLICIES
CREATE POLICY "profiles_select_all" ON profiles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "profiles_update_self" ON profiles
    FOR UPDATE TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_admin_all" ON profiles
    FOR ALL TO authenticated USING (auth_has_role('ADMIN'));

-- 7.3 ROLES & USER_ROLES POLICIES
CREATE POLICY "roles_select_all" ON roles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "user_roles_select_all" ON user_roles
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "user_roles_admin_all" ON user_roles
    FOR ALL TO authenticated USING (auth_has_role('ADMIN'));

-- 7.4 ROOMS POLICIES
CREATE POLICY "rooms_select_all" ON rooms
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "rooms_manager_modify" ON rooms
    FOR ALL TO authenticated
    USING (is_manager_or_admin())
    WITH CHECK (is_manager_or_admin());

-- 7.5 EQUIPMENT CATEGORIES POLICIES
CREATE POLICY "categories_select_all" ON equipment_categories
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "categories_manager_modify" ON equipment_categories
    FOR ALL TO authenticated
    USING (is_manager_or_admin())
    WITH CHECK (is_manager_or_admin());

-- 7.6 EQUIPMENT POLICIES
CREATE POLICY "equipment_select_all" ON equipment
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "equipment_manager_modify" ON equipment
    FOR ALL TO authenticated
    USING (is_manager_or_admin())
    WITH CHECK (is_manager_or_admin());

-- 7.7 EQUIPMENT TRANSFERS POLICIES
CREATE POLICY "transfers_select_all" ON equipment_transfers
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "transfers_manager_insert" ON equipment_transfers
    FOR INSERT TO authenticated
    WITH CHECK (is_manager_or_admin());

-- 7.8 INVENTORY SESSIONS & ITEMS POLICIES
CREATE POLICY "inventory_sessions_select" ON inventory_sessions
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "inventory_sessions_manage" ON inventory_sessions
    FOR ALL TO authenticated
    USING (is_manager_or_admin())
    WITH CHECK (is_manager_or_admin());

CREATE POLICY "inventory_items_select" ON inventory_items
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "inventory_items_modify" ON inventory_items
    FOR ALL TO authenticated
    USING (is_manager_or_admin() OR auth_has_role('DEPARTMENT_HEAD'))
    WITH CHECK (is_manager_or_admin() OR auth_has_role('DEPARTMENT_HEAD'));

-- 7.9 DAMAGE REPORTS POLICIES
CREATE POLICY "damage_reports_select" ON damage_reports
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "damage_reports_insert_any" ON damage_reports
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = reported_by OR reported_by IS NULL);

CREATE POLICY "damage_reports_update" ON damage_reports
    FOR UPDATE TO authenticated
    USING (is_manager_or_admin() OR reported_by = auth.uid())
    WITH CHECK (is_manager_or_admin() OR reported_by = auth.uid());

-- 7.10 MAINTENANCE RECORDS POLICIES
CREATE POLICY "maintenance_select_all" ON maintenance_records
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "maintenance_manager_all" ON maintenance_records
    FOR ALL TO authenticated
    USING (is_manager_or_admin())
    WITH CHECK (is_manager_or_admin());

-- 7.11 AUDIT LOGS POLICIES
CREATE POLICY "audit_logs_select" ON audit_logs
    FOR SELECT TO authenticated USING (is_manager_or_admin());

CREATE POLICY "audit_logs_insert" ON audit_logs
    FOR INSERT TO authenticated WITH CHECK (true);
