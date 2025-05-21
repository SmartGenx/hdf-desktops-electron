import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import { fork } from 'child_process';
import dotenv from 'dotenv';
import util from 'util';
import fs from 'fs';
import { rootRouter } from "../server/routes/index"
import { databaseService } from './database'; 
dotenv.config();

const mkdir = util.promisify(fs.mkdir);

const corsOptions: CorsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

const app: Application = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', rootRouter);

async function ensureProfileDirExists(profileDir: string): Promise<void> {
  try {
    await mkdir(profileDir);
  } catch (error: any) {
    if (error.code !== 'EEXIST') {
      throw error;
    }
    console.log(`Directory already exists: ${profileDir}`);
  }
}

const startServer = async (): Promise<void> => {
  try {
    await databaseService.switchDatabaseBasedOnConnectivity();
    await databaseService.user();

    const syncProcess = fork(path.join(__dirname, 'syncProcess.ts'));
    syncProcess.on('error', (error: Error) => {
      console.error('Sync process error:', error);
    });

    const profileDir = path.join(process.env.PROFILE_DIR || 'D:/', 'Profiles');
    await ensureProfileDirExists(profileDir);

    const PORT = parseInt(process.env.PORT || '5050', 10);
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
};

startServer();
