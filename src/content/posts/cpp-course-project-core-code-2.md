---
title: "C++ 课程设计核心代码解析（二）：集成文件 IO 的最终版本"
published: 2026-04-04
description: "展示 Rolex 职位申请系统最终版本的完整代码，在上一篇基础上集成了 FileIO 模块，实现程序启动自动加载、退出自动保存的数据持久化功能。"
tags: [课程设计, C++, 文件IO, 模块化, CMake]
category: C++
draft: false
---


这篇文章是核心代码解析的第二篇，展示系统的最终版本。相比上一篇的多文件版本，这一版新增了 `FileIO.h` / `FileIO.cpp` 模块，并在 `main.cpp` 中集成了自动加载和保存逻辑。下面按文件逐一列出完整代码。

## CMake 构建配置

最终版本的 CMakeLists.txt 增加了 FileIO 相关文件：

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
        struct.cpp  
        FileIO.cpp  
        FileIO.h)
```

## 主程序 main.cpp

主函数在启动时调用 `LoadData` 加载历史数据，在退出循环后调用 `SaveData` 保存当前数据。同时修复了上一版中 `if/else` 包裹 `switch` 导致 `default` 分支永远不执行的问题：

```cpp
#include <iostream>  
#include "struct.h"  
#include "Input.h"  
#include "Process.h"  
#include "Output.h"  
#include "FileIO.h"  // 确保包含了我们刚才写的头文件  
#include <iomanip>  
#include <string>  
#include <vector>  
#include <fstream>  
  
using namespace std;  
  
int main()  
{  
    vector<Tmarks> applicants;    // 定义应聘者信息结构体向量  
  
    // 1. 【新增】程序启动时：尝试加载数据  
    LoadData(applicants, "applicants_data.txt");  
  
    int Control_Choice = 1;  
  
    while (Control_Choice != 0)  
    {  
        Show_Menu();  
        cout << "请选择功能：" ;  
        cin >> Control_Choice;  
        cout << endl;  
  
        // 2. 【修改】优化逻辑判断  
        // 原代码中 if 和 else 包裹了 switch，导致 default 分支永远不会执行  
        // 这里直接让 switch 处理所有情况，包括无效输入  
        switch (Control_Choice)  
        {  
        case 1:     // 输入应聘者信息  
            Get_Appli_Inform(applicants);  
            break;  
  
        case 2:     // 显示所有应聘者信息  
            Application_Sort(applicants);   // 按总分排序  
            Show_Mark_List(applicants);    // 输出成绩总表  
            break;  
  
        case 3:     // 显示所有应聘者录取通知书  
            Show_Admission_Letter(applicants);    // 输出录取通知书  
            break;  
  
        case 4:     // 查询应聘者信息  
            Query_Applicant(applicants);    // 查询功能  
            break;  
  
        case 0:     // 退出系统  
            cout << "正在退出系统..." << endl;  
            break;  
  
        default:    // 处理无效输入  
            cout << "无效的选择，请重新输入！" << endl;  
            break;  
        }  
    }  
  
    // 3. 【新增】程序退出前：保存数据  
    SaveData(applicants, "applicants_data.txt");  
  
    system("pause");  
    return 0;  
}
```

这个版本的 `switch` 不再被外层 `if/else` 包裹，`default` 分支可以正常捕获无效输入。同时 `case 0` 只负责打印退出提示，实际的保存操作放在循环结束后统一执行，确保无论用户选择退出还是程序因其他原因结束循环，数据都能被保存。

## 结构体 struct.h / struct.cpp

与上一版完全相同，不再重复注释内容。头文件定义：

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

struct.cpp（保留了被注释的构造函数探索记录）：

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

## 排序比较器 compareByTotal.h / compareByTotal.cpp

与上一版相同：

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

## 输入模块 Input.h / Input.cpp

与上一版相同：

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
    applicants.clear();  
  
    int n;  
    cout << "请输入应聘者人数 (不超过50): ";  
    cin >> n;  
  
    while (n >= 50 || n < 0) {  
        cout << "输入错误,请重新输入!";  
        cin >> n;  
    }  
  
    cout << "\n请依次输入每位应聘者的信息：" << endl;  
    cout << "（姓名 性别 年龄 学历 任科级干部年限 现工作单位 政策法律基础 语文 英语 计算机基础 口试）" << endl;  
  
    for (int i = 0; i < n; i++) {  
        Tmarks temp;  
  
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
  
        temp.Srecord = calcSchoolScore(temp.info.schoolrecord);  
        temp.Sage = calcAgeScore(temp.info.age);  
        temp.Swlen = calcWorkScore(temp.info.worklen);  
        temp.total = calcTotalScore(temp);  
  
        applicants.push_back(temp);  
    }  
}
```

## 处理模块 Process.h / Process.cpp

与上一版相同：

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
    case 'B': return 100.0;  
    case 'M': return 75.0;  
    case 'U': return 50.0;  
    default: return 0.0;  
    }  
}  
  
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

void Application_Sort(vector<Tmarks> &applicants)  
{  
    sort(applicants.begin(), applicants.end(), compareByTotal());  
}
```

## 输出模块 Output.h / Output.cpp

与上一版相同：

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

## 文件 IO 模块 FileIO.h / FileIO.cpp

这是最终版本新增的核心模块。头文件声明了两个函数：

```cpp
//  
// Created by [姓名] on 2026/4/4.  
//  
  
#ifndef MY_CPLUEPLUS_PROGRAM_FILEIO_H  
#define MY_CPLUEPLUS_PROGRAM_FILEIO_H  
  
#pragma once  
  
#include <fstream>  
#include <sstream>  
#include <vector>  
#include <string>  
#include <iostream>  
#include "struct.h"  

void SaveData(const std::vector<Tmarks>& applicants, const std::string& filename);  
void LoadData(std::vector<Tmarks>& applicants, const std::string& filename);  
  
#endif //MY_CPLUEPLUS_PROGRAM_FILEIO_H
```

实现文件中，`SaveData` 先写入记录总数，再逐条写入所有字段；`LoadData` 先读取总数，再循环读取每条记录，并用 `if (inFile >> ...)` 做容错：

```cpp
//  
// Created by [姓名] on 2026/4/4.  
//  
#include "FileIO.h"  
#include "struct.h"  
  
void SaveData(const std::vector<Tmarks>& applicants, const std::string& filename)  
{  
    std::ofstream outFile(filename);  
  
    if (!outFile.is_open())  
    {  
        std::cerr << "❌ 无法打开文件进行写入: " << filename << std::endl;  
        return;  
    }  
  
    outFile << applicants.size() << std::endl;  

    for (const auto& applicant : applicants)  
    {  
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
  
void LoadData(std::vector<Tmarks>& applicants, const std::string& filename)  
{  
    std::ifstream inFile(filename);  
  
    if (!inFile.is_open())  
    {  
        std::cout << "ℹ️ 未找到数据文件，将创建一个新列表。" << std::endl;  
        return;  
    }  
  
    int count;  
    inFile >> count;  
  
    applicants.clear();  
    applicants.reserve(count);  
  
    Tmarks temp;  
    for (int i = 0; i < count; ++i)  
    {  
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
                    >> temp.total)  
        {  
            applicants.push_back(temp);  
        }  
  
        else  
        {  
            std::cerr << "⚠️ 读取第 " << i + 1 << " 条数据时出错，文件可能损坏。" << std::endl;  
            break;  
        }  
    }  
    inFile.close();  
    std::cout << "✅ 成功从 " << filename << " 加载了 " << applicants.size() << " 条记录。" << std::endl;  
}
```

## 小结

最终版本相比上一版的增量变化集中在两点：

1. **新增 FileIO 模块**：将文件读写逻辑封装为独立文件，符合模块化设计原则
2. **main.cpp 集成调用**：启动时 `LoadData`、退出后 `SaveData`，对用户透明

至此，系统从一个纯内存的控制台程序，演进为具备数据持久化能力的完整应用。整个迭代过程——单文件 → 多文件 → 加文件 IO——也体现了软件工程中渐进式重构的思路。
