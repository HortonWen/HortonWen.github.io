---
title: "C 语言数组全解：作为函数形参与二维数组"
published: 2026-07-30
description: "系统讲解 C 语言数组作为函数参数的三种写法、退化机制与 const 保护，以及二维数组的定义、遍历、动态分配和作为形参的规则。"
tags: [数组, 函数形参, 二维数组, C语言, 指针]
category: 编程语言
draft: false
---


数组是 C 语言中最基础的数据结构，但当它作为函数参数传递时，行为往往出乎初学者的意料——数组不会完整拷贝，而是退化为指针，长度信息随之丢失。再加上二维数组的声明规则和动态分配方式与一维数组差异很大，这两个知识点成了很多学习者的绊脚石。这篇文章把数组传参和二维数组合并讲透，帮你建立起完整的认知。

## 数组作为函数形参

### 核心结论

C 语言中数组传递给函数时**不会完整拷贝数组**，只会传递**数组首元素地址**（退化为指针），函数内部无法直接获取数组长度。

### 一维数组三种形参写法（完全等价）

```c
// 写法 1：标准数组形式（推荐，可读性好）
void func1(int arr[], int len);

// 写法 2：指定数组大小，[] 内数字会被编译器忽略，无任何约束
void func2(int arr[100], int len);

// 写法 3：指针形式，底层本质
void func3(int *arr, int len);
```

关键特性：

1. 形参 `int arr[]` 和 `int* arr` 编译器处理完全一样。
2. 函数内对 `arr[i]` 修改等于修改外部原数组（操作同一块内存）。
3. 函数内部**不能用 `sizeof(arr)` 求数组真实长度**，只能拿到指针字节大小。

### 完整示例

```c
#include <stdio.h>

void printArr(int arr[], int n) {
    // sizeof(arr) 得到指针大小（64 位系统 8 字节），不是数组长度
    for (int i = 0; i < n; i++) {
        printf("%d ", arr[i]);
    }
    arr[0] = 999; // 修改原数组
}

int main() {
    int a[5] = {1, 2, 3, 4, 5};
    int size = sizeof(a) / sizeof(a[0]); // 主函数中可以正确计算长度
    printArr(a, size);

    printf("\n%d", a[0]); // 输出 999，原数组被修改
    return 0;
}
```

### 必须手动传入数组长度的原因

数组退化为指针后，长度信息丢失：

```c
void test(int arr[]) {
    printf("%zu", sizeof(arr)); // 永远是指针大小 8（64 位）
}
int main() {
    int arr[10];
    printf("%zu", sizeof(arr)); // 40，完整数组字节
    test(arr);
}
```

### 禁止修改原数组：const 修饰

如果不想让函数内部篡改数组内容，加 `const` 修饰：

```c
void readArr(const int arr[], int len) {
    arr[0] = 10; // 编译报错，只读数组
}
```

## 二维数组作为形参

理解了上面的退化机制之后，来看多维数组的特殊规则：**只有第一维可以省略，其余维度必须指定大小**。

```c
// 合法写法 1
void mat1(int matrix[][3], int row);
// 合法写法 2，指针等价形式
void mat2(int (*matrix)[3], int row);

// 错误写法！第二维不能省略
// void matErr(int matrix[][], int row);
```

### 示例

```c
#include <stdio.h>

void showMatrix(int m[][3], int rows) {
    for (int i = 0; i < rows; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", m[i][j]);
        }
        printf("\n");
    }
}

int main() {
    int mat[2][3] = {{1, 2, 3}, {4, 5, 6}};
    showMatrix(mat, 2);
    return 0;
}
```

## 字符串作为形参

字符串本质是 `char[]`，形参写法与普通数组一致：

```c
void printStr(char str[]) {
    printf("%s", str);
}
// 等价写法
void printStr2(char *str) {
    printf("%s", str);
}
// 只读字符串
void printStr3(const char *str) {
    printf("%s", str);
}
```

## 二维数组完整教程

接下来系统讲解二维数组本身的定义、访问、遍历和动态分配。

### 什么是二维数组

一维数组是一行数据，二维数组是多行多列的表格，形如矩阵：

```text
行0：[10, 20, 30]
行1：[40, 50, 60]
行2：[70, 80, 90]
```

下标规则：`数组[行下标][列下标]`，下标从 0 开始。

### 静态定义（固定行列）

```c
// 方式 1：完整初始化
int arr[3][3] = {
    {10, 20, 30},
    {40, 50, 60},
    {70, 80, 90}
};

// 方式 2：简写初始化（自动分行）
int arr2[3][3] = {10, 20, 30, 40, 50, 60, 70, 80, 90};

// 方式 3：只赋值部分元素，剩余自动补 0
int arr3[3][3] = {{1, 2}, {3}};
// 未赋值位置全为 0
```

> **重点**：定义时**列数不能省略**，行数可以省略（编译器自动计算行数）。

```c
int arr4[][3] = {{1, 2}, {3, 4}, {5, 6}}; // 合法，3 行 2 列
// int arr5[3][] = ...  错误，列必须指定
```

### 访问元素

```c
// 读取第 1 行第 2 列（下标从 0）
int num = arr[1][2];
// 修改元素
arr[0][0] = 99;
```

### 遍历二维数组（双层 for 循环）

外层循环控制行，内层循环控制列：

```c
#include <stdio.h>
int main() {
    int arr[3][3] = {
        {10, 20, 30},
        {40, 50, 60},
        {70, 80, 90}
    };
    for (int i = 0; i < 3; i++) {
        for (int j = 0; j < 3; j++) {
            printf("%d ", arr[i][j]);
        }
        printf("\n");
    }
    return 0;
}
```

输出：

```text
10 20 30
40 50 60
70 80 90
```

### 动态二维数组（变长行列）

适用于行数/列数运行时才确定的场景：

```c
#include <stdio.h>
#include <stdlib.h>
int main() {
    int row = 2, col = 3;
    // 1. 分配行指针数组
    int **arr = (int **)malloc(row * sizeof(int *));
    // 2. 每行分配列空间
    for (int i = 0; i < row; i++) {
        arr[i] = (int *)malloc(col * sizeof(int));
    }

    // 赋值
    arr[0][0] = 1; arr[0][1] = 2; arr[0][2] = 3;
    arr[1][0] = 4; arr[1][1] = 5; arr[1][2] = 6;

    // 遍历
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) printf("%d ", arr[i][j]);
        puts("");
    }

    // 释放内存（必须先释放每行，再释放行指针数组）
    for (int i = 0; i < row; i++) free(arr[i]);
    free(arr);
    return 0;
}
```

### 常见例题：输入 3×3 矩阵，输出每行和

```c
#include <stdio.h>
int main() {
    int arr[3][3];
    // 输入数据
    for (int i = 0; i < 3; i++)
        for (int j = 0; j < 3; j++)
            scanf("%d", &arr[i][j]);

    // 计算每行和
    for (int i = 0; i < 3; i++) {
        int sum = 0;
        for (int j = 0; j < 3; j++) sum += arr[i][j];
        printf("第%d行总和：%d\n", i, sum);
    }
    return 0;
}
```

## 易错点总结

- 数组传参是**地址传递**，函数内修改会影响外部原数组。
- 一维数组形参 `arr[]` 和 `*arr` 完全等价，函数内 `sizeof(arr)` 得到的是指针大小。
- 多维数组除第一维外，其余维度必须显式声明。
- 普通数组形参内无法用 `sizeof` 求真实长度，必须额外传入长度参数。
- 定义静态二维数组时**列数不能省略**。
- 动态数组 `malloc` 后必须 `free`，否则内存泄漏。
- `int arr[3][3]` 在内存中是连续的一维存储，逻辑上是二维。

## 小结

- 数组作为函数参数时会退化为指针，丢失长度信息，因此必须额外传入长度参数。
- 三种形参写法（`arr[]`、`arr[N]`、`*arr`）完全等价，推荐使用 `arr[]` 兼顾可读性。
- 二维数组只有第一维可以省略，其余维度必须在声明中指定。
- 动态二维数组通过二级指针实现，释放时必须先逐行 free 再 free 行指针数组。
- 用 `const` 修饰数组形参可以防止函数内部意外修改原数组。
