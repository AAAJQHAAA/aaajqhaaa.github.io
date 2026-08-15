---
title: Java 核心知识合集
createTime: 2025/01/01 00:00:00
permalink: /article/java-core/
---

# Java 核心知识合集

## 一、Java 基础

### 1. 集合框架

**Map（键值对）**
| 实现类 | 线程安全 | 特点 |
|--------|----------|------|
| Hashtable | 是（synchronized） | 不允许null键值 |
| HashMap | 否 | 允许null键值，数组+链表+红黑树 |
| WeakHashMap | 否 | key为弱引用，可被GC回收 |
| ConcurrentHashMap | 是 | jdk7分段锁，jdk8 CAS+synchronized |

**Collection**
- **List**（有序、可重复）
  - ArrayList：动态数组，适合随机查询
  - LinkedList：双向链表，适合插入删除，可作栈/队列/双向队列
  - Vector：同步，类似ArrayList
    - Stack：继承Vector，后进先出栈

- **Set**（无序、不可重复）
  - HashSet：基于Hash算法，允许null
  - TreeSet：可排序集合

### 2. 多线程基础

**创建线程的方式**
- 继承 `Thread` 类 → 直接 `.start()` 启动
- 实现 `Runnable` 接口 → `new Thread(runnable).start()`
- 实现 `Callable<V>` 接口 → 有返回值，通过 `call()` 方法

**线程状态（5种）**
```
新建 New → 就绪 Runnable → 运行 Running → 阻塞 Blocked → 死亡 Dead
```
- 等待阻塞：`Object.wait()`，需 `notify()` 唤醒
- 同步阻塞：争用 `synchronized` 锁
- 其他阻塞：`sleep()` / IO操作，完成后转就绪态

**核心方法对比**
| 方法 | 释放锁 | 作用 |
|------|--------|------|
| `sleep()` | 不释放 | 进入阻塞，时间到转就绪 |
| `wait()` | 释放 | 进入等待池，需notify唤醒 |
| `yield()` | 不释放 | 让出CPU，直接进入就绪态 |
| `join()` | 释放 | 底层调wait，等待目标线程执行完 |

### 3. 位运算

| 符号 | 口诀 | 含义 |
|------|------|------|
| `&` 与 | 有0则0 | 同为1才1 |
| `\|` 或 | 有1则1 | 有一个为1就1 |
| `^` 异或 | 相同为0，不同为1 | |
| `~` 取反 | 按位取反，含符号位 | |
| `<<` 左移 | 最右补0 | 等价×2 |
| `>>` 右移 | 最左补符号位 | 等价÷2 |
| `>>>` 无符号右移 | 最左直接补0 | |

### 4. 函数式编程（Lambda）

**语法：** `(参数列表) -> { 代码 }`
- 仅适用于**只有一个抽象方法**的函数式接口
- 是匿名内部类的语法糖

```java
// 线程创建简化
new Thread(() -> System.out.println("hello")).start();
```

**回调函数**：方法参数中传入 `Function` 接口类型，调用时用 lambda 实现。

---

## 二、synchronized vs Lock

### 线程状态回顾（同上）

### synchronized（关键字）
- 修饰代码块、方法、类，保证同一时刻只有一个线程执行
- **无需手动释放锁**，执行完自动释放
- 可重入锁、非公平锁

### Lock 接口（java.util.concurrent.locks）

```java
public interface Lock {
    void lock();              // 一直等直到获取锁
    void lockInterruptibly(); // 等锁时可被interrupt中断
    boolean tryLock();        // 拿不到立即返回false，不等
    boolean tryLock(long, TimeUnit); // 等超时还拿不到返回false
    void unlock();            // 手动释放锁（必须！）
    Condition newCondition();
}
```

**ReentrantLock（可重入锁）使用示例**
```java
Lock lock = new ReentrantLock();
public void insert(Thread t) {
    lock.lock();
    try {
        // 业务代码
    } finally {
        lock.unlock(); // 必须在finally里释放！
    }
}
```

### ReadWriteLock（读写锁）
```java
// 读共享、写独占
ReentrantReadWriteLock rwl = new ReentrantReadWriteLock();
rwl.readLock().lock();   // 所有线程可同时获取读锁（没写锁时）
rwl.writeLock().lock();  // 写锁独占，需等所有读/写锁释放
```

**锁规则：**
- A占read锁 → B要write锁：等待；C要read锁：直接获取
- A占write锁 → B/C要任何锁：都等待

### 锁对比总结
| 特性 | synchronized | Lock |
|------|--------------|------|
| 层面 | JVM关键字 | JDK接口 |
| 释放锁 | 自动 | 需手动unlock() |
| 可中断 | 不可 | lockInterruptibly()可 |
| 公平锁 | 非公平 | 默认非公平，可new(true)设公平 |
| 绑定条件 | 一个wait/notify | 可绑定多个Condition |

---

## 三、经典面试题

### 基础语法
1. **面向对象 vs 面向过程**
   - 面向过程：以过程为中心，模块化、流程化
   - 面向对象：以类为基础，封装、继承、多态

2. **JDK / JRE / JVM 关系**
   - JDK（开发工具包）⊃ JRE（运行环境）⊃ JVM（虚拟机执行字节码）+ Java工具（javac等）

3. **== vs equals**
   - `==`：基础类型比值，引用类型比堆内存地址
   - `equals()`：Object默认同`==`；String重写为比内容

4. **final 关键字**
   - 修饰类：不能被继承
   - 修饰方法：不能被重写
   - 修饰变量：地址不可变（引用类型属性可改）

5. **String / StringBuilder / StringBuffer**
   - String：final修饰，每次操作产生新对象
   - StringBuilder：非同步，性能好（单线程用）
   - StringBuffer：synchronized修饰，线程安全（多线程用）

6. **重载 vs 重写**
   - 重载（Overload）：同类中，方法名相同、**参数列表不同**（与返回值/修饰符无关）
   - 重写（Override）：父子类中，方法签名+返回值完全相同

7. **接口 vs 抽象类**
   | 特性 | 抽象类 | 接口 |
   |------|--------|------|
   | 实例化 | 不能 | 不能 |
   | 方法实现 | 可有普通方法 | jdk8前全抽象 |
   | 成员变量 | 任意 | 只能public static final |
   | 继承 | 单继承 | 多实现 |

8. **hashCode 和 equals**
   - hashCode()：返回哈希码int，标定对象在堆中哈希位置
   - equals()：判断对象内容是否相等，一般需重写
   - 重写equals必须重写hashCode！

### 集合
9. **List vs Set**
   - List：有序、可重复、多null
   - Set：无序、不可重复、一个null，只能Iterator遍历

10. **HashMap 工作原理**
    - 结构：数组 + 链表 + 红黑树（jdk8）
    - key二次hash值对数组长度取模 → 定位数组下标
    - 下标空：直接插入；有值：equals比较key
      - 相同：覆盖value；不同：链表追加；链表长>8：转红黑树
    - key为null存在数组0号位置

11. **ConcurrentHashMap**
    - jdk7：`ReentrantLock` + `Segment`分段锁 + 链表
    - jdk8：`CAS` + `synchronized` + `Node` + 红黑树

### JVM
12. **类加载器 & 双亲委派**
    - 引导类加载器（Bootstrap）：加载jdk/lib核心类
    - 扩展类加载器（Ext）：加载jre/lib/ext
    - 系统类加载器（App）：加载用户类路径
    - 自定义类加载器
    - **双亲委派**：加载类时逐级往上问是否已加载/是否归我管，都不行才自己加载。好处：避免重复加载，保护核心类

13. **GC 判断对象可回收**
    - **引用计数法**（java不用）：循环引用无法回收
    - **可达性分析**（java用）：从GC Roots向下搜，无引用链即可回收
    - GC Roots：虚拟机栈引用对象、方法区静态/常量引用对象、JNI引用对象

### 线程
14. **Thread vs Runnable**
    - Thread实现了Runnable
    - Runnable可共享实例变量，Thread共享类变量

15. **守护线程**
    - 为所有非守护线程服务，如GC线程
    - 设置：`thread.setDaemon(true)`（必须start前设置）

16. **ThreadLocal 原理**
    - 每个Thread对象内部有 `ThreadLocalMap`（key=ThreadLocal实例，value=数据）
    - 实现线程数据隔离

17. **并发三大特性**
    - **原子性**：操作不可中断（要么全成要么全败）
    - **可见性**：一个线程修改，其他线程立即可见（volatile）
    - **有序性**：禁止指令重排

### Spring
18. **IOC 控制反转**
    - IOC是容器Map，存放所有Bean对象
    - 控制反转：对象依赖不由自己new，由IOC容器主动注入
    - DI（依赖注入）是IOC的实现方式

19. **AOP 面向切面**
    - 将日志、事务、权限等横切逻辑封装为切面，动态织入目标方法
    - 实现：动态代理（JDK/CGLIB）

---

## 四、JVM 虚拟机

### 1. 类加载过程
```
Loading 加载 → Linking 链接（Verify验证→Prepare准备类变量默认值→Resolve解析）
→ Initialization 初始化（类变量赋值，执行<cinit>）
```
- static{}块：类加载时执行一次
- {}代码块：每个对象创建时都会执行

### 2. 运行时数据区

| 区域 | 线程私有/共享 | 作用 |
|------|---------------|------|
| 程序计数器PC | 私有 | 记录下一条字节码指令地址 |
| 虚拟机栈 | 私有 | 存栈帧（局部变量表+操作数栈+动态链接+方法返回地址），`-Xss`设大小 |
| 本地方法栈 | 私有 | 为native方法服务 |
| **堆** | **共享** | 放所有对象/数组，`-Xms`初始 `-Xmx`最大 |
| **方法区** | **共享** | 存类信息、常量、静态变量、JIT缓存；jdk7永久代→jdk8元空间（本地内存） |

**堆内存分代**
```
- 新生代（Young）：Eden + S0(from) + S1(to) ，比例默认 8:1:1
  - YGC：Eden满触发，存活对象复制到to区，年龄+1
  - 年龄达15→进入老年代；to区放不下→直接老年代
- 老年代（Old）：存大对象、长期存活对象
  - FGC：老年代满触发，慢（整堆回收）
```

**GC 类型**
- Minor GC/Young GC：新生代回收，快且频繁
- Major GC/Old GC：老年代回收
- Full GC：整堆+方法区回收，触发条件：
  - System.gc()建议、老年代不足、方法区不足

### 3. 常用调优参数
```
-Xms10m -Xmx10m        初始/最大堆（建议设相同值）
-Xmn10m                 新生代大小
-XX:NewRatio=2          老年代:新生代 = 2:1（默认）
-XX:SurvivorRatio=8     Eden:S0:S1 = 8:1:1
-XX:MaxTenuringThreshold=15  新生代最大晋升年龄
-XX:+PrintGCDetails     打印GC详情
-XX:MetaspaceSize=10m   元空间初始大小
```

### 4. 对象创建流程
```
1. 检查类是否已加载（双亲委派加载.class到元空间）
2. 分配内存：指针碰撞（内存规整）/ 空闲列表（内存不规整）
   - 并发安全：TLAB每个线程分配一小块Eden / CAS失败重试
3. 初始化零值：所有属性赋默认值
4. 设置对象头：hashCode、GC年龄、锁、类型指针
5. 执行<init>：构造器初始化
```

### 5. 逃逸分析
- 对象只在方法内使用（不逃逸）→ 可分配到栈上（方法出栈自动销毁，不用GC）
- 优化：栈上分配、同步省略、标量替换

---

## 五、设计模式

设计模式原则：SOLID
- S 单一职责、O 开闭（对扩展开放对修改关闭）
- L 里氏替换、I 接口隔离、D 依赖倒置

常用23种模式分三类：
- **创建型**：单例、工厂、抽象工厂、建造者、原型
- **结构型**：适配器、装饰器、代理、外观、桥接、组合、享元
- **行为型**：策略、模板方法、观察者、迭代子、责任链、命令、备忘录、状态、访问者、中介者、解释器

---

*参考资料：https://docs.oracle.com/en/java/index.html*
