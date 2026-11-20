<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import MCCORE from 'McCore';
import type { McEditor } from 'McEditor';
import type {
  CloudCadRuntimeConfig,
  Drawing,
  Workspace,
} from '@/types/cloudCad';
import { CloudCadApi } from '@/utils/cloudCadApi';
import {
  blobToBase64,
  fileBaseName,
  fileExtension,
  formatBytes,
} from '@/utils/files';

const props = defineProps<{
  editor: McEditor | undefined;
  visible: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const runtime: CloudCadRuntimeConfig = {
  apiBase: window.cloudCadPluginConfig?.apiBase || window.baseAPI || '',
  mcdConvertApi:
    window.cloudCadPluginConfig?.mcdConvertApi ||
    window.mcdConvertApi ||
    window.baseAPI ||
    '',
  systemUrl: window.cloudCadPluginConfig?.systemUrl || '',
  reuseSystemToken: window.cloudCadPluginConfig?.reuseSystemToken ?? true,
  requestTimeout: window.cloudCadPluginConfig?.requestTimeout ?? 60_000,
};
const api = new CloudCadApi(runtime.apiBase, runtime.mcdConvertApi, runtime.requestTimeout);

const account = ref('');
const password = ref('');
const authenticated = ref(false);
const userLabel = ref('');
const workspaces = ref<Workspace[]>([]);
const selectedAreaId = ref('');
const drawings = ref<Drawing[]>([]);
const drawingFilter = ref('');
const selectedDrawingId = ref('');
const currentDrawing = ref<Drawing>();
const uploadFile = ref<File>();
const uploadName = ref('');
const versionDesc = ref('');
const refreshThumbnail = ref(false);
const fileInput = ref<HTMLInputElement>();
const busy = ref(false);
const busyText = ref('');
const errorMessage = ref('');
const noticeMessage = ref('');

const selectedWorkspace = computed(() =>
  workspaces.value.find((workspace) => workspace.ID === selectedAreaId.value),
);

const filteredDrawings = computed(() => {
  const keyword = drawingFilter.value.trim().toLowerCase();
  if (!keyword) return drawings.value;
  return drawings.value.filter((drawing) =>
    drawing.MapName.toLowerCase().includes(keyword),
  );
});

const currentFile = computed(() => {
  const version = currentDrawing.value?.BaseMapVersionInfo;
  return version?.MasFileId || version?.DxfFileId || '';
});

const uploadMeta = computed(() => {
  if (!uploadFile.value) return '支持 DWG / DXF / MCD / MCTF';
  return `${uploadFile.value.name} · ${formatBytes(uploadFile.value.size)}`;
});

const currentName = computed(
  () => currentDrawing.value?.MapName || '尚未打开云端图纸',
);

onMounted(restoreSession);

watch(
  () => props.editor,
  (editor) => {
    window.mcEditor = editor;
  },
  { immediate: true },
);

async function restoreSession(): Promise<void> {
  const token = readStoredToken();
  if (!token) return;
  api.setToken(token);
  try {
    await activateSession();
  } catch {
    clearSession();
  }
}

async function login(): Promise<void> {
  clearMessages();
  if (!account.value.trim() || !password.value) {
    setError('请输入账号和密码');
    return;
  }
  await withBusy('正在验证账号…', async () => {
    const token = await api.login(account.value.trim(), password.value);
    sessionStorage.setItem('cloud-cad-plugin.token', token);
    password.value = '';
    await activateSession();
  });
}

async function activateSession(): Promise<void> {
  const current = await api.getCurrentUser();
  const baseInfo = current.baseinfo;
  userLabel.value =
    baseInfo?.F_RealName || baseInfo?.F_Account || account.value || '已登录用户';
  authenticated.value = true;
  await loadWorkspaces();
}

async function loadWorkspaces(): Promise<void> {
  const result = await api.getWorkspaces();
  workspaces.value = result;
  const storedArea = localStorage.getItem('cloud-cad-plugin.last-area');
  const preferred =
    result.find((workspace) => workspace.ID === storedArea) ||
    result.find((workspace) => workspace.ID === selectedAreaId.value) ||
    result[0];
  if (preferred) {
    selectedAreaId.value = preferred.ID;
    localStorage.setItem('cloud-cad-plugin.last-area', preferred.ID);
    await loadDrawings();
  } else {
    selectedAreaId.value = '';
    drawings.value = [];
    setError('当前账号没有可用工作区');
  }
}

async function changeWorkspace(): Promise<void> {
  selectedDrawingId.value = '';
  localStorage.setItem('cloud-cad-plugin.last-area', selectedAreaId.value);
  await withBusy('正在读取工作区图纸…', loadDrawings);
}

async function loadDrawings(): Promise<void> {
  if (!selectedAreaId.value) {
    drawings.value = [];
    return;
  }
  drawings.value = await api.getDrawings(selectedAreaId.value);
  if (
    selectedDrawingId.value &&
    !drawings.value.some((drawing) => drawing.ID === selectedDrawingId.value)
  ) {
    selectedDrawingId.value = '';
  }
}

async function refreshDrawings(): Promise<void> {
  clearMessages();
  await withBusy('正在刷新图纸列表…', loadDrawings);
}

async function openDrawing(drawing: Drawing): Promise<void> {
  clearMessages();
  const workspace = selectedWorkspace.value;
  if (!workspace) {
    setError('请先选择工作区');
    return;
  }
  await withBusy(`正在打开「${drawing.MapName}」…`, async () => {
    const detail = await api.getDrawingDetail(drawing.ID);
    const version = detail.BaseMapVersionInfo;
    const filePath = version?.MasFileId || version?.DxfFileId;
    if (!filePath) throw new Error('该图纸没有可加载的版本文件');

    const core = await props.editor?.resolveActiveCoreReady();
    if (!core) throw new Error('云图 CAD 内核尚未就绪');

    const url = api.absoluteUrl(filePath);
    const extension = fileExtension(filePath);
    if (extension === 'mctf') {
      await core.getDatabase().readUrlMctfFile(url);
    } else {
      const buffer = await MCCORE.mcFileService.openCloudDrawingToMcdBuffer(url);
      if (typeof buffer === 'string') throw new Error(buffer);
      if (!(buffer instanceof ArrayBuffer)) {
        throw new Error('图纸转换服务未返回二进制数据');
      }
      await core.getDatabase().readMcdFile(buffer);
    }

    currentDrawing.value = detail;
    selectedDrawingId.value = detail.ID;
    versionDesc.value = '';
    refreshThumbnail.value = false;
    bindBusinessContext(workspace, detail);
    setNotice(`已打开「${detail.MapName}」`);
  });
}

async function chooseFile(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  clearMessages();
  if (!file) {
    uploadFile.value = undefined;
    uploadName.value = '';
    return;
  }
  const extension = fileExtension(file.name);
  if (!['dwg', 'dxf', 'mcd', 'mctf'].includes(extension)) {
    input.value = '';
    uploadFile.value = undefined;
    setError('仅支持 DWG、DXF、MCD、MCTF 文件');
    return;
  }
  if (file.size > 120 * 1024 * 1024) {
    input.value = '';
    uploadFile.value = undefined;
    setError('文件超过 120 MB，浏览器上传可能不稳定');
    return;
  }
  uploadFile.value = file;
  uploadName.value = fileBaseName(file.name).slice(0, 36);
}

async function uploadAndOpen(): Promise<void> {
  clearMessages();
  const file = uploadFile.value;
  const workspace = selectedWorkspace.value;
  if (!file) {
    setError('请选择要上传的图纸文件');
    return;
  }
  if (!workspace) {
    setError('请选择工作区后再上传');
    return;
  }
  if (!uploadName.value.trim()) {
    setError('请填写图纸名称');
    return;
  }

  await withBusy('正在上传图纸文件…', async () => {
    const fileBase64 = await blobToBase64(file);
    const extension = fileExtension(file.name);
    const uploaded = await api.uploadFileBase64(
      workspace.AreaCode,
      fileBase64,
      extension,
      1,
    );

    busyText.value = '正在生成图纸缩略图…';
    let thumbnailPath: string | null = null;
    if (extension !== 'mctf') {
      thumbnailPath = await tryUploadThumbnail(file, workspace.AreaCode);
    }

    busyText.value = '正在写入图纸主表…';
    const versionInfo = {
      DxfFileId: uploaded.path,
      MasFileId: uploaded.path,
      LayerStyle: null,
      VersionDesc: versionDesc.value.trim(),
    };
    const drawingId = await api.saveDrawing({
      MapName: uploadName.value.trim(),
      AreaID: workspace.ID,
      ThumbnailField: thumbnailPath,
      versionInfo: JSON.stringify(versionInfo),
    });
    if (!drawingId) throw new Error('图纸记录创建失败');

    await loadDrawings();
    const created = drawings.value.find((drawing) => drawing.ID === drawingId);
    if (created) {
      await openDrawing(created);
    } else {
      setNotice('图纸已上传，请刷新列表后打开');
    }
    uploadFile.value = undefined;
    uploadName.value = '';
    if (fileInput.value) fileInput.value.value = '';
  });
}

async function saveAsNewVersion(): Promise<void> {
  clearMessages();
  const workspace = selectedWorkspace.value;
  if (!workspace || !currentDrawing.value) {
    setError('请先从云端打开一张图纸');
    return;
  }
  const core = await props.editor?.resolveActiveCoreReady();
  if (!core) {
    setError('云图 CAD 内核尚未就绪');
    return;
  }

  await withBusy('正在生成 MCD 快照…', async () => {
    const drawing = await api.getDrawingDetail(currentDrawing.value!.ID);
    const database = core.getDatabase();
    const buffer = database.saveAsMcd();
    const snapshot = new Blob([buffer], { type: 'application/octet-stream' });
    const fileBase64 = await blobToBase64(snapshot);

    let thumbnailPath = drawing.ThumbnailField || null;
    if (!thumbnailPath || refreshThumbnail.value) {
      busyText.value = '正在刷新缩略图…';
      try {
        const thumbnail = await createThumbnailFromCore(core, drawing.MapName);
        if (thumbnail) {
          const thumbnailUpload = await api.uploadFileBase64(
            workspace.AreaCode,
            await blobToBase64(thumbnail),
            'jpg',
            0,
          );
          thumbnailPath = thumbnailUpload.path;
        }
      } catch {
        setError('缩略图刷新失败，将继续保存图纸版本');
      }
    }

    busyText.value = '正在上传 MCD 快照…';
    const uploaded = await api.uploadFileBase64(
      workspace.AreaCode,
      fileBase64,
      'mcd',
      1,
    );

    busyText.value = '正在登记新版本…';
    const historyId = await api.saveMapVersion({
      ParentID: drawing.ID,
      DxfFileId: uploaded.path,
      MasFileId: uploaded.path,
      LayerStyle: null,
      VersionDesc: versionDesc.value.trim(),
    });
    if (!historyId) throw new Error('版本记录创建失败');

    busyText.value = '正在更新图纸主表…';
    await api.saveDrawing(
      buildDrawingSavePayload(drawing, historyId, thumbnailPath),
    );
    const refreshed = await api.getDrawingDetail(drawing.ID);
    currentDrawing.value = refreshed;
    bindBusinessContext(workspace, refreshed);
    versionDesc.value = '';
    refreshThumbnail.value = false;
    await loadDrawings();
    setNotice(`「${refreshed.MapName}」已保存为新版本`);
  });
}

async function tryUploadThumbnail(file: File, areaCode: string): Promise<string | null> {
  try {
    const thumbnail = await api.exportThumbnail(file);
    if (!thumbnail.size) return null;
    const uploaded = await api.uploadFileBase64(
      areaCode,
      await blobToBase64(thumbnail),
      'jpg',
      0,
    );
    return uploaded.path;
  } catch {
    return null;
  }
}

async function createThumbnailFromCore(
  core: Awaited<ReturnType<McEditor['resolveActiveCoreReady']>>,
  mapName: string,
): Promise<Blob | null> {
  if (!core) return null;
  const buffer = core.getDatabase().saveAsMcd();
  const file = new File([buffer], `${mapName || 'drawing'}.mcd`, {
    type: 'application/octet-stream',
  });
  return MCCORE.mcFileService.exportDrawingFileToOtherBlob(
    file,
    MCCORE.CoreExportFileType.JPEG,
    { w: 1280, h: 720 },
  );
}

function buildDrawingSavePayload(
  drawing: Drawing,
  historyId: string,
  thumbnailPath: string | null,
): Record<string, unknown> {
  return {
    keyValue: drawing.ID,
    ID: drawing.ID,
    MapName: drawing.MapName,
    AreaID: drawing.AreaID,
    CurMapVersionId: historyId,
    MapOptions: scalarValue(drawing.MapOptions),
    ThumbnailField: thumbnailPath,
    Field1: drawing.Field1,
    Field2: drawing.Field2,
    Field3: drawing.Field3,
    Field4: drawing.Field4,
    CreateUserId: drawing.CreateUserId,
    CreateUserId_Text: drawing.CreateUserId_Text,
    CreateCompanyId: drawing.CreateCompanyId,
    CreateDepartmentId: drawing.CreateDepartmentId,
    CreateDataTime: drawing.CreateDataTime,
  };
}

function scalarValue(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function bindBusinessContext(workspace: Workspace, drawing: Drawing): void {
  window.currentWorkingAreaInfo = {
    AreaCode: workspace.AreaCode,
    AreaName: drawing.MapName,
    workAreaID: workspace.ID,
    drawingId: drawing.ID,
  };
  document.title = `${drawing.MapName} · 云图 CAD 云桥`;
}

async function logout(): Promise<void> {
  clearSession();
  setNotice('已退出云图 CAD 账号');
}

function clearSession(): void {
  api.setToken('');
  sessionStorage.removeItem('cloud-cad-plugin.token');
  authenticated.value = false;
  userLabel.value = '';
  workspaces.value = [];
  drawings.value = [];
  selectedAreaId.value = '';
  selectedDrawingId.value = '';
  currentDrawing.value = undefined;
  window.currentWorkingAreaInfo = undefined;
}

function readStoredToken(): string {
  const pluginToken = sessionStorage.getItem('cloud-cad-plugin.token');
  if (pluginToken) return pluginToken;
  if (!runtime.reuseSystemToken) return '';
  try {
    return localStorage.getItem('TOKEN') || '';
  } catch {
    return '';
  }
}

async function withBusy(label: string, action: () => Promise<void>): Promise<void> {
  if (busy.value) return;
  clearMessages();
  busy.value = true;
  busyText.value = label;
  try {
    await action();
  } catch (error) {
    setError(error instanceof Error ? error.message : '操作失败');
  } finally {
    busy.value = false;
    busyText.value = '';
  }
}

function clearMessages(): void {
  errorMessage.value = '';
  noticeMessage.value = '';
}

function setError(message: string): void {
  errorMessage.value = message;
  noticeMessage.value = '';
}

function setNotice(message: string): void {
  noticeMessage.value = message;
  if (!errorMessage.value.includes('缩略图')) errorMessage.value = '';
}
</script>

<template>
  <aside class="bridge-panel" :class="{ 'is-hidden': !visible }" aria-label="云图 CAD 接入面板">
    <header class="panel-header">
      <div>
        <span class="eyebrow">CLOUD BRIDGE / 01</span>
        <h1>云端图纸接入</h1>
      </div>
      <button class="icon-button" type="button" title="收起面板" @click="emit('close')">
        ×
      </button>
    </header>

    <div class="panel-body">
      <section v-if="!authenticated" class="auth-card">
        <div class="auth-heading">
          <span class="auth-index">AUTH</span>
          <div>
            <h2>连接业务系统</h2>
            <p>账号仅用于当前会话获取 token，不会写入源码或配置文件。</p>
          </div>
        </div>
        <label class="field">
          <span>账号</span>
          <input v-model="account" autocomplete="username" placeholder="请输入业务系统账号" />
        </label>
        <label class="field">
          <span>密码</span>
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="请输入密码"
            @keyup.enter="login"
          />
        </label>
        <button class="primary-button full-width" type="button" :disabled="busy" @click="login">
          {{ busy ? busyText : '登录并连接' }}
        </button>
        <p class="security-note">
          密码经 MD5 后发送至
          <code>{{ runtime.apiBase }}/User/Login</code>
        </p>
      </section>

      <template v-else>
        <section class="identity-row">
          <div>
            <span class="status-label">已连接</span>
            <strong>{{ userLabel }}</strong>
          </div>
          <button class="text-button" type="button" @click="logout">退出</button>
        </section>

        <section class="panel-section">
          <div class="section-heading">
            <div>
              <span class="section-index">01</span>
              <h2>工作区</h2>
            </div>
            <button
              class="text-button"
              type="button"
              :disabled="busy"
              @click="withBusy('正在重载工作区…', loadWorkspaces)"
            >
              重载
            </button>
          </div>
          <select
            v-model="selectedAreaId"
            class="select-control"
            :disabled="busy || workspaces.length === 0"
            @change="changeWorkspace"
          >
            <option value="" disabled>请选择工作区</option>
            <option v-for="workspace in workspaces" :key="workspace.ID" :value="workspace.ID">
              {{ workspace.AreaName }} · {{ workspace.AreaCode }}
            </option>
          </select>
        </section>

        <section class="panel-section drawing-section">
          <div class="section-heading">
            <div>
              <span class="section-index">02</span>
              <h2>云端图纸 <em>{{ drawings.length }}</em></h2>
            </div>
            <button class="text-button" type="button" :disabled="busy" @click="refreshDrawings">
              刷新
            </button>
          </div>
          <div class="search-row">
            <input v-model="drawingFilter" class="search-input" placeholder="按图纸名称筛选" />
          </div>
          <div v-if="filteredDrawings.length" class="drawing-list">
            <button
              v-for="drawing in filteredDrawings"
              :key="drawing.ID"
              type="button"
              class="drawing-item"
              :class="{ active: drawing.ID === selectedDrawingId }"
              @click="openDrawing(drawing)"
            >
              <span class="drawing-thumb">
                <img
                  v-if="drawing.ThumbnailField"
                  :src="api.absoluteUrl(drawing.ThumbnailField)"
                  alt=""
                  loading="lazy"
                />
                <span v-else>CAD</span>
              </span>
              <span class="drawing-copy">
                <strong>{{ drawing.MapName }}</strong>
                <small>{{ drawing.CurMapVersionId || '暂无版本' }}</small>
              </span>
              <span class="drawing-arrow">↗</span>
            </button>
          </div>
          <div v-else class="empty-state">
            {{ selectedAreaId ? '当前工作区没有匹配图纸' : '选择工作区后显示图纸' }}
          </div>
        </section>

        <section class="current-card">
          <div class="current-topline">
            <span class="status-label">当前图纸</span>
            <span class="file-badge">{{ fileExtension(currentFile) || 'NONE' }}</span>
          </div>
          <strong>{{ currentName }}</strong>
          <small v-if="currentDrawing">
            版本 {{ currentDrawing.CurMapVersionId || '未登记' }}
          </small>
          <small v-else>从上方列表打开，或上传一张新图纸</small>
          <div class="save-row">
            <input v-model="versionDesc" placeholder="版本说明（可选）" :disabled="!currentDrawing" />
            <label class="check-row">
              <input v-model="refreshThumbnail" type="checkbox" :disabled="!currentDrawing" />
              <span>刷新缩略图</span>
            </label>
            <button
              class="primary-button"
              type="button"
              :disabled="!editor || !currentDrawing || busy"
              @click="saveAsNewVersion"
            >
              保存新版本
            </button>
          </div>
        </section>

        <section class="panel-section upload-section">
          <div class="section-heading">
            <div>
              <span class="section-index">03</span>
              <h2>上传新图纸</h2>
            </div>
          </div>
          <input
            ref="fileInput"
            class="visually-hidden"
            type="file"
            accept=".dwg,.dxf,.mcd,.mctf"
            @change="chooseFile"
          />
          <button class="drop-zone" type="button" :disabled="busy" @click="fileInput?.click()">
            <span class="drop-plus">+</span>
            <strong>{{ uploadFile ? uploadFile.name : '选择本地图纸文件' }}</strong>
            <small>{{ uploadMeta }}</small>
          </button>
          <label v-if="uploadFile" class="field compact-field">
            <span>图纸名称</span>
            <input v-model="uploadName" maxlength="36" />
          </label>
          <button
            class="secondary-button full-width"
            type="button"
            :disabled="!uploadFile || busy || !selectedWorkspace"
            @click="uploadAndOpen"
          >
            上传并打开
          </button>
        </section>
      </template>

      <div v-if="errorMessage" class="message error-message">{{ errorMessage }}</div>
      <div v-if="noticeMessage" class="message notice-message">{{ noticeMessage }}</div>
      <div v-if="busy" class="busy-strip">
        <span />
        {{ busyText }}
      </div>
    </div>

    <footer class="panel-footer">
      <span>SDK CORE / McEditor</span>
      <span>v0.1.0</span>
    </footer>
  </aside>
</template>

<style scoped>
.bridge-panel {
  position: absolute;
  z-index: 25;
  top: 12px;
  right: 12px;
  bottom: 12px;
  display: flex;
  width: min(398px, calc(100vw - 24px));
  flex-direction: column;
  overflow: hidden;
  border: 1px solid rgba(20, 57, 66, 0.2);
  border-radius: 14px;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.99), rgba(247, 250, 251, 0.99)),
    #fff;
  box-shadow:
    0 22px 56px rgba(18, 48, 57, 0.22),
    0 3px 8px rgba(18, 48, 57, 0.08);
  transition:
    transform 220ms ease,
    opacity 180ms ease;
}

.bridge-panel.is-hidden {
  pointer-events: none;
  opacity: 0;
  transform: translateX(calc(100% + 24px));
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 18px 15px;
  color: #f4fafb;
  background:
    linear-gradient(135deg, rgba(24, 63, 75, 1), rgba(20, 47, 56, 1)),
    #173c47;
}

.eyebrow,
.section-index,
.auth-index {
  color: #d79a4d;
  font-family: Consolas, monospace;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.17em;
}

.panel-header h1 {
  margin: 5px 0 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.icon-button {
  width: 31px;
  height: 31px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: #e6f0f2;
  background: rgba(255, 255, 255, 0.06);
  font-size: 20px;
  line-height: 26px;
}

.icon-button:hover {
  border-color: rgba(215, 154, 77, 0.7);
  color: #fff;
}

.panel-body {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  padding: 15px;
}

.panel-body::-webkit-scrollbar {
  width: 5px;
}

.panel-body::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: rgba(50, 82, 91, 0.22);
}

.auth-card {
  padding: 18px;
  border: 1px solid #e1e9ec;
  border-radius: 10px;
  background: #fff;
}

.auth-heading {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.auth-heading h2,
.section-heading h2 {
  margin: 0;
  color: #21353c;
  font-size: 14px;
  font-weight: 650;
}

.auth-heading p {
  margin: 6px 0 0;
  color: #75858c;
  font-size: 11px;
  line-height: 1.7;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 13px;
  color: #52666e;
  font-size: 11px;
}

.field input,
.select-control,
.search-input,
.save-row > input {
  width: 100%;
  height: 38px;
  border: 1px solid #d7e1e5;
  border-radius: 7px;
  outline: none;
  color: #20343b;
  background: #fbfcfd;
  padding: 0 11px;
  transition:
    border-color 150ms,
    box-shadow 150ms;
}

.field input:focus,
.select-control:focus,
.search-input:focus,
.save-row > input:focus {
  border-color: #2b859d;
  box-shadow: 0 0 0 3px rgba(43, 133, 157, 0.1);
}

.primary-button,
.secondary-button {
  min-height: 36px;
  padding: 0 14px;
  border-radius: 7px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.primary-button {
  border: 1px solid #b7732e;
  color: #fff;
  background: linear-gradient(135deg, #d29343, #b8732d);
  box-shadow: 0 5px 13px rgba(183, 115, 46, 0.22);
}

.secondary-button {
  border: 1px solid #2e7283;
  color: #245c6b;
  background: #f6fbfc;
}

.primary-button:hover:not(:disabled),
.secondary-button:hover:not(:disabled) {
  filter: brightness(1.05);
  transform: translateY(-1px);
}

.primary-button:disabled,
.secondary-button:disabled {
  cursor: not-allowed;
  opacity: 0.46;
}

.full-width {
  width: 100%;
}

.security-note {
  margin: 12px 0 0;
  color: #8b999e;
  font-size: 10px;
  line-height: 1.6;
}

.security-note code {
  word-break: break-all;
}

.identity-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border: 1px solid #e2e9eb;
  border-radius: 9px;
  background: #f8fbfb;
}

.identity-row > div {
  display: flex;
  align-items: center;
  gap: 9px;
}

.identity-row strong {
  color: #33484f;
  font-size: 12px;
}

.status-label {
  color: #6a7f86;
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.08em;
}

.text-button {
  padding: 3px 5px;
  border: 0;
  color: #24738a;
  background: transparent;
  font-size: 11px;
}

.panel-section {
  margin-top: 15px;
  padding: 13px;
  border: 1px solid #e3eaec;
  border-radius: 9px;
  background: #fff;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.section-heading > div {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.section-heading h2 em {
  color: #9aabb0;
  font-size: 10px;
  font-style: normal;
}

.select-control {
  height: 36px;
  color: #31474f;
  font-size: 12px;
}

.drawing-section {
  padding-bottom: 9px;
}

.search-input {
  height: 33px;
  margin-bottom: 8px;
  font-size: 11px;
}

.drawing-list {
  display: flex;
  max-height: 245px;
  flex-direction: column;
  gap: 5px;
  overflow-y: auto;
}

.drawing-item {
  display: flex;
  width: 100%;
  min-height: 50px;
  align-items: center;
  gap: 9px;
  padding: 6px;
  border: 1px solid transparent;
  border-radius: 7px;
  color: #2a3f47;
  background: #f7f9fa;
  text-align: left;
}

.drawing-item:hover,
.drawing-item.active {
  border-color: #bddbe2;
  background: #eff8fa;
}

.drawing-thumb {
  display: grid;
  width: 58px;
  height: 38px;
  flex: 0 0 auto;
  place-items: center;
  overflow: hidden;
  border: 1px solid #d7e2e5;
  border-radius: 4px;
  color: #809399;
  background:
    linear-gradient(45deg, #e8eef0 25%, transparent 25%) 0 0 / 8px 8px,
    linear-gradient(-45deg, #e8eef0 25%, transparent 25%) 0 4px / 8px 8px,
    #f7fafb;
  font-family: Consolas, monospace;
  font-size: 9px;
}

.drawing-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.drawing-copy {
  display: flex;
  min-width: 0;
  flex: 1;
  flex-direction: column;
  gap: 4px;
}

.drawing-copy strong {
  overflow: hidden;
  font-size: 11px;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawing-copy small {
  overflow: hidden;
  color: #91a0a5;
  font-family: Consolas, monospace;
  font-size: 8px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drawing-arrow {
  color: #83a5ad;
  font-size: 13px;
}

.empty-state {
  padding: 20px 8px;
  border: 1px dashed #dce5e8;
  border-radius: 7px;
  color: #8b9a9f;
  font-size: 11px;
  text-align: center;
}

.current-card {
  margin-top: 15px;
  padding: 13px;
  border: 1px solid #c9dce1;
  border-radius: 9px;
  background:
    linear-gradient(135deg, rgba(239, 248, 250, 0.98), rgba(250, 252, 253, 0.98)),
    #f8fbfc;
}

.current-topline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 7px;
}

.file-badge {
  padding: 2px 5px;
  border-radius: 3px;
  color: #b4742f;
  background: #fff3e4;
  font-family: Consolas, monospace;
  font-size: 8px;
}

.current-card > strong {
  display: block;
  overflow: hidden;
  color: #1d3b44;
  font-size: 13px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.current-card > small {
  display: block;
  margin-top: 5px;
  color: #83949a;
  font-size: 10px;
}

.save-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 7px;
  margin-top: 11px;
}

.save-row > input {
  height: 34px;
  font-size: 11px;
}

.save-row .primary-button {
  grid-column: 2;
  grid-row: 1 / span 2;
}

.check-row {
  display: flex;
  grid-column: 1;
  align-items: center;
  gap: 5px;
  color: #73868c;
  font-size: 10px;
}

.upload-section {
  margin-bottom: 4px;
}

.drop-zone {
  display: flex;
  width: 100%;
  min-height: 72px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border: 1px dashed #b7cbd1;
  border-radius: 8px;
  color: #48636c;
  background: #f8fbfc;
}

.drop-zone:hover:not(:disabled) {
  border-color: #2e8298;
  background: #f0f9fb;
}

.drop-plus {
  color: #c18037;
  font-size: 20px;
  line-height: 18px;
}

.drop-zone strong {
  max-width: 310px;
  overflow: hidden;
  font-size: 11px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.drop-zone small {
  color: #93a2a7;
  font-size: 9px;
}

.compact-field {
  margin: 9px 0;
}

.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
}

.message {
  margin-top: 10px;
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 10px;
  line-height: 1.55;
}

.error-message {
  border: 1px solid #f0cfc8;
  color: #94493a;
  background: #fff5f3;
}

.notice-message {
  border: 1px solid #c7e2d7;
  color: #2a6b54;
  background: #f3fbf7;
}

.busy-strip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 10px;
  color: #496a73;
  font-size: 10px;
}

.busy-strip span {
  width: 12px;
  height: 12px;
  border: 2px solid rgba(40, 111, 128, 0.18);
  border-top-color: #287889;
  border-radius: 50%;
  animation: spin-panel 0.75s linear infinite;
}

.panel-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 7px 16px;
  border-top: 1px solid #e6ecee;
  color: #91a0a5;
  background: #fafcfc;
  font-family: Consolas, monospace;
  font-size: 8px;
  letter-spacing: 0.08em;
}

@keyframes spin-panel {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 620px) {
  .bridge-panel {
    top: 8px;
    right: 8px;
    bottom: 8px;
    width: calc(100vw - 16px);
  }
}
</style>
