
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { BackupRecord } = require('./models');

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
// Get all backup records
app.get('/api/backups', async (req, res) => {
  try {
    const records = await BackupRecord.find().sort({ date: -1 });
    res.json(records);
  } catch (err) {
    console.error('Error fetching backup records:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add new backup record
app.post('/api/backups', async (req, res) => {
  try {
    const { date, time, backupNumber, performer } = req.body;
    
    // Create new record with month derived from date
    const newDate = new Date(date);
    const month = newDate.toLocaleString('id-ID', { month: 'long' });
    
    const newRecord = new BackupRecord({
      date,
      month,
      time,
      backupNumber,
      performer
    });
    
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (err) {
    console.error('Error adding backup record:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update backup record
app.put('/api/backups/:id', async (req, res) => {
  try {
    const { date, time, backupNumber, performer } = req.body;
    
    // Update month based on new date if changed
    const newDate = new Date(date);
    const month = newDate.toLocaleString('id-ID', { month: 'long' });
    
    const updatedRecord = await BackupRecord.findByIdAndUpdate(
      req.params.id,
      { date, month, time, backupNumber, performer },
      { new: true }
    );
    
    if (!updatedRecord) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json(updatedRecord);
  } catch (err) {
    console.error('Error updating backup record:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete backup record
app.delete('/api/backups/:id', async (req, res) => {
  try {
    const record = await BackupRecord.findByIdAndDelete(req.params.id);
    
    if (!record) {
      return res.status(404).json({ error: 'Record not found' });
    }
    
    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    console.error('Error deleting backup record:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
