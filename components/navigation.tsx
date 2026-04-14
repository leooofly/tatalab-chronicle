const items = [
  { id: "hero", label: "首页" },
  { id: "timeline", label: "时间线" },
  { id: "milestones", label: "里程碑" },
  { id: "people", label: "核心人物" },
  { id: "insights", label: "群画像" },
  { id: "values", label: "公开原则" }
];

export function Navigation() {
  return (
    <header className="glass-nav fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a href="#hero" className="group inline-flex items-center gap-3 no-underline">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-100 text-sm font-black text-blue-700">史</span>
          <span className="text-lg font-bold tracking-tight text-slate-900 transition group-hover:text-blue-600">群编年史</span>
        </a>
        <nav className="hidden gap-6 md:flex">
          {items.map((item) => (
            <a key={item.id} href={`#${item.id}`} className="text-sm font-medium text-slate-500 transition hover:text-blue-600">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
