// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// RESPONSIVE APPLICATION LAYOUT
// ==============================================================================
import React, { useState } from 'react';
import {
  LayoutDashboard,
  Box,
  Building2,
  ArrowLeftRight,
  AlertTriangle,
  Wrench,
  ClipboardCheck,
  Users,
  Menu,
  X,
  School,
  LogOut,
  ChevronDown,
  ShieldCheck,
  BellRing,
  User,
  KeyRound,
  LogIn
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { LoginModal } from '../auth/LoginModal.tsx';
import { UserProfileModal } from '../auth/UserProfileModal.tsx';

export type NavTab =
  | 'dashboard'
  | 'equipment'
  | 'rooms'
  | 'transfers'
  | 'damages'
  | 'maintenance'
  | 'inventory'
  | 'users';

interface AppLayoutProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  children: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  currentTab,
  onTabChange,
  children
}) => {
  const { currentUser, availableUsers, loginAs, logout, openLoginModal, openProfileModal } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }> }[] = [
    { id: 'dashboard', label: 'Tổng quan hệ thống', icon: LayoutDashboard },
    { id: 'equipment', label: 'Quản lý thiết bị', icon: Box },
    { id: 'rooms', label: 'Phòng học & Cơ sở', icon: Building2 },
    { id: 'transfers', label: 'Điều chuyển thiết bị', icon: ArrowLeftRight },
    { id: 'damages', label: 'Báo hỏng & Sự cố', icon: AlertTriangle },
    { id: 'maintenance', label: 'Bảo dưỡng & Sửa chữa', icon: Wrench },
    { id: 'inventory', label: 'Kiểm kê tài sản', icon: ClipboardCheck },
    { id: 'users', label: 'Người dùng & Phân quyền', icon: Users }
  ];

  const getRoleBadge = (roles: string[]) => {
    if (roles.includes('ADMIN')) {
      return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-purple-100 text-purple-800">Quản trị viên (Admin)</span>;
    }
    if (roles.includes('EQUIPMENT_MANAGER')) {
      return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800">Quản lý Thiết bị</span>;
    }
    if (roles.includes('DEPARTMENT_HEAD')) {
      return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">Trưởng bộ môn</span>;
    }
    return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800">Giảng viên</span>;
  };

  return (
    <div id="app-container" className="min-h-screen bg-slate-50 flex flex-col">
      {/* TOP HEADER */}
      <header id="main-header" className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-md text-slate-600 hover:bg-slate-100"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onTabChange('dashboard')}>
              <div className="w-10 h-10 rounded-lg bg-blue-700 text-white flex items-center justify-center font-bold shadow-xs">
                <School className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-base font-bold text-slate-900 leading-tight">
                  TRƯỜNG CAO ĐẲNG X
                </h1>
                <p className="text-xs text-slate-500 font-medium">Hệ thống Quản lý Thiết bị & Cơ sở vật chất</p>
              </div>
            </div>
          </div>

          {/* USER SWITCHER / PERSONA DROPDOWN */}
          <div className="flex items-center space-x-3">
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-persona-btn"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    {currentUser?.full_name ? currentUser.full_name[0] : 'U'}
                  </div>
                  <div className="hidden sm:block text-xs">
                    <div className="font-semibold text-slate-800 truncate max-w-[140px]">
                      {currentUser?.full_name || 'Chưa đăng nhập'}
                    </div>
                    <div className="text-slate-500 text-[11px]">
                      {currentUser ? getRoleBadge(currentUser.roles) : ''}
                    </div>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-500" />
                </button>

                {userDropdownOpen && (
                  <div
                    id="user-persona-dropdown"
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95"
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="font-bold text-slate-900 text-xs truncate">{currentUser.full_name}</div>
                      <div className="text-[11px] text-slate-500 font-mono truncate">{currentUser.email}</div>
                      <div className="mt-1">{getRoleBadge(currentUser.roles)}</div>
                    </div>

                    <div className="py-1 border-b border-slate-100">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openProfileModal();
                        }}
                        className="w-full text-left px-4 py-2 text-xs flex items-center space-x-2 text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 text-blue-600" />
                        <span>Hồ sơ cán bộ & Đổi mật khẩu</span>
                      </button>
                    </div>

                    <div className="px-4 pt-2 pb-1">
                      <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                        Chuyển đổi vai trò kiểm thử (RBAC):
                      </p>
                    </div>

                    <div className="py-1">
                      {availableUsers.map(user => (
                        <button
                          key={user.id}
                          onClick={() => {
                            loginAs(user);
                            setUserDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-xs flex flex-col hover:bg-blue-50 transition-colors ${
                            currentUser?.id === user.id ? 'bg-blue-50 font-semibold' : ''
                          }`}
                        >
                          <span className="text-slate-900 font-medium">{user.full_name}</span>
                          <div className="flex items-center space-x-2 mt-0.5">
                            {getRoleBadge(user.roles)}
                            <span className="text-slate-400 text-[10px] truncate max-w-[120px]">{user.email}</span>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="border-t border-slate-100 mt-1 pt-1 px-2 space-y-0.5">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          openLoginModal();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-blue-700 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        <span>Đăng nhập tài khoản khác...</span>
                      </button>

                      <button
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Đăng xuất phiên làm việc</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="flex items-center space-x-2 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Đăng nhập</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* BODY WITH SIDEBAR & CONTENT */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 flex gap-6">
        {/* DESKTOP SIDEBAR */}
        <aside id="desktop-sidebar" className="hidden lg:block w-64 shrink-0">
          <nav className="sticky top-24 bg-white rounded-xl border border-slate-200 p-2 space-y-1 shadow-2xs">
            {navItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}

            <div className="pt-4 mt-4 border-t border-slate-100 px-3">
              <div className="flex items-center space-x-2 text-xs text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Bảo mật RLS & Supabase</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">Phiên bản MVP v1.0.0</p>
            </div>
          </nav>
        </aside>

        {/* MOBILE DRAWER */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative bg-white w-72 max-w-full h-full p-4 flex flex-col z-50 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded bg-blue-700 text-white flex items-center justify-center font-bold">
                    <School className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-slate-900 text-sm">TRƯỜNG CAO ĐẲNG X</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                {navItems.map(item => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onTabChange(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>
        )}

        {/* MAIN VIEW AREA */}
        <main id="main-content" className="flex-1 min-w-0">
          {children}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-slate-200 py-4 mt-auto text-center text-xs text-slate-500">
        <p>© 2026 Trường Cao đẳng X - Hệ thống Quản lý Thiết bị & Cơ sở Vật chất (Đã kết nối Supabase PostgreSQL & Express REST API)</p>
      </footer>

      {/* AUTHENTICATION & PROFILE MODALS */}
      <LoginModal />
      <UserProfileModal />
    </div>
  );
};
