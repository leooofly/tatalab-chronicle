# 部署工作流

这个项目现在支持两种前台取数方式：

## 1. 默认方式：Vercel 直接吃仓库里的已发布数据

适合当前阶段，最稳。

- 本机负责：
  - 运行 WD 导出后的导入脚本
  - 生成 `data/published/current.json`
  - 人工检查后提交到 GitHub
- Vercel 负责：
  - 从 GitHub 自动拉最新代码
  - 构建 Next.js 站点
  - 对外提供公开只读页面

推荐发布节奏：

```bash
npm run import:wd-export
npm run validate:data
npm run build
git add data/published/current.json data/imports/wd-group-meta.json data/imports/wd-README.txt
git commit -m "Update chronicle data"
git push
```

只要 Vercel 绑定了这个 GitHub 仓库，`git push` 之后就会自动重新部署。

## 2. 进阶方式：Vercel 从远程 JSON 源读取

如果你后面想让“本机后端”不依赖 Git push，也可以把本机或云服务器暴露一个公开 JSON 地址，然后给 Vercel 配：

- 环境变量：`CHRONICLE_DATA_URL`
- 值示例：`https://your-domain.example.com/chronicle/current.json`

项目会优先请求这个远程 JSON；如果失败，会自动退回仓库里的 `data/published/current.json`。

适合：

- 你的本机有稳定公网入口
- 或者你把“史官后端”放在云服务器
- 或者你用 tunnel / reverse proxy 暴露一个只读接口

## 当前建议

现阶段先用第 1 种：

- 简单
- 最稳
- 最容易审稿后再发布
- 不会把本机直接暴露到公网

等后面更新频率和自动化要求再提高，再切第 2 种。
