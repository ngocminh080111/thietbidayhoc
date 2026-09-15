// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// DAMAGE REPORTS & INCIDENT MANAGEMENT VIEW
// ==============================================================================
import React, { useState, useEffect } from 'react';
import { AlertTriangle, Plus, CheckCircle, Clock, ShieldAlert, Wrench, Check } from 'lucide-react';
import { DamageReport, Equipment, Room, ReportSeverity, ReportStatus } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

interface DamagesViewProps {
  initialEquipment?: Equipment | null;
}

export const DamagesView: React.FC<DamagesViewProps> = ({ initialEquipment }) => {
  const { currentUser, canManageEquipment } = useAuth();
  const [reports, setReports] = useState<DamageReport[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [severity, setSeverity] = useState<ReportSeverity>('TRUNG_BINH');

  const loadData = async () => {
    setLoading(true);
    try {
      const [rData, eqData, rmData] = await Promise.all([
        api.getDamageReports(),
        api.getEquipment(),
        api.getRooms()
      ]);
      setReports(rData);
      setEquipmentList(eqData);
      setRooms(rmData);

      if (initialEquipment) {
        setSelectedEqId(initialEquipment.id);
        setShowModal(true);
      } else if (eqData.length) {
        setSelectedEqId(eqData[0].id);
      }
    } catch (err) {
      console.error('Lỗi tải danh sách báo hỏng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialEquipment]);

  const handleCreateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId || !description) {
      alert('Vui lòng chọn thiết bị và nhập mô tả sự cố.');
      return;
    }

    try {
      await api.createDamageReport({
        equipment_id: selectedEqId,
        issue_description: description,
        severity,
        reported_by_name: currentUser?.full_name || 'Giảng viên'
      });
      setShowModal(false);
      setDescription('');
      loadData();
    } catch (err: any) {
      alert(`Lỗi tạo báo hỏng: ${err.message}`);
    }
  };

  const handleStatusChange = async (reportId: string, newStatus: ReportStatus) => {
    try {
      await api.updateDamageReportStatus(reportId, newStatus);
      loadData();
    } catch (err: any) {
      alert(`Lỗi cập nhật trạng thái: ${err.message}`);
    }
  };

  const getSeverityBadge = (sev: ReportSeverity) => {
    switch (sev) {
      case 'KHAN_CAP':
        return <span className="px-2 py-0.5 text-xs font-bold rounded bg-rose-100 text-rose-800 border border-rose-200">Khẩn cấp</span>;
      case 'CAO':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 text-orange-800">Cao</span>;
      case 'TRUNG_BINH':
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-amber-100 text-amber-800">Trung bình</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium rounded bg-slate-100 text-slate-700">Thấp</span>;
    }
  };

  const getStatusBadge = (st: ReportStatus) => {
    switch (st) {
      case 'MOI_BAO':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">Mới báo</span>;
      case 'DA_TIEP_NHAN':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200">Đã tiếp nhận</span>;
      case 'DANG_XU_LY':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">Đang xử lý</span>;
      case 'DA_SUA':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Đã sửa xong</span>;
      case 'DA_DONG':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">Đã đóng</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">Không sửa được</span>;
    }
  };

  return (
    <div id="damages-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Tiếp nhận & Xử lý Báo hỏng Thiết bị</h2>
          <p className="text-xs text-slate-500">
            Kênh phản hồi sự cố kỹ thuật từ giảng viên và các phòng bộ môn
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="flex items-center space-x-1.5 px-4 py-2 bg-rose-600 text-white text-xs font-semibold rounded-lg hover:bg-rose-700 shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Gửi báo hỏng sự cố</span>
        </button>
      </div>

      {/* REPORT LIST */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã Phiếu</th>
                <th className="py-3 px-4">Thời gian</th>
                <th className="py-3 px-4">Thiết bị</th>
                <th className="py-3 px-4">Phòng học</th>
                <th className="py-3 px-4">Mô tả Sự cố</th>
                <th className="py-3 px-4">Mức độ</th>
                <th className="py-3 px-4">Tiến độ</th>
                {canManageEquipment && <th className="py-3 px-4 text-center">Cập nhật</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Đang tải danh sách báo hỏng...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không có sự cố nào đang chờ xử lý.
                  </td>
                </tr>
              ) : (
                reports.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-rose-700">
                      {r.report_code}
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(r.reported_at).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{r.equipment_code}</div>
                      <div className="text-[11px] text-slate-500">{r.equipment_name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{r.room_code}</span>
                      <div className="text-[11px] text-slate-400">{r.room_name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-800 max-w-xs">
                      {r.issue_description}
                      <div className="text-[10px] text-slate-400 mt-0.5">Báo bởi: {r.reported_by_name}</div>
                    </td>
                    <td className="py-3 px-4">{getSeverityBadge(r.severity)}</td>
                    <td className="py-3 px-4">{getStatusBadge(r.status)}</td>
                    {canManageEquipment && (
                      <td className="py-3 px-4 text-center">
                        <select
                          value={r.status}
                          onChange={e => handleStatusChange(r.id, e.target.value as ReportStatus)}
                          className="text-[11px] py-1 px-2 rounded border border-slate-200 bg-white"
                        >
                          <option value="MOI_BAO">Mới báo</option>
                          <option value="DA_TIEP_NHAN">Đã tiếp nhận</option>
                          <option value="DANG_XU_LY">Đang xử lý</option>
                          <option value="DA_SUA">Đã sửa xong</option>
                          <option value="DA_DONG">Đã đóng phiếu</option>
                        </select>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Gửi Báo hỏng Thiết bị
            </h3>
            <form onSubmit={handleCreateReport} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn Thiết bị gặp sự cố *</label>
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
                <label className="block font-semibold text-slate-700 mb-1">Mức độ Nghiêm trọng</label>
                <select
                  value={severity}
                  onChange={e => setSeverity(e.target.value as ReportSeverity)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="THAP">Thấp (Chưa ảnh hưởng việc học)</option>
                  <option value="TRUNG_BINH">Trung bình (Ảnh hưởng một phần)</option>
                  <option value="CAO">Cao (Gián đoạn buổi học)</option>
                  <option value="KHAN_CAP">Khẩn cấp (Cháy chập, mất an toàn)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mô tả hiện tượng lỗi chi tiết *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Ví dụ: Máy tính bật không lên nguồn, máy chiếu kêu rè hoặc chớp tắt..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
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
                  className="px-4 py-2 bg-rose-600 text-white font-semibold rounded-lg hover:bg-rose-700"
                >
                  Gửi phiếu báo hỏng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
