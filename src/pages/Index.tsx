
import React from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import LogbookForm from "@/components/LogbookForm";
import LogbookHeader from "@/components/LogbookHeader";
import LogbookTable from "@/components/LogbookTable";
import DeleteConfirmationDialog from "@/components/DeleteConfirmationDialog";
import { useLogbook } from "@/hooks/useLogbook";
import { exportToExcel } from "@/utils/excelExport";

const Index = () => {
  const { 
    records, 
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
  } = useLogbook();
  
  const { toast } = useToast();

  const handleExportExcel = () => {
    if (records.length > 0) {
      exportToExcel(records);
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto py-8 px-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <LogbookHeader 
            searchTerm={searchTerm}
            onSearchChange={(e) => setSearchTerm(e.target.value)}
            onAddClick={() => {
              setEditingRecord(null);
              setShowForm(true);
            }}
            onExportClick={handleExportExcel}
            isLoading={isLoading}
          />

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

          <LogbookTable 
            records={records}
            onEdit={handleEditRecord}
            onDelete={(id) => setDeleteDialog({ open: true, recordId: id })}
            isLoading={isLoading}
            searchTerm={searchTerm}
          />
        </div>
      </main>

      <DeleteConfirmationDialog 
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ ...deleteDialog, open })}
        onConfirm={handleDeleteConfirm}
        isLoading={isLoading}
      />
    </div>
  );
};

export default Index;
