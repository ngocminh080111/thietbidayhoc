import React, { useState, useEffect } from 'react';
import { DepreciationReportItem, DepreciationSummary } from '../../types/index.ts';
import { api } from '../../services/api.ts';
import {
  TrendingDown,
  DollarSign,
  AlertOctagon,
  CheckCircle2,
  FileSpreadsheet,
  Building2,
  Filter,
  Search,
  RefreshCw,
  Clock,
  Sparkles,
  PieChart,
  HelpCircle
} from 'lucide-react';
import * as XLSX from 'xlsx';

export const DepreciationReportView: React.FC = () => {
  const [items, setItems] = useState<DepreciationReportItem[]>([]);
  const [summary, setSummary] = useState<DepreciationSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [recommendationFilter, setRecommendationFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getDepreciationReport();
      if (data && data.items) {
        setItems(data.items);
        setSummary(data.summary);
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, []);

  const filteredItems = items.filter(item => {
    if (recommendationFilter !== 'ALL' && item.recommendation !== recommendationFilter) {
      return false;
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.equipment_code.toLowerCase().includes(q) ||
        item.department_name.toLowerCase().includes(q) ||
        item.room_code.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleExportExcel = () => {
    if (filteredItems.length === 0) {
      alert('Không có dữ liệu khấu hao để xuất.');
      return;
    }

    const exportRows = filteredItems.map((item, idx) => ({
      'STT': idx + 1,
      'Mã tài sản': item.equipment_code,
      'Tên tài sản': item.name,
      'Nhóm tài sản': item.category_name,
      'Vị trí phòng': item.room_code,
      'Khoa / Phòng QL': item.department_name,
      'Năm đưa vào SD': item.entry_date?.slice(0, 4) || '2022',
      'Số năm đã SD': item.years_in_use,
      'Nguyên giá (VNĐ)': item.original_price,
      'Tỷ lệ khấu hao (%)': `${item.depreciation_rate_percent}%/năm`,
      'Hao mòn lũy kế (VNĐ)': item.accumulated_depreciation,
      'Giá trị còn lại (VNĐ)': item.remaining_value,
      'Tình trạng kỹ thuật': item.condition,
      'Đề xuất xử lý':
        item.recommendation === 'THANH_LY'
          ? 'Lập hội đồng thanh lý'
          : item.recommendation === 'BAO_DUONG'
          ? 'Bảo dưỡng / Sửa chữa'
          : item.recommendation === 'THEO_DOI'
          ? 'Đã hết KH - Tiếp tục theo dõi'
          : 'Tiếp tục sử dụng'
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportRows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Bang_Khau_Hao_Tai_San');
    XLSX.writeFile(
      workbook,
      `Bao_Cao_Khau_Hao_Tai_San_CaoDangX_${new Date().getFullYear()}.xlsx`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200 uppercase tracking-wide">
              Quản trị Tài chính & Hao mòn Tài sản
            </span>
            <span className="text-xs text-slate-400 font-mono">Thông tư 23/2023/TT-BTC</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Bảng Tính Khấu Hao & Đề Xuất Thanh Lý Tài Sản
          </h1>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Tự động tính hao mòn lũy kế theo thời gian sử dụng, xác định giá trị sổ sách còn lại và phân loại thiết bị cần lập hội đồng thanh lý hoặc bảo dưỡng định kỳ.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchReport}
            disabled={loading}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Tính lại
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Xuất Báo Cáo Excel (.xlsx)
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-slate-500 uppercase">Tổng nguyên giá toàn trường</div>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {(summary.total_original_price / 1_000_000).toLocaleString('vi-VN')} Tr đ
            </div>
            <div className="text-[11px] text-slate-500 mt-1 font-mono">
              = {summary.total_original_price.toLocaleString('vi-VN')} VNĐ
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-rose-600 uppercase">Hao mòn lũy kế đã trích</div>
            <div className="text-2xl font-black text-rose-700 mt-1">
              {(summary.total_accumulated_depreciation / 1_000_000).toLocaleString('vi-VN')} Tr đ
            </div>
            <div className="text-[11px] text-rose-600 mt-1">
              Đạt {Math.round((summary.total_accumulated_depreciation / (summary.total_original_price || 1)) * 100)}% tổng nguyên giá
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-emerald-700 uppercase">Giá trị sổ sách còn lại</div>
            <div className="text-2xl font-black text-emerald-800 mt-1">
              {(summary.total_remaining_value / 1_000_000).toLocaleString('vi-VN')} Tr đ
            </div>
            <div className="text-[11px] text-emerald-600 mt-1">
              Hiện hữu trên bảng cân đối kế toán
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
            <div className="text-xs font-semibold text-amber-700 uppercase">Đề xuất thanh lý</div>
            <div className="text-2xl font-black text-amber-900 mt-1">
              {summary.recommended_liquidation_count} thiết bị
            </div>
            <div className="text-[11px] text-amber-700 mt-1">
              Hết hạn sử dụng hoặc hỏng nặng
            </div>
          </div>
        </div>
      )}

      {/* Breakdown by Department Bar */}
      {summary && summary.by_department.length > 0 && (
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-slate-800 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Phân Bổ Giá Trị Tài Sản Theo Đơn Vị Quản Lý
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
            {summary.by_department.map((dept) => {
              const percent = Math.round((dept.original_price / (summary.total_original_price || 1)) * 100);
              return (
                <div key={dept.department_id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <div className="flex justify-between font-bold text-slate-800 mb-1">
                    <span className="truncate">{dept.department_name}</span>
                    <span className="text-blue-700 font-mono">{percent}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-blue-600 rounded-full"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>{dept.count} thiết bị</span>
                    <span className="font-semibold text-slate-700">
                      {(dept.remaining_value / 1_000_000).toFixed(1)} Tr đ còn lại
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Filter className="w-4 h-4 text-slate-400" />
            Đề xuất xử lý:
          </div>
          <select
            value={recommendationFilter}
            onChange={(e) => setRecommendationFilter(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium bg-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          >
            <option value="ALL">Tất cả đề xuất ({items.length})</option>
            <option value="THANH_LY">⚠️ Cần thanh lý ({items.filter(i => i.recommendation === 'THANH_LY').length})</option>
            <option value="BAO_DUONG">🔧 Cần bảo dưỡng ({items.filter(i => i.recommendation === 'BAO_DUONG').length})</option>
            <option value="THEO_DOI">⏳ Hết khấu hao nhưng còn tốt ({items.filter(i => i.recommendation === 'THEO_DOI').length})</option>
            <option value="TIEP_TUC_SU_DUNG">✅ Tiếp tục sử dụng ({items.filter(i => i.recommendation === 'TIEP_TUC_SU_DUNG').length})</option>
          </select>
        </div>

        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên thiết bị, mã số, phòng..."
            className="pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 text-xs w-64 focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 text-xs flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-2" />
            Đang tính toán hao mòn và giá trị còn lại của tài sản...
          </div>
        ) : error ? (
          <div className="p-8 text-center text-rose-600 text-xs font-medium">{error}</div>
        ) : filteredItems.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Không có tài sản nào phù hợp với điều kiện tìm kiếm.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="p-4">Mã tài sản</th>
                  <th className="p-4">Tên thiết bị</th>
                  <th className="p-4">Vị trí</th>
                  <th className="p-4 text-right">Nguyên giá</th>
                  <th className="p-4 text-center">Năm SD</th>
                  <th className="p-4 text-right">Đã khấu hao</th>
                  <th className="p-4 text-right">Giá trị còn lại</th>
                  <th className="p-4 text-center">Khuyến nghị xử lý</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-mono font-bold text-blue-700 whitespace-nowrap">
                      {item.equipment_code}
                    </td>

                    <td className="p-4">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[11px] text-slate-400">{item.category_name}</div>
                    </td>

                    <td className="p-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{item.room_code}</div>
                      <div className="text-[10px] text-slate-400 truncate max-w-[120px]">{item.department_name}</div>
                    </td>

                    <td className="p-4 text-right font-mono font-semibold text-slate-800 whitespace-nowrap">
                      {item.original_price.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="p-4 text-center font-mono whitespace-nowrap">
                      <span className="font-bold text-slate-700">{item.years_in_use} năm</span>
                      <span className="block text-[10px] text-slate-400">(từ {item.entry_date?.slice(0, 4) || '2022'})</span>
                    </td>

                    <td className="p-4 text-right font-mono font-semibold text-rose-700 whitespace-nowrap">
                      {item.accumulated_depreciation.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="p-4 text-right font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {item.remaining_value.toLocaleString('vi-VN')} đ
                    </td>

                    <td className="p-4 text-center whitespace-nowrap">
                      {item.recommendation === 'THANH_LY' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                          <AlertOctagon className="w-3.5 h-3.5" /> Lập Hội Đồng Thanh Lý
                        </span>
                      ) : item.recommendation === 'BAO_DUONG' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                          🔧 Cần Bảo Dưỡng
                        </span>
                      ) : item.recommendation === 'THEO_DOI' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                          ⏳ Đã Hết KH - Theo Dõi
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Tiếp Tục Sử Dụng
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
