// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// PHASE 6: VENDOR & WARRANTY PARTNER MANAGEMENT
// ==============================================================================
import React, { useState, useEffect } from 'react';
import {
  Truck,
  Plus,
  Phone,
  Mail,
  MapPin,
  Star,
  ShieldCheck,
  Search,
  ExternalLink,
  Edit2,
  FileText,
  X
} from 'lucide-react';
import { api } from '../../services/api.ts';
import { Vendor } from '../../types/index.ts';

export const VendorsView: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Form State
  const [formCode, setFormCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formTaxCode, setFormTaxCode] = useState('');
  const [formContactPerson, setFormContactPerson] = useState('');
  const [formPhone, setFormPhone] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formAddress, setFormAddress] = useState('');
  const [formRating, setFormRating] = useState(5.0);
  const [formNotes, setFormNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchVendors = async () => {
    setLoading(true);
    try {
      const data = await api.getVendors();
      setVendors(data || []);
    } catch (err) {
      console.error('Lỗi tải danh sách nhà cung cấp:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const handleCreateVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.createVendor({
        code: formCode || `NCC-${Math.floor(100 + Math.random() * 900)}`,
        name: formName,
        tax_code: formTaxCode,
        contact_person: formContactPerson,
        phone: formPhone,
        email: formEmail,
        address: formAddress,
        rating: Number(formRating) || 5,
        notes: formNotes
      });
      setShowAddModal(false);
      resetForm();
      fetchVendors();
    } catch (err: any) {
      alert(err.message || 'Lỗi thêm nhà cung cấp');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormCode('');
    setFormName('');
    setFormTaxCode('');
    setFormContactPerson('');
    setFormPhone('');
    setFormEmail('');
    setFormAddress('');
    setFormRating(5.0);
    setFormNotes('');
  };

  const filteredVendors = vendors.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.contact_person.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center">
            <Truck className="w-6 h-6 mr-2 text-indigo-600" />
            Nhà Cung Cấp & Đơn Vị Bảo Trì Ủy Quyền
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Quản trị danh bạ đối tác cung ứng thiết bị giảng dạy, đường dây nóng bảo hành và hợp đồng dịch vụ
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Nhà Cung Cấp</span>
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 shrink-0" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên nhà cung cấp, mã đối tác, người phụ trách kỹ thuật..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
        />
      </div>

      {/* Grid of Vendor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredVendors.map(vendor => (
          <div
            key={vendor.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-5 flex flex-col justify-between"
          >
            <div>
              {/* Card Top */}
              <div className="flex items-start justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-mono text-[11px] font-bold rounded-md">
                  {vendor.code}
                </span>
                <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold bg-amber-50 px-2 py-0.5 rounded-full">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{vendor.rating.toFixed(1)}</span>
                </div>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-snug mb-2 line-clamp-2">
                {vendor.name}
              </h3>

              {vendor.tax_code && (
                <div className="text-[11px] text-slate-500 mb-3">
                  MST: <span className="font-mono font-medium text-slate-700">{vendor.tax_code}</span>
                </div>
              )}

              {/* Contact Details */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-[11px] shrink-0">Đại diện:</span>
                  <span className="font-semibold text-slate-800 truncate">{vendor.contact_person}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`tel:${vendor.phone}`} className="text-blue-600 hover:underline font-medium">
                    {vendor.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <a href={`mailto:${vendor.email}`} className="text-slate-700 hover:underline truncate">
                    {vendor.email}
                  </a>
                </div>
                <div className="flex items-start space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="text-slate-500 text-[11px] line-clamp-2">{vendor.address}</span>
                </div>
              </div>
            </div>

            {/* Bottom stats & action */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-1.5 text-xs text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>
                  <strong className="text-slate-900">{vendor.equipment_count || 0}</strong> thiết bị
                </span>
              </div>
              <a
                href={`tel:${vendor.phone}`}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-lg transition-colors flex items-center space-x-1"
              >
                <Phone className="w-3 h-3 text-emerald-600" />
                <span>Gọi Hotline</span>
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: ADD VENDOR */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95">
            <div className="px-6 py-4 bg-indigo-600 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Truck className="w-5 h-5" />
                <h3 className="text-base font-bold">Thêm Hồ Sơ Nhà Cung Cấp / Đối Tác Bảo Hành</h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVendor} className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mã Nhà Cung Cấp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="VD: NCC-HP, NCC-PANASONIC"
                    value={formCode}
                    onChange={e => setFormCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mã Số Thuế</label>
                  <input
                    type="text"
                    placeholder="VD: 0101778163"
                    value={formTaxCode}
                    onChange={e => setFormTaxCode(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên Công Ty / Doanh Nghiệp <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Công ty Cổ phần / TNHH..."
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Người Đại Diện Kỹ Thuật</label>
                  <input
                    type="text"
                    placeholder="Họ và tên người phụ trách"
                    value={formContactPerson}
                    onChange={e => setFormContactPerson(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hotline / Điện Thoại <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="1800 xxxx hoặc 09xx xxx xxx"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Email Tiếp Nhận Bảo Hành</label>
                  <input
                    type="email"
                    placeholder="support@company.com"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Đánh Giá Uy Tín (1 - 5 sao)</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    step="0.1"
                    value={formRating}
                    onChange={e => setFormRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Địa Chỉ Trụ Sở / Trung Tâm Bảo Hành</label>
                <input
                  type="text"
                  placeholder="Địa chỉ văn phòng giao dịch hoặc trung tâm kỹ thuật"
                  value={formAddress}
                  onChange={e => setFormAddress(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Ghi Chú Về Gói Thầu / Hợp Đồng</label>
                <textarea
                  rows={2}
                  placeholder="Gói thầu mua sắm máy móc năm 2024, bảo hành 3 năm tận nơi..."
                  value={formNotes}
                  onChange={e => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-xs"
                >
                  {submitting ? 'Đang Lưu...' : 'Lưu Nhà Cung Cấp'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
