<div dir="rtl">

# 🎬 FASTIFY MOTION BRO
### استوديو موشن جرافيك وأنيميشن يبدأ بالأسئلة، وينتهي بفيديو قابل للمراجعة والتحرير

**نسخة تأسيسية قابلة للتشغيل v0.1** — صُممت لكي تعطي رابط هذا المستودع إلى **Codex أو Claude Code أو Gemini CLI أو Cursor** وتقول: *«عايز فيديو كذا»*. الوكيل يقرأ `AGENTS.md`/`CLAUDE.md`، يسألك **الأسئلة الناقصة مرة واحدة**، يكتب مخطط الإخراج، يبني المشاهد المتحركة من الكود، يتيح المعاينة، وينفذ التصدير بعد الموافقة الصريحة.

> **لو أنت وكيل برمجي**: اقرأ أولًا `AGENTS.md` و`.agents/skills/fastify-motion-bro/SKILL.md`. لا تختلق وجود خدمة AI أو محرك خارجي إن لم تكن متصلة. لا تصدّر النسخة النهائية قبل اعتماد المستخدم.

## بدء سريع

**المتطلبات:** Node.js 20+ وPython 3.10+ وFFmpeg، ويحتاج الرندر متصفح Chromium وPlaywright.

```bash
npm run intake
npm run preview
```

بعدها افتح `http://127.0.0.1:4173`. يمكن تغيير الفكرة ومدّة الفيديو ولهجته من خلال الأسئلة، أو تعديل `project/brief.json` ثم:

```bash
npm run plan
npm test
python -m pip install -r requirements-render.txt
python -m playwright install chromium  # إذا لم يوجد Chromium مثبت على الجهاز
python scripts/render.py --smoke --seconds 2 --height 360 --fps 10 --output output/smoke.mp4
```

بعد أن يشاهد المستخدم المعاينة ويقول صراحة «ارندر» أو «اعتمد»، شغّل:

```bash
python scripts/render.py --approved --height 1920 --fps 30 --output output/final.mp4
python scripts/qa.py output/final.mp4
```

الملفات الناتجة: MP4؛ تقرير فني `output/qa_report.json`؛ ومصادر قابلة للتعديل داخل `web/` و`project/`.

## ماذا تفعل النسخة الحالية فعلًا؟

- **استقبال تفاعلي:** الموضوع، الهدف، الستايل، المقاس، المدة، اللغة، الصوت، الفيديو المرجعي، الهوية؛ ثم تخزين الإجابات في JSON.
- **خطة Storyboard قابلة للتحرير:** توقيتات مشاهد متصلة زمنيًا و`PLAN.md` و`STYLE.md`.
- **محرك Native Canvas حقيقي:** رسومات ومخططات ومؤثرات وعناوين تتحرك زمنيا، مع دعم العربية وRTL والتحريك المستقل عن سرعة الجهاز.
- **معاينة تفاعلية على المتصفح:** Play/Pause، تحريك المؤشر الزمني، وقفز إلى المشاهد.
- **تصدير H.264/MP4 عبر Chromium + FFmpeg** مع صوت اختياري وفحص أساسي.
- **اختبارات وحدات واختبار تقني قصير** قبل أي تسليم.

## ما هو التكامل المستقبلي، وليس وظيفة مفعّلة بعد؟

المشروع يختار مبدئيًا أحد المسارات: `native`، `remotion`، `hyperframes`، `kosif`. **المسارات الخارجية هنا توصيات توجيه موثقة وليست استدعاءات API عاملة في هذه النسخة**؛ إذا اختار الوكيل محركًا خارجيًا فعليه تثبيت متطلباته وتأكيد عمله، أو العودة للمحرك المحلي مع إخبارك بالتغيير. كذلك **محاذاة التعليق الصوتي كلمة بكلمة ليست محسوبة تلقائيًا في هذه النسخة**: يجب تشغيل أدوات KOSIF/motion-starter-kit الخاصة بالمحاذاة وقراءة تقريرها قبل الادعاء بتحققها. إنتاج المشاهد هنا تجريبي ومقصود به نقطة انطلاق؛ الوكيل يطور النص واللقطات وفق مشروعك بدل الاكتفاء بالمشهد الافتراضي.

## كيف تطلب فيديو من وكيل برمجي؟

```text
افتح مستودع FASTIFY MOTION BRO واقرأ AGENTS.md وSKILL.md.
أريد فيديو موشن جرافيك بعنوان «...». اسألني عن التفاصيل الناقصة مرة واحدة،
واكتب خطة الإخراج والمشاهد، وابنِ أنيميشن متحركًا من الكود.
اعرض لي المعاينة أولًا، ولا تصدر النسخة النهائية حتى أوافق.
```

## أساليب الإنتاج المقترحة

`cinematic` · `kinetic` · `doodle` · `whiteboard` · `chalkboard` · `plotter` · `stickman` · `isometric` · `3d` · `infographic` · `brag`

منسق المشاهد الأصلي يقدّم حركات أساسية لجميع الطلبات كبداية، **وليس تطبيقًا كاملاً لكل أسلوب**؛ تطوير whiteboard مرسوم بيد واقعية أو 3D متقدم أو فيديو تجاري يجب أن يستدعي مساره المتخصص ويضيف محتوى المشروع.

## الهيكل

| المسار | وظيفته |
|---|---|
| `AGENTS.md`, `CLAUDE.md` | دخول Codex وClaude وكل الوكلاء |
| `.agents/skills/fastify-motion-bro/SKILL.md` | بروتوكول الإنتاج خطوة بخطوة |
| `scripts/cli.mjs` | أسئلة استقبال المشروع |
| `scripts/planner.mjs` | إنشاء الخطة، المخطط، اختيار محرك العمل |
| `web/motion.js` | الرسم الزمني على Canvas (قابل للتحرير) |
| `web/player.js` | المعاينة والتحكم |
| `scripts/render.py` | تحويل الإطارات إلى MP4 |
| `scripts/qa.py` | التحقق التقني الأساسي |
| `docs/` | خطة التطوير، قوالب الأسئلة، المرجع والتراخيص |
| `examples/` | أمثلة عربية جاهزة |

## مصادر الاستفادة

المشروع يستلهم مسارات العمل العامة فقط من:

- [motalim-ai/motion-starter-kit](https://github.com/motalim-ai/motion-starter-kit) — أسئلة واحدة، Style Bible، Remotion.
- [latent-spaces/brag](https://github.com/latent-spaces/brag) — فيديوهات إطلاق المنتجات.
- [oso95/scroll-world](https://github.com/oso95/scroll-world) — Scroll-based 3D storytelling.
- [elayadesign/ai-design-skills](https://github.com/elayadesign/ai-design-skills) — هوية مرئية ومبادئ تصميم.
- [midudev/mcp-higgsfield-landing](https://github.com/midudev/mcp-higgsfield-landing) — مرجع فيديو انتقالي وHiggsfield. **بدون نسخ شيفرة المصدر** لعدم تحقق ترخيص صريح.
- [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) — HTML/CSS إلى فيديو.
- [kosif199022-jpg/kosif-one](https://github.com/kosif199022-jpg/kosif-one) و[kosif-studio](https://github.com/kosif199022-jpg/kosif-studio) — محركات KOSIF Montage & Motion وVoice2Motion وShapeKit.

راجع `docs/SOURCE_AUDIT.md` للتفريق بين الموجود/المتاح/المؤجل وحقوق الاستخدام. ملفات ZIP الأصلية الواردة في محادثات سابقة **ليست مضمنة في هذه الحزمة**؛ تم الاطلاع على تقاريرها المرجعية وربط نسخ KOSIF المنشورة.

> **المبدأ:** أنيميشن مُصمم مشهدًا بمشهد من الكود. لا تحويل مجموعة صور ثابتة إلى فيديو وإطلاق اسم موشن جرافيك عليها.

</div>