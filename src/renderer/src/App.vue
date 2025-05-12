<script setup lang="ts">
import Versions from './components/Versions.vue'

const ipcHandle = (): void => window.electron.ipcRenderer.send('ping')
</script>

<template>
  <img alt="logo" class="logo" src="./assets/electron.svg" />
  <div class="creator">由 electron-vite 提供支持</div>
  <div class="text">
    构建一个使用
    <span class="vue">Vue</span>
    和
    <span class="ts">TypeScript</span>
    的 Electron 应用
  </div>
  <p class="tip">请尝试按 <code>F12</code> 打开开发者工具</p>
  <div class="actions">
    <div class="action">
      <a href="https://electron-vite.org/" target="_blank" rel="noreferrer">文档</a>
    </div>
    <div class="action">
      <a target="_blank" rel="noreferrer" @click="ipcHandle">发送IPC</a>
    </div>
  </div>
  <Versions />
</template>
