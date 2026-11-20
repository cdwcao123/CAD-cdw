/**
 * 云图 CAD 只读连通性检查。
 * 不创建、修改或删除云端数据；仅验证登录、工作区列表和图纸列表。
 */
import { createHash } from 'node:crypto';

const apiBase = (
  process.env.CLOUDCAD_API_BASE || 'http://192.168.100.54:61012'
).replace(/\/$/, '');
const account = process.env.CLOUDCAD_ACCOUNT;
const password = process.env.CLOUDCAD_PASSWORD;

if (!account || !password) {
  console.error(
    '请设置 CLOUDCAD_ACCOUNT 和 CLOUDCAD_PASSWORD，可选 CLOUDCAD_API_BASE。',
  );
  process.exitCode = 2;
} else {
  await run();
}

async function run() {
  const body = new URLSearchParams({
    username: account,
    password: createHash('md5').update(password, 'utf8').digest('hex'),
    checkCode: '',
    verificationCode: '',
  });
  const login = await request('/User/Login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body,
  });
  const token = login.data;
  if (!token) throw new Error(login.info || '登录未返回 token');

  const areas = await request('/XAYL_WebCad/GisWebcadArea/GetList', {
    headers: { token },
  });
  const workspaceList = Array.isArray(areas.data) ? areas.data : [];
  let drawingCount = 0;
  for (const workspace of workspaceList) {
    const query = encodeURIComponent(
      JSON.stringify({ MapName: '', AreaID: workspace.ID }),
    );
    const drawings = await request(
      `/XAYL_WebCad/GisWebcadMapMain/GetList?queryJson=${query}`,
      { headers: { token } },
    );
    if (Array.isArray(drawings.data)) drawingCount += drawings.data.length;
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        mode: 'readonly',
        apiBase,
        workspaceCount: workspaceList.length,
        drawingCount,
      },
      null,
      2,
    ),
  );
}

async function request(path, init) {
  const response = await fetch(`${apiBase}${path}`, init);
  const payload = await response.json();
  if (!response.ok || payload.code !== 200) {
    throw new Error(payload.info || payload.message || `HTTP ${response.status}`);
  }
  return payload;
}
