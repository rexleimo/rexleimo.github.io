# 梦兽编程 · [rexai.top](https://rexai.top/)

> Rust / AI Agent / 智能合约 的实战教程与技术资讯。每篇都真跑过一遍：命令、报错、失败路径都写清楚。

[**🌐 进入站点**](https://rexai.top/) ・ [全部教程](https://rexai.top/tutorials/) ・ [编程语言](https://rexai.top/languages/) ・ [标签索引](https://rexai.top/tags/) ・ [站点地图](https://rexai.top/sitemap.xml)

---

## 这个仓库是什么

这里是 **[rexai.top](https://rexai.top/) 的构建产物发布仓库**：Hugo 生成的静态文件推送到 `gh-pages` 分支，
由 GitHub Pages 托管、Cloudflare 回源加速。`main` 分支只保留历史版本与这份 README。

> ⚠️ 所有 HTML/CSS/JS 都是自动生成的，**请不要直接修改本仓库的文件**；内容与模板的改动会随下次构建覆盖。
> 这份 README 来自站点源码仓库的 `docs/pages-readme.md`，由 `scripts/publish-pages-readme.js` 同步。

## 内容方向

| 方向 | 入口 | 你会看到 |
| --- | --- | --- |
| Rust 语言 | [Rust 实战与生态](https://rexai.top/languages/rust/) | 异步运行时、tokio、GPUI 桌面、工具链踩坑 |
| Rust 教程 | [Rust 系列教程](https://rexai.top/tutorials/rust/) | 从 `async` 心智模型到工程化写法 |
| 智能合约 | [ink! 智能合约教程](https://rexai.top/tutorials/smart-contracts/) | 合约结构、存储、事件、测试 |
| AI Agent / LLM 工程 | [AI 与 Agent 开发](https://rexai.top/tutorials/ai/) | 上下文工程、编排、评测与 harness |
| DeepSeek Harness | [深度拆解专栏](https://rexai.top/tutorials/deepseek-harness/) | 15 篇连续拆解，从架构到实现 |
| 其他语言 | [Go](https://rexai.top/languages/go/) ・ [Python](https://rexai.top/languages/python/) | 语言实践与横向对比 |
| 工具与资讯 | [工具](https://rexai.top/tools/) ・ [技术资讯](https://rexai.top/news/) ・ [前端](https://rexai.top/frontend/) | 值得上手的工具与每日技术动态 |

## 近期值得一读

- [别再把 `tokio::spawn` 当线程了！我用它 2 秒启动 1000 个任务，系统竟然毫无压力](https://rexai.top/tutorials/rust/tokio-spawn-is-not-a-thread/)
- [GitHub Actions 自动部署 Docker 服务：一场 SSH、端口与 Go 版本的连续排障](https://rexai.top/tutorials/devops/github-actions-docker-deployment-debugging/)
- [Electron 时代结束？Rust GPUI 带你告别跨平台的将就式体验](https://rexai.top/languages/rust/rust-gpui-cross-platform-reset/)

## 订阅与索引

- 栏目 RSS：[编程语言](https://rexai.top/languages/index.xml) ・ [技术资讯](https://rexai.top/news/index.xml)
- [站点地图 sitemap.xml](https://rexai.top/sitemap.xml)
- 按主题找文章：[全部标签](https://rexai.top/tags/) ・ [全部分类](https://rexai.top/categories/)

## English

**[rexai.top](https://rexai.top/en/)** is a bilingual (Chinese / English) blog on **Rust**, **AI agents**,
**smart contracts** and developer tooling. Tutorials are written after actually running the code —
including the errors, the dead ends and the fix.

- [All tutorials](https://rexai.top/en/tutorials/) ・ [Languages](https://rexai.top/en/languages/)
- [Rust guides (EN)](https://rexai.top/en/languages/rust/)

## 关于

- 站点：[关于本站](https://rexai.top/about/) ・ [联系方式](https://rexai.top/contact/)
- 技术栈：Hugo (extended) + PaperMod 主题，静态托管于 GitHub Pages，Cloudflare 提供 CDN 与缓存
- 内容版权归作者所有，转载请注明出处并保留原文链接

---

<sub>This repository hosts the generated static build of rexai.top. The `gh-pages` branch is
regenerated on every deploy; `main` keeps history and this README.</sub>
