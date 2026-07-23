import type { VercelRequest, VercelResponse } from "@vercel/node";
import dotenv from "dotenv";

dotenv.config();

interface NotionUpdateBody {
  properties: Record<string, any>;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { id } = req.query;
  const { properties } = req.body as NotionUpdateBody;
  console.warn(JSON.stringify({ properties }));

  if (!id || typeof id !== "string") {
    return res.status(400).json({ error: "Page ID is required" });
  }

  if (!properties || typeof properties !== "object") {
    return res.status(400).json({ error: "Properties are required" });
  }

  const notionToken = process.env.NOTION_TOKEN;
  if (!notionToken) {
    console.error("NOTION_TOKEN environment variable is not set");
    return res.status(500).json({ error: "Server configuration error" });
  }

  try {
    const response = await fetch(`https://api.notion.com/v1/pages/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${notionToken}`,
        "Notion-Version": process.env.NOTION_API_VERSION || "2022-06-28",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ properties }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Notion API error:", data);
      return res.status(response.status).json({
        error: data.message || "Notion API request failed",
        code: data.code,
        status: response.status,
      });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "PATCH, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    res.status(200).json(data);
  } catch (error) {
    console.error("Proxy error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
