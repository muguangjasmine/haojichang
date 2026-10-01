const fs = require('fs');
const path = require('path');

const keywordEntries = [
  {
    url: "/",
    primary_keyword: "2026好机场推荐",
    secondary_keywords: ["好机场推荐", "新手好机场推荐", "好用的机场推荐", "机场官网入口"],
    search_intent: "寻找2026年综合好机场推荐与新手入门指导",
    category: "首页",
    target_user: "第一次接触机场需要系统性指导的新手"
  },
  {
    url: "/choose/",
    primary_keyword: "好机场怎么选",
    secondary_keywords: ["新手怎么选好机场", "怎么判断机场好不好", "好机场应该看什么", "好机场选择标准"],
    search_intent: "了解好机场的挑选逻辑与判定标准",
    category: "好机场怎么选",
    target_user: "面对海量机场不知从何挑起的小白"
  },
  {
    url: "/choose/what-is-good-airport/",
    primary_keyword: "什么样的机场算好机场",
    secondary_keywords: ["好机场定义", "优质机场标准", "机场稳定性判断", "不卡顿的机场"],
    search_intent: "弄清好机场的核心特征与虚假宣传套路",
    category: "好机场怎么选",
    target_user: "对好机场概念模糊、担心踩坑的初学者"
  },
  {
    url: "/choose/newbie-guide/",
    primary_keyword: "第一次买好机场怎么选",
    secondary_keywords: ["新手买机场避坑", "机场购买第一步", "小白买梯子注意", "机场入门选购"],
    search_intent: "新手第一次购买好机场的保姆级决策指南",
    category: "好机场怎么选",
    target_user: "从未买过机场、准备初次下单的零基础用户"
  },
  {
    url: "/choose/key-metrics/",
    primary_keyword: "好机场应该看什么",
    secondary_keywords: ["机场参数怎么看", "机场核心指标", "线路节点价格评估", "判断机场好不好"],
    search_intent: "学会阅读机场官网的各项技术与套餐参数",
    category: "好机场怎么选",
    target_user: "面对花哨宣传单页看不懂关键指标的用户"
  },
  {
    url: "/choose/node-quantity/",
    primary_keyword: "好机场节点越多越好吗",
    secondary_keywords: ["机场节点数量", "节点多好还是少好", "无效冗余节点", "好机场节点选择"],
    search_intent: "破解节点数量神话，掌握高质量节点甄别技巧",
    category: "好机场怎么选",
    target_user: "误以为节点几百个就是好机场的初学者"
  },
  {
    url: "/choose/monthly-vs-yearly/",
    primary_keyword: "好机场月付还是年付",
    secondary_keywords: ["机场付款周期", "月付机场推荐", "年付风险与优势", "新手适合月付吗"],
    search_intent: "分析月付与年付的风险、折算成本与选择策略",
    category: "好机场怎么选",
    target_user: "在月付灵活度与年付打折之间纠结的用户"
  },
  {
    url: "/choose/primary-vs-backup/",
    primary_keyword: "主力机场和备用机场有什么区别",
    secondary_keywords: ["备用好机场推荐", "双机场搭配策略", "低成本备用梯子", "容灾备用网络"],
    search_intent: "了解主力机与备用机的差异定位与最佳搭配方案",
    category: "好机场怎么选",
    target_user: "对工作或学习断网零容忍、需要稳定双保险的用户"
  },
  {
    url: "/choose/multi-device/",
    primary_keyword: "多设备怎么选择好机场",
    secondary_keywords: ["多设备好机场推荐", "同时在线设备限制", "手机电脑同步使用", "家庭共享机场"],
    search_intent: "掌握多端共用时的设备限制、IP并发与稳定性选型",
    category: "好机场怎么选",
    target_user: "手持手机、电脑、平板等多台设备的小白用户"
  },
  {
    url: "/choose/network-lines/",
    primary_keyword: "好机场线路怎么选",
    secondary_keywords: ["机场线路怎么看", "好机场IEPL线路", "好机场IPLC线路", "中转机场好不好"],
    search_intent: "彻底理清直连、中转、IEPL、IPLC专线区别",
    category: "好机场怎么选",
    target_user: "对专线术语困惑但追求稳定低延迟的用户"
  },
  {
    url: "/plans/",
    primary_keyword: "好机场套餐",
    secondary_keywords: ["好机场套餐怎么选", "新手好机场套餐", "好机场套餐价格", "轻度使用好机场套餐"],
    search_intent: "综合了解好机场各类套餐类型与规格划分",
    category: "套餐与价格",
    target_user: "准备挑选合适资费档位与流量包的新手"
  },
  {
    url: "/plans/price/",
    primary_keyword: "好机场多少钱一个月",
    secondary_keywords: ["好机场价格", "好机场月付多少钱", "20元左右好机场", "30元左右好机场"],
    search_intent: "获取好机场主流价格区间与合理预算参考",
    category: "套餐与价格",
    target_user: "想知道正常买一个好机场每月合理花费的用户"
  },
  {
    url: "/plans/is-100gb-enough/",
    primary_keyword: "好机场100GB够不够",
    secondary_keywords: ["100G流量能用多久", "每月100G流量概念", "查资料100G够吗", "好机场流量估算"],
    search_intent: "换算100GB流量在日常网页、办公等场景下的实际耐用度",
    category: "套餐与价格",
    target_user: "对GB流量数字缺乏直观感受的小白用户"
  },
  {
    url: "/plans/who-needs-200gb/",
    primary_keyword: "好机场200GB适合谁",
    secondary_keywords: ["200G流量使用场景", "多设备大流量套餐", "中高频上网流量", "大容量好机场"],
    search_intent: "分析200GB月流量档位的适配人群与消耗节奏",
    category: "套餐与价格",
    target_user: "上网频次较高、担心流量用尽的用户"
  },
  {
    url: "/plans/monthly-plans/",
    primary_keyword: "月付好机场怎么选",
    secondary_keywords: ["低门槛月付机场", "支持月付的好机场", "月付好机场推荐", "单月购买注意事项"],
    search_intent: "学会筛选支持单月订阅且不额外加收手续费的好机场",
    category: "套餐与价格",
    target_user: "追求低试错成本、坚持按月付款的用户"
  },
  {
    url: "/plans/is-yearly-worth-it/",
    primary_keyword: "好机场年付值得买吗",
    secondary_keywords: ["年付好机场推荐", "好机场年付多少钱", "百元年付机场", "年付风险防范"],
    search_intent: "权衡年付的折算低价与服务商跑路风险",
    category: "套餐与价格",
    target_user: "被大幅度年付折扣吸引但心存顾虑的用户"
  },
  {
    url: "/plans/traffic-multiplier/",
    primary_keyword: "好机场流量倍率是什么意思",
    secondary_keywords: ["好机场流量怎么算", "机场倍率节点", "高倍率扣费陷阱", "1.0x倍率解释"],
    search_intent: "掌握节点倍率的计算方式，防止流量莫名蒸发",
    category: "套餐与价格",
    target_user: "发现流量扣减飞快、不知何为倍率的新手"
  },
  {
    url: "/plans/budget-airports/",
    primary_keyword: "便宜好机场怎么选",
    secondary_keywords: ["低预算好机场推荐", "10元好机场", "平价好机场", "便宜好机场避坑"],
    search_intent: "在有限预算内挑选不虚标、线路可用、有售后响应的平价机场",
    category: "套餐与价格",
    target_user: "预算非常有限、寻找高性价比平价节点的用户"
  },
  {
    url: "/plans/verify-before-purchase/",
    primary_keyword: "好机场购买前怎么核对套餐",
    secondary_keywords: ["购买机场核对清单", "结算页隐形规则", "优惠码输入验证", "防扣错费指南"],
    search_intent: "下单结账前逐项核对周期、流量、退款与优惠条款",
    category: "套餐与价格",
    target_user: "准备点击结算付款的临门一脚新手"
  },
  {
    url: "/clients/",
    primary_keyword: "好机场客户端",
    secondary_keywords: ["好机场用什么客户端", "好机场Windows客户端", "好机场Android客户端", "好机场iPhone客户端"],
    search_intent: "全面了解各系统平台最匹配的好机场代理工具",
    category: "客户端入门",
    target_user: "买好订阅后不知该下载什么软件的新手"
  },
  {
    url: "/clients/clash-verge-rev/",
    primary_keyword: "好机场Clash Verge Rev怎么用",
    secondary_keywords: ["好机场Clash教程", "Clash Verge Rev导入订阅", "Clash内核选择", "Windows首选Clash"],
    search_intent: "掌握新一代开源 Clash Verge Rev 客户端的配置与订阅导入",
    category: "客户端入门",
    target_user: "Windows或macOS上使用Clash Verge Rev的用户"
  },
  {
    url: "/clients/windows-tutorial/",
    primary_keyword: "Windows怎么使用好机场",
    secondary_keywords: ["电脑怎么连好机场", "Windows代理设置", "系统代理开关", "Win电脑科学上网教程"],
    search_intent: "从零开始在Windows电脑上完成软件安装、订阅配置与开机自启",
    category: "客户端入门",
    target_user: "仅使用Windows台式机或笔记本的小白"
  },
  {
    url: "/clients/shadowrocket/",
    primary_keyword: "好机场Shadowrocket怎么配置",
    secondary_keywords: ["好机场小火箭教程", "Shadowrocket导入订阅", "小火箭节点选择", "小火箭全局路由"],
    search_intent: "学习iOS上最具口碑的Shadowrocket(小火箭)订阅导入与规则分流",
    category: "客户端入门",
    target_user: "持有外区Apple ID并已安装小火箭的iPhone/iPad用户"
  },
  {
    url: "/clients/iphone-tutorial/",
    primary_keyword: "iPhone怎么导入好机场订阅",
    secondary_keywords: ["苹果手机好机场教程", "iOS一键导入订阅", "苹果手机代理配置", "iPhone节点切换"],
    search_intent: "iPhone用户获取外区应用、复制订阅链接与一键同步完整流程",
    category: "客户端入门",
    target_user: "首次在iPhone上尝试使用好机场的苹果用户"
  },
  {
    url: "/clients/v2rayn/",
    primary_keyword: "好机场v2rayN怎么用",
    secondary_keywords: ["好机场v2rayN教程", "v2rayN导入订阅", "v2rayN设置系统代理", "v2rayN节点延迟测试"],
    search_intent: "学会老牌轻量级工具 v2rayN 的订阅添加、节点测速与系统路由设置",
    category: "客户端入门",
    target_user: "偏好极简原生内核控制界面的Windows用户"
  },
  {
    url: "/clients/android-tutorial/",
    primary_keyword: "Android怎么使用好机场",
    secondary_keywords: ["安卓手机好机场教程", "Clash Meta for Android", "安卓一键导入订阅", "安卓分流绕过大陆"],
    search_intent: "Android手机上安装客户端、导入订阅与防止后台被杀的指南",
    category: "客户端入门",
    target_user: "使用小米、华为、OPPO、vivo等安卓机型的新手"
  },
  {
    url: "/clients/update-subscription/",
    primary_keyword: "好机场订阅怎么更新",
    secondary_keywords: ["订阅更新失败怎么办", "机场订阅链接失效", "自动定时更新订阅", "重置订阅链接"],
    search_intent: "排查订阅更新报错原因，掌握手动刷新与自动定时更新策略",
    category: "客户端入门",
    target_user: "遇到节点不显示或更新报错不知所措的用户"
  },
  {
    url: "/clients/switch-nodes/",
    primary_keyword: "好机场节点怎么切换",
    secondary_keywords: ["节点连接不上怎么办", "香港节点和日本节点怎么选", "新加坡节点适合什么情况", "节点延迟怎么看"],
    search_intent: "掌握节点切换方法、真连接延迟测试与节点排障方案",
    category: "客户端入门",
    target_user: "打开网站打不开、不知道如何换节点的初学者"
  },
  {
    url: "/airports/",
    primary_keyword: "好机场资料库",
    secondary_keywords: ["2026好机场档案", "机场参数对照库", "机场套餐核验", "真实机场信息库"],
    search_intent: "查阅全部经过结构化整理的真实机场档案",
    category: "好机场资料",
    target_user: "希望逐家比对官方信息与套餐规格的理性用户"
  },
  {
    url: "/airports/all/",
    primary_keyword: "2026好机场大全",
    secondary_keywords: ["28家机场对比", "全部机场横向大表", "好机场价格流量总表", "2026机场全览"],
    search_intent: "一览28家好机场的价格、流量、线路、优惠与官网入口",
    category: "好机场资料",
    target_user: "希望在单页大表格中横向对比所有候选机场的用户"
  },
  {
    url: "/faq/",
    primary_keyword: "好机场常见问题解答",
    secondary_keywords: ["好机场50问", "买机场新手问答", "梯子常见故障排查", "小白机场指南汇总"],
    search_intent: "快速检索50个关于好机场选择、购买、配置与排错的高频疑问",
    category: "常见问题",
    target_user: "遇到突发疑问或技术障碍需要快速查阅标准答案的用户"
  },
  // 28家单机场页面主关键词
  {
    url: "/airports/tiziyun/",
    primary_keyword: "梯子云怎么样",
    secondary_keywords: ["梯子云价格", "梯子云125GB套餐", "梯子云企业专线", "梯子云适合人群"],
    search_intent: "全面了解梯子云的企业专线、25元月付与日常主力使用表现",
    category: "好机场资料",
    target_user: "打算入手梯子云的新手用户"
  },
  {
    url: "/airports/moguang/",
    primary_keyword: "暮光加速怎么样",
    secondary_keywords: ["暮光加速月付", "暮光加速IEPL专线", "暮光加速20元套餐", "暮光加速评测"],
    search_intent: "评估暮光加速20元档位IEPL纯专线的性价比与新手友好度",
    category: "好机场资料",
    target_user: "预算20元左右找专线机场的初学者"
  },
  {
    url: "/airports/flycat/",
    primary_keyword: "飞猫云适合谁",
    secondary_keywords: ["飞猫云年付价格", "飞猫云84元年付", "飞猫云50GB流量", "飞猫云备用推荐"],
    search_intent: "分析飞猫云84元低成本年付方案与轻量备用适配度",
    category: "好机场资料",
    target_user: "寻找低均摊成本年付备用梯子的用户"
  },
  {
    url: "/airports/breezenet/",
    primary_keyword: "微风网络怎么样",
    secondary_keywords: ["微风网络BGP专线", "微风网络套餐", "微风网络结算页", "Breezenet好不好"],
    search_intent: "核实微风网络BGP专线架构与多周期套餐灵活性",
    category: "好机场资料",
    target_user: "需要多档位套餐与应急备用的用户"
  },
  {
    url: "/airports/yinxingren/",
    primary_keyword: "隐形人机场怎么样",
    secondary_keywords: ["隐形人VLESS Reality", "隐形人24元144GB", "隐形人防封锁", "隐形人套餐"],
    search_intent: "掌握隐形人VLESS Reality抗封锁协议表现与24元月付参数",
    category: "好机场资料",
    target_user: "网络环境较为敏感、注重抗干扰协议的用户"
  },
  {
    url: "/airports/wavenet/",
    primary_keyword: "浪网怎么样",
    secondary_keywords: ["浪网24元200GB", "浪网大流量", "浪网月付套餐", "WaveNet资料"],
    search_intent: "了解浪网24元200GB大容量流量套餐与节点覆盖",
    category: "好机场资料",
    target_user: "每月用量较多、追求大流量月付的用户"
  },
  {
    url: "/airports/lingdong/",
    primary_keyword: "灵动云怎么样",
    secondary_keywords: ["灵动云20元150GB", "灵动云VLESS协议", "灵动云月付", "Lingdong套餐"],
    search_intent: "查看灵动云20元150GB配置与VLESS协议稳定性",
    category: "好机场资料",
    target_user: "希望花20元获得150GB流量的中度月付用户"
  },
  {
    url: "/airports/flyv/",
    primary_keyword: "飞V怎么样",
    secondary_keywords: ["飞V18元120GB", "飞V1.0x倍率", "飞V平价月付", "FlyV套餐资料"],
    search_intent: "评估飞V 18元月付120GB流量与1.0x实扣倍率的性价比",
    category: "好机场资料",
    target_user: "单月预算低于20元的精打细算型小白"
  },
  {
    url: "/airports/quanqiuyun/",
    primary_keyword: "全球云怎么样",
    secondary_keywords: ["全球云BGP跨境", "全球云20元120GB", "全球云跨运营商", "全球云月付"],
    search_intent: "了解全球云BGP跨境线路在跨运营商环境下的连接表现",
    category: "好机场资料",
    target_user: "经常切换移动、电信等多网络环境的用户"
  },
  {
    url: "/airports/xingdaomeng/",
    primary_keyword: "星岛梦怎么样",
    secondary_keywords: ["星岛梦8元年付折算", "星岛梦60GB流量", "星岛梦轻量备用", "星岛梦评价"],
    search_intent: "分析星岛梦折合约8元每月低价方案的实际使用体验与限制",
    category: "好机场资料",
    target_user: "追求极致低价、日常用量极低的轻度用户"
  },
  {
    url: "/airports/lightspeed/",
    primary_keyword: "光速云怎么样",
    secondary_keywords: ["光速云8元IPLC", "光速云60GB流量", "光速云平价专线", "LightSpeed评测"],
    search_intent: "了解光速云8元起步IPLC专线资料的套餐细节与适用场景",
    category: "好机场资料",
    target_user: "想以低门槛体验IPLC专线低延迟的新手"
  },
  {
    url: "/airports/v2yun/",
    primary_keyword: "唯兔云适合谁",
    secondary_keywords: ["唯兔云79.9元年付", "唯兔云45GB流量", "唯兔云IPLC资料", "V2云年付"],
    search_intent: "掌握唯兔云约79.9元整年套餐配45GB月流量的优缺点",
    category: "好机场资料",
    target_user: "年预算百元以内的轻度使用人群"
  },
  {
    url: "/airports/u1s1/",
    primary_keyword: "U1S1机场怎么样",
    secondary_keywords: ["有一说一机场20元", "U1S1120GB月付", "U1S1IEPL专线", "U1S1真实体验"],
    search_intent: "查看U1S1（有一说一）20元月付与IEPL专线资料的真实匹配度",
    category: "好机场资料",
    target_user: "注重务实均衡月付套餐的初学读者"
  },
  {
    url: "/airports/jilianyun/",
    primary_keyword: "极连云怎么样",
    secondary_keywords: ["极连云96元年付", "极连云60GB月流量", "极连云IPLC资料", "极连云省心年付"],
    search_intent: "评估极连云96元年付折合月均8元的IPLC稳定度与省心程度",
    category: "好机场资料",
    target_user: "懒得频繁按月充值的轻度年付用户"
  },
  {
    url: "/airports/guangnianti/",
    primary_keyword: "光年梯怎么样",
    secondary_keywords: ["光年梯18元110GB", "光年梯IPLC专线", "光年梯月付评测", "光年梯适合谁"],
    search_intent: "了解光年梯18元月付配合IPLC专线资料的实际配置",
    category: "好机场资料",
    target_user: "不想长期锁定、希望按月享受IPLC专线的用户"
  },
  {
    url: "/airports/sogoyun/",
    primary_keyword: "Sogo云怎么样",
    secondary_keywords: ["Sogo云25元150GB", "Sogo云专线中转", "Sogo云主力推荐", "SogoCloud套餐"],
    search_intent: "分析Sogo云25元150GB与双线路备份资料的适用范围",
    category: "好机场资料",
    target_user: "准备找一款中高流量主力机场的用户"
  },
  {
    url: "/airports/yuzhouyun/",
    primary_keyword: "宇宙云怎么样",
    secondary_keywords: ["宇宙云96元年付", "宇宙云IEPL+BGP", "宇宙云60GB流量", "YuZhou套餐"],
    search_intent: "了解宇宙云96元年付与IEPL+BGP双重资料的性价比",
    category: "好机场资料",
    target_user: "希望低成本年付备用或轻量常驻的用户"
  },
  {
    url: "/airports/2maoyun/",
    primary_keyword: "二猫云怎么样",
    secondary_keywords: ["二猫云20元130GB", "二猫云IPLC资料", "二猫云月付均衡", "2mao云套餐"],
    search_intent: "评估二猫云20元月付130GB流量与IPLC专线资料的综合表现",
    category: "好机场资料",
    target_user: "寻找标准20元月付梯子的日常用户"
  },
  {
    url: "/airports/1flyun/",
    primary_keyword: "一翻云怎么样",
    secondary_keywords: ["一翻云20元150GB", "一翻云IEPL线路", "一翻云单G成本", "1fly套餐资料"],
    search_intent: "分析一翻云20元月付提供150GB大容量与IEPL线路的优势",
    category: "好机场资料",
    target_user: "同等预算下追求更多GB流量的月付用户"
  },
  {
    url: "/airports/edgenova/",
    primary_keyword: "边缘节点EdgeNova怎么样",
    secondary_keywords: ["边缘节点15元72GB", "EdgeNova中转BGP", "边缘节点入门", "边缘节点月付"],
    search_intent: "掌握边缘节点15元低门槛月付配72GB流量的使用体验",
    category: "好机场资料",
    target_user: "预算15元左右的轻量查资料入门者"
  },
  {
    url: "/airports/kexinyun/",
    primary_keyword: "可信云怎么样",
    secondary_keywords: ["可信云25元150GB", "可信云IEPL资料", "可信云kosingaff网址", "可信云主力选型"],
    search_intent: "核对可信云25元150GB的IEPL专线配置与官方特殊域名入口",
    category: "好机场资料",
    target_user: "寻找稳定IEPL主力节点的用户"
  },
  {
    url: "/airports/sujie/",
    primary_keyword: "速界怎么样",
    secondary_keywords: ["速界25元150GB", "速界SuJie套餐", "速界月付大流量", "速界适合谁"],
    search_intent: "查看速界25元150GB大流量月付档位与客户端兼容情况",
    category: "好机场资料",
    target_user: "需要日常中度流量、偏好25元月付的用户"
  },
  {
    url: "/airports/kuaili/",
    primary_keyword: "快狸怎么样",
    secondary_keywords: ["快狸10元30GB", "快狸KuaiLi轻度备用", "快狸超低预算", "快狸套餐"],
    search_intent: "评估快狸10元月付30GB超低试水套餐的轻度应急价值",
    category: "好机场资料",
    target_user: "每月偶尔用几次、不愿多花钱的小白用户"
  },
  {
    url: "/airports/wuyou/",
    primary_keyword: "无忧机场怎么样",
    secondary_keywords: ["无忧79元年付", "无忧40GB流量", "无忧WorryFree折算", "无忧备用机场"],
    search_intent: "分析无忧79元年付折合约6.5元/月的小流量备用方案",
    category: "好机场资料",
    target_user: "寻找年费不足百元平价备选梯子的用户"
  },
  {
    url: "/airports/lingmao/",
    primary_keyword: "灵猫机场怎么样",
    secondary_keywords: ["灵猫企业级专线", "灵猫150GB档位", "灵猫Civet资料", "灵猫套餐核验"],
    search_intent: "核实灵猫企业级专线资料与约150GB档位的连通品质",
    category: "好机场资料",
    target_user: "注重企业专线连贯性、需要中度流量的读者"
  },
  {
    url: "/airports/flashleap/",
    primary_keyword: "闪跃怎么样",
    secondary_keywords: ["闪跃8元5GB", "闪跃FlashLeap", "闪跃应急备用", "闪跃IPLC资料"],
    search_intent: "了解闪跃8元5GB极小包IPLC资料的临时验证与应急场景",
    category: "好机场资料",
    target_user: "仅需少量应急流量接收验证码的小白"
  },
  {
    url: "/airports/firefly/",
    primary_keyword: "飞为怎么样",
    secondary_keywords: ["飞为96元年付", "飞为IPLC+VLESS", "飞为Firefly60GB", "飞为年付资料"],
    search_intent: "查看飞为96元年付配60GB月流量与IPLC+VLESS双资料表现",
    category: "好机场资料",
    target_user: "需要IPLC专线兼顾新协议的轻度年付用户"
  },
  {
    url: "/airports/kuajie/",
    primary_keyword: "跨界机场怎么样",
    secondary_keywords: ["跨界96元年付", "跨界60GB月流量", "跨界Kuajie备用", "跨界年付百元"],
    search_intent: "核对跨界96元年付60GB月流量的门槛与备用定位",
    category: "好机场资料",
    target_user: "预算百元以内、寻找年付备用路线的用户"
  }
];

function toYAML(obj, indent = 0) {
  const pad = ' '.repeat(indent);
  if (Array.isArray(obj)) {
    return obj.map(item => {
      if (typeof item === 'object' && item !== null) {
        const keys = Object.keys(item);
        const firstKey = keys[0];
        let res = `${pad}- ${firstKey}: ${formatYAMLVal(item[firstKey])}\n`;
        for (let i = 1; i < keys.length; i++) {
          const k = keys[i];
          res += `${pad}  ${k}: ${formatYAMLVal(item[k], indent + 2)}\n`;
        }
        return res;
      }
      return `${pad}- ${formatYAMLVal(item)}\n`;
    }).join('');
  }
  let res = '';
  for (const k of Object.keys(obj)) {
    res += `${pad}${k}: ${formatYAMLVal(obj[k], indent)}\n`;
  }
  return res;
}

function formatYAMLVal(val, indent = 0) {
  if (Array.isArray(val)) {
    return `\n${val.map(v => `${' '.repeat(indent + 2)}- ${JSON.stringify(v)}`).join('\n')}`;
  }
  if (typeof val === 'string') {
    return JSON.stringify(val);
  }
  return JSON.stringify(val);
}

const yamlContent = "# 关键词映射表 (防内耗规则)\n# 每个URL对应唯一的主搜索意图和主关键词，避免内部竞争\n" + toYAML(keywordEntries);
fs.writeFileSync(path.join(__dirname, '../data/keyword-map.yaml'), yamlContent, 'utf8');
fs.writeFileSync(path.join(__dirname, '../data/keyword-map.json'), JSON.stringify(keywordEntries, null, 2), 'utf8');

console.log(`Successfully generated data/keyword-map.yaml with ${keywordEntries.length} URL entries.`);
