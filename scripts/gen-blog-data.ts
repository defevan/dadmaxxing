import fs from "fs/promises";
import path from "path";
import { createClient } from "tumblr.js";
import { includedTags, Meta, Post, tumblrDataDecoder } from "../shared/types";

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

  const meta: Meta = {
    avatar:
      decoded.blog.blog.avatar.find((avatar) => avatar.width === 128)?.url ??
      "",
    title: decoded.blog.blog.title,
    description: decoded.blog.blog.description,
    updated: decoded.blog.blog.updated,
  };

  const posts: Array<Post> = decoded.posts.posts
    .filter(({ tags }) => tags.some((tag) => includedTags.includes(tag)))
    .map(({ id, date, body, tags }) => ({ id, date, body, tags }))
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

  try {
    await fs.mkdir(path.join(__dirname, "../public"));
  } catch {}

  await Promise.all([
    fs.writeFile(
      path.join(__dirname, "../public/meta.json"),
      JSON.stringify(meta),
      "utf-8",
    ),
    fs.writeFile(
      path.join(__dirname, "../public/posts.json"),
      JSON.stringify(posts),
      "utf-8",
    ),
  ]);

  console.log(`meta.json:\n${JSON.stringify(meta, null, 2)}\n`);
  console.log(`posts.json:\n${JSON.stringify(posts, null, 2)}\n`);
  console.log("done");
}

main();
