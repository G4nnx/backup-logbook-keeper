
import React, { useState, useEffect } from "react";
import { Plus, Search, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import LogbookEntry from "@/components/LogbookEntry";
import LogbookForm from "@/components/LogbookForm";
import { BackupRecord } from "@/types/types";
import { exportToExcel } from "@/utils/excelExport";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { fetchBackupRecords, addBackupRecord, updateBackupRecord, deleteBackupRecord } from "@/api/backupApi";

const Index = () => {
  const [records, setRecords] = useState<BackupRecord[]>([]);
  const [editingRecord, setEditingRecord] = useState<BackupRecord | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; recordId: string | null }>({
    open: false,
    recordId: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load data from MongoDB on component mount
  useEffect(() => {
    const loadBackupRecords = async () => {
      try {
        setIsLoading(true);
        const data = await fetchBackupRecords();
        // Map MongoDB _id to id for compatibility
        const formattedData = data.map(record => ({
          ...record,
          id: record._id
        }));
        setRecords(formattedData);
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal mengambil data dari server",
        });
        console.error("Failed to fetch records:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadBackupRecords();
  }, [toast]);

  const handleAddRecord = async (data: Omit<BackupRecord, "id" | "month">) => {
    try {
      setIsLoading(true);
      if (editingRecord) {
        // Update existing record
        const updatedRecord = await updateBackupRecord(editingRecord._id || editingRecord.id || '', data);
        setRecords(records.map(record => 
          record._id === updatedRecord._id || record.id === updatedRecord._id ? {
            ...updatedRecord,
            id: updatedRecord._id
          } : record
        ));
        toast({
          title: "Berhasil",
          description: "Data backup berhasil diperbarui",
        });
      } else {
        // Add new record
        const newRecord = await addBackupRecord(data);
        setRecords([...records, {
          ...newRecord,
          id: newRecord._id
        }]);
        toast({
          title: "Berhasil",
          description: "Data backup berhasil ditambahkan",
        });
      }
      setEditingRecord(null);
      setShowForm(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan data",
        variant: "destructive",
      });
      console.error("Failed to save record:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditRecord = (id: string) => {
    const record = records.find(r => r.id === id || r._id === id);
    if (record) {
      setEditingRecord(record);
      setShowForm(true);
    }
  };

  const handleDeleteConfirm = async () => {
    if (deleteDialog.recordId) {
      try {
        setIsLoading(true);
        await deleteBackupRecord(deleteDialog.recordId);
        setRecords(records.filter(r => r.id !== deleteDialog.recordId && r._id !== deleteDialog.recordId));
        toast({
          title: "Berhasil",
          description: "Data backup berhasil dihapus",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal menghapus data",
          variant: "destructive",
        });
        console.error("Failed to delete record:", error);
      } finally {
        setIsLoading(false);
        setDeleteDialog({ open: false, recordId: null });
      }
    }
  };

  const handleExportExcel = () => {
    if (filteredRecords.length > 0) {
      exportToExcel(filteredRecords);
      toast({
        title: "Berhasil",
        description: "Data berhasil diekspor ke Excel",
      });
    } else {
      toast({
        title: "Peringatan",
        description: "Tidak ada data untuk diekspor",
      });
    }
  };

  const filteredRecords = records.filter(record => 
    record.performer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.backupNumber.includes(searchTerm) ||
    new Date(record.date).toLocaleDateString().includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <h2 className="text-2xl font-bold mb-4 md:mb-0">Catatan Backup Database</h2>
            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input 
                  type="text" 
                  placeholder="Cari data..." 
                  className="pl-10 w-full md:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button 
                onClick={() => {
                  setEditingRecord(null);
                  setShowForm(true);
                }}
                disabled={isLoading}
              >
                <Plus className="h-4 w-4 mr-2" /> Tambah Backup
              </Button>
              <Button 
                variant="outline" 
                onClick={handleExportExcel}
                disabled={isLoading}
              >
                <FileDown className="h-4 w-4 mr-2" /> Export Excel
              </Button>
            </div>
          </div>

          {showForm && (
            <div className="mb-6">
              <LogbookForm 
                onSubmit={handleAddRecord} 
                editRecord={editingRecord} 
                onCancel={() => {
                  setShowForm(false);
                  setEditingRecord(null);
                }}
              />
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Memuat data...</p>
            </div>
          ) : filteredRecords.length > 0 ? (
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
                  {filteredRecords.map((record) => (
                    <LogbookEntry
                      key={record.id || record._id}
                      record={record}
                      onEdit={handleEditRecord}
                      onDelete={(id) => setDeleteDialog({ open: true, recordId: id })}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {searchTerm ? "Tidak ada data yang sesuai dengan pencarian" : "Belum ada data backup. Silakan tambahkan data."}
              </p>
            </div>
          )}
        </div>
      </main>

      <Dialog 
        open={deleteDialog.open} 
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Hapus</DialogTitle>
          </DialogHeader>
          <p className="py-4">Apakah Anda yakin ingin menghapus data backup ini?</p>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, recordId: null })}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isLoading}>
              Hapus
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
