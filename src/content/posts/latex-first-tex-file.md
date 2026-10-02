---
title: "编写并编译你的第一个 LaTeX 文档"
published: 2026-02-27
description: "手把手带你完成第一个 LaTeX 文档的编写与编译，涵盖在线编辑器和本地 VS Code 两种方案，附中文支持和代码逐行解析。"
tags: [LaTeX, 入门, VS Code, Overleaf, 编译]
category: 编程语言
draft: false
---


学任何编程语言都是从 Hello World 开始的，LaTeX 也不例外。这篇文章带你从零完成第一个 `.tex` 文件的编写和编译，无论你选择在线编辑器还是本地 VS Code，都能在几分钟内看到自己的第一份 PDF 文档。文章还会逐行解析代码含义，并演示如何添加中文支持。

## 选择编辑方式

你有两个选择：在线编辑器（零配置，推荐新手）或本地编辑器（功能更强，适合长期使用）。

### 方案 A：Overleaf（最快上手）

1. 打开 [Overleaf](https://www.overleaf.com/) 网站。
2. 点击 "New Project" → "Blank Project"。
3. 左侧是代码编辑器，右侧实时预览 PDF，无需安装任何东西。

### 方案 B：VS Code + LaTeX Workshop

1. 安装 LaTeX 发行版：Windows 推荐 [MiKTeX](https://miktex.org/) 或 [TeX Live](https://www.tug.org/texlive/)，macOS 推荐 [MacTeX](https://www.tug.org/mactex/)。安装时务必勾选"添加到系统 PATH"。
2. 安装 [VS Code](https://code.visualstudio.com/)。
3. 在 VS Code 扩展商店搜索并安装 **LaTeX Workshop** 插件。
4. （可选）在设置中搜索 `latex workshop latex auto build run`，将值设为 `onSave`，实现保存即自动编译。

## 编写第一个文档

无论用哪种方式，将以下代码写入你的 `.tex` 文件：

```latex
% 这是序言 (Preamble)
% \documentclass 定义了文档的类型
\documentclass{article}

% 这里可以加载宏包 (Packages)，用来扩展功能
% 例如：\usepackage{graphicx} 用来插入图片

% 这是文档的开始
\begin{document}

% 这里是文档的内容
Hello, world! 这是我的第一个 LaTeX 文档。

% 这是一个换行的例子
这是第二行文字。

% 这是文档的结束
\end{document}
```

### 代码逐行解析

- `%`：百分号后面的内容是**注释**，编译器会忽略，不会出现在 PDF 中。
- `\documentclass{article}`：**文档类声明**。`article` 是最常用的类，适合短文和报告。其他常见类有 `book`（书籍）、`report`（长篇报告）和 `beamer`（演示文稿）。
- `\begin{document}` 和 `\end{document}`：文档主体的起止标记，中间的所有内容都会被编译成 PDF。
- **空行**：在 LaTeX 中，一个空行代表开始新段落。只按回车换行但不留空行，编译后文字会连在一起。

## 编译运行

### Overleaf

点击左上角的 **"Recompile"** 按钮，右侧窗口自动刷新显示 PDF。

### VS Code

- 如果已配置自动编译，保存文件（`Ctrl+S`）即可。
- 否则按 `Ctrl+Alt+B` 手动触发编译。
- 编译成功后按 `Ctrl+Alt+V` 在侧边栏查看 PDF 预览。

## 一个更完整的示例

下面是一个包含标题、摘要、章节和数学公式的实际文档，也是我学习时编写的第一个完整 `.tex` 文件：

```latex
%导言区

\documentclass[12pt,a4paper]{article}
\usepackage[UTF8]{ctex}
\usepackage{amsmath}
\usepackage{graphicx}

\title{我的第一篇LaTeX文章}

\author{闻浩天}
\date{2026年2月27日}

%正文区

\begin{document}

\maketitle

\begin{abstract}
这是篇简短的摘要，介绍文章主要内容。
\end{abstract}

\section{引言}
这是篇简短的摘要，介绍研究背景和意义。

\section{理论基础}
\subsection{基础概念}
介绍相关的基础概念和定义。

\subsection{数学模型}
展示核心数学公式：

$$
E = mc^2
$$

\section{结论}
总结研究成果和未来展望。

\bibliography{references}

\end{document}
```

这段代码展示了 LaTeX 文档的典型结构：导言区配置文档类和宏包，正文区用 `\section`/`\subsection` 组织内容，`\maketitle` 自动生成标题页，`abstract` 环境生成摘要，`\bibliography` 引用参考文献库。

## 添加中文支持

如果你想让文档显示中文，需要做两处修改：

1. **切换编译器为 XeLaTeX**：Overleaf 在左上角菜单中设置；VS Code 在设置 JSON 中配置。
2. **加载 ctex 宏包**：在 `\documentclass` 下方添加 `\usepackage{ctex}` 或使用 `\documentclass[UTF8]{ctexart}`。

修改后的最简中文文档：

```latex
\documentclass{article}
\usepackage{ctex} % 加载中文支持宏包

\begin{document}

你好，世界！这是一段中文。

\end{document}
```

> **提示**：如果使用 `ctexart` 文档类（`\documentclass[UTF8]{ctexart}`），则不需要额外加载 `ctex` 宏包，它已经内置了中文支持。两种方式选一种即可。

## 小结

- LaTeX 文档由导言区和正文区组成，`\documentclass` 和 `\begin{document}` 是两个最基本的命令。
- 新手推荐从 Overleaf 起步，免去环境配置的麻烦；长期使用者建议搭建 VS Code + LaTeX Workshop 本地环境。
- 空行分段是 LaTeX 的基本规则，只换行不留空行不会产生新段落。
- 中文支持需要 XeLaTeX 编译器 + ctex 宏包（或 ctexart 文档类）。
- 编译报错时先看错误信息的第一行，大多数问题是括号不匹配或命令拼写错误。
