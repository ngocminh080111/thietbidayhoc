// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// DASHBOARD VIEW
// ==============================================================================
import React, { useEffect, useState } from 'react';
import {
  Box,
  Building2,
  AlertTriangle,
  Wrench,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldAlert,
  PlusCircle,
  ArrowLeftRight,
  FileSpreadsheet
} from 'lucide-react';
import { DashboardStats } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { NavTab } from '../layout/AppLayout.tsx';

interface DashboardViewProps {
  onNavigate: (tab: NavTab) => void;
  onOpenNewEquipment: () => void;
  onOpenNewReport: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigate,
  onOpenNewEquipment,
  onOpenNewReport
}) => {
  const { currentUser, canManageEquipment } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Lỗi tải dữ liệu dashboard:', err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-500">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <p>Đang tổng hợp dữ liệu thời gian thực từ hệ thống...</p>
      </div>
    );
  }

  return (
    <div id="dashboard-view" className="space-y-6">
      {/* WELCOME BANNER */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="px-2.5 py-1 bg-blue-800/80 text-blue-200 text-xs font-semibold rounded-full uppercase tracking-wide">
            Cơ sở đào tạo & Phòng thực hành
          </span>
          <h2 className="text-xl md:text-2xl font-bold mt-2">
            Xin chào, {currentUser?.full_name || 'Cán bộ trường'}
          </h2>
          <p className="text-blue-200 text-xs md:text-sm mt-1 max-w-2xl">
            Hệ thống đang quản lý tập trung {stats.total_equipment} thiết bị tại {stats.total_rooms} phòng học, phòng máy, phòng lab và xưởng thực hành.
          </p>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-wrap gap-2">
          {canManageEquipment && (
            <button
              id="dash-add-equipment-btn"
              onClick={onOpenNewEquipment}
              className="flex items-center space-x-1.5 px-3.5 py-2 bg-white text-blue-900 text-xs font-semibold rounded-lg shadow hover:bg-blue-50 transition-colors"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Thêm thiết bị</span>
            </button>
          )}
          <button
            id="dash-report-damage-btn"
            onClick={onOpenNewReport}
            className="flex items-center space-x-1.5 px-3.5 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg shadow hover:bg-rose-700 transition-colors"
          >
            <AlertTriangle className="w-4 h-4" />
            <span>Báo hỏng sự cố</span>
          </button>
        </div>
      </div>

      {/* ALERT STRIP */}
      {stats.alerts.urgent_damages > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-rose-100 text-rose-700 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-rose-900">
                Có {stats.alerts.urgent_damages} sự cố thiết bị khẩn cấp cần tiếp nhận xử lý!
              </h4>
              <p className="text-xs text-rose-700">
                Bao gồm sự cố máy chủ và máy chiếu tại các phòng thực hành trọng điểm.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('damages')}
            className="text-xs font-semibold text-rose-800 hover:text-rose-900 underline flex items-center space-x-1 shrink-0"
          >
            <span>Xử lý ngay</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* METRIC CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Tổng thiết bị</span>
            <Box className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">{stats.total_equipment}</div>
          <div className="text-[11px] text-slate-400 mt-1">Toàn trường</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Đang sử dụng</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-emerald-600">{stats.in_use_equipment}</div>
          <div className="text-[11px] text-slate-400 mt-1">Tại các phòng</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Trong kho</span>
            <Building2 className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl font-bold text-slate-700">{stats.in_stock_equipment}</div>
          <div className="text-[11px] text-slate-400 mt-1">Sẵn sàng cấp phát</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Đang sửa chữa</span>
            <Wrench className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-600">{stats.repairing_equipment}</div>
          <div className="text-[11px] text-slate-400 mt-1">Đang bảo dưỡng</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Thiết bị hỏng</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-600">{stats.damaged_equipment}</div>
          <div className="text-[11px] text-slate-400 mt-1">Hỏng nhẹ / nặng</div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">Phòng & Xưởng</span>
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold text-indigo-600">{stats.total_rooms}</div>
          <div className="text-[11px] text-slate-400 mt-1">4 Tòa nhà</div>
        </div>
      </div>

      {/* CHARTS / BREAKDOWNS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BY CATEGORY */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-800">Cơ cấu Thiết bị theo Nhóm Tài sản</h3>
            <button
              onClick={() => onNavigate('equipment')}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center space-x-1"
            >
              <span>Xem chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="space-y-3">
            {stats.by_category.slice(0, 6).map(item => {
              const pct = Math.round((item.count / stats.total_equipment) * 100);
              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium text-slate-700">
                    <span>{item.name}</span>
                    <span className="font-semibold text-slate-900">{item.count} thiết bị ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* BY CONDITION & STATUS */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Tình trạng Kỹ thuật Hiện tại</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg">
              <span className="text-xs font-medium text-emerald-800">Tình trạng Tốt</span>
              <div className="text-xl font-bold text-emerald-900 mt-1">
                {stats.by_condition.find(c => c.condition === 'TOT')?.count || 0}
              </div>
              <span className="text-[11px] text-emerald-600">Hoạt động chuẩn xác</span>
            </div>

            <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg">
              <span className="text-xs font-medium text-blue-800">Bình thường</span>
              <div className="text-xl font-bold text-blue-900 mt-1">
                {stats.by_condition.find(c => c.condition === 'BINH_THUONG')?.count || 0}
              </div>
              <span className="text-[11px] text-blue-600">Đang phục vụ dạy học</span>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg">
              <span className="text-xs font-medium text-amber-800">Cần theo dõi / Hỏng nhẹ</span>
              <div className="text-xl font-bold text-amber-900 mt-1">
                {(stats.by_condition.find(c => c.condition === 'CAN_THEO_DOI')?.count || 0) +
                  (stats.by_condition.find(c => c.condition === 'HONG_NHE')?.count || 0)}
              </div>
              <span className="text-[11px] text-amber-600">Cần kế hoạch bảo dưỡng</span>
            </div>

            <div className="p-3 bg-rose-50 border border-rose-100 rounded-lg">
              <span className="text-xs font-medium text-rose-800">Hỏng nặng / Ngừng sử dụng</span>
              <div className="text-xl font-bold text-rose-900 mt-1">
                {(stats.by_condition.find(c => c.condition === 'HONG_NANG')?.count || 0) +
                  (stats.by_condition.find(c => c.condition === 'KHONG_SU_DUNG_DUOC')?.count || 0)}
              </div>
              <span className="text-[11px] text-rose-600">Cần sửa chữa hoặc thanh lý</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Thất lạc: <strong className="text-slate-800">{stats.lost_equipment}</strong> thiết bị</span>
            <button
              onClick={() => onNavigate('inventory')}
              className="text-blue-600 hover:text-blue-700 font-medium underline"
            >
              Xem đợt kiểm kê tài sản
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
