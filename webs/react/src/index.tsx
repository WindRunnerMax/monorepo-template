import { DateTime } from "@workspace/utils";
import ReactDOM from "react-dom";

import styles from "./index.m.scss";

const App = () => {
  return <h1 className={styles.example}>Hello, World! {new DateTime().toISOString()}</h1>;
};

ReactDOM.render(<App />, document.getElementById("root"));
