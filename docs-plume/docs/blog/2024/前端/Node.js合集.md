---
title: Node.js合集
createTime: 2024/12/13 16:25:41
permalink: /article/nodejs-complete/
---

# 一、Node 基础

- 中文官网：https://nodejs.cn/
- 英文官网：https://nodejs.org/

## 核心特性
Node.js 是**单线程**的，基于事件驱动架构，使用非阻塞 I/O 操作，通过事件循环实现异步处理，能高效处理大量并发请求。

虽然是单线程，但通过事件驱动、回调函数、Promise、async/await 等方式实现并发，高效利用计算资源。

## 事件驱动架构
- 事件驱动架构是基于「事件」和「事件处理程序」的软件设计模式
- 事件循环监听事件发生 → 触发对应处理程序
- 用于构建高性能、高并发系统（Web 服务器、消息队列等）
- Node.js 是事件驱动架构的典型例子

## Promise & async/await
- **Promise**：处理异步操作的内置对象
- **async/await**：简化异步操作的语法糖
  - `async`：声明异步函数，返回 Promise
  - `await`：等待 Promise 解决，返回结果

## 核心概念
- **非阻塞 IO / IO 密集 / 事件驱动**
- **进程**：一个运行的程序
- **线程**：进程内独立可调度的执行单元
- **Node.js 工作模型**：
  - 事件驱动主进程是单线程模型
  - I/O 由操作系统底层多线程调度
  - 单线程 ≠ 单进程

## global 全局对象
- CommonJS：`module.exports`、`exports`
- `Buffer` —— 处理二进制数据流
- `console`
- `process`
- `timer`

### 定时器优先级
```
process.nextTick(() => {})   // 当前事件队列尾
setTimeout(() => {}, 0)
setImmediate(() => {})       // 下一个事件队列首
```

## 调试

### Inspector 调试
```shell
node --inspect-brk myscript.js
# 浏览器打开 chrome://inspect
# 打断点 → 下一个断点 → 进入 → 跳过
```

### VSCode 调试
直接在编辑器打断点、启动调试。

## 路径 & 基础对象
| 方式 | 说明 |
|------|------|
| `__dirname` | 当前文件所在文件夹的绝对路径 |
| `__filename` | 当前文件的绝对路径（含文件名） |
| `process.cwd()` | node 命令启动时的工作目录 |
| `./` | 当前文件所在文件夹 |

### Buffer
- 处理二进制数据流
- 大小固定
- 内存位于 V8 堆外（C++ 内存分配）

### 其他基础模块
- **Events**：事件处理
- **fs**：文件操作

# 二、assert 断言

`node:assert` 模块提供一组验证不变量的断言函数。
- 文档：https://nodejs.cn/api/assert.html

## AssertionError（断言失败错误）
所有断言失败抛出的错误都是 `AssertionError` 实例：
```ts
class AssertionError extends Error {
  actual: unknown;           // 实际值
  expected: unknown;         // 期望值
  operator: string;          // 运算符名
  generatedMessage: boolean; // 是否自动生成消息
  code: "ERR_ASSERTION";     // 错误码
}
```

## CallTracker（调用跟踪器）【已弃用】
用于跟踪函数调用次数，考虑使用 `mock` helper 替代。
核心方法：
- `calls(fn?, exact=1)` — 包装函数，要求被调用 exact 次
- `getCalls(fn)` — 获取调用记录（含 this 和 arguments）
- `report()` — 获取实际/期望调用次数信息
- `reset(fn?)` — 重置调用计数
- `verify()` — 校验调用次数是否符合，不符合则抛错

```js
import assert from 'node:assert';
const tracker = new assert.CallTracker();
function func() {}
const callsfunc = tracker.calls(func, 2);  // 要求被调用 2 次
callsfunc();
tracker.verify();  // 抛错：只调了 1 次
```

## 常用断言函数速查

| 函数 | 说明 | 失败条件 |
|------|------|----------|
| `fail(message?)` | 直接抛出 AssertionError | — |
| `ok(value, message?)` | 验证值为真 | value 为假 |
| `equal(a, b, msg?)` | 浅相等（==） | a != b |
| `strictEqual(a, b, msg?)` | 严格相等（Object.is） | a !== b |
| `notEqual(a, b, msg?)` | 浅不等（!=） | a == b |
| `notStrictEqual(a, b, msg?)` | 严格不等 | a === b |
| `deepEqual(a, b, msg?)` | 深度相等（递归属性） | 不相等 |
| `deepStrictEqual(a, b, msg?)` | 深度严格相等 | 不相等 |
| `notDeepEqual(a, b, msg?)` | 深度不等 | 完全相等 |
| `notDeepStrictEqual(a, b, msg?)` | 深度严格不等 | 完全相等 |
| `throws(fn, error?, msg?)` | 校验 fn 抛出异常匹配 | 不匹配/不抛 |
| `doesNotThrow(fn, error?, msg?)` | 校验 fn 不抛匹配异常 | 抛了匹配异常 |
| `ifError(value)` | value 非 null/undefined 则抛错 | value 非空 |
| `rejects(promise, error?, msg?)` | Promise 被拒绝且匹配 | 不匹配 |
| `doesNotReject(promise, error?, msg?)` | Promise 不被拒绝匹配 | 被拒绝匹配 |
| `match(value, regExp, msg?)` | 字符串匹配正则 | 不匹配 |
| `doesNotMatch(value, regExp, msg?)` | 字符串不匹配正则 | 匹配 |

## 常用示例

```js
const assert = require('node:assert/strict');

// ok —— 值为真
assert.ok(true);     // OK
assert.ok(0);        // AssertionError

// strictEqual —— 严格相等
assert.strictEqual(1, 1);        // OK
assert.strictEqual(1, '1');      // AssertionError（类型不同）

// deepStrictEqual —— 深度严格相等
assert.deepStrictEqual(
  { a: { b: 1 } },
  { a: { b: 1 } }
);  // OK

// throws —— 校验异常
assert.throws(() => {
  throw new TypeError('Wrong value');
}, {
  name: 'TypeError',
  message: 'Wrong value'
});

// throws —— 用正则校验错误消息
assert.throws(
  () => { throw new Error('Wrong value'); },
  /^Error: Wrong value$/
);

// throws —— 自定义校验函数
assert.throws(
  () => { throw new Error('Wrong value'); },
  (err) => {
    assert(err instanceof Error);
    assert(/value/.test(err.message));
    return true;
  },
  'unexpected error'
);

// ifError —— 不为空就抛
assert.ifError(null);   // OK
assert.ifError(0);      // AssertionError

// rejects —— Promise 拒绝校验
await assert.rejects(
  async () => { throw new TypeError('Wrong value'); },
  { name: 'TypeError', message: 'Wrong value' }
);

// match —— 正则匹配
assert.match('I will pass', /pass/);   // OK
assert.match('I will fail', /pass/);   // AssertionError
```

# 三、os 模块

`node:os` 模块提供操作系统相关的实用方法和属性。

## 常用 API 速查

| 方法/属性 | 返回值 | 说明 |
|-----------|--------|------|
| `arch()` | string | CPU 架构：arm/arm64/ia32/x64 等 |
| `platform()` | string | 操作系统平台：win32/darwin/linux 等 |
| `type()` | string | 操作系统名称：Windows_NT/Darwin/Linux |
| `release()` | string | 操作系统版本 |
| `version()` | string | 内核版本字符串 |
| `machine()` | string | 机器类型：x86_64/arm64 等 |
| `hostname()` | string | 主机名 |
| `homedir()` | string | 当前用户主目录 |
| `tmpdir()` | string | 系统临时文件目录 |
| `uptime()` | number | 系统运行秒数 |
| `loadavg()` | number[] | 1/5/15 分钟平均负载（Win 总是 [0,0,0]） |
| `freemem()` | number | 可用内存（字节） |
| `totalmem()` | number | 总内存（字节） |
| `cpus()` | CpuInfo[] | 每个逻辑 CPU 内核信息数组 |
| `availableParallelism()` | number | 默认并行度估计（总大于 0） |
| `networkInterfaces()` | object | 已分配网络地址的网络接口对象 |
| `userInfo(options?)` | object | 当前有效用户信息（username/uid/gid/shell/homedir） |
| `getPriority(pid=0)` | number | 指定进程调度优先级 |
| `setPriority(pid?, priority)` | void | 设置进程调度优先级（-20 高 ~ 19 低） |
| `endianness()` | "BE" \| "LE" | CPU 字节序（大端/小端） |
| `EOL` | string | 系统行尾：Win `\r\n`、POSIX `\n` |
| `devNull` | string | 空设备路径：Win `\\.\nul`、POSIX `/dev/null` |

### cpus() 返回结构
```ts
interface CpuInfo {
  model: string;          // CPU 型号
  speed: number;          // 频率（MHz）
  times: {
    user: number;         // 用户模式毫秒数
    nice: number;         // 良好模式毫秒数（Win 恒 0）
    sys: number;          // 系统模式毫秒数
    idle: number;         // 空闲模式毫秒数
    irq: number;          // 中断请求模式毫秒数
  };
}
```

## 使用示例
```js
const os = require('node:os');

console.log(os.hostname());           // 主机名
console.log(os.platform());           // 平台：win32 / darwin / linux
console.log(os.arch());               // CPU 架构
console.log(os.cpus().length);        // CPU 核数
console.log(os.totalmem() / 1024**3); // 总内存（GB）
console.log(os.freemem() / 1024**3);  // 空闲内存（GB）
console.log(os.networkInterfaces());  // 所有网卡信息
console.log(os.userInfo());           // 当前用户信息
console.log(os.EOL);                  // 系统换行符
```

# 四、path 模块

`node:path` 模块提供处理文件和目录路径的实用工具。

## 核心对象结构

### ParsedPath（路径解析结果）
```ts
interface ParsedPath {
  root: string;   // 根，如 '/' or 'c:\'
  dir: string;    // 完整目录，如 '/home/user/dir'
  base: string;   // 文件名含扩展名，如 'index.html'
  ext: string;    // 扩展名，如 '.html'
  name: string;   // 文件名不含扩展名，如 'index'
}
```

## 常用 API 速查

| 方法 | 说明 |
|------|------|
| `normalize(path)` | 规范化路径，解析 `..` 和 `.`，合并多余斜杠 |
| `join(...paths)` | 拼接多个路径片段并规范化 |
| `resolve(...paths)` | 解析为绝对路径（从右向左，直到找到绝对路径，否则用 cwd） |
| `isAbsolute(path)` | 判断是否为绝对路径 |
| `relative(from, to)` | 返回从 from 到 to 的相对路径 |
| `dirname(path)` | 返回路径的目录名（父目录） |
| `basename(path, suffix?)` | 返回路径最后一部分，可指定去除的后缀 |
| `extname(path)` | 返回扩展名（含点），无扩展名返回空串 |
| `parse(path)` | 路径字符串 → ParsedPath 对象 |
| `format(pathObj)` | ParsedPath/FormatInputPathObject → 路径字符串 |
| `sep` | 属性：平台文件分隔符 `\` 或 `/` |
| `delimiter` | 属性：平台路径定界符 `;` 或 `:`（PATH 环境变量用） |
| `toNamespacedPath(path)` | Windows 专用：返回等效命名空间前缀路径；POSIX 原样返回 |
| `posix` | 属性：POSIX 特定实现（强制用 `/`） |
| `win32` | 属性：Windows 特定实现（强制用 `\`） |

## 使用示例
```js
const path = require('node:path');

// basename —— 取最后一部分
path.basename('/foo/bar/quux.html');           // 'quux.html'
path.basename('/foo/bar/quux.html', '.html');  // 'quux'

// dirname —— 父目录
path.dirname('/foo/bar/baz/asdf/quux');        // '/foo/bar/baz/asdf'

// extname —— 扩展名
path.extname('index.html');     // '.html'
path.extname('index.coffee.md');// '.md'
path.extname('.index');         // ''（点开头且无其他点）
path.extname('.index.md');      // '.md'

// join —— 拼接
path.join('/foo', 'bar', 'baz/asdf', 'quux', '..');  // '/foo/bar/baz/asdf'

// resolve —— 解析绝对路径
path.resolve('/foo/bar', './baz');       // '/foo/bar/baz'
path.resolve('/foo/bar', '/tmp/file/');  // '/tmp/file'
path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif');
// → cwd + /wwwroot/static_files/gif/image.gif

// relative —— 计算相对路径
path.relative('/data/test/aaa', '/data/impl/bbb');  // '../../impl/bbb'

// parse ↔ format —— 对象转换
path.parse('/home/user/dir/file.txt');
// → { root: '/', dir: '/home/user/dir', base: 'file.txt',
//     ext: '.txt', name: 'file' }

path.format({
  dir: '/home/user/dir',
  base: 'file.txt',
});  // '/home/user/dir/file.txt'

// 环境变量分割
process.env.PATH.split(path.delimiter);  // 用定界符拆分 PATH
```

# 五、process 进程

`node:process` 提供当前 Node.js 进程的信息和控制能力。

## 重要属性速查

| 属性 | 类型 | 说明 |
|------|------|------|
| `argv` | string[] | 命令行参数数组：[0]node路径，[1]脚本路径，[2+]其他参数 |
| `argv0` | string | argv[0] 的原始只读值 |
| `execArgv` | string[] | Node.js 专属命令行选项（脚本前的参数） |
| `execPath` | string | Node.js 可执行文件绝对路径 |
| `env` | object | 用户环境变量（可读写，区分大小写视平台） |
| `pid` | number | 当前进程 PID |
| `ppid` | number | 父进程 PID |
| `title` | string | 进程标题（ps 显示值） |
| `arch` | string | CPU 架构：arm/arm64/x64 等 |
| `platform` | string | 操作系统平台：win32/darwin/linux 等 |
| `version` | string | Node.js 版本字符串（含 v 前缀） |
| `versions` | object | Node.js 及所有依赖的版本号（含 node/v8/uv/openssl 等） |
| `config` | object | 编译 Node.js 的配置选项（冻结对象） |
| `release` | object | 当前版本元数据（含源码 tarball URL） |
| `cwd()` | string | 当前工作目录 |
| `exitCode` | number | 正常退出时的退出代码（可预先设置） |
| `debugPort` | number | 调试器使用的端口 |

## I/O 流
| 流 | fd | 说明 |
|----|----|------|
| `process.stdin` | 0 | 标准输入（ReadStream） |
| `process.stdout` | 1 | 标准输出（WriteStream） |
| `process.stderr` | 2 | 标准错误（WriteStream） |

## 核心方法

### 进程控制
| 方法 | 说明 |
|------|------|
| `cwd()` | 返回当前工作目录 |
| `chdir(directory)` | 切换当前工作目录（失败抛错） |
| `exit(code=0)` | **立即同步终止进程**（即使有未完成异步操作） |
| `abort()` | 立即退出并生成核心转储文件（Worker 不可用） |
| `kill(pid, signal='SIGTERM')` | 向指定 pid 发送信号（信号 0 可测试进程是否存在） |
| `uptime()` | 进程运行秒数（含小数部分） |

> **最佳实践**：尽量不直接调用 `process.exit()`，改为设置 `process.exitCode` 并让事件循环自然清空。若因错误需终止，抛出未捕获错误比强制退出更安全。

### 资源使用
| 方法 | 说明 |
|------|------|
| `memoryUsage()` | 返回内存使用对象：rss/heapTotal/heapUsed/external/arrayBuffers |
| `memoryUsage.rss()` | 仅返回常驻集大小 RSS（字节） |
| `cpuUsage(prev?)` | 用户/系统 CPU 时间（微秒），可传上次值求差值 |
| `resourceUsage()` | 资源使用详情（fsRead/fsWrite/pageFault/majorPageFault 等） |
| `constrainedMemory()` | 进程可用受限内存量（字节，若无则 undefined） |

### 优先级 & ID（POSIX 专用）
| 方法 | 说明 |
|------|------|
| `getuid() / setuid(id)` | 真实用户 ID |
| `geteuid() / seteuid(id)` | 有效用户 ID |
| `getgid() / setgid(id)` | 真实组 ID |
| `getegid() / setegid(id)` | 有效组 ID |
| `getgroups() / setgroups(groups)` | 补充组 ID（setgroups 需要特权） |
| `getPriority(pid=0) / setPriority(pid?, priority)` | 调度优先级（-20 高 ~ 19 低，Win 设最高需提权） |

### 其他方法
| 方法 | 说明 |
|------|------|
| `nextTick(callback, ...args)` | 加入「下一个滴答队列」——当前栈清空后、事件循环继续前执行（可能造成无限递归） |
| `emitWarning(warning, options?)` | 自定义/应用特定进程警告，触发 `warning` 事件 |
| `hrtime(time?)` / `hrtime.bigint()` | 高精度计时：返回 [秒,纳秒] 元组或 bigint |
| `setSourceMapsEnabled(v)` | 启用/禁用 Source Map v3 对堆栈跟踪支持 |
| `hasUncaughtExceptionCaptureCallback()` | 是否设置了未捕获异常捕获回调 |
| `setUncaughtExceptionCaptureCallback(cb\|null)` | 设置/取消未捕获异常捕获函数（设置后不发 uncaughtException 事件） |
| `umask(mask?)` | 文件模式创建掩码【**已弃用**：存在线程竞争风险】 |

### IPC 通信（子进程 / Worker）
| 属性/方法 | 说明 |
|-----------|------|
| `channel` | IPC 通道引用（含 ref/unref 方法），不存在则 undefined |
| `connected` | IPC 是否连接中 |
| `send(message, sendHandle?, options?, callback?)` | 向父进程发消息（通过 IPC 创建才存在） |
| `disconnect()` | 关闭 IPC 通道，子进程可优雅退出 |

## 进程事件

| 事件 | 触发时机 | 回调参数 |
|------|----------|----------|
| `beforeExit` | 事件循环清空、即将退出前（可继续调度工作延迟退出） | code: number |
| `exit` | 进程退出时（**不能再调度异步**）。触发条件：`process.exit()` 或事件循环无更多工作 | code: number |
| `uncaughtException` | 有未捕获异常（若不处理会退出进程） | error, origin: "uncaughtException" \| "unhandledRejection" |
| `uncaughtExceptionMonitor` | uncaughtException 之前触发（仅监控，不能阻止退出） | error, origin |
| `unhandledRejection` | Promise 被拒绝但未被 catch | reason, promise |
| `rejectionHandled` | 之前未处理的 Promise 被后来 catch 了 | promise |
| `warning` | 检测到不良实践触发警告（--no-warnings 可抑制默认输出） | warning: Error |
| `message` | 通过 IPC 通道收到父进程消息 | message, sendHandle |
| `disconnect` | IPC 通道关闭 | — |
| `SIGINT` `SIGTERM` `SIGHUP`... | 收到对应系统信号（Worker 不可用） | signal: Signals |
| `worker` | 创建新 Worker 线程后触发 | worker: Worker |

### 事件示例
```js
const process = require('node:process');

// 退出事件
process.on('beforeExit', (code) => {
  console.log('beforeExit code:', code);
});
process.on('exit', (code) => {
  console.log('exit code:', code);
});

// 异常监控（定期扫 unhandledRejections 记录日志）
const unhandledRejections = new Map();
process.on('unhandledRejection', (reason, promise) => {
  unhandledRejections.set(promise, reason);
});
process.on('rejectionHandled', (promise) => {
  unhandledRejections.delete(promise);
});

// 信号处理（Ctrl+C）
process.stdin.resume();  // 让进程不自动退出
process.on('SIGINT', () => {
  console.log('收到 SIGINT (Ctrl+C)');
});

// 手动触发警告 → 触发 warning 事件
process.emitWarning('触发警告!', {
  code: 'MY_WARNING',
  detail: '这是详情',
});

// nextTick 执行顺序：当前栈清空就跑，比 setTimeout 早
console.log('start');
process.nextTick(() => console.log('nextTick'));
setTimeout(() => console.log('setTimeout 0'), 0);
console.log('scheduled');
// 输出顺序：start → scheduled → nextTick → setTimeout 0
```
