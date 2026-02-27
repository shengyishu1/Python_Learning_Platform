// ============================================
// Cloudflare Worker — Multi-Provider API Proxy for PyLingo
// ============================================
// Supports: Google Gemini, OpenRouter, OpenAI, Claude
//
// 部署步骤：
// 1. 打开 https://dash.cloudflare.com → Compute → Workers
// 2. 点击你的 Worker → Edit code
// 3. 把这个代码全部粘贴进去替换旧代码
// 4. 点 Deploy
// ============================================

export default {
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, x-api-key, x-provider',
          'Access-Control-Max-Age': '86400',
        }
      });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 });
    }

    const cors = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    };

    try {
      const apiKey = request.headers.get('x-api-key');
      const provider = request.headers.get('x-provider') || 'gemini';

      if (!apiKey) {
        return new Response(JSON.stringify({ error: { message: 'No API key provided' } }), {
          status: 401, headers: cors
        });
      }

      const body = await request.json();
      let response;

      // ═══ CLAUDE (Anthropic) ═══
      if (provider === 'claude') {
        body.model = 'claude-sonnet-4-20250514';
        if (body.max_tokens > 4000) body.max_tokens = 4000;

        response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();
        if (!response.ok) return new Response(JSON.stringify(data), { status: response.status, headers: cors });
        return new Response(JSON.stringify(data), { headers: cors });
      }

      // ═══ OPENAI (GPT) ═══
      if (provider === 'openai') {
        const oBody = {
          model: 'gpt-4o-mini',
          max_tokens: Math.min(body.max_tokens || 2000, 4000),
          messages: []
        };
        if (body.system) oBody.messages.push({ role: 'system', content: body.system });
        if (body.messages) {
          for (const msg of body.messages) {
            oBody.messages.push({
              role: msg.role,
              content: typeof msg.content === 'string' ? msg.content :
                msg.content.map(c => c.text || '').join('\n')
            });
          }
        }

        response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
          body: JSON.stringify(oBody)
        });

        const oData = await response.json();
        if (!response.ok) return new Response(JSON.stringify({ error: { message: oData.error?.message || 'OpenAI error' } }), { status: response.status, headers: cors });
        return new Response(JSON.stringify({ content: [{ type: 'text', text: oData.choices?.[0]?.message?.content || '' }] }), { headers: cors });
      }

      // ═══ OPENROUTER ═══
      if (provider === 'openrouter') {
        const orBody = {
          model: 'google/gemini-2.5-flash',
          max_tokens: Math.min(body.max_tokens || 2000, 4000),
          messages: []
        };
        if (body.system) orBody.messages.push({ role: 'system', content: body.system });
        if (body.messages) {
          for (const msg of body.messages) {
            orBody.messages.push({
              role: msg.role,
              content: typeof msg.content === 'string' ? msg.content :
                msg.content.map(c => c.text || '').join('\n')
            });
          }
        }

        response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://pylingo.app',
            'X-Title': 'PyLingo'
          },
          body: JSON.stringify(orBody)
        });

        const orData = await response.json();
        if (!response.ok) return new Response(JSON.stringify({ error: { message: orData.error?.message || 'OpenRouter error' } }), { status: response.status, headers: cors });
        return new Response(JSON.stringify({ content: [{ type: 'text', text: orData.choices?.[0]?.message?.content || '' }] }), { headers: cors });
      }

      // ═══ GOOGLE GEMINI ═══
      if (provider === 'gemini') {
        const gBody = {
          contents: [],
          generationConfig: { maxOutputTokens: Math.min(body.max_tokens || 2000, 4000) }
        };
        if (body.system) gBody.systemInstruction = { parts: [{ text: body.system }] };
        if (body.messages) {
          for (const msg of body.messages) {
            const text = typeof msg.content === 'string' ? msg.content :
              msg.content.map(c => c.text || '').join('\n');
            gBody.contents.push({ role: msg.role === 'assistant' ? 'model' : 'user', parts: [{ text }] });
          }
        }

        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(gBody)
        });

        const gData = await response.json();
        if (!response.ok) return new Response(JSON.stringify({ error: { message: gData.error?.message || 'Gemini error' } }), { status: response.status, headers: cors });
        const text = gData.candidates?.[0]?.content?.parts?.map(p => p.text || '').join('\n') || '';
        return new Response(JSON.stringify({ content: [{ type: 'text', text }] }), { headers: cors });
      }

      return new Response(JSON.stringify({ error: { message: 'Unknown provider: ' + provider } }), { status: 400, headers: cors });
    } catch (error) {
      return new Response(JSON.stringify({ error: { message: 'Proxy error: ' + error.message } }), { status: 500, headers: cors });
    }
  }
};
