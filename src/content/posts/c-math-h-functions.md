---
title: "C 语言 math.h 常用函数完整用法"
published: 2026-07-21
description: "系统梳理 C 语言 math.h 头文件中的常量定义、三角函数、幂与对数、取整绝对值等常用函数，附完整示例代码和常见踩坑点。"
tags: [math.h, 数学函数, C语言, 三角函数, 取整]
category: C 语言
draft: false
---


做数值计算、算法题或者嵌入式开发时，`math.h` 是用得最多的标准库头文件之一。但它的函数数量不少，参数和返回值类型也有讲究，用错了轻则结果不对，重则编译报错。这篇文章把 `math.h` 中最常用的函数按类别整理一遍，帮你快速查阅和正确使用。

使用前记得引入头文件：`#include <math.h>`。Linux/MinGW 编译时需要加 `-lm` 链接数学库，例如 `gcc main.c -o main -lm`。绝大多数函数的参数和返回值都是 `double` 类型。

## 常量定义

`math.h` 提供了几个常用的数学常量：

```c
#define M_PI       3.14159265358979323846   // π
#define M_PI_2     1.57079632679489661923   // π/2
#define M_PI_4     0.78539816339744830962   // π/4
#define M_E        2.71828182845904523536   // 自然常数 e
#define M_SQRT2    1.41421356237309504880   // √2
```

> **提示**：部分编译器（如 MSVC）需要在 `#include <math.h>` 之前定义宏 `#define _USE_MATH_DEFINES` 才能启用这些常量。

## 三角函数

三角函数的参数是**弧度**，不是角度，这是最常见的出错点。

| 函数 | 作用 | 示例 |
|---|---|---|
| `sin(double x)` | 正弦 | `sin(M_PI/2)` → 1 |
| `cos(double x)` | 余弦 | `cos(M_PI)` → -1 |
| `tan(double x)` | 正切 | `tan(M_PI/4)` → 1 |
| `asin(double x)` | 反正弦，返回 [-π/2, π/2] | `asin(1)` → π/2 |
| `acos(double x)` | 反余弦，返回 [0, π] | `acos(-1)` → π |
| `atan(double x)` | 反正切，返回 [-π/2, π/2] | `atan(1)` → π/4 |
| `atan2(y, x)` | 根据坐标 (y,x) 求角度，范围 [-π, π] | `atan2(1,0)` = π/2 |

### 角度与弧度的转换

```c
// 角度转弧度
double deg2rad(double deg) {
    return deg * M_PI / 180.0;
}
// 弧度转角度
double rad2deg(double rad) {
    return rad * 180.0 / M_PI;
}
// 例：求 sin30°
double val = sin(deg2rad(30)); // 0.5
```

## 幂、开方、指数与对数

这一组函数覆盖了乘方、开方和对数运算：

**平方根 `sqrt(double x)`**：

```c
sqrt(16);  // 4.0
sqrt(2);   // 1.414...
```

**次方 `pow(base, exp)`**：

```c
pow(2, 3);   // 8.0  即 2³
pow(9, 0.5); // 3.0  即 √9
pow(10, -2); // 0.01 即 10⁻²
```

**自然指数 eˣ `exp(double x)`**：

```c
exp(1);    // e ≈ 2.718
exp(2);    // e²
```

**自然对数 ln(x) `log(double x)`**：

```c
log(M_E);  // 1.0
log(10);   // ln10
```

**常用对数 lg(x) `log10(double x)`**：

```c
log10(100); // 2.0
```

## 取整与绝对值函数

这组函数在处理离散化和数值截断时非常实用：

**浮点绝对值 `fabs(double x)`**：注意 int 绝对值用 `abs()`，double 必须用 `fabs()`。

```c
fabs(-3.14); // 3.14
```

**向上取整 `ceil(x)`**（往大取）：

```c
ceil(2.1);  // 3
ceil(-2.1); // -2
```

**向下取整 `floor(x)`**（往小取）：

```c
floor(2.9);  // 2
floor(-2.1); // -3
```

**四舍五入 `round(x)`**：

```c
round(2.3);  // 2
round(2.6);  // 3
round(-2.5); // -3
```

**截断取整 `trunc(x)`**（直接砍掉小数）：

```c
trunc(2.9);  // 2
trunc(-2.9); // -2
```

## 最值、余数与其他工具函数

**浮点取余 `fmod(a, b)`**：

```c
fmod(5, 2);  // 1
fmod(-5, 2); // -1
```

**最小值/最大值（C99）**：

```c
fmin(3.1, 2.5); // 2.5
fmax(3.1, 2.5); // 3.1
```

**立方根 `cbrt(x)`**：

```c
cbrt(8); // 2
```

**斜边长度 `hypot(x, y)`**，即 √(x²+y²)：

```c
hypot(3, 4); // 5.0
```

## 完整可运行示例

```c
#define _USE_MATH_DEFINES
#include <stdio.h>
#include <math.h>

// 角度转弧度
double deg_to_rad(double deg) {
    return deg * M_PI / 180.0;
}

int main() {
    // 三角函数
    double s = sin(deg_to_rad(30));
    printf("sin30° = %.2lf\n", s);

    // 开方、次方
    printf("√100 = %.0lf\n", sqrt(100));
    printf("5^3 = %.0lf\n", pow(5, 3));

    // 取整
    double num = 3.67;
    printf("ceil=%.0lf floor=%.0lf round=%.0lf\n", ceil(num), floor(num), round(num));

    // 对数
    printf("ln(e) = %.1lf\n", log(M_E));
    printf("lg(1000) = %.1lf\n", log10(1000));

    // 斜边
    printf("直角边3、4斜边=%.0lf\n", hypot(3, 4));

    return 0;
}
```

编译运行命令（MinGW/GCC）：

```bash
gcc test.c -o test -lm
./test
```

## 常见踩坑点

1. **三角函数参数是弧度，不是角度**，忘记转换会导致结果完全错误。
2. `abs()` 只给 int 用，浮点数绝对值必须用 `fabs()`。
3. GCC/MinGW 不写 `-lm` 会报 `undefined reference to xxx`。
4. MSVC 想要 `M_PI` 等常量，必须先定义 `#define _USE_MATH_DEFINES`，且放在 `#include <math.h>` 前面。
5. `pow` 计算整数次方效率较低，简单平方建议直接用 `x*x` 代替 `pow(x, 2)`。

## 小结

- `math.h` 的函数参数和返回值几乎都是 `double`，使用时注意类型匹配。
- 三角函数接受弧度参数，务必做好角度到弧度的转换。
- 取整函数有四种：`ceil`（向上）、`floor`（向下）、`round`（四舍五入）、`trunc`（截断），根据需求选用。
- 编译时别忘了链接数学库 `-lm`，MSVC 下使用常量前要先定义 `_USE_MATH_DEFINES`。
