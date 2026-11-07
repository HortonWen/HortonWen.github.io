---
title: "大学物理动画合集：33 支 Manim 动画的制作笔记"
published: 2026-11-08
description: "用 Manim 复刻 3Blue1Brown 风格的大学物理动画：理论课 15 章 + 实验课 18 个实验，共 33 支短片。本文记录项目结构、15 章理论索引、实验清单与关键工程实现。"
tags: [Manim, 大学物理, Python, 动画, 3Blue1Brown, LaTeX]
category: 大学物理
draft: false
---

## 项目概览

这是一个用 [Manim Community Edition](https://www.manim.community/) 生成的大学物理动画合集，视觉风格致敬 [3Blue1Brown](https://www.3blue1brown.com/)。一个仓库里包含两套互补的课程，共 **33 支**短片，全部源码可改、可重新渲染。

**项目仓库（AtomGit）**：[DanielMaster/university-physics-animations](https://atomgit.com/DanielMaster/university-physics-animations)，理论课目录直达 [theory/](https://atomgit.com/DanielMaster/university-physics-animations/tree/main/theory)。

| | `theory/` 理论课 | `lab/` 实验课 |
|---|---|---|
| **内容** | 大学物理理论课 15 章 | 大学物理实验 18 个 |
| **规模** | 15 个视频，约 25 分 30 秒 | 18 个视频，约 19 分 37 秒 |
| **分辨率** | 1280×720 / 30 fps | 1920×1080 / 30 fps |
| **讲解结构** | 几何直觉 → 逐行公式推导 → 结论 | 目的 → 装置 → 原理 → 测量 → 数据处理 → 误差分析 |
| **特色** | 动态矢量/曲线/场线，公式逐行变形 | 仪器组件库、真实数据拟合、排版安全区自检 |
| **基类** | `theory/scenes/common.py` 的 `CourseScene` | `lab/common/style.py` 的 `LabScene` |

两者各自独立、互不依赖：进入对应子目录，按该目录的 README 安装与渲染即可。

## 效果预览

:::grid{columns="2" aspect="16/9"}
![理论课 · 热力学：麦克斯韦速率分布](/images/physics/T09_热力学.png)
![实验课 · 迈克耳孙干涉仪光路](/images/physics/E08-迈克耳孙.png)
![理论课 · 恒定磁场](/images/physics/T12_恒定磁场.png)
![实验课 · 单摆测 g](/images/physics/E01-单摆.png)
:::

## 理论课 15 章

理论课覆盖力、热、电磁、光、近代五大部分。每章一个独立视频，统一按「**几何直觉 → 逐步公式推导 → 一句话结论**」组织：动态图示用 `ValueTracker` + `always_redraw` 实时联动；公式由上一行变形得到（`TransformMatchingTex`），关键步骤配高亮框。

完整章节清单如下：

| 编号 | 章名 | 时长 | 核心内容 |
|---|---|---|---|
| 01 | 质点运动学 | 58 s | 位置矢量、瞬时速度与加速度、抛体运动、匀速圆周运动 |
| 02 | 牛顿运动定律 | 1:31 | 受力分析、叠加原理、斜面与连接体、弹簧、非惯性系 |
| 03 | 功和能 | 1:43 | 功的线积分、动能定理、势能、机械能守恒、势能曲线 |
| 04 | 动量与碰撞 | 1:42 | 冲量定理、质心、一维/二维碰撞、火箭方程 |
| 05 | 刚体转动 | 1:38 | 转动惯量、力矩、平行轴定理、转动定律、角动量守恒 |
| 06 | 机械振动 | 1:59 | 简谐振动、相量法、能量、阻尼振动、受迫振动与共振 |
| 07 | 机械波 | 1:44 | 波函数、相位传播、叠加与驻波、波动方程、多普勒效应 |
| 08 | 流体力学 | 1:43 | 静水压、帕斯卡原理、连续性方程、伯努利方程 |
| 09 | 热力学 | 2:27 | 理想气体、分子运动论、热一定律、四种过程、卡诺循环、熵 |
| 10 | 静电场 | 1:31 | 库仑定律、场强叠加、电场线、高斯定理、电势、电偶极子 |
| 11 | 恒定电流与电路 | 1:49 | 电流密度、欧姆定律、串并联、基尔霍夫定律、RC 充放电 |
| 12 | 恒定磁场 | 1:57 | 洛伦兹力、回旋运动、毕奥-萨伐尔、安培环路、螺线管、磁矩 |
| 13 | 电磁感应与麦克斯韦方程 | 1:37 | 磁通量、法拉第定律、楞次定律、动生电动势、自感、电磁波 |
| 14 | 波动光学 | 1:32 | 双缝干涉、薄膜干涉、单缝衍射、光栅、偏振 |
| 15 | 近代物理基础 | 1:39 | 黑体辐射、光电效应、康普顿散射、物质波、势阱、氢原子能级 |

理论视频体积较大（15 支共约 50 MB），为节省仓库空间不随博客存储；上表给出完整章节索引，用文末「渲染理论课」的命令即可在本地重新生成全部视频。
## 实验课 18 个

实验课把讲义里"看图想象"的部分变成可播放动画：光具座、分光计、迈克耳孙干涉仪、示波器、密立根油滴盒都用矢量图形画出，光路、电子束、电路电流会动；数据处理部分演示真实数据表 → 逐差法 / 最小二乘法 → 拟合直线 → 与理论值对比；误差分析会说明为什么某个测量技巧能消掉对应误差（例如电桥的交换法、牛顿环的直径逐差法）。

> 说明：当前本地仓库中实验的**成品视频未随仓库生成**（`videos/` 已在 `.gitignore` 中忽略，源码完整）。下面先给出完整实验清单和预览图；执行文末的渲染命令即可生成全部 18 支 1080p 视频。

### 实验清单

**力学 / 热学**

| 编号 | 实验 | 时长 | 核心公式 |
|---|---|---|---|
| E01 | 单摆测重力加速度 | 80 s | `T = 2π√(L/g)` |
| E02 | 拉伸法测金属丝杨氏模量 | 73 s | `E = 8FLD/(πd²bΔn)` |
| E17 | 扭摆法测转动惯量 | 64 s | `T = 2π√(I/K)` |
| E18 | 空气比热容比的测定 | 65 s | `γ = ln(p₁/p₀)/ln(p₁/p₂)` |

**电磁学**

| 编号 | 实验 | 时长 | 核心公式 |
|---|---|---|---|
| E03 | 惠斯通电桥测电阻 | 65 s | `R_x = R₁R₃/R₂` |
| E04 | 示波器的使用与李萨如图形 | 65 s | `f_y/f_x = n_x/n_y` |
| E05 | RC 电路的暂态过程 | 62 s | `u_C = E(1−e^{−t/RC})` |
| E06 | RLC 串联电路的谐振 | 64 s | `f₀ = 1/(2π√(LC))` |
| E07 | 霍尔效应测磁场 | 67 s | `U_H = K_H I B` |
| E16 | 声速测量（驻波法 / 相位法） | 63 s | `v = fλ = 2fΔx` |

**光学**

| 编号 | 实验 | 时长 | 核心公式 |
|---|---|---|---|
| E08 | 迈克耳孙干涉仪测光波波长 | 68 s | `Δd = Nλ/2` |
| E09 | 牛顿环测透镜曲率半径 | 65 s | `R = (D_m²−D_n²)/(4(m−n)λ)` |
| E10 | 单缝夫琅禾费衍射 | 62 s | `a sinθ = kλ` |
| E11 | 衍射光栅测光波波长 | 64 s | `d sinθ = kλ` |
| E12 | 分光计测棱镜折射率 | 62 s | `n = sin((A+δ_min)/2)/sin(A/2)` |

**近代物理**

| 编号 | 实验 | 时长 | 核心公式 |
|---|---|---|---|
| E13 | 光电效应测普朗克常数 | 65 s | `hν = eU₀ + W` |
| E14 | 弗兰克-赫兹实验 | 60 s | `E₁ − E₀ = eU₀` |
| E15 | 密立根油滴实验 | 64 s | `q = 6πηd(v₁+v₂)/U · r`，`r = √(9ηv₁/(2(ρ−ρ₀)g))` |

### 实验预览

:::grid{columns="2" aspect="16/9"}
![E01 单摆测 g](/images/physics/E01-单摆.png)
![E08 迈克耳孙干涉仪](/images/physics/E08-迈克耳孙.png)
![E09 牛顿环](/images/physics/E09-牛顿环.png)
![E10 单缝衍射](/images/physics/E10-单缝衍射.png)
:::

![E16 声速测量 w-75%](/images/physics/E16-声速.png)

## 目录结构

```
university-physics-animations/
├── README.md                 # 总览
├── LICENSE                   # MIT
├── .gitignore
├── .gitattributes
├── theory/                   # 大学物理理论课 · 15 章
│   ├── README.md
│   ├── scenes/               # common.py + ch01..ch15
│   ├── scripts/              # render_course.py, auto_render_when_ready.py
│   ├── docs/preview/         # README 截图
│   ├── videos/               # 成品视频（gitignore，可重新生成）
│   ├── manim.cfg
│   ├── requirements.txt
│   └── course_index.html
└── lab/                      # 大学物理实验课 · 18 个
    ├── README.md
    ├── common/               # style.py（LabScene 基类）, lab.py（仪器库）
    ├── scenes/               # exp01..exp18
    ├── scripts/              # render.py, collect.py, check_layout.py, _env.py
    ├── render_env/           # sitecustomize.py（渲染子进程补丁）
    ├── docs/                 # 实验清单、预览图
    ├── manim.cfg
    └── requirements.txt
```

## 技术实现要点

两套项目风格一致（深色背景、3B1B 配色、中文 + LaTeX 混排），但各自解决了不同的工程问题。

### 1. 中文与公式严格分离

`MathTex` 里绝不出现中文——一旦出现，LaTeX 编译直接失败。所有中文一律走 Pango `Text`，用 `cn()` / `mt()` 封装；公式才交给 `MathTex`（LaTeX）。

```python
cn("速度矢量", size=28)                          # 中文 → Pango Text
eq(r"\vec v = \frac{d\vec r}{dt}", scale=0.8)   # 公式 → MathTex
```

### 2. LaTeX 临时文件清理

Manim 每编译一个公式都会写并删大量临时文件，在受限环境（沙箱、容器、部分企业策略）里容易中途失败。理论课用 `--no_latex_cleanup` + `disable_caching`；实验课更进一步，用 `render_env/sitecustomize.py` 把删除改成移动到 `__trash__/`，并把每个实验隔离到独立媒体目录，支持 4 线程并行渲染。

### 3. 动态而非静态

大量 `ValueTracker` + `always_redraw` 联动，让矢量、波形、场线实时变化。两条容易踩的坑：

- `always_redraw` 对象**不要**用 `Create`/`FadeIn` 入场——`become` 会重置颜色与透明度，淡入动画会被 updater 覆盖成"瞬间全显"，应直接 `self.add(...)`；
- `TracedPath` **不能**放进 `always_redraw`，应 `TracedPath(func)` 后直接 `self.add()`。

### 4. 排版安全区

实验课画面是 16:9，但右上角 1/6 被章节导航占着。所有内容统一经 `safe_place()` 先按 `max_w`/`max_h` 等比缩放，再平移夹紧到硬边界内（右 4.25、左 −6.85、上 2.90、下 −3.15），永远不会压到导航栏或跑出画面。`check_layout.py` 还能抽帧自动检测越界。

## 快速开始

### 环境要求

| 依赖 | 说明 |
|---|---|
| Python 3.10+ | 在 3.13 上开发验证 |
| **LaTeX** | 渲染公式必需。Windows 装 [MiKTeX](https://miktex.org/)，macOS 装 MacTeX，Linux 装 `texlive-full` |
| ffmpeg | 不用手动装：`requirements.txt` 含 `imageio-ffmpeg`，脚本自动使用其自带二进制 |
| 中文字体 | 默认 `Microsoft YaHei`（Windows 自带）；macOS/Linux 需改成系统字体 |

### 渲染理论课

```bash
cd theory
python -m venv .venv
.venv\Scripts\activate            # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt

python scripts/render_course.py                 # 全部 15 章，720p30
python scripts/render_course.py --only 01,09    # 指定章节
python scripts/render_course.py --smoke --only 12   # 只渲末帧，快速验证
```

质量参数：`l`=480p15、`m`=720p30（默认）、`h`=1080p60、`p`=1440p60、`k`=2160p60。成品输出到 `videos/NN_章名.mp4`。

### 渲染实验课

```bash
cd lab
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt

python scripts/render.py verify E01             # 480p 快速验证
python scripts/render.py final E01 E08          # 1080p 成品，可并行
python scripts/render.py final                  # 全部 18 个
python scripts/collect.py                       # 汇总并中文重命名到 videos/
```

## 小结

这个项目的核心价值不只是"画出 33 支好看的动画"，而是沉淀了一套**可复用的 Manim 工程骨架**：统一的 `CourseScene` / `LabScene` 基类、中文与公式分离的排版约定、仪器组件库，以及在受限环境下保证渲染稳定的清理补丁。后续加章节或加实验，只需复制一个场景文件、改类名，再在渲染脚本里登记一行即可。

代码与原创动画素材以 MIT License 发布，物理内容与公式为公开知识，可自由学习、复用与二次创作；用于出版或课程时请注明来源。
