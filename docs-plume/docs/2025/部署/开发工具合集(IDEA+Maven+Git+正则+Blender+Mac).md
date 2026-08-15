---
title: 开发工具合集（IDEA + Maven + Git + 正则 + 算法 + Blender + Mac）
createTime: 2025/01/01 00:00:00
permalink: /article/tools/
---

# 开发工具速查合集

## 一、IntelliJ IDEA 常用快捷键

### 编辑 & 代码
| 快捷键 | 作用 |
|--------|------|
| `Alt + Enter` | 万能：快速导包、生成变量、修复警告 |
| `Alt + 7` | 左侧打开 Structure 面板，查看类所有方法+属性 |
| `Ctrl + Enter` | 弹窗选择：生成 Getter/Setter/Constructor/Override |
| `Ctrl + O` | 选择父类/接口方法进行重写实现 |
| `Ctrl + Alt + T` | 选中代码 → 套 try-catch / if / for / synchronized |
| `Ctrl + Alt + O` | Optimize Imports：删除无用 import |
| `Ctrl + Alt + L` | 格式化代码（一键排版） |
| `psvm + Tab` | 生成 `public static void main(String[] args){}` |
| `sout + Tab` | 生成 `System.out.println()` |
| `100.for + Tab` | 生成 `for(int i=0; i<100; i++)` 循环 |

### 查找 & 跳转
| 快捷键 | 作用 |
|--------|------|
| `按两下 Shift` | Search Everywhere：全局搜类/文件/操作 |
| `Ctrl + F` | 当前文件内查找字符串 |
| `Ctrl + R` | 当前文件内替换字符串 |
| `Ctrl + Shift + F/R` | 全局查找/替换（整个项目） |
| `Ctrl + H` | 打开类继承层次结构图（Type Hierarchy） |
| `Ctrl + 鼠标左键/B` | 跳转到类/方法/变量定义处 |
| `Ctrl + Alt + ←/→` | 回到上一次/下一次光标位置（跳转历史） |

### Maven 配置
- **test目录未自动生成/不生效**
  - src下新建 `test/java` 目录
  - File → Project Structure → Modules → 选test/java → 点上方 `Tests`（变绿）→ Apply

- **文件编码**：File → Settings → Editor → File Encodings（全部设UTF-8）

---

## 二、Maven 构建工具

### 1. settings.xml 全局配置（核心简化版）

```xml
<settings>
  <!-- 1.本地仓库路径【建议必改】 -->
  <localRepository>D:/apache-maven/repository</localRepository>

  <!-- 2.私服用户名密码（发布jar到私服用） -->
  <servers>
    <server>
      <id>dcloud-public</id>
      <username>xxx</username>
      <password>xxx</password>
    </server>
  </servers>

  <!-- 3.镜像【建议必改，加速下载】 -->
  <mirrors>
    <mirror>
      <id>alimaven</id>
      <mirrorOf>central</mirrorOf>       <!-- 替换中央仓库 -->
      <name>aliyun maven</name>
      <url>https://maven.aliyun.com/nexus/content/repositories/central/</url>
    </mirror>
  </mirrors>

  <!-- 4.全局JDK版本编译 -->
  <profiles>
    <profile>
      <id>JDK-1.8</id>
      <activation>
        <activeByDefault>true</activeByDefault>
        <jdk>1.8</jdk>
      </activation>
      <properties>
        <maven.compiler.source>1.8</maven.compiler.source>
        <maven.compiler.target>1.8</maven.compiler.target>
        <maven.compiler.compilerVersion>1.8</maven.compiler.compilerVersion>
      </properties>
    </profile>
  </profiles>
</settings>
```

### 2. pom.xml 项目配置要点

**依赖坐标 GAV**
```xml
<groupId>asia.banseon</groupId>      <!-- 公司/组织域名反写 -->
<artifactId>banseon-maven2</artifactId> <!-- 项目名 -->
<version>1.0-SNAPSHOT</version>    <!-- SNAPSHOT快照 / RELEASE正式 -->
<packaging>jar</packaging>         <!-- jar/war/pom(父工程) -->
```

**依赖范围 scope**
| scope | 编译 | 测试 | 运行/打包 | 说明 |
|-------|------|------|-----------|------|
| compile（默认）| ✅ | ✅ | ✅ | 全程有效 |
| provided | ✅ | ✅ | ❌ | 运行时由容器提供（如servlet-api） |
| runtime | ❌ | ✅ | ✅ | 编译不需要，运行时才用（如JDBC驱动） |
| test | ❌ | ✅ | ❌ | 只测试用（如junit） |
| system | ✅ | ✅ | ❌ | 需配合systemPath指定本地jar（不推荐） |

**解决版本冲突**
```xml
<dependency>
  <groupId>org.springframework</groupId>
  <artifactId>spring-beans</artifactId>
  <!-- 排除不需要的传递依赖 -->
  <exclusions>
    <exclusion>
      <groupId>commons-logging</groupId>
      <artifactId>commons-logging</artifactId>
    </exclusion>
  </exclusions>
  <optional>true</optional> <!-- 可选依赖：阻断传递，依赖者需显式引入 -->
</dependency>
```

**依赖继承版本锁定（父工程统一管理）**
```xml
<!-- 父pom -->
<dependencyManagement>
  <dependencies>
    <dependency>
      <groupId>mysql</groupId>
      <artifactId>mysql-connector-java</artifactId>
      <version>8.0.30</version>
    </dependency>
  </dependencies>
</dependencyManagement>

<!-- 子pom里写groupId+artifactId即可，不用写version -->
```

Maven仓库搜索：https://mvnrepository.com/

---

## 三、Git 版本控制

### 高频操作
```bash
# 拉取
git pull https://github.com/xxx/repo.git

# 常规提交
git status               # 查看改动
git add .                # 全加入暂存区
git commit -m "feat: xxx"
git push origin main

# 查看历史
git log --oneline        # 一行一条提交
```

### 创建空的新分支（无任何历史）
```bash
git checkout --orphan newbranch   # 新建无父提交的孤立分支
git rm -rf .                      # 删除当前所有文件（否则会把老分支文件带过去）
touch .gitignore                  # 空分支不能没文件
git add .gitignore
git commit -m '初始化'
git push --set-upstream origin newbranch
```

---

## 四、正则表达式

### 基础语法（必须掌握）

| 符号 | 含义 |
|------|------|
| `^` / `$` | 开头 / 结尾 |
| `.` | 除换行外任意一个字符 |
| `*` / `+` / `?` | 前一个字符：0或多次 / 1或多次 / 0或1次 |
| `{n}` / `{n,m}` | 恰好n次 / n到m次 |
| `[abc]` / `[^abc]` | 匹配括号内任一 / 匹配除括号外任一 |
| `[a-z]` / `[A-Z]` / `[0-9]` | 字符区间 |
| `\d` / `\w` / `\s` | 数字 / 字母数字下划线 / 空白符（等价[0-9]/[A-Za-z0-9_]/空格回车等） |
| `\D` / `\W` / `\S` | 上面的反面（非数字/非字母下划线/非空白） |
| `\|` | 或，比如 `jpg\|png` |
| `i` 修饰符 / `g` 修饰符 | 忽略大小写 / 全文匹配所有（找到全部不停止） |

### 实用正则（直接复制）

**数字校验**
```
纯数字         ^[0-9]*$
至少n位数字    ^\d{n,}$
m~n位数字      ^\d{m,n}$
正整数         ^[1-9]\d*$
两位内小数正数 ^([1-9][0-9]*)+(\.[0-9]{1,2})?$
正负整数小数   ^(\-|\+)?\d+(\.\d+)?$
```

**字符校验**
```
汉字              ^[\u4e00-\u9fa5]{0,}$
英文+数字         ^[A-Za-z0-9]+$
字母开头5-16位     ^[a-zA-Z][a-zA-Z0-9_]{4,15}$
中/英/数字/下划线  ^[\u4E00-\u9FA5A-Za-z0-9_]+$
```

**常用业务**
```
Email        ^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$
手机号        ^1[3-9]\d{9}$
国内固话      \d{3}-\d{8}|\d{4}-\d{7}
身份证        (^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)
密码(字母开头6-18位字母数字下划线) ^[a-zA-Z]\w{5,17}$
强密码(必含大小写+数字8-10位)      ^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9]{8,10}$
日期格式       ^\d{4}-\d{1,2}-\d{1,2}$
12月(01~12)    ^(0?[1-9]|1[0-2])$
31天           ^((0?[1-9])|((1|2)[0-9])|30|31)$
URL           [a-zA-z]+://[^\s]*
IP地址        ((?:(?:25[0-5]|2[0-4]\d|[01]?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d?\d))
腾讯QQ号      [1-9][0-9]{4,}   (从10000开始)
邮政编码       [1-9]\d{5}(?!\d)
HTML标签      <(\S*?)[^>]*>.*?|<.*? />
首尾空白字符   ^\s*|\s*$
```

---

## 五、Blender 3D建模 常用快捷键

### 模式切换
`Tab` 键 → 物体模式 / 编辑模式 切换
`Alt + Z` → 透视/半透明模式（看穿模型）

### 编辑模式 - 三种子模式：点/边/面（快捷键 1/2/3）

**通用**
- `Shift + A` 添加物体
- `G` 移动 / `R` 旋转 / `S` 缩放（后面加 `X/Y/Z` 锁定轴向）
- `Shift` 多选 / `A` 全选 / `Alt + A` 取消全选

**面操作**
- `E` 挤出选区（`Alt+S` 法线挤出，不产生新边线）
- `I` 内插面（向内一圈）
- `Ctrl + B` 倒角（选中边/面→拖动→微调面板调段数）
- `Alt + 左键` 点一条边 → 选中一圈循环边
- 选中边 → `F` 填充面；全选边 → `F` 全部填充

**边操作**
- 选中两条边 → `F` 填充它们之间的面
- `Ctrl + R` 环切：在中间加一条循环边
- `Ctrl + Alt + 左键` → 选中并排边（环两侧）
- 删除边：选中→`X`→删除边/融并边（只删边不删点）
- 桥接循环边：选中两条循环边→Edge菜单→桥接（墙体开洞神器）

**点操作**
- `J` 连接两个点（会切割面）/ `F` 连边（不切）
- `M` 合并点：2个点合并到中心 / 全选后按距离合并
- `Shift + V` 滑移顶点（沿邻近边移动点）
- 右上角选项面板 → **自动合并顶点** + **吸附磁铁到顶点**（建模拼合必开）

**辅助工具**
- 右上角 → 视图叠加层 → **勾选统计信息**（左下角显示点边面数量）
- 右上Shading → Cavity→两者（结构不清晰时开）
- 左上编辑→偏好设置→插件→搜 `LoopTools` 开插件 → 点倒角后右键LoopTools→设为圆形

---

## 六、Mac 使用小贴士

### 常用操作
- **显示/隐藏隐藏文件**：`Command + Shift + .`
- **连接远程Linux**：`ssh root@10.76.16.59`
- **SFTP传输文件**
  ```bash
  sftp root@10.76.16.59
  put /本地路径/xx.txt /服务器路径/usr/local/   # 上传
  get /服务器路径/xx.txt /本地路径/usr/        # 下载
  ```
- SSH旧主机指纹冲突：`ssh-keygen -R 主机IP`（删掉本地记录）

### 环境变量配置文件（按加载顺序）
```
~/.zshrc      ← 现在zsh一般改这个（最常用）
~/.bashrc     ← bash终端
~/.bash_profile / ~/.profile   ← 登录时加载
```
编辑后：`source ~/.zshrc` 立即生效

---

**附：Maven 仓库搜索** https://mvnrepository.com/
**Redis 命令参考** http://redisdoc.com/
