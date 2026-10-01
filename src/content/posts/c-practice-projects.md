---
title: "C 语言实战练习：反转数组与井字棋"
published: 2026-07-30
description: "通过两个由浅入深的 C 语言实战项目巩固数组、函数和二维数组知识：反转数组练习草稿的问题分析与修正，以及一个完整的控制台井字棋游戏。"
tags: [实战练习, 数组反转, 井字棋, C语言, 项目]
category: C 语言
draft: false
---


学完语法之后，最有效的巩固方式就是动手写项目。这篇文章带来两个难度递进的 C 语言实战练习：第一个是反转数组，作为函数设计和指针操作的入门训练；第二个是控制台井字棋，综合运用二维数组、函数模块化、随机数和胜负判断逻辑。两个项目都保留了原始笔记的代码，并对第一个练习中存在的问题做了客观分析和修正对照。

## 反转数组

### 原始笔记代码

下面是学习过程中的练习草稿，尝试实现一个反转数组的函数：

```c
#include <stdio.h>

void reverse_arr(int*arr, len);

int main(void)
{
	int arr[5] = {1, 2, 3, 4, 5};
	int len = sizeof(arr[]) / sizeof(arr[0]);

	return 0;

}

void reverse_arr(int*arr, len)
{
	int temp ;
	temp =
}
```

### 代码问题分析

这段代码是一个未完成的练习草稿，存在以下几处问题，逐一说明：

1. **函数声明中 `len` 缺少类型**：`void reverse_arr(int*arr, len);` 中的 `len` 没有指定数据类型，应写为 `int len`。
2. **`sizeof(arr[])` 语法不合法**：`sizeof` 的参数不能写成 `arr[]`（带空方括号），应该写 `sizeof(arr)` 来获取整个数组的字节大小。
3. **函数定义同样缺少 `len` 的类型**：`void reverse_arr(int*arr, len)` 与声明同样的问题。
4. **函数体未完成**：`temp = ` 后面没有赋值表达式，也没有交换逻辑和循环结构，函数体不完整。
5. **main 函数中没有调用 `reverse_arr`**：定义了数组和长度但没有实际使用。

这些问题在初学阶段非常正常，下面给出修正后的完整版本作为对照。

### 修正版（对照参考）

以下是补全并修正后的可运行代码，与上面的原始草稿形成对比：

```c
#include <stdio.h>

// 修正：len 加上 int 类型
void reverse_arr(int *arr, int len);

int main(void)
{
    int arr[5] = {1, 2, 3, 4, 5};
    // 修正：sizeof(arr) 而非 sizeof(arr[])
    int len = sizeof(arr) / sizeof(arr[0]);

    printf("反转前：");
    for (int i = 0; i < len; i++)
        printf("%d ", arr[i]);
    printf("\n");

    reverse_arr(arr, len);

    printf("反转后：");
    for (int i = 0; i < len; i++)
        printf("%d ", arr[i]);
    printf("\n");

    return 0;
}

// 修正：len 加上 int 类型，补全函数体
void reverse_arr(int *arr, int len)
{
    int temp;
    for (int i = 0; i < len / 2; i++) {
        temp = arr[i];
        arr[i] = arr[len - 1 - i];
        arr[len - 1 - i] = temp;
    }
}
```

运行输出：

```text
反转前：1 2 3 4 5
反转后：5 4 3 2 1
```

核心思路是用双指针对称交换：从两端向中间靠拢，每次交换一对元素，循环 `len/2` 次即可完成反转。注意数组作为参数传递的是地址，函数内的修改会直接影响原数组。

## 井字棋

接下来是一个完整的控制台井字棋游戏，综合运用了二维数组、函数模块化设计、随机数和人机对战逻辑。这个项目包含四个文件：CMakeLists.txt、game.h、game.c 和 main.c。

### CMakeLists.txt

```cmake
cmake_minimum_required(VERSION 4.3)
project(Three_player_chess)

set(CMAKE_C_STANDARD 99)

add_executable(Three_player_chess main.c
        game.h        game.c)
```

### game.h

```c
//
// Created by Wen34 on 2026/7/30.
//

#ifndef THREE_PLAYER_CHESS_GAME_H
#define THREE_PLAYER_CHESS_GAME_H
#define ROW 3  //棋盘行数
#define COL 3   //棋盘列数


void menu();
void game();
void init_board(char board[ROW][COL], int row, int col);
void display_board(char board[ROW][COL], int row, int col);
void player_move(char board[ROW][COL], int row, int col);
void computer_move(char board[ROW][COL], int row, int col);
char is_win(char board[ROW][COL], int row, int col);


#endif //THREE_PLAYER_CHESS_GAME_H
```

### game.c

```c
//
// Created by Wen34 on 2026/7/30.
//
#include "game.h"
#include <stdio.h>
#include <time.h>
#include <stdlib.h>

//菜单函数
void menu() {
    printf("******************************\n");
    printf("1. play\n");
    printf("0.exit\n");
    printf("******************************\n");

}


//初始化棋盘
void init_board(char board[ROW][COL], int row, int col) {
    for (int i = 0; i < ROW; i++) {
        for (int j = 0; j < COL; j++) {
            board[i][j] = ' ';
        }
    }
}

//显示棋盘函数
void display_board(char board[ROW][COL], int row, int col) {
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            printf(" %c ", board[i][j]);
            if (j < col - 1) printf("|");
        }
        printf("\n");

        if (i < row - 1) {
            for (int j = 0; j < col; j++) {
                printf("---");
                if (j < col - 1) printf("|");
            }
            printf("\n");
        }
    }
}


//玩家下棋函数(X)
void player_move(char board[ROW][COL], int row, int col) {
    printf("玩家下棋>\n");
    int x = 0;
    int y = 0;

    while (1) {
        printf("Please input your move:>");
        printf("x = ");
        scanf_s("%d", &x);
        printf("y = ");
        scanf_s("%d", &y);

        if (x >= 1 && x < row + 1 && y >= 1 && y < col + 1) {
            x--;
            y--;

            if (board[x][y] == ' ') {
                board[x][y] = 'X';
                display_board(board, row, col);
                break;
            }
            else if (board[x][y] != ' ') {printf("此位置已被占用\n");}
            printf("该位置无效，请重新输入\n");
        }
        else {
            printf("无效输入\n");
        }
    }
}


//电脑下棋函数(O)
void computer_move(char board[ROW][COL], int row, int col) {
    printf("电脑下棋>\n");

    int x = 0;
    int y = 0;

    while (1) {
        x = rand() % row;
        y = rand() % col;

        if (board[x][y] == ' ') {
            board[x][y] = 'O';
            display_board(board, row, col);
            break;
        }
    }
}

//判断是否赢了
//玩家赢- X
//电脑赢- O
//平局- Q
//继续- C
char is_win(char board[ROW][COL], int row, int col) {
    // 检查行
    for (int i = 0; i < row; i++) {
        if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != ' ') return board[i][0];
        // 返回获胜符号(X/O)
    }

    // 检查列
    for (int j = 0; j < col; j++) {
        if (board[0][j] == board[1][j] && board[1][j] == board[2][j] && board[0][j] != ' ') return board[0][j]; // 返回获胜符号(X/O)
    }

    // 检查对角线
    if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != ' ') {
        return board[0][0]; // 左上到右下对角线
    }
    if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != ' ') {
        return board[0][2]; // 右上到左下对角线
    }

    // 检查平局（棋盘已满）
    int is_full = 1;
    for (int i = 0; i < row; i++) {
        for (int j = 0; j < col; j++) {
            if (board[i][j] == ' ') {
                is_full = 0; // 存在空格，未平局
                break;
            }
        }
        if (!is_full) break;
    }
    if (is_full) {
        return 'Q'; // 平局
    }

    // 继续游戏
    return 'C';
}


//游戏函数
void game() {
    char board[ROW][COL] = {0};
    //初始化棋盘
    init_board(board, ROW, COL);

    while (1) {
        display_board(board, ROW, COL);
        player_move(board, ROW, COL);
        computer_move(board, ROW, COL);
        char result = is_win(board, ROW, COL);

        if (result == 'Q') {
            printf("平局\n");
            break;
        }
        else if (result == 'X') {
            printf("玩家赢\n");
            break;
        }
        else if (result == 'O') {
            printf("电脑赢\n");
            break;
        }
    }


}
```

### main.c

```c
#include <stdio.h>
#include <time.h>

#include "game.h"
#include <windows.h>
#include <stdlib.h>
#include <time.h>


int main() {
    SetConsoleOutputCP(65001);
    system("cls");

    srand(time(NULL));

    char board[ROW][COL];


    //---------------------------------------------------------
    // menu();    // init_board(board, ROW, COL);    // display_board(board, ROW, COL);    // player_move(board, ROW, COL);    //---------------------------------------------------------

    int choice = 0;
    do {
        menu();//显示菜单
        printf("请输入您的选择:>");
        //获取用户选择
        scanf_s("%d", &choice);//获取用户选择
        switch (choice) {
            case 1:
                printf("开始游戏\n");
                game();
                break;
            case 0:
                printf("退出游戏\n");
                //退出游戏
                break;
            default:
                printf("无效选择，重新显示菜单\n");
                //无效选择，重新显示菜单
        }
    }while (choice != 0 && choice != 1);

    system("pause");
    return 0;
}
```

### 项目结构分析

这个井字棋项目的模块化设计值得学习：

- **game.h** 定义了棋盘尺寸宏和所有函数声明，是模块对外暴露的接口。
- **game.c** 实现了菜单显示、棋盘初始化与绘制、玩家/电脑落子、胜负判断和游戏主循环六个功能函数，职责清晰。
- **main.c** 只负责程序入口、随机种子初始化和菜单选择循环，不包含任何游戏逻辑。

胜负判断函数 `is_win` 依次检查三行、三列、两条对角线，最后判断棋盘是否满盘，返回值用字符标记状态（X/O/Q/C），简洁直观。电脑落子采用随机策略，虽然简单但保证了游戏的可玩性。

## 小结

- 反转数组的核心思路是双指针对称交换，循环 `len/2` 次即可；练习时要注意函数参数的类型声明和 `sizeof` 的正确用法。
- 井字棋项目展示了如何将一个完整游戏拆分为头文件声明、源文件实现和主程序入口三个模块，是 C 语言多文件编程的良好范例。
- 两个项目分别锻炼了指针与数组操作、二维数组遍历、函数模块化设计和随机数应用等核心技能。
- 学习过程中写出有问题的代码是正常的，关键是能识别问题并理解正确的写法为什么那样写。
