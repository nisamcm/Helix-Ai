exports.handler = async function (event) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
      },
      body: '',
    }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch {
    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: 'Invalid request body' } }),
    }
  }

  try {
    const model = body.model || 'openai'
    const system = body.system || ''
    const history = body.messages || []

    // Build messages array — system first, then conversation history
    const messages = [
      { role: 'system', content: system },
      ...history.map(m => ({
        role: m.role === 'ai' ? 'assistant' : m.role,
        content: m.content,
      })),
    ]

    // Pollinations AI — 100% free, no API key needed
    const response = await fetch('https://text.pollinations.ai/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messages,
        model,          // openai | mistral | claude | llama | deepseek
        seed: Math.floor(Math.random() * 99999),
        jsonMode: false,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: { message: `Pollinations error: ${errText}` } }),
      }
    }

    // Pollinations returns plain text directly
    const text = await response.text()

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ content: [{ type: 'text', text }] }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: { message: 'Failed to reach AI: ' + err.message } }),
    }
  }
}
