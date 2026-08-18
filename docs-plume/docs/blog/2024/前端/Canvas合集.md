---
title: Canvas合集
createTime: 2024/01/31 16:58:10
permalink: /article/canvas-complete/
---

# 一、Canvas 基础

Canvas API 提供了通过 JS 和 HTML `<canvas>` 元素来绘制图形的方式，可用于动画、游戏画面、数据可视化、图片编辑及实时视频处理等。

- 教程：https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- Demo：https://techbrood.com/?q=canvas 、 https://codepen.io/search/pens?q=canvas

## 坐标系统
Canvas 坐标原点在左上角：向右为 x 轴正方向，向下为 y 轴正方向。

## 学习要点
- 直接绘制：填充矩形、填充文本、描边矩形、描边文本
- 路径绘制：矩形路径、圆路径，然后填充或描边
- 上下文状态：保存 save()、重置 restore()
- 坐标系变换：之后的操作都基于新坐标系

## 进阶方向
- 动画：参考《HTML5+JavaScript动画基础》
- 游戏：参考《HTML5游戏开发》，如小鸟飞行等

## 数学基础
向量、矩阵运算：https://www.leapreal.com/posts/db6f6769.html

## 常用第三方库
- EaselJS：制作游戏、创意艺术的开源 canvas 库
- Fabric.js：支持 SVG 解析的开源 canvas 库
- heatmap.js：基于 canvas 的热点图开源库
- Konva.js：桌面端和移动端通用的 2D canvas 库
- p5.js：面向艺术家、设计师的完整绘制功能
- Paper.js：运行于 HTML5 Canvas 上的开源矢量图形脚本框架
- Phaser：基于 Canvas 和 WebGL 的浏览器游戏开源框架
- ZIM：提供组件、可用性和数百个教程

# 二、Canvas API 速查

## HTMLCanvasElement（画布元素）
```js
class HTMLCanvasElement extends HTMLElement {
  height: number;          // 画布高度
  width: number;           // 画布宽度
  getContext(contextId, options?);  // 获取上下文："2d" | "webgl" | "webgl2"
  toBlob(callback, type?, quality?): void;  // 转 Blob
  toDataURL(type?, quality?): string;       // 转 DataURL
  captureStream(frameRate?): CanvasCaptureMediaStream;  // 视频捕获
  transferControlToOffscreen(): OffscreenCanvas;        // 转移控制
}
```

## CanvasRenderingContext2D（2D 上下文）

### 状态管理
- `save()` — 保存当前状态到堆栈
- `restore()` — 恢复上次保存的状态

### 坐标系变换
- `scale(x, y)` — 水平垂直缩放
- `rotate(angle)` — 旋转（弧度 = 角度 × π / 180）
- `translate(x, y)` — 水平垂直移动
- `transform(a,b,c,d,e,f)` — 相对矩阵变换（缩放、旋转、平移）
- `setTransform(a,b,c,d,e,f)` — 绝对矩阵变换（覆盖之前）
- `resetTransform()` — 重置变换
- `currentTransform` — 当前变换（属性）

### 合成 & 图像平滑
- `globalAlpha` — 透明度（0.0-1.0）
- `globalCompositeOperation` — 合成操作类型
- `imageSmoothingEnabled` — 是否平滑图片
- `imageSmoothingQuality` — 平滑度：'low' | 'medium' | 'high'

### 过滤器
- `filter` — 模糊、灰度等过滤效果

### 填充 & 描边颜色
- `strokeStyle` — 描边颜色（字符串 / CanvasGradient / CanvasPattern）
- `fillStyle` — 填充颜色
- `createLinearGradient(x0,y0,x1,y1)` — 线性渐变
- `createRadialGradient(x0,y0,r0,x1,y1,r1)` — 放射性渐变
- `createPattern(image, repetition?)` — 图像背景填充
- `createConicGradient(startAngle, x, y)` — 圆锥形渐变

### 阴影
- `shadowOffsetX / shadowOffsetY` — 阴影偏移
- `shadowBlur` — 模糊程度
- `shadowColor` — 阴影颜色

### 矩形操作
- `clearRect(x,y,w,h)` — 清除区域（透明）
- `fillRect(x,y,w,h)` — 填充矩形
- `strokeRect(x,y,w,h)` — 描边矩形

### 路径操作
- `beginPath()` — 清空子路径，开始新路径
- `fill(fillRule?)` / `fill(path, fillRule?)` — 填充路径
- `stroke()` / `stroke(path)` — 描边路径
- `clip(fillRule?)` / `clip(path, fillRule?)` — 路径裁剪
- `resetClip()` — 重置裁剪
- `isPointInPath(x,y,rule?)` — 点是否在路径内
- `isPointInStroke(x,y)` — 点是否在描边上
- `closePath()` — 连到子路径起点
- `moveTo(x,y)` — 移动子路径起始点
- `lineTo(x,y)` — 画直线
- `quadraticCurveTo(cpx,cpy,x,y)` — 二次贝塞尔曲线
- `bezierCurveTo(cp1x,cp1y,cp2x,cp2y,x,y)` — 三次贝塞尔曲线
- `arcTo(x1,y1,x2,y2,r)` — 根据控制点和半径画圆弧
- `rect(x,y,w,h)` — 矩形路径
- `arc(x,y,r,startAngle,endAngle,anticlockwise?)` — 圆弧路径
- `ellipse(x,y,radiusX,radiusY,rotation,start,end,anticlockwise?)` — 椭圆路径

### 文本操作
- `fillText(text,x,y,maxWidth?)` — 填充文本
- `strokeText(text,x,y,maxWidth?)` — 描边文本
- `measureText(text)` — 测量文本信息

### 图片操作
- `drawImage(image, dx, dy)` — 绘图+移动
- `drawImage(image, dx, dy, dw, dh)` — 绘图+移动+缩放
- `drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)` — 绘图+裁剪+移动+缩放

### 像素操作
- `createImageData(sw, sh)` / `createImageData(imagedata)` — 创建空白 ImageData
- `getImageData(sx, sy, sw, sh)` — 获取像素数据
- `putImageData(imagedata, dx, dy, dirtyX?, dirtyY?, dirtyW?, dirtyH?)` — 写入像素数据

### 线样式
- `lineWidth` — 线段厚度
- `lineCap` — 端点样式
- `lineJoin` — 拐角样式
- `miterLimit` — 拐角最大厚度
- `setLineDash([实,虚,...])` — 设置虚线
- `getLineDash()` — 获取虚线样式
- `lineDashOffset` — 虚线偏移量

### 文本样式
- `font` — 字体样式
- `textAlign` — 对齐方式
- `textBaseline` — 文本基线
- `direction` — 文本方向

## Path2D（可复用路径）
```js
interface Path2D extends CanvasPath {
  addPath(path: Path2D, transform?): void;  // 追加路径
}
// CanvasPath 包含：arc, arcTo, bezierCurveTo, closePath, ellipse,
// lineTo, moveTo, quadraticCurveTo, rect
```

# 三、Canvas Demo

## 相机操作
- **滚轮缩放**：缩放坐标系 → 视口放大缩小
- **抓取平移**：平移坐标系 → 视口平移
  - 向上平移相机 ⇔ 向下平移坐标系
  - 向左平移相机 ⇔ 向右平移坐标系

# 四、QRCanvas 二维码

## 安装
```sh
yarn add qrcanvas
# 或
npm install qrcanvas -S
```

## 使用（ES Module）
```js
import { qrcanvas } from 'qrcanvas';

const canvas = qrcanvas({
  data: 'hello, world'
});
document.body.appendChild(canvas);
```

## 使用（CDN）
```html
<div id="qrcode"></div>
<script src="https://cdn.jsdelivr.net/npm/qrcanvas@3"></script>
<script>
  const canvas = qrcanvas.qrcanvas({
    data: 'hello, world'
  });
  document.getElementById('qrcode').appendChild(canvas);
</script>
```

# 五、Three.js 全景

## 全景图格式
- **等距柱状投影（equirectangular）**：最简单，单张图片，建议最大宽度 4096px
- **立方体贴图（cube map）**：六张图像，支持更高分辨率（单面上限通常 4096px）
- **多分辨率格式（multiresolution）**：基于立方体贴图，每个面是平铺图像金字塔，缺点是需要额外转换和托管大量文件

## Three.js 库
- GitHub：https://github.com/mrdoob/three.js.git
- 官网：https://threejs.org/
- 支持 CDN 和 npm 引入

## Panolens【不推荐】
- 基于 ThreeJS 的库，已停止更新
- API 参数缺少文档，效果一般

## Pannellum（基于 WebGL）
- GitHub：https://github.com/mpetroff/pannellum.git
- 官网：https://pannellum.org/
- 参数文档完善，推荐使用

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>测试Pannellum</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css"/>
  <script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
  <style>
    html,body{padding:0;margin:0;width:100%;height:100%;overflow:hidden;}
    #container {width:100%;height:100%;}
  </style>
</head>
<body>
<div id="container"></div>
<script>
pannellum.viewer('container', {
    "type": "equirectangular",
    "panorama": "../view.jpg",
    "autoLoad": true,
    "autoRotate": -2,
    "title": "我的标题",
    "author": "作者JQH",
    "compass": true,
    "northOffset": 247.5,
    "pitch": 2.3,
    "yaw": 150,
    "hfov": 130
});
</script>
</body>
</html>
```

## Marzipano（Google 出品）
- GitHub：https://github.com/google/marzipano.git
- 官网：https://www.marzipano.net/
- 基于 WebGL，参数有说明，支持 CDN 和 npm

## Photo Sphere Viewer
- GitHub：https://github.com/mistic100/Photo-Sphere-Viewerer.git
- 官网：https://photo-sphere-viewer.js.org/guide/
- 基于 ThreeJS，有完整 API 文档

## 全景图视角概念
- **Pitch（俯仰角）**：摄像机垂直旋转角度。0° 水平朝前；正值向上；负值向下
- **Yaw（偏航角）**：摄像机水平旋转角度。0° 指向参考方向（正北）；正值顺时针；负值逆时针
- **HFOV（水平视场角）**：摄像机水平方向可捕捉的视野角度范围

# 六、WebGL 基础

- 掘金专栏：https://juejin.cn/column/7067063198054105118
- GitHub 教程：https://github.com/buglas/webgl-lesson

# 七、Pannellum 全景插件

## 介绍
Pannellum 是轻量级、免费开源的 Web 全景查看器，使用 HTML5/CSS3/JS/WebGL 构建，无需插件。
- GitHub：https://github.com/mpetroff/pannellum.git
- 官网：https://pannellum.org/

## 依赖引入
```html
<!-- 最新编译和缩小的独立查看器 -->
https://cdn.pannellum.org/2.5/pannellum.htm
<!-- JS -->
<script src="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js"></script>
<!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css">
```

## 直接访问打开
全景图格式为 `equirectangular` 时可直接用 `pannellum.htm` 打开：
```
https://cdn.pannellum.org/2.5/pannellum.htm#panorama=https://pannellum.org/images/alma.jpg
```
也可以通过 `config` 指定 JSON 配置文件：
```
https://cdn.pannellum.org/2.5/pannellum.htm#config=https://pannellum.org/configs/compass.json
```

## JSON 配置常用选项

### 基础配置
| 配置项 | 类型 | 说明 |
|--------|------|------|
| `type` | String | 全景类型：cubemap / multires / equirectangular（默认） |
| `panorama` | String | equirectangular 类型：全景图 URL |
| `cubeMap` | Array | cubemap 类型：六个立方体面 URL 数组 |
| `title` | String | 全景标题 |
| `author` | String | 作者名 |
| `authorURL` | String | 作者链接 |
| `autoLoad` | Boolean | 自动加载，默认 false |
| `autoRotate` | int | 自动旋转速度（正逆时针 / 负顺时针） |
| `autoRotateInactivityDelay` | int | 用户活动停止后自动旋转延迟 |
| `autoRotateStopDelay` | int | 多少毫秒后停止自动旋转 |

### 交互控制
| 配置项 | 类型 | 说明 |
|--------|------|------|
| `showZoomCtrl` | Boolean | 显示缩放控件 |
| `keyboardZoom` | Boolean | 键盘缩放 |
| `mouseZoom` | Boolean/String | 鼠标滚轮缩放：false / true / "fullscreenonly" |
| `draggable` | Boolean | 鼠标和触摸拖动，默认 true |
| `friction` | number(0-1) | 惯性摩擦力，默认 0.15 |
| `disableKeyboardCtrl` | Boolean | 禁用键盘控件 |
| `showFullscreenCtrl` | Boolean | 显示全屏控件 |
| `showControls` | Boolean | 显示控件 |

### 视角设置
| 配置项 | 类型 | 说明 |
|--------|------|------|
| `yaw` | int | 起始偏航位置，默认 0 |
| `pitch` | int | 起始俯仰位置，默认 0 |
| `hfov` | int | 起始水平视野，默认 100 |
| `minYaw / maxYaw` | int | 偏航范围，默认 -180 ~ 180 |
| `minPitch / maxPitch` | int | 俯仰范围，默认 -90 ~ 90 |
| `minHfov / maxHfov` | int | 水平视野范围，默认 50 ~ 120 |
| `compass` | Boolean | 显示指南针 |
| `northOffset` | int | 中心与北的偏移量 |
| `preview` | String | 加载前预览图 URL |

### 热点配置（hotSpots）
`hotSpots` 是一个热点字典数组，每个热点属性：
| 属性 | 类型 | 说明 |
|------|------|------|
| `pitch` | int | 俯仰位置（度） |
| `yaw` | int | 偏航位置（度） |
| `type` | String | 类型：scene（场景链接）/ info（信息热点） |
| `text` | String | 鼠标悬停显示文本 |
| `attributes` | String | 链接属性：target / _blank 等 |
| `sceneId` | String | 目标场景 ID（仅 scene 类型） |
| `targetPitch / targetYaw / targetHfov` | int | 目标场景视角 |
| `id` | int | 热点 ID，供 API 使用 |
| `cssClass` | String | 自定义 CSS 类 |
| `createTooltipFunc / createTooltipArgs` | Function/Object | 自定义创建热点 DOM |
| `clickHandlerFunc / clickHandlerArgs` | Function/Object | 自定义点击处理 |
| `scale` | Boolean | 缩放热点以匹配视野变化 |

## API 事件
- `load` — 全景图加载完成
- `scenechange` — 场景切换完成（传入场景 ID）
- `fullscreenchange` — 全屏状态变化（传入布尔值）
- `zoomchange` — hfov 更新（传入新 hfov）
- `animatefinished` — 动画停止（传入 pitch/yaw/hfov）
- `error` — 发生错误（传入错误消息）
- `errorcleared` — 清除错误
- `mousedown / mouseup` — 鼠标按下/释放（传入 MouseEvent）
- `touchstart / touchend` — 触摸开始/结束（传入 TouchEvent）
