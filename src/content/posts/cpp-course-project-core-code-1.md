---
title: "C++ 课程设计核心代码解析（一）：结构体与本地文件读写"
published: 2026-04-04
description: "拆解 Rolex 职位申请系统的多文件版本核心代码，从 CMake 构建配置到结构体定义、输入模块、处理模块、输出模块，逐一讲解设计思路与实现细节。"
tags: [课程设计, C++, 结构体, 文件IO, CMake, 模块化]
category: C++
draft: false
---


这篇文章是课程设计的核心代码解析第一篇，聚焦于系统的多文件重构版本。相比初版的单文件实现，这个版本将代码拆分为独立的模块文件，使用 CMake 管理构建，并引入了 `vector` 替代固定大小数组。下面按文件逐一展开。

## CMake 构建配置

项目使用 CMake 作为构建系统，配置文件如下：

```cmake
cmake_minimum_required(VERSION 4.1)  
project(my_Cplueplus_Program)  
  
set(CMAKE_CXX_STANDARD 20)  
  
add_executable(my_Cplueplus_Program main.cpp  
        struct.h  
        Input.cpp  
        Input.h  
        Output.cpp  
        Output.h  
        Process.cpp  
        Process.h  
        compareByTotal.cpp  
        compareByTotal.h  
        struct.cpp)
```

这里将 C++ 标准设为 C++20，所有源文件和头文件都显式列在 `add_executable` 中。虽然 CMake 对头文件的列出不是强制要求，但显式声明可以让 IDE 正确索引这些文件。

## 主程序入口 main.cpp

主函数采用菜单驱动的循环结构，用 `vector<Tmarks>` 替代了初版的固定数组：

```cpp
#include <iostream>  
using namespace std;  
#include "struct.h"  
#include "Input.h"  
#include "Process.h"  
#include "Output.h"  
#include <iomanip>  
#include <string>  
#include <vector>  
  
int main()  
{  
    vector<Tmarks> applicants;    // 定义应聘者信息结构体向量  
    int Control_Choice = 1;  
  
    while (Control_Choice != 0)  
    {  
        Show_Menu();  
        cout << "请选择功能：" ;  
        cin >> Control_Choice;  
        cout << endl;  
  
        if (Control_Choice < 0 || Control_Choice >= 5)  
        {  
            cout << "无效的选择，请重新输入！" << endl;  
        }  
  
        else  
        {  
            switch (Control_Choice)  
            {  
                case 1:     //输入应聘者信息  
                    Get_Appli_Inform(applicants);  // 获取应聘者信息  
  
                    break;  
                case 2:     //显示所有应聘者信息  
                Application_Sort(applicants);   // 按总分排序  
                Show_Mark_List(applicants);    // 输出成绩总表  
                break;  
  
                case 3:     //显示所有应聘者录取通知书  
                    Show_Admission_Letter(applicants);    // 输出录取通知书  
                break;  
  
                case 4:     //查询应聘者信息  
                    Query_Applicant(applicants);    // 查询功能  
                break;  
  
                default:  
                    break;  
            }  
        }  
    }  
  
    system("pause");  
    return 0;  
  
}
```

使用 `vector` 的好处是不需要预先确定数组大小，`push_back` 可以动态添加元素，避免了初版中固定 50 人上限的浪费和越界风险。

## 结构体定义 struct.h / struct.cpp

头文件中定义了三个核心结构体，与初版保持一致：

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
#ifndef MY_CPLUEPLUS_PROGRAM_STRUCT_H  
#define MY_CPLUEPLUS_PROGRAM_STRUCT_H  
  
#pragma once  
#include <iostream>  
  
struct Tmark  // 成绩信息结构体  
{  
    float pol;  // 政策法律基础  
    float chn;  // 语文  
    float eng;  // 英语  
    float com;  // 计算机基础  
    float oral; // 口试  
};  
  
struct Tinform  
{  
    char name[20];           // 姓名  
    char sex;                // 性别  
    float age;               // 年龄  
    char schoolrecord;       // 学历  
    float worklen;           // 任科级干部年限  
    char wordsite[60];       // 现工作单位  
  
    Tmark mark;              // 考试成绩  
};  
  
// 定义应聘者信息和考试成绩结构体  
struct Tmarks  
{  
    Tinform info;  
  
    char name[20];           // 姓名  
    float Sage;              // 年龄分  
    float Srecord;           // 学历分  
    float Swlen;             // 工作经历分  
    Tmark mark;              // 考试成绩  
    float total;             // 总分  
  
    //Tmarks();  
};  
  
#endif //MY_CPLUEPLUS_PROGRAM_STRUCT_H
```

`struct.cpp` 中保留了被注释掉的构造函数尝试，记录了从"在结构体内完成输入"到"在外部函数中统一处理"的设计演进过程：

```cpp
//  
// Created by [姓名] on 2026/4/2.  
//  
#include "struct.h"  
#include "Input.h"  
#include "Process.h"  
#include "Output.h"  
#include <iostream>  
using namespace std;  
//  
// Tmarks::Tmarks()  
// {  
//     cout << "\n请依次输入每位应聘者的信息：" << endl;  
//     cout << "（姓名 性别 年龄 学历 任科级干部年限 现工作单位 政策法律基础 语文 英语 计算机基础 口试）" << endl;  
//     cout << "姓名: ";  
//     cin  >> name;  
//     // 输入姓名  
//     cout << "性别:(男:M    女:W) ";  
//     cin  >> info.sex;  
//     // 输入性别  
//     cout << "年龄: ";  
//     cin  >> info.age;  
//     // 输入年龄  
//     cout << "学历:(博士:B   硕士:M    本科:U    其他:O) ";  
//     cin  >> info.schoolrecord;  
//     // 输入学历  
//     cout << "任科级干部年限: ";  
//     cin  >> info.worklen;  
//     // 输入任科级干部年限  
//     cout << "现工作单位: ";  
//     cin  >> info.wordsite;  
//     // 输入现工作单位  
//     cout << "政策法律基础: ";  
//     cin  >> mark.pol;  
//     // 输入政策法律基础  
//     cout << "语文: ";  
//     cin  >> mark.chn;  
//     // 输入语文  
//     cout << "英语: ";  
//     cin  >> mark.eng;  
//     // 输入英语  
//     cout << "计算机基础: ";  
//     cin  >> mark.com;  
//     // 输入计算机基础  
//     cout << "口试: ";  
//     // 输入口试  
//     cin >> mark.oral;  
// }
```

这段注释代码说明了一个重要的设计决策：最终放弃了在构造函数中做 I/O 操作的做法，转而将输入逻辑集中到 `Input.cpp` 的独立函数中，这样更符合单一职责原则。

## 排序比较器 compareByTotal.h / compareByTotal.cpp

排序使用了仿函数（functor）模式，通过重载 `()` 运算符实现自定义比较：

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
  
#ifndef MY_CPLUEPLUS_PROGRAM_COMPAREBYTOTAL_H  
#define MY_CPLUEPLUS_PROGRAM_COMPAREBYTOTAL_H  
  
#pragma once  
#include "struct.h"  
using namespace std;  
  
class compareByTotal  
{  
public:  
    compareByTotal();  
  
    bool operator()(Tmarks &a, Tmarks &b);  
};  
  
  
#endif //MY_CPLUEPLUS_PROGRAM_COMPAREBYTOTAL_H
```

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
#include "compareByTotal.h"  
  
compareByTotal::compareByTotal(){/*构造函数*/}  
  
bool compareByTotal::operator()(Tmarks &a, Tmarks &b)      // 重载()运算符  
{  
    return a.total > b.total;  
}
```

这种写法比初版的普通函数 `compareByTotal(const Tmarks &a, const Tmarks &b)` 更灵活，也为后续扩展（比如支持多级排序）预留了空间。

## 输入模块 Input.h / Input.cpp

输入模块负责菜单显示和数据录入。`Get_Appli_Inform` 函数每次调用时先清空旧数据，防止重复叠加：

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
#ifndef MY_CPLUEPLUS_PROGRAM_INPUT_H  
#define MY_CPLUEPLUS_PROGRAM_INPUT_H  
  
#pragma once  
#include <vector>  
#include "struct.h"  
using namespace std;  
  
const int Max_Application = 50;  
  
void Show_Menu();  
//int Application_Count();  
void Get_Appli_Inform(vector<Tmarks> &applicants);  
  
#endif //MY_CPLUEPLUS_PROGRAM_INPUT_H
```

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
#include "Input.h"  
#include <iostream>  
#include "struct.h"  
#include <vector>  
#include "Process.h"  
using namespace std;  
  
void Show_Menu()  
{  
    cout << "欢迎来到"Rolex"职位申请系统！" << endl;  
    cout << "1. 输入应聘者信息" << endl;  
    cout << "2. 显示所有应聘者信息" << endl;  
    cout << "3. 显示所有应聘者录取通知书" << endl;  
    cout << "4. 查询应聘者信息" << endl;  
    cout << "0. 退出系统" << endl;  
}  
  
void Get_Appli_Inform(vector<Tmarks> &applicants) {  
    // 1. 清空旧数据（防止用户多次调用"输入信息"时数据重复叠加）  
    applicants.clear();  
  
    int n;  
    cout << "请输入应聘者人数 (不超过50): ";  
    cin >> n;  
  
    // 输入校验  
    while (n >= 50 || n < 0) {  
        cout << "输入错误,请重新输入!";  
        cin >> n;  
    }  
  
    cout << "\n请依次输入每位应聘者的信息：" << endl;  
    cout << "（姓名 性别 年龄 学历 任科级干部年限 现工作单位 政策法律基础 语文 英语 计算机基础 口试）" << endl;  
  
    // 2. 循环 n 次  
    for (int i = 0; i < n; i++) {  
        // ✅ 关键点：在循环内部定义一个临时结构体  
        // 每次循环都会创建一个新的 temp        Tmarks temp;  
  
        cout << "应聘者 " << i+1 << ": " << endl;  
  
        cout << "姓名: ";  
        cin >> temp.name;  
  
        cout << "性别:(男:M 女:W) ";  
        cin >> temp.info.sex;  
  
        cout << "年龄: ";  
        cin >> temp.info.age;  
  
        cout << "学历:(博士:B 硕士:M 本科:U 其他:O) ";  
        cin >> temp.info.schoolrecord;  
  
        cout << "任科级干部年限: ";  
        cin >> temp.info.worklen;  
  
        cout << "现工作单位: ";  
        cin >> temp.info.wordsite;  
  
        cout << "政策法律基础: ";  
        cin >> temp.mark.pol;  
  
        cout << "语文: ";  
        cin >> temp.mark.chn;  
  
        cout << "英语: ";  
        cin >> temp.mark.eng;  
  
        cout << "计算机基础: ";  
        cin >> temp.mark.com;  
  
        cout << "口试: ";  
        cin >> temp.mark.oral;  
  
        // 3. ✅ 计算各项分数  
        temp.Srecord = calcSchoolScore(temp.info.schoolrecord);  
        temp.Sage = calcAgeScore(temp.info.age);  
        temp.Swlen = calcWorkScore(temp.info.worklen);  
        temp.total = calcTotalScore(temp);  
  
        // 4. ✅ 核心操作：将填好数据的结构体"推入"vector末尾  
        applicants.push_back(temp);  
    }  
}
```

注意这里的关键设计：每次循环创建一个局部变量 `temp`，填完数据后 `push_back` 到 vector 中。这比直接操作 `applicants[i]` 更安全，因为 vector 的大小在 `push_back` 之前还没有扩展到 n。

## 处理模块 Process.h / Process.cpp

处理模块包含四个评分计算函数和一个排序函数。评分算法与初版完全一致，这里不再赘述公式，重点看排序的实现变化：

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
  
#ifndef MY_CPLUEPLUS_PROGRAM_PROCESS_H  
#define MY_CPLUEPLUS_PROGRAM_PROCESS_H  
  
#pragma once  
using namespace std;  
#include "struct.h"  
#include "Input.h"  
#include "Output.h"  
  
float calcSchoolScore(char school);  
float calcAgeScore(float age);  
float calcWorkScore(float worklen);  
float calcTotalScore(Tmarks &applicant);  
  
void Application_Sort(vector<Tmarks> &applicants);  
  
#endif //MY_CPLUEPLUS_PROGRAM_PROCESS_H
```

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
#include "Process.h"  
#include <algorithm>  
#include "compareByTotal.h"  
  
float calcSchoolScore(char school)  
{  
    switch(school)  
    {  
    case 'B': return 100.0; // 博士  
    case 'M': return 75.0;  // 硕士  
    case 'U': return 50.0;  // 本科  
    default: return 0.0;    // 其他  
    }  
}  
  
// 计算年龄分（线性插值）  
float calcAgeScore(float age) {  
    if (age < 30) age = 30;  
    if (age > 55) age = 55;  
  
    if (age <= 35) {  
        return 70.0 + (age - 30) * 2.0;  
    } else if (age <= 40) {  
        return 80.0 + (age - 35) * 4.0;  
    } else if (age <= 50) {  
        return 100.0 - (age - 40) * 2.5;  
    } else {  
        return 75.0 - (age - 50) * 1.0;  
    }  
}  
  
// 计算工作经历分  
float calcWorkScore(float worklen) {  
    if (worklen <= 0 || worklen < 1) {  
        return 0.0;  
    } else if (worklen < 2) {  
        return 70.0 + (worklen - 1) * 30.0;  
    } else if (worklen <= 6) {  
        return 100.0 - (worklen - 2) * 20.0;  
    } else {  
        return 0.0;  
    }  
}  
  
// 计算总分  
float calcTotalScore(Tmarks &applicant)  
{  
    float written_total = applicant.mark.pol +  
                          applicant.mark.chn +  
                          applicant.mark.eng +  
                          applicant.mark.com;  
    float oral_score = applicant.mark.oral * 2;  
  
    return written_total +  
           oral_score +  
           applicant.Srecord +  
           applicant.Sage +  
           applicant.Swlen;  
}  

// 按总分从高到低排序  
void Application_Sort(vector<Tmarks> &applicants)  
{  
    sort(applicants.begin(), applicants.end(), compareByTotal());  
    /*STL algorithm::sort()倒序*/  
}
```

排序从初版的 `sort(arr, arr+n, func)` 改为 `sort(vec.begin(), vec.end(), functor())`，适配了 STL 容器的迭代器接口。

## 输出模块 Output.h / Output.cpp

输出模块包含成绩总表、录取通知书和查询三个功能。注意源文件中第二个 `Output.h` 实际上是 `Output.cpp` 的内容（文件名标注有误），这里按实际内容整理：

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
#ifndef MY_CPLUEPLUS_PROGRAM_OUTPUT_H  
#define MY_CPLUEPLUS_PROGRAM_OUTPUT_H  
  
#pragma once  
  
#include "struct.h"  
#include <iostream>  
#include <vector>  
using namespace std;  
  
void Show_Mark_List(vector<Tmarks> &applicants);  
void Show_Admission_Letter(vector<Tmarks> &applicants);  
void Query_Applicant(vector<Tmarks> &applicants);  
  
#endif //MY_CPLUEPLUS_PROGRAM_OUTPUT_H
```

```cpp
//  
// Created by [姓名] on 2026/3/26.  
//  
#include "Output.h"  
#include <iomanip>  
#include <iostream>  
using namespace std;  
#include "struct.h"  
#include <vector>  
#include <cstring>  
  
void Show_Mark_List(vector<Tmarks> &applicants)  
{  
    cout << "\n成绩总表（按总分从高到低排序）：" << endl;  
    cout << left << setw(15) << "姓名" << setw(10) << "政策法律" << setw(10) << "语文"  
         << setw(10) << "英语" << setw(10) << "计算机" << setw(10) << "口试"  
         << setw(10) << "学历分" << setw(10) << "年龄分" << setw(10) << "工作分" << setw(10)  
         << "总分" << endl;  
    cout << "----------------------------------------------------------------------------------------------" << endl;  
  
    for (int i = 0; i < applicants.size(); i++)  
    {  
        cout << left << setw(15) << applicants[i].name  
                     << setw(10) << fixed << setprecision(2)  
                                   << applicants[i].mark.pol  
                     << setw(10) << applicants[i].mark.chn  
                     << setw(10) << applicants[i].mark.eng  
                     << setw(10) << applicants[i].mark.com  
                     << setw(10) << applicants[i].mark.oral  
                     << setw(10) << applicants[i].Srecord  
                     << setw(10) << applicants[i].Sage  
                     << setw(10) << applicants[i].Swlen  
                     << setw(10) << applicants[i].total  
             << endl;  
    }  
}  
  
void Show_Admission_Letter(vector<Tmarks> &applicants)  
{  
    int numToRecruit = min(5, (int)applicants.size());  
  
    cout << "\n录取通知书（前" << numToRecruit << "名）：" << endl;  
    cout << "----------------------------------------------------------------------------------------------" << endl;  
  
    for (int i = 0; i < numToRecruit; i++)  
    {  
        cout << "恭喜 " << applicants[i].name << " 被录取为副局长！" << endl;  
        cout << "录取信息：总分 " << fixed << setprecision(2) << applicants[i].total << " 分" << endl;  
        cout << "----------------------------------------------------------------------------------------------" << endl;  
    }  
}  
  
void Query_Applicant(vector<Tmarks> &applicants)  
{  
    char queryName[20];  
  
    cout << "\n请输入要查询的姓名（输入'exit'退出查询）: ";  
  
    while (cin >> queryName)  
    {  
        if (strcmp(queryName, "exit") == 0)  
        {  
            break;  
        }  
  
        bool found = false;  
  
        for (int i = 0; i < (int)applicants.size(); i++)  
        {  
            if (strcmp(applicants[i].name, queryName) == 0)  
            {  
                cout << "\n查询结果：" << endl;  
                cout << "姓名: " << applicants[i].name << endl;  
                cout << "政策法律: " << fixed << setprecision(2) << applicants[i].mark.pol << endl;  
                cout << "语文: " << applicants[i].mark.chn << endl;  
                cout << "英语: " << applicants[i].mark.eng << endl;  
                cout << "计算机: " << applicants[i].mark.com << endl;  
                cout << "口试: " << applicants[i].mark.oral << endl;  
                cout << "学历分: " << applicants[i].Srecord << endl;  
                cout << "年龄分: " << applicants[i].Sage << endl;  
                cout << "工作经历分: " << applicants[i].Swlen << endl;  
                cout << "总分: " << applicants[i].total << endl;  
  
                found = true;  
                break;  
            }  
        }  
  
        if (!found)  
        {  
            cout << "未找到姓名为 " << queryName << " 的应聘者！" << endl;  
        }  
        cout << "\n请输入要查询的姓名（输入'exit'退出查询）: ";  
    }  
  
}
```

## 本地文件读写的实现

接下来是这个版本最重要的新增功能——数据持久化。通过 `<fstream>` 实现文件的保存和加载，让程序关闭后数据不会丢失。

### SaveData：写入文件

```cpp
void SaveData(const std::vector<Tmarks>& applicants, const std::string& filename) {
    std::ofstream outFile(filename); // 创建输出文件流

    if (!outFile.is_open()) {
        std::cerr << "❌ 无法打开文件进行写入: " << filename << std::endl;
        return;
    }

    // 1. 先写入总人数，方便读取时循环
    outFile << applicants.size() << std::endl;

    // 2. 遍历 vector，逐个写入数据
    for (const auto& applicant : applicants) {
        outFile << applicant.name << " "
                << applicant.info.sex << " "
                << applicant.info.age << " "
                << applicant.info.schoolrecord << " "
                << applicant.info.worklen << " "
                << applicant.info.wordsite << " "
                << applicant.mark.pol << " "
                << applicant.mark.chn << " "
                << applicant.mark.eng << " "
                << applicant.mark.com << " "
                << applicant.mark.oral << " "
                << applicant.Srecord << " "
                << applicant.Sage << " "
                << applicant.Swlen << " "
                << applicant.total << std::endl;
    }

    outFile.close();
    std::cout << "✅ 数据已成功保存到 " << filename << std::endl;
}
```

### LoadData：读取文件

```cpp
void LoadData(std::vector<Tmarks>& applicants, const std::string& filename) {
    std::ifstream inFile(filename);

    if (!inFile.is_open()) {
        std::cout << "ℹ️ 未找到数据文件，将创建一个新列表。" << std::endl;
        return;
    }

    int count;
    inFile >> count;

    applicants.clear();
    applicants.reserve(count);

    Tmarks temp;
    for (int i = 0; i < count; ++i) {
        if (inFile >> temp.name
                    >> temp.info.sex
                    >> temp.info.age
                    >> temp.info.schoolrecord
                    >> temp.info.worklen
                    >> temp.info.wordsite
                    >> temp.mark.pol
                    >> temp.mark.chn
                    >> temp.mark.eng
                    >> temp.mark.com
                    >> temp.mark.oral
                    >> temp.Srecord
                    >> temp.Sage
                    >> temp.Swlen
                    >> temp.total) {
            
            applicants.push_back(temp);
        } else {
            std::cerr << "⚠️ 读取第 " << i + 1 << " 条数据时出错，文件可能损坏。" << std::endl;
            break;
        }
    }

    inFile.close();
    std::cout << "✅ 成功从 " << filename << " 加载了 " << applicants.size() << " 条记录。" << std::endl;
}
```

### 集成到主程序

在主函数中，启动时加载、退出前保存：

```cpp
int main() {
    std::vector<Tmarks> applicants;
    const std::string dataFile = "applicants_data.txt";

    // 程序启动时：尝试加载数据
    LoadData(applicants, dataFile);

    int choice;
    while (true) {
        // ... 显示菜单 ...
        std::cin >> choice;

        switch (choice) {
            case 0:
                // 退出前：保存数据
                SaveData(applicants, dataFile);
                std::cout << "系统已退出，再见！" << std::endl;
                return 0;
            // ... 其他 case ...
        }
    }
    return 0;
}
```

### 关键要点

1. **写入和读取的字段顺序必须完全一致**，否则数据错位
2. **`ofstream` 默认覆盖模式**，适合保存整个列表；如需追加可用 `std::ios::app`
3. **`if (inFile >> ...)` 判断**可以在文件格式异常时优雅降级，避免崩溃
4. **`applicants.reserve(count)`** 预分配内存，减少 `push_back` 时的重新分配开销

## 小结

这篇解析覆盖了多文件版本的完整代码结构。从初版到这一版的演进，核心变化有三点：

1. **从数组到 vector**：消除了固定容量限制，代码更安全
2. **从单文件到模块化**：每个功能独立成文件，职责清晰
3. **从无状态到有状态**：文件 IO 让程序具备了数据持久化能力

下一篇将继续解析加入 FileIO 模块后的最终版本代码。
