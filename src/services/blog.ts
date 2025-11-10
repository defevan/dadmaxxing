import { array } from "decoders";
import { signalFunction } from "signal-utils/async-function";
import { metaDecoder, postDecoder } from "../../shared/types";

export class Blog {
  meta = signalFunction(async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}/meta.json`);
    const raw: unknown = await response.json();
    const data = metaDecoder.verify(raw);
    return data;
  });

  posts = signalFunction(async () => {
    const response = await fetch(`${import.meta.env.BASE_URL}/posts.json`);
    const raw: unknown = await response.json();
    const data = array(postDecoder).verify(raw);
    return data;
  });
}
