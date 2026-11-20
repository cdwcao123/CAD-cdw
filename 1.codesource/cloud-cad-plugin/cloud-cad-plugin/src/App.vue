<script setup lang="ts">
import { computed, ref, shallowRef } from 'vue';
import type { McEditor } from 'McEditor';
import CadEditor from './components/CadEditor.vue';
import CloudBridgePanel from './components/CloudBridgePanel.vue';

const editor = shallowRef<McEditor>();
const panelVisible = ref(true);
const editorError = ref('');
const runtime = window.cloudCadPluginConfig ?? {};
const apiLabel = computed(() => runtime.apiBase || window.baseAPI || '未配置接口地址');

function onEditorReady(value: McEditor): void {
  editor.value = value;
  editorError.value = '';
}

function onEditorError(message: string): void {
  editorError.value = message;
  panelVisible.value = true;
}
</script>

<template>
  <div class="app-shell">
    <header class="app-topbar">
      <div class="brand">
        <span class="brand-monogram">YT</span>
        <div>
          <strong>云图 CAD 云桥</strong>
          <span>SDK 直连插件</span>
        </div>
      </div>

      <div class="topbar-meta">
        <span class="connection-dot" :class="{ warning: editorError }" />
        <span class="connection-copy">
          {{ editorError || (editor ? '编辑器已就绪' : '编辑器正在初始化') }}
        </span>
        <span class="api-address" :title="apiLabel">{{ apiLabel }}</span>
        <a
          v-if="runtime.systemUrl"
          class="system-link"
          :href="runtime.systemUrl"
          target="_blank"
          rel="noreferrer"
        >
          打开业务系统
        </a>
        <button class="panel-toggle" type="button" @click="panelVisible = !panelVisible">
          {{ panelVisible ? '收起接入面板' : '打开接入面板' }}
        </button>
      </div>
    </header>

    <main class="workspace">
      <CadEditor @ready="onEditorReady" @error="onEditorError" />
      <CloudBridgePanel
        :editor="editor"
        :visible="panelVisible"
        @close="panelVisible = false"
      />
    </main>
  </div>
</template>

<style>
:root {
  font-family:
    "Microsoft YaHei UI",
    "PingFang SC",
    "Segoe UI",
    sans-serif;
  color: #18262d;
  background: #eef3f5;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* {
  box-sizing: border-box;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
}

button,
input,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

.app-shell {
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  background: #edf2f4;
}

.app-topbar {
  position: relative;
  z-index: 30;
  display: flex;
  min-height: 54px;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 7px 16px;
  color: #f7fbfc;
  background:
    linear-gradient(90deg, rgba(18, 44, 55, 0.98), rgba(22, 63, 76, 0.96)),
    #14363f;
  box-shadow: 0 8px 22px rgba(18, 42, 51, 0.2);
}

.brand {
  display: flex;
  min-width: 220px;
  align-items: center;
  gap: 10px;
}

.brand-monogram {
  display: grid;
  width: 36px;
  height: 36px;
  place-items: center;
  border: 1px solid rgba(255, 255, 255, 0.42);
  border-radius: 10px 4px 10px 4px;
  color: #fff;
  background: linear-gradient(145deg, #d18c36, #ae6825);
  font-family: Georgia, serif;
  font-size: 15px;
  font-weight: 700;
  letter-spacing: 0.5px;
  box-shadow: inset 0 1px rgba(255, 255, 255, 0.35);
}

.brand div {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.brand strong {
  font-size: 15px;
  letter-spacing: 0.08em;
}

.brand span:last-child {
  color: #a9c2ca;
  font-size: 10px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
}

.topbar-meta {
  display: flex;
  min-width: 0;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  font-size: 11px;
}

.connection-dot {
  width: 7px;
  height: 7px;
  flex: 0 0 auto;
  border-radius: 50%;
  background: #6fd3ad;
  box-shadow: 0 0 0 4px rgba(111, 211, 173, 0.12);
}

.connection-dot.warning {
  background: #ffb26a;
  box-shadow: 0 0 0 4px rgba(255, 178, 106, 0.14);
}

.connection-copy {
  color: #d6e7eb;
  white-space: nowrap;
}

.api-address {
  max-width: 245px;
  overflow: hidden;
  padding: 5px 8px;
  border: 1px solid rgba(183, 216, 225, 0.15);
  border-radius: 5px;
  color: #91afb8;
  background: rgba(0, 0, 0, 0.12);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.system-link,
.panel-toggle {
  height: 30px;
  padding: 0 11px;
  border: 1px solid rgba(183, 216, 225, 0.24);
  border-radius: 6px;
  color: #e8f3f5;
  background: rgba(255, 255, 255, 0.06);
  text-decoration: none;
  line-height: 28px;
  white-space: nowrap;
}

.system-link:hover,
.panel-toggle:hover {
  border-color: rgba(213, 170, 100, 0.75);
  background: rgba(209, 140, 54, 0.15);
}

.workspace {
  position: relative;
  min-height: 0;
  flex: 1;
  overflow: hidden;
}

@media (max-width: 920px) {
  .api-address,
  .connection-copy {
    display: none;
  }

  .app-topbar {
    min-height: 48px;
  }
}
</style>
