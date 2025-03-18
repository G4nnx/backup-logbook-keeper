
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { BackupRecord } from "@/types/types";
import {
  fetchBackupRecords,
  addBackupRecord,
  updateBackupRecord,
  deleteBackupRecord
} from "@/api/backupApi";

export function useLogbook() {
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
    loadBackupRecords();
  }, []);

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

  const filteredRecords = records.filter(record => 
    record.performer.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.backupNumber.includes(searchTerm) ||
    new Date(record.date).toLocaleDateString().includes(searchTerm)
  );

  return {
    records: filteredRecords,
    isLoading,
    searchTerm,
    setSearchTerm,
    showForm,
    setShowForm,
    editingRecord,
    setEditingRecord,
    deleteDialog,
    setDeleteDialog,
    handleAddRecord,
    handleEditRecord,
    handleDeleteConfirm
  };
}
