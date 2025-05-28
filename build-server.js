const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building server for production...');

function copyDirectory(source, destination) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(destination)) {
    fs.mkdirSync(destination, { recursive: true });
    console.log(`Created directory: ${destination}`);
  }

  // Read all items in source directory
  const items = fs.readdirSync(source, { withFileTypes: true });
  
  for (const item of items) {
    const sourcePath = path.join(source, item.name);
    const destPath = path.join(destination, item.name);
    
    if (item.isDirectory()) {
      // Recursively copy subdirectories
      copyDirectory(sourcePath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(sourcePath, destPath);
    }
  }
  console.log(`✓ Copied from ${source} to ${destination}`);
}

try {
  const serverPath = path.join(__dirname, 'server');
  const serverDistPath = path.join(serverPath, 'dist');
  const rootNodeModules = path.join(__dirname, 'node_modules');
  const serverNodeModules = path.join(serverPath, 'node_modules');

  // Step 1: Install server dependencies
  console.log('Step 1: Installing server dependencies...');
  execSync('npm install', { 
    cwd: serverPath, 
    stdio: 'inherit' 
  });

  // Step 2: Generate Prisma client in server
  console.log('Step 2: Generating server Prisma client...');
  execSync('npx prisma generate', { 
    cwd: serverPath, 
    stdio: 'inherit' 
  });

  // Step 3: Build TypeScript
  console.log('Step 3: Compiling TypeScript...');
  execSync('npm run build', { 
    cwd: serverPath, 
    stdio: 'inherit' 
  });

  // Step 4: Ensure dist directory exists
  if (!fs.existsSync(serverDistPath)) {
    console.log('Creating dist directory...');
    fs.mkdirSync(serverDistPath, { recursive: true });
  }

  // Step 5: Copy package.json to dist
  console.log('Step 5: Copying package.json to dist...');
  const serverPackageJson = require('./server/package.json');
  delete serverPackageJson.devDependencies;
  fs.writeFileSync(
    path.join(serverDistPath, 'package.json'),
    JSON.stringify(serverPackageJson, null, 2)
  );

  // Step 6: Copy Prisma client from multiple possible locations
  console.log('Step 6: Copying Prisma client...');
  
  const possiblePrismaLocations = [
    { src: path.join(serverNodeModules, '.prisma'), dest: path.join(serverDistPath, 'node_modules', '.prisma') },
    { src: path.join(rootNodeModules, '.prisma'), dest: path.join(serverDistPath, 'node_modules', '.prisma') },
    { src: path.join(serverNodeModules, '@prisma'), dest: path.join(serverDistPath, 'node_modules', '@prisma') },
    { src: path.join(rootNodeModules, '@prisma'), dest: path.join(serverDistPath, 'node_modules', '@prisma') }
  ];

  let prismaClientCopied = false;

  for (const { src, dest } of possiblePrismaLocations) {
    if (fs.existsSync(src)) {
      console.log(`Found Prisma at: ${src}`);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      
      try {
        copyDirectory(src, dest);
        console.log(`✓ Copied ${path.basename(src)} to dist`);
        prismaClientCopied = true;
      } catch (err) {
        console.warn(`Failed to copy ${src}:`, err.message);
      }
    }
  }

  if (!prismaClientCopied) {
    console.warn('⚠️ No Prisma client found in expected locations');
  }

  // Step 7: Install production dependencies in dist
  console.log('Step 7: Installing production dependencies in dist...');
  execSync('npm install --only=production', {
    cwd: serverDistPath,
    stdio: 'inherit'
  });

  // Step 8: Copy prisma schema
  const prismaSchemaPath = path.join(serverPath, 'prisma');
  const prismaSchemaDestPath = path.join(serverDistPath, 'prisma');
  
  if (fs.existsSync(prismaSchemaPath)) {
    try {
      copyDirectory(prismaSchemaPath, prismaSchemaDestPath);
      console.log('✓ Prisma schema copied successfully');
    } catch (err) {
      console.error('Failed to copy Prisma schema:', err.message);
    }
  }

  // Step 9: Verify build
  const indexPath = path.join(serverDistPath, 'index.js');
  if (fs.existsSync(indexPath)) {
    console.log('✓ Server index.js found at:', indexPath);
  } else {
    console.error('✗ Server index.js NOT found at:', indexPath);
    console.log('Contents of dist directory:');
    const files = fs.readdirSync(serverDistPath);
    files.forEach(file => console.log('  -', file));
  }

  console.log('✅ Server build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}