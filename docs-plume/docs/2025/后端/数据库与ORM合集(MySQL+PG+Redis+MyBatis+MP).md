---
title: 数据库与 ORM 合集（MySQL + PostgreSQL + Redis + MyBatis + MP）
createTime: 2025/01/01 00:00:00
tags:
permalink: /article/db-orm/
---

# 数据库与 ORM 合集（MySQL + PostgreSQL + Redis + MyBatis + MyBatis-Plus）

---

## 一、MySQL

### 1. 常用 SQL 函数速查

**时间相关**
```sql
-- 加/减时间
date_add(now(), interval 1 hour);    -- 当前时间+1小时
date_sub(now(), interval 1 hour);    -- 当前时间-1小时
datediff('2018-05-10','2018-05-20'); -- 两个日期天数差（前者-后者，负值）
date_format('2018-05-10', '%Y/%m/%d');  -- 格式化输出
DAYOFWEEK('2020-12-08');            -- 周几：周日=1 ~ 周六=7
-- 表字段自动维护时间
create_time datetime DEFAULT CURRENT_TIMESTAMP,          -- 插入时自动设当前时间
update_time datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP; -- 更新时自动刷新
```

**字符串相关**
```sql
SUBSTR(u.start_time, 1, 10);                       -- 截取前10位
CONCAT('%', #{vname}, '%');                        -- 拼接模糊查询参数
CONCAT_WS('-', SUBSTR(s,12,16), SUBSTR(e,12,16));  -- 用指定分隔符拼接多段
-- JSON数组是否包含子数组
json_contains(jsonArrStr, JSON_ARRAY('["cad"]'), '$');
```

**多字段模糊查询**
```sql
-- 方式一：用逗号拼接所有要搜索字段后统一LIKE
CONCAT_WS(',', a.a_name, a.apply_no, u.use_workNo) LIKE CONCAT('%',#{inputSearch},'%')
-- 方式二：IFNULL兜底避免null使拼接失效
CONCAT(IFNULL(`title`,''), IFNULL(`tag`,''), IFNULL(`description`,'')) LIKE '%关键字%'
```

**字符集冲突修复（Illegal mix of collations报错）**
```sql
-- 统一字符集
a.col = b.col COLLATE utf8_general_ci
```

### 2. MySQL 常用命令行
```bash
# 远程登录
mysql -h 127.0.0.1 -P 3306 -u root -p密码

# 创建用户+授权
-- 任意IP、增删改查所有库
grant select,insert,update,delete on *.* to 'user1'@'%' identified by '123456';
-- 指定IP段，student库所有权限
grant all privileges on student.* to 'user3'@'192.168.2.%' identified by 'pwd';

# 改密码、删用户
update mysql.user set password=password('新密码') where User='user1' and Host='localhost';
delete from mysql.user where user='user2' and host='localhost';

# 所有授权修改后必须刷新！
flush privileges;
```

### 3. 连接状态监控
```sql
show variables like '%max_connections%';    -- 最大连接数
show variables like 'thread_cache_size';     -- 线程缓存池大小
show status like 'thread%';                  -- 查看线程实况
/*
  Threads_cached     缓存中空闲线程数
  Threads_connected  当前已建立连接数
  Threads_created    累计创建的线程数（持续增长可能线程回收有问题）
  Threads_running    当前正在运行（非睡眠）的线程数
*/
```

### 4. MyBatis XML 常用技巧
```xml
<!-- 特殊字符转义 -->
<=   →   &lt;=
>=   →   &gt;=
<    →   &lt;
&    →   &amp;

<!-- 模糊查询 -->
like CONCAT('%', #{vname}, '%')

<!-- if判断注意：单引号里放字符串 -->
<if test='takeWay == "1"'>            <!-- ✅ 推荐：外双内单 -->
</if>
<if test="takeWay == '1'.toString()"> <!-- ✅ 也行 -->
</if>

<!-- 非空判断 -->
<if test="name != null and name != ''">
<if test="list != null and list.size() > 0">
```

---

## 二、PostgreSQL

### 1. Docker 安装
```bash
# 1.拉镜像
docker pull postgres:12
# 2.准备数据目录
mkdir -p /home/pgsql/data
# 3.启动容器
docker run --name pgsql12 \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v /home/pgsql/data:/var/lib/postgresql/data \
  -d postgres:12

# 4.允许外网连接（改配置文件）
docker exec -it pgsql12 /bin/bash
# 在 pg_hba.conf 末尾加一行：允许所有IP用密码登录
echo "host all all 0.0.0.0/0 password" >> /var/lib/postgresql/data/pg_hba.conf
# 5.重启
docker restart pgsql12
```

### 2. psql 命令行操作
```bash
psql -h 127.0.0.1 -p 5432 -U postgres              # 连接实例
psql -h 127.0.0.1 -p 5432 -U postgres dbname       # 连接并直接进某库
```
常用命令（psql内）：
| 命令 | 作用 |
|------|------|
| `\l` | 列出所有数据库 |
| `\c dbname` | 切换数据库 |
| `\d` | 列出所有表 |
| `\d tablename` | 查看表结构 |
| `\q` | 退出 |

SQL操作：
```sql
CREATE DATABASE dbname;
DROP DATABASE IF EXISTS dbname;

-- 模式（SCHEMA，相当于命名空间）
CREATE SCHEMA myschema;
DROP SCHEMA myschema;          -- 删空模式
DROP SCHEMA myschema CASCADE;  -- 删模式+里面所有对象

CREATE TABLE department(
   id   INT  PRIMARY KEY  NOT NULL,
   dept CHAR(50) NOT NULL,
   emp_id INT NOT NULL
);
DROP TABLE table_name;
```

### 3. PostgreSQL 特有字符串函数
```sql
-- 分割成多行（每行一个子串）
regexp_split_to_table('a,b,c', ',');
regexp_split_to_table('a1b22c333', '\d+');   -- 正则分隔
-- 按分隔符取第N项（1开始）
split_part('2025-08-14', '-', 2);   -- 返回 '08'
```

---

## 三、Redis

**Remote Dictionary Server，内存数据库+持久化，做缓存/队列/分布式锁等。**

### 1. Linux 编译安装（5.0.x）
```bash
# 1.装C++编译环境
yum -y install gcc-c++
# 2.下载+编译
cd /usr/local
wget https://download.redis.io/releases/redis-5.0.12.tar.gz
tar -zxvf redis-5.0.12.tar.gz
cd redis-5.0.12
make          # 失败先 make distclean 清一下
make install  # 装到/usr/local/bin

# 3.配置 redis.conf
vi /usr/local/redis-5.0.12/redis.conf
# 改：
daemonize yes               # 后台守护进程启动
bind 0.0.0.0                # 允许所有IP连（生产按需改）
requirepass 123456          # 设置密码

# 4.启动
redis-server /usr/local/redis-5.0.12/redis.conf
# 5.连接客户端（-a直接输密码，或者进去后auth 123456）
redis-cli -h 127.0.0.1 -p 6379 -a 123456
ping   # 回 PONG 正常
```

### 2. 基础命令（Server端）
```bash
select 0                 # 切换数据库，默认0~15共16个库
keys *                   # 列出当前库所有key（生产慎用！）
dbsize                   # 当前库key总数
flushdb                  # 清空当前库
flushall                 # 清空所有16个库
```
**批量删除前缀匹配的key（集群安全写法）**
```bash
redis-cli -c -p 6379 -a 密码 keys "prefix:*" | xargs -r -n1 redis-cli -c -p 6379 -a 密码 del
# -r：key数为0时不报错；-n1：一次删一个，避免集群CROSSSLOT错误
```

### 3. 五大类型常用命令

#### KEY 通用
```bash
exists k1             # 是否存在
ttl k1                # 剩余过期秒数(-1永不过期, -2已过期)
type k1               # 查看key类型
move k1 2             # 把k1移到2号库
expire k1 30          # 30秒后过期
del k1                # 删除
```

#### ① String（最常用：存对象JSON/JWT Token/计数器）
```bash
set k1 v1
set k1 v1 EX 10       # 10秒过期 = setex k1 10 v1
set k1 v1 NX          # 不存在才设成功（分布式锁核心）= setnx
mset k1 v1 k2 v2      # 批量设
mget k1 k2            # 批量取
getset k1 newV        # 设新值返回旧值
incr/decr k2          # 原子±1（计数器）
incrby/decrby k2 5    # 原子±N
strlen k1             # 长度
```

#### ② List（双向链表：可做栈/队列/时间线）
左=顶(头)，右=底(尾)
```bash
lpush mylist 1 2 3 4      # 左入栈 → 存：4 3 2 1
rpush mylist 1 2 3 4      # 右入队 → 存：1 2 3 4
lrange mylist 0 -1        # 查看所有
lpop/rpop mylist          # 左/右弹出一个
lindex mylist 2           # 按下标取
llen mylist               # 长度
lrem mylist 2 3           # 删除2个值为3的元素
ltrim mylist 2 5          # 只保留第2-5位，其余删除
lset mylist 1 xxx         # 下标1设为xxx
rpoplpush list1 list2     # list1底弹出→list2顶推入（消息转移）
```

#### ③ Set（无序、去重：抽奖/标签/好友交集）
```bash
sadd s1 1 1 2 2 3         # 添加（自动去重）
smembers s1               # 查看所有元素
sismember s1 2            # 是否包含2
scard s1                  # 数量
srandmember s1 2          # 随机抽2个（不删除）→ 抽奖
spop s1 2                 # 随机弹出2个（删除）→ 抽不重复奖
srem s1 2                 # 删除2
sdiff  s1 s2              # 差集（s1有-s2有）
sinter s1 s2              # 交集（共同拥有）→ 共同好友
sunion s1 s2              # 并集 → 推荐好友
```

#### ④ Hash（键值对结构：存对象，比JSON更好的修改单独字段）
```bash
hset user id 1 name zs age 20    # 批量设字段
hget user name                   # 取单个字段
hmget user id name age           # 批量取
hgetall user                     # 取所有 key+value
hsetnx user email xx@x.com       # 字段不存在才设
hdel user age                    # 删字段
hexists user name                # 是否存在字段
hkeys user / hvals user          # 所有key / 所有value
hincrby user age 2               # 数值字段+2
```

#### ⑤ ZSet / SortedSet（带score的Set：排行榜/带权队列）
```bash
zadd rank 100 tom 90 jerry 80 mike  # 加：score+成员
zrange rank 0 -1                    # 按score从小到大列所有
zrange rank 0 -1 WITHSCORES         # 连分数一起显示
zrevrank rank mike                  # 倒数第几名（从0开始）
zrangebyscore rank 60 90            # 分数区间 [60,90]
zrangebyscore rank (60 (90          # 分数区间 (60,90) 开区间
zcount rank 60 90                   # 分数区间内数量
zrem rank mike                      # 删除成员
```

### 4. Redis 持久化（2种）

| | RDB（快照） | AOF（追加日志） |
|---|---|---|
| 存储内容 | 某一瞬间的**内存快照二进制** | 所有**写操作命令**文本 |
| 恢复速度 | 快（直接还原） | 慢（逐条重放） |
| 文件大小 | 小（压缩） | 大（重写可缩容） |
| 丢失数据 | 可能丢最后一次快照后的 | 默认每秒fsync，最多丢1秒 |
| 适合场景 | 冷备份、大规模恢复 | 数据一致性要求高 |

**redis.conf 配置要点**
```ini
# ===== RDB =====
save 900 1      # 900秒内≥1次写 → 触发bgsave
save 300 10
save 60 10000
# save ""        # 注释或空→禁RDB
stop-writes-on-bgsave-error yes
rdbcompression yes
dbfilename dump.rdb
dir ./

# ===== AOF =====
appendonly no              # no→yes 开启AOF
appendfilename "appendonly.aof"
appendfsync everysec       # always每次/everysec每秒/no
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb    # 超过64M启动重写压缩

# ===== 其他 =====
daemonize yes
port 6379
bind 0.0.0.0
tcp-keepalive 300
databases 16
maxclients 10000
# 内存淘汰策略（当内存达上限时）：
# volatile-lru（过期key用LRU淘汰）/ allkeys-lru（所有key用LRU，最常用）
maxmemory-policy allkeys-lru
```

### 5. Redis 事务（弱事务）
```
MULTI     → 开启事务（后续命令全部入队列不执行）
...       → 多个set/get命令全部QUEUED
EXEC      → 提交事务：队列中命令依次执行
DISCARD   → 取消：清空队列

WATCH k1  → 事务前开乐观锁监视；若k1被其他客户端改了，EXEC事务全失败（CAS原理）
UNWATCH   → 取消监视
```
注意：不是强原子性——语法错全部回滚，运行时错（incr字符串）只有那条失败其他照常执行。

### 6. 主从复制 & 哨兵模式

**一主二从配置（三台）**
```bash
# server1（主）：啥也不用改，正常启动
# server2/3（从）：
redis-cli slaveof 10.76.16.41 6379    # 命令：临时
# 或 conf中写死：replicaof 10.76.16.41 6379
```
特点：**主写，从只读；主挂了从还是从**，得手动设为新主：`slaveof no one`

**哨兵模式（自动反客为主）**
```bash
# sentinel.conf
sentinel monitor mymaster 10.76.16.41 6379 1
# 1=至少1个哨兵认为主下线才算客观下线，从票选新主
```
启动：`redis-sentinel sentinel.conf`
原主恢复后自动变成新主的从机。

---

## 四、MyBatis 基础

> **半自动ORM持久层框架**：SQL写在XML/注解里，参数+结果集自动映射。全自动ORM（Hibernate/JPA）不用写SQL，纯JDBC又太麻烦，MyBatis折中。

### 1. 核心配置 + 快速 Demo
**pom 依赖**
```xml
<dependencies>
  <dependency><groupId>mysql</groupId><artifactId>mysql-connector-java</artifactId></dependency>
  <dependency><groupId>org.mybatis</groupId><artifactId>mybatis</artifactId></dependency>
  <dependency><groupId>org.projectlombok</groupId><artifactId>lombok</artifactId><optional>true</optional></dependency>
</dependencies>
```

**主配置 mybatis-config.xml**
```xml
<configuration>
  <typeAliases>
    <package name="com.jqh.pojo"/>    <!-- 别名：mapper.xml里写类名简化 -->
  </typeAliases>
  <environments default="development">
    <environment id="development">
      <transactionManager type="JDBC"/>
      <dataSource type="POOLED">
        <property name="driver"   value="com.mysql.cj.jdbc.Driver"/>
        <property name="url"      value="jdbc:mysql://localhost:3306/db1?serverTimezone=GMT%2B8"/>
        <property name="username" value="root"/>
        <property name="password" value="123456"/>
      </dataSource>
    </environment>
  </environments>
  <mappers>
    <package name="com.jqh.mapper"/>  <!-- 包扫描：XML需和Mapper接口同包同名 -->
  </mappers>
</configuration>
```

**Mapper 接口 + XML**
```java
@Repository
public interface UserMapper {
    List<User> getAll();
    User getById(Integer id);
    int addUser(User u);
}
```
```xml
<mapper namespace="com.jqh.mapper.UserMapper">
  <resultMap id="UserMap" type="User">
    <id     column="user_id"   property="userId"/>      <!-- 字段名和属性名不一致时映射 -->
    <result column="user_name" property="userName"/>
  </resultMap>

  <select id="getAll" resultMap="UserMap">
    select user_id, user_name, age from users
  </select>

  <insert id="addUser" parameterType="User" useGeneratedKeys="true" keyProperty="id">
    insert into users(name, age) values(#{name}, #{age})  <!-- 自增主键回填 -->
  </insert>
</mapper>
```
**测试运行**
```java
String resource = "mybatis-config.xml";
InputStream is = Resources.getResourceAsStream(resource);
SqlSessionFactory sf = new SqlSessionFactoryBuilder().build(is);
try (SqlSession sqlSession = sf.openSession(true)) {  // true=自动提交事务
    UserMapper mapper = sqlSession.getMapper(UserMapper.class);
    List<User> list = mapper.getAll();
}
```

### 2. #{} vs ${}
| `#{}` 预编译 | `${}` 字符串拼接 |
|---|---|
| JDBC用 `?` 占位，自动加引号 | 直接替换成值，不加引号 |
| ✅ **防SQL注入**，推荐 | ❌ 注入风险；仅排序字段/表名动态变化才用 |
| `where name = #{n}` → `?` | `order by ${sortField}` |

### 3. 动态 SQL（高频标签）
```xml
<select id="query" parameterType="User" resultType="User">
  select * from users
  <where>                      <!-- 自动去掉首个多余and/or -->
    <if test="name != null and name != ''">and name like concat('%',#{name},'%')</if>
    <if test="age != null">and age = #{age}</if>
  </where>
  <choose>                     <!-- 多择一，相当于 if-else if-else -->
    <when test="id != null">order by id desc</when>
    <otherwise>order by age desc</otherwise>
  </choose>
  <foreach collection="ids" item="id" open="and id in (" close=")" separator=",">
    #{id}
  </foreach>
  <set>                        <!-- update时自动去掉末尾逗号 -->
    <if test="name!=null">name=#{name},</if>
    <if test="age!=null">age=#{age},</if>
  </set>
</select>
```

### 4. 关联查询（一对多 / 多对一）
```xml
<!-- 多对一：多个学生→一个老师 -->
<resultMap id="StudentMap" type="Student">
  <id     column="sid" property="id"/>
  <result column="sname" property="name"/>
  <association property="teacher" javaType="Teacher">
    <id     column="tid" property="id"/>
    <result column="tname" property="name"/>
  </association>
</resultMap>

<!-- 一对多：一个老师→多个学生集合 -->
<resultMap id="TeacherMap" type="Teacher">
  <id     column="tid" property="id"/>
  <result column="tname" property="name"/>
  <collection property="students" ofType="Student">
    <id     column="sid" property="id"/>
    <result column="sname" property="name"/>
  </collection>
</resultMap>
```

---

## 五、MyBatis-Plus 简化 CRUD

> MP = MyBatis + 只做增强不做改变，省去常规CRUD代码。中文站：https://baomidou.com/

### 1. Spring Boot 接入
**pom**
```xml
<dependency>
  <groupId>com.baomidou</groupId>
  <artifactId>mybatis-plus-boot-starter</artifactId>
  <version>3.5.3</version>
</dependency>
```
**启动类加 @MapperScan**
```java
@SpringBootApplication
@MapperScan("com.jqh.mapper")
public class App { public static void main(String[] a){ SpringApplication.run(App.class,a);} }
```
**实体类 + Mapper（继承即获得全部CRUD）**
```java
@Data
@TableName("sys_user")               // 表名，驼峰自动转下划线可省略
public class SysUser {
    @TableId(type = IdType.AUTO)     // AUTO自增 / ASSIGN_ID雪花ID / INPUT自定义
    private Long id;
    @TableField("nick_name")         // 字段名映射
    private String nickName;
    @TableField(exist = false)       // 不是表里的字段，MP忽略
    private List<Role> roles;
    @TableLogic                     // 逻辑删除：0=未删 1=已删
    private Integer deleted;
}

public interface UserMapper extends BaseMapper<SysUser> {}     // ✨ 核心：继承BaseMapper
public interface UserService extends IService<SysUser> {}      // 业务层：继承IService有批量
public class UserServiceImpl extends ServiceImpl<UserMapper, SysUser> implements UserService {}
```

### 2. 基础 CRUD（不用写XML！）
```java
@Autowired UserMapper userMapper;
@Autowired UserService userService;

// 单条
userMapper.insert(user);                            // 新增（自增主键回填）
userMapper.deleteById(1L);
userMapper.updateById(user);                        // 只更新非null字段
SysUser u = userMapper.selectById(1L);

// 批量
userMapper.selectBatchIds(Arrays.asList(1,2,3));    // 按ID批量查
userMapper.selectList(null);                        // 全查（没条件传null）
userService.saveBatch(list);                         // 批量插入
userService.saveOrUpdateBatch(list);                // 有主键就更，没就插

// 分页（需加配置Bean）
@Configuration
public class MybatisPlusConfig {
    @Bean public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor i = new MybatisPlusInterceptor();
        i.addInnerInterceptor(new PaginationInnerInterceptor(DbType.MYSQL));
        return i;
    }
}
Page<SysUser> page = new Page<>(1, 10);                // 第1页，每页10条
userMapper.selectPage(page, new QueryWrapper<SysUser>().like("name","张"));
page.getTotal();   // 总条数
page.getRecords(); // 当前页数据List
```

### 3. 条件构造器 Wrapper
```java
// QueryWrapper（查/删）
QueryWrapper<SysUser> qw = new QueryWrapper<>();
qw.eq("status", 1).ne("deleted", 1)          // 等于/不等于
  .gt("age", 18).lt("age", 60)               // 大于/小于
  .like("name", "张").likeRight("mobile", "138")  // 模糊
  .between("create_time", start, end)         // 区间
  .in("dept_id", Arrays.asList(1,2,3))        // IN
  .orderByDesc("age").last("limit 10");       // 排序+追加

// UpdateWrapper（改字段值）
UpdateWrapper<SysUser> uw = new UpdateWrapper<>();
uw.set("status", 2).setSql("login_count = login_count + 1")  // 自增
  .eq("id", 100);
userMapper.update(null, uw);

// LambdaQueryWrapper（方法引用，编译期检查）⭐推荐
LambdaQueryWrapper<SysUser> lqw = Wrappers.<SysUser>lambdaQuery()
    .eq(SysUser::getStatus, 1)
    .like(SysUser::getName, "张")
    .orderByDesc(SysUser::getCreateTime);
userMapper.selectList(lqw);
```

---

Redis 中文官网：http://www.redis.cn/
Redis 命令查询：http://redisdoc.com/
MyBatis Plus 官方：https://baomidou.com/
