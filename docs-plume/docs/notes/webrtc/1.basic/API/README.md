---
title: WebRTC API 完全指南
createTime: 2026/08/18 18:21:25
permalink: /webrtc/1.basic/z83wyqhj/
---
# WebRTC API 完全指南

## 模块零：媒体采集[MediaCapture](00.media-capture.md)

**媒体采集** — getUserMedia、MediaStream、MediaStreamTrack、MediaRecorder、Constrain* 约束模型

```js
// 请求摄像头/麦克风
const stream = await navigator.mediaDevices.getUserMedia({
  video: { width: { ideal: 1920 }, frameRate: { min: 24 } },
  audio: { echoCancellation: true }
});

// 约束检查
const capabilities = videoTrack.getCapabilities();
const constraints = videoTrack.getConstraints();
await videoTrack.applyConstraints({ width: 1280 });

// 录制
const recorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
recorder.start(1000);  // 每秒抛一次 dataavailable
```

---

## 模块一：连接核心[RTCConnection](01.rtc-connection.md)

**连接核心** — WebRTC 核心、传输层、ICE、SCTP（RTCPeerConnection + RTCDtlsTransport + RTCIceTransport + RTCSctpTransport）

```js
const pc = new RTCPeerConnection({ iceServers: [...] });

// 获取传输层
const dtls = sender.transport.dtlsTransport;
const ice = sender.transport.iceTransport;

// 获取 SCTP（Data Channel 传输）
const sctp = pc.sctp;
```

---

## 模块二：媒体轨道[RTCRtp](02.rtcrpt.md)

**媒体轨道** — 发送器、接收器、收发器、轨道事件（RTCRtpSender + RTCRtpReceiver + RTCRtpTransceiver + RTCTrackEvent）

```js
// 添加轨道（自动创建 transceiver）
const sender = pc.addTrack(track, stream);
sender.replaceTrack(newTrack);  // 切换轨道

// 监听远端轨道
pc.ontrack = (event) => {
  event.track      // MediaStreamTrack
  event.streams   // 关联的流
  event.receiver  // RTCRtpReceiver
};

// transceiver 控制方向
transceiver.direction = 'sendrecv';  // sendonly/recvonly/inactive
```

---

## 模块三：数据通道[RTCDataChannel](03.rtc-data-channel.md)

**数据通道** — P2P 传输任意数据（RTCDataChannel + RTCDataChannelEvent + RTCDataChannelStats）

```js
// 主动创建
const dc = pc.createDataChannel('chat');

// 被动接收
pc.ondatachannel = (event) => {
  const dc = event.channel;
};

dc.send('Hello!');  // 发送
dc.onmessage = (event) => console.log(event.data);  // 接收
```

**与 WebSocket 对比**：

| 特性 | RTCDataChannel | WebSocket |
|------|---------------|-----------|
| 延迟 | 极低 | 低 |
| 复杂度 | 高（需ICE/STUN/TURN） | 低 |
| 适用场景 | 游戏/实时控制 | 常规通信 |

---

## 模块四：ICE 协商[RTCIce](04.rtc-ice.md)

**ICE 协商** — 候选、配对、参数、事件、统计

```js
// 监听 ICE 候选
pc.onicecandidate = (event) => {
  if (event.candidate) sendToPeer(event.candidate);
};

// 获取当前连接路径
const pair = iceTransport.getSelectedCandidatePair();
console.log(pair.local.ip, '→', pair.remote.ip);
```

---

## 模块五：会话与身份[RTCSession](05.rtc-session.md)

**会话与身份** — SDP 会话描述、身份断言、DTLS 证书

```js
// SDP 描述
{ type: 'offer', sdp: 'v=0\r\n...' }

// 身份验证
const identity = await pc.peerIdentity;

// 证书指纹
const fingerprints = cert.getFingerprints();
```

---

## 模块六：统计[RTCStats](06.rtc-stats.md)

**WebRTC 统计** — 所有统计接口汇总（RTCStatsReport、RTCCodecStats、RTCCertificateStats、RTCTransportStats、RTCAudioSourceStats、RTCVideoSourceStats、RTPStreamStats）

```js
const stats = await pc.getStats();
stats.forEach(report => {
  console.log(`[${report.type}] ${report.id}`);
});
```

---

## 模块七：编码变换[EncodedTransform](07.encoded-transform.md)

**编码变换** — 在Worker中修改编码后的音视频帧

```
主线程                           Worker
RTCRtpScriptTransform ──────────→ rtctransform 事件
                                    │
                              RTCRtpScriptTransformer
                                    │
                              readable ──→ TransformStream ──→ writable
```

**用途**：端到端加密、内容过滤、截图等

---

## 模块八：错误处理[RTCError](08.rtc-error.md)

**WebRTC 错误** — 包含错误码和详情（RTCError + RTCErrorEvent）

```js
dataChannel.addEventListener("error", (event) => {
  if (event.error.errorDetail === "sdp-syntax-error") {
    console.log(`SDP 第 ${event.error.sdpLineNumber} 行语法错误`);
  }
});
```

---

## 模块九：DTMF（电话按键）[DTMF（汇总）](09.dtmf.md)

**DTMF** — 发送电话按键音（与传统电话网络交互）

```js
// 发送DTMF
const dtmf = sender.dtmf;
dtmf.insertDTMF('1234', 100, 50);

dtmf.ontonechange = (event) => {
  console.log('当前音调:', event.tone);
};
```

**注意**：WebRTC设备之间不能用，只能与传统电话交互

---

## 附录：WebRTC 类型定义

完整的 WebRTC 浏览器 API TypeScript 类型定义（带中文注释），覆盖媒体采集、连接核心、RTP、数据通道、ICE、DTMF、DTLS、错误处理等全部接口。

@[code](./webrtc.types.d.ts)
