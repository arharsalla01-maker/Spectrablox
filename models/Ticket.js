const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['TRADE_ELGRINGO', 'MIDLEMAN', 'SOPORTE', 'HELPER_APPLICATION', 'MIDLEMAN_APPLICATION']
  },
  subType: {
    type: String
  },
  channelId: {
    type: String,
    required: true
  },
  messageId: {
    type: String
  },
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'claimed', 'closed']
  },
  claimedBy: {
    type: String
  },
  claimedByUsername: {
    type: String
  },
  participants: [{
    type: String
  }],
  data: {
    type: mongoose.Schema.Types.Mixed
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  closedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Ticket', ticketSchema);