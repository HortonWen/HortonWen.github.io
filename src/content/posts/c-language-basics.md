---
title: "C 语言基础：关键字、进制与字节"
published: 2026-07-21
description: "从 C++ 过渡到 C 语言的核心差异，系统梳理 C 语言全部关键字、三种进制书写方式以及 short/long/long long 等整型类型的用法与占位符。"
tags: [C语言, 关键字, 进制, 字节, 数据类型, C++过渡]
category: 编程语言
draft: false
---


如果你已经有 C++ 基础，转向 C 语言其实是一次"向下溯源"的过程——很多概念和语法可以直接复用，需要做的主要是做减法和转换思维。这篇文章帮你快速完成这个过渡，同时系统梳理 C 语言的关键字体系、进制书写规则和整型字节相关知识。读完之后，你会对 C 语言的"底层感"有一个清晰的认识。

## 从 C++ 到 C：做减法与抓核心

C 语言可以看作 C++ 的"核心基础版"，它剔除了复杂的面向对象特性，让你更直接地接触和操作计算机底层资源。

### 忘掉 C++ 的高级特性

C 语言不支持以下 C++ 特性，写 C 代码时需要主动"屏蔽"它们：

- **摒弃面向对象**：不再有 `class`、`object`、继承、多态，取而代之的是 `struct` 和独立的函数。
- **告别 C++ 核心特性**：不要使用引用、函数重载、运算符重载、模板和异常处理。
- **切换输入输出**：忘记 `std::cout` 和 `std::cin`，回归 `printf` 和 `scanf`。
- **标准库的差异**：C++ 的 STL 提供了丰富的容器和算法，C 语言标准库要小得多，需要习惯用原生数组、自己实现简单的数据结构。

### 聚焦 C 语言的独特之处

在 C++ 中很多底层细节被自动管理了，但在 C 语言中你必须亲自掌控一切。

**拥抱 `stdio.h` 和 `stdlib.h`**：这是 C 语言编程的基石。输入输出靠 `printf`、`scanf`、`fgets`；字符串处理靠 `strlen`、`strcpy`、`strcat`、`strcmp`；内存管理靠 `malloc`、`calloc`、`realloc`、`free`。

**成为指针大师**：虽然 C++ 也有指针，但 C 语言将它用到了极致。函数指针是实现回调和模拟多态的关键技巧；指针与数组的关系和等价性需要彻底理解；字符串本质上是以 `\0` 结尾的字符数组，通过指针来操作。

**手动管理内存**：这是从 C++ 过渡到 C 最大的思维转变。C 语言必须使用 `malloc`/`free`，并且要注意三点：每次分配后检查返回值是否为 `NULL`；`malloc` 和 `free` 必须配对使用；`free` 之后最好将指针置为 `NULL` 避免野指针。

### 推荐的学习路径

有了 C++ 基础，你的学习路径可以非常高效：安装 GCC 编译器和轻量级编辑器，快速过一遍基础语法，然后用 C 语言重写你熟悉的 C++ 小程序。经典练手项目包括用 C 实现链表、栈或队列（深刻理解指针和内存管理），写一个通讯录管理程序（练习结构体和文件读写），或者实现控制台版的猜数字、扫雷游戏（巩固流程控制和函数设计）。

简单来说，从 C++ 转向 C 的任务就是：**移除**所有面向对象和泛型特性，**转换** `new`/`delete` 为 `malloc`/`free`、`cout`/`cin` 为 `printf`/`scanf`，**聚焦**指针操作、内存管理和算法逻辑。

## C 语言全部关键字

了解了 C 语言的整体定位之后，接下来系统认识一下它的全部保留字。C 语言的关键字从 C89 到 C11 逐步扩充，掌握它们是写出合规代码的前提。

### C89 基础关键字（32 个）

```text
auto        break       case        char
const       continue    default     do
double      else        enum        extern
float       for         goto        if
inline      int         long        register
return      short       signed      sizeof
static      struct      switch      typedef
union       unsigned    void        volatile
while
```

### C99 新增关键字（5 个）

```text
_Bool       _Complex    _Imaginary
inline      restrict
```

### C11 新增关键字（2 个）

```text
_Atomic     _Generic
```

### 完整汇总清单（共 39 个）

1. auto
2. break
3. case
4. char
5. const
6. continue
7. default
8. do
9. double
10. else
11. enum
12. extern
13. float
14. for
15. goto
16. if
17. inline
18. int
19. long
20. register
21. return
22. short
23. signed
24. sizeof
25. static
26. struct
27. switch
28. typedef
29. union
30. unsigned
31. void
32. volatile
33. _Bool
34. _Complex
35. _Imaginary
36. restrict
37. _Atomic
38. _Generic

### 补充说明

- 关键字不能用作变量名、函数名、结构体名，属于系统保留字。
- 带下划线开头（`_Bool`/`_Atomic` 等）是标准预留关键字，平时代码一般用头文件封装别名（如 `<stdbool.h>` 里的 `bool`）。
- `sizeof`、`typedef` 看着像函数，实际是关键字。
- C 语言区分大小写，关键字**全部小写**，大写如 `INT` 不是关键字。

### 分类速记

1. **数据类型**：`char int long short float double void signed unsigned _Bool`
2. **修饰限定**：`const static extern register volatile restrict _Atomic`
3. **分支循环**：`if else for while do switch case default break continue goto`
4. **复合类型**：`struct union enum typedef`
5. **运算/返回**：`sizeof return`
6. **存储类别**：`auto`
7. **C99/C11 扩展**：`inline _Complex _Imaginary _Generic`

## 三种进制书写与 printf 输出

掌握了关键字之后，来看看 C 语言中数字的不同进制写法以及如何用 `printf` 按不同进制输出。这在嵌入式开发和底层调试中经常用到。

### 字面量写法（代码里直接写数字）

**十进制**是最常用的默认写法，无前缀：

```c
int a = 12;   // 十进制 12
int b = -50;  // 负数十进制
```

**八进制**以数字 `0` 开头，数字只能是 0~7：

```c
int oct = 014;  // 014 = 十进制 12
int err = 018;  // 错误！八进制不能出现 8、9
```

**十六进制**以 `0x` 或 `0X` 为前缀，数字范围 0~9、a~f、A~F：

```c
int hex1 = 0xc;    // 小写 0xc = 十进制 12
int hex2 = 0XC;    // 大写 0XC = 十进制 12
int hex3 = 0x1A;   // 0x1A = 十进制 26
```

### printf 输出不同进制的占位符

| 进制 | 占位符 | 输出效果 | 示例代码 |
|---|---|---|---|
| 十进制 | `%d` | 正常十进制数字 | `printf("%d", 12); // 12` |
| 八进制 | `%o` | 纯八进制数字（不带前缀 0） | `printf("%o", 12); // 14` |
| 带前缀八进制 | `%#o` | 自动补前缀 0 | `printf("%#o", 12); // 014` |
| 小写十六进制 | `%x` | 小写 a~f，无 0x | `printf("%x", 12); // c` |
| 大写十六进制 | `%X` | 大写 A~F，无 0X | `printf("%X", 12); // C` |
| 带前缀十六进制 | `%#x` / `%#X` | 自动补 0x / 0X | `printf("%#x", 12); // 0xc` |

### 完整示例

```c
#include <stdio.h>
int main()
{
    int num = 12;
    printf("十进制：%d\n", num);
    printf("八进制：%o  带前缀：%#o\n", num, num);
    printf("十六进制小写：%x  带前缀：%#x\n", num, num);
    printf("十六进制大写：%X  带前缀：%#X\n", num, num);
    return 0;
}
```

输出结果：

```text
十进制：12
八进制：14  带前缀：014
十六进制小写：c  带前缀：0xc
十六进制大写：C  带前缀：0XC
```

### 补充要点

二进制字面量在 C99 及以后支持，前缀 `0b` / `0B`，仅包含 0 和 1：

```c
int bin = 0b1100; // 二进制 1100 = 十进制 12
```

> **提示**：标准 `printf` **没有直接输出二进制的占位符**，需要自己写函数转换打印。

易错提醒：八进制不能写 8、9，写了直接编译报错；`014` 是八进制而 `14` 是十进制，数值完全不同；`#` 修饰符的作用是让输出自动带上进制前缀。

![C 语言三种进制书写对照表](/images/c-number-base-01.webp)

## short / long / long long 字节与占位符

理解了进制之后，再来看 C 语言中不同整型类型的字节占用、声明写法和配套的 printf 占位符。这些知识在处理数据范围和跨平台开发时至关重要。

### 类型声明写法

**short 短整型**（全称 `short int`，简写 `short`）：

```c
short a = 100;
short int b = -200;
// 无符号短整型
unsigned short c = 500;
```

- 占用：2 字节
- printf 占位符：`%hd`
- 无符号：`%hu`

**long 长整型**（全称 `long int`，简写 `long`）：

```c
long a = 123456;
long int b = -987654;
// 无符号长整型
unsigned long c = 888888;
```

- 占用：Windows 4 字节，Linux/macOS 8 字节
- printf 占位符：`%ld`
- 无符号：`%lu`

**long long 长长整型**（简写 `ll`，完整写法 `long long int`）：

```c
long long a = 999999999999;
long long int b = -1234567890123;
// 无符号长长整型
unsigned long long c = 11111111111111;
```

- 占用：固定 8 字节
- printf 占位符：`%lld`
- 无符号：`%llu`

![整型类型字节占用示意](/images/c-byte-01.webp)

### 字面量后缀

在数字末尾加后缀，告诉编译器这个数字是什么类型：

| 类型 | 后缀 | 示例 |
|---|---|---|
| short | 无专用后缀，一般强转 `(short)123` | `(short)500` |
| long | `l` / `L`（推荐大写 L，避免和 1 混淆） | `1000L`、`-5000l` |
| long long | `ll` / `LL` | `9999999LL`、`123456ll` |
| unsigned long | `ul` / `UL` | `666UL` |
| unsigned long long | `ull` / `ULL` | `8888ULL` |

示例：

```c
long num1 = 123456L;
long long num2 = 9999999999LL;
unsigned long long num3 = 123456789ULL;
```

### 配套 printf 输出占位符汇总

```c
#include <stdio.h>
int main()
{
    short s = 32767;
    long l = 2147483647L;
    long long ll = 9223372036854775807LL;

    printf("short：%hd\n", s);
    printf("long：%ld\n", l);
    printf("long long：%lld\n", ll);

    unsigned short us = 65535;
    unsigned long ul = 4294967295UL;
    unsigned long long ull = 18446744073709551615ULL;
    printf("unsigned short：%hu\n", us);
    printf("unsigned long：%lu\n", ul);
    printf("unsigned long long：%llu\n", ull);
    return 0;
}
```

![各整型取值范围与占位符对照](/images/c-byte-02.webp)

### 关键区分记忆

- 变量定义：short = 短整数，long = 长整数，long long = 超长整数。
- 输出占位符规律：short → `h` 开头（`%hd`），long → `l` 开头（`%ld`），long long → `ll` 开头（`%lld`）。
- 数字常量后缀：long 加 `L`，long long 加 `LL`。
- 无符号统一加 `u`：`%hu %lu %llu`。

## 小结

- 从 C++ 过渡到 C 的核心是"做减法"：去掉面向对象和泛型特性，把注意力集中在指针、内存管理和底层操作上。
- C 语言共有 39 个关键字（C89 32 个 + C99 5 个 + C11 2 个），按数据类型、修饰限定、分支循环、复合类型等分类记忆更高效。
- 代码中数字可以用十进制、八进制（前缀 `0`）、十六进制（前缀 `0x`）书写，printf 通过 `%d`、`%o`、`%x` 等占位符按不同进制输出。
- short、long、long long 分别占 2、4/8、8 字节，对应 `%hd`、`%ld`、`%lld` 占位符，字面量后缀分别为无、`L`、`LL`。
