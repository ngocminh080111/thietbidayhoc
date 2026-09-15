import React, { useState, useEffect } from 'react';
import { AuditLog } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Eye,
  FileSpreadsheet,
  Clock,
  User,
  ArrowRight,
  Database,
  Lock,
  ArrowRightLeft,
  PlusCircle,
  Edit3,
  Trash2,
  CheckCircle2,
  XCircle,
  FileDown
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const AuditLogsView: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [selectedAction, setSelectedAction] = useState<string>('ALL');
  const [selectedEntity, setSelectedEntity] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Detail Modal
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getAuditLogs({
        action: selectedAction,
        entity_type: selectedEntity,
        search: searchTerm,
        limit: 100
      });
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [selectedAction, selectedEntity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  // Export audit logs to Excel
  const handleExportExcel = () => {
    if (logs.length === 0) {
      alert('Không có nhật ký nào để xuất file.');
      return;
    }

    const exportData = logs.map((log, idx) => ({
      'STT': idx + 1,
      'Thời gian': new Date(log.created_at).toLocaleString('vi-VN'),
      'Người thực hiện': log.user_name || 'Hệ thống',
      'Email': log.user_email || '',
      'Hành động': log.action,
      'Đối tượng': log.entity_type,
      'Mô tả đối tượng': log.entity_name || log.entity_id,
      'Địa chỉ IP': log.ip_address || '',
      'Dữ liệu cũ': log.old_data ? JSON.stringify(log.old_data) : '',
      'Dữ liệu mới': log.new_data ? JSON.stringify(log.new_data) : ''
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Nhat_Ky_Kiem_Toan');
    XLSX.writeFile(workbook, `Nhat_Ky_Kiem_Toan_CaoDangX_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // Metrics
  const loginCount = logs.filter(l => l.action === 'LOGIN').length;
  const transferCount = logs.filter(l => l.action === 'TRANSFER').length;
  const mutateCount = logs.filter(l => l.action === 'CREATE' || l.action === 'UPDATE' || l.action === 'DELETE').length;

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'LOGIN':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"><Lock className="w-3 h-3" /> Đăng nhập</span>;
      case 'CREATE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800"><PlusCircle className="w-3 h-3" /> Tạo mới</span>;
      case 'UPDATE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800"><Edit3 className="w-3 h-3" /> Cập nhật</span>;
      case 'DELETE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800"><Trash2 className="w-3 h-3" /> Xóa</span>;
      case 'TRANSFER':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-800"><ArrowRightLeft className="w-3 h-3" /> Điều chuyển</span>;
      case 'IMPORT':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-800"><Database className="w-3 h-3" /> Nhập Excel</span>;
      case 'STATUS_CHANGE':
        return <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800"><RefreshCw className="w-3 h-3" /> Đổi trạng thái</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-800">{action}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200 uppercase tracking-wide">
              An toàn thông tin & Pháp lý
            </span>
            <span className="text-xs text-slate-400 font-mono">Bảng 13: audit_logs (RLS Enforced)</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Nhật Ký Kiểm Toán & Truy Vết Hệ Thống
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Ghi nhận toàn bộ thao tác thêm, sửa, xóa, điều chuyển tài sản công và phiên đăng nhập của người dùng theo quy định bảo mật.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchLogs}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Xuất Nhật Ký (.xlsx)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-slate-500 uppercase">Tổng hành động ghi nhận</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{logs.length}</div>
          <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
            <Clock className="w-3 h-3" /> Cập nhật thời gian thực
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-blue-700 uppercase">Phiên đăng nhập</div>
          <div className="text-2xl font-black text-blue-900 mt-1">{loginCount}</div>
          <div className="text-[11px] text-blue-600 mt-1">Xác thực tài khoản người dùng</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-indigo-700 uppercase">Điều chuyển vị trí</div>
          <div className="text-2xl font-black text-indigo-900 mt-1">{transferCount}</div>
          <div className="text-[11px] text-indigo-600 mt-1">Bàn giao & di dời giữa các phòng</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="text-xs font-semibold text-amber-700 uppercase">Biến động dữ liệu</div>
          <div className="text-2xl font-black text-amber-900 mt-1">{mutateCount}</div>
          <div className="text-[11px] text-amber-600 mt-1">Thao tác tạo / sửa / xóa tài sản</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            Lọc theo hành động:
          </div>
          <select
            value={selectedAction}
            onChange={(e) => setSelectedAction(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="ALL">Tất cả hành động</option>
            <option value="LOGIN">Đăng nhập (LOGIN)</option>
            <option value="CREATE">Tạo mới (CREATE)</option>
            <option value="UPDATE">Cập nhật (UPDATE)</option>
            <option value="DELETE">Xóa (DELETE)</option>
            <option value="TRANSFER">Điều chuyển (TRANSFER)</option>
            <option value="STATUS_CHANGE">Đổi trạng thái (STATUS_CHANGE)</option>
            <option value="IMPORT">Nhập Excel (IMPORT)</option>
          </select>

          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="ALL">Tất cả đối tượng</option>
            <option value="EQUIPMENT">Thiết bị</option>
            <option value="ROOM">Phòng máy / Kho</option>
            <option value="DAMAGE_REPORT">Phiếu báo hỏng</option>
            <option value="MAINTENANCE">Phiếu bảo trì</option>
            <option value="AUTH">Xác thực tài khoản</option>
          </select>
        </div>

        {/* Search input */}
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên, email, thiết bị, IP..."
              className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-64 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            Tìm
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            Đang truy vấn dữ liệu nhật ký kiểm toán...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 text-xs font-medium">
            {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Không tìm thấy bản ghi nhật ký kiểm toán phù hợp với bộ lọc.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Thời gian</th>
                  <th className="p-4">Người thực hiện</th>
                  <th className="p-4">Hành động</th>
                  <th className="p-4">Đối tượng tác động</th>
                  <th className="p-4">Địa chỉ IP</th>
                  <th className="p-4 text-center">Chi tiết</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono text-slate-600 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-800 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {log.user_name || 'Hệ thống'}
                      </div>
                      {log.user_email && (
                        <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                          {log.user_email}
                        </div>
                      )}
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      {getActionBadge(log.action)}
                    </td>

                    <td className="p-4">
                      <div className="font-semibold text-slate-900 line-clamp-1">
                        {log.entity_name || log.entity_id}
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Loại: {log.entity_type} • ID: {log.entity_id?.slice(0, 13)}...
                      </div>
                    </td>

                    <td className="p-4 font-mono text-slate-500 whitespace-nowrap">
                      {log.ip_address || '127.0.0.1'}
                    </td>

                    <td className="p-4 text-center whitespace-nowrap">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        Xem Diff
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Diff / Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm text-white">Chi Tiết Biến Động Kiểm Toán (Audit Diff)</h3>
              </div>
              <button
                onClick={() => setSelectedLog(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-500 block">Thời gian:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {new Date(selectedLog.created_at).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">Hành động:</span>
                  <div className="mt-0.5">{getActionBadge(selectedLog.action)}</div>
                </div>
                <div>
                  <span className="text-slate-500 block">Người thực hiện:</span>
                  <span className="font-bold text-slate-800">{selectedLog.user_name || 'Hệ thống'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">IP Client:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedLog.ip_address}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-slate-700 block mb-1">Đối tượng tác động:</span>
                <div className="p-2.5 bg-slate-100 rounded-lg font-mono text-[11px] text-slate-800">
                  {selectedLog.entity_name} ({selectedLog.entity_type} #{selectedLog.entity_id})
                </div>
              </div>

              {/* Old Data vs New Data */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="border border-rose-200 rounded-xl p-3 bg-rose-50/50">
                  <div className="font-bold text-rose-800 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500" />
                    Dữ liệu trước thay đổi (Old):
                  </div>
                  {selectedLog.old_data ? (
                    <pre className="p-2 bg-white rounded border border-rose-200 text-[10px] font-mono text-rose-900 overflow-x-auto max-h-48 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.old_data, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-slate-400 italic text-[11px] p-2">Không có (Tạo mới hoặc không áp dụng)</div>
                  )}
                </div>

                <div className="border border-emerald-200 rounded-xl p-3 bg-emerald-50/50">
                  <div className="font-bold text-emerald-800 mb-1 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Dữ liệu sau thay đổi (New):
                  </div>
                  {selectedLog.new_data ? (
                    <pre className="p-2 bg-white rounded border border-emerald-200 text-[10px] font-mono text-emerald-900 overflow-x-auto max-h-48 whitespace-pre-wrap">
                      {JSON.stringify(selectedLog.new_data, null, 2)}
                    </pre>
                  ) : (
                    <div className="text-slate-400 italic text-[11px] p-2">Không có (Bị xóa)</div>
                  )}
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedLog(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
