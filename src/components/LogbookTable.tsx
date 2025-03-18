
import React from "react";
import LogbookEntry from "@/components/LogbookEntry";
import { BackupRecord } from "@/types/types";

interface LogbookTableProps {
  records: BackupRecord[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  isLoading: boolean;
  searchTerm: string;
}

const LogbookTable: React.FC<LogbookTableProps> = ({ 
  records, 
  onEdit, 
  onDelete, 
  isLoading,
  searchTerm
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (records.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">
          {searchTerm ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data backup. Silakan tambahkan data."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-4 py-3 font-medium">Bulan</th>
            <th className="px-4 py-3 font-medium">Tanggal</th>
            <th className="px-4 py-3 font-medium">Jam Backup</th>
            <th className="px-4 py-3 font-medium">Backup Ke</th>
            <th className="px-4 py-3 font-medium">Pelaksana</th>
            <th className="px-4 py-3 font-medium text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <LogbookEntry
              key={record.id || record._id}
              record={record}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LogbookTable;
