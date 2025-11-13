import fs from "fs/promises";
import path from "path";
import { createClient } from "tumblr.js";
import {
  includedTags,
  Meta,
  Post,
  PostList,
  tumblrDataDecoder,
} from "../shared/types";

const PAGE_SIZE = 10;

function chunk<T>(list: T[], size = PAGE_SIZE): T[][] {
  const result = [];
  for (let i = 0; i < list.length; i += size) {
    result.push(list.slice(i, i + size));
  }
  return result;
}

const client = createClient({
  consumer_key: process.env.tumblr_consumer_key,
  consumer_secret: process.env.tumblr_consumer_secret,
  token: process.env.tumblr_token,
  token_secret: process.env.tumblr_token_secret,
});

async function main() {
  const [rawBlog, rawPosts] = await Promise.all([
    client.blogInfo(process.env.tumblr_blog ?? ""),
    client.blogPosts(process.env.tumblr_blog ?? ""),
  ]);

  const decoded = tumblrDataDecoder.verify({
    blog: rawBlog,
    posts: rawPosts,
  });

  const posts: Array<Post> = decoded.posts.posts
    .filter(({ tags }) => tags.some((tag) => includedTags.includes(tag)))
    .map(({ id, date, body, tags }) => ({
      id,
      date: new Date(date).getTime(),
      body,
      tags,
    }))
    .sort((a, b) => {
      const aT = new Date(a.date).getTime();
      const bT = new Date(b.date).getTime();
      if (aT < bT) {
        return 1;
      }
      if (aT > bT) {
        return -1;
      }
      return 0;
    });

  const postPartitions: Array<[string, Post[][]]> = includedTags.map((tag) => [
    tag,
    chunk(posts.filter((p) => p.tags.includes(tag))),
  ]);

  const updated = posts.reduce(
    (latest, post) => (post.date > latest ? post.date : latest),
    decoded.blog.blog.updated * 1000,
  );

  const meta: Meta = {
    avatar:
      decoded.blog.blog.avatar.find((avatar) => avatar.width === 128)?.url ??
      "",
    title: decoded.blog.blog.title,
    description: decoded.blog.blog.description,
    updated,
  };

  try {
    await fs.rmdir(path.join(__dirname, "../public"), { recursive: true });
  } catch {}

  try {
    await fs.mkdir(path.join(__dirname, "../public"));
  } catch {}

  try {
    await fs.mkdir(path.join(__dirname, "../public/posts"));
  } catch {}

  try {
    await fs.mkdir(path.join(__dirname, "../public/post"));
  } catch {}

  await Promise.all([
    fs.writeFile(
      path.join(__dirname, "../public/meta.json"),
      JSON.stringify(meta),
      "utf-8",
    ),
    ...chunk(posts).map((posts, index, chunks) => {
      const postList: PostList = {
        posts,
        prev: index !== 0 ? `/page/${index}` : undefined,
        next: index < chunks.length - 1 ? `/page/${index + 2}` : undefined,
        currentPageIndex: index + 1,
        totalPageCount: chunks.length,
      };
      return fs.writeFile(
        path.join(__dirname, `../public/posts/all.${index + 1}.json`),
        JSON.stringify(postList),
        "utf-8",
      );
    }),
    ...postPartitions.flatMap(([tag, chunks]) => {
      return chunks.map((posts, index) => {
        const postList: PostList = {
          posts,
          prev: index !== 0 ? `/${tag}/page/${index}` : undefined,
          next:
            index < chunks.length - 1 ? `/${tag}/page/${index + 2}` : undefined,
          currentPageIndex: index + 1,
          totalPageCount: chunks.length,
        };
        return fs.writeFile(
          path.join(__dirname, `../public/posts/${tag}.${index + 1}.json`),
          JSON.stringify(postList),
          "utf-8",
        );
      });
    }),
    ...posts.map((post) => {
      return fs.writeFile(
        path.join(__dirname, `../public/post/${post.id}.json`),
        JSON.stringify(post),
        "utf-8",
      );
    }),
  ]);

  console.log(`meta.json:\n${JSON.stringify(meta, null, 2)}\n`);
  console.log(`posts.json:\n${JSON.stringify(posts, null, 2)}\n`);
  console.log("done");
}

main();
