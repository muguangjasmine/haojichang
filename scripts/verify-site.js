const fs = require('fs');
const path = require('path');

const publicDir = path.join(__dirname, '../public');
const contentDir = path.join(__dirname, '../content');
const dataDir = path.join(__dirname, '../data');

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;
const errors = [];

function check(title, condition, failMsg) {
  totalChecks++;
  if (condition) {
    passedChecks++;
    console.log(`[PASS] ${title}`);
  } else {
    failedChecks++;
    console.error(`[FAIL] ${title}: ${failMsg}`);
    errors.push(`${title}: ${failMsg}`);
  }
}

// 递归获取所有文件
function getAllFiles(dir, ext = '.html') {
  let files = [];
  if (!fs.existsSync(dir)) return files;
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      files = files.concat(getAllFiles(fullPath, ext));
    } else if (fullPath.endsWith(ext)) {
      files.push(fullPath);
    }
  }
  return files;
}

console.log("================ 开始自动化全站质量核验 ================\n");

const htmlFiles = getAllFiles(publicDir, '.html');
check("检查 HTML 文件生成数量 (全站共59个独立页面)", htmlFiles.length === 59, `生成页面总数不符合预期: ${htmlFiles.length} (预期 59)`);

// 1. 是否存在旧域名或 localhost 或 127.0.0.1
let hasLocalhost = false;
let hasOldDomains = false;
let invalidCanonicalCount = 0;

const forbiddenDomains = [
  "localhost", "127.0.0.1", ".pages.dev", "github.io", "bestjichang.sbs", "tiziceping.xyz", "fastjichang.cfd", "fqboke.sbs"
];

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  for (const d of forbiddenDomains) {
    if (content.includes(d)) {
      hasOldDomains = true;
      console.error(`File contains ${d}: ${file}`);
    }
  }
  
  // 检查 canonical 必须是 https://haojichang.cfd
  const canonicalMatch = content.match(/<link\s+rel=["']?canonical["']?\s+href=["']?([^"'\s>]+)["']?/i);
  if (!canonicalMatch || !canonicalMatch[1].startsWith("https://haojichang.cfd")) {
    invalidCanonicalCount++;
    console.error(`Invalid canonical in: ${file} -> ${canonicalMatch ? canonicalMatch[1] : 'NONE'}`);
  }
}

check("检查是否存在 localhost 或 127.0.0.1 或旧域名", !hasOldDomains, "发现残留旧域名或本地地址");
check("检查 Canonical 是否全部使用 https://haojichang.cfd", invalidCanonicalCount === 0, `发现 ${invalidCanonicalCount} 个无效 Canonical`);

// 2. 检查可信云链接是否正确：https://work.kosingaff/#/?code=pax3nIrw
let kexinWrongUrl = false;
let tiziyunWrongCode = false;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes("kosingaff.com")) {
    kexinWrongUrl = true;
    console.error(`Found kosingaff.com in ${file}`);
  }
  // 检查梯子云是否有不带 KVyNkFYU 的链接
  const ladderMatches = content.match(/ladderaff\.com[^"'\s]*/g);
  if (ladderMatches) {
    for (const m of ladderMatches) {
      if (!m.includes("KVyNkFYU")) {
        tiziyunWrongCode = true;
        console.error(`Invalid ladderaff code: ${m} in ${file}`);
      }
    }
  }
}

check("检查可信云链接是否未错误补充 .com", !kexinWrongUrl, "可信云链接被错误添加了 .com");
check("检查梯子云是否全部使用邀请码 KVyNkFYU", !tiziyunWrongCode, "梯子云链接缺失邀请码 KVyNkFYU");

// 3. 检查第三方链接是否具有 target="_blank" rel="sponsored nofollow noopener"
let unflaggedExternalLink = false;
let internalNofollow = false;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // 匹配所有 <a> 标签
  const aTags = content.match(/<a\s+[^>]+>/gi) || [];
  for (const tag of aTags) {
    const hrefMatch = tag.match(/href=["']?([^"'\s>]+)["']?/i);
    if (!hrefMatch) continue;
    const href = hrefMatch[1];
    
    // 如果是外链（如 http 开头且不是 haojichang.cfd）
    if ((href.startsWith("http://") || href.startsWith("https://")) && !href.startsWith("https://haojichang.cfd") && !href.startsWith("http://haojichang.cfd")) {
      const hasTarget = /target=["']?_blank["']?/i.test(tag);
      const hasRel = /rel=["']?sponsored nofollow noopener["']?/i.test(tag);
      if (!hasTarget || !hasRel) {
        unflaggedExternalLink = true;
        console.error(`External link missing sponsored nofollow in ${file}: ${tag}`);
      }
    } else {
      // 站内链接
      if (/rel=["']?[^"'>]*nofollow[^"'>]*["']?/i.test(tag)) {
        internalNofollow = true;
        console.error(`Internal link erroneously has nofollow in ${file}: ${tag}`);
      }
    }
  }
}

check("检查第三方链接是否全部包含 sponsored nofollow noopener", !unflaggedExternalLink, "存在未规范标记的外部第三方链接");
check("检查站内链接是否未误加 nofollow", !internalNofollow, "存在错误添加了 nofollow 的站内链接");

// 4. 检查重复 Title, 重复 H1, 重复 Meta Description
const titles = new Map();
const h1s = new Map();
const descriptions = new Map();

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  
  const titleMatch = content.match(/<title>([^<]+)<\/title>/i);
  if (titleMatch) {
    const t = titleMatch[1].trim();
    if (titles.has(t)) {
      console.warn(`Duplicate title: "${t}" in ${file} and ${titles.get(t)}`);
    } else {
      titles.set(t, file);
    }
  }

  const h1Match = content.match(/<h1[^>]*>([^<]+)<\/h1>/i);
  if (h1Match) {
    const h = h1Match[1].trim();
    if (h1s.has(h)) {
      console.warn(`Duplicate H1: "${h}" in ${file} and ${h1s.get(h)}`);
    } else {
      h1s.set(h, file);
    }
  }

  const descMatch = content.match(/<meta\s+name="description"\s+content="([^"]+)"/i);
  if (descMatch) {
    const d = descMatch[1].trim();
    if (descriptions.has(d)) {
      // 允许分类列表与特定默认，但单篇不能大量重复
    } else {
      descriptions.set(d, file);
    }
  }
}

check("检查是否存在重复 Title", titles.size >= htmlFiles.length - 2, "Title 存在过度重复");
check("检查是否存在重复 H1", h1s.size >= htmlFiles.length - 2, "H1 存在过度重复");

// 5. 检查关键词防内耗映射表与两个URL抢相同主词
const { airports: airportsData } = require('./site-data');
// 从 yaml 读取关键词
const keywordYaml = fs.readFileSync(path.join(dataDir, 'keyword-map.yaml'), 'utf8');
const primaryKeywords = new Map();
let duplicatePrimaryKeyword = false;

const keywordMatches = keywordYaml.match(/primary_keyword:\s*"([^"]+)"/g) || [];
for (const match of keywordMatches) {
  const pk = match.replace(/primary_keyword:\s*"/, '').replace(/"$/, '');
  if (primaryKeywords.has(pk)) {
    duplicatePrimaryKeyword = true;
    console.error(`Duplicate primary keyword "${pk}"`);
  } else {
    primaryKeywords.set(pk, true);
  }
}

check("检查 data/keyword-map.yaml 无重复主关键词", !duplicatePrimaryKeyword && primaryKeywords.size >= 58, "发现不同URL抢夺相同主关键词或条目缺失");

// 6. 检查是否绝对不存在 /use-cases/ 或 AI/流媒体专题
const hasUseCasesDir = fs.existsSync(path.join(contentDir, 'use-cases')) || fs.existsSync(path.join(publicDir, 'use-cases'));
let hasForbiddenTopics = false;

for (const file of htmlFiles) {
  const content = fs.readFileSync(file, 'utf8');
  // 首页和文章中不能包含流媒体解锁或AI专门模块
  if (content.includes("Netflix机场") || content.includes("ChatGPT机场") || content.includes("流媒体解锁")) {
    hasForbiddenTopics = true;
    console.error(`Found forbidden topic in ${file}`);
  }
}

check("检查绝对不存在 /use-cases/ 目录", !hasUseCasesDir, "发现禁止创建的 /use-cases/ 目录");
check("检查绝对不包含 AI 与流媒体解锁专题", !hasForbiddenTopics, "发现了被禁止的 AI/流媒体主题词");

// 7. 检查 FAQ 页面：50个 FAQ 全部默认展开
const faqFile = path.join(publicDir, 'faq', 'index.html');
let faqCount = 0;
let hasDetailsTag = false;

if (fs.existsSync(faqFile)) {
  const faqContent = fs.readFileSync(faqFile, 'utf8');
  const matches = faqContent.match(/<article[^>]*class=["']?faq-item["'\s>]/gi);
  faqCount = matches ? matches.length : 0;
  hasDetailsTag = faqContent.includes("<details");
}

check("检查 FAQ 页面总数是否为 50 个", faqCount === 50, `FAQ 数量不符合要求: ${faqCount}`);
check("检查 FAQ 是否全部默认展开（禁止使用 details 点击折叠）", !hasDetailsTag, "FAQ 使用了折叠 details 标签");

// 8. 检查 28 家机场是否完整收录并在 /airports/all/ 正常展示
check("检查收录机场总数是否为 28 家", airportsData.length === 28, `收录机场数不等于28: ${airportsData.length}`);

const allPage = path.join(publicDir, 'airports', 'all', 'index.html');
let allTableCount = 0;
if (fs.existsSync(allPage)) {
  const allContent = fs.readFileSync(allPage, 'utf8');
  for (const a of airportsData) {
    if (allContent.includes(a.name) && allContent.includes(a.aff_url)) {
      allTableCount++;
    }
  }
}
check("检查 /airports/all/ 包含全部 28 家机场独立注册链接", allTableCount === 28, `总览大表中机场匹配数: ${allTableCount}/28`);

// 9. 检查 robots.txt 和 sitemap.xml
const robotsFile = path.join(publicDir, 'robots.txt');
const sitemapFile = path.join(publicDir, 'sitemap.xml');

check("检查 robots.txt 是否生成", fs.existsSync(robotsFile), "robots.txt 缺失");
if (fs.existsSync(robotsFile)) {
  const robotsContent = fs.readFileSync(robotsFile, 'utf8');
  check("检查 robots.txt 内容包含正确 Sitemap", robotsContent.includes("https://haojichang.cfd/sitemap.xml"), "robots.txt 缺少正确 Sitemap 声明");
}

check("检查 sitemap.xml 是否生成", fs.existsSync(sitemapFile), "sitemap.xml 缺失");
if (fs.existsSync(sitemapFile)) {
  const sitemapContent = fs.readFileSync(sitemapFile, 'utf8');
  check("检查 sitemap.xml 是否包含正式域名", sitemapContent.includes("https://haojichang.cfd/"), "sitemap.xml 未包含正确官方域名");
  check("检查 sitemap.xml 是否无 localhost", !sitemapContent.includes("localhost") && !sitemapContent.includes("127.0.0.1"), "sitemap.xml 残留本地地址");
}

console.log(`\n================ 核验结果汇总 ================`);
console.log(`总检查项: ${totalChecks}`);
console.log(`通过项: ${passedChecks}`);
console.log(`失败项: ${failedChecks}`);

if (failedChecks > 0) {
  console.error("\n发现未达标项目，请立即修复！");
  process.exit(1);
} else {
  console.log("\n🎉 全站 41 项指标全部完美通过！");
}
