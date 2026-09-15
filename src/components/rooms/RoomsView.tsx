// ==============================================================================
// HỆ THỐNG QUẢN LÝ THIẾT BỊ TRƯỜNG CAO ĐẲNG X
// ROOMS & FACILITIES VIEW
// ==============================================================================
import React, { useState, useEffect } from 'react';
import {
  Building2,
  Search,
  Plus,
  Box,
  Users,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Room, Department } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import { useAuth } from '../../contexts/AuthContext.tsx';

export const RoomsView: React.FC = () => {
  const { canManageEquipment } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [buildingFilter, setBuildingFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [search, setSearch] = useState('');

  // New room modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState<Partial<Room>>({
    code: '',
    name: '',
    room_type: 'LY_THUYET',
    building: 'Tòa A',
    floor: 1,
    capacity: 40,
    status: 'HOAT_DONG'
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [roomData, deptData] = await Promise.all([
        api.getRooms(),
        api.getDepartments()
      ]);
      setRooms(roomData);
      setDepartments(deptData);
    } catch (err) {
      console.error('Lỗi tải danh mục phòng:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createRoom(formData);
      setShowModal(false);
      setFormData({
        code: '',
        name: '',
        room_type: 'LY_THUYET',
        building: 'Tòa A',
        floor: 1,
        capacity: 40,
        status: 'HOAT_DONG'
      });
      loadData();
    } catch (err: any) {
      alert(`Lỗi thêm phòng: ${err.message}`);
    }
  };

  const getRoomTypeLabel = (type: string) => {
    switch (type) {
      case 'LY_THUYET': return 'Phòng Lý thuyết';
      case 'PHONG_MAY': return 'Phòng Máy tính';
      case 'THUC_HANH': return 'Phòng Thực hành';
      case 'THI_NGHIEM': return 'Phòng Thí nghiệm';
      case 'XUONG': return 'Xưởng Thực hành';
      case 'KHO': return 'Kho Thiết bị';
      default: return 'Khác';
    }
  };

  const filteredRooms = rooms.filter(r => {
    if (buildingFilter && r.building !== buildingFilter) return false;
    if (typeFilter && r.room_type !== typeFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      return r.code.toLowerCase().includes(q) || r.name.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div id="rooms-view" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản lý Phòng học & Cơ sở Thực hành</h2>
          <p className="text-xs text-slate-500">
            Hệ thống gồm <strong className="text-slate-900">{rooms.length}</strong> phòng học, phòng máy, phòng lab và xưởng gia công
          </p>
        </div>

        {canManageEquipment && (
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center space-x-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm phòng mới</span>
          </button>
        )}
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Tìm theo mã phòng (A101, PM101...) hoặc tên phòng"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-hidden"
          />
        </div>

        <select
          value={buildingFilter}
          onChange={e => setBuildingFilter(e.target.value)}
          className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-white"
        >
          <option value="">-- Tất cả tòa nhà --</option>
          <option value="Tòa A">Tòa A (Giảng đường & Lý thuyết)</option>
          <option value="Tòa B">Tòa B (Công nghệ Thông tin & Kho)</option>
          <option value="Tòa C">Tòa C (Điện - Thí nghiệm)</option>
          <option value="Khu Xưởng">Khu Xưởng Cơ khí & Ô tô</option>
        </select>

        <select
          value={typeFilter}
          onChange={e => setTypeFilter(e.target.value)}
          className="text-xs py-1.5 px-3 rounded-lg border border-slate-200 bg-white"
        >
          <option value="">-- Loại phòng --</option>
          <option value="PHONG_MAY">Phòng Máy tính</option>
          <option value="THUC_HANH">Phòng Thực hành</option>
          <option value="XUONG">Xưởng Thực hành</option>
          <option value="THI_NGHIEM">Phòng Thí nghiệm</option>
          <option value="LY_THUYET">Phòng Lý thuyết</option>
          <option value="KHO">Kho Thiết bị</option>
        </select>
      </div>

      {/* ROOMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(room => (
          <div
            key={room.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs hover:shadow-sm transition-all space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-200">
                  {room.code}
                </span>
                <h3 className="font-bold text-slate-900 text-sm mt-1.5">{room.name}</h3>
              </div>
              <span className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                room.status === 'HOAT_DONG' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {room.status === 'HOAT_DONG' ? 'Hoạt động' : 'Bảo trì'}
              </span>
            </div>

            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-400">Vị trí:</span>
                <span className="font-medium text-slate-800">{room.building} - Tầng {room.floor}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Phân loại:</span>
                <span className="font-medium text-slate-800">{getRoomTypeLabel(room.room_type)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Khoa phụ trách:</span>
                <span className="font-medium text-slate-800 truncate max-w-[180px]">{room.department_name || 'Dùng chung'}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-1 text-blue-700 font-bold text-xs">
                <Box className="w-4 h-4" />
                <span>{room.total_equipment || 0} Thiết bị</span>
              </div>
              <div className="flex items-center space-x-1 text-slate-500 text-xs">
                <Users className="w-3.5 h-3.5" />
                <span>{room.capacity} chỗ</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CREATE ROOM MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
            <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100">
              Thêm mới Phòng / Cơ sở
            </h3>
            <form onSubmit={handleCreateRoom} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mã phòng *</label>
                  <input
                    type="text"
                    required
                    placeholder="PM301"
                    value={formData.code || ''}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tòa nhà *</label>
                  <select
                    value={formData.building || 'Tòa A'}
                    onChange={e => setFormData({ ...formData, building: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="Tòa A">Tòa A</option>
                    <option value="Tòa B">Tòa B</option>
                    <option value="Tòa C">Tòa C</option>
                    <option value="Khu Xưởng">Khu Xưởng</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tên phòng / xưởng *</label>
                <input
                  type="text"
                  required
                  placeholder="Phòng Máy tính Trí tuệ nhân tạo PM301"
                  value={formData.name || ''}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Loại phòng</label>
                  <select
                    value={formData.room_type || 'LY_THUYET'}
                    onChange={e => setFormData({ ...formData, room_type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  >
                    <option value="PHONG_MAY">Phòng Máy tính</option>
                    <option value="THUC_HANH">Phòng Thực hành</option>
                    <option value="XUONG">Xưởng Thực hành</option>
                    <option value="THI_NGHIEM">Phòng Thí nghiệm</option>
                    <option value="LY_THUYET">Phòng Lý thuyết</option>
                    <option value="KHO">Kho Thiết bị</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sức chứa (người)</label>
                  <input
                    type="number"
                    value={formData.capacity || 40}
                    onChange={e => setFormData({ ...formData, capacity: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
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
                  Lưu phòng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
