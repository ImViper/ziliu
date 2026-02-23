(()=>{var a={};a.id=3906,a.ids=[3906],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},46843:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>G,patchFetch:()=>F,routeModule:()=>B,serverHooks:()=>E,workAsyncStorage:()=>C,workUnitAsyncStorage:()=>D});var d={};c.r(d),c.d(d,{POST:()=>A});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(50639),w=c(14250);let x=v.Ik({platform:v.k5(["wechat","zhihu","juejin","xiaohongshu_note","douyin","bilibili","x","weibo","jike","zsxq","wechat_xiaolushu","video_wechat","xiaohongshu","youtube","linkedin"]),title:v.Yj().min(1,"标题不能为空"),content:v.Yj().optional()}),y={wechat:`公众号标题规则：
- 长度 ≤ 64 字
- 制造悬念感、好奇心驱动
- 可用数字、反常识、痛点共鸣
- 避免标题党但要有点击欲望
- 示例风格："为什么90%的人都不知道这个方法？"`,zhihu:`知乎标题规则：
- 问答式或干货型标题
- 可以用"如何…""为什么…""…是怎样的体验"等句式
- 体现专业度和深度
- 示例风格："如何从零开始掌握XXX？这篇指南够用了"`,juejin:`掘金标题规则：
- 技术关键词前置
- 格式参考："技术词 | 具体内容描述"
- 突出实战、源码、原理等技术深度
- 示例风格："React 18 并发模式：从源码理解 Suspense 的工作原理"`,xiaohongshu_note:`小红书标题规则：
- 6-20 字
- 可加 1-2 个 emoji
- 关键词前置
- 有场景感/结果感/数字
- 格式参考："关键词｜具体利益点"
- 示例风格："用了3个月🔥终于搞懂了这个方法"`,douyin:`抖音标题规则：
- ≤ 20 字
- 黄金3秒钩子：开头就要抓住注意力
- 口语化、有冲突感
- 适合朗读、节奏感强
- 示例风格："别再这样做了！90%的人都踩过这个坑"`,bilibili:`B站标题规则：
- 可使用【】方括号格式突出关键词
- 融入B站黑话/梗文化
- 有吸引力但不过度标题党
- 示例风格："【干货】从零到一的完整攻略，看完直接起飞！"`,x:`X/Twitter 标题规则：
- English-friendly，如果原标题是中文也生成中英各有的方案
- Hook first — 前几个词就要吸引眼球
- 简洁有力，适合社交传播
- 示例风格："This changed how I think about XXX. Here's why 👇"`,weibo:`微博标题规则：
- 简短有力，观点鲜明
- 口语化，有传播性
- 适当加入话题感
- 示例风格："说真的，这件事很多人都想错了"`,jike:`即刻标题规则：
- 真诚、个人化的分享口吻
- 创业者/产品经理/开发者视角
- 有见解、有数据
- 示例风格："分享一个我用了3年的工作流，效率翻倍"`,zsxq:`知识星球标题规则：
- 干货导向，体现价值
- 适合付费内容的标题风格
- 突出独家、深度、实操
- 示例风格："深度复盘：从0到10万用户的增长策略（含数据）"`,wechat_xiaolushu:`小绿书标题规则：
- 6-20 字
- 类似小红书但更文艺
- 纯文字风格，不加emoji
- 示例风格："终于找到最适合自己的方法了"`,video_wechat:`视频号标题规则：
- ≤ 30 字
- 口语化，适合视频内容
- 有悬念或结果导向
- 示例风格："这个方法我用了3年，今天终于分享出来"`,xiaohongshu:`小红书视频标题规则：
- 6-20 字，关键词前置
- 可加 1-2 个 emoji
- 有场景感和结果感
- 示例风格："3分钟学会🔥这个效果太绝了"`,linkedin:"第一行即 hook，≤100字符，专业+洞察感。用问句/数据/反常识开头。避免 clickbait。",youtube:`YouTube 标题规则：
- English-friendly
- 包含搜索关键词
- 有好奇心驱动或价值承诺
- 示例风格："How I Built XXX in 30 Days (Step by Step Guide)"`},z=v.Ik({titles:v.YO(v.Ik({text:v.Yj().min(1),reason:v.Yj().min(1)})).min(1).max(5)});async function A(a){try{let b=await a.json(),{platform:c,title:d,content:e}=x.parse(b),f=process.env.OPENROUTER_API_KEY;if(!f)return u.NextResponse.json({success:!1,error:"AI 服务未配置"},{status:500});let g=y[c]||"通用标题：简洁有力，突出核心价值",h=e?e.slice(0,500):"",i=`你是一个内容平台标题优化专家。请根据以下信息，为指定平台生成 3 个优化后的备选标题（A/B/C方案）。

当前平台：${c}

${g}

原始标题：
${d}

${h?`正文摘要（仅供理解主题，不要照搬）：
${h}`:""}

要求：
1. 生成 3 个不同风格/角度的备选标题
2. 每个标题都要符合上述平台规则
3. 3 个标题之间要有明显差异（不同切入角度、不同表达手法）
4. 为每个标题附上简短的优化理由（1-2句话说明为什么这样改）

输出必须是严格 JSON（不要有任何额外文字）：
{"titles":[{"text":"标题A","reason":"理由A"},{"text":"标题B","reason":"理由B"},{"text":"标题C","reason":"理由C"}]}`,j=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${f}`,"HTTP-Referer":process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000","X-Title":"Ziliu AB Title Generation"},body:JSON.stringify({model:"openai/gpt-4o-mini",messages:[{role:"user",content:i}],max_tokens:600,temperature:.9,top_p:1})});if(!j.ok)throw Error(`OpenRouter API error: ${j.status}`);let k=await j.json(),l=k.choices?.[0]?.message?.content?.trim();if(!l)throw Error("AI 返回空内容");let m=function(a){try{return JSON.parse(a)}catch{}let b=a.indexOf("{"),c=a.lastIndexOf("}");if(-1!==b&&-1!==c&&c>b){let d=a.slice(b,c+1);try{return JSON.parse(d)}catch{}}let d=a.indexOf("["),e=a.lastIndexOf("]");if(-1!==d&&-1!==e&&e>d){let b=a.slice(d,e+1);try{let a=JSON.parse(b);if(Array.isArray(a))return{titles:a}}catch{}}return null}(l);if(!m)throw Error("无法解析 AI 返回内容");let n=z.parse(m);return u.NextResponse.json({success:!0,data:{titles:n.titles}})}catch(a){if(console.error("A/B 标题生成失败:",a),a instanceof w.G)return u.NextResponse.json({success:!1,error:"参数错误"},{status:400});return u.NextResponse.json({success:!1,error:"生成失败，请重试"},{status:500})}}let B=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/title/ab-generate/route",pathname:"/api/title/ab-generate",filename:"route",bundlePath:"app/api/title/ab-generate/route"},distDir:".next",projectDir:"",resolvedPagePath:"/root/projects/ziliu/src/app/api/title/ab-generate/route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:C,workUnitAsyncStorage:D,serverHooks:E}=B;function F(){return(0,g.patchFetch)({workAsyncStorage:C,workUnitAsyncStorage:D})}async function G(a,b,c){var d;let e="/api/title/ab-generate/route";"/index"===e&&(e="/");let g=await B.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||B.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===B.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>B.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>B.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await B.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})},z),b}},l=await B.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await B.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:A})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[431,6055,639],()=>b(b.s=46843));module.exports=c})();