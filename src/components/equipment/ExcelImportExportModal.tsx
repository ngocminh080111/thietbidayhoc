import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { Equipment, Room, EquipmentCategory } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  FileSpreadsheet,
  Download,
  Upload,
  X,
  FileCheck,
  AlertCircle,
  CheckCircle2,
  Table,
  Layers,
  ArrowDownToLine,
  HelpCircle
} from 'lucide-react';

interface ExcelImportExportModalProps {
  equipmentList: Equipment[];
  rooms: Room[];
  categories: EquipmentCategory[];
  onClose: () => void;
  onImportSuccess: () => void;
}

export const ExcelImportExportModal: React.FC<ExcelImportExportModalProps> = ({
  equipmentList,
  rooms,
  categories,
  onClose,
  onImportSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [exportScope, setExportScope] = useState<'ALL' | 'ROOM' | 'DEPRECIATION'>('ALL');
  const [selectedExportRoom, setSelectedExportRoom] = useState<string>('ALL');

  // Import State
  const [importing, setImporting] = useState(false);
  const [parsedRows, setParsedRows] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [importResult, setImportResult] = useState<{ success: boolean; count: number; errors: string[] } | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // --- EXPORT TO EXCEL ---
  const handleExport = async () => {
    let dataToExport: any[] = [];
    let fileName = `Danh_Muc_Thiet_Bi_CaoDangX_${new Date().toISOString().slice(0, 10)}.xlsx`;

    if (exportScope === 'DEPRECIATION') {
      try {
        const depRes = await api.getDepreciationReport();
        if (depRes && depRes.items) {
          fileName = `Bang_Khau_Hao_Tai_San_CaoDangX_${new Date().getFullYear()}.xlsx`;
          dataToExport = depRes.items.map((item, idx) => ({
            'STT': idx + 1,
            'Mã thiết bị': item.equipment_code,
            'Tên tài sản / Thiết bị': item.name,
            'Nhóm tài sản': item.category_name,
            'Vị trí / Phòng': item.room_code,
            'Đơn vị quản lý': item.department_name,
            'Năm sử dụng': item.entry_date?.slice(0, 4) || '2022',
            'Số năm sử dụng': item.years_in_use,
            'Nguyên giá (VNĐ)': item.original_price,
            'Tỷ lệ khấu hao (%)': `${item.depreciation_rate_percent}%/năm`,
            'Giá trị hao mòn lũy kế (VNĐ)': item.accumulated_depreciation,
            'Giá trị còn lại (VNĐ)': item.remaining_value,
            'Tình trạng': item.condition,
            'Đề xuất xử lý': item.recommendation === 'THANH_LY' ? 'Lập hội đồng thanh lý' : item.recommendation === 'BAO_DUONG' ? 'Bảo dưỡng / Sửa chữa' : 'Tiếp tục sử dụng'
          }));
        }
      } catch (err) {
        console.error('Lỗi lấy dữ liệu khấu hao:', err);
      }
    } else {
      let filtered = equipmentList;
      if (exportScope === 'ROOM' && selectedExportRoom !== 'ALL') {
        filtered = equipmentList.filter(e => e.current_room_id === selectedExportRoom);
        const rName = rooms.find(r => r.id === selectedExportRoom)?.code || 'Phong';
        fileName = `Thiet_Bi_${rName}_CaoDangX_${new Date().toISOString().slice(0, 10)}.xlsx`;
      }

      dataToExport = filtered.map((eq, idx) => ({
        'STT': idx + 1,
        'Mã thiết bị': eq.equipment_code,
        'Tên thiết bị': eq.name,
        'Nhóm danh mục': eq.category_name,
        'Mã phòng': eq.current_room_code,
        'Tên phòng': eq.current_room_name,
        'Tòa nhà': eq.building,
        'Model': eq.model || '',
        'Số Serial': eq.serial_number || '',
        'Hãng sản xuất': eq.manufacturer || '',
        'Năm sản xuất': eq.manufacturing_year || '',
        'Ngày mua': eq.purchase_date || '',
        'Ngày đưa vào SD': eq.entry_date || '',
        'Nguyên giá (VNĐ)': eq.original_price,
        'Nguồn kinh phí': eq.funding_source || 'Ngân sách trường',
        'Tình trạng': eq.condition === 'TOT' ? 'Rất tốt' : eq.condition === 'BINH_THUONG' ? 'Bình thường' : eq.condition === 'HONG_NHE' ? 'Hỏng nhẹ' : 'Hỏng nặng',
        'Trạng thái': eq.status === 'DANG_SU_DUNG' ? 'Đang sử dụng' : eq.status === 'TRONG_KHO' ? 'Trong kho' : 'Đang sửa chữa',
        'Hạn bảo hành': eq.warranty_expiry || '',
        'Ghi chú': eq.note || ''
      }));
    }

    if (dataToExport.length === 0) {
      alert('Không có dữ liệu thiết bị nào để xuất file.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);

    // Auto-fit column widths
    const colWidths = Object.keys(dataToExport[0]).map(key => ({
      wch: Math.max(key.length * 2, 14)
    }));
    worksheet['!cols'] = colWidths;

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Danh Sách Thiết Bị');
    XLSX.writeFile(workbook, fileName);
  };

  // --- DOWNLOAD SAMPLE IMPORT TEMPLATE ---
  const handleDownloadTemplate = () => {
    const templateData = [
      {
        'Mã thiết bị': 'TB-CNTT-00099 (Để trống để tự sinh)',
        'Tên thiết bị': 'Máy tính để bàn HP ProDesk 400 G7',
        'Mã nhóm': 'CAT-CNTT',
        'Mã phòng': 'PM101',
        'Model': 'ProDesk 400 G7 SFF',
        'Số Serial': 'HP-SN-998822',
        'Hãng sản xuất': 'HP Inc',
        'Năm sản xuất': 2023,
        'Nguyên giá': 14500000,
        'Tình trạng': 'TOT',
        'Ghi chú': 'Cấp phát phòng máy 101'
      },
      {
        'Mã thiết bị': '',
        'Tên thiết bị': 'Máy hàn TIG Jasic TIG-200S',
        'Mã nhóm': 'CAT-CK',
        'Mã phòng': 'XUONG_CK',
        'Model': 'TIG-200S',
        'Số Serial': 'JS-883311',
        'Hãng sản xuất': 'Jasic',
        'Năm sản xuất': 2022,
        'Nguyên giá': 8500000,
        'Tình trạng': 'TOT',
        'Ghi chú': 'Phục vụ xưởng Cơ khí'
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Mau_Nhap_Thiet_Bi');
    XLSX.writeFile(workbook, 'Mau_Nhap_Thiet_Bi_CaoDangX.xlsx');
  };

  // --- PARSE UPLOADED FILE ---
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportResult(null);
    setValidationErrors([]);
    const reader = new FileReader();

    reader.onload = (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const rawJson: any[] = XLSX.utils.sheet_to_json(ws, { defval: '' });

        if (rawJson.length === 0) {
          setValidationErrors(['File Excel không có dữ liệu hoặc định dạng bảng trống']);
          setParsedRows([]);
          return;
        }

        // Map column variations (tiếng Việt hoặc tiếng Anh)
        const mappedRows = rawJson.map((row) => ({
          equipment_code: row['Mã thiết bị'] || row['Mã TB'] || row['equipment_code'] || '',
          name: row['Tên thiết bị'] || row['Tên tài sản'] || row['name'] || '',
          category_code: row['Mã nhóm'] || row['category_code'] || 'CAT-CNTT',
          room_code: row['Mã phòng'] || row['room_code'] || 'KHO_A',
          model: row['Model'] || row['model'] || '',
          serial_number: row['Số Serial'] || row['Số máy'] || row['serial_number'] || '',
          manufacturer: row['Hãng sản xuất'] || row['Nhà SX'] || row['manufacturer'] || '',
          manufacturing_year: parseInt(row['Năm sản xuất'] || row['Năm SX'] || '2023') || 2023,
          original_price: parseInt(row['Nguyên giá'] || row['Đơn giá'] || '0') || 0,
          condition: row['Tình trạng'] || 'TOT',
          note: row['Ghi chú'] || 'Nhập từ file Excel'
        }));

        setParsedRows(mappedRows);
      } catch (err: any) {
        setValidationErrors([`Lỗi khi đọc file Excel: ${err.message}`]);
      }
    };

    reader.readAsBinaryString(file);
  };

  // --- CONFIRM IMPORT ---
  const handleConfirmImport = async () => {
    if (parsedRows.length === 0) return;
    setImporting(true);
    setValidationErrors([]);

    try {
      const res = await api.importEquipmentBatch(parsedRows);
      if (res && res.success) {
        setImportResult({
          success: true,
          count: res.imported_count,
          errors: res.errors || []
        });
        onImportSuccess();
      } else {
        setValidationErrors(['Lỗi khi nhập dữ liệu vào hệ thống']);
      }
    } catch (err: any) {
      setValidationErrors([err.message || 'Lỗi kết nối máy chủ']);
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden my-6 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">Nhập & Xuất Dữ Liệu Excel</h3>
              <p className="text-xs text-slate-300">Đồng bộ hàng loạt thiết bị với định dạng chuẩn .xlsx</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="px-6 pt-3 bg-slate-50 border-b border-slate-200 flex gap-4 shrink-0">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            Xuất dữ liệu ra Excel (.xlsx)
          </button>

          <button
            onClick={() => setActiveTab('import')}
            className={`pb-2.5 text-xs font-semibold flex items-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" />
            Nhập thiết bị từ file Excel
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-5">
          {activeTab === 'export' ? (
            /* EXPORT VIEW */
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 leading-relaxed">
                <div className="font-bold flex items-center gap-1.5 text-emerald-800 mb-1">
                  <FileCheck className="w-4 h-4" />
                  Xuất dữ liệu theo đúng mẫu kế toán & tài sản công
                </div>
                Hệ thống hỗ trợ trích xuất toàn bộ trường dữ liệu (mã số, nguyên giá, số serial, vị trí phòng, năm sử dụng, trạng thái) với định dạng bảng Excel chuẩn.
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-bold text-slate-700 uppercase">
                  Chọn phạm vi dữ liệu cần xuất:
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="exportScope"
                      checked={exportScope === 'ALL'}
                      onChange={() => setExportScope('ALL')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">Toàn bộ thiết bị trong trường</span>
                      <p className="text-slate-500">Tất cả {equipmentList.length} tài sản đang quản lý trên hệ thống</p>
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="exportScope"
                      checked={exportScope === 'ROOM'}
                      onChange={() => setExportScope('ROOM')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs flex-1">
                      <span className="font-bold text-slate-800">Theo phòng thực hành / Kho</span>
                      <p className="text-slate-500">Xuất danh mục trang thiết bị của một phòng cụ thể</p>
                      {exportScope === 'ROOM' && (
                        <select
                          value={selectedExportRoom}
                          onChange={(e) => setSelectedExportRoom(e.target.value)}
                          className="mt-2 w-full p-2 rounded-lg border border-slate-300 text-xs font-medium bg-white"
                        >
                          <option value="ALL">-- Chọn phòng cụ thể --</option>
                          {rooms.map(r => (
                            <option key={r.id} value={r.id}>
                              {r.code} - {r.name} ({r.building})
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </label>

                  <label className="flex items-center gap-2 p-3 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="radio"
                      name="exportScope"
                      checked={exportScope === 'DEPRECIATION'}
                      onChange={() => setExportScope('DEPRECIATION')}
                      className="text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-slate-800">Bảng tính Khấu hao & Hao mòn Tài sản</span>
                      <p className="text-slate-500">Phục vụ công tác tài chính, thanh lý và báo cáo định kỳ năm học</p>
                    </div>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end">
                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Download className="w-4 h-4" />
                  Tải file Excel ngay (.xlsx)
                </button>
              </div>
            </div>
          ) : (
            /* IMPORT VIEW */
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Cần mẫu chuẩn để chuẩn bị dữ liệu trước khi nạp?</span>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shrink-0"
                >
                  <ArrowDownToLine className="w-3.5 h-3.5" />
                  Tải file mẫu Excel
                </button>
              </div>

              {/* Upload Dropzone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center cursor-pointer bg-slate-50 hover:bg-emerald-50/40 transition-colors"
              >
                <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-700">
                  Nhấp vào đây để chọn file Excel (.xlsx, .xls) từ máy tính
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Dung lượng tối đa 10MB • Hỗ trợ tự động kiểm tra trùng lặp mã
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              {/* Validation errors */}
              {validationErrors.length > 0 && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-rose-600" />
                    Phát hiện lỗi trong file:
                  </div>
                  {validationErrors.map((err, i) => (
                    <div key={i}>• {err}</div>
                  ))}
                </div>
              )}

              {/* Import Result Feedback */}
              {importResult && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1.5 animate-in fade-in">
                  <div className="font-bold flex items-center gap-1.5 text-emerald-800 text-sm">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    Nhập thành công {importResult.count} thiết bị vào hệ thống!
                  </div>
                  <p className="text-emerald-700">
                    Dữ liệu đã được lưu vào cơ sở dữ liệu và ghi nhật ký kiểm toán.
                  </p>
                  {importResult.errors.length > 0 && (
                    <div className="mt-2 text-rose-700">
                      <b>Cảnh báo ({importResult.errors.length} dòng bỏ qua):</b>
                      {importResult.errors.map((e, idx) => (
                        <div key={idx}>• {e}</div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Data Preview Table */}
              {parsedRows.length > 0 && !importResult && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-700">
                      Xem trước dữ liệu ({parsedRows.length} dòng được nhận diện):
                    </span>
                    <span className="text-slate-500">Hiển thị tối đa 5 dòng đầu</span>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-x-auto max-h-48 text-[11px]">
                    <table className="w-full text-left">
                      <thead className="bg-slate-100 text-slate-700 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="p-2">#</th>
                          <th className="p-2">Tên thiết bị</th>
                          <th className="p-2">Mã phòng</th>
                          <th className="p-2">Hãng SX</th>
                          <th className="p-2">Nguyên giá</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {parsedRows.slice(0, 5).map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-50">
                            <td className="p-2 font-mono text-slate-500">{idx + 1}</td>
                            <td className="p-2 font-bold text-slate-800">{row.name}</td>
                            <td className="p-2 font-mono text-blue-700">{row.room_code}</td>
                            <td className="p-2 text-slate-600">{row.manufacturer || '-'}</td>
                            <td className="p-2 font-mono text-slate-700">{Number(row.original_price).toLocaleString('vi-VN')} đ</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      disabled={importing}
                      onClick={handleConfirmImport}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold text-xs shadow-md shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                    >
                      {importing ? (
                        'Đang nạp dữ liệu...'
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4" />
                          Xác nhận nạp {parsedRows.length} thiết bị vào hệ thống
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-end shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-medium text-xs transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
