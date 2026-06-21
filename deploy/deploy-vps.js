const { Client } = require('ssh2');
const fs = require('fs');
const path = require('path');

const conn = new Client();

const CONFIG = {
  host: '76.13.138.20',
  port: 22,
  username: 'root',
  password: 'Kushan@#477?',
  remotePath: '/var/www/goamrit'
};

// Files and folders to exclude from upload
const EXCLUDE_LIST = [
  'node_modules',
  '.next',
  '.git',
  '.config',
  'backend/node_modules',
  'backend/.medusa',
  'backend/static',
  'backend/uploads',
  'vps_key',
  'vps_key.pub',
  'deploy-vps.js'
];

function shouldExclude(localPath) {
  const relative = path.relative(path.resolve(__dirname, '..'), localPath).replace(/\\/g, '/');
  return EXCLUDE_LIST.some(exclude => {
    return relative === exclude || relative.startsWith(exclude + '/');
  });
}

function execCommand(conn, cmd) {
  return new Promise((resolve, reject) => {
    console.log(`\nExecuting: ${cmd}`);
    conn.exec(cmd, (err, stream) => {
      if (err) return reject(err);
      stream.on('close', (code, signal) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Command failed with exit code ${code}`));
        }
      }).on('data', (data) => {
        process.stdout.write(data.toString());
      }).stderr.on('data', (data) => {
        process.stderr.write(data.toString());
      });
    });
  });
}

function putFile(sftp, localFile, remoteFile) {
  return new Promise((resolve, reject) => {
    sftp.fastPut(localFile, remoteFile, (err) => {
      if (err) reject(err);
      else resolve();
    });
  });
}

function makeDir(sftp, remoteDir) {
  return new Promise((resolve) => {
    sftp.mkdir(remoteDir, () => {
      // Ignore error if directory already exists
      resolve();
    });
  });
}

async function uploadDir(sftp, localDir, remoteDir) {
  await makeDir(sftp, remoteDir);
  const entries = fs.readdirSync(localDir, { withFileTypes: true });

  for (const entry of entries) {
    const localPath = path.join(localDir, entry.name);
    const remotePath = path.join(remoteDir, entry.name).replace(/\\/g, '/');

    if (shouldExclude(localPath)) {
      continue;
    }

    if (entry.isDirectory()) {
      await uploadDir(sftp, localPath, remotePath);
    } else {
      console.log(`Uploading: ${path.relative(path.resolve(__dirname, '..'), localPath)} -> ${remotePath}`);
      await putFile(sftp, localPath, remotePath);
    }
  }
}

conn.on('ready', () => {
  console.log('SSH connection established successfully.');

  conn.sftp(async (err, sftp) => {
    if (err) {
      console.error('SFTP error:', err);
      conn.end();
      return;
    }

    try {
      // 1. Provision Node.js, PostgreSQL and Git
      console.log('--- Step 1: Provisioning System Packages ---');
      await execCommand(conn, 'apt-get update -y');
      await execCommand(conn, 'curl -fsSL https://deb.nodesource.com/setup_20.x | bash -');
      await execCommand(conn, 'apt-get install -y nodejs postgresql postgresql-contrib git build-essential');
      await execCommand(conn, 'npm install -g pm2');

      // 2. Setup PostgreSQL database
      console.log('--- Step 2: Configuring PostgreSQL ---');
      await execCommand(conn, `sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'Kunj#477';"`);
      // Create database if not exists
      await execCommand(conn, `sudo -u postgres psql -c "SELECT 1 FROM pg_database WHERE datname = 'medusa_db'" | grep -q 1 || sudo -u postgres psql -c "CREATE DATABASE medusa_db OWNER postgres;"`);

      // 3. Create remote path
      console.log('--- Step 3: Preparing directories ---');
      await execCommand(conn, `mkdir -p ${CONFIG.remotePath}`);

      // 4. Upload files
      console.log('--- Step 4: Uploading project files ---');
      const rootLocalPath = path.resolve(__dirname, '..');
      await uploadDir(sftp, rootLocalPath, CONFIG.remotePath);
      console.log('Upload complete.');

      // 5. Build and run Backend
      console.log('--- Step 5: Setting up Backend ---');
      await execCommand(conn, `cd ${CONFIG.remotePath}/backend && npm install`);
      await execCommand(conn, `cd ${CONFIG.remotePath}/backend && npm run build`);
      await execCommand(conn, `cd ${CONFIG.remotePath}/backend && npx medusa db:migrate`);
      
      // Start or reload backend with PM2
      await execCommand(conn, `pm2 delete goamrit-backend || true`);
      await execCommand(conn, `cd ${CONFIG.remotePath}/backend && pm2 start npm --name "goamrit-backend" -- run start`);

      // 6. Build and run Storefront
      console.log('--- Step 6: Setting up Storefront ---');
      await execCommand(conn, `cd ${CONFIG.remotePath} && npm install`);
      await execCommand(conn, `cd ${CONFIG.remotePath} && npm run build`);

      // Start or reload storefront with PM2
      await execCommand(conn, `pm2 delete goamrit-storefront || true`);
      await execCommand(conn, `cd ${CONFIG.remotePath} && pm2 start npm --name "goamrit-storefront" -- start`);

      // 7. Setup Nginx Configuration
      console.log('--- Step 7: Configuring Nginx ---');
      await execCommand(conn, `cp ${CONFIG.remotePath}/deploy/nginx.conf /etc/nginx/sites-available/goamrit.conf`);
      await execCommand(conn, `ln -sf /etc/nginx/sites-available/goamrit.conf /etc/nginx/sites-enabled/`);
      await execCommand(conn, `rm -f /etc/nginx/sites-enabled/default || true`);
      await execCommand(conn, `nginx -t`);
      await execCommand(conn, `systemctl restart nginx`);

      // 8. Save PM2 status for reboot survival
      await execCommand(conn, `pm2 save`);
      await execCommand(conn, `pm2 startup | tail -n 1 | bash`); // Auto-exec PM2 startup script

      console.log('\n=============================================');
      console.log('DEPLOYMENT COMPLETED SUCCESSFULLY!');
      console.log('=============================================');

    } catch (e) {
      console.error('\nDeployment failed with error:', e.message);
    } finally {
      conn.end();
    }
  });
}).connect({
  host: CONFIG.host,
  port: CONFIG.port,
  username: CONFIG.username,
  password: CONFIG.password
});
