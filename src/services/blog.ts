import { type Decoder } from "decoders";
import { signalFunction, State } from "signal-utils/async-function";
import {
  metaDecoder,
  postDecoder,
  postListDecoder,
  type Meta,
} from "../../shared/types";

export class Blog {
  meta: State<Promise<Meta>> = signalFunction(() =>
    this.#fetch("/meta.json", metaDecoder),
  );

  posts(
    tag: "all" | "family" | "climbing" | "gaming" | "anime",
    cursor: string,
  ) {
    return signalFunction(() =>
      this.#fetch(`/posts/${tag}.${cursor}.json`, postListDecoder),
    );
  }

  post(id: string) {
    return signalFunction(() => this.#fetch(`/post/${id}.json`, postDecoder));
  }

  async #fetch<T>(url: string, decoder: Decoder<T>): Promise<T> {
    const response = await fetch(url);
    const raw: unknown = await response.json();
    const data = decoder.verify(raw);
    return data;
  }
}
