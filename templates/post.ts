export interface PostData {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  category?: string;
  content: string;
}

export function postTemplate(post: PostData): string {
  const tagsHtml = post.tags
    .map((tag) => `<span class="tag">${tag}</span>`)
    .join("");

  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    datePublished: post.date,
    description: post.description,
    author: {
      "@type": "Person",
      name: "JongHyeon",
    },
  });

  return `
<script type="application/ld+json">${jsonLd}</script>

<article>
  <header class="post-header">
    <h1 class="post-header__title">${post.title}</h1>
    <div class="post-header__meta">
      <time datetime="${post.date}">${formatDate(post.date)}</time>
      ${post.category ? `<span>· ${post.category}</span>` : ""}
    </div>
    <div class="post-card__tags" style="margin-top: 0.75rem;">
      ${tagsHtml}
    </div>
  </header>

  <div class="post-content">
    ${post.content}
  </div>

  <!-- AdSense: 포스트 하단 광고 슬롯 -->
  <div class="ad-slot">
    <!-- 승인 후 AdSense 코드 삽입 -->
  </div>

  <footer class="post-footer">
    <div class="post-footer__nav">
      <a href="/" class="post-footer__link">← All Posts</a>
    </div>
  </footer>
</article>`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}
