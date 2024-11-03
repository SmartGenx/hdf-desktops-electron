import XLSX from 'xlsx';
import { applicantsReportCategory } from '@renderer/types';

export const ExportExcelWaitingList = (data: applicantsReportCategory[] | undefined) => {
  if (!data) return;

  const dataToExport = data.map((item) => ({
    "الأسم": item.name,
    "تصنيف المرض": item.category,
    "المنطقة": item.directorate,
    "الجوال": item.phoneNumber,
    "تاريخ التقديم": item.submissionDate,
    "فئة": item.category,
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(dataToExport);
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

  const fileName = 'تصدير قائمة الانتظار.xlsx';
  XLSX.writeFile(workbook, fileName);
};
