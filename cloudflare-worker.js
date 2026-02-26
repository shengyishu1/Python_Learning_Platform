// ============================================
// Cloudflare Worker — API Proxy for ScrapeLingo
// ============================================
// 部署步骤：
// 1. 打开 https://dash.cloudflare.com → 注册/登录
// 2. 左侧菜单 → Workers & Pages → Create
// 3. 点 "Create Worker"
// 4. 把下面的代码全部粘贴进去，替换默认代码
// 5. 点 "Deploy"
// 6. 记下你的 Worker URL（类似 https://xxx.你的名字.workers.dev）
// 7. 把这个 URL 填到 index.html 里的 PROXY_URL 变量中
// ============================================

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    try {
      // Get the API key from the request header (user's own key)
      const apiKey = request.headers.get('x-api-key');
      if (!apiKey) {
        return new Response(JSON.stringify({ error: { message: 'No API key provided' } }), {
          status: 401,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
      }

      // Read and validate request body
      const body = await request.json();
      
      // Force Sonnet model (prevent abuse with expensive models)
      body.model = 'claude-sonnet-4-20250514';
      
      // Limit max tokens
      if (body.max_tokens > 4000) body.max_tokens = 4000;

      // Forward to Anthropic
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(body)
      });

      const data = await response.text();

      return new Response(data, {
        status: response.status,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: { message: 'Proxy error: ' + error.message } }), {
        status: 500,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }
  }
};
