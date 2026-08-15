/*WebRTC API*/
interface RTCPeerConnection extends EventTarget {
    /*
    * "stable"：没有正在进行的Offer和Answer交换，可能是新建或者协商完成并建立了连接
    * "have-local-offer"：设置了本地offer（RTCPeerConnection.setLocalDescription()）
    * "have-remote-offer"：设置了远程（RTCPeerConnection.setRemoteDescription()）
    * "have-local-pranswer"：设置了本地answer（RTCPeerConnection.setLocalDescription()）
    * "have-remote-pranswer"：设置了远程（RTCPeerConnection.setRemoteDescription()）
    * "closed"：RTCPeerConnection已关闭
    * */
    readonly signalingState: RTCSignalingState;//连接本地端的信令进程状态（type RTCSignalingState = "stable" | "have-local-offer" | "have-remote-offer" | "have-local-pranswer" | "have-remote-pranswer" | "closed";）
    /*
    * "new"：至少有一个连接的ICE传输处于new状态
    * "connecting"：一个或多个ICE传输当前正在建立连接
    * "connected"：连接使用的每个ICE传输正在使用
    * "disconnected"：至少有一个用于连接的ICE传输处于disconnected状态
    * "failed" ：连接上的一个或多个ICE传输处于该failed状态
    * "closed"：RTCPeerConnection已关闭
    * */
    readonly connectionState: RTCPeerConnectionState;//连接的当前状态（type RTCPeerConnectionState = "new" | "connecting" | "connected" | "disconnected" | "failed" | "closed";）
    readonly localDescription: RTCSessionDescription | null;//本地端的会话描述
    readonly currentLocalDescription: RTCSessionDescription | null;//本地端的描述
    readonly pendingLocalDescription: RTCSessionDescription | null;//描述连接本地端的挂起配置更改
    readonly remoteDescription: RTCSessionDescription | null;//远程端的会话描述
    readonly currentRemoteDescription: RTCSessionDescription | null;//远程端的描述
    readonly pendingRemoteDescription: RTCSessionDescription | null;//描述连接远程端的挂起配置更改
    /*
    * "new"：对等连接刚刚创建，尚未完成任何联网
    * "gathering"：ICE 代理正在为连接收集候选人
    * "complete"：已经完成了候选人的收集
    * */
    readonly iceGatheringState: RTCIceGatheringState;//ICE收集状态（type RTCIceGatheringState = "new" | "gathering" | "complete";）
    /*
    * "new"：ICE代理正在收集地址或等待通过调用RTCPeerConnection.addIceCandidate()获得远程候选人（或两者）
    * "checking"：ICE 代理已获得一个或多个远程候选者，并且正在检查一对本地和远程候选者，以尝试找到兼容的匹配项，但尚未找到允许建立对等连接的对
    * "connected"：已为连接的所有组件找到可用的本地和远程候选配对，并且已建立连接
    * "completed"：ICE 代理已经完成了候选人的收集，已经检查了所有对，并找到了所有组件的连接
    * "disconnected"：检查以确保组件仍然连接失败的RTCPeerConnection. 这是一个较不严格的测试
    * "failed"：ICE 候选者已将所有候选者对相互检查，但未能为连接的所有组件找到兼容的匹配项
    * "closed"：ICE代理RTCPeerConnection已关闭
    * */
    readonly iceConnectionState: RTCIceConnectionState;//ICE代理状态（type RTCIceConnectionState = "new" | "checking" | "connected" | "completed" | "disconnected" | "failed" | "closed";）
    readonly canTrickleIceCandidates: boolean | null;//远程对等方是否接受ICE候选
    readonly sctp: RTCSctpTransport | null;//SCTP传输通道
    readonly peerIdentity: Promise<RTCIdentityAssertion>;//远程对等点标识
    readonly idpErrorInfo: string | null;
    readonly idpLoginUrl: string | null;
    close(): void;//关闭当前对等连接
    createOffer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;//创建SDP Offer
    createAnswer(options?: RTCOfferOptions): Promise<RTCSessionDescriptionInit>;//针对offer创建answer
    createDataChannel(label: string, dataChannelDict?: RTCDataChannelInit): RTCDataChannel;//创建可以传输任何类型的数据的通道
    addIceCandidate(candidate: RTCIceCandidateInit | RTCIceCandidate): Promise<void>;//添加远程端的ICE candidate
    addTrack(track: MediaStreamTrack, ...streams: MediaStream[]): RTCRtpSender;//媒体轨道添加到轨道集合中（该轨道将被传输到另一个对等点）
    removeTrack(sender: RTCRtpSender): void;//连接的本地端停止从指定的轨道发送媒体
    addTransceiver(trackOrKind: MediaStreamTrack | string, init?: RTCRtpTransceiverInit): RTCRtpTransceiver;//将收发器添加到收发器集合中
    setConfiguration(configuration: RTCConfiguration): void;//设置连接的当前配置
    setIdentityProvider(provider: string, options?: RTCIdentityProviderOptions): void;//身份提供者(IdP):名称、用于与其通信的协议和用户名
    setLocalDescription(description: RTCSessionDescriptionInit): Promise<void>;//设置连接本地端的属性
    setRemoteDescription(description: RTCSessionDescriptionInit): Promise<void>;//设置连接的远程端的属性
    getConfiguration(): RTCConfiguration;//连接的当前配置
    getIdentityAssertion(): Promise<string>;//身份断言的收集
    getReceivers(): RTCRtpReceiver[];//RTP接收器数组
    getSenders(): RTCRtpSender[];//RTP发送器数组
    getStats(selector?: MediaStreamTrack | null): Promise<RTCStatsReport>;//统计信息的数据
    getTransceivers(): RTCRtpTransceiver[];//在连接上发送和接收数据的所有对象的列表
    onconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;//连接的状态发生变化时触发
    ondatachannel: ((this: RTCPeerConnection, ev: RTCDataChannelEvent) => any) | null;//当远程对等方调用RTCDataChannel.createDataChannel()时触发
    onicecandidate: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceEvent) => any) | null;//当本地ICE candidate获取成功时触发（一般会将它发送给远程对等方进行ice协商）
    onicecandidateerror: ((this: RTCPeerConnection, ev: RTCPeerConnectionIceErrorEvent) => any) | null;//当ICE candidate获取发生错误时触发
    oniceconnectionstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;//当连接的ICE代理状态发生变化时触发
    onicegatheringstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;//当连接的ICE收集状态发生变化时触发
    onnegotiationneeded: ((this: RTCPeerConnection, ev: Event) => any) | null;//当会话协商需要更改时触发
    onsignalingstatechange: ((this: RTCPeerConnection, ev: Event) => any) | null;//当连接本地端的信令进程状态变化时触发（是由于调用setLocalDescription()或setRemoteDescription()）
    onstatsended: ((this: RTCPeerConnection, ev: RTCStatsEvent) => any) | null;
    ontrack: ((this: RTCPeerConnection, ev: RTCTrackEvent) => any) | null;//已将轨道添加到RTCPeerConnection时触发
    addEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: RTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
/*字典接口*/
interface RTCSessionDescription {
    readonly sdp: string;//描述会话的SDP
    readonly type: RTCSdpType;//会话描述类型（type RTCSdpType = "offer" | "pranswer" | "answer" | "rollback";）
    toJSON(): any;//对象的JSON描述
}
interface RTCSctpTransport {
    readonly maxChannels: number | null;//可以同时打开的最大RTCDataChannel数
    readonly maxMessageSize: number;//可以使用RTCDataChannel.send()方法发送的消息的最大大小（以字节为单位）
    /*
    * "connecting"：建立连接时的初始状态
    * "connected"：连接已打开以进行数据传输
    * "closed"：连接已关闭，无法再使用
    * */
    readonly state: RTCSctpTransportState;//SCTP传输的状态（type RTCSctpTransportState = "connecting" | "connected" | "closed";）
    readonly transport: RTCDtlsTransport;//用于传输和接收数据包的DTLS传输的RTCDtlsTransport对象
    onstatechange: ((this: RTCSctpTransport, ev: Event) => any) | null;//state更改时触发
    addEventListener<K extends keyof RTCSctpTransportEventMap>(type: K, listener: (this: RTCSctpTransport, ev: RTCSctpTransportEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCSctpTransportEventMap>(type: K, listener: (this: RTCSctpTransport, ev: RTCSctpTransportEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface RTCDtlsTransport extends EventTarget {
    /*
    * "new"：DTLS尚未开始协商时的初始状态
    * "connecting"：DTLS正在协商安全连接并验证远程指纹
    * "connected" ：DTLS已完成安全连接的协商并验证了远程指纹
    * "closed"：运输已被故意关闭
    * "failed"：由于错误（例如收到错误警报或无法验证远程指纹）而导致传输失败
    * */
    readonly state: RTCDtlsTransportState;//底层数据报传输层安全(DTLS)传输状态（type RTCDtlsTransportState = "new" | "connecting" | "connected" | "closed" | "failed";）
    readonly transport: RTCIceTransport;//对基础RTCIceTransport对象的引用
    getRemoteCertificates(): ArrayBuffer[];//获取包含连接的远程对等方证书的数组
    onerror: ((this: RTCDtlsTransport, ev: RTCErrorEvent) => any) | null;//发生传输级错误时
    onstatechange: ((this: RTCDtlsTransport, ev: Event) => any) | null;//当DTLS传输state更改时
    addEventListener<K extends keyof RTCDtlsTransportEventMap>(type: K, listener: (this: RTCDtlsTransport, ev: RTCDtlsTransportEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCDtlsTransportEventMap>(type: K, listener: (this: RTCDtlsTransport, ev: RTCDtlsTransportEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface RTCSctpTransportEventMap {
    "statechange": Event;
}
interface RTCIceTransport extends EventTarget {
    readonly component: RTCIceComponent;//传输使用的ICE组件（type RTCIceComponent = "rtp" | "rtcp";）
    /*
    * "new"：对等连接刚刚创建，尚未完成任何联网
    * "gathering"：ICE代理正在为连接收集候选人
    * "complete"：已经完成了候选人的收集
    * */
    readonly gatheringState: RTCIceGathererState;//ICE代理的当前收集状态（type RTCIceGathererState = "new" | "gathering" | "complete";）
    readonly role: RTCIceRole;//控制代理还是受控代理（type RTCIceRole = "controlling" | "controlled";）
    /*
    * "new"：ICE代理正在收集地址或等待通过调用RTCPeerConnection.addIceCandidate()获得远程候选人（或两者）
    * "checking"：ICE 代理已获得一个或多个远程候选者，并且正在检查一对本地和远程候选者，以尝试找到兼容的匹配项，但尚未找到允许建立对等连接的对
    * "connected"：已为连接的所有组件找到可用的本地和远程候选配对，并且已建立连接
    * "completed"：ICE 代理已经完成了候选人的收集，已经检查了所有对，并找到了所有组件的连接
    * "disconnected"：检查以确保组件仍然连接失败的RTCPeerConnection. 这是一个较不严格的测试
    * "failed"：ICE 候选者已将所有候选者对相互检查，但未能为连接的所有组件找到兼容的匹配项
    * "closed"：ICE代理RTCPeerConnection已关闭
    * */
    readonly state: RTCIceTransportState;//ICE代理的当前状态（type RTCIceTransportState = "new" | "checking" | "connected" | "completed" | "disconnected" | "failed" | "closed";）
    getLocalCandidates(): RTCIceCandidate[];//本地设备在当前ICE代理会话期间收集的候选对象数组
    getRemoteCandidates(): RTCIceCandidate[];//远程设备的ICE候选对象数组
    getLocalParameters(): RTCIceParameters | null;//获取本地设备的ICE参数
    getRemoteParameters(): RTCIceParameters | null;//获取远程设备的ICE参数
    getSelectedCandidatePair(): RTCIceCandidatePair | null;//到目前为止已选择的候选对象（本地+远程）
    ongatheringstatechange: ((this: RTCIceTransport, ev: Event) => any) | null;//在这个传输的ICE候选协商过程中发生了变化
    onselectedcandidatepairchange: ((this: RTCIceTransport, ev: Event) => any) | null;//更好的候选人变化时
    onstatechange: ((this: RTCIceTransport, ev: Event) => any) | null;//state发生变化时
    addEventListener<K extends keyof RTCIceTransportEventMap>(type: K, listener: (this: RTCIceTransport, ev: RTCIceTransportEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCIceTransportEventMap>(type: K, listener: (this: RTCIceTransport, ev: RTCIceTransportEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface RTCIceCandidate {
    readonly candidate: string;//可用于连接检查的候选者的传输地址
    readonly component: RTCIceComponent | null;//类型（type RTCIceComponent = "rtp" | "rtcp";）
    readonly foundation: string | null;//唯一标识符
    readonly ip: string | null;//候选人的IP地址
    readonly port: number | null;//候选者的端口号
    readonly priority: number | null;//候选人的优先级
    readonly protocol: RTCIceProtocol | null;//候选人的协议（type RTCIceProtocol = "udp" | "tcp";）
    readonly relatedAddress: string | null;//该主机候选项的IP地址
    readonly relatedPort: number | null;//派生的候选者的端口号
    readonly sdpMLineIndex: number | null;//媒体描述的索引号
    readonly sdpMid: string | null;//候选者的媒体流标识标签
    /*
    * "active"：传输将尝试打开出站连接，但不会接收传入的连接请求
    * "passive"：传输将接收传入的连接请求，但不会尝试打开出站连接
    * "so"：传输将尝试与其对等方同时打开连接
    * */
    readonly tcpType: RTCIceTcpCandidateType | null;//TCP候选的类型（type RTCIceTcpCandidateType = "active" | "passive" | "so";）
    /*
    * "host"：候选者是主机候选者
    * "srflx"：候选人是服务器自反候选人
    * "prflx"：候选人是同伴反身候选人
    * "relay"：候选人是从TURN服务器获得的中继候选人
    * */
    readonly type: RTCIceCandidateType | null;//候选的类型（type RTCIceCandidateType = "host" | "srflx" | "prflx" | "relay";）
    readonly usernameFragment: string | null;//随机生成的用户名片段
    toJSON(): RTCIceCandidateInit;//返回的当前配置的JSON表示
}
interface RTCIceParameters {
    usernameFragment?: string;//ICE会话的用户名
    password?: string;//会话的密码字符串
}
interface RTCIceCandidatePair {
    local?: RTCIceCandidate;//连接的本地端的配置
    remote?: RTCIceCandidate;//连接的远程端的配置
}
interface RTCIceCandidateInit {
    candidate?: string;//候选人的网络连接信息
    sdpMLineIndex?: number | null;//与候选人相关联的索引
    sdpMid?: string | null;//与候选相关联的媒体流的标识标签
    usernameFragment?: string;//用户名片段
}
interface RTCIdentityAssertion {
    idp: string;//身份断言的提供者
    name: string;//身份断言提供者的名称
}
interface RTCOfferOptions extends RTCOfferAnswerOptions {
    iceRestart?: boolean;//在活动连接上重新启动ICE
    offerToReceiveAudio?: boolean;//提供对音频方向性的额外控制。例如，它可用于确保无论是否发送音频，都可以接收音频
    offerToReceiveVideo?: boolean;//提供对视频方向性的额外控制。例如，它可用于确保无论是否发送视频，都可以接收视频
}
interface RTCSessionDescriptionInit {
    sdp?: string;//会话的SDP消息的字符串
    type: RTCSdpType;//当前状态的字符串（type RTCSdpType = "offer" | "pranswer" | "answer" | "rollback";）
}
interface RTCDataChannelInit {
    id?: number;//通道的16位数字ID
    maxPacketLifeTime?: number;//在不可靠模式下尝试传输消息的最大毫秒数
    maxRetransmits?: number;//用户代理应该尝试重新传输消息的最大次数（在不可靠模式下第一次失败的消息）
    negotiated?: boolean;//数据通道是带内协商or带外协商
    ordered?: boolean;//发送的消息是否需要按顺序到达目的地
    priority?: RTCPriorityType;//优先级（type RTCPriorityType = "very-low" | "low" | "medium" | "high";）
    protocol?: string;//子协议的名称
}
interface RTCDataChannel extends EventTarget {
    binaryType: string;//接收的二进制数据的类型("blob"、"arraybuffer")
    readonly bufferedAmount: number;//当前排队通过数据通道发送的数据字节数
    bufferedAmountLowThreshold: number;//被视为“低”的缓冲传出数据的字节数
    readonly id: number | null;//唯一标识
    readonly label: string;//数据通道的名称
    readonly maxPacketLifeTime: number | null;//允许浏览器尝试传输消息的时间量（以毫秒为单位）
    readonly maxRetransmits: number | null;//浏览器在放弃前应尝试重新传输消息的最大次数
    readonly negotiated: boolean;//连接是由Web应用程序(true)还是由WebRTC层(false)协商的
    readonly ordered: boolean;//数据通道是否保证消息的有序传递
    readonly priority: RTCPriorityType;//优先级（type RTCPriorityType = "very-low" | "low" | "medium" | "high";）
    readonly protocol: string;//子协议的名称
    /*
    * "connecting"：用户代理（浏览器）正在创建底层数据传输
    * "open"：底层数据传输已经建立，数据可以双向传输
    * "closing"：关闭底层数据传输的过程已经开始
    * "closed"：基础数据传输已关闭，或尝试建立连接失败
    * */
    readonly readyState: RTCDataChannelState;//数据通道的基础数据连接的状态（type RTCDataChannelState = "connecting" | "open" | "closing" | "closed";）
    close(): void;//任一对等方都可以调用此方法来启动通道的关闭
    send(data: string): void;//通过数据通道将数据发送到远程对等点
    send(data: Blob): void;
    send(data: ArrayBuffer): void;
    send(data: ArrayBufferView): void;
    onbufferedamountlow: ((this: RTCDataChannel, ev: Event) => any) | null;//当传出数据缓冲区中的数据字节数低于指定的值时
    onclose: ((this: RTCDataChannel, ev: Event) => any) | null;//当底层数据传输关闭时
    onerror: ((this: RTCDataChannel, ev: RTCErrorEvent) => any) | null;//当数据通道发生错误时
    onmessage: ((this: RTCDataChannel, ev: MessageEvent) => any) | null;//当从远程对等方收到消息时发送
    onopen: ((this: RTCDataChannel, ev: Event) => any) | null;//在数据通道首次打开或现有数据通道的底层连接重新打开时
    addEventListener<K extends keyof RTCDataChannelEventMap>(type: K, listener: (this: RTCDataChannel, ev: RTCDataChannelEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCDataChannelEventMap>(type: K, listener: (this: RTCDataChannel, ev: RTCDataChannelEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface RTCError extends Error {
    errorDetail: string;
    httpRequestStatusCode: number;
    message: string;
    name: string;
    receivedAlert: number | null;
    sctpCauseCode: number;
    sdpLineNumber: number;
    sentAlert: number | null;
}
interface RTCErrorEvent extends Event {
    readonly error: RTCError | null;
}
interface RTCDataChannelEventMap {
    "bufferedamountlow": Event;
    "close": Event;
    "error": RTCErrorEvent;
    "message": MessageEvent;
    "open": Event;
}
interface RTCRtpSender {
    readonly dtmf: RTCDTMFSender | null;//用于在对象表示的RTP会话上使用有效负载发送DTMF音调
    readonly rtcpTransport: RTCDtlsTransport | null;//RTCP
    readonly track: MediaStreamTrack | null;//传输的轨道
    readonly transport: RTCDtlsTransport | null;//交换用于管理媒体传输和控制数据的RTP和RTCP数据包
    getParameters(): RTCRtpSendParameters;//媒体的编码和传输的当前配置
    getStats(): Promise<RTCStatsReport>;//发送的所有出站流提供统计数据
    replaceTrack(withTrack: MediaStreamTrack | null): Promise<void>;//用另一个轨道替换当前正在发送的轨道（可用于在设备上的前置摄像头和后置摄像头之间切换）
    setParameters(parameters: RTCRtpSendParameters): Promise<void>;//更改应用于配置
    setStreams(...streams: MediaStream[]): void;//将发送的track与指定MediaStream的对象或对象数组相关联
}
interface RTCDTMFSender extends EventTarget {
    readonly canInsertDTMF: boolean;
    readonly toneBuffer: string;//当前在队列中要传输的DTMF音的列表
    insertDTMF(tones: string, duration?: number, interToneGap?: number): void;//发送指定的音调
    ontonechange: ((this: RTCDTMFSender, ev: RTCDTMFToneChangeEvent) => any) | null;//音调已经开始或停止播放
    addEventListener<K extends keyof RTCDTMFSenderEventMap>(type: K, listener: (this: RTCDTMFSender, ev: RTCDTMFSenderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCDTMFSenderEventMap>(type: K, listener: (this: RTCDTMFSender, ev: RTCDTMFSenderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface RTCDTMFToneChangeEvent extends Event {
    readonly tone: string;
}
interface RTCRtpParameters {
    codecs: RTCRtpCodecParameters[];//发送者或接收者将从中选择的编解码器集
    headerExtensions: RTCRtpHeaderExtensionParameters[];//零个或多个 RTP 标头扩展的数组
    rtcp: RTCRtcpParameters;//用于发送方或接收方上RTCP的配置参数
}
interface RTCRtpCodecParameters {
    channels?: number;//编解码器应支持的通道数
    clockRate: number;//以赫兹 (Hz) 为单位指定编解码器的时钟速率
    mimeType: string;//编解码器的MIME媒体类型和子类型
    payloadType: number;//RTP有效载荷类型
    sdpFmtpLine?: string;//特定参数字段
}
interface RTCRtpHeaderExtensionParameters {
    encrypted?: boolean;
    id: number;
    uri: string;
}
interface RTCRtcpParameters {
    cname?: string;//RTCP 使用的规范名称(CNAME)
    reducedSize?: boolean;//是否配置了缩减大小的RTCP
}
interface RTCRtpSendParameters extends RTCRtpParameters {
    degradationPreference?: RTCDegradationPreference;//WebRTC层在受限带宽情况下应根据质量优化带宽的首选方式（type RTCDegradationPreference = "maintain-framerate" | "maintain-resolution" | "balanced";）
    encodings: RTCRtpEncodingParameters[];//编解码器
    transactionId: string;//最后一组应用参数的唯一ID
}
interface RTCRtpCodingParameters {
    rid?: string;
}
interface RTCRtpEncodingParameters extends RTCRtpCodingParameters {
    active?: boolean;//编码当前正在被积极使用
    codecPayloadType?: number;//发送流的编解码器
    dtx?: RTCDtxStatus;//是否使用不连续传输（type RTCDtxStatus = "disabled" | "enabled";）
    maxBitrate?: number;//每秒允许此编码的最大位数
    maxFramerate?: number;//每秒允许此编码的最大帧数
    priority?: RTCPriorityType;//优先级（type RTCPriorityType = "very-low" | "low" | "medium" | "high";）
    ptime?: number;//媒体数据包的首选持续时间（以毫秒为单位）
    scaleResolutionDownBy?: number;//在编码期间缩小视频的因子
}
interface RTCStatsReport {
    forEach(callbackfn: (value: any, key: string, parent: RTCStatsReport) => void, thisArg?: any): void;
}
interface RTCRtpTransceiverInit {
    direction?: RTCRtpTransceiverDirection;//新收发器的首选方向性
    sendEncodings?: RTCRtpEncodingParameters[];//编码
    streams?: MediaStream[];//该事件将指定的流
}
interface RTCRtpTransceiver {
    /*
    * "sendrecv"：
    * "sendonly"：
    * "recvonly"：
    * "inactive"：
    * */
    readonly currentDirection: RTCRtpTransceiverDirection | null;//收发器的当前方向（type RTCRtpTransceiverDirection = "sendrecv" | "sendonly" | "recvonly" | "inactive";）
    direction: RTCRtpTransceiverDirection;//设置收发器所需方向（type RTCRtpTransceiverDirection = "sendrecv" | "sendonly" | "recvonly" | "inactive";）
    readonly mid: string | null;//与此收发器关联的 m 线的媒体 ID
    readonly receiver: RTCRtpReceiver;//处理接收和解码
    readonly sender: RTCRtpSender;//处理编码和发送
    readonly stopped: boolean;//是否停止
    setCodecPreferences(codecs: RTCRtpCodecCapability[]): void;//收发器编解码器
    stop(): void;//永久停止
}
interface RTCConfiguration {
    bundlePolicy?: RTCBundlePolicy;//当远程对等体不兼容时如何处理候选者的协商
    certificates?: RTCCertificate[];//用于身份验证类型的Array对象
    iceCandidatePoolSize?: number;//一个无符号的16位整数值，它指定预取的ICE候选池的大小。默认值为0
    iceServers?: RTCIceServer[];//可由ICE代理使用的服务器
    iceTransportPolicy?: RTCIceTransportPolicy;//ICE传输策略
    peerIdentity?: string;//连接到远程对等方身份验证
    rtcpMuxPolicy?: RTCRtcpMuxPolicy;//收集ICE候选时使用的RTCP多路复用策略，以支持非多路复用RTCP
}
interface RTCPeerConnectionEventMap {
    "connectionstatechange": Event;
    "datachannel": RTCDataChannelEvent;
    "icecandidate": RTCPeerConnectionIceEvent;
    "icecandidateerror": RTCPeerConnectionIceErrorEvent;
    "iceconnectionstatechange": Event;
    "icegatheringstatechange": Event;
    "negotiationneeded": Event;
    "signalingstatechange": Event;
    "statsended": RTCStatsEvent;
    "track": RTCTrackEvent;
}
interface RTCDataChannelEvent extends Event {
    readonly channel: RTCDataChannel;
}
interface RTCPeerConnectionIceEvent extends Event {
    readonly candidate: RTCIceCandidate | null;
    readonly url: string | null;
}
interface RTCPeerConnectionIceErrorEvent extends Event {
    readonly errorCode: number;
    readonly errorText: string;
    readonly hostCandidate: string;
    readonly url: string;
}
interface RTCStatsEvent extends Event {
    readonly report: RTCStatsReport;
}
interface RTCTrackEvent extends Event {
    readonly receiver: RTCRtpReceiver;
    readonly streams: ReadonlyArray<MediaStream>;
    readonly track: MediaStreamTrack;
    readonly transceiver: RTCRtpTransceiver;
}
interface RTCRtpReceiver {
    readonly track: MediaStreamTrack;//返回MediaStreamTrack与当前RTCRtpReceiver实例关联的
    readonly rtcpTransport: RTCDtlsTransport | null;//返回RTCDtlsTransport接收接收者轨道的媒体的实例
    readonly transport: RTCDtlsTransport | null;//此属性已被删除；RTP 和 RTCP 传输已合并为一个传输。改为使用该transport属性
    getContributingSources(): RTCRtpContributingSource[];//返回当前RTCRtpReceiver在过去十秒内RTCRtpContributingSource收到的每个唯一 CSRC（贡献源）标识符的实例数组
    getParameters(): RTCRtpReceiveParameters;//返回一个RTCRtpParameters对象，其中包含有关如何解码 RTC 数据的信息
    getStats(): Promise<RTCStatsReport>;//返回一个Promise其实现处理程序接收一个RTCStatsReport包含有关传入流及其依赖项的统计信息
    getSynchronizationSources(): RTCRtpSynchronizationSource[];//返回一个数组，其中包含当前RTCRtpReceiver在过去十秒内RTCRtpSynchronizationSource接收到的每个唯一 SSRC（同步源）标识符的一个实例
}
interface RTCCertificate {
    readonly expires: number;
    getFingerprints(): RTCDtlsFingerprint[];
}
interface RTCDTMFSenderEventMap {
    "tonechange": RTCDTMFToneChangeEvent;
}
interface RTCDtlsTransportEventMap {
    "error": RTCErrorEvent;
    "statechange": Event;
}
interface RTCDtlsTransportStateChangedEvent extends Event {
    readonly state: RTCDtlsTransportState;
}
interface RTCDtmfSenderEventMap {
    "tonechange": RTCDTMFToneChangeEvent;
}
interface RTCDtmfSender extends EventTarget {
    readonly canInsertDTMF: boolean;
    readonly duration: number;
    readonly interToneGap: number;
    ontonechange: ((this: RTCDtmfSender, ev: RTCDTMFToneChangeEvent) => any) | null;
    readonly sender: RTCRtpSender;
    readonly toneBuffer: string;
    insertDTMF(tones: string, duration?: number, interToneGap?: number): void;
    addEventListener<K extends keyof RTCDtmfSenderEventMap>(type: K, listener: (this: RTCDtmfSender, ev: RTCDtmfSenderEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCDtmfSenderEventMap>(type: K, listener: (this: RTCDtmfSender, ev: RTCDtmfSenderEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface RTCIceCandidatePairChangedEvent extends Event {
    readonly pair: RTCIceCandidatePair;
}
interface RTCIceGathererEventMap {
    "error": Event;
    "localcandidate": RTCIceGathererEvent;
}
interface RTCIceGatherer extends RTCStatsProvider {
    readonly component: RTCIceComponent;
    onerror: ((this: RTCIceGatherer, ev: Event) => any) | null;
    onlocalcandidate: ((this: RTCIceGatherer, ev: RTCIceGathererEvent) => any) | null;
    createAssociatedGatherer(): RTCIceGatherer;
    getLocalCandidates(): RTCIceCandidateDictionary[];
    getLocalParameters(): RTCIceParameters;
    addEventListener<K extends keyof RTCIceGathererEventMap>(type: K, listener: (this: RTCIceGatherer, ev: RTCIceGathererEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCIceGathererEventMap>(type: K, listener: (this: RTCIceGatherer, ev: RTCIceGathererEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface RTCIceGathererEvent extends Event {
    readonly candidate: RTCIceCandidateDictionary | RTCIceCandidateComplete;
}
interface RTCIceTransportEventMap {
    "gatheringstatechange": Event;
    "selectedcandidatepairchange": Event;
    "statechange": Event;
}
interface RTCIceTransportStateChangedEvent extends Event {
    readonly state: RTCIceTransportState;
}
interface RTCSrtpSdesTransportEventMap {
    "error": Event;
}
interface RTCSrtpSdesTransport extends EventTarget {
    onerror: ((this: RTCSrtpSdesTransport, ev: Event) => any) | null;
    readonly transport: RTCIceTransport;
    addEventListener<K extends keyof RTCSrtpSdesTransportEventMap>(type: K, listener: (this: RTCSrtpSdesTransport, ev: RTCSrtpSdesTransportEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCSrtpSdesTransportEventMap>(type: K, listener: (this: RTCSrtpSdesTransport, ev: RTCSrtpSdesTransportEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}
interface RTCSsrcConflictEvent extends Event {
    readonly ssrc: number;
}
interface RTCStatsProvider extends EventTarget {
    getStats(): Promise<RTCStatsReport>;
    msGetStats(): Promise<RTCStatsReport>;
}
interface RTCPeerConnectionErrorCallback {
    (error: DOMException): void;
}
interface RTCSessionDescriptionCallback {
    (description: RTCSessionDescriptionInit): void;
}
interface RTCStatsCallback {
    (report: RTCStatsReport): void;
}
interface RTCAnswerOptions extends RTCOfferAnswerOptions {
}
interface RTCCertificateExpiration {
    expires?: number;
}

interface RTCDTMFToneChangeEventInit extends EventInit {
    tone: string;
}
interface RTCDataChannelEventInit extends EventInit {
    channel: RTCDataChannel;
}
interface RTCDtlsFingerprint {
    algorithm?: string;
    value?: string;
}
interface RTCDtlsParameters {
    fingerprints?: RTCDtlsFingerprint[];
    role?: RTCDtlsRole;
}
interface RTCErrorEventInit extends EventInit {
    error?: RTCError | null;
}
interface RTCIceCandidateAttributes extends RTCStats {
    addressSourceUrl?: string;
    candidateType?: RTCStatsIceCandidateType;
    ipAddress?: string;
    portNumber?: number;
    priority?: number;
    transport?: string;
}
interface RTCIceCandidateComplete {
}
interface RTCIceCandidateDictionary {
    foundation?: string;
    ip?: string;
    msMTurnSessionId?: string;
    port?: number;
    priority?: number;
    protocol?: RTCIceProtocol;
    relatedAddress?: string;
    relatedPort?: number;
    tcpType?: RTCIceTcpCandidateType;
    type?: RTCIceCandidateType;
}
interface RTCIceCandidatePairStats extends RTCStats {
    availableIncomingBitrate?: number;
    availableOutgoingBitrate?: number;
    bytesReceived?: number;
    bytesSent?: number;
    localCandidateId?: string;
    nominated?: boolean;
    priority?: number;
    readable?: boolean;
    remoteCandidateId?: string;
    roundTripTime?: number;
    state?: RTCStatsIceCandidatePairState;
    transportId?: string;
    writable?: boolean;
}
interface RTCIceGatherOptions {
    gatherPolicy?: RTCIceGatherPolicy;
    iceservers?: RTCIceServer[];
}
interface RTCIceServer {
    credential?: string | RTCOAuthCredential;
    credentialType?: RTCIceCredentialType;
    urls: string | string[];
    username?: string;
}
interface RTCIdentityProviderOptions {
    peerIdentity?: string;
    protocol?: string;
    usernameHint?: string;
}
interface RTCInboundRTPStreamStats extends RTCRTPStreamStats {
    bytesReceived?: number;
    fractionLost?: number;
    jitter?: number;
    packetsLost?: number;
    packetsReceived?: number;
}
interface RTCMediaStreamTrackStats extends RTCStats {
    audioLevel?: number;
    echoReturnLoss?: number;
    echoReturnLossEnhancement?: number;
    frameHeight?: number;
    frameWidth?: number;
    framesCorrupted?: number;
    framesDecoded?: number;
    framesDropped?: number;
    framesPerSecond?: number;
    framesReceived?: number;
    framesSent?: number;
    remoteSource?: boolean;
    ssrcIds?: string[];
    trackIdentifier?: string;
}
interface RTCOAuthCredential {
    accessToken: string;
    macKey: string;
}
interface RTCOfferAnswerOptions {
    voiceActivityDetection?: boolean;
}
interface RTCOutboundRTPStreamStats extends RTCRTPStreamStats {
    bytesSent?: number;
    packetsSent?: number;
    roundTripTime?: number;
    targetBitrate?: number;
}
interface RTCPeerConnectionIceErrorEventInit extends EventInit {
    errorCode: number;
    hostCandidate?: string;
    statusText?: string;
    url?: string;
}
interface RTCPeerConnectionIceEventInit extends EventInit {
    candidate?: RTCIceCandidate | null;
    url?: string | null;
}
interface RTCRTPStreamStats extends RTCStats {
    associateStatsId?: string;
    codecId?: string;
    firCount?: number;
    isRemote?: boolean;
    mediaTrackId?: string;
    mediaType?: string;
    nackCount?: number;
    pliCount?: number;
    sliCount?: number;
    ssrc?: string;
    transportId?: string;
}
interface RTCRtcpFeedback {
    parameter?: string;
    type?: string;
}

interface RTCRtpCapabilities {
    codecs: RTCRtpCodecCapability[];
    headerExtensions: RTCRtpHeaderExtensionCapability[];
}
interface RTCRtpCodecCapability {
    channels?: number;
    clockRate: number;
    mimeType: string;
    sdpFmtpLine?: string;
}


interface RTCRtpContributingSource {
    audioLevel?: number;
    source: number;
    timestamp: number;
}
interface RTCRtpDecodingParameters extends RTCRtpCodingParameters {
}

interface RTCRtpFecParameters {
    mechanism?: string;
    ssrc?: number;
}
interface RTCRtpHeaderExtension {
    kind?: string;
    preferredEncrypt?: boolean;
    preferredId?: number;
    uri?: string;
}
interface RTCRtpHeaderExtensionCapability {
    uri?: string;
}


interface RTCRtpReceiveParameters extends RTCRtpParameters {
    encodings: RTCRtpDecodingParameters[];
}
interface RTCRtpRtxParameters {
    ssrc?: number;
}
interface RTCRtpSynchronizationSource extends RTCRtpContributingSource {
    voiceActivityFlag?: boolean;
}

interface RTCRtpUnhandled {
    muxId?: string;
    payloadType?: number;
    ssrc?: number;
}
interface RTCSrtpKeyParam {
    keyMethod?: string;
    keySalt?: string;
    lifetime?: string;
    mkiLength?: number;
    mkiValue?: number;
}
interface RTCSrtpSdesParameters {
    cryptoSuite?: string;
    keyParams?: RTCSrtpKeyParam[];
    sessionParams?: string[];
    tag?: number;
}
interface RTCSsrcRange {
    max?: number;
    min?: number;
}
interface RTCStats {
    id: string;
    timestamp: number;
    type: RTCStatsType;
}
interface RTCStatsEventInit extends EventInit {
    report: RTCStatsReport;
}
interface RTCTrackEventInit extends EventInit {
    receiver: RTCRtpReceiver;
    streams?: MediaStream[];
    track: MediaStreamTrack;
    transceiver: RTCRtpTransceiver;
}
interface RTCTransportStats extends RTCStats {
    activeConnection?: boolean;
    bytesReceived?: number;
    bytesSent?: number;
    localCertificateId?: string;
    remoteCertificateId?: string;
    rtcpTransportStatsId?: string;
    selectedCandidatePairId?: string;
}
interface webkitRTCPeerConnection extends RTCPeerConnection {
    addEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: webkitRTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void;
    addEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;
    removeEventListener<K extends keyof RTCPeerConnectionEventMap>(type: K, listener: (this: webkitRTCPeerConnection, ev: RTCPeerConnectionEventMap[K]) => any, options?: boolean | EventListenerOptions): void;
    removeEventListener(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;
}

declare var webkitRTCPeerConnection: {
    prototype: webkitRTCPeerConnection;
    new(configuration: RTCConfiguration): webkitRTCPeerConnection;
};
declare var RTCStatsProvider: {
    prototype: RTCStatsProvider;
    new(): RTCStatsProvider;
};
declare var RTCStatsEvent: {
    prototype: RTCStatsEvent;
    new(type: string, eventInitDict: RTCStatsEventInit): RTCStatsEvent;
};
declare var RTCSsrcConflictEvent: {
    prototype: RTCSsrcConflictEvent;
    new(): RTCSsrcConflictEvent;
};
declare var RTCSrtpSdesTransport: {
    prototype: RTCSrtpSdesTransport;
    new(transport: RTCIceTransport, encryptParameters: RTCSrtpSdesParameters, decryptParameters: RTCSrtpSdesParameters): RTCSrtpSdesTransport;
    getLocalParameters(): RTCSrtpSdesParameters[];
};
declare var RTCIdentityAssertion: {
    prototype: RTCIdentityAssertion;
    new(idp: string, name: string): RTCIdentityAssertion;
};
declare var RTCIceTransportStateChangedEvent: {
    prototype: RTCIceTransportStateChangedEvent;
    new(): RTCIceTransportStateChangedEvent;
};
declare var RTCIceGathererEvent: {
    prototype: RTCIceGathererEvent;
    new(): RTCIceGathererEvent;
};
declare var RTCIceGatherer: {
    prototype: RTCIceGatherer;
    new(options: RTCIceGatherOptions): RTCIceGatherer;
};
declare var RTCIceCandidatePairChangedEvent: {
    prototype: RTCIceCandidatePairChangedEvent;
    new(): RTCIceCandidatePairChangedEvent;
};
declare var RTCError: {
    prototype: RTCError;
    new(errorDetail?: string, message?: string): RTCError;
};
declare var RTCDtmfSender: {
    prototype: RTCDtmfSender;
    new(sender: RTCRtpSender): RTCDtmfSender;
};
declare var RTCDtlsTransportStateChangedEvent: {
    prototype: RTCDtlsTransportStateChangedEvent;
    new(): RTCDtlsTransportStateChangedEvent;
};
declare var RTCErrorEvent: {
    prototype: RTCErrorEvent;
    new(type: string, eventInitDict: RTCErrorEventInit): RTCErrorEvent;
};
declare var RTCStatsReport: {
    prototype: RTCStatsReport;
    new(): RTCStatsReport;
};
declare var RTCDTMFToneChangeEvent: {
    prototype: RTCDTMFToneChangeEvent;
    new(type: string, eventInitDict: RTCDTMFToneChangeEventInit): RTCDTMFToneChangeEvent;
};
declare var RTCDTMFSender: {
    prototype: RTCDTMFSender;
    new(): RTCDTMFSender;
};
declare var RTCDataChannelEvent: {
    prototype: RTCDataChannelEvent;
    new(type: string, eventInitDict: RTCDataChannelEventInit): RTCDataChannelEvent;
};
declare var RTCDataChannel: {
    prototype: RTCDataChannel;
    new(): RTCDataChannel;
};
declare var RTCSctpTransport: {
    prototype: RTCSctpTransport;
    new(): RTCSctpTransport;
};
declare var RTCTrackEvent: {
    prototype: RTCTrackEvent;
    new(type: string, eventInitDict: RTCTrackEventInit): RTCTrackEvent;
};
declare var RTCIceTransport: {
    prototype: RTCIceTransport;
    new(): RTCIceTransport;
};
declare var RTCDtlsTransport: {
    prototype: RTCDtlsTransport;
    new(): RTCDtlsTransport;
};
declare var RTCRtpTransceiver: {
    prototype: RTCRtpTransceiver;
    new(): RTCRtpTransceiver;
};
declare var RTCRtpReceiver: {
    prototype: RTCRtpReceiver;
    new(): RTCRtpReceiver;
    getCapabilities(kind: string): RTCRtpCapabilities | null;
};
declare var RTCRtpSender: {
    prototype: RTCRtpSender;
    new(): RTCRtpSender;
    getCapabilities(kind: string): RTCRtpCapabilities | null;
};
declare var RTCCertificate: {
    prototype: RTCCertificate;
    new(): RTCCertificate;
    getSupportedAlgorithms(): AlgorithmIdentifier[];
};
declare var RTCPeerConnectionIceErrorEvent: {
    prototype: RTCPeerConnectionIceErrorEvent;
    new(type: string, eventInitDict: RTCPeerConnectionIceErrorEventInit): RTCPeerConnectionIceErrorEvent;
};
declare var RTCPeerConnectionIceEvent: {
    prototype: RTCPeerConnectionIceEvent;
    new(type: string, eventInitDict?: RTCPeerConnectionIceEventInit): RTCPeerConnectionIceEvent;
};
declare var RTCIceCandidate: {
    prototype: RTCIceCandidate;
    new(candidateInitDict?: RTCIceCandidateInit): RTCIceCandidate;
};
declare var RTCSessionDescription: {
    prototype: RTCSessionDescription;
    new(descriptionInitDict: RTCSessionDescriptionInit): RTCSessionDescription;
};
declare var RTCPeerConnection: {
    prototype: RTCPeerConnection;
    /*构造函数：根据配置创建对象*/
    new(configuration?: RTCConfiguration): RTCPeerConnection;
    /*静态函数：根据指定的算法创建证书证书密钥*/
    generateCertificate(keygenAlgorithm: AlgorithmIdentifier): Promise<RTCCertificate>;
    getDefaultIceServers(): RTCIceServer[];
};
