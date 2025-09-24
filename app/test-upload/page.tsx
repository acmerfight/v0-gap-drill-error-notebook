'use client';

import { ImageUpload } from '@/components/ImageUpload';

export default function TestUploadPage() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-6">Vercel Blob 上传测试</h1>

      <div className="max-w-md">
        <ImageUpload
          onUpload={() => {
            // Upload completed successfully
          }}
        />
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">测试说明</h2>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 支持格式：JPEG、PNG、WebP、HEIC、HEIF</li>
          <li>• 最大文件大小：10MB</li>
          <li>• 需要登录才能上传</li>
          <li>• 上传成功后会显示图片和URL</li>
        </ul>
      </div>
    </div>
  );
}
