import { defineThemeConfig } from 'vuepress-theme-plume'
import { navbar } from './navbar'

/**
 * @see https://theme-plume.vuejs.press/config/basic/
 */
export default defineThemeConfig({
  logo: 'https://theme-plume.vuejs.press/plume.png',

  appearance: true,  // 配置 深色模式

  social: [
    // { icon: 'github', link: '/' },
  ],
  // navbarSocialInclude: ['github'], // 允许显示在导航栏的 social 社交链接
  // aside: true, // 页内侧边栏， 默认显示在右侧
  // outline: [2, 3], // 页内大纲， 默认显示 h2, h3

  /**
   * 文章版权信息
   * @see https://theme-plume.vuejs.press/guide/features/copyright/
   */
  // copyright: true,

  // prevPage: true,   // 是否启用上一页链接
  // nextPage: true,   // 是否启用下一页链接
  // createTime: true, // 是否显示文章创建时间

  /* 站点页脚 */
  // footer: {
  //   message: 'Power by <a target="_blank" href="https://v2.vuepress.vuejs.org/">VuePress</a> & <a target="_blank" href="https://theme-plume.vuejs.press">vuepress-theme-plume</a>',
  //   copyright: '',
  // },

  /**
   * @see https://theme-plume.vuejs.press/config/basic/#profile
   */
  profile: {
    avatar: 'https://theme-plume.vuejs.press/plume.png',
    name: 'jqh',
    description: 'jqh',
    // circle: true,
    // location: '',
    // organization: '',
  },

  navbar,

  /**
   * 集合配置（博客与笔记统一迁移至集合架构）
   * @see https://theme-plume.vuejs.press/guide/collection/post/
   * @see https://theme-plume.vuejs.press/guide/collection/doc/
   */
  collections: [
    {
      type: 'post',
      dir: 'blog',
      title: '博客',
      postList: true,
      link: '/blog/',
      linkPrefix: '/blog/',
      tags: true,
      tagsLink: '/blog/tags/',
      archives: true,
      archivesLink: '/blog/archives/',
      categories: true,
      categoriesLink: '/blog/categories/',
    },
    {
      type: 'doc',
      dir: 'notes/demo',
      title: '示例',
      linkPrefix: '/demo/',
      sidebar: ['', 'foo', 'bar'],
    },
    {
      type: 'doc',
      dir: 'notes/webrtc/1.basic',
      title: '1.basic',
      linkPrefix: '/webrtc/1.basic/',
      sidebar: 'auto',
    },
  ],

  /**
   * 公告板
   * @see https://theme-plume.vuejs.press/guide/features/bulletin/
   */
  // bulletin: {
  //   layout: 'top-right',
  //   contentType: 'markdown',
  //   title: '公告板标题',
  //   content: '公告板内容',
  // },

  /* 过渡动画 @see https://theme-plume.vuejs.press/config/basic/#transition */
  // transition: {
  //   page: true,        // 启用 页面间跳转过渡动画
  //   postList: true,    // 启用 博客文章列表过渡动画
  //   appearance: 'fade',  // 启用 深色模式切换过渡动画, 或配置过渡动画类型
  // },

})
