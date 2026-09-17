# 固定目录交付与官网接入

## 交付结构

```text
dist/
├── index.html                 # 完整指南首页，有正文，不跳转
├── sitemap_evguide.xml        # 16个官网正式URL
├── 404.html
├── delivery-config.json
├── assets/
├── scripts/
├── questions/
│   └── index.html
├── affordable-electric-cars/
│   └── index.html
└── 其余13个文章slug目录/index.html
```

`dist` 只是打包目录名称；官网可将里面的文件放入任意固定目录，例如容器内
`/srv/mg-geo/dist`。该目录下应直接看见 index.html，不要额外套一层 dist。
容器应使用持久卷或发布目录挂载，具体宿主机路径由官网团队选择。

## 首次接入：需要官网运维配置一次

1. 把构建产物放到约定目录，并保证静态服务器有读取权限。
2. 将 nginx-geo-static.conf 的 `$mg_evguide_dir` 改成容器内实际目录。
3. 在现有官网 server 块引入该文件和 legacy-guide-redirects.conf，检查并加载配置。
4. 官网菜单/页脚入口直接链接 `/explore/ev-guides`。
5. 按 README.md 将子地图引用合入主sitemap索引或根robots声明。

| 官网地址 | 固定目录内文件 |
| --- | --- |
| `/explore/ev-guides` | `index.html` |
| `/explore/ev-guides/questions` | `questions/index.html` |
| `/explore/ev-guides/<slug>` | `<slug>/index.html` |
| `/explore/ev-guides/assets/...` | `assets/...` |
| `/explore/ev-guides/scripts/...` | `scripts/...` |
| `/sitemap_evguide.xml` | `sitemap_evguide.xml` |

文件夹根目录不等于官网域名根目录。不会接管官网 `/`、`/index.html`、FAQ、车型页、
主sitemap或robots.txt。完整HTML由服务器直接返回，不能用iframe、SPA fallback或JS拉取正文替代。
这些路径映射不能仅靠把文件放入一个任意文件夹自动建立；首次仍需官网配合配置静态服务。

## 后续更新

在域名、公开前缀与接入约定不变的情况下，只需发布最新完整dist内容到固定目录；
正文、资源和子sitemap一起更新。推荐通过新版本目录/持久卷切换避免读到一半新一半旧的文件，
保留前一版本以便回滚。不要在这个目录混放官网其他业务文件。
配置使用稳定目录映射，资源文件名变化无需逐条改Nginx规则；未知文章地址返回真实404。
若改变公开路径、域名、旧地址跳转规则或官网CSP，仍需另行协调，不能靠复制文件解决。

## 本地查看

- 工程内 `npm run build` 后执行 `npm run preview`，访问 `http://127.0.0.1:4330/`。
  根入口直接显示首页；正式路径也可访问，链接使用正式路径。
- 双击 dist/index.html 使用本地适配（需要JavaScript）。文件资源相对包目录解析。
- 任意简单HTTP文件服务器不一定具有上述URL映射，不能把其404误判为包内缺文件。
- 正式正文不依赖JavaScript，canonical和JSON-LD始终指向MG正式地址。
