(()=>{var a={};a.id=4158,a.ids=[4158],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66946:(a,b,c)=>{"use strict";Object.defineProperty(b,"I",{enumerable:!0,get:function(){return g}});let d=c(30898),e=c(42471),f=c(47912);async function g(a,b,c,g){if((0,d.isNodeNextResponse)(b)){var h;b.statusCode=c.status,b.statusMessage=c.statusText;let d=["set-cookie","www-authenticate","proxy-authenticate","vary"];null==(h=c.headers)||h.forEach((a,c)=>{if("x-middleware-set-cookie"!==c.toLowerCase())if("set-cookie"===c.toLowerCase())for(let d of(0,f.splitCookiesString)(a))b.appendHeader(c,d);else{let e=void 0!==b.getHeader(c);(d.includes(c.toLowerCase())||!e)&&b.appendHeader(c,a)}});let{originalResponse:i}=b;c.body&&"HEAD"!==a.method?await (0,e.pipeToNodeResponse)(c.body,i,g):i.end()}}},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},92752:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>C,patchFetch:()=>B,routeModule:()=>x,serverHooks:()=>A,workAsyncStorage:()=>y,workUnitAsyncStorage:()=>z});var d={};c.r(d),c.d(d,{POST:()=>v});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365);let u={video_wechat:`
请将以下文章内容转换为适合微信视频号的口播稿：

要求：
1. 时长控制在1-3分钟（约200-500字）
2. 语调亲切自然，像朋友聊天
3. 必须使用 PREP 结构：Point(观点) → Reason(理由) → Example(例子/场景) → Point(总结+互动引导)
4. 提取文章的核心价值点，用口语化表达，避免逐句复述
5. 适当添加"那么"、"接下来"等转场词
6. 受众年龄偏大（30-50岁为主），避免网络热梗
7. 语速适中偏慢，像"和朋友面对面聊天"
8. 可以适当引入个人经历增加信任感

请直接输出口播稿内容，不要其他说明。
`,douyin:`
请将文章转换为抖音口播稿：

要求：
1. 时长 1-2 分钟（约 200-400 字）
2. 黄金3秒开场：必须用问题/冲突/数据冲击开头，例如："你知道90%的人都在犯的一个错误吗？"
3. 每句话≤20字，适合口播节奏
4. PREP结构但极度口语化，不要书面语
5. 每30秒一个"金句"或转折点，防止用户划走
6. 结尾关注引导："关注我，下期教你XX"
7. 不要"首先、其次、最后"这种结构，用自然过渡

请直接输出口播稿内容，不要其他说明。
`,bilibili:`
请将以下文章内容转换为适合B站的口播稿：

要求：
1. 时长控制在3-10分钟（约500-1500字）
2. 语调专业且有趣，可以有个人风格
3. 必须使用 PREP 结构：Point → Reason → Example → Point（最后包含三连引导）
4. 开头简要交代背景，避免铺垫过长
5. 逻辑清晰，可以相对复杂和深入
6. 可以适度使用B站黑话和自嘲（"有手就行"/"看完不投币的都是坏人"）
7. 知识密度要高——观众看完要觉得"学到了"
8. 三连引导要自然："觉得有帮助的话，三连支持一下"

请直接输出口播稿内容，不要其他说明。
`,xiaohongshu:`
请将以下文章内容转换为适合小红书的口播稿：

要求：
1. 时长控制在1-2分钟（约200-400字）
2. 语调真实亲切，像分享给闺蜜
3. 必须使用 PREP 结构：Point → Reason → Example → Point（最后引导评论区交流）
4. 突出个人体验和真实感受
5. 多用"我觉得"、"真的是"等口语词汇

请直接输出口播稿内容，不要其他说明。
`,youtube:`
请将以下内容转换为适合 YouTube 的视频讲稿/口播稿：

要求：
1. 保持与原文一致的语言（中文就中文，英文就英文）
2. 时长控制在 3-8 分钟（可根据内容密度适当调整）
3. 必须使用 PREP 结构：Point → Reason → Example → Point（最后包含 CTA：订阅/评论/下一步）
4. 口语化但不油腻，面向海外用户时用更清晰的逻辑和例子
5. 适当加入自然的转场词，避免长篇照搬原文

请直接输出讲稿内容，不要其他说明。
`};async function v(a){try{let{content:b,platform:c,title:d}=await a.json();if(!b||!c)return Response.json({success:!1,error:"缺少必要参数"},{status:400});if(!u[c])return Response.json({success:!1,error:"不支持的平台"},{status:400});let e=await w(b,c,d);return Response.json({success:!0,data:{speechScript:e,platform:c,wordCount:e.length,estimatedDuration:Math.round(e.length/3)}})}catch(a){return console.error("口播稿转换失败:",a),Response.json({success:!1,error:"转换失败，请重试"},{status:500})}}async function w(a,b,c){let d=u[b],e=`
${d}

文章标题：${c||"无标题"}

文章内容：
${a}
`;try{let a=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,"HTTP-Referer":process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000","X-Title":"Ziliu Video Speech Conversion"},body:JSON.stringify({model:"openai/gpt-4.1-mini",messages:[{role:"user",content:e}],max_tokens:1e3,temperature:.7,top_p:1})});if(!a.ok)throw Error(`OpenRouter API error: ${a.status}`);let b=await a.json(),c=b.choices[0]?.message?.content?.trim();if(!c)throw Error("AI返回空内容");return c}catch(d){return console.error("AI转换失败，使用降级方案:",d),function(a,b,c){let d=function(a,b){let c=a.split(/[。！？.!?]/).map(a=>a.trim()).filter(a=>a.length>12);return 0===c.length?[]:c.slice(0,3)}(a.replace(/<[^>]*>/g,"").replace(/[#*`]/g,"").replace(/\[(.*?)\]\(.*?\)/g,"$1"),3),e={video_wechat:{opening:"今天和大家分享一个重点观点：",ending:"如果有帮助，记得点赞关注，我们评论区见！"},douyin:{opening:"先抛个观点：",ending:"关注我，带你了解更多！"},bilibili:{opening:"先给出观点：",ending:"如果有用，麻烦三连支持一下！"},xiaohongshu:{opening:"我觉得这个点真的很实用：",ending:"有问题评论区见～"},youtube:{opening:"Here is the main point:",ending:"If this helps, please like, subscribe, and comment below!"}}[b];return function(a){let{opening:b,title:c,keyPoints:d,ending:e}=a,f=d[0]||"它能帮你更快抓住重点。",g=d[1]||d[0]||"举个例子：用一个简单场景就能看出差别。",h=d[2]||"核心就是把重点说清楚、做得更有效率。";return`${b}${c?`${c}`:"这件事"}。

原因是：${f}。

举个例子：${g}。

所以总结一下：${h} ${e}`}({opening:e.opening,title:c,keyPoints:d,ending:e.ending})}(a,b,c)}}let x=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/video/convert-speech/route",pathname:"/api/video/convert-speech",filename:"route",bundlePath:"app/api/video/convert-speech/route"},distDir:".next",projectDir:"",resolvedPagePath:"/root/projects/ziliu/src/app/api/video/convert-speech/route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:y,workUnitAsyncStorage:z,serverHooks:A}=x;function B(){return(0,g.patchFetch)({workAsyncStorage:y,workUnitAsyncStorage:z})}async function C(a,b,c){var d;let e="/api/video/convert-speech/route";"/index"===e&&(e="/");let g=await x.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:y,prerenderManifest:z,routerServerContext:A,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(z.dynamicRoutes[E]||z.routes[D]);if(F&&!y){let a=!!z.routes[D],b=z.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||x.isDev||y||(G="/index"===(G=D)?"/":G);let H=!0===x.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:z,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>x.onRequestError(a,b,d,A)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>x.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await x.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},A),b}},l=await x.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:z,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),y&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await x.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},96487:()=>{},96559:(a,b,c)=>{"use strict";a.exports=c(44870)}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[431],()=>b(b.s=92752));module.exports=c})();