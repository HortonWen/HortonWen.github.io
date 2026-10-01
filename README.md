<div align="center">

# Horton's Blog

**记录编程学习与技术探索的个人博客**

基于 [Astro](https://astro.build/) + [Shirone](https://github.com/LyraVoid/Shirone) 主题构建，部署于 GitHub Pages。

[访问博客](https://hortonwen.github.io/) · [GitHub](https://github.com/HortonWen)

![Astro](https://img.shields.io/badge/Astro-7-BC52EE?logo=astro&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22-5FA04E?logo=nodedotjs&logoColor=white)
![pnpm](https://img.shields.io/badge/pnpm-9-F69220?logo=pnpm&logoColor=white)

</div>

## 关于本站

这是我的个人技术博客，记录在计算机专业学习过程中的笔记、总结与探索。内容涵盖编程语言、开发工具、机器人开发、嵌入式等方向。

## 内容分类

- **C / C++**：语言基础、面向对象、STL、文件 IO、模板、多文件编译、课程项目
- **Python**：入门语法、函数、pip 与生态
- **ROS / 机器人**：环境搭建、基础节点、Gazebo 仿真、WSL 配置
- **嵌入式**：STM32 入门
- **工具链**：CMake、VS Code 配置、Linux 常用命令、Yolov8 环境
- **写作工具**：Markdown 进阶、LaTeX 写作、MATLAB

## 技术栈

| 项目 | 技术 |
|------|------|
| 框架 | Astro 7 + Svelte 5 |
| 主题 | Shirone（Material 3 Expressive） |
| 样式 | Tailwind CSS 4 + Stylus |
| 搜索 | Pagefind 全文搜索 |
| 部署 | GitHub Pages + GitHub Actions |
| 包管理 | pnpm 9 |

## 本地开发

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 预览构建结果
pnpm preview
```

## 文章结构

文章位于 `src/content/posts/`，使用 Markdown 格式，Frontmatter 示例：

```yaml
---
title: "文章标题"
published: 2026-01-01
description: "文章摘要"
tags: [标签1, 标签2]
category: 分类
draft: false
---
```

## 目录结构

```
├── src/
│   ├── config/          # 站点配置（主题、导航、个人资料等）
│   ├── content/
│   │   └── posts/       # 博客文章
│   ├── data/            # 友链等数据
│   └── pages/           # 页面组件
├── public/
│   └── images/          # 文章图片
├── .github/workflows/   # GitHub Actions 部署配置
└── astro.config.mjs     # Astro 配置
```

## License

博客内容采用 [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) 协议，代码部分遵循主题原协议。
