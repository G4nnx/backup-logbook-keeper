
const mongoose = require('mongoose');

const backupRecordSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  month: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  backupNumber: {
    type: String,
    required: true
  },
  performer: {
    type: String,
    required: true
  }
}, { timestamps: true });

const BackupRecord = mongoose.model('BackupRecord', backupRecordSchema);

module.exports = { BackupRecord };
