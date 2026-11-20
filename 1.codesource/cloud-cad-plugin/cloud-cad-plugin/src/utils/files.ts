/**
 * 将二进制文件转换为系统上传接口要求的裸 Base64 字符串。
 */
export async function blobToBase64(blob: Blob): Promise<string> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result ?? ''));
    reader.onerror = () => reject(reader.error ?? new Error('文件读取失败'));
    reader.readAsDataURL(blob);
  });
  return dataUrl.slice(dataUrl.indexOf(',') + 1);
}

export function fileExtension(fileName: string): string {
  const index = fileName.lastIndexOf('.');
  return index >= 0 ? fileName.slice(index + 1).toLowerCase() : '';
}

export function fileBaseName(fileName: string): string {
  const index = fileName.lastIndexOf('.');
  return (index > 0 ? fileName.slice(0, index) : fileName).trim();
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

