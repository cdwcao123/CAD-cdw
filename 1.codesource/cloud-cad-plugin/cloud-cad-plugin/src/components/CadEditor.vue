<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, shallowRef } from 'vue';
import { McEditor } from 'McEditor';

const emit = defineEmits<{
  ready: [editor: McEditor];
  error: [message: string];
}>();

const container = ref<HTMLDivElement>();
const editor = shallowRef<McEditor>();
const initializing = ref(true);

async function initialize(): Promise<void> {
  try {
    editor.value = new McEditor({
      container: container.value!,
      assetsPath: './',
      coreAssetsPath: './core/',
      mcdConvertApi: window.mcdConvertApi,
    });
    await editor.value.init();
    window.mcEditor = editor.value;
    emit('ready', editor.value);
  } catch (error) {
    emit('error', error instanceof Error ? error.message : '云图 CAD 编辑器初始化失败');
  } finally {
    initializing.value = false;
  }
}

onMounted(initialize);
onBeforeUnmount(() => {
  editor.value?.destroy();
  window.mcEditor = null;
});

defineExpose({ editor });
</script>

<template>
  <div class="cad-editor">
    <div id="editContainer" ref="container" />
    <div v-if="initializing" class="editor-loading">
      <span class="loading-mark" />
      <strong>正在启动云图 CAD 内核</strong>
      <span>加载菜单、字体与绘图引擎…</span>
    </div>
  </div>
</template>

<style scoped>
.cad-editor {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f3f6f8;
}

#editContainer {
  width: 100%;
  height: 100%;
}

.editor-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-content: center;
  justify-items: center;
  gap: 10px;
  color: #51606c;
  background:
    radial-gradient(circle at 50% 40%, rgba(29, 111, 137, 0.12), transparent 38%),
    #f5f8fa;
  z-index: 2;
}

.editor-loading strong {
  color: #1d2d35;
  font-size: 16px;
}

.editor-loading span:last-child {
  font-size: 12px;
}

.loading-mark {
  width: 44px;
  height: 44px;
  border: 3px solid rgba(29, 111, 137, 0.16);
  border-top-color: #1d6f89;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
