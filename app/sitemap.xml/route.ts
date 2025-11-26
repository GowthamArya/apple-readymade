export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

    <url>
      <loc>${baseUrl}</loc>
      <priority>1.0</priority>
    </url>

    <url>
      <loc>${baseUrl}/collections</loc>
      <priority>1.0</priority>
    </url>

    <url>
      <loc>${baseUrl}/contact</loc>
      <priority>0.8</priority>
    </url>

    <url>
      <loc>${baseUrl}/shipping</loc>
      <priority>0.8</priority>
    </url>

    <url>
      <loc>${baseUrl}/refund-cancellation</loc>
      <priority>0.7</priority>
    </url>

    <url>
      <loc>${baseUrl}/privacy</loc>
      <priority>0.6</priority>
    </url>

    <url>
      <loc>${baseUrl}/terms</loc>
      <priority>0.6</priority>
    </url>
    
    <url>
      <loc>${baseUrl}/account</loc>
      <priority>0.8</priority>
    </url>

  </urlset>`;

  return new Response(sitemap, {
    headers: { "Content-Type": "application/xml" }
  });
}
