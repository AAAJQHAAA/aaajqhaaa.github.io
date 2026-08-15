---
title: Vue与前端工具合集
createTime: 2024/02/04 14:10:33
permalink: /article/vue-frontend-tools-complete/
---

# 一、Vue 3 速查

- Vue 3 + Vite + TypeScript 项目搭建文档（vue3.md）

# 二、Element UI

## Vue2 脚手架 Element-UI 按需引入

- 官网教程：https://element.eleme.cn/#/zh-CN/component/quickstart

### 安装依赖
```sh
npm i element-ui -S
npm install babel-plugin-component -D
```

### babel.config.js 配置
```js
module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    ['component', {
      libraryName: 'element-ui',
      style: true,
      styleLibraryName: 'theme-chalk'
    }, 'element-ui']
  ]
}
```

### 按需引入文件（element-ui-components.js）
```js
import Vue from 'vue';
import {
  Pagination, Dialog, Autocomplete, Dropdown, DropdownMenu,
  DropdownItem, Menu, Submenu, MenuItem, MenuItemGroup,
  Input, InputNumber, Radio, RadioGroup, RadioButton,
  Checkbox, CheckboxButton, CheckboxGroup, Switch, Select,
  Option, OptionGroup, Button, ButtonGroup, Table, TableColumn,
  DatePicker, TimeSelect, TimePicker, Popover, Tooltip,
  Breadcrumb, BreadcrumbItem, Form, FormItem, Tabs, TabPane,
  Tag, Tree, Alert, Slider, Icon, Row, Col, Upload, Progress,
  Spinner, Badge, Card, Rate, Steps, Step, Carousel,
  CarouselItem, Collapse, CollapseItem, Cascader, ColorPicker,
  Transfer, Container, Header, Aside, Main, Footer, Timeline,
  TimelineItem, Link, Divider, Image, Calendar, Backtop,
  PageHeader, CascaderPanel, Loading, MessageBox, Message,
  Notification
} from 'element-ui';

// 组件注册
Vue.use(Pagination); Vue.use(Dialog); Vue.use(Autocomplete);
Vue.use(Dropdown); Vue.use(DropdownMenu); Vue.use(DropdownItem);
Vue.use(Menu); Vue.use(Submenu); Vue.use(MenuItem); Vue.use(MenuItemGroup);
Vue.use(Input); Vue.use(InputNumber);
Vue.use(Radio); Vue.use(RadioGroup); Vue.use(RadioButton);
Vue.use(Checkbox); Vue.use(CheckboxButton); Vue.use(CheckboxGroup);
Vue.use(Switch); Vue.use(Select); Vue.use(Option); Vue.use(OptionGroup);
Vue.use(Button); Vue.use(ButtonGroup);
Vue.use(Table); Vue.use(TableColumn);
Vue.use(DatePicker); Vue.use(TimeSelect); Vue.use(TimePicker);
Vue.use(Popover); Vue.use(Tooltip);
Vue.use(Breadcrumb); Vue.use(BreadcrumbItem);
Vue.use(Form); Vue.use(FormItem);
Vue.use(Tabs); Vue.use(TabPane);
Vue.use(Tag); Vue.use(Tree); Vue.use(Alert); Vue.use(Slider);
Vue.use(Icon); Vue.use(Row); Vue.use(Col);
Vue.use(Upload); Vue.use(Progress); Vue.use(Spinner); Vue.use(Badge);
Vue.use(Card); Vue.use(Rate);
Vue.use(Steps); Vue.use(Step);
Vue.use(Carousel); Vue.use(CarouselItem);
Vue.use(Collapse); Vue.use(CollapseItem);
Vue.use(Cascader); Vue.use(ColorPicker); Vue.use(Transfer);
Vue.use(Container); Vue.use(Header); Vue.use(Aside); Vue.use(Main); Vue.use(Footer);
Vue.use(Timeline); Vue.use(TimelineItem);
Vue.use(Link); Vue.use(Divider); Vue.use(Image); Vue.use(Calendar);
Vue.use(Backtop); Vue.use(PageHeader); Vue.use(CascaderPanel);

Vue.use(Loading.directive);

// 挂载全局方法
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;
```

### main.js 中引入
```js
import './element-ui-components.js'
```

# 三、HTML DOM API

参考文档：https://developer.mozilla.org/en-US/docs/Web/API/HTML_DOM_API

# 四、IFrame 通信

## HTMLIFrameElement 接口

`HTMLIFrameElement` 提供操作内联框架（iframe）的属性和方法，继承自 `HTMLElement`。

```ts
interface HTMLIFrameElement extends HTMLElement {
  // 基本属性
  src: string;                  // 加载的 URL
  srcdoc: string;               // 直接嵌入的页面内容 HTML 字符串
  name: string;                 // iframe 名称（可作为 target 使用）
  width: string;                // 宽度
  height: string;               // 高度
  scrolling: string;            // 是否可滚动（已弃用）
  allow: string;                // 权限策略（如 allow="fullscreen; camera"）
  allowFullscreen: boolean;     // 是否允许全屏
  allowPaymentRequest: boolean; // 是否允许支付请求
  referrerPolicy: ReferrerPolicy; // 引用策略
  readonly sandbox: DOMTokenList;  // 沙箱限制令牌列表

  // 跨文档访问（同源才能拿到非 null）
  readonly contentDocument: Document | null;  // iframe 内部 document 对象
  readonly contentWindow: WindowProxy | null; // iframe 内部 window 对象

  // 已弃用属性
  align: string;                // 与相邻文本对齐
  frameBorder: string;          // 是否显示边框
  longDesc: string;             // 长描述 URI
  marginHeight: string;         // 上下边距
  marginWidth: string;          // 左右边距

  // 方法
  getSVGDocument(): Document | null; // 获取 SVG 文档（仅 iframe 加载 SVG 时）
}
```

## 跨源通信方式：postMessage
不同源的 iframe 与父页面之间不能直接访问对方 DOM，必须通过 `window.postMessage` 通信。

### 父页面 → iframe
```js
// 父页面发送
const iframe = document.querySelector('iframe');
iframe.contentWindow.postMessage(
  { type: 'hello', data: 'from parent' },  // 消息内容（可序列化对象）
  'https://target-origin.com'              // 目标源，或 '*'（不推荐）
);

// 父页面监听 iframe 回复
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://target-origin.com') return; // 安全校验
  console.log('收到消息:', event.data);
});
```

### iframe → 父页面
```js
// iframe 内发送（父窗口）
window.parent.postMessage(
  { type: 'reply', data: 'from iframe' },
  'https://parent-origin.com'
);

// iframe 内监听父页面消息
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://parent-origin.com') return;
  console.log('收到父消息:', event.data);
});
```

> **安全注意**：务必校验 `event.origin`，避免接收任意来源的消息。

# 五、Webpack loader

## html-loader
将 HTML 文件导出为字符串，编译时自动压缩。

### 安装
```sh
npm install --save-dev html-loader
```

### webpack.config.js 配置
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.html$/i,
        loader: 'html-loader',
      },
    ],
  },
};
```

### 使用
```js
import html from './file.html';
// html 为压缩后的 HTML 字符串
```
