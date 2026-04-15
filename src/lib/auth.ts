import { NextResponse } from "next/server";

/**
 * 验证管理员身份。
 * 对比请求头中的 Bearer Token 与环境变量 ADMIN_SECRET_TOKEN。
 * 未配置环境变量时直接返回 503，防止接口裸奔。
 * 返回 null 表示验证通过；返回 NextResponse 表示验证失败，调用方直接 return 该响应即可。
 */
export function verifyAdminToken(request: Request): NextResponse | null {
  const secret = process.env.ADMIN_SECRET_TOKEN?.trim();

  // 未配置 token 时禁止所有 admin 操作，避免裸奔风险
  if (!secret) {
    return NextResponse.json(
      { error: "Admin API not configured. Set ADMIN_SECRET_TOKEN environment variable." },
      { status: 503 }
    );
  }

  const authHeader = request.headers.get("authorization");

  // 请求头格式必须为：Authorization: Bearer <token>
  if (authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 验证通过，返回 null 允许继续执行
  return null;
}
