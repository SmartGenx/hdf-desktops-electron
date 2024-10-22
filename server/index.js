const express = require('express');
const cors = require('cors');
const { rootRouter } = require('../server/routes/index'); // Ensure the path is correct
const { databaseService } = require('./database'); // Adjust the path as necessary
const bodyParser = require('body-parser');
const fs = require('fs');
const util = require('util');
const path = require('path');
require('dotenv').config();

const mkdir = util.promisify(fs.mkdir); // Promisify mkdir here globally if it's used elsewhere too

async function ensureProfileDirExists(profileDir) {
  try {
    await mkdir(profileDir);
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
  }
}

const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

// Define the synchronizeAllTables function
const synchronizeAllTables = async () => {
  const tables = [
    'Role',
    'User',
    'Category',
    'Governorate',
    'Directorate',
    'Square',
    'Disease',
    'Applicant',
    'Pharmacy',
    'Accredited',
    'DiseasesApplicants',
    'Prescription',
    'Attachment',
    'Dismissal',
  ];
  for (const table of tables) {
    await databaseService.synchronizeTable(table);
    await databaseService.fetchUpdatesFromServer(table);
    // Uncomment the following lines if needed
    // await databaseService.synchronizeLocalToS3();
    // await databaseService.synchronizeS3ToLocal();
  }
};

async function ExpressApp() {
  try {
    await databaseService.switchDatabaseBasedOnConnectivity();
    await databaseService.user();

    // Run synchronizeAllTables once at startup
    await synchronizeAllTables();

    // Then schedule it to run every hour
    setInterval(synchronizeAllTables, 3600000); // 3600000 milliseconds = 1 hour

    const expressApp = express();
    expressApp.use(cors(corsOptions));
    expressApp.use(express.json());
    expressApp.use(bodyParser.json());

    expressApp.use('/api', rootRouter);

    const profileDir = path.join('C:', 'Profiles');

    const PORT = process.env.PORT || 5050;
    expressApp.listen(PORT, async () => {
      // It's generally a good practice to ensure prerequisites before starting the server
      await ensureProfileDirExists(profileDir);
      // Initialize role - user
    });
  } catch (error) {
    console.error('Failed to initialize the database service or server:', error);
  }
}

ExpressApp();
