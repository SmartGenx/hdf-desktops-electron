const express = require('express')
const cors = require('cors')
const { rootRouter } = require('../server/routes/index') // Ensure the path is correct
const { databaseService } = require('./database') // Adjust the path as necessary
const bodyParser = require('body-parser')
const fs = require('fs')
const util = require('util')
const path = require('path')
require('dotenv').config()

const mkdir = util.promisify(fs.mkdir) // Promisify mkdir here globally if it's used elsewhere too

async function ensureProfileDirExists(profileDir) {
  try {
    await mkdir(profileDir)
  } catch (error) {
    if (error.code !== 'EEXIST') {
      throw error
    }
  }
}

async function ExpressApp() {
  try {
    await databaseService.switchDatabaseBasedOnConnectivity()
    await databaseService.user()

    const expressApp = express()
    expressApp.use(cors())
    expressApp.use(express.json())
    expressApp.use(bodyParser.json())

    expressApp.use('/api', rootRouter)

    const profileDir = path.join('C:', 'Profiles')

    const PORT = process.env.PORT || 5050
    expressApp.listen(PORT, async () => {
      // It's generally a good practice to ensure prerequisites before starting the server
      await ensureProfileDirExists(profileDir)
      //init role - user
    })
  } catch (error) {
    console.error('Failed to initialize the database service or server:', error)
  }
}

ExpressApp()
