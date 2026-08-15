---
title: docker部署社区版DocumentServer文档服务
createTime: 2025/02/11 11:18:18
permalink: /article/qesg4d7d/
---

# docker部署社区版DocumentServer文档服务

- [官网教程](https://helpcenter.onlyoffice.com/installation/docs-community-install-docker.aspx)

## 1、docker安装文档服务器

```shell script
# 拉取镜像
docker pull onlyoffice/documentserver

# 启动容器
docker run -d \
-v /data/onlyoffice/logs:/var/log/onlyoffice \        # 日志数据
-v /data/onlyoffice/data:/var/www/onlyoffice/Data \   # ssl证书
-v /data/onlyoffice/lib:/var/lib/onlyoffice \         # 文件缓存数据
-v /data/onlyoffice/db:/var/lib/postgresql \          # 数据库
-p 9999:80 \
--restart=always \
--name=documentserver \
-e JWT_SECRET=my_jwt_secret \                         #  JWT密钥，不设置会自动生成，也可以关闭【-e JWT_ENABLED=false】
onlyoffice/documentserver
```

## 2、安装中文字体

- 1、准备Windows下中文字体文件打包好  
    - 控制面板——搜字体——查看安装的字体——再在搜索栏输入【中文】2个字，这些就是需要的中文字体了
    - 选择复制字体到/data/onlyoffice/data/WinFonts【挂载的目录下】
- 2、安装Windows中文字体  
    - 2.1、字体中文名显示问题
        - OnlyOffice暂不支持显示中文字体的中文名
        - 需要对字体文件进行修改，修改英文名为中文名
        - 使用FontCreator软件修改需要显示中文名的中文字体文件（百度）
    - 2.2、复制/var/www/onlyoffice/Data/WinFonts到/usr/share/fonts【操作步骤如下】

```shell script
# 进入容器
docker exec -it documentserver /bin/bash

###### 教程2
# 在容器中执行命令documentserver-generate-allfonts.sh
mv /var/www/onlyoffice/Data/WinFonts/ /usr/share/fonts/
# 安装字体
/usr/bin/documentserver-generate-allfonts.sh

###### 教程2，全量字体替换（其他【https://github.com/neroxps/Docker-Only-Office-Chinese-font】+中文【电脑复制】）
cd /usr/share/fonts/
# 删除除truetype外其他文件和文件夹
rm -R dir 文件夹
cd truetype
# 删除trutype文件夹下所有文件，除了custom文件夹外
rm -R dir *.*
rm -R dir *
# 将所有字体复制到truetype目录下
mv /var/www/onlyoffice/Data/WinFonts/ /usr/share/fonts/truetype/
# 安装字体
sudo mkfontscale
sudo mkfontdir
sudo fc-cache -fv
/usr/bin/documentserver-generate-allfonts.sh

```

## 3、汉化菜单

```shell script
# 进入容器
docker exec -it documentserver /bin/bash
# 里面有个zh.json，修改既可
/var/www/onlyoffice/documentserver/web-apps/apps/spreadsheeteditor/main/locale/zh.json

# 帮助文件修改
/var/www/onlyoffice/documentserver/web-apps/apps/presentationeditor/main/resources/help/zh/Contents.json
/var/www/onlyoffice/documentserver/web-apps/apps/spreadsheeteditor/main/resources/help/zh/Contents.json
/var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/resources/help/zh/Contents.json

```

## 破解连接数限制
进度容器，修改如下文件
- /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/main/app.js
- /var/www/onlyoffice/documentserver/web-apps/apps/documenteditor/mobile/app.js
- /var/www/onlyoffice/documentserver/web-apps/apps/presentationeditor/main/app.js
- /var/www/onlyoffice/documentserver/web-apps/apps/presentationeditor/mobile/app.js
- /var/www/onlyoffice/documentserver/web-apps/apps/spreadsheeteditor/main/app.js
- /var/www/onlyoffice/documentserver/web-apps/apps/presentationeditor/mobile/app.js
    - 修改this._state.licenseType=(t或e)为this._state.licenseType=0


## 3、配置安全令牌

- 1、配置文件路径/etc/onlyoffice/documentserver/local.json

```json
{
    "services": {
        "CoAuthoring": {
            "sql": {
                "dbHost": "localhost",
                "dbName": "onlyoffice",
                "dbUser": "onlyoffice",
                "dbPass": "onlyoffice"
            },
            "redis": {
                "host": "localhost"
            },
            "token": {
                "enable": {
                    "request": {
                        "inbox": false,
                        "outbox": false
                    },
                    "browser": false
                },
                "inbox": {
                    "header": "Authorization"
                },
                "outbox": {
                    "header": "Authorization"
                }
            },
            "secret": {
                "inbox": {
                    "string": "secret"
                },
                "outbox": {
                    "string": "secret"
                },
                "session": {
                    "string": "secret"
                }
            }
        }
    },
    "rabbitmq": {
        "url": "amqp://guest:guest@localhost"
    }
}
```

- 修改内容为

```json
{
    "services": {
        "CoAuthoring": {
            "sql": {
                "dbHost": "localhost",
                "dbName": "onlyoffice",
                "dbUser": "onlyoffice",
                "dbPass": "onlyoffice"
            },
            "redis": {
                "host": "localhost"
            },
            "token": {
                "enable": {
                    "request": {
                        "inbox": true,
                        "outbox": true
                    },
                    "browser": true
                },
                "inbox": {
                    "header": "Authorization"
                },
                "outbox": {
                    "header": "Authorization"
                }
            },
            "secret": {
                "inbox": {
                    "string": "密钥字符串"
                },
                "outbox": {
                    "string": "密钥字符串"
                },
                "session": {
                    "string": "密钥字符串"
                }
            }
        }
    },
    "rabbitmq": {
        "url": "amqp://guest:guest@localhost"
    }
}
```

- 2、重启文档服务器

```shell script
supervisorctl restart all
```
