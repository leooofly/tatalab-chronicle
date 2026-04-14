import { CalendarDays, HeartHandshake, Lightbulb, Shield, Sparkles } from "lucide-react";
import type { PublishedChronicle } from "@/src/lib/types";
import { FloatingBlobs } from "@/components/floating-blobs";

const colorMap = {
  blue: "bg-blue-100 text-blue-700 border-blue-200",
  cyan: "bg-cyan-100 text-cyan-700 border-cyan-200",
  indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",
  pink: "bg-pink-100 text-pink-700 border-pink-200",
  green: "bg-emerald-100 text-emerald-700 border-emerald-200"
} as const;

export function ChronicleSections({ chronicle }: { chronicle: PublishedChronicle }) {
  return (
    <>
      <section id="timeline" className="section-shell bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700">
              <CalendarDays className="mr-2 h-4 w-4" />
              阶段时间线
            </span>
            <h2 className="mt-6 text-4xl font-black text-slate-900">群不是一下子变得重要，而是慢慢长成的。</h2>
            <p className="mt-4 text-lg leading-8 text-slate-600">我们只公开能帮助人理解群变迁的部分：阶段、转折、精选片段与温度线索。</p>
          </div>
          <div className="mt-14 space-y-10 border-l-4 border-blue-100 pl-6 md:pl-12">
            {chronicle.stages.map((stage) => {
              const stageEvents = chronicle.events.filter((event) => event.stageId === stage.id);
              return (
                <article key={stage.id} className="relative">
                  <div className={`absolute -left-[3.1rem] top-2 h-6 w-6 rounded-full border-4 border-white shadow ${colorMap[stage.color]}`} />
                  <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stage.period}</p>
                      <h3 className="mt-2 text-2xl font-bold text-slate-900">{stage.label}</h3>
                      <p className="mt-3 text-sm leading-7 text-slate-500">{stage.tone}</p>
                    </div>
                    <div className="story-card p-7">
                      <p className="leading-8 text-slate-600">{stage.summary}</p>
                      <div className="mt-6 grid gap-4">
                        {stageEvents.map((event) => (
                          <div key={event.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="text-sm font-semibold text-blue-700">{event.date}</span>
                              {event.tags.map((tag) => (
                                <span key={tag} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">{tag}</span>
                              ))}
                            </div>
                            <h4 className="mt-3 text-xl font-bold text-slate-900">{event.title}</h4>
                            <p className="mt-2 leading-7 text-slate-600">{event.summary}</p>
                            {event.quote && event.quoteVisibility === "public" ? (
                              <blockquote className="mt-4 rounded-2xl border-l-4 border-blue-300 bg-blue-50/70 p-4 text-sm leading-7 text-slate-700">
                                “{event.quote}”
                              </blockquote>
                            ) : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section id="milestones" className="section-shell bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
                <Sparkles className="mr-2 h-4 w-4" />
                里程碑
              </span>
              <h2 className="mt-6 text-4xl font-black text-slate-900">那些让群气质发生变化的节点。</h2>
              <p className="mt-4 text-lg leading-8 text-slate-600">里程碑不一定是大事，它也可能只是一次命名、一次欢迎、一次把疲惫接住的回应。</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {chronicle.milestones.map((milestone) => (
                <article key={milestone.id} className="story-card p-6">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${colorMap[milestone.color]}`}>{milestone.label}</span>
                  <h3 className="mt-4 text-xl font-bold text-slate-900">{milestone.title}</h3>
                  <p className="mt-3 leading-7 text-slate-600">{milestone.summary}</p>
                  <div className="mt-5 flex items-center justify-between text-sm">
                    <span className="font-semibold text-slate-800">{milestone.metric}</span>
                    <span className="text-slate-400">{milestone.date}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="people" className="section-shell bg-white px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-pink-700">
              <HeartHandshake className="mr-2 h-4 w-4" />
              核心人物
            </span>
            <h2 className="mt-6 text-4xl font-black text-slate-900">不是谁最显眼，而是谁让这里更可靠。</h2>
          </div>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {chronicle.corePeople.map((person, index) => (
              <article key={person.id} className="story-card relative overflow-hidden p-7">
                <div className={`absolute right-0 top-0 h-24 w-24 rounded-bl-[40px] ${index === 0 ? 'bg-blue-50' : index === 1 ? 'bg-pink-50' : 'bg-emerald-50'}`} />
                <p className="text-sm text-slate-500">{person.role}</p>
                <h3 className="mt-2 text-2xl font-bold text-slate-900">{person.name}</h3>
                <p className="mt-4 leading-7 text-slate-600">{person.bio}</p>
                <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">{person.contribution}</div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {person.keywords.map((keyword) => (
                    <span key={keyword} className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-500 ring-1 ring-slate-200">{keyword}</span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="insights" className="section-shell bg-slate-50 px-4 py-24 sm:px-6 lg:px-8">
        <FloatingBlobs />
        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-emerald-700">
                <Lightbulb className="mr-2 h-4 w-4" />
                群画像
              </span>
              <h2 className="mt-6 text-4xl font-black text-slate-900">这个群真正留下来的，是一种相处方法。</h2>
              <p className="mt-4 leading-8 text-slate-600">它并不靠高压规则维持，而是靠持续回应、允许掉队和重复提醒，慢慢形成了自己的节律。</p>
            </div>
            <div className="grid gap-5">
              {chronicle.insights.map((insight) => (
                <article key={insight.id} className="story-card p-6">
                  <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold ${colorMap[insight.accent]}`}>{insight.title}</span>
                  <p className="mt-4 leading-8 text-slate-600">{insight.body}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="values" className="section-shell bg-blue-600 px-4 py-24 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <span className="inline-flex items-center rounded-full border border-blue-300 bg-blue-500/30 px-4 py-2 text-sm font-semibold text-blue-50">
                <Shield className="mr-2 h-4 w-4" />
                公开原则
              </span>
              <h2 className="mt-6 text-4xl font-black leading-tight">这份编年史努力留下文化，不留下伤害。</h2>
              <p className="mt-4 max-w-xl leading-8 text-blue-100">网站不会公开完整聊天全文，不会展示可识别的私人信息，也不会把尚未确认的情绪片段包装成确定结论。</p>
            </div>
            <div className="rounded-[32px] border border-blue-400/40 bg-slate-900/60 p-8 shadow-2xl backdrop-blur-sm">
              <div className="flex items-center gap-2 border-b border-slate-700 pb-4">
                <span className="h-3 w-3 rounded-full bg-red-400" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-400" />
                <span className="ml-3 font-mono text-xs text-slate-400">chronicle-publication-policy.txt</span>
              </div>
              <div className="mt-6 space-y-4 font-mono text-sm leading-7 text-green-300">
                <p>- 原始聊天记录只作为内部整理材料使用</p>
                <p>- 命中敏感规则的内容不会公开展示</p>
                <p>- 精选片段只用于说明群文化，不用于评判个体</p>
                <p>- 所有新导入批次先生成预览，再决定是否发布</p>
                <p>- 更新失败时继续保留上一版已发布站点</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
