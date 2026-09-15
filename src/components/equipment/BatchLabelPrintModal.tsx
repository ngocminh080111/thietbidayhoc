import React, { useState } from 'react';
import { Equipment, Room } from '../../types/index.ts';
import { generateQrCodeSvg, generateBarcode128Svg } from '../../utils/qrCode.ts';
import { Printer, X, CheckSquare, Square, Filter, Layers, Building2 } from 'lucide-react';

interface BatchLabelPrintModalProps {
  equipmentList: Equipment[];
  rooms: Room[];
  selectedRoomId?: string;
  onClose: () => void;
}

export const BatchLabelPrintModal: React.FC<BatchLabelPrintModalProps> = ({
  equipmentList,
  rooms,
  selectedRoomId: initialRoomId,
  onClose
}) => {
  const [filterRoomId, setFilterRoomId] = useState<string>(initialRoomId || 'ALL');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(() => {
    // Default select items belonging to the filtered room or first 12 items
    const filtered = initialRoomId && initialRoomId !== 'ALL'
      ? equipmentList.filter(e => e.current_room_id === initialRoomId)
      : equipmentList.slice(0, 12);
    return new Set(filtered.map(e => e.id));
  });

  const displayedEquipment = equipmentList.filter(e => {
    if (filterRoomId === 'ALL') return true;
    return e.current_room_id === filterRoomId;
  });

  const handleToggleSelectAll = () => {
    if (selectedIds.size === displayedEquipment.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(displayedEquipment.map(e => e.id)));
    }
  };

  const handleToggleItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  const itemsToPrint = displayedEquipment.filter(e => selectedIds.has(e.id));

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-sheet, #printable-sheet * {
            visibility: visible;
          }
          #printable-sheet {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: auto;
            margin: 0;
            padding: 10mm;
            background: white !important;
          }
          .label-card {
            break-inside: avoid;
            page-break-inside: avoid;
            margin-bottom: 5mm;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">In Tem Hàng Loạt Khổ A4</h3>
              <p className="text-xs text-slate-300">Dàn trang tự động in decal nhiều tem cùng lúc cho phòng máy</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter & Selection Bar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-slate-500" />
              <span className="font-medium text-slate-700">Chọn phòng:</span>
            </div>
            <select
              value={filterRoomId}
              onChange={(e) => {
                const newRoomId = e.target.value;
                setFilterRoomId(newRoomId);
                const items = newRoomId === 'ALL'
                  ? equipmentList.slice(0, 12)
                  : equipmentList.filter(eq => eq.current_room_id === newRoomId);
                setSelectedIds(new Set(items.map(eq => eq.id)));
              }}
              className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white font-medium text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">Tất cả các phòng ({equipmentList.length} thiết bị)</option>
              {rooms.map(r => (
                <option key={r.id} value={r.id}>
                  {r.code} - {r.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleToggleSelectAll}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-medium"
            >
              {selectedIds.size === displayedEquipment.length ? (
                <CheckSquare className="w-3.5 h-3.5 text-blue-600" />
              ) : (
                <Square className="w-3.5 h-3.5 text-slate-400" />
              )}
              {selectedIds.size === displayedEquipment.length ? 'Bỏ chọn tất cả' : 'Chọn tất cả phòng này'}
            </button>
          </div>

          <div className="text-xs font-semibold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Đã chọn: {itemsToPrint.length} / {displayedEquipment.length} tem
          </div>
        </div>

        {/* Printable Grid Preview */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
          <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
            <span>Khung xem trước trang in A4 (Lưới 2 cột x N hàng chuẩn Decal):</span>
            <span>Bấm vào từng tem để bật/tắt in</span>
          </div>

          <div
            id="printable-sheet"
            className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-xl border border-slate-300 shadow-sm"
          >
            {displayedEquipment.map(eq => {
              const isSelected = selectedIds.has(eq.id);
              const qrSvg = generateQrCodeSvg(
                JSON.stringify({ app: 'CDX', code: eq.equipment_code }),
                90
              );
              const barcodeSvg = generateBarcode128Svg(eq.equipment_code, 36, false);

              return (
                <div
                  key={eq.id}
                  onClick={() => handleToggleItem(eq.id)}
                  className={`label-card cursor-pointer border-2 rounded-xl p-3 relative transition-all ${
                    isSelected
                      ? 'border-slate-800 bg-white shadow-xs'
                      : 'border-dashed border-slate-300 opacity-40 bg-slate-50'
                  }`}
                >
                  {/* Selection Badge on screen */}
                  <div className="absolute top-2 right-2 print:hidden">
                    {isSelected ? (
                      <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <CheckSquare className="w-3.5 h-3.5" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-full border border-slate-300 bg-white" />
                    )}
                  </div>

                  {/* Institution Title */}
                  <div className="border-b border-slate-900 pb-1 mb-2 text-center">
                    <div className="text-[8px] font-bold uppercase text-slate-600">
                      TRƯỜNG CAO ĐẲNG X - TEM TÀI SẢN
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* QR Code */}
                    <div
                      className="shrink-0 p-1 border border-slate-200 rounded-sm bg-white"
                      dangerouslySetInnerHTML={{ __html: qrSvg }}
                    />

                    {/* Meta */}
                    <div className="flex-1 min-w-0 space-y-0.5 text-slate-900">
                      <div className="text-[9px] text-slate-500 uppercase font-semibold">Mã thiết bị:</div>
                      <div className="text-xs font-black font-mono text-blue-900">{eq.equipment_code}</div>
                      <div className="text-[11px] font-bold line-clamp-1">{eq.name}</div>
                      <div className="text-[9px] text-slate-600 flex justify-between">
                        <span>Phòng: <b>{eq.current_room_code}</b></span>
                        <span>Năm: <b>{eq.entry_date?.slice(0, 4) || eq.manufacturing_year || '2022'}</b></span>
                      </div>
                    </div>
                  </div>

                  {/* Barcode bottom */}
                  <div className="mt-2 pt-1 border-t border-dashed border-slate-300 flex justify-center">
                    <div dangerouslySetInnerHTML={{ __html: barcodeSvg }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
          >
            Đóng
          </button>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">
              Sẽ in <b>{itemsToPrint.length}</b> tem
            </span>
            <button
              type="button"
              disabled={itemsToPrint.length === 0}
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              In toàn bộ {itemsToPrint.length} tem đã chọn
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
