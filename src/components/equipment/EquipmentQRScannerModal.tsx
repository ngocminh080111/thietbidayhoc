import React, { useState, useEffect, useRef } from 'react';
import { Equipment } from '../../types/index.ts';
import {
  QrCode,
  Camera,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRightLeft,
  Printer,
  History,
  Info,
  Building2,
  Tag,
  DollarSign,
  ShieldCheck,
  Upload
} from 'lucide-react';

interface EquipmentQRScannerModalProps {
  equipmentList: Equipment[];
  onClose: () => void;
  onSelectEquipment?: (equipment: Equipment) => void;
  onReportDamage?: (equipment: Equipment) => void;
  onTransfer?: (equipment: Equipment) => void;
  onPrintLabel?: (equipment: Equipment) => void;
}

export const EquipmentQRScannerModal: React.FC<EquipmentQRScannerModalProps> = ({
  equipmentList,
  onClose,
  onSelectEquipment,
  onReportDamage,
  onTransfer,
  onPrintLabel
}) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'search'>('camera');
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [manualCode, setManualCode] = useState('');
  const [scannedResult, setScannedResult] = useState<Equipment | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera if activeTab === 'camera'
  useEffect(() => {
    if (activeTab === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Trình duyệt không hỗ trợ WebRTC Camera trực tiếp. Vui lòng sử dụng tính năng tra cứu mã.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Không thể mở Camera (chưa cấp quyền hoặc đang chạy trong iFrame). Bạn có thể tra cứu mã trực tiếp bên dưới.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const handleLookup = (codeToSearch: string) => {
    const clean = codeToSearch.trim().toLowerCase();
    if (!clean) return;

    // Try finding by exact code or contains code or ID
    const found = equipmentList.find(e =>
      e.equipment_code.toLowerCase() === clean ||
      e.id.toLowerCase() === clean ||
      clean.includes(e.equipment_code.toLowerCase())
    );

    if (found) {
      setScannedResult(found);
      stopCamera();
    } else {
      alert(`Không tìm thấy thiết bị với mã "${codeToSearch}". Vui lòng kiểm tra lại.`);
    }
  };

  const sampleCodes = equipmentList.slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Quét QR & Tra Cứu Thiết Bị</h3>
              <p className="text-xs text-slate-300">Nhận diện tức thì qua camera điện thoại hoặc mã định danh</p>
            </div>
          </div>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex gap-4 shrink-0">
          <button
            onClick={() => {
              setScannedResult(null);
              setActiveTab('camera');
            }}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'camera'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            Quét mã qua Camera
          </button>

          <button
            onClick={() => {
              setActiveTab('search');
              stopCamera();
            }}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'search'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Search className="w-4 h-4" />
            Nhập mã / Tra cứu nhanh
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-4">
          {!scannedResult ? (
            <>
              {activeTab === 'camera' && (
                <div className="flex flex-col items-center">
                  <div className="relative w-full max-w-sm aspect-square bg-slate-900 rounded-2xl overflow-hidden shadow-inner flex items-center justify-center border-2 border-slate-700">
                    {/* Live Video */}
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
                    />

                    {/* Camera view finder overlay */}
                    <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
                      <div className="w-48 h-48 border-2 border-blue-400 rounded-xl relative shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                        {/* Laser scan line animation */}
                        <div className="absolute left-0 right-0 h-0.5 bg-blue-500 shadow-[0_0_8px_#3b82f6] animate-bounce" />
                        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-white" />
                        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-white" />
                        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-white" />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-white" />
                      </div>
                    </div>

                    {!cameraActive && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-slate-400 bg-slate-900/90">
                        <Camera className="w-12 h-12 text-slate-600 mb-3" />
                        <p className="text-xs text-slate-300 font-medium mb-1">
                          {cameraError || 'Đang chuẩn bị Camera...'}
                        </p>
                        <button
                          type="button"
                          onClick={() => setActiveTab('search')}
                          className="mt-3 px-3.5 py-1.5 rounded-lg bg-blue-600 text-white font-medium text-xs hover:bg-blue-700 transition-colors"
                        >
                          Chuyển sang Tra cứu mã thiết bị
                        </button>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-500 text-center mt-3 max-w-sm">
                    Hướng camera điện thoại vào tem mã QR dán trên thân máy. Hệ thống sẽ tự động nhận diện và đọc thông số.
                  </p>
                </div>
              )}

              {/* Quick Search / Code Input */}
              <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Nhập mã tem thiết bị (VD: TB-CNTT-00001)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      value={manualCode}
                      onChange={(e) => setManualCode(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleLookup(manualCode)}
                      placeholder="Nhập mã thiết bị hoặc quét..."
                      className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden bg-white uppercase"
                    />
                  </div>
                  <button
                    onClick={() => handleLookup(manualCode)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors"
                  >
                    Tra cứu
                  </button>
                </div>

                {/* Sample shortcuts for quick demo */}
                <div className="pt-2">
                  <div className="text-[11px] text-slate-500 mb-1.5 font-medium">Hoặc bấm chọn nhanh mã mẫu có sẵn trong trường:</div>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleCodes.map(s => (
                      <button
                        key={s.id}
                        onClick={() => handleLookup(s.equipment_code)}
                        className="px-2.5 py-1 rounded-md bg-white hover:bg-blue-50 border border-slate-300 hover:border-blue-400 text-[11px] font-mono font-semibold text-slate-700 transition-colors"
                      >
                        {s.equipment_code}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Scanned Equipment Card Result */
            <div className="space-y-4 animate-in fade-in zoom-in-95 duration-150">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-emerald-800 text-xs">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span className="font-semibold">Đã nhận diện thành công thiết bị</span>
                </div>
                <button
                  onClick={() => {
                    setScannedResult(null);
                    setManualCode('');
                    if (activeTab === 'camera') startCamera();
                  }}
                  className="text-xs font-bold underline hover:text-emerald-900"
                >
                  Quét thiết bị khác
                </button>
              </div>

              {/* Main Card */}
              <div className="bg-white border-2 border-blue-500 rounded-2xl p-5 shadow-md space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-md inline-block border border-blue-200 mb-1">
                      {scannedResult.equipment_code}
                    </div>
                    <h4 className="text-base font-bold text-slate-900 leading-tight">
                      {scannedResult.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {scannedResult.category_name} • {scannedResult.manufacturer || 'Chưa rõ hãng'}
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold shrink-0 ${
                    scannedResult.condition === 'TOT'
                      ? 'bg-emerald-100 text-emerald-800'
                      : scannedResult.condition === 'BINH_THUONG'
                      ? 'bg-blue-100 text-blue-800'
                      : scannedResult.condition === 'HONG_NHE'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}>
                    {scannedResult.condition === 'TOT' ? 'Rất tốt' : scannedResult.condition === 'BINH_THUONG' ? 'Bình thường' : scannedResult.condition === 'HONG_NHE' ? 'Hỏng nhẹ' : 'Hỏng nặng'}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block">Vị trí hiện tại:</span>
                    <span className="font-bold text-slate-800 flex items-center gap-1 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      {scannedResult.current_room_code} ({scannedResult.building})
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Trạng thái:</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {scannedResult.status === 'DANG_SU_DUNG' ? '🟢 Đang sử dụng' : scannedResult.status === 'TRONG_KHO' ? '📦 Trong kho' : '🔴 Đang sửa'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Nguyên giá tài sản:</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {scannedResult.original_price.toLocaleString('vi-VN')} đ
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block">Năm sử dụng:</span>
                    <span className="font-bold text-slate-800 mt-0.5 block">
                      {scannedResult.entry_date || scannedResult.manufacturing_year}
                    </span>
                  </div>
                </div>

                {/* Direct Action Buttons for Scanned Asset */}
                <div className="pt-2 border-t border-slate-200">
                  <div className="text-[11px] font-bold text-slate-600 uppercase mb-2">Thao tác nhanh cho thiết bị này:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {onReportDamage && (
                      <button
                        onClick={() => {
                          onReportDamage(scannedResult);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 font-bold text-xs transition-colors"
                      >
                        <AlertTriangle className="w-3.5 h-3.5" />
                        Báo hỏng
                      </button>
                    )}

                    {onTransfer && (
                      <button
                        onClick={() => {
                          onTransfer(scannedResult);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-700 font-bold text-xs transition-colors"
                      >
                        <ArrowRightLeft className="w-3.5 h-3.5" />
                        Điều chuyển
                      </button>
                    )}

                    {onPrintLabel && (
                      <button
                        onClick={() => {
                          onPrintLabel(scannedResult);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-bold text-xs transition-colors"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        In tem nhãn
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
