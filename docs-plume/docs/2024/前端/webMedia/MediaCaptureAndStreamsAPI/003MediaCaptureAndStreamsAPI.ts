/*Media Capture and Streams API (Media Stream)*/
interface MediaStream extends EventTarget {
    readonly active: boolean;//流当前是否处于活跃状态
    readonly id: string;//唯一标识符
    addTrack(track: MediaStreamTrack): void;//添加轨道，如果已经添加到MediaStream对象中，则不会发生任何事情
    removeTrack(track: MediaStreamTrack): void;//删除轨道，如果轨道不是MediaStream对象的一部分，则不会发生任何事情
    getTracks(): MediaStreamTrack[];//获取所有轨道列表
    getTrackById(trackId: string): MediaStreamTrack | null;//获取给定ID的轨道
    getAudioTracks(): MediaStreamTrack[];//获取kind=audio的轨道列表
    getVideoTracks(): MediaStreamTrack[];//获取kind=video的轨道列表
    clone(): MediaStream;//获取MediaStream的克隆，克隆将具有唯一的id.
    stop(): void;//（已弃用）
    onactive: ((this: MediaStream, ev: Event) => any) | null;//激活MediaStream时触发
    oninactive: ((this: MediaStream, ev: Event) => any) | null;//当MediaStream未激活时触发
    onaddtrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => any) | null;//添加新MediaStreamTrack对象时触发
    onremovetrack: ((this: MediaStream, ev: MediaStreamTrackEvent) => any) | null;//当MediaStreamTrack对象被移除时触发
    addEventListener<K extends keyof MediaStreamEventMap>(type: K, listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaStreamEventMap>(type: K, listener: (this: MediaStream, ev: MediaStreamEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface MediaStreamTrack extends EventTarget {
    enabled: boolean;//是否启动，如果启用了轨道，则允许渲染媒体源流；如果它被禁用，那不是渲染媒体源流，而是渲染静音和黑度。
    readonly id: string;//唯一标识符
    readonly kind: string;//轨道类型"audio"or"video"
    readonly label: string;//标识轨道源的用户代理分配的标签
    readonly muted: boolean;//轨道是否由于技术问题而无法提供媒体数据
    readonly readyState: MediaStreamTrackState;//轨道状态（type MediaStreamTrackState = "live" | "ended";）
    readonly remote: boolean;//（已弃用）轨道是否来自远端RTCPeerConnection
    readonly isolated: boolean;
    readonly readonly: boolean;
    applyConstraints(constraints: MediaTrackConstraints): Promise<void>;//将一组约束应用于轨道
    clone(): MediaStreamTrack;//获取MediaStreamTrack的副本
    getCapabilities(): MediaTrackCapabilities;//获取可用于MediaStreamTrack的可约束属性的列表
    getConstraints(): MediaTrackConstraints;//获取当前设置的轨道约束
    getSettings(): MediaTrackSettings;//获取每个可约束属性的当前值
    stop(): void;//停止播放与轨道关联的源，源和轨道解除关联
    onended: ((this: MediaStreamTrack, ev: MediaStreamErrorEvent) => any) | null;//当播放结束时发送
    onisolationchange: ((this: MediaStreamTrack, ev: Event) => any) | null;//isolated改变触发
    onmute: ((this: MediaStreamTrack, ev: Event) => any) | null;//当muted属性值变为true时触发，表示轨道暂时无法提供数据（如网络出现服务故障时）
    onoverconstrained: ((this: MediaStreamTrack, ev: MediaStreamErrorEvent) => any) | null;//当为轨道指定的约束导致轨道不兼容并因此无法使用时发送
    onunmute: ((this: MediaStreamTrack, ev: Event) => any) | null;//当数据再次可用时发送到轨道
    addEventListener<K extends keyof MediaStreamTrackEventMap>(type: K, listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaStreamTrackEventMap>(type: K, listener: (this: MediaStreamTrack, ev: MediaStreamTrackEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface MediaDevices extends EventTarget {
    enumerateDevices(): Promise<MediaDeviceInfo[]>;//获取有关系统上可用的媒体输入和输出设备的一系列信息
    getSupportedConstraints(): MediaTrackSupportedConstraints;//支持哪些可约束属性的对象
    getDisplayMedia(constraints?: DisplayMediaStreamConstraints): Promise<MediaStream>;//提示用户选择要捕获的显示或显示的一部分
    getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;//通过提示获得用户许可，打开系统上的摄像头或麦克风，并提供MediaStream包含输入的视频轨道或音频轨道
    ondevicechange: ((this: MediaDevices, ev: Event) => any) | null;//当媒体输入或输出设备连接到用户计算机或从用户计算机移除时触发
    addEventListener<K extends keyof MediaDevicesEventMap>(type: K, listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof MediaDevicesEventMap>(type: K, listener: (this: MediaDevices, ev: MediaDevicesEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface NavigatorUserMedia {
    readonly mediaDevices: MediaDevices;//媒体设备
    getDisplayMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;//提示用户选择要捕获的显示或显示的一部分（例如窗口）以MediaStream用于共享或记录目的
    getUserMedia(constraints: MediaStreamConstraints, successCallback: NavigatorUserMediaSuccessCallback, errorCallback: NavigatorUserMediaErrorCallback): void;
}
/*字典接口*/
interface MediaStreamEventMap {
    "active": Event;
    "addtrack": MediaStreamTrackEvent;
    "inactive": Event;
    "removetrack": MediaStreamTrackEvent;
}
interface MediaStreamTrackEventMap {
    "ended": MediaStreamErrorEvent;
    "isolationchange": Event;
    "mute": Event;
    "overconstrained": MediaStreamErrorEvent;
    "unmute": Event;
}
interface MediaTrackCapabilities {
    aspectRatio?: number | DoubleRange;//可接受或要求的视频宽高比或宽高比范围
    deviceId?: string;//可接受或必需的设备ID或设备ID数组的对象
    echoCancellation?: boolean[];//是否需要回声消除的对象
    facingMode?: string;//可接受或要求的面向用户的摄像头
    frameRate?: number | DoubleRange;//可接受或要求的帧速率或帧速率范围
    groupId?: string;//可接受或必需的组ID或组ID数组的对象
    height?: number | LongRange;//可接受或要求的视频高度或高度范围
    width?: number | LongRange;//可接受或要求的视频宽度或宽度范围
    sampleRate?: number | LongRange;//可接受或要求的采样率或采样率范围
    sampleSize?: number | LongRange;//可接受或要求的样本量或样本量范围
    volume?: number | DoubleRange;//可接受或要求的体积或体积范围
}
interface MediaTrackSettings {
    aspectRatio?: number;//视频宽高比
    deviceId?: string;//设备ID
    echoCancellation?: boolean;//回声消除
    facingMode?: string;//面向用户的摄像头
    frameRate?: number;//帧速率
    groupId?: string;//组ID
    height?: number;//视频高度
    width?: number;//视频宽度
    sampleRate?: number;//采样率
    sampleSize?: number;//样本量
    volume?: number;//体积
}
interface MediaTrackConstraintSet {
    aspectRatio?: number | ConstrainDoubleRange;//指定可接受或要求的视频宽高比或宽高比范围
    channelCount?: number | ConstrainLongRange;//指定可接受或要求的通道计数或通道计数范围
    deviceId?: string | string[] | ConstrainDOMStringParameters;//指定可接受或必需的设备ID或设备ID数组的对象
    displaySurface?: string | string[] | ConstrainDOMStringParameters;//桌面窗口范围
    echoCancellation?: boolean | ConstrainBooleanParameters;//指定是否需要回声消除的对象
    facingMode?: string | string[] | ConstrainDOMStringParameters;//指定可接受或要求的面向用户的摄像头
    frameRate?: number | ConstrainDoubleRange;//指定可接受或要求的帧速率或帧速率范围
    groupId?: string | string[] | ConstrainDOMStringParameters;//指定可接受或必需的组ID或组ID数组的对象
    height?: number | ConstrainLongRange;//指定可接受或要求的视频高度或高度范围
    width?: number | ConstrainLongRange;//指定可接受或要求的视频宽度或宽度范围
    latency?: number | ConstrainDoubleRange;//可接受或要求的延迟或延迟范围
    logicalSurface?: boolean | ConstrainBooleanParameters;//指示是否允许用户选择与显示区域不直接对应的源表面
    sampleRate?: number | ConstrainLongRange;//指定可接受或要求的采样率或采样率范围
    sampleSize?: number | ConstrainLongRange;//指定可接受或要求的样本量或样本量范围
    volume?: number | ConstrainDoubleRange;//指定可接受或要求的体积或体积范围
}
interface MediaTrackConstraints extends MediaTrackConstraintSet {
    advanced?: MediaTrackConstraintSet[];
}
interface DoubleRange {
    max?: number;//最大允许值
    min?: number;//最小允许值
}
interface ConstrainDoubleRange extends DoubleRange {
    exact?: number;//可接受的值
    ideal?: number;//理想的值
}
interface LongRange {
    max?: number;//最大允许值
    min?: number;//最小允许值
}
interface ConstrainLongRange extends LongRange {
    exact?: number;//确切的值
    ideal?: number;//理想的值
}
interface ConstrainDOMStringParameters {
    exact?: string | string[];//确切的值
    ideal?: string | string[];//理想的值
}
interface ConstrainBooleanParameters {
    exact?: boolean;//确切的值
    ideal?: boolean;//理想的值
}
interface MediaTrackSupportedConstraints {
    aspectRatio?: boolean;//可接受或要求的视频宽高比或宽高比范围
    deviceId?: boolean;//可接受或必需的设备ID或设备ID数组的对象
    echoCancellation?: boolean;//是否需要回声消除的对象
    facingMode?: boolean;//可接受或要求的面向用户的摄像头
    frameRate?: boolean;//可接受或要求的帧速率或帧速率范围
    groupId?: boolean;//可接受或必需的组ID或组ID数组的对象
    height?: boolean;//可接受或要求的视频高度或高度范围
    width?: boolean;//可接受或要求的视频宽度或宽度范围
    sampleRate?: boolean;//可接受或要求的采样率或采样率范围
    sampleSize?: boolean;//可接受或要求的样本量或样本量范围
    volume?: boolean;//可接受或要求的体积或体积范围
}
interface MediaDevicesEventMap {
    "devicechange": Event;
}
interface MediaDeviceInfo {
    readonly deviceId: string;//设备的标识符
    readonly groupId: string;//组标识符
    readonly kind: MediaDeviceKind;//（type MediaDeviceKind = "audioinput" | "audiooutput" | "videoinput";）
    readonly label: string;//设备的标签
}
interface MediaStreamConstraints {
    audio?: boolean | MediaTrackConstraints;//音频约束
    video?: boolean | MediaTrackConstraints;//视频约束
    peerIdentity?: string;
}
interface NavigatorUserMediaErrorCallback {
    (error: MediaStreamError): void;
}
interface NavigatorUserMediaSuccessCallback {
    (stream: MediaStream): void;
}
interface MediaStreamError {
    readonly constraintName: string | null;
    readonly message: string | null;
    readonly name: string;
}
interface MediaStreamErrorEvent extends Event {
    readonly error: MediaStreamError | null;
}
interface MediaStreamTrackEvent extends Event {
    readonly track: MediaStreamTrack;
}
interface DisplayMediaStreamConstraints {
    audio?: boolean | MediaTrackConstraints;
    video?: boolean | MediaTrackConstraints;
}
/*构造字典接口*/
interface MediaStreamEvent extends Event {
    readonly stream: MediaStream | null;
}
interface MediaStreamErrorEventInit extends EventInit {
    error?: MediaStreamError | null;
}
interface MediaStreamEventInit extends EventInit {
    stream?: MediaStream;
}
interface MediaStreamTrackEventInit extends EventInit {
    track?: MediaStreamTrack | null;
}
/*构造函数*/
declare var MediaStreamEvent: {
    prototype: MediaStreamEvent;
    new(type: string, eventInitDict: MediaStreamEventInit): MediaStreamEvent;
};
declare var MediaDeviceInfo: {
    prototype: MediaDeviceInfo;
    new(): MediaDeviceInfo;
};
declare var MediaStream: {
    prototype: MediaStream;
    new(): MediaStream;
    new(stream: MediaStream): MediaStream;
    new(tracks: MediaStreamTrack[]): MediaStream;
};
declare var MediaStreamTrackEvent: {
    prototype: MediaStreamTrackEvent;
    new(typeArg: string, eventInitDict?: MediaStreamTrackEventInit): MediaStreamTrackEvent;
};
declare var MediaStreamTrack: {
    prototype: MediaStreamTrack;
    new(): MediaStreamTrack;
};
declare var MediaStreamErrorEvent: {
    prototype: MediaStreamErrorEvent;
    new(typeArg: string, eventInitDict?: MediaStreamErrorEventInit): MediaStreamErrorEvent;
};
declare var MediaStreamError: {
    prototype: MediaStreamError;
    new(): MediaStreamError;
};
declare var MediaDevices: {
    prototype: MediaDevices;
    new(): MediaDevices;
};
