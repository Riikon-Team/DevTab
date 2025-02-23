import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const manifestPath = join(__dirname, '../public/manifest.json');
const packagePath = join(__dirname, '../package.json');

const syncVersion = (preversion = false) => {
  const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
  
  if (preversion) {
    // Before version bump, check if files are in sync
    if (pkg.version !== manifest.version) {
      console.error('Version mismatch between package.json and manifest.json');
      process.exit(1);
    }
  } else {
    // After version bump, update manifest.json
    manifest.version = pkg.version;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    console.log(`Updated manifest.json version to ${pkg.version}`);
  }
};

syncVersion(process.argv[2] === 'pre');