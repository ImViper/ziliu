(()=>{var a={};a.id=2379,a.ids=[2379],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19689:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>F,patchFetch:()=>E,routeModule:()=>A,serverHooks:()=>D,workAsyncStorage:()=>B,workUnitAsyncStorage:()=>C});var d={};c.r(d),c.d(d,{POST:()=>v});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365);let u={video_wechat:`
请为以下文章内容生成适合微信视频号的发布元数据：

要求：
1. 标题：必须严格控制在6-16个汉字之间（不包括标点符号），突出实用价值，适合微信社交传播。
2. 描述：80-120字，温和友好，引导互动，必须包含核心价值点与适用人群或场景。注意：描述中严禁出现#话题标签。
3. 标签：3-5个相关话题标签，用#号格式输出。
4. 封面建议：一句话描述适合的封面内容（优先用物件/图标/场景/插画，避免人物）
5. 不能直接复述文章第一句话，要进行提炼总结

请按以下格式输出：
标题：[标题内容]
描述：[描述内容]
标签：#标签1 #标签2 #标签3
封面：[封面建议]
`,douyin:`
请为以下文章内容生成适合抖音的发布元数据：

要求：
1. 标题：20字以内（抖音折叠后只显示前20字），制造悬念或冲突，包含数字。
2. 描述：30-55字，节奏感强，多用emoji，必须包含1个核心亮点。注意：描述文本中不要带#话题标签，标签会单独放在标签字段。
3. 标签：5-8个热门话题标签，用#号格式输出。
4. 封面建议：强调视觉冲击力和对比（避免真人与人物特写）
5. 不能直接复述文章第一句话，要进行提炼总结

请按以下格式输出：
标题：[标题内容]
描述：[描述内容]
标签：#标签1 #标签2 #标签3 #标签4 #标签5
封面：[封面建议]
`,bilibili:`
请为以下文章内容生成适合B站的发布元数据：

要求：
1. 标题：30-60字，用【】强调核心关键词，示例：【深度解析】XX原理，看完你就懂了
2. 描述：150-250字，详细介绍内容大纲和亮点，包含2-3个要点。注意：描述中不要包含#话题标签。
3. 标签：选择合适的B站分区标签和内容标签，用#号格式输出。
4. 封面建议：信息丰富，突出重点内容（以图标/数据/场景为主，避免人物）
5. 不能直接复述文章第一句话，要进行提炼总结

请按以下格式输出：
标题：[标题内容]
描述：[描述内容]
标签：#标签1 #标签2 #标签3 #标签4
封面：[封面建议]
`,xiaohongshu:`
请为以下文章内容生成适合小红书的发布元数据：

要求：
1. 标题：强体验感，但必须在18-20字以内，最多1个问号或感叹号，避免多重标点堆叠。
2. 描述：200-500字，详细分享经历，多用emoji和换行，突出真实体验和效果。注意：描述正文中禁止携带#话题标签。
3. 标签：包含品类、功效、适用人群等标签，用#号格式输出。
4. 封面建议：突出主题与质感（优先物件/场景/插画，避免人物）
5. 不能直接复述文章第一句话，要进行提炼总结

请按以下格式输出：
标题：[标题内容]
描述：[描述内容]
标签：#标签1 #标签2 #标签3 #标签4 #标签5
封面：[封面建议]
`,youtube:`
请为以下内容生成适合 YouTube 的发布元数据：

要求：
1. 标题：尽量控制在 40-70 个字符（中英文均可），包含核心关键词，避免过度标题党
2. 描述：建议 150-300 字（可根据语言适配），包含：
   - 2-4 个要点（可用短句/项目符号）
   - 关键链接位（如官网/产品页/Newsletter，可留占位符）
   注意：描述文本中严禁出现#话题标签。
3. 标签：8-15 个相关关键词（用 #号格式输出）
4. 封面建议：一句话描述封面构图与文字要点（避免人物）
5. 保持与原文一致的语言（中文就中文，英文就英文）
6. 不能直接复述文章第一句话，要进行提炼总结

请按以下格式输出：
标题：[标题内容]
描述：[描述内容]
标签：#标签1 #标签2 #标签3 #标签4 #标签5
封面：[封面建议]
`};async function v(a){try{let b,c,d,{content:e,platform:f,title:g}=await a.json();if(!e||!f)return Response.json({success:!1,error:"缺少必要参数"},{status:400});if(!u[f])return Response.json({success:!1,error:"不支持的平台"},{status:400});let h=await w(e,f,g);return h.coverSuggestion&&("bilibili"===f?(console.log("\uD83D\uDCFA 为B站生成16:9和4:3封面..."),[c,d]=await Promise.all([x(h.coverSuggestion,f,g,e,"16:9"),x(h.coverSuggestion,f,g,e,"4:3")]),b=c):b=await x(h.coverSuggestion,f,g,e)),Response.json({success:!0,data:{...h,coverImage:b,coverImage169:c,coverImage43:d,platform:f,platformTips:{video_wechat:["建议视频时长1-3分钟","内容要有价值感，适合分享","封面简洁突出重点","可以添加地理位置增加曝光"],douyin:["前3秒很关键，要有视觉冲击","建议配有节奏感的BGM","时长控制在15-60秒效果最好","多用热门音乐和特效"],bilibili:["记得选择合适的分区投稿","封面要信息丰富吸引点击","可以考虑分P或做成系列","简介要详细，有利于搜索"],xiaohongshu:["真实自然最重要","可以露脸增加信任感","记得添加地理位置","多用emoji让内容更生动"],youtube:["标题尽量包含核心关键词，避免过度标题党","描述前两行最重要：放价值点与链接","建议添加时间戳/章节（长视频更友好）","标签更偏SEO关键词，注意相关性"]}[f]||[]}})}catch(a){return console.error("元数据生成失败:",a),Response.json({success:!1,error:"生成失败，请重试"},{status:500})}}async function w(a,b,c){let d=u[b],e=`
${d}

原文章标题：${c||"无标题"}

文章内容：
${a}
`;try{let d=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,"HTTP-Referer":process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000","X-Title":"Ziliu Video Metadata Generation"},body:JSON.stringify({model:"openai/gpt-4.1-mini",messages:[{role:"user",content:e}],max_tokens:800,temperature:.8,top_p:1})});if(!d.ok)throw Error(`OpenRouter API error: ${d.status}`);let f=await d.json(),g=f.choices[0]?.message?.content?.trim();if(!g)throw Error("AI返回空内容");let h=function(a,b){let c=a.split("\n").map(a=>a.trim()).filter(Boolean),d={},e=[],f=[],g=null,h=a=>/^(标题|title)[:：]/i.test(a)?"title":/^(描述|简介|视频描述|description)[:：]/i.test(a)?"description":/^(标签|tag|tags)[:：]/i.test(a)?"tags":/^(封面|封面建议|cover)[:：]/i.test(a)?"cover":null,i=a=>a.replace(/^[^:：]+[:：]/,"").trim(),j=a=>{let b=a.match(/[#＃][^\s#＃]+/g);return b?b.map(a=>a.replace(/^[#＃]/,"").trim()).filter(Boolean):[]};for(let a of c){let c=h(a);if(c){g=c;let h=i(a);if("title"===c){let a=h;"video_wechat"===b&&(a=y(a)),a&&(d.title=a)}else"description"===c?h&&e.push(h):"tags"===c?h&&f.push(...j(h)):"cover"===c&&h&&(d.coverSuggestion=h);continue}"description"===g?e.push(a):"tags"===g&&f.push(...j(a))}return e.length>0&&(d.description=e.join("\n").trim()),f.length>0&&(d.tags=Array.from(new Set(f))),d}(g,b),i=z(a,b,c);return{title:h.title||i.title,description:h.description||i.description,tags:h.tags&&h.tags.length>0?h.tags:i.tags,coverSuggestion:h.coverSuggestion||i.coverSuggestion}}catch(d){return console.error("AI生成失败，使用降级方案:",d),z(a,b,c)}}async function x(a,b,c,d,e){try{let f=function(a,b,c,d,e){let f=`根据以下封面建议生成一张更高点击率的封面图片。封面主题：${c||"未指定标题"}。封面建议：${a}`,g={video_wechat:{tutorial:"模板：简洁大标题 + 小副标题 + 单一物件/图标，背景纯色或柔和渐变",review:"模板：对比式布局 + 关键词高亮 + 参数/指标小角标",list:"模板：信息图风格，1个大数字/关键词 + 图标矩阵",news:"模板：版式干净 + 时间/要点条目 + 轻量图标",lifestyle:"模板：清爽生活方式静物 + 柔和渐变 + 细体标题",food:"模板：简洁餐食静物（不含人物）+ 温暖色调 + 关键词高亮",travel:"模板：目的地场景剪影/地标图标 + 位置标签 + 大标题",tech:"模板：科技卡片布局 + 设备/界面图标 + 主标题高亮",finance:"模板：数据面板风 + 上升箭头/图表元素 + 稳重配色",productivity:"模板：清单式布局 + 勾选符号 + 关键字大标题",entertainment:"模板：高对比配色 + 夸张符号元素 + 大标题",general:"模板：简洁大标题 + 单一物件/图标 + 干净背景"},douyin:{tutorial:"模板：高对比撞色背景 + 3-5字超大标题 + 放射光效",review:"模板：对比式排版 + 参数标签贴纸 + 强对比配色",list:"模板：大数字爆款样式 + 标签贴纸 + 高饱和背景",news:"模板：标题条幅 + 热点标签贴纸 + 强对比底色",lifestyle:"模板：明快撞色 + 生活物件拼贴 + 粗体标题",food:"模板：高饱和美食静物 + 夸张贴纸 + 大标题",travel:"模板：明亮场景剪影 + 位置标签 + 关键词高亮",tech:"模板：赛博科技感 + HUD元素 + 关键词高亮",finance:"模板：强对比图表元素 + 关键词高亮 + 警示色点缀",productivity:"模板：清单式大字 + 勾选/计时元素 + 强对比背景",entertainment:"模板：潮流涂鸦风 + 贴纸/emoji点缀 + 粗体大字",general:"模板：高对比撞色背景 + 超大标题 + 简单图标"},bilibili:{tutorial:"模板：标题 + 2-3个要点词 + 小角标，信息层级清晰",review:"模板：参数对比卡片 + 关键词高亮 + 对比色拼贴",list:"模板：大数字清单 + 图标矩阵 + 标题置顶",news:"模板：要点条列 + 关键词高亮 + 轻量图标",lifestyle:"模板：低饱和物件拼贴 + 标题置顶 + 轻量贴纸",food:"模板：美食静物拼贴 + 关键词高亮 + 小角标",travel:"模板：地标/地图图标 + 位置标签 + 标题置顶",tech:"模板：科技感卡片布局 + 图标/数据元素 + 主标题高亮",finance:"模板：数据看板 + 上升/下降图标 + 关键词高亮",productivity:"模板：方法步骤卡片 + 勾选/清单元素 + 标题置顶",entertainment:"模板：强对比拼贴 + 夸张符号元素 + 大标题",general:"模板：信息密度适中，标题 + 要点词 + 小角标"},xiaohongshu:{tutorial:"模板：清新INS风 + 大标题 + 小副标题 + 图标点缀",review:"模板：对比式拼贴 + 关键词高亮 + 结果标签",list:"模板：拼贴图鉴风，多物件排版 + 标题置顶/置中",news:"模板：简洁条目 + 关键词高亮 + 轻量图标",lifestyle:"模板：清新静物 + 留白充足 + 细体标题",food:"模板：温暖色调美食静物 + 手写感标题 + 轻量贴纸",travel:"模板：目的地场景/地标图标 + 位置标签 + 清新配色",tech:"模板：简洁设备/界面图标 + 标题置顶 + 低饱和配色",finance:"模板：简洁数据图表 + 稳重配色 + 标题置顶",productivity:"模板：清单式布局 + 勾选符号 + 关键词高亮",entertainment:"模板：梦幻手绘插画风 + 柔和渐变 + 手写感标题",general:"模板：清新INS风 + 留白 + 精致静物"},youtube:{tutorial:"模板：极简对比，纯色背景 + 超大标题 + 单一物件",review:"模板：参数/评分条 + 关键词高亮 + 对比色背景",list:"模板：大数字标题 + 图标矩阵 + 高对比背景",news:"模板：标题条幅 + 时间/要点 + 轻量图标",lifestyle:"模板：极简静物 + 低饱和背景 + 大标题",food:"模板：美食静物主视觉 + 大标题 + 简洁点缀",travel:"模板：地标剪影 + 位置标签 + 大标题",tech:"模板：科技卡片布局 + 设备/数据元素 + 主标题高亮",finance:"模板：数据看板风 + 上升/下降图标 + 关键词高亮",productivity:"模板：清单式大字 + 计时/勾选元素 + 高对比",entertainment:"模板：电影感海报 + 强光源 + 大标题",general:"模板：极简对比 + 超大标题 + 单一物件"}},h={video_wechat:{ratio:"16:9",size:"1280x720",layout:"简洁信息层级，主标题+一句副标题",style:"清爽、可信、易分享",text:"主标题6-10字，副标题10-16字，字号对比明显"},douyin:{ratio:"9:16",size:"1080x1920",layout:"强对比视觉冲击，主体居中或偏下，留上方标题区",style:"高饱和、强光影、情绪明显",text:"主标题6-9字，关键词加粗高亮"},bilibili:{ratio:e||"16:9",size:"4:3"===e?"960x720":"1280x720",layout:"信息量更足，标题+要点/数字+小角标，主体内容务必保持在画面中央",style:"内容导向、清晰利落、专业感",text:"主标题6-12字，支持1个关键词高亮"},xiaohongshu:{ratio:"3:4（优先）/1:1（兼容）",size:"1080x1440（优先）/1080x1080（兼容）",layout:"竖版构图，物件/插画/场景居中，标题在上或中，留出留白",style:"清新自然、质感明确、色调柔和",text:"主标题6-12字，副标题8-14字，避免过多文字"},youtube:{ratio:"16:9",size:"1280x720",layout:"强对比+大标题+主体特写，易识别",style:"高对比、清晰、主题明确",text:"主标题4-8词（或6-12字），关键词高亮"}}[b],i=h?`画幅比例：${h.ratio}
分辨率建议：${h.size}
版式：${h.layout}
风格：${h.style}
文字：${h.text}`:`画幅比例：${e||"16:9"}
风格：清晰、主题突出、构图干净。`,j=function(a){let b=a.toLowerCase();return/(教程|教学|指南|步骤|入门|技巧|方法|how to|tutorial|guide|tips)/i.test(b)?"tutorial":/(测评|评测|对比|横评|开箱|review|benchmark|vs)/i.test(b)?"review":/(清单|合集|盘点|top\s?\d+|排行榜|list|合集)/i.test(b)?"list":/(新闻|快讯|热点|趋势|发布|解读|news|trend|breaking)/i.test(b)?"news":/(生活|日常|穿搭|护肤|家居|vlog|lifestyle)/i.test(b)?"lifestyle":/(美食|料理|做饭|餐厅|探店|food|recipe|cooking)/i.test(b)?"food":/(旅行|攻略|打卡|景点|旅拍|travel|trip|itinerary)/i.test(b)?"travel":/(科技|数码|软件|硬件|ai|工具|tech|product|app|saas)/i.test(b)?"tech":/(金融|理财|投资|股票|基金|收益|finance|stock|invest|trade)/i.test(b)?"finance":/(效率|复盘|习惯|时间管理|生产力|productivity)/i.test(b)?"productivity":/(游戏|娱乐|影视|电影|综艺|动漫|music|movie|game|entertainment)/i.test(b)?"entertainment":"general"}(`${c||""} ${a} ${d||""}`),k=g[b]?.[j]||g[b]?.general||"模板：极简大标题 + 单一物件/图标 + 干净背景";return`${f}

主体与禁用规则：
主体优先：物件/图标/数据可视化/场景元素/抽象形状/插画
避免人物：不出现真人、卡通人物、人物剪影或脸部特写
如需表达“人群/用户”，使用符号化图标或抽象轮廓替代

平台规格与风格要求：
${i}

内容类型判定：${j}
指定模板：${k}

通用规则：
文字必须清晰可读，避免过小或过多文字
对比强、主体突出，留出安全边距（四周至少5%留白）
避免复杂背景和杂乱元素
整体构图有明确视觉焦点
禁止人物/人脸/人体特写，避免真人写实风格`}(a,b,c,d,e),g=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${process.env.OPENROUTER_API_KEY}`,"HTTP-Referer":process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000","X-Title":"Ziliu Video Cover Generation"},body:JSON.stringify({model:"google/gemini-3-pro-image-preview",messages:[{role:"user",content:f}],modalities:["image","text"]})});if(!g.ok)throw Error(`OpenRouter API error: ${g.status}`);let h=await g.json(),i=h.choices?.[0]?.message?.images,j=i?.[0]?.image_url?.url;if(!j||"string"!=typeof j)return;return j}catch(a){console.error("封面图片生成失败:",a);return}}function y(a){if(!a)return"实用干货分享";let b=a.replace(/[^\u4e00-\u9fa5]/g,""),c=b.length;if(c>=6&&c<=16)return a;if(c>16){let a=b.substring(0,16),c=["的","与","和","或","及"];for(let b=12;b<a.length;b++)if(c.includes(a[b]))return a.substring(0,b);return a}for(let b of["分享","干货","技巧","方法","经验","心得"]){let c=a+b,d=c.replace(/[^\u4e00-\u9fa5]/g,"").length;if(d>=6&&d<=16)return c}return a+"实用分享"}function z(a,b,c){var d;let e=0===(d=function(a,b){let c=a.split(/[。！？.!?]/).map(a=>a.trim()).filter(a=>a.length>12);return 0===c.length?[]:c.slice(0,3)}(a.replace(/<[^>]*>/g,"").replace(/[#*`]/g,""),3)).length?"今天分享一个能帮助你更高效解决问题的方法。":1===d.length?d[0]:`${d[0]}，并结合${d[1]}给出具体做法。`,f={video_wechat:{title:y(c),description:`${e} 更适合希望提升效率、掌握关键方法的人。`,tags:["实用技巧","干货分享","个人成长"],coverSuggestion:"简洁清晰的标题配图，突出重点信息"},douyin:{title:`你绝对想不到${c?"："+c:"这个方法"}！`,description:`${e} 🔥`,tags:["涨知识","实用技巧","干货","必看"],coverSuggestion:"高对比度配色，大字体标题，制造视觉冲击"},bilibili:{title:`【干货分享】${c||"实用技巧合集"}`,description:`${e}。本期会拆解思路、方法与常见误区，适合想系统了解的朋友。`,tags:["知识分享","干货","教程","实用"],coverSuggestion:"信息量丰富的封面，包含主题和要点预览"},xiaohongshu:{title:`真的太实用了！${c||"必须分享"}`,description:`${e}✨

亲测有效，分享我的真实体验和方法细节～

有问题评论区见～`,tags:["实用好物","真实测评","干货分享","必看"],coverSuggestion:"真实自然的生活场景，突出产品或效果"},youtube:{title:`${c||"Product Deep Dive"} | Key Takeaways`,description:`${e}

In this video, we cover the key ideas and practical takeaways.

Links:
- Website: [link]
- Newsletter: [link]`,tags:["product","saas","growth","startup","marketing","tutorial","howto","strategy"],coverSuggestion:"高对比度背景 + 3-5个关键词大字标题 + 产品/场景元素点缀"}};return f[b]||f.video_wechat}let A=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/video/generate-metadata/route",pathname:"/api/video/generate-metadata",filename:"route",bundlePath:"app/api/video/generate-metadata/route"},distDir:".next",projectDir:"",resolvedPagePath:"/root/projects/ziliu/src/app/api/video/generate-metadata/route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:B,workUnitAsyncStorage:C,serverHooks:D}=A;function E(){return(0,g.patchFetch)({workAsyncStorage:B,workUnitAsyncStorage:C})}async function F(a,b,c){var d;let e="/api/video/generate-metadata/route";"/index"===e&&(e="/");let g=await A.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,resolvedPathname:D}=g,E=(0,j.normalizeAppPath)(e),F=!!(y.dynamicRoutes[E]||y.routes[D]);if(F&&!x){let a=!!y.routes[D],b=y.dynamicRoutes[E];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let G=null;!F||A.isDev||x||(G="/index"===(G=D)?"/":G);let H=!0===A.isDev||!F,I=F&&!H,J=a.method||"GET",K=(0,i.getTracer)(),L=K.getActiveScopeSpan(),M={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:H,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:I,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>A.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},N=new k.NodeNextRequest(a),O=new k.NodeNextResponse(b),P=l.NextRequestAdapter.fromNodeNextRequest(N,(0,l.signalFromNodeResponse)(b));try{let d=async c=>A.handle(P,M).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=K.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${J} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${J} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&B&&C&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=M.renderOpts.fetchMetrics;let i=M.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=M.renderOpts.collectedTags;if(!F)return await (0,o.I)(N,O,e,M.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==M.renderOpts.collectedRevalidate&&!(M.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&M.renderOpts.collectedRevalidate,d=void 0===M.renderOpts.collectedExpire||M.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:M.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await A.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})},z),b}},l=await A.handleResponse({req:a,nextConfig:w,cacheKey:G,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:B,revalidateOnlyGenerated:C,responseGenerator:k,waitUntil:c.waitUntil});if(!F)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",B?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&F||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(N,O,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};L?await g(L):await K.withPropagatedContext(a.headers,()=>K.trace(m.BaseServerSpan.handleRequest,{spanName:`${J} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":J,"http.target":a.url}},g))}catch(b){if(L||b instanceof s.NoFallbackError||await A.onRequestError(a,b,{routerKind:"App Router",routePath:E,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:I,isOnDemandRevalidate:B})}),F)throw b;return await (0,o.I)(N,O,new Response(null,{status:500})),null}}},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},66946:(a,b,c)=>{"use strict";Object.defineProperty(b,"I",{enumerable:!0,get:function(){return g}});let d=c(30898),e=c(42471),f=c(47912);async function g(a,b,c,g){if((0,d.isNodeNextResponse)(b)){var h;b.statusCode=c.status,b.statusMessage=c.statusText;let d=["set-cookie","www-authenticate","proxy-authenticate","vary"];null==(h=c.headers)||h.forEach((a,c)=>{if("x-middleware-set-cookie"!==c.toLowerCase())if("set-cookie"===c.toLowerCase())for(let d of(0,f.splitCookiesString)(a))b.appendHeader(c,d);else{let e=void 0!==b.getHeader(c);(d.includes(c.toLowerCase())||!e)&&b.appendHeader(c,a)}});let{originalResponse:i}=b;c.body&&"HEAD"!==a.method?await (0,e.pipeToNodeResponse)(c.body,i,g):i.end()}}},78335:()=>{},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},96487:()=>{},96559:(a,b,c)=>{"use strict";a.exports=c(44870)}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[431],()=>b(b.s=19689));module.exports=c})();