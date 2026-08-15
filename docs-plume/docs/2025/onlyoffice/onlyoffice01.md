---
title: 开发说明
createTime: 2025/02/11 11:18:18
permalink: /article/p3vb930c/
---

# 开发说明

- 抽空学习和整理一下OnlyOffice文档在线编辑的集成和使用

## OnlyOffice介绍

- 官网[https://www.onlyoffice.com/](https://www.onlyoffice.com/)
- API官网[https://api.onlyoffice.com/](https://api.onlyoffice.com/)
- 帮助文档[https://helpcenter.onlyoffice.com/](https://helpcenter.onlyoffice.com/)
    - 开发人员主要关注[ONLYOFFICE Docs](https://helpcenter.onlyoffice.com/installation/docs-index.aspx)
        - Docs Community Edition【社区版】：免费
        - Docs Enterprise Edition【企业版】：需购买
        - Docs Developer Edition【开发者版】：需购买
        - Docs Cloud Service【云服务版】：需购买

## 集成到文档服务到自己应用的流程

- 1、部署社区版DocumentServer文档服务
- 2、自己应用的后端实现一些文件操作接口（配置ONLYOFFICE连接，处理文档存储和转换请求）
    - 可以很多语言实现[官方demo](https://github.com/ONLYOFFICE/document-server-integration)
- 3、自己的前端vue使用onlyoffice的API实现编辑预览（实现与ONLYOFFICE Document Server的通信，展示文档预览、编辑能力）
    - 前端vue集成实现[官方教程](https://api.onlyoffice.com/docs/Docs%20API/Get%20Started/Frontend%20Frameworks/Vue)
