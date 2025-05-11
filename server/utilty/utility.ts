import { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../secrets';
import { databaseService } from '../database';

export const backupDatabase = async (req: Request, res: Response): Promise<void> => {
  try {
    const dbName = 'hdf-production';
    const dbUser = 'postgres';
    const dbPassword = '12345';
    const dbPort = 5432;
    const backupPath = 'D:\\backup';
    const backupName: string = req.body.backupName;

    if (!dbName || !dbUser || !dbPassword || !backupPath || !backupName) {
      res.status(400).json({
        error: 'Database name, user, password, backup path, and backup name are required.',
      });
      return;
    }

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const filename = `${backupName}-${Date.now()}.sql`;
    const outputPath = path.join(backupPath, filename);

    process.env.PGPASSWORD = dbPassword;

    const pgDumpPath = 'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump';
    const command = `"${pgDumpPath}" -U ${dbUser} -d ${dbName} -p ${dbPort} -f "${outputPath}"`;

    exec(command, async (error, stdout, stderr) => {
      delete process.env.PGPASSWORD;

      if (error) {
        console.error(`Backup error: ${error.message}`);
        res.status(500).json({ error: 'Backup process failed.' });
        return;
      }

      if (stderr) {
        console.error(`Backup stderr: ${stderr}`);
        res.status(500).json({ error: 'Error during the backup process.' });
        return;
      }

      const downloadOutputPath = path.join(backupPath, filename);

      fs.rename(outputPath, downloadOutputPath, async (err) => {
        if (err) {
          console.error('Error moving file:', err);
          res.status(500).send('Could not move the file to the download folder');
          return;
        }

        try {
          const backupServices = databaseService.getbackupServices();
          await backupServices.createbackup(downloadOutputPath, 'المدير');

          res.status(200).json({
            message: `Backup successfully created and moved to ${downloadOutputPath}`,
          });
        } catch (dbError) {
          console.error('Error saving backup info to the database:', dbError);
          res.status(500).json({
            error: 'Backup created but failed to save information to the database.',
          });
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
};

