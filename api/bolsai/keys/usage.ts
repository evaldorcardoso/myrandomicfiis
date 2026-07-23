import type { VercelRequest, VercelResponse } from '@vercel/node'

const BOLSAI_API_KEY = process.env.BOLSAI_API_KEY
const BOLSAI_BASE_URL = 'https://api.usebolsai.com/api/v1'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
    return res.status(200).end()
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  if (!BOLSAI_API_KEY) {
    return res.status(500).json({ error: 'BolsAI API key not configured' })
  }

  try {
    const url = `${BOLSAI_BASE_URL}/keys/usage?api_key=${BOLSAI_API_KEY}`
    const response = await fetch(url)
    const data = await response.json()

    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    return res.status(response.ok ? 200 : response.status).json(data)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch usage from BolsAI' })
  }
}