'use client';

import { useState, useEffect, useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, FileText, Loader2, Copy, Chrome, ArrowLeft, Upload, Settings, CheckCircle2, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { countWords, calculateReadingTime } from '@/lib/utils';
import { FeishuImportDialog } from './feishu-import-dialog';

interface EditorProps {
  initialTitle?: string;
  initialContent?: string;
  onSave?: (title: string, content: string) => Promise<void>;
}

export function SimpleEditor({
  initialTitle = '',
  initialContent = '',
  onSave
}: EditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [content, setContent] = useState(initialContent);
  const [preview, setPreview] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<'default' | 'tech' | 'minimal'>('default');
  const [isConverting, setIsConverting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [isCopying, setIsCopying] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [showFeishuImport, setShowFeishuImport] = useState(false);
  const [isApplyingPreset, setIsApplyingPreset] = useState(false);
  const [presets, setPresets] = useState<Array<{ id: string; name: string; isDefault?: boolean; headerContent?: string; footerContent?: string; authorName?: string }>>([]);
  const [presetsLoaded, setPresetsLoaded] = useState(false);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('');
  const [toast, setToast] = useState<{ visible: boolean; message: string; type: 'success' | 'error' }>({ visible: false, message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ visible: true, message, type });
    window.setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2000);
  };

  // 当初始值改变时更新状态
  useEffect(() => {
    setTitle(initialTitle);
  }, [initialTitle]);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  // 计算统计信息
  const wordCount = countWords(content);
  const readingTime = calculateReadingTime(content);

  // 转换预览
  const handlePreview = useCallback(async () => {
    if (!content.trim()) {
      setPreview('');
      return;
    }

    setIsConverting(true);
    try {
      const response = await fetch('/api/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content,
          platform: 'wechat',
          style: selectedStyle,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setPreview(data.data.html);
      } else {
        console.error('转换失败:', data.error);
      }
    } catch (error) {
      console.error('转换错误:', error);
    } finally {
      setIsConverting(false);
    }
  }, [content, selectedStyle]);

  // 自动预览
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePreview();
    }, 500);

    return () => clearTimeout(timer);
  }, [handlePreview]);

  // 保存文章
  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请填写标题和内容');
      return;
    }

    setIsSaving(true);
    try {
      if (onSave) {
        await onSave(title, content);
        setLastSaved(new Date());
        showToast('保存成功', 'success');
      }
    } catch (error) {
      console.error('保存失败:', error);
      showToast('保存失败，请重试', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // 处理飞书导入
  const handleFeishuImport = (importedTitle: string, importedContent: string) => {
    if (importedTitle && !title.trim()) {
      setTitle(importedTitle);
    }
    if (importedContent) {
      setContent(importedContent);
    }
  };

  // 加载预设列表（只加载一次）
  const loadPresets = useCallback(async () => {
    if (presetsLoaded) return;
    try {
      const response = await fetch('/api/presets');
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        const list = data.data as Array<{ id: string; name: string; isDefault?: boolean; headerContent?: string; footerContent?: string; authorName?: string }>;
        const sorted = [...list].sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));
        setPresets(sorted);
        const def = sorted.find(p => p.isDefault) || sorted[0];
        if (def) setSelectedPresetId(def.id);
      }
    } catch (e) {
      console.error('加载预设失败:', e);
    } finally {
      setPresetsLoaded(true);
    }
  }, [presetsLoaded]);

  useEffect(() => {
    // 初始加载
    loadPresets();
  }, [loadPresets]);

  // 应用选中的预设（将开头/末尾定制内容包裹当前正文）
  const handleApplyPreset = async () => {
    try {
      setIsApplyingPreset(true);
      if (!presetsLoaded) await loadPresets();
      const preset = presets.find(p => p.id === selectedPresetId) || presets.find(p => p.isDefault) || presets[0];
      if (!preset) {
        alert('还没有可用的预设');
        return;
      }

      const headerMd: string = preset.headerContent || '';
      const footerMd: string = preset.footerContent || '';

      // 组装新的内容（保持Markdown，空行分隔）
      const parts: string[] = [];
      if (headerMd.trim()) parts.push(headerMd.trim());
      parts.push(content.trim());
      if (footerMd.trim()) parts.push(footerMd.trim());
      const merged = parts.filter(Boolean).join('\n\n');

      setContent(merged);
      alert('已应用预设的开头/末尾内容');
    } catch (error) {
      console.error('应用预设失败:', error);
      alert('应用预设失败，请稍后重试');
    } finally {
      setIsApplyingPreset(false);
    }
  };

  // 检查Chrome扩展是否已安装
  const checkExtensionInstalled = () => {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && typeof (window as any).chrome !== 'undefined' && (window as any).chrome.runtime) {
        (window as any).chrome.runtime.sendMessage('字流助手扩展ID', { action: 'ping' }, (response: any) => {
          resolve(!(window as any).chrome.runtime.lastError);
        });
      } else {
        resolve(false);
      }
    });
  };

  // 简化的复制功能（备用方案）
  const handleCopyContent = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请先填写标题和内容');
      return;
    }

    if (!preview) {
      alert('请先生成预览');
      return;
    }

    setIsCopying(true);
    try {
      // 获取带内联样式的HTML用于公众号编辑器
      let inlineHtml = preview;
      try {
        const response = await fetch('/api/convert-inline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            platform: 'wechat',
            style: selectedStyle,
          }),
        });

        const data = await response.json();
        if (data.success) {
          inlineHtml = data.data.inlineHtml;
        }
      } catch (error) {
        console.log('获取内联样式失败，使用预览HTML:', error);
      }

      // 简化的数据格式
      const contentData = {
        title: title.trim(),
        content: inlineHtml,
        timestamp: new Date().toISOString(),
      };

      // 复制到剪贴板（包含特殊标记供插件识别）
      const clipboardText = `<!-- ZILIU_CONTENT -->${JSON.stringify(contentData)}<!-- /ZILIU_CONTENT -->`;
      await navigator.clipboard.writeText(clipboardText);

      alert('内容已复制到剪贴板！\n\n请在公众号编辑页面使用字流助手插件填充内容。');
    } catch (error) {
      console.error('复制失败:', error);
      alert('复制失败，请重试');
    } finally {
      setIsCopying(false);
    }
  };

  // 复制到公众号
  const handleCopyToWechat = async () => {
    if (!title.trim() || !content.trim()) {
      alert('请先填写标题和内容');
      return;
    }

    if (!preview) {
      alert('请先生成预览');
      return;
    }

    setIsCopying(true);
    try {
      // 获取带内联样式的HTML用于公众号编辑器
      let inlineHtml = preview;
      try {
        const response = await fetch('/api/convert-inline', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content,
            platform: 'wechat',
            style: selectedStyle,
          }),
        });

        const data = await response.json();
        if (data.success) {
          inlineHtml = data.data.inlineHtml;
        }
      } catch (error) {
        console.log('获取内联样式失败，使用预览HTML:', error);
      }

      // 预处理HTML，优化为更简洁的格式，避免被微信编辑器过度处理
      function preprocessContentForWechat(html: string): string {
        let processedHtml = html;

        // 1. 清理多余的空格和换行，但保持基本结构
        processedHtml = processedHtml
          .replace(/\s{3,}/g, ' ')
          .replace(/>\s+</g, '><')
          .replace(/(<\/p>)\s*(<p[^>]*>)/g, '$1$2')
          .replace(/(<\/h[1-6]>)\s*(<[^>]+>)/g, '$1$2');

        // 2. 特殊处理代码块 - 使用微信编辑器友好的预分行格式
        processedHtml = processedHtml.replace(
          /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/g,
          (match: string, codeContent: string) => {
            // 清理代码内容
            const cleanCode = codeContent
              .replace(/^\s+|\s+$/g, '') // 去除首尾空白
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&amp;/g, '&');

            // 按行分割代码，每行用单独的div包装
            const lines = cleanCode.split('\n').filter(line => line.trim() !== '');
            const codeLines = lines.map(line =>
              `<div style="margin: 0; padding: 0; line-height: 1.5;">${line.replace(/  /g, '&nbsp;&nbsp;')}</div>`
            ).join('');

            // 使用div包装整个代码块，确保微信编辑器正确处理
            return `<div style="background-color: #f6f8fa; border: 1px solid #e1e4e8; border-radius: 6px; padding: 16px; margin: 16px 0; font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace; font-size: 14px; overflow-x: auto;">${codeLines}</div>`;
          }
        );

        // 3. 简化其他HTML结构
        processedHtml = processedHtml
          // 移除可能导致微信编辑器过度处理的class和id属性
          .replace(/\sclass="[^"]*"/g, '')
          .replace(/\sid="[^"]*"/g, '')
          // 将section标签替换为div标签
          .replace(/<section[^>]*>/g, '<div>')
          .replace(/<\/section>/g, '</div>')
          // 简化列表结构
          .replace(/<li>\s*<p>(.*?)<\/p>\s*<\/li>/g, '<li>$1</li>');

        return processedHtml;
      }

      // 应用格式优化
      const optimizedHtml = preprocessContentForWechat(inlineHtml);

      // 创建一个临时的DOM元素来渲染HTML
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = optimizedHtml;
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '-9999px';
      document.body.appendChild(tempDiv);

      try {
        // 创建富文本复制数据
        const clipboardData = new ClipboardItem({
          'text/html': new Blob([optimizedHtml], { type: 'text/html' }),
          'text/plain': new Blob([tempDiv.textContent || tempDiv.innerText || ''], { type: 'text/plain' })
        });

        // 复制富文本到剪贴板
        await navigator.clipboard.write([clipboardData]);

        alert('✅ 内容已复制到剪贴板！\n\n请打开微信公众号编辑器，直接粘贴即可保持格式。\n\n💡 提示：粘贴时会保持所有格式，包括标题、代码块、列表等。');
      } catch (error) {
        console.error('富文本复制失败，尝试纯文本复制:', error);

        // 降级方案：复制纯文本
        const plainText = tempDiv.textContent || tempDiv.innerText || '';
        await navigator.clipboard.writeText(plainText);

        alert('⚠️ 已复制纯文本内容到剪贴板。\n\n由于浏览器限制，无法复制富文本格式。\n建议使用Chrome浏览器以获得最佳体验。');
      } finally {
        // 清理临时元素
        document.body.removeChild(tempDiv);
      }
    } catch (error) {
      console.error('复制失败:', error);
      const message = error instanceof Error ? error.message : String(error);
      alert(`复制失败: ${message}`);
    } finally {
      setIsCopying(false);
    }
  };

  return (
    <div className="h-screen flex flex-col">
      {/* 轻量提示 */}
      {toast.visible && (
        <div
          role="status"
          aria-live="polite"
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-md border flex items-center gap-2 text-sm ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-700'
              : 'bg-red-50 border-red-200 text-red-700'
          }`}
        >
          {toast.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span>{toast.message}</span>
        </div>
      )}
      {/* 工具栏 */}
      <div className="border-b bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-4 w-4 mr-1" />
                返回工作台
              </Button>
            </Link>
            <div className="h-4 w-px bg-gray-300"></div>
            <FileText className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-500">
              {wordCount} 字 · 预计阅读 {readingTime} 分钟
            </span>
            {lastSaved && (
              <span className="text-sm text-gray-400">
                上次保存: {lastSaved.toLocaleTimeString()}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <select
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                onFocus={() => loadPresets()}
                className="text-sm border rounded px-2 py-1"
              >
                <option value="">选择预设</option>
                {presets.map(preset => (
                  <option key={preset.id} value={preset.id}>
                    {preset.name}{preset.isDefault ? '（默认）' : ''}
                  </option>
                ))}
              </select>

              <Button
                variant="outline"
                size="sm"
                onClick={handleApplyPreset}
                disabled={isApplyingPreset || presets.length === 0}
                className="text-amber-700 border-amber-200 hover:bg-amber-50"
              >
                {isApplyingPreset ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Settings className="h-4 w-4 mr-1" />
                )}
                应用预设
              </Button>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFeishuImport(true)}
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <Upload className="h-4 w-4 mr-1" />
              导入飞书文档
            </Button>

            <div className="h-4 w-px bg-gray-300"></div>

            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as any)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="default">默认样式</option>
              <option value="tech">技术风格</option>
              <option value="minimal">简约风格</option>
            </select>

            <Button
              variant="default"
              size="sm"
              onClick={handleCopyToWechat}
              disabled={isCopying || !preview}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCopying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              复制到公众号
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyContent}
              disabled={isCopying || !preview}
              title="复制内容到剪贴板，在公众号页面使用插件填充"
            >
              {isCopying ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              复制内容
            </Button>

            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              保存
            </Button>
          </div>
        </div>
      </div>

      {/* 编辑区域 */}
      <div className="flex-1 flex">
        {/* 编辑器 */}
        <div className="w-1/2 flex flex-col border-r">
          <div className="p-4 border-b">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入文章标题..."
              className="text-lg font-medium border-none px-0 focus-visible:ring-0"
            />
          </div>

          <div className="flex-1 p-4">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="请输入Markdown内容...

# 示例标题

这是一个段落示例。

## 二级标题

- 列表项1
- 列表项2

```javascript
console.log('代码示例');
```

> 这是一个引用块
"
              className="h-full resize-none border-none px-0 focus-visible:ring-0 font-mono text-sm"
            />
          </div>
        </div>

        {/* 预览区 */}
        <div className="w-1/2 flex flex-col">
          <div className="p-4 border-b bg-gray-50">
            <h3 className="font-medium text-gray-700">公众号预览（手机视图）</h3>
          </div>

          <div className="flex-1 p-6 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100 flex justify-center items-center">
            {/* iPhone 样机 */}
            <div className="relative">
              {/* 手机外壳 - iPhone 14 Pro 样式 */}
              <div className="w-[390px] h-[844px] bg-black rounded-[60px] p-2 shadow-2xl">
                {/* 屏幕 */}
                <div className="w-full h-full bg-white rounded-[48px] overflow-hidden flex flex-col relative">
                  {/* 动态岛 */}
                  <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full z-10"></div>

                  {/* 状态栏 */}
                  <div className="h-12 bg-white flex items-center justify-between px-6 pt-4">
                    <div className="text-sm font-semibold text-black">9:41</div>
                    <div className="flex items-center space-x-1">
                      {/* 信号 */}
                      <div className="flex space-x-1">
                        <div className="w-1 h-3 bg-black rounded-full"></div>
                        <div className="w-1 h-4 bg-black rounded-full"></div>
                        <div className="w-1 h-5 bg-black rounded-full"></div>
                        <div className="w-1 h-6 bg-black rounded-full"></div>
                      </div>
                      {/* WiFi */}
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2.166 4.999c5.208-5.208 13.651-5.208 18.859 0a.833.833 0 1 1-1.178 1.178c-4.375-4.375-11.471-4.375-15.846 0a.833.833 0 0 1-1.178-1.178z"/>
                        <path d="M5.01 7.844c3.125-3.125 8.195-3.125 11.32 0a.833.833 0 1 1-1.178 1.178c-2.292-2.292-6.014-2.292-8.306 0a.833.833 0 0 1-1.178-1.178z"/>
                        <path d="M7.854 10.688c1.042-1.042 2.734-1.042 3.776 0a.833.833 0 1 1-1.178 1.178.833.833 0 0 0-1.178 0 .833.833 0 0 1-1.178-1.178z"/>
                        <circle cx="10" cy="15" r="1.5"/>
                      </svg>
                      {/* 电池 */}
                      <div className="flex items-center">
                        <div className="w-6 h-3 border border-black rounded-sm relative">
                          <div className="w-4 h-1.5 bg-green-500 rounded-sm absolute top-0.5 left-0.5"></div>
                        </div>
                        <div className="w-0.5 h-1.5 bg-black rounded-r-sm ml-0.5"></div>
                      </div>
                    </div>
                  </div>

                  {/* 微信公众号头部 */}
                  <div className="bg-white border-b border-gray-100 px-4 py-3 flex items-center">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      字
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="text-base font-medium text-gray-900 break-words whitespace-normal">
                        {title || '字流'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {(() => {
                          const preset = presets.find(p => p.id === selectedPresetId) || presets.find(p => p.isDefault);
                          const author = preset?.authorName?.trim();
                          return author ? `作者：${author} · 刚刚` : '刚刚';
                        })()}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
                      </svg>
                    </div>
                  </div>

                  {/* 文章内容区域 */}
                  <div className="flex-1 overflow-auto bg-white">
                    <div className="px-4 py-4">
                      {preview ? (
                        <div
                          className="wechat-content"
                          dangerouslySetInnerHTML={{ __html: preview }}
                        />
                      ) : (
                        <div className="text-gray-400 text-center py-16 text-sm">
                          {content ? (
                            <div className="flex items-center justify-center space-x-2">
                              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                              <span>转换中...</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <div className="text-gray-300 text-lg">📝</div>
                              <div>开始输入内容以查看预览</div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 底部安全区域 */}
                  <div className="h-8 bg-white"></div>
                </div>
              </div>

              {/* 手机标签 */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 font-medium">
                iPhone 14 Pro 预览
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 飞书导入弹框 */}
      <FeishuImportDialog
        open={showFeishuImport}
        onOpenChange={setShowFeishuImport}
        onImport={handleFeishuImport}
      />
    </div>
  );
}
