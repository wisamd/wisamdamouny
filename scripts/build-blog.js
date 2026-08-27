const fs = require('fs');
const path = require('path');
const { Marked } = require('marked');
const matter = require('gray-matter');

const POSTS_DIR = path.join(__dirname, '../content/posts');
const OUTPUT_DIR = path.join(__dirname, '../blog');

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

function generateHtmlTemplate(meta, contentHtml, hasMermaid) {
  const title = meta.title || 'Wisam Damouny Article';
  const description = meta.description || '';
  const tag = meta.tag || 'Article';
  const tagColor = meta.tagColor || 'var(--accent)';
  const date = meta.date || '';
  const readTime = meta.readTime || '';
  const author = meta.author || 'Wisam Damouny';
  const authorRole = meta.authorRole || 'Software Tech Leader & AI Systems Architect';
  const authorImage = meta.authorImage || '../assets/avatar_hero_wisam.jpg';
  const ogImage = meta.ogImage || '../assets/avatar_hero.jpg';

  const mermaidScript = hasMermaid ? `
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      if (typeof mermaid !== 'undefined') {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'dark',
          securityLevel: 'loose',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
        });
      }
    });
  </script>` : '';

  return `<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)} — Wisam Damouny</title>
  <meta name="description" content="${escapeHtml(description)}" />

  <!-- Open Graph Meta Tags for Social & SEO -->
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="${escapeHtml(ogImage)}" />

  <!-- Google Fonts & Icons -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=Syne:wght@500;600;700;800;900&display=swap" rel="stylesheet">
  <script src="https://unpkg.com/@phosphor-icons/web"></script>

  <style>
    :root {
      --accent: #D97757;
      --accent-hover: #E58A6C;
      --accent-glow: rgba(217, 119, 87, 0.22);
      --bg: #0b0c0e;
      --bg-alt: #12141a;
      --card-bg: rgba(20, 22, 28, 0.78);
      --card-border: rgba(255, 255, 255, 0.08);
      --fg: #f4f4f6;
      --fg-muted: #9da2b0;
      --fg-subtle: #6b7280;
      --nav-bg: rgba(11, 12, 14, 0.88);
      --radius-sm: 8px;
      --radius-md: 16px;
      --radius-lg: 24px;
      --radius-full: 9999px;
    }

    html.light {
      --bg: #f7f7f9;
      --bg-alt: #ffffff;
      --card-bg: rgba(255, 255, 255, 0.88);
      --card-border: rgba(0, 0, 0, 0.08);
      --fg: #121316;
      --fg-muted: #525866;
      --fg-subtle: #868d9d;
      --nav-bg: rgba(247, 247, 249, 0.88);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
      background-color: var(--bg);
      color: var(--fg);
      line-height: 1.8;
      transition: background-color 0.3s ease, color 0.3s ease;
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
      font-family: 'Syne', sans-serif;
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
    }

    main {
      padding: 60px 0 100px;
    }

    .article-header {
      margin-bottom: 40px;
    }

    .blog-tag {
      background: ${tagColor};
      color: #fff;
      font-size: 12px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: var(--radius-full);
      text-transform: uppercase;
      letter-spacing: 0.5px;
      display: inline-block;
      margin-bottom: 20px;
    }

    h1 {
      font-family: 'Syne', sans-serif;
      font-size: clamp(32px, 5vw, 44px);
      font-weight: 800;
      line-height: 1.25;
      margin-bottom: 24px;
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
      font-family: monospace;
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
        <a href="../index.html#blog" class="back-link">
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
            <img src="${escapeHtml(authorImage)}" alt="${escapeHtml(author)}" />
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
      <p>© 2026 Wisam Damouny · Crafting self-hosted software for humans and AI agents.</p>
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

  for (const file of mdFiles) {
    const filePath = path.join(POSTS_DIR, file);
    const fileContent = fs.readFileSync(filePath, 'utf8');

    const { data: meta, content } = matter(fileContent);
    const contentHtml = marked.parse(content);
    const hasMermaid = contentHtml.includes('class="mermaid"');

    const htmlOutput = generateHtmlTemplate(meta, contentHtml, hasMermaid);
    const outputFileName = file.replace(/\.md$/, '.html');
    const outputPath = path.join(OUTPUT_DIR, outputFileName);

    fs.writeFileSync(outputPath, htmlOutput, 'utf8');
    console.log(`  ✓ Built: blog/${outputFileName} ${hasMermaid ? '(with Mermaid diagrams)' : ''}`);
    count++;
  }

  console.log(`✨ Successfully generated ${count} article page(s).`);
}

buildBlog();
