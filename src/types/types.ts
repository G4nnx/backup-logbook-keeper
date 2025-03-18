
export interface BackupRecord {
  id?: string;
  _id?: string; // MongoDB ID
  date: string; // ISO string
  month: string;
  time: string;
  backupNumber: string;
  performer: string;
}
