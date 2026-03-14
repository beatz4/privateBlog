---
title: "Cloudflare Workers로 블로그 만들기"
slug: "cloudflare-workers-blog"
date: "2026-03-13"
description: "Cloudflare Workers와 Hono를 사용해서 정적 블로그를 만드는 방법을 정리합니다."
tags: ["Cloudflare", "Workers", "Hono", "TypeScript"]
category: "개발"
draft: false
---

## 왜 Cloudflare Workers인가?

Cloudflare Workers는 엣지에서 실행되는 서버리스 플랫폼입니다. 블로그 호스팅에 선택한 이유는 다음과 같습니다:

1. **무료 플랜** - 정적 자산 무제한 무료, 동적 요청 일 10만 건
2. **글로벌 CDN** - 전 세계 어디서든 빠른 응답 속도
3. **간편한 배포** - `wrangler deploy` 한 줄로 배포 완료

## 프로젝트 구조

```
├── src/          # Worker 코드 (Hono)
├── content/      # Markdown 포스트
├── templates/    # HTML 템플릿
├── static/       # CSS, JS, 이미지
├── build/        # 빌드 스크립트
└── dist/         # 빌드 결과물
```

## 빌드 과정

마크다운 파일을 HTML로 변환하는 빌드 파이프라인:

1. `content/posts/` 의 `.md` 파일을 읽음
2. `gray-matter`로 frontmatter 파싱
3. `unified` 파이프라인으로 Markdown → HTML 변환
4. 템플릿에 삽입하여 완성된 HTML 생성
5. `dist/`에 출력

> Cloudflare Workers Static Assets가 `dist/` 폴더의 파일을 자동으로 서빙하므로, Worker 코드는 RSS나 Sitemap 같은 동적 라우트만 처리합니다.

## 배포

```bash
npm run deploy
```

이 한 줄이면 빌드와 배포가 모두 완료됩니다.
