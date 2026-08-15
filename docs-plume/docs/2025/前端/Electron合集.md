---
title: Electron 合集（入门 + Vue 集成 + 打包）
createTime: 2025/01/01 00:00:00
tags:
permalink: /article/electron/
---

# Electron 合集（入门 + Vue集成 + 打包）

---

## 一、Electron 快速入门

> Electron = Node.js + Chromium，用前端技术栈（HTML/CSS/JS）开发桌面应用。VS Code、Discord 都是 Electron 写的。

### 1. 创建项目
```bash
mkdir my-electron-app && cd my-electron-app
npm init
npm install --save-dev electron
```
**package.json**
```json
{
  "name": "myapp",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": { "start": "electron ." },
  "devDependencies": { "electron": "^24.1.2" }
}
```

### 2. 三大文件
**index.html（渲染器进程）**
```html
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>你好!</title></head>
<body>
<h1>你好!</h1>
我们正在使用 Node.js <span id="node-version"></span>,
Chromium <span id="chrome-version"></span>,
和 Electron <span id="electron-version"></span>.
<script src="./renderer.js"></script>
</body>
</html>
```

**main.js（主进程）**
```js
const { app, BrowserWindow } = require('electron')
const path = require('path')

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800, height: 600,
        webPreferences: { preload: path.join(__dirname, 'preload.js') }
    })
    win.loadFile('index.html')
    // win.webContents.openDevTools()  // 打开开发工具
}

app.whenReady().then(() => {
    createWindow()
    // macOS: 点击 dock 图标时如果没有窗口则重新创建
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

// Windows/Linux: 关闭所有窗口时退出应用
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit()
})
```

**preload.js（预加载脚本）**
```js
// 在渲染器进程加载之前执行，可访问 Node.js API + window/document
window.addEventListener('DOMContentLoaded', () => {
    for (const dep of ['chrome', 'node', 'electron']) {
        const el = document.getElementById(`${dep}-version`)
        if (el) el.innerText = process.versions[dep]
    }
})
```

### 3. 进程间通信（IPC）
```
预加载脚本 ←暴露→ 渲染器进程
预加载脚本 ←事件→ 主进程
```

**预加载脚本（contextBridge 暴露方法给渲染器）**
```js
const { contextBridge, ipcRenderer } = require('electron')
contextBridge.exposeInMainWorld('versions', {
    node: () => process.versions.node,
    chrome: () => process.versions.chrome,
    electron: () => process.versions.electron,
    ping: () => ipcRenderer.invoke('ping'),  // 调用主进程
})
```

**主进程（ipcMain 监听）**
```js
const { app, BrowserWindow, ipcMain } = require('electron')
ipcMain.handle('ping', () => 'pong')
```

| 方向 | 发送 | 监听 |
|------|------|------|
| 渲染器→主进程（不需要返回值） | `ipcRenderer.send` | `ipcMain.on` |
| 渲染器→主进程（需要返回值） | `ipcRenderer.invoke` | `ipcMain.handle` |
| 主进程→渲染器 | `webContents.send` | `ipcRenderer.on` |

### 4. 应用案例（获取音视频流）
- 录音实现：https://mp.weixin.qq.com/s/w8bXmcwzJjZ2WM2sclXP8A
- mac 内录 BlackHole/Soundflower：https://existential.audio/blackhole/

---

## 二、Electron + Vue 项目搭建

### 方式一（旧脚手架，不推荐）
```bash
vue init simulatedgreg/electron-vue electron-vue-demo
```

### 方式二（推荐：Vue CLI + electron-builder）
```bash
vue create myproject                    # 1.创建Vue项目
vue add electron-builder                # 2.添加Electron
npm install
npm run electron:serve                  # 3.启动
```
**启动慢问题**：`background.js` 中将 `VUEJS_DEVTOOLS` 相关代码注释掉

**预加载脚本配置**（vue.config.js）
```js
module.exports = {
    pluginOptions: {
        electronBuilder: { preload: 'src/preload.js' }
    }
}
```

**跨域问题解决**
```js
app.commandLine.appendSwitch('disable-web-security');
// BrowserWindow配置中：webSecurity: false
```

### 常用技巧

**透明窗体 + 无边框拖拽**
```css
body, html { -webkit-app-region: drag; }     /* 整个窗口可拖拽 */
section { -webkit-app-region: no-drag; }      /* 但按钮区域恢复点击 */
```

**隐藏菜单栏**
```js
const { Menu } = require('electron')
Menu.setApplicationMenu(null)
```

**配置项目图标**
```bash
npm install --save-dev electron-icon-builder
# package.json: "electron:generate-icons": "electron-icon-builder --input=./public/icon.png --output=build --flatten"
npm run electron:generate-icons
```
```js
const win = new BrowserWindow({ icon: path.join(__static, 'icon.png') })
```

**自定义标题栏（最小化/全屏/关闭）**：https://blog.csdn.net/linyisonger/article/details/128674023

---

## 三、Electron 打包

| 工具 | 特点 |
|------|------|
| **electron-builder** | 配置项多、灵活、体积小，上手难度大 |
| **electron-packager** | 简单易上手，但包体积大 |
| **electron-forge** | 工具集，内部用 electron-packager |

**使用 electron-forge 打包**
```bash
npm install --save-dev @electron-forge/cli
npx electron-forge import
npm run make
```
> 注意：需要较新的 Node.js 版本
