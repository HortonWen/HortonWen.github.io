---
title: "C++ 二进制文件操作全解"
published: 2026-03-01
description: "全面讲解 C++ 二进制文件的读写操作，包括二进制模式的必要性、read/write 函数的正确用法、结构体读写、文件大小获取、分块处理及常见陷阱。"
tags: [二进制文件, read, write, ios_binary, 文件指针]
category: 编程语言
draft: false
---


二进制文件操作是 C++ 文件 I/O 中容易出错的部分。与文本文件不同，二进制模式要求程序员精确控制每一个字节的读写，任何疏忽都可能导致数据损坏。这篇文章从基本原理讲起，覆盖写入、读取、结构体处理和常见陷阱，帮你建立扎实的二进制文件操作能力。

## 二进制模式与文本模式的区别

理解二进制操作之前，必须先搞清楚两种模式的本质区别：

- **文本模式**：会自动处理换行符转换（如 Windows 下将 `\n` 转为 `\r\n`），适合人类可读的文本文件。
- **二进制模式**：直接读写原始字节，不进行任何转换，适合精确控制文件内容的场景。

在 Windows 系统上，如果用文本模式写入包含 `0x0A`（`\n`）的二进制数据，它会被自动替换为 `0x0D 0x0A`（`\r\n`），导致文件大小和内容都被篡改。**因此二进制操作必须显式指定 `std::ios::binary` 标志**。

## 二进制写文件

### 核心要点

写入二进制文件必须使用 `std::ofstream` 配合 `std::ios::binary` 模式和 `write()` 函数：

```cpp
std::ofstream ofs("data.bin", std::ios::binary);
int x = 42;
ofs.write(reinterpret_cast<const char*>(&x), sizeof(x));
ofs.close();
```

`write()` 的函数原型是 `ofs.write(const char* buffer, std::streamsize size)`，两个参数都要注意：

- `buffer` 必须是 `const char*` 类型，其他类型的指针需要用 `reinterpret_cast` 转换。
- `size` 是要写入的**字节数**，不是元素个数。比如写入 `int arr[10]` 需传 `10 * sizeof(int)`。

一个常见的错误是把变量的值当成了长度：

```cpp
ofs.write(reinterpret_cast<const char*>(&x), sizeof(x)); // 正确
ofs.write(reinterpret_cast<const char*>(&x), x);         // 错误！将值当长度
```

### 追加与定位写入

默认从文件开头写入并覆盖现有内容。如果需要追加或定位写入：

```cpp
// 追加模式
std::ofstream ofs("data.bin", std::ios::binary | std::ios::app);

// 定位写入
ofs.seekp(100, std::ios::beg); // 移动到文件开头后100字节
ofs.write(buffer, 50);
```

### 写入结构体

只有 POD 类型（纯数据类型，无虚函数、无指针成员、无非平凡构造函数）的结构体才能直接写入：

```cpp
struct Header {
    uint32_t magic;
    uint32_t version;
};

Header hdr = {0x464C457F, 1};
ofs.write(reinterpret_cast<const char*>(&hdr), sizeof(hdr));
```

建议用 `static_assert` 验证结构体大小是否符合预期：`static_assert(sizeof(Header) == 8, "结构体大小异常");`。跨平台时还需注意字节序和结构体对齐问题，可用 `#pragma pack(1)` 强制紧凑对齐。

### 大文件分块写入

```cpp
const size_t CHUNK_SIZE = 4096;
std::vector<char> chunk(CHUNK_SIZE);

for (size_t i = 0; i < totalSize; i += CHUNK_SIZE) {
    fillChunk(chunk, i);
    size_t bytesToWrite = std::min(CHUNK_SIZE, totalSize - i);
    ofs.write(chunk.data(), bytesToWrite);
    if (!ofs.good()) {
        cerr << "写入失败！位置: " << i << " 字节" << endl;
        break;
    }
}
```

每次写入后用 `ofs.good()` 检查流状态，确保数据完整写入。

## 二进制读文件

掌握了写入之后，来看读取。二进制读取的核心函数是 `read()`，用法与 `write()` 对称。

### 基本读取流程

```cpp
std::ifstream ifs("data.bin", std::ios::binary);
int x;
ifs.read(reinterpret_cast<char*>(&x), sizeof(x));
cout << x << endl;
```

`read()` 的原型是 `ifs.read(char* buffer, std::streamsize size)`，同样需要 `char*` 类型和正确的字节数。

### 获取文件大小

读取整个文件前通常需要知道文件大小：

```cpp
ifs.seekg(0, std::ios::end);              // 移到末尾
std::streamsize fileSize = ifs.tellg();   // 获取大小
ifs.seekg(0, std::ios::beg);              // 移回开头
```

然后分配缓冲区并一次性读取：

```cpp
std::vector<char> buffer(fileSize);
ifs.read(buffer.data(), fileSize);
if (ifs.gcount() != fileSize) {
    cerr << "读取不完整！实际读取: " << ifs.gcount() << " 字节" << endl;
}
```

**每次 `read()` 后必须用 `gcount()` 检查实际读取字节数**，因为实际读取量可能少于请求量。

### 读取结构体

```cpp
struct Student {
    int id;
    char name[20];
};

Student s;
std::ifstream fin("stu.bin", std::ios::binary);
fin.read(reinterpret_cast<char*>(&s), sizeof(s));
```

与写入一样，结构体必须是 POD 类型，且读写两端的大小和对齐方式必须一致。

### 大文件分块读取

```cpp
const size_t CHUNK_SIZE = 4096;
std::vector<char> chunk(CHUNK_SIZE);

while (ifs) {
    ifs.read(chunk.data(), CHUNK_SIZE);
    size_t bytesRead = ifs.gcount();
    if (bytesRead > 0) {
        // 处理当前块（前 bytesRead 个字节）
    }
    if (bytesRead == 0 && ifs.eof()) break;
}
```

不要用 `while (!ifs.eof())` 控制循环——`eof()` 只在尝试读取失败后才置位，会导致最后一次无效数据被处理。正确做法是用 `while (ifs)` 或 `while (ifs.read(...))` 作为循环条件。

## 常见陷阱

### 字符串不能直接读写

`std::string` 内部是指针管理堆内存，直接把 `string` 对象的内存写入文件毫无意义。正确做法是先写长度再写内容：

```cpp
// 写入
size_t len = str.size();
ofs.write(reinterpret_cast<const char*>(&len), sizeof(len));
ofs.write(str.c_str(), len);

// 读取
size_t len;
ifs.read(reinterpret_cast<char*>(&len), sizeof(len));
std::string str(len, '\0');
ifs.read(&str[0], len);
```

### 不能用文本操作符处理二进制

`>>` 和 `getline()` 是文本模式专用，会做格式解析和换行符转换。二进制文件必须用 `read()` 和 `write()`。

### 文件指针操作

`seekg()` 用于读指针，`seekp()` 用于写指针。常用基准位置：`ios::beg`（文件开头）、`ios::cur`（当前位置）、`ios::end`（文件末尾）。

## 小结

- 二进制操作必须加 `std::ios::binary` 标志，否则 Windows 下数据会被篡改。
- 写入用 `write()`，读取用 `read()`，不能用 `<<`/`>>`/`getline()`。
- 每次操作后检查流状态（`good()`）和实际字节数（`gcount()`）。
- 结构体读写仅限 POD 类型，需注意对齐和字节序。
- `std::string` 不能直接读写，需拆分为长度+内容两步操作。
