import { defineNoteConfig, defineNotesConfig } from 'vuepress-theme-plume'

const demoNote = defineNoteConfig({
  dir: 'demo',
  link: '/demo/',
  sidebar: ['', 'foo', 'bar'],
})

const webrtcNote = defineNoteConfig({
  dir: 'webrtc/1.basic',
  link: '/webrtc/1.basic/',
  sidebar: 'auto',
})

export const notes = defineNotesConfig({
  dir: 'notes',
  link: '/',
  notes: [demoNote, webrtcNote],
})
