---
title: "C 语言随机数 rand() 超全教程"
published: 2026-07-21
description: "从 rand() 和 srand() 的原理讲起，覆盖指定范围整数随机、浮点随机、常见踩坑点和万能模板，帮你彻底掌握 C 语言随机数生成。"
tags: [rand, srand, 随机数, C语言, stdlib]
category: 编程语言
draft: false
---


在游戏开发、模拟测试和算法练习中，随机数是不可或缺的基础工具。C 语言通过 `rand()` 和 `srand()` 两个函数配合时间种子来实现随机数生成，但很多初学者因为不了解伪随机的原理，写出了每次运行结果都一样的代码。这篇文章从原理到实践，把随机数的正确用法讲透。

所需头文件：`#include <stdlib.h>` 和 `#include <time.h>`。核心知识点是：C 语言生成真随机数必须搭配 `rand()`（生成随机数）+ `srand()`（设置随机种子）+ `time(NULL)`（时间种子）三者使用。

## 两个核心函数

### rand()：生成随机整数

函数原型：`int rand(void);`

- 返回值：**0 ~ RAND_MAX** 之间的随机整数。
- `RAND_MAX` 是系统宏，一般为 **32767**。
- 单独使用 `rand()` 时，每次运行程序生成的随机数序列一模一样（伪随机）。

### srand()：设置随机数种子

函数原型：`void srand(unsigned int seed);`

- 作用：改变随机数生成的起始序列。
- **种子不变，随机数序列就不变**。
- 用 `time(NULL)` 做种子，因为时间时刻变化，所以能实现"真随机"的效果。

## 最简真随机数代码（必背模板）

**规则：`srand()` 只调用一次，写在 main 开头，不要放进循环里！**

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main()
{
    // 设置时间种子，只需执行一次
    srand((unsigned int)time(NULL));

    // 生成随机数
    int num = rand();
    printf("随机整数：%d\n", num);

    return 0;
}
```

## 生成指定范围随机数

这是实际开发中最常用的场景。

### 通用公式

**[a, b] 闭区间随机整数**：`rand() % (b - a + 1) + a`

### 生成 0~n 随机数

```c
// 0~9
int x = rand() % 10;
// 0~99
int y = rand() % 100;
```

### 生成 1~n 随机数（考试/游戏最常用）

```c
// 1~10
int x = rand() % 10 + 1;
// 1~100
int y = rand() % 100 + 1;
```

### 自定义区间 [min, max]

```c
// 生成 20~60 的随机数
int min = 20;
int max = 60;
int num = rand() % (max - min + 1) + min;
```

## 生成随机小数（浮点随机数）

### 生成 0~1 随机小数

```c
double r = (double)rand() / RAND_MAX;
```

### 生成任意区间小数 [a, b]

```c
// 生成 1.5~5.5 随机小数
double a = 1.5;
double b = 5.5;
double res = a + (double)rand() / RAND_MAX * (b - a);
printf("%.2f\n", res);
```

## 循环生成多个随机数

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main()
{
    srand((unsigned int)time(NULL));

    // 生成 10 个 1~100 随机数
    for (int i = 0; i < 10; i++)
    {
        int num = rand() % 100 + 1;
        printf("%d ", num);
    }

    return 0;
}
```

## 新手致命踩坑点

**坑 1：srand 写在循环里。** 如果把 `srand()` 放进 for 循环，由于执行速度太快，时间戳不变，会生成全部相同的随机数。正确做法是在程序开头只调用一次。

**坑 2：不加时间种子直接用 rand。** 每次运行程序随机数完全一样，是固定的伪随机序列，不是真随机。

**坑 3：取余范围写错。** 想要 1~10 却写成 `rand()%10`，只会得到 0~9。口诀：**模区间长度 + 起始值**。

**坑 4：整数除法丢失小数。** 直接写 `rand()/RAND_MAX` 结果永远为 0，必须强制转换 `(double)`。

## 最全万能模板

包含整数区间随机和小数随机，可以直接复制使用：

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main()
{
    srand((unsigned int)time(NULL));

    // 1. 1~100 随机整数
    int int_rand = rand() % 100 + 1;
    printf("1~100随机整数：%d\n", int_rand);

    // 2. 0~1 随机小数
    double double_rand = (double)rand() / RAND_MAX;
    printf("0~1随机小数：%.4f\n", double_rand);

    // 3. 5.0~20.0 随机小数
    double res = 5.0 + (double)rand() / RAND_MAX * 15.0;
    printf("5~20随机小数：%.2f\n", res);

    return 0;
}
```

## 小结

- `rand()` 产出随机数，`srand()` 刷新随机序列（只写一次），`time(NULL)` 提供动态种子实现真随机效果。
- 整数区间公式：`rand() % (max - min + 1) + min`。
- 小数随机必须做强制浮点转换：`(double)rand() / RAND_MAX`。
- `srand()` 绝对不能放在循环内部，否则随机数会全部相同。
