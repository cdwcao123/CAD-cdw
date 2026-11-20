# 图像读取安全

采集任务默认不使用 `read` 或图片附件工具读取 PNG/JPG。CAD 生成后优先核验 DXF 实体、块定义、视口、范围、图层和 JSON 数据；需要视觉预览时，把 DXF 文件路径交给用户，在其目标查看器中打开。

宿主会把 `read` 返回的图片编码成 base64 附件，并放进单个 `message.part.updated` SSE 事件。宿主当前单事件上限为 256 KiB。实测一个 63,045 字节、`2400×2797` 的线稿 PNG，经宿主自动缩放到 `1716×2000` 后重新编码，形成 438,545 字节事件并导致 Gateway 退出。因此只检查源文件字节数不足以保证安全，还必须限制像素尺寸并避免宿主重采样。

只有用户明确要求展示预览，或明确要求识别其上传的局部复杂情况图片时才查看图片。用户上传的局部图是图像识别证据，不代表可以读取其他 CAD 预览、整页截图或浏览器截图。生成后必须先用 Windows 辅助脚本转换为硬限制 JPEG：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File <技能目录>\scripts\make-safe-preview.ps1 `
  -InputPath <完整图.png> -OutputPath <新预览.jpg>
```

脚本强制把图像限制在 `960×720` 内、JPEG 不超过 80,000 字节，并输出 `estimated_event_bytes`。仅当 `safe_to_read=true` 时才可读取该 JPEG。需要细节时先裁剪并重复此流程；不得读取原图、`full.png` 或直接渲染的 PNG。

局部裁剪使用同一脚本：

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File <技能目录>\scripts\make-safe-preview.ps1 `
  -InputPath <用户原图.png> -OutputPath <局部预览.jpg> `
  -CropX 120 -CropY 80 -CropWidth 640 -CropHeight 480
```

脚本返回原图 `source_sha256` 和 `source_region`，局部复杂情况规则必须据此追溯来源。

如果辅助脚本失败，停止图像查看并报告当前能从 DXF/JSON 确定的结论。不要为了“看一眼”绕过脚本；一旦单个事件超过 256 KiB，Gateway 会把运行标记为 `outcome_unknown`，之后的结果可能无法输出。
