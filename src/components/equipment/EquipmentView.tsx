// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// EQUIPMENT MANAGEMENT VIEW
// ==============================================================================
import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowLeftRight,
  AlertTriangle,
  Eye,
  Building2,
  Tag,
  CheckCircle2,
  Clock,
  XCircle,
  HelpCircle,
  Wrench,
  Download,
  QrCode,
  Printer,
  FileSpreadsheet,
  ScanLine
} from 'lucide-react';
import { Equipment, EquipmentCategory, Room } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';
import { EquipmentLabelModal } from './EquipmentLabelModal.tsx';
import { BatchLabelPrintModal } from './BatchLabelPrintModal.tsx';
import { ExcelImportExportModal } from './ExcelImportExportModal.tsx';
import { EquipmentQRScannerModal } from './EquipmentQRScannerModal.tsx';

interface EquipmentViewProps {
  onOpenTransferModal?: (equipment: Equipment) => void;
  onOpenDamageReportModal?: (equipment: Equipment) => void;
}

export const EquipmentView: React.FC<EquipmentViewProps> = ({
  onOpenTransferModal,
  onOpenDamageReportModal
}) => {
  const { canManageEquipment } = useAuth();
  const [equipmentList, setEquipmentList] = useState<Equipment[]>([]);
  const [categories, setCategories] = useState<EquipmentCategory[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('');
  const [selectedRoom, setSelectedRoom] = useState('');
  const [selectedCondition, setSelectedCondition] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Selected for detail modal
  const [detailItem, setDetailItem] = useState<Equipment | null>(null);

  // Phase 5 Modals
  const [labelEquipment, setLabelEquipment] = useState<Equipment | null>(null);
  const [showBatchPrint, setShowBatchPrint] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);

  // Create/Edit modal state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Equipment>>({
    name: '',
    category_id: '',
    current_room_id: '',
    original_price: 10000000,
    condition: 'TOT',
    status: 'DANG_SU_DUNG',
    model: '',
    serial_number: '',
    manufacturer: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [eqData, catData, roomData] = await Promise.all([
        api.getEquipment({
          search: search || undefined,
          category_id: selectedCat || undefined,
          room_id: selectedRoom || undefined,
          condition: selectedCondition || undefined,
          status: selectedStatus || undefined
        }),
        api.getCategories(),
        api.getRooms()
      ]);
      setEquipmentList(eqData);
      setCategories(catData);
      setRooms(roomData);

      if (catData.length && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: catData[0].id }));
      }
      if (roomData.length && !formData.current_room_id) {
        setFormData(prev => ({ ...prev, current_room_id: roomData[0].id }));
      }
    } catch (err) {
      console.error('Lỗi tải danh mục thiết bị:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [selectedCat, selectedRoom, selectedCondition, selectedStatus]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createEquipment(formData);
      setShowCreateModal(false);
      setFormData({
        name: '',
        category_id: categories[0]?.id || '',
        current_room_id: rooms[0]?.id || '',
        original_price: 10000000,
        condition: 'TOT',
        status: 'DANG_SU_DUNG'
      });
      loadData();
    } catch (err: any) {
      alert(`Lỗi tạo thiết bị: ${err.message}`);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(val);
  };

  const getConditionBadge = (c: string) => {
    switch (c) {
      case 'TOT':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">Tốt</span>;
      case 'BINH_THUONG':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-blue-100 text-blue-800">Bình thường</span>;
      case 'CAN_THEO_DOI':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-100 text-amber-800">Cần theo dõi</span>;
      case 'HONG_NHE':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-orange-100 text-orange-800">Hỏng nhẹ</span>;
      case 'HONG_NANG':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-100 text-rose-800">Hỏng nặng</span>;
      case 'KHONG_SU_DUNG_DUOC':
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-200 text-slate-800">Ngừng sử dụng</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-semibold rounded bg-slate-100 text-slate-700">{c}</span>;
    }
  };

  const getStatusBadge = (s: string) => {
    switch (s) {
      case 'DANG_SU_DUNG':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Đang sử dụng</span>;
      case 'TRONG_KHO':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-100 text-slate-700 border border-slate-200">Trong kho</span>;
      case 'DANG_SUA_CHUA':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200">Đang sửa chữa</span>;
      case 'THANH_LY':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200">Thanh lý</span>;
      case 'MAT':
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200">Thất lạc</span>;
      default:
        return <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-slate-50 text-slate-600 border border-slate-200">{s}</span>;
    }
  };

  return (
    <div id="equipment-view" className="space-y-6">
      {/* HEADER & ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý Danh mục Thiết bị</h2>
          <p className="text-xs text-slate-500">
            Tổng số: <strong className="text-slate-900">{equipmentList.length}</strong> thiết bị đang hiển thị
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick QR Scanner */}
          <button
            onClick={() => setShowQRScanner(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors shadow-2xs"
          >
            <ScanLine className="w-4 h-4 text-blue-600" />
            <span>Quét QR tra cứu</span>
          </button>

          {/* Excel Import / Export */}
          <button
            onClick={() => setShowExcelModal(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-lg border border-emerald-200 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Nhập / Xuất Excel</span>
          </button>

          {/* Batch Print Labels */}
          <button
            onClick={() => setShowBatchPrint(true)}
            className="flex items-center space-x-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg border border-slate-300 transition-colors shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>In tem hàng loạt A4</span>
          </button>

          {canManageEquipment && (
            <button
              id="create-equipment-btn"
              onClick={() => setShowCreateModal(true)}
              className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm mới thiết bị</span>
            </button>
          )}
        </div>
      </div>

      {/* FILTER & SEARCH PANEL */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo mã thiết bị (TB-...), tên thiết bị, số serial, model..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:border-blue-500 bg-slate-50 focus:bg-white transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-800 text-white text-xs font-medium rounded-lg hover:bg-slate-900 transition-colors"
          >
            Tìm kiếm
          </button>
        </form>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-2 border-t border-slate-100">
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="">-- Tất cả nhóm thiết bị --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>

          <select
            value={selectedRoom}
            onChange={e => setSelectedRoom(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="">-- Tất cả phòng & xưởng --</option>
            {rooms.map(r => (
              <option key={r.id} value={r.id}>{r.code} - {r.name}</option>
            ))}
          </select>

          <select
            value={selectedCondition}
            onChange={e => setSelectedCondition(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="">-- Tình trạng kỹ thuật --</option>
            <option value="TOT">Tốt</option>
            <option value="BINH_THUONG">Bình thường</option>
            <option value="CAN_THEO_DOI">Cần theo dõi</option>
            <option value="HONG_NHE">Hỏng nhẹ</option>
            <option value="HONG_NANG">Hỏng nặng</option>
            <option value="KHONG_SU_DUNG_DUOC">Ngừng sử dụng</option>
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden"
          >
            <option value="">-- Trạng thái vận hành --</option>
            <option value="DANG_SU_DUNG">Đang sử dụng</option>
            <option value="TRONG_KHO">Trong kho</option>
            <option value="DANG_SUA_CHUA">Đang sửa chữa</option>
            <option value="THANH_LY">Thanh lý</option>
            <option value="MAT">Thất lạc</option>
          </select>
        </div>
      </div>

      {/* EQUIPMENT TABLE */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Mã Thiết bị</th>
                <th className="py-3 px-4">Tên Thiết bị</th>
                <th className="py-3 px-4">Nhóm Tài sản</th>
                <th className="py-3 px-4">Vị trí Hiện tại</th>
                <th className="py-3 px-4">Tình trạng</th>
                <th className="py-3 px-4">Trạng thái</th>
                <th className="py-3 px-4 text-right">Nguyên giá</th>
                <th className="py-3 px-4 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Đang tải dữ liệu thiết bị...
                  </td>
                </tr>
              ) : equipmentList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Không tìm thấy thiết bị nào khớp với tiêu chí tìm kiếm.
                  </td>
                </tr>
              ) : (
                equipmentList.map(eq => (
                  <tr key={eq.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 font-mono font-semibold text-blue-700">
                      {eq.equipment_code}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-900 max-w-xs">
                      <div>{eq.name}</div>
                      <div className="text-[11px] text-slate-400">{eq.model || eq.serial_number || 'N/A'}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-600">{eq.category_name}</td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{eq.current_room_code}</span>
                      <div className="text-[11px] text-slate-400">{eq.building}</div>
                    </td>
                    <td className="py-3 px-4">{getConditionBadge(eq.condition)}</td>
                    <td className="py-3 px-4">{getStatusBadge(eq.status)}</td>
                    <td className="py-3 px-4 text-right font-medium text-slate-800">
                      {formatCurrency(eq.original_price)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setDetailItem(eq)}
                          title="Xem chi tiết thiết bị"
                          className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setLabelEquipment(eq)}
                          title="In tem dán nhận diện (QR + Barcode)"
                          className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        {canManageEquipment && (
                          <button
                            onClick={() => onOpenTransferModal && onOpenTransferModal(eq)}
                            title="Điều chuyển phòng"
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded"
                          >
                            <ArrowLeftRight className="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => onOpenDamageReportModal && onOpenDamageReportModal(eq)}
                          title="Báo hỏng thiết bị"
                          className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded"
                        >
                          <AlertTriangle className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600">{detailItem.equipment_code}</span>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">{detailItem.name}</h3>
              </div>
              <button
                onClick={() => setDetailItem(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 py-4 text-xs">
              <div>
                <span className="text-slate-400">Nhóm thiết bị:</span>
                <p className="font-semibold text-slate-800">{detailItem.category_name}</p>
              </div>
              <div>
                <span className="text-slate-400">Vị trí hiện tại:</span>
                <p className="font-semibold text-slate-800">{detailItem.current_room_code} - {detailItem.current_room_name}</p>
              </div>
              <div>
                <span className="text-slate-400">Tình trạng kỹ thuật:</span>
                <div className="mt-1">{getConditionBadge(detailItem.condition)}</div>
              </div>
              <div>
                <span className="text-slate-400">Trạng thái vận hành:</span>
                <div className="mt-1">{getStatusBadge(detailItem.status)}</div>
              </div>
              <div>
                <span className="text-slate-400">Model / Serial:</span>
                <p className="font-mono text-slate-800">{detailItem.model || 'N/A'} / {detailItem.serial_number || 'N/A'}</p>
              </div>
              <div>
                <span className="text-slate-400">Hãng sản xuất / Năm:</span>
                <p className="text-slate-800">{detailItem.manufacturer || 'N/A'} ({detailItem.manufacturing_year || 'N/A'})</p>
              </div>
              <div>
                <span className="text-slate-400">Nguyên giá:</span>
                <p className="font-bold text-slate-900">{formatCurrency(detailItem.original_price)}</p>
              </div>
              <div>
                <span className="text-slate-400">Hạn bảo hành:</span>
                <p className="text-slate-800">{detailItem.warranty_expiry || 'Hết hạn'}</p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                type="button"
                onClick={() => {
                  const currentEq = detailItem;
                  setDetailItem(null);
                  setLabelEquipment(currentEq);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200 transition-colors"
              >
                <QrCode className="w-3.5 h-3.5" />
                In tem decal nhận dạng
              </button>
              <button
                onClick={() => setDetailItem(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE EQUIPMENT MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Thêm mới Thiết bị Đào tạo
            </h3>
            <form onSubmit={handleCreateSubmit} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên thiết bị *</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Máy chiếu Panasonic PT-LB386"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nhóm thiết bị *</label>
                  <select
                    value={formData.category_id || ''}
                    onChange={e => setFormData({ ...formData, category_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Phòng / Xưởng bố trí *</label>
                  <select
                    value={formData.current_room_id || ''}
                    onChange={e => setFormData({ ...formData, current_room_id: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>{r.code} - {r.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Model</label>
                  <input
                    type="text"
                    placeholder="PT-LB386"
                    value={formData.model || ''}
                    onChange={e => setFormData({ ...formData, model: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Số Serial</label>
                  <input
                    type="text"
                    placeholder="SN-PANA-386-01"
                    value={formData.serial_number || ''}
                    onChange={e => setFormData({ ...formData, serial_number: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Hãng sản xuất</label>
                  <input
                    type="text"
                    placeholder="Panasonic"
                    value={formData.manufacturer || ''}
                    onChange={e => setFormData({ ...formData, manufacturer: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nguyên giá (VNĐ)</label>
                  <input
                    type="number"
                    value={formData.original_price || 0}
                    onChange={e => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
                >
                  Lưu thiết bị
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PHASE 5: EQUIPMENT LABEL MODAL (SINGLE QR/BARCODE) */}
      {labelEquipment && (
        <EquipmentLabelModal
          equipment={labelEquipment}
          onClose={() => setLabelEquipment(null)}
        />
      )}

      {/* PHASE 5: BATCH LABEL PRINT MODAL (A4 MULTI-GRID) */}
      {showBatchPrint && (
        <BatchLabelPrintModal
          equipmentList={equipmentList}
          rooms={rooms}
          onClose={() => setShowBatchPrint(false)}
        />
      )}

      {/* PHASE 5: EXCEL IMPORT & EXPORT MODAL */}
      {showExcelModal && (
        <ExcelImportExportModal
          equipmentList={equipmentList}
          rooms={rooms}
          categories={categories}
          onClose={() => setShowExcelModal(false)}
          onImportSuccess={() => {
            loadData();
          }}
        />
      )}

      {/* PHASE 5: QR SCANNER MODAL */}
      {showQRScanner && (
        <EquipmentQRScannerModal
          onClose={() => setShowQRScanner(false)}
          onSelectEquipment={(eq) => {
            setShowQRScanner(false);
            setDetailItem(eq);
          }}
        />
      )}
    </div>
  );
};
