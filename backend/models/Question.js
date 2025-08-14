const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
    trim: true
  },
  options: [{
    type: String,
    required: true
  }],
  correctAnswerIndex: {
    type: Number,
    required: true,
    min: 0,
    max: 3
  }
}, {
  timestamps: true // yaratilgan va yangilangan vaqtni avtomatik qo'shadi
});

// Validatsiya: 4 ta javob bo'lishi kerak
questionSchema.pre('save', function(next) {
  if (this.options.length !== 4) {
    return next(new Error('Har bir savolda 4 ta javob bo\'lishi kerak'));
  }
  next();
});

module.exports = mongoose.model('Question', questionSchema);