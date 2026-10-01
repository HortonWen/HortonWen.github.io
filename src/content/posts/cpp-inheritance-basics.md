---
title: "C++ 继承入门：语法、对象模型与构造析构顺序"
published: 2026-02-26
description: "系统梳理 C++ 继承的三种方式及其权限变化，解析子类对象的内存大小计算规则，并通过代码演示构造与析构的调用顺序。"
tags: [继承, 对象模型, 构造函数, 析构函数, 访问权限]
category: C++
draft: false
---


继承是面向对象编程中实现代码复用的核心手段。这篇文章从三个维度帮你建立对 C++ 继承的完整认知：不同继承方式下成员权限如何变化、子类对象在内存中到底占多大空间、以及创建和销毁子类对象时构造与析构函数的执行顺序。读完之后，你就能在写继承代码时准确预判访问行为和生命周期。

## 继承的三种方式与权限变化

C++ 提供 `public`、`protected`、`private` 三种继承方式，它们决定了基类成员在派生类中的新权限。下面这张表是理解继承权限的关键：

| 基类成员原始权限 | `private` 继承后 | `protected` 继承后 | `public` 继承后 |
| :--------------- | :--------------- | :----------------- | :-------------- |
| public           | 变为 `private`   | 变为 `protected`   | 保持 `public`   |
| protected        | 变为 `private`   | 保持 `protected`   | 保持 `protected`|
| private          | 不可访问         | 不可访问           | 不可访问        |

可以看到，无论哪种继承方式，基类的 `private` 成员在派生类中都不可直接访问。这是封装性的体现——私有成员只属于定义它的类本身。

在实际开发中，`public` 继承最常用，它表达的是"is-a"关系（子类是父类的一种）。而 `private` 和 `protected` 继承更多用于实现复用而非接口继承，它们的设计意图有所不同：

| 特性             | `private` 继承             | `protected` 继承              |
| :--------------- | :------------------------- | :---------------------------- |
| 设计意图         | 实现复用，不暴露接口       | 受限的 "is-a" 关系            |
| 基类 `public` 成员 | 在派生类中变为 `private` | 在派生类中变为 `protected`    |
| 派生类的子类     | 无法访问基类成员           | 可以访问基类成员              |
| 外部对象         | 无法访问基类成员           | 无法访问基类成员              |

简单来说，`private` 继承把基类的所有可访问成员都变成了派生类的私有成员，连派生类的子类都无法继续访问；而 `protected` 继承则允许这种访问链向下延伸一层。

## 继承中的对象模型

理解了权限规则后，接下来看一个更底层的问题：子类对象在内存中到底有多大？

答案很直接：**子类对象的大小 = 父类成员大小 + 子类自身成员大小**。即使父类的某些成员是 `private` 的，它们依然占据子类对象的内存空间，只是子类无法直接访问而已。

```cpp
#include <iostream>
using namespace std;

class Base
{
public:
    int m_A;

protected:
    int m_B;

private:
    int m_C;
};

class Son : public Base
{
public:
    int m_D;
};

void test01()
{
    cout << sizeof(Son) << endl;
}

int main()
{
    test01();
    return 0;
}
```

在这个例子中，`Base` 有三个 `int` 成员（共 12 字节），`Son` 自身又有一个 `int`（4 字节），所以 `sizeof(Son)` 输出 **16**。`m_C` 虽然是 `private`，但它仍然存在于 `Son` 对象的内存布局中。

## 继承中构造与析构的顺序

当创建和销毁子类对象时，构造函数和析构函数的调用遵循严格的顺序规则。先看代码：

```cpp
#include <iostream>
using namespace std;

class Base
{
public:
    int m_A;

protected:
    int m_B;

private:
    int m_C;

public:
    Base()
    {
        cout << "Base构造" << endl;
    }

    ~Base()
    {
        cout << "Base析构" << endl;
    }
};

class Son : public Base
{
public:
    int m_D;

    Son()
    {
        cout << "Son构造" << endl;
    }

    ~Son()
    {
        cout << "Son析构" << endl;
    }
};

void test01()
{
    Son s1;
}

int main()
{
    test01();
}
```

运行这段代码，控制台输出如下：

![构造与析构顺序的运行结果](/images/cpp-ctor-dtor-order-01.png)

输出顺序清晰地展示了规则：**父类构造 → 子类构造 → 子类析构 → 父类析构**。

这个顺序背后的逻辑是：构造时必须先建好地基（父类部分），再盖上层建筑（子类部分）；析构时则反过来，先拆除上层建筑，再清理地基。这保证了在任何时刻，对象都处于一个合法的状态——子类构造时可以安全地使用父类已初始化的成员，父类析构时子类部分已经被安全清理。

## 小结

- C++ 有三种继承方式（`public`/`protected`/`private`），它们改变基类成员在派生类中的访问权限，但基类 `private` 成员始终不可直接访问。
- 子类对象大小等于父类成员大小加上子类自身成员大小，包括父类的 `private` 成员。
- 构造顺序为"父→子"，析构顺序为"子→父"，这一规则确保了对象生命周期的安全性。
