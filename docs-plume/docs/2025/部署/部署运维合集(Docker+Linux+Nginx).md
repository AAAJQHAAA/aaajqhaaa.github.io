---
title: 部署运维合集（Docker + Linux + Nginx）
createTime: 2025/01/01 00:00:00
tags:
permalink: /article/devops/
---

# 部署运维合集（Docker + Linux + Nginx）

---

## 一、Docker 容器化

### 1. CentOS 安装 Docker
```bash
# 1.卸载旧版
yum -y remove docker docker-client docker-client-latest docker-common docker-latest docker-latest-logrotate docker-logrotate docker-engine
# 2.装需要的软件包
yum install -y yum-utils device-mapper-persistent-data lvm2
# 3.设置国内阿里云yum源
yum-config-manager --add-repo https://mirrors.aliyun.com/docker-ce/linux/centos/docker-ce.repo
# 4.更新yum软件包索引，装Docker社区版
yum makecache fast
yum -y install docker-ce docker-ce-cli containerd.io
# 5.启动+开机自启
systemctl start docker
systemctl enable docker
# 6.测试
docker run hello-world
docker version
```

### 2. 配置镜像加速器（拉取快10倍）
```bash
# 登录阿里云容器服务→控制台→镜像加速 拿自己的地址
mkdir -p /etc/docker
tee /etc/docker/daemon.json <<-'EOF'
{
  "registry-mirrors": ["https://你的前缀.mirror.aliyuncs.com"],
  "log-driver":"json-file",
  "log-opts": {"max-size":"100m", "max-file":"3"}   # 限制单个容器日志大小防爆盘
}
EOF
systemctl daemon-reload
systemctl restart docker
```

### 3. 常用命令速查
```bash
# =============== 镜像 Image ===============
docker images                   # 查看所有本地镜像
docker search centos            # 搜索仓库镜像
docker pull centos:7            # 拉镜像（不加tag默认latest）
docker rmi IMAGE_ID             # 删单个镜像
docker rmi -f $(docker images -qa)  # 删所有镜像（慎用！）

# =============== 容器 Container ===============
docker run [可选参数] 镜像名 /bin/bash
# 常用参数：
--name="xxx"     容器名字
-d               后台守护式运行（启动后不占当前终端）
-it              交互模式运行（-i 保持STDIN开，-t 分配伪终端）
-p 宿主机端口:容器端口   端口映射
-v 宿主机路径:容器内路径 目录挂载（数据持久化在宿主机）
-e KEY=VALUE     传环境变量
--restart=always 容器退出自动重启（开机自启）
--network=host   共享宿主机网络（不用再-p端口映射）

docker ps                        # 查看运行中的容器（-a 含已停止）
docker start/stop/restart id     # 启动/停止/重启
docker rm $(docker ps -qa)       # 删所有容器（运行中加-f）
docker exec -it 容器名 /bin/bash # 【最常用】进入容器新开一个终端，exit不停止容器
docker attach 容器名             # 进入容器正在跑的进程，exit=停止容器

docker logs -f --tail 50 容器名  # 跟踪实时日志末尾50行
docker top 容器名                # 容器内进程
docker inspect 容器名            # 容器元信息（JSON）

docker cp 容器id:/容器内路径 /宿主机路径     # 容器→宿主机拷文件
docker cp /宿主机路径 容器id:/容器内路径     # 宿主机→容器拷文件

docker build -f /xxx/Dockerfile -t 新镜像名:tag .   # 用Dockerfile构建镜像
# 例：docker build -t myapp:1.0 .
docker commit -m "说明" -a="作者" 容器id 新镜像名:tag  # 把容器打包成新镜像
docker save -o 打包名.tar 镜像名:tag    # 导出镜像成tar包
docker load -i 打包名.tar              # 导入tar包为镜像
```

### 4. Dockerfile 常用指令
```dockerfile
FROM centos:7                    # 基础镜像（第一个指令）
MAINTAINER jqh<jqh@163.com>      # 作者信息（可选）
RUN yum -y install vim net-tools # 构建镜像时执行的命令（每层RUN生成一个镜像层，尽量合并）
WORKDIR /usr/local               # 进入容器后的默认工作目录（类似cd）
ENV MY_PATH /usr/local           # 设置环境变量，后面能用$MY_PATH
ADD jdk-8u301.tar.gz /usr/local  # 把宿主机tar自动拷贝+解压到镜像内
COPY server.xml /opt/tomcat/conf # 纯拷贝（不解压）
EXPOSE 8080                      # 暴露端口声明（需要-p映射才生效）
CMD /bin/bash                    # 容器启动时最后执行的命令（多个CMD仅最后一个生效；被run参数覆盖）
ENTRYPOINT /bin/start.sh         # 和CMD类似，不会被run参数覆盖，只会追加参数
VOLUME ["/data01","/data02"]     # 声明匿名数据卷（挂载点）
```
Dockerfile 指令顺序：**FROM → MAINTAINER → RUN 安装 → ENV → WORKDIR → ADD/COPY → EXPOSE → CMD/ENTRYPOINT**

### 5. 容器数据卷（共享+持久化）
```bash
# 方式一：run时 -v 显式指定
docker run -it -v /宿主机绝对路径:/容器内路径:ro 镜像名
# 权限:rw=读写(默认)  ro=容器内只读

# 方式二：--volumes-from 继承其他容器的卷配置（子容器继承父容器卷）
docker run -it --name dc02 --volumes-from dc01 centos
```

---

## 二、Linux 常用命令

### 1. 文件目录
```bash
ls -lht             # 按修改时间排序，h显示K/M/G单位
ls -a               # 含隐藏文件
cd ~                # 回家目录
pwd                 # 查看当前路径
mkdir -p a/b/c      # 多层目录递归创建
rm -rf 目录          # 强制递归删除（谨慎！）
cp -r src dest      # 复制目录(需-r)
mv old new          # 重命名/移动
touch file1 file2   # 新建空文件
ln -s /root/data myLink    # 软链接(符号链接)，指向目标
```

### 2. 文件查看
```bash
cat file.txt        # 从头打印全部（小文件）
tac file.txt        # 反向（从尾到头）
more big.log        # 按页查看：空格下一页 q退出
less big.log        # 比more强：PgUp/PgDn可翻回，/关键词搜索 n下一个N上一个
head -n 20 file     # 前20行
tail -f -n 200 log  # 跟踪文件末尾，实时刷新（看日志神器！）
wc -l file.txt      # 统计多少行
```

### 3. 搜索/查找
```bash
find / -name "*.conf" -size +20M  # 全盘找文件名匹配且大于20M的
find . -user root                  # 当前目录下root创建的文件
grep -n "关键字" file.txt          # 文件内搜行，显示行号
grep -rni "关键字" ./              # -r递归子目录  -n行号  -i忽略大小写
```

### 4. 压缩解压
```bash
# .tar / .tar.gz 【最常见】
tar -zxvf 包.tar.gz -C /目标目录    # 解压到指定目录  z=gzip j=bzip2  x=解  v=显示过程  f=文件
tar -zcvf 打包名.tar.gz 源1 源2...  # 压缩打包

# .zip / .unzip
unzip 包.zip -d /opt                # 解压到/opt
zip -r 新.zip 目标目录              # 压缩目录(加-r)

# .gz / .bz2
gzip file          # 压缩成 file.gz（原文件没了）
gunzip file.gz     # 解压
bzip2 file
bunzip2 file.bz2
```

### 5. 进程 & 端口
```bash
ps aux | grep java                 # 找java进程（PID在第二列）
ps -ef | grep sshd                 # 父进程PPID可见
kill -9 进程号                     # 强制结束
netstat -tunlp | grep 8080         # 查8080端口被谁占了
lsof -i:8080                       # 另一种查端口
top                                # 动态进程监控（类似任务管理器，按1看多核，按M内存排序，P CPU排序）
```

### 6. 网络
```bash
ifconfig / ip addr                     # 看网卡IP
ping -c 3 baidu.com                    # ping3次
wget https://xx/xx.rpm                 # 下载
curl http://127.0.0.1:8080/api/test    # 测试接口连通
systemctl stop firewalld               # 停防火墙
systemctl disable firewalld            # 永久关闭（下次开机不启）
systemctl status firewalld             # 查看状态
```

### 7. 权限 & 用户
```bash
chmod 755 shell.sh     # 改权限 rwx=4+2+1  7=rwx 5=r-x 6=rw-
chmod -R 777 /opt/app  # 递归
chown -R mysql:mysql /data  # 递归改所属用户:组
useradd jqh            # 新建用户
passwd jqh             # 设密码
su - jqh               # 切用户（带环境变量）
```

### 8. 磁盘/内存
```bash
df -h                  # 磁盘使用情况（总体）
du -sh /home/*         # 目录大小排序
free -m                # 内存使用（M为单位）
uptime                 # 系统运行多久 + 平均负载
```

---

## 三、Nginx 反向代理 & 负载均衡

### 1. CentOS 安装 Nginx
```bash
# 方式一：yum（版本可能旧）
yum install -y nginx
# 方式二：官网下载编译（版本灵活）
yum install -y gcc pcre-devel zlib-devel openssl openssl-devel
wget http://nginx.org/download/nginx-1.20.1.tar.gz
tar -zxvf nginx-1.20.1.tar.gz
cd nginx-1.20.1
./configure --prefix=/usr/local/nginx --with-http_ssl_module --with-http_v2_module
make && make install
# 加入开机启动：把nginx -c /xx/nginx.conf 加到 /etc/rc.local
```

### 2. Nginx 启停控制
```bash
cd /usr/local/nginx/sbin
./nginx                 # 启动
./nginx -s stop         # 立即停止（不再接收新请求，直接退出）
./nginx -s quit         # 优雅停止（等当前处理完再停）
./nginx -s reload       # 重载配置【核心】：改conf后执行，不中断服务
./nginx -t              # 检查nginx.conf语法是否正确
ps aux | grep nginx     # 查看进程（master+worker）
```

### 3. 核心配置文件 nginx.conf 结构
```nginx
# ============ 全局块 ============
#user  nobody;
worker_processes  1;          # worker进程数，建议=CPU核数
error_log  logs/error.log;    # 错误日志
pid        logs/nginx.pid;    # 主进程PID

# ============ events块（连接相关） ============
events {
    worker_connections  1024;  # 每个worker最大并发连接数
}

# ============ http块（最核心） ============
http {
    include       mime.types;
    default_type  application/octet-stream;
    sendfile        on;       # 开启高效文件传输
    keepalive_timeout  65;    # 连接超时秒
    gzip  on;                 # 开gzip压缩，减少传输体积

    # ========= 静态资源server（前后端不分离场景） =========
    server {
        listen       80;
        server_name  localhost;

        location / {
            root   html;           # 项目资源根目录（相对nginx安装路径）
            index  index.html index.htm;  # 默认首页
            try_files $uri $uri/ /index.html;  # 【Vue/React必写】刷新不404
        }

        location ~ \.(gif|jpg|png|css|js|svg|woff2?)$ {
            root  html/static;
            expires 30d;   # 静态资源缓存30天，省带宽
        }

        # ====== 反向代理（跨域解决） ======
        location /api/ {
            proxy_pass http://127.0.0.1:8080/;  # 把/api转发到后端服务，末尾/=去掉/api前缀
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;          # 真实客户端IP给后端
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_connect_timeout 60s;
            proxy_read_timeout 600s;
        }
        # 易错点：proxy_pass http://后端/api; 末尾带/与不带/ 结果不同：
        # 有/   → /api/xxx → 后端/xxx      （前缀替换掉）
        # 无/   → /api/xxx → 后端/api/xxx  （原样拼接）

        error_page   500 502 503 504  /50x.html;
        location = /50x.html { root   html; }
    }

    # ========= 负载均衡：upstream定义服务池 =========
    upstream my_server_pool {
        # 服务器列表（不配策略=轮询）
        server 192.168.1.101:8080 weight=1;     # weight=权重，越大分请求越多
        server 192.168.1.102:8080 weight=2;
        server 192.168.1.103:8080 backup;       # backup=备用机，其他全挂才上
        ip_hash;     # 【会话保持】按客户端IP哈希分配，同IP始终落到同服务器
        # 其他策略：least_conn 最少连接优先；fair 响应时间短优先
    }

    server {
        listen 80;
        server_name www.aaa.com;
        location / {
            proxy_pass http://my_server_pool;  # 直接写upstream名即可
        }
    }
}
```

### 4. 多域名/多站点 & 证书HTTPS
**多个server块就行，每个server_name不同**
```nginx
# HTTPS 示例（443端口 + SSL证书）
server {
    listen 443 ssl http2;
    server_name www.aaa.com;

    ssl_certificate     /root/ssl/1_www.aaa.com_bundle.crt;
    ssl_certificate_key /root/ssl/2_www.aaa.com.key;
    ssl_session_timeout 5m;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE:ECDH:AES:HIGH:!NULL:!aNULL:!MD5:!ADH:!RC4;
    ssl_protocols TLSv1 TLSv1.1 TLSv1.2;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://my_server_pool;
    }
}
# HTTP强制跳HTTPS
server {
    listen 80;
    server_name www.aaa.com;
    return 301 https://$host$request_uri;
}
```

### 5. 完整实战命令：改完conf务必检查+重载
```bash
./sbin/nginx -t         # 先测语法，看到 test is successful 再reload
./sbin/nginx -s reload  # 平滑生效，不中断用户请求
```

---

## 四、文件传输/远程登录
```bash
scp /本地路径/file.sh user@10.0.0.12:/远程路径     # 本地上传到远程
scp user@10.0.0.12:/路径/包.tar.gz /本地路径      # 远程下载到本地

# Mac 自带 SFTP
sftp root@10.76.16.59
put /本地/xx.txt /服务器/usr/local/
get /服务器/xx.txt /本地/
```

## 五、SSH 免密登录
```bash
ssh-keygen -t rsa      # 连敲三次回车，生成 ~/.ssh/id_rsa 私钥 + id_rsa.pub 公钥
# 把本机公钥内容（~/.ssh/id_rsa.pub）粘贴到 远程服务器 ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
```
