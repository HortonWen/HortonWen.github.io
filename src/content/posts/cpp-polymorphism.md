---
title: "C++ 多态详解：原理、实战案例与抽象类"
published: 2026-02-27
description: "从静态多态到动态多态，深入讲解 C++ 多态的实现条件与底层 vtable 机制，通过计算器案例演示多态的实际应用，并介绍纯虚函数与抽象类的设计价值。"
tags: [多态, 虚函数, vtable, 抽象类, 纯虚函数]
category: C++
draft: false
---


多态是面向对象编程中最核心的特性之一，它让"同一接口在不同对象上产生不同行为"成为可能。这篇文章从概念分类讲起，深入到 vtable 底层原理，再用一个完整的计算器案例展示多态的实战价值，最后介绍纯虚函数和抽象类——这套组合拳是 C++ 面向对象设计的基石。

## 多态的核心概念与分类

**多态（polymorphism）** 字面意思是"多种形态"。在 C++ 中，当调用同一个函数时，根据对象的实际类型执行不同的操作，这就是多态。生活中的例子随处可见：买票时普通人全价、学生半价、军人优先；动物叫声里猫"喵"、狗"汪汪"、鸡"咯咯"。

C++ 的多态分为两类：

### 编译时多态（静态多态）

在**编译阶段**就确定了函数调用关系。实现方式包括函数重载、运算符重载和模板编程。优点是效率高（无运行时开销），缺点是灵活性差（必须在编译时明确所有可能行为）。

### 运行时多态（动态多态）

在**程序运行阶段**才确定函数调用关系。通过**虚函数（virtual）+ 继承 + 基类指针/引用**三者配合实现。灵活性高、可扩展性强，但有轻微的运行时开销（虚函数表查找）。

我们通常说的"C++ 多态"指的就是运行时多态，下面重点展开。

## 运行时多态的实现条件

要实现运行时多态，必须同时满足三个条件：

1. **存在继承关系**：必须有基类和派生类的继承结构。
2. **虚函数的定义与重写**：基类中用 `virtual` 声明虚函数，派生类对其进行重写（函数签名必须完全相同）。
3. **通过基类指针或引用调用**：必须使用基类的指针或引用来调用虚函数。

先看一个**没有**多态的例子：

```cpp
#include <iostream>
using namespace std;

class Animal
{
public:
    void speak()
    {
        cout << "I am speaking" << endl;
    }
};

class Cat : public Animal
{
public:
    void speak()
    {
        cout << "I am cat" << endl;
    }
};

class Dog : public Animal
{
public:
    void speak()
    {
        cout << "I am dog" << endl;
    }
};

void doSpeak(Animal &animal)   // 地址早绑定
{
    animal.speak();
}

void test01()
{
    Cat cat;
    doSpeak(cat); // 父类的引用可以绑定子类
    Dog dog;
    doSpeak(dog);
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

![未使用虚函数时的输出结果](/images/cpp-polymorphism-01.png)

虽然传入的是 `Cat` 和 `Dog` 对象，但输出的都是 `"I am speaking"`。因为 `speak()` 不是虚函数，编译器在编译时就绑定了 `Animal::speak()` 的地址（静态绑定/早绑定）。

加上 `virtual` 关键字后：

```cpp
#include <iostream>
using namespace std;

class Animal
{
public:
    virtual void speak()
    {
        cout << "I am speaking" << endl;
    }
};

class Cat : public Animal
{
public:
    void speak()
    {
        cout << "I am cat" << endl;
    }
};

class Dog : public Animal
{
public:
    void speak()
    {
        cout << "I am dog" << endl;
    }
};

void doSpeak(Animal &animal)
{
    animal.speak();
}

void test01()
{
    Cat cat;
    doSpeak(cat);
    Dog dog;
    doSpeak(dog);
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

![使用虚函数后的多态输出](/images/cpp-polymorphism-02.png)

现在输出正确地变成了 `"I am cat"` 和 `"I am dog"`。仅仅加了一个 `virtual`，行为就完全不同了。这背后发生了什么？

## 底层原理：vtable 与 vfptr

C++ 通过**虚函数表（vtable）** 和**虚函数表指针（vfptr / vptr）** 实现运行时多态：

- **虚函数表**：编译器为每个包含虚函数的类创建一个函数指针数组，按声明顺序存储该类所有虚函数的地址。
- **虚指针（vfptr）**：每个对象内部有一个隐藏的指针成员，指向该对象所属类的虚函数表。vfptr 通常位于对象内存布局的最前端（偏移 0 处），在 32 位系统占 4 字节，64 位系统占 8 字节。

调用虚函数时的完整流程：

1. 通过基类指针找到对象的 vfptr
2. 通过 vfptr 找到虚函数表
3. 在虚函数表中按偏移量找到对应函数的地址
4. 调用该地址处的函数

在继承体系中，派生类的虚函数表会覆盖被重写的条目，保留未重写的条目，新增的虚函数追加到末尾。构造函数执行前编译器会初始化 vfptr，基类构造时指向基类虚表，派生类构造时覆盖为派生类虚表。

含有虚函数的类对象大小 = vfptr 大小 + 成员变量大小 + 对齐开销。可以通过以下代码验证：

```cpp
class Base {
public:
    virtual void func() {}
    int data = 1;
};

int main() {
    Base b;
    std::cout << "对象大小: " << sizeof(b) << std::endl; // 输出12（32位）或16（64位）
    return 0;
}
```

> **提示**：构造/析构函数中调用虚函数不会触发多态行为，因为此时 vfptr 尚未完全设置或已被重置。另外，不要用 `memcpy` 复制含虚函数的对象，会导致 vfptr 错误指向。

## 多态实战：计算器案例

理解了原理之后，来看多态在实际代码中如何改善设计。下面是一个不用多态的计算器：

```cpp
#include <iostream>
using namespace std;
#include <string>

class Calculator
{
public:
    int m_Num1;
    int m_Num2;

    int getResult(string oper)
    {
        if (oper == "+")
        {
            return m_Num1 + m_Num2;
        }
        else if (oper == "-")
        {
            return m_Num1 - m_Num2;
        }
        else if (oper == "*")
        {
            return m_Num1 * m_Num2;
        }
        else if (oper == "/")
        {
            return m_Num1 / m_Num2;
        }
    }
};

void test01()
{
    Calculator calc;
    cout << calc.getResult("+") << endl;
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

所有运算逻辑挤在一个 `getResult` 函数里，每增加一种运算就要修改这个函数，违反了开闭原则。用多态重构后：

```cpp
#include <iostream>
using namespace std;

class abstractCalculate
{
public:
    virtual int getResult()
    {
        return 0;
    }

    int m_Num1;
    int m_Num2;
};

class addCalculate : public abstractCalculate
{
public:
    int getResult()
    {
        return m_Num1 + m_Num2;
    }
};

class subCalculate : public abstractCalculate
{
public:
    int getResult()
    {
        return m_Num1 - m_Num2;
    }
};

class mulCalculate : public abstractCalculate
{
public:
    int getResult()
    {
        return m_Num1 * m_Num2;
    }
};

class divCalculate : public abstractCalculate
{
public:
    int getResult()
    {
        return m_Num1 / m_Num2;
    }
};

void test02()
{
    abstractCalculate* calculate = new addCalculate;
    calculate->m_Num1 = 10;
    calculate->m_Num2 = 20;

    cout << calculate->getResult() << endl;
}

int main()
{
    test02();
    system("pause");
    return 0;
}
```

每种运算独立成一个类，新增运算只需添加新类，无需修改已有代码。`abstractCalculate* calculate = new addCalculate;` 这行代码是多态的核心——基类指针指向派生类对象，调用虚函数时动态绑定到实际类型。

不过这段示例代码有两个值得注意的问题：一是 `new` 出来的对象没有 `delete`，存在内存泄漏；二是基类缺少虚析构函数，通过基类指针删除派生类对象时无法正确调用派生类析构。这两个问题在后面的虚析构文章中会详细讨论。

## 纯虚函数与抽象类

在多态体系中，有时候基类的虚函数本身没有合理的默认实现，它的存在只是为了定义接口规范。这时可以使用**纯虚函数**。

> **术语说明**：有些资料中将 pure virtual function 误写为"纯虚数"，这是笔误。C++ 中的正确术语是"**纯虚函数**"（pure virtual function），与数学中的"虚数"无关。

### 纯虚函数的语法

```cpp
virtual 返回类型 函数名(参数列表) = 0;
```

`= 0` 仅表示"纯虚"，不表示返回值。包含至少一个纯虚函数的类称为**抽象类**，抽象类不能直接实例化对象，只能作为基类被继承。

### 与普通虚函数的区别

普通虚函数有默认实现，派生类可选择重写或继承；纯虚函数没有实现，派生类**必须重写**才能实例化。纯虚函数的设计意图是定义"必须实现的接口"，而非提供默认行为。

### 完整示例

```cpp
#include <iostream>
using namespace std;

class Base
{
public:
    virtual void func() = 0;  // 纯虚函数
};

class Son : public Base
{
public:
    void func()
    {
        cout << "Son" << endl;
    }
};

class Son2 : public Base
{
public:
    void func()
    {
        cout << "Son2" << endl;
    }
};

void test01()
{
    // Base b1;       // 编译错误：抽象类不能实例化
    // new Base;      // 编译错误
}

void test02()
{
    Base* base = new Son;
    base->func();
    delete base;

    Base* base2 = new Son2;
    base2->func();
    delete base2;
}

int main()
{
    test01();
    test02();
    system("pause");
    return 0;
}
```

抽象类在设计中的核心价值在于**接口与实现分离**：定义规范而不关心具体实现，强制派生类提供必要功能，同时支持多态调用。典型应用场景包括图形系统中的 `Shape` 抽象类、文件操作中的 `File` 抽象类、设备驱动中的 `Device` 抽象类等。

需要注意的几个陷阱：忘记实现纯虚函数会导致派生类仍为抽象类；纯虚析构函数必须提供实现（否则链接失败）；不要在构造函数中调用纯虚函数。

## 小结

- C++ 多态分为编译时多态（重载、模板）和运行时多态（虚函数 + 继承 + 基类指针/引用），后者是面向对象设计的核心。
- 运行时多态的底层依赖 vtable 和 vfptr 机制，调用虚函数时需要两次间接寻址，有轻微性能开销。
- 多态的价值在于"一个接口，多种实现"，使代码符合开闭原则，易于扩展和维护。
- 纯虚函数（`= 0`）用于定义接口规范，包含纯虚函数的类是抽象类，不能直接实例化。注意"纯虚函数"才是正确术语，不要写成"纯虚数"。
