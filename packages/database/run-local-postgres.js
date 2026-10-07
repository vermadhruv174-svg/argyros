const { default: EmbeddedPostgres } = require('embedded-postgres');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '.pg-data');

const pg = new EmbeddedPostgres({
  databaseDir: dbDir,
  port: 5432,
  user: 'postgres',
  password: 'password',
  persistent: true,
  initdbFlags: ['-E', 'UTF8', '--locale=C'],
  onLog: (msg) => {
    if (msg.includes('ready to accept connections') || msg.includes('LOG:') || msg.includes('ERROR:')) {
      console.log('[PostgreSQL]', msg.trim());
    }
  },
});

async function main() {
  if (!fs.existsSync(dbDir)) {
    console.log('[PostgreSQL] Initializing UTF-8 cluster...');
    await pg.initialise();
  }
  console.log('[PostgreSQL] Starting server on port 5432...');
  await pg.start();
  console.log('[PostgreSQL] Server started successfully!');

  // Ensure 'argyros' database exists with UTF-8
  try {
    await pg.createDatabase('argyros');
    console.log('[PostgreSQL] Created database "argyros".');
  } catch (err) {
    // Database already exists
  }

  console.log('[PostgreSQL] Ready! Connection URL: postgresql://postgres:password@localhost:5432/argyros?schema=public');

  // Keep alive
  process.on('SIGINT', async () => {
    console.log('[PostgreSQL] Shutting down...');
    await pg.stop();
    process.exit(0);
  });
}

main().catch((err) => {
  console.error('[PostgreSQL] Fatal error:', err);
  process.exit(1);
});
