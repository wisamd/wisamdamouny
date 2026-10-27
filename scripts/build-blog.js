const fs = require('fs');
const path = require('path');
const { Marked } = require('marked');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '../content/posts');
const OUTPUT_DIR = path.join(__dirname, '../blog');
const SITE_ROOT = path.join(__dirname, '..');
const SITE_ORIGIN = 'https://wisamdamouny.com';

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Custom Marked instance with Mermaid renderer
const marked = new Marked({
  renderer: {
    code({ text, lang }) {
      if (lang === 'mermaid') {
        return `<pre class="mermaid">${text}</pre>\n`;
      }
      const validLang = lang ? lang : '';
      return `<pre><code class="language-${validLang}">${escapeHtml(text)}</code></pre>\n`;
    }
  }
});

function escapeHtml(html) {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function removeEmDashes(str) {
  if (!str) return '';
  return str.replace(/—/g, ', ');
}

function toIsoDate(raw) {
  const d = new Date(raw);
  if (isNaN(d)) return '';
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function generateHtmlTemplate(meta, rawContentHtml, hasMermaid, slug) {
  const canonical = `${SITE_ORIGIN}/blog/${slug}.html`;
  const isoDate = toIsoDate(meta.date);
  const title = removeEmDashes(meta.title || 'Wisam Damouny Article');
  const description = removeEmDashes(meta.description || '');
  const tag = meta.tag || 'Article';
  const tagColor = 'var(--accent)';
  const date = meta.date || '';
  const readTime = meta.readTime || '';
  const author = meta.author || 'Wisam Damouny';
  const authorRole = meta.authorRole || 'Software Technical Leader | SAP Data Integration & Real-Time CDC';
  const authorImage = meta.authorImage || '../assets/avatar_hero_wisam.jpg';
  const ogImage = meta.ogImage || '../assets/avatar_hero.jpg';

  // Remove all em dashes from rendered article HTML as per design instructions
  const contentHtml = removeEmDashes(rawContentHtml);

  // Author image fallback
  const authorImageSrc = authorImage.endsWith('.jpg')
    ? authorImage.replace(/\.jpg$/, '.webp')
    : authorImage;

  const mermaidScript = hasMermaid
    ? `  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    mermaid.initialize({ startOnLoad: true, theme: 'dark' });
  </script>`
    : '';

  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} | Wisam Damouny</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <link rel="canonical" href="${canonical}" />

  <!-- Open Graph -->
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${escapeHtml(title)} | Wisam Damouny" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${ogImage.startsWith('http') ? ogImage : SITE_ORIGIN + '/' + ogImage.replace(/^\.\.\//, '')}" />
  <meta property="article:published_time" content="${isoDate}" />
  <meta property="article:author" content="${escapeHtml(author)}" />
  <meta property="article:section" content="${escapeHtml(tag)}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)} | Wisam Damouny" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${ogImage.startsWith('http') ? ogImage : SITE_ORIGIN + '/' + ogImage.replace(/^\.\.\//, '')}" />

  <!-- Google Fonts: Rubik & JetBrains Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&family=Rubik:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700;1,800&display=swap" rel="stylesheet">

  <!-- Phosphor Icons -->
  <script src="https://unpkg.com/@phosphor-icons/web"></script>

  <style>
    :root {
      --accent: #F6A93B;
      --accent-hover: #FFC163;
      --accent-glow: rgba(246, 169, 59, 0.2);
      --bg: #0A0A0B;
      --bg-alt: #0D0D0F;
      --card-bg: #141416;
      --card-border: #26262A;
      --fg: #F4F2EC;
      --fg-muted: #C9C6BD;
      --fg-subtle: #8C897F;
      --nav-bg: rgba(10, 10, 11, 0.92);
      --radius-sm: 8px;
      --radius-md: 16px;
      --radius-lg: 24px;
      --radius-full: 999px;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Rubik', system-ui, sans-serif;
      background-color: var(--bg);
      color: var(--fg);
      line-height: 1.8;
      -webkit-font-smoothing: antialiased;
    }

    header {
      position: sticky;
      top: 0;
      z-index: 100;
      background: var(--nav-bg);
      backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--card-border);
      padding: 18px 0;
    }

    .container {
      max-width: 860px;
      margin: 0 auto;
      padding: 0 24px;
    }

    nav {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .brand {
      color: var(--fg);
      text-decoration: none;
      font-family: 'Rubik', sans-serif;
      font-weight: 700;
      font-size: 18px;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .brand-dot {
      width: 10px;
      height: 10px;
      background: var(--accent);
      border-radius: 50%;
    }

    .back-link {
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 6px;
      transition: color 0.18s ease;
    }
    .back-link:hover {
      color: var(--accent-hover);
    }

    main {
      padding: 60px 0 100px;
    }

    .article-header {
      margin-bottom: 40px;
    }

    .blog-tag {
      background: var(--card-bg);
      border: 1px solid var(--card-border);
      color: var(--accent);
      font-family: 'JetBrains Mono', monospace;
      font-size: 12px;
      font-weight: 600;
      padding: 6px 14px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      display: inline-block;
      margin-bottom: 20px;
    }

    h1 {
      font-family: 'Rubik', sans-serif;
      font-size: clamp(32px, 5vw, 44px);
      font-weight: 800;
      line-height: 1.25;
      letter-spacing: -0.02em;
      margin-bottom: 24px;
      color: var(--fg);
    }

    .article-meta {
      display: flex;
      align-items: center;
      gap: 20px;
      padding-bottom: 24px;
      border-bottom: 1px solid var(--card-border);
      color: var(--fg-muted);
      font-size: 14px;
      flex-wrap: wrap;
    }

    .author-info {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .author-info img {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: cover;
    }

    .article-content h2 {
      font-size: 24px;
      font-weight: 700;
      margin: 36px 0 18px;
      color: var(--fg);
      letter-spacing: -0.015em;
    }

    .article-content h3 {
      font-size: 20px;
      font-weight: 700;
      margin: 28px 0 14px;
      color: var(--fg);
    }

    .article-content p {
      margin-bottom: 24px;
      color: var(--fg-muted);
      font-size: 17px;
    }

    .article-content blockquote {
      border-left: 4px solid var(--accent);
      padding: 20px 24px;
      background: var(--card-bg);
      border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
      margin: 32px 0;
      font-style: italic;
      color: var(--fg);
      font-size: 18px;
    }

    .article-content pre {
      background: #0d0e12;
      border: 1px solid var(--card-border);
      padding: 20px;
      border-radius: var(--radius-sm);
      overflow-x: auto;
      font-family: 'JetBrains Mono', monospace;
      font-size: 14px;
      color: #e2e8f0;
      margin: 28px 0;
    }

    .article-content pre.mermaid {
      background: var(--card-bg);
      display: flex;
      justify-content: center;
      padding: 24px;
      border-radius: var(--radius-md);
      margin: 36px 0;
    }

    .article-content ul, .article-content ol {
      margin: 20px 0 28px 24px;
      color: var(--fg-muted);
      font-size: 16px;
    }

    .article-content li {
      margin-bottom: 10px;
    }

    .article-content a {
      color: var(--accent);
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .article-content a:hover {
      color: var(--accent-hover);
    }

    footer {
      border-top: 1px solid var(--card-border);
      padding: 40px 0;
      text-align: center;
      color: var(--fg-muted);
      font-size: 14px;
    }
  </style>
</head>

<body>
  <header>
    <div class="container">
      <nav>
        <a href="../index.html" class="brand">
          <span class="brand-dot"></span>
          <span>Wisam Damouny</span>
        </a>
        <a href="../index.html#write" class="back-link">
          <i class="ph ph-arrow-left"></i> Back to Articles
        </a>
      </nav>
    </div>
  </header>

  <main>
    <div class="container">
      <article class="article-header">
        <span class="blog-tag">${escapeHtml(tag)}</span>
        <h1>${escapeHtml(title)}</h1>

        <div class="article-meta">
          <div class="author-info">
            <picture>
              <source srcset="${escapeHtml(authorImageSrc)}" type="image/webp" />
              <img src="${escapeHtml(authorImage)}" alt="${escapeHtml(author)}" width="40" height="40" />
            </picture>
            <div>
              <strong style="color:var(--fg);">${escapeHtml(author)}</strong>
              <div style="font-size:12px; color:var(--fg-subtle)">${escapeHtml(authorRole)}</div>
            </div>
          </div>
          <div><i class="ph ph-calendar-blank"></i> ${escapeHtml(date)}</div>
          <div><i class="ph ph-clock"></i> ${escapeHtml(readTime)}</div>
        </div>
      </article>

      <div class="article-content">
        ${contentHtml}
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <p>© 2026 Wisam Damouny · SAP runs the industries the world depends on. Their data should move as fast as their business does.</p>
    </div>
  </footer>
${mermaidScript}
</body>

</html>
`;
}

function buildBlog() {
  console.log('🚀 Starting Blog Build (Markdown -> Static HTML)...');

  const mdFiles = fs.readdirSync(POSTS_DIR).filter(file => file.endsWith('.md'));
  let count = 0;
  const urls = [];

  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const { data: meta, content } = matter(fileContent);
    const contentHtml = marked.parse(content);
    const hasMermaid = contentHtml.includes('class="mermaid"');
    const slug = file.replace(/\.md$/, '');

    const htmlOutput = generateHtmlTemplate(meta, contentHtml, hasMermaid, slug);
    const outputPath = path.join(OUTPUT_DIR, `${slug}.html`);

    fs.writeFileSync(outputPath, htmlOutput, 'utf8');
    console.log(`  ✓ Built: blog/${slug}.html ${hasMermaid ? '(with Mermaid diagrams)' : ''}`);
    urls.push(`${SITE_ORIGIN}/blog/${slug}.html`);
    count++;
  }

  writeSitemap(urls);
  console.log(`✨ Successfully generated ${count} article page(s) and sitemap.xml.`);
}

function writeSitemap(blogUrls) {
  const today = new Date().toISOString().slice(0, 10);
  const entries = [
    `${SITE_ORIGIN}/`,
    `${SITE_ORIGIN}/ar/`,
    `${SITE_ORIGIN}/he/`,
    ...blogUrls
  ]
    .map(loc => `  <url><loc>${loc}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
  fs.writeFileSync(path.join(SITE_ROOT, 'sitemap.xml'), xml, 'utf8');
}

buildBlog();
