import { ArrowRight, CalendarRange, Heart, Newspaper, ShieldCheck } from "lucide-react";
import Image from "next/image";
import { ChronicleSections } from "@/components/chronicle-sections";
import { FloatingBlobs } from "@/components/floating-blobs";
import { Navigation } from "@/components/navigation";
import { readPublishedChronicle } from "@/src/lib/storage";
import type { ReleaseType } from "@/src/lib/types";

const releaseTypeLabel: Record<ReleaseType, string> = {
  daily: "今日轻更新",
  weekly: "本周摘要",
  monthly: "月度归档",
  rebuild: "全量重建"
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Shanghai"
  }).format(new Date(date));
}

export default async function HomePage() {
  const chronicle = await readPublishedChronicle();

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      <Navigation />
      <section id="hero" className="section-shell relative mx-auto flex min-h-screen max-w-7xl items-center px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <FloatingBlobs />
        <div className="grid w-full items-start gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative z-10 space-y-8 animate-fadeUp">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              <Heart className="mr-2 h-4 w-4" />
              群体记忆，克制公开
            </span>
            <div className="space-y-5">
              <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-tight text-slate-900 md:text-7xl">
                群编年史，
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-indigo-500 bg-clip-text text-transparent">把彼此照看的历史</span>
                写成可被信任的公开叙事。
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 md:text-xl">{chronicle.group.description}</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <a href="#release" className="inline-flex items-center rounded-2xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-float transition hover:bg-blue-700">
                先看这次更新
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#timeline" className="inline-flex items-center rounded-2xl border border-blue-200 bg-blue-50 px-6 py-3 font-semibold text-blue-700 transition hover:bg-blue-100">
                进入时间线
              </a>
              <a href="#values" className="inline-flex items-center rounded-2xl border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100">
                了解公开原则
              </a>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="story-card p-5">
                <p className="text-sm text-slate-500">更新方式</p>
                <p className="mt-2 font-semibold text-slate-900">{chronicle.group.updateCadence}</p>
              </div>
              <div className="story-card p-5">
                <p className="text-sm text-slate-500">数据来源</p>
                <p className="mt-2 font-semibold text-slate-900">离线收集的群友记录</p>
              </div>
              <div className="story-card p-5">
                <p className="text-sm text-slate-500">公开策略</p>
                <p className="mt-2 font-semibold text-slate-900">摘要 + 精选片段</p>
              </div>
            </div>

            <div id="release" className="story-card border-blue-100 bg-white/90 p-6">
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                  <Newspaper className="mr-2 h-3.5 w-3.5" />
                  {releaseTypeLabel[chronicle.release.type]}
                </span>
                <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  <CalendarRange className="mr-2 h-3.5 w-3.5" />
                  {chronicle.release.periodStart} ~ {chronicle.release.periodEnd}
                </span>
              </div>
              <h2 className="mt-4 text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{chronicle.release.label}</h2>
              <p className="mt-3 max-w-3xl leading-8 text-slate-600">{chronicle.release.summary}</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {chronicle.release.highlights.map((item) => (
                  <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-500">
                {chronicle.release.metrics.map((metric) => (
                  <span key={metric.label} className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                    {metric.label}：<span className="font-semibold text-slate-800">{metric.value}</span>
                  </span>
                ))}
                <span className="rounded-full bg-white px-3 py-1 ring-1 ring-slate-200">
                  发布时间：<span className="font-semibold text-slate-800">{formatDate(chronicle.release.publishedAt)}</span>
                </span>
              </div>
            </div>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="story-card overflow-hidden p-7">
              <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
                <div className="relative h-20 w-20 overflow-hidden rounded-full border-4 border-blue-50 bg-blue-100">
                  <Image src={chronicle.group.ownerAvatar} alt={chronicle.group.ownerName} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-sm text-slate-500">核心人物</p>
                  <h2 className="text-2xl font-bold text-slate-900">{chronicle.group.ownerName}</h2>
                  <p className="text-sm text-blue-700">{chronicle.group.ownerRole}</p>
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <p className="leading-7 text-slate-600">{chronicle.group.ownerBio}</p>
                <div className="rounded-3xl bg-slate-50 p-5">
                  <p className="text-sm font-semibold text-slate-900">群的信任声明</p>
                  <p className="mt-2 leading-7 text-slate-600">{chronicle.group.trustStatement}</p>
                </div>
                <div className="space-y-3">
                  {chronicle.group.principles.map((principle) => (
                    <div key={principle} className="flex items-start gap-3 rounded-2xl bg-blue-50/60 p-4 text-sm text-slate-700">
                      <ShieldCheck className="mt-0.5 h-4 w-4 flex-none text-blue-600" />
                      <span>{principle}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="story-card p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-blue-700">今日轻更新</p>
                  <h3 className="mt-1 text-2xl font-black text-slate-900">今天都发生了什么</h3>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">轻信息，不打断长时间线</span>
              </div>
              <div className="mt-5 space-y-3">
                {chronicle.release.dailyDigest.map((item) => (
                  <article key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                    <p className="mt-2 text-sm leading-7 text-slate-600">{item.detail}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <ChronicleSections chronicle={chronicle} />
    </main>
  );
}
