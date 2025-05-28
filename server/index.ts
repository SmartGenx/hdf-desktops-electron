import express, { Application } from 'express';
import cors, { CorsOptions } from 'cors';
import path from 'path';
import { fork } from 'child_process';
import dotenv from 'dotenv';
import util from 'util';
import fs from 'fs';
import { rootRouter } from "./routes/index"
import { databaseService } from './database'; 

// Load environment variables
dotenv.config();

console.log('Server starting...');
console.log('Current directory:', __dirname);
console.log('NODE_ENV:', process.env.NODE_ENV);

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

// Add a health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

async function ensureProfileDirExists(profileDir: string): Promise<void> {
  try {
    await mkdir(profileDir, { recursive: true });
    console.log(`Created directory: ${profileDir}`);
  } catch (error) {
    const err = error as NodeJS.ErrnoException;
    if (err.code !== 'EEXIST') {
      console.error('Error creating profile directory:', err);
      throw err;
    }
    console.log(`Directory already exists: ${profileDir}`);
  }
}

const startServer = async (): Promise<void> => {
  try {
    console.log('Initializing database...');
    // Try to connect to database and initialize services
    // This will throw if PostgreSQL isn't available
    try {
      await databaseService.switchDatabaseBasedOnConnectivity();
      console.log('Database connectivity check passed');
    } catch (dbError) {
      console.error('Database connectivity check failed:', dbError);
      throw new Error('Database connection failed. The application requires PostgreSQL to be running.');
    }
    
    // Only proceed if database connection succeeded
    // Then try to seed default users
    try {
      await databaseService.user();
      console.log('User seeding completed');
    } catch (userError) {
      console.error('User seeding failed:', userError);
      throw new Error('Failed to seed users: ' + (userError instanceof Error ? userError.message : String(userError)));
    }

    // Start sync process
    try {
      console.log('Starting sync process...');
      const syncScriptPath = process.env.NODE_ENV === 'production' 
        ? path.join(__dirname, 'syncProcess.js')
        : path.join(__dirname, 'syncProcess.ts');
      
      if (fs.existsSync(syncScriptPath)) {
        const syncProcess = fork(syncScriptPath);
        syncProcess.on('error', (error: Error) => {
          console.error('Sync process error:', error);
        });
      } else {
        console.log('Sync process script not found at:', syncScriptPath);
        console.warn('Continuing without sync process');
      }
    } catch (error) {
      console.error('Failed to start sync process:', error);
      console.warn('Continuing without sync process');
    }

    // Ensure profile directory exists
    const profileDir = path.join(process.env.PROFILE_DIR || 'D:/', 'Profiles');
    console.log('Ensuring profile directory exists:', profileDir);
    await ensureProfileDirExists(profileDir);

    // Start the HTTP server
    const PORT = parseInt(process.env.PORT || '5050', 10);
    app.listen(PORT, () => {
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`Health check available at http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Server initialization failed:', error);
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    // Exit with error code if there's a database or other critical error
    process.exit(1);
  }
};

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
