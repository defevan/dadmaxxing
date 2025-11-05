import { tsx } from "./lib/tsx";
import { blog } from "./services/blog";
import { router } from "./services/router";
import "./components/app";
import "./components/footer";
import "./components/header";
import "./components/post-list";
import "./components/link";

router.load();
blog.load();

blog.meta$.subscribe((meta) => {
  if (!meta) {
    return;
  }
  document.title = meta.title;
  document.head.append(
    <link rel="icon" type="image/png" href={meta.avatar}></link>,
  );
});

document.body.append(<app-root></app-root>);
