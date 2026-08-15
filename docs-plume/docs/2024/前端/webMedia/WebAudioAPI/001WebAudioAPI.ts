/*Web Audio API*/
interface AudioContext extends BaseAudioContext {
    readonly baseLatency: number;//音频从音频子系统传递到目标节点（AudioDestinationNode）所产生的处理延迟秒数
    readonly outputLatency: number;//当前音频上下文的输出延迟的估计值
    createMediaElementSource(mediaElement: HTMLMediaElement): MediaElementAudioSourceNode;//（音频源）创建与HTMLMediaElement关联的MediaElementAudioSourceNode，用于播放和操作来自<video>或<audio>元素的音频
    createMediaStreamSource(mediaStream: MediaStream): MediaStreamAudioSourceNode;//（音频源）创建与MediaStream音频流关联的MediaStreamAudioSourceNode，该音频流可能来自本地计算机麦克风或其他来源。
    createMediaStreamTrackSource(mediaStreamTrack: MediaStreamTrack): MediaStreamTrackAudioSourceNode;//（音频源）创建与MediaStream媒体流轨道关联的MediaStreamTrackAudioSourceNode
    createMediaStreamDestination(): MediaStreamAudioDestinationNode;//创建与MediaStream音频流相关联的MediaStreamAudioDestinationNode，该音频流可以存储在本地文件中或发送到另一台计算机。
    getOutputTimestamp(): AudioTimestamp;//返回一个新AudioTimestamp对象，其中包含与当前音频上下文相关的两个音频时间戳值
    close(): Promise<void>;//关闭音频上下文，释放它使用的任何系统音频资源
    suspend(): Promise<void>;//暂停音频上下文中的时间进程，暂时停止音频硬件访问并减少进程中的CPU电池使用
    addEventListener<K extends keyof BaseAudioContextEventMap>(type: K, listener: (this: AudioContext, ev: BaseAudioContextEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BaseAudioContextEventMap>(type: K, listener: (this: AudioContext, ev: BaseAudioContextEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface BaseAudioContext extends EventTarget {
    readonly audioWorklet: AudioWorklet;//音频处理，JavaScript代码在后台运行以处理音频数据
    readonly currentTime: number;//不断增加的硬件时间（以秒为单位）
    readonly destination: AudioDestinationNode;//上下文中所有音频的最终目标=>音频渲染设备
    readonly listener: AudioListener;//用于3D空间化
    readonly sampleRate: number;//音频上下文的采样率(HZ)（不支持修改）
    readonly state: AudioContextState;//当前状态（type AudioContextState = "suspended" | "running" | "closed";）
    onstatechange: ((this: BaseAudioContext, ev: Event) => any) | null;//状态变化触发事件
    createAnalyser(): AnalyserNode;//AnalyserNode节点可用于显示音频时间和频率数据，例如用于创建数据可视化
    createBiquadFilter(): BiquadFilterNode;//BiquadFilterNode节点可配置为几种不同的常见滤波器类型的二阶滤波器
    createBuffer(numberOfChannels: number, length: number, sampleRate: number): AudioBuffer;//创建空AudioBuffer，可以使用数据填充该对象并通过AudioBufferSourceNode播放该对象
    createBufferSource(): AudioBufferSourceNode;//（音频源）AudioBufferSourceNode节点可用于播放和操作AudioBuffer对象中包含的音频数据
    createChannelMerger(numberOfInputs?: number): ChannelMergerNode;//ChannelMergerNode用于将来自多个音频流的通道合并到单个音频流中
    createChannelSplitter(numberOfOutputs?: number): ChannelSplitterNode;//ChannelSplitterNode用于访问音频流的各个通道并单独处理它们
    createConstantSource(): ConstantSourceNode;//（音频源）ConstantSourceNode是连续输出单声道（单声道）声音信号的音频源，其样本都具有相同的值
    createConvolver(): ConvolverNode;//ConvolverNode节点可用于将卷积效果应用于音频图，例如混响效果
    createDelay(maxDelayTime?: number): DelayNode;//DelayNode用于将传入的音频信号延迟一定量。此节点还可用于在Web音频API图中创建反馈循环
    createDynamicsCompressor(): DynamicsCompressorNode;//DynamicsCompressorNode节点可用于将声音压缩应用于音频信号
    createGain(): GainNode;//GainNode可用于控制音频图形的整体音量
    createIIRFilter(feedforward: number[], feedback: number[]): IIRFilterNode;//IIRFilterNode可配置为几种不同的常见筛选器类型的二阶筛选器
    createOscillator(): OscillatorNode;//（音频源）OscillatorNode表示周期性波形的源。它基本上生成一个音调
    createPanner(): PannerNode;//PannerNode用于在3D空间中对传入的音频流进行空间化
    createPeriodicWave(real: number[] | Float32Array, imag: number[] | Float32Array, constraints?: PeriodicWaveConstraints): PeriodicWave;//PeriodicWave可用于确定OscillatorNode节点输出的周期性波形
    createScriptProcessor(bufferSize?: number, numberOfInputChannels?: number, numberOfOutputChannels?: number): ScriptProcessorNode;//（已弃用，被AudioWorklet取代）ScriptProcessorNode可用于通过JavaScript进行直接音频处理
    createStereoPanner(): StereoPannerNode;//StereoPannerNode节点可用于将立体声平移应用于音频源
    createWaveShaper(): WaveShaperNode;//WaveShaperNode用于实现非线性失真效果
    decodeAudioData(audioData: ArrayBuffer, successCallback?: DecodeSuccessCallback | null, errorCallback?: DecodeErrorCallback | null): Promise<AudioBuffer>;//异步解码ArrayBuffer中包含的音频文件数据（仅适用于完整的文件，不适用于音频文件的片段）
    resume(): Promise<void>;//已暂停的音频上下文中恢复时间的进度
    addEventListener<K extends keyof BaseAudioContextEventMap>(type: K, listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof BaseAudioContextEventMap>(type: K, listener: (this: BaseAudioContext, ev: BaseAudioContextEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface OfflineAudioContext extends BaseAudioContext {
    readonly length: number;//样本帧中缓冲区的大小
    oncomplete: ((this: OfflineAudioContext, ev: OfflineAudioCompletionEvent) => any) | null;//在处理终止时调用的事件处理程序
    startRendering(): Promise<AudioBuffer>;//开始渲染音频
    suspend(suspendTime: number): Promise<void>;//暂停音频上下文中的时间进度
    addEventListener<K extends keyof OfflineAudioContextEventMap>(type: K, listener: (this: OfflineAudioContext, ev: OfflineAudioContextEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof OfflineAudioContextEventMap>(type: K, listener: (this: OfflineAudioContext, ev: OfflineAudioContextEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
/*字典接口*/
interface AudioParam {
    automationRate: AutomationRate;//参数类型（type AutomationRate = "a-rate" | "k-rate";）
    readonly defaultValue: number;//初始值
    readonly maxValue: number;//最大可能值
    readonly minValue: number;//最小可能值
    value: number;//当前值
    setValueAtTime(value: number, startTime: number): AudioParam;//在精确时间对值的即时更改
    setTargetAtTime(target: number, startTime: number, timeConstant: number): AudioParam;//计划开始逐步更改该值
    setValueCurveAtTime(values: number[] | Float32Array, startTime: number, duration: number): AudioParam;//沿值列表定义的曲线进行更改
    exponentialRampToValueAtTime(value: number, endTime: number): AudioParam;//计划AudioParam值的逐渐指数变化。从为上一个事件指定的时间开始，遵循指数渐变到参数中给定的新值，并在参数中给定的时间达到新值。
    linearRampToValueAtTime(value: number, endTime: number): AudioParam;//安排音频值的逐渐线性变化。从上一个事件指定的时间开始，沿着线性渐变到参数中给定的新值，并在参数中给定的时间达到新值。
    cancelAndHoldAtTime(cancelTime: number): AudioParam;//取消将来所有计划更改
    cancelScheduledValues(cancelTime: number): AudioParam;//取消所有预定未来更改，但在给定时间保持其值，直到使用其他方法进行进一步更改
}
interface AudioNode extends EventTarget {
    channelCount: number;//表示一个整数，用于确定在对节点的任何输入进行上混和下混连接时使用多少通道。它的用法和精确定义取决于channelCountMode
    channelCountMode: ChannelCountMode;//节点的输入和输出之间的通道必须匹配的方式（type ChannelCountMode = "max" | "clamped-max" | "explicit";）
    channelInterpretation: ChannelInterpretation;//描述通道含义的枚举值。定义音频上混和下混将如何发生（type ChannelInterpretation = "speakers" | "discrete";）
    readonly context: BaseAudioContext;//关联的BaseAudioContext，即节点参与的处理图对象
    readonly numberOfInputs: number;//节点输入的数量
    readonly numberOfOutputs: number;//节点输出的数量
    connect(destinationNode: AudioNode, output?: number, input?: number): AudioNode;//允许我们将此节点的输出连接到另一个节点，作为音频数据输入
    connect(destinationParam: AudioParam, output?: number): void;//允许我们将此节点的输出连接到另一个节点，作为AudioParam的值输入
    disconnect(): void;//断开所有传出连接
    disconnect(output: number): void;//断开对应索引的输出连接
    disconnect(destinationNode: AudioNode): void;//断开对应AudioNode的输出连接
    disconnect(destinationNode: AudioNode, output: number): void;//断开AudioNode对应索引的输出连接
    disconnect(destinationNode: AudioNode, output: number, input: number): void;//断开AudioNode对应索引的输出连接
    disconnect(destinationParam: AudioParam): void;//断开对应AudioParam的输出连接
    disconnect(destinationParam: AudioParam, output: number): void;//断开AudioParam对应索引的输出连接
}
interface MediaElementAudioSourceNode extends AudioNode {
    readonly mediaElement: HTMLMediaElement;//构造MediaStreamAudioSourceNode时使用的HTMLMediaElement
}
interface MediaStreamAudioSourceNode extends AudioNode {
    readonly mediaStream: MediaStream;//构造MediaStreamAudioSourceNode时使用的MediaStream
}
interface MediaStreamTrackAudioSourceNode extends AudioNode {}
interface MediaStreamAudioDestinationNode extends AudioNode {
    readonly stream: MediaStream;//构造MediaStreamAudioDestinationNode时使用的MediaStream
}
interface AudioTimestamp {
    contextTime?: number;//音频输出设备当前呈现的示例帧的时间（即输出音频流位置）
    performanceTime?: number;//示例帧的时刻的估计值
}
interface BaseAudioContextEventMap {
    "statechange": Event;
}
interface WorkletOptions {
    credentials?: RequestCredentials;//在加载模块时是否发送凭据（type RequestCredentials = "omit" | "same-origin" | "include";）
}
interface Worklet {
    addModule(moduleURL: string, options?: WorkletOptions): Promise<void>;//将给定URL处的脚本模块添加到当前工作部件中
}
interface AudioWorklet extends Worklet {}
interface AudioDestinationNode extends AudioNode {
    readonly maxChannelCount: number;//物理设备可以处理的最大通道数
}
interface AudioListener {
    readonly positionX: AudioParam;//侦听器在右侧笛卡尔坐标系中的水平位置
    readonly positionY: AudioParam;//侦听器在右侧笛卡尔坐标系中的垂直位置
    readonly positionZ: AudioParam;//侦听器在右侧笛卡尔坐标系中的纵向位置
    readonly forwardX: AudioParam;//侦听器前进方向的水平位置，与位置（positionX、positionY和positionZ）相同的笛卡尔坐标系中的水平位置。正向值和向上值彼此线性独立。默认值为0。
    readonly forwardY: AudioParam;//侦听器前进方向的垂直位置，与位置（positionX、positionY和positionZ）相同的笛卡尔坐标系中的垂直位置。正向值和向上值彼此线性独立。默认值为0。
    readonly forwardZ: AudioParam;//侦听器前进方向的纵向位置，与位置（positionX、positionY和positionZ）相同的笛卡尔坐标系中的纵向位置。正向值和向上值彼此线性独立。默认值为-1。
    readonly upX: AudioParam;//侦听器头顶的水平位置
    readonly upY: AudioParam;//侦听器头顶的垂直位置
    readonly upZ: AudioParam;//侦听器头顶的纵向位置
    setOrientation(x: number, y: number, z: number, xUp: number, yUp: number, zUp: number): void;//（已弃用）设置侦听器的方向
    setPosition(x: number, y: number, z: number): void;//（已弃用）设置侦听器的位置
}
interface AnalyserNode extends AudioNode {
    fftSize: number;//表示FFT（快速傅里叶变换）用于确定频域
    readonly frequencyBinCount: number;//FFT大小的一半的无符号值
    maxDecibels: number;//FFT分析数据缩放范围内的最大功率值
    minDecibels: number;//FFT分析数据缩放范围内的最小功率值
    smoothingTimeConstant: number;//最后一个分析帧的平均常数的双精度值
    getByteFrequencyData(array: Uint8Array): void;//将当前频率数据复制到传递给它的Uint8Array（无符号字节数组）中
    getFloatFrequencyData(array: Float32Array): void;//将当前频率数据复制到传递给它的Float32Array数组中
    getByteTimeDomainData(array: Uint8Array): void;//将当前波形或时域数据复制到传递给它的Uint8Array（无符号字节数组）中
    getFloatTimeDomainData(array: Float32Array): void;//将当前波形或时域数据复制到传递给它的Float32Array数组中
}
interface BiquadFilterNode extends AudioNode {
    readonly Q: AudioParam;//Q因子或质量因子的双精度
    readonly detune: AudioParam;//频率失谐（单位：美分）
    readonly frequency: AudioParam;//当前滤波算法中的频率，单位为赫兹（Hz）
    readonly gain: AudioParam;//当前滤波算法中使用的增益
    type: BiquadFilterType;//定义节点正在实现的过滤算法的类型（type BiquadFilterType = "lowpass" | "highpass" | "bandpass" | "lowshelf" | "highshelf" | "peaking" | "notch" | "allpass";）
    getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;//根据当前滤波器参数设置，此方法计算所提供频率数组中指定频率的频率响应
}
interface AudioBuffer {
    readonly sampleRate: number;//缓冲区中存储的PCM数据的采样率（以每秒样本数为单位）
    readonly duration: number;//缓冲区中存储的PCM数据的持续时间（以秒为单位）
    readonly length: number;//存储在缓冲区中的PCM数据的长度（以采样帧为单位）
    readonly numberOfChannels: number;//存储在缓冲区中的PCM数据描述的离散音频通道数
    getChannelData(channel: number): Float32Array;//与通道关联的PCM数据
    copyFromChannel(destination: Float32Array, channelNumber: number, startInChannel?: number): void;//将样本从指定的通道复制到数组
    copyToChannel(source: Float32Array, channelNumber: number, startInChannel?: number): void;//将样本从数组复制到指定通道
}
interface AudioBufferSourceNode extends AudioScheduledSourceNode {
    buffer: AudioBuffer | null;//要播放的音频数据
    readonly detune: AudioParam;//以美分为单位的播放失谐，该值与播放速率复合，以确定播放声音的速度
    loop: boolean;//在到达音频缓冲区末尾时是否必须重放音频资源
    loopStart: number;//循环为真时音频缓冲区必须开始播放的时间（以秒为单位）
    loopEnd: number;//音频缓冲区停止播放并循环回loopStart（如果loop为真）指示的时间（以秒为单位）
    readonly playbackRate: AudioParam;//音频资源播放时的速度系数，其中1.0是声音的自然采样率。该值与失谐进行复合，以确定最终播放速率。
    start(when?: number, offset?: number, duration?: number): void;//播放缓冲区中包含的音频数据
    addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(type: K, listener: (this: AudioBufferSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(type: K, listener: (this: AudioBufferSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface AudioScheduledSourceNodeEventMap {
    "ended": Event;
}
interface ChannelMergerNode extends AudioNode {}
interface ChannelSplitterNode extends AudioNode {}
interface ConstantSourceNode extends AudioScheduledSourceNode {
    readonly offset: AudioParam;//指定该源连续输出的值。默认值为1.0。
    addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(type: K, listener: (this: ConstantSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(type: K, listener: (this: ConstantSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface AudioScheduledSourceNode extends AudioNode {
    start(when?: number): void;//开始播放常量声音
    stop(when?: number): void;//指定时间停止播放
    onended: ((this: AudioScheduledSourceNode, ev: Event) => any) | null;//当源节点停止播放时触发
    addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(type: K, listener: (this: AudioScheduledSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(type: K, listener: (this: AudioScheduledSourceNode, ev: AudioScheduledSourceNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface ConvolverNode extends AudioNode {
    buffer: AudioBuffer | null;//一种单声道、立体声或四声道音频缓冲区，包含卷积模式用来产生混响效果的（可能是多声道）脉冲响应。
    normalize: boolean;//用于控制在设置缓冲区属性时，缓冲区的脉冲响应是否会通过等功率标准化进行缩放。
}
interface DelayNode extends AudioNode {
    readonly delayTime: AudioParam;//要应用的延迟量，以秒为单位。
}
interface DynamicsCompressorNode extends AudioNode {
    readonly knee: AudioParam;//分贝值，表示曲线平滑过渡到压缩部分的阈值以上的范围。
    readonly ratio: AudioParam;//表示输出中1dB变化所需的输入变化量，单位为dB。
    readonly reduction: number;//表示压缩器当前应用于信号的增益降低量。
    readonly attack: AudioParam;//表示将增益降低10dB所需的时间量（以秒为单位）。
    readonly release: AudioParam;//表示将增益增加10dB所需的时间量（以秒为单位）。
    readonly threshold: AudioParam;//分贝值，超过该分贝值，压缩将开始生效。
}
interface GainNode extends AudioNode {
    readonly gain: AudioParam;//要应用的增益量。
}
interface IIRFilterNode extends AudioNode {
    //使用滤波器的当前参数设置来计算在提供的频率数组中指定的频率的响应
    getFrequencyResponse(frequencyHz: Float32Array, magResponse: Float32Array, phaseResponse: Float32Array): void;
}
interface OscillatorNode extends AudioScheduledSourceNode {
    readonly frequency: AudioParam;//表示振荡频率（以Hz为单位），默认值为440Hz。
    readonly detune: AudioParam;//表示振荡失谐（单位为美分），默认值为0。
    type: OscillatorType;//播放的波形形状（type OscillatorType = "sine" | "square" | "sawtooth" | "triangle" | "custom";）
    setPeriodicWave(periodicWave: PeriodicWave): void;//要使用的周期波形
    addEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(type: K, listener: (this: OscillatorNode, ev: AudioScheduledSourceNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AudioScheduledSourceNodeEventMap>(type: K, listener: (this: OscillatorNode, ev: AudioScheduledSourceNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface PeriodicWave {}
interface PannerNode extends AudioNode {
    coneInnerAngle: number;//是一个双精度值，用于描述圆锥体的角度，单位为度，圆锥体内部不会有体积减小。
    coneOuterAngle: number;//一个双精度值，用于描述圆锥体的角度（以度为单位），圆锥体外的体积将减少一个常量值，该常量值由coneOuterGain属性定义。
    coneOuterGain: number;//一个双精度值，用于描述圆锥体外的体积缩减量，该圆锥体由“锥角”属性定义。其默认值为0，表示听不到声音。
    distanceModel: DistanceModelType;//一个枚举值，用于确定在音频源离开侦听器时使用哪种算法来减少音频源的音量。（type DistanceModelType = "linear" | "inverse" | "exponential";）
    maxDistance: number;//表示音频源和监听器之间的最大距离的双倍值，在此之后音量不再减小。
    readonly orientationX: AudioParam;//表示音频源向量在右侧笛卡尔坐标系中的水平位置。默认值为1。
    readonly orientationY: AudioParam;//表示音频源矢量在右侧笛卡尔坐标系中的垂直位置。默认值为0。
    readonly orientationZ: AudioParam;//表示音频源矢量在右侧笛卡尔坐标系中的纵向位置。默认值为0。
    panningModel: PanningModelType;//用于确定使用哪种空间化算法在3D空间中定位音频（type PanningModelType = "equalpower" | "HRTF";）
    readonly positionX: AudioParam;//表示音频在右侧笛卡尔坐标系中的水平位置。默认值为0。
    readonly positionY: AudioParam;//表示音频在右侧笛卡尔坐标系中的垂直位置。默认值为0。
    readonly positionZ: AudioParam;//表示音频在右侧笛卡尔坐标系中的纵向位置。默认值为0。
    refDistance: number;//一个双精度值，表示当音频源远离听者时降低音量的参考距离。对于大于此值的距离，将根据rolloffFactor和distanceModel减少体积。
    rolloffFactor: number;//一个双精度值，描述当源离开侦听器时音量减少的速度。所有距离模型都使用此值。
    setOrientation(x: number, y: number, z: number): void;//定义音频源的播放方向
    setPosition(x: number, y: number, z: number): void;//定义音频源相对于侦听器的位置
}
interface PeriodicWaveConstraints {
    disableNormalization?: boolean;//对周期波禁用归一化
}
interface ScriptProcessorNode extends AudioNode {
    readonly bufferSize: number;//（已弃用）输入和输出缓冲区大小
    onaudioprocess: ((this: ScriptProcessorNode, ev: AudioProcessingEvent) => any) | null;//（已弃用）输入缓冲区准备好处理时触发
    addEventListener<K extends keyof ScriptProcessorNodeEventMap>(type: K, listener: (this: ScriptProcessorNode, ev: ScriptProcessorNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof ScriptProcessorNodeEventMap>(type: K, listener: (this: ScriptProcessorNode, ev: ScriptProcessorNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface AudioProcessingEvent extends Event {
    readonly inputBuffer: AudioBuffer;//要处理的输入音频数据的缓冲区
    readonly outputBuffer: AudioBuffer;//应写入输出音频数据的缓冲区
    readonly playbackTime: number;//播放音频的时间
}
interface ScriptProcessorNodeEventMap {
    "audioprocess": AudioProcessingEvent;
}
interface StereoPannerNode extends AudioNode {
    readonly pan: AudioParam;//要应用的平移量
}
interface WaveShaperNode extends AudioNode {
    curve: Float32Array | null;//要应用的失真的数字
    oversample: OverSampleType;//是否必须使用过采样（type OverSampleType = "none" | "2x" | "4x";）
}
interface DecodeSuccessCallback {
    (decodedData: AudioBuffer): void;
}
interface DecodeErrorCallback {
    (error: DOMException): void;
}
interface OfflineAudioContextEventMap extends BaseAudioContextEventMap {
    "complete": OfflineAudioCompletionEvent;
}
interface OfflineAudioCompletionEvent extends Event {
    readonly renderedBuffer: AudioBuffer;
}
interface OfflineAudioCompletionEventInit extends EventInit {
    renderedBuffer: AudioBuffer;
}
/*替代ScriptProcessorNode的AudioWorkletNode*/
interface AudioWorkletNode extends AudioNode {
    onprocessorerror: ((this: AudioWorkletNode, ev: Event) => any) | null;//在关联AudioWorkletProcessor中引发错误时触发
    readonly parameters: AudioParamMap;//AudioParam对象的集合，和AudioWorkletProcessor的process()方法的parameters参数关联使用
    readonly port: MessagePort;//用于AudioWorkletNode节点与其关联的AudioWorkletProcessor进行双向通信
    addEventListener<K extends keyof AudioWorkletNodeEventMap>(type: K, listener: (this: AudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof AudioWorkletNodeEventMap>(type: K, listener: (this: AudioWorkletNode, ev: AudioWorkletNodeEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface AudioParamMap {
    forEach(callbackfn: (value: AudioParam, key: string, parent: AudioParamMap) => void, thisArg?: any): void;
}
interface AudioWorkletNodeEventMap {
    "processorerror": Event;
}
interface AudioWorkletNodeOptions extends AudioNodeOptions {
    numberOfInputs?: number;//节点输入的数量
    numberOfOutputs?: number;//节点输出的数量
    outputChannelCount?: number[];//输出通道数
    parameterData?: Record<string, number>;//parameters参数
    processorOptions?: any;//初始化的任何附加数据
}
interface AudioWorkletProcessor {
    readonly port:MessagePort;//用于AudioWorkletNode节点与其关联的AudioWorkletProcessor进行双向通信
}
interface WorkletGlobalScope {}
interface AudioWorkletGlobalScope extends WorkletGlobalScope {
    registerProcessor (name:string, processorCtor:AudioWorkletProcessor): void;//注册从接口AudioWorkletProcessor派生的类。然后可以通过创建一个类来使用该类AudioWorkletNode，并提供其注册名称。
    readonly currentFrame:number;
    readonly currentTime:number;
    readonly sampleRate:number;
}
/*
使用方法
class VoiceDataGet extends AudioWorkletProcessor {
    //options由new AudioWorkletNode()时传递
    constructor(options) {
        super();
        console.log(options);
        this.port.onmessage = (e) => {
            console.log(e.data)
            this.port.postMessage('pong')
        }
    }
    //初始化parameters
    static get parameterDescriptors () {
        return [{
            name: 'customGain',
            defaultValue: 1,
            minValue: 0,
            maxValue: 30,
            automationRate: 'a-rate'
        }]
    }
    //inputList和outputList都是输入或输出的数组
    process (inputList, outputList, parameters) {
        console.log(inputList)
        this.port.postMessage(inputList[0]);
        return true;//回来让系统知道我们仍处于活动状态并准备处理音频。
    }
}
registerProcessor('voice-data-get', VoiceDataGet)
*/

/*构造传参字典接口*/
interface OfflineAudioContextOptions {
    length: number;//音频上下文创建的缓冲区的大小
    numberOfChannels?: number;//通道数
    sampleRate: number;//以每秒采样帧数为单位的线性音频数据的采样率
}
interface AudioBufferOptions {
    length: number;//存储在缓冲区中的PCM数据的长度（以采样帧为单位）
    numberOfChannels?: number;//存储在缓冲区中的PCM数据描述的离散音频通道数
    sampleRate: number;//缓冲区中存储的PCM数据的采样率（以每秒样本数为单位）
}
interface AudioBufferSourceOptions {
    buffer?: AudioBuffer | null;
    detune?: number;
    loop?: boolean;
    loopEnd?: number;
    loopStart?: number;
    playbackRate?: number;
}
interface AudioContextOptions {
    latencyHint?: AudioContextLatencyCategory | number;//（type AudioContextLatencyCategory = "balanced" | "interactive" | "playback";）
    sampleRate?: number;//采样率（未指定选项，则默认使用新上下文的输出设备的首选采样率。）
}
interface AudioProcessingEventInit extends EventInit {
    inputBuffer: AudioBuffer;
    outputBuffer: AudioBuffer;
    playbackTime: number;
}
interface AudioNodeOptions {
    channelCount?: number;
    channelCountMode?: ChannelCountMode;
    channelInterpretation?: ChannelInterpretation;
}
interface BiquadFilterOptions extends AudioNodeOptions {
    Q?: number;
    detune?: number;
    frequency?: number;
    gain?: number;
    type?: BiquadFilterType;
}
interface ChannelMergerOptions extends AudioNodeOptions {
    numberOfInputs?: number;
}
interface ChannelSplitterOptions extends AudioNodeOptions {
    numberOfOutputs?: number;
}
interface ConstantSourceOptions {
    offset?: number;
}
interface ConvolverOptions extends AudioNodeOptions {
    buffer?: AudioBuffer | null;
    disableNormalization?: boolean;
}
interface DelayOptions extends AudioNodeOptions {
    delayTime?: number;
    maxDelayTime?: number;
}
interface DynamicsCompressorOptions extends AudioNodeOptions {
    attack?: number;
    knee?: number;
    ratio?: number;
    release?: number;
    threshold?: number;
}
interface GainOptions extends AudioNodeOptions {
    gain?: number;
}
interface IIRFilterOptions extends AudioNodeOptions {
    feedback: number[];
    feedforward: number[];
}
interface MediaElementAudioSourceOptions {
    mediaElement: HTMLMediaElement;
}
interface MediaStreamAudioSourceOptions {
    mediaStream: MediaStream;
}
interface MediaStreamTrackAudioSourceOptions {
    mediaStreamTrack: MediaStreamTrack;
}
interface OscillatorOptions extends AudioNodeOptions {
    detune?: number;
    frequency?: number;
    periodicWave?: PeriodicWave;
    type?: OscillatorType;
}
interface PannerOptions extends AudioNodeOptions {
    coneInnerAngle?: number;
    coneOuterAngle?: number;
    coneOuterGain?: number;
    distanceModel?: DistanceModelType;
    maxDistance?: number;
    orientationX?: number;
    orientationY?: number;
    orientationZ?: number;
    panningModel?: PanningModelType;
    positionX?: number;
    positionY?: number;
    positionZ?: number;
    refDistance?: number;
    rolloffFactor?: number;
}
interface PeriodicWaveOptions extends PeriodicWaveConstraints {
    imag?: number[] | Float32Array;
    real?: number[] | Float32Array;
}
interface StereoPannerOptions extends AudioNodeOptions {
    pan?: number;
}
interface WaveShaperOptions extends AudioNodeOptions {
    curve?: number[] | Float32Array;
    oversample?: OverSampleType;
}
interface AnalyserOptions extends AudioNodeOptions {
    fftSize?: number;
    maxDecibels?: number;
    minDecibels?: number;
    smoothingTimeConstant?: number;
}
/*声明以及构造函数*/
declare var OfflineAudioContext: {
    prototype: OfflineAudioContext;
    new(contextOptions: OfflineAudioContextOptions): OfflineAudioContext;
    new(numberOfChannels: number, length: number, sampleRate: number): OfflineAudioContext;
};
declare var OfflineAudioCompletionEvent: {
    prototype: OfflineAudioCompletionEvent;
    new(type: string, eventInitDict: OfflineAudioCompletionEventInit): OfflineAudioCompletionEvent;
};
declare var Worklet: {
    prototype: Worklet;
    new(): Worklet;
};
declare var AudioWorklet: {
    prototype: AudioWorklet;
    new(): AudioWorklet;
};
declare var AudioNode: {
    prototype: AudioNode;
    new(): AudioNode;
};
declare var AudioDestinationNode: {
    prototype: AudioDestinationNode;
    new(): AudioDestinationNode;
};
declare var AudioScheduledSourceNode: {
    prototype: AudioScheduledSourceNode;
    new(): AudioScheduledSourceNode;
};
declare var AudioParam: {
    prototype: AudioParam;
    new(): AudioParam;
};
declare var AudioListener: {
    prototype: AudioListener;
    new(): AudioListener;
};
declare var AudioBuffer: {
    prototype: AudioBuffer;
    new(options: AudioBufferOptions): AudioBuffer;
};
declare var AnalyserNode: {
    prototype: AnalyserNode;
    new(context: BaseAudioContext, options?: AnalyserOptions): AnalyserNode;
}
declare var BiquadFilterNode: {
    prototype: BiquadFilterNode;
    new(context: BaseAudioContext, options?: BiquadFilterOptions): BiquadFilterNode;
};
declare var ChannelMergerNode: {
    prototype: ChannelMergerNode;
    new(context: BaseAudioContext, options?: ChannelMergerOptions): ChannelMergerNode;
};
declare var AudioBufferSourceNode: {
    prototype: AudioBufferSourceNode;
    new(context: BaseAudioContext, options?: AudioBufferSourceOptions): AudioBufferSourceNode;
}
declare var ChannelSplitterNode: {
    prototype: ChannelSplitterNode;
    new(context: BaseAudioContext, options?: ChannelSplitterOptions): ChannelSplitterNode;
};
declare var ConstantSourceNode: {
    prototype: ConstantSourceNode;
    new(context: BaseAudioContext, options?: ConstantSourceOptions): ConstantSourceNode;
};
declare var ConvolverNode: {
    prototype: ConvolverNode;
    new(context: BaseAudioContext, options?: ConvolverOptions): ConvolverNode;
};
declare var DelayNode: {
    prototype: DelayNode;
    new(context: BaseAudioContext, options?: DelayOptions): DelayNode;
};
declare var DynamicsCompressorNode: {
    prototype: DynamicsCompressorNode;
    new(context: BaseAudioContext, options?: DynamicsCompressorOptions): DynamicsCompressorNode;
};
declare var GainNode: {
    prototype: GainNode;
    new(context: BaseAudioContext, options?: GainOptions): GainNode;
};
declare var IIRFilterNode: {
    prototype: IIRFilterNode;
    new(context: BaseAudioContext, options: IIRFilterOptions): IIRFilterNode;
};
declare var OscillatorNode: {
    prototype: OscillatorNode;
    new(context: BaseAudioContext, options?: OscillatorOptions): OscillatorNode;
};
declare var PeriodicWave: {
    prototype: PeriodicWave;
    new(context: BaseAudioContext, options?: PeriodicWaveOptions): PeriodicWave;
};
declare var PannerNode: {
    prototype: PannerNode;
    new(context: BaseAudioContext, options?: PannerOptions): PannerNode;
};
declare var BaseAudioContext: {
    prototype: BaseAudioContext;
    new(): BaseAudioContext;
};
declare var AudioContext: {
    prototype: AudioContext;
    new(contextOptions?: AudioContextOptions): AudioContext;
};
declare var ScriptProcessorNode: {
    prototype: ScriptProcessorNode;
    new(): ScriptProcessorNode;
};
declare var AudioProcessingEvent: {
    prototype: AudioProcessingEvent;
    new(type: string, eventInitDict: AudioProcessingEventInit): AudioProcessingEvent;
};
declare var StereoPannerNode: {
    prototype: StereoPannerNode;
    new(context: BaseAudioContext, options?: StereoPannerOptions): StereoPannerNode;
};
declare var WaveShaperNode: {
    prototype: WaveShaperNode;
    new(context: BaseAudioContext, options?: WaveShaperOptions): WaveShaperNode;
};
declare var MediaElementAudioSourceNode: {
    prototype: MediaElementAudioSourceNode;
    new(context: AudioContext, options: MediaElementAudioSourceOptions): MediaElementAudioSourceNode;
};
declare var MediaStreamAudioDestinationNode: {
    prototype: MediaStreamAudioDestinationNode;
    new(context: AudioContext, options?: AudioNodeOptions): MediaStreamAudioDestinationNode;
};
declare var MediaStreamAudioSourceNode: {
    prototype: MediaStreamAudioSourceNode;
    new(context: AudioContext, options: MediaStreamAudioSourceOptions): MediaStreamAudioSourceNode;
};
declare var MediaStreamTrackAudioSourceNode: {
    prototype: MediaStreamTrackAudioSourceNode;
    new(context: AudioContext, options: MediaStreamTrackAudioSourceOptions): MediaStreamTrackAudioSourceNode;
};
declare var AudioWorkletNode: {
    prototype: AudioWorkletNode;
    new(context: BaseAudioContext, name: string, options?: AudioWorkletNodeOptions): AudioWorkletNode;
};
declare var AudioParamMap: {
    prototype: AudioParamMap;
    new(): AudioParamMap;
};

