---
title: "C++ 虚析构与纯虚析构：原理、对比与实战"
published: 2026-02-28
description: "深入讲解 C++ 虚析构函数和纯虚析构函数的定义、区别与使用场景，通过三个递进式代码案例演示从内存泄漏到正确多态析构的完整过程。"
tags: [虚析构, 纯虚析构, 多态, 内存泄漏, 资源管理]
category: C++
draft: false
---


通过基类指针删除派生类对象时，如果基类的析构函数不是虚函数，派生类的析构函数就不会被调用——这意味着派生类中分配的内存、打开的文件句柄等资源全部泄漏。这篇文章系统讲解虚析构函数和纯虚析构函数的原理、区别和使用规范，并用三个递进的代码案例让你亲眼看到问题发生和问题解决的全过程。

## 虚析构函数

### 问题背景

当通过基类指针删除派生类对象时，如果基类的析构函数不是虚函数，编译器只会调用基类的析构函数，而不会调用派生类的析构函数。派生类中分配的资源（如堆内存、文件句柄等）未被释放，引发内存泄漏或资源泄漏。

### 解决方案

将基类的析构函数声明为虚函数即可：

```cpp
class Base {
public:
    virtual ~Base() {} // 虚析构函数
};

class Derived : public Base {
public:
    ~Derived() { /* 释放派生类资源 */ }
};

// 使用基类指针删除派生类对象
Base* obj = new Derived();
delete obj; // 正确调用 Derived::~Derived() 和 Base::~Base()
```

虚析构函数确保了多态销毁时的完整析构链：先调用派生类析构，再调用基类析构。

### 关键特点

- **多态销毁**：确保通过基类指针删除对象时，调用完整的析构链（派生类 → 基类）。
- **设计准则**：如果类可能被继承，且需要通过基类指针操作对象，析构函数必须为虚函数。
- **性能影响**：虚函数会引入虚表（vtable）开销，但现代编译器优化后影响极小。

## 纯虚析构函数

### 定义与作用

纯虚析构函数是将析构函数声明为纯虚函数（`virtual ~ClassName() = 0;`），其主要作用是将类定义为抽象类，同时确保派生类能正确执行析构流程。

适用场景：需要一个抽象基类，但该类没有其他需要强制子类实现的纯虚函数。纯虚析构函数既提供了抽象类的约束，又保证了多态析构的正确性。

### 必须提供实现

这是纯虚析构函数与普通纯虚函数最关键的区别：**纯虚析构函数必须在类外提供函数体**。原因是 C++ 对象的销毁机制——派生类析构时会隐式调用基类析构函数，即使声明为纯虚，编译器也需要一个具体的函数体供链接。缺失定义会导致 `undefined reference` 链接错误。

```cpp
class AbstractBase {
public:
    virtual ~AbstractBase() = 0; // 纯虚析构函数声明
};

AbstractBase::~AbstractBase() { /* 基类析构实现 */ } // 必须提供
```

### 语法要点

纯虚析构函数的写法分为两步：类内声明 + 类外定义。

```cpp
#include <iostream>
using namespace std;

// 1. 声明抽象基类
class Base {
public:
    Base() { cout << "Base 构造" << endl; }

    // 声明纯虚析构函数 (注意：这里有 = 0)
    virtual ~Base() = 0;
};

// 2. 必须在类外提供函数体实现 (注意：这里没有 = 0)
Base::~Base() {
    cout << "Base 析构 (纯虚)" << endl;
}

// 派生类
class Derived : public Base {
public:
    Derived() { cout << "Derived 构造" << endl; }

    ~Derived() override {
        cout << "Derived 析构" << endl;
    }
};

int main() {
    Base* obj = new Derived();
    delete obj; // 触发多态析构
    return 0;
}
```

输出结果：

```
Base 构造
Derived 构造
Derived 析构
Base 析构 (纯虚)
```

## 虚析构与纯虚析构的对比

| 特性         | 虚析构函数                  | 纯虚析构函数                          |
| :----------- | :-------------------------- | :------------------------------------ |
| 语法         | `virtual ~Base() {}`        | `virtual ~Base() = 0;` + 类外定义     |
| 目的         | 确保多态对象的完整析构      | 定义抽象类，强制派生类实现析构逻辑    |
| 是否可实例化基类 | 是                       | 否（抽象类）                          |
| 必须提供实现 | 否（可默认生成）            | 是（否则链接错误）                    |
| 典型使用场景 | 基类可能被继承并通过指针删除 | 基类需为抽象类且无其他纯虚函数        |

两者都会引入虚函数表开销（每个对象多一个指针大小），选择依据是设计需求而非性能。

## 实战案例：从泄漏到修复

下面通过三个递进的案例，直观展示虚析构的作用。

### 案例一：非虚析构导致内存泄漏

```cpp
#include <iostream>
using namespace std;
#include <string>

class Animal
{
public:
    virtual void speak() = 0;

    Animal()
    {
        cout << "Animal构造" << endl;
    }

    ~Animal()
    {
        cout << "Animal析构" << endl;
    }
};

class Cat : public Animal
{
public:
    string *m_Name;

    Cat(string name)
    {
        m_Name = new string(name);
        cout << "Cat构造" << endl;
    }

    ~Cat()
    {
        delete m_Name;
        m_Name = NULL;
        cout << "Cat析构" << endl;
    }

    void speak()
    {
        cout << *m_Name << " Cat could speak" << endl;
    }
};

void test01()
{
    Animal *a = new Cat("Tom");
    a->speak();
    delete a;
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

![非虚析构的运行结果：缺少Cat析构](/images/cpp-virtual-dtor-01.png)

可以看到输出中只有 `"Animal析构"`，没有 `"Cat析构"`。`Cat` 构造函数中 `new` 出来的 `string` 没有被 `delete`，内存泄漏了。

### 案例二：虚析构修复泄漏

将 `Animal` 的析构函数改为虚析构：

```cpp
#include <iostream>
using namespace std;
#include <string>

class Animal
{
public:
    virtual void speak() = 0;

    Animal()
    {
        cout << "Animal构造" << endl;
    }

    virtual ~Animal()
    {
        cout << "Animal析构" << endl;
    }
};

class Cat : public Animal
{
public:
    string *m_Name;

    Cat(string name)
    {
        m_Name = new string(name);
        cout << "Cat构造" << endl;
    }

    ~Cat()
    {
        delete m_Name;
        m_Name = NULL;
        cout << "Cat析构" << endl;
    }

    void speak()
    {
        cout << *m_Name << " Cat could speak" << endl;
    }
};

void test01()
{
    Animal *a = new Cat("Tom");
    a->speak();
    delete a;
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

![虚析构的运行结果：Cat析构被正确调用](/images/cpp-virtual-dtor-02.png)

现在输出中 `"Cat析构"` 出现在 `"Animal析构"` 之前，`m_Name` 被正确释放，内存泄漏问题解决。

### 案例三：纯虚析构也能正确调用子类析构

纯虚析构同样能保证多态析构的正确性，同时使基类成为抽象类：

```cpp
#include <iostream>
using namespace std;
#include <string>

class Animal
{
public:
    virtual void speak() = 0;

    Animal()
    {
        cout << "Animal构造" << endl;
    }

    virtual ~Animal() = 0;
};

Animal::~Animal()
{
    cout << "Animal纯虚析构" << endl;
}

class Cat : public Animal
{
public:
    string *m_Name;

    Cat(string name)
    {
        m_Name = new string(name);
        cout << "Cat构造" << endl;
    }

    ~Cat()
    {
        delete m_Name;
        m_Name = NULL;
        cout << "Cat析构" << endl;
    }

    void speak()
    {
        cout << *m_Name << " Cat could speak" << endl;
    }
};

void test01()
{
    Animal *a = new Cat("Tom");
    a->speak();
    delete a;
}

int main()
{
    test01();
    system("pause");
    return 0;
}
```

![纯虚析构的运行结果](/images/cpp-virtual-dtor-03.png)

输出中 `"Cat析构"` 和 `"Animal纯虚析构"` 都出现了，说明纯虚析构同样触发了完整的多态析构链。同时，因为析构函数是纯虚的，`Animal` 成为抽象类，无法直接实例化——这在接口设计中很有用。

## 重要注意事项

- **纯虚析构函数必须提供实现**：派生类析构时会隐式调用基类析构，缺失实现会导致链接错误。这与普通纯虚函数（无需实现）完全不同。
- **抽象类中析构函数必须为虚**：若通过基类指针删除派生类对象，非虚析构会导致只调用基类析构，派生类资源无法释放。
- **当且仅当类包含至少一个虚函数时**才声明虚析构函数。不需要多态的普通类不必加虚析构。
- **避免在构造函数中调用纯虚函数**，这会引发未定义行为。
- C++11 及以上可使用 `virtual ~Interface() = default;` 代替纯虚析构函数，除非有特殊需求。

## 小结

- 虚析构函数解决多态删除时的资源泄漏问题，确保派生类析构被正确调用。
- 纯虚析构函数在提供相同功能的同时将类标记为抽象类，但必须在类外提供实现。
- 两者的选择取决于设计需求：基类需要实例化用虚析构，基类仅作接口用纯虚析构。
- 任何可能通过基类指针删除的继承体系，都必须确保基类有虚析构函数。
