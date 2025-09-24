'use client';

import { upload } from '@vercel/blob/client';
import { useState } from 'react';

interface ImageUploadProps {
  onUpload?: (_url: string) => void;
}

export function ImageUpload({ onUpload }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    setError('');

    try {
      // 客户端预检查
      if (file.size === 0) {
        throw new Error('文件为空，请选择有效的图片文件');
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error('文件大小超过 10MB，请选择更小的图片');
      }

      const allowedTypes = [
        'image/jpeg',
        'image/jpg',
        'image/png',
        'image/webp',
        'image/heic',
        'image/heif',
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error('支持格式：JPEG、PNG、WebP、HEIC、HEIF');
      }

      const blob = await upload(file.name, file, {
        access: 'public',
        handleUploadUrl: '/api/upload',
      });

      setUploadedUrl(blob.url);
      onUpload?.(blob.url);
    } catch (error: unknown) {
      // 处理具体错误类型
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (
        errorMessage.includes('413') ||
        errorMessage.includes('PAYLOAD_TOO_LARGE')
      ) {
        setError('文件过大，请选择小于 10MB 的图片');
      } else if (errorMessage.includes('Unauthorized')) {
        setError('请先登录');
      } else {
        setError(errorMessage || '上传失败，请重试');
      }
      // Error logged internally
      // TODO: Add proper error reporting if needed
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          accept="image/*"
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              void handleUpload(file);
            }
          }}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50"
        />
        {isUploading && <p className="mt-2 text-sm text-blue-600">上传中...</p>}
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {uploadedUrl && (
        <div className="space-y-2">
          <p className="text-sm text-green-600">上传成功！</p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={uploadedUrl}
            alt="Uploaded"
            className="max-w-xs rounded-lg border"
          />
          <p className="text-xs text-gray-500 break-all">{uploadedUrl}</p>
        </div>
      )}
    </div>
  );
}
