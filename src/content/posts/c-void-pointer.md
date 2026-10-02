---
title: "C 语言 void 空指针完整用法"
published: 2026-07-21
description: "从 void* 的本质和核心特性讲起，覆盖通用函数参数、内存操作、qsort 排序、动态内存等五大场景，附完整示例和易错点总结。"
tags: [void指针, 通用指针, C语言, memcpy, qsort]
category: 编程语言
draft: false
---


`void*` 是 C 语言中最特殊的指针类型——它可以存放任意类型变量的地址，是实现通用函数、内存操作和泛型容器的基石。但它"万能"的代价是不能直接解引用、不能直接做指针运算，使用前必须强制类型转换。这篇文章把 `void*` 的特性、使用场景和常见陷阱做一次完整梳理。

## void* 是什么

`void*` 叫做**通用空指针**：

- 可以存放**任意类型变量的地址**（int、char、float、结构体、函数指针等）。
- 本身**没有确定类型**，不能直接解引用 `*p`，也不能直接做指针加减运算。
- 使用前必须**强制转换成对应类型指针**。

```c
void *p; // 万能指针，能存任何地址
```

## 核心特性

### 任意类型指针都能直接赋值给 void*

```c
int a = 10;
char ch = 'x';
double d = 3.14;

void *p;
p = &a;    // int* → void* 自动转换
p = &ch;   // char* → void*
p = &d;    // double* → void*
```

### void* 不能直接解引用，必须强转

错误写法：

```c
void *p = &a;
printf("%d", *p); // 编译报错，void 无类型，不知道取多少字节
```

正确写法（强制转换后解引用）：

```c
int a = 10;
void *p = &a;
int *ip = (int *)p; // 转成 int 指针
printf("%d", *ip);

// 简写一行
printf("%d", *(int *)p);
```

### 不能直接指针偏移（p++ / p + 1）

指针加减依赖类型字节宽度，`void` 没有大小信息，直接运算会报错：

```c
void *p = arr;
p++; // 报错
```

需要先强转再偏移：

```c
int arr[5] = {1, 2, 3};
void *p = arr;
int *ip = (int *)p;
ip++; // 合法，跳过一个 int（4 字节）
```

## 最常用场景

### 场景 1：通用函数参数

标准库中的 `memcpy`、`memset`、`qsort` 全部用 `void*` 实现通用操作。下面是一个自定义的通用打印函数示例：

```c
#include <stdio.h>

// type: 1=int 2=float
void printNum(void *data, int type)
{
    if (type == 1)
    {
        printf("int: %d\n", *(int *)data);
    }
    else if (type == 2)
    {
        printf("float: %.2f\n", *(float *)data);
    }
}

int main()
{
    int a = 100;
    float b = 3.14f;
    printNum(&a, 1);
    printNum(&b, 2);
    return 0;
}
```

### 场景 2：内存操作函数 memcpy / memset

```c
#include <stdio.h>
#include <string.h>

int main()
{
    int src[3] = {1, 2, 3};
    int dst[3];
    // void* 支持拷贝任意类型内存
    memcpy(dst, src, sizeof(src));

    char buf[100];
    memset(buf, 0, sizeof(buf)); // 清空缓冲区
    return 0;
}
```

函数原型：

```c
void *memcpy(void *dest, const void *src, size_t n);
```

### 场景 3：qsort 通用排序

这是 `void*` 的经典案例。比较函数的参数是 `const void*`，通过强转适配任意数组类型：

```c
#include <stdio.h>
#include <stdlib.h>

// 比较函数：参数是 const void*，适配任意数组
int cmp(const void *a, const void *b)
{
    // 强转为 int* 再取值
    return *(int *)a - *(int *)b;
}

int main()
{
    int arr[] = {3, 1, 4, 2};
    int len = sizeof(arr) / sizeof(arr[0]);
    qsort(arr, len, sizeof(int), cmp);

    for (int i = 0; i < len; i++)
        printf("%d ", arr[i]);
    return 0;
}
```

### 场景 4：通用容器存储任意数据

用结构体存 `void*`，可以实现简易的万能链表节点：

```c
struct Node
{
    void *data;       // 存放任意数据地址
    struct Node *next;
};
```

### 场景 5：动态内存返回 void*

`malloc`/`calloc`/`realloc` 返回 `void*`，在 C 语言中可直接赋值给任意指针，无需强转（注意：C++ 中必须强转）：

```c
int *arr = malloc(10 * sizeof(int));
char *str = malloc(100);
```

## void* 与 void 的区别

- `void func();`：函数无返回值。
- `void *p;`：万能指针，存储任意地址。
- 不存在 `void val;` 这种无类型变量，编译会报错。

## 常见易错点

1. **直接解引用 void*** → 编译错误。
2. **void* 直接 p++ / p + 1** → 编译错误。
3. **丢失类型后强转错误**：

```c
float f = 2.5f;
void *p = &f;
int x = *(int *)p; // 类型不匹配，读出乱码
```

4. C 语言中 `void*` 赋值给其他指针**不用强制转换**，C++ 中必须强转。

## 完整综合示例

下面这个通用的 `swap` 函数利用 `void*` 和 `memcpy` 实现了任意类型数据的交换：

```c
#include <stdio.h>
#include <string.h>

void swap(void *a, void *b, size_t size)
{
    char temp[size]; // 临时缓冲区
    // 内存拷贝交换任意类型数据
    memcpy(temp, a, size);
    memcpy(a, b, size);
    memcpy(b, temp, size);
}

int main()
{
    int x = 10, y = 20;
    swap(&x, &y, sizeof(int));
    printf("int交换：%d %d\n", x, y);

    double m = 1.5, n = 3.9;
    swap(&m, &n, sizeof(double));
    printf("double交换：%.1lf %.1lf\n", m, n);
    return 0;
}
```

输出：

```text
int交换：20 10
double交换：3.9 1.5
```

## 小结

- `void*` 是通用指针，兼容所有类型地址，但访问内容和指针自增前**必须强制类型转换**。
- 核心用途包括：通用函数参数、内存操作（memcpy/memset）、动态内存分配（malloc）、泛型排序（qsort）。
- 最常见的错误是直接解引用或直接做指针运算，以及强转时类型不匹配导致读出乱码。
- C 语言中 `void*` 可以隐式转换为其他指针类型，C++ 中则必须显式强转。
