---
title: "C 语言 time.h 头文件超全使用教程"
published: 2026-07-21
description: "从核心数据类型到时间获取、格式化输出、程序计时和时间运算，系统讲解 C 语言 time.h 的全部用法，附万能模板和高频踩坑总结。"
tags: [time.h, C语言, 时间戳, strftime, clock]
category: C 语言
draft: false
---


获取当前时间、格式化输出日期、计算程序运行耗时——这些需求在日志记录、性能测试和定时任务中非常常见。C 语言的 `time.h` 头文件提供了完整的时间处理能力，但它的 API 设计比较底层，数据类型和函数之间的关系不太直观。这篇文章从核心类型讲起，逐步覆盖所有常用函数，最后给出可以直接复用的万能模板。

引入头文件：`#include <time.h>`。理解 `time.h` 需要先掌握三个核心概念：**时间戳**（从 1970-01-01 00:00:00 UTC 到现在的秒数）、**struct tm**（拆解后的年月日时分秒）和 **clock_t**（程序计时）。

## 核心数据类型

### time_t：时间戳类型

本质是长整型，用于存储秒级时间戳：

```c
time_t t; // 存储 1970 至今的秒数
```

### struct tm：时间结构体

专门用来将时间戳拆解为可读的年、月、日、时、分、秒：

```c
struct tm {
    int tm_sec;   // 秒 0~59
    int tm_min;   // 分钟 0~59
    int tm_hour;  // 小时 0~23
    int tm_mday;  // 日期 1~31
    int tm_mon;   // 月份 0~11（使用要 +1）
    int tm_year;  // 年份，从 1900 开始（使用要 +1900）
    int tm_wday;  // 星期 0~6（0 = 周日）
    int tm_yday;  // 一年第几天
    int tm_isdst; // 夏令时
};
```

> **重点坑点**：月份要 +1、年份要 +1900，否则时间完全错误！这是 90% 新手的出错点。

### clock_t：程序计时类型

用于计算程序运行耗时，配合 `clock()` 函数使用。

## 获取当前时间戳

`time()` 是最常用的时间函数，返回当前系统的 Unix 时间戳（秒）：

```c
#include <stdio.h>
#include <time.h>

int main()
{
    time_t stamp = time(NULL);
    printf("当前时间戳：%lld\n", stamp);
    return 0;
}
```

## 时间戳转本地可读时间

### localtime()：转为本地时区时间

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <time.h>

int main()
{
    time_t t = time(NULL);
    struct tm *local = localtime(&t);

    printf("当前时间：%d年%d月%d日 %d:%d:%d\n",
        local->tm_year + 1900,
        local->tm_mon + 1,
        local->tm_mday,
        local->tm_hour,
        local->tm_min,
        local->tm_sec);

    return 0;
}
```

`gmtime()` 功能类似，但转为零时区（UTC）时间，日常开发较少使用。

## 一键格式化时间

如果不需要自定义格式，可以用 `ctime()` 或 `asctime()` 快速得到字符串形式的时间。

**ctime()**：参数传时间戳，直接返回固定格式的时间字符串。

```c
time_t t = time(NULL);
printf("当前时间：%s", ctime(&t));
```

输出示例：`Wed Jul 22 10:20:30 2026`

**asctime()**：参数传 `struct tm` 指针，同样返回固定格式字符串。

```c
time_t t = time(NULL);
struct tm *p = localtime(&t);
printf("%s", asctime(p));
```

## 自定义时间格式：strftime

`strftime` 是时间格式化最强大的函数，可以自由输出 `2026-07-21 15:30:20` 这种标准格式。

### 常用格式符

- `%Y`：四位年份
- `%m`：两位月份
- `%d`：两位日期
- `%H`：24 小时制小时
- `%M`：分钟
- `%S`：秒

### 示例

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <time.h>

int main()
{
    char buf[50];
    time_t t = time(NULL);
    struct tm *p = localtime(&t);

    // 格式化：年-月-日 时:分:秒
    strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", p);
    printf("标准时间格式：%s\n", buf);

    return 0;
}
```

输出：`2026-07-21 15:30:20`

## 计算程序运行耗时

`clock()` 用于测试代码运行速度和算法耗时：

```c
#include <stdio.h>
#include <time.h>

int main()
{
    clock_t start = clock();

    // ========== 测试代码段 ==========
    int sum = 0;
    for (int i = 0; i < 100000000; i++) sum += i;
    // ==============================

    clock_t end = clock();
    double cost = (double)(end - start) / CLOCKS_PER_SEC;

    printf("运行耗时：%.4f 秒\n", cost);
    return 0;
}
```

`CLOCKS_PER_SEC` 是系统常量，表示每秒的时钟节拍数。

## 时间戳加减运算

`time_t` 本质是数值，可以直接做加减运算来实现时间的推移：

```c
time_t now = time(NULL);
time_t next_day = now + 24 * 60 * 60; // 明天这个时间

struct tm *p = localtime(&next_day);
char buf[50];
strftime(buf, sizeof(buf), "%Y-%m-%d %H:%M:%S", p);
printf("明天时间：%s\n", buf);
```

## 常用函数速查表

| 函数 | 作用 |
|---|---|
| `time()` | 获取当前时间戳（秒） |
| `localtime()` | 时间戳转本地时间结构体 |
| `gmtime()` | 时间戳转 UTC 时间结构体 |
| `ctime()` | 时间戳直接转默认字符串时间 |
| `asctime()` | tm 结构体转字符串 |
| `strftime()` | 自定义格式化时间（最强大） |
| `clock()` | 获取程序运行时钟，计算耗时 |
| `difftime(t2, t1)` | 计算两个时间戳差值（秒，安全） |

## 高频踩坑总结

- **struct tm 年份 +1900、月份 +1**，这是最常见的出错点。
- VS 编译器必须加 `#define _CRT_SECURE_NO_WARNINGS` 放在文件最顶部，否则 `localtime` 等函数会报错。
- `time_t` 是秒级精度，没有毫秒；需要毫秒要用系统 API。
- `clock()` 统计的是 CPU 占用时间，不是绝对墙钟时间。
- `localtime` 线程不安全，新手练习无碍，多线程环境需用 `localtime_r` 或 `localtime_s`。

## 万能模板

获取标准北京时间 + 打印时间戳 + 格式化输出，可以直接复制使用：

```c
#define _CRT_SECURE_NO_WARNINGS
#include <stdio.h>
#include <time.h>

int main()
{
    // 1. 获取时间戳
    time_t stamp = time(NULL);
    printf("时间戳：%lld\n", stamp);

    // 2. 格式化标准时间
    char timeStr[60];
    struct tm *t = localtime(&stamp);
    strftime(timeStr, sizeof(timeStr), "%Y-%m-%d %H:%M:%S", t);
    printf("当前北京时间：%s\n", timeStr);

    return 0;
}
```

## 小结

- `time.h` 的三个核心类型是 `time_t`（时间戳）、`struct tm`（拆解时间）和 `clock_t`（计时），理解它们的关系是掌握整个头文件的关键。
- `strftime` 是最灵活的时间格式化函数，掌握 `%Y %m %d %H %M %S` 六个格式符即可应对绝大多数场景。
- 使用 `struct tm` 时务必记住年份 +1900、月份 +1。
- `clock()` 适合测量代码段的 CPU 耗时，但不等同于实际经过的时间。
