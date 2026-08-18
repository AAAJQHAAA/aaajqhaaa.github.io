/**
 * @file 标准 WebRTC 浏览器 API 类型定义（带中文注释）
 * @coverage
 *   - Media Capture and Streams（媒体采集：getUserMedia、MediaStream、MediaStreamTrack）
 *   - WebRTC 1.0（RTCPeerConnection 系列 + ICE/DTLS/SRTP/SCTP）
 *   - MediaRecorder（媒体录制）
 *   - RTP Sender / Receiver / Transceiver + getStats 统计
 *   - RTCDataChannel 数据通道 + DTMF
 */

// ===========================================================================
// 一、约束类型（Constrain*）
//   用于 getUserMedia / applyConstraints 的能力约束参数
// ===========================================================================
/** BlobEvent 初始化字典，MediaRecorder 的 dataavailable 事件构造参数 */
interface BlobEventInit extends EventInit {
    data: Blob;
    timecode?: DOMHighResTimeStamp;
}
/** 布尔或字符串约束参数（exact 表示必须满足，ideal 表示希望满足） */
interface ConstrainBooleanOrDOMStringParameters {
    exact?: boolean | string;
    ideal?: boolean | string;
}
/** 布尔约束参数，用于指定能力的精确/理想取值 */
interface ConstrainBooleanParameters {
    exact?: boolean;
    ideal?: boolean;
}
/** 字符串约束参数，用于指定枚举型能力的精确/理想取值 */
interface ConstrainDOMStringParameters {
    exact?: string | string[];
    ideal?: string | string[];
}
/** 浮点型范围约束，在 DoubleRange 基础上增加 exact/ideal 精确/理想取值 */
interface ConstrainDoubleRange extends DoubleRange {
    exact?: number;
    ideal?: number;
}
/** 无符号长整型范围约束，在 ULongRange 基础上增加 exact/ideal */
interface ConstrainULongRange extends ULongRange {
    exact?: number;
    ideal?: number;
}
// ===========================================================================
// 二、媒体采集与流（Media Capture and Streams）
//   摄像头/麦克风/屏幕采集 + MediaStream / MediaStreamTrack 基础模型
// ===========================================================================
/** MediaRecorder 构造参数（比特率、MIME 类型等录制选项） */
interface MediaRecorderOptions {
    audioBitsPerSecond?: number;
    bitsPerSecond?: number;
    mimeType?: string;
    videoBitsPerSecond?: number;
}
/** MediaStreamAudioSourceNode 构造参数（WebAudio 节点配置） */
interface MediaStreamAudioSourceOptions {
    mediaStream: MediaStream;
}
/** 媒体流请求约束（传给 getUserMedia，指定 audio/video 要求） */
interface MediaStreamConstraints {
    audio?: boolean | MediaTrackConstraints;
    peerIdentity?: string;
    preferCurrentTab?: boolean;
    video?: boolean | MediaTrackConstraints;
}
/** MediaStreamTrackEvent 初始化字典 */
interface MediaStreamTrackEventInit extends EventInit {
    track: MediaStreamTrack;
}
/** 媒体轨道的设备能力（每个 constrainable 属性的取值范围/可取值列表） */
interface MediaTrackCapabilities {
    aspectRatio?: DoubleRange;
    autoGainControl?: boolean[];
    backgroundBlur?: boolean[];
    channelCount?: ULongRange;
    deviceId?: string;
    displaySurface?: string;
    echoCancellation?: (boolean | string)[];
    facingMode?: string[];
    frameRate?: DoubleRange;
    groupId?: string;
    height?: ULongRange;
    noiseSuppression?: boolean[];
    sampleRate?: ULongRange;
    sampleSize?: ULongRange;
    width?: ULongRange;
}
/** 单套媒体轨道约束（aspectRatio / frameRate / width / echoCancellation 等） */
interface MediaTrackConstraintSet {
    aspectRatio?: ConstrainDouble;
    autoGainControl?: ConstrainBoolean;
    backgroundBlur?: ConstrainBoolean;
    channelCount?: ConstrainULong;
    deviceId?: ConstrainDOMString;
    displaySurface?: ConstrainDOMString;
    echoCancellation?: ConstrainBooleanOrDOMString;
    facingMode?: ConstrainDOMString;
    frameRate?: ConstrainDouble;
    groupId?: ConstrainDOMString;
    height?: ConstrainULong;
    noiseSuppression?: ConstrainBoolean;
    sampleRate?: ConstrainULong;
    sampleSize?: ConstrainULong;
    width?: ConstrainULong;
}
/** 完整的媒体轨道约束，包含基础约束集 + advanced 高级回退序列 */
interface MediaTrackConstraints extends MediaTrackConstraintSet {
    advanced?: MediaTrackConstraintSet[];
}
/** 媒体轨道当前生效的实际设置（getSettings 返回） */
interface MediaTrackSettings {
    aspectRatio?: number;
    autoGainControl?: boolean;
    backgroundBlur?: boolean;
    channelCount?: number;
    deviceId?: string;
    displaySurface?: string;
    echoCancellation?: boolean | string;
    facingMode?: string;
    frameRate?: number;
    groupId?: string;
    height?: number;
    noiseSuppression?: boolean;
    sampleRate?: number;
    sampleSize?: number;
    torch?: boolean;
    whiteBalanceMode?: string;
    width?: number;
    zoom?: number;
}
/** 当前浏览器支持的可约束属性列表（true 表示支持） */
interface MediaTrackSupportedConstraints {
    aspectRatio?: boolean;
    autoGainControl?: boolean;
    backgroundBlur?: boolean;
    channelCount?: boolean;
    deviceId?: boolean;
    displaySurface?: boolean;
    echoCancellation?: boolean;
    facingMode?: boolean;
    frameRate?: boolean;
    groupId?: boolean;
    height?: boolean;
    noiseSuppression?: boolean;
    sampleRate?: boolean;
    sampleSize?: boolean;
    width?: boolean;
}
// ===========================================================================
// 三、WebRTC 连接核心 · 配置字典
//   RTCConfiguration / RTCIceServer / Offer-Answer / SDP / ICE 候选 等 Init 接口
// ===========================================================================
/** SDP Answer 创建参数（继承自 RTCOfferAnswerOptions，通常为空） */
interface RTCAnswerOptions extends RTCOfferAnswerOptions {
}
/** RTCCertificate 过期时间配置（expires 字段，毫秒时间戳） */
interface RTCCertificateExpiration {
    expires?: number;
}
/** RTCPeerConnection 全局配置：ICE 服务器、bundle policy、证书、ICE 策略等 */
interface RTCConfiguration {
    bundlePolicy?: RTCBundlePolicy;
    certificates?: RTCCertificate[];
    iceCandidatePoolSize?: number;
    iceServers?: RTCIceServer[];
    iceTransportPolicy?: RTCIceTransportPolicy;
    rtcpMuxPolicy?: RTCRtcpMuxPolicy;
}
/** RTCDTMFToneChangeEvent 初始化字典 */
interface RTCDTMFToneChangeEventInit extends EventInit {
    tone?: string;
}
/** RTCDataChannelEvent 初始化字典（包含新打开的 channel） */
interface RTCDataChannelEventInit extends EventInit {
    channel: RTCDataChannel;
}
/** RTCDataChannel 创建参数：id、ordered、maxRetransmits、protocol、negotiated 等 */
interface RTCDataChannelInit {
    id?: number;
    maxPacketLifeTime?: number;
    maxRetransmits?: number;
    negotiated?: boolean;
    ordered?: boolean;
    protocol?: string;
}
/** RTCErrorEvent 初始化字典（包含 RTCError 错误对象） */
interface RTCErrorEventInit extends EventInit {
    error: RTCError;
}
/** RTCError 初始化字典：errorDetail 及各子类型的附加字段 */
interface RTCErrorInit {
    errorDetail: RTCErrorDetailType;
    httpRequestStatusCode?: number;
    receivedAlert?: number;
    sctpCauseCode?: number;
    sdpLineNumber?: number;
    sentAlert?: number;
}
/** RTCIceCandidate 初始化字典：candidate 字符串、sdpMid/sdpMLineIndex 定位、ufrag */
interface RTCIceCandidateInit {
    candidate?: string;
    sdpMLineIndex?: number | null;
    sdpMid?: string | null;
    usernameFragment?: string | null;
}
/** ICE 候选对统计：本地/远程候选 ID、字节数、RTT、状态、提名等 */
interface RTCIceCandidatePairStats extends RTCStats {
    availableIncomingBitrate?: number;
    availableOutgoingBitrate?: number;
    bytesDiscardedOnSend?: number;
    bytesReceived?: number;
    bytesSent?: number;
    consentRequestsSent?: number;
    currentRoundTripTime?: number;
    lastPacketReceivedTimestamp?: DOMHighResTimeStamp;
    lastPacketSentTimestamp?: DOMHighResTimeStamp;
    localCandidateId: string;
    nominated?: boolean;
    packetsDiscardedOnSend?: number;
    packetsReceived?: number;
    packetsSent?: number;
    remoteCandidateId: string;
    requestsReceived?: number;
    requestsSent?: number;
    responsesReceived?: number;
    responsesSent?: number;
    state: RTCStatsIceCandidatePairState;
    totalRoundTripTime?: number;
    transportId: string;
}
/** ICE 服务器配置：STUN/TURN URL、username、credential（用于穿越 NAT） */
interface RTCIceServer {
    credential?: string;
    urls: string | string[];
    username?: string;
}
/** Offer/Answer 通用选项（WebIDL 基类，通常为空） */
interface RTCOfferAnswerOptions {
}
/** SDP Offer 创建参数：是否接收音视频、是否触发 ICE restart */
interface RTCOfferOptions extends RTCOfferAnswerOptions {
    iceRestart?: boolean;
    offerToReceiveAudio?: boolean;
    offerToReceiveVideo?: boolean;
}
/** ICE 候选错误事件初始化字典：地址、端口、错误码、URL */
interface RTCPeerConnectionIceErrorEventInit extends EventInit {
    address?: string | null;
    errorCode: number;
    errorText?: string;
    port?: number | null;
    url?: string;
}
/** ICE 候选事件初始化字典（包含新收集的 candidate） */
interface RTCPeerConnectionIceEventInit extends EventInit {
    candidate?: RTCIceCandidate | null;
}
/** RTCP 参数：cname（规范名）、是否启用 reduced-size RTCP */
interface RTCRtcpParameters {
    cname?: string;
    reducedSize?: boolean;
}
/** RTP 能力：支持的编解码器列表 + 支持的 RTP 头扩展列表 */
interface RTCRtpCapabilities {
    codecs: RTCRtpCodec[];
    headerExtensions: RTCRtpHeaderExtensionCapability[];
}
/** RTP 编解码器信息：MIME、时钟频率、通道数、SDP a=fmtp 行 */
interface RTCRtpCodec {
    channels?: number;
    clockRate: number;
    mimeType: string;
    sdpFmtpLine?: string;
}
/** RTP 编解码器参数：在 RTCRtpCodec 基础上增加 payloadType */
interface RTCRtpCodecParameters extends RTCRtpCodec {
    payloadType: number;
}
/** RTP 编码参数（单路编码层）：是否激活、最大码率、最大帧率、缩放比例、优先级等 */
interface RTCRtpEncodingParameters extends RTCRtpCodingParameters {
    active?: boolean;
    maxBitrate?: number;
    maxFramerate?: number;
    networkPriority?: RTCPriorityType;
    priority?: RTCPriorityType;
    scaleResolutionDownBy?: number;
}
/** RTP 头扩展能力：URI 标识一种头扩展 */
interface RTCRtpHeaderExtensionCapability {
    uri: string;
}
/** RTP 头扩展参数：URI、本地 ID、是否加密 */
interface RTCRtpHeaderExtensionParameters {
    encrypted?: boolean;
    id: number;
    uri: string;
}
/** RTP 参数合集：编解码器、头扩展、RTCP */
interface RTCRtpParameters {
    codecs: RTCRtpCodecParameters[];
    headerExtensions: RTCRtpHeaderExtensionParameters[];
    rtcp: RTCRtcpParameters;
}
/** RTP 接收端参数（继承 RTCRtpParameters，无额外字段） */
interface RTCRtpReceiveParameters extends RTCRtpParameters {
}
/** RTP 发送端参数：多层 encodings 配置、退化偏好、transactionId（供 setParameters 幂等） */
interface RTCRtpSendParameters extends RTCRtpParameters {
    degradationPreference?: RTCDegradationPreference;
    encodings: RTCRtpEncodingParameters[];
    transactionId: string;
}
/** addTransceiver() 初始化参数：direction、sendEncodings、关联的 MediaStream */
interface RTCRtpTransceiverInit {
    direction?: RTCRtpTransceiverDirection;
    sendEncodings?: RTCRtpEncodingParameters[];
    streams?: MediaStream[];
}
/** 会话描述初始化字典：type（offer/answer/pranswer/rollback）+ SDP 文本 */
interface RTCSessionDescriptionInit {
    sdp?: string;
    type: RTCSdpType;
}
/** 统计项基类：id（唯一标识）、timestamp、type（统计类型） */
interface RTCStats {
    id: string;
    timestamp: DOMHighResTimeStamp;
    type: RTCStatsType;
}
/** RTCTrackEvent 初始化字典：receiver/track/streams/transceiver */
interface RTCTrackEventInit extends EventInit {
    receiver: RTCRtpReceiver;
    streams?: MediaStream[];
    track: MediaStreamTrack;
    transceiver: RTCRtpTransceiver;
}
// ===========================================================================
// 四、WebRTC 连接核心 · RTCPeerConnection
//   【核心接口】对等连接、ICE/DTLS/SRTP 全生命周期管理
// ===========================================================================
/** Blob 事件：MediaRecorder.dataavailable 触发，携带录制好的 Blob 数据块 */
interface BlobEvent extends Event {
    /**
     * BlobEvent 接口的 **`data`** 只读属性表示与该事件关联的 Blob。
     */
    readonly data: Blob;
    /**
     * BlobEvent 接口的 **`timecode`** 只读属性指示第一个数据块的时间戳与该录制器产生的第一个 BlobEvent 中第一个数据块的时间戳之差。
     */
    readonly timecode: DOMHighResTimeStamp;
}
declare var BlobEvent: {
    prototype: BlobEvent;
    new(type: string, eventInitDict: BlobEventInit): BlobEvent;
};
// ===========================================================================
// 四-2. 媒体设备入口 navigator.mediaDevices
//   设备枚举、getUserMedia、getDisplayMedia
// ===========================================================================

/** 输入设备信息（继承 MediaDeviceInfo，增加 getCapabilities 以查询能力） */
interface InputDeviceInfo extends MediaDeviceInfo {
    /**
     * InputDeviceInfo 接口的 **`getCapabilities()`** 方法返回一个 MediaTrackCapabilities 对象，描述该设备的 MediaStream 的主音频或视频轨道。
     */
    getCapabilities(): MediaTrackCapabilities;
}

declare var InputDeviceInfo: {
    prototype: InputDeviceInfo;
    new(): InputDeviceInfo;
};

/** 媒体设备基本信息：deviceId、groupId、kind（种类）、label（名称） */
interface MediaDeviceInfo {
    /**
     * MediaDeviceInfo 接口的 **`deviceId`** 只读属性返回一个字符串，作为所表示设备的标识符，并在会话之间持久化保存。
     */
    readonly deviceId: string;
    /**
     * MediaDeviceInfo 接口的 **`groupId`** 只读属性返回一个字符串，作为组标识符。
     */
    readonly groupId: string;
    /**
     * MediaDeviceInfo 接口的 **`kind`** 只读属性返回一个枚举值，为 "videoinput"、"audioinput" 或 "audiooutput"。
     */
    readonly kind: MediaDeviceKind;
    /**
     * MediaDeviceInfo 接口的 **`label`** 只读属性返回一个描述该设备的字符串（例如 "External USB Webcam"）。
     */
    readonly label: string;
    /**
     * MediaDeviceInfo 接口的 **`toJSON()`** 方法是一个序列化器；它返回 MediaDeviceInfo 对象的 JSON 表示。
     */
    toJSON(): any;
}

declare var MediaDeviceInfo: {
    prototype: MediaDeviceInfo;
    new(): MediaDeviceInfo;
};

/** MediaDevices 事件映射表（devicechange） */
interface MediaDevicesEventMap {
    "devicechange": Event;
}

/** 媒体设备入口：navigator.mediaDevices，负责 enumerateDevices/getUserMedia/getDisplayMedia */
interface MediaDevices extends EventTarget {
    ondevicechange: ((this: MediaDevices, ev: Event) => any) | null;
    /**
     * MediaDevices 接口的 **`enumerateDevices()`** 方法请求获取当前可用的媒体输入和输出设备列表（如麦克风、摄像头、耳机等）。返回的 Promise 会以一个描述这些设备的 MediaDeviceInfo 对象数组来 resolve。
     */
    enumerateDevices(): Promise<MediaDeviceInfo[]>;
    /**
     * MediaDevices 接口的 **`getDisplayMedia()`** 方法提示用户选择并授权捕获显示器或其部分内容（如某个窗口）作为 MediaStream。
     */
    getDisplayMedia(options?: DisplayMediaStreamOptions): Promise<MediaStream>;
    /**
     * MediaDevices 接口的 **`getSupportedConstraints()`** 方法返回一个基于 MediaTrackSupportedConstraints 字典的对象，其成员字段分别指定了用户代理支持的可约束属性。
     */
    getSupportedConstraints(): MediaTrackSupportedConstraints;
    /**
     * MediaDevices 接口的 **`getUserMedia()`** 方法提示用户授权使用某个媒体输入，该输入会产生一个包含所请求媒体类型轨道的 MediaStream。
     */
    getUserMedia(constraints?: MediaStreamConstraints): Promise<MediaStream>;
    addEventListener<K extends keyof MediaDevicesEventMap>(type: K, listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaDevicesEventMap>(type: K, listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MediaDevices: {
    prototype: MediaDevices;
    new(): MediaDevices;
};


// ===========================================================================
// 四-3. 媒体录制 MediaRecorder
//   把 MediaStream 录制成 Blob（WebM 等）
// ===========================================================================

/** MediaRecorder 事件映射表（dataavailable / error / start / stop / pause / resume） */
interface MediaRecorderEventMap {
    "dataavailable": BlobEvent;
    "error": ErrorEvent;
    "pause": Event;
    "resume": Event;
    "start": Event;
    "stop": Event;
}

/** 媒体录制器：把 MediaStream 录制成 Blob（支持 WebM 等格式） */
interface MediaRecorder extends EventTarget {
    /**
     * MediaRecorder 接口的 **`audioBitsPerSecond`** 只读属性返回当前使用的音频编码比特率。
     */
    readonly audioBitsPerSecond: number;
    /**
     * MediaRecorder 接口的 **`mimeType`** 只读属性返回创建 MediaRecorder 对象时指定的 MIME 媒体类型；如果未指定，则返回浏览器选择的类型。这是将所有录制数据写入磁盘后所得文件的格式。
     */
    readonly mimeType: string;
    ondataavailable: ((this: MediaRecorder, ev: BlobEvent) => any) | null;
    onerror: ((this: MediaRecorder, ev: ErrorEvent) => any) | null;
    onpause: ((this: MediaRecorder, ev: Event) => any) | null;
    onresume: ((this: MediaRecorder, ev: Event) => any) | null;
    onstart: ((this: MediaRecorder, ev: Event) => any) | null;
    onstop: ((this: MediaRecorder, ev: Event) => any) | null;
    /**
     * MediaRecorder 接口的 **`state`** 只读属性返回当前 MediaRecorder 对象的状态。
     */
    readonly state: RecordingState;
    /**
     * MediaRecorder 接口的 **`stream`** 只读属性返回创建 MediaRecorder 时传入 MediaRecorder() 构造函数的流。
     */
    readonly stream: MediaStream;
    /**
     * MediaRecorder 接口的 **`videoBitsPerSecond`** 只读属性返回当前使用的视频编码比特率。
     */
    readonly videoBitsPerSecond: number;
    /**
     * MediaRecorder 接口的 **`pause()`** 方法用于暂停媒体流的录制。
     */
    pause(): void;
    /**
     * MediaRecorder 接口的 **`requestData()`** 方法用于触发一个 dataavailable 事件，该事件携带调用该方法时所捕获媒体的 Blob 对象。随后可以按需获取并处理该数据。
     */
    requestData(): void;
    /**
     * MediaRecorder 接口的 **`resume()`** 方法用于在之前已暂停的情况下恢复媒体录制。
     */
    resume(): void;
    /**
     * MediaRecorder 接口的 **`start()`** 方法开始将媒体录制到一个或多个 Blob 对象中。
     */
    start(timeslice?: number): void;
    /**
     * MediaRecorder 接口的 **`stop()`** 方法用于停止媒体捕获。
     */
    stop(): void;
    addEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaRecorderEventMap>(type: K, listener: (this: MediaRecorder, ev: MediaRecorderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MediaRecorder: {
    prototype: MediaRecorder;
    new(stream: MediaStream, options?: MediaRecorderOptions): MediaRecorder;
    /**
     * MediaRecorder 接口的 **`isTypeSupported()`** 静态方法返回一个布尔值，如果指定的 MIME 媒体类型是用户代理应当能够成功录制的类型，则为 true。
     */
    isTypeSupported(type: string): boolean;
};


// ===========================================================================
// 四-4. MediaStream / MediaStreamTrack 及 WebAudio 桥接
//   音视频轨的增删、启停、约束、clone、WebAudio 互联
// ===========================================================================

/** MediaStream 事件映射表（addtrack / removetrack） */
interface MediaStreamEventMap {
    "addtrack": MediaStreamTrackEvent;
    "removetrack": MediaStreamTrackEvent;
}

/** 媒体流：包含多条 MediaStreamTrack（音频/视频轨） */
interface MediaStream extends EventTarget {
    /**
     * MediaStream 接口的 **`active`** 只读属性返回一个布尔值，如果流当前处于活动状态则为 true，否则返回 false。如果流中至少有一条 MediaStreamTrack 的 MediaStreamTrack.readyState 属性未设置为 ended，则该流被视为活动状态。一旦所有轨道都结束，流的 active 属性将变为 false。
     */
    readonly active: boolean;
    /**
     * MediaStream 接口的 **`id`** 只读属性是一个包含 36 个字符的字符串，表示该对象的唯一标识符（GUID）。
     */
    readonly id: string;
    onaddtrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => any) | null;
    onremovetrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => any) | null;
    /**
     * MediaStream 接口的 **`addTrack()`** 方法向流中添加一条新轨道。该轨道以 MediaStreamTrack 类型的参数指定。
     */
    addTrack(track: MediaStreamTrack): void;
    /**
     * MediaStream 接口的 **`clone()`** 方法创建 MediaStream 的一个副本。这个新的 MediaStream 对象具有一个新的唯一 id，并包含调用 clone() 的 MediaStream 中每条 MediaStreamTrack 的副本。
     */
    clone(): MediaStream;
    /**
     * MediaStream 接口的 **`getAudioTracks()`** 方法返回一个序列，表示该流轨道集合中所有 MediaStreamTrack.kind 为 audio 的 MediaStreamTrack 对象。
     */
    getAudioTracks(): MediaStreamTrack[];
    /**
     * MediaStream 接口的 **`getTrackById()`** 方法返回一个表示具有指定 ID 字符串轨道的 MediaStreamTrack 对象。如果没有指定 ID 的轨道，则该方法返回 null。
     */
    getTrackById(trackId: string): MediaStreamTrack | null;
    /**
     * MediaStream 接口的 **`getTracks()`** 方法返回一个序列，表示该流轨道集合中所有的 MediaStreamTrack 对象，不考虑 MediaStreamTrack.kind。
     */
    getTracks(): MediaStreamTrack[];
    /**
     * MediaStream 接口的 **`getVideoTracks()`** 方法返回一个表示该流中视频轨道的 MediaStreamTrack 对象序列。
     */
    getVideoTracks(): MediaStreamTrack[];
    /**
     * MediaStream 接口的 **`removeTrack()`** 方法从流中移除一条 MediaStreamTrack。
     */
    removeTrack(track: MediaStreamTrack): void;
    addEventListener<K extends keyof MediaStreamEventMap>(type: K, listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaStreamEventMap>(type: K, listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MediaStream: {
    prototype: MediaStream;
    new(): MediaStream;
    new(stream: MediaStream): MediaStream;
    new(tracks: MediaStreamTrack[]): MediaStream;
};

/** WebAudio 目标节点：把 WebAudio 输出转成 MediaStream（录音/推流用） */
interface MediaStreamAudioDestinationNode extends AudioNode {
    /**
     * AudioContext 接口的 **`stream`** 属性表示一个 MediaStream，其中包含一条音频 MediaStreamTrack，其通道数与节点本身的通道数相同。
     */
    readonly stream: MediaStream;
}

declare var MediaStreamAudioDestinationNode: {
    prototype: MediaStreamAudioDestinationNode;
    new(context: AudioContext, options?: AudioNodeOptions): MediaStreamAudioDestinationNode;
};

/** WebAudio 源节点：把 MediaStream 的音频接入 WebAudio 管线做处理 */
interface MediaStreamAudioSourceNode extends AudioNode {
    /**
     * MediaStreamAudioSourceNode 接口的只读 **`mediaStream`** 属性指示包含该节点接收音频所用音频轨道的 MediaStream。
     */
    readonly mediaStream: MediaStream;
}

declare var MediaStreamAudioSourceNode: {
    prototype: MediaStreamAudioSourceNode;
    new(context: AudioContext, options: MediaStreamAudioSourceOptions): MediaStreamAudioSourceNode;
};

/** MediaStreamTrack 事件映射表（ended / mute / unmute） */
interface MediaStreamTrackEventMap {
    "ended": Event;
    "mute": Event;
    "unmute": Event;
}

/** 媒体轨道：一条单独的音频或视频轨（来自摄像头、麦克风或屏幕） */
interface MediaStreamTrack extends EventTarget {
    /**
     * MediaStreamTrack 接口的 **`contentHint`** 属性是一个字符串，用于提示轨道包含的内容类型。可取值取决于 MediaStreamTrack.kind 属性的值。
     */
    contentHint: string;
    /**
     * MediaStreamTrack 接口的 **`enabled`** 属性是一个布尔值，如果允许轨道渲染源流则为 true，否则为 false。这可用于有意将轨道静音。
     */
    enabled: boolean;
    /**
     * MediaStreamTrack 接口的 **`id`** 只读属性返回一个字符串，包含由用户代理生成的轨道唯一标识符（GUID）。
     */
    readonly id: string;
    /**
     * MediaStreamTrack 接口的 **`kind`** 只读属性返回一个字符串，如果轨道是音频轨道则设为 "audio"，如果是视频轨道则设为 "video"。即使轨道与其源解除关联，该值也不会改变。
     */
    readonly kind: string;
    /**
     * MediaStreamTrack 接口的 **`label`** 只读属性返回一个字符串，包含用户代理分配的、用于标识轨道源的标签，如 "internal microphone"。
     */
    readonly label: string;
    /**
     * MediaStreamTrack 接口的 **`muted`** 只读属性返回一个布尔值，指示轨道当前是否无法提供媒体输出。
     */
    readonly muted: boolean;
    onended: ((this: MediaStreamTrack, ev: Event) => any) | null;
    onmute: ((this: MediaStreamTrack, ev: Event) => any) | null;
    onunmute: ((this: MediaStreamTrack, ev: Event) => any) | null;
    /**
     * MediaStreamTrack 接口的 **`readyState`** 只读属性返回一个给出轨道状态的枚举值。
     */
    readonly readyState: MediaStreamTrackState;
    /**
     * MediaStreamTrack 接口的 **`applyConstraints()`** 方法向轨道应用一组约束；这些约束让网站或应用为轨道的可约束属性（如帧率、尺寸、回声消除等）设定理想值和可接受的取值范围。
     */
    applyConstraints(constraints?: MediaTrackConstraints): Promise<void>;
    /**
     * MediaStreamTrack 接口的 **`clone()`** 方法创建 MediaStreamTrack 的一个副本。这个新的 MediaStreamTrack 对象除了唯一 id 外完全相同。
     */
    clone(): MediaStreamTrack;
    /**
     * MediaStreamTrack 接口的 **`getCapabilities()`** 方法返回一个对象，根据平台和用户代理详细说明关联 MediaStreamTrack 的每个可约束属性可接受的值或取值范围。
     */
    getCapabilities(): MediaTrackCapabilities;
    /**
     * MediaStreamTrack 接口的 **`getConstraints()`** 方法返回一个 MediaTrackConstraints 对象，包含先前通过调用 applyConstraints() 为轨道设置的约束集合。这些约束指示网站或应用指定的、所含可约束属性所需或可接受的值和取值范围。
     */
    getConstraints(): MediaTrackConstraints;
    /**
     * MediaStreamTrack 接口的 **`getSettings()`** 方法返回一个 MediaTrackSettings 对象，包含当前 MediaStreamTrack 的每个可约束属性的当前值。
     */
    getSettings(): MediaTrackSettings;
    /**
     * MediaStreamTrack 接口的 **`stop()`** 方法停止轨道。
     */
    stop(): void;
    addEventListener<K extends keyof MediaStreamTrackEventMap>(type: K, listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaStreamTrackEventMap>(type: K, listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var MediaStreamTrack: {
    prototype: MediaStreamTrack;
    new(): MediaStreamTrack;
};

/** 轨道增删事件（addtrack/removetrack 触发，包含关联的 track） */
interface MediaStreamTrackEvent extends Event {
    /**
     * MediaStreamTrackEvent 接口的 **`track`** 只读属性返回与该事件关联的 MediaStreamTrack。
     */
    readonly track: MediaStreamTrack;
}

declare var MediaStreamTrackEvent: {
    prototype: MediaStreamTrackEvent;
    new(type: string, eventInitDict: MediaStreamTrackEventInit): MediaStreamTrackEvent;
};


// ===========================================================================
// 四-5. 约束错误 OverconstrainedError
//   约束不满足时抛出的 DOMException 子类
// ===========================================================================

/** 过度约束错误：当 getUserMedia/applyConstraints 提出的约束组合无法被设备满足时抛出 */
interface OverconstrainedError extends DOMException {
    /**
     * OverconstrainedError 接口的 **`constraint`** 只读属性返回构造函数中提供的约束，即未被满足的约束。
     */
    readonly constraint: string;
}

declare var OverconstrainedError: {
    prototype: OverconstrainedError;
    new(constraint: string, message?: string): OverconstrainedError;
};


// ===========================================================================
// 五、DTLS 证书 RTCCertificate
//   预生成 DTLS 证书并复用到多个 RTCPeerConnection
// ===========================================================================

/** DTLS 证书：用于握手鉴权，可用 RTCPeerConnection.generateCertificate() 预生成 */
interface RTCCertificate {
    /**
     * RTCCertificate 接口的只读 **`expires`** 属性返回证书的过期时间。
     */
    readonly expires: EpochTimeStamp;
    /**
     * RTCCertificate 接口的 **`getFingerprints()`** 方法用于获取证书指纹数组。
     */
    getFingerprints(): RTCDtlsFingerprint[];
}

declare var RTCCertificate: {
    prototype: RTCCertificate;
    new(): RTCCertificate;
};


// ===========================================================================
// 六、DTMF 发送 RTCDTMFSender
//   在 RTP 音频通道上发送电话事件 DTMF 双音多频信号
// ===========================================================================

/** RTCDTMFSender 事件映射表（tonechange） */
interface RTCDTMFSenderEventMap {
    "tonechange": RTCDTMFToneChangeEvent;
}

/** DTMF 发送器：通过 RTP 电话事件发送 DTMF 双音多频信号（按键音） */
interface RTCDTMFSender extends EventTarget {
    /**
     * RTCDTMFSender 接口的 **`canInsertDTMF`** 只读属性返回一个布尔值，指示 RTCDTMFSender 是否能够通过 RTCPeerConnection 发送 DTMF 音调。
     */
    readonly canInsertDTMF: boolean;
    ontonechange: ((this: RTCDTMFSender, ev: RTCDTMFToneChangeEvent) => any) | null;
    /**
     * RTCDTMFSender 接口的 **`toneBuffer`** 属性返回一个字符串，包含当前排队等待通过 RTCPeerConnection 发送给远端的 DTMF 音调列表。要将音调放入缓冲区，请调用 insertDTMF()。
     */
    readonly toneBuffer: string;
    /**
     * RTCDTMFSender 接口的 **`insertDTMF()`** 方法通过 RTCPeerConnection 向远端发送 DTMF 音调。
     */
    insertDTMF(tones: string, duration?: number, interToneGap?: number): void;
    addEventListener<K extends keyof RTCDTMFSenderEventMap>(type: K, listener: (this: RTCDTMFSender, ev: RTCDTMFSenderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCDTMFSenderEventMap>(type: K, listener: (this: RTCDTMFSender, ev: RTCDTMFSenderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var RTCDTMFSender: {
    prototype: RTCDTMFSender;
    new(): RTCDTMFSender;
};

/** DTMF 音调变化事件：新的 DTMF 字符开始播放时触发 */
interface RTCDTMFToneChangeEvent extends Event {
    /**
     * 只读属性 **`RTCDTMFToneChangeEvent.tone`** 返回刚刚开始播放的 DTMF 字符，如果所有排队的音调都已播放完毕（即 RTCDTMFSender.toneBuffer 为空），则返回空字符串（""）。
     */
    readonly tone: string;
}

declare var RTCDTMFToneChangeEvent: {
    prototype: RTCDTMFToneChangeEvent;
    new(type: string, eventInitDict?: RTCDTMFToneChangeEventInit): RTCDTMFToneChangeEvent;
};


// ===========================================================================
// 七、数据通道 RTCDataChannel
//   在 RTCPeerConnection 之上的双向消息通道（基于 SCTP/DTLS）
// ===========================================================================

/** RTCDataChannel 事件映射表（open / message / close / closing / bufferedamountlow / error） */
interface RTCDataChannelEventMap {
    "bufferedamountlow": Event;
    "close": Event;
    "closing": Event;
    "error": RTCErrorEvent;
    "message": MessageEvent;
    "open": Event;
}

/** WebRTC 数据通道：在 RTCPeerConnection 上提供双向、可靠或半可靠的二进制/文本消息传输 */
interface RTCDataChannel extends EventTarget {
    /**
     * RTCDataChannel 接口的 **`binaryType`** 属性是一个字符串，指定用于表示 RTCDataChannel 上接收到的二进制数据的对象类型。WebSocket.binaryType 属性允许的值在此处同样允许：如果使用 Blob 对象则为 blob，如果使用 ArrayBuffer 对象则为 arraybuffer。默认值为 arraybuffer。
     */
    binaryType: BinaryType;
    /**
     * RTCDataChannel 的只读属性 **`bufferedAmount`** 返回当前排队等待通过数据通道发送的数据字节数。调用 send() 方法可能导致队列积压。这仅包含用户代理自身缓冲的数据，不包括任何组帧开销或操作系统/网络硬件完成的缓冲。
     */
    readonly bufferedAmount: number;
    /**
     * RTCDataChannel 的属性 **`bufferedAmountLowThreshold`** 用于指定被视为"低"的缓冲出站数据字节数。默认值为 0。当 bufferedAmount 属性指示的缓冲出站字节数降至或低于此值时，将触发 bufferedamountlow 事件。例如，可以利用此事件实现只要有缓冲空间就排队更多待发送消息的代码。可通过 onbufferedamountlow 或 addEventListener() 添加监听器。
     */
    bufferedAmountLowThreshold: number;
    /**
     * RTCDataChannel 的只读属性 **`id`** 返回一个 ID 编号（0 到 65,534 之间），唯一标识该 RTCDataChannel。此 ID 在数据通道创建时设置，由用户代理设置（如果 RTCDataChannel.negotiated 为 false）或由站点/应用脚本设置（如果 negotiated 为 true）。
     */
    readonly id: number | null;
    /**
     * RTCDataChannel 的只读属性 **`label`** 返回一个包含描述该数据通道名称的字符串。这些标签不要求唯一。
     */
    readonly label: string;
    /**
     * RTCDataChannel 的只读属性 **`maxPacketLifeTime`** 返回创建数据通道时设置的、浏览器尝试传输一条消息所允许花费的时间（以毫秒为单位），或 null。这限制了浏览器在放弃之前可以继续尝试传输和重传该消息的时间。
     */
    readonly maxPacketLifeTime: number | null;
    /**
     * RTCDataChannel 的只读属性 **`maxRetransmits`** 返回创建数据通道时设置的、浏览器在放弃之前应尝试重传消息的最大次数，或 null（表示没有最大值）。这只能在通过调用 RTCPeerConnection.createDataChannel() 创建 RTCDataChannel 时，使用指定选项中的 maxRetransmits 字段来设置。
     */
    readonly maxRetransmits: number | null;
    /**
     * RTCDataChannel 的只读属性 **`negotiated`** 指示 RTCDataChannel 的连接是由 Web 应用（true）协商的，还是由 WebRTC 层（false）协商的。默认值为 false。
     */
    readonly negotiated: boolean;
    onbufferedamountlow: ((this: RTCDataChannel, ev: Event) => any) | null;
    onclose: ((this: RTCDataChannel, ev: Event) => any) | null;
    onclosing: ((this: RTCDataChannel, ev: Event) => any) | null;
    onerror: ((this: RTCDataChannel, ev: RTCErrorEvent) => any) | null;
    onmessage: ((this: RTCDataChannel, ev: MessageEvent) => any) | null;
    onopen: ((this: RTCDataChannel, ev: Event) => any) | null;
    /**
     * RTCDataChannel 的只读属性 **`ordered`** 指示数据通道是否保证按顺序交付消息；默认值为 true，表示该数据通道确实是按顺序的。此值在创建 RTCDataChannel 时通过设置作为 RTCPeerConnection.createDataChannel() options 参数传入对象的 ordered 属性来设定。
     */
    readonly ordered: boolean;
    /**
     * RTCDataChannel 的只读属性 **`protocol`** 返回一个字符串，包含正在使用的子协议名称。如果创建数据通道时未指定协议，则此属性的值为空字符串（""）。
     */
    readonly protocol: string;
    /**
     * RTCDataChannel 的只读属性 **`readyState`** 返回一个字符串，指示数据通道底层数据连接的状态。
     */
    readonly readyState: RTCDataChannelState;
    /**
     * **`RTCDataChannel.close()`** 方法关闭 RTCDataChannel。任一端均可调用此方法发起通道关闭。
     */
    close(): void;
    /**
     * RTCDataChannel 接口的 **`send()`** 方法通过数据通道向远端发送数据。除了在创建底层传输通道的初始过程期间外，可在任何时候调用此方法。在连接前发送的数据会尽可能被缓冲（如果不可能则发生错误），并且在连接正在关闭或已关闭时发送的数据也会被缓冲。
     */
    send(data: string): void;
    send(data: Blob): void;
    send(data: ArrayBuffer): void;
    send(data: ArrayBufferView<ArrayBuffer>): void;
    addEventListener<K extends keyof RTCDataChannelEventMap>(type: K, listener: (this: RTCDataChannel, ev: RTCDataChannelEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCDataChannelEventMap>(type: K, listener: (this: RTCDataChannel, ev: RTCDataChannelEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var RTCDataChannel: {
    prototype: RTCDataChannel;
    new(): RTCDataChannel;
};

/** 数据通道事件：远端 createDataChannel 时通过 datachannel 事件通知本端 */
interface RTCDataChannelEvent extends Event {
    /**
     * 只读属性 **`RTCDataChannelEvent.channel`** 返回与该事件关联的 RTCDataChannel。
     */
    readonly channel: RTCDataChannel;
}

declare var RTCDataChannelEvent: {
    prototype: RTCDataChannelEvent;
    new(type: string, eventInitDict: RTCDataChannelEventInit): RTCDataChannelEvent;
};


// ===========================================================================
// 八、传输层 DTLS/ICE/SCTP
//   DTLS（密钥协商） + ICE（NAT 穿越） + SCTP（DataChannel 承载）
// ===========================================================================

/** RTCDtlsTransport 事件映射表（statechange / error） */
interface RTCDtlsTransportEventMap {
    "error": RTCErrorEvent;
    "statechange": Event;
}

/** DTLS 传输层：负责 SRTP 密钥协商、证书校验，底层关联 RTCIceTransport */
interface RTCDtlsTransport extends EventTarget {
    /**
     * RTCDtlsTransport 接口的 **`iceTransport`** 只读属性包含对底层 RTCIceTransport 的引用。
     */
    readonly iceTransport: RTCIceTransport;
    onerror: ((this: RTCDtlsTransport, ev: RTCErrorEvent) => any) | null;
    onstatechange: ((this: RTCDtlsTransport, ev: Event) => any) | null;
    /**
     * RTCDtlsTransport 接口的 **`state`** 只读属性提供描述数据报传输层安全（DTLS）传输状态的信息。
     */
    readonly state: RTCDtlsTransportState;
    getRemoteCertificates(): ArrayBuffer[];
    addEventListener<K extends keyof RTCDtlsTransportEventMap>(type: K, listener: (this: RTCDtlsTransport, ev: RTCDtlsTransportEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCDtlsTransportEventMap>(type: K, listener: (this: RTCDtlsTransport, ev: RTCDtlsTransportEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var RTCDtlsTransport: {
    prototype: RTCDtlsTransport;
    new(): RTCDtlsTransport;
};


// ===========================================================================
// 九、错误 RTCError / RTCErrorEvent
//   WebRTC 详细错误码与错误事件（SDP/DTLS/SCTP/DataChannel/硬件编码等子类型）
// ===========================================================================

/** WebRTC 详细错误：继承 DOMException，增加 errorDetail、SDP 行号、DTLS alert、SCTP cause 等 */
interface RTCError extends DOMException {
    /**
     * RTCError 接口的只读 **`errorDetail`** 属性是一个字符串，指示发生的 WebRTC 特定错误码。
     */
    readonly errorDetail: RTCErrorDetailType;
    /**
     * RTCError 的只读属性 **`receivedAlert`** 指定导致从远端接收到警报的致命 DTLS 错误。
     */
    readonly receivedAlert: number | null;
    /**
     * RTCError 对象中的只读 **`sctpCauseCode`** 属性提供 SCTP 原因码，解释 SCTP 协商失败的原因（当 RTCError 表示 SCTP 错误时）。
     */
    readonly sctpCauseCode: number | null;
    /**
     * RTCError 接口的只读属性 **`sdpLineNumber`** 指定解析 SDP 时发生语法错误的行号。
     */
    readonly sdpLineNumber: number | null;
    /**
     * RTCError 对象中的只读 **`sentAlert`** 属性指定向远端发送数据时发生的 DTLS 警报号（当错误表示出站 DTLS 错误时）。
     */
    readonly sentAlert: number | null;
}

declare var RTCError: {
    prototype: RTCError;
    new(init: RTCErrorInit, message?: string): RTCError;
};

/** RTC 错误事件：包装 RTCError，在数据通道/DTLS 等错误时触发 */
interface RTCErrorEvent extends Event {
    /**
     * RTCErrorEvent 的只读属性 **`error`** 包含一个 RTCError 对象，描述该事件所通知错误的详细信息。
     */
    readonly error: RTCError;
}

declare var RTCErrorEvent: {
    prototype: RTCErrorEvent;
    new(type: string, eventInitDict: RTCErrorEventInit): RTCErrorEvent;
};


// ===========================================================================
// 十、ICE 候选 RTCIceCandidate + Transport
//   候选结构、候选对、ICE 传输层（连通性检查、NAT 穿越）
// ===========================================================================

/** ICE 候选：一个可用的连接端点（IP+端口+协议+类型+优先级等） */
interface RTCIceCandidate {
    /**
     * RTCIceCandidate 接口的只读 **`address`** 属性是一个字符串，提供作为候选源的设备 IP 地址。如果未另行指定，该地址默认为 null。
     */
    readonly address: string | null;
    /**
     * RTCIceCandidate 接口的只读属性 **`candidate`** 返回一个详细描述候选的字符串。RTCIceCandidate 的大多数其他属性实际上都是从该字符串中提取的。
     */
    readonly candidate: string;
    /**
     * RTCIceCandidate 接口的只读 **`component`** 属性是一个字符串，指示该候选是 RTP 候选还是 RTCP 候选。
     */
    readonly component: RTCIceComponent | null;
    /**
     * RTCIceCandidate 接口的 **`foundation`** 只读属性是一个字符串，允许在多个 RTCIceTransport 对象上关联来自共同网络路径的候选。
     */
    readonly foundation: string | null;
    /**
     * RTCIceCandidate 接口的只读 **`port`** 属性包含 RTCIceCandidate.address 所给地址处设备上的端口号，对端的候选可通过该端口到达。
     */
    readonly port: number | null;
    /**
     * RTCIceCandidate 接口的只读 **`priority`** 属性指定候选相对于远端的优先级；该值越高，远端认为该候选越好。
     */
    readonly priority: number | null;
    /**
     * RTCIceCandidate 接口的只读 **`protocol`** 属性是一个字符串，指示该候选使用 UDP 还是 TCP 作为传输协议。
     */
    readonly protocol: RTCIceProtocol | null;
    /**
     * RTCIceCandidate 接口的只读 **`relatedAddress`** 属性是一个字符串，指示中继或反射候选的关联地址。
     */
    readonly relatedAddress: string | null;
    /**
     * RTCIceCandidate 接口的只读 **`relatedPort`** 属性指示反射或中继候选的端口号。
     */
    readonly relatedPort: number | null;
    /**
     * RTCIceCandidate 接口的只读 **`sdpMLineIndex`** 属性是描述与候选关联媒体的 m-line 的从零开始的索引。
     */
    readonly sdpMLineIndex: number | null;
    /**
     * RTCIceCandidate 接口的只读属性 **`sdpMid`** 返回一个字符串，指定与候选关联的媒体组件的媒体流标识标签。此 ID 在给定组件中唯一标识与候选关联的流。
     */
    readonly sdpMid: string | null;
    /**
     * RTCIceCandidate 接口的只读 **`tcpType`** 属性在 TCP 候选上提供有关候选类型的附加详情。
     */
    readonly tcpType: RTCIceTcpCandidateType | null;
    /**
     * RTCIceCandidate 接口的只读 **`type`** 指定该对象所表示的候选类型。
     */
    readonly type: RTCIceCandidateType | null;
    /**
     * RTCIceCandidate 接口的只读 **`usernameFragment`** 属性是一个字符串，指示唯一标识单次 ICE 交互会话的用户名片段（"ufrag"）。
     */
    readonly usernameFragment: string | null;
    /**
     * RTCIceCandidate 的 **`toJSON()`** 方法将调用它的 RTCIceCandidate 转换为 JSON。
     */
    toJSON(): RTCIceCandidateInit;
}

declare var RTCIceCandidate: {
    prototype: RTCIceCandidate;
    new(candidateInitDict?: RTCLocalIceCandidateInit): RTCIceCandidate;
};

/** ICE 候选对：本地候选 + 远端候选的配对（连接尝试单位） */
interface RTCIceCandidatePair {
    /** The **`local`** property of the RTCIceCandidatePair dictionary specifies the RTCIceCandidate which describes the configuration of the local end of a viable WebRTC connection. */
    local: RTCIceCandidate;
    /** The **`remote`** property of the RTCIceCandidatePair dictionary specifies the RTCIceCandidate describing the configuration of the remote end of a viable WebRTC connection. */
    remote: RTCIceCandidate;
}

/** RTCIceTransport 事件映射表（gatheringstatechange / statechange / selectedcandidatepairchange） */
interface RTCIceTransportEventMap {
    "gatheringstatechange": Event;
    "selectedcandidatepairchange": Event;
    "statechange": Event;
}

/** ICE 传输层：负责候选收集、连通性检查（STUN）、NAT 穿越、候选对选择 */
interface RTCIceTransport extends EventTarget {
    /**
     * RTCIceTransport 接口的 **`gatheringState`** 只读属性返回一个字符串，指示此传输的 ICE 代理当前收集状态："new"、"gathering" 或 "complete"。
     */
    readonly gatheringState: RTCIceGathererState;
    ongatheringstatechange: ((this: RTCIceTransport, ev: Event) => any) | null;
    onselectedcandidatepairchange: ((this: RTCIceTransport, ev: Event) => any) | null;
    onstatechange: ((this: RTCIceTransport, ev: Event) => any) | null;
    /**
     * RTCIceTransport 接口的 **`state`** 只读属性返回 ICE 传输的当前状态，以便确定 ICE 代理当前所处的 ICE 收集状态。
     */
    readonly state: RTCIceTransportState;
    /**
     * RTCIceTransport 接口的 **`getSelectedCandidatePair()`** 方法返回一个 RTCIceCandidatePair 对象，包含描述该传输端点配置的当前最佳 ICE 候选对。
     */
    getSelectedCandidatePair(): RTCIceCandidatePair | null;
    addEventListener<K extends keyof RTCIceTransportEventMap>(type: K, listener: (this: RTCIceTransport, ev: RTCIceTransportEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCIceTransportEventMap>(type: K, listener: (this: RTCIceTransport, ev: RTCIceTransportEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var RTCIceTransport: {
    prototype: RTCIceTransport;
    new(): RTCIceTransport;
};


// ===========================================================================
// 十一、RTP 收发层 Sender / Receiver / Transceiver
//   RTCRtpSender（发送）、RTCRtpReceiver（接收）、RTCRtpTransceiver（一对收发 + 方向控制）
// ===========================================================================

/** RTCPeerConnection 全部事件映射表 */
interface RTCPeerConnectionEventMap {
    "connectionstatechange": Event;
    "datachannel": RTCDataChannelEvent;
    "icecandidate": RTCPeerConnectionIceEvent;
    "icecandidateerror": RTCPeerConnectionIceErrorEvent;
    "iceconnectionstatechange": Event;
    "icegatheringstatechange": Event;
    "negotiationneeded": Event;
    "signalingstatechange": Event;
    "track": RTCTrackEvent;
}

/** 【WebRTC 核心】对等连接：统一管理 ICE/DTLS/SRTP、收发媒体流、数据通道、统计 */
interface RTCPeerConnection extends EventTarget {
    /**
     * RTCPeerConnection 接口的 **`canTrickleIceCandidates`** 只读属性返回一个布尔值，指示远端是否可以接受 trickled ICE 候选。
     */
    readonly canTrickleIceCandidates: boolean | null;
    /**
     * RTCPeerConnection 接口的 **`connectionState`** 只读属性通过返回以下字符串值之一来指示对等连接的当前状态：new、connecting、connected、disconnected、failed 或 closed。
     */
    readonly connectionState: RTCPeerConnectionState;
    /**
     * RTCPeerConnection 接口的 **`currentLocalDescription`** 只读属性返回一个 RTCSessionDescription 对象，描述自 RTCPeerConnection 上次完成与远端协商并连接以来，最近一次成功协商的连接本地端。还包括自该描述所表示的 offer 或 answer 首次实例化以来，ICE 代理可能已生成的所有 ICE 候选。
     */
    readonly currentLocalDescription: RTCSessionDescription | null;
    /**
     * RTCPeerConnection 接口的 **`currentRemoteDescription`** 只读属性返回一个 RTCSessionDescription 对象，描述自 RTCPeerConnection 上次完成与远端协商并连接以来，最近一次成功协商的连接远端。还包括自该描述所表示的 offer 或 answer 首次实例化以来，ICE 代理可能已生成的所有 ICE 候选。
     */
    readonly currentRemoteDescription: RTCSessionDescription | null;
    /**
     * RTCPeerConnection 接口的 **`iceConnectionState`** 只读属性返回一个字符串，表示与 RTCPeerConnection 关联的 ICE 代理状态：new、checking、connected、completed、failed、disconnected 和 closed。
     */
    readonly iceConnectionState: RTCIceConnectionState;
    /**
     * RTCPeerConnection 接口的 **`iceGatheringState`** 只读属性返回一个字符串，描述此连接的整体 ICE 收集状态。例如，可以利用它检测 ICE 候选的收集何时完成。
     */
    readonly iceGatheringState: RTCIceGatheringState;
    /**
     * RTCPeerConnection 接口的 **`localDescription`** 只读属性返回一个描述连接本地端会话的 RTCSessionDescription。如果尚未设置，则为 null。
     */
    readonly localDescription: RTCSessionDescription | null;
    onconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
    ondatachannel: ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any) | null;
    onicecandidate: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any) | null;
    onicecandidateerror: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceErrorEvent) => any) | null;
    oniceconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
    onicegatheringstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
    onnegotiationneeded: ((this: RTCPeerConnection, ev: Event) => any) | null;
    onsignalingstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;
    ontrack: ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null;
    /**
     * RTCPeerConnection 接口的 **`pendingLocalDescription`** 只读属性返回一个 RTCSessionDescription 对象，描述连接本地端的待定配置变更。
     */
    readonly pendingLocalDescription: RTCSessionDescription | null;
    /**
     * RTCPeerConnection 接口的 **`pendingRemoteDescription`** 只读属性返回一个 RTCSessionDescription 对象，描述连接远端的待定配置变更。
     */
    readonly pendingRemoteDescription: RTCSessionDescription | null;
    /**
     * RTCPeerConnection 接口的 **`remoteDescription`** 只读属性返回一个描述连接远端会话（包括配置和媒体信息）的 RTCSessionDescription。如果尚未设置，则为 null。
     */
    readonly remoteDescription: RTCSessionDescription | null;
    /**
     * RTCPeerConnection 接口的 **`sctp`** 只读属性返回一个描述 SCTP 传输（用于发送和接收 SCTP 数据）的 RTCSctpTransport。如果尚未协商 SCTP，则该值为 null。
     */
    readonly sctp: RTCSctpTransport | null;
    /**
     * RTCPeerConnection 接口的 **`signalingState`** 只读属性返回一个字符串值，描述在与另一个对端连接或重新连接时本地端的信令过程状态。参见 WebRTC 会话生命周期页面中的 Signaling 部分。
     */
    readonly signalingState: RTCSignalingState;
    /**
     * RTCPeerConnection 接口的 **`addIceCandidate()`** 方法向连接的远端描述添加一个新的远端候选，该描述描述了连接远端的状态。
     */
    addIceCandidate(candidate?: RTCIceCandidateInit | null): Promise<void>;
    /** @deprecated */
    addIceCandidate(candidate: RTCIceCandidateInit | null, successCallback: VoidFunction, failureCallback: RTCPeerConnectionErrorCallback): Promise<void>;
    /**
     * RTCPeerConnection 接口的 **`addTrack()`** 方法向将传输给对端的轨道集合中添加一条新的媒体轨道。
     */
    addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender;
    /**
     * RTCPeerConnection 接口的 **`addTransceiver()`** 方法创建一个新的 RTCRtpTransceiver 并将其添加到与 RTCPeerConnection 关联的收发器集合中。每个收发器代表一个双向流，同时关联一个 RTCRtpSender 和一个 RTCRtpReceiver。
     */
    addTransceiver(trackOrKind: MediaStreamTrack | string, init?: RTCRtpTransceiverInit): RTCRtpTransceiver;
    /**
     * RTCPeerConnection 接口的 **`close()`** 方法关闭当前对等连接。
     */
    close(): void;
    /**
     * RTCPeerConnection 接口的 **`createAnswer()`** 方法在 WebRTC 连接的 offer/answer 协商过程中，为从远端接收到的 offer 创建一个 SDP answer。
     */
    createAnswer(options?: RTCAnswerOptions): Promise<RTCSessionDescriptionInit>;
    /** @deprecated */
    createAnswer(successCallback: RTCSessionDescriptionCallback, failureCallback: RTCPeerConnectionErrorCallback): Promise<void>;
    /**
     * RTCPeerConnection 接口的 **`createDataChannel()`** 方法创建一个与远端关联的新通道，可通过该通道传输任何类型的数据。这对于后端通道内容很有用，例如图像、文件传输、文本聊天、游戏更新包等。
     */
    createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel;
    /**
     * RTCPeerConnection 接口的 **`createOffer()`** 方法发起创建一个 SDP offer，目的是与远端建立新的 WebRTC 连接。
     */
    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;
    /** @deprecated */
    createOffer(successCallback: RTCSessionDescriptionCallback, failureCallback: RTCPeerConnectionErrorCallback, options?: RTCOfferOptions): Promise<void>;
    /**
     * RTCPeerConnection 接口的 **`getConfiguration()`** 方法返回一个对象，指示调用该方法的 RTCPeerConnection 的当前配置。
     */
    getConfiguration(): RTCConfiguration;
    /**
     * RTCPeerConnection 接口的 **`getReceivers()`** 方法返回一个 RTCRtpReceiver 对象数组，每个对象代表一个 RTP 接收器。每个 RTP 接收器负责 RTCPeerConnection 上某条 MediaStreamTrack 的数据接收和解码。
     */
    getReceivers(): RTCRtpReceiver[];
    /**
     * RTCPeerConnection 接口的 **`getSenders()`** 方法返回一个 RTCRtpSender 对象数组，每个对象代表负责传输一条轨道数据的 RTP 发送器。发送器对象提供了检查和控制该轨道数据编码与传输的方法和属性。
     */
    getSenders(): RTCRtpSender[];
    /**
     * RTCPeerConnection 接口的 **`getStats()`** 方法返回一个 promise，resolve 时提供关于整体连接或指定 MediaStreamTrack 的统计数据。
     */
    getStats(selector?: MediaStreamTrack | null): Promise<RTCStatsReport>;
    /**
     * RTCPeerConnection 接口的 **`getTransceivers()`** 方法返回连接上用于发送和接收数据的 RTCRtpTransceiver 对象列表。
     */
    getTransceivers(): RTCRtpTransceiver[];
    /**
     * RTCPeerConnection 接口的 **`removeTrack()`** 方法通知连接的本地端停止发送指定轨道的媒体，但并不真正从 RTCPeerConnection.getSenders() 报告的发送器列表中移除对应的 RTCRtpSender。如果轨道已停止或不在连接的发送器列表中，则此方法无效。
     */
    removeTrack(sender: RTCRtpSender): void;
    /**
     * RTCPeerConnection 接口的 **`restartIce()`** 方法允许 Web 应用请求在连接两端重新进行 ICE 候选收集。这简化了流程，允许主叫方或接收方使用相同的方法来触发 ICE 重启。
     */
    restartIce(): void;
    /**
     * RTCPeerConnection 接口的 **`setConfiguration()`** 方法根据指定对象中包含的值设置连接的当前配置。这允许更改连接使用的 ICE 服务器和传输策略。
     */
    setConfiguration(configuration?: RTCConfiguration): void;
    /**
     * RTCPeerConnection 接口的 **`setLocalDescription()`** 方法更改与连接关联的本地描述。该描述指定连接本地端的属性，包括媒体格式。该方法接受一个参数——会话描述，并返回一个 Promise，在描述异步更改完成后 fulfilled。
     */
    setLocalDescription(description?: RTCLocalSessionDescriptionInit): Promise<void>;
    /** @deprecated */
    setLocalDescription(description: RTCLocalSessionDescriptionInit, successCallback: VoidFunction, failureCallback: RTCPeerConnectionErrorCallback): Promise<void>;
    /**
     * RTCPeerConnection 接口的 **`setRemoteDescription()`** 方法将指定的会话描述设置为远端的当前 offer 或 answer。该描述指定连接远端的属性，包括媒体格式。该方法接受一个参数——会话描述，并返回一个 Promise，在描述异步更改完成后 fulfilled。
     */
    setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;
    /** @deprecated */
    setRemoteDescription(description: RTCSessionDescriptionInit, successCallback: VoidFunction, failureCallback: RTCPeerConnectionErrorCallback): Promise<void>;
    addEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var RTCPeerConnection: {
    prototype: RTCPeerConnection;
    new(configuration?: RTCConfiguration): RTCPeerConnection;
    /**
     * RTCPeerConnection 接口的 **`generateCertificate()`** 静态函数创建一个 X.509 证书和对应的私钥，返回一个在生成新 RTCCertificate 后 resolve 的 promise。
     */
    generateCertificate(keygenAlgorithm: AlgorithmIdentifier): Promise<RTCCertificate>;
};

/** ICE 候选错误事件：某个 STUN/TURN 地址/端口采集失败时触发 */
interface RTCPeerConnectionIceErrorEvent extends Event {
    /**
     * RTCPeerConnectionIceErrorEvent 的属性 **`address`** 是一个字符串，指示在协商期间用于与 STUN 或 TURN 服务器通信的本地 IP 地址。发生的错误涉及此地址。
     */
    readonly address: string | null;
    readonly errorCode: number;
    readonly errorText: string;
    readonly port: number | null;
    readonly url: string;
}

declare var RTCPeerConnectionIceErrorEvent: {
    prototype: RTCPeerConnectionIceErrorEvent;
    new(type: string, eventInitDict: RTCPeerConnectionIceErrorEventInit): RTCPeerConnectionIceErrorEvent;
};

/** ICE 候选事件：新的 ICE 候选被收集到，需通过信令转发给对端 */
interface RTCPeerConnectionIceEvent extends Event {
    /**
     * RTCPeerConnectionIceEvent 接口的只读 **`candidate`** 属性返回与该事件关联的 RTCIceCandidate。
     */
    readonly candidate: RTCIceCandidate | null;
}

declare var RTCPeerConnectionIceEvent: {
    prototype: RTCPeerConnectionIceEvent;
    new(type: string, eventInitDict?: RTCPeerConnectionIceEventInit): RTCPeerConnectionIceEvent;
};

/** RTP 接收器：管理一条入向媒体轨道的接收、解码、抖动缓冲、统计 */
interface RTCRtpReceiver {
    /**
     * RTCRtpReceiver 接口的 **`jitterBufferTarget`** 属性是一个 DOMHighResTimeStamp，指示应用期望抖动缓冲区在播放媒体前保持的时长（以毫秒为单位）。
     */
    jitterBufferTarget: DOMHighResTimeStamp | null;
    /**
     * RTCRtpReceiver 接口的 **`track`** 只读属性返回与当前 RTCRtpReceiver 实例关联的 MediaStreamTrack。
     */
    readonly track: MediaStreamTrack;
    /**
     * RTCRtpReceiver 对象的 **`transform`** 属性用于将一个在工作线程中运行的变换流（TransformStream）插入接收器管线。这允许对从打包器到达的编码视频和音频帧应用流变换（在播放/渲染之前）。
     */
    transform: RTCRtpReceiverTransform | null;
    /**
     * RTCRtpReceiver 对象的只读 **`transport`** 属性提供用于与接收器交换实时传输控制协议（RTCP）数据包的底层传输进行交互的 RTCDtlsTransport 对象。
     */
    readonly transport: RTCDtlsTransport | null;
    /**
     * RTCRtpReceiver 接口的 **`getContributingSources()`** 方法返回一个对象数组，每个对象对应当前 RTCRtpReceiver 在最近十秒内接收到的一个 CSRC（贡献源）标识。
     */
    getContributingSources(): RTCRtpContributingSource[];
    /**
     * RTCRtpReceiver 接口的 **`getParameters()`** 方法返回一个描述接收器轨道当前解码配置的对象。
     */
    getParameters(): RTCRtpReceiveParameters;
    /**
     * RTCRtpReceiver 的 **`getStats()`** 方法异步请求一个 RTCStatsReport 对象，该对象提供所属 RTCPeerConnection 上入站流量的统计信息，返回一个在结果可用时调用其 fulfillment 处理程序的 Promise。
     */
    getStats(): Promise<RTCStatsReport>;
    /**
     * RTCRtpReceiver 接口的 **`getSynchronizationSources()`** 方法返回一个对象数组，每个对象对应当前 RTCRtpReceiver 在最近十秒内接收到的一个 SSRC（同步源）标识。
     */
    getSynchronizationSources(): RTCRtpSynchronizationSource[];
}

declare var RTCRtpReceiver: {
    prototype: RTCRtpReceiver;
    new(): RTCRtpReceiver;
    /**
     * 静态方法 **`RTCRtpReceiver.getCapabilities()`** 返回一个对象，描述当前设备上 RTCRtpReceiver 对象支持的编解码器和头扩展能力。
     */
    getCapabilities(kind: string): RTCRtpCapabilities | null;
};


// ===========================================================================
// 十二、Encoded Transform（RTP 脚本变换）
//   把编码后的媒体帧送到 Worker 里做自定义处理（端到端加密 E2EE 等）
// ===========================================================================

/** RTP 脚本变换器：把 Encoded Transform 插到 Worker 里处理编码后帧（E2EE 等场景） */
interface RTCRtpScriptTransform {
}

declare var RTCRtpScriptTransform: {
    prototype: RTCRtpScriptTransform;
    new(worker: Worker, options?: any, transfer?: any[]): RTCRtpScriptTransform;
};

/** RTP 发送器：管理一条出向媒体轨道的编码、发送、DTMF、层切换 */
interface RTCRtpSender {
    /**
     * RTCRtpSender 接口的只读 **`dtmf`** 属性返回一个 RTCDTMFSender 对象，可用于通过 RTCPeerConnection 发送 DTMF 音调。有关如何使用返回的 RTCDTMFSender 对象的详情，请参见 Using DTMF。
     */
    readonly dtmf: RTCDTMFSender | null;
    /**
     * RTCRtpSender 接口的 **`track`** 只读属性返回由 RTCRtpSender 处理的 MediaStreamTrack。
     */
    readonly track: MediaStreamTrack | null;
    /**
     * RTCRtpSender 对象的 **`transform`** 属性用于将一个在工作线程中运行的变换流（TransformStream）插入发送器管线。这允许对编码后的视频和音频帧在由编解码器输出后、发送前应用流变换。
     */
    transform: RTCRtpSenderTransform | null;
    /**
     * RTCRtpSender 对象的只读 **`transport`** 属性提供用于与发送器交换实时传输控制协议（RTCP）数据包的底层传输进行交互的 RTCDtlsTransport 对象。
     */
    readonly transport: RTCDtlsTransport | null;
    /**
     * RTCRtpSender 接口的 **`getParameters()`** 方法返回一个对象，描述发送器轨道将如何编码并传输给远端 RTCRtpReceiver 的当前配置。
     */
    getParameters(): RTCRtpSendParameters;
    /**
     * RTCRtpSender 的 **`getStats()`** 方法异步请求一个 RTCStatsReport 对象，该对象提供拥有该发送器的 RTCPeerConnection 上出站流量的统计信息，返回一个在结果可用时 fulfilled 的 Promise。
     */
    getStats(): Promise<RTCStatsReport>;
    /**
     * RTCRtpSender 的 **`replaceTrack()`** 方法用一个 MediaStreamTrack 替换发送器源中当前用作源的轨道。
     */
    replaceTrack(withTrack: MediaStreamTrack | null): Promise<void>;
    /**
     * RTCRtpSender 接口的 **`setParameters()`** 方法应用对发送器轨道配置的更改，该轨道即 RTCRtpSender 所负责的 MediaStreamTrack。
     */
    setParameters(parameters: RTCRtpSendParameters, setParameterOptions?: RTCSetParameterOptions): Promise<void>;
    /**
     * RTCRtpSender 的 **`setStreams()`** 方法将发送器的轨道与指定的 MediaStream 对象关联。
     */
    setStreams(...streams: MediaStream[]): void;
}

declare var RTCRtpSender: {
    prototype: RTCRtpSender;
    new(): RTCRtpSender;
    /**
     * 静态方法 **`RTCRtpSender.getCapabilities()`** 返回一个对象，描述 RTCRtpSender 支持的编解码器和头扩展能力。
     */
    getCapabilities(kind: string): RTCRtpCapabilities | null;
};

/** RTP 收发器：一对 Sender + Receiver 的组合，代表一个双向媒体流（“m=”行） */
interface RTCRtpTransceiver {
    /**
     * RTCRtpTransceiver 的只读属性 **`currentDirection`** 是一个字符串，指示收发器当前协商的方向性。
     */
    readonly currentDirection: RTCRtpTransceiverDirection | null;
    /**
     * RTCRtpTransceiver 的属性 **`direction`** 是一个字符串，指示收发器首选的方向性。
     */
    direction: RTCRtpTransceiverDirection;
    /**
     * RTCRtpTransceiver 接口的只读 **`mid`** 属性指定本地和远端已协商一致的、用于唯一标识该流收发器配对的媒体 ID（mid）。
     */
    readonly mid: string | null;
    /**
     * WebRTC 的 RTCRtpTransceiver 接口的只读 **`receiver`** 属性指示负责接收和解码收发器流入站媒体数据的 RTCRtpReceiver。
     */
    readonly receiver: RTCRtpReceiver;
    /**
     * WebRTC 的 RTCRtpTransceiver 接口的只读 **`sender`** 属性指示负责编码和发送收发器流出站媒体数据的 RTCRtpSender。
     */
    readonly sender: RTCRtpSender;
    /**
     * RTCRtpTransceiver 接口的 **`setCodecPreferences()`** 方法用于设置收发器允许解码接收数据的编解码器，按偏好递减顺序排列。
     */
    setCodecPreferences(codecs: RTCRtpCodec[]): void;
    /**
     * RTCRtpTransceiver 接口的 **`stop()`** 方法通过同时停止关联的 RTCRtpSender 和 RTCRtpReceiver 来永久停止该收发器。
     */
    stop(): void;
}

declare var RTCRtpTransceiver: {
    prototype: RTCRtpTransceiver;
    new(): RTCRtpTransceiver;
};


// ===========================================================================
// 十三、统计 RTCStats / RTCStatsReport
//   getStats() 返回的统计结构：stats 基类、候选对统计、传输统计
// ===========================================================================

/** RTCSctpTransport 事件映射表（statechange） */
interface RTCSctpTransportEventMap {
    "statechange": Event;
}

/** SCTP 传输层：在 DTLS 之上复用，为 RTCDataChannel 提供多流 SCTP 承载 */
interface RTCSctpTransport extends EventTarget {
    /**
     * RTCSctpTransport 接口的 **`maxChannels`** 只读属性指示可同时打开的 RTCDataChannel 对象的最大数量。
     */
    readonly maxChannels: number | null;
    /**
     * RTCSctpTransport 接口的 **`maxMessageSize`** 只读属性指示可使用 RTCDataChannel.send() 方法发送的消息的最大大小。
     */
    readonly maxMessageSize: number;
    onstatechange: ((this: RTCSctpTransport, ev: Event) => any) | null;
    /**
     * RTCSctpTransport 接口的 **`state`** 只读属性提供描述流控制传输协议（SCTP）传输状态的信息。
     */
    readonly state: RTCSctpTransportState;
    /**
     * RTCSctpTransport 接口的 **`transport`** 只读属性返回一个表示用于收发数据包的 DTLS 传输的 RTCDtlsTransport 对象。
     */
    readonly transport: RTCDtlsTransport;
    addEventListener<K extends keyof RTCSctpTransportEventMap>(type: K, listener: (this: RTCSctpTransport, ev: RTCSctpTransportEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCSctpTransportEventMap>(type: K, listener: (this: RTCSctpTransport, ev: RTCSctpTransportEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var RTCSctpTransport: {
    prototype: RTCSctpTransport;
    new(): RTCSctpTransport;
};


// ===========================================================================
// 十四、会话描述 RTCSessionDescription
//   SDP offer/answer/pranswer/rollback 的包装对象
// ===========================================================================

/** 会话描述：SDP 文本 + type（offer/answer/pranswer/rollback）的包装 */
interface RTCSessionDescription {
    /**
     * 属性 **`RTCSessionDescription.sdp`** 是一个只读字符串，包含描述该会话的 SDP。
     */
    readonly sdp: string;
    /**
     * 属性 **`RTCSessionDescription.type`** 是一个只读字符串值，描述该描述的类型。
     */
    readonly type: RTCSdpType;
    /**
     * **`RTCSessionDescription.toJSON()`** 方法生成该对象的 JSON 描述。生成的 JSON 中包含 type 和 sdp 两个属性。
     */
    toJSON(): RTCSessionDescriptionInit;
}

declare var RTCSessionDescription: {
    prototype: RTCSessionDescription;
    new(descriptionInitDict: RTCSessionDescriptionInit): RTCSessionDescription;
};

/** 统计报告：一个 Map<string, RTCStats>，按 id 索引所有统计对象 */
interface RTCStatsReport {
    forEach(callbackfn: (value: any, key: string, parent: RTCStatsReport) => void, thisArg?: any): void;
}

declare var RTCStatsReport: {
    prototype: RTCStatsReport;
    new(): RTCStatsReport;
};

/** 入轨事件：对端新增媒体轨道时通过 ontrack 触发，携带 receiver/track/streams/transceiver */
interface RTCTrackEvent extends Event {
    /**
     * RTCTrackEvent 接口的只读 **`receiver`** 属性指示用于接收该事件所指轨道媒体数据的 RTCRtpReceiver。
     */
    readonly receiver: RTCRtpReceiver;
    /**
     * WebRTC API 接口 RTCTrackEvent 的只读 **`streams`** 属性指定一个 MediaStream 对象数组，每个对象对应构成被添加到 RTCPeerConnection 的轨道的流之一。
     */
    readonly streams: ReadonlyArray<MediaStream>;
    /**
     * WebRTC API 接口 RTCTrackEvent 的只读 **`track`** 属性指定已添加到 RTCPeerConnection 的 MediaStreamTrack。
     */
    readonly track: MediaStreamTrack;
    /**
     * WebRTC API 接口 RTCTrackEvent 的只读 **`transceiver`** 属性指示与该事件轨道关联的 RTCRtpTransceiver。
     */
    readonly transceiver: RTCRtpTransceiver;
}

declare var RTCTrackEvent: {
    prototype: RTCTrackEvent;
    new(type: string, eventInitDict: RTCTrackEventInit): RTCTrackEvent;
};


// ===========================================================================
// 十五、RTCPeerConnection 遗留回调接口
//   【deprecated】createOffer/setRemoteDescription 等函数的旧 callback 风格回调
// ===========================================================================

/** 【遗留】setLocalDescription/createOffer 等旧回调风格的错误处理函数类型 */
interface RTCPeerConnectionErrorCallback {
    (error: DOMException): void;
}

/** 【遗留】createOffer/createAnswer 的成功回调函数类型 */
interface RTCSessionDescriptionCallback {
    (description: RTCSessionDescriptionInit): void;
}


// ===========================================================================
// 十六、类型别名（Constrain* / 状态枚举）
//   所有 type alias：约束类型、连接状态、枚举字符串联合类型
// ===========================================================================

/** 布尔约束类型：可直接写 true/false，或用 {exact,ideal} 对象区分必须/理想 */
type ConstrainBoolean = boolean | ConstrainBooleanParameters;

/** 布尔或字符串约束：用于 echoCancellation 这类实现中类型可变的属性 */
type ConstrainBooleanOrDOMString = boolean | string | ConstrainBooleanOrDOMStringParameters;

/** 字符串约束：单个值、值数组，或带 exact/ideal 的对象 */
type ConstrainDOMString = string | string[] | ConstrainDOMStringParameters;

/** 浮点约束：一个数字，或带 exact/ideal + min/max 的范围对象 */
type ConstrainDouble = number | ConstrainDoubleRange;

/** 无符号长整型约束：一个整数，或带 exact/ideal + min/max 的范围对象 */
type ConstrainULong = number | ConstrainULongRange;

/** RTP 接收器变换器类型（等于 RTCRtpScriptTransform） */
type RTCRtpReceiverTransform = RTCRtpScriptTransform;

/** RTP 发送器变换器类型（等于 RTCRtpScriptTransform） */
type RTCRtpSenderTransform = RTCRtpScriptTransform;

/** 媒体轨道状态：live（可用）/ ended（已终止） */
type MediaStreamTrackState = "ended" | "live";

/** 数据通道状态：connecting → open → closing → closed */
type RTCDataChannelState = "closed" | "closing" | "connecting" | "open";

/** 发送端退化偏好：balanced（平衡）/ maintain-framerate（保帧率）/ maintain-resolution（保分辨率） */
type RTCDegradationPreference = "balanced" | "maintain-framerate" | "maintain-resolution";

/** DTLS 传输状态：new / connecting → connected / failed → closed */
type RTCDtlsTransportState = "closed" | "connected" | "connecting" | "failed" | "new";

/** RTC 错误细分类型：DTLS 失败、SCTP 失败、SDP 语法错、硬件编码器不可用等 */
type RTCErrorDetailType = "data-channel-failure" | "dtls-failure" | "fingerprint-failure" | "hardware-encoder-error" | "hardware-encoder-not-available" | "sctp-failure" | "sdp-syntax-error";

/** ICE 候选类型：host（主机）/ srflx（服务器反射）/ prflx（对端反射）/ relay（TURN 中继） */
type RTCIceCandidateType = "host" | "prflx" | "relay" | "srflx";

/** ICE 传输策略：all（全部候选）/ relay（只使用 TURN 中继，用于隐藏 IP） */
type RTCIceTransportPolicy = "all" | "relay";

/** ICE 传输状态（Transport 粒度）：new → checking → connected / completed → disconnected → failed → closed */
type RTCIceTransportState = "checking" | "closed" | "completed" | "connected" | "disconnected" | "failed" | "new";

/** 整体对等连接状态：new → connecting → connected → disconnected → failed → closed */
type RTCPeerConnectionState = "closed" | "connected" | "connecting" | "disconnected" | "failed" | "new";

/** RTP 流优先级：very-low / low / medium / high */
type RTCPriorityType = "high" | "low" | "medium" | "very-low";

/** 发送端质量降级原因：none / bandwidth（带宽）/ cpu（CPU）/ other */
type RTCQualityLimitationReason = "bandwidth" | "cpu" | "none" | "other";

/** RTCP 复用策略：require（必须复用 RTP 端口，现代标准且唯一值） */
type RTCRtcpMuxPolicy = "require";

/** Transceiver 方向：sendrecv（收发）/ sendonly（只发）/ recvonly（只收）/ inactive（停用）/ stopped（已终止） */
type RTCRtpTransceiverDirection = "inactive" | "recvonly" | "sendonly" | "sendrecv" | "stopped";

/** SCTP 传输状态：connecting → connected → closed */
type RTCSctpTransportState = "closed" | "connected" | "connecting";

/** ICE 候选对统计状态：frozen → waiting → in-progress → succeeded / failed */
type RTCStatsIceCandidatePairState = "failed" | "frozen" | "in-progress" | "succeeded" | "waiting";

/** 统计项类型枚举（RTCStats.type 的所有可能取值）：inbound-rtp / outbound-rtp / candidate-pair 等 */
type RTCStatsType = "candidate-pair" | "certificate" | "codec" | "data-channel" | "inbound-rtp" | "local-candidate" | "media-playout" | "media-source" | "outbound-rtp" | "peer-connection" | "remote-candidate" | "remote-inbound-rtp" | "remote-outbound-rtp" | "transport";

/** RTP 收发器：一对 Sender + Receiver 的组合，代表一个双向媒体流（“m=”行） */
interface RTCRtpTransceiver {
    /**
     * RTCRtpTransceiver 接口的 **`setCodecPreferences()`** 方法用于设置收发器允许解码接收数据的编解码器，按偏好递减顺序排列。
     */
    setCodecPreferences(codecs: Iterable<RTCRtpCodec>): void;
}

/** 统计报告：一个 Map<string, RTCStats>，按 id 索引所有统计对象 */
interface RTCStatsReport extends ReadonlyMap<string, any> {
}

// ===========================================================================
// 附录：关键状态机快速参考（根据 W3C WebRTC / webrtc-pc 规范整理）
// ===========================================================================
//
// RTCPeerConnectionState: new → connecting → connected → disconnected → failed → closed
// RTCSignalingState:   stable → have-local-offer → have-remote-pranswer → stable
//                               ↑             ↓
//                              have-remote-offer → have-local-pranswer
//
// ICE: new → gathering → complete  (iceGatheringState)
// ICE: new → checking → connected → completed → disconnected → failed → closed  (iceConnectionState)
//
// DataChannel: connecting → open → closing → closed
// MediaStreamTrack: live → ended  (mute/unmute 可随时在 live 态切换)
// RTCRtpTransceiverDirection: sendrecv ↔ sendonly / recvonly / inactive → stopped
//
// 正常建链顺序（Offer 方）：
//   1. new RTCPeerConnection(config)
//   2. pc.addTrack() / pc.addTransceiver() 加入媒体
//   3. pc.onicecandidate 监听并转发候选到对端
//   4. const offer = await pc.createOffer(); pc.setLocalDescription(offer)
//   5. 把 offer 通过信令发给对端
//   6. 收到对端 answer → pc.setRemoteDescription(answer)
//   7. 收到对端 candidates → pc.addIceCandidate(candidate)
//   8. pc.iceConnectionState == "connected" 且 pc.connectionState == "connected"
//