import {
  array,
  boolean,
  type Decoder,
  either,
  mixed,
  null_,
  number,
  object,
  record,
  string,
} from "decoders";

// Helper values for organizing tags.

export const includedTags = ["family", "climbing", "gaming", "anime"];

export const homeTags = ["family", "climbing"];

// Mostly generated types/decoders for interacting with Tumblr's API.

type Avatar = {
  width: number;
  height: number;
  url: string;
  accessories: any[];
};

const AvatarDecoder: Decoder<Avatar> = object({
  width: number,
  height: number,
  url: string,
  accessories: array(mixed),
});

type Theme = {
  header_full_width: number;
  header_full_height: number;
  avatar_shape: string;
  background_color: string;
  body_font: string;
  header_bounds: string;
  header_image: string;
  header_image_focused: string;
  header_image_poster: string;
  header_image_scaled: string;
  header_stretch: boolean;
  link_color: string;
  show_avatar: boolean;
  show_description: boolean;
  show_header_image: boolean;
  show_title: boolean;
  title_color: string;
  title_font: string;
  title_font_weight: string;
};

const ThemeDecoder: Decoder<Theme> = object({
  header_full_width: number,
  header_full_height: number,
  avatar_shape: string,
  background_color: string,
  body_font: string,
  header_bounds: string,
  header_image: string,
  header_image_focused: string,
  header_image_poster: string,
  header_image_scaled: string,
  header_stretch: boolean,
  link_color: string,
  show_avatar: boolean,
  show_description: boolean,
  show_header_image: boolean,
  show_title: boolean,
  title_color: string,
  title_font: string,
  title_font_weight: string,
});

type BlogBase = {
  admin: boolean;
  ask: boolean;
  ask_anon: boolean;
  ask_page_title: string;
  asks_allow_media: boolean;
  avatar: Avatar[];
  can_chat: boolean;
  can_send_fan_mail: boolean;
  can_subscribe: boolean;
  description: string;
  drafts: number;
  facebook: string;
  facebook_opengraph_enabled: string;
  followed: boolean;
  followers: number;
  is_blocked_from_primary: boolean;
  is_nsfw: boolean;
  messages: number;
  name: string;
  posts: number;
  primary: boolean;
  queue: number;
  share_likes: boolean;
  subscribed: boolean;
  theme_id: number;
  theme: Theme;
  title: string;
  total_posts: number;
  tweet: string;
  twitter_enabled: boolean;
  twitter_send: boolean;
  type: string;
  updated: number;
  url: string;
  uuid: string;
};

const BlogBaseDecoder: Decoder<BlogBase> = object({
  admin: boolean,
  ask: boolean,
  ask_anon: boolean,
  ask_page_title: string,
  asks_allow_media: boolean,
  avatar: array(AvatarDecoder),
  can_chat: boolean,
  can_send_fan_mail: boolean,
  can_subscribe: boolean,
  description: string,
  drafts: number,
  facebook: string,
  facebook_opengraph_enabled: string,
  followed: boolean,
  followers: number,
  is_blocked_from_primary: boolean,
  is_nsfw: boolean,
  messages: number,
  name: string,
  posts: number,
  primary: boolean,
  queue: number,
  share_likes: boolean,
  subscribed: boolean,
  theme_id: number,
  theme: ThemeDecoder,
  title: string,
  total_posts: number,
  tweet: string,
  twitter_enabled: boolean,
  twitter_send: boolean,
  type: string,
  updated: number,
  url: string,
  uuid: string,
});

type PostBlog = {
  name: string;
  title: string;
  description: string;
  url: string;
  uuid: string;
  updated: number;
  tumblrmart_accessories: Record<string, unknown>;
  can_show_badges: boolean;
};

const PostBlogDecoder: Decoder<PostBlog> = object({
  name: string,
  title: string,
  description: string,
  url: string,
  uuid: string,
  updated: number,
  tumblrmart_accessories: record(string, mixed),
  can_show_badges: boolean,
});

type Reblog = {
  comment: string;
  tree_html: string;
};

const ReblogDecoder: Decoder<Reblog> = object({
  comment: string,
  tree_html: string,
});

type TrailItem = {
  blog: {
    name: string;
    active: boolean;
    theme: Theme;
    share_likes: boolean;
    share_following: boolean;
    can_be_followed: boolean;
  };
  post: {
    id: string;
  };
  content_raw: string;
  content: string;
  is_current_item: boolean;
  is_root_item: boolean;
};

const TrailItemDecoder: Decoder<TrailItem> = object({
  blog: object({
    name: string,
    active: boolean,
    theme: ThemeDecoder,
    share_likes: boolean,
    share_following: boolean,
    can_be_followed: boolean,
  }),
  post: object({ id: string }),
  content_raw: string,
  content: string,
  is_current_item: boolean,
  is_root_item: boolean,
});

type TumblrPost = {
  type: string;
  is_blocks_post_format: boolean;
  blog_name: string;
  blog: PostBlog;
  id: string;
  id_string: string;
  is_blazed: boolean;
  is_blaze_pending: boolean;
  can_ignite: boolean;
  can_blaze: boolean;
  post_url: string;
  slug: string;
  date: string;
  timestamp: number;
  state: string;
  format: string;
  reblog_key: string;
  tags: string[];
  short_url: string;
  summary: string;
  should_open_in_legacy: boolean;
  recommended_source: string | null;
  recommended_color: string | null;
  followed: boolean;
  liked: boolean;
  note_count: number;
  title: string;
  body: string;
  reblog: Reblog;
  trail: TrailItem[];
  can_like: boolean;
  interactability_reblog: string;
  interactability_blaze: string;
  can_reblog: boolean;
  can_send_in_message: boolean;
  muted: boolean;
  mute_end_timestamp: number;
  can_mute: boolean;
  can_reply: boolean;
  display_avatar: boolean;
};

const TumblrPostDecoder: Decoder<TumblrPost> = object({
  type: string,
  is_blocks_post_format: boolean,
  blog_name: string,
  blog: PostBlogDecoder,
  id: string,
  id_string: string,
  is_blazed: boolean,
  is_blaze_pending: boolean,
  can_ignite: boolean,
  can_blaze: boolean,
  post_url: string,
  slug: string,
  date: string,
  timestamp: number,
  state: string,
  format: string,
  reblog_key: string,
  tags: array(string),
  short_url: string,
  summary: string,
  should_open_in_legacy: boolean,
  recommended_source: either(string, null_),
  recommended_color: either(string, null_),
  followed: boolean,
  liked: boolean,
  note_count: number,
  title: string,
  body: string,
  reblog: ReblogDecoder,
  trail: array(TrailItemDecoder),
  can_like: boolean,
  interactability_reblog: string,
  interactability_blaze: string,
  can_reblog: boolean,
  can_send_in_message: boolean,
  muted: boolean,
  mute_end_timestamp: number,
  can_mute: boolean,
  can_reply: boolean,
  display_avatar: boolean,
});

type RawPosts = {
  blog: BlogBase;
  posts: TumblrPost[];
  total_posts: number;
};

const RawPostsDecoder: Decoder<RawPosts> = object({
  blog: BlogBaseDecoder,
  posts: array(TumblrPostDecoder),
  total_posts: number,
});

type TumblrData = {
  blog: {
    blog: BlogBase;
  };
  posts: RawPosts;
};

export const tumblrDataDecoder: Decoder<TumblrData> = object({
  blog: object({ blog: BlogBaseDecoder }),
  posts: RawPostsDecoder,
});

// Hand rolled types/decoders used to save Tumblr data to disk.

export type Meta = {
  avatar: string;
  updated: number;
  title: string;
  description: string;
};

export const metaDecoder: Decoder<Meta> = object({
  avatar: string,
  updated: number,
  title: string,
  description: string,
});

export type Post = {
  id: string;
  date: number; // ms
  body: string;
  tags: string[];
};

export const postDecoder: Decoder<Post> = object({
  id: string,
  date: number,
  body: string,
  tags: array(string),
});
