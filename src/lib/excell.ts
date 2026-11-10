import * as XLSX from "xlsx";

type ExcelCell = string | number | boolean | Date | null | undefined;

interface ExportExcelSheetOptions {
  fileName: string;
  sheetName: string;
  headers: string[];
  rows: ExcelCell[][];
}

export function exportExcelSheet({ fileName, sheetName, headers, rows }: ExportExcelSheetOptions): void {
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName.slice(0, 31));
  XLSX.writeFile(workbook, `${fileName.replace(/[\\/:*?"<>|]/g, "-")}.xlsx`);
}