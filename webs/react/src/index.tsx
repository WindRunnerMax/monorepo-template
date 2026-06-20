import { Button } from "@arco-design/web-react";
import { DateTime } from "@workspace/utils";
import { Fragment } from "react";
import ReactDOM from "react-dom";

import styles from "./index.m.scss";

const App = () => {
  const onDarkTheme = () => {
    const theme = document.body.getAttribute("arco-theme");
    if (theme === "dark") {
      document.body.removeAttribute("arco-theme");
    } else {
      document.body.setAttribute("arco-theme", "dark");
    }
  };

  return (
    <Fragment>
      <h1 className={styles.example}>Hello, World! {new DateTime().toISOString()}</h1>
      <Button onClick={onDarkTheme}>Theme</Button>
    </Fragment>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
