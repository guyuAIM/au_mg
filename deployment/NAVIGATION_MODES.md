# 导航同步与双模式交付

## 命令与配置

默认 **带导航**，配置入口为 `config/delivery.mjs`。

| 命令 | 产物 |
| --- | --- |
| `npm run build` / `npm run build:nav` | `dist/`：带导航、页脚、运行时同步与静态快照兜底 |
| `npm run build:content` | `dist/`：不含导航、页脚、导航请求或导航脚本的完整内容页面 |
| `npm run package` / `npm run package:nav` | 带导航ZIP，文件名含 `navigation` |
| `npm run package:content` | 纯内容ZIP，文件名含 `content` |
| `npm run nav:snapshot` | 主动读取官网，更新本地兜底数据；应复核变更后再打包 |

每次构建会替换 `dist/`，ZIP分别保留在 `release/`。
`release/latest-navigation.json` 和 `release/latest-content.json` 记录各自最新
ZIP路径及SHA-256。`dist/delivery-config.json` 标记实际构建模式。CLI模式优先于配置。
构建本身不请求官网，使用已保存的快照，保证官网不可用时仍能打包。

## 带导航版的实际行为

1. 初始HTML包含本地快照导航、页脚和完整指南正文。Chrome支持的声明式Shadow DOM
   隔离导航样式；JS被禁用时正文和普通链接仍可使用，菜单提供CSS焦点降级。
2. HTTP访问每页时，以不带凭据、无Referer的GET读取
   `https://mgmotor.com.au/about/faqs`，在超时和体积限制内提取菜单文字、车型名称、
   分类、链接、页脚栏目和版权文本。每页一次，不后台轮询、不使用本地存储。
3. 保留官网header/footer的HTML层级、class、车型缩略图、logo、社交图标和主题CSS，
   放在Shadow DOM内隔离；不是重画一套导航。只移除脚本、iframe、事件处理器和表单。
   菜单、分类筛选和移动侧栏由本地普通脚本适配，不运行官网整站业务/追踪脚本。
   官网CSS、图片在线引用；包内保存同版本资源作为初始快照。字体使用独立名称注册，
   保留官网350字重，不改变指南正文字体。TikTok图标使用官网对应SVG路径。
   按交付要求不输出底部 Enquire / Build & Price / Test Drive 悬浮条（快照及在线同步均排除）。
   导航只通过点击展开/收起，不使用悬停开关；背景沿用官网半透明与模糊样式，外层保持透明。
4. 新内容通过校验后更新导航和页脚。菜单已打开或用户正在其内部操作时延迟替换，避免抢焦点。
   额外保留本项目的 `EV Guides & Advice` 入口。
5. 网络失败、超时、跨域或CSP拦截、结构不兼容均保留静态快照。`file://`模式不联网同步，
   直接使用快照并适配指南本地路径。断网时所有正文仍可用。
6. 普通栏目跳转官网对应地址；`Test Drive`、`Follow Updates`等依赖官网弹窗的动作
   当前统一跳转MG首页，由用户在那里继续操作，不承诺自动打开弹窗。
   如客户提供独立入口，可调整 `navigation.actionUrl`。不复制有token的表单URL。

开发诊断可读取 `mg-site-shell` 的 `data-status`：`snapshot`、`live`、`fallback`、
`offline`、`disabled`。不向普通访客显示调试提示。

## 自动同步的边界

- 官网只更新已支持结构中的车型、菜单文字、分类或官方链接时，会在下次访问时跟随。
- 官网重构DOM、增加新类型组件或迁移到新域名时，需要更新提取适配器或URL白名单。
  校验不通过则兜底，而不是把缺损菜单显示给访客。
- 快照不是持久化的“上次访问缓存”。长期无法连接时显示最后一次随包发布的版本；可运行
  `nav:snapshot` 更新，再验证、重新交付。
- 当前官网允许跨域读取的状态不构成接口承诺。若部署在同一MG域名，通常无需跨域许可；
  若放在其他域名，客户需要保证官网CORS仍允许读取。无需客户实现接口，但不能保证永久免维护。
- CSP至少需要允许项目的现有静态脚本/样式以及 `connect-src https://mgmotor.com.au`，
  `style-src`允许mgmotor.com.au/sitebuilder.virtualyard.com.au主题样式，`img-src`允许
  mgmotor.com.au和cdn.virtualyard.com.au，`font-src`允许包内及data字体。
  页面现有内联初始化/声明式样式也需按客户CSP使用允许的hash/nonce等方式接入；本项目
  不修改官网CSP。未允许联网时会降级快照，不影响正文。

## 纯内容版与未来接入

纯内容版仍是15个完整静态HTML文档，保留metadata、JSON-LD、sitemap、正文样式和交互；
**不是已适配客户模板的HTML片段**。没有header/footer，也不发起导航同步请求。
未来客户愿意接入模板时，可复用这些内容和公共布局层；仍需处理head合并、base路径和
客户全局CSS隔离。仅去掉导航不意味着能把整份HTML直接粘入任何CMS而无需适配。

两个模式都不得覆盖MG首页、robots.txt或主sitemap。原有15页映射、25条旧链接301、
尾斜杠/index归一化和子sitemap接入方式不变。动态导航不进入指南Article数据或子sitemap。

## 回归验证

`node --test tests/*.test.mjs` 测试模式、URL过滤、结构变化拒绝、转义、动作跳转和内容更新。
`npm run build` 自动验证正文、原始文件哈希、15页、链接和sitemap。
`scripts/serve-shell-qa.mjs` 是仅绑定127.0.0.1的本地测试服务器，用于模拟成功更新、503、
超时、结构变化和禁JS；不随客户ZIP交付，也不在生产页面开放测试参数。
实际浏览器验收结果见 `qa/NAVIGATION_MODES_REPORT.md`，不要将旧版全页截图验收当成本版导航验收。
