# 好机场手册 (haojichang.cfd)

> 纯静态、高性能中文内容博客 —— 面向小白新手的“怎么找到适合自己的好机场”全方位指南。

---

## 📖 项目基本信息

- **网站域名：** `https://haojichang.cfd`
- **网站名称：** 好机场手册
- **英文辅助品牌：** HaoJiChang
- **技术框架：** Hugo Extended + 极速移动优先现代样式
- **核心定位：** 拒绝纯排行榜与商业噱头，围绕“什么样的机场才算好机场、新手怎么选、价格与流量计算、专线与节点甄别、客户端配置与订阅排障”建立客观、透明的内容知识体系。

---

## 🚀 常用运行命令

项目自带内置的 `hugo-extended` 运行环境，可直接通过 `npm` 或根目录的 `hugo.cmd` 启动：

```bash
# 1. 启动本地实时预览服务器 (支持热重载)
npm run serve
# 或者
.\hugo.cmd server -D

# 2. 生产环境打包构建 (生成优化静态资源至 public/)
npm run build

# 3. 运行全站 41 项质量指标自动化测试
npm run verify

# 4. 重新生成全站内容 (若修改了 data/airports.yaml)
npm run generate
```

---

## 🗂️ 目录结构规范

```text
haojichang.cfd/
├── content/                     # 网站内容源文件 (Markdown)
│   ├── _index.md                # 首页内容 (严格遵循首页SEO与Hero架构)
│   ├── choose/                  # 好机场怎么选 (8篇选购核心指南)
│   ├── plans/                   # 套餐与价格 (8篇价格/流量/倍率指南)
│   ├── clients/                 # 客户端入门 (8篇Windows/iOS/Android指南)
│   ├── airports/                # 好机场资料库 (28家单机场档案 + /all/大表)
│   └── faq/                     # 常见问题 (50个真实FAQ全部默认展开)
├── data/                        # 结构化数据源
│   ├── airports.yaml            # 28家好机场公开快照数据
│   └── keyword-map.yaml         # 全站URL主关键词防内耗映射表
├── layouts/                     # Hugo 布局模板 (纯静态无多余大JS)
│   ├── _default/                # 基础页面、列表与正文模板
│   ├── airports/                # 单机场档案与28家大表总览模板
│   ├── faq/                     # 50问FAQ专属展开模板
│   └── partials/                # 头部SEO、Schema结构化数据、响应式导航等
├── static/                      # 静态资源
│   └── css/main.css             # 移动优先CSS (完美自适应360px)
├── scripts/                     # 自动化生成与测试脚本
│   ├── generate-airports-data.js # 生成 airports.yaml
│   ├── generate-keyword-map.js   # 生成 keyword-map.yaml
│   ├── generate-articles-content.js # 生成指南文章与FAQ
│   ├── generate-airports-content.js # 生成单机场页面
│   ├── site-data.js             # 共享结构化核心数据
│   └── verify-site.js           # 41项指标全自动核验套件
├── hugo.yaml                    # Hugo 全局配置文件
├── package.json                 # npm 依赖与便捷命令
└── README.md                    # 本文档
```

---

## 🛡️ 核心合规与SEO技术落地

1. **绝对防内耗规范：** 全站 59 个独立 URL 均在 `data/keyword-map.yaml` 中配置唯一的主搜索意图与主关键词，任何两个 URL 均不重复竞争相同主词。
2. **Canonical 严格统一：** 所有页面规范化链接绝对锁定 `https://haojichang.cfd/`，彻底排查无 localhost、127.0.0.1、旧域名残留。
3. **第三方推广链接规范：** 所有外链一律在原始 HTML href 中输出，统一添加 `target="_blank" rel="sponsored nofollow noopener"`，站内链接绝不误加 nofollow。
4. **特定专属链接精确保证：**
   - 梯子云全部锁定使用专属邀请码 `KVyNkFYU`
   - 可信云严格锁定使用 `https://work.kosingaff/#/?code=pax3nIrw`（无 `.com` 后缀）
5. **结构化数据 Schema：**
   - 首页：`WebSite` + `Organization`
   - 正文指南：`BreadcrumbList` + `Article`
   - 常见问题页：真实 `FAQPage` Schema
   - 坚决杜绝假 Review、假评分与 AggregateRating
6. **移动端深度优化：** 针对 360px 宽度提供无横向滚动条的优雅自适应，表格具备 `overflow-x: auto` 弹性包裹。
7. **纯粹聚焦：** 绝无流媒体解锁、AI、ChatGPT 等泛科学上网违规或偏题内容，严禁创建 `/use-cases/` 目录。
