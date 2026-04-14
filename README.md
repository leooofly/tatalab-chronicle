# 群编年史

一个面向 `tatalab-一起早睡` 的公开只读编年史网站。

它继承 `tatalab.ai` 的明亮、轻盈、叙事式视觉语言，但把语气调整成更温柔、更可信、更像“群体记忆展板”的版本。网站基于离线导入的微信群聊天记录，提炼阶段、里程碑、人物和群画像，不公开完整聊天全文。

## 本地开发

```bash
npm install
npm run dev
```

如果本地 `3000` 端口的开发资源有异常，直接用生产预览更稳：

```bash
npm run build
npm run start
```

## 当前数据工作流

1. 在有原始微信本地数据库的电脑上运行 WD，导出可读取的数据文件
2. 把导出的 JSON / README / 元信息放进项目 `data/imports/`
3. 在本机运行导入脚本生成公开编年史数据
4. 人工检查后发布

当前已接入的 WD 导入命令：

```bash
npm run import:wd-export
```

验证与构建：

```bash
npm run validate:data
npm run build
```

## 目录结构

- `app/`：Next.js App Router 页面与 API
- `components/`：首页叙事模块、时间线、人物卡片等组件
- `src/lib/`：类型、存储、导入辅助逻辑
- `data/imports/`：WD 导出原始文件与导入来源
- `data/drafts/`：待审核的草稿包
- `data/published/current.json`：前台实际消费的公开数据
- `scripts/`：导入、验证、预发布、发布脚本
- `public/tata-avatar.png`：群主头像素材

## API

- `POST /api/admin/import-batch`
- `POST /api/admin/publish-preview`
- `POST /api/admin/publish`
- `POST /api/admin/rebuild`
- `GET /api/groups/:id/timeline`
- `GET /api/groups/:id/profiles`

## 部署建议

当前最推荐：

- 本机做“史官后台”：跑 WD 导入、数据整理、人工审核
- GitHub 做代码与已发布 JSON 的版本管理
- Vercel 做公开前台部署

详细流程见 `DEPLOYMENT.md`。
