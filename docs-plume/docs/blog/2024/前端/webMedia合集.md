---
title: webMedia合集
createTime: 2024/03/01 15:46:45
permalink: /article/webmedia-collection/
---

# 一、H5 媒体技术概览

- 参考文档：https://developer.mozilla.org/en-US/docs/Web/Media

## HTML 中的媒体标签

- `audio` → `HTMLAudioElement`（音频）
- `video` → `HTMLVideoElement`（视频）
- `track` → `HTMLTrackElement`（字幕）
- `source` → `HTMLSourceElement`（媒体源）

## Web 媒体 API 总览

### Media Capabilities API（编解码）
- 确定应用或网站运行设备的编码和解码功能
- 实时决定使用何种格式以及何时使用

### Media Capture and Streams API
- 网络流式传输、录制和操作媒体
- 使用本地摄像头和麦克风捕获视频、音频和静态图像

### Media Session API
- 提供自定义媒体通知的方法，为 Web 应用正在播放的媒体提供元数据
- 提供操作处理程序，浏览器可访问平台媒体键（键盘、耳机、遥控器硬件键，锁屏软件键）

### MediaStream Recording API
- 捕获媒体流以处理或过滤数据或将其记录到磁盘

### Web Audio API
- 实时生成、过滤和处理声音数据，发送到 audio 元素、媒体流或磁盘

### WebRTC
- （Web 实时通信）在两个对等点之间流传输实时音频/视频及任意数据，无需中介

---

# 音视频基础概念

## 帧、帧率、FPS
- **帧 Frame**：视频中每一张画面
- **帧数 Frames**：画面数量
- **帧率 Frame rate**：每秒显示帧数 = 帧数 / 时间
- **FPS**：每秒传输的帧数

**时钟频率计算示例**：
- 时钟频率为 90000（一秒 90000 点）
- 帧率为 25，一帧 = 1/25 秒
- 一帧点数 = 90000 × (1/25) = 3600 个点

**采样率时间戳增量**：
- 音频采样率 8000Hz：每采样一次 = 1/8000s，20ms 封包 → 时间戳增量 = 0.02 / (1/8000) = 160
- 视频采样率 90000Hz：帧率 25 帧/s → 时间戳增量 = (1/25) / (1/90000) = 3600

## 分辨率
- 屏幕图像的精密度，指显示器所能显示的像素数量
- 显示分辨率一定时，显示屏越小图像越清晰
- 显示屏大小固定时，显示分辨率越高图像越清晰

## 帧率
- 帧率 = FPS（Frames Per Second）【帧/秒】
- 每秒钟刷新的图片帧数，帧率越高动画越流畅逼真
- 一般 25 帧/秒人眼已很难察觉不连续
- 影响 FPS 的主要因素是显卡

## 码流（码率）
- 码流 = 视频文件单位时间内使用的数据流量，单位 kb/s 或 Mb/s
- 同等分辨率下，码流越大 → 压缩比越小 → 画面质量越高
- **码流计算公式**（以 1920×1080、YUV420、30FPS 为例）：
  - 1920 × 1080 × (3/2) × 8 × 30 / (1024×1024) = 89 Mb/s
  - YUV420 乘 3/2，RGB24 乘 3，RGB32 乘 4

## 采样位深
- 16Bit 可记录约 96dB 动态范围（每比特约 6dB）
- 20Bit → ~120dB；24Bit → ~144dB
- CD 音频动态范围：-96dB ~ 0dB
- 24Bit HD-Audio：-144dB ~ 0dB
- 位深越高，动态范围越大，可记录更低电平细节

## 采样率
- 采样率 = 每秒从连续信号提取离散信号的采样个数，单位 Hz
- 根据奈奎斯特定理：采样频率 fs > 2 × 信号最高频率 fmax
- 人耳听觉范围 20Hz ~ 20KHz，因此 44.1KHz 为常见采样率

**常见采样率**：
| 采样率 | 用途 |
|--------|------|
| 8,000 Hz | 电话 |
| 22,050 Hz | 无线电广播 |
| 32,000 Hz | miniDV、DAT (LP mode) |
| 44,100 Hz | 音频 CD、MP3 |
| 48,000 Hz | miniDV、数字电视、DVD、电影、专业音频 |
| 96,000 / 192,000 Hz | DVD-Audio、Blu-ray 音轨 |

## 比特率
- 比特率 = 每秒传送的比特(bit)数，单位 bps
- 比特率越高，传送数据越大，音质越好
- **公式**：比特率 = 采样率 × 采样位数 × 声道数
- 示例：44.1KHz × 16bit × 2 声道 = 1,411,200 bps = 1,378 kbps = 176,400 B/s

## 存储单位换算
- 1 byte = 8 bit
- 1 KB = 1024 bytes
- 1 MB = 1024 KB = 1024 × 1024 bytes
- 1 GB / 1 TB / 1 PB / 1 EB

---

# PCM 音频基础

- **PCM（脉冲编码调制）**：模拟信号的数字化方法，不是一种格式
- 利用 PCM 方法存储的音频最常见的是 WAV 格式
- PCM 音频质量（体积）三要素：采样率 SampleRate、位深 Bit Depth、声道数 Channel

## 采样率 SampleRate（Hz）
- 采集声音样本的频率，类似录像的帧率
- PCM 最常见采样率：44100 Hz（每秒采集 44100 次）

## 位深
- 每个采样点存储的位数（bit）

## 声道
- 单声道：A B C D E
- 立体声（Joint Stereo）：AABBCCDDEE（双声道数据大小是单声道 2 倍）

## PCM 体积计算
- **体积 = SampleRate × bitDepth × channelCounts**

---

# 二、Media Capabilities API - 编解码能力检测

- 确定运行设备的编码和解码能力
- 实时决定使用何种媒体格式

---

# 三、Media Capture and Streams API - getUserMedia/getDisplayMedia/MediaStream

- 网络流式传输、录制和操作媒体
- 使用本地摄像头和麦克风捕获视频、音频和静态图像
- 相关 TS 文件：`./MediaCaptureAndStreamsAPI/003MediaCaptureAndStreamsAPI.ts`

---

# 四、MediaStream Recording API - MediaRecorder 录音录屏

- 捕获媒体流以处理、过滤或记录到磁盘

---

# 五、Web Audio API

- 参考文档：https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API
- 相关 TS 文件：`./WebAudioAPI/001WebAudioAPI.ts`
- 用途：音频可视化、音频数据处理、播放音频

## 核心概念与工作流程

### 工作流程
核心是 **音频上下文对象** `AudioContext`：
```
音频源节点 → 音频处理节点 → 音频处理节点 → 音频输出终点
```

### 音频数据格式
- 音频信号（声波）采样：连续 → 离散 → 计算机处理
- **AudioBuffer**：驻留内存的短音频资产
  - 格式编码：非交错 IEEE754 32位线性 PCM（32位浮点缓冲区）
  - 标称范围：[-1, +1]

### PCM 关键概念
- **采样率 sampleRate**：`audioContext.sampleRate`（浏览器采样率不可更改）
- **位深（bits）**：
  - 8位：2⁸=256，PCM 范围 [0, 255]
  - 16位：2¹⁶=65536，PCM 范围 [-32768, 32767]
  - 浏览器 API 获取：非交错 32位线性 PCM，范围 [-1, 1]
  - 转 8位：负数×128，正数×127，整体 +128 → [0, 255]
  - 转 16位：负数×32768，正数×32767 → [-32768, 32767]
- **声道 channel**：每个声道采样样本独立数组，录音通常只取单通道

### AudioBuffer 参数
- 通道数量（单声道 1，立体声 2 等）
- 长度 length = 采样帧数量（与通道数无关）
- 采样率 = 每秒播放的采样帧数

**示例**：
```javascript
const context = new AudioContext();
const buffer = new AudioBuffer(context, {
  numberOfChannels: 2,
  length: 22050,
  sampleRate: 44100,
});
// 立体声 0.5 秒：22050帧 / 44100Hz = 0.5s
// 样本数 = 88200，帧数 = 44100
```

### 平面缓冲 vs 交错缓冲
- **平面缓冲（Web Audio API 使用）**：`LLLL...RRRR...`
  - 便于独立处理每个声道
- **交错缓冲（WAV/MP3 使用）**：`LRLRLRLR...`
  - 适合存储和直接播放

### 音频通道上混/下混
- 当输入输出通道数不匹配时，通过 `AudioNode.channelInterpretation` 控制（speakers / discrete）

---

## API 接口分类

### 通用音频图定义
| 接口 | 说明 |
|------|------|
| AudioContext | 音频处理图上下文，控制节点创建和音频处理 |
| AudioNode | 音频处理模块（源、目的地、中间处理） |
| AudioParam | 音频相关参数，支持定时和模式化变更 |
| BaseAudioContext | AudioContext 和 OfflineAudioContext 基类 |

### 音频源节点
| 接口 | 说明 |
|------|------|
| OscillatorNode | 周期性波形（正弦/三角波等） |
| AudioBufferSourceNode | 内存中 AudioBuffer 音频源 |
| MediaElementAudioSourceNode | HTML audio/video 元素音频源 |
| MediaStreamAudioSourceNode | MediaStream（摄像头/麦克风/远程流）音频源 |
| MediaStreamTrackAudioSourceNode | 指定 MediaStreamTrack 音频源 |

### 音频效果/过滤器节点
| 接口 | 说明 |
|------|------|
| BiquadFilterNode | 低阶滤波器（音调控制、图形均衡器） |
| ConvolverNode | 线性卷积（混响效果） |
| DelayNode | 延迟线 |
| DynamicsCompressorNode | 动态压缩（防止削波失真） |
| GainNode | 音量变化 |
| WaveShaperNode | 非线性失真 |
| IIRFilterNode | 无限脉冲响应滤波器 |

### 音频目标节点
| 接口 | 说明 |
|------|------|
| AudioDestinationNode | 最终目的地（通常是设备扬声器） |
| MediaStreamAudioDestinationNode | WebRTC MediaStream 音频目的地 |

### 数据分析与可视化
| 接口 | 说明 |
|------|------|
| AnalyserNode | 实时频域/时域分析（不修改音频信号） |

### 通道分割/合并
| 接口 | 说明 |
|------|------|
| ChannelSplitterNode | 多声道分离为单声道输出（扇出） |
| ChannelMergerNode | 单声道输入合并为多声道输出（扇入） |

### 音频空间化
| 接口 | 说明 |
|------|------|
| AudioListener | 收听者位置和方向 |
| PannerNode | 3D 空间音频源位置和行为 |
| StereoPannerNode | 简单左右立体声平移 |

### JavaScript 音频处理（AudioWorklet）
| 接口 | 说明 |
|------|------|
| AudioWorklet | 通过 audioContext.audioWorklet 添加模块，脱离主线程 |
| AudioWorkletNode | 嵌入音频图的节点，与 AudioWorkletProcessor 通信 |
| AudioWorkletProcessor | 在 AudioWorkletGlobalScope 运行的实际处理代码 |
| AudioWorkletGlobalScope | 工作者上下文，Worker 线程中运行 |

> ⚠️ ScriptProcessorNode（弃用）：主线程运行，性能差，仅保留历史兼容

### 离线/后台音频处理
| 接口 | 说明 |
|------|------|
| OfflineAudioContext | 快速渲染到 AudioBuffer（不输出到扬声器） |

---

## 转换与处理步骤说明

### 1. 录音过程中的片段区别
- **AudioWorkletNode**：每次固定 128 个采样点触发一次 `process` 方法
- **ScriptProcessorNode**（弃用）：可自定义采样点数量触发 `onaudioprocess`
- 录音结束后收集所有采样点（`decompress()` 作用）
- 最终获得 PCM [-1, 1] 采样点数组

### 2. 采样率转换
- 浏览器采样率不可更改（每个浏览器 `audioContext.sampleRate` 可能不同）
- 示例：44100Hz → 16000Hz
  - 减少比例 ≈ 44100/16000 ≈ 3，每 3 个相邻采样点取 1 个
  - `changeSampleBuffer()`：改变采样率（采样点个数）

### 3. 采样点数组 → Byte 数组（PCM 编码）
`pcmToByteDateArr()` 方法作用：
- **8位存储**：[-1, 1] → [0, 255]，1 字节 = 1 采样点
- **16位存储**：[-1, 1] → [-32768, 32767]，2 字节 = 1 采样点

### 4. PCM 数据播放
- 添加 WAV 头信息（44 字节）即可播放
- `encodeWAV()` 方法作用

---

## 基础 Demo：Boombox 播放器

参考：https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Using_Web_Audio_API

> Web Audio API 不会取代 `<audio>` 媒体元素，而是补充其功能。简单播放控制用 `<audio>`，复杂处理用 Web Audio API。

### 创建音频上下文
```javascript
const audioContext = new AudioContext();
```
> 仅处理数据不播放时可使用 `OfflineAudioContext`

### 从 audio 元素获取源
```html
<audio src="myCoolTrack.mp3"></audio>
```
```javascript
const audioElement = document.querySelector("audio");
const track = audioContext.createMediaElementSource(audioElement);
```

### 播放/暂停控制（处理自动播放策略）
```html
<button data-playing="false" role="switch" aria-checked="false">
  <span>Play/Pause</span>
</button>
```
```javascript
const playButton = document.querySelector("button");

// 连接音频图：源 → 目的地
track.connect(audioContext.destination);

playButton.addEventListener("click", () => {
  // 恢复挂起的上下文（自动播放策略）
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  if (playButton.dataset.playing === "false") {
    audioElement.play();
    playButton.dataset.playing = "true";
  } else {
    audioElement.pause();
    playButton.dataset.playing = "false";
  }
}, false);

// 播放结束重置状态
audioElement.addEventListener("ended", () => {
  playButton.dataset.playing = "false";
}, false);
```

### 音量控制（GainNode）
```javascript
const gainNode = audioContext.createGain();
// 重新连接：源 → 增益 → 目的地
track.connect(gainNode).connect(audioContext.destination);
```
```html
<input type="range" id="volume" min="0" max="2" value="1" step="0.01" />
```
```javascript
const volumeControl = document.querySelector("#volume");
volumeControl.addEventListener("input", () => {
  gainNode.gain.value = volumeControl.value;
}, false);
```
> 注意：`GainNode.gain` 是 `AudioParam` 类型，需设置 `.value` 属性

### 立体声平移（StereoPannerNode）
```javascript
const pannerOptions = { pan: 0 };
const panner = new StereoPannerNode(audioContext, pannerOptions);
```
```html
<input type="range" id="panner" min="-1" max="1" value="0" step="0.01" />
```
```javascript
const pannerControl = document.querySelector("#panner");
pannerControl.addEventListener("input", () => {
  panner.pan.value = pannerControl.value;
}, false);

// 完整音频图连接：源 → 增益 → 平移 → 目的地
track.connect(gainNode).connect(panner).connect(audioContext.destination);
```

> 更复杂的 3D 空间化使用 `PannerNode`

---

## 最佳实践

### 加载声音的四种方式
| 方式 | 适用场景 |
|------|----------|
| HTMLMediaElement (`<audio>`) | 全长音轨（流式加载） |
| AudioBuffer | 短采样音轨（更精确控制） |
| MediaStream（getUserMedia） | 摄像头/麦克风实时音频（WebRTC/录制） |
| 生成声音（OscillatorNode / 自定义 Buffer） | 合成器/乐器 |

### 跨浏览器兼容
- **standardized-audio-context**：npm 包，统一 API
- **howler.js**：跨浏览器多面手库
- **tone.js**：音乐合成/调度高级库
- **R-audio**：BBC React 组件库

### 自动播放策略处理
原则：从用户手势内部创建或恢复上下文

**正确方式一：手势内创建**
```javascript
button.addEventListener("click", () => {
  const audioCtx = new AudioContext();
  // ...
}, false);
```

**正确方式二：恢复挂起上下文**
```javascript
const audioCtx = new AudioContext();
button.addEventListener("click", () => {
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
}, false);
```

> OfflineAudioContext 使用 `startRendering()` 恢复

### 用户控制与可访问性
- 必须提供播放/停止、音量/静音控制
- 开关按钮建议使用 `role="switch"` ARIA 属性
- 大量值变化场景使用 `<input type="range">`

### AudioParam 设置
- 直接赋值：`gainNode.gain.value = 0.5;`
- 定时调度（优先）：`gainNode.gain.setValueAtTime(1, audioCtx.currentTime + 2);`
- 需要精确定时/调度时使用 AudioParam 方法

---

## 高级技术

### 振荡器 + 周期波 + 包络

#### 周期波 PeriodicWave
```javascript
const wave = new PeriodicWave(audioCtx, {
  real: wavetable.real,
  imag: wavetable.imag,
});
```
> 波表可参考：https://github.com/GoogleChromeLabs/web-audio-samples/

#### 振荡器 OscillatorNode
```javascript
function playSweep(time) {
  const osc = new OscillatorNode(audioCtx, {
    frequency: 380,
    type: "custom",
    periodicWave: wave,
  });
  osc.connect(audioCtx.destination);
  osc.start(time);
  osc.stop(time + 1);
}
```

#### 振幅包络（Attack / Release）
```html
<label for="attack">Attack</label>
<input type="range" id="attack" min="0" max="1" value="0.2" step="0.1" />

<label for="release">Release</label>
<input type="range" id="release" min="0" max="1" value="0.5" step="0.1" />
```
```javascript
let attackTime = 0.2;
document.querySelector("#attack").addEventListener("input", (ev) => {
  attackTime = parseFloat(ev.target.value);
}, false);

let releaseTime = 0.5;
document.querySelector("#release").addEventListener("input", (ev) => {
  releaseTime = parseFloat(ev.target.value);
}, false);
```

### 可视化（AnalyserNode）
`AnalyserNode` 不改变音频信号，仅提取数据：
- `getFloatFrequencyData()` → Float32Array 频域数据
- `getByteFrequencyData()` → Uint8Array 频域数据
- `getFloatTimeDomainData()` → Float32Array 时域波形
- `getByteTimeDomainData()` → Uint8Array 时域波形

### 空间化（PannerNode + AudioListener）
- 使用右手笛卡尔坐标
- 平移器：音频源位置向量 + 方向锥
- 收听者：位置向量 + 上/前方向向量

---

# 六、Media Session API

- 为 Web 应用播放的媒体提供元数据（供用户代理显示）
- 提供操作处理程序，访问平台媒体键：
  - 键盘、耳机、遥控器硬件键
  - 通知区域、移动设备锁屏软件键

---

# 七、WebRTC

- **WebRTC（Web 实时通信）**：在互联网对等点之间流传输实时音频/视频及任意数据，无需中介
- 相关 TS 文件：`./WebRTC/004WebRTCAPI.ts`

## 核心协议

### SCTP（流控制传输协议）
- 提供类似 UDP 和 TCP 的服务
- `RTCSctpTransport`：为对等连接上所有 `RTCDataChannel` 收发数据

### DTLS（数据包传输层安全性协议）
- `RTCDtlsTransport`：调用 `setLocalDescription()` / `setRemoteDescription()` 时创建
- bundlePolicy 控制 DTLS 传输数量：
  - `balanced`：音频、视频、数据通道分别创建
  - `max-compat`：每种媒体类型（音/视/数）各一个
  - `max-bundle`：仅一个，承载全部数据

> 协商过程中可能先创建多个单独传输，确认可捆绑后合并

## mediasoup - SFU 服务器

### 相关项目
- [mediasoup](https://github.com/versatica/mediasoup/)：C++ SFU + 服务器端 Node.js 模块
- [mediasoup-client](https://github.com/versatica/mediasoup-client/)：客户端 JavaScript 库
- [libmediasoupclient](https://github.com/versatica/libmediasoupclient/)：基于 libwebrtc 的 C++ 库
- [mediasoup-demo](https://github.com/versatica/mediasoup-demo/)：演示应用源码
- [mediasoup-broadcaster-demo](https://github.com/versatica/mediasoup-broadcaster-demo/)：C++ 广播演示
- 官网：https://mediasoup.org

### Windows 环境配置
```bash
node                # 安装 Node.js
# 安装 Python：参考 https://cloud.tencent.com/developer/article/1580729
chcp 65001          # CMD 命令行中文
npm cache verify    # 验证缓存
npm cache clean --force  # 强制清理缓存
```
