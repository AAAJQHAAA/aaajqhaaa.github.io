---
title: 前端框架入门合集（Vue 3 + Three.js）
createTime: 2025/01/01 00:00:00
permalink: /article/vue3-threejs/
---

# 前端框架入门合集（Vue 3 + Three.js）

---

## 一、Vue 3 快速入门

### 1. 准备工作
- Vue 3 官网：https://v3.cn.vuejs.org/
- Node.js：https://nodejs.org（自带 npm）
- 推荐包管理 `pnpm`：`npm i -g pnpm`
- 推荐 Vite 脚手架：`npm i -g create-vite`

项目启动通用命令：
```bash
npm install    # 首次拉代码装依赖
npm run dev    # 开发模式启动
npm run build  # 打包dist
```

### 2. 目录结构
```
project/
├─ index.html              # 入口HTML
├─ public/                 # 完全静态资源（不参与打包，原样复制，用/绝对路径引用）
│   └─ favicon.ico
├─ src/
│   ├─ main.js             # 入口JS，创建Vue实例挂载到#app
│   ├─ App.vue             # 根组件
│   ├─ assets/             # 参与打包的静态资源（图片/全局css，会被URL处理）
│   │   └─ style.css
│   ├─ components/         # 子组件
│   ├─ views/              # 页面组件
│   └─ router/index.js     # vue-router路由配置
├─ package.json
└─ vite.config.js          # Vite配置（端口/代理/别名）
```

### 3. 三种定义Vue组件写法（推荐 `<script setup>`）
#### 写法一：传统 Options API（Vue2写法）
```js
export default {
  name: 'App',
  data() { return { count: 0 } },
  methods: { add() { this.count++ } },
  computed: { double() { return this.count*2 } },
  mounted() { console.log('DOM就绪') }
}
```

#### 写法二：组合式 API（setup函数）
```js
import { ref, computed, onMounted } from 'vue'
export default {
  setup() {
    const count = ref(0)                     // 基本类型响应式用ref，js里用.value赋值
    const double = computed(() => count.value*2)
    function add(){ count.value++ }
    onMounted(()=>console.log('挂载完'))
    return { count, add, double }            // 必须return模板才能用
  }
}
```

#### 写法三：`<script setup>` 语法糖（Vue3最佳实践，不用return）
```vue
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
const count = ref(0)
const user = reactive({ name:'zs', age:20 })    // 对象类型用reactive，直接访问属性
const double = computed(() => count.value*2)
const add = () => count.value++
onMounted(()=>console.log('挂载'))
</script>
```

### 4. 模板基础语法
```vue
<template>
  <!-- 插值 -->
  <h1>{{ msg }}</h1>
  <div v-html="htmlStr"></div>           <!-- 渲染HTML（防止XSS用v-text） -->
  <div :class="{ active: isActive }">    <!-- v-bind:属性=值，可省略成: -->
    :style="{color:'red', fontSize:'16px'}"
  </div>

  <!-- 事件 v-on:click → @click -->
  <button @click="count++">自增</button>
  <button @click="handleSubmit($event, id)">传参+事件对象</button>

  <!-- v-model 双向绑定 -->
  <input v-model="user.name" />

  <!-- 条件渲染 -->
  <div v-if="a > 10">A</div>
  <div v-else-if="a > 5">B</div>
  <div v-else>C</div>
  <span v-show="visible">隐藏但仍在DOM，只是display:none，频繁切换用它</span>

  <!-- 列表渲染 -->
  <li v-for="(item, idx) in list" :key="item.id">{{ idx }}-{{ item.name }}</li>

  <!-- 事件修饰符 -->
  <form @submit.prevent="onSubmit"></form>  <!-- 阻止默认行为 -->
  <div @click.stop="onDiv"></div>           <!-- 阻止冒泡 -->
  <input @keyup.enter="search" />           <!-- 回车触发 -->

  <!-- 表单修饰符 -->
  <input v-model.number="age" />            <!-- 自动转数字 -->
  <input v-model.trim="userName" />         <!-- 去首尾空格 -->
</template>
```

### 5. 父子组件通信
```vue
<!-- ===== 子组件 Child.vue ===== -->
<script setup>
const props = defineProps({
  title: { type: String, default: '默认标题' },
  user:  { type: Object, required: true }
})
const emit = defineEmits(['change', 'submit'])   // 声明能触发哪些事件
const send = () => emit('submit', { id:1, txt:'ok' })  // 抛事件+数据给父
</script>

<!-- ===== 父组件 Parent.vue ===== -->
<Child :title="t" :user="me" @submit="handleSubmit" />
<script setup>
const handleSubmit = (data) => console.log(data)  // {id:1,txt:'ok'}
</script>
```
`v-model` 父子双向绑定（简写）：
- 父：`<Child v-model="count" />`
- 子：`defineProps(['modelValue']); defineEmits(['update:modelValue']); emit('update:modelValue', v)`
- 多v-model：`v-model:user="u" v-model:age="a"`

### 6. Vue Router 4（路由）
```js
// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/',       name: 'Home',    component: ()=>import('@/views/Home.vue') },
  { path: '/about',  name: 'About',   component: ()=>import('@/views/About.vue'), meta:{ title:'关于' } },
  { path: '/user/:id', component: ()=>import('@/views/User.vue') },  // 动态参数
  { path: '/:pathMatch(.*)*', redirect: '/' }                       // 404回首页
]
export default createRouter({
  history: createWebHistory(),   // 历史模式（URL无#，需Nginx配置try_files）
  routes
})
```
**跳转**
```vue
<router-link to="/about">去关于</router-link>
```
```js
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
router.push('/about')                // 普通跳转
router.push({ name:'User', params:{ id:100 } })  // 命名路由带参数
router.push({ path:'/search', query:{ k:'苹果' } })  // ?k=苹果 取出来string

const route = useRoute()   // 当前路由对象，取参数
console.log(route.params.id, route.query.k, route.meta.title)
```

**路由守卫（权限/标题）**
```js
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '我的系统'
  const token = localStorage.getItem('token')
  if (to.path !== '/login' && !token) next('/login')
  else next()
})
```

### 7. Pinia 状态管理（Vuex 的替代者）
```js
// stores/counter.js
import { defineStore } from 'pinia'
export const useCounter = defineStore('counter', {
  state: () => ({ count: 0, name: 'aaa' }),
  getters: {
    double: (s) => s.count * 2
  },
  actions: {
    add() { this.count++ }   // action里直接this拿state，不用区分同步异步
  }
})
```
```vue
<script setup>
import { useCounter } from '@/stores/counter'
import { storeToRefs } from 'pinia'
const store = useCounter()
const { count, double } = storeToRefs(store)  // 解构保持响应式
store.add()
store.$patch({ count: 100 })  // 批量改
</script>
```

---

## 二、Three.js 入门

> Three.js = WebGL的JS库封装，用来在浏览器跑3D效果（3D游戏、3D可视化、产品展示等）。

### 1. 三大核心概念
```
场景 Scene（舞台） + 相机 Camera（摄像机/观测角度） + 渲染器 Renderer（拍成画面给<canvas>）
     ↓                    ↓                         ↓
  放物体 Mesh（几何体Geometry + 材质Material） 透视相机PerspectiveCamera最常用
  放光照 Light（环境光AmbientLight/平行光DirectionalLight...）
```

**最小 Demo（一个正方体转动）**
```html
<canvas id="c"></canvas>
<script type="importmap">
{ "imports": { "three": "https://unpkg.com/three@0.160.0/build/three.module.js" } }
</script>
<script type="module">
import * as THREE from 'three'
// 1.场景
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x333333)
// 2.透视相机：视场角FOV, 宽高比, 近裁剪面, 远裁剪面
const camera = new THREE.PerspectiveCamera(75, innerWidth/innerHeight, 0.1, 1000)
camera.position.set(3,3,5)      // 相机放这
camera.lookAt(0,0,0)            // 镜头对准原点
// 3.渲染器
const renderer = new THREE.WebGLRenderer({canvas: document.getElementById('c'), antialias:true})
renderer.setPixelRatio(devicePixelRatio)
renderer.setSize(innerWidth, innerHeight)
// 4.加物体Mesh = 几何体BoxGeometry + 材质MeshStandardMaterial
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1,1,1),
    new THREE.MeshStandardMaterial({color:0x00aaff, roughness:0.4, metalness:0.5})
)
scene.add(cube)
// 5.加光！（没光PBR材质是黑的）
scene.add(new THREE.AmbientLight(0xffffff, 0.5))            // 环境光打底
const dir = new THREE.DirectionalLight(0xffffff, 1.0)       // 平行光=日光
dir.position.set(5,10,7)
scene.add(dir)
// 6.动画循环（每帧重绘）
function animate(){
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()
</script>
```

### 2. 常用几何体
| 类 | 形状 |
|---|---|
| `BoxGeometry(w,h,d)` | 立方体（长宽高） |
| `SphereGeometry(radius, wSeg, hSeg)` | 球体（半径，水平/垂直分段数越大越圆） |
| `CylinderGeometry(topR, bottomR, height, seg)` | 圆柱（topR=0就是圆锥） |
| `TorusGeometry(radius, tubeR, radialSeg, tubularSeg)` | 甜甜圈/圆环 |
| `PlaneGeometry(w,h)` | 平面（薄地毯/画布） |
| `BufferGeometry` | 自定义顶点数据（写position数组，复杂模型用它） |

### 3. 常用材质
| 类 | 特点 |
|---|---|
| `MeshBasicMaterial` | 最简单，**不受光照影响**（给个颜色就直接显示） |
| `MeshLambertMaterial` | 漫反射，不反光，适合粗糙物体 |
| `MeshStandardMaterial`⭐ | PBR物理材质：金属度metalness + 粗糙度roughness，真实感强 |
| `MeshNormalMaterial` | 彩色调试用（显示法向量方向） |

### 4. 常用辅助
```js
scene.add(new THREE.AxesHelper(5))               // 红X绿Y蓝Z坐标轴，长度5
scene.add(new THREE.GridHelper(20, 20, 0x888888))// 20x20网格（大小/段数/颜色）
```

### 5. 加载 GLTF/GLB 3D模型（专业建模软件导出的模型）
```js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
const loader = new GLTFLoader()
loader.load('/models/car.glb', (gltf)=>{
    const model = gltf.scene
    model.scale.set(0.5, 0.5, 0.5)    // 缩放
    scene.add(model)
}, (xhr)=> console.log(xhr.loaded/xhr.total*100+'%'),  // 进度
    (err)=> console.error(err))
```

### 6. 轨道控制器 OrbitControls（鼠标旋转视角）
```js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true        // 阻尼=惯性，更有手感
// animate 循环内加一行：
controls.update()
```

### 7. 窗口自适应
```js
addEventListener('resize', ()=>{
    camera.aspect = innerWidth/innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(innerWidth, innerHeight)
})
```
