const express = require('express');
const cors = require('cors');
const { rootRouter } = require('../server/routes/index'); // Ensure the path is correct
const { databaseService } = require('./database'); // Adjust the path as necessary
const path = require('path');
const { fork } = require('child_process');
require('dotenv').config();


const util = require('util')
const fs = require('fs')
const mkdir = util.promisify(fs.mkdir)
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api', rootRouter)

async function ensureProfileDirExists(profileDir) {
  try {
    await mkdir(profileDir);
  } catch (error) {
    if (error.code !== 'EEXIST') { // Corrected the error code
      throw error;
    }
    console.log(`Directory already exists: ${profileDir}`);
  }
}



const startServer = async () => {
  try {
    await databaseService.switchDatabaseBasedOnConnectivity();
    await databaseService.user();

    const syncProcess = fork(path.join(__dirname, 'syncProcess.js'));
    syncProcess.on('error', (error) => {
      console.error('Sync process error:', error);
    });

    const profileDir = path.join(process.env.PROFILE_DIR || 'D:', 'Profiles');
    await ensureProfileDirExists(profileDir);

    const PORT = process.env.PORT || 5050;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();
