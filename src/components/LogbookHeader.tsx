
import React from "react";
import { Plus, Search, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LogbookHeaderProps {
  searchTerm: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAddClick: () => void;
  onExportClick: () => void;
  isLoading: boolean;
}

const LogbookHeader: React.FC<LogbookHeaderProps> = ({
  searchTerm,
  onSearchChange,
  onAddClick,
  onExportClick,
  isLoading
}) => {
  return (
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
            onChange={onSearchChange}
          />
        </div>
        <Button 
          onClick={onAddClick}
          disabled={isLoading}
        >
          <Plus className="h-4 w-4 mr-2" /> Tambah Backup
        </Button>
        <Button 
          variant="outline" 
          onClick={onExportClick}
          disabled={isLoading}
        >
          <FileDown className="h-4 w-4 mr-2" /> Export Excel
        </Button>
      </div>
    </div>
  );
};

export default LogbookHeader;
