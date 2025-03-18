
import axios from 'axios';
import { BackupRecord } from '@/types/types';

const API_URL = 'http://localhost:5000/api';

export const fetchBackupRecords = async (): Promise<BackupRecord[]> => {
  try {
    const response = await axios.get(`${API_URL}/backups`);
    return response.data;
  } catch (error) {
    console.error('Error fetching backup records:', error);
    throw error;
  }
};

export const addBackupRecord = async (record: Omit<BackupRecord, 'id' | 'month'>): Promise<BackupRecord> => {
  try {
    const response = await axios.post(`${API_URL}/backups`, record);
    return response.data;
  } catch (error) {
    console.error('Error adding backup record:', error);
    throw error;
  }
};

export const updateBackupRecord = async (id: string, record: Omit<BackupRecord, 'id' | 'month'>): Promise<BackupRecord> => {
  try {
    const response = await axios.put(`${API_URL}/backups/${id}`, record);
    return response.data;
  } catch (error) {
    console.error('Error updating backup record:', error);
    throw error;
  }
};

export const deleteBackupRecord = async (id: string): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/backups/${id}`);
  } catch (error) {
    console.error('Error deleting backup record:', error);
    throw error;
  }
};
