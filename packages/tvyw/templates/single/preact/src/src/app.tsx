import { Fragment, h } from "preact";
import { Logo } from "./assets/images/logo";

export function App() {
  return (
    <Fragment>
      <Logo />
      <p>Hello Vite + Preact!</p>
      <p>
        <a
          class="link"
          href="https://preactjs.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn Preact
        </a>
      </p>
    </Fragment>
  );
}
