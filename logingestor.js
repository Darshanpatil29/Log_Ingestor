const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors= require('cors');
const app = express();
const port = 3000;
app.use(cors());
// Connection for MongoDB
mongoose.connect('mongodb://localhost:27017/log-ingestor', { useNewUrlParser: true, useUnifiedTopology: true });

// Defined Log Schema here
const logSchema = new mongoose.Schema({
    level: { type: String, required: true },
    message: { type: String, required: true },
    resourceId: { type: String, required: true },
    timestamp: { type: String, required: true },
    traceId: String,
    spanId: String,
    commit: String,
    metadata: {
      parentResourceId: String,
    },
});

// Created Log model
const Log = mongoose.model('Log', logSchema);

app.use(bodyParser.json());

// Endpoint to handle HTTP POST requests for log ingestion
app.post('/ingest-log', async (req, res) => {
  try {
    const logData = req.body;

    // Validating required fields
    if (!logData.level || !logData.message || !logData.timestamp) {
      return res.status(400).send('Invalid log data. Missing required fields.');
    }

    // Created a new Log instance
    const log = new Log(logData);

    // Saving the log to MongoDB
    await log.save();

    console.log('Log ingested successfully:', logData);

    res.status(200).send('Log ingested successfully');
  } catch (error) {
    console.error('Error ingesting log:', error);

    // Handling specific MongoDB validation error
    if (error.name === 'ValidationError') {
      return res.status(400).send('Invalid log data. Please check the fields.');
    }

    res.status(500).send('Internal Server Error');
  }
});

// code for auto suggestion and autocomplete
app.get('/search', async (req, res) => {
  try {
    const { field, query } = req.query;
    const regexQuery = new RegExp(query, 'i');
    const dynamicQuery = {};
    dynamicQuery[field] = regexQuery;

    const results = await Log.find(dynamicQuery);
    res.json(results);
  } catch (error) {
    console.error('Error searching logs:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Log Ingestor listening at http://localhost:${port}`);
});
