import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

// Load environment variables from .env file for local development
dotenv.config();

interface NotionQueryBody {
  filter?: any;
  sorts?: any[];
  start_cursor?: string;
  page_size?: number;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { databaseId, ...queryBody } = req.body as NotionQueryBody & { databaseId: string };

  // Validate database ID
  if (!databaseId) {
    return res.status(400).json({ error: 'Database ID is required' });
  }

  // Validate Notion token
  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    console.error('NOTION_TOKEN environment variable is not set');
    return res.status(500).json({ 
      error: 'Server configuration error',
      details: 'NOTION_TOKEN environment variable is not set. For local development, set it in your .env file or use: NOTION_TOKEN=your_token npm run dev'
    });
  }

  try {
    const response = await fetch(
      `https://api.notion.com/v1/databases/${databaseId}/query`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${notionToken}`,
          'Notion-Version': process.env.NOTION_API_VERSION || '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(queryBody),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error('Notion API error:', data);
      return res.status(response.status).json({
        error: data.message || 'Notion API request failed',
        code: data.code,
        status: response.status
      });
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    res.status(200).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}