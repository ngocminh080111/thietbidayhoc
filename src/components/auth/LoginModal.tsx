// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// LOGIN MODAL & AUTHENTICATION PORTAL
// ==============================================================================
import React, { useState } from 'react';
import {
  School,
  Lock,
  Mail,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  X,
  ShieldCheck,
  UserCheck,
  KeyRound,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { api } from '../../services/api.ts';

export const LoginModal: React.FC = () => {
  const { showLoginModal, closeLoginModal, login, loginAs, availableUsers, currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState<'password' | 'quick'>('password');
  const [email, setEmail] = useState<string>('quanlytb@caodangx.edu.vn');
  const [password, setPassword] = useState<string>('Quanly@123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  // Forgot password sub-state
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotStatus, setForgotStatus] = useState<string>('');

  if (!showLoginModal) return null;

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng...');
        setTimeout(() => {
          closeLoginModal();
        }, 600);
      } else {
        setErrorMessage(res.message || 'Email hoặc mật khẩu không chính xác');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối máy chủ xác thực');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (userEmail: string, presetPass: string) => {
    setEmail(userEmail);
    setPassword(presetPass);
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await login(userEmail, presetPass);
      if (res.success) {
        closeLoginModal();
      } else {
        setErrorMessage(res.message || 'Lỗi đăng nhập');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Lỗi kết nối');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    try {
      const res = await api.forgotPassword(forgotEmail);
      setForgotStatus(res.message);
    } catch (err: any) {
      setForgotStatus(`Lỗi: ${err.message}`);
    }
  };

  const getRoleLabel = (roles: string[]) => {
    if (roles.includes('ADMIN')) return 'Quản trị viên Hệ thống';
    if (roles.includes('EQUIPMENT_MANAGER')) return 'Cán bộ Quản lý Thiết bị';
    if (roles.includes('DEPARTMENT_HEAD')) return 'Trưởng Bộ môn / Khoa';
    return 'Giảng viên Bộ môn';
  };

  const defaultPresets = [
    {
      email: 'admin@caodangx.edu.vn',
      pass: 'Admin@123456',
      roleName: 'Quản trị viên (Admin)',
      desc: 'Toàn quyền cấu hình, phân quyền, phê duyệt & kiểm kê',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200'
    },
    {
      email: 'quanlytb@caodangx.edu.vn',
      pass: 'Quanly@123456',
      roleName: 'Cán bộ Quản lý Thiết bị',
      desc: 'Quản lý thiết bị, điều chuyển, bảo dưỡng, kiểm kê tài sản',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    {
      email: 'truongbomon@caodangx.edu.vn',
      pass: 'Bomon@123456',
      roleName: 'Trưởng Khoa / Bộ môn',
      desc: 'Theo dõi tài sản phân bổ tại Khoa CNTT, báo hỏng sự cố',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    {
      email: 'giangvien@caodangx.edu.vn',
      pass: 'Giangvien@123456',
      roleName: 'Giảng viên Bộ môn',
      desc: 'Tra cứu phòng thực hành, báo hỏng sự cố phòng máy',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200'
    }
  ];

  return (
    <div
      id="login-modal"
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto animate-in fade-in duration-200"
    >
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-100 overflow-hidden relative">
        {/* HEADER BANNER */}
        <div className="bg-gradient-to-r from-blue-800 to-indigo-900 text-white p-6 relative">
          <button
            id="close-login-btn"
            onClick={closeLoginModal}
            className="absolute top-4 right-4 p-1 rounded-full text-blue-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-[11px] font-semibold tracking-wider text-blue-200 uppercase">
                Cổng xác thực nội bộ
              </span>
              <h2 className="text-lg font-bold text-white leading-tight">
                TRƯỜNG CAO ĐẲNG X
              </h2>
            </div>
          </div>
          <p className="text-xs text-blue-100/90 mt-1">
            Hệ thống Quản lý Thiết bị & Cơ sở vật chất đào tạo
          </p>

          {/* TAB SWITCHER */}
          <div className="flex bg-blue-950/40 p-1 rounded-lg mt-4 text-xs font-semibold">
            <button
              onClick={() => { setActiveTab('password'); setShowForgot(false); }}
              className={`flex-1 py-1.5 rounded-md transition-all text-center ${
                activeTab === 'password'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Đăng nhập mật khẩu
            </button>
            <button
              onClick={() => { setActiveTab('quick'); setShowForgot(false); }}
              className={`flex-1 py-1.5 rounded-md transition-all text-center ${
                activeTab === 'quick'
                  ? 'bg-white text-blue-900 shadow-xs'
                  : 'text-blue-100 hover:text-white'
              }`}
            >
              Đăng nhập nhanh 1-Click
            </button>
          </div>
        </div>

        {/* MODAL BODY */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-start space-x-2 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMessage}</div>
            </div>
          )}

          {successMessage && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-start space-x-2 text-xs text-emerald-800 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>{successMessage}</div>
            </div>
          )}

          {/* TAB 1: USERNAME & PASSWORD FORM */}
          {activeTab === 'password' && !showForgot && (
            <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Email tài khoản cơ quan *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ten@caodangx.edu.vn"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-semibold text-slate-700">
                    Mật khẩu *
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowForgot(true)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-medium"
                  >
                    Quên mật khẩu?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-600">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={e => setRememberMe(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Ghi nhớ phiên đăng nhập (24 giờ)</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-xs transition-colors flex items-center justify-center space-x-2 disabled:opacity-60"
              >
                {loading ? (
                  <span>Đang xác thực...</span>
                ) : (
                  <>
                    <span>Đăng nhập hệ thống</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span>Mật khẩu mẫu các tài khoản:</span>
                <code className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-mono text-[10px]">
                  Admin@123456 / Quanly@123456
                </code>
              </div>
            </form>
          )}

          {/* FORGOT PASSWORD SUB-VIEW */}
          {activeTab === 'password' && showForgot && (
            <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-1">Khôi phục Mật khẩu</h3>
                <p className="text-xs text-slate-500 mb-3">
                  Nhập địa chỉ email công vụ đã được cấp phát bởi Trường Cao đẳng X để nhận đường dẫn đặt lại mật khẩu.
                </p>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                    placeholder="quanlytb@caodangx.edu.vn"
                    className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {forgotStatus && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-900">
                  {forgotStatus}
                </div>
              )}

              <div className="flex space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowForgot(false)}
                  className="flex-1 py-2 px-3 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Gửi yêu cầu
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: 1-CLICK QUICK PERSONA SELECTION */}
          {activeTab === 'quick' && (
            <div className="space-y-2.5 text-xs">
              <p className="text-[11px] text-slate-500 mb-2">
                Chọn một trong các vai trò đào tạo dưới đây để đăng nhập ngay mà không cần nhập lại mật khẩu:
              </p>

              {defaultPresets.map((preset, idx) => (
                <div
                  key={idx}
                  onClick={() => handleQuickLogin(preset.email, preset.pass)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 cursor-pointer transition-all flex items-start justify-between group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border ${preset.badgeColor}`}>
                        {preset.roleName}
                      </span>
                    </div>
                    <div className="font-mono text-slate-900 font-semibold text-[11px]">
                      {preset.email}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {preset.desc}
                    </div>
                  </div>
                  <button className="mt-2 shrink-0 px-2.5 py-1 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white rounded-md text-[11px] font-semibold text-slate-700 transition-colors flex items-center space-x-1">
                    <span>Đăng nhập</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
