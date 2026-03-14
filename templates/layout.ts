export interface LayoutOptions {
  title: string;
  description: string;
  url?: string;
  ogImage?: string;
  body: string;
}

const SITE_NAME = "JongHyeon's Blog";
const SITE_URL = "https://blog.example.com"; // 배포 후 실제 도메인으로 변경

export function layout(opts: LayoutOptions): string {
  const fullTitle = opts.title === SITE_NAME ? SITE_NAME : `${opts.title} | ${SITE_NAME}`;
  const canonicalUrl = opts.url ? `${SITE_URL}${opts.url}` : SITE_URL;
  const ogImage = opts.ogImage || `${SITE_URL}/images/og-default.png`;

  return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(fullTitle)}</title>
  <meta name="description" content="${escapeHtml(opts.description)}">
  <link rel="canonical" href="${canonicalUrl}">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(fullTitle)}">
  <meta property="og:description" content="${escapeHtml(opts.description)}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="ko_KR">
  <meta property="og:site_name" content="${SITE_NAME}">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(fullTitle)}">
  <meta name="twitter:description" content="${escapeHtml(opts.description)}">
  <meta name="twitter:image" content="${ogImage}">

  <!-- Fonts -->
  <link rel="preconnect" href="https://cdn.jsdelivr.net" crossorigin>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css">

  <!-- Styles -->
  <link rel="stylesheet" href="/css/reset.css">
  <link rel="stylesheet" href="/css/variables.css">
  <link rel="stylesheet" href="/css/layout.css">
  <link rel="stylesheet" href="/css/components.css">
  <link rel="stylesheet" href="/css/post.css">
  <link rel="stylesheet" href="/css/theme.css">

  <!-- Theme (inline to prevent FOUC) -->
  <script>
    (function(){var t=localStorage.getItem('theme')||(matchMedia('(prefers-color-scheme:dark)').matches?'dark':'light');document.documentElement.setAttribute('data-theme',t)})();
  </script>

  <!-- Google AdSense - 승인 후 ca-pub-XXXXXXX를 실제 ID로 교체 -->
  <!-- <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script> -->
</head>
<body>
  <nav class="nav">
    <div class="container nav__inner">
      <a href="/" class="nav__logo">${SITE_NAME}</a>
      <div class="nav__links">
        <a href="/" class="nav__link">Posts</a>
        <a href="/about/" class="nav__link">About</a>
        <button id="theme-toggle" class="theme-toggle" aria-label="Toggle theme"></button>
      </div>
    </div>
  </nav>

  <main>
    <div class="container">
      ${opts.body}
    </div>
  </main>

  <footer class="footer">
    <div class="container">
      <p class="footer__text">&copy; ${new Date().getFullYear()} ${SITE_NAME}. All rights reserved.</p>
    </div>
  </footer>

  <script src="/js/theme-toggle.js"></script>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
