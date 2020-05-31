const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const meetingSchema = new Schema(
  {
    title: String,
    region: String,
    attendees: [
      {
        type: Schema.Types.ObjectID,
        ref: 'Attendee',
      },
    ],
  },
  { strict: false }
);

module.exports = new mongoose.model('Meeting', meetingSchema);
