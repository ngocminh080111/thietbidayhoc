// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// TRANSFERS HISTORY & DISPATCH VIEW
// ==============================================================================
import React, { useState, useEffect } from 'react';
import { ArrowLeftRight, Plus, Calendar, Building2, Box } from 'lucide-react';
import { EquipmentTransfer, Equipment, Room } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

interface TransfersViewProps {
  initialEquipment?: Equipment | null;
}

export const TransfersView: React.FC<TransfersViewProps> = ({ initialEquipment }) => {
  const { currentUser, canManageEquipment } = useAuth();
  const [transfers, setTransfers] = useState<EquipmentTransfer[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Transfer modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState<string>('');
  const [targetRoomId, setTargetRoomId] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const [tData, eqData, roomData] = await Promise.all([
        api.getTransfers(),
        api.getEquipment(),
        api.getRooms()
      ]);
      setTransfers(tData);
      setEquipmentList(eqData);
      setRooms(roomData);

      if (initialEquipment) {
        setSelectedEqId(initialEquipment.id);
        setShowModal(true);
      } else if (eqData.length) {
        setSelectedEqId(eqData[0].id);
      }
      if (roomData.length) {
        setTargetRoomId(roomData[0].id);
      }
    } catch (err) {
      console.error('Lỗi tải lịch sử điều chuyển:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialEquipment]);

  const handleCreateTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId || !targetRoomId || !reason) {
      alert('Vui lòng điền đầy đủ thiết bị, phòng chuyển đến và lý do.');
      return;
    }

    try {
      await api.createTransfer({
        equipment_id: selectedEqId,
        to_room_id: targetRoomId,
        reason,
        transferred_by_name: currentUser?.full_name || 'Cán bộ Quản lý Thiết bị'
      });
      setShowModal(false);
      setReason('');
      loadData();
    } catch (err: any) {
      alert(`Lỗi thực hiện điều chuyển: ${err.message}`);
    }
  };

  return (
    <div id="transfers-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Nhật ký Lịch sử Điều chuyển Thiết bị</h2>
          <p className="text-xs text-slate-500">
            Hồ sơ bất biến ghi nhận mọi lần di chuyển tài sản giữa các phòng, xưởng và kho
          </p>
        </div>

        {canManageEquipment && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Tạo phiếu điều chuyển mới</span>
          </button>
        )}
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Mã Thiết bị</th>
                <th className="py-3 px-4">Tên Thiết bị</th>
                <th className="py-3 px-4">Từ phòng</th>
                <th className="py-3 px-4">Đến phòng</th>
                <th className="py-3 px-4">Người thực hiện</th>
                <th className="py-3 px-4">Lý do điều chuyển</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Đang tải lịch sử điều chuyển...
                  </td>
                </tr>
              ) : transfers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Chưa có hồ sơ điều chuyển nào.
                  </td>
                </tr>
              ) : (
                transfers.map(t => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-500">
                      {new Date(t.transfer_date).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {t.equipment_code}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs">
                      {t.equipment_name}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <span className="font-semibold text-slate-800">{t.from_room_code}</span>
                      <div className="text-[11px] text-slate-400">{t.from_room_name}</div>
                    </td>
                    <td className="py-3 px-4 text-emerald-700 font-semibold">
                      <span className="font-semibold text-emerald-800">{t.to_room_code}</span>
                      <div className="text-[11px] text-emerald-600">{t.to_room_name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">{t.transferred_by_name}</td>
                    <td className="py-3 px-4 text-slate-600 italic">{t.reason}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TRANSFER MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Lập Phiếu Điều chuyển Thiết bị
            </h3>
            <form onSubmit={handleCreateTransfer} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn Thiết bị cần chuyển *</label>
                <select
                  value={selectedEqId}
                  onChange={e => setSelectedEqId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {equipmentList.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.equipment_code} - {eq.name} (Tại {eq.current_room_code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chuyển đến Phòng / Xưởng *</label>
                <select
                  value={targetRoomId}
                  onChange={e => setTargetRoomId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      {r.code} - {r.name} ({r.building})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Lý do điều chuyển *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Cấp phát bổ sung phục vụ kỳ thi tay nghề khoa CNTT..."
                  value={reason}
                  onChange={e => setReason(e.target.value)}
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
                  Xác nhận điều chuyển
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
