// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// PHASE 6: ASSET LIQUIDATION WORKFLOW (QUY TRÌNH THANH LÝ TÀI SẢN CÔNG)
// ==============================================================================
import React, { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  FileCheck,
  Printer,
  Search,
  Filter,
  AlertOctagon,
  DollarSign,
  CheckCircle2,
  Clock,
  Building,
  Users,
  Eye,
  Check,
  X
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { LiquidationRecord, Equipment, EquipmentCondition } from '../../types/index.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const LiquidationView: React.FC = () => {
  const { currentUser } = useAuth();
  const [liquidations, setLiquidations] = useState<LiquidationRecord[]>([]);
  const [damagedEquipment, setDamagedEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'DECISIONS' | 'DAMAGED_LIST'>('DECISIONS');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<LiquidationRecord | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Form State for new liquidation
  const [formDecisionNumber, setFormDecisionNumber] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formCouncilLeader, setFormCouncilLeader] = useState('TS. Lê Văn Tuấn (Hiệu trưởng)');
  const [formMethod, setFormMethod] = useState<'DAU_GIA' | 'HUY_BO' | 'TAN_DUNG_LINH_KIEN' | 'BAN_GIAO_DON_VI_KHAC'>('DAU_GIA');
  const [formRecoveredValue, setFormRecoveredValue] = useState<number>(0);
  const [formSelectedEquipmentIds, setFormSelectedEquipmentIds] = useState<string[]>([]);
  const [formNote, setFormNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [liqData, eqData] = await Promise.all([
        api.getLiquidations(),
        api.getEquipment({ limit: 200 })
      ]);
      setLiquidations(liqData || []);
      // Filter candidates for liquidation: condition is KHONG_SU_DUNG_DUOC or HONG_NANG or status is THANH_LY
      const candidates = (eqData || []).filter(
        e => e.condition === 'KHONG_SU_DUNG_DUOC' || e.condition === 'HONG_NANG' || e.status === 'THANH_LY'
      );
      setDamagedEquipment(candidates);
    } catch (err) {
      console.error('Lỗi tải dữ liệu thanh lý:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const totalDecisions = liquidations.length;
  const totalItemsLiquidated = liquidations.reduce((sum, l) => sum + l.equipment_count, 0);
  const totalOriginalPrice = liquidations.reduce((sum, l) => sum + l.total_original_price, 0);
  const totalRecoveredValue = liquidations.reduce((sum, l) => sum + l.recovered_value, 0);

  const handleCreateLiquidation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formSelectedEquipmentIds.length === 0) {
      alert('Vui lòng chọn ít nhất 1 thiết bị để đưa vào danh mục thanh lý');
      return;
    }

    setSubmitting(true);
    try {
      const selectedItems = damagedEquipment
        .filter(eq => formSelectedEquipmentIds.includes(eq.id))
        .map(eq => ({
          equipment_id: eq.id,
          equipment_code: eq.equipment_code,
          name: eq.name,
          original_price: eq.original_price || 0,
          remaining_value: 0,
          condition: eq.condition,
          reason: eq.note || 'Thiết bị hư hỏng không thể phục hồi'
        }));

      await api.createLiquidation({
        decision_number: formDecisionNumber || `QĐ-${Math.floor(10 + Math.random() * 90)}/QĐ-CĐX`,
        title: formTitle || 'Quyết định thanh lý tài sản hư hỏng',
        council_leader: formCouncilLeader,
        method: formMethod,
        recovered_value: Number(formRecoveredValue) || 0,
        equipment_items: selectedItems,
        note: formNote
      });

      setShowCreateModal(false);
      resetForm();
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Lỗi tạo hồ sơ thanh lý');
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveLiquidation = async (recordId: string) => {
    if (!window.confirm('Xác nhận phê duyệt quyết định thanh lý này? Trạng thái toàn bộ thiết bị liên quan sẽ được chuyển sang THANH LÝ.')) {
      return;
    }
    try {
      const signer = currentUser?.full_name || 'TS. Lê Văn Tuấn (Hiệu trưởng)';
      await api.approveLiquidation(recordId, signer);
      setShowDetailModal(false);
      fetchData();
    } catch (err: any) {
      alert(err.message || 'Lỗi phê duyệt quyết định');
    }
  };

  const resetForm = () => {
    setFormDecisionNumber('');
    setFormTitle('');
    setFormMethod('DAU_GIA');
    setFormRecoveredValue(0);
    setFormSelectedEquipmentIds([]);
    setFormNote('');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getMethodBadge = (method: string) => {
    switch (method) {
      case 'DAU_GIA':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">Bán đấu giá</span>;
      case 'TAN_DUNG_LINH_KIEN':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">Tận dụng linh kiện</span>;
      case 'HUY_BO':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-rose-100 text-rose-800">Tiêu hủy an toàn</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800">Bàn giao đơn vị khác</span>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DA_PHE_DUYET':
      case 'HOAN_TAT':
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
            Đã hoàn tất
          </span>
        );
      case 'CHO_DUYET':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
            <Clock className="w-3.5 h-3.5 mr-1" />
            Chờ phê duyệt
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            <Trash2 className="w-6 h-6 mr-2 text-purple-600" />
            Hội Đồng & Quy Trình Thanh Lý Tài Sản Công
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình thanh lý tài sản nhà nước, tổ chức hội đồng đánh giá và thu hồi kinh phí nộp ngân sách
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Lập Hồ Sơ Thanh Lý</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-purple-50 text-purple-600">
            <FileCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Hồ sơ quyết định</div>
            <div className="text-xl font-bold text-slate-900">{totalDecisions}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-rose-50 text-rose-600">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Thiết bị đã thanh lý</div>
            <div className="text-xl font-bold text-slate-900">{totalItemsLiquidated}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Tổng nguyên giá thanh lý</div>
            <div className="text-base font-bold text-slate-900">{formatCurrency(totalOriginalPrice)}</div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-slate-500 font-medium">Thu hồi nộp ngân sách</div>
            <div className="text-base font-bold text-emerald-600">{formatCurrency(totalRecoveredValue)}</div>
          </div>
        </div>
      </div>

      {/* Tabs Switcher */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="flex border-b border-slate-200 px-4 bg-slate-50/50">
          <button
            onClick={() => setActiveTab('DECISIONS')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'DECISIONS'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Quyết Định & Hồ Sơ Hội Đồng ({liquidations.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('DAMAGED_LIST')}
            className={`py-3.5 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-2 ${
              activeTab === 'DAMAGED_LIST'
                ? 'border-purple-600 text-purple-700 bg-white'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AlertOctagon className="w-4 h-4" />
            <span>Thiết Bị Hỏng Nặng Đề Xuất Thanh Lý ({damagedEquipment.length})</span>
          </button>
        </div>

        {/* Tab 1: Decisions Table */}
        {activeTab === 'DECISIONS' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Số Quyết Định</th>
                  <th className="py-3 px-4">Trích Yếu Quyết Định</th>
                  <th className="py-3 px-4">Ngày Ban Hành</th>
                  <th className="py-3 px-4">Chủ Tịch Hội Đồng</th>
                  <th className="py-3 px-4">Hình Thức</th>
                  <th className="py-3 px-4 text-center">Số TB</th>
                  <th className="py-3 px-4 text-right">Thu Hồi Ngân Sách</th>
                  <th className="py-3 px-4 text-center">Trạng Thái</th>
                  <th className="py-3 px-4 text-center">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {liquidations.map(liq => (
                  <tr key={liq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {liq.decision_number}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs truncate">
                      {liq.title}
                    </td>
                    <td className="py-3 px-4 text-slate-500">{liq.decision_date}</td>
                    <td className="py-3 px-4 text-slate-700">{liq.council_leader}</td>
                    <td className="py-3 px-4">{getMethodBadge(liq.method)}</td>
                    <td className="py-3 px-4 text-center font-bold text-slate-900">
                      {liq.equipment_count}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-emerald-600">
                      {formatCurrency(liq.recovered_value)}
                    </td>
                    <td className="py-3 px-4 text-center">{getStatusBadge(liq.status)}</td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => {
                            setSelectedRecord(liq);
                            setShowDetailModal(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-purple-600 transition-colors"
                          title="Xem chi tiết hồ sơ"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedRecord(liq);
                            setShowPrintModal(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 rounded-md text-slate-600 hover:text-blue-600 transition-colors"
                          title="In Biên bản Hội đồng"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Damaged & Obsolete Equipment */}
        {activeTab === 'DAMAGED_LIST' && (
          <div className="overflow-x-auto">
            <div className="p-4 bg-amber-50/60 border-b border-amber-200 text-xs text-amber-800 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertOctagon className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Danh sách gồm các thiết bị được báo hỏng nặng, không thể sửa chữa hoặc đã khấu hao 100% cần gom vào quyết định thanh lý tiếp theo.
                </span>
              </div>
              <button
                onClick={() => {
                  setFormSelectedEquipmentIds(damagedEquipment.filter(e => e.status !== 'THANH_LY').map(e => e.id));
                  setShowCreateModal(true);
                }}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg text-xs shrink-0 shadow-xs"
              >
                Gom Lập Quyết Định Mới
              </button>
            </div>
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Mã Thiết Bị</th>
                  <th className="py-3 px-4">Tên Thiết Bị</th>
                  <th className="py-3 px-4">Nguyên Giá</th>
                  <th className="py-3 px-4">Tình Trạng</th>
                  <th className="py-3 px-4">Trạng Thái Sổ Sách</th>
                  <th className="py-3 px-4">Ghi Chú Hỏng Hóc</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {damagedEquipment.map(eq => (
                  <tr key={eq.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{eq.equipment_code}</td>
                    <td className="py-3 px-4 font-medium text-slate-900">{eq.name}</td>
                    <td className="py-3 px-4">{formatCurrency(eq.original_price || 0)}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-100 text-rose-800">
                        {eq.condition}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                        eq.status === 'THANH_LY' ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-800'
                      }`}>
                        {eq.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500 max-w-xs truncate">{eq.note || 'Hư hỏng bo mạch, không có linh kiện thay'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL 1: CREATE LIQUIDATION RECORD */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-purple-700 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileCheck className="w-5 h-5" />
                <h3 className="text-base font-bold">Lập Quyết Định & Hồ Sơ Thanh Lý Tài Sản Công</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLiquidation} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Số Quyết Định <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: QĐ-25/QĐ-CĐX"
                    value={formDecisionNumber}
                    onChange={e => setFormDecisionNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hình Thức Thanh Lý <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formMethod}
                    onChange={e => setFormMethod(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="DAU_GIA">Bán đấu giá công khai</option>
                    <option value="TAN_DUNG_LINH_KIEN">Rã xác tận dụng linh kiện</option>
                    <option value="HUY_BO">Hủy bỏ / Tiêu hủy theo quy định</option>
                    <option value="BAN_GIAO_DON_VI_KHAC">Bàn giao điều chuyển cơ sở khác</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Trích Yếu Quyết Định <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Về việc thanh lý tài sản hư hỏng không thể phục hồi đợt 1 năm 2026"
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Chủ Tịch Hội Đồng Thanh Lý
                  </label>
                  <input
                    type="text"
                    value={formCouncilLeader}
                    onChange={e => setFormCouncilLeader(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Dự Kiến Thu Hồi Nộp Ngân Sách (VNĐ)
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="100000"
                    value={formRecoveredValue}
                    onChange={e => setFormRecoveredValue(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* Equipment Selection List */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Chọn Thiết Bị Đưa Vào Quyết Định ({formSelectedEquipmentIds.length} đã chọn)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (formSelectedEquipmentIds.length === damagedEquipment.length) {
                        setFormSelectedEquipmentIds([]);
                      } else {
                        setFormSelectedEquipmentIds(damagedEquipment.map(d => d.id));
                      }
                    }}
                    className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                  >
                    {formSelectedEquipmentIds.length === damagedEquipment.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
                  </button>
                </div>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100 p-2 text-xs">
                  {damagedEquipment.length === 0 ? (
                    <div className="py-4 text-center text-slate-400">Không có thiết bị hỏng nặng nào</div>
                  ) : (
                    damagedEquipment.map(eq => (
                      <label key={eq.id} className="flex items-center space-x-3 py-1.5 px-2 hover:bg-slate-50 rounded-md cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formSelectedEquipmentIds.includes(eq.id)}
                          onChange={e => {
                            if (e.target.checked) {
                              setFormSelectedEquipmentIds([...formSelectedEquipmentIds, eq.id]);
                            } else {
                              setFormSelectedEquipmentIds(formSelectedEquipmentIds.filter(id => id !== eq.id));
                            }
                          }}
                          className="rounded-sm border-slate-300 text-purple-600 focus:ring-purple-500"
                        />
                        <span className="font-mono font-bold text-slate-900">{eq.equipment_code}</span>
                        <span className="flex-1 text-slate-700 truncate">{eq.name}</span>
                        <span className="text-slate-500">{formatCurrency(eq.original_price || 0)}</span>
                      </label>
                    ))
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi Chú & Căn Cứ Pháp Lý</label>
                <textarea
                  rows={2}
                  placeholder="Căn cứ Luật Quản lý, sử dụng tài sản công và kết luận của Hội đồng kiểm kê thực địa..."
                  value={formNote}
                  onChange={e => setFormNote(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-xs"
                >
                  {submitting ? 'Đang Xử Lý...' : 'Ban Hành Hồ Sơ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: DETAIL & APPROVAL */}
      {showDetailModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="font-mono text-xs text-purple-300">{selectedRecord.decision_number}</span>
                <h3 className="text-sm font-bold text-white mt-0.5">{selectedRecord.title}</h3>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs text-slate-700">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[11px]">Chủ tịch hội đồng:</span>
                  <span className="font-semibold text-slate-900">{selectedRecord.council_leader}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Hình thức thanh lý:</span>
                  {getMethodBadge(selectedRecord.method)}
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Tổng nguyên giá:</span>
                  <span className="font-semibold text-slate-900">{formatCurrency(selectedRecord.total_original_price)}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Kinh phí thu hồi:</span>
                  <span className="font-semibold text-emerald-600">{formatCurrency(selectedRecord.recovered_value)}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Danh mục thiết bị trong quyết định ({selectedRecord.equipment_items.length}):</h4>
                <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-lg divide-y divide-slate-100">
                  {selectedRecord.equipment_items.map((item, idx) => (
                    <div key={idx} className="p-2.5 flex items-center justify-between">
                      <div>
                        <div className="font-mono font-bold text-slate-900">{item.equipment_code}</div>
                        <div className="text-slate-600">{item.name}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">{formatCurrency(item.original_price)}</div>
                        <div className="text-slate-400 text-[11px]">{item.reason}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {selectedRecord.status === 'CHO_DUYET' && (
                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                  <div className="text-amber-800">
                    <span className="font-semibold block">Hồ sơ đang chờ Ban Giám hiệu ký duyệt</span>
                    <span className="text-[11px]">Sau khi duyệt, hệ thống sẽ tự động chuyển trạng thái các thiết bị sang THANH LÝ.</span>
                  </div>
                  <button
                    onClick={() => handleApproveLiquidation(selectedRecord.id)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl text-xs shrink-0 shadow-xs"
                  >
                    Ký Duyệt Ngay
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: PRINTABLE OFFICIAL COUNCIL PROTOCOL */}
      {showPrintModal && selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            <div className="px-6 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between print:hidden">
              <span className="font-bold text-xs text-slate-700">Xem trước văn bản in (Chuẩn thể thức cơ quan nhà nước)</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center space-x-1"
                >
                  <Printer className="w-4 h-4" />
                  <span>In Văn Bản</span>
                </button>
                <button
                  onClick={() => setShowPrintModal(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Official Vietnamese Government Administrative Document Layout */}
            <div className="p-10 font-serif text-slate-900 text-sm leading-relaxed space-y-6 bg-white">
              {/* Header */}
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xs uppercase font-bold">ỦY BAN NHÂN DÂN TỈNH / BỘ GD&ĐT</div>
                  <div className="text-xs font-bold uppercase underline">TRƯỜNG CAO ĐẲNG X</div>
                  <div className="text-xs mt-1">Số: {selectedRecord.decision_number}</div>
                </div>
                <div>
                  <div className="text-xs uppercase font-bold">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</div>
                  <div className="text-xs font-bold underline">Độc lập - Tự do - Hạnh phúc</div>
                  <div className="text-xs italic mt-1">Hà Nội, ngày {selectedRecord.decision_date.slice(8, 10)} tháng {selectedRecord.decision_date.slice(5, 7)} năm {selectedRecord.decision_date.slice(0, 4)}</div>
                </div>
              </div>

              {/* Title */}
              <div className="text-center pt-4">
                <h2 className="text-base font-bold uppercase tracking-wide">BIÊN BẢN HỌP HỘI ĐỒNG THANH LÝ TÀI SẢN CÔNG</h2>
                <p className="text-xs italic mt-1">(Về việc thanh lý, xử lý tài sản hư hỏng, hết niên hạn sử dụng)</p>
              </div>

              {/* Body */}
              <div className="space-y-3 text-xs">
                <p><strong>I. THÀNH PHẦN HỘI ĐỒNG GỒM CÓ:</strong></p>
                <ul className="list-disc pl-6 space-y-1">
                  <li>Ông/Bà: <strong>{selectedRecord.council_leader}</strong> - Chủ tịch Hội đồng.</li>
                  {selectedRecord.council_members.map((member, i) => (
                    <li key={i}>Ông/Bà: <strong>{member}</strong></li>
                  ))}
                </ul>

                <p className="pt-2"><strong>II. NỘI DUNG VÀ KẾT QUẢ ĐÁNH GIÁ HIỆN TRẠNG TÀI SẢN:</strong></p>
                <p>Hội đồng đã tiến hành kiểm tra thực tế tình trạng kỹ thuật, đối chiếu hồ sơ sổ sách kế toán của danh mục <strong>{selectedRecord.equipment_count}</strong> thiết bị, thống nhất phương án xử lý theo hình thức: <strong>{selectedRecord.method === 'DAU_GIA' ? 'Bán đấu giá' : 'Tận dụng linh kiện / Tiêu hủy'}</strong>.</p>

                {/* Items Table */}
                <table className="w-full border-collapse border border-slate-400 mt-2 text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-center font-bold">
                      <th className="border border-slate-400 p-2">STT</th>
                      <th className="border border-slate-400 p-2">Mã TB</th>
                      <th className="border border-slate-400 p-2">Tên tài sản / Thiết bị</th>
                      <th className="border border-slate-400 p-2">Nguyên giá</th>
                      <th className="border border-slate-400 p-2">Tình trạng thực tế</th>
                      <th className="border border-slate-400 p-2">Đề xuất xử lý</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRecord.equipment_items.map((item, i) => (
                      <tr key={i}>
                        <td className="border border-slate-400 p-2 text-center">{i + 1}</td>
                        <td className="border border-slate-400 p-2 font-mono font-bold">{item.equipment_code}</td>
                        <td className="border border-slate-400 p-2">{item.name}</td>
                        <td className="border border-slate-400 p-2 text-right">{formatCurrency(item.original_price)}</td>
                        <td className="border border-slate-400 p-2">{item.reason}</td>
                        <td className="border border-slate-400 p-2 text-center">Thanh lý</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="pt-2">
                  <strong>Tổng giá trị dự kiến thu hồi nộp ngân sách: </strong>
                  <span className="font-bold">{formatCurrency(selectedRecord.recovered_value)}</span>
                </div>
              </div>

              {/* Signatures */}
              <div className="grid grid-cols-3 gap-4 text-center pt-8 text-xs">
                <div>
                  <div className="font-bold uppercase">ĐẠI DIỆN BỘ PHẬN SỬ DỤNG</div>
                  <div className="italic text-[11px]">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16"></div>
                </div>
                <div>
                  <div className="font-bold uppercase">PHÒNG KẾ HOẠCH TÀI CHÍNH</div>
                  <div className="italic text-[11px]">(Ký và ghi rõ họ tên)</div>
                  <div className="h-16"></div>
                </div>
                <div>
                  <div className="font-bold uppercase">CHỦ TỊCH HỘI ĐỒNG</div>
                  <div className="italic text-[11px]">(Ký, đóng dấu và ghi rõ họ tên)</div>
                  <div className="h-16 flex items-center justify-center font-bold text-slate-800">
                    {selectedRecord.signed_by || selectedRecord.council_leader}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
