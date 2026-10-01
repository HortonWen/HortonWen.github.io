---
title: "在 Markdown 中编辑 LaTeX 数学公式"
published: 2026-02-27
description: "完整指南：在 Markdown 中嵌入 LaTeX 数学公式，涵盖行内与块级公式、常用符号语法、矩阵、分段函数及辅助工具推荐。"
tags: [Markdown, LaTeX, 数学公式, MathJax, 学术写作]
category: Markdown
draft: false
---


撰写技术文档、学术笔记或编程题解时，数学公式是绕不开的需求。Markdown 通过嵌入 LaTeX 语法来支持公式排版，由 Typora、VS Code、Jupyter Notebook、Obsidian 等编辑器内置的 MathJax 引擎渲染。这篇文章把最常用的公式语法和避坑要点整理在一起，帮你快速建立起在 Markdown 中写公式的能力。

## 行内公式与块级公式

LaTeX 公式在 Markdown 中有两种基本形式：

| 类型 | 语法标记 | 作用 | 示例代码 |
| :--- | :--- | :--- | :--- |
| **行内公式** | `$...$` | 与文字混排，嵌入段落中 | `质能方程 $E=mc^2$ 是物理学基石` |
| **块级公式** | `$$...$$` | 单独成行，居中显示 | `$$\int_a^b f(x)dx$$` |

> **注意**：部分旧版解析器要求块级公式使用 `\[ ... \]`，但 `$$...$$` 是目前最通用的写法。另外，`$` 符号应紧贴公式内容，不要留空格——`$ E=mc^2 $` 在某些平台上可能不生效，应写为 `$E=mc^2$`。

## 常用语法速查

### 上下标与根号

- **上标**：`^`，如 `x^2` → $x^2$
- **下标**：`_`，如 `x_1` → $x_1$
- **复合上下标**：`x^{y+z}`、`p_{i,j}`
- **根号**：`\sqrt{}`，如 `\sqrt{x^2+y^2}` → $\sqrt{x^2+y^2}$；立方根用 `\sqrt[3]{x}`

### 分数与运算符

- **分数**：`\frac{分子}{分母}`，如 `\frac{a}{b}` → $\frac{a}{b}$
- **求和**：`\sum_{下限}^{上限}`，如 `\sum_{i=1}^n i` → $\sum_{i=1}^n i$
- **积分**：`\int_{下限}^{上限}`，如 `\int_0^\infty e^{-x} dx` → $\int_0^\infty e^{-x} dx$
- **极限**：`\lim_{x \to 0}`，如 `\lim_{x \to 0} \frac{\sin x}{x}` → $\lim_{x \to 0} \frac{\sin x}{x}$

### 希腊字母

小写：`\alpha` ($\alpha$)、`\beta` ($\beta$)、`\pi` ($\pi$)、`\theta` ($\theta$)、`\lambda` ($\lambda$)、`\sigma` ($\sigma$)

大写：`\Delta` ($\Delta$)、`\Gamma` ($\Gamma$)、`\Omega` ($\Omega$)

![LaTeX 希腊字母与数学符号速查表](/images/latex-formula-01.png)

### 矩阵

理工科最常用的功能之一。使用 `bmatrix` 环境生成中括号矩阵，`&` 分隔列，`\\` 换行：

```latex
$$
\begin{bmatrix}
  a & b \\
  c & d
\end{bmatrix}
$$
$$

渲染效果：

$$
\begin{bmatrix}
  a & b \\
  c & d
\end{bmatrix}
$$

除了 `bmatrix`（方括号），还有 `pmatrix`（圆括号）、`vmatrix`（竖线/行列式）等变体。

### 分段函数

使用 `cases` 环境定义分情况讨论的函数：

```latex
$$
f(x) = \begin{cases}
  1 & \text{if } x > 0 \\
  0 & \text{otherwise}
\end{cases}
$$
```

渲染效果：

$$
f(x) = \begin{cases}
  1 & \text{if } x > 0 \\
  0 & \text{otherwise}
\end{cases}
$$

`\text{}` 用于在公式中插入正体文字，避免变量被当作斜体数学符号处理。

## 特殊符号转义

如果想在公式中显示 `$`、`%`、`_`、`{`、`}` 等特殊字符，需要在前面加反斜杠 `\` 进行转义。例如 `\#`、`\%`、`\_`。

## 公式不生效的常见原因

- **空格问题**：某些解析器要求 `$` 紧贴公式内容，`$ E=mc^2 $` 可能不生效。
- **反斜杠转义**：在某些平台（如 VS Code 预览或 JSON 配置中），`\` 可能需要写成 `\\`。但在标准 Markdown 公式块中，单反斜杠即可。
- **宏包缺失**：`align`、`gather` 等环境来自 `amsmath` 宏包。Obsidian 和大多数现代编辑器已内置该宏包，但如果你用的是较老的渲染器，可能需要手动加载。

## 辅助工具推荐

手敲复杂公式效率很低，以下工具能显著提升体验：

- **Mathpix Snip**：截图识别公式，自动转换为 LaTeX 代码，直接粘贴到 Markdown 中。
- **LaTeX Live**（[latexlive.com](https://www.latexlive.com/)）：在线实时预览，适合调试复杂公式后再复制回文档。
- **Overleaf**（[overleaf.com](https://www.overleaf.com/)）：完整的在线 LaTeX 编辑器，适合需要精确排版的场景。

## 小结

- 行内公式用 `$...$`，块级公式用 `$$...$$`，`$` 要紧贴公式内容。
- 上下标、分数、积分、矩阵、分段函数覆盖了绝大多数技术写作需求。
- 特殊字符需要反斜杠转义；多行公式要用 `gather`/`align` 等环境而非直接 `\\`。
- Mathpix 截图识别和在线编辑器是提升公式编写效率的利器。
- 不同平台的 MathJax 版本和支持范围有差异，遇到渲染问题时优先检查平台兼容性。
