
import React from "react";
import { Database } from "lucide-react";

const Navbar: React.FC = () => {
  return (
    <div className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex items-center">
        <Database className="h-6 w-6 mr-2" />
        <h1 className="text-xl font-bold">Logbook Backup Database</h1>
      </div>
    </div>
  );
};

export default Navbar;
