# zzx

zzx 的个人学术与技术博客，聚焦生成式推荐、具身智能和软件工程实践。

## 页面

- `index.html`：个人主页与精选文章
- `writing.html`：文章归档、搜索与主题筛选
- `about.html`：教育背景、经历与研究兴趣
- `now.html`：近期研究、写作与建设计划
- `posts/`：完整文章

## 本地预览

无需安装依赖。在项目目录运行：

```bash
python3 -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 发布

仓库使用 GitHub Pages 从 `main` 分支根目录部署。合并到 `main` 后，网站会更新至：

```text
https://zzxanthony.github.io
```

## 内容维护

- 全站样式：`assets/styles.css`
- 主题切换、阅读进度、文章搜索和筛选：`assets/app.js`
- 新文章可复制现有 `posts/*.html` 作为模板，并在 `writing.html` 增加归档项

## 自定义域名

购买域名后，在仓库 **Settings → Pages → Custom domain** 中配置。可优先考虑含 `zzx` 的短域名，具体可用性与价格需以注册商实时查询结果为准。
