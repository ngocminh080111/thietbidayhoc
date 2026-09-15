// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// MAINTENANCE & REPAIR MANAGEMENT VIEW
// ==============================================================================
import React, { useState, useEffect } from 'react';
import { Wrench, Plus, CheckCircle2, AlertCircle, Banknote } from 'lucide-react';
import { MaintenanceRecord, Equipment } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const MaintenanceView: React.FC = () => {
  const { canManageEquipment, currentUser } = useAuth();
  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState('');
  const [serviceProvider, setServiceProvider] = useState('Tổ Bảo trì Trường Cao đẳng X');
  const [repairDetails, setRepairDetails] = useState('');
  const [replacedComponents, setReplacedComponents] = useState('');
  const [cost, setCost] = useState(0);

  const loadData = async () => {
    setLoading(true);
    try {
      const [mData, eqData] = await Promise.all([
        api.getMaintenanceRecords(),
        api.getEquipment()
      ]);
      setRecords(mData);
      setEquipmentList(eqData);
      if (eqData.length) setSelectedEqId(eqData[0].id);
    } catch (err) {
      console.error('Lỗi tải hồ sơ bảo trì:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateMaintenance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEqId || !repairDetails) {
      alert('Vui lòng chọn thiết bị và nhập nội dung sửa chữa.');
      return;
    }

    try {
      await api.createMaintenanceRecord({
        equipment_id: selectedEqId,
        service_provider: serviceProvider,
        repair_details: repairDetails,
        replaced_components: replacedComponents,
        cost: Number(cost),
        result: 'THANH_CONG',
        recorded_by_name: currentUser?.full_name || 'Cán bộ Thiết bị'
      });
      setShowModal(false);
      setRepairDetails('');
      setReplacedComponents('');
      setCost(0);
      loadData();
    } catch (err: any) {
      alert(`Lỗi lưu hồ sơ bảo dưỡng: ${err.message}`);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const totalCost = records.reduce((acc, r) => acc + (r.cost || 0), 0);

  return (
    <div id="maintenance-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hồ sơ Bảo dưỡng & Sửa chữa Thiết bị</h2>
          <p className="text-xs text-slate-500">
            Theo dõi nhật ký chi phí, đơn vị thi công và linh kiện thay thế
          </p>
        </div>

        {canManageEquipment && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Ghi nhận sửa chữa / bảo trì</span>
          </button>
        )}
      </div>

      {/* COST SUMMARY CARD */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg">
            <Banknote className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500">Tổng chi phí sửa chữa / bảo dưỡng thực tế:</div>
            <div className="text-xl font-bold text-slate-900">{formatCurrency(totalCost)}</div>
          </div>
        </div>
        <div className="text-xs text-slate-500">
          Tổng số: <strong className="text-slate-800">{records.length}</strong> đợt bảo trì
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã Phiếu</th>
                <th className="py-3 px-4">Ngày hoàn thành</th>
                <th className="py-3 px-4">Thiết bị</th>
                <th className="py-3 px-4">Đơn vị sửa chữa</th>
                <th className="py-3 px-4">Nội dung kỹ thuật</th>
                <th className="py-3 px-4">Linh kiện thay thế</th>
                <th className="py-3 px-4 text-right">Chi phí</th>
                <th className="py-3 px-4 text-center">Kết quả</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Đang tải hồ sơ bảo trì...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Chưa có hồ sơ sửa chữa nào được ghi nhận.
                  </td>
                </tr>
              ) : (
                records.map(r => (
                  <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-blue-700">
                      {r.maintenance_code}
                    </td>
                    <td className="py-3 px-4 text-slate-500 font-mono">
                      {r.completion_date}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{r.equipment_code}</div>
                      <div className="text-[11px] text-slate-500">{r.equipment_name}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {r.service_provider}
                    </td>
                    <td className="py-3 px-4 text-slate-800 max-w-xs">
                      {r.repair_details}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {r.replaced_components || 'Không thay linh kiện'}
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      {formatCurrency(r.cost)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="px-2 py-0.5 text-[11px] font-semibold rounded bg-emerald-100 text-emerald-800">
                        Thành công
                      </span>
                    </td>
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
              Ghi nhận Bảo dưỡng / Sửa chữa
            </h3>
            <form onSubmit={handleCreateMaintenance} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chọn Thiết bị *</label>
                <select
                  value={selectedEqId}
                  onChange={e => setSelectedEqId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  {equipmentList.map(eq => (
                    <option key={eq.id} value={eq.id}>
                      {eq.equipment_code} - {eq.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Đơn vị thực hiện *</label>
                <input
                  type="text"
                  required
                  value={serviceProvider}
                  onChange={e => setServiceProvider(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nội dung sửa chữa *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="Ví dụ: Thay bộ nguồn máy vi tính, vệ sinh quạt tản nhiệt..."
                  value={repairDetails}
                  onChange={e => setRepairDetails(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Linh kiện thay thế (nếu có)</label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguồn Dell 260W 80 Plus"
                  value={replacedComponents}
                  onChange={e => setReplacedComponents(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Chi phí (VNĐ)</label>
                <input
                  type="number"
                  value={cost}
                  onChange={e => setCost(Number(e.target.value))}
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
                  Lưu hồ sơ sửa chữa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
