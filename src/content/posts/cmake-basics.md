---
title: "CMake 入门笔记"
published: 2026-07-21
description: "从零掌握 CMake 核心语法：版本声明、项目定义、变量操作、条件判断、编译选项配置，附可直接运行的 C 语言 UTF-8 工程模板与中文乱码解决方案。"
tags: [CMake, C语言, CLion, MinGW, 构建系统, UTF-8]
category: 开发工具
draft: false
---


CMake 是 C/C++ 项目的事实标准构建工具，CLion、VS Code、Qt Creator 等主流 IDE 都依赖它来管理编译流程。但 CMake 的语法自成一套，初学者往往对着 `CMakeLists.txt` 无从下手。这篇笔记从最基础的语法讲起，逐步覆盖变量、条件判断、编译选项等高频用法，最后给出一份可直接使用的 C 语言工程模板和中文乱码解决方案。

## CMake 是什么

CMake 是一套**跨平台构建脚本语言**。你通过编写 `CMakeLists.txt` 文件描述项目结构，CMake 据此自动生成 Makefile、Visual Studio 工程文件或 MinGW 编译脚本。文件名固定为 `CMakeLists.txt`，大小写敏感，不能写错。

理解了这一点，就可以开始学习它的核心语法了。

## 基础必学语法

以下八个语法点覆盖了绝大多数 C 语言工程的日常需求，按使用顺序排列。

### 版本声明

每个 `CMakeLists.txt` 的第一行必须指定最低支持的 CMake 版本：

```cmake
cmake_minimum_required(VERSION 3.22)
```

CLion 搭配 MinGW 推荐 `3.22` 或 `3.26`，版本太低会缺少部分功能。

### 项目定义

用 `project()` 声明项目名称和支持的语言：

```cmake
project(demo C CXX)
```

项目名会成为生成的可执行文件的默认名称。`C` 表示纯 C 项目，加上 `CXX` 则同时支持 C++。

### 变量操作

`set()` 是 CMake 中最常用的命令之一，用于定义变量和修改编译参数。

基础赋值：

```cmake
set(EXEC_NAME mytest)        # 定义可执行程序名
set(SRC_FILES main.c func.c) # 存放所有 .c 源文件
```

追加变量（用 `${变量名}` 读取已有值）：

```cmake
# 在原有编译参数后追加 UTF-8 编译选项
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -finput-charset=UTF-8 -fexec-charset=UTF-8")
```

### 生成可执行文件

`add_executable()` 将源码编译为可执行程序：

```cmake
add_executable(mytest main.c)

# 多文件时推荐用变量统一管理
set(SRC main.c util.c io.c)
add_executable(${EXEC_NAME} ${SRC})
```

### 设置 C 语言标准

通过 `CMAKE_C_STANDARD` 指定语法版本：

```cmake
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)  # 强制使用该标准，不兼容旧编译器
```

C99 是教学和竞赛中最常用的标准。

### 全局编译参数

`add_compile_options()` 给所有源文件统一添加编译指令。以 UTF-8 编码配置为例：

MinGW / GCC 环境：

```cmake
add_compile_options(-finput-charset=UTF-8 -fexec-charset=UTF-8)
```

MSVC（Visual Studio）环境：

```cmake
if (MSVC)
    add_compile_options("/utf-8")
endif()
```

### 条件判断

`if()` 用于适配不同编译器和操作系统，是实现跨平台的关键：

```cmake
if (WIN32)
    message("当前运行在 Windows 系统")
endif()

if (MSVC)
    add_compile_options("/utf-8")
else()
    # MinGW / GCC 执行这里
    add_compile_options(-finput-charset=UTF-8 -fexec-charset=UTF-8)
endif()
```

`message()` 会将日志打印到 IDE 的 CMake 输出窗口，方便调试。

### 注释语法

CMake 只有单行注释，以 `#` 开头，没有多行注释语法：

```cmake
# 这是单行注释
# set(CMAKE_C_STANDARD 11)  注释掉的代码不会生效
```

掌握了以上语法，就可以组装出一个完整的工程模板了。

## 可直接运行的 C 语言工程模板

将以下内容复制到 `CMakeLists.txt`，在 CLion 中右键点击「重新加载 CMake 项目」即可使用：

```cmake
# 1. 最低 CMake 版本
cmake_minimum_required(VERSION 3.22)

# 2. 定义项目，支持 C 语言
project(c_demo C)

# 3. 设置 C99 标准
set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)

# 4. MinGW 全局 UTF-8 编译配置（解决中文乱码）
if (NOT MSVC)
    add_compile_options(-finput-charset=UTF-8 -fexec-charset=UTF-8)
endif()

# 5. 管理源码文件
set(SOURCE main.c)

# 6. 编译生成 exe，程序名 c_demo
add_executable(c_demo ${SOURCE})
```

这个模板已经包含了 UTF-8 编码支持，后续只需往 `SOURCE` 变量里添加新的 `.c` 文件即可。

当项目复杂度增加时，还需要用到下面这些进阶语法。

## 进阶高频语法

### 头文件目录

当项目有独立的 `include` 文件夹时，用 `include_directories()` 告诉编译器去哪里找头文件：

```cmake
include_directories(./include)
```

### 链接第三方库

调用数学库、线程库等系统库时，需要显式链接：

```cmake
# 使用 sqrt、sin 等函数必须链接数学库
target_link_libraries(c_demo m)
```

### 自动扫描源文件

手动维护源文件列表比较繁琐，`aux_source_directory()` 可以自动扫描指定目录下的所有 `.c` 文件：

```cmake
aux_source_directory(. ALL_SRC)
add_executable(demo ${ALL_SRC})
```

### 自定义输出路径

默认情况下可执行文件生成在 `cmake-build-debug` 目录中，可以改为项目根目录下的 `bin` 文件夹：

```cmake
set(CMAKE_RUNTIME_OUTPUT_DIRECTORY ${PROJECT_SOURCE_DIR}/bin)
```

## 核心符号规则速查

在实际编写 `CMakeLists.txt` 时，有几条规则需要始终牢记：

1. **`${变量名}`**：读取变量值时必须加 `${}`，直接写变量名不会被替换。

   ```cmake
   set(NAME test)
   add_executable(${NAME} main.c)  # 等价于 add_executable(test main.c)
   ```

2. **指令与括号之间不能有空格以外的字符**，但也不能连写。正确写法是 `project(demo)`，注意指令名和左括号之间不加空格也是合法的（行业习惯小写）。

3. **大小写不敏感**：`PROJECT()` 和 `project()` 完全等价，但行业习惯统一用小写。

4. **路径分隔符**：Windows 下推荐用 `/` 而非 `\`，避免转义冲突。

   ```cmake
   include_directories(./header)  # 通用写法
   ```

## CLion 中的操作流程

在 CLion 中使用 CMake 的流程很简单：

1. 修改 `CMakeLists.txt` 后，点击右上角弹窗中的**重新加载 CMake 项目**。
2. 构建缓存存放在 `cmake-build-debug` 文件夹中，遇到乱码或参数不生效时可以直接删除该文件夹重建。
3. 顶部运行配置会自动读取 `add_executable` 生成的目标，一键运行和调试。

## 中文乱码解决方案

Windows 下 C 程序输出中文经常遇到乱码，根源是源码编码与控制台编码不一致。以下是两种方案。

### 方案一：CMake 全局 UTF-8 输出（推荐）

```cmake
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -finput-charset=UTF-8 -fexec-charset=UTF-8")
```

搭配 CLion 终端设置 `CHCP=65001`，代码中就无需再写 `system("chcp 65001");`。

### 方案二：输出 GBK 适配默认控制台

```cmake
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} -finput-charset=UTF-8 -fexec-charset=GBK")
```

这种方式不需要改终端编码，但用 VS Code 打开输出文件时会显示乱码。

## 小结

- CMake 通过 `CMakeLists.txt` 描述项目结构，自动生成各平台的构建文件，是 C/C++ 项目的标准构建工具。
- 基础语法八件套：`cmake_minimum_required`、`project`、`set`、`add_executable`、`CMAKE_C_STANDARD`、`add_compile_options`、`if`、注释，掌握这些就能应对大多数 C 语言工程。
- 变量读取必须用 `${}`，路径推荐用 `/`，指令名习惯小写——这三条规则能避免大部分语法错误。
- 中文乱码优先用 CMake 全局 UTF-8 编译选项解决，比在代码里调 `system()` 更干净。
- CLion 用户修改 `CMakeLists.txt` 后记得重新加载项目，缓存异常时删除 `cmake-build-debug` 重建即可。
