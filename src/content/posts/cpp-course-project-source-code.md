---
title: "C++ 课程设计程序代码实录"
published: 2026-04-04
description: "完整收录 Rolex 职位申请系统的两个历史版本源代码：初版单文件实现与早期多文件重构版本，保留原始代码风貌，便于对照学习演进过程。"
tags: [课程设计, C++, 源代码, 结构体, 排序算法]
category: C++
draft: false
---


这篇文章完整收录了课程设计过程中产生的两个版本的程序代码。第一个版本是所有功能集中在单个 `main.cpp` 中的初版实现；第二个版本是早期的多文件重构尝试，使用了独立的头文件和源文件，但尚未加入文件 IO 功能。两版代码均原样保留，仅在格式上做了统一，方便对照阅读。

## 版本一：单文件完整实现

这是最早完成的版本，所有结构体定义、评分函数、输入输出和查询逻辑都写在一个文件中。使用固定大小数组存储数据，适合快速验证功能正确性。

```cpp
#include <iostream>  
#include <cstring>  
#include <algorithm>  
#include <iomanip>  
using namespace std;  
  
// 定义考试成绩结构体  
struct Tmark {  
    float pol;  // 政策法律基础  
    float chn;  // 语文  
    float eng;  // 英语  
    float com;  // 计算机基础  
    float oral; // 口试  
};  
  
// 定义应聘者个人信息结构体  
struct Tinform {  
    char name[20];           // 姓名  
    char sex;                // 性别  
    float age;               // 年龄  
    char schoolrecord;       // 学历  
    float worklen;           // 任科级干部年限  
    char wordsite[60];       // 现工作单位  
    Tmark mark;              // 考试成绩  
};  
  
// 定义应聘者信息和考试成绩结构体  
struct Tmarks {  
    Tinform info;  
    char name[20];           // 姓名  
    float Sage;              // 年龄分  
    float Srecord;           // 学历分  
    float Swlen;             // 工作经历分  
    Tmark mark;              // 考试成绩  
    float total;             // 总分  
};  
  
// 计算学历分  
float calcSchoolScore(char school) {  
    switch(school) {  
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
    if (worklen <= 0) {  
        return 0.0;  
    } else if (worklen < 1) {  
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
float calcTotalScore(Tmarks &applicant) {  
    float written_total = applicant.mark.pol + applicant.mark.chn + applicant.mark.eng + applicant.mark.com;  
    float oral_score = applicant.mark.oral * 2;  
    return written_total + oral_score + applicant.Srecord + applicant.Sage + applicant.Swlen;  
}  
  
// 按总分从高到低排序  
bool compareByTotal(const Tmarks &a, const Tmarks &b) {  
    return a.total > b.total;  
}  
  
int main() {  
    const int MAX_APPLICANTS = 50;  
    Tmarks applicants[MAX_APPLICANTS];  
    int n;  
  
    // 输入应聘者数量  
    cout << "请输入应聘者人数 (不超过50): ";  
    cin >> n;  
    if (n <= 0 || n > MAX_APPLICANTS) {  
        cout << "输入人数无效！" << endl;  
        return 1;  
    }  
  
    // 输入应聘者信息  
    cout << "\n请依次输入每位应聘者的信息（姓名 性别 年龄 学历 任科级干部年限 现工作单位 政策法律基础 语文 英语 计算机基础 口试）：" << endl;  
    for (int i = 0; i < n; i++) {  
        cout << "应聘者 #" << i+1 << ": ";  
        cin >> applicants[i].name >> applicants[i].info.sex >> applicants[i].info.age >> applicants[i].info.schoolrecord  
             >> applicants[i].info.worklen >> applicants[i].info.wordsite  
             >> applicants[i].mark.pol >> applicants[i].mark.chn  
             >> applicants[i].mark.eng >> applicants[i].mark.com  
             >> applicants[i].mark.oral;  
  
        // 计算各项分数  
        applicants[i].Srecord = calcSchoolScore(applicants[i].info.schoolrecord);  
        applicants[i].Sage = calcAgeScore(applicants[i].info.age);  
        applicants[i].Swlen = calcWorkScore(applicants[i].info.worklen);  
        applicants[i].total = calcTotalScore(applicants[i]);  
    }  
  
    // 按总分排序  
    sort(applicants, applicants + n, compareByTotal);  
  
    // 输出成绩总表  
    cout << "\n成绩总表（按总分从高到低排序）：" << endl;  
    cout << left << setw(15) << "姓名" << setw(10) << "政策法律" << setw(10) << "语文"  
         << setw(10) << "英语" << setw(10) << "计算机" << setw(10) << "口试"  
         << setw(10) << "学历分" << setw(10) << "年龄分" << setw(10) << "工作分" << setw(10) << "总分" << endl;  
    cout << "----------------------------------------------------------------------------------------------" << endl;  
  
    for (int i = 0; i < n; i++) {  
        cout << left << setw(15) << applicants[i].name  
             << setw(10) << fixed << setprecision(2) << applicants[i].mark.pol  
             << setw(10) << applicants[i].mark.chn  
             << setw(10) << applicants[i].mark.eng  
             << setw(10) << applicants[i].mark.com  
             << setw(10) << applicants[i].mark.oral  
             << setw(10) << applicants[i].Srecord  
             << setw(10) << applicants[i].Sage  
             << setw(10) << applicants[i].Swlen  
             << setw(10) << applicants[i].total << endl;  
    }  
  
    // 输出录取通知书  
    int numToRecruit = min(5, n);  
    cout << "\n录取通知书（前" << numToRecruit << "名）：" << endl;  
    cout << "----------------------------------------------------------------------------------------------" << endl;  
    for (int i = 0; i < numToRecruit; i++) {  
        cout << "恭喜 " << applicants[i].name << " 被录取为副局长！" << endl;  
        cout << "录取信息：总分 " << fixed << setprecision(2) << applicants[i].total << " 分" << endl;  
        cout << "----------------------------------------------------------------------------------------------" << endl;  
    }  
  
    // 查询功能  
    char queryName[20];  
    cout << "\n请输入要查询的姓名（输入'exit'退出查询）: ";  
    while (cin >> queryName) {  
        if (strcmp(queryName, "exit") == 0) break;  
  
        bool found = false;  
        for (int i = 0; i < n; i++) {  
            if (strcmp(applicants[i].name, queryName) == 0) {  
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
  
        if (!found) {  
            cout << "未找到姓名为 " << queryName << " 的应聘者！" << endl;  
        }  
  
        cout << "\n请输入要查询的姓名（输入'exit'退出查询）: ";  
    }  
  
    return 0;  
}
```

## 版本二：早期多文件重构

这个版本将代码拆分为多个文件，使用 CMake 构建，引入了 `vector` 和仿函数排序。注意这个版本中 `Application_Count` 函数的 `while` 条件存在逻辑反转 bug（已在测试文章中指出），这里原样保留以反映真实的开发过程。

### CMakeLists.txt

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
        compareByTotal.h)
```

### main.cpp

```cpp
#include <iostream>  
using namespace std;  
#include "struct.h"  
#include "Input.h"  
#include "Process.h"  
#include "Output.h"  
#include <cstring>  
#include <algorithm>  
#include <iomanip>  
#include <string>  
#include <vector>  
  
int main()  
{  
    int Appli_Num = Application_Count();    // 获取应聘者数量  
  
    vector<Tmarks> applicants;    // 定义应聘者信息结构体向量  
  
    Get_Appli_Inform(applicants, Appli_Num);  // 获取应聘者信息  
  
    Application_Sort(applicants);   // 按总分排序  
  
    Show_Mark_List(applicants, Appli_Num);    // 输出成绩总表  
  
    Query_Applicant(applicants, Appli_Num);    // 查询功能  
  
    return 0;  
  
}
```

### struct.h

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
};  
  
#endif //MY_CPLUEPLUS_PROGRAM_STRUCT_H
```

### compareByTotal.h

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

### Input.h

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
  
int Application_Count();  
  
void Get_Appli_Inform(vector<Tmarks> &applicants, int n);  
  
#endif //MY_CPLUEPLUS_PROGRAM_INPUT_H
```

### Input.cpp

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
  
int Application_Count()  
{  
    cout << "请输入应聘者人数 (不超过50): ";  // 提示输入应聘者数量  
  
    int n;  
  
    cin >> n;  
  
    while (n <= 50 && n > 0)  
    {  
        cout << "输入错误,请重新输入!" << endl;  // 提示输入错误  
        cin >> n;  
    }  
  
    return n;  
}  
  
void Get_Appli_Inform(vector<Tmarks> &applicants, int n)  // n == 应聘者数量  
{  
    cout << "\n请依次输入每位应聘者的信息：" << endl;  
    cout << "（姓名 性别 年龄 学历 任科级干部年限 现工作单位 政策法律基础 语文 英语 计算机基础 口试）" << endl;  
  
    for (int i = 0; i < n; i++)  
    {  
        cout << "应聘者 #" << i+1 << ": " << endl;  
  
        cout << "姓名: ";  
        cin  >> applicants[i].name;  
            // 输入姓名  
        cout << "性别:(男:M    女:W) ";  
        cin  >> applicants[i].info.sex;  
            // 输入性别  
        cout << "年龄: ";  
        cin  >> applicants[i].info.age;  
            // 输入年龄  
        cout << "学历:(博士:B   硕士:M    本科:U    其他:O) ";  
        cin  >> applicants[i].info.schoolrecord;  
            // 输入学历  
        cout << "任科级干部年限: ";  
        cin  >> applicants[i].info.worklen;  
            // 输入任科级干部年限  
        cout << "现工作单位: ";  
        cin  >> applicants[i].info.wordsite;  
            // 输入现工作单位  
        cout << "政策法律基础: ";  
        cin  >> applicants[i].mark.pol;  
            // 输入政策法律基础  
        cout << "语文: ";  
        cin  >> applicants[i].mark.chn;  
            // 输入语文  
        cout << "英语: ";  
        cin  >> applicants[i].mark.eng;  
            // 输入英语  
        cout << "计算机基础: ";  
        cin  >> applicants[i].mark.com;  
            // 输入计算机基础  
        cout << "口试: ";  
            // 输入口试  
  
        applicants[i].Srecord = calcSchoolScore(applicants[i].info.schoolrecord);  // 计算学历分  
  
        applicants[i].Sage = calcAgeScore(applicants[i].info.age);  // 计算年龄分  
  
        applicants[i].Swlen = calcWorkScore(applicants[i].info.worklen);  // 计算工作年限分  
  
        applicants[i].total = calcTotalScore(applicants[i]);  // 计算总分  
    }  
}
```

### Process.h

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

### Process.cpp

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
float calcAgeScore(float age)  
{  
    if (age < 30)  
    {  
        age = 30;  
    }  
  
    else if (age > 55)  
    {  
        age = 55;  
    }  
  
    else if (age <= 35)  
    {  
        return 70.0 + (age - 30) * 2.0;  
    }  
  
    else if (age <= 40)  
    {  
        return 80.0 + (age - 35) * 4.0;  
    }  
  
    else if (age <= 50)  
    {  
        return 100.0 - (age - 40) * 2.5;  
    }  
  
    else  
    {  
        return 75.0 - (age - 50) * 1.0;  
    }  
}  
  
// 计算工作经历分  
float calcWorkScore(float worklen)  
{  
    if (worklen <= 0)  
    {  
        return 0.0;  
    }  
  
    else if (worklen < 1)  
    {  
        return 0.0;  
    }  
  
    else if (worklen < 2)  
    {  
        return 70.0 + (worklen - 1) * 30.0;  
    }  
  
    else if (worklen <= 6)  
    {  
        return 100.0 - (worklen - 2) * 20.0;  
    }  
  
    else  
    {  
        return 0.0;  
    }  
}  
  
// 计算总分  
float calcTotalScore(Tmarks &applicant)    //考试总分  
{  
    float written_total = applicant.mark.pol +  
                          applicant.mark.chn +  
                          applicant.mark.eng +  
                          applicant.mark.com;    //4项笔试分（百分制）  
  
    float oral_score = applicant.mark.oral * 2;    //口试分*2  
  
    return written_total +  
           oral_score +  
           applicant.Srecord +  
           applicant.Sage +  
           applicant.Swlen;  
}  
  
// 按总分从高到低排序  
  
void Application_Sort(vector<Tmarks> &applicants)  
{  
    sort(applicants.begin(), applicants.end(), compareByTotal());  //STL algorithm::sort()倒序  
}
```

### Output.h

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
  
void Show_Mark_List(vector<Tmarks> &applicants, int n);  
  
void Show_Admission_Letter(vector<Tmarks> &applicants, int n);  
  
void Query_Applicant(vector<Tmarks> &applicants, int n);  
  
#endif //MY_CPLUEPLUS_PROGRAM_OUTPUT_H
```

### Output.cpp

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
  
void Show_Mark_List(vector<Tmarks> &applicants, int n)  
{  
    // 输出成绩总表  
    cout << "\n成绩总表（按总分从高到低排序）：" << endl;  
  
    cout << left << setw(15) << "姓名" << setw(10) << "政策法律" << setw(10) << "语文"  
         << setw(10) << "英语" << setw(10) << "计算机" << setw(10) << "口试"  
         << setw(10) << "学历分" << setw(10) << "年龄分" << setw(10) << "工作分" << setw(10)  
         << "总分" << endl;  
  
    cout << "----------------------------------------------------------------------------------------------" << endl;  
  
    for (int i = 0; i < n; i++)  
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
  
void Show_Admission_Letter(vector<Tmarks> &applicants, int n)  
{  
    // 输出录取通知书  
    int numToRecruit = min(5, n);  
  
    cout << "\n录取通知书（前" << numToRecruit << "名）：" << endl;  
  
    cout << "----------------------------------------------------------------------------------------------" << endl;  
  
    for (int i = 0; i < numToRecruit; i++)  
    {  
        cout << "恭喜 " << applicants[i].name << " 被录取为副局长！" << endl;  
  
        cout << "录取信息：总分 " << fixed << setprecision(2) << applicants[i].total << " 分" << endl;  
  
        cout << "----------------------------------------------------------------------------------------------" << endl;  
    }  
}  
  
void Query_Applicant(vector<Tmarks> &applicants, int n)  
{  
    // 查询功能  
    char queryName[20];  
  
    cout << "\n请输入要查询的姓名（输入'exit'退出查询）: ";  
  
    while (cin >> queryName)  
    {  
        if (strcmp(queryName, "exit") == 0)  
        {  
            break;  
        }  
  
        bool found = false;  
  
        for (int i = 0; i < n; i++)  
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

## 小结

这两个版本记录了从"能跑就行"到"工程化组织"的转变过程。版本一适合理解算法逻辑，版本二展示了模块化拆分的实际操作。建议结合本系列的其他文章（核心代码解析、测试记录）一起阅读，可以获得更完整的课程设计全貌。
