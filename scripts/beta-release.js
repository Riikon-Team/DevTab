import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import readline from 'readline';

const __dirname = dirname(fileURLToPath(import.meta.url));
const packagePath = join(__dirname, '../package.json');
const manifestPath = join(__dirname, '../public/manifest.json');

// Tạo giao diện dòng lệnh
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Đọc phiên bản hiện tại
const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
const currentVersion = pkg.version;
const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));
const manifestVersion = manifest.version;

console.log(`Package version: ${currentVersion}`);
console.log(`Manifest version: ${manifestVersion}`);

// Phương thức để lấy phiên bản cơ sở từ input
function getBaseVersion() {
  return new Promise((resolve) => {
    rl.question('Nhập phiên bản cơ sở (vd: 1.1.0, 2.0.0): ', (baseVersion) => {
      if (!baseVersion.match(/^\d+\.\d+\.\d+$/)) {
        console.log('Định dạng phiên bản không hợp lệ. Sử dụng định dạng X.Y.Z');
        return getBaseVersion().then(resolve);
      }
      resolve(baseVersion);
    });
  });
}

// Tạo beta version
async function createBeta() {
  const baseVersion = await getBaseVersion();
  
  console.log('\nTạo beta release:');
  console.log('1. Beta chính (vd: 1.1.0-beta)');
  console.log('2. Beta với số thứ tự (vd: 1.1.0-beta.1)');
  console.log('3. Beta với tên tùy chỉnh (vd: 1.1.0-alpha)');
  
  rl.question('Chọn loại beta (1-3): ', async (choice) => {
    let betaVersion;
    
    switch(choice) {
      case '1':
        betaVersion = `${baseVersion}-beta`;
        break;
      case '2':
        const betaNumber = await new Promise((resolve) => {
          rl.question('Nhập số thứ tự beta (vd: 1, 2, 3): ', (num) => {
            resolve(num);
          });
        });
        betaVersion = `${baseVersion}-beta.${betaNumber}`;
        break;
      case '3':
        const customSuffix = await new Promise((resolve) => {
          rl.question('Nhập hậu tố tùy chỉnh (vd: alpha, rc): ', (suffix) => {
            resolve(suffix);
          });
        });
        betaVersion = `${baseVersion}-${customSuffix}`;
        break;
      default:
        console.log('Lựa chọn không hợp lệ. Sử dụng beta mặc định.');
        betaVersion = `${baseVersion}-beta`;
    }
    
    createBetaRelease(betaVersion);
  });
}

function createBetaRelease(version) {
  try {
    console.log(`\nĐang tạo beta release phiên bản ${version}...`);
    
    // Cập nhật package.json
    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
    pkg.version = version;
    writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
    console.log(`Đã cập nhật package.json thành ${version}`);
    
    // Chạy script sync-version để cập nhật manifest.json
    console.log('Đang cập nhật manifest.json...');
    execSync('node scripts/sync-version.js', { stdio: 'inherit' });
    
    // Git: add, commit, tag
    execSync('git add package.json public/manifest.json', { stdio: 'inherit' });
    execSync(`git commit -m "Beta Release v${version}"`, { stdio: 'inherit' });
    execSync(`git tag -a v${version} -m "Beta Release v${version}"`, { stdio: 'inherit' });
    
    console.log(`\nĐã tạo thành công beta release phiên bản ${version}`);
    console.log('\nĐể hoàn tất release:');
    console.log('1. git push ; git push --tags');
    console.log('2. Build extension: npm run build');
    console.log('3. Zip thư mục dist thành devtab_v' + version + '.zip');
    console.log('4. Tạo GitHub Release với tag v' + version);
    
    rl.question('\nBạn có muốn push ngay? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        console.log('Đang push lên repository...');
        execSync('git push origin HEAD');
        execSync('git push origin --tags', { stdio: 'inherit' });
        console.log('Push thành công!');
      }
      rl.close();
    });
  } catch (error) {
    console.error('Lỗi khi tạo beta release:', error); 
    rl.close();
  }
}

// Bắt đầu
createBeta();