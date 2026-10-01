---
title: "cxxy-campus：校园系统自动化 AI Skill"
published: 2026-07-24
description: "针对东南大学成贤学院校园系统的自动化 AI 技能，覆盖官网通知查询、学科竞赛系统报名、数字校园门户单点登录到教务系统，仅用 Python 标准库，零第三方依赖。"
tags: [技能, AI Agent, Python, 校园系统, 自动化, Skill]
category: 技能
draft: false
---

把校园系统里那些重复、繁琐的操作沉淀成技能，让 AI Agent 能按说明直接调用，也方便自己随时复用。这套工具针对东南大学成贤学院的官网、学科竞赛系统和数字校园门户三个入口，面向个人日常使用。

## 背景

查通知、看竞赛目录、登录竞赛系统报名、登门户再跳教务查课表成绩，这些操作每个学期要重复很多次，而且竞赛系统还是 GBK 编码的老页面。于是把登录流程和常用页面整理成脚本，再写成 AI 技能，之后一句话就能完成。

## 能做什么

### 官网信息

```bash
python scripts/website.py notices    # 拉学生事务 / 通知公告列表
python scripts/website.py search 关键词  # 搜索
python scripts/website.py catalog    # 看学科竞赛目录摘要
```

### 学科竞赛系统

```bash
python scripts/competition.py login USER PWD  # 测试登录
python scripts/competition.py list            # 列出可报名项目
python scripts/competition.py registered      # 查已报名项目
python scripts/competition.py detail ITEMNO   # 看项目详情
python scripts/competition.py public-list     # 无需登录看全部项目
```

### 数字校园门户

```bash
python scripts/portal.py login USER PWD  # 登录并打印身份
python scripts/portal.py profile         # 首页身份信息
python scripts/portal.py sso-jw          # 单点登录到旧教务系统
python scripts/portal.py sso-jwfw        # 单点登录到新教务系统
```

## 实现要点

- 只用 Python 标准库（`urllib` + `http.cookiejar`），不装任何第三方包
- 竞赛系统页面是 GBK、门户 / 教务是 UTF-8，脚本分别处理，避免乱码
- 竞赛系统登录要带 `__VIEWSTATE` 等隐藏字段，脚本自动先 GET 再 POST，保持会话
- 门户登录成功后拿到 `iPlanetDirectoryPro` Cookie，再带去教务系统完成单点登录
- 密码可以用 `-` 占位，脚本从标准输入读取，避免密码留在命令行历史里

## 安全约定

- 账号密码只由使用方临时提供，仓库不保存任何凭证
- 只操作用户本人的账号，不为其他人报名
- 报名是真实写入操作，提交前会先把「比赛 + 队长 + 队员 + 作品名」念给用户确认

## 文件结构

```
├── SKILL.md                  # 技能说明，AI 按它来调用
├── references/
│   └── endpoints.md          # 各系统接口与登录流程备忘
└── scripts/
    ├── website.py            # 官网入口
    ├── competition.py        # 竞赛系统入口
    └── portal.py             # 数字校园门户入口
```

## 小结

- 覆盖官网、竞赛系统、数字校园门户三个入口的常用操作
- 仅用 Python 标准库，零第三方依赖，开箱即用
- 自动处理 GBK / UTF-8 编码差异和会话保持
- 仓库不保存凭证，报名等写入操作需用户确认
- 配套的 Windows 端校园网登录工具见罗盘页
