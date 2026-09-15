// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// DEDICATED INSTITUTIONAL LOGIN PORTAL VIEW
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
  ShieldCheck,
  Building2,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { api } from '../../services/api.ts';

export const LoginView: React.FC = () => {
  const { login, availableUsers } = useAuth();
  const [activeTab, setActiveTab] = useState<'password' | 'quick'>('quick');
  const [email, setEmail] = useState<string>('quanlytb@caodangx.edu.vn');
  const [password, setPassword] = useState<string>('Quanly@123456');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');

  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>('');
  const [forgotStatus, setForgotStatus] = useState<string>('');

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        setSuccessMessage('Đăng nhập thành công! Đang chuyển hướng vào hệ thống...');
      } else {
        setErrorMessage(res.message || 'Email hoặc mật khẩu không đúng');
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
      if (!res.success) {
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

  const defaultPresets = [
    {
      email: 'admin@caodangx.edu.vn',
      pass: 'Admin@123456',
      name: 'Nguyễn Hoàng Long',
      roleName: 'Quản trị viên (Admin)',
      desc: 'Toàn quyền cấu hình hệ thống, phân quyền người dùng, báo cáo cấp trường',
      badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
      iconBg: 'bg-purple-600'
    },
    {
      email: 'quanlytb@caodangx.edu.vn',
      pass: 'Quanly@123456',
      name: 'Trần Thị Thu Thảo',
      roleName: 'Cán bộ Quản lý Thiết bị & CSVC',
      desc: 'Quản trị thiết bị, điều chuyển vị trí, bảo dưỡng sửa chữa, kiểm kê QR',
      badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
      iconBg: 'bg-blue-600'
    },
    {
      email: 'truongbomon@caodangx.edu.vn',
      pass: 'Bomon@123456',
      name: 'TS. Lê Đức Thắng',
      roleName: 'Trưởng Khoa / Bộ môn CNTT',
      desc: 'Quản lý tài sản Khoa CNTT, tiếp nhận điều chuyển, giám sát phòng máy',
      badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-600'
    },
    {
      email: 'giangvien@caodangx.edu.vn',
      pass: 'Giangvien@123456',
      name: 'ThS. Vũ Hải Minh',
      roleName: 'Giảng viên Bộ môn',
      desc: 'Tra cứu phòng máy thực hành, báo hỏng sự cố máy tính tại giảng đường',
      badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
      iconBg: 'bg-amber-600'
    }
  ];

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN: BRANDING & FEATURES */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <School className="w-7 h-7" />
            </div>
            <div>
              <span className="text-xs font-bold text-blue-700 uppercase tracking-widest">
                Cổng xác thực tập trung
              </span>
              <h2 className="text-xl font-black text-slate-900 leading-tight">
                TRƯỜNG CAO ĐẲNG X
              </h2>
            </div>
          </div>

          <div className="space-y-3 text-slate-600 text-xs leading-relaxed">
            <p className="text-sm font-medium text-slate-800">
              Hệ thống Quản lý Thiết bị & Cơ sở vật chất nội bộ theo chuẩn Bộ Giáo dục & Đào tạo.
            </p>
            <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-3 shadow-xs">
              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Quản lý 100+ Thiết bị & 20+ Phòng học</h4>
                  <p className="text-[11px] text-slate-500">
                    Theo dõi vòng đời từ nhập kho, phân bổ, bảo dưỡng đến thanh lý.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 bg-emerald-50 rounded-lg text-emerald-600 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Phân quyền chặt chẽ (RBAC 4 cấp)</h4>
                  <p className="text-[11px] text-slate-500">
                    Admin, Quản lý Thiết bị, Trưởng bộ môn, Giảng viên giảng dạy.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <div className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600 mt-0.5">
                  <Cpu className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900">Xác thực Supabase Auth & JWT</h4>
                  <p className="text-[11px] text-slate-500">
                    Bảo mật phiên đăng nhập 24h, mã hóa tiêu chuẩn công vụ.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: LOGIN FORM CARD */}
        <div className="lg:col-span-7 bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
          {/* HEADER */}
          <div className="bg-slate-900 p-6 text-white">
            <h3 className="text-base font-bold">Đăng nhập tài khoản</h3>
            <p className="text-xs text-slate-400 mt-1">
              Chọn vai trò có sẵn để kiểm thử nhanh hoặc nhập tài khoản cá nhân
            </p>

            {/* TAB SELECTOR */}
            <div className="flex bg-slate-800/80 p-1 rounded-lg mt-4 text-xs font-semibold">
              <button
                onClick={() => { setActiveTab('quick'); setShowForgot(false); }}
                className={`flex-1 py-1.5 rounded-md transition-all text-center flex items-center justify-center space-x-1.5 ${
                  activeTab === 'quick'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Đăng nhập nhanh 1-Click</span>
              </button>
              <button
                onClick={() => { setActiveTab('password'); setShowForgot(false); }}
                className={`flex-1 py-1.5 rounded-md transition-all text-center flex items-center justify-center space-x-1.5 ${
                  activeTab === 'password'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Nhập mật khẩu</span>
              </button>
            </div>
          </div>

          <div className="p-6">
            {errorMessage && (
              <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start space-x-2 text-xs text-rose-800 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <div>{errorMessage}</div>
              </div>
            )}

            {successMessage && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start space-x-2 text-xs text-emerald-800 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>{successMessage}</div>
              </div>
            )}

            {/* TAB 1: QUICK PERSONA CARDS */}
            {activeTab === 'quick' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-medium">
                  Bấm vào vai trò mong muốn để đăng nhập trực tiếp vào hệ thống:
                </p>

                <div className="grid grid-cols-1 gap-2.5">
                  {defaultPresets.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleQuickLogin(preset.email, preset.pass)}
                      className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 cursor-pointer transition-all flex items-center justify-between group shadow-2xs"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-9 h-9 rounded-lg ${preset.iconBg} text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs`}>
                          {preset.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-slate-900 text-xs">{preset.name}</span>
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded border ${preset.badgeColor}`}>
                              {preset.roleName}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                            {preset.email}
                          </div>
                        </div>
                      </div>

                      <div className="shrink-0 px-3 py-1.5 bg-slate-100 group-hover:bg-blue-600 group-hover:text-white rounded-lg text-xs font-semibold text-slate-700 transition-colors flex items-center space-x-1">
                        <span>Đăng nhập</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 2: CREDENTIALS FORM */}
            {activeTab === 'password' && !showForgot && (
              <form onSubmit={handlePasswordLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Email công vụ Trường Cao đẳng X *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="ten@caodangx.edu.vn"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block font-semibold text-slate-700">
                      Mật khẩu xác thực *
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
                      className="w-full pl-9 pr-10 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
                  <label className="flex items-center space-x-2 cursor-pointer select-none text-slate-600 text-xs">
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
                      <span>Đăng nhập vào hệ thống</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* FORGOT PASSWORD SUB-FLOW */}
            {activeTab === 'password' && showForgot && (
              <form onSubmit={handleForgotPassword} className="space-y-4 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Khôi phục mật khẩu</h3>
                  <p className="text-xs text-slate-500 mb-3">
                    Nhập địa chỉ email trường để nhận hướng dẫn khôi phục mật khẩu.
                  </p>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={e => setForgotEmail(e.target.value)}
                      placeholder="quanlytb@caodangx.edu.vn"
                      className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
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
          </div>
        </div>
      </div>
    </div>
  );
};
