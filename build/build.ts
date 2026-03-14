import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import { layout } from "../templates/layout.js";
import { postTemplate, type PostData } from "../templates/post.js";
import {
  postListTemplate,
  aboutTemplate,
  type PostMeta,
} from "../templates/post-list.js";

const ROOT = path.resolve(import.meta.dirname, "..");
const CONTENT_DIR = path.join(ROOT, "content", "posts");
const STATIC_DIR = path.join(ROOT, "static");
const DIST_DIR = path.join(ROOT, "dist");

async function mdToHtml(markdown: string): Promise<string> {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeHighlight, { detect: true })
    .use(rehypeStringify, { allowDangerousHtml: true })
    .process(markdown);
  return String(result);
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

async function build() {
  console.log("Building blog...");

  // 1. Clean dist
  if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true });
  }
  fs.mkdirSync(DIST_DIR, { recursive: true });

  // 2. Copy static assets
  copyDir(STATIC_DIR, DIST_DIR);
  console.log("  Copied static assets");

  // 3. Read and parse markdown posts
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith(".md"));

  const posts: (PostMeta & { content: string })[] = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data, content } = matter(raw);

    if (data.draft) continue;

    const htmlContent = await mdToHtml(content);

    posts.push({
      title: data.title || "Untitled",
      slug: data.slug || file.replace(/\.md$/, ""),
      date: data.date || new Date().toISOString().split("T")[0],
      description: data.description || "",
      tags: data.tags || [],
      category: data.category,
      content: htmlContent,
    });
  }

  // Sort by date descending
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // 4. Generate post pages
  const postsDir = path.join(DIST_DIR, "posts");
  fs.mkdirSync(postsDir, { recursive: true });

  for (const post of posts) {
    const postDir = path.join(postsDir, post.slug);
    fs.mkdirSync(postDir, { recursive: true });

    const postData: PostData = {
      title: post.title,
      slug: post.slug,
      date: post.date,
      description: post.description,
      tags: post.tags,
      category: post.category,
      content: post.content,
    };

    const html = layout({
      title: post.title,
      description: post.description,
      url: `/posts/${post.slug}/`,
      body: postTemplate(postData),
    });

    fs.writeFileSync(path.join(postDir, "index.html"), html);
    console.log(`  Generated: /posts/${post.slug}/`);
  }

  // 5. Generate index page
  const postMetas: PostMeta[] = posts.map(({ content: _, ...meta }) => meta);

  const indexHtml = layout({
    title: "JongHyeon's Blog",
    description: "개발과 취미생활을 기록하는 블로그",
    url: "/",
    body: postListTemplate(postMetas),
  });
  fs.writeFileSync(path.join(DIST_DIR, "index.html"), indexHtml);
  console.log("  Generated: /index.html");

  // 6. Generate about page
  const aboutDir = path.join(DIST_DIR, "about");
  fs.mkdirSync(aboutDir, { recursive: true });

  const aboutHtml = layout({
    title: "About",
    description: "블로그 소개",
    url: "/about/",
    body: aboutTemplate(),
  });
  fs.writeFileSync(path.join(aboutDir, "index.html"), aboutHtml);
  console.log("  Generated: /about/");

  // 7. Write posts.json for RSS/Sitemap
  fs.writeFileSync(
    path.join(DIST_DIR, "posts.json"),
    JSON.stringify(postMetas, null, 2)
  );
  console.log("  Generated: /posts.json");

  console.log(`\nBuild complete! ${posts.length} post(s) generated.`);
}

build().catch((err) => {
  console.error("Build failed:", err);
  process.exit(1);
});
