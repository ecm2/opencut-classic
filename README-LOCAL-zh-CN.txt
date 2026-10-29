OpenCut Classic 本地中文版

来源与仓库
上游：https://github.com/OpenCut-app/opencut-classic
你的 fork：https://github.com/ecm2/opencut-classic
修改分支：local/zh-cn
本地目录：F:\github\opencut-classic

OpenCut 是剪映／CapCut 的独立开源替代项目，并非剪映官方开源版本。
OpenCut 主仓库在重写中；官方目前建议使用 Classic。Classic 上游已归档。

日常启动
双击根目录 Start-OpenCut.cmd。
打开 http://127.0.0.1:3100/projects
启动器使用已安装的 Node.js，在后台运行，仅监听本机 127.0.0.1。
重复启动会复用已运行服务。日志位于 .local/stdout.log 和 .local/stderr.log。
不会修改 PowerShell 执行策略，不需要 Docker 即可使用本地剪辑功能。
项目素材保存在当前浏览器的网站存储中；更换浏览器或地址不会自动共享项目。

首次安装（本机已完成）
需要 Node.js 和 Bun 1.2.18。
在仓库根目录运行 bun install --frozen-lockfile。
本机 Bun 位于 F:\github\.local-checks\opencut-tools\node_modules\bun\bin\bun.exe。
随后运行 Start-OpenCut.cmd，缺少构建产物时会自动构建。

修改源码后重新构建
在 apps/web 目录运行：
node ../../node_modules/next/dist/bin/next build
再重启此项目的 Node 服务。构建与开发服务器不要同时修改同一份 .next 目录。

已完成
- 项目列表、首页入口、编辑面板、属性、导出、快捷键和主要提示的简体中文，约 530 处文案。
- 默认中文项目名、主场景与主轨道名称、中文日期和系统中文字体回退。
- 去除构建时 Google Fonts 下载依赖；React Scan 改为显式开启。
- 对齐两处 Next.js 到 16.2.4，更新 bun.lock。
- 补齐快捷键与动作校验，修复迁移存储和贴纸注册的旧接口调用。
- 补齐 Bun 类型声明；修正两个测试中 MediaTime 的类型。

验证结果（2026-10-29）
- TypeScript 检查通过。
- Next.js 生产构建通过。
- 浏览器创建项目、中文命名、中文文字添加到时间轴、页面刷新恢复通过。
- 导出中文 MP4 成功；文件 42,444 字节，时长 5 秒，150 帧。
  文件：C:\Users\Administrator\Downloads\中文启动验证.mp4
  内嵌浏览器导出出现明显等待，尚未测量普通 Chrome 的导出性能。
- 启动器已验证；没有修改全局系统设置。
- 全量 Bun 测试：166 通过，8 失败，包含 2 个模块加载错误。
  涉及 Bun 1.2.18 对浏览器版 WASM 的加载、循环依赖以及时间轴放置测试。
- 重点复测：102 通过，1 个 WASM 模块加载错误（v27-to-v28）；其中快捷键持久化 9 项全通过。
  这些测试没有全部通过，不能视为整个编辑器已通过完整回归。

功能边界
- 这是早期编辑器，不具备剪映的全部功能；转场和调节面板仍是上游占位功能。
- 主要编辑流程已中文化；上游博客、法律文本、更新文章、部分动态提示及技术错误仍可能为英文。
- 在线音效需配置 Freesound 密钥，自动字幕需下载模型；本次未验证这些在线功能。
- 本次导出使用文字测试项目，未覆盖长视频、多格式素材和复杂音轨。
