import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const demoNote = defineNoteConfig({
  dir: 'demo',
  link: '/demo',
  sidebar: ['', 'foo', 'bar'],
})

const onlyofficeNote = defineNoteConfig({
  dir: 'onlyoffice',
  link: '/onlyoffice',
  sidebar: ['', '开发说明', 'onlyoffice文档服务部署', 'java后端自开发文件服务', 'vue前端自开发编辑预览'],
})

export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [demoNote, onlyofficeNote],
})
