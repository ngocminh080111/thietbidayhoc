// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// CLIENT INITIAL & FALLBACK DATA
// ==============================================================================
import { UserProfile, Department, EquipmentCategory } from '../types/index.ts';

export const INITIAL_USERS: UserProfile[] = [
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

export const INITIAL_USER_PASSWORDS: Record<string, string> = {
  'admin@caodangx.edu.vn': 'Admin@123456',
  'quanlytb@caodangx.edu.vn': 'Quanly@123456',
  'truongbomon@caodangx.edu.vn': 'Bomon@123456',
  'giangvien@caodangx.edu.vn': 'Giangvien@123456'
};
