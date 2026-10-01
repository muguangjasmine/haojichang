const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const parentDir = path.join(projectRoot, '..');
const localZip = path.join(projectRoot, 'haojichang.cfd.zip');
const parentZip = path.join(parentDir, 'haojichang.cfd.zip');
const sourceZip = path.join(parentDir, 'haojichang.cfd-source.zip');

console.log('🚀 开始执行一键“生成网站”全流程...\n');

// 1. 生成内容
console.log('1️⃣ 正在同步全站数据与页面内容...');
execSync('node scripts/generate-articles-content.js', { cwd: projectRoot, stdio: 'inherit' });
execSync('node scripts/generate-airports-content.js', { cwd: projectRoot, stdio: 'inherit' });

// 2. Hugo 构建
console.log('\n2️⃣ 正在使用 Hugo Extended 进行生产环境编译 (--cleanDestinationDir --minify)...');
const hugoBin = path.join(projectRoot, 'node_modules', 'hugo-extended', 'bin', 'hugo.exe');
execSync(`"${hugoBin}" --cleanDestinationDir --minify`, { cwd: projectRoot, stdio: 'inherit' });

// 3. 运行验证
console.log('\n3️⃣ 正在执行全站 41 项指标自动化核验...');
execSync('node scripts/verify-site.js', { cwd: projectRoot, stdio: 'inherit' });

// 4. 打包 public 目录
console.log('\n4️⃣ 正在将 public/ 目录打包为生产部署压缩包...');
const publicPath = path.join(projectRoot, 'public', '*');

[localZip, parentZip].forEach(z => {
  if (fs.existsSync(z)) {
    try { fs.unlinkSync(z); } catch (e) {}
  }
});

try {
  execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${publicPath}' -DestinationPath '${parentZip}' -Force"`, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  if (fs.existsSync(parentZip)) {
    fs.copyFileSync(parentZip, localZip);
    const sizeMB = (fs.statSync(parentZip).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ 生产部署压缩包生成成功:`);
    console.log(`   - ${parentZip} (${sizeMB} MB)`);
    console.log(`   - ${localZip} (${sizeMB} MB)`);
  }
} catch (e) {
  console.error('打包压缩包出错:', e.message);
}

// 5. 打包源码压缩包（排除 node_modules 和 public）
try {
  console.log('\n5️⃣ 正在打包完整源码归档...');
  if (fs.existsSync(sourceZip)) {
    try { fs.unlinkSync(sourceZip); } catch (e) {}
  }
  execSync(`powershell -NoProfile -Command "Get-ChildItem -Path '${projectRoot}' -Exclude 'node_modules', 'public', '.git', '*.zip' | Compress-Archive -DestinationPath '${sourceZip}' -Force"`, {
    cwd: projectRoot,
    stdio: 'inherit'
  });
  if (fs.existsSync(sourceZip)) {
    const srcSizeMB = (fs.statSync(sourceZip).size / (1024 * 1024)).toFixed(2);
    console.log(`✅ 源码归档压缩包生成成功:`);
    console.log(`   - ${sourceZip} (${srcSizeMB} MB)`);
  }
} catch (e) {
  console.error('打包源码出错:', e.message);
}

console.log('\n🎉 网站生成与打包全部顺利完成！');
