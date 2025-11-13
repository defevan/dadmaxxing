import { array, type Decoder } from "decoders";
import { signalFunction, State } from "signal-utils/async-function";
import {
  metaDecoder,
  postDecoder,
  type Meta,
  type Post,
} from "../../shared/types";

export class Blog {
  meta: State<Promise<Meta>> = signalFunction(() =>
    this.#fetch("/meta.json", metaDecoder),
  );

  posts = {
    all: signalFunction(() =>
      this.#fetch("/posts/all.json", array(postDecoder)),
    ),
    family: signalFunction(() =>
      this.#fetch("/posts/family.json", array(postDecoder)),
    ),
    climbing: signalFunction(() =>
      this.#fetch("/posts/climbing.json", array(postDecoder)),
    ),
    gaming: signalFunction(() =>
      this.#fetch("/posts/gaming.json", array(postDecoder)),
    ),
    anime: signalFunction(() =>
      this.#fetch("/posts/anime.json", array(postDecoder)),
    ),
    none: signalFunction(() => Promise.resolve([])),
  };

  none: State<Promise<Post[]>> = signalFunction(() => Promise.resolve([]));

  async #fetch<T>(url: string, decoder: Decoder<T>): Promise<T> {
    const response = await fetch(url);
    const raw: unknown = await response.json();
    const data = decoder.verify(raw);
    return data;
  }
}
