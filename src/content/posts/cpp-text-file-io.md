---
title: "C++ 文本文件操作：写文件与读文件"
published: 2026-03-01
description: "系统讲解 C++ 文本文件的写入与读取操作，涵盖文件流类、打开模式、四种读取方法及 getline 的使用细节，配合完整代码示例。"
tags: [文件操作, ifstream, ofstream, fstream, 文本读写]
category: 编程语言
draft: false
---


文件操作是程序与外部数据交互的基础能力。C++ 通过标准库中的文件流类提供了类型安全的文件读写接口。这篇文章聚焦文本文件操作，从写文件和读文件两个方向分别讲解，帮你建立起完整的文本文件 I/O 知识体系。

## 核心文件流类

C++ 的文件操作依赖三个核心类，它们都定义在 `<fstream>` 头文件中：

- **`ofstream`**：输出文件流，专门用于写操作，继承自 `ostream`。
- **`ifstream`**：输入文件流，专门用于读操作，继承自 `istream`。
- **`fstream`**：文件输入输出流，可同时进行读写操作，继承自 `iostream`。

使用前必须包含头文件：

```cpp
#include <fstream>
```

## 写文件

### 基本流程

写文件的标准流程是：创建 `ofstream` 对象 → 检查是否成功打开 → 写入数据 → 关闭文件。

```cpp
#include <iostream>
using namespace std;
#include <fstream>

void test01()
{
    ofstream ofs;
    ofs.open("test.txt", ios::out);
    ofs << "Hello World!\n";
    ofs.close();
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

`ofs.open("test.txt", ios::out)` 以文本写入模式打开文件，如果文件已存在会清空原有内容并从开头写入新数据。也可以用构造函数一步完成：`ofstream ofs("test.txt");`，默认就是 `ios::out` 模式。

### 打开模式

| 模式标志         | 描述                       |
| :--------------- | :------------------------- |
| `std::ios::in`   | 读取模式                   |
| `std::ios::out`  | 写入模式（默认覆盖）       |
| `std::ios::app`  | 追加写入（不覆盖）         |
| `std::ios::ate`  | 打开后定位到文件末尾       |
| `std::ios::trunc`| 如果文件存在则清空         |
| `std::ios::binary`| 二进制模式（必须显式指定）|

每次操作前应检查文件是否成功打开：

```cpp
if (!ofs.is_open()) {
    cerr << "文件打开失败" << endl;
    return;
}
```

虽然文件流对象析构时会自动关闭文件（RAII 原则），但显式调用 `close()` 更规范，尤其是在需要复用同一个流对象打开不同文件时——必须先 `close()` 再 `open()` 新文件。

## 读文件

了解了写文件的基本流程后，来看读文件。读文件的方式比写文件丰富得多，下面介绍四种常用方法。

### 法一：按词读取（`>>` 运算符）

```cpp
#include <iostream>
using namespace std;
#include <fstream>
#include <string>

void test01()
{
    ifstream ifs;
    ifs.open("test.txt", ios::in);
    if (ifs.fail())
    {
        cout << "文件打开失败" << endl;
        return;
    }
    char buf[1024] = {0};
    while (ifs >> buf)
    {
        cout << buf << endl;
    }
    ifs.close();
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

`ifs >> buf` 按空白字符（空格、制表符、换行符）分隔读取，每次读一个"词"。它会自动跳过前导空白，读到下一个空白时停止。适合处理格式规整的简单数据文件，但如果数据本身含空格就会出错。

### 法二：成员函数 `getline`（字符数组版）

```cpp
#include <iostream>
using namespace std;
#include <fstream>
#include <string>

void test01()
{
    ifstream ifs;
    ifs.open("test.txt", ios::in);
    if (ifs.fail())
    {
        cout << "文件打开失败" << endl;
        return;
    }
    char buf[1024];
    while (ifs.getline(buf, sizeof(buf)))
    {
        cout << buf << endl;
    }
    ifs.close();
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

`ifs.getline(buf, sizeof(buf))` 逐行读取，遇到换行符或达到指定字节数时停止。换行符会被丢弃，不会存入 `buf`。需确保缓冲区足够大以容纳最长行，否则内容会被截断。

### 法三：全局函数 `getline`（string 版，推荐）

```cpp
#include <iostream>
using namespace std;
#include <fstream>
#include <string>

void test01()
{
    ifstream ifs;
    ifs.open("test.txt", ios::in);
    if (ifs.fail())
    {
        cout << "文件打开失败" << endl;
        return;
    }
    string buf;
    while (getline(ifs, buf))
    {
        cout << buf << endl;
    }
    ifs.close();
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

这是最推荐的读文件方式。`std::getline(ifs, buf)` 使用 `std::string` 自动管理内存，不用担心缓冲区溢出，也不需要预先指定大小。它是定义在 `<string>` 头文件中的全局函数，注意与成员函数版本的区分：

| 特性     | `<string>` 版本（全局函数） | `<iostream>` 版本（成员函数） |
| :------- | :-------------------------- | :---------------------------- |
| 头文件   | `#include <string>`         | `#include <iostream>`         |
| 存储方式 | `std::string`（自动扩容）   | `char[]`（固定大小）          |
| 安全性   | 高（不用担心溢出）          | 低（需手动指定大小）          |
| 调用方式 | `getline(cin, str)`         | `cin.getline(buffer, size)`   |

> **提示**：如果先用 `cin >>` 读取数据，再用 `getline` 读取一行，`getline` 可能会直接跳过。这是因为 `cin >>` 留下的换行符还在缓冲区中。解决方法是在 `getline` 前调用 `cin.ignore()` 清除缓冲区。

### 法四：逐字符读取（`get()`）

```cpp
#include <iostream>
using namespace std;
#include <fstream>
#include <string>

void test01()
{
    ifstream ifs;
    ifs.open("test.txt", ios::in);
    if (ifs.fail())
    {
        cout << "文件打开失败" << endl;
        return;
    }
    char c;
    while ((c = ifs.get()) != EOF)
    {
        cout << c;
    }
    ifs.close();
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

`ifs.get()` 每次读取一个字符，返回该字符的整数值，到达文件末尾时返回 `EOF`。适合需要精确控制每个字符处理的场景。

### 错误处理要点

无论用哪种读取方式，都要注意以下几点：

- **始终检查文件是否成功打开**：用 `is_open()` 或 `fail()` 判断。
- **不要用 `while (!ifs.eof())` 控制循环**：`eof()` 只在尝试读取失败后才置位，会导致最后一次无效数据被处理。正确做法是把读取操作本身作为循环条件（如 `while (getline(ifs, buf))`）。
- **路径处理**：Windows 下用双反斜杠 `"D:\\MyFiles\\ReadMe.txt"` 或正斜杠 `"D:/MyFiles/ReadMe.txt"`；跨平台优先使用 `/`。

## 小结

- C++ 文本文件操作基于 `ofstream`（写）、`ifstream`（读）、`fstream`（读写）三个流类，需包含 `<fstream>` 头文件。
- 写文件用 `<<` 运算符或 `write()` 方法，注意打开模式和文件状态检查。
- 读文件有四种方式：按词读取（`>>`）、成员 `getline`、全局 `getline`（推荐）、逐字符 `get()`，各有适用场景。
- 始终检查文件打开状态，避免用 `eof()` 控制循环，注意路径分隔符的跨平台差异。
