
import * as XLSX from 'xlsx';
import { BackupRecord } from '@/types/types';
import { format } from 'date-fns';

export const exportToExcel = (data: BackupRecord[], fileName: string = 'logbook-backup-database') => {
  // Format data for Excel
  const workbookData = data.map((record) => ({
    Bulan: record.month,
    Tanggal: format(new Date(record.date), "dd MMM yyyy"),
    "Jam Backup": record.time,
    "Backup Ke": record.backupNumber,
    Pelaksana: record.performer,
  }));

  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Create worksheet
  const worksheet = XLSX.utils.json_to_sheet(workbookData);

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Logbook Backup");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
