export interface PostMeta {
  title: string;
  slug: string;
  date: string;
  description: string;
  tags: string[];
  category?: string;
}

export function postListTemplate(posts: PostMeta[]): string {
  const postsHtml = posts
    .map(
      (post) => `
    <a href="/posts/${post.slug}/" class="post-card">
      <h2 class="post-card__title">${post.title}</h2>
      <p class="post-card__date">${formatDate(post.date)}${post.category ? ` · ${post.category}` : ""}</p>
      <p class="post-card__desc">${post.description}</p>
      <div class="post-card__tags">
        ${post.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
      </div>
    </a>`
    )
    .join("\n");

  return `
<section class="hero">
  <h1 class="hero__title">Dev & Life Blog</h1>
  <p class="hero__desc">개발과 취미생활을 기록합니다.</p>
</section>

<div class="post-list">
  ${postsHtml}
</div>

<!-- AdSense: 목록 하단 광고 슬롯 -->
<div class="ad-slot">
  <!-- 승인 후 AdSense 코드 삽입 -->
</div>`;
}

export function aboutTemplate(): string {
  return `
<section class="hero">
  <h1 class="hero__title">About</h1>
  <p class="hero__desc">안녕하세요! 개발과 다양한 취미생활을 즐기는 종현입니다.</p>
</section>

<div class="post-content">
  <h2>Blog</h2>
  <p>이 블로그는 개발 관련 기술 포스트와 일상 취미 기록을 남기는 공간입니다.</p>

  <h2>Tech Stack</h2>
  <ul>
    <li>Cloudflare Workers + Hono</li>
    <li>TypeScript</li>
    <li>Markdown 기반 정적 생성</li>
  </ul>
</div>`;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}. ${d.getMonth() + 1}. ${d.getDate()}.`;
}
