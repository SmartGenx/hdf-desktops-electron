
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const { databaseService } = require('../database'); // Adjust the import path as needed

const backupDatabase = async (req, res) => {
  try {

    const dbName = 'Hdf_electron';
    const dbUser = 'postgres';
    const dbPassword = 'sami2020';
    const dbPort = 5432;
    // const backupPath = req.body.backupPath;
    const backupPath = 'D:\\backup';
    const backupName = req.body.backupName;



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

    exec(command, async (error, stdout, stderr) => {
      // Clear the PGPASSWORD environment variable immediately after use
      delete process.env.PGPASSWORD

      if (error) {

        console.error(`Backup error: ${error}`);
        return res.status(500).json({ error: 'Backup process failed.' });
      }
      if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
        return res.status(500).json({ error: 'Error during the backup process.' });
      }
      console.log(`Backup successful! Saved to ${outputPath}`)


      // Move the file to a specified download folder
      const downloadPath = backupPath;
      if (!fs.existsSync(downloadPath)) {
        fs.mkdirSync(downloadPath, { recursive: true })
      }
      const downloadOutputPath = path.join(backupPath, filename)

      fs.rename(outputPath, downloadOutputPath, async (err) => {
        if (err) {
          console.error('Error moving file:', err)
          return res.status(500).send('Could not move the file to the download folder')
        }

        console.log(`File moved to: ${downloadOutputPath}`);

        try {
          const backupServices = databaseService.getbackupServices();
          await backupServices.createbackup(downloadOutputPath, req.user.name);
          res.status(200).json({ message: `Backup successfully created and moved to ${downloadOutputPath}` });
        } catch (dbError) {
          console.error('Error saving backup info to the database:', dbError);
          res.status(500).json({ error: 'Backup created but failed to save information to the database.' });
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error)
    res.status(500).json({ error: 'An unexpected error occurred.' })
  }
}

module.exports = { backupDatabase }
