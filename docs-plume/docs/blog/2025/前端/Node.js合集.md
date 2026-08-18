---
title: Node.js 合集（核心模块 + Express + MongoDB + 进阶模块）
createTime: 2025/01/01 00:00:00
permalink: /article/nodejs/
---

# Node.js 合集（核心模块 + Express + 进阶模块）

> 官方文档：https://nodejs.cn/api/
> REPL：终端输入 `node` 启动交互式解释器

---

## 一、核心模块

### 1. Buffer（二进制数据缓冲区）
```js
// 创建
const buf1 = Buffer.alloc(10)              // 10字节，填0
const buf2 = Buffer.allocUnsafe(10)        // 10字节，不初始化（可能含敏感数据）
const buf3 = Buffer.from('hello')           // 字符串转Buffer
const buf4 = Buffer.from([104, 105])        // 数组转Buffer

// 读写
buf3.write('world')                          // 写入
console.log(buf3.toString())                 // 读取转字符串
console.log(buf3[0].toString(2))             // 二进制字符串
buf3[0] = 95                                 // 修改单个字节

// 常用
Buffer.concat([buf1, buf2])                  // 合并
console.log(buf3.length)                      // 长度（字节数）
// 中文占3个字节
```

### 2. fs 文件系统模块
```js
const fs = require('fs')

// ===== 写文件 =====
fs.writeFile('./xxx.txt', '内容', err => { /* 异步写入，没有则创建 */ })
fs.writeFileSync('./xxx.txt', '内容')         // 同步
fs.appendFile('./xxx.txt', '追加', err => {})  // 追加
fs.writeFile('./xxx.txt', '日志', { flag: 'a' }, err => {})  // 追加写法2

// ===== 读文件 =====
fs.readFile('./xxx.txt', (err, data) => {
    console.log(data)        // Buffer
    console.log(data.toString())  // 字符串
})

// ===== 流式读写（大文件推荐） =====
const rs = fs.createReadStream('./xxx.mp4')   // 读取流
const ws = fs.createWriteStream('./yyy.mp4')   // 写入流
rs.on('data', chunk => ws.write(chunk))       // 一块一块读写
rs.on('end', () => console.log('完成'))
rs.pipe(ws)                                    // 管道：等价于上面3行

// ===== 文件夹操作 =====
fs.mkdir('./a/b/c', { recursive: true }, err => {})  // 递归创建
fs.readdir('./a', (err, files) => {})                 // 读取目录
fs.rmdir('./html', err => {})                          // 删除空目录
fs.rm('./a', { recursive: true }, err => {})           // 递归删除（推荐）

// ===== 文件操作 =====
fs.rename('./old.txt', './new.txt', err => {})  // 重命名/移动
fs.unlink('./xxx.txt', err => {})               // 删除文件
fs.stat('./xxx', (err, stats) => {
    console.log(stats.isFile(), stats.isDirectory())
})
```

### 3. path 路径模块
```js
const path = require('path')
path.resolve(__dirname, './index.html')   // 拼接绝对路径
path.sep                                  // 路径分隔符（Windows=\, Linux=/）
path.basename('/a/b/c.txt')               // → c.txt
path.dirname('/a/b/c.txt')                // → /a/b
path.extname('/a/b/c.txt')                // → .txt
// __dirname: 当前文件所在目录的绝对路径
// __filename: 当前文件的绝对路径
```

### 4. http 模块
```js
const http = require('http')
const server = http.createServer((req, res) => {
    const { method } = req
    const { pathname } = new URL(req.url, 'http://127.0.0.1:9000')

    res.setHeader('content-type', 'text/html;charset=utf-8')

    if (method === 'GET' && pathname === '/login') {
        res.end('登录页面')
    } else if (method === 'GET' && pathname === '/reg') {
        res.end('注册页面')
    } else {
        res.end('404 NOT FOUND')
    }
})
server.listen(9000, () => console.log('服务启动'))
```
**提取查询参数**
```js
const url = new URL(req.url, 'http://127.0.0.1:9000')
console.log(url.pathname)         // 路径
console.log(url.searchParams)     // 查询参数
```

### 5. 模块化（CommonJS）
```js
// 导出
module.exports = { fn1, fn2 }
// 或
exports.fn1 = fn1

// 导入
const { fn1, fn2 } = require('./xxx')
// 导入npm包
const express = require('express')
// 导入JSON
const config = require('./config.json')
```

### 6. npm 包管理
```bash
npm init -y                    # 初始化
npm install 包名               # 安装（生产依赖）
npm install -D 包名            # 安装（开发依赖）
npm install -g 包名            # 全局安装
npm remove 包名                # 卸载
npm i 包名@1.2.3               # 指定版本
npm install -g nodemon         # 文件修改自动重启 → nodemon xxx.js
# nvm: node版本管理
nvm list / nvm install 18 / nvm use 18
```

---

## 二、Express Web框架

> 安装：`npm i express`

### 1. 基础路由
```js
const express = require('express')
const app = express()

app.get('/home', (req, res) => res.send('hello home!'))
app.post('/login', (req, res) => res.send('login!'))
app.all('/test', (req, res) => res.send('test!'))
app.all('*', (req, res) => res.send('404!'))

app.listen(8888, () => console.log('启动成功！'))
```

### 2. 提取请求参数
```js
app.get('/home', (req, res) => {
    console.log(req.path)        // 路径
    console.log(req.query)       // 查询参数 /home?name=zs → {name:'zs'}
    console.log(req.params)      // 路由参数 /home/:id → {id:'100'}
    console.log(req.ip)          // 请求IP
    console.log(req.get('host')) // 请求头
})
```

### 3. 响应方法
```js
res.send('文本')                 // 发送（中文不乱码）
res.json({ code: 200 })         // JSON响应
res.redirect('https://...')     // 重定向
res.download(__dirname + '/file.txt')  // 下载
res.sendFile(__dirname + '/page.html') // 文件内容
res.status(500).send('error')   // 链式设置状态码
```

### 4. 中间件
```js
// 全局中间件（如：访问日志）
app.use((req, res, next) => {
    fs.appendFileSync('./access.log', `${req.url} ${req.ip}\r\n`)
    next()
})

// 路由中间件（如：权限拦截）
function auth(req, res, next) {
    if (req.query.code === '521') next()
    else res.send('暗号错误!')
}
app.get('/admin', auth, (req, res) => res.send('hello admin!'))

// 静态资源中间件
app.use(express.static(__dirname + '/public'))

// 请求体解析中间件
const bodyParser = require('body-parser')  // npm i body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.post('/login', (req, res) => console.log(req.body))
```

### 5. 路由模块化
```js
// routes/home.js
const router = express.Router()
router.get('/list', (req, res) => res.send('列表'))
module.exports = router

// app.js
const homeRouter = require('./routes/home')
app.use('/home', homeRouter)    // 路由前缀
```

### 6. 模板引擎 EJS
```bash
npm i ejs
```
```js
app.set('view engine', 'ejs')
app.set('views', path.resolve(__dirname, './views'))
app.get('/home', (req, res) => {
    res.render('home', { title: 'Hello!' })  // 渲染 home.ejs
})
```

### 7. 文件上传（formidable）
```bash
npm i formidable
```
```js
const formidable = require('formidable')
router.post('/upload', (req, res, next) => {
    const form = formidable({
        multiples: true,
        uploadDir: __dirname + '/../public',
        keepExtensions: true
    })
    form.parse(req, (err, fields, files) => {
        console.log(fields, files)
        res.send('ok')
    })
})
```

### 8. 脚手架
```bash
npm i -g express-generator
express -e helloworld     # -e 使用 EJS 模板
cd helloworld && npm install
# 改用 nodemon：package.json "start": "nodemon ./bin/www"
```

---

## 三、会话控制（Cookie / Session / Token）

### Cookie
```js
res.cookie('name', 'zs', { maxAge: 60 * 1000 })  // 设置
res.clearCookie('name')                            // 删除
// 获取：npm i cookie-parser → app.use(cookieParser()) → req.cookies
```

### Session（npm i express-session）
```js
const session = require('express-session')
app.use(session({
    name: 'session_id',
    secret: 'jqh',           // 签名密钥
    resave: true,
    cookie: { httpOnly: true, maxAge: 300000 }
}))
// 登录时设置
req.session.username = 'admin'
// 验证时读取
if (req.session.username) { /* 已登录 */ }
// 登出时销毁
req.session.destroy(() => console.log('销毁'))
```

### Token / JWT（npm i jsonwebtoken）
```js
const jwt = require('jsonwebtoken')
// 生成token（登录时）
const token = jwt.sign({ username: 'zs' }, 'secret', { expiresIn: 60 })
// 校验token（请求接口时）
jwt.verify(token, 'secret', (err, data) => {
    if (err) return console.log('校验失败')
    console.log(data)
})
```

---

## 四、MongoDB（mongoose）

```bash
npm i mongoose
```
```js
const mongoose = require('mongoose')
mongoose.connect('mongodb://127.0.0.1:27017/mydb')

// 定义 Schema + Model
const BookSchema = new mongoose.Schema({
    name: String, author: String, price: Number, isHot: Boolean
})
const BookModel = mongoose.model('books', BookSchema)

// 新增
BookModel.create({ name: '书名', author: '作者', price: 11 }, (err, data) => {
    console.log(data)
})
```

---

## 五、进阶模块

### child_process（子进程）
```js
const cp = require('child_process')
cp.spawn('node', ['./test.js'], { stdio: 'inherit' })    // 流式返回
cp.exec('node ./test.js', (err, stdout, stderr) => {})   // 回调返回
cp.execFile('node', ['./test.js'], (err, stdout) => {})  // 执行文件
cp.fork('./test.js')                                      // 创建Node子进程
```

### stream（流）
> 解决大文件一次性读入内存撑爆的问题，一次读一块。
```js
const rs = fs.createReadStream('./msg.txt', { encoding: 'utf-8', highWaterMark: 5 })
rs.on('data', chunk => console.log(chunk))
rs.on('end', () => console.log('读完'))
rs.on('error', err => console.log(err))
// 暂停/恢复
rs.pause() / rs.resume()
```

### readline（命令行交互）
```js
const readline = require('readline')
const r1 = readline.createInterface({ input: process.stdin, output: process.stdout })
r1.question('你想吃什么？', answer => {
    console.log(`我想吃${answer}`)
    r1.close()
})
r1.on('close', () => process.exit(0))
```

---

## 六、mediasoup 服务端补充

```js
// process 进程信息
process.title    // 当前进程标头
process.env      // 环境变量对象
process.exit(1)  // 退出进程

// os 操作系统
os.cpus()        // CPU内核信息数组
```
