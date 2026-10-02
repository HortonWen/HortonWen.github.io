---
title: "LaTeX 文章基本框架：导言区与正文区详解"
published: 2026-02-27
description: "详解 LaTeX 文章的两大核心组成部分——导言区和正文区，涵盖文档类选择、宏包加载、章节结构和常用元素，附完整示例框架。"
tags: [LaTeX, 文档结构, 导言区, 宏包, 排版框架]
category: 编程语言
draft: false
---


理解了 LaTeX "写代码 → 编译 → 生成 PDF" 的基本流程后，下一步是掌握文档的整体骨架。LaTeX 文章由**导言区（Preamble）**和**正文区（Document Body）**两大部分组成，前者配置环境和样式，后者承载实际内容。这种内容与格式分离的设计正是 LaTeX 高效排版的根基。这篇文章把框架的每个组成部分拆开讲解，帮你建立起对 LaTeX 文档结构的完整认知。

## 文档类声明

每个 LaTeX 文档的第一行都是文档类声明：

```latex
\documentclass[选项]{文档类}
```

文档类决定了整体布局和可用命令。常用的四类：

| 文档类 | 适用场景 |
| :--- | :--- |
| `article` | 期刊论文、短文、技术报告 |
| `report` | 中等长度报告（支持 `\chapter`） |
| `book` | 书籍（支持前言、目录页等书籍结构） |
| `beamer` | 演示文稿/幻灯片 |

常用选项包括：

- `10pt` / `11pt` / `12pt`：基础字号
- `a4paper`：纸张尺寸
- `twocolumn`：双栏排版
- `UTF8`：中文编码支持

例如一篇 12 号字、A4 纸的中文文章：

```latex
\documentclass[12pt,a4paper,UTF8]{ctexart}
```

## 导言区

导言区位于 `\documentclass` 之后、`\begin{document}` 之前，用于配置文档环境。它不会在 PDF 中直接显示任何内容，但决定了正文的表现形式。

### 加载宏包

宏包是 LaTeX 的功能扩展模块，用 `\usepackage` 加载：

```latex
\usepackage[选项]{宏包名}
```

以下是最常用的几个宏包：

| 宏包 | 功能 |
| :--- | :--- |
| `ctex` | 中文支持 |
| `amsmath` | 数学公式增强（多行公式、对齐等） |
| `graphicx` | 图片插入 |
| `hyperref` | 超链接与 PDF 书签 |
| `biblatex` | 参考文献管理 |

### 自定义命令

如果某个格式或符号在文中反复出现，可以用 `\newcommand` 封装：

```latex
\newcommand{\R}{\mathbb{R}}
```

之后在正文中写 `\R` 就等价于 `\mathbb{R}`，既简洁又便于统一修改。

### 文档元信息

标题、作者、日期等信息在导言区定义，在正文区通过 `\maketitle` 一次性生成：

```latex
\title{文章标题}
\author{作者姓名}
\date{2026年2月27日}
```

如果不写 `\date{}`，LaTeX 会自动填入编译当天的日期；如果想隐藏日期，写 `\date{}`（空参数）。

## 正文区

正文区以 `\begin{document}` 开始、`\end{document}` 结束，包含所有会在 PDF 中显示的内容。

### 标题与摘要

```latex
\maketitle

\begin{abstract}
这是一段摘要文字。
\end{abstract}
```

`\maketitle` 会根据导言区定义的 `\title`、`\author`、`\date` 自动生成标题块。`abstract` 环境生成一段带"摘要"标题的缩进段落。

### 章节结构

```latex
\section{一级标题}
\subsection{二级标题}
\subsubsection{三级标题}
```

`article` 类最高支持到 `\subsubsection`；`report` 和 `book` 类还支持 `\chapter`。LaTeX 会自动编号，无需手动维护。

### 段落与列表

段落之间用空行分隔。列表有两种：

```latex
% 无序列表
\begin{itemize}
  \item 项目1
  \item 项目2
\end{itemize}

% 有序列表
\begin{enumerate}
  \item 第一步
  \item 第二步
\end{enumerate}
```

### 数学公式

```latex
行内公式：$E = mc^2$

独立公式：
$$
\int_a^b f(x) dx
$$
```

多行公式推荐使用 `amsmath` 宏包提供的 `align`、`gather` 等环境。

### 图片与表格

```latex
% 图片
\begin{figure}
  \includegraphics[width=0.5\textwidth]{example.png}
  \caption{图片说明}
\end{figure}

% 表格
\begin{table}
  \begin{tabular}{|c|c|c|}
    \hline
    A & B & C \\
    \hline
    1 & 2 & 3 \\
    \hline
  \end{tabular}
  \caption{表格说明}
\end{table}
```

`figure` 和 `table` 是浮动体环境，LaTeX 会自动调整它们的位置以获得最佳排版效果。`\caption` 提供标题并自动编号。

### 参考文献

```latex
\bibliography{references}
```

这行命令会读取同目录下的 `references.bib` 文件，并根据引用情况自动生成参考文献列表。使用前需确保已运行 BibTeX 编译步骤。

## 完整示例框架

把以上各部分组合起来，就是一篇完整的 LaTeX 文章骨架：

```latex
% 导言区
\documentclass[12pt,a4paper]{article}
\usepackage[UTF8]{ctex}
\usepackage{amsmath}
\usepackage{graphicx}

\title{我的第一篇LaTeX文章}
\author{张三}
\date{2026年2月27日}

% 正文区
\begin{document}

\maketitle

\begin{abstract}
这是一篇简短的摘要，介绍文章的主要内容。
\end{abstract}

\section{引言}
这是文章的第一部分，介绍研究背景和意义。

\section{理论基础}
\subsection{基本概念}
介绍相关的基本概念和定义。

\subsection{数学模型}
展示核心数学公式：
$$
E = mc^2
$$

\section{实验结果}
\begin{figure}
  \includegraphics[width=0.5\textwidth]{example.png}
  \caption{实验数据图表}
\end{figure}

\section{结论}
总结研究成果和未来展望。

\bibliography{references}

\end{document}
```

这个框架可以直接作为模板使用，替换内容即可快速产出新文章。

## 专业技巧

- **模块化管理**：长文档可以用 `\input{chapter1.tex}` 拆分为多个文件，主文件只负责组装。
- **自动目录**：添加 `\tableofcontents` 即可根据章节标题自动生成目录。
- **交叉引用**：用 `\label{sec:intro}` 标记位置，用 `\ref{sec:intro}` 引用编号，LaTeX 自动维护编号一致性。
- **编译流程**：包含参考文献的文档通常需要多次编译：LaTeX → BibTeX → LaTeX → LaTeX。
- **版本控制**：`.tex` 是纯文本，天然适合 Git 管理，比 Word 的二进制格式更适合协作。

## 小结

- LaTeX 文档由导言区（配置）和正文区（内容）两部分组成，结构与内容分离是核心设计理念。
- 文档类决定整体布局，宏包扩展具体功能，两者在导言区配置。
- 正文区通过语义化命令（`\section`、`\begin{figure}` 等）组织内容，不直接控制格式。
- 掌握完整框架后可以套用模板快速产出文章，把精力集中在内容而非排版上。
- 模块化拆分、自动目录和交叉引用是让长文档可维护的关键技巧。
