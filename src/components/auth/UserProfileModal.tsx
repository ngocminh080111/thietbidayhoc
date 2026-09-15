// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// USER PROFILE & SESSION MANAGEMENT MODAL
// ==============================================================================
import React, { useState } from 'react';
import {
  User,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  KeyRound,
  Calendar,
  Clock,
  X,
  CheckCircle2,
  AlertCircle,
  Lock,
  Save,
  Shield,
  Layers,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const UserProfileModal: React.FC = () => {
  const {
    showProfileModal,
    closeProfileModal,
    currentUser,
    token,
    sessionExpiresAt,
    updateProfile,
    changePassword,
    logout,
    openLoginModal
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'info' | 'security' | 'rbac'>('info');

  // Form states
  const [fullName, setFullName] = useState<string>(currentUser?.full_name || '');
  const [phone, setPhone] = useState<string>(currentUser?.phone || '');
  const [infoStatus, setInfoStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [infoLoading, setInfoLoading] = useState<boolean>(false);

  // Password states
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passStatus, setPassStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [passLoading, setPassLoading] = useState<boolean>(false);

  if (!showProfileModal || !currentUser) return null;

  const handleUpdateInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setInfoLoading(true);
    setInfoStatus(null);
    try {
      const res = await updateProfile({ full_name: fullName, phone });
      if (res.success) {
        setInfoStatus({ type: 'success', text: 'Cập nhật thông tin tài khoản thành công!' });
      } else {
        setInfoStatus({ type: 'error', text: res.message || 'Cập nhật thất bại' });
      }
    } catch (err: any) {
      setInfoStatus({ type: 'error', text: err.message || 'Lỗi lưu thông tin' });
    } finally {
      setInfoLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPassLoading(true);
    setPassStatus(null);

    if (newPassword !== confirmPassword) {
      setPassStatus({ type: 'error', text: 'Mật khẩu mới và xác nhận mật khẩu không khớp' });
      setPassLoading(false);
      return;
    }

    try {
      const res = await changePassword(currentPassword, newPassword);
      if (res.success) {
        setPassStatus({ type: 'success', text: 'Đổi mật khẩu thành công!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPassStatus({ type: 'error', text: res.message || 'Đổi mật khẩu thất bại' });
      }
    } catch (err: any) {
      setPassStatus({ type: 'error', text: err.message || 'Lỗi hệ thống' });
    } finally {
      setPassLoading(false);
    }
  };

  const getRoleBadge = (roles: string[]) => {
    if (roles.includes('ADMIN')) {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-purple-100 text-purple-800 border border-purple-200">Quản trị viên (Admin)</span>;
    }
    if (roles.includes('EQUIPMENT_MANAGER')) {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-blue-100 text-blue-800 border border-blue-200">Cán bộ Quản lý Thiết bị</span>;
    }
    if (roles.includes('DEPARTMENT_HEAD')) {
      return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-emerald-100 text-emerald-800 border border-emerald-200">Trưởng Khoa / Bộ môn</span>;
    }
    return <span className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 text-amber-800 border border-amber-200">Giảng viên Bộ môn</span>;
  };

  const getRolePermissions = () => {
    const roles = currentUser.roles;
    if (roles.includes('ADMIN')) {
      return [
        { name: 'Toàn quyền cấu hình & phân quyền người dùng', granted: true },
        { name: 'Thêm, sửa, xóa danh mục thiết bị, cơ sở & phòng học', granted: true },
        { name: 'Phê duyệt điều chuyển thiết bị giữa các phòng/khoa', granted: true },
        { name: 'Khởi tạo & đóng kỳ kiểm kê tài sản', granted: true },
        { name: 'Điều phối & phê duyệt kinh phí bảo dưỡng/sửa chữa', granted: true },
        { name: 'Xuất báo cáo tài sản theo chuẩn Bộ Giáo dục', granted: true },
      ];
    }
    if (roles.includes('EQUIPMENT_MANAGER')) {
      return [
        { name: 'Đăng ký, cập nhật và quản lý 100% hồ sơ thiết bị', granted: true },
        { name: 'Khởi tạo & thực thi điều chuyển tài sản cơ sở vật chất', granted: true },
        { name: 'Tiếp nhận báo hỏng và lên phiếu bảo dưỡng / sửa chữa', granted: true },
        { name: 'Quét mã QR kiểm kê thiết bị tại hiện trường', granted: true },
        { name: 'Cập nhật trạng thái và vị trí phòng học của thiết bị', granted: true },
        { name: 'Quản lý tài khoản quản trị hệ thống', granted: false },
      ];
    }
    if (roles.includes('DEPARTMENT_HEAD')) {
      return [
        { name: 'Xem toàn bộ danh mục thiết bị được cấp phát cho Khoa/Bộ môn', granted: true },
        { name: 'Ký nhận / Xác nhận điều chuyển thiết bị về phòng máy của Khoa', granted: true },
        { name: 'Báo hỏng & yêu cầu sửa chữa thiết bị phòng thực hành', granted: true },
        { name: 'Tham gia hội đồng kiểm kê tài sản cấp Khoa', granted: true },
        { name: 'Thêm mới hoặc thanh lý thiết bị cấp trường', granted: false },
        { name: 'Phân quyền tài khoản người dùng', granted: false },
      ];
    }
    return [
      { name: 'Tra cứu phòng học, phòng máy và cấu hình máy tính', granted: true },
      { name: 'Gửi phiếu báo hỏng thiết bị trực tiếp từ phòng học', granted: true },
      { name: 'Theo dõi tiến độ sửa chữa thiết bị đã báo cáo', granted: true },
      { name: 'Điều chuyển hoặc chỉnh sửa thông số tài sản', granted: false },
      { name: 'Đóng/mở đợt kiểm kê tài sản', granted: false },
    ];
  };

  return (
    <div
      id="user-profile-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* TOP BAR */}
        <div className="bg-slate-900 text-white p-6 relative">
          <button
            onClick={closeProfileModal}
            className="absolute top-4 right-4 p-1 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center text-xl font-bold shadow-md">
              {currentUser.full_name ? currentUser.full_name[0] : 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-white leading-tight">
                  {currentUser.full_name}
                </h2>
                {currentUser.is_active && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Đang hoạt động
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-300 mt-0.5">{currentUser.email}</p>
              <div className="mt-2 flex items-center space-x-2">
                {getRoleBadge(currentUser.roles)}
                {currentUser.department_name && (
                  <span className="text-xs text-slate-400 flex items-center space-x-1">
                    <Building2 className="w-3.5 h-3.5 inline" />
                    <span>{currentUser.department_name}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex space-x-4 mt-6 border-b border-slate-800 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('info')}
              className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'info'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Hồ sơ cá nhân</span>
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'security'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Đổi mật khẩu & Bảo mật</span>
            </button>
            <button
              onClick={() => setActiveTab('rbac')}
              className={`pb-2.5 transition-colors border-b-2 flex items-center space-x-1.5 ${
                activeTab === 'rbac'
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Quyền hạn & Phiên làm việc</span>
            </button>
          </div>
        </div>

        {/* MODAL CONTENT */}
        <div className="p-6">
          {/* TAB 1: PERSONAL INFO */}
          {activeTab === 'info' && (
            <form onSubmit={handleUpdateInfo} className="space-y-4 text-xs">
              {infoStatus && (
                <div
                  className={`p-3 rounded-lg flex items-center space-x-2 ${
                    infoStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {infoStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{infoStatus.text}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Họ và tên cán bộ / giảng viên *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Số điện thoại liên lạc
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="0901234567"
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email công vụ (Không thể sửa)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.email}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Đơn vị / Khoa trực thuộc
                  </label>
                  <input
                    type="text"
                    disabled
                    value={currentUser.department_name || 'Phòng Quản trị Thiết bị & CSVC'}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-100 text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="text-[11px] text-slate-400">
                  Đăng nhập gần nhất:{' '}
                  {currentUser.last_login
                    ? new Date(currentUser.last_login).toLocaleString('vi-VN')
                    : 'Phiên hiện tại'}
                </div>
                <button
                  type="submit"
                  disabled={infoLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-60"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{infoLoading ? 'Đang lưu...' : 'Lưu thay đổi'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: CHANGE PASSWORD */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              {passStatus && (
                <div
                  className={`p-3 rounded-lg flex items-center space-x-2 ${
                    passStatus.type === 'success'
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-rose-50 text-rose-800 border border-rose-200'
                  }`}
                >
                  {passStatus.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                  )}
                  <span>{passStatus.text}</span>
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Mật khẩu hiện tại *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện đang sử dụng"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Mật khẩu mới * (tối thiểu 6 ký tự)
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={e => setNewPassword(e.target.value)}
                      placeholder="Mật khẩu mới"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Xác nhận mật khẩu mới *
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Gõ lại mật khẩu mới"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-amber-800 text-[11px] flex items-start space-x-2">
                <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Quy tắc bảo mật: Mật khẩu nên chứa cả chữ hoa, chữ thường và chữ số để đảm bảo an toàn cho cơ sở dữ liệu tài sản trường.
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <button
                  type="submit"
                  disabled={passLoading}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors disabled:opacity-60"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>{passLoading ? 'Đang cập nhật...' : 'Cập nhật mật khẩu'}</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: RBAC & PERMISSIONS */}
          {activeTab === 'rbac' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-1">Thông tin phiên làm việc hiện tại</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600 mt-2">
                  <div>
                    <span className="font-semibold text-slate-700">Mã người dùng (UUID):</span>
                    <div className="font-mono text-[10px] text-slate-500 truncate">{currentUser.id}</div>
                  </div>
                  <div>
                    <span className="font-semibold text-slate-700">Hạn phiên đăng nhập:</span>
                    <div className="text-slate-800">
                      {sessionExpiresAt ? new Date(sessionExpiresAt).toLocaleString('vi-VN') : '24 giờ kể từ khi đăng nhập'}
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="font-semibold text-slate-700">Cơ chế xác thực:</span>
                    <div className="text-slate-600">
                      Supabase Auth JWT Hybrid / Bearer Token Storage
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Quyền hạn theo vai trò (RBAC):</h4>
                <div className="space-y-1.5">
                  {getRolePermissions().map((perm, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <span className={perm.granted ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                        {perm.name}
                      </span>
                      {perm.granted ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 flex items-center space-x-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Cho phép</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500 flex items-center space-x-1">
                          <X className="w-3 h-3" />
                          <span>Hạn chế</span>
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    closeProfileModal();
                    openLoginModal();
                  }}
                  className="px-3 py-1.5 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 font-medium"
                >
                  Đổi tài khoản khác
                </button>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    closeProfileModal();
                  }}
                  className="px-3 py-1.5 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg hover:bg-rose-100 font-medium flex items-center space-x-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Đăng xuất phiên</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
