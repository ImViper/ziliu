'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Platform, isVideoPlatform, getPlatformType, PLATFORM_CONFIGS } from '@/types/platform-settings';
import { Smartphone, Monitor, Palette, Loader2, ExternalLink, Settings, Chrome, Copy, Crown, Sun, Moon, Sparkles, Heart, MessageSquare, Star, User, MoreHorizontal, ChevronLeft, Send, Bookmark, Clock, ShieldCheck, AlertTriangle, Info, Wand2, Check, Link } from 'lucide-react';
import { getPublishTimeInfo, checkCompliance, getTrafficTemplates, type TrafficTemplate } from '@/lib/platform-rules';
import { PublishSettings } from './publish-settings';
import { useUserPlan } from '@/lib/subscription/hooks/useUserPlan';
import { PlatformGuard, StyleGuard } from '@/lib/subscription/components/FeatureGuard';
import { UpgradePrompt } from '@/lib/subscription/components/UpgradePrompt';
import { useExtensionDetector } from '@/hooks/useExtensionDetector';
import { useRouter } from 'next/navigation';
import { extractImagesFromMarkdown, markdownToPlainText as markdownToPlainTextUtil, type ExtractedImage } from '@/lib/markdown-utils';
import { WECHAT_STYLES } from '@/lib/wechat-themes';

interface PlatformPreviewProps {
  title: string;
  content: string;
  articleId?: string;
}

type ShortTextGenerated = {
  title?: string;
  content: string;
  tags?: string[];
  images?: ExtractedImage[];
  coverImage?: string;
  coverSuggestion?: string;
};

// 平台配置（组件外，避免每次渲染创建新引用）
const LONG_TEXT_PLATFORMS = [
  {
    id: 'wechat' as Platform,
    name: '公众号',
    icon: '📱',
    color: 'bg-green-500',
    description: '微信公众号文章'
  },
  {
    id: 'zhihu' as Platform,
    name: '知乎',
    icon: '🔵',
    color: 'bg-blue-500',
    description: '知乎专栏文章'
  },
  {
    id: 'juejin' as Platform,
    name: '掘金',
    icon: '⚡',
    color: 'bg-cyan-500',
    description: '掘金技术文章'
  },
  {
    id: 'zsxq' as Platform,
    name: '知识星球',
    icon: '🌟',
    color: 'bg-yellow-500',
    description: '知识星球文章和主题'
  }
];

const SHORT_TEXT_PLATFORMS = [
  {
    id: 'wechat_xiaolushu' as Platform,
    name: '小绿书',
    icon: '🟢',
    color: 'bg-emerald-600',
    description: '微信小绿书（图片消息）'
  },
  {
    id: 'xiaohongshu_note' as Platform,
    name: '小红书（图文）',
    icon: '📕',
    color: 'bg-red-500',
    description: '小红书图文笔记'
  },
  {
    id: 'weibo' as Platform,
    name: '微博',
    icon: '🧣',
    color: 'bg-red-600',
    description: '微博短内容'
  },
  {
    id: 'jike' as Platform,
    name: '即刻',
    icon: '🟡',
    color: 'bg-yellow-500',
    description: '即刻动态'
  },
  {
    id: 'x' as Platform,
    name: 'X',
    icon: '𝕏',
    color: 'bg-black',
    description: 'X（Twitter）'
  },
  {
    id: 'linkedin' as Platform,
    name: 'LinkedIn',
    icon: '💼',
    color: 'bg-blue-700',
    description: 'LinkedIn 职业动态'
  }
];

const VIDEO_PLATFORMS = [
  {
    id: 'video_wechat' as Platform,
    name: '视频号',
    icon: '📹',
    color: 'bg-green-600',
    description: '微信视频号发布'
  },
  {
    id: 'douyin' as Platform,
    name: '抖音',
    icon: '🎵',
    color: 'bg-black',
    description: '抖音短视频发布'
  },
  {
    id: 'bilibili' as Platform,
    name: 'B站',
    icon: '📺',
    color: 'bg-pink-500',
    description: 'B站视频投稿'
  },
  {
    id: 'xiaohongshu' as Platform,
    name: '小红书（视频）',
    icon: '📕',
    color: 'bg-red-600',
    description: '小红书视频发布'
  },
  {
    id: 'youtube' as Platform,
    name: 'YouTube',
    icon: '🎬',
    color: 'bg-red-600',
    description: 'YouTube 视频发布'
  }
];

export function PlatformPreview({ title, content, articleId }: PlatformPreviewProps) {
  // 状态持久化key
  const storageKey = `editor-preview-state-${articleId || 'new'}`;

  // 从localStorage获取保存的状态
  const getSavedState = () => {
    if (typeof window === 'undefined') return null;

    try {
      const saved = localStorage.getItem(storageKey);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load preview state:', error);
      return null;
    }
  };

  const savedState = getSavedState();

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(savedState?.platform || 'wechat');
  const [selectedStyle, setSelectedStyle] = useState<'default' | 'minimal' | 'elegant' | 'tech' | 'card' | 'print' | 'wechatHot' | 'blogger' | 'night'>(savedState?.style || 'default');
  const [wechatTheme, setWechatTheme] = useState<'day' | 'night'>('day');
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewText, setPreviewText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [appliedSettings, setAppliedSettings] = useState<any>(savedState?.settings || null);
  const [finalContent, setFinalContent] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState<any>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [shortTextCache, setShortTextCache] = useState<Partial<Record<Platform, ShortTextGenerated>>>({});
  const [shortTextImages, setShortTextImages] = useState<ExtractedImage[]>([]);
  const [isGeneratingShortText, setIsGeneratingShortText] = useState(false);
  const selectedPlatformRef = useRef<Platform>(selectedPlatform);
  const shortTextInFlightRef = useRef<Set<Platform>>(new Set());
  const shortTextLoadInFlightRef = useRef<Set<Platform>>(new Set());
  const videoInFlightRef = useRef<Set<Platform>>(new Set());
  const autoGeneratedShortTextRef = useRef<Set<Platform>>(new Set());
  const autoLoadedShortTextRef = useRef<Set<Platform>>(new Set());
  const prefetchedShortTextRef = useRef(false);
  const prefetchedVideoRef = useRef(false);

  // 保存状态到localStorage
  const saveState = useCallback((platform: Platform, style: string, settings: any) => {
    if (typeof window === 'undefined') return;

    try {
      const state = {
        platform,
        style,
        settings,
        timestamp: Date.now()
      };
      localStorage.setItem(storageKey, JSON.stringify(state));
    } catch (error) {
      console.warn('Failed to save preview state:', error);
    }
  }, [storageKey]);

  // 添加订阅信息和插件检测
  const { hasFeature, checkFeatureAccess } = useUserPlan();
  const { isInstalled, isChecking } = useExtensionDetector();
  const router = useRouter();

  useEffect(() => {
    selectedPlatformRef.current = selectedPlatform;
  }, [selectedPlatform]);

  // 自动创建草稿功能
  const createDraftArticle = useCallback(async () => {
    try {
      const response = await fetch('/api/articles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim() || '未命名文章',
          content: content,
          status: 'draft',
          style: selectedStyle
        }),
      });

      if (response.ok) {
        const data: any = await response.json();
        if (data.success) {
          return data.data.id;
        }
      }

      throw new Error('创建草稿失败');
    } catch (error) {
      console.error('创建草稿失败:', error);
      throw error;
    }
  }, [title, content, selectedStyle]);

  const longTextPlatforms = LONG_TEXT_PLATFORMS;
  const shortTextPlatforms = SHORT_TEXT_PLATFORMS;
  const videoPlatforms = VIDEO_PLATFORMS;

  // 应用发布设置到内容
  const applySettingsToContent = useCallback((baseContent: string, settings: any) => {
    if (!settings) return baseContent;

    let fullContent = baseContent;

    // 添加开头内容
    if (settings.headerContent) {
      fullContent = settings.headerContent + '\n\n' + fullContent;
    }

    // 添加结尾内容
    if (settings.footerContent) {
      fullContent = fullContent + '\n\n' + settings.footerContent;
    }

    return fullContent;
  }, []);

  // 生成短图文平台文案（AI）
  const generateShortTextContent = useCallback(async (platform: Platform, options?: { updatePreview?: boolean; silent?: boolean; }): Promise<ShortTextGenerated | null> => {
    if (getPlatformType(platform) !== 'short_text') return null;
    if (!content.trim()) return null;
    if (shortTextInFlightRef.current.has(platform)) {
      return shortTextCache[platform] || null;
    }

    shortTextInFlightRef.current.add(platform);
    const shouldUpdatePreview = options?.updatePreview && platform === selectedPlatformRef.current;
    if (!options?.silent && platform === selectedPlatformRef.current) {
      setIsGeneratingShortText(true);
    }
    try {
      const response = await fetch('/api/short-text/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          title,
          content: finalContent || content,
        }),
      });

      const data: any = await response.json();
      if (!data?.success) {
        console.error('短图文生成失败:', data?.error);
        alert(data?.error || '生成失败，请重试');
        return null;
      }
      const generated: ShortTextGenerated = {
        title: data.data?.title,
        content: data.data?.content || '',
        tags: data.data?.tags || [],
        images: data.data?.images || [],
        coverImage: data.data?.coverImage,
        coverSuggestion: data.data?.coverSuggestion,
      };

      setShortTextCache(prev => ({ ...prev, [platform]: generated }));
      if (shouldUpdatePreview) {
        setPreviewText(generated.content || '');
        setShortTextImages(generated.images || []);
      }

      // 将生成的内容保存到后端，供插件调用
      if (articleId) {
        fetch('/api/short-text/content', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            articleId,
            platform,
            ...generated
          })
        }).catch(err => console.warn('保存预览内容失败', err));
      }

      return generated;
    } catch (error) {
      console.error('短图文生成出错:', error);
      alert('生成失败，请重试');
      return null;
    } finally {
      shortTextInFlightRef.current.delete(platform);
      if (!options?.silent && platform === selectedPlatformRef.current) {
        setIsGeneratingShortText(false);
      }
    }
  }, [content, finalContent, title, articleId, shortTextCache]);

  const copyShortTextImages = useCallback(async () => {
    try {
      const urls = (shortTextImages || []).map(img => img.url).filter(Boolean).join('\n');
      if (!urls) return;
      await navigator.clipboard.writeText(urls);
    } catch (error) {
      console.error('复制图片链接失败:', error);
    }
  }, [shortTextImages]);

  const loadShortTextContent = useCallback(async (platform: Platform, options?: { updatePreview?: boolean; silent?: boolean; }) => {
    if (getPlatformType(platform) !== 'short_text') return null;
    if (!articleId) return null;
    if (shortTextLoadInFlightRef.current.has(platform)) {
      return shortTextCache[platform] || null;
    }

    shortTextLoadInFlightRef.current.add(platform);
    const shouldUpdatePreview = options?.updatePreview && platform === selectedPlatformRef.current;
    if (!options?.silent && shouldUpdatePreview) {
      setIsGeneratingShortText(true);
    }
    try {
      const response = await fetch(`/api/short-text/content?articleId=${articleId}&platform=${platform}`);
      if (!response.ok) {
        return null;
      }
      const data: any = await response.json();
      if (!data?.success) return null;
      const loaded: ShortTextGenerated = {
        title: data.data?.title,
        content: data.data?.content || '',
        tags: data.data?.tags || [],
        images: data.data?.images || [],
        coverImage: data.data?.coverImage,
        coverSuggestion: data.data?.coverSuggestion,
      };

      setShortTextCache(prev => ({ ...prev, [platform]: loaded }));
      if (shouldUpdatePreview) {
        setPreviewText(loaded.content || '');
        setShortTextImages(loaded.images || []);
      }

      return loaded;
    } catch (error) {
      console.warn('加载短图文内容失败:', error);
      return null;
    } finally {
      shortTextLoadInFlightRef.current.delete(platform);
      if (!options?.silent && shouldUpdatePreview) {
        setIsGeneratingShortText(false);
      }
    }
  }, [articleId, shortTextCache]);

  // 更新最终内容
  useEffect(() => {
    const newFinalContent = applySettingsToContent(content, appliedSettings);
    setFinalContent(newFinalContent);
  }, [content, appliedSettings, applySettingsToContent]);

  // 加载视频内容（先从数据库加载，没有则生成）
  const loadVideoContent = useCallback(async (platform: Platform, options?: { forceRegenerate?: boolean; updateUI?: boolean; silent?: boolean; }) => {
    if (!isVideoPlatform(platform) || !content.trim() || !articleId) {
      return;
    }

    if (videoInFlightRef.current.has(platform)) {
      return;
    }

    videoInFlightRef.current.add(platform);
    const shouldUpdateUI = options?.updateUI ?? (platform === selectedPlatformRef.current);
    if (!options?.silent && shouldUpdateUI) {
      setIsGeneratingVideo(true);
    }
    try {
      // 如果不是强制重新生成，先尝试从数据库加载
      if (!options?.forceRegenerate) {
        const loadResponse = await fetch(`/api/video/content?articleId=${articleId}&platform=${platform}`);
        if (loadResponse.ok) {
          const loadData: any = await loadResponse.json();
          if (loadData.success) {
            if (shouldUpdateUI) {
              setVideoMetadata({
                title: loadData.data.title,
                description: loadData.data.description,
                speechScript: loadData.data.speechScript,
                tags: loadData.data.tags,
                coverSuggestion: loadData.data.coverSuggestion,
                coverImage: loadData.data.coverImage,
                coverImage169: loadData.data.coverImage169,
                coverImage43: loadData.data.coverImage43,
                platformTips: loadData.data.platformTips,
                estimatedDuration: loadData.data.estimatedDuration
              });
            }
            return;
          }
        }
      }

      // 数据库没有内容或强制重新生成，则调用AI生成
      const [speechResponse, metadataResponse] = await Promise.all([
        fetch('/api/video/convert-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: finalContent || content,
            platform,
            title: title
          })
        }),
        fetch('/api/video/generate-metadata', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            content: finalContent || content,
            platform,
            title: title
          })
        })
      ]);

      const speechData = await speechResponse.json() as any;
      const metadataData = await metadataResponse.json() as any;

      if (speechData.success && metadataData.success) {
        const videoData = {
          speechScript: speechData.data.speechScript,
          ...metadataData.data,
          estimatedDuration: speechData.data.estimatedDuration
        };

        if (shouldUpdateUI) {
          setVideoMetadata(videoData);
        }

        // 保存到数据库
        await fetch('/api/video/content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            articleId,
            platform,
            videoTitle: metadataData.data.title,
            videoDescription: metadataData.data.description,
            speechScript: speechData.data.speechScript,
            tags: metadataData.data.tags,
            coverSuggestion: metadataData.data.coverSuggestion,
            coverImage: metadataData.data.coverImage,
            coverImage169: metadataData.data.coverImage169,
            coverImage43: metadataData.data.coverImage43,
            platformTips: metadataData.data.platformTips,
            estimatedDuration: speechData.data.estimatedDuration
          })
        });
      } else {
        console.error('生成视频内容失败:', speechData.error || metadataData.error);
        alert('生成失败，请重试');
      }
    } catch (error) {
      console.error('生成视频内容出错:', error);
      alert('生成失败，请重试');
    } finally {
      videoInFlightRef.current.delete(platform);
      if (!options?.silent && shouldUpdateUI) {
        setIsGeneratingVideo(false);
      }
    }
  }, [content, finalContent, title, articleId]);

  // 生成视频内容（强制重新生成）
  const generateVideoContent = useCallback(async () => {
    await loadVideoContent(selectedPlatform, { forceRegenerate: true, updateUI: true });
  }, [loadVideoContent, selectedPlatform]);

  // 当选择视频平台时自动加载内容
  useEffect(() => {
    if (isVideoPlatform(selectedPlatform) && content.trim() && articleId) {
      loadVideoContent(selectedPlatform, { forceRegenerate: false, updateUI: true });
      if (!prefetchedVideoRef.current) {
        prefetchedVideoRef.current = true;
        videoPlatforms.forEach((platform) => {
          if (platform.id !== selectedPlatform) {
            loadVideoContent(platform.id, { forceRegenerate: false, updateUI: false, silent: true });
          }
        });
      }
    } else {
      setVideoMetadata(null);
    }
  }, [selectedPlatform, loadVideoContent, articleId]);

  // 组件卸载时清理旧的状态缓存（可选，防止localStorage积累过多数据）
  useEffect(() => {
    return () => {
      // 清理超过7天的旧状态缓存
      if (typeof window !== 'undefined') {
        try {
          const keys = Object.keys(localStorage);
          const now = Date.now();
          const weekMs = 7 * 24 * 60 * 60 * 1000; // 7天

          keys.forEach(key => {
            if (key.startsWith('editor-preview-state-')) {
              try {
                const data = JSON.parse(localStorage.getItem(key) || '{}');
                if (data.timestamp && (now - data.timestamp) > weekMs) {
                  localStorage.removeItem(key);
                }
              } catch (e) {
                // 清理无效数据
                localStorage.removeItem(key);
              }
            }
          });
        } catch (error) {
          console.warn('Failed to cleanup old preview states:', error);
        }
      }
    };
  }, []);

  // 加载文章已保存的样式作为初始选择
  useEffect(() => {
    const fetchStyle = async () => {
      if (!articleId) return;
      try {
        const res = await fetch(`/api/articles/${articleId}`);
        const data = await res.json() as any;
        if (data?.success && data.data?.style) {
          setSelectedStyle(data.data.style);
        }
      } catch (e) {
        console.warn('获取文章样式失败，使用默认样式');
      }
    };
    fetchStyle();
  }, [articleId]);

  // 转换预览（仅用于图文平台）
  const handlePreview = useCallback(async (platform: Platform, style: string) => {
    const platformType = getPlatformType(platform);

    // 视频平台不需要调用转换预览
    if (isVideoPlatform(platform)) {
      setPreviewHtml('');
      setPreviewText('');
      setIsConverting(false);
      return;
    }

    const contentToPreview = finalContent || content;

    if (!contentToPreview.trim()) {
      setPreviewHtml('');
      setPreviewText('');
      setShortTextImages([]);
      return;
    }

    // 短图文平台：不走 HTML 转换，直接展示纯文本（或 AI 生成后的文案）
    if (platformType === 'short_text') {
      setIsConverting(false);
      setPreviewHtml('');
      const cached = shortTextCache[platform];
      const images = (cached?.images && cached.images.length > 0) ? cached.images : extractImagesFromMarkdown(contentToPreview);
      setShortTextImages(images);
      setPreviewText((cached?.content || markdownToPlainTextUtil(contentToPreview)).trim());

      let resolved = cached || null;
      if (!resolved && articleId && !autoLoadedShortTextRef.current.has(platform)) {
        autoLoadedShortTextRef.current.add(platform);
        resolved = await loadShortTextContent(platform, { updatePreview: platform === selectedPlatform }) || null;
      }

      if (!resolved && !autoGeneratedShortTextRef.current.has(platform)) {
        autoGeneratedShortTextRef.current.add(platform);
        await generateShortTextContent(platform, { updatePreview: platform === selectedPlatform });
      }

      if (!prefetchedShortTextRef.current) {
        prefetchedShortTextRef.current = true;
        shortTextPlatforms.forEach(async (item) => {
          if (item.id !== platform) {
            const loaded = await loadShortTextContent(item.id, { updatePreview: false, silent: true });
            if (!loaded) {
              await generateShortTextContent(item.id, { updatePreview: false, silent: true });
            }
          }
        });
      }
      return;
      return;
    }

    // 微信公众号：优先本地实时转换，支持夜间模式
    if (platform === 'wechat') {
      import('@/lib/converter').then(({ convertToWechat }) => {
        const html = convertToWechat(contentToPreview, style as any, wechatTheme);
        setPreviewHtml(html);
        setPreviewText('');
        setIsConverting(false);
      });
      return;
    }

    // 知识星球：使用专属转换器（适配 zsxq CSS 白名单，跟随主题）
    // 注意：标题会被加入内容开头，这样列表预览也能显示标题
    if (platform === 'zsxq') {
      import('@/lib/converter').then(({ convertToZsxq }) => {
        const html = convertToZsxq(contentToPreview, style, title);
        setPreviewHtml(html);
        setPreviewText('');
        setIsConverting(false);
      });
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
          content: contentToPreview,
          // convert API 目前仅支持长文平台；小绿书与公众号同编辑器，统一走 wechat
          platform: platform === 'wechat_xiaolushu' ? 'wechat' : platform,
          style,
        }),
      });

      const data: any = await response.json();
      if (data.success) {
        // 微信公众号预览：用 inlineHtml 渲染,保证预览与最终粘贴到公众号编辑器的效果一致
        // Note: 'wechat' 已在前面单独处理（本地实时转换），这里只需判断 'wechat_xiaolushu'
        const isWechatLike = platform === 'wechat_xiaolushu';
        const htmlForPreview = isWechatLike ? (data.data.inlineHtml || data.data.html) : data.data.html;
        setPreviewHtml(htmlForPreview);
        setPreviewText('');
      } else {
        console.error('转换失败:', data.error);
      }
    } catch (error) {
      console.error('转换错误:', error);
    } finally {
      setIsConverting(false);
    }
  }, [finalContent, content, shortTextCache, generateShortTextContent, loadShortTextContent, selectedPlatform, articleId, wechatTheme, title]);

  // 自动预览
  useEffect(() => {
    const timer = setTimeout(() => {
      handlePreview(selectedPlatform, selectedStyle);
    }, 500);

    return () => clearTimeout(timer);
  }, [finalContent, selectedPlatform, selectedStyle, handlePreview, wechatTheme]);

  // 平台切换时立即预览
  const handlePlatformChange = useCallback(async (platform: Platform) => {
    setSelectedPlatform(platform);

    // 保存状态
    saveState(platform, selectedStyle, appliedSettings);

    // 如果是视频平台且没有articleId，需要先创建草稿
    if (isVideoPlatform(platform) && !articleId) {
      if (!title.trim() && !content.trim()) {
        alert('请先输入标题和内容再预览视频效果');
        return;
      }

      try {
        const newArticleId = await createDraftArticle();
        router.push(`/editor/${newArticleId}`);
        return;
      } catch (error) {
        alert('创建草稿失败，请重试');
        return;
      }
    }

    handlePreview(platform, selectedStyle);
  }, [selectedStyle, handlePreview, articleId, title, content, createDraftArticle, router, saveState, appliedSettings]);

  // 样式切换时立即预览
  const handleStyleChange = useCallback((style: string) => {
    setSelectedStyle(style as any);
    saveState(selectedPlatform, style, appliedSettings);
    handlePreview(selectedPlatform, style);
    if (articleId) {
      fetch(`/api/articles/${articleId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ style })
      }).catch(() => { });
    }
  }, [selectedPlatform, handlePreview, saveState, appliedSettings, articleId]);

  const getPlatformUrl = (platform: Platform) => {
    switch (platform) {
      case 'wechat': return 'https://mp.weixin.qq.com/';
      case 'wechat_xiaolushu': return 'https://mp.weixin.qq.com/';
      case 'zhihu': return 'https://zhuanlan.zhihu.com/write';
      case 'juejin': return 'https://juejin.cn/editor/drafts/new?v=2';
      case 'zsxq': return 'https://wx.zsxq.com/';
      case 'xiaohongshu_note': return 'https://creator.xiaohongshu.com/publish/publish?from=tab_switch&target=image';
      case 'xiaohongshu': return 'https://creator.xiaohongshu.com/publish/publish';
      case 'weibo': return 'https://weibo.com/';
      case 'jike': return 'https://web.okjike.com/';
      case 'x': return 'https://x.com/compose/post';
      case 'linkedin': return 'https://www.linkedin.com/feed/';
      case 'video_wechat': return 'https://channels.weixin.qq.com/platform/post/create';
      case 'douyin': return 'https://creator.douyin.com/creator-micro/content/post/video';
      case 'bilibili': return 'https://member.bilibili.com/platform/upload/video/frame';
      case 'youtube': return 'https://studio.youtube.com/';
      default: return '';
    }
  };

  const handlePublish = useCallback(async () => {
    if (!title.trim() || !content.trim()) return;
    if (!isInstalled) {
      router.push('/extension');
      return;
    }

    setIsPublishing(true);
    try {
      const contentToPublish = finalContent || content;
      const platformType = getPlatformType(selectedPlatform);
      const platformUrl = getPlatformUrl(selectedPlatform);
      let contentToCopy = '';
      let resolvedShortText: ShortTextGenerated | null = null;

      if (platformType === 'short_text') {
        const cached = shortTextCache[selectedPlatform];
        if (cached) {
          resolvedShortText = cached;
        } else {
          resolvedShortText = await generateShortTextContent(selectedPlatform, { updatePreview: true });
        }

        const plainBody = (resolvedShortText?.content || markdownToPlainTextUtil(contentToPublish)).trim();
        const finalTitle = (resolvedShortText?.title || title).trim();
        if (selectedPlatform === 'xiaohongshu_note') {
          contentToCopy = `${finalTitle}\n\n${plainBody}`.trim();
        } else {
          contentToCopy = plainBody;
        }
      } else {
        if (title) contentToCopy += `# ${title}\n\n`;
        contentToCopy += contentToPublish;
      }

      try {
        if (typeof window !== 'undefined' && (window as any).chrome?.runtime && articleId) {
          // 如果是短图文平台，尝试传递已生成的缓存内容
          let shortTextData = {};
          if (platformType === 'short_text') {
            const cached = resolvedShortText || shortTextCache[selectedPlatform];
            if (cached) {
              shortTextData = {
                title: cached?.title,
                content: cached?.content,
                tags: cached?.tags,
                images: cached?.images
              };
            }
          }

          (window as any).chrome.runtime.sendMessage({
            action: 'storeContent',
            data: {
              articleId,
              style: selectedStyle,
              platform: selectedPlatform,
              mode: wechatTheme,
              // 透传生成的短图文数据
              generatedContent: shortTextData
            }
          }, () => { });
        }
      } catch (e) {
        console.warn('通知插件所选样式失败，不影响发布', e);
      }

      await navigator.clipboard.writeText(contentToCopy);
      window.open(platformUrl, '_blank');
    } catch (error) {
      console.error('发布失败:', error);
    } finally {
      setIsPublishing(false);
    }
  }, [title, content, finalContent, selectedPlatform, isInstalled, router, articleId, selectedStyle, shortTextCache, generateShortTextContent]);

  return (
    <div className="flex flex-col h-full">
      {/* 预览控制栏 */}
      <div className="p-4 border-b border-white/5 bg-transparent">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-white flex items-center">
            {selectedPlatform === 'wechat' ? (
              <Smartphone className="h-4 w-4 mr-2 text-zinc-400" />
            ) : (
              <Monitor className="h-4 w-4 mr-2 text-zinc-400" />
            )}
            预览
          </h3>
          {isConverting && (
            <div className="flex items-center text-sm text-zinc-400">
              <Loader2 className="h-4 w-4 animate-spin mr-1" />
              转换中...
            </div>
          )}
        </div>

        {/* 平台选择器 */}
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-3">
            <span className="text-sm font-medium text-zinc-400">发布平台:</span>
          </div>

          {/* 长图文平台 */}
          <div className="mb-3">
            <div className="text-xs text-zinc-500 mb-2">长图文平台</div>
            <div className="flex flex-wrap bg-white/5 rounded-xl p-1 gap-1">
              {longTextPlatforms.map((platform) => {
                const platformFeatureId = `${platform.id}-platform`;
                const hasAccess = hasFeature(platformFeatureId);
                const accessResult = checkFeatureAccess(platformFeatureId);

                return (
                  <div key={platform.id} className="relative flex items-center">
                    <button
                      onClick={() => {
                        if (hasAccess) {
                          handlePlatformChange(platform.id);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${selectedPlatform === platform.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : hasAccess
                          ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                          : 'text-zinc-600 cursor-not-allowed opacity-40'
                        }`}
                      disabled={!hasAccess}
                      title={!hasAccess ? accessResult.reason : platform.description}
                    >
                      <span>{platform.icon}</span>
                      <span>{platform.name}</span>
                      {!hasAccess && platform.id !== 'wechat' && (
                        <Crown className="h-3 w-3 text-amber-500 ml-1" />
                      )}
                    </button>
                    {!hasAccess && (
                      <div className="ml-1">
                        <UpgradePrompt scenario="platform-locked" style="tooltip" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 短图文平台 */}
          <div className="mb-3">
            <div className="text-xs text-zinc-500 mb-2">短图文平台</div>
            <div className="flex bg-white/5 rounded-xl p-1 gap-1 flex-wrap">
              {shortTextPlatforms.map((platform) => {
                const platformFeatureId = `${platform.id}-platform`;
                const hasAccess = hasFeature(platformFeatureId);
                const accessResult = checkFeatureAccess(platformFeatureId);

                return (
                  <div key={platform.id} className="relative flex items-center">
                    <button
                      onClick={() => {
                        if (hasAccess) {
                          handlePlatformChange(platform.id);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${selectedPlatform === platform.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : hasAccess
                          ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                          : 'text-zinc-600 cursor-not-allowed opacity-40'
                        }`}
                      disabled={!hasAccess}
                      title={!hasAccess ? accessResult.reason : platform.description}
                    >
                      <span>{platform.icon}</span>
                      <span>{platform.name}</span>
                      {!hasAccess && platform.id !== 'wechat' && (
                        <Crown className="h-3 w-3 text-amber-500 ml-1" />
                      )}
                    </button>
                    {!hasAccess && (
                      <div className="ml-1">
                        <UpgradePrompt scenario="platform-locked" style="tooltip" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 视频平台 */}
          <div>
            <div className="text-xs text-zinc-500 mb-2">视频平台</div>
            <div className="flex flex-wrap bg-white/5 rounded-xl p-1 gap-1">
              {videoPlatforms.map((platform) => {
                const platformFeatureId = `${platform.id}-platform`;
                const hasAccess = hasFeature(platformFeatureId);
                const accessResult = checkFeatureAccess(platformFeatureId);

                return (
                  <div key={platform.id} className="relative flex items-center">
                    <button
                      onClick={() => {
                        if (hasAccess) {
                          handlePlatformChange(platform.id);
                        }
                      }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${selectedPlatform === platform.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : hasAccess
                          ? 'text-zinc-400 hover:text-white hover:bg-white/10'
                          : 'text-zinc-600 cursor-not-allowed opacity-40'
                        }`}
                      disabled={!hasAccess}
                      title={!hasAccess ? accessResult.reason : platform.description}
                    >
                      <span>{platform.icon}</span>
                      <span>{platform.name}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 长图文/短图文：发布设置 + 去发布 */}
        {!isVideoPlatform(selectedPlatform) && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              {getPlatformType(selectedPlatform) === 'long_text' ? (
                <>
                  <div className="flex items-center space-x-2">
                    <Palette className="h-4 w-4 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-400">样式:</span>
                  </div>
                  <select
                    value={selectedStyle}
                    onChange={(e) => {
                      const newStyle = e.target.value;
                      if (newStyle !== 'default') {
                        const styleAccess = checkFeatureAccess('advanced-styles');
                        if (!styleAccess.hasAccess) {
                          alert(styleAccess.reason || '高级样式需要专业版权限');
                          return;
                        }
                      }
                      handleStyleChange(newStyle);
                    }}
                    className="text-sm border border-white/10 rounded-lg px-3 py-1.5 bg-white/5 text-zinc-200 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent [&>option]:bg-[#020617] [&>option]:text-zinc-200 w-full sm:w-auto"
                  >
                    <option value="default">清爽简约</option>
                    <option value="minimal" disabled={!hasFeature('advanced-styles')}>
                      极简留白（Pro） {!hasFeature('advanced-styles') ? '👑' : ''}
                    </option>
                    <option value="elegant" disabled={!hasFeature('advanced-styles')}>
                      杂志雅致（Pro） {!hasFeature('advanced-styles') ? '👑' : ''}
                    </option>
                    <option value="tech" disabled={!hasFeature('advanced-styles')}>
                      极客技术（Pro） {!hasFeature('advanced-styles') ? '👑' : ''}
                    </option>
                    <option value="card" disabled={!hasFeature('advanced-styles')}>
                      卡片模块（Pro） {!hasFeature('advanced-styles') ? '👑' : ''}
                    </option>
                    <option value="print" disabled={!hasFeature('advanced-styles')}>
                      书刊印刷（Pro） {!hasFeature('advanced-styles') ? '👑' : ''}
                    </option>
                    <option value="wechatHot" disabled={!hasFeature('advanced-styles')}>
                      公众号爆款（Pro） {!hasFeature('advanced-styles') ? '👑' : ''}
                    </option>
                    <option value="blogger" disabled={!hasFeature('advanced-styles')}>
                      知识博主（Pro） {!hasFeature('advanced-styles') ? '👑' : ''}
                    </option>
                  </select>
                </>
              ) : (
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-xs text-zinc-500 font-medium">
                    ✨ AI 爆款方案
                  </div>
                  <button
                    onClick={() => generateShortTextContent(selectedPlatform, { updatePreview: true })}
                    disabled={isGeneratingShortText || !content.trim()}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-200 border border-white/10 rounded-lg text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isGeneratingShortText ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    )}
                    <span>{isGeneratingShortText ? '生成中...' : (shortTextCache[selectedPlatform] ? '重新生成' : 'AI生成文案')}</span>
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {hasFeature('publish-presets') ? (
                <PublishSettings
                  platform={selectedPlatform}
                  onApplySettings={(settings) => {
                    setAppliedSettings(settings);
                    saveState(selectedPlatform, selectedStyle, settings);
                    setTimeout(() => {
                      handlePreview(selectedPlatform, selectedStyle);
                    }, 100);
                  }}
                />
              ) : (
                <div className="flex items-center space-x-2">
                  <button
                    className="flex items-center space-x-1 px-3 py-2 border border-white/5 rounded-lg text-sm font-medium bg-white/5 text-zinc-600 cursor-not-allowed transition-colors"
                    title="发布设置功能仅限专业版用户使用"
                  >
                    <Settings className="h-4 w-4" />
                    <span>发布设置</span>
                    <Crown className="h-3 w-3 text-amber-500" />
                  </button>
                  <UpgradePrompt scenario="preset-locked" style="tooltip" />
                </div>
              )}

              {isChecking ? (
                <button disabled className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-zinc-500 cursor-not-allowed w-full sm:w-auto justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>检测中...</span>
                </button>
              ) : !isInstalled ? (
                <button
                  onClick={() => router.push('/extension')}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 w-full sm:w-auto justify-center"
                >
                  <Chrome className="h-4 w-4" />
                  <span>安装插件</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              ) : (
                <button
                  onClick={handlePublish}
                  disabled={isPublishing || !title.trim() || !content.trim()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto justify-center ${isPublishing || !title.trim() || !content.trim()
                    ? 'bg-white/5 text-zinc-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30'
                    }`}
                >
                  {isPublishing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Copy className="h-4 w-4" />}
                  <span>{isPublishing ? '准备中...' : '去平台发布'}</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* 视频平台操作区 */}
        {isVideoPlatform(selectedPlatform) && (
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {isGeneratingVideo ? (
                <div className="flex items-center text-sm text-zinc-400">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  正在生成视频内容...
                </div>
              ) : (
                <button
                  onClick={generateVideoContent}
                  disabled={!content.trim()}
                  className="flex items-center space-x-2 px-3 py-2 border border-white/10 rounded-lg text-sm font-medium bg-white/5 hover:bg-white/10 text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  <span>重新生成</span>
                </button>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {isChecking ? (
                <button disabled className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-white/5 text-zinc-500 cursor-not-allowed w-full sm:w-auto justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>检测中...</span>
                </button>
              ) : !isInstalled ? (
                <button onClick={() => router.push('/extension')} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 w-full sm:w-auto justify-center">
                  <Chrome className="h-4 w-4" />
                  <span>安装插件</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              ) : (
                <button
                  onClick={() => {
                    const platformUrl = getPlatformUrl(selectedPlatform);
                    window.open(platformUrl, '_blank');
                  }}
                  disabled={!videoMetadata || isGeneratingVideo}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 w-full sm:w-auto justify-center ${!videoMetadata || isGeneratingVideo
                    ? 'bg-white/5 text-zinc-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 hover:shadow-primary/30'
                    }`}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>去{videoPlatforms.find(p => p.id === selectedPlatform)?.name}发布</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* 显示当前应用的设置 */}
        {appliedSettings && (
          <div className="mt-3 p-3 bg-green-500/10 border border-green-500/20 rounded-lg backdrop-blur-sm">
            <div className="text-xs text-green-400 font-medium">
              ✅ 已应用设置: {appliedSettings.name} ({appliedSettings.platform === 'wechat' ? '微信公众号' : appliedSettings.platform})
            </div>
            {appliedSettings.headerContent && (
              <div className="text-xs text-green-400/70 mt-1">
                📝 包含开头内容
              </div>
            )}
            {appliedSettings.footerContent && (
              <div className="text-xs text-green-400/70 mt-1">
                📝 包含结尾内容
              </div>
            )}
          </div>
        )}

        {/* 智能发布助手：发布时间 + 合规检查 */}
        <SmartPublishBar platform={selectedPlatform} content={finalContent || content} title={title} />
      </div>


      {/* 预览内容 */}
      < div className="flex-1 overflow-auto flex flex-col" >
        {/* 长图文平台预览 */}
        {
          getPlatformType(selectedPlatform) === 'long_text' && (
            <>
              {isConverting || !content ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    {isConverting ? (
                      <div className="flex items-center justify-center space-x-2 text-zinc-400">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">转换中...</span>
                      </div>
                    ) : (
                      <div className="space-y-2 text-zinc-500">
                        <div className="text-3xl">📝</div>
                        <div className="text-sm">开始输入内容以查看预览</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col p-6">
                  <div className="flex-1">
                    {selectedPlatform === 'wechat' && <WechatPreview title={title} content={previewHtml} selectedStyle={selectedStyle} wechatTheme={wechatTheme} onThemeChange={setWechatTheme} />}
                    {selectedPlatform === 'zhihu' && <ZhihuPreview title={title} content={previewHtml} />}
                    {selectedPlatform === 'juejin' && <JuejinPreview title={title} content={previewHtml} />}
                    {selectedPlatform === 'zsxq' && <ZsxqPreview title={title} content={previewHtml} />}
                  </div>
                </div>
              )}
            </>
          )
        }

        {/* 短图文平台预览 */}
        {
          getPlatformType(selectedPlatform) === 'short_text' && (
            <div className="flex-1 flex flex-col p-6">
              {!content.trim() ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2 text-zinc-500">
                    <div className="text-3xl">📝</div>
                    <div className="text-sm">开始输入内容以查看预览</div>
                  </div>
                </div>
              ) : (
                <ShortTextPreview
                  platform={selectedPlatform}
                  title={shortTextCache[selectedPlatform]?.title || title}
                  content={previewText}
                  tags={shortTextCache[selectedPlatform]?.tags || []}
                  images={shortTextImages}
                  coverImage={shortTextCache[selectedPlatform]?.coverImage}
                  coverSuggestion={shortTextCache[selectedPlatform]?.coverSuggestion}
                />
              )}
            </div>
          )
        }

        {/* 视频平台预览 */}
        {
          isVideoPlatform(selectedPlatform) && (
            <div className="flex-1 flex flex-col p-6">
              {isGeneratingVideo || !content ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    {isGeneratingVideo ? (
                      <div className="flex items-center justify-center space-x-2 text-zinc-400">
                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-sm">生成视频内容中...</span>
                      </div>
                    ) : (
                      <div className="space-y-2 text-zinc-500">
                        <div className="text-3xl">🎬</div>
                        <div className="text-sm">开始输入内容以生成视频素材</div>
                      </div>
                    )}
                  </div>
                </div>
              ) : videoMetadata ? (
                <VideoPreview
                  platform={selectedPlatform}
                  metadata={videoMetadata}
                  title={title}
                  platformInfo={videoPlatforms.find(p => p.id === selectedPlatform)}
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-2 text-zinc-500">
                    <div className="text-3xl">⚠️</div>
                    <div className="text-sm">生成视频内容失败，请重试</div>
                  </div>
                </div>
              )}
            </div>
          )
        }
      </div >
    </div >
  );
}

// 视频平台预览
function VideoPreview({ platform, metadata, title, platformInfo }: {
  platform: Platform;
  metadata: any;
  title: string;
  platformInfo?: { id: Platform; name: string; icon: string; color: string; description: string };
}) {
  if (!platformInfo || !metadata) {
    return null;
  }

  // 复制内容到剪贴板
  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // 这里可以添加toast提示
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
        {/* 视频平台头部 */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-12 h-12 ${platformInfo.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg ring-1 ring-white/20`}>
              {platformInfo.icon}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-white">{platformInfo.name}发布预览</h2>
              <p className="text-sm text-zinc-400 mt-1">{platformInfo.description}</p>
            </div>
            <div className="text-right bg-white/5 px-4 py-2 rounded-lg border border-white/5">
              <div className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">预计时长</div>
              <div className="text-lg font-mono font-semibold text-primary">{metadata.estimatedDuration}秒</div>
            </div>
          </div>
        </div>

        {/* 视频内容区域 */}
        <div className="p-6 space-y-6">
          {/* 标题 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300 flex items-center">
                <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                视频标题
              </h3>
              <button
                onClick={() => copyToClipboard(metadata.title, '标题')}
                className="text-xs px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-md transition-all hover:text-white"
              >
                复制
              </button>
            </div>
            <div className="p-4 bg-black/20 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
              <p className="text-white font-medium text-lg">{metadata.title}</p>
            </div>
          </div>

          {/* 描述 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300 flex items-center">
                <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                视频描述
              </h3>
              <button
                onClick={() => copyToClipboard(metadata.description, '描述')}
                className="text-xs px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-md transition-all hover:text-white"
              >
                复制
              </button>
            </div>
            <div className="p-4 bg-black/20 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
              <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{metadata.description}</p>
            </div>
          </div>

          {/* 标签 */}
          {metadata.tags && metadata.tags.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300 flex items-center">
                  <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                  标签
                </h3>
                <button
                  onClick={() => copyToClipboard(metadata.tags.map((tag: string) => `#${tag}`).join(' '), '标签')}
                  className="text-xs px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-md transition-all hover:text-white"
                >
                  复制全部
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {metadata.tags.map((tag: string, index: number) => (
                  <span key={index} className="px-3 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-sm font-medium hover:bg-primary/20 transition-colors cursor-default">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 封面 */}
          {(metadata.coverImage || metadata.coverImage169 || metadata.coverImage43 || metadata.coverSuggestion) && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-zinc-300 flex items-center">
                  <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                  视频封面
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {platform === 'bilibili' && (metadata.coverImage169 || metadata.coverImage43) ? (
                  <>
                    {metadata.coverImage169 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs text-zinc-500 flex items-center">
                            <Monitor className="w-3 h-3 mr-1" />
                            个人空间封面 (16:9)
                          </span>
                          <button
                            onClick={() => copyToClipboard(metadata.coverImage169, '16:9 封面')}
                            className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5 rounded transition-colors"
                          >复制图片数据</button>
                        </div>
                        <div className="p-2 bg-black/40 rounded-xl border border-white/10 group relative overflow-hidden">
                          <img src={metadata.coverImage169} alt="16:9 封面" className="w-full aspect-video rounded-lg object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-[10px] text-white/80 font-medium">B站个人中心展示建议规格</span>
                          </div>
                        </div>
                      </div>
                    )}
                    {metadata.coverImage43 && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between px-1">
                          <span className="text-xs text-zinc-500 flex items-center">
                            <Smartphone className="w-3 h-3 mr-1" />
                            首页推荐封面 (4:3)
                          </span>
                          <button
                            onClick={() => copyToClipboard(metadata.coverImage43, '4:3 封面')}
                            className="text-[10px] px-2 py-0.5 bg-white/5 hover:bg-white/10 text-zinc-400 border border-white/5 rounded transition-colors"
                          >复制图片数据</button>
                        </div>
                        <div className="p-2 bg-black/40 rounded-xl border border-white/10 group relative overflow-hidden">
                          <img src={metadata.coverImage43} alt="4:3 封面" className="w-full aspect-[4/3] rounded-lg object-cover shadow-2xl transition-transform duration-500 group-hover:scale-105" />
                          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                            <span className="text-[10px] text-white/80 font-medium">B站瀑布流及搜索展示规划</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  metadata.coverImage && (
                    <div className="p-3 bg-black/40 rounded-xl border border-white/10 relative group">
                      <img
                        src={metadata.coverImage}
                        alt="AI生成封面"
                        className="w-full rounded-lg object-cover shadow-sm transition-transform duration-500 group-hover:scale-[1.02]"
                      />
                      <button
                        onClick={() => copyToClipboard(metadata.coverImage, '封面图片')}
                        className="absolute top-5 right-5 text-[10px] px-2 py-1 bg-black/60 backdrop-blur-md text-white border border-white/10 rounded-md opacity-0 group-hover:opacity-100 transition-opacity shadow-xl"
                      >
                        复制
                      </button>
                    </div>
                  )
                )}

                {metadata.coverSuggestion && (
                  <div className={`p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 ${(!metadata.coverImage && !metadata.coverImage169) ? 'col-span-full' : ''}`}>
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 flex-shrink-0">
                        <Palette className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-blue-400 mb-1">封面设计建议</div>
                        <p className="text-sm text-blue-200/80 leading-relaxed italic">"{metadata.coverSuggestion}"</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 口播稿 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-zinc-300 flex items-center">
                <span className="w-1 h-4 bg-primary rounded-full mr-2"></span>
                口播稿
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-xs text-zinc-500 font-mono">{metadata.speechScript?.length || 0} 字</span>
                <button
                  onClick={() => copyToClipboard(metadata.speechScript, '口播稿')}
                  className="text-xs px-2.5 py-1.5 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-md transition-all hover:text-white"
                >
                  复制
                </button>
              </div>
            </div>
            <div className="p-4 bg-black/20 rounded-lg border border-white/5 group hover:border-white/10 transition-colors">
              <p className="text-zinc-400 leading-relaxed whitespace-pre-wrap font-mono text-sm opacity-90">
                {metadata.speechScript}
              </p>
            </div>
          </div>

          {/* 平台建议 */}
          {metadata.platformTips && metadata.platformTips.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-zinc-300 flex items-center">
                <span className="w-1 h-4 bg-yellow-500/80 rounded-full mr-2"></span>
                平台发布建议
              </h3>
              <div className="p-4 bg-yellow-500/5 rounded-lg border border-yellow-500/10">
                <ul className="space-y-3">
                  {metadata.platformTips.map((tip: string, index: number) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-yellow-200/80">
                      <span className="text-yellow-500 mt-0.5">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 短图文平台预览（纯文本）
function ShortTextPreview({ platform, title, content, tags = [], images = [], coverImage, coverSuggestion }: {
  platform: Platform;
  title: string;
  content: string;
  tags?: string[];
  images?: ExtractedImage[];
  coverImage?: string;
  coverSuggestion?: string;
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const platformInfo = PLATFORM_CONFIGS[platform];

  // 合并封面图和正文图片
  const allImages = (() => {
    const list = [...images];
    if (coverImage) {
      // 检查封面图是否已在列表中，不在则插入到第一位
      const hasCover = list.some(img => img.url === coverImage);
      if (!hasCover) {
        list.unshift({ url: coverImage, alt: 'AI生成封面' });
      } else {
        // 如果已在列表中，移动到第一位
        const idx = list.findIndex(img => img.url === coverImage);
        if (idx > 0) {
          const [item] = list.splice(idx, 1);
          list.unshift(item);
        }
      }
    }
    return list;
  })();

  // 切换图片时确保索引有效
  useEffect(() => {
    if (activeImageIndex >= allImages.length) {
      setActiveImageIndex(0);
    }
  }, [allImages.length, activeImageIndex]);

  const limits: Partial<Record<Platform, number>> = {
    wechat_xiaolushu: 1000,
    xiaohongshu_note: 1000,
    weibo: 2000,
    jike: 2000,
    x: 4000,
  };

  const max = limits[platform];
  const charCount = (content || '').length;
  const isOverLimit = typeof max === 'number' && max > 0 && charCount > max;

  // 渲染不同平台的仿真 UI
  const renderMockupContent = () => {
    switch (platform) {
      case 'wechat_xiaolushu':
        return (
          <div className="flex flex-col h-full bg-white text-black font-sans">
            {/* Header */}
            <div className="px-4 h-12 flex items-center justify-between border-b border-gray-50 flex-shrink-0">
              <ChevronLeft className="w-6 h-6 text-gray-800" />
              <span className="font-bold text-[17px]">详情</span>
              <MoreHorizontal className="w-6 h-6 text-gray-800" />
            </div>

            <div className="flex-1 overflow-auto bg-white">
              {/* Media Area */}
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0 group/media">
                {allImages.length > 0 ? (
                  <>
                    <img
                      src={allImages[activeImageIndex].url}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      alt={`预览图片 ${activeImageIndex + 1}`}
                    />

                    {/* Cover Badge */}
                    {coverImage && allImages[activeImageIndex].url === coverImage && (
                      <div className="absolute top-3 left-3 px-2 py-1 bg-primary text-white text-[10px] font-bold rounded shadow-lg z-10">
                        封面图
                      </div>
                    )}

                    {allImages.length > 1 && (
                      <>
                        <div className="absolute inset-y-0 left-0 w-12 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
                            }}
                            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg active:scale-90"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>
                        </div>
                        <div className="absolute inset-y-0 right-0 w-12 flex items-center justify-center opacity-0 group-hover/media:opacity-100 transition-opacity">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
                            }}
                            className="w-8 h-8 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm transition-all shadow-lg active:scale-90"
                          >
                            <ChevronLeft className="w-5 h-5 rotate-180" />
                          </button>
                        </div>
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-1.5 pointer-events-none">
                          {allImages.map((_, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${i === activeImageIndex ? 'bg-white scale-110 shadow-sm' : 'bg-white/40'
                                }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300 gap-2">
                    <Smartphone className="w-12 h-12 stroke-[1.5]" />
                    <span className="text-xs">暂无配图</span>
                  </div>
                )}
              </div>

              {/* Text Content */}
              <div className="p-4 space-y-4 pb-20">
                <div className="flex items-start gap-2.5">
                  <span className="text-[22px] leading-none mt-0.5 whitespace-nowrap">🌱</span>
                  <h1 className="text-[19px] font-bold leading-tight tracking-tight text-gray-900">{title || '无标题'}</h1>
                </div>

                <div className="text-[16.5px] leading-[1.65] whitespace-pre-wrap text-gray-800 tracking-wide font-normal">
                  {content}
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-x-2.5 gap-y-1.5 text-[#576b95] text-[15px] font-medium pt-1">
                    {tags.map((tag, i) => (
                      <span key={i} className="hover:opacity-70 cursor-pointer">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="text-[13px] text-gray-400 pt-2 flex items-center gap-2">
                  <span>刚刚</span>
                  <span>·</span>
                  <span>发布于 字流</span>
                </div>
              </div>
            </div>

            {/* Bottom Fixes Info (Xiaolushu Style) */}
            <div className="px-4 py-3 pb-8 flex items-center gap-3 border-t border-gray-50/50 bg-white/95 backdrop-blur absolute bottom-0 inset-x-0 z-20">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                <User className="w-5 h-5 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-gray-800 truncate">字流AI创作助手</div>
              </div>

              <div className="flex items-center gap-5 pr-1">
                <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-red-500 transition-colors">
                  <Heart className="w-[22px] h-[22px] text-gray-700 hover:text-inherit" />
                  <span className="text-[10px] scale-90 font-medium text-gray-500">赞</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-blue-500 transition-colors text-gray-700">
                  <Send className="w-[22px] h-[22px] text-gray-700 hover:text-inherit" />
                  <span className="text-[10px] scale-90 font-medium text-gray-500">分享</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-amber-500 transition-colors text-gray-700">
                  <Star className="w-[22px] h-[22px] text-gray-700 hover:text-inherit font-bold" />
                  <span className="text-[10px] scale-90 font-medium text-gray-500">推荐</span>
                </div>
                <div className="flex flex-col items-center gap-0.5 cursor-pointer hover:text-green-500 transition-colors text-gray-700">
                  <MessageSquare className="w-[22px] h-[22px] text-gray-700 hover:text-inherit" />
                  <span className="text-[10px] scale-90 font-medium text-gray-500">留言</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'xiaohongshu_note':
        return (
          <div className="flex flex-col h-full bg-white text-black font-sans">
            {/* Header */}
            <div className="px-3 h-14 flex items-center justify-between border-b border-gray-50/50 flex-shrink-0">
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <ChevronLeft className="w-6 h-6 text-gray-800 -ml-1 cursor-pointer" />
                <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 flex-shrink-0">
                  <User className="w-5 h-5 text-gray-300" />
                </div>
                <div className="flex flex-col justify-center min-w-0">
                  <span className="text-[13.5px] font-bold text-gray-900 truncate">字流创作官</span>
                </div>
              </div>
              <div className="flex items-center gap-3.5">
                <button className="px-3.5 py-1.5 bg-[#ff2442] text-white rounded-full text-[13px] font-bold shadow-sm active:scale-95 transition-transform">关注</button>
                <Send className="w-6 h-6 text-gray-700 cursor-pointer" />
              </div>
            </div>

            <div className="flex-1 overflow-auto bg-white">
              {/* Media Area (3:4) */}
              <div className="relative aspect-[3/4] bg-gray-50 overflow-hidden flex-shrink-0 group/media">
                {allImages.length > 0 ? (
                  <>
                    <img
                      src={allImages[activeImageIndex].url}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      alt={`预览图片 ${activeImageIndex + 1}`}
                    />

                    {/* Cover Badge */}
                    {coverImage && allImages[activeImageIndex].url === coverImage && (
                      <div className="absolute top-4 left-4 px-2 py-1 bg-[#ff2442] text-white text-[10px] font-bold rounded shadow-lg z-10">
                        封面
                      </div>
                    )}

                    {allImages.length > 1 && (
                      <>
                        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md text-white px-2.5 py-1 rounded-full text-[10px] font-bold tracking-widest border border-white/10 z-10">
                          {activeImageIndex + 1}/{allImages.length}
                        </div>

                        {/* 仿小红书左右滑动手感 */}
                        <div
                          className="absolute inset-y-0 left-0 w-1/4 flex items-center justify-center z-10 cursor-pointer group/nav-left"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev => (prev > 0 ? prev - 1 : allImages.length - 1));
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-black/10 text-white flex items-center justify-center opacity-0 group-hover/nav-left:opacity-100 transition-opacity backdrop-blur-sm active:scale-90">
                            <ChevronLeft className="w-5 h-5 shadow-sm" />
                          </div>
                        </div>
                        <div
                          className="absolute inset-y-0 right-0 w-1/4 flex items-center justify-center z-10 cursor-pointer group/nav-right"
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveImageIndex(prev => (prev < allImages.length - 1 ? prev + 1 : 0));
                          }}
                        >
                          <div className="w-8 h-8 rounded-full bg-black/10 text-white flex items-center justify-center opacity-0 group-hover/nav-right:opacity-100 transition-opacity backdrop-blur-sm active:scale-90">
                            <ChevronLeft className="w-5 h-5 rotate-180 shadow-sm" />
                          </div>
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-200 gap-3">
                    <Smartphone className="w-14 h-14 stroke-[1]" />
                    <span className="text-xs text-gray-400">精彩配图加载中</span>
                  </div>
                )}
              </div>

              {/* Dots */}
              {allImages.length > 1 && (
                <div className="flex justify-center space-x-1.5 py-3">
                  {allImages.map((_, i) => (
                    <div
                      key={i}
                      className={`w-1 h-1 rounded-full transition-all duration-300 cursor-pointer ${i === activeImageIndex ? 'bg-[#ff2442] scale-125' : 'bg-gray-200'}`}
                      onClick={() => setActiveImageIndex(i)}
                    />
                  ))}
                </div>
              )}

              {/* Text Area */}
              <div className="px-4 py-1 space-y-2.5 pb-24">
                {title && <h1 className="text-[17.5px] font-bold leading-tight text-gray-900 tracking-tight">{title}</h1>}
                <div className="text-[15.5px] leading-relaxed whitespace-pre-wrap text-gray-800 tracking-normal font-normal overflow-hidden">
                  {content}
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-x-2 gap-y-1 text-[#3b669b] text-[15px] pt-1">
                    {tags.map((tag, i) => (
                      <span key={i} className="hover:bg-blue-50/50 cursor-pointer">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="text-[12.5px] text-gray-400 py-4 flex flex-col gap-1">
                  <span>2024-05-20 字流发布</span>
                  <div className="w-full h-px bg-gray-50 mt-2" />
                </div>
              </div>
            </div>

            {/* Footer Bar */}
            <div className="px-3.5 py-3 pb-8 flex items-center justify-between border-t border-gray-50 bg-white/95 backdrop-blur absolute bottom-0 inset-x-0 z-20">
              <div className="flex-1 mr-4 bg-gray-100 rounded-full px-4 py-2 text-[14px] text-gray-400 flex items-center gap-2 cursor-text active:bg-gray-200 transition-colors">
                <Palette className="w-4 h-4 text-gray-400" />
                说点什么...
              </div>
              <div className="flex items-center gap-5 text-gray-600">
                <div className="flex flex-col items-center gap-0 cursor-pointer active:scale-90 transition-transform">
                  <Heart className="w-[23px] h-[23px] text-gray-700" />
                  <span className="text-[10px] pt-0.5 font-bold">1.2w</span>
                </div>
                <div className="flex flex-col items-center gap-0 cursor-pointer active:scale-90 transition-transform">
                  <Bookmark className="w-[23px] h-[23px] text-gray-700" />
                  <span className="text-[10px] pt-0.5 font-bold">3.4w</span>
                </div>
                <div className="flex flex-col items-center gap-0 cursor-pointer active:scale-90 transition-transform">
                  <MessageSquare className="w-[23px] h-[23px] text-gray-700" />
                  <span className="text-[10px] pt-0.5 font-bold">567</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'weibo':
      case 'jike':
        const isWeibo = platform === 'weibo';
        return (
          <div className={`flex flex-col h-full ${isWeibo ? 'bg-[#f2f2f2]' : 'bg-white'} text-black font-sans px-3 pt-2`}>
            {/* User Header */}
            <div className="flex items-center gap-3 mb-3 px-1">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-gray-100 to-gray-200 border border-gray-100 flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-gray-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className={`text-[15px] font-bold ${isWeibo ? 'text-orange-500' : 'text-gray-900'} truncate`}>
                  {isWeibo ? '字流官方微博' : '即刻创作者-字流'}
                </div>
                <div className="text-[11.5px] text-gray-400 flex items-center gap-1.5">
                  <span>刚刚</span>
                  <span>·</span>
                  <span>来自 字流创作平台</span>
                </div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex-1 overflow-auto bg-white rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-4">
              <div className="p-4 space-y-4">
                <div className="text-[16px] leading-[1.6] whitespace-pre-wrap text-gray-800">
                  {content}
                </div>

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-[#4c8dc3] text-[15px]">
                    {tags.map((tag, i) => (
                      <span key={i}>#{tag}#</span>
                    ))}
                  </div>
                )}

                {/* Weibo Grid / Jike List */}
                {images.length > 0 && (
                  <div className={`grid ${images.length === 1 ? 'grid-cols-1' : images.length <= 4 ? 'grid-cols-2' : 'grid-cols-3'} gap-1.5 pt-1`}>
                    {images.slice(0, 9).map((img, i) => (
                      <div key={i} className={`relative rounded-md overflow-hidden bg-gray-50 ${images.length === 1 ? 'aspect-video' : 'aspect-square'}`}>
                        <img src={img.url} className="w-full h-full object-cover" alt="微博图片" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Interaction Bar */}
              <div className="flex items-center justify-between border-t border-gray-50/50 h-11 px-6">
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Send className="w-5 h-5" />
                  <span className="text-xs font-medium">分享</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <MessageSquare className="w-5 h-5" />
                  <span className="text-xs font-medium">评论</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400">
                  <Heart className="w-5 h-5" />
                  <span className="text-xs font-medium">点赞</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 'x':
        return (
          <div className="flex flex-col h-full bg-black text-white font-sans px-4 pt-3">
            {/* X Header */}
            <div className="flex items-start gap-3 mb-2">
              <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700/50 flex-shrink-0">
                <span className="font-bold text-lg">𝕏</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 min-w-0">
                  <span className="font-bold text-[15.5px] truncate">字流 | Ziliu.AI</span>
                  <div className="w-4 h-4 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <svg viewBox="0 0 24 24" className="w-2.5 h-2.5 text-white fill-current"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" /></svg>
                  </div>
                </div>
                <div className="text-[14.5px] text-zinc-500 min-w-0 truncate">@ZiliuAI · 1m</div>
              </div>
              <MoreHorizontal className="w-5 h-5 text-zinc-500" />
            </div>

            <div className="flex-1 overflow-auto bg-black">
              <div className="space-y-4">
                <div className="text-[16px] leading-[1.4] whitespace-pre-wrap text-zinc-100 tracking-normal">
                  {content}
                  <div className="text-primary mt-2">
                    {tags.map(tag => `#${tag} `)}
                  </div>
                </div>

                {/* X Image Layout */}
                {images.length > 0 && (
                  <div className={`rounded-2xl border border-zinc-800 overflow-hidden grid ${images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'} gap-[2px]`}>
                    {images.slice(0, 4).map((img, i) => (
                      <div key={i} className={`bg-zinc-900 ${images.length === 1 ? 'max-h-[512px]' : images.length === 3 && i === 0 ? 'row-span-2 aspect-[9/16]' : 'aspect-square'}`}>
                        <img src={img.url} className="w-full h-full object-cover" alt="X Post" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="text-[14.5px] text-zinc-500 flex items-center gap-1.5 py-1">
                  <span>10:30 PM · May 20, 2024</span>
                  <span>·</span>
                  <span className="text-white font-bold">12.5K</span>
                  <span>Views</span>
                </div>

                <div className="border-y border-zinc-800 flex items-center justify-between h-12 px-2 text-zinc-500">
                  <MessageSquare className="w-[19px] h-[19px] hover:text-primary transition-colors cursor-pointer" />
                  <div className="flex items-center gap-1.5 group cursor-pointer">
                    <div className="p-2 group-hover:bg-green-500/10 rounded-full transition-colors">
                      <svg viewBox="0 0 24 24" className="w-[19px] h-[19px] fill-current group-hover:text-green-500"><path d="M4.5 3.88l4.4 9.29L3 21h18l-5.9-7.83 4.4-9.29H4.5zm2.85 2h7.3l-3.65 7.71-3.65-7.71z" /></svg>
                    </div>
                    <span className="text-xs group-hover:text-green-500 transition-colors">128</span>
                  </div>
                  <div className="flex items-center gap-1.5 group cursor-pointer">
                    <div className="p-2 group-hover:bg-pink-500/10 rounded-full transition-colors">
                      <Heart className="w-[19px] h-[19px] group-hover:text-pink-500 transition-colors" />
                    </div>
                    <span className="text-xs group-hover:text-pink-500 transition-colors">2K</span>
                  </div>
                  <Bookmark className="w-[19px] h-[19px] hover:text-primary transition-colors cursor-pointer" />
                  <Share2 className="w-[19px] h-[19px] hover:text-primary transition-colors cursor-pointer" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        // 后备基础预览
        return (
          <div className="p-6 bg-white text-black h-full overflow-auto">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div className="whitespace-pre-wrap mb-4">{content}</div>
            <div className="flex flex-wrap gap-2 mb-6">
              {tags.map((tag, i) => <span key={i} className="text-blue-500">#{tag}</span>)}
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2">
                {images.map((img, i) => <img key={i} src={img.url} className="rounded-lg shadow-sm" alt="Preview img" />)}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-4">
      {/* 仿真手机框架 */}
      <div className="relative group">
        <div className="w-[390px] h-[844px] bg-[#1a1a1a] rounded-[55px] p-3 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(0,0,0,0.3)] ring-1 ring-white/10 ring-inset relative">
          {/* 外部物理按钮 */}
          <div className="absolute -left-1.5 top-28 w-1 h-12 bg-zinc-800 rounded-l-md border-r border-black/20" />
          <div className="absolute -left-1.5 top-44 w-1 h-16 bg-zinc-800 rounded-l-md border-r border-black/20" />
          <div className="absolute -left-1.5 top-64 w-1 h-16 bg-zinc-800 rounded-l-md border-r border-black/20" />
          <div className="absolute -right-1.5 top-44 w-1 h-24 bg-zinc-800 rounded-r-md border-l border-black/20" />

          {/* 屏幕内框 */}
          <div className="w-full h-full rounded-[45px] overflow-hidden bg-white relative flex flex-col shadow-inner">
            {/* 灵动岛 */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-[100] flex items-center justify-between px-4 ring-1 ring-white/10">
              <div className="w-2 h-2 rounded-full bg-[#1c1c1e] shadow-[0_0_10px_rgba(0,0,0,0.5)]" />
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500/80 animate-pulse" />
                <div className="w-1 h-1 rounded-full bg-white/20" />
              </div>
            </div>

            {/* 状态栏 */}
            <div className={`flex-shrink-0 h-10 flex items-center justify-between px-8 pt-2 relative z-[90] ${platform === 'x' ? 'text-white' : 'text-black'}`}>
              <div className="text-[14px] font-bold">9:41</div>
              <div className="flex items-center gap-1.5 h-3">
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M12.01 21.49L23.64 7c-.45-.34-4.93-4-11.64-4C5.28 3 .81 6.66.36 7l11.63 14.49.01.01.01-.01z" /></svg>
                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current"><path d="M2 22h20V2z" /></svg>
                <div className="w-6 h-3 border border-current rounded-sm relative px-0.5 flex items-center">
                  <div className="h-1.5 w-3 bg-current rounded-sm" />
                </div>
              </div>
            </div>

            {/* 各平台独特 UI 内容 */}
            <div className="flex-1 overflow-hidden relative">
              {renderMockupContent()}
            </div>

            {/* 底部指示条 */}
            <div className={`h-6 flex-shrink-0 flex items-center justify-center relative z-[90] ${platform === 'x' ? 'bg-black' : 'bg-white'}`}>
              <div className={`w-36 h-1 rounded-full ${platform === 'x' ? 'bg-white/30' : 'bg-black/10'}`} />
            </div>
          </div>
        </div>
      </div>

      {/* 底部信息标签 */}
      <div className="flex flex-col items-center gap-2">
        <div className="bg-zinc-800/80 backdrop-blur-xl border border-white/5 py-2 px-5 rounded-2xl shadow-2xl flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full animate-pulse ${isOverLimit ? 'bg-red-500' : 'bg-green-500'}`} />
          <span className="text-zinc-200 text-sm font-medium">
            iPhone 14 Pro 预览 · {platformInfo.name}
          </span>
          <span className="text-zinc-500">|</span>
          <span className={`text-sm font-mono ${isOverLimit ? 'text-red-400' : 'text-zinc-400'}`}>
            {max ? `${charCount}/${max}` : charCount} 字
          </span>
        </div>
        {isOverLimit && (
          <p className="text-xs text-red-500/80 font-medium">⚠️ 注意：内容超过平台限制</p>
        )}
      </div>
    </div>
  );
}

function Share2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      ```
    </svg>
  );
}

// 微信公众号预览
function WechatPreview({
  title,
  content,
  selectedStyle,
  wechatTheme,
  onThemeChange
}: {
  title: string;
  content: string;
  selectedStyle: string;
  wechatTheme: 'day' | 'night';
  onThemeChange: (theme: 'day' | 'night') => void;
}) {
  // 自动根据选中的样式切换设备预览的黑白模式
  useEffect(() => {
    if (selectedStyle === 'night') {
      onThemeChange('night');
    }
    // 移除自动切回day的逻辑，允许用户手动覆盖
  }, [selectedStyle, onThemeChange]);

  const isNight = wechatTheme === 'night';

  // 从主题中提取背景色
  const theme = WECHAT_STYLES[selectedStyle as keyof typeof WECHAT_STYLES] || WECHAT_STYLES.default;
  const rootStyle = isNight ? (theme.rootStyleDark || theme.rootStyle) : theme.rootStyle;
  
  // 解析背景色
  let themeBgColor = '';
  if (rootStyle) {
    const bgMatch = rootStyle.match(/background(?:-color)?:\s*([^;]+)/i);
    if (bgMatch) {
      themeBgColor = bgMatch[1].trim();
    }
  }

  return (
    <div
      className={`p-6 flex flex-col items-center justify-center gap-6 min-h-full bg-transparent`}
    >
      {/* 日/夜模式切换（仅影响预览，不影响导出） */}
      <div
        className={`inline-flex items-center rounded-xl border p-1 shadow-sm backdrop-blur ${isNight ? 'bg-black/30 border-white/10' : 'bg-white/80 border-gray-200'
          }`}
      >
        <button
          type="button"
          onClick={() => onThemeChange('day')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${wechatTheme === 'day'
            ? isNight
              ? 'bg-white/20 text-white'
              : 'bg-gray-900 text-white'
            : isNight
              ? 'text-white/60 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
            }`}
          aria-pressed={wechatTheme === 'day'}
        >
          <Sun className="h-3.5 w-3.5" />
          日间
        </button>
        <button
          type="button"
          onClick={() => onThemeChange('night')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${wechatTheme === 'night'
            ? isNight
              ? 'bg-white/20 text-white'
              : 'bg-gray-900 text-white'
            : isNight
              ? 'text-white/60 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
            }`}
          aria-pressed={wechatTheme === 'night'}
        >
          <Moon className="h-3.5 w-3.5" />
          夜间
        </button>
      </div>

      {/* iPhone 样机 */}
      <div className="relative">
        <div className="w-[390px] h-[844px] bg-black rounded-[60px] p-2 shadow-2xl">
          <div
            className={`w-full h-full rounded-[48px] overflow-hidden flex flex-col relative ${isNight ? 'bg-[#1c1c1e]' : 'bg-white'
              }`}
          >
            {/* 动态岛 */}
            <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-8 bg-black rounded-full z-10"></div>

            {/* 状态栏 */}
            <div className={`h-12 flex items-center justify-between px-6 pt-4 transition-colors duration-300 ${isNight ? 'bg-[#121212]' : 'bg-white'}`}>
              <div className={`text-sm font-semibold ${isNight ? 'text-white' : 'text-black'}`}>9:41</div>
              <div className="flex items-center space-x-1">
                <div className="flex space-x-1">
                  <div className={`w-1 h-3 rounded-full ${isNight ? 'bg-white' : 'bg-black'}`}></div>
                  <div className={`w-1 h-4 rounded-full ${isNight ? 'bg-white' : 'bg-black'}`}></div>
                  <div className={`w-1 h-5 rounded-full ${isNight ? 'bg-white' : 'bg-black'}`}></div>
                  <div className={`w-1 h-6 rounded-full ${isNight ? 'bg-white' : 'bg-black'}`}></div>
                </div>
                <svg className={`w-4 h-4 ${isNight ? 'text-white' : 'text-black'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.166 4.999c5.208-5.208 13.651-5.208 18.859 0a.833.833 0 1 1-1.178 1.178c-4.375-4.375-11.471-4.375-15.846 0a.833.833 0 0 1-1.178-1.178z" />
                  <path d="M5.01 7.844c3.125-3.125 8.195-3.125 11.32 0a.833.833 0 1 1-1.178 1.178c-2.292-2.292-6.014-2.292-8.306 0a.833.833 0 0 1-1.178-1.178z" />
                  <path d="M7.854 10.688c1.042-1.042 2.734-1.042 3.776 0a.833.833 0 1 1-1.178 1.178.833.833 0 0 0-1.178 0 .833.833 0 0 1-1.178-1.178z" />
                  <circle cx="10" cy="15" r="1.5" />
                </svg>
                <div className="flex items-center">
                  <div className={`w-6 h-3 border rounded-sm relative ${isNight ? 'border-white/80' : 'border-black'}`}>
                    <div className="w-4 h-1.5 bg-green-500 rounded-sm absolute top-0.5 left-0.5"></div>
                  </div>
                  <div className={`w-0.5 h-1.5 rounded-r-sm ml-0.5 ${isNight ? 'bg-white/80' : 'bg-black'}`}></div>
                </div>
              </div>
            </div>

            {/* 微信公众号头部 */}
            <div
              className={`border-b px-4 py-3 flex items-center transition-colors duration-300 ${isNight ? 'border-white/10' : 'border-gray-100'}`}
              style={themeBgColor ? { backgroundColor: themeBgColor } : { backgroundColor: isNight ? '#121212' : 'white' }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-[#2a80ff] to-secondary text-white shadow-[0_14px_36px_-18px_rgba(0,102,255,0.65)]">
                <span className="text-sm font-semibold">Z</span>
              </div>
              <div className="ml-3 flex-1">
                <div className={`text-base font-medium break-words whitespace-normal ${isNight ? 'text-white' : 'text-gray-900'}`}>
                  {title || '字流'}
                </div>
                <div className={`text-xs ${isNight ? 'text-white/60' : 'text-gray-500'}`}>刚刚</div>
              </div>
              <div className="flex items-center space-x-3">
                <svg className={`w-5 h-5 ${isNight ? 'text-white/40' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h.01M12 12h.01M19 12h.01" />
                </svg>
              </div>
            </div>

            {/* 文章内容区域 */}
            <div 
              className="flex-1 overflow-auto transition-colors duration-300"
              style={themeBgColor ? { backgroundColor: themeBgColor } : { backgroundColor: isNight ? '#0F172A' : 'white' }}
            >
              <div className="px-4 py-4">
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>

            {/* 底部安全区域 */}
            <div 
              className="h-8 transition-colors duration-300"
              style={themeBgColor ? { backgroundColor: themeBgColor } : { backgroundColor: isNight ? '#121212' : 'white' }}
            ></div>
          </div>
        </div>

        {/* 手机标签 */}
        <div className={`absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-medium ${isNight ? 'text-white/60' : 'text-gray-500'}`}>
          iPhone 14 Pro 预览 · {isNight ? '夜间' : '日间'}
        </div>
      </div>
    </div>
  );
}

// 知乎预览
function ZhihuPreview({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
        {/* 知乎头部 */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              知
            </div>
            <div>
              <div className="font-medium text-white">字流</div>
              <div className="text-sm text-zinc-500">刚刚发布</div>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{title || '文章标题'}</h1>
        </div>

        {/* 文章内容 */}
        <div className="p-6">
          <div
            className="zhihu-content prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center space-x-6">
          <button className="flex items-center space-x-2 text-zinc-500 hover:text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V9a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2.61l.69.83L10 18h4m-7-10v2m0-2V9a2 2 0 012-2h2a2 2 0 012 2v1" />
            </svg>
            <span>赞同</span>
          </button>
          <button className="flex items-center space-x-2 text-zinc-500 hover:text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>评论</span>
          </button>
          <button className="flex items-center space-x-2 text-zinc-500 hover:text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>分享</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// 掘金预览
function JuejinPreview({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-6 h-full flex flex-col">
      <div className="max-w-4xl mx-auto w-full bg-white/5 rounded-xl border border-white/10 backdrop-blur-sm">
        {/* 掘金头部 */}
        <div className="p-6 border-b border-white/5">
          <h1 className="text-3xl font-bold text-white mb-4">{title || '文章标题'}</h1>
          <div className="flex items-center space-x-4 text-sm text-zinc-500">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                掘
              </div>
              <span className="text-zinc-300">字流</span>
            </div>
            <span>·</span>
            <span>刚刚</span>
            <span>·</span>
            <span>阅读 1</span>
          </div>
        </div>

        {/* 文章内容 */}
        <div className="p-6">
          <div
            className="juejin-content prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* 底部操作栏 */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 text-zinc-500 hover:text-red-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>点赞</span>
            </button>
            <button className="flex items-center space-x-2 text-zinc-500 hover:text-blue-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <span>评论</span>
            </button>
          </div>
          <button className="flex items-center space-x-2 text-zinc-500 hover:text-blue-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
            <span>分享</span>
          </button>
        </div>
      </div>
    </div>
  );
}


// 知识星球预览
function ZsxqPreview({ title, content }: { title: string; content: string }) {
  return (
    <div className="p-6 h-full flex flex-col items-center">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* 知识星球头部 */}
        <div className="px-5 pt-5 pb-3 border-b border-gray-100">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold shadow-sm">
              星
            </div>
            <div>
              <div className="font-semibold text-gray-900 text-[15px]">字流</div>
              <div className="text-xs text-gray-400">刚刚发布</div>
            </div>
          </div>
          {title && <h1 className="text-lg font-bold text-gray-900 leading-snug">{title}</h1>}
        </div>

        {/* 文章内容 - 白底渲染，内联样式直接生效 */}
        <div className="px-5 py-4">
          <div
            className="w-full"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>

        {/* 底部操作栏 */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center space-x-8">
          <button className="flex items-center space-x-1.5 text-gray-400 hover:text-yellow-500 transition-colors">
            <Heart className="w-[18px] h-[18px]" />
            <span className="text-sm">赞</span>
          </button>
          <button className="flex items-center space-x-1.5 text-gray-400 hover:text-yellow-500 transition-colors">
            <MessageSquare className="w-[18px] h-[18px]" />
            <span className="text-sm">评论</span>
          </button>
          <button className="flex items-center space-x-1.5 text-gray-400 hover:text-yellow-500 transition-colors">
            <Star className="w-[18px] h-[18px]" />
            <span className="text-sm">收藏</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// A/B 标题生成结果类型
type ABTitle = {
  text: string;
  reason: string;
};

// 智能发布助手组件
function SmartPublishBar({ platform, content, title }: { platform: Platform; content: string; title: string }) {
  const [showIssues, setShowIssues] = useState(false);
  const [showTitleOptimizer, setShowTitleOptimizer] = useState(false);
  const [showTraffic, setShowTraffic] = useState(false);
  const [isGeneratingTitles, setIsGeneratingTitles] = useState(false);
  const [abTitles, setAbTitles] = useState<ABTitle[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedTrafficIdx, setCopiedTrafficIdx] = useState<number | null>(null);

  // 获取发布时间评估
  const timeInfo = getPublishTimeInfo(platform);

  // 合规检查（对标题+正文）
  const textToCheck = `${title || ''}\n${content || ''}`;
  const issues = content.trim() ? checkCompliance(textToCheck, platform) : [];
  const forbiddenCount = issues.filter(i => i.type === 'forbidden').length;
  const warningCount = issues.filter(i => i.type === 'warning').length;
  const infoCount = issues.filter(i => i.type === 'info').length;
  const hasIssues = issues.length > 0;

  // 安全引流模板
  const trafficTemplates = getTrafficTemplates(platform);
  const hasTrafficTemplates = trafficTemplates.length > 0;

  const copyTrafficTemplate = async (text: string, idx: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTrafficIdx(idx);
      setTimeout(() => setCopiedTrafficIdx(null), 1500);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const trafficRiskLabel = (risk: TrafficTemplate['risk']) => {
    switch (risk) {
      case 'safe': return '🟢 安全';
      case 'moderate': return '🟡 中等';
      case 'risky': return '🔴 高风险';
    }
  };

  const trafficRiskColor = (risk: TrafficTemplate['risk']) => {
    switch (risk) {
      case 'safe': return 'text-green-400 border-green-500/20 bg-green-500/10';
      case 'moderate': return 'text-amber-400 border-amber-500/20 bg-amber-500/10';
      case 'risky': return 'text-red-400 border-red-500/20 bg-red-500/10';
    }
  };

  // A/B 标题生成
  const generateABTitles = async () => {
    if (!title.trim()) return;
    setIsGeneratingTitles(true);
    setAbTitles([]);
    setCopiedIndex(null);
    try {
      const response = await fetch('/api/title/ab-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          title,
          content: content?.slice(0, 500) || '',
        }),
      });
      const data: any = await response.json();
      if (data?.success && data.data?.titles) {
        setAbTitles(data.data.titles);
      } else {
        console.error('标题生成失败:', data?.error);
      }
    } catch (error) {
      console.error('标题生成出错:', error);
    } finally {
      setIsGeneratingTitles(false);
    }
  };

  // 复制标题到剪贴板
  const copyTitle = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  if (!content.trim()) return null;

  return (
    <div className="mt-3 space-y-2">
      {/* 时间 + 合规 + 标题优化 一行显示 */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* 左侧: 发布时间指示 */}
        <div className="flex items-center gap-2 text-xs">
          <Clock className="h-3.5 w-3.5 text-zinc-500" />
          <span className={
            timeInfo.status === 'best' ? 'text-green-400' :
            timeInfo.status === 'good' ? 'text-yellow-400' :
            'text-zinc-500'
          }>
            {timeInfo.suggestion}
          </span>
        </div>

        {/* 右侧: 安全引流 + 标题优化 + 合规 */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 安全引流按钮 */}
          {hasTrafficTemplates && (
            <button
              onClick={() => {
                setShowTraffic(!showTraffic);
                if (!showTraffic) { setShowIssues(false); setShowTitleOptimizer(false); }
              }}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                showTraffic
                  ? 'text-primary border-primary/30 bg-primary/10'
                  : 'text-zinc-400 border-white/10 bg-white/5 hover:bg-white/10 hover:text-zinc-200'
              }`}
            >
              <Link className="h-3.5 w-3.5" />
              <span>🔗 安全引流</span>
              <span className="text-[10px] opacity-60">{showTraffic ? '▲' : '▼'}</span>
            </button>
          )}

          {/* 标题优化按钮 */}
          {title.trim() && (
            <button
              onClick={() => {
                setShowTitleOptimizer(!showTitleOptimizer);
                if (!showTitleOptimizer) { setShowTraffic(false); setShowIssues(false); }
                if (!showTitleOptimizer && abTitles.length === 0 && !isGeneratingTitles) {
                  generateABTitles();
                }
              }}
              disabled={isGeneratingTitles}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                showTitleOptimizer
                  ? 'text-amber-400 border-amber-500/30 bg-amber-500/15'
                  : 'text-zinc-400 border-white/10 bg-white/5 hover:bg-white/10 hover:text-zinc-200'
              }`}
            >
              {isGeneratingTitles ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Wand2 className="h-3.5 w-3.5" />
              )}
              <span>✨ 标题优化</span>
            </button>
          )}

          {/* 合规检查状态 */}
          {hasIssues ? (
            <button
              onClick={() => {
                setShowIssues(!showIssues);
                if (!showIssues) { setShowTraffic(false); setShowTitleOptimizer(false); }
              }}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-colors ${
                forbiddenCount > 0
                  ? 'text-red-400 border-red-500/20 bg-red-500/10 hover:bg-red-500/20'
                  : warningCount > 0
                    ? 'text-amber-400 border-amber-500/20 bg-amber-500/10 hover:bg-amber-500/20'
                    : 'text-blue-400 border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20'
              }`}
            >
              {forbiddenCount > 0 ? (
                <AlertTriangle className="h-3.5 w-3.5" />
              ) : (
                <Info className="h-3.5 w-3.5" />
              )}
              <span>
                {forbiddenCount > 0 && `${forbiddenCount}项违规`}
                {forbiddenCount > 0 && warningCount > 0 && ' · '}
                {warningCount > 0 && `${warningCount}项警告`}
                {forbiddenCount === 0 && warningCount === 0 && infoCount > 0 && `${infoCount}项提示`}
              </span>
              <span className="text-[10px] opacity-60">{showIssues ? '▲' : '▼'}</span>
            </button>
          ) : content.trim() ? (
            <div className="flex items-center gap-1.5 text-xs text-green-400">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>内容合规</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* A/B 标题优化面板 */}
      {showTitleOptimizer && (
        <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
              <Wand2 className="h-3.5 w-3.5" />
              <span>A/B 标题方案</span>
            </div>
            <button
              onClick={generateABTitles}
              disabled={isGeneratingTitles}
              className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded border border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isGeneratingTitles ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Sparkles className="h-3 w-3" />
              )}
              <span>{isGeneratingTitles ? '生成中...' : '重新生成'}</span>
            </button>
          </div>

          {isGeneratingTitles && abTitles.length === 0 ? (
            <div className="flex items-center justify-center py-4 text-xs text-zinc-500">
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              正在为「{PLATFORM_CONFIGS[platform]?.name || platform}」生成优化标题...
            </div>
          ) : abTitles.length > 0 ? (
            <div className="space-y-2">
              {abTitles.map((item, index) => (
                <div
                  key={index}
                  className="p-2.5 rounded-md border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-bold text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded">
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-sm text-zinc-200 font-medium break-all">{item.text}</span>
                      </div>
                      <p className="text-[11px] text-zinc-500 leading-relaxed pl-6">{item.reason}</p>
                    </div>
                    <button
                      onClick={() => copyTitle(item.text, index)}
                      className="flex-shrink-0 flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-white/10 bg-white/5 text-zinc-400 hover:bg-primary/20 hover:text-primary hover:border-primary/30 transition-all opacity-70 group-hover:opacity-100"
                    >
                      {copiedIndex === index ? (
                        <>
                          <Check className="h-3 w-3 text-green-400" />
                          <span className="text-green-400">已复制</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>选用</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-xs text-zinc-500">
              点击"重新生成"获取标题优化方案
            </div>
          )}
        </div>
      )}

      {/* 展开的问题详情 */}
      {showIssues && issues.length > 0 && (
        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] space-y-1.5 max-h-40 overflow-auto">
          {issues.map((issue, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs">
              <span className="mt-0.5 flex-shrink-0">
                {issue.type === 'forbidden' ? '🔴' : issue.type === 'warning' ? '🟡' : '🔵'}
              </span>
              <span className={
                issue.type === 'forbidden' ? 'text-red-400' :
                issue.type === 'warning' ? 'text-amber-400' :
                'text-blue-400'
              }>
                <span className="font-medium">「{issue.keyword}」</span>
                {' '}{issue.message}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 展开的安全引流模板 */}
      {showTraffic && trafficTemplates.length > 0 && (
        <div className="p-3 rounded-lg border border-white/5 bg-white/[0.02] space-y-2 max-h-64 overflow-auto">
          {trafficTemplates.map((tpl, idx) => (
            <div key={idx} className="flex flex-col gap-1.5 p-2.5 rounded-md bg-white/[0.03] border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-medium text-zinc-200">{tpl.method}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${trafficRiskColor(tpl.risk)}`}>
                  {trafficRiskLabel(tpl.risk)}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <span className="flex-1 text-xs text-zinc-400 leading-relaxed break-all">
                  {tpl.template}
                </span>
                <button
                  onClick={() => copyTrafficTemplate(tpl.template, idx)}
                  className="flex-shrink-0 flex items-center gap-1 text-[10px] px-2 py-1 rounded border border-white/10 bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="复制文案"
                >
                  {copiedTrafficIdx === idx ? (
                    <>
                      <Check className="h-3 w-3 text-green-400" />
                      <span className="text-green-400">已复制</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3 w-3" />
                      <span>复制</span>
                    </>
                  )}
                </button>
              </div>
              <div className="text-[10px] text-zinc-600 leading-relaxed">
                💡 {tpl.note}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
