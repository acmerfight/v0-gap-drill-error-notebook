'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Upload {
  user_uploads: {
    id: string;
    userId: string;
    imageUrl: string;
    createdAt: string;
    updatedAt: string;
  };
  ai_processing_results?: {
    id: string;
    aiQuestion: string;
    aiSolution: string;
    createdAt: string;
    updatedAt: string;
  } | null;
}

export default function DemoPage() {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    userId: '',
    imageUrl: '',
    aiQuestion: '',
    aiSolution: '',
  });

  const fetchUploads = async () => {
    try {
      const response = await fetch('/api/uploads');
      const data: unknown = await response.json();
      setUploads(data as Upload[]);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching uploads:', error);
    }
  };

  const createUpload = async () => {
    if (!formData.userId || !formData.imageUrl) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/uploads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: formData.userId,
          imageUrl: formData.imageUrl,
        }),
      });

      if (response.ok) {
        void fetchUploads();
        setFormData({ ...formData, userId: '', imageUrl: '' });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating upload:', error);
    }
    setLoading(false);
  };

  const createAiResult = async (uploadId: string) => {
    if (!formData.aiQuestion || !formData.aiSolution) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/ai-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: uploadId,
          aiQuestion: formData.aiQuestion,
          aiSolution: formData.aiSolution,
        }),
      });

      if (response.ok) {
        void fetchUploads();
        setFormData({ ...formData, aiQuestion: '', aiSolution: '' });
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error creating AI result:', error);
    }
    setLoading(false);
  };

  const deleteUpload = async (id: string) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/uploads/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        void fetchUploads();
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error deleting upload:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    void fetchUploads();
  }, []);

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Drizzle + Neon CRUD Demo</h1>

      {/* Create Upload Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>创建新上传</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="User ID"
            value={formData.userId}
            onChange={(e) =>
              setFormData({ ...formData, userId: e.target.value })
            }
          />
          <Input
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
          />
          <Button onClick={() => void createUpload()} disabled={loading}>
            {loading ? '创建中...' : '创建上传'}
          </Button>
        </CardContent>
      </Card>

      {/* AI Result Form */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>为现有上传添加AI结果</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="AI Question"
            value={formData.aiQuestion}
            onChange={(e) =>
              setFormData({ ...formData, aiQuestion: e.target.value })
            }
          />
          <Textarea
            placeholder="AI Solution"
            value={formData.aiSolution}
            onChange={(e) =>
              setFormData({ ...formData, aiSolution: e.target.value })
            }
          />
        </CardContent>
      </Card>

      {/* Uploads List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">上传列表</h2>
        {uploads.map((upload) => (
          <Card key={upload.user_uploads.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p>
                    <strong>ID:</strong> {upload.user_uploads.id}
                  </p>
                  <p>
                    <strong>User ID:</strong> {upload.user_uploads.userId}
                  </p>
                  <p>
                    <strong>Image URL:</strong> {upload.user_uploads.imageUrl}
                  </p>
                  <p>
                    <strong>创建时间:</strong>{' '}
                    {new Date(upload.user_uploads.createdAt).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  onClick={() => void deleteUpload(upload.user_uploads.id)}
                  disabled={loading}
                >
                  删除
                </Button>
              </div>

              {upload.ai_processing_results ? (
                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                  <h4 className="font-semibold mb-2">AI 处理结果:</h4>
                  <p>
                    <strong>问题:</strong>{' '}
                    {upload.ai_processing_results.aiQuestion}
                  </p>
                  <p>
                    <strong>解决方案:</strong>{' '}
                    {upload.ai_processing_results.aiSolution}
                  </p>
                  <p>
                    <strong>创建时间:</strong>{' '}
                    {new Date(
                      upload.ai_processing_results.createdAt
                    ).toLocaleString()}
                  </p>
                </div>
              ) : (
                <div className="mt-4">
                  <Button
                    onClick={() => void createAiResult(upload.user_uploads.id)}
                    disabled={
                      loading || !formData.aiQuestion || !formData.aiSolution
                    }
                  >
                    添加 AI 结果
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {uploads.length === 0 && (
        <p className="text-center text-gray-500 py-8">
          暂无数据，请先创建一个上传记录。
        </p>
      )}
    </div>
  );
}
