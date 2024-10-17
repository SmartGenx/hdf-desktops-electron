const { exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const backupDatabase = (req, res) => {
  try {
    const dbName = 'Hdf_electron'
    const dbUser = 'postgres'
    const dbPassword = '123'
    const dbPort = 5432
    const backupPath = req.body.backupPath
    const backupName = req.body.backupName

    if (!dbName || !dbUser || !dbPassword || !backupPath || !backupName) {
      res
        .status(400)
        .json({
          error: 'Database name, user, password, backup path, and backup name are required.'
        })
      return
    }

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true })
    }

    const filename = `${backupName}-${Date.now()}.sql`
    const outputPath = path.join(backupPath, filename)

    // Set the PGPASSWORD environment variable securely
    process.env.PGPASSWORD = dbPassword

    const pgDumpPath = 'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump'
    const command = `"${pgDumpPath}" -U ${dbUser} -d ${dbName} -p ${dbPort} -f "${outputPath}"`

    exec(command, (error, stdout, stderr) => {
      // Clear the PGPASSWORD environment variable immediately after use
      delete process.env.PGPASSWORD

      if (error) {
        console.error(`Backup error: ${error}`)
        res.status(500).json({ error: 'Backup process failed.' })
        return
      }
      if (stderr) {
        console.error(`Backup stderr: ${stderr}`)
        res.status(500).json({ error: 'Error during the backup process.' })
        return
      }
      console.log(`Backup successful! Saved to ${outputPath}`)

      // Instead of deleting, move the file to a specified download folder
      const downloadPath = backupPath
      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true })
      }
      const downloadOutputPath = path.join(backupPath, filename)

      fs.rename(outputPath, downloadOutputPath, (err) => {
        if (err) {
          console.error('Error moving file:', err)
          return res.status(500).send('Could not move the file to the download folder')
        }
        console.log(`File moved to: ${downloadOutputPath}`)
        res
          .status(200)
          .json({ message: `Backup successfully created and moved to ${downloadOutputPath}` })
      })
    })
  } catch (error) {
    console.error('Unexpected error:', error)
    res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}

module.exports = { backupDatabase }
