---
title: Electron合集
createTime: 2024/03/01 15:46:45
permalink: /article/electron-complete/
---

# 一、Electron 基础入门

- 官网快速入门：https://www.electronjs.org/zh/docs/latest/tutorial/quick-start

## 核心概念

Electron 是基于 Chromium 和 Node.js 的桌面应用开发框架，可以使用 Web 技术（HTML/CSS/JS）构建跨平台桌面应用。

### 三大进程
- **主进程（Main Process）**：管理应用生命周期、创建窗口、系统交互
- **渲染进程（Renderer Process）**：每个窗口对应一个渲染进程，负责展示 UI
- **预加载脚本（Preload Script）**：在渲染进程加载前运行，桥接主进程和渲染进程

## 进程间通信（IPC）

参考：https://www.electronjs.org/zh/docs/latest/tutorial/ipc

### 预加载脚本 —— 暴露方法/变量给渲染进程
```js
const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('versions', {
  node: () => process.versions.node,
  chrome: () => process.versions.chrome,
  electron: () => process.versions.electron,
  ping: () => ipcRenderer.invoke('ping'),
})
```

### 主进程 —— 监听/处理事件
```js
const { app, BrowserWindow, ipcMain } = require('electron')
ipcMain.handle('ping', () => 'pong')
```

### 通信模式

**渲染进程 → 主进程**
- 不需要结果：`ipcRenderer.send`（预加载）→ `ipcMain.on`（主进程）
- 需要结果：`ipcRenderer.invoke`（预加载）→ `ipcMain.handle`（主进程）

**主进程 → 渲染进程**
- `webContents.send`（主进程）→ `ipcRenderer.on`（预加载）

**渲染进程 → 渲染进程**
- 方案1：主进程作为消息代理转发
- 方案2：通过 MessagePort 直接通信

## 打包工具对比

| 工具 | 特点 |
|------|------|
| electron-builder | 配置项多、灵活、包体积小、上手难度大 |
| electron-packager | 配置简单、包体积相对较大 |
| electron-forge | 工具集，内部仍使用 electron-packager |

## 实用案例：录屏
- 录屏实现参考：https://mp.weixin.qq.com/s/w8bXmcwzJjZ2WM2sclXP8A

### Mac 系统内录（BlackHole / Soundflower）
1. 下载 BlackHole：https://existential.audio/blackhole/
2. 或下载 Soundflower：https://soundflower.en.softonic.com/mac?ex=DINS-635.3
3. 安装后进入「音频 MIDI 设置」→ 左下角「+」→「创建多输出设备」
4. 右侧勾选「BlackHole」（必选）+「扬声器/耳机」，主设备选「扬声器/耳机」

# 二、项目搭建

## 方案 A：Electron + Vue3 + Vite + TS

### 1. 创建 Vite + Vue + TS 项目
```shell
npm create vite
# Project name: … your-project
# Select framework: › Vue
# Select variant: › TypeScript

cd your-project
npm install
npm install vue-router@4
# 新建 src/router/index.ts 创建路由
# 修改 src/main.ts 添加路由
```

### 2. 添加 Electron 依赖
```shell
npm install electron@"^28.0.0" -D
npm install electron-devtools-installer -D
npm install electron-builder -D
npm install vite-plugin-electron -D
npm install vite-plugin-electron-renderer -D
```

### 3. vite.config.ts 配置
```ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import electron from 'vite-plugin-electron'
import electronRender from 'vite-plugin-electron-renderer'

export default defineConfig({
  plugins: [
    vue(),
    electron([
      { entry: 'electron/index.ts' },
      { entry: 'electron/preload.ts' },
    ]),
    electronRender()
  ],
})
```

### 4. 主进程 electron/index.ts
```ts
import { app, BrowserWindow } from "electron"
import path from "path"
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';

const createWindow = () => {
  const win = new BrowserWindow({
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      preload: path.join(__dirname, "./preload.js"),
    },
  })

  if (process.env.NODE_ENV !== 'development') {
    win.loadFile(path.join(__dirname, "./index.html"))
    win.webContents.openDevTools()
  } else {
    win.loadURL("http://localhost:5173")
    win.webContents.openDevTools()
  }
}

app.whenReady().then(() => {
  createWindow()
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit()
})
```

### 5. 预加载脚本 electron/preload.ts
```ts
import os from "os";
console.log("platform", os.platform());
```

### 6. package.json 修改
- 添加：`"main": "dist-electron/index.js"`
- `scripts.build` 命令末尾加 `&& electron-builder`
- **删除** `"type": "module"`（Electron 不支持 ES Module）

### 7. tsconfig.json 修改
- `include` 新增 `, "electron/*.ts"`

### 8. electron-builder.json5 打包配置
```json5
{
  "$schema": "https://raw.githubusercontent.com/electron-userland/electron-builder/master/packages/app-builder-lib/scheme.json",
  "appId": "YourAppID",
  "asar": true,
  "productName": "YourAppName",
  "directories": { "output": "release/${version}" },
  "files": ["dist", "dist-electron"],
  "mac": {
    "target": ["dmg"],
    "artifactName": "${productName}-Mac-${version}-Installer.${ext}"
  },
  "win": {
    "target": [{ "target": "nsis", "arch": ["x64"] }],
    "artifactName": "${productName}-Windows-${version}-Setup.${ext}"
  },
  "nsis": {
    "oneClick": false,
    "perMachine": false,
    "allowToChangeInstallationDirectory": true,
    "deleteAppDataOnUninstall": false
  },
  "linux": {
    "target": ["AppImage"],
    "artifactName": "${productName}-Linux-${version}.${ext}"
  }
}
```

## 方案 B：Electron + Vue2 + Webpack

### 1. 创建 Vue 项目
```shell
# 旧客户端
npm install -g vue-cli
vue init webpack my-project

# 新客户端 3.0+（需先卸载旧版）
npm uninstall -g vue-cli
npm install -g @vue/cli
vue create my-project

# 新客户端想用老模版
npm i -g @vue/cli-init
vue init webpack my-project
```

### 2. 添加 Electron 依赖
```shell
vue add electron-builder   # 会自动初始化项目和文件
npm install
npm run electron:serve
```

**启动慢优化**：在 background.js 中将 `VUEJS_DEVTOOLS` 相关代码注释掉

### 3. 预加载脚本配置

在 vue.config.js 中：
```js
{
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js'
    }
  }
}
```

窗口创建时引用：
```js
preload: path.join(__dirname, 'preload.js')
```

# 三、打包与部署

## 打包命令
```shell
# 方案A（Vite+Vue3+TS）
npm run build   # 会先构建前端项目，再 electron-builder 打包

# 方案B（Vue2+Webpack）
npm run electron:build
```

## 输出目录
- 方案A：`release/${version}/`
- 方案B：默认 `dist_electron/`

## 跨平台产物
| 平台 | 格式 |
|------|------|
| Windows | .exe（NSIS 安装包） |
| macOS | .dmg（磁盘映像） |
| Linux | .AppImage（可执行映像） |
