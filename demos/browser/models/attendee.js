const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const attendeeSchema = new Schema(
  {
    name: String,
  },
  { strict: false }
);

module.exports = new mongoose.model('Attendee', attendeeSchema);
