/**
 * 验证缩略图转换服务可读取云端 MCD 并返回 JPEG。
 * 仅执行只读查询和一次性内存转换，不创建云端记录。
 */
import { createHash } from 'node:crypto';

const apiBase = (
  process.env.CLOUDCAD_API_BASE || 'http://192.168.100.54:61012'
).replace(/\/$/, '');
const account = process.env.CLOUDCAD_ACCOUNT;
const password = process.env.CLOUDCAD_PASSWORD;

if (!account || !password) {
  console.error('请设置 CLOUDCAD_ACCOUNT 和 CLOUDCAD_PASSWORD。');
  process.exitCode = 2;
} else {
  await run();
}

async function run() {
  const token = await login();
  const sample = await findSample(token);
  if (!sample) throw new Error('账号下没有可读取的 MCD 图纸');

  const source = await fetch(`${apiBase}${sample.filePath}`);
  if (!source.ok) throw new Error(`读取 MCD 失败：HTTP ${source.status}`);
  const blob = await source.blob();
  const form = new FormData();
  form.append('in_file', blob, `${sample.mapName}.mcd`);
  const response = await fetch(
    `${apiBase}/CloudCad/file/export?outformat=2&pwidth=320&pheight=200`,
    {
      method: 'POST',
      headers: { token, Authorization: `Bearer ${token}` },
      body: form,
    },
  );
  const output = await response.blob();
  if (!response.ok || !output.size) {
    throw new Error(`缩略图转换失败：HTTP ${response.status}`);
  }
  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: 'readonly',
        mapName: sample.mapName,
        sourceBytes: blob.size,
        thumbnailBytes: output.size,
        thumbnailType: output.type || response.headers.get('content-type'),
      },
      null,
      2,
    ),
  );
}

async function login() {
  const body = new URLSearchParams({
    username: account,
    password: createHash('md5').update(password, 'utf8').digest('hex'),
    checkCode: '',
    verificationCode: '',
  });
  const response = await request('/User/Login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  if (!response.data) throw new Error('登录未返回 token');
  return response.data;
}

async function findSample(token) {
  const areas = await request('/XAYL_WebCad/GisWebcadArea/GetList', {
    headers: { token },
  });
  for (const area of areas.data || []) {
    const query = encodeURIComponent(
      JSON.stringify({ MapName: '', AreaID: area.ID }),
    );
    const drawings = await request(
      `/XAYL_WebCad/GisWebcadMapMain/GetList?queryJson=${query}`,
      { headers: { token } },
    );
    for (const drawing of drawings.data || []) {
      const detail = await request(
        `/XAYL_WebCad/GisWebcadMapMain/GetForm?keyValue=${encodeURIComponent(drawing.ID)}`,
        { headers: { token } },
      );
      const map = detail.data?.gis_webcad_map_main;
      const filePath =
        map?.BaseMapVersionInfo?.MasFileId ||
        map?.BaseMapVersionInfo?.DxfFileId;
      if (filePath?.toLowerCase().endsWith('.mcd')) {
        return { mapName: map.MapName, filePath };
      }
    }
  }
  return null;
}

async function request(path, init) {
  const response = await fetch(`${apiBase}${path}`, init);
  const payload = await response.json();
  if (!response.ok || payload.code !== 200) {
    throw new Error(payload.info || payload.message || `HTTP ${response.status}`);
  }
  return payload;
}
