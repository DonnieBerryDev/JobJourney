const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: false,
  },
  salary: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
});

const Job = mongoose.model("Job", jobSchema);

module.exports = Job;
