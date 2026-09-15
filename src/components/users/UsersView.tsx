// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// USERS & RBAC PERMISSIONS VIEW
// ==============================================================================
import React from 'react';
import { Users, ShieldCheck, Check, X, KeyRound } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const UsersView: React.FC = () => {
  const { availableUsers, currentUser, loginAs } = useAuth();

  const matrix = [
    { module: 'Xem danh mục thiết bị & phòng học', admin: true, manager: true, head: true, teacher: true },
    { module: 'Thêm / Sửa / Xóa thiết bị', admin: true, manager: true, head: false, teacher: false },
    { module: 'Thêm / Sửa / Đóng phòng học, xưởng', admin: true, manager: true, head: false, teacher: false },
    { module: 'Lập phiếu điều chuyển thiết bị', admin: true, manager: true, head: false, teacher: false },
    { module: 'Gửi báo hỏng sự cố thiết bị', admin: true, manager: true, head: true, teacher: true },
    { module: 'Tiếp nhận & Cập nhật tiến độ sửa chữa', admin: true, manager: true, head: false, teacher: false },
    { module: 'Ghi nhận chi phí bảo trì & linh kiện', admin: true, manager: true, head: false, teacher: false },
    { module: 'Khởi tạo đợt kiểm kê & đối soát', admin: true, manager: true, head: false, teacher: false },
    { module: 'Phân quyền người dùng & Cấu hình hệ thống', admin: true, manager: false, head: false, teacher: false },
  ];

  return (
    <div id="users-view" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Người dùng & Phân quyền Hệ thống (RBAC)</h2>
        <p className="text-xs text-slate-500">
          Mô hình phân quyền 4 cấp độ tuân thủ quy chế quản lý tài sản Trường Cao đẳng X
        </p>
      </div>

      {/* DEMO PERSONA CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {availableUsers.map(u => {
          const isCurrent = currentUser?.id === u.id;
          const role = u.roles[0];
          return (
            <div
              key={u.id}
              className={`bg-white rounded-xl border p-4 space-y-3 transition-all ${
                isCurrent
                  ? 'border-blue-500 ring-2 ring-blue-500 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
                  {u.full_name[0]}
                </div>
                {isCurrent && (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-blue-600 text-white">
                    Đang đăng nhập
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-900 text-sm">{u.full_name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{u.email}</p>
                <div className="text-[11px] text-slate-400 mt-1">
                  Khoa/BM: <strong className="text-slate-700">{u.department_name || 'Toàn trường'}</strong>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <span className="inline-block px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-800">
                  Vai trò: {role}
                </span>
              </div>

              <button
                onClick={() => loginAs(u)}
                disabled={isCurrent}
                className={`w-full py-1.5 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  isCurrent
                    ? 'bg-slate-100 text-slate-400 cursor-default'
                    : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                }`}
              >
                {isCurrent ? 'Phiên hiện tại' : 'Chuyển sang tài khoản này'}
              </button>
            </div>
          );
        })}
      </div>

      {/* PERMISSIONS MATRIX */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-900">Ma trận Phân quyền Chức năng (RBAC Matrix)</h3>
          <p className="text-xs text-slate-500">Được thực thi đồng thời tại tầng UI, Express API và Supabase PostgreSQL RLS</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-4">Chức năng nghiệp vụ</th>
                <th className="py-2.5 px-3 text-center">Admin</th>
                <th className="py-2.5 px-3 text-center">QL Thiết bị</th>
                <th className="py-2.5 px-3 text-center">Trưởng Bộ môn</th>
                <th className="py-2.5 px-3 text-center">Giảng viên</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {matrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="py-2.5 px-4 font-medium text-slate-900">{row.module}</td>
                  <td className="py-2.5 px-3 text-center">
                    {row.admin ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.manager ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.head ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    {row.teacher ? <Check className="w-4 h-4 text-emerald-600 mx-auto" /> : <X className="w-4 h-4 text-slate-300 mx-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
