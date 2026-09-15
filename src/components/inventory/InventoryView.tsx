// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// INVENTORY & ASSET AUDITING VIEW
// ==============================================================================
import React, { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, CheckCircle2, XCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { InventorySession, InventoryItem } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const InventoryView: React.FC = () => {
  const { canManageEquipment, currentUser } = useAuth();
  const [sessions, setSessions] = useState<InventorySession[]>([]);
  const [selectedSession, setSelectedSession] = useState<InventorySession | null>(null);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New session modal
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [scope, setScope] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      const sData = await api.getInventorySessions();
      setSessions(sData);
      if (sData.length && !selectedSession) {
        setSelectedSession(sData[0]);
        const iData = await api.getInventoryItems(sData[0].id);
        setItems(iData);
      }
    } catch (err) {
      console.error('Lỗi tải đợt kiểm kê:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSelectSession = async (session: InventorySession) => {
    setSelectedSession(session);
    try {
      const iData = await api.getInventoryItems(session.id);
      setItems(iData);
    } catch (err) {
      console.error('Lỗi tải chi tiết đợt kiểm kê:', err);
    }
  };

  const handleCreateSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const newSess = await api.createInventorySession({
        title,
        scope_description: scope,
        created_by_name: currentUser?.full_name || 'Ban Kiểm kê Tài sản'
      });
      setShowModal(false);
      setTitle('');
      setScope('');
      await loadData();
      handleSelectSession(newSess);
    } catch (err: any) {
      alert(`Lỗi tạo đợt kiểm kê: ${err.message}`);
    }
  };

  const getResultBadge = (res: string) => {
    switch (res) {
      case 'CO_THUC_TE':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">Khớp thực tế</span>;
      case 'KHONG_CO':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-100 text-rose-800">Thất lạc / Thiếu</span>;
      case 'CO_NHUNG_SAI_VI_TRI':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800">Sai vị trí</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700">{res}</span>;
    }
  };

  return (
    <div id="inventory-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Kiểm kê Tài sản & Đối soát Thiết bị</h2>
          <p className="text-xs text-slate-500">
            Tổ chức kiểm đếm định kỳ, phát hiện sai lệch thực tế so với hồ sơ sổ sách
          </p>
        </div>

        {canManageEquipment && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Mở đợt kiểm kê mới</span>
          </button>
        )}
      </div>

      {/* SESSIONS SELECTOR */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map(s => {
          const isSelected = selectedSession?.id === s.id;
          return (
            <div
              key={s.id}
              onClick={() => handleSelectSession(s)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-blue-500 bg-blue-50/50 shadow-xs ring-1 ring-blue-500'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <span className="font-mono text-xs font-bold text-blue-700">{s.session_code}</span>
                <span className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                  s.status === 'HOAN_THANH' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {s.status === 'HOAN_THANH' ? 'Đã hoàn thành' : 'Đang diễn ra'}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{s.title}</h3>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">{s.scope_description}</p>

              <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-200/60 text-center text-xs">
                <div className="p-1.5 bg-slate-100/80 rounded">
                  <div className="text-slate-400 text-[10px]">Sổ sách</div>
                  <div className="font-bold text-slate-800">{s.total_expected || 0}</div>
                </div>
                <div className="p-1.5 bg-emerald-50 rounded">
                  <div className="text-emerald-600 text-[10px]">Trùng khớp</div>
                  <div className="font-bold text-emerald-800">{s.total_match || 0}</div>
                </div>
                <div className="p-1.5 bg-amber-50 rounded">
                  <div className="text-amber-600 text-[10px]">Sai phòng</div>
                  <div className="font-bold text-amber-800">{s.total_misplaced || 0}</div>
                </div>
                <div className="p-1.5 bg-rose-50 rounded">
                  <div className="text-rose-600 text-[10px]">Thất lạc</div>
                  <div className="font-bold text-rose-800">{s.total_missing || 0}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* SELECTED SESSION DETAIL TABLE */}
      {selectedSession && (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs space-y-3 p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Danh sách Kiểm đếm Chi tiết: {selectedSession.title}
            </h3>
            <span className="text-xs text-slate-500">
              Đã ghi nhận <strong className="text-slate-900">{items.length}</strong> kết quả kiểm tra
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Mã Thiết bị</th>
                  <th className="py-2.5 px-3">Tên Thiết bị</th>
                  <th className="py-2.5 px-3">Phòng Sổ sách</th>
                  <th className="py-2.5 px-3">Phòng Thực tế</th>
                  <th className="py-2.5 px-3">Kết quả Đối soát</th>
                  <th className="py-2.5 px-3">Ghi chú đối soát</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-slate-400">
                      Chưa có thiết bị nào được ghi nhận trong đợt này.
                    </td>
                  </tr>
                ) : (
                  items.map(it => (
                    <tr key={it.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-blue-700">
                        {it.equipment_code}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-900">
                        {it.equipment_name}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {it.expected_room_code}
                      </td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">
                        {it.actual_room_code || 'Chưa kiểm'}
                      </td>
                      <td className="py-2.5 px-3">{getResultBadge(it.check_result)}</td>
                      <td className="py-2.5 px-3 text-slate-500 italic">{it.note || 'Bình thường'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Khởi tạo Đợt Kiểm kê Thiết bị
            </h3>
            <form onSubmit={handleCreateSession} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên đợt kiểm kê *</label>
                <input
                  type="text"
                  required
                  placeholder="Kiểm kê tài sản cuối năm học..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Phạm vi kiểm kê</label>
                <textarea
                  rows={3}
                  placeholder="Ví dụ: Toàn bộ phòng máy tính Tòa B và phòng thí nghiệm Tòa C..."
                  value={scope}
                  onChange={e => setScope(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Mở đợt kiểm kê
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
