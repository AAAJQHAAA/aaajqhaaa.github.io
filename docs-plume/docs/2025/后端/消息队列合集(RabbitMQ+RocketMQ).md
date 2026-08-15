---
title: 消息队列合集（RabbitMQ + RocketMQ）
createTime: 2025/01/01 00:00:00
permalink: /article/mq/
---

# 消息队列 MQ 合集

## 一、MQ 概述

**作用（优点）**
- **应用解耦**：生产者消费者异步解耦，方便增删节点
- **削峰填谷**：海量请求在MQ排队，后端慢慢处理（如秒杀下单）
- **异步提速**：非核心逻辑异步化，接口响应更快

**缺点**
- 系统复杂度、可用性降低
- 面临问题：消息丢失、重复消费、顺序性、一致性

---

## 二、RabbitMQ

基于 Erlang 语言开发，实现 AMQP 协议。

### 1. CentOS 安装
```bash
# 需先装Erlang（版本对应 https://www.rabbitmq.com/which-erlang.html）
# 再装 socat 依赖
rpm -ivh erlang-22.3.4.16-1.el7.x86_64.rpm
rpm -ivh socat-1.7.3.2-5.el7.lux.x86_64.rpm
rpm -ivh rabbitmq-server-3.8.17-1.el7.noarch.rpm

# 启动
systemctl start rabbitmq-server
# 创建管理员用户
rabbitmqctl add_user admin admin
rabbitmqctl set_user_tags admin administrator
rabbitmqctl set_permissions -p / admin ".*" ".*" ".*"
# 开启Web管理插件（端口15672）
rabbitmq-plugins enable rabbitmq_management
```
访问：`http://ip:15672` 账号 admin/admin

### 2. 核心概念

```
生产者 Producer → Exchange 交换机 → Queue 消息队列 → Consumer 消费者
```

| 角色 | 说明 |
|------|------|
| Exchange | 只负责按路由规则转发消息，**不存储**，无匹配队列则消息丢失 |
| Queue | 存消息、持久化、按顺序消费 |
| Binding | Queue绑定Exchange时指定RoutingKey |

### 3. 六种消息模型

#### ① Simple 简单模型
- 1生产者→1队列→1消费者
- ACK机制：消费者收到消息后回执ACK，RabbitMQ收到ACK才删消息
  - 自动ACK：接收即发（可能丢消息）
  - 手动ACK：处理完手动调用（推荐）

#### ② Work 工作队列（竞争消费者）
- 1队列→多消费者，**同一条消息只会被一个消费者消费**
- 默认消息平均分配给消费者（轮询）
- **能者多劳**：`basicQos(1)` + 手动ACK，处理完一条才拿一条

#### 订阅模型（多消费者，需Exchange）
一个生产者发消息到Exchange → Exchange转发给所有绑定它的Queue → 每个Queue一个消费者

Exchange 4种类型：

| 类型 | 路由逻辑 | 图示文件 |
|------|----------|----------|
| **Fanout** 广播 | 发给所有绑定的Queue，忽略RoutingKey | rabbitmq-fanout.png |
| **Direct** 定向 | Queue绑定指定routing key，生产者发指定key，完全匹配才路由 | rabbitmq-direct.png |
| **Topic** 通配符 | routing key支持通配：`#`匹配≥1个词，`*`匹配恰好1个词 | rabbitmq-topic.png |
| Header | 取消routing key，用消息Header的KV匹配队列 | （少用） |

#### ③ Publish/Subscribe（Fanout广播）
- 群发场景：邮件列表、广播通知

#### ④ Routing（Direct路由）
- 不同级别日志发到不同处理队列

#### ⑤ Topics（Topic通配符）
- `item.#` 匹配 `item.insert`、`item.update.status`
- `item.*` 只匹配 `item.insert`（一个词）

#### ⑥ RPC（远程调用）
- 发请求时附两个属性：
  - `reply_to`：回调队列地址（服务端处理完把结果写回这个队列）
  - `correlation_id`：唯一关联ID，客户端收到响应判断对应哪个请求

---

## 三、RocketMQ（Apache）

阿里开源，纯Java，高吞吐低延迟，支持事务消息、顺序消息。

### 1. Docker 安装部署

三组件：**NameServer（命名服务）+ Broker（消息经纪人）+ Console（图形控制台）**

#### ① NameServer
```bash
mkdir -p /docker/rocketmq/data/namesrv/logs /docker/rocketmq/data/namesrv/store
docker run -d --restart=always --name rmqnamesrv \
  -p 9876:9876 \
  -v /docker/rocketmq/data/namesrv/logs:/root/logs \
  -v /docker/rocketmq/data/namesrv/store:/root/store \
  -e "MAX_POSSIBLE_HEAP=100000000" \
  rocketmqinc/rocketmq sh mqnamesrv
```

#### ② Broker
先写配置 `/docker/rocketmq/conf/broker.conf`：
```ini
brokerClusterName = DefaultCluster
brokerName = broker-a
brokerId = 0                           # 0=Master，>0=Slave
deleteWhen = 04                        # 凌晨4点删旧消息
fileReservedTime = 48                  # 磁盘保留48小时
brokerRole = ASYNC_MASTER              # SYNC_MASTER/ASYNC_MASTER/SLAVE
flushDiskType = ASYNC_FLUSH            # SYNC_FLUSH刷盘策略
brokerIP1 = 192.168.52.136            # 【重要】Broker服务器IP
diskMaxUsedSpaceRatio = 95             # 磁盘达95%禁止写入
```
启动：
```bash
docker run -d --restart=always --name rmqbroker \
  --link rmqnamesrv:namesrv \
  -p 10911:10911 -p 10909:10909 \
  -v /docker/rocketmq/data/broker/logs:/root/logs \
  -v /docker/rocketmq/data/broker/store:/root/store \
  -v /docker/rocketmq/conf/broker.conf:/opt/rocketmq-4.4.0/conf/broker.conf \
  -e "NAMESRV_ADDR=namesrv:9876" \
  -e "MAX_POSSIBLE_HEAP=200000000" \
  rocketmqinc/rocketmq sh mqbroker -c /opt/rocketmq-4.4.0/conf/broker.conf
```

#### ③ RocketMQ Console（管理端）
```bash
docker pull pangliang/rocketmq-console-ng
docker run -d --restart=always --name rmqadmin \
  -e "JAVA_OPTS=-Drocketmq.namesrv.addr=192.168.52.136:9876 -Dcom.rocketmq.sendMessageWithVIPChannel=false" \
  -p 9999:8080 \
  pangliang/rocketmq-console-ng
```
访问：`http://ip:9999`

### 2. 核心概念

| 角色 | 说明 |
|------|------|
| NameServer | 无状态集群，管理Broker注册/上下线心跳（30s一次），Producer/Consumer通过它找Broker |
| Broker | 存消息、持久化、过滤消息，可集群（主从） |
| Producer | 生产消息，与NameServer保持长连接心跳 |
| Consumer | 消费消息，与NameServer保持长连接心跳，从Broker拉消息 |
| Topic | 消息主题，一个Broker内可有多个Topic |
| Tag | 子主题（二级分类），过滤用 |
| Queue | 每个Topic内默认4个队列（提高并行度） |
| Offset | 消费偏移量，记录消费进度（消费完不删消息，只打消费标记） |

消息体 = `Topic（主题）+ Tag（标签）+ Body（消息内容）`
