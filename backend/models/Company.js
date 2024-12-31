const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  linkedinProfile: {
    type: String,
    trim: true
  },
  emails: [{
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: function(email) {
        return /^\S+@\S+\.\S+$/.test(email);
      },
      message: props => `${props.value} is not a valid email!`
    }
  }],
  phoneNumbers: [{
    type: String,
    required: true,
    trim: true
  }],
  comments: {
    type: String,
    trim: true
  },
  communicationPeriodicity: {
    type: String,
    required: true,
    enum: ['7', '14', '30', '90', '365', 'weekly', 'biweekly', 'monthly', 'quarterly', 'annually'],
    default: '30'
  },
  lastCommunication: {
    type: Date
  },
  nextCommunication: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active'
  },
  highlightStatus: {
    type: String,
    enum: ['none', 'red', 'yellow'],
    default: 'none'
  },
  lastCommunicationType: String,
  communications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Communication'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
companySchema.index({ name: 1 });
companySchema.index({ status: 1 });
companySchema.index({ nextCommunication: 1 });
companySchema.index({ createdBy: 1 });
companySchema.index({ status: 1 });

const Company = mongoose.model('Company', companySchema);
module.exports = Company; 