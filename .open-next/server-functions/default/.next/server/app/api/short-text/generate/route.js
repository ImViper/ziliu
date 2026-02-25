(()=>{var a={};a.id=1738,a.ids=[1738,2909],a.modules={261:a=>{"use strict";a.exports=require("next/dist/shared/lib/router/utils/app-paths")},3295:a=>{"use strict";a.exports=require("next/dist/server/app-render/after-task-async-storage.external.js")},10846:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},11723:a=>{"use strict";a.exports=require("querystring")},12412:a=>{"use strict";a.exports=require("assert")},12909:(a,b,c)=>{"use strict";c.d(b,{DY:()=>p,LO:()=>o,authOptions:()=>n,fG:()=>o});var d=c(19854),e=c.n(d),f=c(13581),g=c(71682),h=c(94634),i=c(85663),j=c(50639),k=c(14250);let l=j.Ik({email:j.Yj().email("请输入有效的邮箱地址"),password:j.Yj().min(6,"密码至少6位")}),m=j.Ik({name:j.Yj().min(2,"姓名至少2个字符"),email:j.Yj().email("请输入有效的邮箱地址"),password:j.Yj().min(6,"密码至少6位")}),n={providers:[(0,f.A)({name:"credentials",credentials:{email:{label:"Email",type:"email"},password:{label:"Password",type:"password"}},async authorize(a){try{if(!a?.email||!a?.password)return null;let{email:b,password:c}=l.parse(a),d=await g.db.query.users.findFirst({where:(0,h.eq)(g.VV.email,b)});if(!d||!d.passwordHash||!await i.Ay.compare(c,d.passwordHash))return null;return{id:d.id,email:d.email,name:d.name,image:d.avatar}}catch(a){return console.error("Auth error:",a),null}}})],session:{strategy:"jwt",maxAge:2592e3,updateAge:86400},jwt:{maxAge:2592e3},pages:{signIn:"/auth/signin"},callbacks:{async jwt({token:a,user:b,trigger:c}){if(b&&(a.id=b.id),"update"===c&&a.id){let b=await g.db.query.users.findFirst({where:(0,h.eq)(g.VV.id,a.id)});b&&(a.name=b.name,a.email=b.email,a.image=b.avatar)}return a},session:async({session:a,token:b})=>(b&&a.user&&(a.user.id=b.id,a.user.name=b.name,a.user.email=b.email,a.user.image=b.image),a)}},o=e()(n);async function p(a){try{let{name:b,email:c,password:d}=m.parse(a);if(await g.db.query.users.findFirst({where:(0,h.eq)(g.VV.email,c)}))throw Error("用户已存在");let e=await i.Ay.hash(d,12),[f]=await g.db.insert(g.VV).values({name:b,email:c,passwordHash:e}).returning();return{id:f.id,email:f.email,name:f.name}}catch(a){if(a instanceof k.G)throw Error(a.issues?.[0]?.message||"参数错误");throw a}}},28354:a=>{"use strict";a.exports=require("util")},29294:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-async-storage.external.js")},32767:(a,b,c)=>{"use strict";c.r(b),c.d(b,{apiKeys:()=>p,articles:()=>i,imageUsageStats:()=>m,publishPresets:()=>k,publishRecords:()=>j,redeemCodes:()=>l,shortTextContents:()=>o,users:()=>h,videoContents:()=>n});var d=c(28234),e=c(89283),f=c(70932),g=c(52175);let h=(0,d.D)("users",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),email:(0,e.Qq)("email").notNull().unique(),name:(0,e.Qq)("name"),passwordHash:(0,e.Qq)("password_hash"),avatar:(0,e.Qq)("avatar"),plan:(0,e.Qq)("plan",{enum:["free","pro"]}).notNull().default("free"),planExpiredAt:(0,f.nd)("plan_expired_at",{mode:"timestamp"}),useCustomR2:(0,f.nd)("use_custom_r2",{mode:"boolean"}).default(!1),customR2AccountId:(0,e.Qq)("custom_r2_account_id"),customR2AccessKeyId:(0,e.Qq)("custom_r2_access_key_id"),customR2SecretAccessKey:(0,e.Qq)("custom_r2_secret_access_key"),customR2BucketName:(0,e.Qq)("custom_r2_bucket_name"),customR2PublicUrl:(0,e.Qq)("custom_r2_public_url"),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date),updatedAt:(0,f.nd)("updated_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)}),i=(0,d.D)("articles",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),userId:(0,e.Qq)("user_id").notNull().references(()=>h.id,{onDelete:"cascade"}),title:(0,e.Qq)("title").notNull(),content:(0,e.Qq)("content").notNull(),style:(0,e.Qq)("style",{enum:["default","minimal","elegant","tech","card","print","night","wechatHot","blogger"]}).notNull().default("default"),status:(0,e.Qq)("status",{enum:["draft","published"]}).notNull().default("draft"),wordCount:(0,f.nd)("word_count").default(0),readingTime:(0,f.nd)("reading_time").default(0),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date),updatedAt:(0,f.nd)("updated_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)}),j=(0,d.D)("publish_records",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),articleId:(0,e.Qq)("article_id").notNull().references(()=>i.id,{onDelete:"cascade"}),userId:(0,e.Qq)("user_id").notNull().references(()=>h.id,{onDelete:"cascade"}),platform:(0,e.Qq)("platform",{enum:["wechat","zhihu","juejin","zsxq","video_wechat","douyin","bilibili","xiaohongshu","youtube"]}).notNull(),status:(0,e.Qq)("status",{enum:["pending","success","failed"]}).notNull().default("pending"),platformArticleId:(0,e.Qq)("platform_article_id"),platformUrl:(0,e.Qq)("platform_url"),publishedAt:(0,f.nd)("published_at",{mode:"timestamp"}),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)}),k=(0,d.D)("publish_presets",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),userId:(0,e.Qq)("user_id").notNull().references(()=>h.id,{onDelete:"cascade"}),name:(0,e.Qq)("name").notNull(),platform:(0,e.Qq)("platform").notNull().default("wechat"),isDefault:(0,f.nd)("is_default",{mode:"boolean"}).default(!1),authorName:(0,e.Qq)("author_name"),autoGenerateDigest:(0,f.nd)("auto_generate_digest",{mode:"boolean"}).default(!0),headerContent:(0,e.Qq)("header_content"),footerContent:(0,e.Qq)("footer_content"),platformConfig:(0,e.Qq)("platform_config"),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date),updatedAt:(0,f.nd)("updated_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)}),l=(0,d.D)("redeem_codes",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),code:(0,e.Qq)("code").notNull().unique(),type:(0,e.Qq)("type",{enum:["monthly","yearly"]}).notNull(),duration:(0,f.nd)("duration").notNull(),isUsed:(0,f.nd)("is_used",{mode:"boolean"}).notNull().default(!1),usedBy:(0,e.Qq)("used_by").references(()=>h.id),usedAt:(0,f.nd)("used_at",{mode:"timestamp"}),createdBy:(0,e.Qq)("created_by"),note:(0,e.Qq)("note"),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)}),m=(0,d.D)("image_usage_stats",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),userId:(0,e.Qq)("user_id").notNull().references(()=>h.id,{onDelete:"cascade"}),month:(0,e.Qq)("month").notNull(),usedCount:(0,f.nd)("used_count").notNull().default(0),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date),updatedAt:(0,f.nd)("updated_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)}),n=(0,d.D)("video_contents",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),articleId:(0,e.Qq)("article_id").notNull().references(()=>i.id,{onDelete:"cascade"}),userId:(0,e.Qq)("user_id").notNull().references(()=>h.id,{onDelete:"cascade"}),platform:(0,e.Qq)("platform",{enum:["video_wechat","douyin","bilibili","xiaohongshu","youtube"]}).notNull(),videoTitle:(0,e.Qq)("video_title"),videoDescription:(0,e.Qq)("video_description"),speechScript:(0,e.Qq)("speech_script"),tags:(0,e.Qq)("tags"),coverSuggestion:(0,e.Qq)("cover_suggestion"),coverImage:(0,e.Qq)("cover_image"),coverImage169:(0,e.Qq)("cover_image_169"),coverImage43:(0,e.Qq)("cover_image_43"),platformTips:(0,e.Qq)("platform_tips"),estimatedDuration:(0,f.nd)("estimated_duration"),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date),updatedAt:(0,f.nd)("updated_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)}),o=(0,d.D)("short_text_contents",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),articleId:(0,e.Qq)("article_id").notNull().references(()=>i.id,{onDelete:"cascade"}),userId:(0,e.Qq)("user_id").notNull().references(()=>h.id,{onDelete:"cascade"}),platform:(0,e.Qq)("platform").notNull(),title:(0,e.Qq)("title"),content:(0,e.Qq)("content"),tags:(0,e.Qq)("tags"),images:(0,e.Qq)("images"),coverImage:(0,e.Qq)("cover_image"),coverSuggestion:(0,e.Qq)("cover_suggestion"),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date),updatedAt:(0,f.nd)("updated_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)}),p=(0,d.D)("api_keys",{id:(0,e.Qq)("id").primaryKey().$defaultFn(()=>(0,g.sX)()),userId:(0,e.Qq)("user_id").notNull().references(()=>h.id,{onDelete:"cascade"}),key:(0,e.Qq)("key").notNull().unique(),name:(0,e.Qq)("name").notNull(),lastUsedAt:(0,f.nd)("last_used_at",{mode:"timestamp"}),expiresAt:(0,f.nd)("expires_at",{mode:"timestamp"}),createdAt:(0,f.nd)("created_at",{mode:"timestamp"}).notNull().$defaultFn(()=>new Date)})},44870:a=>{"use strict";a.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},55511:a=>{"use strict";a.exports=require("crypto")},55591:a=>{"use strict";a.exports=require("https")},63033:a=>{"use strict";a.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},71682:(a,b,c)=>{"use strict";c.d(b,{OZ:()=>e.articles,VV:()=>e.users,db:()=>h,qK:()=>f,v4:()=>e.apiKeys});var d=c(57130),e=c(32767);function f(){try{let{getCloudflareContext:a}=c(62426),{env:b}=a();return b.DB??null}catch{return null}}let g=f(),h=g?(0,d.f)(g,{schema:e}):null},74075:a=>{"use strict";a.exports=require("zlib")},77598:a=>{"use strict";a.exports=require("node:crypto")},78335:()=>{},79428:a=>{"use strict";a.exports=require("buffer")},79551:a=>{"use strict";a.exports=require("url")},81630:a=>{"use strict";a.exports=require("http")},86439:a=>{"use strict";a.exports=require("next/dist/shared/lib/no-fallback-error.external")},93465:(a,b,c)=>{"use strict";c.r(b),c.d(b,{handler:()=>Y,patchFetch:()=>X,routeModule:()=>T,serverHooks:()=>W,workAsyncStorage:()=>U,workUnitAsyncStorage:()=>V});var d={};c.r(d),c.d(d,{POST:()=>N});var e=c(96559),f=c(48088),g=c(37719),h=c(26191),i=c(81289),j=c(261),k=c(92603),l=c(39893),m=c(14823),n=c(47220),o=c(66946),p=c(47912),q=c(99786),r=c(46143),s=c(86439),t=c(43365),u=c(32190),v=c(50639),w=c(14250),x=c(19854),y=c(12909),z=c(71682),A=c(32767),B=c(94634);function C(a){return String(a||"").trim()}function D(a){if(!a)return;let b=a.trim(),c=b.match(/^"([^"]+)"\s*$/)||b.match(/^'([^']+)'\s*$/)||b.match(/^\(([^)]+)\)\s*$/);return c?(c[1]||"").trim()||void 0:b||void 0}function E(a,b){try{let c=RegExp(`\\s${b}\\s*=\\s*(?:"([^"]+)"|'([^']+)'|([^\\s>]+))`,"i"),d=a.match(c);return C(d?.[1]||d?.[2]||d?.[3]||"")}catch{return""}}let F=v.Ik({platform:v.k5(["wechat_xiaolushu","xiaohongshu_note","weibo","jike","x","linkedin"]),articleId:v.Yj().optional(),title:v.Yj().optional(),content:v.Yj().optional()}),G={wechat_xiaolushu:{titleMax:20,contentMax:1e3},xiaohongshu_note:{titleMax:20,contentMax:1e3,tagMax:10},weibo:{contentMax:2e3,tagMax:5},jike:{contentMax:2e3,tagMax:5},x:{contentMax:4e3,tagMax:8},linkedin:{contentMax:3e3,tagMax:5}},H={wechat_xiaolushu:`
你是"微信小绿书（公众号图片消息）"运营助手。请把原始内容改写为适合发布的小绿书短图文文案。
风格要求：类似小红书，但必须纯文字，不要使用Emoji或任何小图标/符号装饰。

要求：
1) 标题：可选，6-20个汉字（不要出现"标题："前缀）
2) 正文：200-900字，纯文本，允许换行；不要出现Markdown语法；不要输出图片URL；避免贴长链接
3) 话题/标签：3-5个，返回数组（不要带#号，直接给词）
4) 可以根据配图信息自然地写"第1张图/图里…"等
5) 每段不超过3行，留白感强
6) 结尾设置互动引导："你觉得呢？"/"收藏备用"

输出必须是严格 JSON（不要有任何额外文字）：
{"title":"...","content":"...","tags":["..."]}`,xiaohongshu_note:`
你是"小红书图文笔记"资深运营。请把原始内容改写为高互动率的小红书图文笔记。

风格要求：
- 第一人称叙事："我试了XX后发现..."、"分享一个我用了3年的方法"
- emoji适度：每2-3句用1个，不堆砌，优先用🔥💡✅❌📌等实用型
- 语气真诚有分享感，像给朋友安利，不要AI腔
- 绝对禁止使用"最好""第一""100%有效""史上最全"等绝对化用语（平台会限流）

标题要求：
1) 6-20字，关键词前置，格式参考"关键词｜具体利益点"
2) 有场景感/结果感/数字："用了3个月，终于搞懂了XX"
3) 可适度用｜和emoji但不超过2个

正文要求：
1) 300-800字，分段≤3行
2) 开头用痛点/场景/结果引入
3) 中间用分点或小标题组织
4) 结尾互动引导："你也遇到过吗？评论区聊聊"
5) 不要Markdown语法、不输出图片URL

话题要求：
- 5-8个，1个大话题 + 3个精准话题 + 2个长尾话题
- 不带#号，直接给词

输出严格JSON（不要有任何额外文字）：
{"title":"...","content":"...","tags":["..."]}`,weibo:`
你是"微博"资深运营。请把原始内容改写为微博爆款短文。

风格：
- 碎片化表达、观点鲜明、适度争议
- 开头直接抛观点，不要铺垫
- 结尾留互动钩子："你怎么看？"/"同意的转发"
- 不要AI腔，不要"总而言之""综上所述"

要求：
1) 80-220字，越短越好，信息密度高
2) 以段落为主，自然表达、自然分段，能合并就不要硬拆
3) 可包含 1-3 个话题词（返回 tags 数组，不要带#号）
4) 不要出现Markdown语法；不要输出图片URL；避免硬广

输出必须是严格 JSON（不要有任何额外文字）：
{"content":"...","tags":["..."]}`,jike:`
你是即刻社区活跃用户。请把内容改写为即刻动态。

风格：
- 真诚的个人分享，像写给同行的笔记
- 创业者/产品经理/开发者口吻
- 可以分享数据："上线第3天，DAU突破XX"
- 不要标题党，不要鸡汤，不要AI腔

要求：
1) 120-300字，自然分段
2) 开头用"今天..."/"最近..."/"分享一个发现..."引入
3) 不要Markdown语法；不要输出图片URL
4) 1-3个话题词（返回 tags 数组，不要带#号）

输出必须是严格 JSON（不要有任何额外文字）：
{"content":"...","tags":["..."]}`,x:`
You are an X (Twitter) post assistant. Rewrite the original content into an X post.

Requirements:
1) Keep the language consistent with the input (Chinese stays Chinese, English stays English).
2) Prefer a single post that is concise; keep it within 280-400 characters if possible (hard max 4000).
3) Prefer paragraph-style output; break lines only when it improves readability.
4) No Markdown syntax; do not output image URLs.
5) Return optional tags as a list of keywords (no #).
6) If content naturally exceeds 280 chars, structure as a thread:
   - First tweet = strongest hook/insight
   - Use line breaks between tweets
   - Last tweet includes CTA
7) Avoid AI-speak like "In conclusion" or "It's worth noting"

Output MUST be strict JSON only:
{"content":"...","tags":["..."]}`,linkedin:`
你是 LinkedIn 资深内容运营。请把原始内容改写为适合 LinkedIn 发布的职业动态。

风格要求：
- 专业但有温度，像行业专家在分享观点
- 善用「换行留白」提升可读性（LinkedIn 算法偏好长停留时间）
- 开头第一行必须是 hook（问题/数据/反常识），因为 LinkedIn 只展示前 3 行
- 可以用 emoji 做段落标记，但不要过度（每3-5行1个）
- 适合的人称："I/我" + 个人经验分享

结构建议：
1) Hook（第一行抓人）
2) 故事/案例/数据（中间内容）
3) 洞察/观点（核心价值）
4) CTA（互动引导："Agree? Drop your thoughts below." / "你怎么看？评论区聊聊"）

要求：
1) 正文 200-1500 字符，保持输入语言（中文输入→中文输出，英文→英文）
2) 每1-3句换一行（LinkedIn 的竖向排版更吸引注意力）
3) 不要 Markdown 语法，不要输出图片 URL
4) 1-5个话题标签（不带#号，直接给词）
5) 如果内容偏英文/国际化，标签也用英文

❌ 禁止：AI 套话、过于正式的商务信函语气、堆砌 emoji

输出必须是严格 JSON：
{"content":"...","tags":["..."]}`},I=`
你是一个专业的社交媒体文案写手。你的文字必须像真人写的，绝对不能有AI味。

## 严格禁止的AI味模式

### 禁用词汇（出现即扣分）
- 中文：此外、值得注意的是、总而言之、综上所述、在当今、不仅...还...更...、与此同时、毋庸置疑、众所周知、不可否认、事实上、显而易见、至关重要、举足轻重、应运而生、蓬勃发展、日新月异、方兴未艾、如火如荼
- 英文：Moreover, Furthermore, Additionally, Nevertheless, It's worth noting, In today's, crucial, pivotal, landscape, testament, delve, foster, underscore, showcase, vibrant, tapestry, harness, leverage, utilize, groundbreaking, revolutionary

### 禁止的句式结构
- "不仅X，还Y，更Z"（排比三连）
- "让我们一起..."
- "在这个X的时代..."
- "X是Y的关键/基石/核心"
- 每段开头都用连接词
- 反问+立刻回答（"XX重要吗？答案是肯定的"）
- 用破折号做补充说明（——）过多

### 禁止的风格
- 过度使用感叹号!!!
- 堆砌形容词
- 空洞的正面结尾（"未来可期""让我们拭目以待"）
- 假装亲切（"小伙伴们""家人们"）—— 除非平台风格确实如此

## 应该做的
- 短句为主，长短交替
- 具体 > 抽象（用数字、案例、细节）
- 直接说 > 绕弯子
- 有观点 > 中立描述
- "是/有/能" > "作为/致力于/赋能"
- 口语化但不随意
`,J={xiaohongshu_note:"openai/gpt-4.1-mini",wechat_xiaolushu:"openai/gpt-4.1-mini",weibo:"openai/gpt-4.1-mini",jike:"openai/gpt-4.1-mini",x:"openai/gpt-4.1-mini",linkedin:"openai/gpt-4.1-mini"},K={wechat_xiaolushu:900,xiaohongshu_note:900,weibo:1500,jike:1500,x:3e3,linkedin:2500},L=v.Ik({title:v.Yj().optional(),content:v.Yj().min(1),tags:v.YO(v.Yj()).optional()});async function M(a){if("xiaohongshu_note"!==a.platform)return{};let b=process.env.OPENROUTER_API_KEY;if(!b)return{};let c=function(a){let b=String(a.title||"").trim(),c=a.content.split("\n").find(a=>a.trim())||"",d=a.images.slice(0,3).map((a,b)=>`图${b+1}${a.alt?`（${a.alt}）`:""}`).join("、"),e=d?`；可参考配图：${d}`:"";return`小红书爆款封面，突出"${b||c||"实用图文分享"}"的主题与结果感${e}`}(a),d=function(a,b,c){let d=c?c.slice(0,120):"";return`为小红书图文笔记生成高点击率封面图。主题：${b||"小红书笔记"}
封面建议：${a}
正文摘要（仅供理解主题）：${d}

硬性要求：
1) 画幅比例 3:4（1080x1440）；
2) 标题文字 6-12 字，副标题 8-14 字；
3) 视觉清新、留白足、质感强，避免杂乱；
4) 不出现人物/人脸/真人；
5) 文字清晰可读，关键字可高亮。

风格参考：清新自然、质感静物、简洁排版、柔和配色。`}(c,a.title,a.content);try{let a=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${b}`,"HTTP-Referer":process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000","X-Title":"Ziliu Short Text Cover Generation"},body:JSON.stringify({model:"google/gemini-3-pro-image-preview",messages:[{role:"user",content:d}],modalities:["image","text"]})});if(!a.ok)throw Error(`OpenRouter API error: ${a.status}`);let e=await a.json(),f=e.choices?.[0]?.message?.images,g=f?.[0]?.image_url?.url;if(!g||"string"!=typeof g)return{coverSuggestion:c};return{coverImage:g,coverSuggestion:c}}catch(a){return console.error("小红书封面生成失败:",a),{coverSuggestion:c}}}async function N(a){try{var b;let c=await a.json(),{platform:d,articleId:e,title:f,content:g}=F.parse(c),h=await O({articleId:e,title:f,content:g});if(!h.markdown.trim())return u.NextResponse.json({success:!1,error:"内容为空"},{status:400});let i=function(a){if(!a)return[];let b=String(a),c=[],d=new Set,e=new Map;for(let a of b.matchAll(/^\s*\[([^\]]+)\]:\s*(?:<([^>]+)>|(\S+))(?:\s+(?:"([^"]+)"|'([^']+)'|\(([^)]+)\)))?\s*$/gm)){let b=(a[1]||"").trim().toLowerCase(),c=C(a[2]||a[3]||""),d=(a[4]||a[5]||a[6]||"").trim()||void 0;b&&c&&e.set(b,{url:c,title:d})}let f=a=>{let b=C(a.url);b&&(d.has(b)||(d.add(b),c.push({...a,url:b})))};for(let a of b.matchAll(/!\[([^\]]*)\]\(([^)]+)\)/g)){let b,c=(a[1]||"").trim()||void 0,d=(a[2]||"").trim(),e="";if(d.startsWith("<")&&d.includes(">")){let a=d.indexOf(">");e=d.slice(1,a).trim(),b=D(d.slice(a+1).trim())}else e=d.split(/\s+/)[0]||"",b=D(d.slice(e.length).trim());f({url:e,alt:c,title:b,raw:a[0]})}for(let a of b.matchAll(/!\[([^\]]*)\]\[([^\]]*)\]/g)){let b=(a[1]||"").trim()||void 0,c=((a[2]||"").trim()||b||"").trim().toLowerCase(),d=c?e.get(c):void 0;d?.url&&f({url:d.url,alt:b,title:d.title,raw:a[0]})}for(let a of b.matchAll(/<img\b[^>]*>/gi)){let b=a[0]||"",c=E(b,"src");c&&f({url:c,alt:E(b,"alt")||void 0,raw:b})}return c}(h.markdown),j=(b=h.markdown)?String(b).replace(/```[\s\S]*?```/g,"").replace(/`([^`]+)`/g,"$1").replace(/!\[([^\]]*)\]\([^\)]*\)/g,"$1").replace(/\[([^\]]+)\]\(([^\)]+)\)/g,"$1 ($2)").replace(/^\s{0,3}>\s?/gm,"").replace(/^\s{0,3}#{1,6}\s+/gm,"").replace(/\*\*([^*]+)\*\*/g,"$1").replace(/\*([^*]+)\*/g,"$1").replace(/__([^_]+)__/g,"$1").replace(/_([^_]+)_/g,"$1").replace(/<[^>]*>/g,"").replace(/\r\n/g,"\n").replace(/\n{3,}/g,"\n\n").trim():"",k=await P({platform:d,title:h.title,plainText:j,images:i}),l=function(a,b,c){let d=G[a],e=(b.tags||[]).map(a=>String(a||"").trim()).filter(Boolean).slice(0,d.tagMax||0),f=R(a,String(b.content||"").trim());d.contentMax&&f.length>d.contentMax&&(f=f.slice(0,d.contentMax).trim());let g=b.title?.trim();if("xiaohongshu_note"===a||"wechat_xiaolushu"===a){g=g||c||("wechat_xiaolushu"===a?"图片消息":"图文笔记");let b=d.titleMax||20;g.length>b&&(g=g.slice(0,b).trim())}else g=g?.trim()||void 0;if("wechat_xiaolushu"===a&&(f=Q(f),g&&(g=Q(g)),e.length>0))for(let a=0;a<e.length;a+=1)e[a]=Q(e[a]);return{title:g,content:f,tags:d.tagMax?e:[]}}(d,k,h.title),{coverImage:m,coverSuggestion:n}=await M({platform:d,title:l.title||h.title,content:l.content,images:i});return u.NextResponse.json({success:!0,data:{platform:d,title:l.title,content:l.content,tags:l.tags,images:i,imageCount:i.length,plainText:j,coverImage:m,coverSuggestion:n}})}catch(b){if(console.error("短图文生成失败:",b),b instanceof w.G)return u.NextResponse.json({success:!1,error:"参数错误"},{status:400});let a=b instanceof Error?b.message:"";if("未登录"===a)return u.NextResponse.json({success:!1,error:"未登录"},{status:401});if(a.includes("文章不存在")||a.includes("无权访问"))return u.NextResponse.json({success:!1,error:a},{status:404});return u.NextResponse.json({success:!1,error:"生成失败，请重试"},{status:500})}}async function O(a){if(a.articleId){let b=await (0,x.getServerSession)(y.authOptions);if(!b?.user?.id)throw Error("未登录");let c=await z.db.query.articles.findFirst({where:(0,B.Uo)((0,B.eq)(A.articles.id,a.articleId),(0,B.eq)(A.articles.userId,b.user.id))});if(!c)throw Error("文章不存在或无权访问");return{title:c.title||"",markdown:c.content||""}}return{title:a.title||"",markdown:a.content||""}}async function P(a){var b;let c=process.env.OPENROUTER_API_KEY;if(!c)return S(a);let d=H[a.platform],e=(b=a.images).length?b.slice(0,20).map((a,b)=>{let c=a.alt?`（描述：${a.alt}）`:"";return`图${b+1}${c}`}).join("\n"):"无",f=`
${d}

原始标题：
${a.title||"无"}

原始正文（已转为纯文本）：
${a.plainText}

配图信息（仅供参考，不要输出URL）：
${e}
`;try{let b=await fetch("https://openrouter.ai/api/v1/chat/completions",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${c}`,"HTTP-Referer":process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000","X-Title":"Ziliu Short Text Generation"},body:JSON.stringify({model:J[a.platform],messages:[{role:"system",content:I},{role:"user",content:f}],max_tokens:K[a.platform],temperature:.8,top_p:1})});if(!b.ok)throw Error(`OpenRouter API error: ${b.status}`);let d=await b.json(),e=d.choices?.[0]?.message?.content?.trim();if(!e)throw Error("AI返回空内容");let g=function(a){try{return JSON.parse(a)}catch{}let b=a.indexOf("{"),c=a.lastIndexOf("}");if(-1!==b&&-1!==c&&c>b){let d=a.slice(b,c+1);try{return JSON.parse(d)}catch{}}return{content:a}}(e);return L.parse(g)}catch(b){return console.error("AI生成失败，使用降级方案:",b),S(a)}}function Q(a){return String(a||"").replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,"").replace(/\s{2,}/g," ").trim()}function R(a,b){return"weibo"!==a&&"jike"!==a&&"x"!==a&&"linkedin"!==a?b:String(b||"").replace(/\r\n/g,"\n").split("\n").map(a=>a.trim()).join("\n").replace(/\n{3,}/g,"\n\n").trim()}function S(a){let b=a.plainText.replace(/\n{3,}/g,"\n\n").trim(),c=b.length>600?`${b.slice(0,600).trim()}…`:b,d=a.images.length>0?["配图","分享"]:["分享"];return"wechat_xiaolushu"===a.platform?{title:Q(a.title?a.title.slice(0,20):"图片消息"),content:Q(`${c}

欢迎在评论区补充。`),tags:[]}:"xiaohongshu_note"===a.platform?{title:a.title?a.title.slice(0,20):"图文笔记",content:`${c}

你更想看哪一部分？评论区聊聊～`,tags:["干货","记录",...d].slice(0,10)}:"weibo"===a.platform?{content:R("weibo",`${c.slice(0,220)}

你怎么看？`),tags:["日常",...d].slice(0,5)}:"jike"===a.platform?{content:R("jike",`${c.slice(0,300)}

欢迎补充。`),tags:["随手记",...d].slice(0,5)}:"x"===a.platform?{content:R("x",c.slice(0,4e3)),tags:["thoughts",...d].slice(0,8)}:"linkedin"===a.platform?{content:R("linkedin",`${c.slice(0,1500)}

你怎么看？评论区聊聊。`),tags:["行业洞察",...d].slice(0,5)}:{content:`${c}

你也有类似的经历吗？`,tags:["分享",...d].slice(0,10)}}let T=new e.AppRouteRouteModule({definition:{kind:f.RouteKind.APP_ROUTE,page:"/api/short-text/generate/route",pathname:"/api/short-text/generate",filename:"route",bundlePath:"app/api/short-text/generate/route"},distDir:".next",projectDir:"",resolvedPagePath:"/root/projects/ziliu/src/app/api/short-text/generate/route.ts",nextConfigOutput:"standalone",userland:d}),{workAsyncStorage:U,workUnitAsyncStorage:V,serverHooks:W}=T;function X(){return(0,g.patchFetch)({workAsyncStorage:U,workUnitAsyncStorage:V})}async function Y(a,b,c){var d;let e="/api/short-text/generate/route";"/index"===e&&(e="/");let g=await T.prepare(a,b,{srcPage:e,multiZoneDraftMode:"false"});if(!g)return b.statusCode=400,b.end("Bad Request"),null==c.waitUntil||c.waitUntil.call(c,Promise.resolve()),null;let{buildId:u,params:v,nextConfig:w,isDraftMode:x,prerenderManifest:y,routerServerContext:z,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,resolvedPathname:C}=g,D=(0,j.normalizeAppPath)(e),E=!!(y.dynamicRoutes[D]||y.routes[C]);if(E&&!x){let a=!!y.routes[C],b=y.dynamicRoutes[D];if(b&&!1===b.fallback&&!a)throw new s.NoFallbackError}let F=null;!E||T.isDev||x||(F="/index"===(F=C)?"/":F);let G=!0===T.isDev||!E,H=E&&!G,I=a.method||"GET",J=(0,i.getTracer)(),K=J.getActiveScopeSpan(),L={params:v,prerenderManifest:y,renderOpts:{experimental:{dynamicIO:!!w.experimental.dynamicIO,authInterrupts:!!w.experimental.authInterrupts},supportsDynamicResponse:G,incrementalCache:(0,h.getRequestMeta)(a,"incrementalCache"),cacheLifeProfiles:null==(d=w.experimental)?void 0:d.cacheLife,isRevalidate:H,waitUntil:c.waitUntil,onClose:a=>{b.on("close",a)},onAfterTaskError:void 0,onInstrumentationRequestError:(b,c,d)=>T.onRequestError(a,b,d,z)},sharedContext:{buildId:u}},M=new k.NodeNextRequest(a),N=new k.NodeNextResponse(b),O=l.NextRequestAdapter.fromNodeNextRequest(M,(0,l.signalFromNodeResponse)(b));try{let d=async c=>T.handle(O,L).finally(()=>{if(!c)return;c.setAttributes({"http.status_code":b.statusCode,"next.rsc":!1});let d=J.getRootSpanAttributes();if(!d)return;if(d.get("next.span_type")!==m.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${d.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let e=d.get("next.route");if(e){let a=`${I} ${e}`;c.setAttributes({"next.route":e,"http.route":e,"next.span_name":a}),c.updateName(a)}else c.updateName(`${I} ${a.url}`)}),g=async g=>{var i,j;let k=async({previousCacheEntry:f})=>{try{if(!(0,h.getRequestMeta)(a,"minimalMode")&&A&&B&&!f)return b.statusCode=404,b.setHeader("x-nextjs-cache","REVALIDATED"),b.end("This page could not be found"),null;let e=await d(g);a.fetchMetrics=L.renderOpts.fetchMetrics;let i=L.renderOpts.pendingWaitUntil;i&&c.waitUntil&&(c.waitUntil(i),i=void 0);let j=L.renderOpts.collectedTags;if(!E)return await (0,o.I)(M,N,e,L.renderOpts.pendingWaitUntil),null;{let a=await e.blob(),b=(0,p.toNodeOutgoingHttpHeaders)(e.headers);j&&(b[r.NEXT_CACHE_TAGS_HEADER]=j),!b["content-type"]&&a.type&&(b["content-type"]=a.type);let c=void 0!==L.renderOpts.collectedRevalidate&&!(L.renderOpts.collectedRevalidate>=r.INFINITE_CACHE)&&L.renderOpts.collectedRevalidate,d=void 0===L.renderOpts.collectedExpire||L.renderOpts.collectedExpire>=r.INFINITE_CACHE?void 0:L.renderOpts.collectedExpire;return{value:{kind:t.CachedRouteKind.APP_ROUTE,status:e.status,body:Buffer.from(await a.arrayBuffer()),headers:b},cacheControl:{revalidate:c,expire:d}}}}catch(b){throw(null==f?void 0:f.isStale)&&await T.onRequestError(a,b,{routerKind:"App Router",routePath:e,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:H,isOnDemandRevalidate:A})},z),b}},l=await T.handleResponse({req:a,nextConfig:w,cacheKey:F,routeKind:f.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:y,isRoutePPREnabled:!1,isOnDemandRevalidate:A,revalidateOnlyGenerated:B,responseGenerator:k,waitUntil:c.waitUntil});if(!E)return null;if((null==l||null==(i=l.value)?void 0:i.kind)!==t.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==l||null==(j=l.value)?void 0:j.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});(0,h.getRequestMeta)(a,"minimalMode")||b.setHeader("x-nextjs-cache",A?"REVALIDATED":l.isMiss?"MISS":l.isStale?"STALE":"HIT"),x&&b.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let m=(0,p.fromNodeOutgoingHttpHeaders)(l.value.headers);return(0,h.getRequestMeta)(a,"minimalMode")&&E||m.delete(r.NEXT_CACHE_TAGS_HEADER),!l.cacheControl||b.getHeader("Cache-Control")||m.get("Cache-Control")||m.set("Cache-Control",(0,q.getCacheControlHeader)(l.cacheControl)),await (0,o.I)(M,N,new Response(l.value.body,{headers:m,status:l.value.status||200})),null};K?await g(K):await J.withPropagatedContext(a.headers,()=>J.trace(m.BaseServerSpan.handleRequest,{spanName:`${I} ${a.url}`,kind:i.SpanKind.SERVER,attributes:{"http.method":I,"http.target":a.url}},g))}catch(b){if(K||b instanceof s.NoFallbackError||await T.onRequestError(a,b,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,n.c)({isRevalidate:H,isOnDemandRevalidate:A})}),E)throw b;return await (0,o.I)(M,N,new Response(null,{status:500})),null}}},94735:a=>{"use strict";a.exports=require("events")},96487:()=>{}};var b=require("../../../../webpack-runtime.js");b.C(a);var c=b.X(0,[431,6055,2789,639,9854,4427],()=>b(b.s=93465));module.exports=c})();