
import React from "react";
import { format } from "date-fns";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BackupRecord } from "@/types/types";

interface LogbookEntryProps {
  record: BackupRecord;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const LogbookEntry: React.FC<LogbookEntryProps> = ({ record, onEdit, onDelete }) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="px-4 py-3">{format(new Date(record.date), "MMMM")}</td>
      <td className="px-4 py-3">{format(new Date(record.date), "dd MMM yyyy")}</td>
      <td className="px-4 py-3">{record.time}</td>
      <td className="px-4 py-3">{record.backupNumber}</td>
      <td className="px-4 py-3">{record.performer}</td>
      <td className="px-4 py-3 flex justify-end space-x-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(record.id)}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={() => onDelete(record.id)}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
};

export default LogbookEntry;
