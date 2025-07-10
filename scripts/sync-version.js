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
    // Trước khi cập nhật version, kiểm tra xem các file có đồng bộ không
    if (pkg.version !== manifest.version && pkg.version !== '0.0.0') {
      console.error('Version mismatch between package.json and manifest.json');
      process.exit(1);
    }
  } else {
    // Sau khi cập nhật version, cập nhật manifest.json
    let manifestVersion = pkg.version;
    let isBeta = false;
    
    // Xử lý phiên bản beta
    if (manifestVersion.includes('-')) {
      isBeta = true;
      
      // Trích xuất phần cơ bản của version (vd: 1.1.0 từ 1.1.0-beta)
      const baseVersion = manifestVersion.split('-')[0];
      
      // Trích xuất số beta nếu có (vd: 1 từ 1.1.0-beta.1)
      const betaMatch = manifestVersion.match(/-[^.]+\.(\d+)$/);
      const betaNum = betaMatch ? betaMatch[1] : '0';
      
      // Chrome Extension version format: x.y.z.b
      const [major, minor, patch] = baseVersion.split('.');
      manifestVersion = `${major}.${minor}.${patch}.${betaNum}`;
      
      // Thêm đánh dấu Beta vào tên extension
      if (!manifest.name.includes('Beta')) {
        const betaType = manifestVersion.includes('-beta') ? 'Beta' : 
                        manifestVersion.includes('-alpha') ? 'Alpha' : 
                        manifestVersion.includes('-rc') ? 'RC' : 'Preview';
        manifest.name = `${manifest.name.replace(/\s\(.*\)$/, '')} (${betaType})`;
      }
    } else {
      // Nếu là bản chính thức, loại bỏ đánh dấu Beta (nếu có)
      manifest.name = manifest.name.replace(/\s\(.*\)$/, '');
    }
    
    // Cập nhật version trong manifest
    manifest.version = manifestVersion;
    writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
    
    console.log(`Updated manifest.json version to ${manifestVersion}${isBeta ? ' (Beta)' : ''}`);
  }
};

syncVersion(process.argv[2] === 'pre');