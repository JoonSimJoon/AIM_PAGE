import TurndownService from "turndown";
import { JSDOM } from "jsdom";
import { Readability } from "@mozilla/readability";

export async function extractArticleToMarkdown(html: string, url: string) {
  const dom = new JSDOM(html, { url });
  const reader = new Readability(dom.window.document);
  const article = reader.parse();

  if (!article) return { title: null, excerpt: null, contentMd: null, images: [] as string[] };

  const td = new TurndownService({ headingStyle: "atx", codeBlockStyle: "fenced" });
  const contentMd = td.turndown(article.content);

  // naive image extraction
  const doc = dom.window.document;
  const imgs = Array.from(doc.querySelectorAll("img")).map((img) => {
    const src = img.getAttribute("src") || "";
    try {
      return new URL(src, url).toString();
    } catch {
      return src;
    }
  }).filter(Boolean);

  return { title: article.title, excerpt: article.excerpt, contentMd, images: imgs };
}
