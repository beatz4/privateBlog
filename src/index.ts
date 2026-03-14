import { Hono } from "hono";

type Bindings = {
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

const SITE_URL = "https://blog.example.com";
const SITE_NAME = "JongHyeon's Blog";

// RSS Feed
app.get("/feed.xml", async (c) => {
  try {
    const res = await c.env.ASSETS.fetch(new URL("/posts.json", SITE_URL));
    const posts = (await res.json()) as Array<{
      title: string;
      slug: string;
      date: string;
      description: string;
    }>;

    const items = posts
      .slice(0, 20)
      .map(
        (p) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${SITE_URL}/posts/${p.slug}/</link>
      <guid>${SITE_URL}/posts/${p.slug}/</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description><![CDATA[${p.description}]]></description>
    </item>`
      )
      .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${SITE_URL}</link>
    <description>개발과 취미생활을 기록하는 블로그</description>
    <language>ko</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>`;

    return c.body(xml, 200, { "Content-Type": "application/xml; charset=utf-8" });
  } catch {
    return c.text("Feed not available", 500);
  }
});

// Sitemap
app.get("/sitemap.xml", async (c) => {
  try {
    const res = await c.env.ASSETS.fetch(new URL("/posts.json", SITE_URL));
    const posts = (await res.json()) as Array<{
      slug: string;
      date: string;
    }>;

    const urls = [
      `<url><loc>${SITE_URL}/</loc><priority>1.0</priority></url>`,
      `<url><loc>${SITE_URL}/about/</loc><priority>0.8</priority></url>`,
      ...posts.map(
        (p) =>
          `<url><loc>${SITE_URL}/posts/${p.slug}/</loc><lastmod>${p.date}</lastmod><priority>0.7</priority></url>`
      ),
    ].join("\n    ");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls}
</urlset>`;

    return c.body(xml, 200, { "Content-Type": "application/xml; charset=utf-8" });
  } catch {
    return c.text("Sitemap not available", 500);
  }
});

// Fallback to static assets
app.get("*", async (c) => {
  return c.env.ASSETS.fetch(c.req.raw);
});

export default app;
