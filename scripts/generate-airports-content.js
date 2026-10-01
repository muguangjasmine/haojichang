const fs = require('fs');
const path = require('path');

const { airports } = require('./site-data');
const airportsDir = path.join(__dirname, '../content/airports');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureDir(airportsDir);

// 1. 生成 /airports/_index.md
const airportsIndexContent = `---
title: "好机场资料库"
description: "2026好机场资料库整理28家服务商公开快照数据，包含参考价格、每月流量、线路类型、节点覆盖、客户端支持与官网入口，拒绝虚高宣传。"
h1: "2026好机场资料库｜价格、流量、线路与官网入口"
primary_keyword: "好机场资料库"
---
好机场手册持续追踪与核验主流机场服务商的公开参数。本资料库汇总了28家代表性服务商的基础信息，通过统一的指标对照，方便新手根据预算、流量与线路需求自主判断。
`;
fs.writeFileSync(path.join(airportsDir, '_index.md'), airportsIndexContent, 'utf8');

// 2. 生成 /airports/all/index.md (28家总览)
const allDir = path.join(airportsDir, 'all');
ensureDir(allDir);
const allIndexContent = `---
title: "2026好机场大全｜28家机场价格、流量、线路与官网入口"
description: "2026好机场大全汇总28家机场公开参考快照：价格、月流量、IEPL/IPLC专线、常用节点与官网注册链接，同屏完整对比无须横向滑动，手机端自适应。"
h1: "2026好机场大全：28家机场资料一次比较"
primary_keyword: "2026好机场大全"
layout: "all"
show_comparison_table: true
---
为了方便新手读者在同一个页面内对所有候选服务商进行全面对照，好机场手册特别制作了本份2026好机场综合资料库。数据源自服务商公开资料与最新结算页快照，页面采用自适应同屏排版，无须左右划动即可一览全部关键指标。
`;
// 注意：在 Hugo 中，我们可以通过 custom layout 或者直接在 md 中使用短代码/HTML。为了保证最稳妥的渲染，让 /airports/all/index.md 采用专门的 layout 或者由 Hugo partial 处理
// 在 layouts/airports/all.html 或者 layouts/_default/single.html 里面如果调用 partial，我们可以写一个 layouts/airports/all.html 或通过 shortcode
fs.writeFileSync(path.join(allDir, 'index.md'), allIndexContent, 'utf8');

// 3. 生成 28 家单机场独立页面
const titlesMap = {
  "tiziyun": "梯子云怎么样？价格、流量与适合人群",
  "moguang": "暮光加速怎么样？月付、线路与套餐资料",
  "flycat": "飞猫云适合谁？年付价格与流量怎么看",
  "breezenet": "微风网络怎么样？套餐与线路资料",
  "yinxingren": "隐形人怎么样？价格、流量与VLESS Reality资料",
  "wavenet": "浪网怎么样？约24元200GB套餐资料",
  "lingdong": "灵动云怎么样？约20元150GB与VLESS协议资料",
  "flyv": "飞V怎么样？约18元120GB与1.0x倍率资料",
  "quanqiuyun": "全球云怎么样？约20元120GB与BGP跨境网络资料",
  "xingdaomeng": "星岛梦怎么样？约8元折算年付与60GB轻量资料",
  "lightspeed": "光速云怎么样？约8元起IPLC专线资料",
  "v2yun": "唯兔云适合谁？约79.9元年付与45GB流量资料",
  "u1s1": "U1S1怎么样？约20元120GB与IEPL专线资料",
  "jilianyun": "极连云怎么样？约96元年付与IPLC专线资料",
  "guangnianti": "光年梯怎么样？约18元110GB与IPLC月付资料",
  "sogoyun": "Sogo云怎么样？约25元150GB专线加中转资料",
  "yuzhouyun": "宇宙云怎么样？年付价格、60GB流量与线路资料",
  "2maoyun": "二猫云怎么样？20元130GB套餐资料",
  "1flyun": "一翻云怎么样？20元150GB套餐与线路资料",
  "edgenova": "边缘节点EdgeNova怎么样？15元72GB月付资料",
  "kexinyun": "可信云怎么样？25元150GB套餐与IEPL专线资料",
  "sujie": "速界怎么样？25元150GB大流量套餐资料",
  "kuaili": "快狸怎么样？10元30GB轻度入门资料",
  "wuyou": "无忧怎么样？79元年付与40GB轻度资料",
  "lingmao": "灵猫怎么样？企业级专线与150GB档位资料",
  "flashleap": "闪跃怎么样？8元5GB与IPLC应急资料",
  "firefly": "飞为怎么样？96元年付与IPLC+VLESS资料",
  "kuajie": "跨界怎么样？96元年付与60GB备用资料"
};

const verdictsMap = {
  "tiziyun": "月付入门好选择，¥25/月配125GB企业专线，日常查资料办公平稳顺畅。",
  "moguang": "约20元月付的IEPL纯专线方案，抗网络抖动表现好，适合预算适中的新手。",
  "flycat": "¥84/年起折合月均仅7元左右，IEPL内网专线资料，轻量备用高性价比首选。",
  "breezenet": "BGP专线资料，多档位套餐与灵活结算，适合网络环境复杂和多场景备用。",
  "yinxingren": "¥24/月配144GB，主打VLESS Reality防封锁抗干扰协议，适合敏感网络环境。",
  "wavenet": "约24元月付给足约200GB充足流量，中高频日常浏览性价比较高。",
  "lingdong": "约20元月付配约150GB流量与VLESS新协议，兼顾了成本控制与中度流量。",
  "flyv": "约18元月付配约120GB流量，1.0x标准计费资料实在，低门槛试水备选项。",
  "quanqiuyun": "采用BGP跨境网络资料，约20元月付配约120GB流量，适合跨运营商切换频繁的日常用户。",
  "xingdaomeng": "折合约8元每月（年付形式），提供约60GB月流量，适合预算极紧凑且用量很少的轻量读者。",
  "lightspeed": "起步门槛约8元起配约60GB流量，具备IPLC专线资料，兼顾了专线低延迟与亲民门槛。",
  "v2yun": "年付约79.9元配45GB月流量，折合约6.6元每月，具备IPLC专线资料，适合轻度年付备用。",
  "u1s1": "提供约20元月付、约120GB流量与IEPL资料，整体定位偏向务实均衡的月付新手。",
  "jilianyun": "以约96元/年配60GB月流量，具备IPLC专线资料，是轻度年付用户的平稳选择。",
  "guangnianti": "约18元月付提供约110GB流量与IPLC专线资料，在20元以内月付市场中具有较好性价比。",
  "sogoyun": "采用专线加中转双资料，约25元月付提供约150GB流量，适合作为多设备日常主力的平稳节点方案。",
  "yuzhouyun": "提供96元/年、每月60GB的IEPL+BGP方案，适合轻量且希望一次性年付省心的读者。",
  "2maoyun": "以20元月付提供130GB流量与IPLC专线资料，各方面参数平衡，适合日常学习与轻量办公。",
  "1flyun": "在20元月付档位给出了150GB大容量与IEPL专线资料，单G流量成本在月付套餐中较为突出。",
  "edgenova": "提供15元月付、72GB月流量的基础方案，门槛亲民，适合低成本轻量日常查阅。",
  "kexinyun": "提供¥25/月、150GB流量的IEPL专线方案，适合看重日常连接连贯性的中度主力用户。",
  "sujie": "方案为¥25/月配150GB流量，支持主流客户端，适合普通日常中度流量需求。",
  "kuaili": "仅需10元月付即可获得30GB流量，门槛极低，适合轻度偶尔使用的小白用户试水。",
  "wuyou": "以¥79/年提供40GB月流量，折合月均仅约6.5元，适合用量不大的年付备用需求。",
  "lingmao": "具备企业级专线资料，主打约150GB流量档位，适合注重线路质量与连接连贯性的用户。",
  "flashleap": "起步仅需8元月付，提供5GB起步的IPLC资料，门槛极低，适合轻度应急验证使用。",
  "firefly": "提供¥96/年配60GB/月方案，具备IPLC专线与VLESS协议双重资料，是轻量年付的好搭档。",
  "kuajie": "以¥96/年配60GB月流量作为入门年付选项，年均成本低，适合作为常备备用机场。"
};

for (const a of airports) {
  const pageTitle = titlesMap[a.slug] || `${a.name}怎么样？价格、流量与评测资料`;
  const verdict = verdictsMap[a.slug] || a.summary;
  
  // 生成2-3个专属FAQ
  const specificFaqs = [
    {
      q: `${a.name}适合第一次买机场的新手吗？`,
      a: `${a.name}作为本站资料库收录的服务商之一，${a.support_monthly ? '支持灵活月付，新手可以花单月成本进行网络体验验证。' : '起步以周期付或年付为主，适合明确自己用量偏小的轻量用户作为长期备选。'}选购前请确认支持的客户端与自身需求相匹配。`
    },
    {
      q: `${a.name}的价格和流量是多少？`,
      a: `根据当前公开参考快照，${a.name}的参考价格为 ${a.price_ref}，对应月度流量为 ${a.traffic_month}。资费和优惠可能随服务商调整，请以官网结算页面为准。`
    },
    {
      q: `${a.name}的订阅链接可以在手机和电脑上通用吗？`,
      a: `可以。${a.name}支持主流通用订阅协议，在后台复制订阅链接后，可直接导入到 Windows 的 Clash Verge Rev、v2rayN，以及 iPhone 的 Shadowrocket 中。`
    }
  ];

  const mdContent = `---
title: ${JSON.stringify(pageTitle)}
description: ${JSON.stringify(`${a.name}怎么样？整理${a.name}(${a.en_name})参考价格${a.price_ref}、月流量${a.traffic_month}、${a.network_line}、节点与客户端教程，提供官网注册入口。`)}
h1: ${JSON.stringify(pageTitle)}
primary_keyword: ${JSON.stringify(`${a.name}怎么样`)}
airport_id: ${JSON.stringify(a.id)}
airport_name: ${JSON.stringify(a.name)}
en_name: ${JSON.stringify(a.en_name)}
price_ref: ${JSON.stringify(a.price_ref)}
billing_cycle: ${JSON.stringify(a.billing_cycle)}
traffic_month: ${JSON.stringify(a.traffic_month)}
network_line: ${JSON.stringify(a.network_line)}
protocol: ${JSON.stringify(a.protocol)}
node_regions: ${JSON.stringify(a.node_regions)}
multiplier: ${JSON.stringify(a.multiplier)}
coupon_code: ${JSON.stringify(a.coupon_code)}
aff_url: ${JSON.stringify(a.aff_url)}
target_users: ${JSON.stringify(a.target_users)}
unsuitable_users: ${JSON.stringify(a.unsuitable_users)}
verdict: ${JSON.stringify(verdict)}
last_verified: ${JSON.stringify(a.last_verified)}
faqs:
${specificFaqs.map(f => `  - q: ${JSON.stringify(f.q)}\n    a: ${JSON.stringify(f.a)}`).join('\n')}
related:
  - title: "2026新手怎么选好机场？避坑保姆级步骤"
    url: "/choose/newbie-guide/"
  - title: "好机场Clash Verge Rev怎么用？从安装到导入"
    url: "/clients/clash-verge-rev/"
  - title: "2026好机场大全：28家机场资料一次比较"
    url: "/airports/all/"
---

## 价格与套餐周期分析

${a.name}（英文名：${a.en_name}）在当前公开资料中，参考定价为 **${a.price_ref}**，计费周期支持 **${a.billing_cycle}**。

${a.support_monthly ? 
`该服务商支持月付方式，对于第一次接触该机场的小白读者非常友好。你只需要支付单月费用，即可直接测试在本地电信、移动或联通宽带下的真实上网体验。如果不适应随时可以停止续费，试错成本完全可控。` : 
`该服务商起步主要以年付或特定周期为主。折算下来单月均摊成本较低，非常适合已经明确自己日常每月用量较小、不想每月手动续费的轻度用户作为长期通道使用。`}

> **价格动态提醒：** 以上数据为公开参考快照，服务商可能根据机房成本与活动节点微调套餐，实际付款前请以官方结算页面标价为准。

## 月度流量与使用匹配

本套餐在参考快照中提供 **${a.traffic_month}**。

- **日常文字查资料与学术检索：** 每月消耗一般在 20GB — 40GB 左右，当前配额能够平稳覆盖整月的查阅需求；
- **社交沟通与代码查阅：** 手机和电脑双端日常挂载，处理日常办公邮件与网页沟通十分从容；
- **下载大文件提示：** 若遇到大体积文件传输或高负荷任务，请注意在客户端中合理规划，避免在短时间内消耗过多流量。

## 线路架构与节点特征

在网络架构方面，${a.name}具备 **${a.network_line}** 相关公开资料。

- **节点覆盖区域：** 主要覆盖 ${a.node_regions} 等常用地区；
- **节点倍率：** ${a.multiplier}；
- **线路体验：** 常用亚太低延迟节点在日常浏览时具有良好的响应敏捷度，能够有效避免公共公网在晚高峰时段的剧烈网络拥堵。

## 客户端兼容性与订阅配置

${a.name}全面支持通用的订阅格式，无需强制使用专有封闭软件：

1. **Windows 电脑端：** 推荐使用开源主流的 **Clash Verge Rev** 或轻量级的 **v2rayN**，直接粘贴订阅链接即可自动解析所有节点并开启系统代理；
2. **苹果 iOS 端：** 推荐在美区或外区商店获取 **Shadowrocket（小火箭）**，通过浏览器一键导入或扫描二维码，即可秒速同步；
3. **安卓 Android 端：** 推荐使用 **Clash Meta for Android**，配合规则分流，日常上网省电省心。

## 购买前注意事项与自检建议

在前往官网注册购买之前，好机场手册建议新手读者进行以下快速自检：

- **核对优惠代码：** 结算时可尝试输入优惠码 \`${a.coupon_code}\`，确认是否享有相应减免；
- **确认设备支持：** 确认套餐允许的同时在线设备数满足你的日常电脑与手机需求；
- **遵守网络规范：** 合理合规使用网络资源，仅用于学习交流、跨境技术查阅与外贸业务沟通。
`;

  fs.writeFileSync(path.join(airportsDir, `${a.slug}.md`), mdContent, 'utf8');
}

console.log(`Successfully generated /airports/ (28 single pages + all + index).`);
