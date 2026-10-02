---
title: "C++ 继承中的同名成员与同名静态成员处理"
published: 2026-02-23
description: "详解 C++ 继承体系中同名成员属性和同名成员函数的访问规则，以及同名静态成员的两种访问方式，配合代码与截图说明。"
tags: [继承, 同名成员, 静态成员, 作用域, 名称隐藏]
category: 编程语言
draft: false
---


当子类和父类定义了同名的成员变量或成员函数时，C++ 有一套明确的查找和访问规则。这篇文章分别讨论普通同名成员和静态同名成员的处理方式，帮你避免在实际开发中踩坑。

## 同名成员属性的处理

子类定义了与父类同名的成员变量时，通过子类对象直接访问该名字，默认访问的是**子类自己的版本**。如果想访问父类的同名成员，需要用 `Base::` 作用域限定符显式指定。

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
        m_A = 100;
    }

    ~Base()
    {
        cout << "Base析构" << endl;
    }
};

class Son : public Base
{
public:
    int m_A;

    Son()
    {
        cout << "Son构造" << endl;
        m_A = 200;
    }

    ~Son()
    {
        cout << "Son析构" << endl;
    }
};

void test01()
{
    Son s1;
    cout << s1.m_A << endl;          // 输出 200（子类版本）
    cout << s1.Base::m_A << endl;    // 输出 100（父类版本）
}

int main()
{
    test01();
}
```

![同名成员属性的访问结果](/images/cpp-same-name-member-01.png)

`s1.m_A` 得到 200，因为子类成员"遮蔽"了父类的同名成员；而 `s1.Base::m_A` 则绕过遮蔽，直接拿到父类的 100。这里不存在覆盖或替换——两个 `m_A` 在内存中各自独立存在。

## 同名成员函数的处理

同名成员函数的规则与属性类似，但有一个额外细节需要注意：**子类定义了同名函数后，父类所有同名重载版本都会被隐藏**，而不仅仅是参数列表相同的那个。

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
        m_A = 100;
    }

    void func()
    {
        cout << "Base-func调用" << endl;
    }

    void func(int)
    {
        cout << "Base-func(int)调用" << endl;
    }

    ~Base()
    {
        cout << "Base析构" << endl;
    }
};

class Son : public Base
{
public:
    int m_A;

    void func()
    {
        cout << "Son-func调用" << endl;
    }

    Son()
    {
        cout << "Son构造" << endl;
        m_A = 200;
    }

    ~Son()
    {
        cout << "Son析构" << endl;
    }
};

void test01()
{
    Son s1;
    cout << s1.m_A << endl;
    cout << s1.Base::m_A << endl;
}

void test02()
{
    Son s;
    s.func();           // 同名直接调用子类
    s.Base::func();     // 调用父类无参版本
    s.Base::func(10);   // 调用父类带参版本
}

int main()
{
    test01();
    test02();
}
```

![同名成员函数的访问结果](/images/cpp-same-name-member-02.png)

注意 `test02` 中调用 `s.Base::func(10)` 时必须加 `Base::` 前缀。如果直接写 `s.func(10)`，编译器会在子类的作用域里找 `func`，找到后发现参数不匹配就报错——它不会自动去父类找其他重载版本。这就是所谓的"名称隐藏"（name hiding）。

## 同名静态成员的处理

了解了普通同名成员的规则后，再来看静态成员。静态成员的访问方式与普通成员基本一致，但因为静态成员属于类而非对象，所以多了通过类名访问的途径。

```cpp
#include <iostream>
using namespace std;

class Base
{
public:
    static int m_A;

    static void func()
    {
        cout << "Base_static_func()调用" << endl;
    }
};

int Base::m_A = 100;

class Son : public Base
{
public:
    static int m_A;

    static void func()
    {
        cout << "Son_static_func()调用" << endl;
    }
};

int Son::m_A = 200;

void test01() // 成员属性
{
    Son s1;
    cout << s1.m_A << endl;            // 200，子类版本
    cout << s1.Base::m_A << endl;      // 100，对象方式访问父类

    cout << Base::m_A << endl;         // 100，类方式访问父类
}

void test02()
{
    Son s2;
    s2.func();              // Son_static_func()
    s2.Base::func();        // Base_static_func()
    Son::Base::func();      // Base_static_func()，通过类名链式访问
}

int main()
{
    test01();
    test02();
    return 0;
}
```

![同名静态成员的访问结果](/images/cpp-static-member-01.png)

`Son::Base::func()` 这种写法看起来有些特别，它的含义是"通过 `Son` 的作用域找到基类 `Base`，再调用其静态函数"。这在多继承场景中尤其有用，可以精确指定要调用哪个基类的版本。

## 小结

- 子类定义同名成员后，直接访问默认走子类版本；访问父类版本需用 `Base::` 作用域限定符。
- 同名函数会触发"名称隐藏"，父类的所有同名重载版本都被遮蔽，必须用 `Base::` 才能调用。
- 静态同名成员的规则与普通成员一致，额外支持通过类名直接访问（如 `Base::m_A`、`Son::Base::func()`）。
