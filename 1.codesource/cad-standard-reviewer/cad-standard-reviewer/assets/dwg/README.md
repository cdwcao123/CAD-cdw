# DWG → DXF 转换资产

本目录用于在插件前端（Electron Chromium / Web Worker）把 DWG 转为 DXF，再交给本地规则引擎审查。
转换在浏览器本机完成，不上传云端。

## 资产来源

- `dwg-worker.js`、`libredwg-web.js`、`libredwg-web.wasm`
  - 来源：`E:\kuangshan\skills\file-viewer\apps\viewer-demo\public\wasm\cad`（File Viewer 3.3.3 内置 CAD 运行时）
  - 底层：LibreDWG 0.13.3 / `@mlightcad/libredwg-web` 0.7.9
- `LICENSE`：File Viewer 集成层的 AGPL-3.0 许可
- `GPL-3.0.txt`：LibreDWG / libredwg-web 的 GPL-3.0 许可
- `NOTICE`、`CORRESPONDING_SOURCE_NOTICE.txt`、`CORRESPONDING_SOURCE.zip`：对应源码与署名要求

**许可提示**：DWG 转换资产为 GPL-3.0 / AGPL-3.0。插件自身代码与这些资产一起分发时，请按相应许可证履行源码提供与署名义务；如对外商业分发，建议先由法务确认，或替换为已购买授权的商业 DWG 转换器。停用方式：删除本目录并在 `index.js` 中把 `dwg-worker.js` 路径改为不可用，或仅保留 DXF 流程。

## 对 `dwg-worker.js` 的修改

原文件是 File Viewer 的 DWG 解析 Worker，只暴露解析/几何消息，没有暴露 DXF 导出。
本插件在 `onmessage` 入口增加了一个 `cad-to-dxf` 分支，调用 Worker 内部已有的
`LibreDwg.dwg_write_dxf()`（底层 `dwg_write_dxf`），把 DWG 字节转换为 DXF 字节并回传。

插入位置（原文）：

```js
Et.onmessage=async t=>{const n=t.data;if(!n)return;
```

插入内容：

```js
if(n.type==="cad-to-dxf"){
  try{
    const inst=await De(n.wasmPath||"/wasm/");
    const out=await inst.instance.dwg_write_dxf(n.bytes);
    if(!out||!out.length) throw new Error("LibreDWG returned empty DXF");
    Et.postMessage({type:"cad-to-dxf-result",requestId:n.requestId,dxf:out,bytes:out.length},[out.buffer]);
  }catch(err){
    Et.postMessage({type:"cad-to-dxf-error",requestId:n.requestId,message:String(err&&err.message||err)});
  }
  return;
}
```

除该分支外，Worker 的解析、几何与消息协议未改动。

## 前端调用

```js
const worker = new Worker(new URL('./assets/dwg/dwg-worker.js', import.meta.url))
worker.postMessage({
  type: 'cad-to-dxf',
  bytes: dwgBytes,
  wasmPath: new URL('./assets/dwg/', import.meta.url).href,
})
// 收到 { type: 'cad-to-dxf-result', dxf: Uint8Array }
```

## 已知限制

- DWG 版本支持取决于 LibreDWG 0.13.3；过新/加密/损坏的 DWG 可能转换失败。
- 转换后的 DXF 可能比原 DWG 大（含完整表段与代理对象），受插件 64 MB 审查上限约束。
- 首次转换需加载约 10 MB WASM，通常 1–3 秒。
