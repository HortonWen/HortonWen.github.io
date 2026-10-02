---
title: "C 语言大厂通用代码规范"
published: 2026-07-23
description: "从文件命名、注释规范到数据类型、宏定义、函数设计和分支控制，系统整理适用于嵌入式和后端 C 开发的大厂级代码规范。"
tags: [代码规范, C语言, 命名规范, 嵌入式, 代码风格]
category: 编程语言
draft: false
---


写出能跑的代码只是第一步，写出能让团队协作维护的代码才是专业开发者应有的素养。C 语言因为没有强制的代码风格约束，更需要一套清晰的规范来保证代码的可读性和安全性。这篇文章整理了适用于嵌入式和后端 C 开发的大厂通用代码规范，涵盖文件组织、命名、注释、数据类型、宏、排版、函数设计等方方面面，适合作为个人项目的参考标准。

## 文件规范

### 文件命名

全部使用**小写加下划线**，禁止驼峰、大写、中文：

```c
// 正确
uart_driver.c  uart_driver.h
// 错误
UartDriver.c  UART.c
```

功能分层命名：`模块_功能.c`，如 `led_io.c`、`can_parse.c`。头文件与源文件一一对应，禁止一个 `.h` 对应多个 `.c`。

### 头文件保护（必写）

禁止 `#pragma once`（部分老编译器不支持），统一使用标准宏守卫：

```c
#ifndef UART_DRIVER_H
#define UART_DRIVER_H
// 头文件内容
#endif /* UART_DRIVER_H */
```

宏名规则：`文件名全大写_下划线_H`。

### 头文件结构顺序

1. 文件版权注释
2. 头文件宏守卫
3. 外部头文件（系统标准库，`<>`）
4. 内部模块头文件（自定义库，`""`）
5. 宏定义 / 枚举 / 结构体 / typedef
6. 全局函数声明、全局变量 extern 声明
7. 结束守卫

### .c 源文件结构

1. 版权注释
2. 对应头文件优先包含
3. 系统头文件
4. 其他自定义头文件
5. 静态宏、静态全局变量（仅本文件使用）
6. 静态内部函数（static）
7. 对外实现函数

### 禁止操作

- `.h` 中定义全局变量、函数实现（只能声明）。
- 循环 include 互相依赖。
- 头文件中放大量代码逻辑。

## 注释规范

### 文件头部注释（所有 .c/.h 必须）

```c
/*********************************************************************
 * @file    uart_driver.c
 * @brief   UART串口底层收发驱动
 * @author  xxx
 * @date    2026-07-23
 * @note    波特率固定115200，DMA收发，不可中断嵌套
 *********************************************************************/
```

### 函数注释（所有对外 API 必须）

```c
/**
 * @brief 串口发送字符串
 * @param buf: 待发送字符串缓冲区
 * @param len: 发送数据长度
 * @retval 0成功 / -1参数错误 / -2忙
 */
int uart_send_buf(uint8_t *buf, uint16_t len);
```

### 单行注释

- 代码行后注释：`// 空格+说明`。
- 禁止无意义注释如 `i++;//i自增`。
- 复杂逻辑块上方多行注释，单行逻辑行尾注释。
- 禁止中文全角符号、特殊表情注释。

### 废弃代码

禁止注释掉大段旧代码，直接删除；需要保留历史用 git 版本管理。

## 命名规范

### 变量、函数、文件：小写下划线 snake_case

```c
// 正确
uint16_t uart_rx_len;
void led_set_state(uint8_t state);
// 错误
uint16_t uartRxLen;  LedSetState()
```

### 宏、枚举常量：全大写下划线 UPPER_SNAKE

```c
#define UART_BAUD_115200 115200
enum LED_STATE {
    LED_OFF = 0,
    LED_ON  = 1
};
```

### 结构体 / typedef 类型

结构体名小写下划线，typedef 加后缀 `_t`：

```c
typedef struct uart_config {
    uint32_t baud;
    uint8_t data_bit;
} uart_config_t;
```

### 静态与全局变量前缀

静态变量加前缀 `s_`，全局变量加前缀 `g_`，快速区分作用域：

```c
static uint8_t s_uart_rx_buf[128]; // 文件静态
uint16_t g_system_tick;            // 全局变量
```

### 函数前缀区分模块

串口函数统一 `uart_` 开头，LED 用 `led_`，CAN 用 `can_`，一眼区分模块归属：

```c
uart_init()  uart_send()
led_init()   led_toggle()
```

### 禁止命名

- 单字母无意义变量（循环 `i/j/k` 除外）。
- 拼音、中文、混合大小写。
- 魔法数字不定义宏。

## 数据类型规范

**禁用原生 char/short/int/long，统一使用 stdint 标准定长类型**：

```c
#include <stdint.h>
uint8_t   无符号1字节    int8_t  有符号1字节
uint16_t  无符号2字节    int16_t 有符号2字节
uint32_t  无符号4字节    int32_t 有符号4字节
uint64_t  无符号8字节    int64_t 有符号8字节
size_t    长度专用
bool      包含 stdbool.h 使用 true/false
```

禁止 `unsigned int`，全部替换为 `uint32_t`。布尔判断只用 `bool`，禁止用 int 充当布尔。

## 宏规范

宏表达式全部加括号，避免优先级错误：

```c
// 错误
#define ADD(a,b) a + b
// 正确
#define ADD(a,b) ((a) + (b))
```

多行宏使用 `do { ... } while(0)`，保证分号安全：

```c
#define UART_ERR_PRINT(str) do { \
    uart_send_str("ERR:");       \
    uart_send_str(str);          \
} while(0)
```

宏只用于常量和简单工具函数，复杂逻辑改用 static 内联函数。禁止宏递归定义和修改全局变量。

## 代码缩进与排版

统一 4 空格缩进，禁止 Tab。大括号采用 **K&R 风格**（大厂主流）：左大括号跟在语句同一行，右大括号单独一行。

```c
if (uart_ready) {
    uart_send();
}

for (uint16_t i = 0; i < len; i++) {
    buf[i] = 0;
}

int uart_init(void) {
    return 0;
}
```

空格规则：运算符两侧加空格（`a + b`）；`if/for/while` 后括号前加空格（`if (x)`）；逗号后加空格（`func(a, b, c)`）；结构体 `.`、指针 `->` 两侧无空格（`cfg->baud`）。

空行分隔：函数之间空一行，逻辑块之间空一行。一行只写一条语句，禁止 `a=1;b=2;`。

## 函数规范

- 参数顺序：输入参数在前，输出参数在后。
- 无参数函数必须写 `void`，禁止空括号：`void uart_init(void);`。
- 单函数控制在 **80 行以内**，超长拆分子 static 函数。
- 优先使用 static 内部函数，仅对外接口不加 static。
- 返回值统一规范：0 = 成功，负数 = 错误码，正数 = 有效数据。
- 禁止函数内部大量依赖全局变量，尽量通过传参传递。

## 分支规范

即使单行代码，大括号也**不能省略**：

```c
// 禁止
if (flag)
    return;
// 必须
if (flag) {
    return;
}
```

常量放左边（防止少写 `=`）：推荐 `if (0 == ret)`。

else 与上一行右大括号同行：

```c
if (a > 0) {

} else if (a < 0) {

} else {

}
```

switch 规范：每个 case 加 break，需要穿透时注释说明 `// fall through`，必须写 default 分支处理异常值。

```c
switch (state) {
case LED_ON:
    gpio_set_high();
    break;
case LED_OFF:
    gpio_set_low();
    break;
default:
    uart_err_print("invalid led state");
    break;
}
```

## 数组与指针规范

- 数组做函数形参必须同步传入长度，禁止裸数组无长度。
- 字符串只读参数加 `const`，防止误修改。
- 所有传入指针先判断 `NULL`。
- 禁止返回局部数组的指针（栈内存已销毁）。

## 变量与内存规范

- 变量就近定义，C99 支持循环内定义。
- 局部变量必须初始化，防止随机脏数据。
- 全局/静态数组统一初始化为 0。
- `malloc` 申请内存必须配套 `free`，释放后置空指针。
- 禁止超大局部数组（栈溢出），大缓冲区用 static 全局或堆 malloc。

## 禁止行为（红线）

1. 不使用无符号负数比较 `if (i > -1)`。
2. 魔法数字直接写代码，不定义宏。
3. 全局变量泛滥，模块间耦合严重。
4. 强制类型转换不加注释。
5. goto 仅允许统一资源释放，禁止随意跳转。
6. 混用 float/double，嵌入式无特殊需求只用 uint/int。
7. 头文件大量 using、宏污染全局命名空间。
8. 省略大括号、单行 if 不写 `{}`。
9. 函数超过 150 行不拆分。
10. 裸指针不判空、内存泄漏。

## 嵌入式与后端额外规范

**嵌入式大厂**（华为/海思/兆易创新）：禁止浮点运算在中断内部使用；中断函数短小，只标记标志位；寄存器操作统一封装宏；硬件相关代码隔离驱动层；不使用递归。

**后端 C 服务**（字节/阿里后台）：严格内存检测，valgrind 无泄漏；多线程全局变量必须加互斥锁；IO 操作统一错误处理；日志分级宏代替 printf。

## 工具配套

- 使用 clang-format 统一格式化脚本。
- 静态代码扫描：clang-tidy、cppcheck，无高危告警。
- 编译开启最高警告 `-Wall -Wextra -Werror`。
- 统一编码 UTF-8，无中文 GBK 编码。

## 小结

- 文件命名用小写下划线，头文件必须加宏守卫，`.h` 中只做声明不做实现。
- 变量和函数用 snake_case，宏和枚举常量用 UPPER_SNAKE，结构体 typedef 加 `_t` 后缀。
- 禁用原生 int/long，统一使用 `<stdint.h>` 定长类型。
- 宏表达式全部加括号，多行宏用 `do-while(0)` 包裹。
- 函数控制在 80 行以内，参数先输入后输出，无参函数写 `void`。
- 所有指针先判空，malloc 必须配对 free，禁止返回局部数组指针。
