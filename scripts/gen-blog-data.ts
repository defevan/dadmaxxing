import { createHash } from "crypto";
import fs from "fs/promises";
import path from "path";
import { createClient } from "tumblr.js";
import {
  Meta,
  Post,
  PostList,
  tags,
  Tags,
  tagsmap,
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

/**
 * number to relatively short hash (relative to what?)
 */
function badhash(value: number): string {
  return createHash("md5")
    .update(value.toString(), "utf-8")
    .digest("base64url");
}

function makeFrontendURL(tag: Tags, pageIndex: number) {
  const prepend = tag === "all" ? "/" : `/${tag}/`;
  if (pageIndex < 1) {
    return prepend;
  }
  return `${prepend}page/${badhash(pageIndex + 1)}`;
}

function makeBackendURL(tag: Tags, pageIndex: number) {
  if (pageIndex < 1) {
    return `/posts/${tag}.json`;
  }
  return `/posts/${tag}.${badhash(pageIndex + 1)}.json`;
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
    .filter(({ tags }) => tags.some((tag) => tagsmap[tag] ?? false))
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

  const postPartitions: Array<[(typeof tags)[number], Post[][]]> = tags.map(
    (tag) => [tag, chunk(posts.filter((p) => p.tags.includes(tag)))],
  );

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
        prev: index > 0 ? makeFrontendURL("all", index - 1) : undefined,
        next:
          index < chunks.length - 1
            ? makeFrontendURL("all", index + 1)
            : undefined,
        currentPageIndex: index + 1,
        totalPageCount: chunks.length,
      };
      return fs.writeFile(
        path.join(__dirname, `../public`, makeBackendURL("all", index)),
        JSON.stringify(postList),
        "utf-8",
      );
    }),
    ...postPartitions.flatMap(([tag, chunks]) => {
      return chunks.map((posts, index) => {
        const postList: PostList = {
          posts,
          prev: index > 0 ? makeFrontendURL(tag, index - 1) : undefined,
          next:
            index < chunks.length - 1
              ? makeFrontendURL(tag, index + 1)
              : undefined,
          currentPageIndex: index + 1,
          totalPageCount: chunks.length,
        };
        return fs.writeFile(
          path.join(__dirname, `../public`, makeBackendURL(tag, index)),
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

  console.log("done");
}

main();
