import React, { useState } from 'react';
import { Equipment } from '../../types/index.ts';
import { generateQrCodeSvg, generateBarcode128Svg } from '../../utils/qrCode.ts';
import { Printer, X, Download, Copy, Check, Sparkles, Building2, Calendar, QrCode } from 'lucide-react';

interface EquipmentLabelModalProps {
  equipment: Equipment;
  onClose: () => void;
}

export const EquipmentLabelModal: React.FC<EquipmentLabelModalProps> = ({ equipment, onClose }) => {
  const [labelSize, setLabelSize] = useState<'standard' | 'compact'>('standard');
  const [copied, setCopied] = useState(false);

  const qrPayload = JSON.stringify({
    app: 'CDX-EQUIPMENT',
    id: equipment.id,
    code: equipment.equipment_code,
    name: equipment.name,
    room: equipment.current_room_code
  });

  const qrSvg = generateQrCodeSvg(qrPayload, labelSize === 'standard' ? 120 : 90);
  const barcodeSvg = generateBarcode128Svg(equipment.equipment_code, 44, false);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(equipment.equipment_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      {/* Print-specific style to ensure ONLY the label prints */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-label, #printable-label * {
            visibility: visible;
          }
          #printable-label {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            margin: 0;
            padding: 20px;
            box-shadow: none !important;
            border: 2px solid #000 !important;
          }
        }
      `}</style>

      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">In Tem Tài Sản Cố Định</h3>
              <p className="text-xs text-slate-300">Chuẩn hóa nhãn dán định danh thiết bị theo tiêu chuẩn</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Controls Toolbar */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-600">Kích thước tem:</span>
            <div className="inline-flex rounded-lg border border-slate-300 p-0.5 bg-white">
              <button
                onClick={() => setLabelSize('standard')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  labelSize === 'standard' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Chuẩn (70x45mm)
              </button>
              <button
                onClick={() => setLabelSize('compact')}
                className={`px-3 py-1 rounded-md font-medium transition-all ${
                  labelSize === 'compact' ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Nhỏ (50x30mm)
              </button>
            </div>
          </div>

          <button
            onClick={handleCopyCode}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 hover:bg-white text-slate-700 font-medium transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Đã chép mã' : 'Sao chép mã'}
          </button>
        </div>

        {/* Modal Body / Label Canvas */}
        <div className="p-6 bg-slate-100/70 flex flex-col items-center justify-center">
          <div className="text-xs text-slate-500 mb-2 font-medium">Bản xem trước mẫu in tem thực tế:</div>

          {/* PHYSICAL ASSET DECAL LABEL */}
          <div
            id="printable-label"
            className={`bg-white border-2 border-slate-900 rounded-xl shadow-lg p-4 transition-all text-slate-900 font-sans ${
              labelSize === 'standard' ? 'w-[420px]' : 'w-[340px]'
            }`}
          >
            {/* Header Header */}
            <div className="border-b-2 border-slate-900 pb-2 mb-3 text-center">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-600">
                TRƯỜNG CAO ĐẲNG NGHỀ KỸ THUẬT CÔNG NGHỆ X
              </div>
              <div className="text-xs font-black uppercase text-blue-900 tracking-wide">
                TEM NHẬN DẠNG TÀI SẢN CỐ ĐỊNH
              </div>
            </div>

            {/* Content Row: QR code left, Details right */}
            <div className="flex items-center gap-3">
              {/* QR Code Container */}
              <div className="shrink-0 p-1.5 border border-slate-300 rounded-lg bg-white flex flex-col items-center">
                <div
                  className="w-auto h-auto"
                  dangerouslySetInnerHTML={{ __html: qrSvg }}
                />
                <div className="text-[9px] font-mono font-bold text-slate-500 mt-1">QUÉT TRA CỨU</div>
              </div>

              {/* Asset Information */}
              <div className="flex-1 min-w-0 space-y-1">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Mã thiết bị:</div>
                  <div className="text-sm font-black font-mono text-slate-900 tracking-wider">
                    {equipment.equipment_code}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Tên thiết bị:</div>
                  <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight">
                    {equipment.name}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-200 text-[10px]">
                  <div>
                    <span className="text-slate-500">Phòng: </span>
                    <span className="font-bold text-blue-800">{equipment.current_room_code}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Năm SD: </span>
                    <span className="font-bold">{equipment.entry_date?.slice(0, 4) || equipment.manufacturing_year || '2022'}</span>
                  </div>
                </div>

                <div className="text-[9px] text-slate-500 truncate">
                  Loại: <span className="font-semibold text-slate-700">{equipment.category_name}</span>
                </div>
              </div>
            </div>

            {/* Barcode Footer */}
            <div className="mt-3 pt-2 border-t border-dashed border-slate-300 flex flex-col items-center">
              <div
                className="w-full flex justify-center overflow-hidden"
                dangerouslySetInnerHTML={{ __html: barcodeSvg }}
              />
              <div className="text-[9px] font-mono tracking-widest text-slate-600 font-semibold mt-0.5">
                *{equipment.equipment_code}*
              </div>
            </div>
          </div>

          <p className="text-[11px] text-slate-500 text-center mt-3 max-w-sm">
            Tem được thiết kế để dán trực tiếp lên mặt trước hoặc sườn vỏ thiết bị. Cán bộ và sinh viên có thể dùng camera điện thoại quét để báo hỏng hoặc tra cứu tình trạng.
          </p>
        </div>

        {/* Modal Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
          >
            Đóng
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Printer className="w-4 h-4" />
              In tem ngay (Ctrl + P)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
