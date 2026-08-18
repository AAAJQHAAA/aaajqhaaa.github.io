---
title: Spring 全家桶合集（Spring + Boot + Cloud + Security 等）
createTime: 2025/01/01 00:00:00
permalink: /article/spring-all/
---

# Spring 全家桶合集

## 一、Spring 注解（组件注册 & IOC & AOP）

### 1. 向 IOC 注册组件的 4 种方式

| 方式 | 适用场景 | 示例 |
|------|----------|------|
| 包扫描+组件注解 | 自己写的类 | `@Controller/@Service/@Repository/@Component` |
| @Bean | 第三方类 | `@Bean public DataSource ds(){...}` |
| @Import | 快速批量导入 | `@Import({A.class, B.class, MyImportSelector.class})` |
| FactoryBean | 框架整合 | 实现FactoryBean接口的getObject() |

### 2. 常用注解速查

**配置类与扫描**
```java
@Configuration                 // 标记配置类（相当于xml）
@ComponentScan("com.xxx")      // 包扫描，替代 <context:component-scan>
  // 排除/包含（Filter）
  // excludeFilters = @Filter(type=ANNOTATION, classes=Controller.class)
  // includeFilters = @Filter(...), 需 useDefaultFilters=false
@ComponentScans({...})         // 多个扫描规则
```

**Bean 作用域 & 生命周期**
```java
@Scope("singleton")  // 单例（默认），IOC启动时创建
@Scope("prototype")  // 多例，getBean时才创建
@Lazy                // 懒加载（单例延迟到第一次getBean时创建）
@Conditional(MyCond.class)  // 满足条件才注册Bean

// Bean生命周期：初始化 销毁
@Bean(initMethod="init", destroyMethod="destroy")
// 或 Bean实现 InitializingBean（afterPropertiesSet初始化）+ DisposableBean（destroy销毁）
// 或 JSR250：@PostConstruct（创建后）@PreDestroy（销毁前）

// Bean前后处理器：所有Bean初始化前后调用
// 实现 BeanPostProcessor:
//   postProcessBeforeInitialization() → init前
//   postProcessAfterInitialization()  → init后
```

**属性注入**
```java
@Value("张三")            // 1. 直接写值
@Value("#{30-16}")        // 2. SpEL表达式
@Value("${db.url}")       // 3. 取配置文件值（需先加载配置文件）
@PropertySource("classpath:db.properties")  // 加载配置文件到环境

@Autowired               // 按类型→多个按属性名
  @Qualifier("beanName") // 指定按名注入
  @Primary               // 优先注入该Bean
  (required=false)       // 容器没有也不报错
@Resource(name="xx")     // JSR250，按属性名注入，不支持@Qualifier/@Primary
@Inject                  // JSR330，同Autowired，无required参数
@Profile("dev")          // 多环境切换（dev/test/prod），配合-Dspring.profiles.active=dev
```

**AOP 切面注解**
```java
@EnableAspectJAutoProxy   // 配置类上，开启AOP

@Aspect                    // 切面类
@Component
public class LogAspect {
    @Before("execution(public int com.xxx.Cal.add(int,int))")
    public void before(JoinPoint jp) { /* 方法参数jp必须在第一位 */ }

    @After("...")                              // 后置（无论异常与否都执行）
    @AfterReturning(value="...", returning="r")// 返回值后
    @AfterThrowing(value="...", throwing="e")  // 抛异常后
    @Around("...")                             // 环绕，手动调用 pjp.proceed()
}
```

**声明式事务**
```java
@EnableTransactionManagement          // 启事务
@Bean public PlatformTransactionManager txManager(DataSource ds) {
    return new DataSourceTransactionManager(ds);
}
@Transactional                        // 方法/类上：开启事务
```

### 3. WebMvc 配置
两种方式（Spring Boot）：
1. **官方推荐** `implements WebMvcConfigurer` → 只补充自定义规则，不影响SpringBoot默认
2. `extends WebMvcConfigurationSupport` → 覆盖SpringBoot默认，所有方法需自己重写

---

## 二、Spring Boot

### 1. 启动注解拆解
```
@SpringBootApplication
├─ @SpringBootConfiguration → @Configuration （配置类）
└─ @EnableAutoConfiguration
   ├─ @AutoConfigurationPackage → 把启动类所在包名注册（组件扫描根路径）
   └─ @Import → 加载 META-INF/spring.factories 中所有自动配置类
```
> 查能配置什么：找到spring.factories中的XXXAutoConfiguration→关联的@EnableConfigurationProperties(XXXProperties.class)里所有属性

### 2. 配置文件相关
**YAML 语法**
```yaml
name: '张三'           # 字符串
dog: {name:旺财,age:2} # 对象行内写法
dog:                   # 对象多行写法
  name: 旺财
  age: 2
list: [a,b,c]         # 数组行内
list:
  - a
  - b
```

**参数注入对比**
| | @ConfigurationProperties(prefix="dog") | @Value |
|---|---|---|
| 注入方式 | 批量绑定前缀 | 单个 |
| 松散语法(如dog-name绑定dogName) | ✅ | ❌ |
| SpEL表达式 #{3*2} | ❌ | ✅ |
| JSR303校验 @Validated+@Email | ✅ | ❌ |
| 复杂对象(Map/对象) | ✅ | ❌ |

**Profile 多环境**
```
application.yml          （主配置，spring.profiles.active=dev）
application-dev.yml      开发
application-prod.yml     生产
```
激活方式：
- IDEA→Program arguments：`--spring.profiles.active=dev`
- IDEA→VM Options：`-Dspring.profiles.active=dev`
- 生产：`java -jar app.jar --spring.profiles.active=prod`

**配置文件加载优先级（高→低，高覆盖低）**
```
1. 命令行参数 --spring.config.location=xxx.properties
2. file:./config/application.properties （jar包外同级config目录）
3. file:./application.properties         （jar包外同级）
4. classpath:/config/application.yml    （resources/config下）
5. classpath:/application.yml           （resources下）
```

### 3. 启动 jar 包
```bash
# 指定后缀环境
java -jar app.jar --spring.profiles.active=dev

# 外部追加配置（目录，注意是目录！）
java -jar app.jar --spring.config.additional-location=D:/conf/

# 完全替换配置文件（会使jar内默认失效）
java -jar app.jar --spring.config.location=D:/conf/application.properties
```

### 4. 定时任务

**方式一：@Scheduled 固定规则**
```java
@EnableScheduling  // 启动类开
@Service
public class Task {
    @Scheduled(fixedRate=5000)               // 每隔5秒
    @Scheduled(cron="0 07 20 ? * *")         // 每天20:07执行
    public void run(){ ... }
}
```
Cron表达式：`秒 分 时 日 月 周`（?用于日/周二选一互斥）

**方式二：动态自定义时间（ThreadPoolTaskScheduler）**
```java
@Configuration
public class ScheduleConfig {
    @Bean
    public ThreadPoolTaskScheduler taskScheduler() {
        ThreadPoolTaskScheduler s = new ThreadPoolTaskScheduler();
        s.setPoolSize(10);
        s.setThreadNamePrefix("task-");
        s.setAwaitTerminationSeconds(60);
        s.setWaitForTasksToCompleteOnShutdown(true);
        return s;
    }
}
// 动态调度
threadPoolTaskScheduler.schedule(task, new CronTrigger(cron));
threadPoolTaskScheduler.schedule(task, startTime);
scheduledFuture.cancel(true);  // 取消任务
```

### 5. 异步线程池 & @Async

```java
@Configuration
@EnableAsync  // 启异步
public class ExecutorConfig {
    @Bean("new_Thread")
    public ThreadPoolTaskExecutor pool() {
        int cpu = Runtime.getRuntime().availableProcessors();
        ThreadPoolTaskExecutor e = new ThreadPoolTaskExecutor();
        e.setCorePoolSize(cpu);
        e.setMaxPoolSize(cpu * 5);
        e.setQueueCapacity(100);
        e.setKeepAliveSeconds(60);
        e.setThreadNamePrefix("new_Thread-");
        e.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());
        e.initialize();
        return e;
    }
}
```

**使用**
```java
@Async("new_Thread")
public Future<String> withReturn() {     // 有返回值
    Thread.sleep(10000);
    return new AsyncResult<>("done");
}
@Async("new_Thread")
public void noReturn() { ... }           // 无返回值
```

> ⚠️ 坑：在本service内部方法调用自己的@Async方法不会生效（绕过了代理），要从外部service调用。

**获取异步结果**
```java
List<Future<String>> list = new ArrayList<>();
list.add(service.withReturn());
for(Future<String> f : list) f.get();  // get()会阻塞等到有结果
```

### 6. RestTemplate 调用第三方接口

```java
@Configuration
public class RestTemplateConfig {
    @Bean @Primary
    public RestTemplate restTemplate() {
        // HttpClient连接池
        PoolingHttpClientConnectionManager mgr = new PoolingHttpClientConnectionManager(){{
            setMaxTotal(100); setDefaultMaxPerRoute(20); }};
        HttpComponentsClientHttpRequestFactory factory =
            new HttpComponentsClientHttpRequestFactory(HttpClientBuilder.create()
                .setConnectionManager(mgr).build()){{
            setConnectTimeout(300000); setReadTimeout(300000); }};
        RestTemplate rt = new RestTemplate(
            new BufferingClientHttpRequestFactory(factory));
        // UTF-8编码+日志拦截器（自定义）
        rt.setMessageConverters(处理UTF乱码);
        rt.setInterceptors(Collections.singletonList(new RestTemplateLoggingInterceptor()));
        return rt;
    }
}
```

**发送请求**
```java
HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_JSON);
headers.set("token", token);
HttpEntity<Map> req = new HttpEntity<>(paramsMap, headers);
ResponseEntity<String> resp = restTemplate.postForEntity(url, req, String.class);
Map data = JSON.parseObject(resp.getBody());
```

### 7. 数据源 & MyBatis

**SpringBoot支持的数据源**
- `com.zaxxer.hikari.HikariDataSource`（默认，最快）
- `org.apache.tomcat.jdbc.pool.DataSource`
- `org.apache.commons.dbcp2.BasicDataSource`
- 自定义：DruidDataSource（需spring.datasource.type指定，或@Bean手动创建）

**Druid监控**
```
访问：http://localhost:8080/druid/
需注册Servlet：StatViewServlet（用户名密码）
需注册Filter：WebStatFilter（拦截路径+排除）
```

**MyBatis 整合**
- 注解版：`@Mapper`接口 + `@Select/@Insert/@Update/@Delete`
  - 返回自增主键：`@Options(useGeneratedKeys=true, keyProperty="id")`
  - 驼峰命名：容器中加 `ConfigurationCustomizer` 调 `setMapUnderscoreToCamelCase(true)`
  - 全局扫描：`@MapperScan("com.xxx.mapper")`
- XML版：
```yaml
mybatis:
  config-location: classpath:mybatis/mybatis-config.xml
  mapper-locations: classpath:mybatis/mapper/*.xml
```

### 8. 缓存

**Spring Cache（内置简单版）**
```xml
<dependency>spring-boot-starter-cache</dependency>
```
```java
@EnableCaching  // 开缓存
// 查询时缓存，空值不缓存
@Cacheable(value="user", key="#id", unless="#result eq null")
public User get(Long id){...}
// 更新缓存
@CachePut(value="user", key="#result.id", unless="#result eq null")
public User update(User u){...}
// 删缓存
@CacheEvict(value="user", key="#id")
public void delete(Long id){...}
```

**Redis 缓存**
```yaml
spring:
  redis:
    host: localhost
    port: 6379
    database: 0
    password:
```
RedisTemplate 常用：`redisTemplate.boundValueOps("k").set("v")` / `.get()` 存字符串
`redisTemplate.boundHashOps("user").put("name","张三")` 存Hash

### 9. Logback 日志

SpringBoot 默认门面 `SLF4J` + 实现 `Logback`。

**快速配置**
```yaml
logging:
  level:
    com.xxx: debug                 # 自定义包级别
  file:
    name: app.log                  # 文件名
    path: ./logs                   # 路径（二选一）
  pattern:
    console: "%d %-5level [%t] %logger{39} : %m%n"
```

**高级自定义 logback-spring.xml（resources下）**
- 3种Appender：控制台Console / DEBUG日志文件 / ERROR日志文件
- 核心：`TimeBasedRollingPolicy` 按时间切割
  - `maxHistory=30` 保存30天
  - `maxFileSize=30MB` 单文件超30M切新文件
  - `totalSizeCap=10GB` 总超10G删老文件
- `<springProfile name="dev">` 按环境不同配置
- 彩色日志：`ColorConverter` + `WhitespaceThrowableProxyConverter`

### 10. 邮件发送

```xml
spring-boot-starter-mail, org.mnode.ical4j:ical4j（日历邮件）
```
```yaml
spring:
  mail:
    host: xmail.xxx.com
    username: a@xxx.com
    password: xxx
```

三种发送：
1. `sendSimpleMailMessage` → SimpleMailMessage 纯文本
2. `sendMimeMessage(html=true)` → MimeMessageHelper，支持HTML+附件
3. `sendMeetingMimeMessage` → ical4j构建VEvent日历，含VAlarm提醒、Attendee参会人（可选OPT/REQ）、支持取消会议（Method.CANCEL）

### 11. 访问本地文件夹 & 获取IP端口

```java
@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    public void addResourceHandlers(ResourceHandlerRegistry reg) {
        // 浏览器访问 /file/xxx.png → 指向磁盘 D:/upload/xxx.png
        reg.addResourceHandler("/file/**")
           .addResourceLocations("file:D:/upload/");
    }
}
```
获取IP端口：`Inet4Address.getLocalHost().getHostAddress()` + `env.getProperty("local.server.port")`

### 12. MinIO 文件服务

```yaml
minio:
  endpoint: http://ip:9000
  username: minio
  password: minio@test
  bucketName: test
```

常用操作（MinioClient）：
- bucketExists / makeBucket / removeBucket
- upload：InputStream / MultipartFile / File / 本地路径 四种入参
- download：写HttpServletResponse流 / 下载到本地路径
- listObjects / removeObject / removeObjects（批量）

---

## 三、Spring Cloud 微服务

### 1. 注册中心

| | Eureka | Zookeeper | Consul |
|---|---|---|---|
| CAP | AP（最终一致） | CP（强一致） | CP |
| 依赖 | 自带Eureka Server | 需装ZK | 需装Consul |
| 启动注解 | `@EnableEurekaServer` | `@EnableDiscoveryClient` | `@EnableDiscoveryClient` |

**Eureka 关键配置**
```yaml
eureka:
  instance:
    prefer-ip-address: true              # 优先IP注册
    lease-renewal-interval-in-seconds: 1 # 心跳间隔(秒)，开发设小
    lease-expiration-duration-in-seconds: 2 # 超时剔除
```

### 2. Ribbon 客户端负载均衡
- 已集成在Eureka中，`@LoadBalanced` 注解 RestTemplate 即可用服务名调用
  - `restTemplate.getForObject("http://CLOUD-PAYMENT-SERVICE/pay/1", ...)`
- 自定义规则（7种：RoundRobin轮询/Random随机/Retry/WeightedResponseTime...）
```java
@Configuration
public class MyRule {
    @Bean public IRule myRule(){ return new RandomRule(); }
}
// 启动类指定：@RibbonClient(name="CLOUD-PAYMENT-SERVICE", configuration=MyRule.class)
```

### 3. OpenFeign 服务调用（面向接口）
```java
@FeignClient(value = "CLOUD-PAYMENT-SERVICE")
public interface PayFeign {
    @GetMapping("/pay/{id}")
    CommonResult<Payment> getById(@PathVariable("id") Long id);
}
```
超时配置：
```yaml
ribbon:
  ReadTimeout: 5000    # 建立连接后读取资源超时
  ConnectTimeout: 5000 # 两端建立连接超时
```

### 4. Hystrix 服务熔断降级
- 服务端：方法上 `@HystrixCommand(fallbackMethod="xxx")` + 启动类 `@EnableCircuitBreaker`
- 调用方（Feign）：
```yaml
feign:
  hystrix:
    enabled: true
```
启动类加 `@EnableHystrix`，方法上同。统一降级：类上 `@DefaultProperties(defaultFallback="")`。

---

## 四、Spring Security

引入依赖：`spring-boot-starter-security`
（依赖一进来，所有请求默认都需登录，生成临时密码在控制台）

> 项目中通常自定义：继承 WebSecurityConfigurerAdapter
> - configure(AuthenticationManagerBuilder)：配置认证（用户密码来源）
> - configure(HttpSecurity)：配置授权（哪些路径放行、登录、csrf等）

---

## 五、Shiro 安全框架（认证+授权）

**三大核心对象**
- `Subject`：当前操作用户（可以是人/第三方服务，所有Subject绑定SecurityManager）
- `SecurityManager`：Shiro心脏，管理所有Subject的安全操作
- `Realm`：Shiro和"安全数据源DAO"的桥梁，负责从DB取账号/权限信息

### 1. Spring Boot 整合
**pom**
```xml
<dependency><groupId>org.apache.shiro</groupId><artifactId>shiro-spring-boot-web-starter</artifactId><version>1.11.0</version></dependency>
```
**自定义 Realm**
```java
public class MyRealm extends AuthorizingRealm {
    @Autowired UserService userService;
    // 2.授权：登录成功后访问有权限要求的接口时被调用
    @Override protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
        SysUser user = (SysUser) principals.getPrimaryPrincipal();
        SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
        info.addRoles(userService.getRoleCodeByUid(user.getId()));
        info.addStringPermissions(userService.getPermByUid(user.getId()));
        return info;
    }
    // 1.认证：执行 login() 时调用
    @Override protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
        UsernamePasswordToken up = (UsernamePasswordToken) token;
        SysUser user = userService.getByUsername(up.getUsername());
        if (user == null) throw new UnknownAccountException();
        return new SimpleAuthenticationInfo(user, user.getPassword(),
                ByteSource.Util.bytes(user.getSalt()), getName());
    }
}
```
**ShiroConfig 配置类**
```java
@Configuration
public class ShiroConfig {
    @Bean public Realm myRealm() {
        MyRealm realm = new MyRealm();
        HashedCredentialsMatcher m = new HashedCredentialsMatcher();
        m.setHashAlgorithmName("md5");
        m.setHashIterations(1024);
        realm.setCredentialsMatcher(m);
        return realm;
    }
    @Bean public DefaultWebSecurityManager securityManager(Realm myRealm) {
        DefaultWebSecurityManager sm = new DefaultWebSecurityManager();
        sm.setRealm(myRealm);
        return sm;
    }
    @Bean public ShiroFilterChainDefinition shiroFilterChainDefinition() {
        DefaultShiroFilterChainDefinition def = new DefaultShiroFilterChainDefinition();
        def.addPathDefinition("/login",     "anon");           // 放行
        def.addPathDefinition("/register",  "anon");
        def.addPathDefinition("/logout",    "logout");         // 登出
        def.addPathDefinition("/admin/**",  "roles[admin]");   // 要admin角色
        def.addPathDefinition("/user/add",  "perms[user:add]"); // 要有user:add权限
        def.addPathDefinition("/**",        "authc");          // 其他都要登录
        return def;
    }
}
```
**注册/登录业务**
```java
// 注册：给密码加盐哈希
String salt = UUID.randomUUID().toString().replace("-","").substring(0,8);
String md5 = new Md5Hash(rawPassword, salt, 1024).toHex();
user.setPassword(md5).setSalt(salt);

// 登录：调用 Subject.login()
Subject subject = SecurityUtils.getSubject();
try {
    subject.login(new UsernamePasswordToken(username, password));
    return R.ok(subject.getSession().getId());
} catch (UnknownAccountException | IncorrectCredentialsException e) {
    return R.fail("账号或密码错误");
}

// 接口里取当前登录用户
SysUser me = (SysUser) SecurityUtils.getSubject().getPrincipal();
```

---

## 六、Spring Session 集群 Session 共享

> 集群多节点时，用户A登录落到 Node1（Session存在Node1内存），下一次请求Nginx负载到Node2 → **无Session直接未登录**！解决：把Session存Redis，所有节点共用。

### 使用方法（3步搞定）
① pom 加依赖
```xml
<dependency><groupId>org.springframework.session</groupId><artifactId>spring-session-data-redis</artifactId></dependency>
<dependency><groupId>org.springframework.boot</groupId><artifactId>spring-boot-starter-data-redis</artifactId></dependency>
```
② application.yml 配置 Redis
```yaml
spring:
  redis:
    host: 127.0.0.1
    port: 6379
    password: 123456
  session:
    store-type: redis   # 告诉Spring Session存Redis
    timeout: 1800       # 30分钟失效
```
③ 启动类加 `@EnableRedisHttpSession`

**就这么多！** 代码完全不用改，还是 `request.getSession()` 那套，底层自动写入Redis。

---

## 七、Swagger / Knife4j 接口文档

> Swagger3.0（OpenAPI3）= 注解在代码里 → 自动生成在线API文档页面
> Knife4j = Swagger增强版UI，更好看更好用。官方 https://doc.xiaominfo.com/

### Spring Boot 接入 Knife4j
**pom**
```xml
<dependency>
  <groupId>com.github.xiaoymin</groupId>
  <artifactId>knife4j-openapi3-jakarta-spring-boot-starter</artifactId>
  <version>4.4.0</version>
</dependency>
```
**配置类**
```java
@Configuration
public class SwaggerConfig {
    @Bean public OpenAPI customOpenAPI() {
        return new OpenAPI()
           .info(new Info()
               .title("博客系统接口文档")
               .version("1.0")
               .description("Knife4j+OpenAPI3演示")
               .contact(new Contact().name("jqh").email("jqh@qq.com")))
           .externalDocs(new ExternalDocumentation().description("项目地址").url("https://gitee.com/xxx"));
    }
}
```
**Controller 层注解**
```java
@RestController
@RequestMapping("/user")
@Tag(name = "用户管理", description = "用户的增删改查API")
public class UserController {
    @Operation(summary = "根据ID查用户", description = "入参用户ID，返回用户详情")
    @GetMapping("/{id}")
    public R<UserVO> getById(
        @Parameter(name = "id", description = "用户主键ID", required = true, example = "1001")
        @PathVariable Long id) { ... }

    @Operation(summary = "新增用户")
    @PostMapping
    public R<Void> add(@RequestBody @Valid UserAddDTO dto) { ... }
}
```
**DTO 类注解**
```java
@Data
@Schema(description = "新增用户请求体")
public class UserAddDTO {
    @Schema(description = "用户名", example = "zhangsan", requiredMode = Schema.RequiredMode.REQUIRED)
    @NotBlank(message = "用户名必填")
    private String username;
    @Schema(description = "年龄", example = "20")
    @Min(0) private Integer age;
}
```
**访问**：
- Swagger UI：`http://ip:port/swagger-ui/index.html`
- Knife4j UI：`http://ip:port/doc.html` ⭐（强烈推荐）

---

## 八、Flowable 工作流引擎（审批流）

> 工作流：把「请假审批」「报销审批」这种流程化业务抽象出来，**画流程图（BPMN2.0标准XML）+ Java代码**实现。Flowable 是 Activiti 原团队fork的后续升级版。

### 1. Spring Boot 整合
**pom**
```xml
<dependency><groupId>org.flowable</groupId><artifactId>flowable-spring-boot-starter</artifactId><version>7.0.0</version></dependency>
```
**yml**
```yaml
flowable:
  database-schema-update: true      # 启动自动建表（ACT_开头几十张）
  history-level: full               # 历史级别full=最完整
  async-executor-activate: false    # 关异步
```
**画 BPMN 图工具**：推荐 IDEA 装插件「Flowable BPMN visualizer」或在线「bpmn.io」，导出 `leave.bpmn20.xml` 放 `resources/processes/` 下。

### 2. 7 个 Service
```java
@Autowired RuntimeService    runtimeService;      // 运行时：启动、查询、推进流程实例
@Autowired TaskService       taskService;         // 任务：查询待办、签收、完成/拒绝
@Autowired RepositoryService repositoryService;   // 部署/挂起/激活流程定义
@Autowired HistoryService    historyService;      // 查已结束/已流转的历史记录
@Autowired IdentityService   identityService;     // 用户/组（不常用，一般自己维护用户表）
@Autowired FormService       formService;         // 表单
@Autowired ManagementService managementService;   // 定时/作业管理
```

### 3. 最简请假流程代码（发起→部门经理审批→销假）
```java
// 1.部署一次
repositoryService.createDeployment()
    .addClasspathResource("processes/leave.bpmn20.xml")
    .name("请假流程").deploy();

// 2.发起人提交请假单=启动流程实例
Map<String, Object> vars = new HashMap<>();
vars.put("applicant",     "zhangsan");
vars.put("deptManager",   "lisi");
vars.put("leaveDays",     3);
ProcessInstance pi = runtimeService.startProcessInstanceByKey("leave", vars);

// 3.李四登录→查我待办
List<Task> todoList = taskService.createTaskQuery()
    .taskAssignee("lisi").list();

// 4.经理审批通过/驳回
String taskId = todoList.get(0).getId();
taskService.addComment(taskId, pi.getId(), "同意请假，注意手机畅通");
taskService.complete(taskId, Collections.singletonMap("pass", true));

// 5.查历史审批轨迹（进度条）
List<HistoricTaskInstance> hti = historyService.createHistoricTaskInstanceQuery()
    .processInstanceId(pi.getId())
    .orderByHistoricTaskInstanceEndTime().asc()
    .list();
// 6.查流程是否结束
runtimeService.createProcessInstanceQuery().processInstanceId(pid).singleResult() == null
```

### 4. 流程图常用元素
| 元素 | BPMN含义 | 变量写法（UEL表达式） |
|------|----------|----------------------|
| 开始事件 | 圆圈 | |
| 用户任务 | 矩形 | 负责人 Assignee：`${deptManager}` |
| 排他网关X（只走一条） | 菱形 | 出线条件（>3天）：`${pass && leaveDays > 3}` |
| 并行网关+ | 分叉后所有线都走，汇聚全完成才往下 | |
| 结束事件 | 粗圆圈 | |

---

